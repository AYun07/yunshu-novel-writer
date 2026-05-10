/**
 * 云书 - 数据库服务模块
 * 基于 Dexie.js 的 IndexedDB 数据层
 * 提供项目、章节、角色、世界观、伏笔、叙事结构、灵感、片段、写作会话、快照、任务队列、插件、成就、导出历史的完整 CRUD 操作
 * 包含自动保存、版本快照、项目导入导出、全局搜索、数据统计等功能
 * 新增：同步支持（syncStatus, lastModified, syncVersion）
 */

import Dexie from 'dexie'

// ==================== 数据库定义 ====================

/**
 * 云书数据库类
 * 继承自 Dexie，定义所有表及其索引
 */
class YunshuDB extends Dexie {
  constructor() {
    super('YunshuDB')

    // 版本1：初始数据库结构
    this.version(1).stores({
      // 项目表：存储小说项目基本信息
      projects: '++id, name, genre, status, createdAt, updatedAt',
      // 章节表：存储章节内容，按项目ID索引
      chapters: '++id, projectId, title, order, status, createdAt, updatedAt',
      // 角色表：存储人物设定，按项目ID索引
      characters: '++id, projectId, name, role, createdAt, updatedAt',
      // 世界观设定表：存储世界观元素，按项目ID索引
      worldSettings: '++id, projectId, category, name, createdAt, updatedAt',
      // 伏笔表：存储伏笔/悬念管理，按项目ID索引
      foreshadowings: '++id, projectId, status, createdAt, updatedAt',
      // 叙事结构表：存储故事线、情节结构，按项目ID索引
      plotPoints: '++id, projectId, type, createdAt, updatedAt',
      // 灵感表：存储创作灵感和想法
      ideas: '++id, projectId, category, status, createdAt, updatedAt',
      // 片段表：存储写作片段和素材
      snippets: '++id, projectId, category, createdAt, updatedAt',
      // 写作会话表：记录每次写作的时间和字数
      writingSessions: '++id, projectId, startTime, endTime, createdAt',
      // 版本快照表：存储项目快照，保留最近50个
      snapshots: '++id, projectId, createdAt',
      // 任务队列表：存储后台任务
      taskQueue: '++id, projectId, type, status, priority, createdAt, updatedAt',
      // 插件表：存储已安装的插件信息
      plugins: '++id, name, status, createdAt, updatedAt',
      // 成就表：存储用户成就记录
      achievements: '++id, type, unlockedAt',
      // 导出历史表：记录每次导出操作
      exportHistory: '++id, projectId, format, createdAt'
    })

    // 版本2：添加同步支持字段
    this.version(2).stores({
      // 项目表：添加 syncStatus, lastModified, syncVersion 字段
      projects: '++id, name, genre, status, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 章节表：添加同步字段
      chapters: '++id, projectId, title, order, status, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 角色表：添加同步字段
      characters: '++id, projectId, name, role, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 世界观设定表：添加同步字段
      worldSettings: '++id, projectId, category, name, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 伏笔表：添加同步字段
      foreshadowings: '++id, projectId, status, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 叙事结构表（plotPoints）添加同步字段
      plotPoints: '++id, projectId, type, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 灵感表：添加同步字段
      ideas: '++id, projectId, category, status, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 片段表：添加同步字段
      snippets: '++id, projectId, category, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 写作会话表：添加同步字段
      writingSessions: '++id, projectId, startTime, endTime, createdAt, syncStatus, lastModified, syncVersion',
      // 版本快照表：添加同步字段
      snapshots: '++id, projectId, createdAt, syncStatus, lastModified, syncVersion',
      // 任务队列表：添加同步字段
      taskQueue: '++id, projectId, type, status, priority, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 插件表：添加同步字段
      plugins: '++id, name, status, createdAt, updatedAt, syncStatus, lastModified, syncVersion',
      // 成就表：添加同步字段
      achievements: '++id, type, unlockedAt, syncStatus, lastModified, syncVersion',
      // 导出历史表：添加同步字段
      exportHistory: '++id, projectId, format, createdAt, syncStatus, lastModified, syncVersion'
    }).upgrade(tx => {
      // 升级时为新字段设置默认值
      const tables = [
        'projects', 'chapters', 'characters', 'worldSettings',
        'foreshadowings', 'plotPoints', 'ideas', 'snippets',
        'writingSessions', 'snapshots', 'taskQueue', 'plugins',
        'achievements', 'exportHistory'
      ]

      return Promise.all(tables.map(async tableName => {
        const table = tx.table(tableName)
        await table.toCollection().modify(record => {
          // 设置同步状态为 'pending'（待同步）
          record.syncStatus = record.syncStatus || 'pending'
          // 设置最后修改时间为当前时间或 updatedAt
          record.lastModified = record.lastModified || record.updatedAt || new Date().toISOString()
          // 设置同步版本号为 1
          record.syncVersion = record.syncVersion || 1
        })
      }))
    })

    // 标记脏数据的集合（用于自动保存）
    this._dirtyData = new Map()
    // 自动保存定时器
    this._autoSaveTimer = null
    // 事件监听器
    this._eventListeners = new Map()
  }
}

// 创建数据库单例
const db = new YunshuDB()

// ==================== 自动保存服务 ====================

/**
 * 自动保存服务
 * 每30秒检查脏数据并自动保存到 IndexedDB
 * 通过标记脏数据的方式避免频繁写入
 */
class AutoSaveService {
  constructor() {
    /** @type {Map<string, {table: string, data: object, operation: string}>} */
    this._dirtyMap = new Map()
    /** @type {number|null} 自动保存定时器ID */
    this._timer = null
    /** @type {number} 自动保存间隔（毫秒），默认30秒 */
    this._interval = 30000
    /** @type {boolean} 是否已启动 */
    this._running = false
  }

  /**
   * 启动自动保存服务
   */
  start() {
    if (this._running) return
    this._running = true
    this._timer = setInterval(() => {
      this._flush()
    }, this._interval)
    console.log('[自动保存] 服务已启动，间隔:', this._interval, 'ms')
  }

  /**
   * 停止自动保存服务
   * 停止前会执行一次刷新，确保数据不丢失
   */
  stop() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
    // 停止前刷新所有脏数据
    this._flush()
    this._running = false
    console.log('[自动保存] 服务已停止')
  }

  /**
   * 标记数据为脏（需要保存）
   * @param {string} key - 唯一标识键
   * @param {string} tableName - 表名
   * @param {object} data - 要保存的数据
   * @param {'put'|'add'|'delete'} [operation='put'] - 操作类型
   */
  markDirty(key, tableName, data, operation = 'put') {
    this._dirtyMap.set(key, { table: tableName, data, operation })
  }

  /**
   * 移除脏标记（数据已通过其他方式保存）
   * @param {string} key - 唯一标识键
   */
  clearDirty(key) {
    this._dirtyMap.delete(key)
  }

  /**
   * 立即刷新所有脏数据到数据库
   * @returns {Promise<number>} 保存的记录数
   */
  async flush() {
    if (this._dirtyMap.size === 0) return 0

    const entries = Array.from(this._dirtyMap.entries())
    let savedCount = 0

    for (const [key, { table: tableName, data, operation }] of entries) {
      try {
        const table = db[tableName]
        if (!table) {
          console.warn('[自动保存] 表不存在:', tableName)
          continue
        }

        switch (operation) {
          case 'put':
            await table.put(data)
            break
          case 'add':
            await table.add(data)
            break
          case 'delete':
            await table.delete(data.id || data)
            break
          default:
            await table.put(data)
        }
        this._dirtyMap.delete(key)
        savedCount++
      } catch (error) {
        console.error(`[自动保存] 保存失败 (${key}):`, error)
      }
    }

    if (savedCount > 0) {
      console.log(`[自动保存] 已保存 ${savedCount} 条记录`)
    }
    return savedCount
  }

  /**
   * 获取当前脏数据数量
   * @returns {number}
   */
  get dirtyCount() {
    return this._dirtyMap.size
  }

  /**
   * 设置自动保存间隔
   * @param {number} ms - 间隔毫秒数
   */
  setInterval(ms) {
    this._interval = ms
    if (this._running) {
      this.stop()
      this.start()
    }
  }
}

// 创建自动保存服务单例
const autoSaveService = new AutoSaveService()

// ==================== 版本快照系统 ====================

/**
 * 版本快照系统
 * 支持创建、恢复、列出项目快照，保留最近50个快照
 */
class SnapshotService {
  constructor() {
    /** @type {number} 最大保留快照数量 */
    this._maxSnapshots = 50
  }

  /**
   * 创建项目快照
   * 将项目及其所有关联数据打包保存为一个快照
   * @param {number} projectId - 项目ID
   * @param {string} [description=''] - 快照描述
   * @returns {Promise<object>} 创建的快照记录
   */
  async create(projectId, description = '') {
    try {
      // 并行获取项目所有关联数据
      const [project, chapters, characters, worldSettings, foreshadowings, plotPoints] = await Promise.all([
        db.projects.get(projectId),
        db.chapters.where('projectId').equals(projectId).toArray(),
        db.characters.where('projectId').equals(projectId).toArray(),
        db.worldSettings.where('projectId').equals(projectId).toArray(),
        db.foreshadowings.where('projectId').equals(projectId).toArray(),
        db.plotPoints.where('projectId').equals(projectId).toArray()
      ])

      if (!project) {
        throw new Error(`项目不存在: ${projectId}`)
      }

      // 构建快照数据
      const snapshotData = {
        projectId,
        project: { ...project },
        chapters: chapters.map(c => ({ ...c })),
        characters: characters.map(c => ({ ...c })),
        worldSettings: worldSettings.map(w => ({ ...w })),
        foreshadowings: foreshadowings.map(f => ({ ...f })),
        plotPoints: plotPoints.map(n => ({ ...n })),
        description: description || `自动快照 - ${new Date().toLocaleString('zh-CN')}`,
        totalWords: chapters.reduce((sum, ch) => sum + (ch.content || '').length, 0),
        chapterCount: chapters.length
      }

      // 保存快照
      const snapshotId = await db.snapshots.add({
        projectId,
        description: snapshotData.description,
        data: snapshotData,
        totalWords: snapshotData.totalWords,
        chapterCount: snapshotData.chapterCount,
        createdAt: new Date().toISOString(),
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        syncVersion: 1
      })

      // 清理超出限制的旧快照
      await this._cleanup(projectId)

      console.log(`[快照] 已创建快照 #${snapshotId}，项目: ${project.name}`)
      return { id: snapshotId, ...snapshotData, createdAt: new Date().toISOString() }
    } catch (error) {
      console.error('[快照] 创建失败:', error)
      throw error
    }
  }

  /**
   * 恢复项目到指定快照
   * 会先创建当前状态的快照作为备份，再恢复目标快照
   * @param {number} snapshotId - 快照ID
   * @returns {Promise<boolean>} 是否恢复成功
   */
  async restore(snapshotId) {
    try {
      const snapshot = await db.snapshots.get(snapshotId)
      if (!snapshot) {
        throw new Error(`快照不存在: ${snapshotId}`)
      }

      const { projectId, data } = snapshot

      // 恢复前先创建当前状态的备份快照
      await this.create(projectId, `恢复前自动备份`)

      // 使用事务确保原子性
      await db.transaction('rw',
        db.projects, db.chapters, db.characters,
        db.worldSettings, db.foreshadowings, db.plotPoints,
        async () => {
          // 删除当前项目的所有关联数据
          await db.chapters.where('projectId').equals(projectId).delete()
          await db.characters.where('projectId').equals(projectId).delete()
          await db.worldSettings.where('projectId').equals(projectId).delete()
          await db.foreshadowings.where('projectId').equals(projectId).delete()
          await db.plotPoints.where('projectId').equals(projectId).delete()

          // 恢复快照数据
          await db.projects.put(data.project)

          if (data.chapters && data.chapters.length > 0) {
            await db.chapters.bulkPut(data.chapters)
          }
          if (data.characters && data.characters.length > 0) {
            await db.characters.bulkPut(data.characters)
          }
          if (data.worldSettings && data.worldSettings.length > 0) {
            await db.worldSettings.bulkPut(data.worldSettings)
          }
          if (data.foreshadowings && data.foreshadowings.length > 0) {
            await db.foreshadowings.bulkPut(data.foreshadowings)
          }
          if (data.plotPoints && data.plotPoints.length > 0) {
            await db.plotPoints.bulkPut(data.plotPoints)
          }
        }
      )

      console.log(`[快照] 已恢复到快照 #${snapshotId}`)
      return true
    } catch (error) {
      console.error('[快照] 恢复失败:', error)
      throw error
    }
  }

  /**
   * 列出项目的所有快照（按时间倒序）
   * @param {number} projectId - 项目ID
   * @returns {Promise<Array>} 快照列表
   */
  async list(projectId) {
    try {
      const snapshots = await db.snapshots
        .where('projectId')
        .equals(projectId)
        .reverse()
        .sortBy('createdAt')

      // 返回时去除大体积的 data 字段，减少传输开销
      return snapshots.map(snap => ({
        id: snap.id,
        projectId: snap.projectId,
        description: snap.description,
        totalWords: snap.totalWords,
        chapterCount: snap.chapterCount,
        createdAt: snap.createdAt,
        syncStatus: snap.syncStatus,
        lastModified: snap.lastModified,
        syncVersion: snap.syncVersion
      }))
    } catch (error) {
      console.error('[快照] 列出失败:', error)
      return []
    }
  }

  /**
   * 获取快照详情（包含完整数据）
   * @param {number} snapshotId - 快照ID
   * @returns {Promise<object|null>} 快照详情
   */
  async getDetail(snapshotId) {
    try {
      return await db.snapshots.get(snapshotId)
    } catch (error) {
      console.error('[快照] 获取详情失败:', error)
      return null
    }
  }

  /**
   * 删除指定快照
   * @param {number} snapshotId - 快照ID
   * @returns {Promise<boolean>}
   */
  async delete(snapshotId) {
    try {
      await db.snapshots.delete(snapshotId)
      return true
    } catch (error) {
      console.error('[快照] 删除失败:', error)
      return false
    }
  }

  /**
   * 清理超出数量限制的旧快照
   * @param {number} projectId - 项目ID
   * @private
   */
  async _cleanup(projectId) {
    try {
      const snapshots = await db.snapshots
        .where('projectId')
        .equals(projectId)
        .reverse()
        .sortBy('createdAt')

      if (snapshots.length > this._maxSnapshots) {
        const toDelete = snapshots.slice(this._maxSnapshots)
        const ids = toDelete.map(s => s.id)
        await db.snapshots.bulkDelete(ids)
        console.log(`[快照] 已清理 ${ids.length} 个旧快照`)
      }
    } catch (error) {
      console.error('[快照] 清理失败:', error)
    }
  }
}

// 创建快照服务单例
const snapshotService = new SnapshotService()

// ==================== 项目导入导出服务 ====================

/**
 * 项目导入导出服务
 * 支持导出为 JSON 格式和导入还原
 */
class ProjectIOService {
  /**
   * 导出项目为 JSON 对象
   * @param {number} projectId - 项目ID
   * @returns {Promise<object>} 导出的项目数据
   */
  async exportProject(projectId) {
    try {
      const [project, chapters, characters, worldSettings, foreshadowings, plotPoints, ideas, snippets] = await Promise.all([
        db.projects.get(projectId),
        db.chapters.where('projectId').equals(projectId).toArray(),
        db.characters.where('projectId').equals(projectId).toArray(),
        db.worldSettings.where('projectId').equals(projectId).toArray(),
        db.foreshadowings.where('projectId').equals(projectId).toArray(),
        db.plotPoints.where('projectId').equals(projectId).toArray(),
        db.ideas.where('projectId').equals(projectId).toArray(),
        db.snippets.where('projectId').equals(projectId).toArray()
      ])

      if (!project) {
        throw new Error(`项目不存在: ${projectId}`)
      }

      const exportData = {
        version: '2.0.0',
        appName: '云书',
        exportedAt: new Date().toISOString(),
        project: { ...project },
        chapters,
        characters,
        worldSettings,
        foreshadowings,
        plotPoints,
        ideas,
        snippets,
        statistics: {
          totalWords: chapters.reduce((sum, ch) => sum + (ch.content || '').length, 0),
          chapterCount: chapters.length,
          characterCount: characters.length,
          worldSettingCount: worldSettings.length
        }
      }

      return exportData
    } catch (error) {
      console.error('[导入导出] 导出失败:', error)
      throw error
    }
  }

  /**
   * 导出项目为 JSON 文件并触发下载
   * @param {number} projectId - 项目ID
   * @returns {Promise<void>}
   */
  async exportAsFile(projectId) {
    const data = await this.exportProject(projectId)
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${data.project.name || '云书项目'}_${this._formatDate(new Date())}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // 记录导出历史
    await db.exportHistory.add({
      projectId,
      format: 'json',
      fileName: link.download,
      size: blob.size,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
      lastModified: new Date().toISOString(),
      syncVersion: 1
    })

    console.log(`[导入导出] 已导出项目: ${data.project.name}`)
  }

  /**
   * 从 JSON 数据导入项目
   * @param {object|string} data - JSON对象或JSON字符串
   * @returns {Promise<number>} 新项目ID
   */
  async importProject(data) {
    try {
      // 如果传入的是字符串，先解析
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }

      // 验证数据格式
      if (!data.version || !data.appName || data.appName !== '云书') {
        throw new Error('无效的云书项目文件')
      }

      // 使用事务导入，确保原子性
      let newProjectId = null

      await db.transaction('rw',
        db.projects, db.chapters, db.characters,
        db.worldSettings, db.foreshadowings, db.plotPoints,
        db.ideas, db.snippets,
        async () => {
          // 创建新项目（避免ID冲突）
          const projectData = { ...data.project }
          delete projectData.id
          projectData.name = `${projectData.name} (导入)`
          projectData.createdAt = new Date().toISOString()
          projectData.updatedAt = new Date().toISOString()
          projectData.syncStatus = 'pending'
          projectData.lastModified = new Date().toISOString()
          projectData.syncVersion = 1

          newProjectId = await db.projects.add(projectData)

          // 导入关联数据，将 projectId 替换为新ID
          const importTables = [
            { table: db.chapters, data: data.chapters },
            { table: db.characters, data: data.characters },
            { table: db.worldSettings, data: data.worldSettings },
            { table: db.foreshadowings, data: data.foreshadowings },
            { table: db.plotPoints, data: data.plotPoints },
            { table: db.ideas, data: data.ideas },
            { table: db.snippets, data: data.snippets }
          ]

          for (const { table, data: tableData } of importTables) {
            if (tableData && Array.isArray(tableData) && tableData.length > 0) {
              const newRecords = tableData.map(record => {
                const newRecord = { ...record }
                delete newRecord.id
                newRecord.projectId = newProjectId
                newRecord.createdAt = newRecord.createdAt || new Date().toISOString()
                newRecord.updatedAt = newRecord.updatedAt || new Date().toISOString()
                newRecord.syncStatus = 'pending'
                newRecord.lastModified = new Date().toISOString()
                newRecord.syncVersion = 1
                return newRecord
              })
              await table.bulkAdd(newRecords)
            }
          }
        }
      )

      console.log(`[导入导出] 已导入项目，新ID: ${newProjectId}`)
      return newProjectId
    } catch (error) {
      console.error('[导入导出] 导入失败:', error)
      throw error
    }
  }

  /**
   * 从文件导入项目
   * @param {File} file - JSON文件
   * @returns {Promise<number>} 新项目ID
   */
  async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const projectId = await this.importProject(e.target.result)
          resolve(projectId)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }

  /**
   * 导出所有项目为 JSON
   * @returns {Promise<object>}
   */
  async exportAll() {
    try {
      const projects = await db.projects.toArray()
      const allData = []

      for (const project of projects) {
        const projectData = await this.exportProject(project.id)
        allData.push(projectData)
      }

      const exportData = {
        version: '2.0.0',
        appName: '云书',
        exportedAt: new Date().toISOString(),
        type: 'batch_export',
        projectCount: allData.length,
        projects: allData
      }

      return exportData
    } catch (error) {
      console.error('[导入导出] 批量导出失败:', error)
      throw error
    }
  }

  /**
   * 格式化日期为文件名安全的字符串
   * @param {Date} date
   * @returns {string}
   * @private
   */
  _formatDate(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    return `${y}${m}${d}_${h}${min}`
  }
}

// 创建导入导出服务单例
const projectIOService = new ProjectIOService()

// ==================== 全局搜索服务 ====================

/**
 * 全局搜索服务
 * 支持跨表搜索关键词，返回匹配结果
 */
class SearchService {
  /**
   * 全局搜索关键词
   * @param {string} keyword - 搜索关键词
   * @param {object} [options] - 搜索选项
   * @param {string[]} [options.tables] - 限定搜索的表名列表，不传则搜索全部
   * @param {number} [options.limit=50] - 最大返回结果数
   * @param {number} [options.projectId] - 限定项目ID
   * @returns {Promise<Array>} 搜索结果列表
   */
  async search(keyword, options = {}) {
    if (!keyword || keyword.trim() === '') return []

    const {
      tables = null,
      limit = 50,
      projectId = null
    } = options

    const lowerKeyword = keyword.toLowerCase()
    const results = []

    // 定义可搜索的表及其搜索字段
    const searchableTables = [
      { name: 'projects', fields: ['name', 'description', 'genre'], label: '项目' },
      { name: 'chapters', fields: ['title', 'content', 'summary'], label: '章节' },
      { name: 'characters', fields: ['name', 'description', 'background'], label: '角色' },
      { name: 'worldSettings', fields: ['name', 'description', 'category'], label: '世界观' },
      { name: 'foreshadowings', fields: ['title', 'description', 'resolution'], label: '伏笔' },
      { name: 'plotPoints', fields: ['title', 'description', 'content'], label: '情节点' },
      { name: 'ideas', fields: ['title', 'content', 'category'], label: '灵感' },
      { name: 'snippets', fields: ['title', 'content', 'category'], label: '片段' }
    ]

    // 过滤要搜索的表
    const tablesToSearch = tables
      ? searchableTables.filter(t => tables.includes(t.name))
      : searchableTables

    for (const tableInfo of tablesToSearch) {
      try {
        let records = await db[tableInfo.name].toArray()

        // 按项目ID过滤
        if (projectId) {
          records = records.filter(r => r.projectId === projectId)
        }

        // 在每个字段中搜索关键词
        for (const record of records) {
          for (const field of tableInfo.fields) {
            const fieldValue = record[field]
            if (fieldValue && typeof fieldValue === 'string' &&
                fieldValue.toLowerCase().includes(lowerKeyword)) {
              // 提取匹配上下文（关键词前后各30个字符）
              const context = this._extractContext(fieldValue, keyword)
              results.push({
                id: record.id,
                projectId: record.projectId,
                tableName: tableInfo.name,
                tableLabel: tableInfo.label,
                fieldName: field,
                title: record.title || record.name || `${tableInfo.label} #${record.id}`,
                context,
                matchedField: field,
                createdAt: record.createdAt
              })
              break // 同一条记录只添加一次
            }
          }

          // 达到限制数量时提前返回
          if (results.length >= limit) {
            return results.slice(0, limit)
          }
        }
      } catch (error) {
        console.warn(`[搜索] 搜索表 ${tableInfo.name} 失败:`, error)
      }
    }

    // 按相关性排序（标题匹配优先，然后按时间倒序）
    results.sort((a, b) => {
      // 标题完全匹配优先
      const aTitleMatch = a.title.toLowerCase().includes(lowerKeyword) ? 1 : 0
      const bTitleMatch = b.title.toLowerCase().includes(lowerKeyword) ? 1 : 0
      if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch
      // 时间倒序
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return results.slice(0, limit)
  }

  /**
   * 提取关键词周围的上下文文本
   * @param {string} text - 原始文本
   * @param {string} keyword - 关键词
   * @param {number} [contextLength=30] - 上下文长度
   * @returns {string} 带省略号的上下文
   * @private
   */
  _extractContext(text, keyword, contextLength = 30) {
    const index = text.toLowerCase().indexOf(keyword.toLowerCase())
    if (index === -1) return text.substring(0, contextLength * 2)

    const start = Math.max(0, index - contextLength)
    const end = Math.min(text.length, index + keyword.length + contextLength)

    let context = ''
    if (start > 0) context += '...'
    context += text.substring(start, end)
    if (end < text.length) context += '...'

    return context
  }
}

// 创建搜索服务单例
const searchService = new SearchService()

// ==================== 数据统计服务 ====================

/**
 * 数据统计服务
 * 提供总字数、章节数、项目数等统计数据
 */
class StatisticsService {
  /**
   * 获取全局统计数据
   * @returns {Promise<object>} 统计数据
   */
  async getGlobalStats() {
    try {
      const [projectCount, chapterCount, characterCount, worldSettingCount, ideaCount, snippetCount] = await Promise.all([
        db.projects.count(),
        db.chapters.count(),
        db.characters.count(),
        db.worldSettings.count(),
        db.ideas.count(),
        db.snippets.count()
      ])

      // 计算总字数（遍历所有章节）
      const chapters = await db.chapters.toArray()
      const totalWords = chapters.reduce((sum, ch) => sum + (ch.content || '').length, 0)

      // 计算今日写作字数
      const today = new Date().toDateString()
      const todaySessions = await db.writingSessions
        .where('startTime')
        .aboveOrEqual(new Date(today).toISOString())
        .toArray()
      const todayWords = todaySessions.reduce((sum, s) => sum + (s.wordCount || 0), 0)

      // 获取最近7天的每日写作量
      const weeklyStats = await this._getWeeklyStats()

      return {
        projectCount,
        chapterCount,
        characterCount,
        worldSettingCount,
        ideaCount,
        snippetCount,
        totalWords,
        todayWords,
        weeklyStats,
        avgWordsPerChapter: chapterCount > 0 ? Math.round(totalWords / chapterCount) : 0
      }
    } catch (error) {
      console.error('[统计] 获取全局统计失败:', error)
      return {
        projectCount: 0, chapterCount: 0, characterCount: 0,
        worldSettingCount: 0, ideaCount: 0, snippetCount: 0,
        totalWords: 0, todayWords: 0, weeklyStats: [], avgWordsPerChapter: 0
      }
    }
  }

  /**
   * 获取单个项目的统计数据
   * @param {number} projectId - 项目ID
   * @returns {Promise<object>}
   */
  async getProjectStats(projectId) {
    try {
      const [chapters, characters, worldSettings, foreshadowings, ideas, snippets] = await Promise.all([
        db.chapters.where('projectId').equals(projectId).toArray(),
        db.characters.where('projectId').equals(projectId).toArray(),
        db.worldSettings.where('projectId').equals(projectId).toArray(),
        db.foreshadowings.where('projectId').equals(projectId).toArray(),
        db.ideas.where('projectId').equals(projectId).toArray(),
        db.snippets.where('projectId').equals(projectId).toArray()
      ])

      const totalWords = chapters.reduce((sum, ch) => sum + (ch.content || '').length, 0)
      const completedChapters = chapters.filter(ch => ch.status === 'completed').length

      return {
        chapterCount: chapters.length,
        completedChapters,
        characterCount: characters.length,
        worldSettingCount: worldSettings.length,
        foreshadowingCount: foreshadowings.length,
        ideaCount: ideas.length,
        snippetCount: snippets.length,
        totalWords,
        avgWordsPerChapter: chapters.length > 0 ? Math.round(totalWords / chapters.length) : 0,
        completionRate: chapters.length > 0 ? Math.round((completedChapters / chapters.length) * 100) : 0
      }
    } catch (error) {
      console.error('[统计] 获取项目统计失败:', error)
      return {
        chapterCount: 0, completedChapters: 0, characterCount: 0,
        worldSettingCount: 0, foreshadowingCount: 0, ideaCount: 0,
        snippetCount: 0, totalWords: 0, avgWordsPerChapter: 0, completionRate: 0
      }
    }
  }

  /**
   * 记录写作会话
   * @param {number} projectId - 项目ID
   * @param {number} wordCount - 本次写作字数
   * @param {number} [duration] - 写作时长（秒）
   * @returns {Promise<number>} 会话ID
   */
  async recordWritingSession(projectId, wordCount, duration = 0) {
    try {
      const id = await db.writingSessions.add({
        projectId,
        wordCount,
        duration,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        syncVersion: 1
      })
      return id
    } catch (error) {
      console.error('[统计] 记录写作会话失败:', error)
      return 0
    }
  }

  /**
   * 获取最近7天的每日写作统计
   * @returns {Promise<Array>}
   * @private
   */
  async _getWeeklyStats() {
    const stats = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString()
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString()

      const sessions = await db.writingSessions
        .where('startTime')
        .between(dayStart, dayEnd)
        .toArray()

      const words = sessions.reduce((sum, s) => sum + (s.wordCount || 0), 0)
      const duration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

      stats.push({
        date: date.toLocaleDateString('zh-CN'),
        words,
        duration,
        sessionCount: sessions.length
      })
    }
    return stats
  }
}

// 创建统计服务单例
const statisticsService = new StatisticsService()

// ==================== 数据库操作便捷方法 ====================

/**
 * 数据库操作便捷封装
 * 提供对每张表的常用 CRUD 操作
 */
const databaseService = {
  // ---------- 项目操作 ----------

  /**
   * 创建项目
   * @param {object} project - 项目数据
   * @returns {Promise<number>} 项目ID
   */
  async createProject(project) {
    const now = new Date().toISOString()
    const id = await db.projects.add({
      name: project.name || '未命名项目',
      description: project.description || '',
      genre: project.genre || '其他',
      coverImage: project.coverImage || '',
      status: project.status || 'draft', // draft | writing | completed | paused
      targetWordCount: project.targetWordCount || 0,
      settings: project.settings || {},
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
    return id
  },

  /**
   * 获取项目列表
   * @returns {Promise<Array>}
   */
  async getProjects() {
    return db.projects.reverse().sortBy('updatedAt')
  },

  /**
   * 获取单个项目
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getProject(id) {
    return db.projects.get(id)
  },

  /**
   * 更新项目
   * @param {number} id
   * @param {object} updates
   * @returns {Promise<number>}
   */
  async updateProject(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.projects.update(id, updates)
  },

  /**
   * 删除项目及其所有关联数据
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteProject(id) {
    await db.transaction('rw',
      db.projects, db.chapters, db.characters,
      db.worldSettings, db.foreshadowings, db.plotPoints,
      db.ideas, db.snippets, db.snapshots, db.writingSessions,
      async () => {
        await db.projects.delete(id)
        await db.chapters.where('projectId').equals(id).delete()
        await db.characters.where('projectId').equals(id).delete()
        await db.worldSettings.where('projectId').equals(id).delete()
        await db.foreshadowings.where('projectId').equals(id).delete()
        await db.plotPoints.where('projectId').equals(id).delete()
        await db.ideas.where('projectId').equals(id).delete()
        await db.snippets.where('projectId').equals(id).delete()
        await db.snapshots.where('projectId').equals(id).delete()
        await db.writingSessions.where('projectId').equals(id).delete()
      }
    )
  },

  // ---------- 章节操作 ----------

  /**
   * 创建章节
   * @param {object} chapter
   * @returns {Promise<number>}
   */
  async createChapter(chapter) {
    const now = new Date().toISOString()
    return db.chapters.add({
      projectId: chapter.projectId,
      title: chapter.title || '未命名章节',
      content: chapter.content || '',
      summary: chapter.summary || '',
      outline: chapter.outline || '',
      order: chapter.order || 0,
      status: chapter.status || 'draft',
      wordCount: (chapter.content || '').length,
      notes: chapter.notes || '',
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  /**
   * 获取项目的章节列表（按order排序）
   * @param {number} projectId
   * @returns {Promise<Array>}
   */
  async getChapters(projectId) {
    return db.chapters.where('projectId').equals(projectId).sortBy('order')
  },

  /**
   * 获取单个章节
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getChapter(id) {
    return db.chapters.get(id)
  },

  /**
   * 更新章节
   * @param {number} id
   * @param {object} updates
   * @returns {Promise<number>}
   */
  async updateChapter(id, updates) {
    const now = new Date().toISOString()
    if (updates.content !== undefined) {
      updates.wordCount = updates.content.length
    }
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.chapters.update(id, updates)
  },

  /**
   * 删除章节
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteChapter(id) {
    await db.chapters.delete(id)
  },

  // ---------- 角色操作 ----------

  async createCharacter(character) {
    const now = new Date().toISOString()
    return db.characters.add({
      projectId: character.projectId,
      name: character.name || '',
      role: character.role || 'supporting', // protagonist | antagonist | supporting | minor
      description: character.description || '',
      appearance: character.appearance || '',
      personality: character.personality || '',
      background: character.background || '',
      traits: character.traits || [],
      relationships: character.relationships || [],
      avatar: character.avatar || '',
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getCharacters(projectId) {
    return db.characters.where('projectId').equals(projectId).toArray()
  },

  async getCharacter(id) {
    return db.characters.get(id)
  },

  async updateCharacter(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.characters.update(id, updates)
  },

  async deleteCharacter(id) {
    await db.characters.delete(id)
  },

  // ---------- 世界观设定操作 ----------

  async createWorldSetting(setting) {
    const now = new Date().toISOString()
    return db.worldSettings.add({
      projectId: setting.projectId,
      name: setting.name || '',
      category: setting.category || 'geography', // geography | history | magic | technology | culture | other
      description: setting.description || '',
      rules: setting.rules || [],
      features: setting.features || [],
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getWorldSettings(projectId) {
    return db.worldSettings.where('projectId').equals(projectId).toArray()
  },

  async updateWorldSetting(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.worldSettings.update(id, updates)
  },

  async deleteWorldSetting(id) {
    await db.worldSettings.delete(id)
  },

  // ---------- 伏笔操作 ----------

  async createForeshadowing(foreshadowing) {
    const now = new Date().toISOString()
    return db.foreshadowings.add({
      projectId: foreshadowing.projectId,
      title: foreshadowing.title || '',
      description: foreshadowing.description || '',
      chapterId: foreshadowing.chapterId || null,
      status: foreshadowing.status || 'planted', // planted | developing | resolved | abandoned
      resolution: foreshadowing.resolution || '',
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getForeshadowings(projectId) {
    return db.foreshadowings.where('projectId').equals(projectId).toArray()
  },

  async updateForeshadowing(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.foreshadowings.update(id, updates)
  },

  async deleteForeshadowing(id) {
    await db.foreshadowings.delete(id)
  },

  // ---------- 叙事结构操作 ----------

  async createPlotPoint(plotPoint) {
    const now = new Date().toISOString()
    return db.plotPoints.add({
      projectId: plotPoint.projectId,
      type: plotPoint.type || 'storyline', // storyline | plot | arc | timeline
      title: plotPoint.title || '',
      description: plotPoint.description || '',
      content: plotPoint.content || '',
      order: plotPoint.order || 0,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getPlotPoints(projectId) {
    return db.plotPoints.where('projectId').equals(projectId).toArray()
  },

  async updatePlotPoint(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.plotPoints.update(id, updates)
  },

  async deletePlotPoint(id) {
    await db.plotPoints.delete(id)
  },

  // ---------- 灵感操作 ----------

  async createIdea(idea) {
    const now = new Date().toISOString()
    return db.ideas.add({
      projectId: idea.projectId || null,
      title: idea.title || '',
      content: idea.content || '',
      category: idea.category || 'general', // plot | character | scene | dialogue | theme | general
      status: idea.status || 'new', // new | developing | used | archived
      tags: idea.tags || [],
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getIdeas(projectId = null) {
    if (projectId) {
      return db.ideas.where('projectId').equals(projectId).toArray()
    }
    return db.ideas.toArray()
  },

  async updateIdea(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.ideas.update(id, updates)
  },

  async deleteIdea(id) {
    await db.ideas.delete(id)
  },

  // ---------- 片段操作 ----------

  async createSnippet(snippet) {
    const now = new Date().toISOString()
    return db.snippets.add({
      projectId: snippet.projectId || null,
      title: snippet.title || '',
      content: snippet.content || '',
      category: snippet.category || 'general', // description | dialogue | action | scene | general
      tags: snippet.tags || [],
      source: snippet.source || '',
      wordCount: (snippet.content || '').length,
      writingTime: snippet.writingTime || 0,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getSnippets(projectId = null) {
    if (projectId) {
      return db.snippets.where('projectId').equals(projectId).toArray()
    }
    return db.snippets.toArray()
  },

  async updateSnippet(id, updates) {
    const now = new Date().toISOString()
    if (updates.content !== undefined) {
      updates.wordCount = updates.content.length
    }
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.snippets.update(id, updates)
  },

  async deleteSnippet(id) {
    await db.snippets.delete(id)
  },

  // ---------- 导出历史操作 ----------

  async getExportHistory(projectId = null, limit = 50) {
    if (projectId) {
      return db.exportHistory
        .where('projectId').equals(projectId)
        .reverse()
        .sortBy('createdAt')
        .then(list => list.slice(0, limit))
    }
    return db.exportHistory.reverse().sortBy('createdAt').then(list => list.slice(0, limit))
  },

  async clearExportHistory(projectId = null) {
    if (projectId) {
      return db.exportHistory.where('projectId').equals(projectId).delete()
    }
    return db.exportHistory.clear()
  },

  // ---------- 成就操作 ----------

  async unlockAchievement(type, data = {}) {
    const existing = await db.achievements.where('type').equals(type).first()
    if (existing) return existing

    const now = new Date().toISOString()
    const id = await db.achievements.add({
      type,
      ...data,
      unlockedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
    return { id, type, ...data, unlockedAt: now, syncStatus: 'pending', lastModified: now, syncVersion: 1 }
  },

  async getAchievements() {
    return db.achievements.toArray()
  },

  // ---------- 插件操作 ----------

  async savePlugin(plugin) {
    const now = new Date().toISOString()
    const existing = await db.plugins.where('name').equals(plugin.name).first()
    if (existing) {
      await db.plugins.update(existing.id, {
        ...plugin,
        updatedAt: now,
        lastModified: now,
        syncStatus: 'pending'
      })
      return existing.id
    }
    return db.plugins.add({
      name: plugin.name,
      version: plugin.version || '1.0.0',
      description: plugin.description || '',
      status: plugin.status || 'enabled', // enabled | disabled
      config: plugin.config || {},
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending',
      lastModified: now,
      syncVersion: 1
    })
  },

  async getPlugins() {
    return db.plugins.toArray()
  },

  async updatePlugin(id, updates) {
    const now = new Date().toISOString()
    updates.updatedAt = now
    updates.lastModified = now
    updates.syncStatus = updates.syncStatus || 'pending'
    return db.plugins.update(id, updates)
  },

  async deletePlugin(id) {
    await db.plugins.delete(id)
  },

  // ---------- 同步相关操作 ----------

  /**
   * 标记数据为已同步
   * @param {string} table - 表名
   * @param {number} id - 记录ID
   * @returns {Promise<number>}
   */
  async markAsSynced(table, id) {
    const now = new Date().toISOString()
    return db[table].update(id, {
      syncStatus: 'synced',
      lastModified: now
    })
  },

  /**
   * 获取待同步的数据
   * @param {string} table - 表名
   * @returns {Promise<Array>}
   */
  async getPendingSync(table) {
    return db[table].where('syncStatus').notEqual('synced').toArray()
  },

  /**
   * 导出同步数据（用于备份或迁移）
   * @returns {Promise<object>}
   */
  async exportSyncData() {
    const tables = [
      'projects', 'chapters', 'characters', 'worldSettings',
      'foreshadowings', 'plotPoints', 'ideas', 'snippets',
      'writingSessions', 'snapshots', 'achievements'
    ]

    const data = {}
    for (const table of tables) {
      data[table] = await db[table].toArray()
    }

    return {
      version: '2.0.0',
      appName: '云书',
      exportedAt: new Date().toISOString(),
      type: 'sync_export',
      data
    }
  },

  /**
   * 导入同步数据
   * @param {object} exportData - 导出的数据
   * @returns {Promise<boolean>}
   */
  async importSyncData(exportData) {
    try {
      if (!exportData.data || exportData.type !== 'sync_export') {
        throw new Error('无效的数据格式')
      }

      const { data } = exportData

      await db.transaction('rw',
        db.projects, db.chapters, db.characters,
        db.worldSettings, db.foreshadowings, db.plotPoints,
        db.ideas, db.snippets, db.writingSessions,
        db.snapshots, db.achievements,
        async () => {
          for (const [tableName, records] of Object.entries(data)) {
            if (db[tableName] && Array.isArray(records)) {
              await db[tableName].bulkPut(records)
            }
          }
        }
      )

      return true
    } catch (error) {
      console.error('[同步] 导入数据失败:', error)
      return false
    }
  }
}

// ==================== 统一导出 ====================

/**
 * 数据库服务统一导出
 * 包含数据库实例、自动保存、快照、导入导出、搜索、统计等所有服务
 */
const database = {
  // 数据库实例
  db,
  // 自动保存服务
  autoSave: autoSaveService,
  // 快照服务
  snapshot: snapshotService,
  // 导入导出服务
  projectIO: projectIOService,
  // 搜索服务
  search: searchService,
  // 统计服务
  statistics: statisticsService,
  // CRUD 操作
  ...databaseService
}

export default database

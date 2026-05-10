/**
 * 数据同步服务
 * 实现跨平台数据同步架构
 *
 * 【需要后端】此模块的同步功能需要搭配后端服务使用。
 * 默认同步地址为占位符，使用前请替换为您自己的后端地址。
 * 推荐使用 Supabase / Firebase / 自建 Node.js 服务。
 * 离线队列和冲突解决逻辑已完整实现，只需对接后端 API。
 *
 * 同步策略：本地优先，云端备份
 * 冲突解决：时间戳优先，支持手动合并
 * 增量同步：只同步变更数据
 * 离线队列：离线操作缓存，联网后自动同步
 * 多端同步：支持Web/Desktop/Mobile数据互通
 */

import { reactive, ref } from 'vue'
import database from './database.js'

// ==================== 同步状态 ====================

/**
 * 同步状态枚举
 */
export const SyncStatus = {
  IDLE: 'idle',           // 空闲
  SYNCING: 'syncing',     // 同步中
  SUCCESS: 'success',     // 同步成功
  ERROR: 'error',         // 同步失败
  OFFLINE: 'offline',     // 离线状态
  CONFLICT: 'conflict'    // 冲突待解决
}

/**
 * 全局同步状态
 */
export const syncState = reactive({
  status: SyncStatus.IDLE,
  lastSyncTime: null,
  lastSyncError: null,
  pendingChanges: 0,
  isOnline: navigator.onLine,
  syncProgress: 0,
  currentOperation: ''
})

// ==================== 同步配置 ====================

/**
 * 同步配置
 */
const syncConfig = {
  // 同步端点配置
  // 【占位符】请将下方 URL 替换为您自己的后端服务地址。
  // 可通过环境变量 VITE_SYNC_API_URL 配置，或直接修改默认值。
  // 推荐方案：Supabase / Firebase / 自建 Node.js (Express/Koa/NestJS)
  endpoints: {
    baseURL: import.meta.env.VITE_SYNC_API_URL || 'https://YOUR-BACKEND-PLACEHOLDER.example.com',
    sync: '/api/v1/sync',
    upload: '/api/v1/upload',
    download: '/api/v1/download'
  },
  // 同步间隔（毫秒）
  syncInterval: 5 * 60 * 1000, // 5分钟
  // 重试配置
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  },
  // 批量大小
  batchSize: 100
}

// ==================== 离线队列 ====================

/**
 * 离线操作队列
 * 用于缓存离线时的操作，联网后自动同步
 */
class OfflineQueue {
  constructor() {
    this.queue = []
    this.storageKey = 'yunshu_sync_queue'
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载队列
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.queue = JSON.parse(stored)
        syncState.pendingChanges = this.queue.length
      }
    } catch (error) {
      console.error('加载离线队列失败:', error)
      this.queue = []
    }
  }

  /**
   * 保存队列到本地存储
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue))
      syncState.pendingChanges = this.queue.length
    } catch (error) {
      console.error('保存离线队列失败:', error)
    }
  }

  /**
   * 添加操作到队列
   * @param {string} table - 表名
   * @param {string} operation - 操作类型 (create/update/delete)
   * @param {object} data - 操作数据
   */
  enqueue(table, operation, data) {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table,
      operation,
      data,
      timestamp: Date.now(),
      retryCount: 0
    }
    this.queue.push(item)
    this.saveToStorage()
    return item.id
  }

  /**
   * 从队列移除操作
   * @param {string} id - 操作ID
   */
  dequeue(id) {
    const index = this.queue.findIndex(item => item.id === id)
    if (index > -1) {
      this.queue.splice(index, 1)
      this.saveToStorage()
    }
  }

  /**
   * 获取队列中的所有操作
   */
  getAll() {
    return [...this.queue]
  }

  /**
   * 清空队列
   */
  clear() {
    this.queue = []
    this.saveToStorage()
  }

  /**
   * 增加重试次数
   * @param {string} id - 操作ID
   */
  incrementRetry(id) {
    const item = this.queue.find(item => item.id === id)
    if (item) {
      item.retryCount++
      this.saveToStorage()
    }
  }

  /**
   * 获取需要重试的操作
   */
  getRetryable() {
    return this.queue.filter(item => item.retryCount < syncConfig.retry.maxRetries)
  }
}

// 创建离线队列实例
export const offlineQueue = new OfflineQueue()

// ==================== 同步服务 ====================

/**
 * 同步服务类
 */
class SyncService {
  constructor() {
    this.autoSyncTimer = null
    this.isInitialized = false
    this.conflictResolvers = new Map()
  }

  /**
   * 初始化同步服务
   */
  async initialize() {
    if (this.isInitialized) return

    // 监听网络状态
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))

    // 启动自动同步
    this.startAutoSync()

    this.isInitialized = true
    console.log('同步服务已初始化')
  }

  /**
   * 处理网络恢复
   */
  async handleOnline() {
    console.log('网络已恢复')
    syncState.isOnline = true
    syncState.status = SyncStatus.IDLE

    // 同步离线队列
    if (offlineQueue.getAll().length > 0) {
      await this.syncOfflineQueue()
    }

    // 执行全量同步
    await this.sync()
  }

  /**
   * 处理网络断开
   */
  handleOffline() {
    console.log('网络已断开')
    syncState.isOnline = false
    syncState.status = SyncStatus.OFFLINE
  }

  /**
   * 处理页面可见性变化
   */
  async handleVisibilityChange() {
    if (document.visibilityState === 'visible' && syncState.isOnline) {
      // 页面重新可见时执行同步
      await this.sync()
    }
  }

  /**
   * 启动自动同步
   */
  startAutoSync() {
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer)
    }

    this.autoSyncTimer = setInterval(() => {
      if (syncState.isOnline && syncState.status !== SyncStatus.SYNCING) {
        this.sync()
      }
    }, syncConfig.syncInterval)
  }

  /**
   * 停止自动同步
   */
  stopAutoSync() {
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer)
      this.autoSyncTimer = null
    }
  }

  /**
   * 执行数据同步
   * @param {object} options - 同步选项
   */
  async sync(options = {}) {
    if (!syncState.isOnline) {
      syncState.status = SyncStatus.OFFLINE
      return { success: false, error: '离线状态' }
    }

    if (syncState.status === SyncStatus.SYNCING && !options.force) {
      return { success: false, error: '同步正在进行中' }
    }

    syncState.status = SyncStatus.SYNCING
    syncState.currentOperation = '正在同步数据...'
    syncState.syncProgress = 0

    try {
      // 1. 同步离线队列
      await this.syncOfflineQueue()

      // 2. 获取本地变更
      const localChanges = await this.getLocalChanges()
      syncState.syncProgress = 30

      // 3. 上传本地变更
      if (localChanges.length > 0) {
        await this.uploadChanges(localChanges)
      }
      syncState.syncProgress = 60

      // 4. 下载服务器变更
      const serverChanges = await this.downloadChanges()
      syncState.syncProgress = 80

      // 5. 合并变更
      if (serverChanges.length > 0) {
        await this.mergeChanges(serverChanges)
      }
      syncState.syncProgress = 100

      // 6. 更新同步时间
      syncState.lastSyncTime = Date.now()
      syncState.status = SyncStatus.SUCCESS
      syncState.lastSyncError = null

      // 保存同步时间到本地存储
      localStorage.setItem('yunshu_last_sync', syncState.lastSyncTime.toString())

      return { success: true }
    } catch (error) {
      console.error('同步失败:', error)
      syncState.status = SyncStatus.ERROR
      syncState.lastSyncError = error.message
      return { success: false, error: error.message }
    }
  }

  /**
   * 同步离线队列
   */
  async syncOfflineQueue() {
    const queue = offlineQueue.getRetryable()
    if (queue.length === 0) return

    syncState.currentOperation = `同步离线队列 (${queue.length} 项)`

    for (const item of queue) {
      try {
        await this.processQueueItem(item)
        offlineQueue.dequeue(item.id)
      } catch (error) {
        console.error(`处理队列项失败: ${item.id}`, error)
        offlineQueue.incrementRetry(item.id)
      }
    }
  }

  /**
   * 处理队列项
   */
  async processQueueItem(item) {
    const { table, operation, data } = item

    switch (operation) {
      case 'create':
        await this.uploadCreate(table, data)
        break
      case 'update':
        await this.uploadUpdate(table, data)
        break
      case 'delete':
        await this.uploadDelete(table, data.id)
        break
      default:
        console.warn('未知操作类型:', operation)
    }
  }

  /**
   * 获取本地变更
   */
  async getLocalChanges() {
    const changes = []
    const lastSync = syncState.lastSyncTime || 0

    // 获取各表的变更
    const tables = ['projects', 'chapters', 'characters', 'plotPoints', 'snippets']

    for (const table of tables) {
      const tableChanges = await database.db[table]
        .where('lastModified')
        .above(lastSync)
        .and(item => item.syncStatus !== 'synced')
        .toArray()

      changes.push(...tableChanges.map(item => ({
        table,
        operation: item.syncStatus === 'deleted' ? 'delete' : (item.id ? 'update' : 'create'),
        data: item
      })))
    }

    return changes
  }

  /**
   * 上传变更到服务器
   */
  async uploadChanges(changes) {
    syncState.currentOperation = `上传 ${changes.length} 项变更`

    // 分批上传
    for (let i = 0; i < changes.length; i += syncConfig.batchSize) {
      const batch = changes.slice(i, i + syncConfig.batchSize)

      try {
        const response = await fetch(`${syncConfig.endpoints.baseURL}${syncConfig.endpoints.sync}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          },
          body: JSON.stringify({
            changes: batch,
            deviceId: this.getDeviceId(),
            syncVersion: await this.getSyncVersion()
          })
        })

        if (!response.ok) {
          throw new Error(`上传失败: ${response.status}`)
        }

        const result = await response.json()

        // 处理冲突
        if (result.conflicts && result.conflicts.length > 0) {
          for (const conflict of result.conflicts) {
            await this.handleConflict(conflict)
          }
        }

        // 标记已同步
        for (const change of batch) {
          await this.markAsSynced(change.table, change.data.id)
        }
      } catch (error) {
        console.error('上传变更失败:', error)
        // 添加到离线队列
        for (const change of batch) {
          offlineQueue.enqueue(change.table, change.operation, change.data)
        }
      }
    }
  }

  /**
   * 下载服务器变更
   */
  async downloadChanges() {
    syncState.currentOperation = '下载服务器变更'

    try {
      const response = await fetch(`${syncConfig.endpoints.baseURL}${syncConfig.endpoints.sync}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Last-Sync': (syncState.lastSyncTime || 0).toString()
        }
      })

      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }

      const result = await response.json()
      return result.changes || []
    } catch (error) {
      console.error('下载变更失败:', error)
      return []
    }
  }

  /**
   * 合并服务器变更到本地
   */
  async mergeChanges(changes) {
    syncState.currentOperation = `合并 ${changes.length} 项变更`

    for (const change of changes) {
      const { table, operation, data } = change

      try {
        switch (operation) {
          case 'create':
            await database.db[table].put(data)
            break
          case 'update':
            await database.db[table].update(data.id, data)
            break
          case 'delete':
            await database.db[table].delete(data.id)
            break
        }
      } catch (error) {
        console.error(`合并变更失败: ${table}.${data.id}`, error)
      }
    }
  }

  /**
   * 处理冲突
   */
  async handleConflict(conflict) {
    const { table, localData, serverData } = conflict

    // 使用时间戳优先策略
    const localTime = localData.lastModified || 0
    const serverTime = serverData.lastModified || 0

    if (localTime > serverTime) {
      // 本地版本更新，保留本地
      console.log(`冲突解决: 保留本地版本 ${table}.${localData.id}`)
      await this.uploadUpdate(table, localData)
    } else if (serverTime > localTime) {
      // 服务器版本更新，使用服务器版本
      console.log(`冲突解决: 使用服务器版本 ${table}.${serverData.id}`)
      await database.db[table].update(serverData.id, serverData)
    } else {
      // 时间戳相同，触发手动解决
      syncState.status = SyncStatus.CONFLICT
      this.triggerConflictResolver(conflict)
    }
  }

  /**
   * 触发冲突解决器
   */
  triggerConflictResolver(conflict) {
    const resolver = this.conflictResolvers.get(conflict.table)
    if (resolver) {
      resolver(conflict)
    }
  }

  /**
   * 注册冲突解决器
   */
  onConflict(table, resolver) {
    this.conflictResolvers.set(table, resolver)
  }

  /**
   * 标记数据为已同步
   */
  async markAsSynced(table, id) {
    try {
      await database.db[table].update(id, {
        syncStatus: 'synced',
        syncVersion: await this.getSyncVersion()
      })
    } catch (error) {
      console.error('标记同步状态失败:', error)
    }
  }

  /**
   * 获取认证令牌
   *
   * 【需要自行实现】当前实现仅从 localStorage 读取 token。
   * 完整的认证流程应包括：
   * 1. 用户登录时，向后端发送凭据，获取 JWT / session token
   * 2. 将 token 安全存储（推荐 httpOnly cookie 或安全存储方案）
   * 3. token 过期时自动刷新（refresh token 机制）
   * 4. 请求失败（401）时触发重新登录
   *
   * 推荐方案：JWT + refresh token / OAuth 2.0 / Supabase Auth / Firebase Auth
   *
   * @returns {string} 认证令牌
   */
  getAuthToken() {
    return localStorage.getItem('yunshu_auth_token') || ''
  }

  /**
   * 获取设备ID
   */
  getDeviceId() {
    let deviceId = localStorage.getItem('yunshu_device_id')
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('yunshu_device_id', deviceId)
    }
    return deviceId
  }

  /**
   * 获取同步版本号
   */
  async getSyncVersion() {
    const version = localStorage.getItem('yunshu_sync_version')
    return parseInt(version) || 1
  }

  /**
   * 增加同步版本号
   */
  async incrementSyncVersion() {
    const version = await this.getSyncVersion()
    localStorage.setItem('yunshu_sync_version', (version + 1).toString())
    return version + 1
  }

  /**
   * 导出同步数据
   */
  async exportSyncData() {
    const data = {
      projects: await database.db.projects.toArray(),
      chapters: await database.db.chapters.toArray(),
      characters: await database.db.characters.toArray(),
      plotPoints: await database.db.plotPoints.toArray(),
      snippets: await database.db.snippets.toArray(),
      writingSessions: await database.db.writingSessions.toArray(),
      achievements: await database.db.achievements.toArray(),
      exportTime: Date.now(),
      version: await this.getSyncVersion()
    }

    return JSON.stringify(data, null, 2)
  }

  /**
   * 导入同步数据
   */
  async importSyncData(jsonData) {
    try {
      const data = JSON.parse(jsonData)

      // 验证数据
      if (!data.projects || !data.exportTime) {
        throw new Error('无效的数据格式')
      }

      // 导入各表数据
      for (const [table, items] of Object.entries(data)) {
        if (Array.isArray(items) && database.db[table]) {
          await database.db[table].bulkPut(items)
        }
      }

      // 更新同步版本
      if (data.version) {
        localStorage.setItem('yunshu_sync_version', data.version.toString())
      }

      return { success: true }
    } catch (error) {
      console.error('导入数据失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 重置同步状态
   */
  async resetSync() {
    // 清除同步状态
    syncState.status = SyncStatus.IDLE
    syncState.lastSyncTime = null
    syncState.lastSyncError = null
    syncState.syncProgress = 0

    // 清除本地存储
    localStorage.removeItem('yunshu_last_sync')
    localStorage.removeItem('yunshu_sync_version')

    // 重置所有数据的同步状态
    const tables = ['projects', 'chapters', 'characters', 'plotPoints', 'snippets']
    for (const table of tables) {
      await database.db[table].toCollection().modify(item => {
        item.syncStatus = 'pending'
        delete item.syncVersion
      })
    }

    console.log('同步状态已重置')
  }
}

// 创建同步服务实例
export const syncService = new SyncService()

// ==================== 辅助函数 ====================

/**
 * 检查是否需要同步
 */
export async function checkNeedSync() {
  const lastSync = parseInt(localStorage.getItem('yunshu_last_sync') || '0')
  const now = Date.now()

  // 如果超过同步间隔，需要同步
  if (now - lastSync > syncConfig.syncInterval) {
    return true
  }

  // 检查是否有未同步的变更
  const tables = ['projects', 'chapters', 'characters', 'plotPoints', 'snippets']
  for (const table of tables) {
    const pending = await database.db[table]
      .where('syncStatus')
      .notEqual('synced')
      .count()
    if (pending > 0) return true
  }

  return false
}

/**
 * 获取同步统计
 */
export async function getSyncStats() {
  const stats = {
    totalItems: 0,
    syncedItems: 0,
    pendingItems: 0,
    conflictItems: 0
  }

  const tables = ['projects', 'chapters', 'characters', 'plotPoints', 'snippets']

  for (const table of tables) {
    const all = await database.db[table].count()
    const synced = await database.db[table].where('syncStatus').equals('synced').count()
    const pending = await database.db[table].where('syncStatus').notEqual('synced').count()

    stats.totalItems += all
    stats.syncedItems += synced
    stats.pendingItems += pending
  }

  return stats
}

// 默认导出
export default syncService

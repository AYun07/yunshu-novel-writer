/**
 * 云书 - 后台任务队列系统
 * 支持任务创建/暂停/恢复/取消，持久化到 IndexedDB
 * 包含进度回调、断线续传、优先级排序、并发控制、AI调用指标监控
 */

// ==================== 任务类型枚举 ====================

/**
 * 任务类型枚举
 * 定义系统中所有支持的后台任务类型
 */
const TASK_TYPES = {
  // AI 生成类
  GENERATE_OUTLINE: 'generate_outline',           // 生成大纲
  GENERATE_CHAPTER: 'generate_chapter',           // 生成章节内容
  GENERATE_CHARACTER: 'generate_character',       // 生成角色
  GENERATE_WORLDSETTING: 'generate_worldsetting', // 生成世界观
  GENERATE_IDEA: 'generate_idea',                 // 生成灵感

  // AI 分析类
  ANALYZE_TEXT: 'analyze_text',                   // 文本分析
  ANALYZE_PLOT: 'analyze_plot',                   // 情节分析
  ANALYZE_CHARACTER: 'analyze_character',         // 角色分析
  CHECK_CONSISTENCY: 'check_consistency',         // 一致性检查

  // 导出类
  EXPORT_MARKDOWN: 'export_markdown',             // 导出 Markdown
  EXPORT_DOCX: 'export_docx',                     // 导出 DOCX
  EXPORT_EPUB: 'export_epub',                     // 导出 EPUB
  EXPORT_PDF: 'export_pdf',                       // 导出 PDF
  EXPORT_BATCH: 'export_batch',                   // 批量导出

  // 其他
  IMPORT_PROJECT: 'import_project',               // 导入项目
  SAVE_SNAPSHOT: 'save_snapshot',                 // 保存快照
  BATCH_OPERATION: 'batch_operation'              // 批量操作
}

/**
 * 任务状态枚举
 */
const TASK_STATUS = {
  PENDING: 'pending',       // 等待执行
  QUEUED: 'queued',         // 已入队
  RUNNING: 'running',       // 执行中
  PAUSED: 'paused',         // 已暂停
  COMPLETED: 'completed',   // 已完成
  FAILED: 'failed',         // 执行失败
  CANCELLED: 'cancelled'    // 已取消
}

/**
 * 任务优先级枚举
 * 数值越大优先级越高
 */
const TASK_PRIORITY = {
  LOW: 1,        // 低优先级（如批量导出）
  NORMAL: 5,     // 普通优先级（如生成大纲）
  HIGH: 8,       // 高优先级（如生成章节）
  URGENT: 10     // 紧急优先级（如用户主动触发的操作）
}

// ==================== AI 调用指标监控 ====================

/**
 * AIMetrics 类
 * 监控 AI 调用的性能指标：首字延迟、总耗时、token 消耗
 */
class AIMetrics {
  constructor() {
    /** @type {Map<string, object>} 正在进行的调用指标 */
    this._activeCalls = new Map()
    /** @type {Array<object>} 历史指标记录 */
    this._history = []
    /** @type {number} 最大保留历史记录数 */
    this._maxHistory = 500
  }

  /**
   * 开始记录一次 AI 调用
   * @param {string} taskId - 关联的任务ID
   * @param {string} model - 使用的模型名称
   * @param {string} type - 调用类型
   * @returns {string} 调用ID
   */
  startCall(taskId, model, type) {
    const callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    this._activeCalls.set(callId, {
      callId,
      taskId,
      model,
      type,
      startTime: Date.now(),
      firstTokenTime: null,  // 首字时间（延迟）
      endTime: null,         // 结束时间
      inputTokens: 0,
      outputTokens: 0,
      status: 'running'
    })
    return callId
  }

  /**
   * 记录首字到达
   * @param {string} callId - 调用ID
   */
  markFirstToken(callId) {
    const call = this._activeCalls.get(callId)
    if (call && !call.firstTokenTime) {
      call.firstTokenTime = Date.now()
    }
  }

  /**
   * 结束一次 AI 调用
   * @param {string} callId - 调用ID
   * @param {object} result - 调用结果
   * @param {number} [result.inputTokens=0] - 输入 token 数
   * @param {number} [result.outputTokens=0] - 输出 token 数
   * @param {string} [result.status='success'] - 调用状态
   * @param {string} [result.error] - 错误信息
   */
  endCall(callId, result = {}) {
    const call = this._activeCalls.get(callId)
    if (!call) return

    call.endTime = Date.now()
    call.inputTokens = result.inputTokens || 0
    call.outputTokens = result.outputTokens || 0
    call.status = result.status || 'success'
    call.error = result.error || ''

    // 计算指标
    const metrics = {
      callId: call.callId,
      taskId: call.taskId,
      model: call.model,
      type: call.type,
      // 首字延迟（毫秒）
      firstTokenLatency: call.firstTokenTime
        ? call.firstTokenTime - call.startTime
        : null,
      // 总耗时（毫秒）
      totalDuration: call.endTime - call.startTime,
      // 每秒输出 token 数（吞吐量）
      throughput: call.firstTokenTime && call.outputTokens > 0
        ? Math.round(call.outputTokens / ((call.endTime - call.firstTokenTime) / 1000))
        : 0,
      inputTokens: call.inputTokens,
      outputTokens: call.outputTokens,
      totalTokens: call.inputTokens + call.outputTokens,
      status: call.status,
      error: call.error,
      timestamp: new Date().toISOString()
    }

    // 保存到历史记录
    this._history.push(metrics)
    if (this._history.length > this._maxHistory) {
      this._history = this._history.slice(-this._maxHistory)
    }

    // 从活跃调用中移除
    this._activeCalls.delete(callId)

    return metrics
  }

  /**
   * 获取指定任务的 AI 调用指标
   * @param {string} taskId - 任务ID
   * @returns {Array}
   */
  getMetricsByTask(taskId) {
    return this._history.filter(m => m.taskId === taskId)
  }

  /**
   * 获取汇总统计
   * @param {object} [filters] - 过滤条件
   * @param {string} [filters.model] - 按模型过滤
   * @param {string} [filters.type] - 按类型过滤
   * @returns {object}
   */
  getSummary(filters = {}) {
    let records = [...this._history]

    if (filters.model) {
      records = records.filter(r => r.model === filters.model)
    }
    if (filters.type) {
      records = records.filter(r => r.type === filters.type)
    }

    if (records.length === 0) {
      return {
        totalCalls: 0,
        successRate: 0,
        avgFirstTokenLatency: 0,
        avgTotalDuration: 0,
        avgThroughput: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0
      }
    }

    const successRecords = records.filter(r => r.status === 'success')
    const latencyRecords = records.filter(r => r.firstTokenLatency !== null)

    return {
      totalCalls: records.length,
      successRate: Math.round((successRecords.length / records.length) * 100) / 100,
      avgFirstTokenLatency: latencyRecords.length > 0
        ? Math.round(latencyRecords.reduce((s, r) => s + r.firstTokenLatency, 0) / latencyRecords.length)
        : 0,
      avgTotalDuration: Math.round(records.reduce((s, r) => s + r.totalDuration, 0) / records.length),
      avgThroughput: successRecords.length > 0
        ? Math.round(successRecords.reduce((s, r) => s + r.throughput, 0) / successRecords.length)
        : 0,
      totalInputTokens: records.reduce((s, r) => s + r.inputTokens, 0),
      totalOutputTokens: records.reduce((s, r) => s + r.outputTokens, 0)
    }
  }

  /**
   * 获取最近 N 条指标记录
   * @param {number} [limit=20]
   * @returns {Array}
   */
  getRecentMetrics(limit = 20) {
    return this._history.slice(-limit)
  }

  /**
   * 清空历史记录
   */
  clearHistory() {
    this._history = []
  }
}

// ==================== 任务队列类 ====================

/**
 * TaskQueue 类
 * 后台任务队列，支持任务创建/暂停/恢复/取消
 * 持久化到 IndexedDB，支持断线续传
 */
class TaskQueue {
  constructor() {
    /** @type {Map<number, object>} 内存中的任务映射 */
    this._tasks = new Map()
    /** @type {number} 最大并发执行数 */
    this._maxConcurrency = 3
    /** @type {number} 当前正在执行的任务数 */
    this._runningCount = 0
    /** @type {boolean} 是否正在处理队列 */
    this._processing = false
    /** @type {Map<string, Function>} 进度回调函数 */
    this._progressCallbacks = new Map()
    /** @type {Map<string, Function>} 任务完成回调 */
    this._completionCallbacks = new Map()
    /** @type {AIMetrics} AI 调用指标监控实例 */
    this._metrics = new AIMetrics()
    /** @type {boolean} 是否已初始化 */
    this._initialized = false
    /** @type {number} 心跳检测间隔（毫秒） */
    this._heartbeatInterval = 30000
    /** @type {number|null} 心跳定时器 */
    this._heartbeatTimer = null
  }

  /**
   * 初始化任务队列
   * 从 IndexedDB 恢复未完成的任务
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._initialized) return

    try {
      // 延迟加载数据库
      const { default: database } = await import('./database.js')

      // 获取所有未完成的任务
      const pendingTasks = await database.db.taskQueue
        .where('status')
        .anyOf([TASK_STATUS.PENDING, TASK_STATUS.QUEUED, TASK_STATUS.RUNNING, TASK_STATUS.PAUSED])
        .toArray()

      // 恢复任务到内存
      for (const task of pendingTasks) {
        // 将 RUNNING 状态的任务重置为 QUEUED（可能是上次异常退出）
        if (task.status === TASK_STATUS.RUNNING) {
          task.status = TASK_STATUS.QUEUED
          task.retryCount = (task.retryCount || 0) + 1
          await database.db.taskQueue.update(task.id, {
            status: TASK_STATUS.QUEUED,
            retryCount: task.retryCount
          })
        }
        this._tasks.set(task.id, task)
      }

      this._initialized = true
      console.log(`[任务队列] 初始化完成，恢复 ${pendingTasks.length} 个未完成任务`)

      // 启动心跳检测
      this._startHeartbeat()

      // 开始处理队列
      this._processQueue()
    } catch (error) {
      console.error('[任务队列] 初始化失败:', error)
    }
  }

  /**
   * 创建新任务
   * @param {object} params - 任务参数
   * @param {string} params.type - 任务类型（TASK_TYPES 中的值）
   * @param {string} params.title - 任务标题（用于显示）
   * @param {number} [params.projectId] - 关联的项目ID
   * @param {object} [params.payload] - 任务负载数据
   * @param {number} [params.priority=5] - 优先级
   * @param {Function} [params.execute] - 任务执行函数
   * @param {Function} [params.onProgress] - 进度回调
   * @param {Function} [params.onComplete] - 完成回调
   * @param {object} [params.options] - 额外选项
   * @param {number} [params.options.maxRetries=3] - 最大重试次数
   * @param {number} [params.options.timeout=300000] - 超时时间（毫秒）
   * @param {boolean} [params.options.saveable=true] - 是否持久化
   * @returns {Promise<number>} 任务ID
   */
  async create(params) {
    const now = new Date().toISOString()

    const task = {
      type: params.type,
      title: params.title || `任务 ${params.type}`,
      projectId: params.projectId || null,
      payload: params.payload || {},
      priority: params.priority || TASK_PRIORITY.NORMAL,
      status: TASK_STATUS.PENDING,
      progress: 0,
      result: null,
      error: null,

      // 执行控制
      execute: params.execute || null,
      maxRetries: params.options?.maxRetries || 3,
      retryCount: 0,
      timeout: params.options?.timeout || 300000, // 默认5分钟超时
      saveable: params.options?.saveable !== false,

      // 时间戳
      createdAt: now,
      updatedAt: now,
      startedAt: null,
      completedAt: null
    }

    // 持久化到 IndexedDB
    if (task.saveable) {
      try {
        const { default: database } = await import('./database.js')
        task.id = await database.db.taskQueue.add(task)
      } catch (error) {
        console.error('[任务队列] 持久化任务失败:', error)
        // 降级为内存ID
        task.id = Date.now() + Math.floor(Math.random() * 10000)
      }
    } else {
      task.id = Date.now() + Math.floor(Math.random() * 10000)
    }

    // 存入内存
    this._tasks.set(task.id, task)

    // 注册回调
    if (params.onProgress) {
      this._progressCallbacks.set(task.id, params.onProgress)
    }
    if (params.onComplete) {
      this._completionCallbacks.set(task.id, params.onComplete)
    }

    console.log(`[任务队列] 任务已创建: #${task.id} ${task.title}`)
    return task.id
  }

  /**
   * 暂停任务
   * @param {number} taskId - 任务ID
   * @returns {Promise<boolean>}
   */
  async pause(taskId) {
    const task = this._tasks.get(taskId)
    if (!task) throw new Error(`任务不存在: ${taskId}`)

    if (task.status !== TASK_STATUS.RUNNING && task.status !== TASK_STATUS.QUEUED) {
      console.warn(`[任务队列] 任务状态不允许暂停: ${task.status}`)
      return false
    }

    task.status = TASK_STATUS.PAUSED
    task.updatedAt = new Date().toISOString()

    await this._persistTask(task)
    console.log(`[任务队列] 任务已暂停: #${taskId}`)
    return true
  }

  /**
   * 恢复暂停的任务
   * @param {number} taskId - 任务ID
   * @returns {Promise<boolean>}
   */
  async resume(taskId) {
    const task = this._tasks.get(taskId)
    if (!task) throw new Error(`任务不存在: ${taskId}`)

    if (task.status !== TASK_STATUS.PAUSED) {
      console.warn(`[任务队列] 任务状态不允许恢复: ${task.status}`)
      return false
    }

    task.status = TASK_STATUS.QUEUED
    task.updatedAt = new Date().toISOString()

    await this._persistTask(task)
    console.log(`[任务队列] 任务已恢复: #${taskId}`)

    // 触发队列处理
    this._processQueue()
    return true
  }

  /**
   * 取消任务
   * @param {number} taskId - 任务ID
   * @returns {Promise<boolean>}
   */
  async cancel(taskId) {
    const task = this._tasks.get(taskId)
    if (!task) throw new Error(`任务不存在: ${taskId}`)

    if (task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
      console.warn(`[任务队列] 任务已结束，无法取消: ${task.status}`)
      return false
    }

    task.status = TASK_STATUS.CANCELLED
    task.updatedAt = new Date().toISOString()
    task.completedAt = new Date().toISOString()

    await this._persistTask(task)

    // 清理回调
    this._progressCallbacks.delete(taskId)
    this._completionCallbacks.delete(taskId)

    console.log(`[任务队列] 任务已取消: #${taskId}`)
    return true
  }

  /**
   * 获取任务信息
   * @param {number} taskId
   * @returns {object|null}
   */
  getTask(taskId) {
    return this._tasks.get(taskId) || null
  }

  /**
   * 获取所有任务
   * @param {object} [filters] - 过滤条件
   * @param {number} [filters.projectId] - 按项目ID过滤
   * @param {string} [filters.status] - 按状态过滤
   * @param {string} [filters.type] - 按类型过滤
   * @returns {Array}
   */
  getTasks(filters = {}) {
    let tasks = Array.from(this._tasks.values())

    if (filters.projectId) {
      tasks = tasks.filter(t => t.projectId === filters.projectId)
    }
    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status)
    }
    if (filters.type) {
      tasks = tasks.filter(t => t.type === filters.type)
    }

    // 按优先级倒序、创建时间正序排序
    tasks.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return new Date(a.createdAt) - new Date(b.createdAt)
    })

    return tasks
  }

  /**
   * 获取任务队列统计
   * @returns {object}
   */
  getStats() {
    const tasks = Array.from(this._tasks.values())
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === TASK_STATUS.PENDING || t.status === TASK_STATUS.QUEUED).length,
      running: tasks.filter(t => t.status === TASK_STATUS.RUNNING).length,
      paused: tasks.filter(t => t.status === TASK_STATUS.PAUSED).length,
      completed: tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length,
      failed: tasks.filter(t => t.status === TASK_STATUS.FAILED).length,
      cancelled: tasks.filter(t => t.status === TASK_STATUS.CANCELLED).length,
      runningCount: this._runningCount,
      maxConcurrency: this._maxConcurrency
    }
  }

  /**
   * 获取 AI 调用指标监控实例
   * @returns {AIMetrics}
   */
  get metrics() {
    return this._metrics
  }

  /**
   * 设置最大并发数
   * @param {number} max - 最大并发数
   */
  setMaxConcurrency(max) {
    this._maxConcurrency = Math.max(1, Math.min(10, max))
    console.log(`[任务队列] 最大并发数已设置为: ${this._maxConcurrency}`)
  }

  /**
   * 销毁任务队列
   * 停止心跳，清理资源
   */
  destroy() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer)
      this._heartbeatTimer = null
    }
    this._tasks.clear()
    this._progressCallbacks.clear()
    this._completionCallbacks.clear()
    this._initialized = false
    console.log('[任务队列] 已销毁')
  }

  // ---------- 内部方法 ----------

  /**
   * 处理任务队列
   * 按优先级取出待执行的任务，在并发限制内执行
   * @private
   */
  async _processQueue() {
    if (this._processing) return
    this._processing = true

    try {
      while (this._runningCount < this._maxConcurrency) {
        // 获取下一个可执行的任务
        const nextTask = this._getNextTask()
        if (!nextTask) break

        // 标记为运行中
        nextTask.status = TASK_STATUS.RUNNING
        nextTask.startedAt = new Date().toISOString()
        nextTask.updatedAt = new Date().toISOString()
        await this._persistTask(nextTask)

        this._runningCount++

        // 异步执行任务
        this._executeTask(nextTask).finally(() => {
          this._runningCount--
          // 继续处理队列
          this._processing = false
          this._processQueue()
        })
      }
    } finally {
      this._processing = false
    }
  }

  /**
   * 获取下一个待执行的任务
   * 按优先级排序，优先执行高优先级任务
   * @returns {object|null}
   * @private
   */
  _getNextTask() {
    const candidates = Array.from(this._tasks.values())
      .filter(t => t.status === TASK_STATUS.PENDING || t.status === TASK_STATUS.QUEUED)

    if (candidates.length === 0) return null

    // 按优先级倒序排列
    candidates.sort((a, b) => b.priority - a.priority)
    return candidates[0]
  }

  /**
   * 执行单个任务
   * @param {object} task - 任务对象
   * @private
   */
  async _executeTask(task) {
    const taskId = task.id

    // 检查任务是否已被暂停或取消
    if (task.status === TASK_STATUS.PAUSED || task.status === TASK_STATUS.CANCELLED) {
      return
    }

    console.log(`[任务队列] 开始执行任务: #${taskId} ${task.title}`)

    // 创建进度报告函数
    const reportProgress = (progress, message = '') => {
      if (task.status !== TASK_STATUS.RUNNING) return
      task.progress = Math.min(100, Math.max(0, progress))
      task.updatedAt = new Date().toISOString()

      // 触发进度回调
      const callback = this._progressCallbacks.get(taskId)
      if (callback) {
        try {
          callback({ taskId, progress: task.progress, message, status: 'running' })
        } catch (error) {
          console.error(`[任务队列] 进度回调错误:`, error)
        }
      }
    }

    try {
      // 检查是否有执行函数
      if (typeof task.execute !== 'function') {
        throw new Error('任务缺少执行函数')
      }

      // 带超时执行
      const result = await this._executeWithTimeout(
        task.execute(task.payload, reportProgress),
        task.timeout
      )

      // 标记完成
      task.status = TASK_STATUS.COMPLETED
      task.progress = 100
      task.result = result
      task.completedAt = new Date().toISOString()
      task.updatedAt = new Date().toISOString()

      await this._persistTask(task)

      // 触发完成回调
      const completeCallback = this._completionCallbacks.get(taskId)
      if (completeCallback) {
        try {
          completeCallback({ taskId, result, status: 'completed' })
        } catch (error) {
          console.error(`[任务队列] 完成回调错误:`, error)
        }
      }

      console.log(`[任务队列] 任务完成: #${taskId} ${task.title}`)
    } catch (error) {
      console.error(`[任务队列] 任务执行失败: #${taskId}`, error)

      // 判断是否需要重试
      if (task.retryCount < task.maxRetries) {
        task.retryCount++
        task.status = TASK_STATUS.QUEUED
        task.error = error.message
        task.updatedAt = new Date().toISOString()

        await this._persistTask(task)
        console.log(`[任务队列] 任务将重试 (${task.retryCount}/${task.maxRetries}): #${taskId}`)
      } else {
        // 重试次数已用完，标记为失败
        task.status = TASK_STATUS.FAILED
        task.error = error.message
        task.completedAt = new Date().toISOString()
        task.updatedAt = new Date().toISOString()

        await this._persistTask(task)

        // 触发完成回调（失败）
        const completeCallback = this._completionCallbacks.get(taskId)
        if (completeCallback) {
          try {
            completeCallback({ taskId, error: error.message, status: 'failed' })
          } catch (callbackError) {
            console.error(`[任务队列] 完成回调错误:`, callbackError)
          }
        }
      }
    } finally {
      // 清理进度回调（保留完成回调，因为可能还需要通知）
      this._progressCallbacks.delete(taskId)
    }
  }

  /**
   * 带超时的 Promise 执行
   * @param {Promise} promise - 要执行的 Promise
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {Promise<*>}
   * @private
   */
  _executeWithTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`任务执行超时 (${timeout / 1000}秒)`))
      }, timeout)

      promise
        .then(result => {
          clearTimeout(timer)
          resolve(result)
        })
        .catch(error => {
          clearTimeout(timer)
          reject(error)
        })
    })
  }

  /**
   * 持久化任务到 IndexedDB
   * @param {object} task - 任务对象
   * @private
   */
  async _persistTask(task) {
    if (!task.saveable) return

    try {
      const { default: database } = await import('./database.js')
      await database.db.taskQueue.update(task.id, {
        status: task.status,
        progress: task.progress,
        result: task.result,
        error: task.error,
        priority: task.priority,
        retryCount: task.retryCount,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
        updatedAt: task.updatedAt
      })
    } catch (error) {
      console.error('[任务队列] 持久化任务失败:', error)
    }
  }

  /**
   * 启动心跳检测
   * 定期检查运行中的任务是否超时或卡死
   * @private
   */
  _startHeartbeat() {
    this._heartbeatTimer = setInterval(() => {
      this._checkStaleTasks()
    }, this._heartbeatInterval)
  }

  /**
   * 检查过期的运行中任务
   * 如果任务运行时间超过超时时间的1.5倍，标记为失败
   * @private
   */
  async _checkStaleTasks() {
    const now = Date.now()
    const runningTasks = Array.from(this._tasks.values())
      .filter(t => t.status === TASK_STATUS.RUNNING && t.startedAt)

    for (const task of runningTasks) {
      const startedAt = new Date(task.startedAt).getTime()
      const elapsed = now - startedAt

      // 超过超时时间的1.5倍视为卡死
      if (elapsed > task.timeout * 1.5) {
        console.warn(`[任务队列] 检测到卡死任务: #${task.id}，已运行 ${Math.round(elapsed / 1000)}秒`)
        task.status = TASK_STATUS.FAILED
        task.error = '任务执行超时（心跳检测）'
        task.completedAt = new Date().toISOString()
        task.updatedAt = new Date().toISOString()
        await this._persistTask(task)
      }
    }
  }
}

// ==================== 创建任务队列实例 ====================

const taskQueue = new TaskQueue()

// ==================== 统一导出 ====================

const taskQueueService = {
  // 任务队列实例
  queue: taskQueue,
  // 枚举
  TASK_TYPES,
  TASK_STATUS,
  TASK_PRIORITY,
  // AI 指标监控类
  AIMetrics,
  // 初始化方法
  initialize: () => taskQueue.initialize(),
  // 便捷方法
  create: (params) => taskQueue.create(params),
  pause: (taskId) => taskQueue.pause(taskId),
  resume: (taskId) => taskQueue.resume(taskId),
  cancel: (taskId) => taskQueue.cancel(taskId),
  getTask: (taskId) => taskQueue.getTask(taskId),
  getTasks: (filters) => taskQueue.getTasks(filters),
  getStats: () => taskQueue.getStats(),
  setMaxConcurrency: (max) => taskQueue.setMaxConcurrency(max),
  destroy: () => taskQueue.destroy()
}

export default taskQueueService

/**
 * 云书 - AI 调用编排服务
 * 统一管理所有 AI 调用，提供模型路由、上下文管理、重试策略、缓存、流量控制、成本追踪、回滚支持
 *
 * 【待集成】此模块已实现完整功能，计划在 v2.3.0 中集成到主应用。
 * 集成方式：在对应的视图组件中 import 并调用。
 * 依赖：需要先初始化 database.js（IndexedDB）作为主存储。
 */

// ==================== 常量定义 ====================

/**
 * 任务类型枚举
 * @enum {string}
 */
const TaskType = {
  OUTLINE_GENERATION: 'outline_generation',   // 大纲生成
  CHAPTER_WRITING: 'chapter_writing',         // 章节创作
  CHARACTER_DESIGN: 'character_design',       // 角色设计
  WORLD_BUILDING: 'world_building',           // 世界观构建
  TEXT_POLISHING: 'text_polishing',           // 文本润色
  TEXT_ANALYSIS: 'text_analysis',             // 文本分析
  SUMMARY_GENERATION: 'summary_generation',   // 摘要生成
  DIALOGUE_WRITING: 'dialogue_writing',       // 对话写作
  TRANSLATION: 'translation',                 // 翻译
  CHAT: 'chat',                               // 对话问答
  GENERAL: 'general'                          // 通用任务
}

/**
 * 调用状态枚举
 * @enum {string}
 */
const CallStatus = {
  PENDING: 'pending',       // 等待中
  RUNNING: 'running',       // 执行中
  COMPLETED: 'completed',   // 已完成
  FAILED: 'failed',         // 失败
  CANCELLED: 'cancelled',   // 已取消
  TIMEOUT: 'timeout'        // 超时
}

/**
 * 模型优先级枚举
 * @enum {number}
 */
const ModelPriority = {
  PRIMARY: 1,     // 主模型
  SECONDARY: 2,   // 备用模型
  FALLBACK: 3     // 降级模型
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  // 重试配置
  maxRetries: 3,              // 最大重试次数
  retryDelay: 1000,           // 重试延迟（毫秒）
  retryBackoff: 2,            // 重试退避系数
  
  // 超时配置
  requestTimeout: 120000,     // 请求超时（毫秒）
  streamTimeout: 300000,      // 流式请求超时（毫秒）
  
  // 缓存配置
  enableCache: true,          // 是否启用缓存
  cacheMaxSize: 100,          // 缓存最大条目数
  cacheTTL: 3600000,          // 缓存有效期（毫秒）
  
  // 流量控制配置
  maxConcurrent: 5,           // 最大并发请求数
  requestInterval: 100,       // 请求间隔（毫秒）
  rateLimitWindow: 60000,     // 速率限制窗口（毫秒）
  rateLimitMax: 60,           // 窗口内最大请求数
  
  // 上下文配置
  maxContextTokens: 4000,     // 最大上下文 token 数
  
  // 成本追踪配置
  enableCostTracking: true,   // 是否启用成本追踪
  
  // 历史记录配置
  maxHistoryLength: 500       // 最大历史记录长度
}

// ==================== 模型路由配置 ====================

/**
 * 任务类型到模型配置的映射
 */
const TASK_MODEL_CONFIG = {
  [TaskType.OUTLINE_GENERATION]: {
    primaryModel: 'gpt-4o',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4096
  },
  [TaskType.CHAPTER_WRITING]: {
    primaryModel: 'gpt-4o',
    secondaryModel: 'claude-sonnet-4-20250514',
    fallbackModel: 'deepseek-chat',
    temperature: 0.8,
    maxTokens: 8192
  },
  [TaskType.CHARACTER_DESIGN]: {
    primaryModel: 'gpt-4o',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'gpt-4o-mini',
    temperature: 0.9,
    maxTokens: 2048
  },
  [TaskType.WORLD_BUILDING]: {
    primaryModel: 'gpt-4o',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'gpt-4o-mini',
    temperature: 0.8,
    maxTokens: 2048
  },
  [TaskType.TEXT_POLISHING]: {
    primaryModel: 'claude-sonnet-4-20250514',
    secondaryModel: 'gpt-4o',
    fallbackModel: 'deepseek-chat',
    temperature: 0.5,
    maxTokens: 8192
  },
  [TaskType.TEXT_ANALYSIS]: {
    primaryModel: 'gpt-4o-mini',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'glm-4-flash',
    temperature: 0.3,
    maxTokens: 2048
  },
  [TaskType.SUMMARY_GENERATION]: {
    primaryModel: 'gpt-4o-mini',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'glm-4-flash',
    temperature: 0.3,
    maxTokens: 1024
  },
  [TaskType.DIALOGUE_WRITING]: {
    primaryModel: 'gpt-4o',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'gpt-4o-mini',
    temperature: 0.9,
    maxTokens: 2048
  },
  [TaskType.TRANSLATION]: {
    primaryModel: 'gpt-4o-mini',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'glm-4-flash',
    temperature: 0.3,
    maxTokens: 4096
  },
  [TaskType.CHAT]: {
    primaryModel: 'gpt-4o-mini',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'glm-4-flash',
    temperature: 0.7,
    maxTokens: 2048
  },
  [TaskType.GENERAL]: {
    primaryModel: 'gpt-4o',
    secondaryModel: 'deepseek-chat',
    fallbackModel: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 4096
  }
}

/**
 * 模型价格配置（美元/1K tokens）
 */
const MODEL_PRICING = {
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-sonnet-4-20250514': { input: 0.003, output: 0.015 },
  'claude-opus-4-20250514': { input: 0.015, output: 0.075 },
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'claude-3-5-haiku-20241022': { input: 0.0008, output: 0.004 },
  'deepseek-chat': { input: 0.00014, output: 0.00028 },
  'deepseek-reasoner': { input: 0.00055, output: 0.00219 },
  'gemini-2.5-pro-preview-05-06': { input: 0.00125, output: 0.005 },
  'gemini-2.5-flash-preview-05-20': { input: 0.000075, output: 0.0003 },
  'gemini-2.0-flash': { input: 0.0001, output: 0.0004 },
  'glm-4-plus': { input: 0.0007, output: 0.0007 },
  'glm-4': { input: 0.00014, output: 0.00014 },
  'glm-4-flash': { input: 0.00001, output: 0.00001 }
}

// ==================== 缓存管理器 ====================

/**
 * CacheManager 缓存管理器
 * 管理 AI 响应缓存
 */
class CacheManager {
  /**
   * @param {object} config - 配置
   */
  constructor(config) {
    this.config = config
    /** @type {Map<string, {data: any, timestamp: number}>} */
    this.cache = new Map()
  }

  /**
   * 生成缓存键
   * @param {string} model - 模型名称
   * @param {Array} messages - 消息数组
   * @param {object} options - 选项
   * @returns {string}
   */
  generateKey(model, messages, options = {}) {
    const content = JSON.stringify({ model, messages, options })
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return `cache_${hash.toString(16)}`
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any|null}
   */
  get(key) {
    if (!this.config.enableCache) return null
    
    const cached = this.cache.get(key)
    if (!cached) return null
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > this.config.cacheTTL) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} data - 缓存数据
   */
  set(key, data) {
    if (!this.config.enableCache) return
    
    // 检查缓存大小，清理旧条目
    if (this.cache.size >= this.config.cacheMaxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 清除缓存
   */
  clear() {
    this.cache.clear()
  }

  /**
   * 获取缓存统计
   * @returns {object}
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.cacheMaxSize,
      enabled: this.config.enableCache
    }
  }
}

// ==================== 流量控制器 ====================

/**
 * RateLimiter 流量控制器
 * 控制请求频率，避免 API 限流
 */
class RateLimiter {
  /**
   * @param {object} config - 配置
   */
  constructor(config) {
    this.config = config
    /** @type {number[]} 请求时间戳队列 */
    this.requestTimestamps = []
    /** @type {Array<{resolve: Function, reject: Function}>} 等待队列 */
    this.waitQueue = []
    /** @type {number} 当前并发数 */
    this.currentConcurrent = 0
  }

  /**
   * 获取执行许可
   * @returns {Promise<void>}
   */
  async acquire() {
    return new Promise((resolve, reject) => {
      // 检查是否可以立即执行
      if (this._canExecute()) {
        this._recordRequest()
        resolve()
      } else {
        // 加入等待队列
        this.waitQueue.push({ resolve, reject })
        this._scheduleNext()
      }
    })
  }

  /**
   * 释放许可
   */
  release() {
    this.currentConcurrent--
    
    // 检查是否有等待的请求
    if (this.waitQueue.length > 0 && this._canExecute()) {
      const next = this.waitQueue.shift()
      this._recordRequest()
      next.resolve()
    }
  }

  /**
   * 检查是否可以执行
   * @returns {boolean}
   * @private
   */
  _canExecute() {
    // 检查并发数
    if (this.currentConcurrent >= this.config.maxConcurrent) {
      return false
    }
    
    // 清理过期的请求记录
    const now = Date.now()
    const windowStart = now - this.config.rateLimitWindow
    this.requestTimestamps = this.requestTimestamps.filter(t => t > windowStart)
    
    // 检查速率限制
    if (this.requestTimestamps.length >= this.config.rateLimitMax) {
      return false
    }
    
    return true
  }

  /**
   * 记录请求
   * @private
   */
  _recordRequest() {
    this.requestTimestamps.push(Date.now())
    this.currentConcurrent++
  }

  /**
   * 调度下一个请求
   * @private
   */
  _scheduleNext() {
    // 计算需要等待的时间
    const now = Date.now()
    const windowStart = now - this.config.rateLimitWindow
    
    if (this.requestTimestamps.length > 0) {
      const oldestInWindow = this.requestTimestamps.find(t => t > windowStart)
      if (oldestInWindow) {
        const waitTime = oldestInWindow + this.config.rateLimitWindow - now + 100
        setTimeout(() => {
          if (this.waitQueue.length > 0 && this._canExecute()) {
            const next = this.waitQueue.shift()
            this._recordRequest()
            next.resolve()
          }
        }, waitTime)
      }
    }
  }

  /**
   * 获取状态
   * @returns {object}
   */
  getStatus() {
    const now = Date.now()
    const windowStart = now - this.config.rateLimitWindow
    const requestsInWindow = this.requestTimestamps.filter(t => t > windowStart).length
    
    return {
      currentConcurrent: this.currentConcurrent,
      maxConcurrent: this.config.maxConcurrent,
      requestsInWindow,
      rateLimitMax: this.config.rateLimitMax,
      waitQueueLength: this.waitQueue.length
    }
  }
}

// ==================== 成本追踪器 ====================

/**
 * CostTracker 成本追踪器
 * 记录每次调用的 token 消耗和成本
 */
class CostTracker {
  /**
   * @param {object} config - 配置
   */
  constructor(config) {
    this.config = config
    /** @type {object[]} 调用记录 */
    this.records = []
    /** @type {Map<string, object>} 按模型统计 */
    this.modelStats = new Map()
  }

  /**
   * 记录调用
   * @param {object} record - 调用记录
   */
  record(record) {
    if (!this.config.enableCostTracking) return
    
    const { model, inputTokens, outputTokens, taskType, status, duration } = record
    
    // 计算成本
    const pricing = MODEL_PRICING[model] || { input: 0, output: 0 }
    const inputCost = (inputTokens / 1000) * pricing.input
    const outputCost = (outputTokens / 1000) * pricing.output
    const totalCost = inputCost + outputCost
    
    const fullRecord = {
      ...record,
      inputCost,
      outputCost,
      totalCost,
      timestamp: Date.now()
    }
    
    this.records.push(fullRecord)
    
    // 更新模型统计
    if (!this.modelStats.has(model)) {
      this.modelStats.set(model, {
        totalCalls: 0,
        successCalls: 0,
        failedCalls: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCost: 0
      })
    }
    
    const stats = this.modelStats.get(model)
    stats.totalCalls++
    if (status === 'success') stats.successCalls++
    else stats.failedCalls++
    stats.totalInputTokens += inputTokens || 0
    stats.totalOutputTokens += outputTokens || 0
    stats.totalCost += totalCost
  }

  /**
   * 获取总成本
   * @param {number} [startTime] - 开始时间
   * @param {number} [endTime] - 结束时间
   * @returns {object}
   */
  getTotalCost(startTime = null, endTime = null) {
    let filteredRecords = this.records
    
    if (startTime) {
      filteredRecords = filteredRecords.filter(r => r.timestamp >= startTime)
    }
    if (endTime) {
      filteredRecords = filteredRecords.filter(r => r.timestamp <= endTime)
    }
    
    return {
      totalCalls: filteredRecords.length,
      totalInputTokens: filteredRecords.reduce((sum, r) => sum + (r.inputTokens || 0), 0),
      totalOutputTokens: filteredRecords.reduce((sum, r) => sum + (r.outputTokens || 0), 0),
      totalCost: filteredRecords.reduce((sum, r) => sum + (r.totalCost || 0), 0),
      byModel: Object.fromEntries(this.modelStats)
    }
  }

  /**
   * 获取今日成本
   * @returns {object}
   */
  getTodayCost() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return this.getTotalCost(today.getTime())
  }

  /**
   * 获取本月成本
   * @returns {object}
   */
  getMonthCost() {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return this.getTotalCost(monthStart.getTime())
  }

  /**
   * 清除记录
   */
  clear() {
    this.records = []
    this.modelStats.clear()
  }

  /**
   * 获取记录列表
   * @param {number} [limit=50] - 返回数量
   * @returns {object[]}
   */
  getRecords(limit = 50) {
    return this.records.slice(-limit)
  }
}

// ==================== 上下文管理器 ====================

/**
 * ContextManager 上下文管理器
 * 自动注入向量记忆和追踪数据
 */
class ContextManager {
  /**
   * @param {object} config - 配置
   * @param {object} config.vectorMemory - 向量记忆系统
   * @param {object} config.smartTracking - 智能追踪系统
   */
  constructor(config) {
    this.config = config
    this.vectorMemory = config.vectorMemory
    this.smartTracking = config.smartTracking
  }

  /**
   * 构建增强上下文
   * @param {object} params - 参数
   * @param {number} [params.projectId] - 项目ID
   * @param {number} [params.chapterId] - 章节ID
   * @param {string} [params.currentText] - 当前文本
   * @param {string} [params.taskType] - 任务类型
   * @param {number} [params.maxTokens] - 最大 token 数
   * @returns {Promise<{context: string, tokenCount: number}>}
   */
  async buildEnhancedContext(params) {
    const { projectId, chapterId, currentText, taskType, maxTokens = this.config.maxContextTokens } = params
    
    const contextParts = []
    let totalTokens = 0
    
    // 1. 从向量记忆获取相关上下文
    if (this.vectorMemory && currentText && projectId) {
      try {
        const memoryContext = await this.vectorMemory.buildContext(currentText, {
          projectId,
          maxTokens: maxTokens * 0.4
        })
        
        if (memoryContext.context) {
          contextParts.push(memoryContext.context)
          totalTokens += memoryContext.tokenCount
        }
      } catch (e) {
        console.warn('[ContextManager] 向量记忆上下文构建失败:', e)
      }
    }
    
    // 2. 从智能追踪获取上下文
    if (this.smartTracking && projectId && chapterId) {
      try {
        const trackingContext = await this.smartTracking.getContextTracker().buildChapterContext(
          projectId,
          chapterId,
          maxTokens - totalTokens
        )
        
        if (trackingContext.context) {
          contextParts.push(trackingContext.context)
          totalTokens += trackingContext.tokenCount
        }
      } catch (e) {
        console.warn('[ContextManager] 智能追踪上下文构建失败:', e)
      }
    }
    
    return {
      context: contextParts.join('\n\n---\n\n'),
      tokenCount: totalTokens
    }
  }

  /**
   * 注入上下文到消息
   * @param {Array} messages - 消息数组
   * @param {string} context - 上下文内容
   * @returns {Array}
   */
  injectContext(messages, context) {
    if (!context) return messages
    
    // 创建上下文消息
    const contextMessage = {
      role: 'system',
      content: `以下是相关的背景信息，请在生成内容时参考：

${context}`
    }
    
    // 在用户消息之前插入上下文
    const result = []
    let contextInserted = false
    
    for (const msg of messages) {
      if (msg.role === 'user' && !contextInserted) {
        result.push(contextMessage)
        contextInserted = true
      }
      result.push(msg)
    }
    
    return result
  }
}

// ==================== 历史管理器 ====================

/**
 * HistoryManager 历史管理器
 * 保存 AI 生成历史，支持回滚
 */
class HistoryManager {
  /**
   * @param {object} config - 配置
   */
  constructor(config) {
    this.config = config
    /** @type {Map<string, object[]>} 项目历史 projectId -> history[] */
    this.projectHistories = new Map()
    /** @type {Map<string, object>} 全局历史 */
    this.globalHistory = []
  }

  /**
   * 保存生成记录
   * @param {object} record - 记录
   */
  save(record) {
    const { projectId, callId, taskType, input, output, model, tokens, timestamp = Date.now() } = record
    
    const historyRecord = {
      callId,
      taskType,
      input,
      output,
      model,
      tokens,
      timestamp,
      rolledBack: false
    }
    
    // 保存到项目历史
    if (projectId) {
      if (!this.projectHistories.has(projectId)) {
        this.projectHistories.set(projectId, [])
      }
      const projectHistory = this.projectHistories.get(projectId)
      projectHistory.push(historyRecord)
      
      // 限制历史长度
      if (projectHistory.length > this.config.maxHistoryLength) {
        projectHistory.shift()
      }
    }
    
    // 保存到全局历史
    this.globalHistory.push({ ...historyRecord, projectId })
    if (this.globalHistory.length > this.config.maxHistoryLength) {
      this.globalHistory.shift()
    }
  }

  /**
   * 获取项目历史
   * @param {number} projectId - 项目ID
   * @param {number} [limit=20] - 返回数量
   * @returns {object[]}
   */
  getProjectHistory(projectId, limit = 20) {
    const history = this.projectHistories.get(projectId) || []
    return history.slice(-limit)
  }

  /**
   * 获取全局历史
   * @param {number} [limit=20] - 返回数量
   * @returns {object[]}
   */
  getGlobalHistory(limit = 20) {
    return this.globalHistory.slice(-limit)
  }

  /**
   * 回滚到指定记录
   * @param {string} callId - 调用ID
   * @returns {object|null}
   */
  rollback(callId) {
    // 在所有历史中查找记录
    for (const [projectId, history] of this.projectHistories) {
      const index = history.findIndex(r => r.callId === callId)
      if (index !== -1) {
        // 标记后续记录为已回滚
        for (let i = index; i < history.length; i++) {
          history[i].rolledBack = true
        }
        
        return {
          projectId,
          record: history[index],
          rolledBackCount: history.length - index - 1
        }
      }
    }
    
    return null
  }

  /**
   * 清除项目历史
   * @param {number} projectId - 项目ID
   */
  clearProjectHistory(projectId) {
    this.projectHistories.delete(projectId)
  }

  /**
   * 清除所有历史
   */
  clearAll() {
    this.projectHistories.clear()
    this.globalHistory = []
  }
}

// ==================== AI 编排器主类 ====================

/**
 * AIOrchestrator AI 调用编排器
 * 统一管理所有 AI 调用
 */
class AIOrchestrator {
  /**
   * @param {object} config - 配置
   * @param {object} config.aiProvider - AI 提供者
   * @param {object} [config.vectorMemory] - 向量记忆系统
   * @param {object} [config.smartTracking] - 智能追踪系统
   * @param {object} [config.database] - 数据库服务
   */
  constructor(config) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    
    // 核心组件
    this.aiProvider = config.aiProvider
    this.vectorMemory = config.vectorMemory
    this.smartTracking = config.smartTracking
    this.database = config.database
    
    // 管理器
    this.cacheManager = new CacheManager(this.config)
    this.rateLimiter = new RateLimiter(this.config)
    this.costTracker = new CostTracker(this.config)
    this.contextManager = new ContextManager(this.config)
    this.historyManager = new HistoryManager(this.config)
    
    // 状态
    /** @type {Map<string, object>} 当前运行的调用 */
    this.runningCalls = new Map()
    /** @type {number} 调用计数器 */
    this.callCounter = 0
  }

  /**
   * 统一调用入口
   * @param {object} params - 调用参数
   * @param {string} params.taskType - 任务类型
   * @param {Array} params.messages - 消息数组
   * @param {number} [params.projectId] - 项目ID
   * @param {number} [params.chapterId] - 章节ID
   * @param {string} [params.model] - 指定模型
   * @param {number} [params.temperature] - 温度
   * @param {number} [params.maxTokens] - 最大 token 数
   * @param {boolean} [params.stream] - 是否流式
   * @param {boolean} [params.useCache] - 是否使用缓存
   * @param {boolean} [params.enhanceContext] - 是否增强上下文
   * @param {Function} [params.onChunk] - 流式回调
   * @param {Function} [params.onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async call(params) {
    const {
      taskType = TaskType.GENERAL,
      messages,
      projectId,
      chapterId,
      model,
      temperature,
      maxTokens,
      stream = false,
      useCache = true,
      enhanceContext = true,
      onChunk,
      onProgress
    } = params
    
    // 生成调用ID
    const callId = this._generateCallId()
    const startTime = Date.now()
    
    // 获取任务配置
    const taskConfig = TASK_MODEL_CONFIG[taskType] || TASK_MODEL_CONFIG[TaskType.GENERAL]
    
    // 确定使用的模型
    const selectedModel = model || taskConfig.primaryModel
    const actualTemperature = temperature ?? taskConfig.temperature
    const actualMaxTokens = maxTokens || taskConfig.maxTokens
    
    // 检查缓存
    if (useCache) {
      const cacheKey = this.cacheManager.generateKey(selectedModel, messages, { temperature: actualTemperature, maxTokens: actualMaxTokens })
      const cached = this.cacheManager.get(cacheKey)
      if (cached) {
        console.log(`[AIOrchestrator] 命中缓存: ${callId}`)
        return {
          callId,
          cached: true,
          ...cached
        }
      }
    }
    
    // 获取执行许可
    await this.rateLimiter.acquire()
    
    // 记录运行中的调用
    const callRecord = {
      callId,
      taskType,
      model: selectedModel,
      status: CallStatus.RUNNING,
      startTime
    }
    this.runningCalls.set(callId, callRecord)
    
    try {
      // 构建增强上下文
      let enhancedMessages = messages
      if (enhanceContext && projectId) {
        const currentText = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
        const context = await this.contextManager.buildEnhancedContext({
          projectId,
          chapterId,
          currentText,
          taskType,
          maxTokens: this.config.maxContextTokens
        })
        
        if (context.context) {
          enhancedMessages = this.contextManager.injectContext(messages, context.context)
        }
      }
      
      // 执行调用（带重试）
      let result
      if (stream) {
        result = await this._executeWithRetry(
          () => this._executeStreamCall(selectedModel, enhancedMessages, actualTemperature, actualMaxTokens, onChunk),
          callId
        )
      } else {
        result = await this._executeWithRetry(
          () => this._executeCall(selectedModel, enhancedMessages, actualTemperature, actualMaxTokens),
          callId
        )
      }
      
      // 更新状态
      callRecord.status = CallStatus.COMPLETED
      callRecord.endTime = Date.now()
      callRecord.duration = callRecord.endTime - startTime
      
      // 记录成本
      this.costTracker.record({
        model: selectedModel,
        inputTokens: result.usage?.inputTokens || 0,
        outputTokens: result.usage?.outputTokens || 0,
        taskType,
        status: 'success',
        duration: callRecord.duration
      })
      
      // 保存历史
      this.historyManager.save({
        projectId,
        callId,
        taskType,
        input: messages,
        output: result.content,
        model: selectedModel,
        tokens: result.usage
      })
      
      // 缓存结果
      if (useCache) {
        const cacheKey = this.cacheManager.generateKey(selectedModel, messages, { temperature: actualTemperature, maxTokens: actualMaxTokens })
        this.cacheManager.set(cacheKey, result)
      }
      
      return {
        callId,
        cached: false,
        ...result,
        model: selectedModel,
        duration: callRecord.duration
      }
    } catch (error) {
      callRecord.status = CallStatus.FAILED
      callRecord.error = error.message
      callRecord.endTime = Date.now()
      
      // 记录失败
      this.costTracker.record({
        model: selectedModel,
        inputTokens: 0,
        outputTokens: 0,
        taskType,
        status: 'failed',
        duration: Date.now() - startTime
      })
      
      throw error
    } finally {
      this.runningCalls.delete(callId)
      this.rateLimiter.release()
    }
  }

  /**
   * 流式调用
   * @param {object} params - 参数
   * @param {Function} onChunk - 流式回调
   * @returns {Promise<object>}
   */
  async callStream(params, onChunk) {
    return this.call({ ...params, stream: true, onChunk })
  }

  /**
   * 取消调用
   * @param {string} callId - 调用ID
   * @returns {boolean}
   */
  cancel(callId) {
    const call = this.runningCalls.get(callId)
    if (call && call.status === CallStatus.RUNNING) {
      call.status = CallStatus.CANCELLED
      return true
    }
    return false
  }

  /**
   * 获取任务推荐模型
   * @param {string} taskType - 任务类型
   * @returns {object}
   */
  getRecommendedModels(taskType) {
    const config = TASK_MODEL_CONFIG[taskType] || TASK_MODEL_CONFIG[TaskType.GENERAL]
    return {
      primary: config.primaryModel,
      secondary: config.secondaryModel,
      fallback: config.fallbackModel,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    }
  }

  /**
   * 获取成本统计
   * @returns {object}
   */
  getCostStats() {
    return {
      today: this.costTracker.getTodayCost(),
      month: this.costTracker.getMonthCost(),
      total: this.costTracker.getTotalCost()
    }
  }

  /**
   * 获取流量状态
   * @returns {object}
   */
  getRateStatus() {
    return this.rateLimiter.getStatus()
  }

  /**
   * 获取缓存状态
   * @returns {object}
   */
  getCacheStats() {
    return this.cacheManager.getStats()
  }

  /**
   * 获取运行中的调用
   * @returns {object[]}
   */
  getRunningCalls() {
    return Array.from(this.runningCalls.values())
  }

  /**
   * 获取历史记录
   * @param {number} [projectId] - 项目ID
   * @param {number} [limit=20] - 返回数量
   * @returns {object[]}
   */
  getHistory(projectId, limit = 20) {
    if (projectId) {
      return this.historyManager.getProjectHistory(projectId, limit)
    }
    return this.historyManager.getGlobalHistory(limit)
  }

  /**
   * 回滚到指定记录
   * @param {string} callId - 调用ID
   * @returns {object|null}
   */
  rollback(callId) {
    return this.historyManager.rollback(callId)
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cacheManager.clear()
  }

  /**
   * 清除历史
   * @param {number} [projectId] - 项目ID
   */
  clearHistory(projectId) {
    if (projectId) {
      this.historyManager.clearProjectHistory(projectId)
    } else {
      this.historyManager.clearAll()
    }
  }

  /**
   * 清除项目数据
   * @param {number} projectId - 项目ID
   */
  clearProject(projectId) {
    this.historyManager.clearProjectHistory(projectId)
    if (this.smartTracking) {
      this.smartTracking.clearProject(projectId)
    }
    if (this.vectorMemory) {
      this.vectorMemory.deleteByProject(projectId)
    }
  }

  // ---------- 私有方法 ----------

  /**
   * 生成调用ID
   * @private
   */
  _generateCallId() {
    return `call_${Date.now()}_${++this.callCounter}`
  }

  /**
   * 执行普通调用
   * @private
   */
  async _executeCall(model, messages, temperature, maxTokens) {
    const response = await this.aiProvider.chat(messages, {
      model,
      temperature,
      maxTokens
    })
    
    return {
      content: response.content,
      usage: {
        inputTokens: response.usage?.input_tokens || response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.output_tokens || response.usage?.completion_tokens || 0
      }
    }
  }

  /**
   * 执行流式调用
   * @private
   */
  async _executeStreamCall(model, messages, temperature, maxTokens, onChunk) {
    let fullContent = ''
    let inputTokens = 0
    
    const content = await this.aiProvider.chatStream(messages, (chunk, accumulated) => {
      fullContent = accumulated
      if (onChunk) onChunk(chunk, accumulated)
    }, {
      model,
      temperature,
      maxTokens
    })
    
    // 估算 token 数
    inputTokens = this._estimateTokens(messages.map(m => m.content).join(''))
    const outputTokens = this._estimateTokens(content)
    
    return {
      content,
      usage: {
        inputTokens,
        outputTokens
      }
    }
  }

  /**
   * 带重试的执行
   * @private
   */
  async _executeWithRetry(execFn, callId) {
    let lastError = null
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await execFn()
      } catch (error) {
        lastError = error
        
        // 检查是否应该重试
        if (!this._shouldRetry(error)) {
          throw error
        }
        
        // 最后一次尝试失败
        if (attempt >= this.config.maxRetries) {
          break
        }
        
        // 计算延迟
        const delay = this.config.retryDelay * Math.pow(this.config.retryBackoff, attempt)
        console.warn(`[AIOrchestrator] 调用 ${callId} 第 ${attempt + 1} 次重试，${delay}ms 后执行`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError
  }

  /**
   * 判断是否应该重试
   * @private
   */
  _shouldRetry(error) {
    const message = error.message?.toLowerCase() || ''
    
    // 认证错误不重试
    if (message.includes('401') || message.includes('unauthorized') || message.includes('invalid api key')) {
      return false
    }
    
    // 请求错误不重试
    if (message.includes('400') || message.includes('bad request')) {
      return false
    }
    
    // 内容过滤不重试
    if (message.includes('content_filter') || message.includes('content policy')) {
      return false
    }
    
    return true
  }

  /**
   * 估算 token 数
   * @private
   */
  _estimateTokens(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const otherChars = text.length - chineseChars
    return Math.ceil(chineseChars / 1.5 + otherChars / 4)
  }
}

// ==================== 便捷方法 ====================

/**
 * 创建 AI 编排器实例
 * @param {object} config - 配置
 * @returns {AIOrchestrator}
 */
function createOrchestrator(config) {
  return new AIOrchestrator(config)
}

// ==================== 统一导出 ====================

const aiOrchestrator = {
  // 主类
  AIOrchestrator,
  CacheManager,
  RateLimiter,
  CostTracker,
  ContextManager,
  HistoryManager,
  
  // 枚举
  TaskType,
  CallStatus,
  ModelPriority,
  
  // 配置
  DEFAULT_CONFIG,
  TASK_MODEL_CONFIG,
  MODEL_PRICING,
  
  // 工厂方法
  create: createOrchestrator,
  createOrchestrator
}

export default aiOrchestrator
export {
  AIOrchestrator,
  CacheManager,
  RateLimiter,
  CostTracker,
  ContextManager,
  HistoryManager,
  TaskType,
  CallStatus,
  ModelPriority,
  DEFAULT_CONFIG,
  TASK_MODEL_CONFIG,
  MODEL_PRICING,
  createOrchestrator
}

/**
 * 云书 - 向量长期记忆系统
 * 对标 MuMuAINovel 的 ChromaDB 方案，在浏览器端实现
 * 使用 transformers.js 运行嵌入模型，IndexedDB 存储向量
 * 支持语义检索、自动嵌入、增量更新、上下文构建
 *
 * 【待集成】此模块已实现完整功能，计划在 v2.3.0 中集成到主应用。
 * 集成方式：在对应的视图组件中 import 并调用。
 * 依赖：需要先初始化 database.js（IndexedDB）作为主存储。
 */

// ==================== 常量定义 ====================

/**
 * 记忆类型枚举
 * @enum {string}
 */
const MemoryType = {
  CHAPTER_SUMMARY: 'chapter_summary',    // 章节摘要
  CHARACTER_INFO: 'character_info',      // 角色信息
  WORLD_SETTING: 'world_setting',        // 世界观设定
  FORESHADOWING: 'foreshadowing',        // 伏笔线索
  USER_NOTE: 'user_note',                // 用户笔记
  PLOT_POINT: 'plot_point',              // 情节节点
  DIALOGUE: 'dialogue',                  // 对话记录
  SCENE: 'scene'                         // 场景描述
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG = {
  // 嵌入模型配置
  embeddingModel: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', // 支持中文的轻量级模型
  embeddingDimension: 384,  // 向量维度
  
  // 检索配置
  defaultTopK: 5,           // 默认返回结果数
  similarityThreshold: 0.5, // 相似度阈值
  
  // 上下文构建配置
  maxContextTokens: 4000,   // 最大上下文 token 数
  maxMemoryAge: 30 * 24 * 60 * 60 * 1000, // 记忆最大保留时间（30天）
  
  // IndexedDB 配置
  dbName: 'YunshuVectorMemory',
  dbVersion: 1,
  storeName: 'memories'
}

// ==================== IndexedDB 存储层 ====================

/**
 * IndexedDB 向量存储类
 * 负责向量的持久化存储和检索
 */
class VectorStore {
  /**
   * @param {object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.db = null
    this.isReady = false
  }

  /**
   * 初始化 IndexedDB
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isReady) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.dbVersion)

      request.onerror = () => {
        console.error('[VectorStore] IndexedDB 打开失败:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        this.isReady = true
        console.log('[VectorStore] IndexedDB 初始化成功')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // 创建记忆存储表
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' })
          
          // 创建索引
          store.createIndex('projectId', 'projectId', { unique: false })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
          store.createIndex('projectId_type', ['projectId', 'type'], { unique: false })
          
          console.log('[VectorStore] 创建对象存储:', this.config.storeName)
        }
      }
    })
  }

  /**
   * 存储记忆记录
   * @param {object} memory - 记忆对象
   * @param {string} memory.id - 唯一标识
   * @param {number} memory.projectId - 项目ID
   * @param {string} memory.type - 记忆类型
   * @param {string} memory.text - 文本内容
   * @param {number[]} memory.embedding - 嵌入向量
   * @param {object} memory.metadata - 元数据
   * @returns {Promise<void>}
   */
  async store(memory) {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      
      const record = {
        ...memory,
        updatedAt: Date.now()
      }
      
      if (!record.createdAt) {
        record.createdAt = Date.now()
      }
      
      const request = store.put(record)
      
      request.onsuccess = () => {
        console.log(`[VectorStore] 已存储记忆: ${memory.id}`)
        resolve()
      }
      
      request.onerror = () => {
        console.error('[VectorStore] 存储失败:', request.error)
        reject(request.error)
      }
    })
  }

  /**
   * 批量存储记忆
   * @param {object[]} memories - 记忆数组
   * @returns {Promise<void>}
   */
  async bulkStore(memories) {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      
      let successCount = 0
      
      for (const memory of memories) {
        const record = {
          ...memory,
          updatedAt: Date.now()
        }
        
        if (!record.createdAt) {
          record.createdAt = Date.now()
        }
        
        const request = store.put(record)
        request.onsuccess = () => successCount++
      }
      
      transaction.oncomplete = () => {
        console.log(`[VectorStore] 批量存储完成: ${successCount}/${memories.length}`)
        resolve()
      }
      
      transaction.onerror = () => {
        reject(transaction.error)
      }
    })
  }

  /**
   * 获取单个记忆
   * @param {string} id - 记忆ID
   * @returns {Promise<object|null>}
   */
  async get(id) {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.get(id)
      
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取项目的所有记忆
   * @param {number} projectId - 项目ID
   * @param {string} [type] - 可选的类型过滤
   * @returns {Promise<object[]>}
   */
  async getByProject(projectId, type = null) {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      
      let request
      if (type) {
        const index = store.index('projectId_type')
        request = index.getAll([projectId, type])
      } else {
        const index = store.index('projectId')
        request = index.getAll(projectId)
      }
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取所有记忆
   * @returns {Promise<object[]>}
   */
  async getAll() {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.getAll()
      
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 删除记忆
   * @param {string} id - 记忆ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.delete(id)
      
      request.onsuccess = () => {
        console.log(`[VectorStore] 已删除记忆: ${id}`)
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 删除项目的所有记忆
   * @param {number} projectId - 项目ID
   * @returns {Promise<void>}
   */
  async deleteByProject(projectId) {
    await this._ensureReady()
    
    const memories = await this.getByProject(projectId)
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      
      for (const memory of memories) {
        store.delete(memory.id)
      }
      
      transaction.oncomplete = () => {
        console.log(`[VectorStore] 已删除项目 ${projectId} 的 ${memories.length} 条记忆`)
        resolve()
      }
      transaction.onerror = () => reject(transaction.error)
    })
  }

  /**
   * 清空所有记忆
   * @returns {Promise<void>}
   */
  async clear() {
    await this._ensureReady()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.config.storeName], 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.clear()
      
      request.onsuccess = () => {
        console.log('[VectorStore] 已清空所有记忆')
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 确保数据库已就绪
   * @private
   */
  async _ensureReady() {
    if (!this.isReady) {
      await this.initialize()
    }
  }
}

// ==================== 嵌入模型服务 ====================

/**
 * 嵌入模型服务
 * 使用 transformers.js 在浏览器端运行嵌入模型
 */
class EmbeddingService {
  /**
   * @param {object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.extractor = null
    this.isReady = false
    this.isLoading = false
    this.loadProgress = 0
  }

  /**
   * 初始化嵌入模型
   * @param {Function} [onProgress] - 加载进度回调
   * @returns {Promise<void>}
   */
  async initialize(onProgress = null) {
    if (this.isReady) return
    if (this.isLoading) {
      // 等待正在进行的加载完成
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    this.isLoading = true
    
    try {
      // 动态导入 transformers.js
      const { pipeline } = await import('@xenova/transformers')
      
      console.log(`[EmbeddingService] 正在加载嵌入模型: ${this.config.embeddingModel}`)
      
      // 创建特征提取 pipeline
      this.extractor = await pipeline(
        'feature-extraction',
        this.config.embeddingModel,
        {
          progress_callback: (progress) => {
            this.loadProgress = progress
            if (onProgress) onProgress(progress)
          }
        }
      )
      
      this.isReady = true
      console.log('[EmbeddingService] 嵌入模型加载完成')
    } catch (error) {
      console.error('[EmbeddingService] 模型加载失败:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  /**
   * 生成文本嵌入向量
   * @param {string} text - 输入文本
   * @returns {Promise<number[]>} 嵌入向量
   */
  async embed(text) {
    if (!this.isReady) {
      await this.initialize()
    }

    try {
      // 使用模型生成嵌入
      const output = await this.extractor(text, {
        pooling: 'mean',
        normalize: true
      })
      
      // 转换为普通数组
      const embedding = Array.from(output.data)
      
      return embedding
    } catch (error) {
      console.error('[EmbeddingService] 嵌入生成失败:', error)
      throw error
    }
  }

  /**
   * 批量生成嵌入向量
   * @param {string[]} texts - 文本数组
   * @returns {Promise<number[][]>} 嵌入向量数组
   */
  async embedBatch(texts) {
    const embeddings = []
    for (const text of texts) {
      const embedding = await this.embed(text)
      embeddings.push(embedding)
    }
    return embeddings
  }

  /**
   * 获取嵌入向量维度
   * @returns {number}
   */
  getDimension() {
    return this.config.embeddingDimension
  }
}

// ==================== 相似度计算 ====================

/**
 * 计算余弦相似度
 * @param {number[]} vecA - 向量A
 * @param {number[]} vecB - 向量B
 * @returns {number} 相似度 (-1 到 1)
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('向量维度不匹配')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * 计算欧几里得距离
 * @param {number[]} vecA - 向量A
 * @param {number[]} vecB - 向量B
 * @returns {number} 距离 (越小越相似)
 */
function euclideanDistance(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('向量维度不匹配')
  }

  let sum = 0
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i]
    sum += diff * diff
  }

  return Math.sqrt(sum)
}

// ==================== 向量记忆主类 ====================

/**
 * VectorMemory 主类
 * 向量长期记忆系统，支持语义检索和上下文构建
 */
class VectorMemory {
  /**
   * @param {object} config - 配置选项
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.vectorStore = new VectorStore(this.config)
    this.embeddingService = new EmbeddingService(this.config)
    this.isReady = false
    
    // 缓存最近使用的嵌入
    this._embeddingCache = new Map()
    this._cacheMaxSize = 100
  }

  /**
   * 初始化向量记忆系统
   * @param {Function} [onProgress] - 模型加载进度回调
   * @returns {Promise<void>}
   */
  async initialize(onProgress = null) {
    if (this.isReady) return

    try {
      // 初始化向量存储
      await this.vectorStore.initialize()
      
      // 初始化嵌入模型（异步，不阻塞）
      this.embeddingService.initialize(onProgress).then(() => {
        console.log('[VectorMemory] 嵌入模型加载完成')
      }).catch(error => {
        console.warn('[VectorMemory] 嵌入模型加载失败，将在首次使用时重试:', error)
      })
      
      this.isReady = true
      console.log('[VectorMemory] 向量记忆系统初始化完成')
    } catch (error) {
      console.error('[VectorMemory] 初始化失败:', error)
      throw error
    }
  }

  /**
   * 生成文本嵌入向量
   * @param {string} text - 输入文本
   * @returns {Promise<number[]>} 嵌入向量
   */
  async embed(text) {
    // 检查缓存
    const cacheKey = this._getCacheKey(text)
    if (this._embeddingCache.has(cacheKey)) {
      return this._embeddingCache.get(cacheKey)
    }

    const embedding = await this.embeddingService.embed(text)
    
    // 更新缓存
    this._updateCache(cacheKey, embedding)
    
    return embedding
  }

  /**
   * 存储记忆
   * @param {string} id - 唯一标识
   * @param {string} text - 文本内容
   * @param {object} metadata - 元数据
   * @param {number} metadata.projectId - 项目ID
   * @param {string} metadata.type - 记忆类型
   * @param {object} [metadata.extra] - 额外元数据
   * @returns {Promise<object>} 存储的记忆对象
   */
  async store(id, text, metadata) {
    // 生成嵌入向量
    const embedding = await this.embed(text)
    
    const memory = {
      id,
      text,
      embedding,
      projectId: metadata.projectId,
      type: metadata.type,
      metadata: metadata.extra || {},
      createdAt: Date.now()
    }
    
    await this.vectorStore.store(memory)
    
    console.log(`[VectorMemory] 已存储记忆: ${id}, 类型: ${metadata.type}`)
    return memory
  }

  /**
   * 批量存储记忆
   * @param {Array<{id: string, text: string, metadata: object}>} items - 记忆项数组
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object[]>} 存储的记忆对象数组
   */
  async bulkStore(items, onProgress = null) {
    const memories = []
    const total = items.length
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const embedding = await this.embed(item.text)
      
      memories.push({
        id: item.id,
        text: item.text,
        embedding,
        projectId: item.metadata.projectId,
        type: item.metadata.type,
        metadata: item.metadata.extra || {},
        createdAt: Date.now()
      })
      
      if (onProgress) {
        onProgress({ current: i + 1, total })
      }
    }
    
    await this.vectorStore.bulkStore(memories)
    console.log(`[VectorMemory] 批量存储完成: ${memories.length} 条`)
    
    return memories
  }

  /**
   * 语义检索
   * @param {string} query - 查询文本
   * @param {object} options - 检索选项
   * @param {number} [options.topK=5] - 返回结果数
   * @param {number} [options.projectId] - 项目ID过滤
   * @param {string} [options.type] - 类型过滤
   * @param {number} [options.threshold] - 相似度阈值
   * @returns {Promise<Array<{memory: object, similarity: number}>>}
   */
  async search(query, options = {}) {
    const {
      topK = this.config.defaultTopK,
      projectId = null,
      type = null,
      threshold = this.config.similarityThreshold
    } = options

    // 生成查询向量
    const queryEmbedding = await this.embed(query)
    
    // 获取候选记忆
    let memories
    if (projectId) {
      memories = await this.vectorStore.getByProject(projectId, type)
    } else {
      memories = await this.vectorStore.getAll()
    }
    
    // 计算相似度
    const results = []
    for (const memory of memories) {
      if (!memory.embedding) continue
      
      const similarity = cosineSimilarity(queryEmbedding, memory.embedding)
      
      if (similarity >= threshold) {
        results.push({
          memory: {
            id: memory.id,
            text: memory.text,
            type: memory.type,
            projectId: memory.projectId,
            metadata: memory.metadata,
            createdAt: memory.createdAt
          },
          similarity
        })
      }
    }
    
    // 按相似度排序并返回 topK
    results.sort((a, b) => b.similarity - a.similarity)
    const topResults = results.slice(0, topK)
    
    console.log(`[VectorMemory] 检索完成: 查询="${query.slice(0, 30)}...", 结果=${topResults.length}/${memories.length}`)
    
    return topResults
  }

  /**
   * 构建AI上下文
   * 根据当前写作内容，自动检索相关记忆构建AI上下文
   * @param {string} currentText - 当前写作内容
   * @param {object} options - 选项
   * @param {number} [options.maxTokens=4000] - 最大token数
   * @param {number} [options.projectId] - 项目ID
   * @param {string[]} [options.includeTypes] - 包含的记忆类型
   * @param {string[]} [options.excludeTypes] - 排除的记忆类型
   * @returns {Promise<{context: string, sources: object[], tokenCount: number}>}
   */
  async buildContext(currentText, options = {}) {
    const {
      maxTokens = this.config.maxContextTokens,
      projectId = null,
      includeTypes = null,
      excludeTypes = null
    } = options

    // 从当前文本提取关键词进行检索
    const keywords = this._extractKeywords(currentText)
    const searchQuery = keywords.slice(0, 5).join(' ') || currentText.slice(0, 200)
    
    // 检索相关记忆
    const searchResults = await this.search(searchQuery, {
      topK: 20,
      projectId,
      threshold: 0.3
    })
    
    // 过滤记忆类型
    let filteredResults = searchResults
    if (includeTypes) {
      filteredResults = filteredResults.filter(r => includeTypes.includes(r.memory.type))
    }
    if (excludeTypes) {
      filteredResults = filteredResults.filter(r => !excludeTypes.includes(r.memory.type))
    }
    
    // 构建上下文文本
    const contextParts = []
    const sources = []
    let estimatedTokens = 0
    
    for (const result of filteredResults) {
      const memory = result.memory
      const typeLabel = this._getTypeLabel(memory.type)
      const text = `[${typeLabel}] ${memory.text}`
      const textTokens = this._estimateTokens(text)
      
      if (estimatedTokens + textTokens > maxTokens) {
        break
      }
      
      contextParts.push(text)
      sources.push({
        id: memory.id,
        type: memory.type,
        similarity: result.similarity
      })
      estimatedTokens += textTokens
    }
    
    const context = contextParts.join('\n\n')
    
    console.log(`[VectorMemory] 构建上下文完成: ${sources.length} 条记忆, 约 ${estimatedTokens} tokens`)
    
    return {
      context,
      sources,
      tokenCount: estimatedTokens
    }
  }

  /**
   * 更新记忆
   * @param {string} id - 记忆ID
   * @param {string} newText - 新文本内容
   * @param {object} [newMetadata] - 新元数据
   * @returns {Promise<object>} 更新后的记忆
   */
  async update(id, newText, newMetadata = null) {
    const existing = await this.vectorStore.get(id)
    if (!existing) {
      throw new Error(`记忆不存在: ${id}`)
    }
    
    // 检查文本是否变化
    if (existing.text === newText && !newMetadata) {
      return existing
    }
    
    // 重新生成嵌入（如果文本变化）
    let embedding = existing.embedding
    if (existing.text !== newText) {
      embedding = await this.embed(newText)
    }
    
    const updated = {
      ...existing,
      text: newText,
      embedding,
      updatedAt: Date.now()
    }
    
    if (newMetadata) {
      updated.projectId = newMetadata.projectId ?? existing.projectId
      updated.type = newMetadata.type ?? existing.type
      updated.metadata = { ...existing.metadata, ...newMetadata.extra }
    }
    
    await this.vectorStore.store(updated)
    
    console.log(`[VectorMemory] 已更新记忆: ${id}`)
    return updated
  }

  /**
   * 删除记忆
   * @param {string} id - 记忆ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.vectorStore.delete(id)
    console.log(`[VectorMemory] 已删除记忆: ${id}`)
  }

  /**
   * 删除项目的所有记忆
   * @param {number} projectId - 项目ID
   * @returns {Promise<void>}
   */
  async deleteByProject(projectId) {
    await this.vectorStore.deleteByProject(projectId)
    console.log(`[VectorMemory] 已删除项目 ${projectId} 的所有记忆`)
  }

  /**
   * 清空所有记忆
   * @returns {Promise<void>}
   */
  async clear() {
    await this.vectorStore.clear()
    this._embeddingCache.clear()
    console.log('[VectorMemory] 已清空所有记忆')
  }

  /**
   * 获取记忆统计信息
   * @param {number} [projectId] - 项目ID
   * @returns {Promise<object>}
   */
  async getStats(projectId = null) {
    const memories = projectId 
      ? await this.vectorStore.getByProject(projectId)
      : await this.vectorStore.getAll()
    
    const stats = {
      total: memories.length,
      byType: {},
      oldestMemory: null,
      newestMemory: null
    }
    
    for (const memory of memories) {
      // 按类型统计
      if (!stats.byType[memory.type]) {
        stats.byType[memory.type] = 0
      }
      stats.byType[memory.type]++
      
      // 时间范围
      if (!stats.oldestMemory || memory.createdAt < stats.oldestMemory) {
        stats.oldestMemory = memory.createdAt
      }
      if (!stats.newestMemory || memory.createdAt > stats.newestMemory) {
        stats.newestMemory = memory.createdAt
      }
    }
    
    return stats
  }

  /**
   * 检查嵌入模型是否就绪
   * @returns {boolean}
   */
  isEmbeddingReady() {
    return this.embeddingService.isReady
  }

  /**
   * 获取嵌入模型加载进度
   * @returns {number} 0-1 之间的进度值
   */
  getEmbeddingProgress() {
    return this.embeddingService.loadProgress
  }

  // ---------- 私有方法 ----------

  /**
   * 生成缓存键
   * @private
   */
  _getCacheKey(text) {
    // 简单的文本哈希
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString()
  }

  /**
   * 更新缓存
   * @private
   */
  _updateCache(key, embedding) {
    if (this._embeddingCache.size >= this._cacheMaxSize) {
      // 删除最早的缓存项
      const firstKey = this._embeddingCache.keys().next().value
      this._embeddingCache.delete(firstKey)
    }
    this._embeddingCache.set(key, embedding)
  }

  /**
   * 提取关键词
   * @private
   */
  _extractKeywords(text) {
    // 简单的关键词提取（按词频）
    const words = text.split(/[\s，。！？、；：""''（）【】《》\n]+/)
    const wordCount = {}
    
    for (const word of words) {
      if (word.length >= 2 && word.length <= 10) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    }
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word)
  }

  /**
   * 估算 token 数
   * @private
   */
  _estimateTokens(text) {
    // 简单估算：中文约 1.5 字/token，英文约 4 字符/token
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const otherChars = text.length - chineseChars
    return Math.ceil(chineseChars / 1.5 + otherChars / 4)
  }

  /**
   * 获取记忆类型标签
   * @private
   */
  _getTypeLabel(type) {
    const labels = {
      [MemoryType.CHAPTER_SUMMARY]: '章节摘要',
      [MemoryType.CHARACTER_INFO]: '角色信息',
      [MemoryType.WORLD_SETTING]: '世界观设定',
      [MemoryType.FORESHADOWING]: '伏笔线索',
      [MemoryType.USER_NOTE]: '用户笔记',
      [MemoryType.PLOT_POINT]: '情节节点',
      [MemoryType.DIALOGUE]: '对话记录',
      [MemoryType.SCENE]: '场景描述'
    }
    return labels[type] || type
  }
}

// ==================== 便捷方法 ====================

/**
 * 创建向量记忆实例
 * @param {object} [config] - 配置选项
 * @returns {VectorMemory}
 */
function createVectorMemory(config = {}) {
  return new VectorMemory(config)
}

// ==================== 统一导出 ====================

const vectorMemory = {
  // 主类
  VectorMemory,
  VectorStore,
  EmbeddingService,
  
  // 枚举
  MemoryType,
  
  // 工具函数
  cosineSimilarity,
  euclideanDistance,
  createVectorMemory,
  
  // 默认配置
  DEFAULT_CONFIG,
  
  // 创建默认实例
  create: () => new VectorMemory()
}

export default vectorMemory
export {
  VectorMemory,
  VectorStore,
  EmbeddingService,
  MemoryType,
  cosineSimilarity,
  euclideanDistance,
  createVectorMemory,
  DEFAULT_CONFIG
}

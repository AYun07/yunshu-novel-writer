/**
 * megaNovelEngine.js - 百万字长篇小说引擎
 * 
 * 功能说明：
 * 1. 项目结构管理：项目 → 卷 → 章 → 节
 * 2. 智能上下文管理：自动摘要链、角色状态追踪、世界观一致性检查
 * 3. 批量生成：大纲生成、章节批量生成、断点续传
 * 4. 上下文窗口优化：动态Token计算、关键信息优先注入、冗余信息裁剪
 * 5. 质量控制：自动检查、不合格重写、人工审核队列
 * 6. 进度追踪：字数统计、写作热力图、预计完成时间
 */

import { ref, reactive, computed } from 'vue'
import apiService from './api.js'

// ==================== 常量定义 ====================

// Token 限制常量
const TOKEN_LIMITS = {
  GPT_4O: 128000,           // GPT-4o 上下文窗口
  GPT_4_TURBO: 128000,      // GPT-4 Turbo 上下文窗口
  GPT_35_TURBO: 16385,      // GPT-3.5 Turbo 上下文窗口
  CLAUDE_3: 200000,         // Claude 3 上下文窗口
  DEEPSEEK: 64000,          // DeepSeek 上下文窗口
  RESERVED_OUTPUT: 4096,    // 预留输出 Token
  SAFETY_MARGIN: 0.9        // 安全边际（使用90%的上下文窗口）
}

// 章节状态
const CHAPTER_STATUS = {
  TODO: 'todo',             // 待写
  OUTLINE: 'outline',       // 已有大纲
  GENERATING: 'generating', // 生成中
  DRAFT: 'draft',           // 初稿完成
  REVIEWING: 'reviewing',   // 审核中
  REVISION: 'revision',     // 需要修改
  COMPLETED: 'completed'    // 已完成
}

// 质量检查结果
const QUALITY_RESULT = {
  PASS: 'pass',             // 通过
  WARNING: 'warning',       // 警告
  FAIL: 'fail'              // 不通过
}

// ==================== 工具函数 ====================

/**
 * 估算文本 Token 数量
 * 中文约 1.5 字/token，英文约 4 字符/token
 * @param {string} text - 输入文本
 * @returns {number} 估算的 Token 数量
 */
function estimateTokens(text) {
  if (!text) return 0
  
  // 区分中文字符和英文字符
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishChars = text.length - chineseChars
  
  // 中文约 1.5 字/token，英文约 4 字符/token
  const chineseTokens = Math.ceil(chineseChars / 1.5)
  const englishTokens = Math.ceil(englishChars / 4)
  
  return chineseTokens + englishTokens
}

/**
 * 生成唯一 ID
 * @returns {string} 唯一 ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ==================== 核心引擎类 ====================

/**
 * MegaNovelEngine - 百万字长篇小说引擎
 * 
 * 提供完整的长篇小说创作支持，包括：
 * - 项目结构管理
 * - 智能上下文管理
 * - 批量生成与断点续传
 * - 质量控制
 * - 进度追踪
 */
class MegaNovelEngine {
  constructor() {
    // ==================== 项目状态 ====================
    
    // 当前项目
    this.currentProject = ref(null)
    
    // 卷列表
    this.volumes = ref([])
    
    // 章节列表
    this.chapters = ref([])
    
    // 角色列表
    this.characters = ref([])
    
    // 世界观设定
    this.worldSettings = ref([])
    
    // 摘要链（每章摘要）
    this.summaryChain = ref([])
    
    // 角色状态追踪
    this.characterStates = ref({})
    
    // 生成队列
    this.generationQueue = ref([])
    
    // 审核队列
    this.reviewQueue = ref([])
    
    // 进度统计
    this.progress = reactive({
      totalWords: 0,
      targetWords: 1000000,
      completedChapters: 0,
      totalChapters: 0,
      dailyWords: {},
      startDate: null,
      estimatedEndDate: null
    })
    
    // 生成状态
    this.generationStatus = reactive({
      isGenerating: false,
      currentChapter: null,
      progress: 0,
      message: ''
    })
    
    // API 配置
    this.apiConfig = reactive({
      model: 'gpt-4o',
      maxTokens: 4096,
      temperature: 0.7,
      contextWindow: TOKEN_LIMITS.GPT_4O
    })
    
    // 检查点（用于断点续传）
    this.checkpoint = ref(null)
  }
  
  // ==================== 项目管理 ====================
  
  /**
   * 创建新项目
   * @param {Object} projectInfo - 项目信息
   * @returns {Object} 创建的项目
   */
  createProject(projectInfo) {
    const project = {
      id: generateId(),
      title: projectInfo.title || '未命名小说',
      genre: projectInfo.genre || '',
      theme: projectInfo.theme || '',
      intro: projectInfo.intro || '',
      targetWords: projectInfo.targetWords || 1000000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    }
    
    this.currentProject.value = project
    this.progress.targetWords = project.targetWords
    this.progress.startDate = project.createdAt
    
    // 保存到本地存储
    this.saveToLocalStorage()
    
    return project
  }
  
  /**
   * 加载项目
   * @param {string} projectId - 项目 ID
   * @returns {Object|null} 加载的项目
   */
  loadProject(projectId) {
    try {
      const saved = localStorage.getItem(`megaNovel_${projectId}`)
      if (saved) {
        const data = JSON.parse(saved)
        this.currentProject.value = data.project
        this.volumes.value = data.volumes || []
        this.chapters.value = data.chapters || []
        this.characters.value = data.characters || []
        this.worldSettings.value = data.worldSettings || []
        this.summaryChain.value = data.summaryChain || []
        this.characterStates.value = data.characterStates || {}
        this.progress = { ...this.progress, ...data.progress }
        this.checkpoint.value = data.checkpoint || null
        
        return this.currentProject.value
      }
    } catch (error) {
      console.error('加载项目失败:', error)
    }
    return null
  }
  
  /**
   * 保存项目到本地存储
   */
  saveToLocalStorage() {
    if (!this.currentProject.value) return
    
    const data = {
      project: this.currentProject.value,
      volumes: this.volumes.value,
      chapters: this.chapters.value,
      characters: this.characters.value,
      worldSettings: this.worldSettings.value,
      summaryChain: this.summaryChain.value,
      characterStates: this.characterStates.value,
      progress: this.progress,
      checkpoint: this.checkpoint.value
    }
    
    localStorage.setItem(`megaNovel_${this.currentProject.value.id}`, JSON.stringify(data))
  }
  
  // ==================== 卷管理 ====================
  
  /**
   * 添加卷
   * @param {Object} volumeInfo - 卷信息
   * @returns {Object} 创建的卷
   */
  addVolume(volumeInfo) {
    const volume = {
      id: generateId(),
      title: volumeInfo.title || `第${this.volumes.value.length + 1}卷`,
      description: volumeInfo.description || '',
      order: this.volumes.value.length,
      createdAt: new Date().toISOString()
    }
    
    this.volumes.value.push(volume)
    this.saveToLocalStorage()
    
    return volume
  }
  
  /**
   * 更新卷
   * @param {string} volumeId - 卷 ID
   * @param {Object} updates - 更新内容
   */
  updateVolume(volumeId, updates) {
    const index = this.volumes.value.findIndex(v => v.id === volumeId)
    if (index !== -1) {
      this.volumes.value[index] = { ...this.volumes.value[index], ...updates }
      this.saveToLocalStorage()
    }
  }
  
  /**
   * 删除卷
   * @param {string} volumeId - 卷 ID
   */
  deleteVolume(volumeId) {
    this.volumes.value = this.volumes.value.filter(v => v.id !== volumeId)
    // 同时删除该卷下的所有章节
    this.chapters.value = this.chapters.value.filter(c => c.volumeId !== volumeId)
    this.saveToLocalStorage()
  }
  
  // ==================== 章节管理 ====================
  
  /**
   * 添加章节
   * @param {Object} chapterInfo - 章节信息
   * @returns {Object} 创建的章节
   */
  addChapter(chapterInfo) {
    const volumeId = chapterInfo.volumeId || (this.volumes.value[0]?.id || null)
    const volumeChapters = this.chapters.value.filter(c => c.volumeId === volumeId)
    
    const chapter = {
      id: generateId(),
      volumeId: volumeId,
      title: chapterInfo.title || `第${this.chapters.value.length + 1}章`,
      outline: chapterInfo.outline || '',
      content: '',
      summary: '',
      wordCount: 0,
      status: CHAPTER_STATUS.TODO,
      order: volumeChapters.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qualityScore: null,
      qualityIssues: [],
      context: {
        previousSummaries: [],
        characterStates: {},
        worldContext: ''
      }
    }
    
    this.chapters.value.push(chapter)
    this.progress.totalChapters = this.chapters.value.length
    this.saveToLocalStorage()
    
    return chapter
  }
  
  /**
   * 批量添加章节
   * @param {Array} chaptersInfo - 章节信息数组
   * @returns {Array} 创建的章节数组
   */
  batchAddChapters(chaptersInfo) {
    const addedChapters = []
    
    chaptersInfo.forEach((info, index) => {
      const chapter = this.addChapter({
        ...info,
        order: this.chapters.value.length
      })
      addedChapters.push(chapter)
    })
    
    return addedChapters
  }
  
  /**
   * 更新章节
   * @param {string} chapterId - 章节 ID
   * @param {Object} updates - 更新内容
   */
  updateChapter(chapterId, updates) {
    const index = this.chapters.value.findIndex(c => c.id === chapterId)
    if (index !== -1) {
      const chapter = this.chapters.value[index]
      this.chapters.value[index] = {
        ...chapter,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // 更新字数统计
      if (updates.content !== undefined) {
        this.updateWordCount()
      }
      
      this.saveToLocalStorage()
    }
  }
  
  /**
   * 删除章节
   * @param {string} chapterId - 章节 ID
   */
  deleteChapter(chapterId) {
    this.chapters.value = this.chapters.value.filter(c => c.id !== chapterId)
    this.progress.totalChapters = this.chapters.value.length
    this.updateWordCount()
    this.saveToLocalStorage()
  }
  
  /**
   * 获取章节列表（按卷分组）
   * @returns {Object} 按卷分组的章节
   */
  getChaptersByVolume() {
    const result = {}
    
    this.volumes.value.forEach(volume => {
      result[volume.id] = this.chapters.value
        .filter(c => c.volumeId === volume.id)
        .sort((a, b) => a.order - b.order)
    })
    
    // 未分组的章节
    const ungrouped = this.chapters.value.filter(c => !c.volumeId)
    if (ungrouped.length > 0) {
      result['ungrouped'] = ungrouped.sort((a, b) => a.order - b.order)
    }
    
    return result
  }
  
  // ==================== 角色管理 ====================
  
  /**
   * 添加角色
   * @param {Object} characterInfo - 角色信息
   * @returns {Object} 创建的角色
   */
  addCharacter(characterInfo) {
    const character = {
      id: generateId(),
      name: characterInfo.name || '未命名角色',
      description: characterInfo.description || '',
      traits: characterInfo.traits || [],
      background: characterInfo.background || '',
      relationships: characterInfo.relationships || [],
      currentState: {},
      createdAt: new Date().toISOString()
    }
    
    this.characters.value.push(character)
    this.characterStates.value[character.id] = {
      location: '',
      status: '',
      mood: '',
      relationships: {},
      lastAppearance: null
    }
    
    this.saveToLocalStorage()
    return character
  }
  
  /**
   * 更新角色状态
   * @param {string} characterId - 角色 ID
   * @param {string} chapterId - 章节 ID
   * @param {Object} state - 状态更新
   */
  updateCharacterState(characterId, chapterId, state) {
    if (!this.characterStates.value[characterId]) {
      this.characterStates.value[characterId] = {}
    }
    
    this.characterStates.value[characterId] = {
      ...this.characterStates.value[characterId],
      ...state,
      lastAppearance: chapterId,
      updatedAt: new Date().toISOString()
    }
    
    this.saveToLocalStorage()
  }
  
  // ==================== 世界观管理 ====================
  
  /**
   * 添加世界观设定
   * @param {Object} settingInfo - 世界观设定信息
   * @returns {Object} 创建的设定
   */
  addWorldSetting(settingInfo) {
    const setting = {
      id: generateId(),
      title: settingInfo.title || '未命名设定',
      category: settingInfo.category || 'general',
      content: settingInfo.content || '',
      rules: settingInfo.rules || [],
      createdAt: new Date().toISOString()
    }
    
    this.worldSettings.value.push(setting)
    this.saveToLocalStorage()
    
    return setting
  }
  
  // ==================== 智能上下文管理 ====================
  
  /**
   * 构建章节上下文
   * @param {string} chapterId - 章节 ID
   * @returns {Object} 上下文对象
   */
  buildChapterContext(chapterId) {
    const chapter = this.chapters.value.find(c => c.id === chapterId)
    if (!chapter) return null
    
    // 获取前几章的摘要
    const previousSummaries = this.getPreviousSummaries(chapterId, 3)
    
    // 获取相关角色状态
    const relevantCharacters = this.getRelevantCharacters(chapter.outline || chapter.content)
    
    // 获取世界观上下文
    const worldContext = this.buildWorldContext(chapter)
    
    // 计算上下文 Token
    const contextTokens = this.calculateContextTokens({
      summaries: previousSummaries,
      characters: relevantCharacters,
      worldContext: worldContext
    })
    
    return {
      previousSummaries,
      relevantCharacters,
      worldContext,
      contextTokens,
      availableTokens: this.apiConfig.contextWindow * TOKEN_LIMITS.SAFETY_MARGIN - TOKEN_LIMITS.RESERVED_OUTPUT
    }
  }
  
  /**
   * 获取前几章的摘要
   * @param {string} chapterId - 当前章节 ID
   * @param {number} count - 获取数量
   * @returns {Array} 摘要数组
   */
  getPreviousSummaries(chapterId, count = 3) {
    const chapterIndex = this.chapters.value.findIndex(c => c.id === chapterId)
    if (chapterIndex <= 0) return []
    
    const startIndex = Math.max(0, chapterIndex - count)
    const previousChapters = this.chapters.value.slice(startIndex, chapterIndex)
    
    return previousChapters
      .filter(c => c.summary)
      .map(c => ({
        chapterId: c.id,
        title: c.title,
        summary: c.summary
      }))
  }
  
  /**
   * 获取相关角色
   * @param {string} text - 文本内容
   * @returns {Array} 相关角色数组
   */
  getRelevantCharacters(text) {
    if (!text) return []
    
    return this.characters.value.filter(char => {
      // 检查角色名是否出现在文本中
      return text.includes(char.name)
    }).map(char => ({
      id: char.id,
      name: char.name,
      description: char.description,
      traits: char.traits,
      currentState: this.characterStates.value[char.id] || {}
    }))
  }
  
  /**
   * 构建世界观上下文
   * @param {Object} chapter - 章节对象
   * @returns {string} 世界观上下文
   */
  buildWorldContext(chapter) {
    const contexts = []
    
    // 添加所有世界观设定
    this.worldSettings.value.forEach(setting => {
      contexts.push(`【${setting.title}】\n${setting.content}`)
    })
    
    return contexts.join('\n\n')
  }
  
  /**
   * 计算上下文 Token 数量
   * @param {Object} context - 上下文对象
   * @returns {number} Token 数量
   */
  calculateContextTokens(context) {
    let total = 0
    
    // 摘要 Token
    if (context.summaries) {
      context.summaries.forEach(s => {
        total += estimateTokens(s.summary)
      })
    }
    
    // 角色 Token
    if (context.characters) {
      context.characters.forEach(c => {
        total += estimateTokens(c.name + c.description + JSON.stringify(c.currentState))
      })
    }
    
    // 世界观 Token
    if (context.worldContext) {
      total += estimateTokens(context.worldContext)
    }
    
    return total
  }
  
  /**
   * 优化上下文（裁剪冗余信息）
   * @param {Object} context - 原始上下文
   * @param {number} maxTokens - 最大 Token 数
   * @returns {Object} 优化后的上下文
   */
  optimizeContext(context, maxTokens) {
    let currentTokens = context.contextTokens
    
    if (currentTokens <= maxTokens) {
      return context
    }
    
    const optimized = { ...context }
    
    // 优先级：角色状态 > 世界观 > 摘要
    // 1. 裁剪摘要（保留最近的）
    while (currentTokens > maxTokens && optimized.previousSummaries.length > 1) {
      const removed = optimized.previousSummaries.shift()
      currentTokens -= estimateTokens(removed.summary)
    }
    
    // 2. 裁剪世界观
    if (currentTokens > maxTokens && optimized.worldContext) {
      const ratio = maxTokens / currentTokens
      const targetLength = Math.floor(optimized.worldContext.length * ratio)
      optimized.worldContext = optimized.worldContext.substring(0, targetLength)
      currentTokens = estimateTokens(optimized.worldContext)
    }
    
    optimized.contextTokens = currentTokens
    
    return optimized
  }
  
  // ==================== 摘要生成 ====================
  
  /**
   * 生成章节摘要
   * @param {string} chapterId - 章节 ID
   * @returns {Promise<string>} 生成的摘要
   */
  async generateChapterSummary(chapterId) {
    const chapter = this.chapters.value.find(c => c.id === chapterId)
    if (!chapter || !chapter.content) {
      throw new Error('章节内容为空，无法生成摘要')
    }
    
    const prompt = `请为以下小说章节生成一个简洁的摘要（100-150字），包含：
1. 主要情节事件
2. 角色状态变化
3. 重要伏笔或转折

章节标题：${chapter.title}

章节内容：
${chapter.content.substring(0, 3000)}

请直接输出摘要内容：`

    try {
      const summary = await apiService.generateTextStream(prompt, {
        temperature: 0.3,
        maxTokens: 500
      }, null)
      
      // 更新章节摘要
      this.updateChapter(chapterId, { summary })
      
      // 更新摘要链
      const summaryIndex = this.summaryChain.value.findIndex(s => s.chapterId === chapterId)
      const summaryEntry = { chapterId, title: chapter.title, summary }
      
      if (summaryIndex !== -1) {
        this.summaryChain.value[summaryIndex] = summaryEntry
      } else {
        this.summaryChain.value.push(summaryEntry)
      }
      
      this.saveToLocalStorage()
      
      return summary
    } catch (error) {
      console.error('生成摘要失败:', error)
      throw error
    }
  }
  
  // ==================== 批量生成 ====================
  
  /**
   * 生成整卷大纲
   * @param {string} volumeId - 卷 ID
   * @param {Object} options - 生成选项
   * @returns {Promise<Array>} 生成的章节大纲数组
   */
  async generateVolumeOutline(volumeId, options = {}) {
    const volume = this.volumes.value.find(v => v.id === volumeId)
    if (!volume) {
      throw new Error('未找到指定的卷')
    }
    
    const prompt = `请为以下小说卷生成详细的章节大纲：

小说标题：${this.currentProject.value?.title || '未命名'}
卷标题：${volume.title}
卷简介：${volume.description || '暂无简介'}
小说类型：${this.currentProject.value?.genre || '通用'}
小说主题：${this.currentProject.value?.theme || '通用'}

要求：
1. 生成 ${options.chapterCount || 10} 个章节的大纲
2. 每个章节用 "### 第X章 章节标题" 开头
3. 每个章节写 2-3 句话描述主要内容
4. 确保情节连贯，有起承转合
5. 包含主要角色的发展和冲突

请直接输出大纲内容：`

    try {
      const outline = await apiService.generateTextStream(prompt, {
        temperature: 0.7,
        maxTokens: 4000
      }, null)
      
      // 解析大纲，创建章节
      const chapters = this.parseOutlineToChapters(outline, volumeId)
      
      return chapters
    } catch (error) {
      console.error('生成卷大纲失败:', error)
      throw error
    }
  }
  
  /**
   * 解析大纲文本为章节
   * @param {string} outline - 大纲文本
   * @param {string} volumeId - 卷 ID
   * @returns {Array} 章节数组
   */
  parseOutlineToChapters(outline, volumeId) {
    const chapterRegex = /###\s*第?(\d+)[章节]?\s*(.+?)\n([\s\S]*?)(?=###|$)/g
    const chapters = []
    let match
    
    while ((match = chapterRegex.exec(outline)) !== null) {
      const chapter = this.addChapter({
        volumeId,
        title: `第${match[1]}章 ${match[2].trim()}`,
        outline: match[3].trim(),
        status: CHAPTER_STATUS.OUTLINE
      })
      chapters.push(chapter)
    }
    
    return chapters
  }
  
  /**
   * 批量生成章节内容
   * @param {Array} chapterIds - 章节 ID 数组
   * @param {Object} options - 生成选项
   * @returns {Promise<void>}
   */
  async batchGenerateChapters(chapterIds, options = {}) {
    if (this.generationStatus.isGenerating) {
      throw new Error('已有生成任务在进行中')
    }
    
    this.generationStatus.isGenerating = true
    this.generationQueue.value = chapterIds.map(id => ({
      chapterId: id,
      status: 'pending'
    }))
    
    // 保存检查点
    this.saveCheckpoint()
    
    try {
      for (let i = 0; i < chapterIds.length; i++) {
        const chapterId = chapterIds[i]
        
        // 更新状态
        this.generationStatus.currentChapter = chapterId
        this.generationStatus.progress = (i / chapterIds.length) * 100
        this.generationStatus.message = `正在生成第 ${i + 1}/${chapterIds.length} 章`
        
        // 更新队列状态
        const queueItem = this.generationQueue.value.find(q => q.chapterId === chapterId)
        if (queueItem) {
          queueItem.status = 'generating'
        }
        
        try {
          // 构建上下文
          const context = this.buildChapterContext(chapterId)
          const optimizedContext = this.optimizeContext(
            context,
            context.availableTokens
          )
          
          // 生成章节
          await this.generateChapterContent(chapterId, optimizedContext)
          
          // 质量检查
          const qualityResult = await this.checkChapterQuality(chapterId)
          
          if (qualityResult.result === QUALITY_RESULT.FAIL && options.autoRewrite) {
            // 自动重写
            await this.rewriteChapter(chapterId, qualityResult.issues)
          } else if (qualityResult.result === QUALITY_RESULT.WARNING) {
            // 加入审核队列
            this.reviewQueue.value.push({
              chapterId,
              issues: qualityResult.issues,
              createdAt: new Date().toISOString()
            })
          }
          
          // 更新队列状态
          if (queueItem) {
            queueItem.status = 'completed'
          }
          
          // 保存检查点
          this.saveCheckpoint()
          
        } catch (error) {
          console.error(`生成章节 ${chapterId} 失败:`, error)
          if (queueItem) {
            queueItem.status = 'failed'
            queueItem.error = error.message
          }
          
          // 如果是中断错误，停止生成
          if (options.stopOnError) {
            throw error
          }
        }
      }
    } finally {
      this.generationStatus.isGenerating = false
      this.generationStatus.currentChapter = null
      this.generationStatus.progress = 100
      this.generationStatus.message = '生成完成'
    }
  }
  
  /**
   * 生成单个章节内容
   * @param {string} chapterId - 章节 ID
   * @param {Object} context - 上下文
   * @returns {Promise<string>} 生成的内容
   */
  async generateChapterContent(chapterId, context) {
    const chapter = this.chapters.value.find(c => c.id === chapterId)
    if (!chapter) {
      throw new Error('未找到指定的章节')
    }
    
    // 更新章节状态
    this.updateChapter(chapterId, { status: CHAPTER_STATUS.GENERATING })
    
    // 构建提示词
    let prompt = this.buildGenerationPrompt(chapter, context)
    
    try {
      const content = await apiService.generateTextStream(prompt, {
        temperature: this.apiConfig.temperature,
        maxTokens: this.apiConfig.maxTokens
      }, null)
      
      // 更新章节
      this.updateChapter(chapterId, {
        content,
        status: CHAPTER_STATUS.DRAFT,
        wordCount: content.replace(/\s/g, '').length
      })
      
      // 生成摘要
      await this.generateChapterSummary(chapterId)
      
      return content
    } catch (error) {
      this.updateChapter(chapterId, { status: CHAPTER_STATUS.TODO })
      throw error
    }
  }
  
  /**
   * 构建章节生成提示词
   * @param {Object} chapter - 章节对象
   * @param {Object} context - 上下文对象
   * @returns {string} 提示词
   */
  buildGenerationPrompt(chapter, context) {
    let prompt = `你是一位专业的小说作家，请根据以下信息创作章节内容。

## 小说信息
- 标题：${this.currentProject.value?.title || '未命名'}
- 类型：${this.currentProject.value?.genre || '通用'}
- 主题：${this.currentProject.value?.theme || '通用'}
- 简介：${this.currentProject.value?.intro || '暂无简介'}

## 当前章节
- 标题：${chapter.title}
- 大纲：${chapter.outline || '暂无大纲'}

`

    // 添加前文摘要
    if (context.previousSummaries && context.previousSummaries.length > 0) {
      prompt += `## 前文摘要\n`
      context.previousSummaries.forEach(s => {
        prompt += `### ${s.title}\n${s.summary}\n\n`
      })
    }
    
    // 添加角色信息
    if (context.relevantCharacters && context.relevantCharacters.length > 0) {
      prompt += `## 相关角色\n`
      context.relevantCharacters.forEach(c => {
        prompt += `### ${c.name}\n`
        prompt += `描述：${c.description}\n`
        if (c.traits && c.traits.length > 0) {
          prompt += `特点：${c.traits.join('、')}\n`
        }
        if (c.currentState && Object.keys(c.currentState).length > 0) {
          prompt += `当前状态：${JSON.stringify(c.currentState)}\n`
        }
        prompt += '\n'
      })
    }
    
    // 添加世界观
    if (context.worldContext) {
      prompt += `## 世界观设定\n${context.worldContext}\n\n`
    }
    
    prompt += `## 创作要求
1. 字数控制在 2000-3000 字
2. 情节要紧凑，有冲突和转折
3. 人物对话要自然，符合角色性格
4. 场景描写要生动，有画面感
5. 与前文保持连贯，伏笔要呼应
6. 结尾要留有悬念或过渡

请直接输出章节内容：`

    return prompt
  }
  
  // ==================== 断点续传 ====================
  
  /**
   * 保存检查点
   */
  saveCheckpoint() {
    this.checkpoint.value = {
      timestamp: new Date().toISOString(),
      generationQueue: [...this.generationQueue.value],
      generationStatus: { ...this.generationStatus }
    }
    this.saveToLocalStorage()
  }
  
  /**
   * 从检查点恢复
   * @returns {boolean} 是否成功恢复
   */
  restoreFromCheckpoint() {
    if (!this.checkpoint.value) {
      return false
    }
    
    // 找出未完成的章节
    const pendingChapters = this.generationQueue.value
      .filter(q => q.status === 'pending' || q.status === 'generating')
      .map(q => q.chapterId)
    
    if (pendingChapters.length > 0) {
      // 恢复生成
      this.batchGenerateChapters(pendingChapters)
      return true
    }
    
    return false
  }
  
  // ==================== 质量控制 ====================
  
  /**
   * 检查章节质量
   * @param {string} chapterId - 章节 ID
   * @returns {Promise<Object>} 检查结果
   */
  async checkChapterQuality(chapterId) {
    const chapter = this.chapters.value.find(c => c.id === chapterId)
    if (!chapter || !chapter.content) {
      return {
        result: QUALITY_RESULT.FAIL,
        issues: ['章节内容为空']
      }
    }
    
    const issues = []
    let result = QUALITY_RESULT.PASS
    
    // 基础检查
    const wordCount = chapter.content.replace(/\s/g, '').length
    if (wordCount < 1000) {
      issues.push({
        type: 'length',
        message: `字数不足（${wordCount}字），建议至少 1000 字`
      })
      result = QUALITY_RESULT.WARNING
    }
    
    // 对话检查
    const dialogueCount = (chapter.content.match(/["「『"]|["」』"]/g) || []).length / 2
    if (dialogueCount < 3 && wordCount > 1000) {
      issues.push({
        type: 'dialogue',
        message: '对话较少，可能影响阅读体验'
      })
      result = QUALITY_RESULT.WARNING
    }
    
    // AI 质量检查
    if (this.currentProject.value) {
      try {
        const aiCheckResult = await this.aiQualityCheck(chapter)
        if (aiCheckResult.issues.length > 0) {
          issues.push(...aiCheckResult.issues)
          if (aiCheckResult.result === QUALITY_RESULT.FAIL) {
            result = QUALITY_RESULT.FAIL
          } else if (result === QUALITY_RESULT.PASS) {
            result = QUALITY_RESULT.WARNING
          }
        }
      } catch (error) {
        console.warn('AI 质量检查失败:', error)
      }
    }
    
    // 更新章节质量信息
    this.updateChapter(chapterId, {
      qualityScore: result === QUALITY_RESULT.PASS ? 90 : (result === QUALITY_RESULT.WARNING ? 70 : 50),
      qualityIssues: issues
    })
    
    return { result, issues }
  }
  
  /**
   * AI 质量检查
   * @param {Object} chapter - 章节对象
   * @returns {Promise<Object>} AI 检查结果
   */
  async aiQualityCheck(chapter) {
    const prompt = `请对以下小说章节进行质量检查，从以下维度评估：

1. 情节连贯性：情节是否合理、是否有逻辑漏洞
2. 人物塑造：人物行为是否符合性格、对话是否自然
3. 文笔表达：语言是否流畅、描写是否生动
4. 节奏把控：节奏是否适中、是否有拖沓或仓促
5. 世界观一致性：是否与设定矛盾

章节标题：${chapter.title}

章节内容（前 2000 字）：
${chapter.content.substring(0, 2000)}

请以 JSON 格式返回检查结果：
{
  "result": "pass/warning/fail",
  "score": 85,
  "issues": [
    { "type": "问题类型", "message": "问题描述" }
  ]
}`

    try {
      const response = await apiService.generateTextStream(prompt, {
        temperature: 0.3,
        maxTokens: 1000
      }, null)
      
      // 解析 JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      return { result: QUALITY_RESULT.PASS, issues: [] }
    } catch (error) {
      console.error('AI 质量检查失败:', error)
      return { result: QUALITY_RESULT.PASS, issues: [] }
    }
  }
  
  /**
   * 重写章节
   * @param {string} chapterId - 章节 ID
   * @param {Array} issues - 问题列表
   * @returns {Promise<string>} 重写后的内容
   */
  async rewriteChapter(chapterId, issues) {
    const chapter = this.chapters.value.find(c => c.id === chapterId)
    if (!chapter) {
      throw new Error('未找到指定的章节')
    }
    
    const prompt = `请根据以下问题对章节进行修改重写：

章节标题：${chapter.title}

原章节内容：
${chapter.content}

需要改进的问题：
${issues.map(i => `- ${i.message}`).join('\n')}

请输出修改后的完整章节内容：`

    try {
      const content = await apiService.generateTextStream(prompt, {
        temperature: 0.7,
        maxTokens: this.apiConfig.maxTokens
      }, null)
      
      this.updateChapter(chapterId, {
        content,
        status: CHAPTER_STATUS.DRAFT,
        wordCount: content.replace(/\s/g, '').length
      })
      
      return content
    } catch (error) {
      console.error('重写章节失败:', error)
      throw error
    }
  }
  
  // ==================== 进度追踪 ====================
  
  /**
   * 更新字数统计
   */
  updateWordCount() {
    let totalWords = 0
    let completedChapters = 0
    
    this.chapters.value.forEach(chapter => {
      if (chapter.content) {
        totalWords += chapter.wordCount || chapter.content.replace(/\s/g, '').length
      }
      if (chapter.status === CHAPTER_STATUS.COMPLETED) {
        completedChapters++
      }
    })
    
    this.progress.totalWords = totalWords
    this.progress.completedChapters = completedChapters
    
    // 更新每日字数
    const today = new Date().toLocaleDateString()
    if (!this.progress.dailyWords[today]) {
      this.progress.dailyWords[today] = 0
    }
  }
  
  /**
   * 记录每日写作量
   * @param {number} words - 今日写作字数
   */
  recordDailyWords(words) {
    const today = new Date().toLocaleDateString()
    if (!this.progress.dailyWords[today]) {
      this.progress.dailyWords[today] = 0
    }
    this.progress.dailyWords[today] += words
    this.saveToLocalStorage()
  }
  
  /**
   * 获取写作热力图数据
   * @param {number} days - 天数
   * @returns {Array} 热力图数据
   */
  getHeatmapData(days = 90) {
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString()
      
      data.push({
        date: dateStr,
        count: this.progress.dailyWords[dateStr] || 0
      })
    }
    
    return data
  }
  
  /**
   * 计算预计完成时间
   * @returns {Date|null} 预计完成日期
   */
  calculateEstimatedEndDate() {
    const remainingWords = this.progress.targetWords - this.progress.totalWords
    if (remainingWords <= 0) return null
    
    // 计算平均每日写作量
    const dailyValues = Object.values(this.progress.dailyWords)
    if (dailyValues.length === 0) return null
    
    const avgDailyWords = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length
    if (avgDailyWords === 0) return null
    
    const remainingDays = Math.ceil(remainingWords / avgDailyWords)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + remainingDays)
    
    this.progress.estimatedEndDate = endDate.toISOString()
    
    return endDate
  }
  
  /**
   * 获取进度统计
   * @returns {Object} 进度统计
   */
  getProgressStats() {
    const totalWords = this.progress.totalWords
    const targetWords = this.progress.targetWords
    const percentage = Math.min(100, (totalWords / targetWords) * 100)
    
    // 计算写作天数
    const writingDays = Object.keys(this.progress.dailyWords).length
    
    // 计算平均每日字数
    const avgDailyWords = writingDays > 0 ? Math.round(totalWords / writingDays) : 0
    
    return {
      totalWords,
      targetWords,
      percentage,
      completedChapters: this.progress.completedChapters,
      totalChapters: this.progress.totalChapters,
      writingDays,
      avgDailyWords,
      estimatedEndDate: this.calculateEstimatedEndDate()
    }
  }
  
  // ==================== 导出功能 ====================
  
  /**
   * 导出项目为 JSON
   * @returns {string} JSON 字符串
   */
  exportProject() {
    const data = {
      project: this.currentProject.value,
      volumes: this.volumes.value,
      chapters: this.chapters.value,
      characters: this.characters.value,
      worldSettings: this.worldSettings.value,
      summaryChain: this.summaryChain.value,
      progress: this.progress,
      exportedAt: new Date().toISOString()
    }
    
    return JSON.stringify(data, null, 2)
  }
  
  /**
   * 导出为纯文本
   * @returns {string} 小说文本
   */
  exportAsText() {
    let text = `${this.currentProject.value?.title || '未命名小说'}\n\n`
    
    this.volumes.value.forEach(volume => {
      text += `\n\n${'='.repeat(40)}\n`
      text += `${volume.title}\n`
      text += `${'='.repeat(40)}\n\n`
      
      const volumeChapters = this.chapters.value
        .filter(c => c.volumeId === volume.id)
        .sort((a, b) => a.order - b.order)
      
      volumeChapters.forEach(chapter => {
        text += `\n\n${chapter.title}\n\n`
        text += chapter.content || '[暂无内容]'
      })
    })
    
    return text
  }
  
  /**
   * 导入项目
   * @param {string} jsonStr - JSON 字符串
   * @returns {boolean} 是否成功
   */
  importProject(jsonStr) {
    try {
      const data = JSON.parse(jsonStr)
      
      this.currentProject.value = data.project
      this.volumes.value = data.volumes || []
      this.chapters.value = data.chapters || []
      this.characters.value = data.characters || []
      this.worldSettings.value = data.worldSettings || []
      this.summaryChain.value = data.summaryChain || []
      
      if (data.progress) {
        Object.assign(this.progress, data.progress)
      }
      
      this.saveToLocalStorage()
      
      return true
    } catch (error) {
      console.error('导入项目失败:', error)
      return false
    }
  }
}

// ==================== 导出单例 ====================

const megaNovelEngine = new MegaNovelEngine()

export default megaNovelEngine

// 导出常量供外部使用
export { TOKEN_LIMITS, CHAPTER_STATUS, QUALITY_RESULT, estimateTokens, generateId, formatDate }

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '../services/api.js'

export const useNovelStore = defineStore('novel', () => {
  // ==================== 状态 ====================
  
  // 小说内容
  const currentNovel = ref('')
  const generatedContent = ref('')
  const outline = ref('')
  const isGeneratingOutline = ref(false)
  const chapters = ref([])
  const selectedChapter = ref(null)
  const isGeneratingChapter = ref(false)
  
  // AI对话
  const aiChatHistory = ref([])
  const currentChatInput = ref('')
  const isAiChatting = ref(false)
  
  // 模板与关键词
  const templates = ref([])
  const selectedTemplate = ref(null)
  const keywords = ref('')
  const isGenerating = ref(false)
  
  // 语料库
  const corpus = ref([])
  
  // 写作工具数据
  const characters = ref([])
  const worldSettings = ref([])
  
  // API配置 - 仅自定义配置
  const apiConfig = ref({
    apiKey: '',
    baseURL: 'https://api.openai.com/v1',
    selectedModel: 'gpt-4o',
    maxTokens: 4096,
    temperature: 0.7
  })
  
  const isApiConfigured = ref(false)
  
  // 文章分析
  const articleSummary = ref('')
  const isGeneratingSummary = ref(false)
  const writingAdvice = ref('')
  const isGeneratingAdvice = ref(false)
  const articleStats = ref({
    wordCount: 0,
    readingTime: 0,
    sentiment: '',
    tags: [],
    category: '',
    score: 0
  })

  // ==================== 计算属性 ====================
  
  const wordCount = computed(() => {
    return currentNovel.value.replace(/<[^>]*>/g, '').length
  })

  const readingTime = computed(() => {
    return Math.ceil(wordCount.value / 200)
  })

  // ==================== 初始化 ====================
  
  const initializeApiConfig = () => {
    try {
      const saved = localStorage.getItem('yunshu_api_config')
      if (saved) {
        const config = JSON.parse(saved)
        apiConfig.value = { ...apiConfig.value, ...config }
      }
      isApiConfigured.value = !!apiConfig.value.apiKey
      apiService.updateConfig(apiConfig.value)
    } catch (error) {
      console.error('初始化API配置失败:', error)
    }
  }
  
  // 立即执行初始化
  initializeApiConfig()

  // ==================== 小说内容方法 ====================
  
  const setCurrentNovel = async (content) => {
    currentNovel.value = content
    await updateStats()
  }

  const setGeneratedContent = (content) => {
    generatedContent.value = content
  }

  const addToNovel = async () => {
    if (generatedContent.value) {
      if (!currentNovel.value || currentNovel.value === '<p><br></p>') {
        currentNovel.value = `<p>${generatedContent.value}</p>`
      } else {
        currentNovel.value += `<p><br></p><p>${generatedContent.value}</p>`
      }
      await updateStats()
    }
  }

  const clearNovel = async () => {
    currentNovel.value = ''
    await updateStats()
  }

  const setOutline = (content) => {
    outline.value = content
  }

  const setGeneratingOutline = (status) => {
    isGeneratingOutline.value = status
  }

  const clearOutline = () => {
    outline.value = ''
    chapters.value = []
  }

  // ==================== 章节管理 ====================
  
  const parseOutlineToChapters = () => {
    const outlineText = outline.value
    const chapterRegex = /###\s*(.+?)\n([\s\S]*?)(?=###|$)/g
    const newChapters = []
    let match
    let index = 1
    
    while ((match = chapterRegex.exec(outlineText)) !== null) {
      newChapters.push({
        id: index++,
        title: match[1].trim(),
        content: match[2].trim(),
        generatedText: '',
        isCompleted: false
      })
    }
    
    chapters.value = newChapters
  }

  const setSelectedChapter = (chapter) => {
    selectedChapter.value = chapter
  }

  const updateChapterContent = (chapterId, content) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
      chapter.content = content
    }
  }

  const setChapterGenerated = (chapterId, text) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
      chapter.generatedText = text
      chapter.isCompleted = true
    }
  }

  const setGeneratingChapter = (status) => {
    isGeneratingChapter.value = status
  }

  // ==================== AI对话 ====================
  
  const addChatMessage = (message, isUser = true) => {
    const generateUniqueId = () => {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000)
      return timestamp + random
    }
    
    aiChatHistory.value.push({
      id: generateUniqueId(),
      content: message,
      isUser,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  const setChatInput = (input) => {
    currentChatInput.value = input
  }

  const setAiChatting = (status) => {
    isAiChatting.value = status
  }

  const clearChatHistory = () => {
    aiChatHistory.value = []
  }

  // ==================== 模板与关键词 ====================
  
  const setTemplate = (template) => {
    selectedTemplate.value = template
  }

  const setKeywords = (kw) => {
    keywords.value = kw
  }

  const setGenerating = (status) => {
    isGenerating.value = status
  }

  // ==================== 语料库管理 ====================
  
  const addCorpus = (text) => {
    const generateUniqueId = () => {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000)
      return timestamp + random
    }
    
    corpus.value.push({
      id: generateUniqueId(),
      content: text,
      createdAt: new Date().toISOString()
    })
  }

  const removeCorpus = (id) => {
    const index = corpus.value.findIndex(item => item.id === id)
    if (index > -1) {
      corpus.value.splice(index, 1)
    }
  }

  const addCorpusFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        addCorpus(content)
        resolve(content)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const exportCorpus = () => {
    const data = JSON.stringify(corpus.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'yunshu_corpus.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importCorpus = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          corpus.value = data
          resolve(data)
        } catch (error) {
          reject(new Error('语料库文件格式错误'))
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // ==================== 文章统计 ====================
  
  const updateStats = async () => {
    const content = currentNovel.value.replace(/<[^>]*>/g, '')
    
    articleStats.value = {
      wordCount: content.length,
      readingTime: Math.ceil(content.length / 200),
      sentiment: analyzeSentiment(content),
      tags: generateTags(content),
      category: categorizeContent(content),
      score: calculateScore(content)
    }
    
    if (isApiConfigured.value && content.length > 100) {
      try {
        await updateStatsWithAI(content)
      } catch (error) {
        console.log('AI分析失败，使用本地分析结果:', error.message)
      }
    }
  }
  
  const updateStatsWithAI = async (content) => {
    try {
      const analysis = await apiService.analyzeArticle(content)
      
      articleStats.value = {
        ...articleStats.value,
        sentiment: analysis.sentiment || articleStats.value.sentiment,
        tags: analysis.tags || articleStats.value.tags,
        category: analysis.category || articleStats.value.category,
        score: analysis.score || articleStats.value.score,
        aiAnalysis: analysis
      }
    } catch (error) {
      console.error('AI文章分析失败:', error)
      throw error
    }
  }

  // ==================== API配置管理 ====================
  
  const updateApiConfig = (config) => {
    apiConfig.value = { ...apiConfig.value, ...config }
    localStorage.setItem('yunshu_api_config', JSON.stringify(apiConfig.value))
    apiService.updateConfig(apiConfig.value)
    isApiConfigured.value = !!apiConfig.value.apiKey
  }

  const validateApiKey = async () => {
    try {
      const isValid = await apiService.validateAPIKey()
      isApiConfigured.value = isValid
      return isValid
    } catch (error) {
      console.error('API密钥验证失败:', error)
      isApiConfigured.value = false
      return false
    }
  }

  // ==================== AI生成方法 ====================
  
  const generateOutlineWithAPI = async (theme) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    setGeneratingOutline(true)
    try {
      const result = await apiService.generateOutline(theme, keywords.value, selectedTemplate.value)
      setOutline(result)
      parseOutlineToChapters()
      return result
    } catch (error) {
      console.error('生成大纲失败:', error)
      throw error
    } finally {
      setGeneratingOutline(false)
    }
  }

  const generateOutlineWithAPIStream = async (theme, onChunk = null) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    setGeneratingOutline(true)
    setOutline('')
    
    try {
      const result = await apiService.generateOutlineStream(theme, keywords.value, selectedTemplate.value, (chunk, fullContent) => {
        setOutline(fullContent)
        if (onChunk) onChunk(chunk, fullContent)
      })
      parseOutlineToChapters()
      return result
    } catch (error) {
      console.error('生成大纲失败:', error)
      throw error
    } finally {
      setGeneratingOutline(false)
    }
  }

  const generateChapterWithAPI = async (chapter, novelInfo = null) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    setGeneratingChapter(true)
    try {
      const previousContent = currentNovel.value.replace(/<[^>]*>/g, '')
      const result = await apiService.generateChapterContent(
        chapter.title,
        chapter.content,
        previousContent,
        selectedTemplate.value,
        characters.value,
        worldSettings.value,
        novelInfo || {}
      )
      setChapterGenerated(chapter.id, result)
      setGeneratedContent(result)
      return result
    } catch (error) {
      console.error('生成章节内容失败:', error)
      throw error
    } finally {
      setGeneratingChapter(false)
    }
  }

  const sendChatMessageWithAPI = async (message) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    setAiChatting(true)
    
    try {
      const response = await apiService.chatWithAI(message, aiChatHistory.value)
      addChatMessage(response, false)
      return response
    } catch (error) {
      console.error('AI对话失败:', error)
      addChatMessage('抱歉，AI暂时无法回应，请稍后再试。', false)
      throw error
    } finally {
      setAiChatting(false)
    }
  }

  const generateSummaryWithAPI = async (options = {}) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    if (!currentNovel.value) {
      throw new Error('请先输入文章内容')
    }
    
    isGeneratingSummary.value = true
    try {
      const content = currentNovel.value.replace(/<[^>]*>/g, '')
      const summary = await apiService.generateSummary(content, options)
      articleSummary.value = summary
      return summary
    } catch (error) {
      console.error('生成摘要失败:', error)
      throw error
    } finally {
      isGeneratingSummary.value = false
    }
  }

  const getWritingAdviceWithAPI = async () => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    if (!currentNovel.value) {
      throw new Error('请先输入文章内容')
    }
    
    isGeneratingAdvice.value = true
    try {
      const content = currentNovel.value.replace(/<[^>]*>/g, '')
      const advice = await apiService.getWritingAdvice(content)
      writingAdvice.value = advice
      return advice
    } catch (error) {
      console.error('获取写作建议失败:', error)
      throw error
    } finally {
      isGeneratingAdvice.value = false
    }
  }

  const generatePersonalizedContent = async (prompt) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    if (corpus.value.length === 0) {
      throw new Error('请先添加语料库内容')
    }
    
    setGenerating(true)
    try {
      const result = await apiService.generatePersonalizedContent(prompt, corpus.value)
      setGeneratedContent(result)
      return result
    } catch (error) {
      console.error('生成个性化内容失败:', error)
      throw error
    } finally {
      setGenerating(false)
    }
  }

  const generateContentWithAPI = async (keywords, template, outline, wordLimit) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    try {
      const result = await apiService.generateGeneralContent(keywords, template, outline, wordLimit)
      setGeneratedContent(result)
      return result
    } catch (error) {
      console.error('生成内容失败:', error)
      throw error
    }
  }

  const generateContentWithAPIStream = async (keywords, template, outline, wordLimit, onChunk = null) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    setGenerating(true)
    setGeneratedContent('')
    
    try {
      const result = await apiService.generateGeneralContentStream(keywords, template, outline, wordLimit, (chunk, fullContent) => {
        setGeneratedContent(fullContent)
        if (onChunk) onChunk(chunk, fullContent)
      })
      return result
    } catch (error) {
      console.error('生成内容失败:', error)
      throw error
    } finally {
      setGenerating(false)
    }
  }

  const generateContent = async (prompt, onChunk = null) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API')
    }
    
    try {
      isGenerating.value = true
      
      if (onChunk) {
        const result = await apiService.generateTextStream(prompt, {
          type: 'content_generation'
        }, (chunk, fullContent) => {
          onChunk(chunk)
        })
        return result
      } else {
        const result = await apiService.generateTextStream(prompt, {
          type: 'content_generation'
        }, null)
        return result
      }
    } catch (error) {
      console.error('生成内容失败:', error)
      throw error
    } finally {
      isGenerating.value = false
    }
  }

  // ==================== 角色与世界观管理 ====================
  
  const addCharacter = (character) => {
    characters.value.push({
      id: Date.now(),
      ...character,
      traits: character.traitsInput ? character.traitsInput.split(',').map(t => t.trim()).filter(t => t) : []
    })
  }
  
  const removeCharacter = (id) => {
    characters.value = characters.value.filter(char => char.id !== id)
  }
  
  const addWorldSetting = (setting) => {
    const generateUniqueId = () => {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000)
      return timestamp + random
    }
    
    worldSettings.value.push({
      id: generateUniqueId(),
      ...setting
    })
  }
  
  const removeWorldSetting = (id) => {
    worldSettings.value = worldSettings.value.filter(setting => setting.id !== id)
  }

  const updateWorldSetting = (id, updatedSetting) => {
    const index = worldSettings.value.findIndex(setting => setting.id === id)
    if (index > -1) {
      worldSettings.value[index] = { ...worldSettings.value[index], ...updatedSetting }
    }
  }

  // ==================== 分析工具 ====================
  
  const analyzeSentiment = (content) => {
    const positiveWords = ['快乐', '幸福', '美好', '成功', '胜利', '爱', '喜欢']
    const negativeWords = ['悲伤', '痛苦', '失败', '死亡', '恐惧', '愤怒', '绝望']
    
    let positiveCount = 0
    let negativeCount = 0
    
    positiveWords.forEach(word => {
      positiveCount += (content.match(new RegExp(word, 'g')) || []).length
    })
    
    negativeWords.forEach(word => {
      negativeCount += (content.match(new RegExp(word, 'g')) || []).length
    })
    
    if (positiveCount > negativeCount) return '积极'
    if (negativeCount > positiveCount) return '消极'
    return '中性'
  }

  const generateTags = (content) => {
    const tags = []
    if (content.includes('修仙') || content.includes('仙人')) tags.push('修仙')
    if (content.includes('爱情') || content.includes('恋人')) tags.push('爱情')
    if (content.includes('悬疑') || content.includes('推理')) tags.push('悬疑')
    if (content.includes('科幻') || content.includes('未来')) tags.push('科幻')
    if (content.includes('古代') || content.includes('穿越')) tags.push('古代')
    return tags
  }

  const categorizeContent = (content) => {
    if (content.includes('修仙') || content.includes('异世界')) return '玄幻'
    if (content.includes('都市') || content.includes('现代')) return '都市'
    if (content.includes('悬疑') || content.includes('推理')) return '悬疑'
    if (content.includes('科幻') || content.includes('未来')) return '科幻'
    if (content.includes('古代') || content.includes('历史')) return '历史'
    return '其他'
  }

  const calculateScore = (content) => {
    let score = 50
    
    if (content.length > 1000) score += 10
    if (content.length > 3000) score += 10
    if (content.length > 5000) score += 10
    
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    if (paragraphs.length > 3) score += 5
    if (paragraphs.length > 6) score += 5
    
    const dialogues = (content.match(/[""]/g) || []).length
    if (dialogues > 4) score += 5
    
    return Math.min(100, score)
  }

  // ==================== 大师创作 ====================
  
  const masterCreation = async (params, onProgress = null) => {
    if (!isApiConfigured.value) {
      throw new Error('请先配置API密钥')
    }
    
    isGenerating.value = true
    
    try {
      const result = await apiService.masterCreation(params, onProgress)
      if (result?.content) {
        generatedContent.value = result.content
      }
      return result
    } catch (error) {
      console.error('大师创作失败:', error)
      throw error
    } finally {
      isGenerating.value = false
    }
  }

  const setArticleSummary = (summary) => {
    articleSummary.value = summary
  }

  // ==================== 导出 ====================
  
  return {
    // 状态
    currentNovel,
    generatedContent,
    outline,
    isGeneratingOutline,
    chapters,
    selectedChapter,
    isGeneratingChapter,
    aiChatHistory,
    currentChatInput,
    isAiChatting,
    templates,
    selectedTemplate,
    keywords,
    isGenerating,
    corpus,
    characters,
    worldSettings,
    articleStats,
    apiConfig,
    isApiConfigured,
    articleSummary,
    isGeneratingSummary,
    writingAdvice,
    isGeneratingAdvice,
    
    // 计算属性
    wordCount,
    readingTime,
    
    // 方法
    setCurrentNovel,
    setGeneratedContent,
    addToNovel,
    clearNovel,
    setOutline,
    setGeneratingOutline,
    clearOutline,
    parseOutlineToChapters,
    setSelectedChapter,
    updateChapterContent,
    setChapterGenerated,
    setGeneratingChapter,
    addChatMessage,
    setChatInput,
    setAiChatting,
    clearChatHistory,
    setTemplate,
    setKeywords,
    setGenerating,
    addCorpus,
    removeCorpus,
    addCharacter,
    removeCharacter,
    addWorldSetting,
    removeWorldSetting,
    updateWorldSetting,
    updateStats,
    
    // API相关方法
    updateApiConfig,
    validateApiKey,
    generateOutlineWithAPI,
    generateOutlineWithAPIStream,
    generateChapterWithAPI,
    sendChatMessageWithAPI,
    generateSummaryWithAPI,
    getWritingAdviceWithAPI,
    generatePersonalizedContent,
    generateContentWithAPI,
    generateContentWithAPIStream,
    addCorpusFromFile,
    exportCorpus,
    importCorpus,
    setGeneratingSummary,
    setArticleSummary,
    generateContent,
    masterCreation
  }
})

/**
 * 云书 - AI Agent 架构
 * 对标 Toonflow-app 的 scriptAgent/productionAgent
 * 提供多 Agent 协作系统，支持创意生成、生产执行、分析、记忆管理等任务
 *
 * 【待集成】此模块已实现完整功能，计划在 v2.3.0 中集成到主应用。
 * 集成方式：在对应的视图组件中 import 并调用。
 * 依赖：需要先初始化 database.js（IndexedDB）作为主存储。
 */

// ==================== 常量定义 ====================

/**
 * Agent 状态枚举
 * @enum {string}
 */
const AgentStatus = {
  IDLE: 'idle',           // 空闲
  RUNNING: 'running',     // 运行中
  PAUSED: 'paused',       // 暂停
  COMPLETED: 'completed', // 完成
  FAILED: 'failed'        // 失败
}

/**
 * Agent 类型枚举
 * @enum {string}
 */
const AgentType = {
  SCRIPT: 'script',       // 创意生成
  PRODUCTION: 'production', // 生产执行
  ANALYSIS: 'analysis',   // 分析
  MEMORY: 'memory'        // 记忆管理
}

/**
 * 任务优先级枚举
 * @enum {number}
 */
const TaskPriority = {
  LOW: 1,
  NORMAL: 5,
  HIGH: 8,
  URGENT: 10
}

// ==================== 工具类定义 ====================

/**
 * Agent 工具基类
 * 定义工具的标准接口
 */
class AgentTool {
  /**
   * @param {object} config - 工具配置
   * @param {string} config.name - 工具名称
   * @param {string} config.description - 工具描述
   * @param {string[]} [config.parameters] - 参数列表
   */
  constructor(config) {
    this.name = config.name
    this.description = config.description
    this.parameters = config.parameters || []
  }

  /**
   * 执行工具
   * @param {object} params - 参数
   * @param {object} context - 执行上下文
   * @returns {Promise<any>}
   */
  async execute(params, context) {
    throw new Error('工具必须实现 execute 方法')
  }
}

/**
 * 工具注册表
 * 管理所有可用工具
 */
class ToolRegistry {
  constructor() {
    /** @type {Map<string, AgentTool>} */
    this.tools = new Map()
  }

  /**
   * 注册工具
   * @param {AgentTool} tool - 工具实例
   */
  register(tool) {
    if (!(tool instanceof AgentTool)) {
      throw new Error('工具必须继承 AgentTool 类')
    }
    this.tools.set(tool.name, tool)
    console.log(`[ToolRegistry] 已注册工具: ${tool.name}`)
  }

  /**
   * 获取工具
   * @param {string} name - 工具名称
   * @returns {AgentTool|null}
   */
  get(name) {
    return this.tools.get(name) || null
  }

  /**
   * 检查工具是否存在
   * @param {string} name - 工具名称
   * @returns {boolean}
   */
  has(name) {
    return this.tools.has(name)
  }

  /**
   * 获取所有工具描述
   * @returns {Array<{name: string, description: string, parameters: string[]}>}
   */
  listAll() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }))
  }
}

// ==================== Agent 基类 ====================

/**
 * AI Agent 基类
 * 所有 Agent 必须继承此类
 */
class AIAgent {
  /**
   * @param {object} config - Agent 配置
   * @param {string} config.name - Agent 名称
   * @param {string} config.description - Agent 描述
   * @param {AgentType} config.type - Agent 类型
   * @param {string[]} [config.capabilities] - 能力列表
   */
  constructor(config) {
    this.name = config.name
    this.description = config.description
    this.type = config.type
    this.capabilities = config.capabilities || []
    this.tools = []
    this.status = AgentStatus.IDLE
    this.currentTask = null
    this.executionHistory = []
    this.maxHistoryLength = 100
  }

  /**
   * 注册工具
   * @param {AgentTool} tool - 工具实例
   */
  registerTool(tool) {
    this.tools.push(tool)
    console.log(`[${this.name}] 已注册工具: ${tool.name}`)
  }

  /**
   * 注销工具
   * @param {string} toolName - 工具名称
   */
  unregisterTool(toolName) {
    this.tools = this.tools.filter(t => t.name !== toolName)
  }

  /**
   * 获取工具
   * @param {string} toolName - 工具名称
   * @returns {AgentTool|null}
   */
  getTool(toolName) {
    return this.tools.find(t => t.name === toolName) || null
  }

  /**
   * 执行任务（子类必须实现）
   * @param {object} task - 任务对象
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async execute(task, onProgress = null) {
    throw new Error('Agent 必须实现 execute 方法')
  }

  /**
   * 执行工具
   * @param {string} toolName - 工具名称
   * @param {object} params - 参数
   * @param {object} context - 执行上下文
   * @returns {Promise<any>}
   */
  async executeTool(toolName, params, context) {
    const tool = this.getTool(toolName)
    if (!tool) {
      throw new Error(`工具不存在: ${toolName}`)
    }
    return tool.execute(params, context)
  }

  /**
   * 更新状态
   * @param {AgentStatus} status - 新状态
   */
  updateStatus(status) {
    this.status = status
    console.log(`[${this.name}] 状态更新: ${status}`)
  }

  /**
   * 记录执行历史
   * @param {object} record - 执行记录
   */
  recordHistory(record) {
    this.executionHistory.push({
      ...record,
      timestamp: Date.now()
    })
    
    // 限制历史长度
    if (this.executionHistory.length > this.maxHistoryLength) {
      this.executionHistory = this.executionHistory.slice(-this.maxHistoryLength)
    }
  }

  /**
   * 获取执行历史
   * @param {number} [limit=10] - 返回数量
   * @returns {object[]}
   */
  getHistory(limit = 10) {
    return this.executionHistory.slice(-limit)
  }

  /**
   * 检查是否具备某能力
   * @param {string} capability - 能力名称
   * @returns {boolean}
   */
  hasCapability(capability) {
    return this.capabilities.includes(capability)
  }

  /**
   * 获取 Agent 信息
   * @returns {object}
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      capabilities: this.capabilities,
      tools: this.tools.map(t => t.name),
      status: this.status
    }
  }
}

// ==================== ScriptAgent - 创意生成 Agent ====================

/**
 * ScriptAgent 创意生成 Agent
 * 负责大纲生成、章节创作、角色设计、世界观构建
 */
class ScriptAgent extends AIAgent {
  /**
   * @param {object} config - 配置
   * @param {object} config.aiProvider - AI 提供者
   */
  constructor(config) {
    super({
      name: 'ScriptAgent',
      description: '创意生成 Agent，负责大纲生成、章节创作、角色设计、世界观构建',
      type: AgentType.SCRIPT,
      capabilities: [
        'outline_generation',    // 大纲生成
        'chapter_writing',       // 章节创作
        'character_design',      // 角色设计
        'worldbuilding',         // 世界观构建
        'plot_development',      // 情节发展
        'dialogue_writing'       // 对话写作
      ]
    })
    
    this.aiProvider = config.aiProvider
  }

  /**
   * 执行任务
   * @param {object} task - 任务对象
   * @param {string} task.action - 动作类型
   * @param {object} task.params - 参数
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async execute(task, onProgress = null) {
    this.updateStatus(AgentStatus.RUNNING)
    this.currentTask = task
    
    const startTime = Date.now()
    
    try {
      let result
      
      switch (task.action) {
        case 'generate_outline':
          result = await this._generateOutline(task.params, onProgress)
          break
        case 'write_chapter':
          result = await this._writeChapter(task.params, onProgress)
          break
        case 'design_character':
          result = await this._designCharacter(task.params, onProgress)
          break
        case 'build_world':
          result = await this._buildWorld(task.params, onProgress)
          break
        case 'develop_plot':
          result = await this._developPlot(task.params, onProgress)
          break
        case 'write_dialogue':
          result = await this._writeDialogue(task.params, onProgress)
          break
        default:
          throw new Error(`未知的动作类型: ${task.action}`)
      }
      
      this.updateStatus(AgentStatus.COMPLETED)
      
      // 记录历史
      this.recordHistory({
        task,
        result,
        duration: Date.now() - startTime,
        status: 'success'
      })
      
      return result
    } catch (error) {
      this.updateStatus(AgentStatus.FAILED)
      
      this.recordHistory({
        task,
        error: error.message,
        duration: Date.now() - startTime,
        status: 'failed'
      })
      
      throw error
    } finally {
      this.currentTask = null
    }
  }

  /**
   * 生成大纲
   * @private
   */
  async _generateOutline(params, onProgress) {
    const { theme, genre, keywords, chapterCount = 10 } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析主题...' })
    
    const prompt = `你是一位专业的小说策划师。请根据以下信息生成一个详细的小说大纲：

主题：${theme}
类型：${genre || '不限'}
关键词：${keywords?.join('、') || '无'}
章节数：${chapterCount}

请生成包含以下内容的大纲：
1. 小说标题
2. 故事简介（200字以内）
3. 主要角色列表（3-5个）
4. 章节大纲（每章标题和简述）

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'generating', progress: 30, message: '生成大纲中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })
    
    if (onProgress) onProgress({ step: 'parsing', progress: 80, message: '解析结果...' })
    
    // 尝试解析 JSON
    let outline
    try {
      // 提取 JSON 部分
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        outline = JSON.parse(jsonMatch[0])
      } else {
        outline = { raw: response.content }
      }
    } catch (e) {
      outline = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '大纲生成完成' })
    
    return {
      outline,
      usage: response.usage
    }
  }

  /**
   * 创作章节
   * @private
   */
  async _writeChapter(params, onProgress) {
    const { 
      chapterTitle, 
      chapterOutline, 
      previousContent = '', 
      characters = [], 
      worldSettings = [],
      style = 'standard',
      wordCount = 2000
    } = params
    
    if (onProgress) onProgress({ step: 'preparing', progress: 10, message: '准备上下文...' })
    
    const characterInfo = characters.length > 0
      ? '\n\n## 角色设定\n' + characters.map(c => `- ${c.name}：${c.description}`).join('\n')
      : ''
    
    const worldInfo = worldSettings.length > 0
      ? '\n\n## 世界观设定\n' + worldSettings.map(w => `- ${w.title}：${w.description}`).join('\n')
      : ''
    
    const contextInfo = previousContent
      ? `\n\n## 前文参考\n${previousContent.slice(-500)}`
      : ''
    
    const prompt = `你是一位专业的小说作家。请根据以下信息创作章节内容：

## 章节标题
${chapterTitle}

## 章节大纲
${chapterOutline}${characterInfo}${worldInfo}${contextInfo}

## 创作要求
- 字数：约 ${wordCount} 字
- 风格：${style}
- 保持情节连贯
- 人物性格一致
- 场景描写生动

请直接输出章节内容：`

    if (onProgress) onProgress({ step: 'writing', progress: 30, message: '创作中...' })
    
    let fullContent = ''
    const response = await this.aiProvider.chatStream(
      [{ role: 'user', content: prompt }],
      (chunk, content) => {
        fullContent = content
        if (onProgress) {
          const progress = 30 + Math.min(60, (content.length / wordCount) * 60)
          onProgress({ step: 'writing', progress, message: `已创作 ${content.length} 字` })
        }
      },
      { temperature: 0.8 }
    )
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '章节创作完成' })
    
    return {
      content: response,
      wordCount: response.length
    }
  }

  /**
   * 设计角色
   * @private
   */
  async _designCharacter(params, onProgress) {
    const { theme, characterType, existingCharacters = [] } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析角色需求...' })
    
    const existingInfo = existingCharacters.length > 0
      ? `\n\n## 已有角色\n${existingCharacters.map(c => `- ${c.name}：${c.role}`).join('\n')}`
      : ''
    
    const prompt = `你是一位专业的小说角色设计师。请根据以下信息设计一个角色：

主题：${theme}
角色类型：${characterType || '不限'}${existingInfo}

请设计一个完整的角色，包含：
1. 基本信息（姓名、年龄、职业）
2. 外貌描述
3. 性格特点
4. 背景故事
5. 特殊能力或技能
6. 人物关系

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'designing', progress: 30, message: '设计角色中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.9 })
    
    if (onProgress) onProgress({ step: 'parsing', progress: 80, message: '解析结果...' })
    
    let character
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        character = JSON.parse(jsonMatch[0])
      } else {
        character = { raw: response.content }
      }
    } catch (e) {
      character = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '角色设计完成' })
    
    return {
      character,
      usage: response.usage
    }
  }

  /**
   * 构建世界观
   * @private
   */
  async _buildWorld(params, onProgress) {
    const { theme, genre, existingSettings = [] } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析世界观需求...' })
    
    const existingInfo = existingSettings.length > 0
      ? `\n\n## 已有设定\n${existingSettings.map(s => `- ${s.title}：${s.description}`).join('\n')}`
      : ''
    
    const prompt = `你是一位专业的小说世界观设计师。请根据以下信息构建世界观设定：

主题：${theme}
类型：${genre || '不限'}${existingInfo}

请构建世界观设定，包含：
1. 世界名称
2. 时代背景
3. 地理环境
4. 社会制度
5. 特殊规则（如魔法、科技等）
6. 重要组织或势力

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'building', progress: 30, message: '构建世界观中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })
    
    if (onProgress) onProgress({ step: 'parsing', progress: 80, message: '解析结果...' })
    
    let worldSetting
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        worldSetting = JSON.parse(jsonMatch[0])
      } else {
        worldSetting = { raw: response.content }
      }
    } catch (e) {
      worldSetting = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '世界观构建完成' })
    
    return {
      worldSetting,
      usage: response.usage
    }
  }

  /**
   * 发展情节
   * @private
   */
  async _developPlot(params, onProgress) {
    const { currentPlot, direction, characters, tone } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析情节走向...' })
    
    const prompt = `你是一位专业的小说情节策划师。请根据以下信息发展情节：

当前情节：${currentPlot}
发展方向：${direction || '自然发展'}
相关角色：${characters?.join('、') || '无特定角色'}
基调：${tone || '正常'}

请提供：
1. 情节发展建议（3-5个选项）
2. 推荐的发展方向
3. 可能的冲突点
4. 伏笔建议

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'developing', progress: 30, message: '发展情节中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.8 })
    
    let plotDevelopment
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        plotDevelopment = JSON.parse(jsonMatch[0])
      } else {
        plotDevelopment = { raw: response.content }
      }
    } catch (e) {
      plotDevelopment = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '情节发展完成' })
    
    return {
      plotDevelopment,
      usage: response.usage
    }
  }

  /**
   * 写作对话
   * @private
   */
  async _writeDialogue(params, onProgress) {
    const { characters, context, emotion, length = 'medium' } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析对话场景...' })
    
    const lengthGuide = {
      short: '简短对话（5-10句）',
      medium: '中等长度对话（10-20句）',
      long: '长对话（20句以上）'
    }
    
    const prompt = `你是一位专业的小说对话作家。请根据以下信息创作对话：

参与角色：${characters.map(c => `${c.name}（${c.personality || '无特定性格'}）`).join('、')}
场景背景：${context}
情感基调：${emotion || '正常'}
对话长度：${lengthGuide[length] || lengthGuide.medium}

要求：
1. 对话要符合角色性格
2. 语言自然流畅
3. 体现角色关系
4. 推动情节发展

请直接输出对话内容（使用「」表示对话）：`

    if (onProgress) onProgress({ step: 'writing', progress: 30, message: '创作对话中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.9 })
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '对话创作完成' })
    
    return {
      dialogue: response.content,
      usage: response.usage
    }
  }
}

// ==================== ProductionAgent - 生产执行 Agent ====================

/**
 * ProductionAgent 生产执行 Agent
 * 负责文本润色、格式化、导出准备
 */
class ProductionAgent extends AIAgent {
  /**
   * @param {object} config - 配置
   * @param {object} config.aiProvider - AI 提供者
   */
  constructor(config) {
    super({
      name: 'ProductionAgent',
      description: '生产执行 Agent，负责文本润色、格式化、导出准备',
      type: AgentType.PRODUCTION,
      capabilities: [
        'text_polishing',       // 文本润色
        'style_adjustment',     // 风格调整
        'formatting',           // 格式化
        'proofreading',         // 校对
        'export_preparation'    // 导出准备
      ]
    })
    
    this.aiProvider = config.aiProvider
  }

  /**
   * 执行任务
   * @param {object} task - 任务对象
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async execute(task, onProgress = null) {
    this.updateStatus(AgentStatus.RUNNING)
    this.currentTask = task
    
    const startTime = Date.now()
    
    try {
      let result
      
      switch (task.action) {
        case 'polish':
          result = await this._polishText(task.params, onProgress)
          break
        case 'adjust_style':
          result = await this._adjustStyle(task.params, onProgress)
          break
        case 'format':
          result = await this._formatText(task.params, onProgress)
          break
        case 'proofread':
          result = await this._proofread(task.params, onProgress)
          break
        case 'prepare_export':
          result = await this._prepareExport(task.params, onProgress)
          break
        default:
          throw new Error(`未知的动作类型: ${task.action}`)
      }
      
      this.updateStatus(AgentStatus.COMPLETED)
      
      this.recordHistory({
        task,
        result,
        duration: Date.now() - startTime,
        status: 'success'
      })
      
      return result
    } catch (error) {
      this.updateStatus(AgentStatus.FAILED)
      
      this.recordHistory({
        task,
        error: error.message,
        duration: Date.now() - startTime,
        status: 'failed'
      })
      
      throw error
    } finally {
      this.currentTask = null
    }
  }

  /**
   * 润色文本
   * @private
   */
  async _polishText(params, onProgress) {
    const { text, style = 'literary', intensity = 'medium' } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析文本...' })
    
    const intensityGuide = {
      light: '轻微润色，保持原文风格',
      medium: '中度润色，提升文学性',
      heavy: '深度润色，大幅提升文学品质'
    }
    
    const prompt = `你是一位专业的文学编辑。请对以下文本进行润色：

原文：
${text}

润色风格：${style}
润色程度：${intensityGuide[intensity] || intensityGuide.medium}

要求：
1. 保持原意不变
2. 提升语言表达
3. 优化句式结构
4. 增强文学性

请直接输出润色后的文本：`

    if (onProgress) onProgress({ step: 'polishing', progress: 30, message: '润色中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.5 })
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '润色完成' })
    
    return {
      original: text,
      polished: response.content,
      usage: response.usage
    }
  }

  /**
   * 调整风格
   * @private
   */
  async _adjustStyle(params, onProgress) {
    const { text, targetStyle, preserveContent = true } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析风格...' })
    
    const prompt = `你是一位专业的文学风格转换专家。请将以下文本转换为${targetStyle}风格：

原文：
${text}

要求：
${preserveContent ? '1. 保持原有内容和情节不变' : '1. 可适当调整内容以适应风格'}
2. 语言风格完全转换为${targetStyle}
3. 保持文本连贯性

请直接输出转换后的文本：`

    if (onProgress) onProgress({ step: 'adjusting', progress: 30, message: '调整风格中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.6 })
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '风格调整完成' })
    
    return {
      original: text,
      adjusted: response.content,
      targetStyle,
      usage: response.usage
    }
  }

  /**
   * 格式化文本
   * @private
   */
  async _formatText(params, onProgress) {
    const { text, format = 'standard', options = {} } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析格式...' })
    
    // 这里可以添加更多格式化逻辑
    let formatted = text
    
    // 段落格式化
    if (options.paragraphIndent !== false) {
      formatted = formatted.split('\n').map(p => {
        p = p.trim()
        if (p && !p.startsWith('　') && !p.startsWith(' ')) {
          return '　　' + p
        }
        return p
      }).join('\n')
    }
    
    // 对话格式化
    if (options.dialogueFormat) {
      formatted = formatted.replace(/「([^」]+)」/g, '「$1」')
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '格式化完成' })
    
    return {
      original: text,
      formatted,
      format,
      options
    }
  }

  /**
   * 校对文本
   * @private
   */
  async _proofread(params, onProgress) {
    const { text, checkTypes = ['spelling', 'grammar', 'punctuation'] } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '校对中...' })
    
    const checkDescriptions = {
      spelling: '错别字检查',
      grammar: '语法检查',
      punctuation: '标点符号检查'
    }
    
    const checks = checkTypes.map(t => checkDescriptions[t] || t).join('、')
    
    const prompt = `你是一位专业的文字校对员。请对以下文本进行校对：

${text}

校对项目：${checks}

请列出所有发现的问题，格式如下：
1. 原文：xxx
   问题：xxx
   建议：xxx

如果没有发现问题，请回复"文本无明显错误"。`

    if (onProgress) onProgress({ step: 'checking', progress: 50, message: '检查中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '校对完成' })
    
    return {
      original: text,
      issues: response.content,
      usage: response.usage
    }
  }

  /**
   * 准备导出
   * @private
   */
  async _prepareExport(params, onProgress) {
    const { chapters, format = 'txt', options = {} } = params
    
    if (onProgress) onProgress({ step: 'preparing', progress: 10, message: '准备导出...' })
    
    let content = ''
    
    switch (format) {
      case 'txt':
        content = chapters.map((ch, index) => {
          return `第${index + 1}章 ${ch.title}\n\n${ch.content}`
        }).join('\n\n' + '='.repeat(30) + '\n\n')
        break
      
      case 'markdown':
        content = chapters.map((ch, index) => {
          return `## 第${index + 1}章 ${ch.title}\n\n${ch.content}`
        }).join('\n\n---\n\n')
        break
      
      default:
        content = chapters.map((ch, index) => {
          return `第${index + 1}章 ${ch.title}\n\n${ch.content}`
        }).join('\n\n')
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '导出准备完成' })
    
    return {
      content,
      format,
      chapterCount: chapters.length,
      totalLength: content.length
    }
  }
}

// ==================== AnalysisAgent - 分析 Agent ====================

/**
 * AnalysisAgent 分析 Agent
 * 负责文本分析、质量检测、伏笔识别
 */
class AnalysisAgent extends AIAgent {
  /**
   * @param {object} config - 配置
   * @param {object} config.aiProvider - AI 提供者
   */
  constructor(config) {
    super({
      name: 'AnalysisAgent',
      description: '分析 Agent，负责文本分析、质量检测、伏笔识别',
      type: AgentType.ANALYSIS,
      capabilities: [
        'text_analysis',        // 文本分析
        'quality_check',        // 质量检测
        'foreshadowing_detect', // 伏笔识别
        'character_analysis',   // 角色分析
        'sentiment_analysis',   // 情感分析
        'readability_check'     // 可读性检测
      ]
    })
    
    this.aiProvider = config.aiProvider
  }

  /**
   * 执行任务
   */
  async execute(task, onProgress = null) {
    this.updateStatus(AgentStatus.RUNNING)
    this.currentTask = task
    
    const startTime = Date.now()
    
    try {
      let result
      
      switch (task.action) {
        case 'analyze':
          result = await this._analyzeText(task.params, onProgress)
          break
        case 'quality_check':
          result = await this._checkQuality(task.params, onProgress)
          break
        case 'detect_foreshadowing':
          result = await this._detectForeshadowing(task.params, onProgress)
          break
        case 'analyze_character':
          result = await this._analyzeCharacter(task.params, onProgress)
          break
        case 'analyze_sentiment':
          result = await this._analyzeSentiment(task.params, onProgress)
          break
        case 'check_readability':
          result = await this._checkReadability(task.params, onProgress)
          break
        default:
          throw new Error(`未知的动作类型: ${task.action}`)
      }
      
      this.updateStatus(AgentStatus.COMPLETED)
      
      this.recordHistory({
        task,
        result,
        duration: Date.now() - startTime,
        status: 'success'
      })
      
      return result
    } catch (error) {
      this.updateStatus(AgentStatus.FAILED)
      
      this.recordHistory({
        task,
        error: error.message,
        duration: Date.now() - startTime,
        status: 'failed'
      })
      
      throw error
    } finally {
      this.currentTask = null
    }
  }

  /**
   * 分析文本
   * @private
   */
  async _analyzeText(params, onProgress) {
    const { text, analysisType = 'comprehensive' } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析文本...' })
    
    const prompt = `你是一位专业的文学分析师。请对以下文本进行分析：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}

分析类型：${analysisType}

请提供以下分析：
1. 文本类型判断
2. 主题分析
3. 结构分析
4. 写作特点
5. 改进建议

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'processing', progress: 50, message: '处理中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    let analysis
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        analysis = { raw: response.content }
      }
    } catch (e) {
      analysis = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '分析完成' })
    
    return {
      analysis,
      textLength: text.length,
      usage: response.usage
    }
  }

  /**
   * 质量检测
   * @private
   */
  async _checkQuality(params, onProgress) {
    const { text, criteria = [] } = params
    
    if (onProgress) onProgress({ step: 'checking', progress: 10, message: '检测质量...' })
    
    const criteriaList = criteria.length > 0 
      ? criteria.join('、') 
      : '情节连贯性、人物一致性、语言表达、节奏把控'
    
    const prompt = `你是一位专业的文学质量评审员。请对以下文本进行质量检测：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}

检测维度：${criteriaList}

请提供：
1. 总体评分（0-100分）
2. 各维度评分
3. 优点列表
4. 问题列表
5. 改进建议

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'evaluating', progress: 50, message: '评估中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    let qualityReport
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        qualityReport = JSON.parse(jsonMatch[0])
      } else {
        qualityReport = { raw: response.content }
      }
    } catch (e) {
      qualityReport = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '质量检测完成' })
    
    return {
      qualityReport,
      usage: response.usage
    }
  }

  /**
   * 识别伏笔
   * @private
   */
  async _detectForeshadowing(params, onProgress) {
    const { text, knownForeshadowings = [] } = params
    
    if (onProgress) onProgress({ step: 'scanning', progress: 10, message: '扫描伏笔...' })
    
    const knownInfo = knownForeshadowings.length > 0
      ? `\n\n已知伏笔：\n${knownForeshadowings.map(f => `- ${f.description}`).join('\n')}`
      : ''
    
    const prompt = `你是一位专业的文学伏笔分析师。请识别以下文本中的伏笔：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}${knownInfo}

请识别：
1. 潜在伏笔（暗示、隐喻、预兆等）
2. 伏笔类型
3. 可能的呼应方式
4. 置信度

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'analyzing', progress: 50, message: '分析中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.4 })
    
    let foreshadowings
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        foreshadowings = JSON.parse(jsonMatch[0])
      } else {
        foreshadowings = { raw: response.content }
      }
    } catch (e) {
      foreshadowings = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '伏笔识别完成' })
    
    return {
      foreshadowings,
      usage: response.usage
    }
  }

  /**
   * 分析角色
   * @private
   */
  async _analyzeCharacter(params, onProgress) {
    const { text, characterName } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析角色...' })
    
    const prompt = `你是一位专业的文学角色分析师。请分析文本中的角色${characterName ? `「${characterName}」` : ''}：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}

请提供：
1. 角色基本信息
2. 性格特点
3. 行为动机
4. 人物弧线
5. 人物关系

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'processing', progress: 50, message: '处理中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.4 })
    
    let characterAnalysis
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        characterAnalysis = JSON.parse(jsonMatch[0])
      } else {
        characterAnalysis = { raw: response.content }
      }
    } catch (e) {
      characterAnalysis = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '角色分析完成' })
    
    return {
      characterAnalysis,
      usage: response.usage
    }
  }

  /**
   * 情感分析
   * @private
   */
  async _analyzeSentiment(params, onProgress) {
    const { text } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析情感...' })
    
    const prompt = `你是一位专业的文本情感分析师。请分析以下文本的情感：

${text.slice(0, 2000)}${text.length > 2000 ? '...(文本过长，已截断)' : ''}

请提供：
1. 主要情感（积极/消极/中性）
2. 情感强度（0-1）
3. 情感变化曲线
4. 关键情感词

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'processing', progress: 50, message: '处理中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    let sentiment
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        sentiment = JSON.parse(jsonMatch[0])
      } else {
        sentiment = { raw: response.content }
      }
    } catch (e) {
      sentiment = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '情感分析完成' })
    
    return {
      sentiment,
      usage: response.usage
    }
  }

  /**
   * 可读性检测
   * @private
   */
  async _checkReadability(params, onProgress) {
    const { text } = params
    
    if (onProgress) onProgress({ step: 'checking', progress: 10, message: '检测可读性...' })
    
    // 基础统计
    const stats = {
      charCount: text.length,
      chineseChars: (text.match(/[\u4e00-\u9fa5]/g) || []).length,
      sentenceCount: (text.match(/[。！？.!?]/g) || []).length,
      paragraphCount: text.split(/\n\s*\n/).filter(p => p.trim()).length
    }
    
    // 平均句长
    stats.avgSentenceLength = stats.sentenceCount > 0 
      ? Math.round(stats.chineseChars / stats.sentenceCount) 
      : 0
    
    // 平均段落长度
    stats.avgParagraphLength = stats.paragraphCount > 0 
      ? Math.round(stats.chineseChars / stats.paragraphCount) 
      : 0
    
    const prompt = `你是一位专业的文本可读性分析师。请评估以下文本的可读性：

${text.slice(0, 2000)}${text.length > 2000 ? '...(文本过长，已截断)' : ''}

基础统计：
- 字符数：${stats.charCount}
- 中文字数：${stats.chineseChars}
- 句子数：${stats.sentenceCount}
- 段落数：${stats.paragraphCount}
- 平均句长：${stats.avgSentenceLength}字
- 平均段落长度：${stats.avgParagraphLength}字

请提供：
1. 可读性评分（0-100）
2. 难度等级（简单/中等/困难）
3. 目标读者群体
4. 改进建议

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'evaluating', progress: 50, message: '评估中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    let readability
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        readability = JSON.parse(jsonMatch[0])
      } else {
        readability = { raw: response.content }
      }
    } catch (e) {
      readability = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '可读性检测完成' })
    
    return {
      stats,
      readability,
      usage: response.usage
    }
  }
}

// ==================== MemoryAgent - 记忆管理 Agent ====================

/**
 * MemoryAgent 记忆管理 Agent
 * 负责自动摘要、信息提取、关系发现
 */
class MemoryAgent extends AIAgent {
  /**
   * @param {object} config - 配置
   * @param {object} config.aiProvider - AI 提供者
   * @param {object} config.vectorMemory - 向量记忆系统
   */
  constructor(config) {
    super({
      name: 'MemoryAgent',
      description: '记忆管理 Agent，负责自动摘要、信息提取、关系发现',
      type: AgentType.MEMORY,
      capabilities: [
        'auto_summarize',       // 自动摘要
        'info_extraction',      // 信息提取
        'relation_discovery',   // 关系发现
        'memory_consolidation', // 记忆整合
        'context_building'      // 上下文构建
      ]
    })
    
    this.aiProvider = config.aiProvider
    this.vectorMemory = config.vectorMemory
  }

  /**
   * 执行任务
   */
  async execute(task, onProgress = null) {
    this.updateStatus(AgentStatus.RUNNING)
    this.currentTask = task
    
    const startTime = Date.now()
    
    try {
      let result
      
      switch (task.action) {
        case 'summarize':
          result = await this._summarize(task.params, onProgress)
          break
        case 'extract_info':
          result = await this._extractInfo(task.params, onProgress)
          break
        case 'discover_relations':
          result = await this._discoverRelations(task.params, onProgress)
          break
        case 'consolidate':
          result = await this._consolidateMemory(task.params, onProgress)
          break
        case 'build_context':
          result = await this._buildContext(task.params, onProgress)
          break
        default:
          throw new Error(`未知的动作类型: ${task.action}`)
      }
      
      this.updateStatus(AgentStatus.COMPLETED)
      
      this.recordHistory({
        task,
        result,
        duration: Date.now() - startTime,
        status: 'success'
      })
      
      return result
    } catch (error) {
      this.updateStatus(AgentStatus.FAILED)
      
      this.recordHistory({
        task,
        error: error.message,
        duration: Date.now() - startTime,
        status: 'failed'
      })
      
      throw error
    } finally {
      this.currentTask = null
    }
  }

  /**
   * 自动摘要
   * @private
   */
  async _summarize(params, onProgress) {
    const { text, length = 'medium', focus = 'general' } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析文本...' })
    
    const lengthGuide = {
      short: '50-100字',
      medium: '100-200字',
      long: '200-400字'
    }
    
    const focusGuide = {
      general: '整体内容',
      plot: '情节发展',
      character: '人物表现',
      emotion: '情感变化'
    }
    
    const prompt = `你是一位专业的文本摘要专家。请为以下文本生成摘要：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}

摘要长度：${lengthGuide[length] || lengthGuide.medium}
摘要重点：${focusGuide[focus] || focusGuide.general}

请直接输出摘要内容：`

    if (onProgress) onProgress({ step: 'summarizing', progress: 50, message: '生成摘要中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.4 })
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '摘要生成完成' })
    
    return {
      summary: response.content,
      originalLength: text.length,
      summaryLength: response.content.length,
      usage: response.usage
    }
  }

  /**
   * 信息提取
   * @private
   */
  async _extractInfo(params, onProgress) {
    const { text, extractTypes = ['characters', 'locations', 'events', 'items'] } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析文本...' })
    
    const prompt = `你是一位专业的信息提取专家。请从以下文本中提取信息：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}

请提取以下类型的信息：
${extractTypes.map(t => `- ${t}`).join('\n')}

请以 JSON 格式返回结果，格式如下：
{
  "characters": [{"name": "", "description": "", "actions": []}],
  "locations": [{"name": "", "description": ""}],
  "events": [{"description": "", "participants": [], "time": ""}],
  "items": [{"name": "", "description": ""}]
}`

    if (onProgress) onProgress({ step: 'extracting', progress: 50, message: '提取信息中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    let extracted
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0])
      } else {
        extracted = { raw: response.content }
      }
    } catch (e) {
      extracted = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '信息提取完成' })
    
    return {
      extracted,
      usage: response.usage
    }
  }

  /**
   * 关系发现
   * @private
   */
  async _discoverRelations(params, onProgress) {
    const { text, characters = [] } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析关系...' })
    
    const characterList = characters.length > 0 
      ? `\n已知角色：${characters.join('、')}` 
      : ''
    
    const prompt = `你是一位专业的文学关系分析师。请分析以下文本中的人物关系：

${text.slice(0, 3000)}${text.length > 3000 ? '...(文本过长，已截断)' : ''}${characterList}

请分析：
1. 人物之间的显性关系（亲属、朋友、敌人等）
2. 人物之间的隐性关系（暗恋、敌意、依赖等）
3. 关系的发展变化
4. 关系的证据（具体情节）

请以 JSON 格式返回结果。`

    if (onProgress) onProgress({ step: 'discovering', progress: 50, message: '发现关系中...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.4 })
    
    let relations
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        relations = JSON.parse(jsonMatch[0])
      } else {
        relations = { raw: response.content }
      }
    } catch (e) {
      relations = { raw: response.content }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '关系发现完成' })
    
    return {
      relations,
      usage: response.usage
    }
  }

  /**
   * 记忆整合
   * @private
   */
  async _consolidateMemory(params, onProgress) {
    const { projectId, memories, strategy = 'merge' } = params
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析记忆...' })
    
    // 根据策略整合记忆
    let consolidated = []
    
    if (strategy === 'merge') {
      // 合并相似记忆
      const memoryTexts = memories.map(m => m.text).join('\n---\n')
      
      const prompt = `你是一位专业的记忆整合专家。请整合以下记忆片段：

${memoryTexts.slice(0, 3000)}

请：
1. 去除重复信息
2. 合并相似内容
3. 补充缺失信息
4. 整理为结构化格式

请以 JSON 格式返回整合后的记忆列表。`

      if (onProgress) onProgress({ step: 'consolidating', progress: 50, message: '整合中...' })
      
      const response = await this.aiProvider.chat([
        { role: 'user', content: prompt }
      ], { temperature: 0.3 })
      
      try {
        const jsonMatch = response.content.match(/\[[\s\S]*\]|\{[\s\S]*\}/)
        if (jsonMatch) {
          consolidated = JSON.parse(jsonMatch[0])
          if (!Array.isArray(consolidated)) {
            consolidated = consolidated.memories || [consolidated]
          }
        }
      } catch (e) {
        consolidated = memories
      }
    } else {
      consolidated = memories
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '记忆整合完成' })
    
    return {
      originalCount: memories.length,
      consolidatedCount: consolidated.length,
      consolidated
    }
  }

  /**
   * 构建上下文
   * @private
   */
  async _buildContext(params, onProgress) {
    const { currentText, projectId, maxTokens = 4000 } = params
    
    if (onProgress) onProgress({ step: 'searching', progress: 10, message: '搜索相关记忆...' })
    
    // 使用向量记忆系统构建上下文
    if (this.vectorMemory) {
      const result = await this.vectorMemory.buildContext(currentText, {
        projectId,
        maxTokens
      })
      
      if (onProgress) onProgress({ step: 'completed', progress: 100, message: '上下文构建完成' })
      
      return result
    }
    
    // 如果没有向量记忆系统，返回空上下文
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '上下文构建完成' })
    
    return {
      context: '',
      sources: [],
      tokenCount: 0
    }
  }
}

// ==================== Agent 编排器 ====================

/**
 * AgentOrchestrator Agent 编排器
 * 协调多 Agent 协作，任务分发，结果聚合
 */
class AgentOrchestrator {
  constructor() {
    /** @type {Map<string, AIAgent>} */
    this.agents = new Map()
    /** @type {ToolRegistry} */
    this.toolRegistry = new ToolRegistry()
    /** @type {Map<string, object>} */
    this.taskQueue = new Map()
    /** @type {object[]} */
    this.executionLog = []
    this.maxLogLength = 500
  }

  /**
   * 注册 Agent
   * @param {AIAgent} agent - Agent 实例
   */
  registerAgent(agent) {
    if (!(agent instanceof AIAgent)) {
      throw new Error('Agent 必须继承 AIAgent 类')
    }
    this.agents.set(agent.name, agent)
    console.log(`[AgentOrchestrator] 已注册 Agent: ${agent.name}`)
  }

  /**
   * 注销 Agent
   * @param {string} agentName - Agent 名称
   */
  unregisterAgent(agentName) {
    this.agents.delete(agentName)
    console.log(`[AgentOrchestrator] 已注销 Agent: ${agentName}`)
  }

  /**
   * 获取 Agent
   * @param {string} agentName - Agent 名称
   * @returns {AIAgent|null}
   */
  getAgent(agentName) {
    return this.agents.get(agentName) || null
  }

  /**
   * 获取所有 Agent 信息
   * @returns {object[]}
   */
  getAllAgents() {
    return Array.from(this.agents.values()).map(agent => agent.getInfo())
  }

  /**
   * 注册工具
   * @param {AgentTool} tool - 工具实例
   */
  registerTool(tool) {
    this.toolRegistry.register(tool)
  }

  /**
   * 执行指定 Agent 任务
   * @param {string} agentName - Agent 名称
   * @param {object} task - 任务对象
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async run(agentName, task, onProgress = null) {
    const agent = this.agents.get(agentName)
    if (!agent) {
      throw new Error(`Agent 不存在: ${agentName}`)
    }
    
    const taskId = this._generateTaskId()
    const startTime = Date.now()
    
    // 记录任务开始
    this._logExecution({
      taskId,
      agentName,
      task,
      status: 'started',
      timestamp: startTime
    })
    
    try {
      const result = await agent.execute(task, onProgress)
      
      // 记录任务完成
      this._logExecution({
        taskId,
        agentName,
        task,
        status: 'completed',
        duration: Date.now() - startTime,
        result: result ? 'success' : 'empty'
      })
      
      return result
    } catch (error) {
      // 记录任务失败
      this._logExecution({
        taskId,
        agentName,
        task,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.message
      })
      
      throw error
    }
  }

  /**
   * 串行执行多个 Agent 任务
   * @param {Array<{agent: string, task: object}>} tasks - 任务列表
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object[]>}
   */
  async pipeline(tasks, onProgress = null) {
    const results = []
    const total = tasks.length
    
    for (let i = 0; i < tasks.length; i++) {
      const { agent, task } = tasks[i]
      
      if (onProgress) {
        onProgress({
          step: i + 1,
          total,
          agent,
          status: 'running',
          message: `执行 ${agent}...`
        })
      }
      
      try {
        const result = await this.run(agent, task)
        results.push({ success: true, result })
        
        if (onProgress) {
          onProgress({
            step: i + 1,
            total,
            agent,
            status: 'completed',
            message: `${agent} 完成`
          })
        }
      } catch (error) {
        results.push({ success: false, error: error.message })
        
        if (onProgress) {
          onProgress({
            step: i + 1,
            total,
            agent,
            status: 'failed',
            message: `${agent} 失败: ${error.message}`
          })
        }
        
        // 可以选择继续执行或中断
        // 这里选择继续执行
      }
    }
    
    return results
  }

  /**
   * 并行执行多个 Agent 任务
   * @param {Array<{agent: string, task: object}>} tasks - 任务列表
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object[]>}
   */
  async parallel(tasks, onProgress = null) {
    const total = tasks.length
    
    if (onProgress) {
      onProgress({
        step: 0,
        total,
        status: 'running',
        message: `并行执行 ${total} 个任务...`
      })
    }
    
    const promises = tasks.map(async ({ agent, task }, index) => {
      try {
        const result = await this.run(agent, task)
        return { success: true, result, index }
      } catch (error) {
        return { success: false, error: error.message, index }
      }
    })
    
    const results = await Promise.all(promises)
    
    // 按原始顺序排序
    results.sort((a, b) => a.index - b.index)
    
    if (onProgress) {
      const successCount = results.filter(r => r.success).length
      onProgress({
        step: total,
        total,
        status: 'completed',
        message: `完成 ${successCount}/${total} 个任务`
      })
    }
    
    return results
  }

  /**
   * 条件执行
   * @param {object} config - 配置
   * @param {string} config.agent - Agent 名称
   * @param {object} config.task - 任务
   * @param {Function} config.condition - 条件函数
   * @param {object} [config.fallback] - 条件不满足时的备选任务
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async conditional(config, onProgress = null) {
    const { agent, task, condition, fallback, fallbackAgent } = config
    
    if (await condition()) {
      return this.run(agent, task, onProgress)
    } else if (fallback) {
      return this.run(fallbackAgent || agent, fallback, onProgress)
    }
    
    return null
  }

  /**
   * 重试执行
   * @param {string} agentName - Agent 名称
   * @param {object} task - 任务
   * @param {object} options - 选项
   * @param {number} [options.maxRetries=3] - 最大重试次数
   * @param {number} [options.delay=1000] - 重试延迟
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async retry(agentName, task, options = {}, onProgress = null) {
    const { maxRetries = 3, delay = 1000 } = options
    
    let lastError = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (onProgress) {
          onProgress({
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            status: attempt > 0 ? 'retrying' : 'running'
          })
        }
        
        return await this.run(agentName, task, onProgress)
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError
  }

  /**
   * 获取执行日志
   * @param {number} [limit=50] - 返回数量
   * @returns {object[]}
   */
  getExecutionLog(limit = 50) {
    return this.executionLog.slice(-limit)
  }

  /**
   * 清空执行日志
   */
  clearExecutionLog() {
    this.executionLog = []
  }

  // ---------- 私有方法 ----------

  /**
   * 生成任务 ID
   * @private
   */
  _generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 记录执行日志
   * @private
   */
  _logExecution(record) {
    this.executionLog.push(record)
    
    if (this.executionLog.length > this.maxLogLength) {
      this.executionLog = this.executionLog.slice(-this.maxLogLength)
    }
  }
}

// ==================== 统一导出 ====================

const aiAgent = {
  // 基类
  AIAgent,
  AgentTool,
  ToolRegistry,
  
  // 具体 Agent
  ScriptAgent,
  ProductionAgent,
  AnalysisAgent,
  MemoryAgent,
  
  // 编排器
  AgentOrchestrator,
  
  // 枚举
  AgentStatus,
  AgentType,
  TaskPriority,
  
  // 工厂方法
  createOrchestrator: () => new AgentOrchestrator(),
  createScriptAgent: (config) => new ScriptAgent(config),
  createProductionAgent: (config) => new ProductionAgent(config),
  createAnalysisAgent: (config) => new AnalysisAgent(config),
  createMemoryAgent: (config) => new MemoryAgent(config)
}

export default aiAgent
export {
  AIAgent,
  AgentTool,
  ToolRegistry,
  ScriptAgent,
  ProductionAgent,
  AnalysisAgent,
  MemoryAgent,
  AgentOrchestrator,
  AgentStatus,
  AgentType,
  TaskPriority
}

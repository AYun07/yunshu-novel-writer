/**
 * 云书 - 智能追踪系统
 * 对标 MuMuAINovel 的角色状态追踪
 * 提供角色状态追踪、情节追踪、上下文追踪、AI提示词构建等功能
 */

// ==================== 常量定义 ====================

/**
 * 角色状态类型枚举
 * @enum {string}
 */
const CharacterStateType = {
  ALIVE: 'alive',           // 存活
  DEAD: 'dead',             // 死亡
  INJURED: 'injured',       // 受伤
  MISSING: 'missing',       // 失踪
  TRANSFORMED: 'transformed', // 变身/变形
  UNKNOWN: 'unknown'        // 未知
}

/**
 * 角色关系类型枚举
 * @enum {string}
 */
const RelationType = {
  FAMILY: 'family',         // 家人
  FRIEND: 'friend',         // 朋友
  ENEMY: 'enemy',           // 敌人
  LOVER: 'lover',           // 恋人
  ALLY: 'ally',             // 盟友
  RIVAL: 'rival',           // 对手
  MASTER: 'master',         // 师徒（师）
  DISCIPLE: 'disciple',     // 师徒（徒）
  COLLEAGUE: 'colleague',   // 同事
  STRANGER: 'stranger'      // 陌生人
}

/**
 * 情节节点类型枚举
 * @enum {string}
 */
const PlotNodeType = {
  OPENING: 'opening',       // 开端
  DEVELOPMENT: 'development', // 发展
  CONFLICT: 'conflict',     // 冲突
  CLIMAX: 'climax',         // 高潮
  TURNING_POINT: 'turning_point', // 转折
  RESOLUTION: 'resolution', // 结局
  EPILOGUE: 'epilogue'      // 尾声
}

/**
 * 节奏状态枚举
 * @enum {string}
 */
const PacingStatus = {
  TOO_SLOW: 'too_slow',     // 过慢
  SLOW: 'slow',             // 偏慢
  NORMAL: 'normal',         // 正常
  FAST: 'fast',             // 偏快
  TOO_FAST: 'too_fast'      // 过快
}

/**
 * 冲突类型枚举
 * @enum {string}
 */
const ConflictType = {
  STATE_CONFLICT: 'state_conflict',       // 状态冲突
  LOCATION_CONFLICT: 'location_conflict', // 位置冲突
  RELATION_CONFLICT: 'relation_conflict', // 关系冲突
  TIMELINE_CONFLICT: 'timeline_conflict', // 时间线冲突
  TRAIT_CONFLICT: 'trait_conflict'        // 特征冲突
}

// ==================== 角色状态追踪器 ====================

/**
 * CharacterTracker 角色状态追踪器
 * 从章节内容中自动提取角色状态变化，维护状态时间线，检测状态冲突
 */
class CharacterTracker {
  /**
   * @param {object} config - 配置
   * @param {object} config.database - 数据库服务
   * @param {object} config.aiProvider - AI 提供者
   */
  constructor(config) {
    this.database = config.database
    this.aiProvider = config.aiProvider
    
    /** @type {Map<number, Map<string, object[]>>} 角色状态时间线 projectId -> characterId -> states[] */
    this.stateTimelines = new Map()
    
    /** @type {Map<string, object>} 角色当前状态 characterId -> state */
    this.currentStates = new Map()
    
    /** @type {object[]} 检测到的冲突列表 */
    this.conflicts = []
  }

  /**
   * 分析章节，提取角色状态
   * @param {number} projectId - 项目ID
   * @param {number} chapterId - 章节ID
   * @param {string} content - 章节内容
   * @param {object[]} characters - 角色列表
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>} 提取结果
   */
  async analyzeChapter(projectId, chapterId, content, characters, onProgress = null) {
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析章节内容...' })
    
    // 获取章节信息
    const chapter = await this.database.getChapter(chapterId)
    const chapterOrder = chapter?.order || 0
    
    // 构建角色列表
    const characterList = characters.map(c => `- ${c.name}：${c.description || '无描述'}`).join('\n')
    
    const prompt = `你是一位专业的小说角色状态分析师。请分析以下章节中角色的状态变化：

## 章节内容
${content.slice(0, 4000)}${content.length > 4000 ? '...(内容过长，已截断)' : ''}

## 已知角色
${characterList}

请提取以下信息：
1. 角色状态变化（存活/死亡/受伤/失踪等）
2. 角色位置变化
3. 角色心理状态变化
4. 角色关系变化
5. 角色重要行为

请以 JSON 格式返回结果，格式如下：
{
  "characterChanges": [
    {
      "characterName": "角色名",
      "stateChange": { "from": "原状态", "to": "新状态", "reason": "原因" },
      "locationChange": { "from": "原位置", "to": "新位置" },
      "psychologicalChange": { "from": "原心理", "to": "新心理", "trigger": "触发因素" },
      "relationChanges": [{ "target": "目标角色", "type": "关系类型", "change": "变化描述" }],
      "importantActions": ["行为1", "行为2"]
    }
  ]
}`

    if (onProgress) onProgress({ step: 'extracting', progress: 40, message: '提取角色状态...' })
    
    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.3 })
    
    let changes
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        changes = JSON.parse(jsonMatch[0])
      } else {
        changes = { characterChanges: [] }
      }
    } catch (e) {
      changes = { characterChanges: [] }
    }
    
    if (onProgress) onProgress({ step: 'updating', progress: 70, message: '更新状态时间线...' })
    
    // 更新状态时间线
    const updatedStates = []
    for (const change of changes.characterChanges || []) {
      const character = characters.find(c => c.name === change.characterName)
      if (!character) continue
      
      const stateRecord = {
        characterId: character.id,
        characterName: character.name,
        chapterId,
        chapterOrder,
        timestamp: Date.now(),
        stateChange: change.stateChange || null,
        locationChange: change.locationChange || null,
        psychologicalChange: change.psychologicalChange || null,
        relationChanges: change.relationChanges || [],
        importantActions: change.importantActions || []
      }
      
      // 添加到时间线
      this._addToTimeline(projectId, character.id, stateRecord)
      
      // 更新当前状态
      this._updateCurrentState(character.id, stateRecord)
      
      updatedStates.push(stateRecord)
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '分析完成' })
    
    return {
      chapterId,
      characterChanges: updatedStates,
      usage: response.usage
    }
  }

  /**
   * 获取角色状态时间线
   * @param {number} characterId - 角色ID
   * @returns {object[]} 状态时间线
   */
  getStateTimeline(characterId) {
    return this.currentStates.has(characterId) 
      ? this._getTimelineForCharacter(characterId)
      : []
  }

  /**
   * 获取角色当前状态
   * @param {number} characterId - 角色ID
   * @returns {object|null}
   */
  getCurrentState(characterId) {
    return this.currentStates.get(characterId) || null
  }

  /**
   * 检测状态冲突
   * @param {number} [projectId] - 项目ID（可选，用于限定检测范围）
   * @returns {object[]} 冲突列表
   */
  detectConflicts(projectId = null) {
    const conflicts = []
    
    // 遍历所有角色的状态时间线
    for (const [characterId, currentState] of this.currentStates) {
      const timeline = this._getTimelineForCharacter(characterId)
      
      // 检测状态冲突
      for (let i = 1; i < timeline.length; i++) {
        const prev = timeline[i - 1]
        const curr = timeline[i]
        
        // 检测状态冲突（如：死亡后又有活动）
        if (prev.stateChange?.to === CharacterStateType.DEAD && 
            curr.stateChange && curr.stateChange.to !== CharacterStateType.DEAD) {
          conflicts.push({
            type: ConflictType.STATE_CONFLICT,
            characterId,
            description: `角色在第${prev.chapterOrder}章已死亡，但在第${curr.chapterOrder}章又有状态变化`,
            details: { prev, curr },
            severity: 'high'
          })
        }
        
        // 检测位置冲突（同一时间在不同地点）
        if (prev.locationChange?.to && curr.locationChange?.from &&
            prev.locationChange.to !== curr.locationChange.from &&
            prev.chapterOrder === curr.chapterOrder) {
          conflicts.push({
            type: ConflictType.LOCATION_CONFLICT,
            characterId,
            description: `角色在同一章节中位置不一致`,
            details: { prev, curr },
            severity: 'medium'
          })
        }
      }
    }
    
    // 更新冲突列表
    this.conflicts = conflicts
    
    return conflicts
  }

  /**
   * 获取所有冲突
   * @returns {object[]}
   */
  getAllConflicts() {
    return [...this.conflicts]
  }

  /**
   * 解决冲突
   * @param {number} conflictIndex - 冲突索引
   * @param {string} resolution - 解决方案
   * @returns {boolean}
   */
  resolveConflict(conflictIndex, resolution) {
    if (conflictIndex >= 0 && conflictIndex < this.conflicts.length) {
      this.conflicts[conflictIndex].resolved = true
      this.conflicts[conflictIndex].resolution = resolution
      return true
    }
    return false
  }

  /**
   * 清除项目数据
   * @param {number} projectId - 项目ID
   */
  clearProject(projectId) {
    this.stateTimelines.delete(projectId)
    // 清除相关的当前状态
    for (const [characterId, state] of this.currentStates) {
      if (state.projectId === projectId) {
        this.currentStates.delete(characterId)
      }
    }
  }

  // ---------- 私有方法 ----------

  /**
   * 添加到时间线
   * @private
   */
  _addToTimeline(projectId, characterId, stateRecord) {
    if (!this.stateTimelines.has(projectId)) {
      this.stateTimelines.set(projectId, new Map())
    }
    
    const projectTimeline = this.stateTimelines.get(projectId)
    
    if (!projectTimeline.has(characterId)) {
      projectTimeline.set(characterId, [])
    }
    
    projectTimeline.get(characterId).push(stateRecord)
  }

  /**
   * 获取角色时间线
   * @private
   */
  _getTimelineForCharacter(characterId) {
    for (const [, characters] of this.stateTimelines) {
      if (characters.has(characterId)) {
        return characters.get(characterId)
      }
    }
    return []
  }

  /**
   * 更新当前状态
   * @private
   */
  _updateCurrentState(characterId, stateRecord) {
    const existing = this.currentStates.get(characterId) || {}
    
    this.currentStates.set(characterId, {
      ...existing,
      characterId,
      lastUpdate: Date.now(),
      state: stateRecord.stateChange?.to || existing.state,
      location: stateRecord.locationChange?.to || existing.location,
      psychological: stateRecord.psychologicalChange?.to || existing.psychological
    })
  }
}

// ==================== 情节追踪器 ====================

/**
 * PlotTracker 情节追踪器
 * 自动识别情节节点，分析情节节奏，检测情节漏洞
 */
class PlotTracker {
  /**
   * @param {object} config - 配置
   * @param {object} config.database - 数据库服务
   * @param {object} config.aiProvider - AI 提供者
   */
  constructor(config) {
    this.database = config.database
    this.aiProvider = config.aiProvider
    
    /** @type {Map<number, object[]>} 情节节点 projectId -> nodes[] */
    this.plotNodes = new Map()
    
    /** @type {Map<number, object>} 节奏分析结果 projectId -> analysis */
    this.pacingAnalysis = new Map()
    
    /** @type {Map<number, object[]>} 情节漏洞 projectId -> holes[] */
    this.plotHoles = new Map()
  }

  /**
   * 分析情节结构
   * @param {number} projectId - 项目ID
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async analyzeStructure(projectId, onProgress = null) {
    if (onProgress) onProgress({ step: 'loading', progress: 10, message: '加载章节...' })
    
    // 获取项目所有章节
    const chapters = await this.database.getChapters(projectId)
    
    if (chapters.length === 0) {
      return { nodes: [], analysis: null }
    }
    
    // 构建章节摘要
    const chapterSummaries = chapters.map(ch => ({
      id: ch.id,
      order: ch.order,
      title: ch.title,
      summary: ch.summary || ch.content?.slice(0, 500) || ''
    }))
    
    if (onProgress) onProgress({ step: 'analyzing', progress: 30, message: '分析情节结构...' })
    
    const prompt = `你是一位专业的小说情节分析师。请分析以下章节的情节结构：

${chapterSummaries.map(ch => `第${ch.order}章 ${ch.title}：${ch.summary}`).join('\n\n')}

请分析：
1. 每个章节的情节节点类型（开端/发展/冲突/高潮/转折/结局/尾声）
2. 主要情节线
3. 情节转折点
4. 整体结构评价

请以 JSON 格式返回结果：
{
  "nodes": [
    { "chapterId": 1, "chapterOrder": 1, "type": "opening", "description": "描述", "importance": 8 }
  ],
  "mainPlotLine": "主要情节线描述",
  "turningPoints": [{ "chapterOrder": 5, "description": "转折描述" }],
  "structureEvaluation": { "score": 85, "strengths": [], "weaknesses": [] }
}`

    const response = await this.aiProvider.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.4 })
    
    let analysis
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        analysis = { nodes: [] }
      }
    } catch (e) {
      analysis = { nodes: [] }
    }
    
    // 存储情节节点
    this.plotNodes.set(projectId, analysis.nodes || [])
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '分析完成' })
    
    return {
      nodes: analysis.nodes || [],
      mainPlotLine: analysis.mainPlotLine || '',
      turningPoints: analysis.turningPoints || [],
      structureEvaluation: analysis.structureEvaluation || null,
      usage: response.usage
    }
  }

  /**
   * 获取节奏分析
   * @param {number} projectId - 项目ID
   * @returns {object}
   */
  getPacingAnalysis(projectId) {
    return this.pacingAnalysis.get(projectId) || null
  }

  /**
   * 分析情节节奏
   * @param {number} projectId - 项目ID
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async analyzePacing(projectId, onProgress = null) {
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '分析节奏...' })
    
    const chapters = await this.database.getChapters(projectId)
    const nodes = this.plotNodes.get(projectId) || []
    
    if (chapters.length === 0) {
      return { pacing: [], overall: PacingStatus.NORMAL }
    }
    
    // 计算每章的事件密度
    const pacingData = chapters.map((ch, index) => {
      const content = ch.content || ''
      const wordCount = content.length
      
      // 简单的事件密度估算
      const dialogueCount = (content.match(/「[^」]+」/g) || []).length
      const actionKeywords = (content.match(/跑|走|打|杀|逃|追|冲|跳|飞/g) || []).length
      const emotionKeywords = (content.match(/惊|怒|喜|悲|恐|爱|恨|愁/g) || []).length
      
      const eventDensity = (dialogueCount + actionKeywords * 2 + emotionKeywords) / Math.max(wordCount / 500, 1)
      
      // 判断节奏
      let pacing
      if (eventDensity > 5) pacing = PacingStatus.TOO_FAST
      else if (eventDensity > 3.5) pacing = PacingStatus.FAST
      else if (eventDensity < 1) pacing = PacingStatus.TOO_SLOW
      else if (eventDensity < 2) pacing = PacingStatus.SLOW
      else pacing = PacingStatus.NORMAL
      
      return {
        chapterOrder: ch.order,
        chapterTitle: ch.title,
        wordCount,
        eventDensity: Math.round(eventDensity * 10) / 10,
        pacing
      }
    })
    
    // 计算整体节奏
    const avgDensity = pacingData.reduce((sum, p) => sum + p.eventDensity, 0) / pacingData.length
    let overallPacing
    if (avgDensity > 4) overallPacing = PacingStatus.FAST
    else if (avgDensity < 1.5) overallPacing = PacingStatus.SLOW
    else overallPacing = PacingStatus.NORMAL
    
    const analysis = {
      pacing: pacingData,
      overall: overallPacing,
      avgDensity: Math.round(avgDensity * 10) / 10,
      recommendations: this._generatePacingRecommendations(pacingData, overallPacing)
    }
    
    this.pacingAnalysis.set(projectId, analysis)
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '节奏分析完成' })
    
    return analysis
  }

  /**
   * 检测情节漏洞
   * @param {number} projectId - 项目ID
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object[]>}
   */
  async detectPlotHoles(projectId, onProgress = null) {
    if (onProgress) onProgress({ step: 'analyzing', progress: 10, message: '检测情节漏洞...' })
    
    const chapters = await this.database.getChapters(projectId)
    const characters = await this.database.getCharacters(projectId)
    const foreshadowings = await this.database.getForeshadowings(projectId)
    
    const holes = []
    
    // 检测未解决的伏笔
    const unresolvedForeshadowings = foreshadowings.filter(f => f.status === 'planted' || f.status === 'developing')
    for (const f of unresolvedForeshadowings) {
      holes.push({
        type: 'unresolved_foreshadowing',
        description: `伏笔「${f.title}」尚未解决`,
        severity: 'medium',
        suggestion: '考虑在后续章节中呼应或解决此伏笔'
      })
    }
    
    // 检测角色消失
    const characterAppearances = new Map()
    for (const ch of chapters) {
      const content = ch.content || ''
      for (const char of characters) {
        if (content.includes(char.name)) {
          if (!characterAppearances.has(char.id)) {
            characterAppearances.set(char.id, [])
          }
          characterAppearances.get(char.id).push(ch.order)
        }
      }
    }
    
    // 检查重要角色是否长时间未出现
    for (const char of characters) {
      if (char.role === 'protagonist') continue
      
      const appearances = characterAppearances.get(char.id) || []
      if (appearances.length > 0) {
        const lastAppearance = Math.max(...appearances)
        const totalChapters = chapters.length
        
        if (totalChapters - lastAppearance > 5 && char.role !== 'minor') {
          holes.push({
            type: 'character_disappearance',
            description: `角色「${char.name}」已超过${totalChapters - lastAppearance}章未出现`,
            severity: 'low',
            suggestion: '考虑交代角色去向或重新引入'
          })
        }
      }
    }
    
    // 使用 AI 检测更复杂的情节漏洞
    if (chapters.length >= 3) {
      if (onProgress) onProgress({ step: 'ai_analyzing', progress: 50, message: 'AI 深度分析...' })
      
      const recentChapters = chapters.slice(-5)
      const content = recentChapters.map(ch => ch.content || '').join('\n\n---\n\n')
      
      const prompt = `你是一位专业的小说情节审核员。请检测以下内容中的情节漏洞：

${content.slice(0, 5000)}

请检测以下类型的情节漏洞：
1. 逻辑矛盾
2. 时间线错误
3. 人物行为不合理
4. 前后设定不一致
5. 未解释的突然变化

请以 JSON 格式返回结果：
{
  "plotHoles": [
    { "type": "类型", "description": "描述", "location": "位置", "suggestion": "建议" }
  ]
}`

      const response = await this.aiProvider.chat([
        { role: 'user', content: prompt }
      ], { temperature: 0.3 })
      
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const aiHoles = JSON.parse(jsonMatch[0])
          holes.push(...(aiHoles.plotHoles || []).map(h => ({
            ...h,
            severity: 'medium',
            source: 'ai_detection'
          })))
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
    
    this.plotHoles.set(projectId, holes)
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '漏洞检测完成' })
    
    return holes
  }

  /**
   * 获取情节节点
   * @param {number} projectId - 项目ID
   * @returns {object[]}
   */
  getPlotNodes(projectId) {
    return this.plotNodes.get(projectId) || []
  }

  /**
   * 清除项目数据
   * @param {number} projectId - 项目ID
   */
  clearProject(projectId) {
    this.plotNodes.delete(projectId)
    this.pacingAnalysis.delete(projectId)
    this.plotHoles.delete(projectId)
  }

  // ---------- 私有方法 ----------

  /**
   * 生成节奏建议
   * @private
   */
  _generatePacingRecommendations(pacingData, overallPacing) {
    const recommendations = []
    
    if (overallPacing === PacingStatus.TOO_FAST) {
      recommendations.push('整体节奏过快，建议增加描写和过渡段落')
      recommendations.push('可以考虑增加角色内心活动的描写')
    } else if (overallPacing === PacingStatus.TOO_SLOW) {
      recommendations.push('整体节奏偏慢，建议加快情节推进')
      recommendations.push('可以精简部分冗余描写')
    }
    
    // 检查节奏突变
    for (let i = 1; i < pacingData.length; i++) {
      const prev = pacingData[i - 1]
      const curr = pacingData[i]
      
      if (prev.pacing === PacingStatus.TOO_SLOW && curr.pacing === PacingStatus.TOO_FAST) {
        recommendations.push(`第${curr.chapterOrder}章节奏突然加快，建议增加过渡`)
      }
      if (prev.pacing === PacingStatus.TOO_FAST && curr.pacing === PacingStatus.TOO_SLOW) {
        recommendations.push(`第${curr.chapterOrder}章节奏突然变慢，可能影响阅读体验`)
      }
    }
    
    return recommendations
  }
}

// ==================== 上下文追踪器 ====================

/**
 * ContextTracker 上下文追踪器
 * 追踪章节引用、生成摘要链、管理上下文窗口
 */
class ContextTracker {
  /**
   * @param {object} config - 配置
   * @param {object} config.database - 数据库服务
   * @param {object} config.aiProvider - AI 提供者
   * @param {object} config.vectorMemory - 向量记忆系统
   */
  constructor(config) {
    this.database = config.database
    this.aiProvider = config.aiProvider
    this.vectorMemory = config.vectorMemory
    
    /** @type {Map<number, object[]>} 章节摘要链 projectId -> summaries[] */
    this.summaryChains = new Map()
    
    /** @type {Map<number, Map<number, string[]>>} 章节引用 projectId -> chapterId -> references[] */
    this.chapterReferences = new Map()
    
    /** @type {number} 默认最大上下文 token 数 */
    this.defaultMaxTokens = 4000
  }

  /**
   * 构建章节上下文
   * @param {number} projectId - 项目ID
   * @param {number} chapterId - 章节ID
   * @param {number} [maxTokens] - 最大 token 数
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async buildChapterContext(projectId, chapterId, maxTokens = this.defaultMaxTokens, onProgress = null) {
    if (onProgress) onProgress({ step: 'loading', progress: 10, message: '加载数据...' })
    
    // 获取章节信息
    const chapters = await this.database.getChapters(projectId)
    const currentChapter = chapters.find(ch => ch.id === chapterId)
    
    if (!currentChapter) {
      return { context: '', references: [], tokenCount: 0 }
    }
    
    const currentOrder = currentChapter.order
    
    // 获取前文章节
    const previousChapters = chapters.filter(ch => ch.order < currentOrder)
    
    // 获取角色和世界观
    const characters = await this.database.getCharacters(projectId)
    const worldSettings = await this.database.getWorldSettings(projectId)
    
    if (onProgress) onProgress({ step: 'building', progress: 30, message: '构建上下文...' })
    
    const contextParts = []
    const references = []
    let estimatedTokens = 0
    
    // 1. 添加项目基本信息
    const project = await this.database.getProject(projectId)
    if (project) {
      const projectInfo = `【小说信息】\n标题：${project.name}\n类型：${project.genre || '未设定'}\n简介：${project.description || '无'}`
      contextParts.push(projectInfo)
      estimatedTokens += this._estimateTokens(projectInfo)
    }
    
    // 2. 添加相关角色信息
    if (characters.length > 0) {
      const charInfo = this._buildCharacterContext(characters, currentChapter.content || '')
      if (charInfo && estimatedTokens + charInfo.tokens < maxTokens * 0.3) {
        contextParts.push(charInfo.text)
        estimatedTokens += charInfo.tokens
        references.push({ type: 'characters', count: characters.length })
      }
    }
    
    // 3. 添加世界观设定
    if (worldSettings.length > 0) {
      const worldInfo = this._buildWorldContext(worldSettings)
      if (worldInfo && estimatedTokens + worldInfo.tokens < maxTokens * 0.4) {
        contextParts.push(worldInfo.text)
        estimatedTokens += worldInfo.tokens
        references.push({ type: 'worldSettings', count: worldSettings.length })
      }
    }
    
    // 4. 添加前文摘要
    if (previousChapters.length > 0) {
      if (onProgress) onProgress({ step: 'summarizing', progress: 50, message: '生成摘要...' })
      
      const summaryContext = await this._buildSummaryContext(
        projectId, 
        previousChapters, 
        maxTokens - estimatedTokens
      )
      
      if (summaryContext) {
        contextParts.push(summaryContext.text)
        estimatedTokens += summaryContext.tokens
        references.push({ type: 'summaries', count: summaryContext.count })
      }
    }
    
    // 5. 使用向量记忆补充相关内容
    if (this.vectorMemory && estimatedTokens < maxTokens * 0.8) {
      if (onProgress) onProgress({ step: 'searching', progress: 70, message: '搜索相关记忆...' })
      
      try {
        const vectorContext = await this.vectorMemory.buildContext(
          currentChapter.content || currentChapter.title,
          {
            projectId,
            maxTokens: maxTokens - estimatedTokens
          }
        )
        
        if (vectorContext.context) {
          contextParts.push(vectorContext.context)
          estimatedTokens += vectorContext.tokenCount
          references.push(...vectorContext.sources)
        }
      } catch (e) {
        console.warn('[ContextTracker] 向量记忆检索失败:', e)
      }
    }
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '上下文构建完成' })
    
    return {
      context: contextParts.join('\n\n---\n\n'),
      references,
      tokenCount: estimatedTokens
    }
  }

  /**
   * 生成摘要链
   * @param {number} projectId - 项目ID
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object[]>}
   */
  async generateSummaryChain(projectId, onProgress = null) {
    if (onProgress) onProgress({ step: 'loading', progress: 10, message: '加载章节...' })
    
    const chapters = await this.database.getChapters(projectId)
    
    if (chapters.length === 0) {
      return []
    }
    
    const summaries = []
    
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i]
      
      if (onProgress) {
        onProgress({
          step: 'summarizing',
          progress: 10 + (i / chapters.length) * 80,
          message: `生成第${chapter.order}章摘要...`
        })
      }
      
      // 如果章节已有摘要，直接使用
      if (chapter.summary) {
        summaries.push({
          chapterId: chapter.id,
          chapterOrder: chapter.order,
          chapterTitle: chapter.title,
          summary: chapter.summary
        })
        continue
      }
      
      // 否则生成摘要
      const content = chapter.content || ''
      if (content.length > 100) {
        try {
          const prompt = `请为以下章节生成一个简洁的摘要（100字以内）：

${content.slice(0, 2000)}${content.length > 2000 ? '...' : ''}

摘要：`

          const response = await this.aiProvider.chat([
            { role: 'user', content: prompt }
          ], { temperature: 0.3, maxTokens: 200 })
          
          summaries.push({
            chapterId: chapter.id,
            chapterOrder: chapter.order,
            chapterTitle: chapter.title,
            summary: response.content
          })
        } catch (e) {
          summaries.push({
            chapterId: chapter.id,
            chapterOrder: chapter.order,
            chapterTitle: chapter.title,
            summary: '(摘要生成失败)'
          })
        }
      }
    }
    
    this.summaryChains.set(projectId, summaries)
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '摘要链生成完成' })
    
    return summaries
  }

  /**
   * 获取摘要链
   * @param {number} projectId - 项目ID
   * @returns {object[]}
   */
  getSummaryChain(projectId) {
    return this.summaryChains.get(projectId) || []
  }

  /**
   * 追踪章节引用
   * @param {number} projectId - 项目ID
   * @param {number} chapterId - 章节ID
   * @param {string} content - 章节内容
   * @returns {string[]} 引用的前文内容片段
   */
  trackReferences(projectId, chapterId, content) {
    const references = []
    
    // 简单的引用检测
    // 检测对前文的引用（如"之前提到"、"正如前文所述"等）
    const referencePatterns = [
      /正如前文(所述|提到)/g,
      /之前(说过|提到|描述)/g,
      /回忆起(之前|从前|往事)/g,
      /想起(曾经|往日)/g,
      /那(一|场)次/g
    ]
    
    for (const pattern of referencePatterns) {
      const matches = content.match(pattern)
      if (matches) {
        references.push(...matches)
      }
    }
    
    // 存储引用
    if (!this.chapterReferences.has(projectId)) {
      this.chapterReferences.set(projectId, new Map())
    }
    this.chapterReferences.get(projectId).set(chapterId, references)
    
    return references
  }

  /**
   * 获取章节引用
   * @param {number} projectId - 项目ID
   * @param {number} chapterId - 章节ID
   * @returns {string[]}
   */
  getChapterReferences(projectId, chapterId) {
    const projectRefs = this.chapterReferences.get(projectId)
    if (!projectRefs) return []
    return projectRefs.get(chapterId) || []
  }

  /**
   * 清除项目数据
   * @param {number} projectId - 项目ID
   */
  clearProject(projectId) {
    this.summaryChains.delete(projectId)
    this.chapterReferences.delete(projectId)
  }

  // ---------- 私有方法 ----------

  /**
   * 构建角色上下文
   * @private
   */
  _buildCharacterContext(characters, currentContent) {
    // 筛选在当前章节中出现的角色
    const relevantChars = characters.filter(char => 
      currentContent.includes(char.name) || char.role === 'protagonist'
    )
    
    if (relevantChars.length === 0) return null
    
    const text = `【角色信息】\n${relevantChars.map(char => {
      let info = `- ${char.name}（${char.role === 'protagonist' ? '主角' : char.role === 'antagonist' ? '反派' : '配角'}）`
      if (char.description) info += `：${char.description}`
      if (char.personality) info += `\n  性格：${char.personality}`
      return info
    }).join('\n')}`
    
    return {
      text,
      tokens: this._estimateTokens(text)
    }
  }

  /**
   * 构建世界观上下文
   * @private
   */
  _buildWorldContext(worldSettings) {
    if (worldSettings.length === 0) return null
    
    const text = `【世界观设定】\n${worldSettings.map(setting => {
      return `- ${setting.name}：${setting.description || '无描述'}`
    }).join('\n')}`
    
    return {
      text,
      tokens: this._estimateTokens(text)
    }
  }

  /**
   * 构建摘要上下文
   * @private
   */
  async _buildSummaryContext(projectId, previousChapters, maxTokens) {
    // 获取已有的摘要链
    let summaries = this.summaryChains.get(projectId)
    
    if (!summaries || summaries.length < previousChapters.length) {
      // 需要生成摘要
      summaries = previousChapters.map(ch => ({
        chapterId: ch.id,
        chapterOrder: ch.order,
        chapterTitle: ch.title,
        summary: ch.summary || ch.content?.slice(0, 200) || ''
      }))
    }
    
    // 筛选相关章节的摘要
    const relevantSummaries = summaries
      .filter(s => previousChapters.some(ch => ch.id === s.chapterId))
      .sort((a, b) => a.chapterOrder - b.chapterOrder)
    
    // 构建摘要文本
    const summaryTexts = []
    let totalTokens = 0
    
    // 优先使用最近几章的详细摘要
    const recentCount = Math.min(3, relevantSummaries.length)
    const recentSummaries = relevantSummaries.slice(-recentCount)
    const olderSummaries = relevantSummaries.slice(0, -recentCount)
    
    // 较早章节的简略摘要
    if (olderSummaries.length > 0) {
      const olderText = `【前情提要】\n${olderSummaries.map(s => `第${s.chapterOrder}章：${s.summary.slice(0, 50)}...`).join('\n')}`
      const olderTokens = this._estimateTokens(olderText)
      if (totalTokens + olderTokens < maxTokens * 0.5) {
        summaryTexts.push(olderText)
        totalTokens += olderTokens
      }
    }
    
    // 最近章节的详细摘要
    for (const s of recentSummaries) {
      const text = `【第${s.chapterOrder}章 ${s.chapterTitle}】\n${s.summary}`
      const tokens = this._estimateTokens(text)
      if (totalTokens + tokens < maxTokens) {
        summaryTexts.push(text)
        totalTokens += tokens
      }
    }
    
    return {
      text: summaryTexts.join('\n\n'),
      tokens: totalTokens,
      count: summaryTexts.length
    }
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

// ==================== AI 提示词构建器 ====================

/**
 * AIPromptBuilder AI 提示词构建器
 * 根据追踪数据自动构建 AI 提示词
 */
class AIPromptBuilder {
  /**
   * @param {object} config - 配置
   * @param {CharacterTracker} config.characterTracker - 角色追踪器
   * @param {PlotTracker} config.plotTracker - 情节追踪器
   * @param {ContextTracker} config.contextTracker - 上下文追踪器
   */
  constructor(config) {
    this.characterTracker = config.characterTracker
    this.plotTracker = config.plotTracker
    this.contextTracker = config.contextTracker
  }

  /**
   * 构建章节创作提示词
   * @param {object} params - 参数
   * @param {number} params.projectId - 项目ID
   * @param {number} params.chapterId - 章节ID
   * @param {string} params.chapterTitle - 章节标题
   * @param {string} params.chapterOutline - 章节大纲
   * @param {object} [options] - 选项
   * @returns {Promise<string>}
   */
  async buildChapterPrompt(params, options = {}) {
    const { projectId, chapterId, chapterTitle, chapterOutline } = params
    const { includeCharacterStates = true, includePlotContext = true, includeForeshadowings = true } = options
    
    const promptParts = []
    
    // 1. 基本任务描述
    promptParts.push(`请根据以下信息创作章节内容：

## 章节标题
${chapterTitle}

## 章节大纲
${chapterOutline}`)
    
    // 2. 角色状态
    if (includeCharacterStates && this.characterTracker) {
      const characters = await this._getCharacterStates(projectId, chapterId)
      if (characters.length > 0) {
        promptParts.push(`## 角色当前状态
${characters.map(c => `- **${c.name}**：${c.stateDescription}`).join('\n')}`)
      }
    }
    
    // 3. 情节上下文
    if (includePlotContext && this.plotTracker) {
      const plotContext = this._getPlotContext(projectId)
      if (plotContext) {
        promptParts.push(`## 情节上下文
${plotContext}`)
      }
    }
    
    // 4. 伏笔提醒
    if (includeForeshadowings) {
      const foreshadowings = await this._getForeshadowingReminders(projectId)
      if (foreshadowings.length > 0) {
        promptParts.push(`## 伏笔提醒
以下伏笔尚未解决，可以考虑在本章中呼应：
${foreshadowings.map(f => `- ${f.title}：${f.description}`).join('\n')}`)
      }
    }
    
    // 5. 创作要求
    promptParts.push(`## 创作要求
1. 保持与前文的一致性
2. 角色行为符合其性格特点
3. 情节发展自然流畅
4. 注意场景描写的细节
5. 对话要符合角色身份

请直接输出章节内容：`)
    
    return promptParts.join('\n\n')
  }

  /**
   * 构建对话生成提示词
   * @param {object} params - 参数
   * @returns {Promise<string>}
   */
  async buildDialoguePrompt(params) {
    const { projectId, characters, context, emotion } = params
    
    const promptParts = []
    
    // 角色信息
    promptParts.push(`请为以下角色创作对话：

## 参与角色
${characters.map(c => {
  const state = this.characterTracker?.getCurrentState(c.id)
  return `- **${c.name}**：${c.description || '无描述'}
  当前状态：${state?.psychological || '正常'}`
}).join('\n')}`)
    
    // 场景背景
    if (context) {
      promptParts.push(`## 场景背景
${context}`)
    }
    
    // 情感基调
    if (emotion) {
      promptParts.push(`## 情感基调
${emotion}`)
    }
    
    promptParts.push(`## 要求
1. 对话要符合角色性格
2. 语言自然流畅
3. 体现角色关系
4. 推动情节发展

请直接输出对话内容（使用「」表示对话）：`)
    
    return promptParts.join('\n\n')
  }

  /**
   * 构建大纲生成提示词
   * @param {object} params - 参数
   * @returns {Promise<string>}
   */
  async buildOutlinePrompt(params) {
    const { projectId, theme, genre, keywords, chapterCount } = params
    
    const promptParts = []
    
    promptParts.push(`请为以下主题生成小说大纲：

## 基本信息
- 主题：${theme}
- 类型：${genre || '不限'}
- 关键词：${keywords?.join('、') || '无'}
- 章节数：${chapterCount || 10}`)
    
    // 如果有现有角色，添加角色信息
    if (projectId) {
      const plotNodes = this.plotTracker?.getPlotNodes(projectId) || []
      if (plotNodes.length > 0) {
        promptParts.push(`## 现有情节节点
${plotNodes.map(n => `- 第${n.chapterOrder}章：${n.description}`).join('\n')}`)
      }
    }
    
    promptParts.push(`## 要求
1. 每章包含标题和简述
2. 情节要有起承转合
3. 注意节奏把控
4. 设置适当的伏笔

请以 JSON 格式返回大纲。`)
    
    return promptParts.join('\n\n')
  }

  // ---------- 私有方法 ----------

  /**
   * 获取角色状态描述
   * @private
   */
  async _getCharacterStates(projectId, chapterId) {
    // 这里应该从数据库获取角色列表
    // 简化实现，返回空数组
    return []
  }

  /**
   * 获取情节上下文
   * @private
   */
  _getPlotContext(projectId) {
    const nodes = this.plotTracker?.getPlotNodes(projectId) || []
    if (nodes.length === 0) return null
    
    const recentNodes = nodes.slice(-3)
    return `当前情节进展：\n${recentNodes.map(n => `- ${n.description}`).join('\n')}`
  }

  /**
   * 获取伏笔提醒
   * @private
   */
  async _getForeshadowingReminders(projectId) {
    // 这里应该从数据库获取未解决的伏笔
    // 简化实现，返回空数组
    return []
  }
}

// ==================== 智能追踪系统主类 ====================

/**
 * SmartTracking 智能追踪系统主类
 * 整合角色追踪、情节追踪、上下文追踪和提示词构建
 */
class SmartTracking {
  /**
   * @param {object} config - 配置
   * @param {object} config.database - 数据库服务
   * @param {object} config.aiProvider - AI 提供者
   * @param {object} [config.vectorMemory] - 向量记忆系统
   */
  constructor(config) {
    this.config = config
    
    // 初始化各追踪器
    this.characterTracker = new CharacterTracker(config)
    this.plotTracker = new PlotTracker(config)
    this.contextTracker = new ContextTracker(config)
    this.promptBuilder = new AIPromptBuilder({
      characterTracker: this.characterTracker,
      plotTracker: this.plotTracker,
      contextTracker: this.contextTracker
    })
  }

  /**
   * 初始化项目追踪
   * @param {number} projectId - 项目ID
   * @param {Function} [onProgress] - 进度回调
   * @returns {Promise<object>}
   */
  async initializeProject(projectId, onProgress = null) {
    const results = {
      characters: null,
      plot: null,
      summaries: null
    }
    
    if (onProgress) onProgress({ step: 'characters', progress: 10, message: '分析角色...' })
    
    // 分析角色状态
    const chapters = await this.config.database.getChapters(projectId)
    const characters = await this.config.database.getCharacters(projectId)
    
    if (chapters.length > 0 && characters.length > 0) {
      // 分析最近的章节
      const recentChapters = chapters.slice(-5)
      for (const chapter of recentChapters) {
        await this.characterTracker.analyzeChapter(
          projectId,
          chapter.id,
          chapter.content || '',
          characters
        )
      }
    }
    
    if (onProgress) onProgress({ step: 'plot', progress: 40, message: '分析情节...' })
    
    // 分析情节结构
    results.plot = await this.plotTracker.analyzeStructure(projectId)
    
    if (onProgress) onProgress({ step: 'summaries', progress: 70, message: '生成摘要链...' })
    
    // 生成摘要链
    results.summaries = await this.contextTracker.generateSummaryChain(projectId)
    
    if (onProgress) onProgress({ step: 'completed', progress: 100, message: '初始化完成' })
    
    return results
  }

  /**
   * 获取角色追踪器
   * @returns {CharacterTracker}
   */
  getCharacterTracker() {
    return this.characterTracker
  }

  /**
   * 获取情节追踪器
   * @returns {PlotTracker}
   */
  getPlotTracker() {
    return this.plotTracker
  }

  /**
   * 获取上下文追踪器
   * @returns {ContextTracker}
   */
  getContextTracker() {
    return this.contextTracker
  }

  /**
   * 获取提示词构建器
   * @returns {AIPromptBuilder}
   */
  getPromptBuilder() {
    return this.promptBuilder
  }

  /**
   * 清除项目数据
   * @param {number} projectId - 项目ID
   */
  clearProject(projectId) {
    this.characterTracker.clearProject(projectId)
    this.plotTracker.clearProject(projectId)
    this.contextTracker.clearProject(projectId)
  }

  /**
   * 获取项目追踪摘要
   * @param {number} projectId - 项目ID
   * @returns {object}
   */
  getProjectSummary(projectId) {
    return {
      plotNodes: this.plotTracker.getPlotNodes(projectId),
      pacingAnalysis: this.plotTracker.getPacingAnalysis(projectId),
      plotHoles: this.plotTracker.getPlotHoles.get?.(projectId) || [],
      summaryChain: this.contextTracker.getSummaryChain(projectId),
      conflicts: this.characterTracker.getAllConflicts()
    }
  }
}

// ==================== 统一导出 ====================

const smartTracking = {
  // 主类
  SmartTracking,
  CharacterTracker,
  PlotTracker,
  ContextTracker,
  AIPromptBuilder,
  
  // 枚举
  CharacterStateType,
  RelationType,
  PlotNodeType,
  PacingStatus,
  ConflictType,
  
  // 工厂方法
  create: (config) => new SmartTracking(config),
  createCharacterTracker: (config) => new CharacterTracker(config),
  createPlotTracker: (config) => new PlotTracker(config),
  createContextTracker: (config) => new ContextTracker(config),
  createPromptBuilder: (config) => new AIPromptBuilder(config)
}

export default smartTracking
export {
  SmartTracking,
  CharacterTracker,
  PlotTracker,
  ContextTracker,
  AIPromptBuilder,
  CharacterStateType,
  RelationType,
  PlotNodeType,
  PacingStatus,
  ConflictType
}

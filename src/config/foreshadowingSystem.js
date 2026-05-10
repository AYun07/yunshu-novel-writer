/**
 * ============================================================================
 * 云书 - 伏笔管理系统 (Foreshadowing System)
 * ============================================================================
 * 对标 MuMuAINovel 的伏笔追踪功能
 *
 * 功能概览：
 * - 伏笔数据结构定义（埋设/发展中/回收三种状态）
 * - AI 伏笔提取提示词（从章节内容中识别伏笔线索）
 * - AI 伏笔追踪提示词（检查新章节是否涉及已有伏笔）
 * - AI 伏笔回收提醒提示词
 * - 伏笔 CRUD 函数（localStorage 持久化）
 * - 伏笔统计（已埋/发展中/已回收/未回收数量）
 * - 伏笔时间线数据生成函数
 *
 * 使用方式：
 *   import { createForeshadowing, getForeshadowingsByProject, ... } from '@/config/foreshadowingSystem'
 * ============================================================================
 */

// ============================================================================
// 一、常量与存储配置
// ============================================================================

/** localStorage 存储键名 */
const STORAGE_KEY = 'yunshu_foreshadowings'

/** 伏笔状态枚举 */
export const FORESHADOWING_STATUS = {
  PLANTED: 'planted',       // 已埋设
  DEVELOPING: 'developing', // 发展中
  RESOLVED: 'resolved'      // 已回收
}

/** 伏笔重要性枚举 */
export const FORESHADOWING_IMPORTANCE = {
  HIGH: 'high',     // 高重要性（主线伏笔）
  MEDIUM: 'medium', // 中重要性（支线伏笔）
  LOW: 'low'        // 低重要性（细节伏笔）
}

/** 伏笔类型枚举 */
export const FORESHADOWING_TYPES = {
  PLOT: 'plot',               // 情节伏笔（推动剧情发展）
  CHARACTER: 'character',     // 角色伏笔（暗示角色命运/转变）
  SYMBOLIC: 'symbolic',       // 象征伏笔（意象/隐喻）
  WORLDVIEW: 'worldview',     // 世界观伏笔（设定/规则暗示）
  EMOTIONAL: 'emotional',     // 情感伏笔（情感铺垫）
  MYSTERY: 'mystery',         // 悬疑伏笔（谜题/线索）
  PROPHECY: 'prophecy',       // 预言伏笔（预言/占卜）
  CALLBACK: 'callback'        // 回调伏笔（前后呼应）
}

// ============================================================================
// 二、伏笔数据结构
// ============================================================================

/**
 * 伏笔数据结构
 * @typedef {Object} Foreshadowing
 * @property {string} id - 唯一标识符（UUID格式）
 * @property {string} projectId - 所属项目ID
 * @property {string} description - 伏笔描述（具体内容）
 * @property {string} type - 伏笔类型（见 FORESHADOWING_TYPES）
 * @property {string} chapterId - 埋设伏笔的章节ID
 * @property {string} createdAt - 创建时间（ISO 8601格式）
 * @property {string} status - 伏笔状态（planted/developing/resolved）
 * @property {string|null} resolvedAt - 回收时间（ISO 8601格式，未回收时为null）
 * @property {string|null} resolvedChapterId - 回收伏笔的章节ID（未回收时为null）
 * @property {string} importance - 重要性等级（high/medium/low）
 * @property {string[]} relatedCharacters - 关联角色ID列表
 * @property {string[]} notes - 备注列表（追加式记录）
 * @property {string} [hint] - 伏笔提示文本（给读者的暗示内容）
 * @property {string} [resolutionPlan] - 计划回收方式
 * @property {number} [expectedResolveChapter] - 预计回收章节序号
 * @property {string[]} [tags] - 自定义标签
 */

/**
 * 创建新的伏笔对象
 * @param {Object} params - 伏笔参数
 * @param {string} params.projectId - 项目ID
 * @param {string} params.description - 伏笔描述
 * @param {string} [params.type='plot'] - 伏笔类型
 * @param {string} params.chapterId - 埋设章节ID
 * @param {string} [params.importance='medium'] - 重要性
 * @param {string[]} [params.relatedCharacters=[]] - 关联角色
 * @param {string} [params.hint=''] - 伏笔提示
 * @param {string} [params.resolutionPlan=''] - 回收计划
 * @param {number} [params.expectedResolveChapter] - 预计回收章节
 * @param {string[]} [params.tags=[]] - 标签
 * @returns {Foreshadowing} 新的伏笔对象
 */
export function createForeshadowing({
  projectId,
  description,
  type = FORESHADOWING_TYPES.PLOT,
  chapterId,
  importance = FORESHADOWING_IMPORTANCE.MEDIUM,
  relatedCharacters = [],
  hint = '',
  resolutionPlan = '',
  expectedResolveChapter = null,
  tags = []
}) {
  return {
    id: generateId(),
    projectId,
    description,
    type,
    chapterId,
    createdAt: new Date().toISOString(),
    status: FORESHADOWING_STATUS.PLANTED,
    resolvedAt: null,
    resolvedChapterId: null,
    importance,
    relatedCharacters: [...relatedCharacters],
    notes: [],
    hint,
    resolutionPlan,
    expectedResolveChapter,
    tags: [...tags]
  }
}

// ============================================================================
// 三、AI 提示词
// ============================================================================

/**
 * AI 伏笔提取提示词
 * 用于从章节内容中自动识别潜在的伏笔线索
 * @param {Object} params
 * @param {string} params.chapterTitle - 章节标题
 * @param {string} params.chapterContent - 章节正文内容
 * @param {string} params.novelGenre - 小说类型
 * @param {string} [params.existingForeshadowings=''] - 已有伏笔列表（JSON字符串）
 * @returns {string} 完整的AI提示词
 */
export function buildForeshadowingExtractPrompt({
  chapterTitle,
  chapterContent,
  novelGenre,
  existingForeshadowings = ''
}) {
  return `你是一位经验丰富的小说编辑和文学分析师。请仔细阅读以下章节内容，从中识别出所有潜在的伏笔线索。

## 任务说明
伏笔是作者在故事前期埋下的暗示或线索，用于在后续情节中揭示或回收。好的伏笔应该：
1. 自然融入叙事，不显得刻意
2. 具有指向性但不过于明显
3. 与后续情节有逻辑关联
4. 能够增强读者的阅读体验（惊喜感或满足感）

## 小说类型
${novelGenre}

## 章节信息
标题：${chapterTitle}

## 章节内容
${chapterContent}

${existingForeshadowings ? `## 已有伏笔（避免重复识别）\n${existingForeshadowings}` : ''}

## 输出要求
请以JSON数组格式输出识别到的伏笔，每个伏笔包含以下字段：
[
  {
    "description": "伏笔的具体描述（一句话概括）",
    "type": "伏笔类型（plot/character/symbolic/worldview/emotional/mystery/prophecy/callback）",
    "importance": "重要性（high/medium/low）",
    "hint": "伏笔的暗示内容（读者可能注意到的细节）",
    "resolutionPlan": "建议的回收方式",
    "reasoning": "识别理由（为什么认为这是伏笔）",
    "confidence": "置信度（0.1-1.0，表示判断的确信程度）"
  }
]

注意：
- 只识别有较高概率是伏笔的内容，不要过度解读
- 置信度低于0.3的不要输出
- 按重要性从高到低排列
- 如果没有发现伏笔，返回空数组 []`
}

/**
 * AI 伏笔追踪提示词
 * 用于检查新章节是否涉及或推进了已有伏笔
 * @param {Object} params
 * @param {string} params.chapterTitle - 新章节标题
 * @param {string} params.chapterContent - 新章节正文内容
 * @param {Object[]} params.foreshadowings - 当前未回收的伏笔列表
 * @returns {string} 完整的AI提示词
 */
export function buildForeshadowingTrackPrompt({
  chapterTitle,
  chapterContent,
  foreshadowings
}) {
  const foreshadowingList = foreshadowings.map(f =>
    `[ID: ${f.id}] ${f.description}（类型: ${f.type}，重要性: ${f.importance}，状态: ${f.status}）`
  ).join('\n')

  return `你是一位细心的小说编辑，负责追踪故事中的伏笔线索。请检查以下新章节是否涉及了任何已有的伏笔。

## 新章节信息
标题：${chapterTitle}

## 新章节内容
${chapterContent}

## 当前未回收的伏笔列表
${foreshadowingList}

## 分析任务
对每个伏笔，判断新章节是否：
1. **涉及(mentioned)**：章节中提到了与伏笔相关的内容，但没有推进
2. **推进(developing)**：章节中推进了伏笔的发展，增加了新的信息
3. **回收(resolved)**：章节中揭示了伏笔的真相或完成了回收
4. **无关(unrelated)**：章节与该伏笔没有关联

## 输出要求
请以JSON数组格式输出分析结果：
[
  {
    "foreshadowingId": "伏笔ID",
    "relation": "mentioned/developing/resolved/unrelated",
    "evidence": "判断依据（引用章节中的具体内容）",
    "suggestion": "建议（如需要进一步处理）"
  }
]

只输出有关系的伏笔（relation 不为 unrelated 的），如果没有涉及任何伏笔，返回空数组 []。`
}

/**
 * AI 伏笔回收提醒提示词
 * 用于分析当前故事进度，提醒作者哪些伏笔需要尽快回收
 * @param {Object} params
 * @param {Object[]} params.unresolvedForeshadowings - 未回收的伏笔列表
 * @param {number} params.currentChapterNumber - 当前章节序号
 * @param {number} params.totalPlannedChapters - 计划总章节数
 * @param {string} params.storyProgress - 当前故事进度描述
 * @returns {string} 完整的AI提示词
 */
export function buildForeshadowingRemindPrompt({
  unresolvedForeshadowings,
  currentChapterNumber,
  totalPlannedChapters,
  storyProgress
}) {
  const foreshadowingList = unresolvedForeshadowings.map(f =>
    `[ID: ${f.id}] ${f.description}
     - 类型: ${f.type} | 重要性: ${f.importance}
     - 埋设章节: ${f.chapterId} | 埋设时间: ${f.createdAt}
     - 预计回收章节: ${f.expectedResolveChapter || '未设定'}
     - 备注: ${f.notes.join('; ') || '无'}`
  ).join('\n\n')

  const progress = totalPlannedChapters > 0
    ? Math.round((currentChapterNumber / totalPlannedChapters) * 100)
    : 0

  return `你是一位经验丰富的小说编辑，擅长管理故事的伏笔节奏。请根据当前故事进度，分析哪些伏笔需要尽快处理。

## 故事进度
- 当前章节：第${currentChapterNumber}章
- 计划总章节：${totalPlannedChapters || '未确定'}
- 整体进度：${progress}%
- 当前进度描述：${storyProgress}

## 未回收伏笔列表（共${unresolvedForeshadowings.length}个）
${foreshadowingList}

## 分析维度
1. **紧迫度**：根据故事进度和伏笔埋设时长判断
2. **遗忘风险**：埋设太久未提及的伏笔容易被遗忘
3. **读者期待**：高重要性伏笔长期不回收会降低读者满意度
4. **叙事时机**：当前故事阶段是否适合回收某类伏笔

## 输出要求
请以JSON格式输出：
{
  "urgentForeshadowings": [
    {
      "foreshadowingId": "伏笔ID",
      "urgency": "critical/high/medium/low",
      "reason": "紧急原因",
      "suggestedResolveChapter": "建议回收章节范围",
      "resolveSuggestion": "回收建议（如何自然地融入当前叙事）"
    }
  ],
  "overallAssessment": "整体伏笔管理状况评估",
  "pacingAdvice": "伏笔节奏建议"
}`
}

// ============================================================================
// 四、localStorage 持久化工具函数
// ============================================================================

/**
 * 生成唯一ID
 * @returns {string} UUID格式字符串
 */
function generateId() {
  return 'fs_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9)
}

/**
 * 从 localStorage 加载所有伏笔数据
 * @returns {Foreshadowing[]} 伏笔数组
 */
function loadForeshadowings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('[伏笔系统] 加载数据失败:', error)
    return []
  }
}

/**
 * 将伏笔数据保存到 localStorage
 * @param {Foreshadowing[]} foreshadowings - 伏笔数组
 */
function saveForeshadowings(foreshadowings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foreshadowings))
  } catch (error) {
    console.error('[伏笔系统] 保存数据失败:', error)
  }
}

// ============================================================================
// 五、伏笔 CRUD 函数
// ============================================================================

/**
 * 添加伏笔
 * @param {Foreshadowing} foreshadowing - 伏笔对象
 * @returns {Foreshadowing} 添加后的伏笔（含生成的id和createdAt）
 */
export function addForeshadowing(foreshadowing) {
  const list = loadForeshadowings()
  // 如果没有id，自动生成
  if (!foreshadowing.id) {
    foreshadowing.id = generateId()
  }
  // 如果没有createdAt，自动生成
  if (!foreshadowing.createdAt) {
    foreshadowing.createdAt = new Date().toISOString()
  }
  list.push(foreshadowing)
  saveForeshadowings(list)
  return foreshadowing
}

/**
 * 根据ID获取伏笔
 * @param {string} id - 伏笔ID
 * @returns {Foreshadowing|null} 伏笔对象，未找到返回null
 */
export function getForeshadowingById(id) {
  const list = loadForeshadowings()
  return list.find(f => f.id === id) || null
}

/**
 * 获取指定项目的所有伏笔
 * @param {string} projectId - 项目ID
 * @returns {Foreshadowing[]} 该项目的伏笔数组
 */
export function getForeshadowingsByProject(projectId) {
  const list = loadForeshadowings()
  return list.filter(f => f.projectId === projectId)
}

/**
 * 获取指定章节的伏笔（在该章节埋设的）
 * @param {string} chapterId - 章节ID
 * @returns {Foreshadowing[]} 该章节埋设的伏笔数组
 */
export function getForeshadowingsByChapter(chapterId) {
  const list = loadForeshadowings()
  return list.filter(f => f.chapterId === chapterId)
}

/**
 * 获取指定状态的伏笔
 * @param {string} projectId - 项目ID
 * @param {string} status - 伏笔状态
 * @returns {Foreshadowing[]} 指定状态的伏笔数组
 */
export function getForeshadowingsByStatus(projectId, status) {
  const list = loadForeshadowings()
  return list.filter(f => f.projectId === projectId && f.status === status)
}

/**
 * 更新伏笔
 * @param {string} id - 伏笔ID
 * @param {Object} updates - 要更新的字段
 * @returns {Foreshadowing|null} 更新后的伏笔，未找到返回null
 */
export function updateForeshadowing(id, updates) {
  const list = loadForeshadowings()
  const index = list.findIndex(f => f.id === id)
  if (index === -1) {
    console.warn(`[伏笔系统] 未找到ID为 ${id} 的伏笔`)
    return null
  }
  // 合并更新（不允许修改id和projectId）
  const { id: _id, projectId: _pid, ...safeUpdates } = updates
  list[index] = { ...list[index], ...safeUpdates }
  saveForeshadowings(list)
  return list[index]
}

/**
 * 删除伏笔
 * @param {string} id - 伏笔ID
 * @returns {boolean} 是否删除成功
 */
export function deleteForeshadowing(id) {
  const list = loadForeshadowings()
  const index = list.findIndex(f => f.id === id)
  if (index === -1) {
    console.warn(`[伏笔系统] 未找到ID为 ${id} 的伏笔`)
    return false
  }
  list.splice(index, 1)
  saveForeshadowings(list)
  return true
}

/**
 * 批量删除伏笔
 * @param {string[]} ids - 伏笔ID数组
 * @returns {number} 实际删除的数量
 */
export function batchDeleteForeshadowings(ids) {
  const list = loadForeshadowings()
  const idSet = new Set(ids)
  const originalLength = list.length
  const filtered = list.filter(f => !idSet.has(f.id))
  const deletedCount = originalLength - filtered.length
  saveForeshadowings(filtered)
  return deletedCount
}

// ============================================================================
// 六、伏笔状态管理
// ============================================================================

/**
 * 更新伏笔状态为"发展中"
 * @param {string} id - 伏笔ID
 * @param {string} [note=''] - 状态变更备注
 * @returns {Foreshadowing|null} 更新后的伏笔
 */
export function developForeshadowing(id, note = '') {
  const list = loadForeshadowings()
  const index = list.findIndex(f => f.id === id)
  if (index === -1) return null

  list[index].status = FORESHADOWING_STATUS.DEVELOPING
  if (note) {
    list[index].notes.push(`[${new Date().toLocaleString('zh-CN')}] 发展: ${note}`)
  }
  saveForeshadowings(list)
  return list[index]
}

/**
 * 回收伏笔（标记为已解决）
 * @param {string} id - 伏笔ID
 * @param {string} resolvedChapterId - 回收章节ID
 * @param {string} [note=''] - 回收备注
 * @returns {Foreshadowing|null} 更新后的伏笔
 */
export function resolveForeshadowing(id, resolvedChapterId, note = '') {
  const list = loadForeshadowings()
  const index = list.findIndex(f => f.id === id)
  if (index === -1) return null

  list[index].status = FORESHADOWING_STATUS.RESOLVED
  list[index].resolvedAt = new Date().toISOString()
  list[index].resolvedChapterId = resolvedChapterId
  if (note) {
    list[index].notes.push(`[${new Date().toLocaleString('zh-CN')}] 回收: ${note}`)
  }
  saveForeshadowings(list)
  return list[index]
}

/**
 * 重新打开已回收的伏笔（将状态改回发展中或已埋设）
 * @param {string} id - 伏笔ID
 * @param {'planted'|'developing'} [newStatus='developing'] - 新状态
 * @param {string} [note=''] - 备注说明
 * @returns {Foreshadowing|null} 更新后的伏笔
 */
export function reopenForeshadowing(id, newStatus = FORESHADOWING_STATUS.DEVELOPING, note = '') {
  const list = loadForeshadowings()
  const index = list.findIndex(f => f.id === id)
  if (index === -1) return null

  list[index].status = newStatus
  list[index].resolvedAt = null
  list[index].resolvedChapterId = null
  if (note) {
    list[index].notes.push(`[${new Date().toLocaleString('zh-CN')}] 重新打开: ${note}`)
  }
  saveForeshadowings(list)
  return list[index]
}

/**
 * 为伏笔添加备注
 * @param {string} id - 伏笔ID
 * @param {string} note - 备注内容
 * @returns {Foreshadowing|null} 更新后的伏笔
 */
export function addForeshadowingNote(id, note) {
  const list = loadForeshadowings()
  const index = list.findIndex(f => f.id === id)
  if (index === -1) return null

  list[index].notes.push(`[${new Date().toLocaleString('zh-CN')}] ${note}`)
  saveForeshadowings(list)
  return list[index]
}

// ============================================================================
// 七、伏笔统计
// ============================================================================

/**
 * 伏笔统计数据结构
 * @typedef {Object} ForeshadowingStats
 * @property {number} total - 总数
 * @property {number} planted - 已埋设数量
 * @property {number} developing - 发展中数量
 * @property {number} resolved - 已回收数量
 * @property {number} unresolved - 未回收数量（planted + developing）
 * @property {number} highImportance - 高重要性数量
 * @property {number} mediumImportance - 中重要性数量
 * @property {number} lowImportance - 低重要性数量
 * @property {Object} byType - 按类型统计
 * @property {number} overdueCount - 超期未回收数量（超过预计回收章节）
 * @property {Object} resolveRate - 回收率
 */

/**
 * 获取指定项目的伏笔统计信息
 * @param {string} projectId - 项目ID
 * @param {number} [currentChapterNumber=0] - 当前章节序号（用于计算超期）
 * @returns {ForeshadowingStats} 统计数据
 */
export function getForeshadowingStats(projectId, currentChapterNumber = 0) {
  const list = loadForeshadowings().filter(f => f.projectId === projectId)

  const stats = {
    total: list.length,
    planted: 0,
    developing: 0,
    resolved: 0,
    unresolved: 0,
    highImportance: 0,
    mediumImportance: 0,
    lowImportance: 0,
    byType: {},
    overdueCount: 0,
    resolveRate: {
      overall: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  }

  // 按类型初始化计数
  Object.values(FORESHADOWING_TYPES).forEach(type => {
    stats.byType[type] = 0
  })

  // 按重要性分类的回收计数
  const importanceResolved = { high: 0, medium: 0, low: 0 }
  const importanceTotal = { high: 0, medium: 0, low: 0 }

  list.forEach(f => {
    // 状态统计
    if (f.status === FORESHADOWING_STATUS.PLANTED) stats.planted++
    else if (f.status === FORESHADOWING_STATUS.DEVELOPING) stats.developing++
    else if (f.status === FORESHADOWING_STATUS.RESOLVED) stats.resolved++

    // 重要性统计
    stats[`${f.importance}Importance`]++
    importanceTotal[f.importance]++
    if (f.status === FORESHADOWING_STATUS.RESOLVED) {
      importanceResolved[f.importance]++
    }

    // 类型统计
    if (stats.byType[f.type] !== undefined) {
      stats.byType[f.type]++
    }

    // 超期检测
    if (
      f.status !== FORESHADOWING_STATUS.RESOLVED &&
      f.expectedResolveChapter &&
      currentChapterNumber > f.expectedResolveChapter
    ) {
      stats.overdueCount++
    }
  })

  stats.unresolved = stats.planted + stats.developing

  // 计算回收率
  stats.resolveRate.overall = stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0
  stats.resolveRate.high = importanceTotal.high > 0
    ? Math.round((importanceResolved.high / importanceTotal.high) * 100)
    : 0
  stats.resolveRate.medium = importanceTotal.medium > 0
    ? Math.round((importanceResolved.medium / importanceTotal.medium) * 100)
    : 0
  stats.resolveRate.low = importanceTotal.low > 0
    ? Math.round((importanceResolved.low / importanceTotal.low) * 100)
    : 0

  return stats
}

// ============================================================================
// 八、伏笔时间线数据生成
// ============================================================================

/**
 * 时间线事件数据结构
 * @typedef {Object} TimelineEvent
 * @property {string} id - 事件ID
 * @property {string} type - 事件类型（planted/developing/resolved/note）
 * @property {string} foreshadowingId - 关联的伏笔ID
 * @property {string} description - 伏笔描述
 * @property {string} chapterId - 关联章节ID
 * @property {string} timestamp - 事件时间
 * @property {string} detail - 事件详情
 * @property {string} importance - 伏笔重要性
 * @property {string} foreshadowingType - 伏笔类型
 */

/**
 * 生成伏笔时间线数据
 * 按时间顺序排列所有伏笔的生命周期事件
 * @param {string} projectId - 项目ID
 * @param {Object} [options] - 选项
 * @param {string} [options.filterType] - 按伏笔类型过滤
 * @param {string} [options.filterImportance] - 按重要性过滤
 * @param {string} [options.filterStatus] - 按状态过滤
 * @param {number} [options.limit] - 限制返回数量
 * @returns {TimelineEvent[]} 时间线事件数组
 */
export function generateForeshadowingTimeline(projectId, options = {}) {
  const { filterType, filterImportance, filterStatus, limit } = options
  let list = loadForeshadowings().filter(f => f.projectId === projectId)

  // 应用过滤条件
  if (filterType) list = list.filter(f => f.type === filterType)
  if (filterImportance) list = list.filter(f => f.importance === filterImportance)
  if (filterStatus) list = list.filter(f => f.status === filterStatus)

  const timeline = []

  list.forEach(f => {
    // 埋设事件
    timeline.push({
      id: `tl_${f.id}_planted`,
      type: 'planted',
      foreshadowingId: f.id,
      description: f.description,
      chapterId: f.chapterId,
      timestamp: f.createdAt,
      detail: `埋设伏笔：${f.description}`,
      importance: f.importance,
      foreshadowingType: f.type
    })

    // 备注事件（从notes中提取）
    f.notes.forEach((note, idx) => {
      const noteType = note.includes('发展') ? 'developing'
        : note.includes('回收') ? 'resolved'
          : 'note'
      timeline.push({
        id: `tl_${f.id}_note_${idx}`,
        type: noteType,
        foreshadowingId: f.id,
        description: f.description,
        chapterId: f.chapterId,
        timestamp: f.createdAt, // 备注使用伏笔创建时间（无法精确提取时间）
        detail: note,
        importance: f.importance,
        foreshadowingType: f.type
      })
    })

    // 回收事件
    if (f.resolvedAt) {
      timeline.push({
        id: `tl_${f.id}_resolved`,
        type: 'resolved',
        foreshadowingId: f.id,
        description: f.description,
        chapterId: f.resolvedChapterId,
        timestamp: f.resolvedAt,
        detail: `回收伏笔：${f.description}`,
        importance: f.importance,
        foreshadowingType: f.type
      })
    }
  })

  // 按时间排序
  timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  // 限制数量
  if (limit && limit > 0) {
    return timeline.slice(0, limit)
  }

  return timeline
}

/**
 * 生成伏笔概览面板数据
 * 用于仪表盘展示，包含按章节分布的伏笔信息
 * @param {string} projectId - 项目ID
 * @param {Object[]} chapters - 章节列表 [{id, title, number}]
 * @returns {Object} 概览数据
 */
export function generateForeshadowingOverview(projectId, chapters = []) {
  const foreshadowings = getForeshadowingsByProject(projectId)
  const stats = getForeshadowingStats(projectId)

  // 按章节分组
  const chapterMap = new Map()
  chapters.forEach(ch => chapterMap.set(ch.id, { ...ch, planted: [], resolved: [] }))

  foreshadowings.forEach(f => {
    // 埋设章节
    if (chapterMap.has(f.chapterId)) {
      chapterMap.get(f.chapterId).planted.push(f)
    }
    // 回收章节
    if (f.resolvedChapterId && chapterMap.has(f.resolvedChapterId)) {
      chapterMap.get(f.resolvedChapterId).resolved.push(f)
    }
  })

  // 找出需要关注的伏笔（高重要性 + 长期未处理）
  const now = Date.now()
  const attentionNeeded = foreshadowings
    .filter(f => {
      if (f.status === FORESHADOWING_STATUS.RESOLVED) return false
      if (f.importance !== FORESHADOWING_IMPORTANCE.HIGH) return false
      // 埋设超过30天的高重要性伏笔
      const daysSincePlanted = (now - new Date(f.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      return daysSincePlanted > 30
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  return {
    stats,
    chapterDistribution: Array.from(chapterMap.values()),
    attentionNeeded,
    recentActivity: generateForeshadowingTimeline(projectId, { limit: 10 })
  }
}

// ============================================================================
// 九、搜索与筛选
// ============================================================================

/**
 * 搜索伏笔
 * @param {string} projectId - 项目ID
 * @param {Object} [filters] - 筛选条件
 * @param {string} [filters.keyword] - 关键词搜索（匹配描述和备注）
 * @param {string} [filters.status] - 状态筛选
 * @param {string} [filters.type] - 类型筛选
 * @param {string} [filters.importance] - 重要性筛选
 * @param {string} [filters.characterId] - 关联角色筛选
 * @param {string} [filters.sortBy='createdAt'] - 排序字段
 * @param {string} [filters.sortOrder='desc'] - 排序方向
 * @returns {Foreshadowing[]} 筛选后的伏笔数组
 */
export function searchForeshadowings(projectId, filters = {}) {
  let list = getForeshadowingsByProject(projectId)

  // 关键词搜索
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    list = list.filter(f =>
      f.description.toLowerCase().includes(kw) ||
      f.notes.some(n => n.toLowerCase().includes(kw)) ||
      (f.hint && f.hint.toLowerCase().includes(kw)) ||
      (f.resolutionPlan && f.resolutionPlan.toLowerCase().includes(kw)) ||
      f.tags.some(t => t.toLowerCase().includes(kw))
    )
  }

  // 状态筛选
  if (filters.status) {
    list = list.filter(f => f.status === filters.status)
  }

  // 类型筛选
  if (filters.type) {
    list = list.filter(f => f.type === filters.type)
  }

  // 重要性筛选
  if (filters.importance) {
    list = list.filter(f => f.importance === filters.importance)
  }

  // 关联角色筛选
  if (filters.characterId) {
    list = list.filter(f => f.relatedCharacters.includes(filters.characterId))
  }

  // 排序
  const sortBy = filters.sortBy || 'createdAt'
  const sortOrder = filters.sortOrder || 'desc'
  list.sort((a, b) => {
    let valA = a[sortBy]
    let valB = b[sortBy]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return list
}

/**
 * 导出伏笔数据为JSON字符串
 * @param {string} projectId - 项目ID
 * @returns {string} JSON字符串
 */
export function exportForeshadowings(projectId) {
  const list = getForeshadowingsByProject(projectId)
  return JSON.stringify(list, null, 2)
}

/**
 * 导入伏笔数据
 * @param {string} jsonString - JSON字符串
 * @param {string} projectId - 目标项目ID
 * @param {boolean} [merge=true] - 是否合并（false则替换）
 * @returns {number} 导入的伏笔数量
 */
export function importForeshadowings(jsonString, projectId, merge = true) {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) throw new Error('数据格式错误：期望数组')

    if (merge) {
      const existing = loadForeshadowings()
      // 为导入的伏笔分配新ID并设置项目ID
      const imported = data.map(f => ({
        ...f,
        id: generateId(),
        projectId,
        createdAt: f.createdAt || new Date().toISOString()
      }))
      const merged = [...existing, ...imported]
      saveForeshadowings(merged)
      return imported.length
    } else {
      // 替换模式：先删除该项目所有伏笔，再导入
      const all = loadForeshadowings()
      const filtered = all.filter(f => f.projectId !== projectId)
      const imported = data.map(f => ({
        ...f,
        id: generateId(),
        projectId,
        createdAt: f.createdAt || new Date().toISOString()
      }))
      saveForeshadowings([...filtered, ...imported])
      return imported.length
    }
  } catch (error) {
    console.error('[伏笔系统] 导入失败:', error)
    return 0
  }
}

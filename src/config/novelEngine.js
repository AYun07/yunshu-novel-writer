/**
 * 云书 - 长篇小说创作引擎
 * 
 * 核心能力：
 * 1. 原著结构分析（剧情节奏、力量体系、篇章结构）
 * 2. 项目管理（卷/篇/章三级结构）
 * 3. 角色工坊（原创角色、关系图、成长线）
 * 4. 世界观构建器（力量体系、地图、势力）
 * 5. 章节批量生成（上下文连贯、一致性保持）
 */

// ==================== 原著结构分析Prompt ====================

export const novelStructureAnalysisPrompt = `你是一位专业的小说结构分析师。请对以下文本进行**纯结构层面**的深度分析。

⚠️ 重要声明：本分析仅用于提取抽象的结构特征和叙事模式，绝不复制任何具体内容、情节或人物。

请从以下维度进行分析，以JSON格式返回：

{
  "narrativeStructure": {
    "volumeCount": "卷数（大阶段划分）",
    "arcPattern": "剧情弧线模式（如：升级流/复仇流/探索流/争霸流等）",
    "pacingPattern": "节奏模式描述（如：快慢交替、每10章一个小高潮、每50章一个大高潮等）",
    "cliffhangerFrequency": "悬念钩子频率（如：每章结尾设悬念、每3章一个反转等）",
    "tensionCurve": "张力曲线描述（如何控制读者的紧张感和期待感）"
  },
  "powerSystem": {
    "hasPowerSystem": true,
    "systemName": "力量体系名称（如：斗气/修仙/魔法等）",
    "ranks": ["等级1", "等级2", "等级3", "等级4", "等级5", "等级6", "等级7", "等级8"],
    "rankCount": 8,
    "progressionSpeed": "升级速度（如：前期慢后期快/均匀提升/爆发式突破等）",
    "powerSource": "力量来源（如：天地灵气/血脉/功法/丹药等）",
    "breakthroughMechanism": "突破机制（如：积累+机缘/生死历练/秘境获取等）",
    "combatStyle": "战斗风格描述（如：热血激战/智斗为主/以弱胜强等）"
  },
  "worldFramework": {
    "worldScale": "世界规模（如：大陆级/星球级/多元宇宙等）",
    "regionCount": "主要区域数量",
    "regions": ["区域1", "区域2", "区域3", "区域4", "区域5"],
    "factionTypes": ["势力类型1（如：宗门/家族/帝国/商会等）"],
    "resourceSystem": "资源体系（如：丹药/武器/灵石/功法等）",
    "socialStructure": "社会结构描述"
  },
  "characterArchetypes": {
    "protagonistType": "主角类型（如：废柴逆袭/天才陨落重生/普通人觉醒等）",
    "protagonistTraits": ["特质1", "特质2", "特质3"],
    "rivalTypes": ["对手类型1（如：同辈天才/宗门长老/远古强者等）"],
    "mentorTypes": ["导师类型1"],
    "companionTypes": ["伙伴类型1"],
    "loveInterestTypes": ["感情线类型1"],
    "characterGrowthPattern": "角色成长模式描述"
  },
  "plotPatterns": {
    "openingHook": "开篇钩子类型（如：退婚/被废/穿越/重生等）",
    "recurringMotifs": ["反复出现的主题/情节模式1", "模式2", "模式3"],
    "conflictEscalation": "冲突升级模式（如：个人→家族→宗门→帝国→大陆→世界）",
    "resolutionPattern": "解决模式（如：以战止战/智取/联合/顿悟等）",
    "fillerPatterns": "过渡章节常见内容（如：历练/拍卖会/秘境探索/比赛等）"
  },
  "volumeStructure": [
    {
      "volumeNumber": 1,
      "name": "第一卷名称",
      "chapterRange": "1-100",
      "coreConflict": "核心冲突",
      "powerLevel": "力量等级范围",
      "keyEvents": ["关键事件1", "关键事件2"],
      "endingHook": "卷末钩子"
    }
  ],
  "styleSummary": "一段话总结该小说的核心结构和叙事模式（300字以内）"
}

请严格基于文本的结构和叙事模式进行分析，不涉及具体内容。

待分析文本：
`

// ==================== 角色创建Prompt ====================

export const createCharacterPrompt = (worldSetting, existingCharacters, archetype) => `你是一位专业的小说角色设计师。请创建一个**完全原创**的小说角色。

⚠️ 核心原则：角色必须100%原创，不得与任何已有作品的角色相似。

## 世界观背景
${worldSetting}

## 已有角色（避免重复）
${existingCharacters}

## 角色原型参考
${archetype}

请以JSON格式返回：
{
  "name": "角色姓名（原创）",
  "gender": "性别",
  "age": "年龄",
  "appearance": "外貌描写（100字）",
  "personality": "性格特点（100字）",
  "background": "背景故事（200字）",
  "motivation": "核心动机",
  "powerLevel": "初始力量等级",
  "specialAbilities": ["特殊能力1", "特殊能力2"],
  "growthPotential": "成长潜力描述",
  "flaws": ["性格缺陷1", "缺陷2"],
  "relationships": [
    { "target": "相关角色", "type": "关系类型", "description": "关系描述" }
  ],
  "arc": "角色成长弧线（从开始到结束的变化）",
  "dialogueStyle": "对话风格特点",
  "signaturePhrase": "口头禅或标志性台词"
}

请创建角色：`

// ==================== 世界观构建Prompt ====================

export const buildWorldPrompt = (genre, scale, powerSystemRef) => `你是一位专业的小说世界观设计师。请构建一个**完全原创**的小说世界观。

⚠️ 核心原则：世界观必须100%原创，不得抄袭任何已有作品。

## 类型与规模
- 类型：${genre}
- 规模：${scale}

## 力量体系参考（仅参考结构，不复制）
${powerSystemRef}

请以JSON格式返回：
{
  "worldName": "世界名称",
  "worldType": "世界类型（如：玄幻大陆/修仙界/魔法世界/赛博朋克等）",
  "history": "世界历史概述（300字）",
  "geography": {
    "regions": [
      { "name": "区域名", "description": "描述", "dangerLevel": "危险等级", "specialResources": "特殊资源" }
    ]
  },
  "powerSystem": {
    "name": "力量体系名称",
    "source": "力量来源",
    "ranks": [
      { "level": 1, "name": "等级名", "description": "描述", "abilities": "能力范围" }
    ],
    "breakthroughConditions": "突破条件",
    "specialItems": ["特殊道具1", "道具2"]
  },
  "factions": [
    { "name": "势力名", "type": "类型", "strength": "实力等级", "territory": "领地", "specialty": "特色" }
  ],
  "rules": ["世界规则1", "规则2", "规则3"],
  "resources": ["重要资源1", "资源2"],
  "forbiddenZones": ["禁地1", "禁地2"],
  "legendaryFigures": ["传说人物1", "人物2"],
  "currentEra": "当前时代背景描述（200字）"
}

请构建世界观：`

// ==================== 章节批量生成Prompt ====================

export const generateVolumeOutlinePrompt = (structure, worldSetting, characters, volumeIndex) => `你是一位专业的小说大纲设计师。请根据以下信息，为第${volumeIndex}卷设计详细的章节大纲。

## 原著结构参考（仅参考节奏和模式）
${structure}

## 世界观设定
${worldSetting}

## 主要角色
${characters}

## 要求
1. 第${volumeIndex}卷共50-80章
2. 每章用 ### 开头，格式：### 第X章 章节标题
3. 每章下面写2-3句话描述内容
4. 严格遵循原著的节奏模式和张力曲线
5. 所有情节必须100%原创
6. 包含：日常过渡、冲突升级、高潮战斗、伏笔铺垫、悬念设置
7. 卷末设置大悬念

请直接输出章节大纲：`

export const generateChapterPrompt = (chapterInfo, prevChapterSummary, worldSetting, characters, powerState) => `你是一位专业的网络小说作家。请根据以下信息撰写小说章节。

## 当前章节
标题：${chapterInfo.title}
大纲：${chapterInfo.outline}

## 上下文
前文摘要：${prevChapterSummary}

## 世界观
${worldSetting}

## 活跃角色
${characters}

## 力量状态追踪
${powerState}

## 写作要求
1. 字数2000-3000字
2. 严格保持与前文的连贯性
3. 角色行为符合其性格和当前力量等级
4. 战斗描写要热血、有画面感
5. 对话要符合角色个性
6. 章末设置悬念钩子
7. 所有内容100%原创
8. 不要出现与任何已有作品相似的情节

请直接输出章节内容：`

export const generateChapterSummaryPrompt = (chapterContent) => `请对以下章节内容生成一份简洁的摘要（200字以内），用于后续章节的上下文参考。

摘要需要包含：
1. 主要事件
2. 角色状态变化
3. 力量等级变化
4. 新出现的伏笔
5. 章末悬念

章节内容：
${chapterContent}

请输出摘要：`

// ==================== 项目数据结构 ====================

export function createNovelProject(config) {
  return {
    id: Date.now(),
    name: config.name || '未命名长篇',
    genre: config.genre || '玄幻',
    targetWordCount: config.targetWordCount || 5000000,
    styleProfile: config.styleProfile || null,
    worldSetting: config.worldSetting || null,
    characters: config.characters || [],
    volumes: config.volumes || [],
    currentVolumeIndex: 0,
    currentChapterIndex: 0,
    chapterSummaries: {}, // { "1-5": "摘要内容" }
    powerStates: {}, // { "角色名": "当前等级" }
    plotThreads: [], // 伏笔线索追踪
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      totalChapters: 0,
      totalWords: 0,
      completedChapters: 0
    }
  }
}

export function createVolume(index, name, chapterCount) {
  return {
    index,
    name: name || `第${index}卷`,
    chapterCount: chapterCount || 60,
    chapters: [],
    outline: '',
    coreConflict: '',
    powerLevelRange: '',
    status: 'planned' // planned | outlining | writing | completed
  }
}

export function createChapter(volumeIndex, chapterIndex, title, outline) {
  return {
    volumeIndex,
    chapterIndex,
    title: title || `第${chapterIndex}章`,
    outline: outline || '',
    content: '',
    summary: '',
    wordCount: 0,
    status: 'planned', // planned | writing | completed
    createdAt: new Date().toISOString()
  }
}

// ==================== 项目存储 ====================

const PROJECTS_KEY = 'yunshu_novel_projects'

export function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]')
  } catch { return [] }
}

export function saveProject(project) {
  const projects = getProjects()
  const idx = projects.findIndex(p => p.id === project.id)
  project.updatedAt = new Date().toISOString()
  if (idx > -1) projects[idx] = project
  else projects.push(project)
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function deleteProject(id) {
  const projects = getProjects().filter(p => p.id !== id)
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function exportProject(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-${project.name}-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importProject(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target.result)
        saveProject(project)
        resolve(project)
      } catch { reject(new Error('项目文件格式错误')) }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

// ==================== 批量生成控制 ====================

export const BATCH_CONFIG = {
  maxChaptersPerBatch: 5, // 每批最多生成章节数
  contextWindow: 3, // 上下文窗口（前N章摘要）
  summaryMaxAge: 10, // 摘要最大有效期（章节数）
  autoSaveInterval: 1, // 每生成N章自动保存
  retryOnFail: true, // 失败自动重试
  maxRetries: 2 // 最大重试次数
}

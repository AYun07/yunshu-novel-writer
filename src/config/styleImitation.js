/**
 * 云书 - 风格仿写引擎
 * 
 * 核心原则：提取风格特征，生成完全原创内容
 * 严格遵守著作权法，杜绝抄袭、照搬等侵权行为
 * 
 * 流程：上传文本 → AI分析风格特征 → 基于特征生成原创内容
 */

// ==================== 风格分析Prompt ====================

export const styleAnalysisPrompt = `你是一位专业的文学风格分析师。请对以下文本进行**纯风格层面**的深度分析。

⚠️ 重要声明：本分析仅用于提取写作风格特征，绝不复制、存储或传播原文本的任何具体内容、情节、人物或创意。所有分析结果仅描述抽象的写作手法和风格特点。

请从以下维度进行分析，并以JSON格式返回：

{
  "basicInfo": {
    "genre": "文本类型（如：历史小说/都市言情/科幻悬疑等）",
    "era": "时代背景风格（如：古代/民国/现代/未来等）",
    "tone": "整体基调（如：沉重/轻松/幽默/冷峻等）",
    "narrativeDistance": "叙事距离（如：零距离/近距离/远距离/全知视角等）"
  },
  "languageStyle": {
    "vocabulary": "用词特点（如：文白夹杂/口语化/书面语/方言特色等）",
    "sentencePattern": "句式特点（如：长句为主/短句为主/长短交错/排比句多等）",
    "rhythm": "语言节奏（如：舒缓/紧凑/跳跃/沉稳等）",
    "metaphorStyle": "修辞特点（如：比喻丰富/拟人多/通感/象征等）",
    "dialogueStyle": "对话风格（如：含蓄/直白/幽默/犀利等）",
    "descriptionDensity": "描写密度（如：浓墨重彩/白描勾勒/虚实结合等）"
  },
  "narrativeTechnique": {
    "pov": "叙事视角（如：第一人称/第三人称有限/第三人称全知/多视角等）",
    "timeline": "时间线处理（如：线性/倒叙/插叙/非线性等）",
    "pacing": "节奏控制（如：快节奏/慢节奏/张弛有度等）",
    "suspenseTechnique": "悬念手法（如：伏笔/反转/留白/开放式等）",
    "structurePattern": "结构模式（如：单线/双线/环形/碎片化等）"
  },
  "characterStyle": {
    "characterization": "人物塑造方式（如：行为描写/心理描写/对话驱动/侧面烘托等）",
    "characterDepth": "人物深度（如：扁平化/立体化/内心矛盾丰富等）",
    "relationshipFocus": "关系描写重点（如：亲情/爱情/友情/社会关系等）"
  },
  "worldBuilding": {
    "worldDetail": "世界观细致程度（如：宏大/精巧/写实/架空等）",
    "environmentIntegration": "环境与情节融合度（如：紧密/松散/象征性等）",
    "culturalElements": "文化元素（如：传统文化/西方文化/亚文化/无特定文化等）"
  },
  "emotionalStyle": {
    "emotionExpression": "情感表达方式（如：直接抒发/间接暗示/克制内敛/奔放热烈等）",
    "emotionalTone": "情感基调（如：温暖/冷酷/忧伤/激昂等）",
    "readerEngagement": "读者情感引导（如：共情/疏离/反思/沉浸等）"
  },
  "styleSummary": "一段话总结该文本的核心风格特征，用于指导AI仿写（200字以内）"
}

请严格基于文本的写作手法和风格特点进行分析，不要涉及任何具体的情节内容、人物名称或创意元素。

待分析文本：
`

// ==================== 仿写生成Prompt ====================

export const imitationWritingPrompt = (styleProfile, userRequest) => `你是一位专业的文学创作者。现在你需要根据提供的**风格特征档案**，创作一段**完全原创**的内容。

⚠️ 核心原则：
1. **绝对原创**：所有内容必须100%原创，不得抄袭、照搬、改写任何已有作品的情节、人物、对话或具体描写
2. **风格借鉴**：仅借鉴写作风格、叙事手法和语言特点，不复制任何具体内容
3. **合法合规**：严格遵守著作权法，保障知识产权
4. **创意独立**：人物、情节、场景、对话均为全新创作

## 📋 风格特征档案

### 基本信息
- 文本类型：{{genre}}
- 时代背景：{{era}}
- 整体基调：{{tone}}
- 叙事距离：{{narrativeDistance}}

### 语言风格
- 用词特点：{{vocabulary}}
- 句式特点：{{sentencePattern}}
- 语言节奏：{{rhythm}}
- 修辞特点：{{metaphorStyle}}
- 对话风格：{{dialogueStyle}}
- 描写密度：{{descriptionDensity}}

### 叙事技法
- 叙事视角：{{pov}}
- 时间线处理：{{timeline}}
- 节奏控制：{{pacing}}
- 悬念手法：{{suspenseTechnique}}
- 结构模式：{{structurePattern}}

### 人物风格
- 塑造方式：{{characterization}}
- 人物深度：{{characterDepth}}
- 关系重点：{{relationshipFocus}}

### 世界观
- 细致程度：{{worldDetail}}
- 环境融合：{{environmentIntegration}}
- 文化元素：{{culturalElements}}

### 情感风格
- 表达方式：{{emotionExpression}}
- 情感基调：{{emotionalTone}}
- 读者引导：{{readerEngagement}}

### 风格总结
{{styleSummary}}

## ✍️ 创作要求

用户需求：${userRequest}

请根据以上风格特征档案，创作完全原创的内容。要求：
1. 严格遵循上述风格特征进行创作
2. 所有人物、情节、场景均为全新原创
3. 语言风格、叙事手法与风格档案保持一致
4. 内容完整、情节合理、人物丰满
5. 不得出现与任何已有作品相似的具体情节或描写

请直接输出原创内容：`

// ==================== 版权合规声明 ====================

export const copyrightNotice = `
## ⚖️ 版权合规声明

1. **风格提取，非内容复制**：本功能仅分析文本的写作风格特征（如句式、修辞、叙事手法等），不复制、存储或传播原文本的具体内容。

2. **原创生成**：所有生成的内容均为AI全新创作，人物、情节、场景、对话均为原创，不抄袭、不照搬任何已有作品。

3. **合法使用**：请确保上传的文本为您合法拥有的正版书籍。仅支持用于学习写作风格的目的。

4. **禁止用途**：严禁将本功能用于抄袭、侵权、盗版等任何违法用途。

5. **用户责任**：用户对上传内容和生成内容的使用承担全部法律责任。
`

export const supportedFormats = [
  { name: 'TXT', ext: '.txt', mime: 'text/plain' },
  { name: 'Markdown', ext: '.md', mime: 'text/markdown' },
  { name: 'EPUB', ext: '.epub', mime: 'application/epub+zip' },
  { name: 'PDF', ext: '.pdf', mime: 'application/pdf' }
]

export const maxFileSize = 10 * 1024 * 1024 // 10MB

export const maxTextLength = 50000 // 最大分析文本长度（字符数）

// ==================== 辅助函数 ====================

/**
 * 从文本中提取用于风格分析的样本
 * 智能采样：优先取开头、中间、结尾段落
 */
export function extractStyleSample(text, maxLength = 15000) {
  if (text.length <= maxLength) return text

  const third = Math.floor(maxLength / 3)
  
  // 取开头
  const beginning = text.slice(0, third)
  
  // 取中间
  const midStart = Math.floor(text.length / 2) - Math.floor(third / 2)
  const middle = text.slice(midStart, midStart + third)
  
  // 取结尾
  const ending = text.slice(-third)
  
  return `${beginning}\n\n......\n\n${middle}\n\n......\n\n${ending}`
}

/**
 * 验证上传文件
 */
export function validateUploadFile(file) {
  const allowedExts = ['.txt', '.md', '.epub', '.pdf']
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  
  if (!allowedExts.includes(ext)) {
    return { valid: false, error: `不支持的文件格式。请上传 ${allowedExts.join('、')} 格式的文件。` }
  }
  
  if (file.size > maxFileSize) {
    return { valid: false, error: `文件大小超过限制。最大支持 ${maxFileSize / 1024 / 1024}MB。` }
  }
  
  return { valid: true }
}

/**
 * 读取文本文件内容
 */
export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * 将风格档案填充到仿写Prompt中
 */
export function buildImitationPrompt(styleProfile, userRequest) {
  let prompt = imitationWritingPrompt(styleProfile, userRequest)
  
  // 替换模板变量
  const fields = [
    'genre', 'era', 'tone', 'narrativeDistance',
    'vocabulary', 'sentencePattern', 'rhythm', 'metaphorStyle', 'dialogueStyle', 'descriptionDensity',
    'pov', 'timeline', 'pacing', 'suspenseTechnique', 'structurePattern',
    'characterization', 'characterDepth', 'relationshipFocus',
    'worldDetail', 'environmentIntegration', 'culturalElements',
    'emotionExpression', 'emotionalTone', 'readerEngagement',
    'styleSummary'
  ]
  
  // 从嵌套对象中提取值
  const flatMap = {}
  const { basicInfo, languageStyle, narrativeTechnique, characterStyle, worldBuilding, emotionalStyle, styleSummary } = styleProfile
  
  Object.assign(flatMap, basicInfo, languageStyle, narrativeTechnique, characterStyle, worldBuilding, emotionalStyle, { styleSummary })
  
  fields.forEach(field => {
    const placeholder = `{{${field}}}`
    const value = flatMap[field] || '未分析'
    prompt = prompt.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
  })
  
  return prompt
}

// ==================== 多文本风格融合Prompt ====================

export const multiStyleMergePrompt = `你是一位专业的文学风格分析师。现在有多份文本的风格分析报告，请将它们**融合为一个统一的风格档案**。

⚠️ 重要：仅融合抽象的写作风格特征，不涉及任何具体内容。

请对以下多个风格档案进行融合，取各档案的精华特点，生成一个综合风格档案。以JSON格式返回，格式与单文本分析相同：

{
  "basicInfo": { "genre": "", "era": "", "tone": "", "narrativeDistance": "" },
  "languageStyle": { "vocabulary": "", "sentencePattern": "", "rhythm": "", "metaphorStyle": "", "dialogueStyle": "", "descriptionDensity": "" },
  "narrativeTechnique": { "pov": "", "timeline": "", "pacing": "", "suspenseTechnique": "", "structurePattern": "" },
  "characterStyle": { "characterization": "", "characterDepth": "", "relationshipFocus": "" },
  "worldBuilding": { "worldDetail": "", "environmentIntegration": "", "culturalElements": "" },
  "emotionalStyle": { "emotionExpression": "", "emotionalTone": "", "readerEngagement": "" },
  "styleSummary": "融合后的风格总结（200字以内）"
}

以下是需要融合的风格档案：
`

// ==================== 四种仿写模式Prompt ====================

export const modePrompts = {
  // 续写章节模式
  continue: (styleProfile, context) => `你是一位专业的文学创作者。请基于以下**风格特征档案**和**前文内容**，续写新的章节。

⚠️ 核心原则：续写内容必须100%原创，不得抄袭任何已有作品。

## 风格特征
${JSON.stringify(styleProfile, null, 2)}

## 前文内容（最后2000字）
${context.slice(-2000)}

## 续写要求
1. 严格遵循风格特征档案的写作风格
2. 承接前文的情节、人物和氛围
3. 推进故事发展，有新的冲突或转折
4. 续写字数800-1500字
5. 所有新增内容必须原创

请直接输出续写内容：`,

  // 全新创作模式
  create: (styleProfile, theme, wordCount) => `你是一位专业的文学创作者。请基于以下**风格特征档案**，创作一个**全新的故事**。

⚠️ 核心原则：所有内容必须100%原创，人物、情节、场景均为全新创作。

## 风格特征
${JSON.stringify(styleProfile, null, 2)}

## 创作要求
- 主题：${theme}
- 目标字数：${wordCount}字
- 严格遵循风格特征
- 内容完整，有开头、发展、高潮、结局
- 所有内容原创

请直接输出：`,

  // 内容改写模式
  rewrite: (styleProfile, sourceText) => `你是一位专业的文学创作者。请将以下**原文内容**用指定的**风格特征**进行改写。

⚠️ 核心原则：改写后的内容必须与原文在表达方式上完全不同，仅保持核心含义，所有具体描写、用词、句式均为全新创作。

## 风格特征
${JSON.stringify(styleProfile, null, 2)}

## 原文内容
${sourceText}

## 改写要求
1. 保持原文的核心含义和信息
2. 完全使用风格特征档案中的写作风格
3. 所有具体描写、用词、句式必须重新创作
4. 不得保留原文的任何连续5个字以上的相同表述
5. 改写后与原文的相似度应低于30%

请直接输出改写后的内容：`,

  // 跨体裁仿写模式
  crossGenre: (styleProfile, targetGenre, theme) => `你是一位专业的文学创作者。请将以下**风格特征**应用到**不同的体裁**中。

⚠️ 核心原则：所有内容必须100%原创。

## 原始风格特征
${JSON.stringify(styleProfile, null, 2)}

## 跨体裁要求
- 原始体裁：${styleProfile.basicInfo?.genre || '未指定'}
- 目标体裁：${targetGenre}
- 主题：${theme}

## 转换要求
1. 保留原始风格的**语言特点**（用词、句式、修辞、节奏）
2. 保留原始风格的**情感基调**和**叙事手法**
3. 完全按照目标体裁的**格式和结构**进行创作
4. 所有内容原创，不抄袭任何已有作品
5. 展现风格在不同体裁中的表现力

请直接输出：`
}

// ==================== 原创度自检Prompt ====================

export const originalityCheckPrompt = (generatedText, styleProfile) => `你是一位专业的文学版权审核专家。请对以下**AI生成的内容**进行原创度自检。

⚠️ 检查目的：确保内容不侵犯任何已有作品的著作权。

## 待检查内容
${generatedText}

## 风格参考（仅用于对比风格，非对比内容）
风格类型：${styleProfile.basicInfo?.genre || '未指定'}
风格总结：${styleProfile.styleSummary || '未指定'}

## 请从以下维度进行检查，以JSON格式返回：

{
  "overallScore": 85,
  "originality": {
    "score": 90,
    "assessment": "评估说明",
    "risks": ["风险点1（如有）"]
  },
  "styleConsistency": {
    "score": 85,
    "assessment": "风格一致性评估"
  },
  "creativity": {
    "score": 88,
    "assessment": "创意性评估"
  },
  "readability": {
    "score": 90,
    "assessment": "可读性评估"
  },
  "suggestions": ["改进建议1", "改进建议2"],
  "summary": "总体评价"
}

评分标准：
- 90-100：优秀，高度原创
- 80-89：良好，基本原创
- 70-79：一般，建议修改部分内容
- 60-69：需注意，存在较多相似表述
- 60以下：警告，需要大幅修改

请严格检查并返回JSON：`

// ==================== 风格档案管理 ====================

const STORAGE_KEY = 'yunshu_style_profiles'

export function getSavedProfiles() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveProfile(profile) {
  const profiles = getSavedProfiles()
  const newProfile = {
    id: Date.now(),
    ...profile,
    savedAt: new Date().toISOString(),
    isFavorite: false
  }
  profiles.push(newProfile)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  return newProfile
}

export function updateProfile(id, updates) {
  const profiles = getSavedProfiles()
  const index = profiles.findIndex(p => p.id === id)
  if (index > -1) {
    profiles[index] = { ...profiles[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    return profiles[index]
  }
  return null
}

export function deleteProfile(id) {
  const profiles = getSavedProfiles()
  const filtered = profiles.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function toggleFavorite(id) {
  const profiles = getSavedProfiles()
  const profile = profiles.find(p => p.id === id)
  if (profile) {
    profile.isFavorite = !profile.isFavorite
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    return profile
  }
  return null
}

export function exportProfiles() {
  const profiles = getSavedProfiles()
  const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-风格档案-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importProfiles(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        const profiles = getSavedProfiles()
        const newProfiles = Array.isArray(data) ? data : [data]
        newProfiles.forEach(p => {
          if (!profiles.find(existing => existing.id === p.id)) {
            profiles.push({ ...p, id: Date.now() + Math.random() * 1000 })
          }
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
        resolve(profiles)
      } catch {
        reject(new Error('档案文件格式错误'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

/**
 * ============================================================================
 * 云书 - 叙事结构建模系统 (Narrative Structure System)
 * ============================================================================
 * 对标 bibisco 的叙事分析功能
 *
 * 功能概览：
 * - 叙事元素定义（前提、故事时间线、叙事线索、主题、冲突、象征）
 * - 每个元素的详细数据结构
 * - AI 叙事结构分析提示词
 * - 角色心理引导问题模板（30+问题）
 * - 角色关系类型定义
 * - 角色弧线类型
 * - 故事线模板（三幕式、英雄之旅、起承转合、非线性等）
 * - 时间线事件数据结构
 *
 * 使用方式：
 *   import { NARRATIVE_ELEMENTS, CHARACTER_QUESTIONS, STORY_TEMPLATES, ... } from '@/config/narrativeStructure'
 * ============================================================================
 */

// ============================================================================
// 一、叙事元素定义
// ============================================================================

/**
 * 叙事元素类型枚举
 */
export const NARRATIVE_ELEMENT_TYPES = {
  PREMISE: 'premise',                   // 前提（故事的核心假设/命题）
  FABULA: 'fabula',                     // 故事按时间顺序（素材事件序列）
  NARRATIVE_STRANDS: 'narrativeStrands', // 叙事线索（多条交织的故事线）
  THEMES: 'themes',                     // 主题（作品探讨的核心思想）
  CONFLICTS: 'conflicts',               // 冲突（推动故事发展的矛盾）
  SYMBOLS: 'symbols'                    // 象征（承载深层意义的意象）
}

/**
 * 叙事元素数据结构定义
 * 每种元素都有统一的基类结构 + 特有字段
 */
export const NARRATIVE_ELEMENTS = {
  // ------------------------------------------------------------------
  // 1. 前提 (Premise) - 故事的核心假设/命题
  // ------------------------------------------------------------------
  premise: {
    type: NARRATIVE_ELEMENT_TYPES.PREMISE,
    label: '前提',
    description: '故事的核心假设或命题，是整个叙事的基础。一个好前提通常包含"如果...会怎样"的假设。',
    dataStructure: {
      id: 'string - 唯一标识',
      projectId: 'string - 项目ID',
      statement: 'string - 前提陈述（一句话概括）',
      elaboration: 'string - 详细阐述（2-3段解释）',
      whatIf: 'string - "如果...会怎样"假设',
      protagonistGoal: 'string - 主角目标',
      centralConflict: 'string - 核心冲突',
      stakes: 'string - 赌注/代价',
      genre: 'string - 类型',
      tone: 'string - 基调',
      themes: 'string[] - 关联主题ID列表',
      createdAt: 'string - 创建时间',
      updatedAt: 'string - 更新时间'
    },
    example: {
      statement: '如果一个普通人突然获得了读心术，他该如何面对身边人最真实的想法？',
      whatIf: '如果一个人能听到所有人的心声，他还能维持正常的人际关系吗？',
      protagonistGoal: '学会控制读心术，同时不被真相摧毁',
      centralConflict: '知道真相的痛苦 vs 维持表面和谐的渴望',
      stakes: '失去所有亲密关系，陷入彻底的孤独'
    }
  },

  // ------------------------------------------------------------------
  // 2. 故事时间线 (Fabula) - 按时间顺序排列的事件序列
  // ------------------------------------------------------------------
  fabula: {
    type: NARRATIVE_ELEMENT_TYPES.FABULA,
    label: '故事时间线',
    description: '故事事件按时间先后顺序排列的序列，与叙事顺序（Sjužet）相对。用于理清故事的真实时间线。',
    dataStructure: {
      id: 'string - 唯一标识',
      projectId: 'string - 项目ID',
      events: [
        {
          id: 'string - 事件ID',
          title: 'string - 事件标题',
          description: 'string - 事件描述',
          chronologicalOrder: 'number - 时间顺序编号',
          narrativeOrder: 'number|null - 叙事中出现的位置（null表示未在正文中出现）',
          timestamp: 'string - 故事内时间',
          duration: 'string - 持续时长',
          location: 'string - 发生地点',
          characters: 'string[] - 参与角色ID列表',
          consequences: 'string[] - 后续影响',
          foreshadowingIds: 'string[] - 关联伏笔ID列表'
        }
      ],
      totalDuration: 'string - 故事总时间跨度',
      startTimestamp: 'string - 故事开始时间',
      endTimestamp: 'string - 故事结束时间',
      createdAt: 'string - 创建时间',
      updatedAt: 'string - 更新时间'
    },
    example: {
      totalDuration: '三年',
      startTimestamp: '2024年春天',
      endTimestamp: '2027年夏天'
    }
  },

  // ------------------------------------------------------------------
  // 3. 叙事线索 (Narrative Strands) - 多条交织的故事线
  // ------------------------------------------------------------------
  narrativeStrands: {
    type: NARRATIVE_ELEMENT_TYPES.NARRATIVE_STRANDS,
    label: '叙事线索',
    description: '故事中同时进行的多条线索，它们相互交织、推动或对照。每条线索有自己的起承转合。',
    dataStructure: {
      id: 'string - 唯一标识',
      projectId: 'string - 项目ID',
      strands: [
        {
          id: 'string - 线索ID',
          name: 'string - 线索名称',
          type: 'string - 线索类型（main/subplot/parallel/flashback/foreshadow）',
          description: 'string - 线索描述',
          characters: 'string[] - 主要角色ID列表',
          startChapter: 'string - 开始章节ID',
          endChapter: 'string|null - 结束章节ID',
          status: 'string - 状态（active/paused/concluded）',
          importance: 'string - 重要性（primary/secondary/tertiary）',
          relatedStrandIds: 'string[] - 关联线索ID列表',
          milestones: [
            {
              chapterId: 'string - 章节ID',
              event: 'string - 事件描述',
              impact: 'string - 对故事的影响'
            }
          ],
          themeIds: 'string[] - 关联主题ID列表'
        }
      ],
      createdAt: 'string - 创建时间',
      updatedAt: 'string - 更新时间'
    },
    example: {
      strands: [
        {
          name: '主线：复仇之路',
          type: 'main',
          importance: 'primary'
        },
        {
          name: '副线：爱情萌芽',
          type: 'subplot',
          importance: 'secondary'
        }
      ]
    }
  },

  // ------------------------------------------------------------------
  // 4. 主题 (Themes) - 作品探讨的核心思想
  // ------------------------------------------------------------------
  themes: {
    type: NARRATIVE_ELEMENT_TYPES.THEMES,
    label: '主题',
    description: '作品探讨的核心思想、哲学问题或人类经验。主题通过情节、角色和象征反复体现。',
    dataStructure: {
      id: 'string - 唯一标识',
      projectId: 'string - 项目ID',
      themes: [
        {
          id: 'string - 主题ID',
          name: 'string - 主题名称',
          statement: 'string - 主题陈述（作者想表达的观点）',
          question: 'string - 主题提出的问题',
          opposite: 'string - 反面观点（用于制造张力）',
          type: 'string - 主题类型（central/secondary/recurring）',
          manifestations: [
            {
              type: 'string - 体现方式（plot/character/symbol/dialogue/setting）',
              description: 'string - 具体描述',
              chapterIds: 'string[] - 出现的章节'
            }
          ],
          relatedThemeIds: 'string[] - 关联主题ID列表',
          characterIds: 'string[] - 主要体现该主题的角色ID列表'
        }
      ],
      createdAt: 'string - 创建时间',
      updatedAt: 'string - 更新时间'
    },
    example: {
      themes: [
        {
          name: '自由与命运',
          statement: '人是否真的能掌控自己的命运，还是一切早已注定？',
          question: '在命运面前，个人的选择还有意义吗？',
          opposite: '命运不过是懦弱者的借口',
          type: 'central'
        }
      ]
    }
  },

  // ------------------------------------------------------------------
  // 5. 冲突 (Conflicts) - 推动故事发展的矛盾
  // ------------------------------------------------------------------
  conflicts: {
    type: NARRATIVE_ELEMENT_TYPES.CONFLICTS,
    label: '冲突',
    description: '故事中的矛盾和对立，是推动情节发展的核心动力。冲突可以是内在的、人际的或环境性的。',
    dataStructure: {
      id: 'string - 唯一标识',
      projectId: 'string - 项目ID',
      conflicts: [
        {
          id: 'string - 冲突ID',
          name: 'string - 冲突名称',
          type: 'string - 冲突类型（internal/interpersonal/societal/environmental/supernatural）',
          level: 'string - 冲突层级（core/secondary/minor）',
          description: 'string - 冲突描述',
          parties: 'string[] - 冲突各方（角色ID列表）',
          cause: 'string - 起因',
          escalation: 'string - 升级过程',
          climax: 'string - 高潮/转折点',
          resolution: 'string|null - 解决方式（null表示未解决）',
          status: 'string - 状态（brewing/active/escalating/climax/resolved）',
          themeIds: 'string[] - 关联主题ID列表',
          chapterRange: {
            start: 'string - 开始章节ID',
            end: 'string|null - 结束章节ID'
          }
        }
      ],
      createdAt: 'string - 创建时间',
      updatedAt: 'string - 更新时间'
    },
    example: {
      conflicts: [
        {
          name: '主角的自我认同危机',
          type: 'internal',
          level: 'core',
          description: '主角在家族期望和个人理想之间的挣扎'
        }
      ]
    }
  },

  // ------------------------------------------------------------------
  // 6. 象征 (Symbols) - 承载深层意义的意象
  // ------------------------------------------------------------------
  symbols: {
    type: NARRATIVE_ELEMENT_TYPES.SYMBOLS,
    label: '象征',
    description: '在故事中承载深层意义的物体、场景、颜色、动作等。象征为叙事增添层次和丰富性。',
    dataStructure: {
      id: 'string - 唯一标识',
      projectId: 'string - 项目ID',
      symbols: [
        {
          id: 'string - 象征ID',
          name: 'string - 象征名称',
          form: 'string - 象征形式（object/color/animal/place/action/weather/number/other）',
          literalDescription: 'string - 字面描述',
          symbolicMeaning: 'string - 象征意义',
          context: 'string - 使用场景/上下文',
          evolution: 'string - 象征意义在故事中的演变',
          associatedCharacters: 'string[] - 关联角色ID列表',
          chapterOccurrences: [
            {
              chapterId: 'string - 章节ID',
              context: 'string - 出现场景描述',
              nuance: 'string - 此处的微妙含义'
            }
          ],
          themeIds: 'string[] - 关联主题ID列表',
          culturalReference: 'string - 文化/文学参考（如有）'
        }
      ],
      createdAt: 'string - 创建时间',
      updatedAt: 'string - 更新时间'
    },
    example: {
      symbols: [
        {
          name: '枯萎的玫瑰',
          form: 'object',
          literalDescription: '主角桌上逐渐枯萎的一朵红玫瑰',
          symbolicMeaning: '逝去的爱情和不可逆转的时间',
          evolution: '从盛开到枯萎，象征主角从满怀希望到接受现实的心理变化'
        }
      ]
    }
  }
}

// ============================================================================
// 二、AI 叙事结构分析提示词
// ============================================================================

/**
 * AI 叙事结构分析提示词
 * 从大纲或文本中提取叙事元素
 * @param {Object} params
 * @param {string} params.content - 大纲或文本内容
 * @param {string} params.contentType - 内容类型（outline/draft/fulltext）
 * @param {string} params.novelGenre - 小说类型
 * @param {string} [params.focusElements] - 重点关注元素（逗号分隔）
 * @returns {string} 完整的AI提示词
 */
export function buildNarrativeAnalysisPrompt({
  content,
  contentType,
  novelGenre,
  focusElements = ''
}) {
  return `你是一位资深的文学分析师和叙事学专家。请分析以下${contentType === 'outline' ? '大纲' : contentType === 'draft' ? '初稿' : '正文'}，提取其中的叙事结构元素。

## 小说类型
${novelGenre}

## 分析内容
${content}

${focusElements ? `## 重点关注元素\n${focusElements}` : ''}

## 分析要求
请从以下六个维度进行分析：

### 1. 前提 (Premise)
- 提取故事的核心前提假设
- 识别主角的目标和核心冲突
- 分析故事的赌注/代价

### 2. 故事时间线 (Fabula)
- 梳理事件的时间顺序
- 标注哪些事件在叙事中被重新排列
- 识别时间跳跃和倒叙

### 3. 叙事线索 (Narrative Strands)
- 识别所有故事线索（主线和副线）
- 分析线索之间的交织关系
- 标注每条线索的状态

### 4. 主题 (Themes)
- 提取核心主题和次要主题
- 分析主题的体现方式
- 识别主题之间的关联

### 5. 冲突 (Conflicts)
- 识别所有层级的冲突
- 分析冲突的类型和驱动力
- 梳理冲突的升级和解决过程

### 6. 象征 (Symbols)
- 识别反复出现的意象
- 分析其象征意义
- 追踪象征的演变过程

## 输出格式
请以JSON格式输出：
{
  "premise": {
    "statement": "前提陈述",
    "whatIf": "如果...会怎样",
    "protagonistGoal": "主角目标",
    "centralConflict": "核心冲突",
    "stakes": "赌注/代价"
  },
  "fabula": {
    "events": [
      {"title": "事件标题", "description": "描述", "chronologicalOrder": 1, "narrativeOrder": 3}
    ]
  },
  "narrativeStrands": [
    {"name": "线索名称", "type": "main/subplot", "description": "描述", "importance": "primary/secondary"}
  ],
  "themes": [
    {"name": "主题名称", "statement": "主题陈述", "question": "主题问题", "type": "central/secondary"}
  ],
  "conflicts": [
    {"name": "冲突名称", "type": "internal/interpersonal/societal", "level": "core/secondary", "description": "描述"}
  ],
  "symbols": [
    {"name": "象征名称", "form": "object/color/animal", "literalDescription": "字面描述", "symbolicMeaning": "象征意义"}
  ],
  "overallAssessment": "叙事结构整体评价",
  "suggestions": ["改进建议1", "改进建议2"]
}`
}

// ============================================================================
// 三、角色心理引导问题模板（30+问题）
// ============================================================================

/**
 * 角色心理引导问题分类
 */
export const CHARACTER_QUESTION_CATEGORIES = {
  CONTRADICTION: 'contradiction',     // 矛盾
  FEAR: 'fear',                       // 恐惧
  DESIRE: 'desire',                   // 欲望
  GROWTH_ARC: 'growthArc',           // 成长弧线
  RELATIONSHIP: 'relationship',       // 关系
  MOTIVATION: 'motivation',           // 动机
  IDENTITY: 'identity',               // 自我认同
  MORALITY: 'morality',               // 道德观
  PAST: 'past',                       // 过去
  SECRET: 'secret'                    // 秘密
}

/**
 * 角色心理引导问题模板
 * 共30+个问题，涵盖角色塑造的各个维度
 * 用于帮助作者深入理解角色，创造立体的人物
 */
export const CHARACTER_PSYCHOLOGY_QUESTIONS = [
  // ==================== 矛盾 (Contradiction) ====================
  {
    id: 'cq_001',
    category: CHARACTER_QUESTION_CATEGORIES.CONTRADICTION,
    question: '这个角色最大的内在矛盾是什么？',
    followUp: '这个矛盾如何影响他/她的日常行为和重大决策？',
    purpose: '揭示角色内心的张力，使角色更加立体'
  },
  {
    id: 'cq_002',
    category: CHARACTER_QUESTION_CATEGORIES.CONTRADICTION,
    question: '角色嘴上说的话和心里想的有什么不同？',
    followUp: '在什么情况下这种反差最为明显？',
    purpose: '创造角色言行不一的戏剧性'
  },
  {
    id: 'cq_003',
    category: CHARACTER_QUESTION_CATEGORIES.CONTRADICTION,
    question: '角色最不想成为什么样的人，却最有可能成为那样的人？',
    followUp: '是什么力量在推动他/她走向那个方向？',
    purpose: '设置角色的悲剧性或讽刺性弧线'
  },

  // ==================== 恐惧 (Fear) ====================
  {
    id: 'cq_004',
    category: CHARACTER_QUESTION_CATEGORIES.FEAR,
    question: '这个角色最害怕什么？',
    followUp: '这个恐惧源于什么经历？它如何影响角色的行为模式？',
    purpose: '定义角色的软肋，为故事制造紧张感'
  },
  {
    id: 'cq_005',
    category: CHARACTER_QUESTION_CATEGORIES.FEAR,
    question: '如果角色的秘密被公开，他/她会最害怕谁看到？',
    followUp: '为什么这个人的看法对角色如此重要？',
    purpose: '揭示角色的人际关系和脆弱点'
  },
  {
    id: 'cq_006',
    category: CHARACTER_QUESTION_CATEGORIES.FEAR,
    question: '角色在深夜独自一人时会想什么？',
    followUp: '这些想法让他/她感到安慰还是不安？',
    purpose: '展现角色卸下面具后的真实状态'
  },

  // ==================== 欲望 (Desire) ====================
  {
    id: 'cq_007',
    category: CHARACTER_QUESTION_CATEGORIES.DESIRE,
    question: '角色最渴望得到什么？（不是需要，而是渴望）',
    followUp: '如果得到了，他/她的生活真的会变好吗？',
    purpose: '区分表面欲望和深层需求'
  },
  {
    id: 'cq_008',
    category: CHARACTER_QUESTION_CATEGORIES.DESIRE,
    question: '角色愿意为达成目标牺牲什么？',
    followUp: '这个牺牲的底线在哪里？什么会让他/她停下来？',
    purpose: '测试角色的决心和道德边界'
  },
  {
    id: 'cq_009',
    category: CHARACTER_QUESTION_CATEGORIES.DESIRE,
    question: '角色认为自己值得拥有幸福吗？',
    followUp: '这种自我认知从何而来？它如何影响角色面对机会时的反应？',
    purpose: '探索角色的自我价值感'
  },

  // ==================== 成长弧线 (Growth Arc) ====================
  {
    id: 'cq_010',
    category: CHARACTER_QUESTION_CATEGORIES.GROWTH_ARC,
    question: '故事开始时，角色最需要学会什么？',
    followUp: '是什么经历会让他/她学到这个教训？',
    purpose: '定义角色的成长起点和方向'
  },
  {
    id: 'cq_011',
    category: CHARACTER_QUESTION_CATEGORIES.GROWTH_ARC,
    question: '角色的世界观在故事中会如何改变？',
    followUp: '是什么事件触发了这种改变？改变后的世界观众带来什么新问题？',
    purpose: '规划角色的认知转变'
  },
  {
    id: 'cq_012',
    category: CHARACTER_QUESTION_CATEGORIES.GROWTH_ARC,
    question: '角色在故事结尾时会变成什么样的人？',
    followUp: '与故事开头相比，最大的变化是什么？这个变化是好是坏？',
    purpose: '明确角色的终点状态'
  },
  {
    id: 'cq_013',
    category: CHARACTER_QUESTION_CATEGORIES.GROWTH_ARC,
    question: '角色什么时候会意识到自己需要改变？',
    followUp: '他/她会主动寻求改变，还是被迫改变？',
    purpose: '设计角色觉醒的关键时刻'
  },

  // ==================== 关系 (Relationship) ====================
  {
    id: 'cq_014',
    category: CHARACTER_QUESTION_CATEGORIES.RELATIONSHIP,
    question: '角色最信任的人是谁？为什么？',
    followUp: '如果这个人背叛了角色，他/她会怎么做？',
    purpose: '建立角色的信任基础和脆弱点'
  },
  {
    id: 'cq_015',
    category: CHARACTER_QUESTION_CATEGORIES.RELATIONSHIP,
    question: '角色最不想让谁失望？',
    followUp: '为了不让这个人失望，角色做过什么违背本心的事？',
    purpose: '揭示角色关系中的权力动态'
  },
  {
    id: 'cq_016',
    category: CHARACTER_QUESTION_CATEGORIES.RELATIONSHIP,
    question: '角色在人际关系中是给予者还是索取者？',
    followUp: '这种倾向是健康的还是不健康的？它如何影响他/她的亲密关系？',
    purpose: '分析角色的关系模式'
  },
  {
    id: 'cq_017',
    category: CHARACTER_QUESTION_CATEGORIES.RELATIONSHIP,
    question: '角色最怀念的一段关系是什么？',
    followUp: '为什么这段关系结束了？角色从中学到了什么？',
    purpose: '通过过去的关系丰富角色背景'
  },
  {
    id: 'cq_018',
    category: CHARACTER_QUESTION_CATEGORIES.RELATIONSHIP,
    question: '角色如何表达爱意？',
    followUp: '他/她表达爱的方式是否能被对方理解？这种错位会导致什么问题？',
    purpose: '设计角色独特的爱的语言'
  },

  // ==================== 动机 (Motivation) ====================
  {
    id: 'cq_019',
    category: CHARACTER_QUESTION_CATEGORIES.MOTIVATION,
    question: '驱使角色行动的根本动力是什么？',
    followUp: '这个动力是外在的（奖励/惩罚）还是内在的（信念/情感）？',
    purpose: '找到角色的核心驱动力'
  },
  {
    id: 'cq_020',
    category: CHARACTER_QUESTION_CATEGORIES.MOTIVATION,
    question: '角色做某件事的"真正原因"和他/她告诉别人的"原因"有什么不同？',
    followUp: '角色是在欺骗别人，还是在欺骗自己？',
    purpose: '区分表面动机和深层动机'
  },
  {
    id: 'cq_021',
    category: CHARACTER_QUESTION_CATEGORIES.MOTIVATION,
    question: '什么情况下角色会放弃自己的目标？',
    followUp: '放弃后他/她会感到解脱还是空虚？',
    purpose: '测试角色动机的坚定程度'
  },

  // ==================== 自我认同 (Identity) ====================
  {
    id: 'cq_022',
    category: CHARACTER_QUESTION_CATEGORIES.IDENTITY,
    question: '角色如何定义自己？',
    followUp: '这个自我定义准确吗？别人对他的看法和他自己认为的一样吗？',
    purpose: '探索角色的自我认知'
  },
  {
    id: 'cq_023',
    category: CHARACTER_QUESTION_CATEGORIES.IDENTITY,
    question: '角色最引以为傲的品质是什么？',
    followUp: '这个品质在什么情况下会变成他/她的弱点？',
    purpose: '找到角色优缺点的辩证关系'
  },
  {
    id: 'cq_024',
    category: CHARACTER_QUESTION_CATEGORIES.IDENTITY,
    question: '如果角色可以改变自己的一件事，会是什么？',
    followUp: '为什么这件事对他/她如此重要？',
    purpose: '揭示角色的自我不满'
  },

  // ==================== 道德观 (Morality) ====================
  {
    id: 'cq_025',
    category: CHARACTER_QUESTION_CATEGORIES.MORALITY,
    question: '角色的道德底线在哪里？',
    followUp: '什么情况下他/她会跨越这条底线？跨越后的心理状态如何？',
    purpose: '定义角色的道德边界'
  },
  {
    id: 'cq_026',
    category: CHARACTER_QUESTION_CATEGORIES.MORALITY,
    question: '角色认为"正义"是什么？',
    followUp: '他/她愿意为正义付出多大代价？他/她的正义观会随故事改变吗？',
    purpose: '探索角色的价值观'
  },
  {
    id: 'cq_027',
    category: CHARACTER_QUESTION_CATEGORIES.MORALITY,
    question: '角色做过最让自己羞愧的事是什么？',
    followUp: '他/她如何面对这份羞愧？是弥补、逃避还是合理化？',
    purpose: '通过角色的道德困境增加深度'
  },

  // ==================== 过去 (Past) ====================
  {
    id: 'cq_028',
    category: CHARACTER_QUESTION_CATEGORIES.PAST,
    question: '角色童年最深刻的记忆是什么？',
    followUp: '这段记忆如何塑造了他/她现在的性格？',
    purpose: '通过童年经历解释角色特质'
  },
  {
    id: 'cq_029',
    category: CHARACTER_QUESTION_CATEGORIES.PAST,
    question: '角色生命中的转折点是什么？',
    followUp: '如果这个转折没有发生，角色会变成什么样的人？',
    purpose: '找到塑造角色的关键事件'
  },
  {
    id: 'cq_030',
    category: CHARACTER_QUESTION_CATEGORIES.PAST,
    question: '角色最想忘记的一段经历是什么？',
    followUp: '这段经历以什么方式在故事中重新浮现？',
    purpose: '埋设角色背景故事的伏笔'
  },

  // ==================== 秘密 (Secret) ====================
  {
    id: 'cq_031',
    category: CHARACTER_QUESTION_CATEGORIES.SECRET,
    question: '角色最大的秘密是什么？',
    followUp: '如果这个秘密被揭露，最直接的后果是什么？',
    purpose: '为故事制造悬念和冲突'
  },
  {
    id: 'cq_032',
    category: CHARACTER_QUESTION_CATEGORIES.SECRET,
    question: '角色对自己隐瞒了什么？',
    followUp: '他/她为什么不愿意面对这个真相？',
    purpose: '探索角色的自我欺骗'
  },
  {
    id: 'cq_033',
    category: CHARACTER_QUESTION_CATEGORIES.SECRET,
    question: '角色最不想让读者知道什么？',
    followUp: '这个秘密的揭露会如何改变读者对他的看法？',
    purpose: '设计读者的认知反转'
  }
]

/**
 * 根据分类获取问题
 * @param {string} category - 问题分类
 * @returns {Array} 该分类下的问题列表
 */
export function getQuestionsByCategory(category) {
  return CHARACTER_PSYCHOLOGY_QUESTIONS.filter(q => q.category === category)
}

/**
 * 随机获取指定数量的问题
 * @param {number} [count=5] - 问题数量
 * @param {string} [excludeCategory] - 要排除的分类
 * @returns {Array} 随机问题列表
 */
export function getRandomQuestions(count = 5, excludeCategory) {
  let pool = CHARACTER_PSYCHOLOGY_QUESTIONS
  if (excludeCategory) {
    pool = pool.filter(q => q.category !== excludeCategory)
  }
  // Fisher-Yates 洗牌算法
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

// ============================================================================
// 四、角色关系类型定义
// ============================================================================

/**
 * 角色关系类型
 */
export const CHARACTER_RELATIONSHIP_TYPES = {
  ALLY: {
    id: 'ally',
    label: '盟友',
    description: '与主角站在同一阵营的角色，提供支持和帮助',
    subtypes: ['best_friend', 'companion', 'teammate', 'partner'],
    dynamics: ['mutual_trust', 'shared_goal', 'complementary_skills']
  },
  ENEMY: {
    id: 'enemy',
    label: '敌人',
    description: '与主角对立的角色，制造冲突和障碍',
    subtypes: ['arch_nemesis', 'rival', 'antagonist', 'obstacle'],
    dynamics: ['opposing_goals', 'escalating_tension', 'ideological_clash']
  },
  LOVER: {
    id: 'lover',
    label: '恋人',
    description: '与主角有浪漫关系的角色',
    subtypes: ['first_love', 'soulmate', 'forbidden_love', 'ex_lover'],
    dynamics: ['emotional_intimacy', 'passion', 'vulnerability', 'conflict_of_interest']
  },
  MENTOR: {
    id: 'mentor',
    label: '导师',
    description: '指导主角成长的角色，传授智慧和技能',
    subtypes: ['wise_mentor', 'reluctant_mentor', 'fallen_mentor', 'absent_mentor'],
    dynamics: ['guidance', 'expectation', 'disappointment', 'legacy']
  },
  FAMILY: {
    id: 'family',
    label: '家人',
    description: '与主角有血缘或法律家庭关系的角色',
    subtypes: ['parent', 'sibling', 'child', 'spouse', 'extended_family'],
    dynamics: ['obligation', 'unconditional_love', 'generational_conflict', 'protection']
  },
  RIVAL: {
    id: 'rival',
    label: '竞争者',
    description: '与主角竞争同一目标的角色，不一定敌对',
    subtypes: ['friendly_rival', 'bitter_rival', 'professional_rival', 'love_rival'],
    dynamics: ['competition', 'mutual_respect', 'one_upmanship', 'potential_alliance']
  },
  SUBORDINATE: {
    id: 'subordinate',
    label: '下属',
    description: '在等级关系中处于主角下位的角色',
    subtypes: ['loyal_follower', 'reluctant_subordinate', 'traitor', 'protégé'],
    dynamics: ['loyalty', 'obedience', 'rebellion', 'ambition']
  },
  STRANGER: {
    id: 'stranger',
    label: '陌生人',
    description: '初次相遇的角色，关系有待发展',
    subtypes: ['helpful_stranger', 'mysterious_stranger', 'dangerous_stranger'],
    dynamics: ['first_impression', 'mystery', 'potential_connection']
  },
  MIRROR: {
    id: 'mirror',
    label: '镜像角色',
    description: '与主角相似但做出不同选择的角色，用于对比和反思',
    subtypes: ['dark_mirror', 'light_mirror', 'road_not_taken'],
    dynamics: ['reflection', 'contrast', 'warning', 'inspiration']
  },
  CATALYST: {
    id: 'catalyst',
    label: '催化者',
    description: '推动主角发生变化的角色，自身可能不参与主线',
    subtypes: ['inciting_catalyst', 'transformative_catalyst', 'revelatory_catalyst'],
    dynamics: ['trigger_change', 'challenge_assumptions', 'disrupt_status_quo']
  }
}

/**
 * 角色关系数据结构
 * @typedef {Object} CharacterRelationship
 * @property {string} id - 关系ID
 * @property {string} characterId - 角色A的ID
 * @property {string} targetCharacterId - 角色B的ID
 * @property {string} type - 关系类型（见上方定义）
 * @property {string} subtype - 关系子类型
 * @property {string} description - 关系描述
 * @property {string[]} dynamics - 关系动态标签
 * @property {string} status - 关系状态（forming/stable/deteriorating/broken/evolving）
 * @property {string} startChapterId - 关系开始章节
 * @property {string} [endChapterId] - 关系结束章节
 * @property {string[]} keyEvents - 关键事件列表
 * @property {number} intimacy - 亲密度（0-100）
 * @property {number} trust - 信任度（0-100）
 * @property {number} conflict - 冲突度（0-100）
 * @property {string} fromAtoB - A对B的态度描述
 * @property {string} fromBtoA - B对A的态度描述
 * @property {boolean} asymmetrical - 关系是否不对称
 */

// ============================================================================
// 五、角色弧线类型
// ============================================================================

/**
 * 角色弧线类型
 */
export const CHARACTER_ARC_TYPES = {
  // 正向弧线
  POSITIVE_GROWTH: {
    id: 'positive_growth',
    label: '成长型弧线',
    description: '角色从缺陷或不成熟状态，通过经历磨难，成长为更好的自己',
    stages: ['flawed_state', 'catalyst', 'struggle', 'epiphany', 'transformation'],
    example: '《哈利·波特》中哈利从无助孤儿成长为勇敢的领袖'
  },
  // 负向弧线
  NEGATIVE_FALL: {
    id: 'negative_fall',
    label: '堕落型弧线',
    description: '角色从正面状态，通过一系列选择或遭遇，逐渐走向堕落或毁灭',
    stages: ['virtuous_state', 'temptation', 'compromise', 'descent', 'tragedy'],
    example: '《绝命毒师》中沃尔特·怀特从普通教师变成毒枭'
  },
  // 平坦弧线
  FLAT: {
    id: 'flat',
    label: '平坦型弧线',
    description: '角色本身不发生根本性改变，但通过他/她的坚持影响了周围的世界',
    stages: ['conviction', 'challenge', 'perseverance', 'resolution', 'validation'],
    example: '《印第安纳·琼斯》中琼斯始终是那个冒险家，但改变了周围的世界'
  },
  // 转变型弧线
  TRANSFORMATION: {
    id: 'transformation',
    label: '转变型弧线',
    description: '角色经历彻底的身份转变，成为与之前截然不同的人',
    stages: ['old_identity', 'crisis', 'liminal', 'rebirth', 'new_identity'],
    example: '《冰雪奇缘》中艾莎从隐藏力量到接受自我'
  },
  // 成熟型弧线
  MATURATION: {
    id: 'maturation',
    label: '成熟型弧线',
    description: '角色从天真/无知状态，通过经历获得对世界的真实认知',
    stages: ['innocence', 'experience', 'disillusionment', 'acceptance', 'wisdom'],
    example: '《杀死一只知更鸟》中斯库特从天真儿童理解成人世界的复杂'
  },
  // 救赎型弧线
  REDEMPTION: {
    id: 'redemption',
    label: '救赎型弧线',
    description: '角色从错误或罪恶中寻求救赎和原谅',
    stages: ['sin_state', 'guilt', 'quest', 'sacrifice', 'absolution'],
    example: '《悲惨世界》中冉·阿让从囚犯变成善良的市长'
  },
  // 腐化型弧线
  CORRUPTION: {
    id: 'corruption',
    label: '腐化型弧线',
    description: '角色被权力、欲望或环境逐渐腐蚀',
    stages: ['integrity', 'seduction', 'rationalization', 'corruption', 'fall'],
    example: '《麦克白》中麦克白被野心吞噬'
  },
  // 循环型弧线
  CYCLICAL: {
    id: 'cyclical',
    label: '循环型弧线',
    description: '角色经历一圈后回到起点，但认知已经完全不同',
    stages: ['starting_state', 'journey', 'trials', 'return', 'new_understanding'],
    example: '《绿野仙踪》中多萝西回到家中，但已经成长'
  }
}

// ============================================================================
// 六、故事线模板
// ============================================================================

/**
 * 故事线模板
 * 提供经典的故事结构框架，帮助作者规划叙事
 */
export const STORY_TEMPLATES = {
  // ------------------------------------------------------------------
  // 三幕式结构
  // ------------------------------------------------------------------
  THREE_ACT: {
    id: 'three_act',
    label: '三幕式结构',
    description: '最经典的叙事结构，将故事分为建置、对抗和解决三个部分',
    origin: '亚里士多德《诗学》',
    acts: [
      {
        name: '第一幕：建置',
        percentage: 25,
        description: '介绍主角、世界观和核心冲突',
        beats: [
          { name: '开场画面', description: '展示主角的日常世界', percentage: 0 },
          { name: '触发事件', description: '打破主角日常的事件', percentage: 10 },
          { name: '第一转折点', description: '主角做出选择，进入新世界', percentage: 25 }
        ]
      },
      {
        name: '第二幕：对抗',
        percentage: 50,
        description: '主角面对障碍，经历成长和挑战',
        beats: [
          { name: '上升行动', description: '主角尝试解决问题，遭遇困难', percentage: 30 },
          { name: '中点', description: '重大转折或揭示，赌注升级', percentage: 50 },
          { name: '下降行动', description: '一切似乎失去希望', percentage: 65 },
          { name: '第二转折点', description: '最后的打击，主角跌入谷底', percentage: 75 }
        ]
      },
      {
        name: '第三幕：解决',
        percentage: 25,
        description: '高潮和结局，主角面对最终挑战',
        beats: [
          { name: '高潮', description: '主角运用所学，面对最终挑战', percentage: 85 },
          { name: '结局', description: '新的平衡建立', percentage: 95 },
          { name: '终场画面', description: '与开场画面呼应，展示变化', percentage: 100 }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------
  // 英雄之旅
  // ------------------------------------------------------------------
  HERO_JOURNEY: {
    id: 'hero_journey',
    label: '英雄之旅',
    description: '约瑟夫·坎贝尔提出的经典神话结构，包含12个阶段',
    origin: '约瑟夫·坎贝尔《千面英雄》',
    acts: [
      {
        name: '启程 (Departure)',
        percentage: 25,
        description: '英雄离开日常世界，踏上冒险',
        beats: [
          { name: '日常世界', description: '英雄的平凡生活', percentage: 0 },
          { name: '冒险召唤', description: '收到踏上旅途的邀请', percentage: 5 },
          { name: '拒绝召唤', description: '英雄因恐惧或责任拒绝', percentage: 10 },
          { name: '导师相遇', description: '遇到给予指导的智者', percentage: 15 },
          { name: '跨越第一道门槛', description: '离开日常世界，进入冒险', percentage: 25 }
        ]
      },
      {
        name: '启蒙 (Initiation)',
        percentage: 50,
        description: '英雄在未知世界中面对考验',
        beats: [
          { name: '考验、盟友与敌人', description: '面对挑战，结识伙伴，识别敌人', percentage: 30 },
          { name: '接近深层洞穴', description: '接近最危险的区域', percentage: 40 },
          { name: '严峻考验', description: '面对最大的恐惧或敌人', percentage: 50 },
          { name: '奖赏', description: '获得宝物或知识', percentage: 60 }
        ]
      },
      {
        name: '回归 (Return)',
        percentage: 25,
        description: '英雄带着收获回到日常世界',
        beats: [
          { name: '回归之路', description: '带着奖赏踏上归途', percentage: 70 },
          { name: '复活', description: '最终考验，英雄的终极蜕变', percentage: 85 },
          { name: '携万灵药回归', description: '带着智慧或宝物回到日常世界', percentage: 100 }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------
  // 起承转合
  // ------------------------------------------------------------------
  KISHŌTENKETSU: {
    id: 'kishotenketsu',
    label: '起承转合',
    description: '东亚传统的四段式叙事结构，强调转折而非冲突',
    origin: '中国传统叙事理论 / 日本"起承転結"',
    acts: [
      {
        name: '起 (Introduction)',
        percentage: 25,
        description: '介绍人物、背景和基本情境',
        beats: [
          { name: '世界介绍', description: '建立故事的世界观和氛围', percentage: 5 },
          { name: '人物登场', description: '主要角色出场', percentage: 15 },
          { name: '情境建立', description: '展示初始状态', percentage: 25 }
        ]
      },
      {
        name: '承 (Development)',
        percentage: 25,
        description: '在已建立的基础上深化和发展',
        beats: [
          { name: '深化', description: '深入探索角色和情境', percentage: 35 },
          { name: '铺垫', description: '为转折做铺垫', percentage: 50 }
        ]
      },
      {
        name: '转 (Twist)',
        percentage: 25,
        description: '引入意想不到的转折或新视角',
        beats: [
          { name: '转折', description: '打破读者预期的转折', percentage: 60 },
          { name: '冲击', description: '转折带来的影响', percentage: 75 }
        ]
      },
      {
        name: '合 (Conclusion)',
        percentage: 25,
        description: '将所有元素融合，达到和谐统一',
        beats: [
          { name: '融合', description: '将起承转的元素统一', percentage: 85 },
          { name: '收束', description: '给予读者满足感的结尾', percentage: 100 }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------
  // 非线性叙事
  // ------------------------------------------------------------------
  NONLINEAR: {
    id: 'nonlinear',
    label: '非线性叙事',
    description: '打破时间顺序的叙事结构，通过时间跳跃、多视角等手法讲述故事',
    origin: '现代主义/后现代主义文学',
    acts: [
      {
        name: '碎片化呈现',
        percentage: 100,
        description: '故事片段以非时间顺序呈现，由读者自行拼凑',
        techniques: [
          {
            name: '倒叙',
            description: '从结局或关键事件开始，回溯过去'
          },
          {
            name: '插叙',
            description: '在主线中插入回忆或闪回'
          },
          {
            name: '多时间线',
            description: '同时叙述不同时间段的故事'
          },
          {
            name: '多视角',
            description: '从不同角色的视角叙述同一事件'
          },
          {
            name: '环形结构',
            description: '故事结尾回到开头，形成闭环'
          },
          {
            name: '拼贴式',
            description: '通过日记、信件、新闻等碎片拼凑故事'
          }
        ],
        beats: [
          { name: '钩子', description: '以一个引人入胜的场景或悬念开始', percentage: 0 },
          { name: '碎片展开', description: '逐步揭示故事的不同片段', percentage: 50 },
          { name: '拼图完成', description: '所有碎片拼合，真相大白', percentage: 100 }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------
  // 救赎弧线
  // ------------------------------------------------------------------
  REDEMPTION_ARC: {
    id: 'redemption_arc',
    label: '救赎弧线',
    description: '以角色的道德救赎为核心的故事结构',
    origin: '经典悲剧/宗教叙事',
    acts: [
      {
        name: '堕落',
        percentage: 20,
        description: '展示角色犯错或堕入黑暗的过程',
        beats: [
          { name: '原罪', description: '角色犯下重大错误或罪行', percentage: 5 },
          { name: '后果', description: '错误的后果显现', percentage: 20 }
        ]
      },
      {
        name: '觉醒',
        percentage: 30,
        description: '角色开始意识到自己的错误',
        beats: [
          { name: '良知的呼唤', description: '某个事件触发了角色的反思', percentage: 30 },
          { name: '挣扎', description: '角色在旧我和新我之间挣扎', percentage: 50 }
        ]
      },
      {
        name: '赎罪',
        percentage: 30,
        description: '角色采取行动弥补过错',
        beats: [
          { name: '决定', description: '角色决定改变', percentage: 55 },
          { name: '考验', description: '赎罪之路上的重重障碍', percentage: 70 },
          { name: '牺牲', description: '角色为赎罪做出重大牺牲', percentage: 80 }
        ]
      },
      {
        name: '重生',
        percentage: 20,
        description: '角色获得新生',
        beats: [
          { name: '宽恕', description: '获得他人或自我的宽恕', percentage: 90 },
          { name: '新生活', description: '以新的身份开始新生活', percentage: 100 }
        ]
      }
    ]
  },

  // ------------------------------------------------------------------
  // 悬疑推理结构
  // ------------------------------------------------------------------
  MYSTERY: {
    id: 'mystery',
    label: '悬疑推理结构',
    description: '以谜题和真相揭示为核心的故事结构',
    origin: '推理小说传统',
    acts: [
      {
        name: '谜题建立',
        percentage: 20,
        description: '引入谜题和关键疑问',
        beats: [
          { name: '犯罪/事件', description: '触发事件发生', percentage: 5 },
          { name: '调查开始', description: '主角开始调查', percentage: 15 },
          { name: '初步线索', description: '发现第一批线索', percentage: 20 }
        ]
      },
      {
        name: '调查深入',
        percentage: 40,
        description: '层层深入，迷雾重重',
        beats: [
          { name: '嫌疑人', description: '引入多个嫌疑人', percentage: 25 },
          { name: '红鲱鱼', description: '误导性线索', percentage: 35 },
          { name: '危机', description: '调查者自身陷入危险', percentage: 50 },
          { name: '突破', description: '关键线索浮现', percentage: 60 }
        ]
      },
      {
        name: '真相揭示',
        percentage: 40,
        description: '谜底揭晓，真相大白',
        beats: [
          { name: '推理', description: '主角拼凑出真相', percentage: 70 },
          { name: '对峙', description: '与真凶/幕后黑手对峙', percentage: 85 },
          { name: '解决', description: '事件得到解决', percentage: 100 }
        ]
      }
    ]
  }
}

// ============================================================================
// 七、时间线事件数据结构
// ============================================================================

/**
 * 时间线事件类型
 */
export const TIMELINE_EVENT_TYPES = {
  PLOT: 'plot',               // 情节事件
  CHARACTER: 'character',     // 角色事件
  RELATIONSHIP: 'relationship', // 关系变化事件
  WORLD: 'world',             // 世界观事件
  FLASHBACK: 'flashback',     // 闪回事件
  FORESHADOW: 'foreshadow',   // 伏笔事件
  CLIMAX: 'climax',           // 高潮事件
  TURNING_POINT: 'turning_point' // 转折点事件
}

/**
 * 时间线事件数据结构
 * @typedef {Object} TimelineEvent
 * @property {string} id - 事件唯一标识
 * @property {string} projectId - 项目ID
 * @property {string} type - 事件类型
 * @property {string} title - 事件标题
 * @property {string} description - 事件详细描述
 * @property {string} storyTimestamp - 故事内时间
 * @property {number} chronologicalOrder - 时间顺序编号
 * @property {number|null} narrativeOrder - 叙事顺序编号（null=未在正文中出现）
 * @property {string} chapterId - 关联章节ID
 * @property {string[]} characterIds - 参与角色ID列表
 * @property {string} location - 发生地点
 * @property {string[]} tags - 标签
 * @property {string[]} consequences - 后续影响
 * @property {string} [color] - 显示颜色
 * @property {string} [icon] - 显示图标
 * @property {Object} [metadata] - 扩展元数据
 */

/**
 * 创建时间线事件
 * @param {Object} params - 事件参数
 * @returns {TimelineEvent} 时间线事件对象
 */
export function createTimelineEvent({
  projectId,
  type,
  title,
  description,
  storyTimestamp,
  chronologicalOrder,
  narrativeOrder = null,
  chapterId,
  characterIds = [],
  location = '',
  tags = [],
  consequences = [],
  color = '',
  icon = '',
  metadata = {}
}) {
  return {
    id: 'tle_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9),
    projectId,
    type,
    title,
    description,
    storyTimestamp,
    chronologicalOrder,
    narrativeOrder,
    chapterId,
    characterIds: [...characterIds],
    location,
    tags: [...tags],
    consequences: [...consequences],
    color,
    icon,
    metadata: { ...metadata }
  }
}

/**
 * 时间线事件存储键
 */
const TIMELINE_STORAGE_KEY = 'yunshu_timeline_events'

/**
 * 时间线事件 CRUD 函数
 */
export const timelineEventStore = {
  /** 加载所有时间线事件 */
  load(projectId) {
    try {
      const data = localStorage.getItem(TIMELINE_STORAGE_KEY)
      const all = data ? JSON.parse(data) : []
      return projectId ? all.filter(e => e.projectId === projectId) : all
    } catch (error) {
      console.error('[叙事结构] 加载时间线失败:', error)
      return []
    }
  },

  /** 保存时间线事件 */
  save(events) {
    try {
      localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error('[叙事结构] 保存时间线失败:', error)
    }
  },

  /** 添加事件 */
  add(event) {
    const all = this.load()
    if (!event.id) {
      event.id = 'tle_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9)
    }
    all.push(event)
    this.save(all)
    return event
  },

  /** 更新事件 */
  update(id, updates) {
    const all = this.load()
    const index = all.findIndex(e => e.id === id)
    if (index === -1) return null
    const { id: _id, ...safeUpdates } = updates
    all[index] = { ...all[index], ...safeUpdates }
    this.save(all)
    return all[index]
  },

  /** 删除事件 */
  remove(id) {
    const all = this.load()
    const filtered = all.filter(e => e.id !== id)
    this.save(filtered)
    return filtered.length < all.length
  },

  /** 按时间顺序获取事件 */
  getChronological(projectId) {
    return this.load(projectId).sort((a, b) => a.chronologicalOrder - b.chronologicalOrder)
  },

  /** 按叙事顺序获取事件 */
  getNarrative(projectId) {
    return this.load(projectId)
      .filter(e => e.narrativeOrder !== null)
      .sort((a, b) => a.narrativeOrder - b.narrativeOrder)
  },

  /** 获取指定章节的事件 */
  getByChapter(chapterId) {
    return this.load().filter(e => e.chapterId === chapterId)
  },

  /** 获取指定角色相关的事件 */
  getByCharacter(characterId) {
    return this.load().filter(e => e.characterIds.includes(characterId))
  }
}

// ============================================================================
// 八、叙事结构分析工具函数
// ============================================================================

/**
 * 分析叙事线索的交织程度
 * @param {Array} strands - 叙事线索数组
 * @param {Array} chapters - 章节列表
 * @returns {Object} 交织分析结果
 */
export function analyzeStrandInterweaving(strands, chapters) {
  const chapterStrandMap = new Map()

  // 初始化每章的线索记录
  chapters.forEach(ch => chapterStrandMap.set(ch.id, new Set()))

  // 记录每章涉及哪些线索
  strands.forEach(strand => {
    strand.milestones.forEach(ms => {
      if (chapterStrandMap.has(ms.chapterId)) {
        chapterStrandMap.get(ms.chapterId).add(strand.id)
      }
    })
  })

  // 计算交织指标
  let totalInteractions = 0
  let maxStrandsPerChapter = 0
  const interleavingChapters = []

  chapterStrandMap.forEach((strandIds, chapterId) => {
    const count = strandIds.size
    if (count > 1) {
      totalInteractions += count * (count - 1) / 2 // 组合数
      interleavingChapters.push({ chapterId, strandCount: count, strandIds: [...strandIds] })
    }
    if (count > maxStrandsPerChapter) maxStrandsPerChapter = count
  })

  return {
    totalStrands: strands.length,
    totalInteractions,
    maxStrandsPerChapter,
    interleavingChapters,
    interweavingScore: strands.length > 1
      ? Math.min(100, Math.round((totalInteractions / chapters.length) * 20))
      : 0
  }
}

/**
 * 检测叙事结构中的潜在问题
 * @param {Object} narrativeData - 叙事数据
 * @param {Array} narrativeData.strands - 叙事线索
 * @param {Array} narrativeData.conflicts - 冲突列表
 * @param {Array} narrativeData.foreshadowings - 伏笔列表
 * @param {number} currentChapter - 当前章节序号
 * @returns {Array} 问题列表
 */
export function detectNarrativeIssues(narrativeData, currentChapter) {
  const issues = []
  const { strands = [], conflicts = [], foreshadowings = [] } = narrativeData

  // 检查是否有长期未推进的线索
  strands.forEach(strand => {
    if (strand.status === 'active') {
      const lastMilestone = strand.milestones[strand.milestones.length - 1]
      if (lastMilestone) {
        // 简单判断：如果最后里程碑距离当前超过10章
        const gap = currentChapter - (parseInt(lastMilestone.chapterId) || 0)
        if (gap > 10) {
          issues.push({
            type: 'strand_neglect',
            severity: 'warning',
            message: `线索"${strand.name}"已${gap}章未推进`,
            suggestion: '考虑在近期章节中提及或推进该线索'
          })
        }
      }
    }
  })

  // 检查是否有未解决的冲突
  const unresolvedConflicts = conflicts.filter(c => c.status !== 'resolved' && c.level === 'core')
  if (unresolvedConflicts.length > 3) {
    issues.push({
      type: 'too_many_core_conflicts',
      severity: 'warning',
      message: `当前有${unresolvedConflicts.length}个核心冲突未解决`,
      suggestion: '过多的核心冲突可能导致叙事失焦，考虑合并或分阶段解决'
    })
  }

  // 检查伏笔回收情况
  const unresolvedFs = foreshadowings.filter(f => f.status !== 'resolved')
  if (unresolvedFs.length > 15) {
    issues.push({
      type: 'too_many_foreshadowings',
      severity: 'warning',
      message: `当前有${unresolvedFs.length}个伏笔未回收`,
      suggestion: '考虑在近期章节中回收部分伏笔，避免读者遗忘'
    })
  }

  return issues
}

/**
 * 生成叙事结构概览
 * @param {string} projectId - 项目ID
 * @param {Object} data - 所有叙事数据
 * @returns {Object} 概览数据
 */
export function generateNarrativeOverview(projectId, data) {
  const { premise, themes, conflicts, symbols, strands } = data

  return {
    projectId,
    premise: premise ? premise.statement : '未设定',
    themeCount: themes?.length || 0,
    conflictCount: conflicts?.length || 0,
    symbolCount: symbols?.length || 0,
    strandCount: strands?.length || 0,
    coreConflicts: conflicts?.filter(c => c.level === 'core' && c.status !== 'resolved') || [],
    activeStrands: strands?.filter(s => s.status === 'active') || [],
    centralThemes: themes?.filter(t => t.type === 'central') || []
  }
}

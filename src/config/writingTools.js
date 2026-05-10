/**
 * ============================================================================
 * 云书 - 写作辅助工具集 (Writing Tools)
 * ============================================================================
 * 对标 WriteMonkey / Manuskript / Inkdrop
 *
 * 功能概览：
 * - 渐进式创作方法论（一句话 -> 段落 -> 摘要 -> 大纲 -> 正文）
 * - 写作热身提示（200+ 中文写作提示/灵感种子）
 * - 片段库管理（CRUD + 分类 + 搜索 + 标签）
 * - 想法板数据结构
 * - 命令面板命令定义
 * - 高级搜索语法解析器
 * - 成就系统定义（20+ 成就）
 * - 写作会话追踪
 *
 * 使用方式：
 *   import { CREATION_STAGES, WRITING_PROMPTS, fragmentStore, ... } from '@/config/writingTools'
 * ============================================================================
 */

// ============================================================================
// 一、渐进式创作方法论
// ============================================================================

/**
 * 创作阶段定义
 * 从最简单的一句话逐步扩展为完整正文
 */
export const CREATION_STAGES = {
  ONE_LINER: {
    id: 'one_liner',
    label: '一句话',
    order: 1,
    description: '用一句话概括故事的核心概念',
    aiPrompt: `你是一位创意写作教练。请帮助用户将他们的故事想法提炼为一句话概括。

要求：
1. 一句话不超过30个字
2. 包含主角、核心冲突和赌注
3. 引人入胜，让人想了解更多

用户的想法：{userInput}

请输出一句话概括，并简要说明为什么这样概括。`,
    example: '一个失忆的侦探在追查案件时发现，自己就是最大的嫌疑人。',
    nextStage: 'paragraph'
  },

  PARAGRAPH: {
    id: 'paragraph',
    label: '段落',
    order: 2,
    description: '将一句话扩展为一个段落，包含更多细节',
    aiPrompt: `你是一位创意写作教练。请帮助用户将一句话故事概括扩展为一个段落（100-200字）。

要求：
1. 保留核心概念
2. 增加主角的背景信息
3. 暗示故事的走向
4. 建立故事的基本基调

一句话概括：{userInput}

请输出扩展后的段落。`,
    example: '李明是一名经验丰富的刑警，但在一次执行任务中遭遇车祸，失去了过去五年的记忆。当他回到工作岗位，被分配到一起连环失踪案时，他发现所有线索都指向一个让他感到莫名熟悉的人。随着调查深入，他开始怀疑自己与这起案件有着不可告人的联系——也许，他不是受害者，而是始作俑者。',
    nextStage: 'summary'
  },

  SUMMARY: {
    id: 'summary',
    label: '摘要',
    order: 3,
    description: '将段落扩展为完整的故事摘要，包含起承转合',
    aiPrompt: `你是一位创意写作教练。请帮助用户将故事段落扩展为完整的故事摘要（300-500字）。

要求：
1. 包含故事的开端、发展、高潮和结局
2. 介绍主要角色及其动机
3. 描述核心冲突及其演变
4. 暗示主题和情感基调
5. 保持与原文一致的叙事风格

故事段落：{userInput}

请输出完整的故事摘要。`,
    example: '（完整的故事摘要示例，包含开端、发展、高潮、结局四个部分...）',
    nextStage: 'outline'
  },

  OUTLINE: {
    id: 'outline',
    label: '大纲',
    order: 4,
    description: '将摘要细化为章节大纲，规划故事结构',
    aiPrompt: `你是一位创意写作教练。请帮助用户将故事摘要细化为章节大纲。

要求：
1. 将故事分为合理的章节（建议10-30章）
2. 每章包含：章节标题、主要事件、角色发展、伏笔/回收
3. 标注关键转折点和高潮
4. 确保节奏合理，张弛有度
5. 标注副线的发展

故事摘要：{userInput}

请输出详细的章节大纲，使用JSON格式：
{
  "title": "小说标题",
  "volumes": [
    {
      "name": "卷名",
      "chapters": [
        {
          "number": 1,
          "title": "章节标题",
          "summary": "本章摘要",
          "events": ["事件1", "事件2"],
          "characterDevelopment": "角色发展",
          "foreshadowing": "伏笔/回收",
          "notes": "备注"
        }
      ]
    }
  ]
}`,
    nextStage: 'fulltext'
  },

  FULLTEXT: {
    id: 'fulltext',
    label: '正文',
    order: 5,
    description: '根据大纲逐章撰写完整正文',
    aiPrompt: `你是一位创意写作助手。请根据以下章节大纲帮助用户撰写正文。

要求：
1. 严格遵循大纲中的情节要点
2. 保持与前文的一致性
3. 注意场景描写、对话和内心独白的平衡
4. 每章字数建议3000-5000字
5. 在章节结尾设置适当的悬念或钩子

章节大纲：
{userInput}

前文摘要：
{previousContent}

请输出该章节的完整正文。`,
    nextStage: null
  }
}

/**
 * 获取创作阶段的有序列表
 * @returns {Array} 按顺序排列的创作阶段
 */
export function getCreationStages() {
  return Object.values(CREATION_STAGES).sort((a, b) => a.order - b.order)
}

/**
 * 获取指定阶段的AI提示词
 * @param {string} stageId - 阶段ID
 * @param {string} userInput - 用户输入
 * @param {string} [previousContent] - 前文内容（正文阶段需要）
 * @returns {string} 完整的AI提示词
 */
export function getStagePrompt(stageId, userInput, previousContent = '') {
  const stage = CREATION_STAGES[stageId]
  if (!stage) return ''

  let prompt = stage.aiPrompt.replace('{userInput}', userInput)
  if (previousContent) {
    prompt = prompt.replace('{previousContent}', previousContent)
  }
  return prompt
}

// ============================================================================
// 二、写作热身提示（200+ 中文写作提示/灵感种子）
// ============================================================================

/**
 * 写作提示分类
 */
export const PROMPT_CATEGORIES = {
  SCENE: 'scene',           // 场景描写
  CHARACTER: 'character',   // 角色塑造
  DIALOGUE: 'dialogue',     // 对话练习
  PLOT: 'plot',             // 情节构思
  EMOTION: 'emotion',       // 情感表达
  WORLD: 'world',           // 世界观设定
  SENSORY: 'sensory',       // 感官描写
  CONFLICT: 'conflict',     // 冲突设计
  BEGINNING: 'beginning',   // 开头练习
  ENDING: 'ending',         // 结尾练习
  METAPHOR: 'metaphor',     // 比喻/意象
  PERSPECTIVE: 'perspective' // 视角练习
}

/**
 * 写作热身提示列表（200+）
 * 每个提示包含：id、分类、提示内容、难度、预计用时
 */
export const WRITING_PROMPTS = [
  // ==================== 场景描写 (20个) ====================
  { id: 'wp_001', category: PROMPT_CATEGORIES.SCENE, content: '描写一个雨夜的城市街道，重点表现孤独感', difficulty: 'easy', time: 15 },
  { id: 'wp_002', category: PROMPT_CATEGORIES.SCENE, content: '描写一个热闹的菜市场，用感官细节让读者仿佛身临其境', difficulty: 'easy', time: 15 },
  { id: 'wp_003', category: PROMPT_CATEGORIES.SCENE, content: '描写一间被遗弃多年的老屋，暗示它曾经的主人是谁', difficulty: 'medium', time: 20 },
  { id: 'wp_004', category: PROMPT_CATEGORIES.SCENE, content: '描写日出时分的海边，但主角此刻心情沉重', difficulty: 'medium', time: 15 },
  { id: 'wp_005', category: PROMPT_CATEGORIES.SCENE, content: '描写一个科幻城市的天际线，展示未来科技与日常生活的融合', difficulty: 'medium', time: 20 },
  { id: 'wp_006', category: PROMPT_CATEGORIES.SCENE, content: '描写一场暴风雪中的火车站，有人在等待一个不会来的人', difficulty: 'medium', time: 20 },
  { id: 'wp_007', category: PROMPT_CATEGORIES.SCENE, content: '描写深夜的医院走廊，不出现"安静"这个词却让读者感受到寂静', difficulty: 'hard', time: 25 },
  { id: 'wp_008', category: PROMPT_CATEGORIES.SCENE, content: '描写一个孩子眼中的游乐园，与成人视角形成对比', difficulty: 'medium', time: 20 },
  { id: 'wp_009', category: PROMPT_CATEGORIES.SCENE, content: '描写一座即将被拆除的旧工厂，工人们最后的告别', difficulty: 'medium', time: 20 },
  { id: 'wp_010', category: PROMPT_CATEGORIES.SCENE, content: '描写一个古代的战场，战斗结束后的清晨', difficulty: 'hard', time: 25 },
  { id: 'wp_011', category: PROMPT_CATEGORIES.SCENE, content: '描写一间书店的内部，每个角落都有一个故事', difficulty: 'easy', time: 15 },
  { id: 'wp_012', category: PROMPT_CATEGORIES.SCENE, content: '描写秋天的校园，通过落叶和光线的变化暗示时间的流逝', difficulty: 'medium', time: 15 },
  { id: 'wp_013', category: PROMPT_CATEGORIES.SCENE, content: '描写一个地下酒吧，充满神秘和危险的氛围', difficulty: 'medium', time: 20 },
  { id: 'wp_014', category: PROMPT_CATEGORIES.SCENE, content: '描写一场婚礼，但新郎/新娘心中有不可告人的秘密', difficulty: 'hard', time: 25 },
  { id: 'wp_015', category: PROMPT_CATEGORIES.SCENE, content: '描写太空站上的一个普通清晨，展现太空生活的日常', difficulty: 'medium', time: 20 },
  { id: 'wp_016', category: PROMPT_CATEGORIES.SCENE, content: '描写一个雨后的花园，用细节表现"重生"的主题', difficulty: 'easy', time: 15 },
  { id: 'wp_017', category: PROMPT_CATEGORIES.SCENE, content: '描写深夜的便利店，来来往往的顾客各有故事', difficulty: 'medium', time: 20 },
  { id: 'wp_018', category: PROMPT_CATEGORIES.SCENE, content: '描写一座古寺的黄昏，通过声音和光影营造禅意', difficulty: 'hard', time: 25 },
  { id: 'wp_019', category: PROMPT_CATEGORIES.SCENE, content: '描写一个废弃的游乐场，月光下的旋转木马', difficulty: 'medium', time: 20 },
  { id: 'wp_020', category: PROMPT_CATEGORIES.SCENE, content: '描写一条老巷子，通过建筑和声音展现几十年的变迁', difficulty: 'medium', time: 20 },

  // ==================== 角色塑造 (20个) ====================
  { id: 'wp_021', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色的自述，他/她正在向陌生人解释自己的职业', difficulty: 'easy', time: 15 },
  { id: 'wp_022', category: PROMPT_CATEGORIES.CHARACTER, content: '通过一个角色的房间布置来揭示他/她的性格和秘密', difficulty: 'medium', time: 20 },
  { id: 'wp_023', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色在做他/她最擅长的事情时的状态', difficulty: 'easy', time: 15 },
  { id: 'wp_024', category: PROMPT_CATEGORIES.CHARACTER, content: '描写一个角色说谎时的微表情和肢体语言', difficulty: 'medium', time: 15 },
  { id: 'wp_025', category: PROMPT_CATEGORIES.CHARACTER, content: '通过一个角色的手机通话记录来构建他/她的人物画像', difficulty: 'medium', time: 20 },
  { id: 'wp_026', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个反派角色的童年回忆，让读者对他/她产生同情', difficulty: 'hard', time: 25 },
  { id: 'wp_027', category: PROMPT_CATEGORIES.CHARACTER, content: '描写一个角色面对恐惧时的反应，不直接说出恐惧是什么', difficulty: 'medium', time: 20 },
  { id: 'wp_028', category: PROMPT_CATEGORIES.CHARACTER, content: '通过三个不同人对同一个角色的评价来立体地展现这个角色', difficulty: 'hard', time: 25 },
  { id: 'wp_029', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色在独处时完全不同的另一面', difficulty: 'medium', time: 20 },
  { id: 'wp_030', category: PROMPT_CATEGORIES.CHARACTER, content: '描写一个角色的招牌动作/习惯，让读者仅凭这个动作就能认出他/她', difficulty: 'easy', time: 15 },
  { id: 'wp_031', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色收到改变命运的消息时的一分钟内心独白', difficulty: 'medium', time: 15 },
  { id: 'wp_032', category: PROMPT_CATEGORIES.CHARACTER, content: '通过一个角色的穿衣风格变化来暗示他/她的心理转变', difficulty: 'medium', time: 20 },
  { id: 'wp_033', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色与宠物之间的互动，展现他/她柔软的一面', difficulty: 'easy', time: 15 },
  { id: 'wp_034', category: PROMPT_CATEGORIES.CHARACTER, content: '描写一个角色在镜前审视自己，通过内心独白揭示自我认知与他人印象的差异', difficulty: 'hard', time: 25 },
  { id: 'wp_035', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色在醉酒后吐露真言的场景', difficulty: 'medium', time: 20 },
  { id: 'wp_036', category: PROMPT_CATEGORIES.CHARACTER, content: '通过一个角色的日记/书信来展现他/她不为人知的一面', difficulty: 'medium', time: 20 },
  { id: 'wp_037', category: PROMPT_CATEGORIES.CHARACTER, content: '描写两个性格截然不同的角色被迫合作时的摩擦', difficulty: 'medium', time: 20 },
  { id: 'wp_038', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色面对诱惑时的内心挣扎', difficulty: 'hard', time: 25 },
  { id: 'wp_039', category: PROMPT_CATEGORIES.CHARACTER, content: '通过一个角色的烹饪过程来展现他/她的性格和心境', difficulty: 'easy', time: 15 },
  { id: 'wp_040', category: PROMPT_CATEGORIES.CHARACTER, content: '写一个角色向另一个人道歉的场景，道歉比冒犯更难说出口', difficulty: 'hard', time: 25 },

  // ==================== 对话练习 (20个) ====================
  { id: 'wp_041', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个人在电梯里被困30分钟的对话，从陌生到熟悉', difficulty: 'medium', time: 20 },
  { id: 'wp_042', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段对话，两个人在说同一件事，但各自的理解完全不同', difficulty: 'hard', time: 20 },
  { id: 'wp_043', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段分手对话，两人都不想先说出"分手"这个词', difficulty: 'hard', time: 25 },
  { id: 'wp_044', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段师徒之间的对话，用隐喻的方式传授人生道理', difficulty: 'medium', time: 20 },
  { id: 'wp_045', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段审讯对话，审讯者用语言技巧让嫌疑人露出破绽', difficulty: 'hard', time: 25 },
  { id: 'wp_046', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个老友重逢的对话，表面寒暄下暗藏多年的心结', difficulty: 'hard', time: 25 },
  { id: 'wp_047', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段孩子问父母敏感问题的对话，父母的回答充满智慧', difficulty: 'medium', time: 20 },
  { id: 'wp_048', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段谈判对话，双方在试探中逐渐暴露底线', difficulty: 'hard', time: 25 },
  { id: 'wp_049', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段电话对话，只能听到一方的声音，通过回答暗示另一方说了什么', difficulty: 'medium', time: 20 },
  { id: 'wp_050', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个人用暗语交流的对话，表面谈论天气实际传递情报', difficulty: 'hard', time: 25 },
  { id: 'wp_051', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段临终前的对话，不出现"死"字却让读者感受到生命的流逝', difficulty: 'hard', time: 25 },
  { id: 'wp_052', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个AI之间的对话，讨论人类情感', difficulty: 'medium', time: 20 },
  { id: 'wp_053', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段饭桌上的对话，通过点菜和吃饭展现人物关系', difficulty: 'medium', time: 20 },
  { id: 'wp_054', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个人在争吵中突然意识到对方说得有道理的对话', difficulty: 'medium', time: 20 },
  { id: 'wp_055', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段祖孙对话，通过讲述过去的故事传递家族秘密', difficulty: 'medium', time: 20 },
  { id: 'wp_056', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段面试对话，面试官的问题越来越离谱', difficulty: 'easy', time: 15 },
  { id: 'wp_057', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个陌生人在公交车站的简短对话，暗示他们有共同的过去', difficulty: 'hard', time: 20 },
  { id: 'wp_058', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段情人间用文字消息的对话，标点符号和回复速度暗示情绪', difficulty: 'medium', time: 20 },
  { id: 'wp_059', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段医生向家属告知坏消息的对话，语言克制但情感饱满', difficulty: 'hard', time: 25 },
  { id: 'wp_060', category: PROMPT_CATEGORIES.DIALOGUE, content: '写一段两个死对头不得不合作时的对话，充满讽刺和暗箭', difficulty: 'medium', time: 20 },

  // ==================== 情节构思 (20个) ====================
  { id: 'wp_061', category: PROMPT_CATEGORIES.PLOT, content: '一个普通的上班族发现自己的影子在独立行动，写一个开头', difficulty: 'easy', time: 15 },
  { id: 'wp_062', category: PROMPT_CATEGORIES.PLOT, content: '主角收到一封来自未来的信，信中只有一个日期和一个地址', difficulty: 'medium', time: 20 },
  { id: 'wp_063', category: PROMPT_CATEGORIES.PLOT, content: '一个小镇上所有人同时做了同一个梦，第二天有人开始按照梦中的场景行动', difficulty: 'medium', time: 20 },
  { id: 'wp_064', category: PROMPT_CATEGORIES.PLOT, content: '主角在旧货市场买到一本日记，日记中记录的事情正在现实中发生', difficulty: 'medium', time: 20 },
  { id: 'wp_065', category: PROMPT_CATEGORIES.PLOT, content: '一个能听到别人心声的人，有一天突然听到一个已经"死亡"的人的心声', difficulty: 'medium', time: 20 },
  { id: 'wp_066', category: PROMPT_CATEGORIES.PLOT, content: '世界上的颜色正在逐一消失，主角是最后一个能看到颜色的人', difficulty: 'medium', time: 20 },
  { id: 'wp_067', category: PROMPT_CATEGORIES.PLOT, content: '主角每次入睡都会进入另一个人的梦境，直到有一天进入了自己的梦', difficulty: 'hard', time: 25 },
  { id: 'wp_068', category: PROMPT_CATEGORIES.PLOT, content: '一个时间循环故事，但每次循环主角都会失去一段不同的记忆', difficulty: 'hard', time: 25 },
  { id: 'wp_069', category: PROMPT_CATEGORIES.PLOT, content: '主角发现自己的记忆是被植入的，真正的自己是谁？', difficulty: 'hard', time: 25 },
  { id: 'wp_070', category: PROMPT_CATEGORIES.PLOT, content: '一座城市中所有人被告知必须在24小时内离开，但主角选择留下', difficulty: 'medium', time: 20 },
  { id: 'wp_071', category: PROMPT_CATEGORIES.PLOT, content: '主角在整理已故祖父的遗物时发现了一张通往另一个世界的地图', difficulty: 'easy', time: 15 },
  { id: 'wp_072', category: PROMPT_CATEGORIES.PLOT, content: '一个天气预报员发现自己能真正控制天气，但每次使用都有代价', difficulty: 'medium', time: 20 },
  { id: 'wp_073', category: PROMPT_CATEGORIES.PLOT, content: '主角在社交媒体上收到一条来自自己账号的消息，但不是自己发的', difficulty: 'medium', time: 20 },
  { id: 'wp_074', category: PROMPT_CATEGORIES.PLOT, content: '一个能看见别人"寿命倒计时"的人，发现朋友的倒计时突然加速', difficulty: 'medium', time: 20 },
  { id: 'wp_075', category: PROMPT_CATEGORIES.PLOT, content: '主角在平行世界中遇到了另一个版本的自己，那个版本做出了完全不同的选择', difficulty: 'hard', time: 25 },
  { id: 'wp_076', category: PROMPT_CATEGORIES.PLOT, content: '一个画家发现自己的画作会变成现实，但只能画已经发生的事', difficulty: 'medium', time: 20 },
  { id: 'wp_077', category: PROMPT_CATEGORIES.PLOT, content: '主角每次说谎，身边就会发生一件小事来揭穿这个谎言', difficulty: 'easy', time: 15 },
  { id: 'wp_078', category: PROMPT_CATEGORIES.PLOT, content: '一座图书馆里的书会在每晚重新排列，主角发现它们在讲述一个故事', difficulty: 'medium', time: 20 },
  { id: 'wp_079', category: PROMPT_CATEGORIES.PLOT, content: '主角发现可以通过镜子进入反射世界，但每次交换都会留下痕迹', difficulty: 'hard', time: 25 },
  { id: 'wp_080', category: PROMPT_CATEGORIES.PLOT, content: '一个失忆者每天醒来都会忘记前一天的事，但有人每天给他留一张纸条', difficulty: 'medium', time: 20 },

  // ==================== 情感表达 (20个) ====================
  { id: 'wp_081', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人得知好消息后试图掩饰激动的场景', difficulty: 'medium', time: 15 },
  { id: 'wp_082', category: PROMPT_CATEGORIES.EMOTION, content: '用环境描写来表现"绝望"的情绪，不直接使用任何情绪词', difficulty: 'hard', time: 25 },
  { id: 'wp_083', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人在公共场合强忍泪水的全过程', difficulty: 'medium', time: 20 },
  { id: 'wp_084', category: PROMPT_CATEGORIES.EMOTION, content: '写一个人愤怒到极致反而变得异常平静的场景', difficulty: 'hard', time: 20 },
  { id: 'wp_085', category: PROMPT_CATEGORIES.EMOTION, content: '描写久别重逢时的复杂情感——喜悦、陌生、愧疚交织', difficulty: 'hard', time: 25 },
  { id: 'wp_086', category: PROMPT_CATEGORIES.EMOTION, content: '写一个人独自庆祝的场景，表面开心内心孤独', difficulty: 'medium', time: 20 },
  { id: 'wp_087', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人面对背叛时从震惊到接受的心理过程', difficulty: 'hard', time: 25 },
  { id: 'wp_088', category: PROMPT_CATEGORIES.EMOTION, content: '用一段文字表现"希望"这种情感，让读者感受到力量', difficulty: 'medium', time: 20 },
  { id: 'wp_089', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人在做出艰难决定后如释重负的瞬间', difficulty: 'medium', time: 15 },
  { id: 'wp_090', category: PROMPT_CATEGORIES.EMOTION, content: '写一个人看着旧照片时涌上来的复杂情感', difficulty: 'medium', time: 20 },
  { id: 'wp_091', category: PROMPT_CATEGORIES.EMOTION, content: '描写嫉妒这种情绪，不使用"嫉妒"这个词', difficulty: 'hard', time: 20 },
  { id: 'wp_092', category: PROMPT_CATEGORIES.EMOTION, content: '写一个人在黑暗中等待时的恐惧逐渐加深', difficulty: 'medium', time: 20 },
  { id: 'wp_093', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人第一次成功时的狂喜，以及随之而来的空虚', difficulty: 'hard', time: 25 },
  { id: 'wp_094', category: PROMPT_CATEGORIES.EMOTION, content: '用食物和味觉来表现"思乡"的情感', difficulty: 'medium', time: 20 },
  { id: 'wp_095', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人在葬礼上没有哭泣，但某个细节让他/她彻底崩溃', difficulty: 'hard', time: 25 },
  { id: 'wp_096', category: PROMPT_CATEGORIES.EMOTION, content: '写一个人从恐惧到勇气的转变过程', difficulty: 'medium', time: 20 },
  { id: 'wp_097', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人意识到自己爱上对方的那一刻', difficulty: 'medium', time: 20 },
  { id: 'wp_098', category: PROMPT_CATEGORIES.EMOTION, content: '用天气变化来映射两个人关系从好到坏的过程', difficulty: 'hard', time: 25 },
  { id: 'wp_099', category: PROMPT_CATEGORIES.EMOTION, content: '描写一个人原谅伤害过自己的人时内心的挣扎', difficulty: 'hard', time: 25 },
  { id: 'wp_100', category: PROMPT_CATEGORIES.EMOTION, content: '写一个人在黎明时分感到的平静和新生感', difficulty: 'easy', time: 15 },

  // ==================== 世界观设定 (15个) ====================
  { id: 'wp_101', category: PROMPT_CATEGORIES.WORLD, content: '设计一个以"记忆"为货币的社会，描述它的经济体系', difficulty: 'hard', time: 30 },
  { id: 'wp_102', category: PROMPT_CATEGORIES.WORLD, content: '创造一个重力会随机变化的城市，描述居民的日常生活', difficulty: 'medium', time: 25 },
  { id: 'wp_103', category: PROMPT_CATEGORIES.WORLD, content: '设计一个所有人都能看到彼此"情绪颜色"的世界', difficulty: 'medium', time: 25 },
  { id: 'wp_104', category: PROMPT_CATEGORIES.WORLD, content: '描述一个建立在巨兽背上的文明的社会结构', difficulty: 'hard', time: 30 },
  { id: 'wp_105', category: PROMPT_CATEGORIES.WORLD, content: '创造一个时间流速不同的多层世界', difficulty: 'hard', time: 30 },
  { id: 'wp_106', category: PROMPT_CATEGORIES.WORLD, content: '设计一个以音乐为武力的修仙世界', difficulty: 'medium', time: 25 },
  { id: 'wp_107', category: PROMPT_CATEGORIES.WORLD, content: '描述一个所有人都知道自己死亡日期的社会', difficulty: 'medium', time: 25 },
  { id: 'wp_108', category: PROMPT_CATEGORIES.WORLD, content: '创造一个梦境与现实可以互换的世界', difficulty: 'hard', time: 30 },
  { id: 'wp_109', category: PROMPT_CATEGORIES.WORLD, content: '设计一个建立在云端的天空城市，描述它的生态系统', difficulty: 'medium', time: 25 },
  { id: 'wp_110', category: PROMPT_CATEGORIES.WORLD, content: '描述一个语言可以直接改变现实的世界', difficulty: 'hard', time: 30 },
  { id: 'wp_111', category: PROMPT_CATEGORIES.WORLD, content: '创造一个季节由人类情感决定的世界', difficulty: 'medium', time: 25 },
  { id: 'wp_112', category: PROMPT_CATEGORIES.WORLD, content: '设计一个科技高度发达但禁止记录历史的社会', difficulty: 'hard', time: 30 },
  { id: 'wp_113', category: PROMPT_CATEGORIES.WORLD, content: '描述一个海洋覆盖整个星球的世界，人类生活在漂浮城市中', difficulty: 'medium', time: 25 },
  { id: 'wp_114', category: PROMPT_CATEGORIES.WORLD, content: '创造一个每个人出生时就会被分配一个"命运编号"的世界', difficulty: 'medium', time: 25 },
  { id: 'wp_115', category: PROMPT_CATEGORIES.WORLD, content: '设计一个建立在废弃空间站上的末世社区', difficulty: 'medium', time: 25 },

  // ==================== 感官描写 (15个) ====================
  { id: 'wp_116', category: PROMPT_CATEGORIES.SENSORY, content: '仅用声音来描写一个场景，不使用任何视觉描写', difficulty: 'hard', time: 20 },
  { id: 'wp_117', category: PROMPT_CATEGORIES.SENSORY, content: '描写一道菜的味道，让读者流口水', difficulty: 'medium', time: 15 },
  { id: 'wp_118', category: PROMPT_CATEGORIES.SENSORY, content: '用触觉来描写一个人初次握手的印象', difficulty: 'medium', time: 15 },
  { id: 'wp_119', category: PROMPT_CATEGORIES.SENSORY, content: '描写雨后泥土的气息，唤起读者的童年记忆', difficulty: 'medium', time: 15 },
  { id: 'wp_120', category: PROMPT_CATEGORIES.SENSORY, content: '综合运用五种感官描写一个清晨', difficulty: 'medium', time: 20 },
  { id: 'wp_121', category: PROMPT_CATEGORIES.SENSORY, content: '描写一个人失去视觉后其他感官的增强', difficulty: 'hard', time: 25 },
  { id: 'wp_122', category: PROMPT_CATEGORIES.SENSORY, content: '用温度变化来描写一段关系的冷热', difficulty: 'hard', time: 20 },
  { id: 'wp_123', category: PROMPT_CATEGORIES.SENSORY, content: '描写一个人第一次闻到大海味道时的反应', difficulty: 'easy', time: 15 },
  { id: 'wp_124', category: PROMPT_CATEGORIES.SENSORY, content: '用声音描写一个"安静到令人不安"的场景', difficulty: 'hard', time: 20 },
  { id: 'wp_125', category: PROMPT_CATEGORIES.SENSORY, content: '描写一种不存在的颜色，让读者能够"想象"出它', difficulty: 'hard', time: 25 },
  { id: 'wp_126', category: PROMPT_CATEGORIES.SENSORY, content: '描写一个人在黑暗中仅凭触觉辨认物体的过程', difficulty: 'medium', time: 20 },
  { id: 'wp_127', category: PROMPT_CATEGORIES.SENSORY, content: '用味觉记忆来串联一个人的不同人生阶段', difficulty: 'hard', time: 25 },
  { id: 'wp_128', category: PROMPT_CATEGORIES.SENSORY, content: '描写疼痛，让读者感同身受', difficulty: 'medium', time: 20 },
  { id: 'wp_129', category: PROMPT_CATEGORIES.SENSORY, content: '描写一个人在极度疲惫时的感官体验', difficulty: 'medium', time: 15 },
  { id: 'wp_130', category: PROMPT_CATEGORIES.SENSORY, content: '用气味来描写一个陌生人的气质', difficulty: 'hard', time: 20 },

  // ==================== 冲突设计 (15个) ====================
  { id: 'wp_131', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个两难选择：拯救陌生人还是保护家人', difficulty: 'medium', time: 20 },
  { id: 'wp_132', category: PROMPT_CATEGORIES.CONFLICT, content: '写一个场景：两个好人因为立场不同而对立', difficulty: 'hard', time: 25 },
  { id: 'wp_133', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个道德困境：为了多数人的利益牺牲少数人是否正确？', difficulty: 'hard', time: 25 },
  { id: 'wp_134', category: PROMPT_CATEGORIES.CONFLICT, content: '写一个角色在忠诚和正义之间的内心挣扎', difficulty: 'hard', time: 25 },
  { id: 'wp_135', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个误会引发冲突的场景，误会的根源是两个人都有的善意', difficulty: 'medium', time: 20 },
  { id: 'wp_136', category: PROMPT_CATEGORIES.CONFLICT, content: '写一个人发现自己一直以来的信仰是错误的', difficulty: 'hard', time: 25 },
  { id: 'wp_137', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个资源匮乏环境下的生存冲突', difficulty: 'medium', time: 20 },
  { id: 'wp_138', category: PROMPT_CATEGORIES.CONFLICT, content: '写两个人争夺同一个东西，但他们想要的其实是不同的', difficulty: 'medium', time: 20 },
  { id: 'wp_139', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个"没有正确答案"的困境场景', difficulty: 'hard', time: 25 },
  { id: 'wp_140', category: PROMPT_CATEGORIES.CONFLICT, content: '写一个人在爱情和事业之间的艰难抉择', difficulty: 'medium', time: 20 },
  { id: 'wp_141', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个信息不对称导致的冲突场景', difficulty: 'medium', time: 20 },
  { id: 'wp_142', category: PROMPT_CATEGORIES.CONFLICT, content: '写一个人面对权威时的反抗和妥协', difficulty: 'medium', time: 20 },
  { id: 'wp_143', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个"囚徒困境"式的人际冲突', difficulty: 'hard', time: 25 },
  { id: 'wp_144', category: PROMPT_CATEGORIES.CONFLICT, content: '写一个人发现自己的成功是建立在别人的牺牲之上的', difficulty: 'hard', time: 25 },
  { id: 'wp_145', category: PROMPT_CATEGORIES.CONFLICT, content: '设计一个代际冲突场景，双方都有合理的立场', difficulty: 'medium', time: 20 },

  // ==================== 开头练习 (15个) ====================
  { id: 'wp_146', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个悬念开头：主角醒来发现世界上的所有人都消失了', difficulty: 'easy', time: 15 },
  { id: 'wp_147', category: PROMPT_CATEGORIES.BEGINNING, content: '用一段对话开头，直接将读者拉入冲突之中', difficulty: 'medium', time: 15 },
  { id: 'wp_148', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个出人意料的陈述开头', difficulty: 'medium', time: 15 },
  { id: 'wp_149', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个引人入胜的场景描写开头，暗示即将发生的事', difficulty: 'medium', time: 15 },
  { id: 'wp_150', category: PROMPT_CATEGORIES.BEGINNING, content: '用一封遗书/信件开头', difficulty: 'easy', time: 15 },
  { id: 'wp_151', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个倒叙开头：先展示结局，再回到开始', difficulty: 'medium', time: 20 },
  { id: 'wp_152', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个看似无关的细节开头，后来发现它至关重要', difficulty: 'hard', time: 20 },
  { id: 'wp_153', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个反常的现象开头，引发读者的好奇心', difficulty: 'easy', time: 15 },
  { id: 'wp_154', category: PROMPT_CATEGORIES.BEGINNING, content: '用主角的内心独白开头，展现他/她独特的声音', difficulty: 'medium', time: 15 },
  { id: 'wp_155', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个动作场景开头，在紧张中介绍主角', difficulty: 'medium', time: 20 },
  { id: 'wp_156', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个世界观的设定说明开头，但融入叙事中', difficulty: 'hard', time: 20 },
  { id: 'wp_157', category: PROMPT_CATEGORIES.BEGINNING, content: '用一段富有诗意的描写开头，奠定故事基调', difficulty: 'medium', time: 15 },
  { id: 'wp_158', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个警告开头："如果你正在读这个故事，说明已经太晚了"', difficulty: 'easy', time: 15 },
  { id: 'wp_159', category: PROMPT_CATEGORIES.BEGINNING, content: '用两个矛盾的事实开头，制造认知冲突', difficulty: 'hard', time: 20 },
  { id: 'wp_160', category: PROMPT_CATEGORIES.BEGINNING, content: '用一个数字开头："这是他第三次死亡。"', difficulty: 'easy', time: 15 },

  // ==================== 结尾练习 (15个) ====================
  { id: 'wp_161', category: PROMPT_CATEGORIES.ENDING, content: '写一个开放性结尾，给读者留下想象空间', difficulty: 'medium', time: 20 },
  { id: 'wp_162', category: PROMPT_CATEGORIES.ENDING, content: '写一个反转结尾，改变读者对整个故事的理解', difficulty: 'hard', time: 25 },
  { id: 'wp_163', category: PROMPT_CATEGORIES.ENDING, content: '写一个首尾呼应的结尾，与开头形成对照', difficulty: 'medium', time: 20 },
  { id: 'wp_164', category: PROMPT_CATEGORIES.ENDING, content: '写一个意味深长的最后一句话', difficulty: 'hard', time: 15 },
  { id: 'wp_165', category: PROMPT_CATEGORIES.ENDING, content: '写一个看似圆满但暗含隐忧的结尾', difficulty: 'hard', time: 25 },
  { id: 'wp_166', category: PROMPT_CATEGORIES.ENDING, content: '写一个以意象结束的结尾，用一个画面代替总结', difficulty: 'medium', time: 20 },
  { id: 'wp_167', category: PROMPT_CATEGORIES.ENDING, content: '写一个主角获得成长但付出代价的结尾', difficulty: 'medium', time: 20 },
  { id: 'wp_168', category: PROMPT_CATEGORIES.ENDING, content: '写一个读者意料之外但情理之中的结尾', difficulty: 'hard', time: 25 },
  { id: 'wp_169', category: PROMPT_CATEGORIES.ENDING, content: '写一个以对话结束的结尾，最后一句话意味深长', difficulty: 'medium', time: 20 },
  { id: 'wp_170', category: PROMPT_CATEGORIES.ENDING, content: '写一个循环式结尾，暗示故事将再次开始', difficulty: 'hard', time: 25 },
  { id: 'wp_171', category: PROMPT_CATEGORIES.ENDING, content: '写一个视角转换的结尾，从另一个角色的角度看同一件事', difficulty: 'hard', time: 25 },
  { id: 'wp_172', category: PROMPT_CATEGORIES.ENDING, content: '写一个留白的结尾，最关键的信息不直接说出', difficulty: 'medium', time: 20 },
  { id: 'wp_173', category: PROMPT_CATEGORIES.ENDING, content: '写一个时间跳跃的结尾，展示多年后的结果', difficulty: 'medium', time: 20 },
  { id: 'wp_174', category: PROMPT_CATEGORIES.ENDING, content: '写一个以信件/日记形式结尾的收束', difficulty: 'medium', time: 20 },
  { id: 'wp_175', category: PROMPT_CATEGORIES.ENDING, content: '写一个悲壮的结尾，主角的牺牲换来了希望', difficulty: 'hard', time: 25 },

  // ==================== 比喻/意象 (15个) ====================
  { id: 'wp_176', category: PROMPT_CATEGORIES.METAPHOR, content: '用"棋局"来比喻两个人之间的权力关系', difficulty: 'medium', time: 20 },
  { id: 'wp_177', category: PROMPT_CATEGORIES.METAPHOR, content: '用"季节"来比喻一个人的一生', difficulty: 'medium', time: 20 },
  { id: 'wp_178', category: PROMPT_CATEGORIES.METAPHOR, content: '创造一个全新的比喻来形容"思念"的感觉', difficulty: 'hard', time: 20 },
  { id: 'wp_179', category: PROMPT_CATEGORIES.METAPHOR, content: '用"建筑"来比喻一个人的心理结构', difficulty: 'hard', time: 25 },
  { id: 'wp_180', category: PROMPT_CATEGORIES.METAPHOR, content: '用"河流"来比喻时间的流逝，赋予它情感', difficulty: 'medium', time: 20 },
  { id: 'wp_181', category: PROMPT_CATEGORIES.METAPHOR, content: '用"镜子"来比喻自我认知的主题', difficulty: 'medium', time: 20 },
  { id: 'wp_182', category: PROMPT_CATEGORIES.METAPHOR, content: '创造一个比喻来形容"秘密"在人际关系中的重量', difficulty: 'hard', time: 20 },
  { id: 'wp_183', category: PROMPT_CATEGORIES.METAPHOR, content: '用"植物"来比喻一段感情的成长过程', difficulty: 'medium', time: 20 },
  { id: 'wp_184', category: PROMPT_CATEGORIES.METAPHOR, content: '用"天气"来比喻一个人的情绪变化', difficulty: 'easy', time: 15 },
  { id: 'wp_185', category: PROMPT_CATEGORIES.METAPHOR, content: '创造一个比喻来形容"选择"带来的连锁反应', difficulty: 'hard', time: 20 },
  { id: 'wp_186', category: PROMPT_CATEGORIES.METAPHOR, content: '用"舞台/戏剧"来比喻人生的荒诞', difficulty: 'medium', time: 20 },
  { id: 'wp_187', category: PROMPT_CATEGORIES.METAPHOR, content: '用"迷宫"来比喻主角的心理困境', difficulty: 'medium', time: 20 },
  { id: 'wp_188', category: PROMPT_CATEGORIES.METAPHOR, content: '创造一个比喻来形容"记忆"的不可靠性', difficulty: 'hard', time: 25 },
  { id: 'wp_189', category: PROMPT_CATEGORIES.METAPHOR, content: '用"编织"来比喻多个叙事线索的交织', difficulty: 'medium', time: 20 },
  { id: 'wp_190', category: PROMPT_CATEGORIES.METAPHOR, content: '创造一个独特的比喻来形容"孤独"的质感', difficulty: 'hard', time: 20 },

  // ==================== 视角练习 (15个) ====================
  { id: 'wp_191', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从一只猫的视角描写主人的日常生活', difficulty: 'easy', time: 20 },
  { id: 'wp_192', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从一栋老建筑的视角描写它见证的历史', difficulty: 'medium', time: 25 },
  { id: 'wp_193', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从反派的视角重写一个经典童话故事', difficulty: 'medium', time: 25 },
  { id: 'wp_194', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从一个物品（如一枚戒指）的视角讲述它经历的故事', difficulty: 'medium', time: 25 },
  { id: 'wp_195', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从孩子的视角描写成人世界的荒谬', difficulty: 'medium', time: 20 },
  { id: 'wp_196', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从未被选中的配角的视角描写一场冒险', difficulty: 'medium', time: 25 },
  { id: 'wp_197', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从未来考古学家的视角描写我们现在的日常生活', difficulty: 'hard', time: 25 },
  { id: 'wp_198', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从死神/时间使者的视角描写一个人的一生', difficulty: 'hard', time: 25 },
  { id: 'wp_199', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '用第二人称"你"来写一个悬疑故事的开头', difficulty: 'hard', time: 20 },
  { id: 'wp_200', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从多个旁观者的视角描写同一个事件，每个版本都不同', difficulty: 'hard', time: 30 },
  { id: 'wp_201', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从一个刚出生的婴儿的视角感受世界', difficulty: 'hard', time: 20 },
  { id: 'wp_202', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从一棵树的视角描写百年间周围的变化', difficulty: 'medium', time: 25 },
  { id: 'wp_203', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从一封信的视角讲述它从写到被读到之间的旅程', difficulty: 'medium', time: 20 },
  { id: 'wp_204', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '用不可靠叙述者的视角写一个故事，让读者逐渐发现叙述者在说谎', difficulty: 'hard', time: 30 },
  { id: 'wp_205', category: PROMPT_CATEGORIES.PERSPECTIVE, content: '从AI的视角描写它对人类情感的理解过程', difficulty: 'hard', time: 25 }
]

/**
 * 根据分类获取写作提示
 * @param {string} category - 提示分类
 * @param {number} [count] - 返回数量
 * @returns {Array} 提示列表
 */
export function getPromptsByCategory(category, count) {
  let prompts = WRITING_PROMPTS.filter(p => p.category === category)
  if (count) prompts = prompts.slice(0, count)
  return prompts
}

/**
 * 随机获取写作提示
 * @param {number} [count=1] - 返回数量
 * @param {string} [category] - 指定分类
 * @param {string} [difficulty] - 指定难度
 * @returns {Array} 随机提示列表
 */
export function getRandomPrompts(count = 1, category, difficulty) {
  let pool = WRITING_PROMPTS
  if (category) pool = pool.filter(p => p.category === category)
  if (difficulty) pool = pool.filter(p => p.difficulty === difficulty)

  // Fisher-Yates 洗牌
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

// ============================================================================
// 三、片段库管理
// ============================================================================

const FRAGMENT_STORAGE_KEY = 'yunshu_fragments'

/**
 * 片段数据结构
 * @typedef {Object} Fragment
 * @property {string} id - 唯一标识
 * @property {string} projectId - 项目ID
 * @property {string} title - 片段标题
 * @property {string} content - 片段内容
 * @property {string} category - 分类
 * @property {string[]} tags - 标签
 * @property {string} type - 类型（scene/character/dialogue/description/idea/other）
 * @property {string} status - 状态（draft/final/archived）
 * @property {number} wordCount - 字数
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 * @property {string} [sourceChapterId] - 来源章节ID
 * @property {string} [notes] - 备注
 */

/**
 * 片段库管理器
 */
export const fragmentStore = {
  /** 加载所有片段 */
  load(projectId) {
    try {
      const data = localStorage.getItem(FRAGMENT_STORAGE_KEY)
      const all = data ? JSON.parse(data) : []
      return projectId ? all.filter(f => f.projectId === projectId) : all
    } catch (error) {
      console.error('[写作工具] 加载片段失败:', error)
      return []
    }
  },

  /** 保存所有片段 */
  save(fragments) {
    try {
      localStorage.setItem(FRAGMENT_STORAGE_KEY, JSON.stringify(fragments))
    } catch (error) {
      console.error('[写作工具] 保存片段失败:', error)
    }
  },

  /** 添加片段 */
  add(fragment) {
    const all = this.load()
    const newFragment = {
      ...fragment,
      id: 'frag_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: (fragment.content || '').replace(/\s/g, '').length
    }
    all.push(newFragment)
    this.save(all)
    return newFragment
  },

  /** 更新片段 */
  update(id, updates) {
    const all = this.load()
    const index = all.findIndex(f => f.id === id)
    if (index === -1) return null
    const { id: _id, createdAt: _ct, ...safeUpdates } = updates
    all[index] = {
      ...all[index],
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
      wordCount: (safeUpdates.content || all[index].content || '').replace(/\s/g, '').length
    }
    this.save(all)
    return all[index]
  },

  /** 删除片段 */
  remove(id) {
    const all = this.load()
    const filtered = all.filter(f => f.id !== id)
    this.save(filtered)
    return filtered.length < all.length
  },

  /** 搜索片段 */
  search(projectId, { keyword, category, tags, type, status } = {}) {
    let results = this.load(projectId)

    if (keyword) {
      const kw = keyword.toLowerCase()
      results = results.filter(f =>
        f.title.toLowerCase().includes(kw) ||
        f.content.toLowerCase().includes(kw) ||
        (f.notes && f.notes.toLowerCase().includes(kw))
      )
    }
    if (category) results = results.filter(f => f.category === category)
    if (type) results = results.filter(f => f.type === type)
    if (status) results = results.filter(f => f.status === status)
    if (tags && tags.length > 0) {
      results = results.filter(f =>
        tags.some(t => f.tags && f.tags.includes(t))
      )
    }

    return results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  },

  /** 获取所有标签 */
  getAllTags(projectId) {
    const fragments = this.load(projectId)
    const tagSet = new Set()
    fragments.forEach(f => {
      if (f.tags) f.tags.forEach(t => tagSet.add(t))
    })
    return [...tagSet]
  },

  /** 获取所有分类 */
  getAllCategories(projectId) {
    const fragments = this.load(projectId)
    const categorySet = new Set()
    fragments.forEach(f => {
      if (f.category) categorySet.add(f.category)
    })
    return [...categorySet]
  },

  /** 获取片段统计 */
  getStats(projectId) {
    const fragments = this.load(projectId)
    return {
      total: fragments.length,
      byType: countBy(fragments, 'type'),
      byStatus: countBy(fragments, 'status'),
      byCategory: countBy(fragments, 'category'),
      totalWords: fragments.reduce((sum, f) => sum + (f.wordCount || 0), 0)
    }
  }
}

/** 按字段计数的辅助函数 */
function countBy(arr, field) {
  const result = {}
  arr.forEach(item => {
    const key = item[field] || 'unknown'
    result[key] = (result[key] || 0) + 1
  })
  return result
}

// ============================================================================
// 四、想法板数据结构
// ============================================================================

const IDEA_BOARD_STORAGE_KEY = 'yunshu_idea_board'

/**
 * 想法数据结构
 * @typedef {Object} Idea
 * @property {string} id - 唯一标识
 * @property {string} title - 想法标题
 * @property {string} description - 想法描述
 * @property {string} category - 分类（plot/character/worldbuilding/theme/dialogue/scene/other）
 * @property {string} priority - 优先级（critical/high/medium/low）
 * @property {number} score - 评分（1-10）
 * @property {string} status - 状态（new/developing/implemented/abandoned）
 * @property {string} projectId - 项目ID
 * @property {string[]} relatedIds - 关联想法ID列表
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 * @property {string[]} tags - 标签
 * @property {string} [source] - 来源（灵感来源）
 * @property {string} [notes] - 备注
 */

/**
 * 想法板管理器
 */
export const ideaBoardStore = {
  /** 加载所有想法 */
  load(projectId) {
    try {
      const data = localStorage.getItem(IDEA_BOARD_STORAGE_KEY)
      const all = data ? JSON.parse(data) : []
      return projectId ? all.filter(i => i.projectId === projectId) : all
    } catch (error) {
      console.error('[写作工具] 加载想法板失败:', error)
      return []
    }
  },

  /** 保存所有想法 */
  save(ideas) {
    try {
      localStorage.setItem(IDEA_BOARD_STORAGE_KEY, JSON.stringify(ideas))
    } catch (error) {
      console.error('[写作工具] 保存想法板失败:', error)
    }
  },

  /** 添加想法 */
  add(idea) {
    const all = this.load()
    const newIdea = {
      ...idea,
      id: 'idea_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedIds: idea.relatedIds || [],
      tags: idea.tags || []
    }
    all.push(newIdea)
    this.save(all)
    return newIdea
  },

  /** 更新想法 */
  update(id, updates) {
    const all = this.load()
    const index = all.findIndex(i => i.id === id)
    if (index === -1) return null
    const { id: _id, createdAt: _ct, ...safeUpdates } = updates
    all[index] = { ...all[index], ...safeUpdates, updatedAt: new Date().toISOString() }
    this.save(all)
    return all[index]
  },

  /** 删除想法 */
  remove(id) {
    const all = this.load()
    const filtered = all.filter(i => i.id !== id)
    // 同时清理其他想法中的关联引用
    filtered.forEach(i => {
      i.relatedIds = (i.relatedIds || []).filter(rid => rid !== id)
    })
    this.save(filtered)
    return filtered.length < all.length
  },

  /** 获取高优先级想法 */
  getHighPriority(projectId) {
    return this.load(projectId)
      .filter(i => i.priority === 'critical' || i.priority === 'high')
      .sort((a, b) => b.score - a.score)
  },

  /** 获取关联想法 */
  getRelated(ideaId) {
    const idea = this.load().find(i => i.id === ideaId)
    if (!idea || !idea.relatedIds) return []
    return idea.relatedIds.map(rid => this.load().find(i => i.id === rid)).filter(Boolean)
  },

  /** 按分类统计 */
  getStats(projectId) {
    const ideas = this.load(projectId)
    return {
      total: ideas.length,
      byStatus: countBy(ideas, 'status'),
      byCategory: countBy(ideas, 'category'),
      byPriority: countBy(ideas, 'priority'),
      avgScore: ideas.length > 0
        ? Math.round(ideas.reduce((sum, i) => sum + (i.score || 0), 0) / ideas.length * 10) / 10
        : 0
    }
  }
}

// ============================================================================
// 五、命令面板命令定义
// ============================================================================

/**
 * 命令面板命令定义
 * 用于快速操作和导航
 */
export const COMMAND_PALETTE_COMMANDS = [
  // 文件操作
  { id: 'cmd_new_project', label: '新建项目', category: 'file', shortcut: 'Ctrl+N', icon: 'Plus', action: 'newProject' },
  { id: 'cmd_open_project', label: '打开项目', category: 'file', shortcut: 'Ctrl+O', icon: 'FolderOpen', action: 'openProject' },
  { id: 'cmd_save', label: '保存', category: 'file', shortcut: 'Ctrl+S', icon: 'Save', action: 'save' },
  { id: 'cmd_export', label: '导出', category: 'file', shortcut: 'Ctrl+E', icon: 'Download', action: 'export' },
  { id: 'cmd_import', label: '导入', category: 'file', icon: 'Upload', action: 'import' },

  // 编辑操作
  { id: 'cmd_undo', label: '撤销', category: 'edit', shortcut: 'Ctrl+Z', icon: 'Undo', action: 'undo' },
  { id: 'cmd_redo', label: '重做', category: 'edit', shortcut: 'Ctrl+Shift+Z', icon: 'Redo', action: 'redo' },
  { id: 'cmd_find', label: '查找替换', category: 'edit', shortcut: 'Ctrl+H', icon: 'Search', action: 'findReplace' },
  { id: 'cmd_copy', label: '复制', category: 'edit', shortcut: 'Ctrl+C', icon: 'Copy', action: 'copy' },
  { id: 'cmd_cut', label: '剪切', category: 'edit', shortcut: 'Ctrl+X', icon: 'Scissors', action: 'cut' },
  { id: 'cmd_paste', label: '粘贴', category: 'edit', shortcut: 'Ctrl+V', icon: 'Clipboard', action: 'paste' },
  { id: 'cmd_select_all', label: '全选', category: 'edit', shortcut: 'Ctrl+A', icon: 'SelectAll', action: 'selectAll' },

  // 导航
  { id: 'cmd_goto_chapter', label: '跳转到章节', category: 'navigation', shortcut: 'Ctrl+G', icon: 'MapPin', action: 'gotoChapter' },
  { id: 'cmd_goto_character', label: '跳转到角色', category: 'navigation', icon: 'User', action: 'gotoCharacter' },
  { id: 'cmd_goto_outline', label: '跳转到大纲', category: 'navigation', icon: 'List', action: 'gotoOutline' },
  { id: 'cmd_goto_timeline', label: '跳转到时间线', category: 'navigation', icon: 'Clock', action: 'gotoTimeline' },
  { id: 'cmd_back', label: '返回上一位置', category: 'navigation', shortcut: 'Alt+Left', icon: 'ArrowLeft', action: 'goBack' },
  { id: 'cmd_forward', label: '前进到下一位置', category: 'navigation', shortcut: 'Alt+Right', icon: 'ArrowRight', action: 'goForward' },

  // 写作工具
  { id: 'cmd_ai_assist', label: 'AI 写作助手', category: 'tools', shortcut: 'Ctrl+J', icon: 'MagicStick', action: 'aiAssist' },
  { id: 'cmd_text_analysis', label: '文本分析', category: 'tools', shortcut: 'Ctrl+Shift+A', icon: 'DataAnalysis', action: 'textAnalysis' },
  { id: 'cmd_writing_prompt', label: '随机写作提示', category: 'tools', shortcut: 'Ctrl+Shift+P', icon: 'Lightbulb', action: 'randomPrompt' },
  { id: 'cmd_foreshadowing', label: '伏笔管理', category: 'tools', icon: 'Eye', action: 'foreshadowing' },
  { id: 'cmd_narrative_structure', label: '叙事结构', category: 'tools', icon: 'Connection', action: 'narrativeStructure' },
  { id: 'cmd_fragment_library', label: '片段库', category: 'tools', icon: 'Collection', action: 'fragmentLibrary' },
  { id: 'cmd_idea_board', label: '想法板', category: 'tools', icon: 'Idea', action: 'ideaBoard' },

  // 视图
  { id: 'cmd_toggle_sidebar', label: '切换侧边栏', category: 'view', shortcut: 'Ctrl+B', icon: 'Menu', action: 'toggleSidebar' },
  { id: 'cmd_toggle_fullscreen', label: '切换全屏', category: 'view', shortcut: 'F11', icon: 'FullScreen', action: 'toggleFullscreen' },
  { id: 'cmd_toggle_focus_mode', label: '专注模式', category: 'view', shortcut: 'Ctrl+Shift+F', icon: 'View', action: 'toggleFocusMode' },
  { id: 'cmd_toggle_dark_mode', label: '切换深色模式', category: 'view', shortcut: 'Ctrl+D', icon: 'Moon', action: 'toggleDarkMode' },
  { id: 'cmd_zoom_in', label: '放大', category: 'view', shortcut: 'Ctrl++', icon: 'ZoomIn', action: 'zoomIn' },
  { id: 'cmd_zoom_out', label: '缩小', category: 'view', shortcut: 'Ctrl+-', icon: 'ZoomOut', action: 'zoomOut' },

  // 章节操作
  { id: 'cmd_new_chapter', label: '新建章节', category: 'chapter', icon: 'DocumentAdd', action: 'newChapter' },
  { id: 'cmd_split_chapter', label: '拆分章节', category: 'chapter', icon: 'Scissors', action: 'splitChapter' },
  { id: 'cmd_merge_chapter', label: '合并章节', category: 'chapter', icon: 'Merge', action: 'mergeChapter' },
  { id: 'cmd_reorder_chapters', label: '重排章节', category: 'chapter', icon: 'Sort', action: 'reorderChapters' },

  // 统计
  { id: 'cmd_word_count', label: '字数统计', category: 'stats', shortcut: 'Ctrl+Shift+W', icon: 'Document', action: 'wordCount' },
  { id: 'cmd_session_stats', label: '本次写作统计', category: 'stats', icon: 'Timer', action: 'sessionStats' },
  { id: 'cmd_achievements', label: '成就系统', category: 'stats', icon: 'Trophy', action: 'achievements' }
]

/**
 * 根据分类获取命令
 * @param {string} category - 命令分类
 * @returns {Array} 命令列表
 */
export function getCommandsByCategory(category) {
  return COMMAND_PALETTE_COMMANDS.filter(cmd => cmd.category === category)
}

/**
 * 搜索命令
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 匹配的命令列表
 */
export function searchCommands(keyword) {
  if (!keyword) return COMMAND_PALETTE_COMMANDS
  const kw = keyword.toLowerCase()
  return COMMAND_PALETTE_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(kw) ||
    cmd.category.toLowerCase().includes(kw)
  )
}

// ============================================================================
// 六、高级搜索语法解析器
// ============================================================================

/**
 * 搜索限定符定义
 */
export const SEARCH_QUALIFIERS = {
  TYPE: 'type',         // 按类型搜索（type:chapter, type:character 等）
  STATUS: 'status',     // 按状态搜索（status:draft, status:published 等）
  TAG: 'tag',           // 按标签搜索（tag:重要, tag:待修改 等）
  PROJECT: 'project',   // 按项目搜索（project:xxx）
  DATE: 'date',         // 按日期搜索（date:2024-01-01, date:>2024-01-01 等）
  WORDS: 'words',       // 按字数搜索（words:>1000, words:<500 等）
  RATING: 'rating',     // 按评分搜索（rating:>4, rating:5）
  CHARACTER: 'char',    // 按角色搜索（char:张三）
  CHAPTER: 'chapter'    // 按章节搜索（chapter:第3章）
}

/**
 * 解析高级搜索语法
 * 支持的语法：
 *   type:chapter status:draft "精确短语" 关键词
 *   tag:重要 words:>1000 date:>2024-01-01
 *   project:我的小说 char:张三
 *
 * @param {string} query - 搜索查询字符串
 * @returns {Object} 解析结果 { keywords: [], qualifiers: {}, exactPhrases: [] }
 */
export function parseSearchQuery(query) {
  const result = {
    keywords: [],
    qualifiers: {},
    exactPhrases: []
  }

  if (!query || !query.trim()) return result

  // 提取精确短语（用引号包裹的内容）
  const phraseRegex = /"([^"]+)"/g
  let match
  while ((match = phraseRegex.exec(query)) !== null) {
    result.exactPhrases.push(match[1])
  }
  // 移除精确短语
  const cleanedQuery = query.replace(/"[^"]+"/g, '').trim()

  // 提取限定符（key:value 格式）
  const qualifierRegex = /(\w+):(\S+)/g
  while ((match = qualifierRegex.exec(cleanedQuery)) !== null) {
    const key = match[1].toLowerCase()
    const value = match[2]
    if (Object.values(SEARCH_QUALIFIERS).includes(key)) {
      result.qualifiers[key] = value
    } else {
      // 未识别的限定符当作关键词
      result.keywords.push(match[0])
    }
  }

  // 提取剩余的关键词
  const remainingQuery = cleanedQuery.replace(/\w+:\S+/g, '').trim()
  if (remainingQuery) {
    result.keywords.push(...remainingQuery.split(/\s+/).filter(k => k.length > 0))
  }

  return result
}

/**
 * 将搜索语法转换为可读的描述
 * @param {string} query - 搜索查询字符串
 * @returns {string} 可读描述
 */
export function describeSearchQuery(query) {
  const parsed = parseSearchQuery(query)
  const parts = []

  if (parsed.exactPhrases.length > 0) {
    parts.push(`精确匹配: "${parsed.exactPhrases.join('", "')}"`)
  }

  const qualifierLabels = {
    type: '类型', status: '状态', tag: '标签', project: '项目',
    date: '日期', words: '字数', rating: '评分', char: '角色', chapter: '章节'
  }

  Object.entries(parsed.qualifiers).forEach(([key, value]) => {
    const label = qualifierLabels[key] || key
    parts.push(`${label}: ${value}`)
  })

  if (parsed.keywords.length > 0) {
    parts.push(`关键词: ${parsed.keywords.join(', ')}`)
  }

  return parts.join(' | ') || '空搜索'
}

// ============================================================================
// 七、成就系统定义（20+ 成就）
// ============================================================================

/**
 * 成就分类
 */
export const ACHIEVEMENT_CATEGORIES = {
  STREAK: 'streak',           // 连续写作
  MILESTONE: 'milestone',     // 字数里程碑
  CHAPTER: 'chapter',         // 章节完成
  VOLUME: 'volume',           // 卷完成
  FEATURE: 'feature',         // 功能使用
  SOCIAL: 'social',           // 社交/分享
  SPECIAL: 'special'          // 特殊成就
}

/**
 * 成就定义列表
 */
export const ACHIEVEMENTS = [
  // 连续写作
  { id: 'ach_001', name: '初出茅庐', description: '第一次开始写作', category: ACHIEVEMENT_CATEGORIES.STREAK, icon: 'Edit', condition: { type: 'first_session' }, points: 10 },
  { id: 'ach_002', name: '三日成习', description: '连续写作3天', category: ACHIEVEMENT_CATEGORIES.STREAK, icon: 'Calendar', condition: { type: 'streak_days', value: 3 }, points: 20 },
  { id: 'ach_003', name: '七日之约', description: '连续写作7天', category: ACHIEVEMENT_CATEGORIES.STREAK, icon: 'Calendar', condition: { type: 'streak_days', value: 7 }, points: 50 },
  { id: 'ach_004', name: '半月坚持', description: '连续写作15天', category: ACHIEVEMENT_CATEGORIES.STREAK, icon: 'Calendar', condition: { type: 'streak_days', value: 15 }, points: 100 },
  { id: 'ach_005', name: '月度达人', description: '连续写作30天', category: ACHIEVEMENT_CATEGORIES.STREAK, icon: 'Trophy', condition: { type: 'streak_days', value: 30 }, points: 200 },
  { id: 'ach_006', name: '百日长征', description: '连续写作100天', category: ACHIEVEMENT_CATEGORIES.STREAK, icon: 'Medal', condition: { type: 'streak_days', value: 100 }, points: 500 },

  // 字数里程碑
  { id: 'ach_007', name: '千字起步', description: '累计写作达到1,000字', category: ACHIEVEMENT_CATEGORIES.MILESTONE, icon: 'Document', condition: { type: 'total_words', value: 1000 }, points: 10 },
  { id: 'ach_008', name: '万字长篇', description: '累计写作达到10,000字', category: ACHIEVEMENT_CATEGORIES.MILESTONE, icon: 'Document', condition: { type: 'total_words', value: 10000 }, points: 30 },
  { id: 'ach_009', name: '五万里程碑', description: '累计写作达到50,000字', category: ACHIEVEMENT_CATEGORIES.MILESTONE, icon: 'Document', condition: { type: 'total_words', value: 50000 }, points: 80 },
  { id: 'ach_010', name: '十万巨著', description: '累计写作达到100,000字', category: ACHIEVEMENT_CATEGORIES.MILESTONE, icon: 'Trophy', condition: { type: 'total_words', value: 100000 }, points: 150 },
  { id: 'ach_011', name: '三十万字', description: '累计写作达到300,000字', category: ACHIEVEMENT_CATEGORIES.MILESTONE, icon: 'Trophy', condition: { type: 'total_words', value: 300000 }, points: 300 },
  { id: 'ach_012', name: '百万字大师', description: '累计写作达到1,000,000字', category: ACHIEVEMENT_CATEGORIES.MILESTONE, icon: 'Crown', condition: { type: 'total_words', value: 1000000 }, points: 1000 },

  // 章节完成
  { id: 'ach_013', name: '开篇之作', description: '完成第一章', category: ACHIEVEMENT_CATEGORIES.CHAPTER, icon: 'Flag', condition: { type: 'chapters_completed', value: 1 }, points: 20 },
  { id: 'ach_014', name: '十章之师', description: '完成10章', category: ACHIEVEMENT_CATEGORIES.CHAPTER, icon: 'Flag', condition: { type: 'chapters_completed', value: 10 }, points: 60 },
  { id: 'ach_015', name: '百章传说', description: '完成100章', category: ACHIEVEMENT_CATEGORIES.CHAPTER, icon: 'Flag', condition: { type: 'chapters_completed', value: 100 }, points: 300 },

  // 卷完成
  { id: 'ach_016', name: '首卷完结', description: '完成第一卷', category: ACHIEVEMENT_CATEGORIES.VOLUME, icon: 'Notebook', condition: { type: 'volumes_completed', value: 1 }, points: 50 },
  { id: 'ach_017', name: '三卷成书', description: '完成3卷', category: ACHIEVEMENT_CATEGORIES.VOLUME, icon: 'Notebook', condition: { type: 'volumes_completed', value: 3 }, points: 150 },

  // 功能使用
  { id: 'ach_018', name: '伏笔大师', description: '埋设10个伏笔回收了8个以上', category: ACHIEVEMENT_CATEGORIES.FEATURE, icon: 'Eye', condition: { type: 'foreshadowing_master', planted: 10, resolved: 8 }, points: 80 },
  { id: 'ach_019', name: '角色创造者', description: '创建20个角色', category: ACHIEVEMENT_CATEGORIES.FEATURE, icon: 'User', condition: { type: 'characters_created', value: 20 }, points: 50 },
  { id: 'ach_020', name: '文本医生', description: '使用文本分析功能50次', category: ACHIEVEMENT_CATEGORIES.FEATURE, icon: 'Stethoscope', condition: { type: 'analysis_count', value: 50 }, points: 40 },
  { id: 'ach_021', name: '灵感收集者', description: '在想法板中收集100个想法', category: ACHIEVEMENT_CATEGORIES.FEATURE, icon: 'Lightbulb', condition: { type: 'ideas_count', value: 100 }, points: 60 },
  { id: 'ach_022', name: '片段收藏家', description: '在片段库中保存50个片段', category: ACHIEVEMENT_CATEGORIES.FEATURE, icon: 'Collection', condition: { type: 'fragments_count', value: 50 }, points: 40 },

  // 特殊成就
  { id: 'ach_023', name: '夜猫子', description: '在凌晨0点-5点之间写作超过1小时', category: ACHIEVEMENT_CATEGORIES.SPECIAL, icon: 'Moon', condition: { type: 'night_owl', hours: 1 }, points: 30 },
  { id: 'ach_024', name: '一日千字', description: '单日写作超过1,000字', category: ACHIEVEMENT_CATEGORIES.SPECIAL, icon: 'Lightning', condition: { type: 'daily_words', value: 1000 }, points: 20 },
  { id: 'ach_025', name: '一日万字', description: '单日写作超过10,000字', category: ACHIEVEMENT_CATEGORIES.SPECIAL, icon: 'Lightning', condition: { type: 'daily_words', value: 10000 }, points: 100 },
  { id: 'ach_026', name: '全勤作者', description: '单次写作会话超过2小时', category: ACHIEVEMENT_CATEGORIES.SPECIAL, icon: 'Timer', condition: { type: 'session_duration', value: 120 }, points: 30 },
  { id: 'ach_027', name: '完美主义者', description: '使用文本分析后修改了所有标记的问题', category: ACHIEVEMENT_CATEGORIES.SPECIAL, icon: 'Star', condition: { type: 'perfectionist' }, points: 50 },
  { id: 'ach_028', name: '多面手', description: '尝试使用所有写作工具功能', category: ACHIEVEMENT_CATEGORIES.SPECIAL, icon: 'Grid', condition: { type: 'use_all_tools' }, points: 100 }
]

/**
 * 成就存储管理
 */
const ACHIEVEMENT_STORAGE_KEY = 'yunshu_achievements'

export const achievementStore = {
  /** 加载已解锁的成就 */
  load() {
    try {
      const data = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY)
      return data ? JSON.parse(data) : { unlocked: [], progress: {}, totalPoints: 0 }
    } catch (error) {
      console.error('[写作工具] 加载成就失败:', error)
      return { unlocked: [], progress: {}, totalPoints: 0 }
    }
  },

  /** 保存成就数据 */
  save(data) {
    try {
      localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('[写作工具] 保存成就失败:', error)
    }
  },

  /** 检查并解锁成就 */
  checkAchievement(achievementId, stats) {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) return null

    const data = this.load()
    if (data.unlocked.includes(achievementId)) return null // 已解锁

    const condition = achievement.condition
    let unlocked = false

    switch (condition.type) {
      case 'first_session':
        unlocked = true
        break
      case 'streak_days':
        unlocked = (stats.streakDays || 0) >= condition.value
        break
      case 'total_words':
        unlocked = (stats.totalWords || 0) >= condition.value
        break
      case 'chapters_completed':
        unlocked = (stats.chaptersCompleted || 0) >= condition.value
        break
      case 'volumes_completed':
        unlocked = (stats.volumesCompleted || 0) >= condition.value
        break
      case 'daily_words':
        unlocked = (stats.dailyWords || 0) >= condition.value
        break
      case 'session_duration':
        unlocked = (stats.sessionMinutes || 0) >= condition.value
        break
      case 'night_owl':
        unlocked = stats.isNightSession && (stats.sessionMinutes || 0) >= condition.hours * 60
        break
      case 'characters_created':
        unlocked = (stats.charactersCreated || 0) >= condition.value
        break
      case 'analysis_count':
        unlocked = (stats.analysisCount || 0) >= condition.value
        break
      case 'ideas_count':
        unlocked = (stats.ideasCount || 0) >= condition.value
        break
      case 'fragments_count':
        unlocked = (stats.fragmentsCount || 0) >= condition.value
        break
      case 'foreshadowing_master':
        unlocked = (stats.foreshadowingPlanted || 0) >= condition.planted &&
                   (stats.foreshadowingResolved || 0) >= condition.resolved
        break
      case 'perfectionist':
        unlocked = stats.allIssuesFixed === true
        break
      case 'use_all_tools':
        unlocked = stats.allToolsUsed === true
        break
    }

    if (unlocked) {
      data.unlocked.push(achievementId)
      data.totalPoints += achievement.points
      data.unlockedAt = data.unlockedAt || {}
      data.unlockedAt[achievementId] = new Date().toISOString()
      this.save(data)
      return achievement
    }

    return null
  },

  /** 获取所有成就及其解锁状态 */
  getAll() {
    const data = this.load()
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: data.unlocked.includes(a.id),
      unlockedAt: data.unlockedAt?.[a.id] || null
    }))
  },

  /** 获取成就进度 */
  getProgress() {
    const data = this.load()
    return {
      unlocked: data.unlocked.length,
      total: ACHIEVEMENTS.length,
      percentage: Math.round((data.unlocked.length / ACHIEVEMENTS.length) * 100),
      totalPoints: data.totalPoints,
      maxPoints: ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0)
    }
  }
}

// ============================================================================
// 八、写作会话追踪
// ============================================================================

const SESSION_STORAGE_KEY = 'yunshu_writing_sessions'

/**
 * 写作会话数据结构
 * @typedef {Object} WritingSession
 * @property {string} id - 会话ID
 * @property {string} projectId - 项目ID
 * @property {string} chapterId - 章节ID
 * @property {string} startTime - 开始时间（ISO 8601）
 * @property {string} endTime - 结束时间（ISO 8601）
 * @property {number} startWordCount - 开始时的字数
 * @property {number} endWordCount - 结束时的字数
 * @property {number} wordsWritten - 本次写作字数
 * @property {number} wordsDeleted - 本次删除字数
 * @property {number} interruptionCount - 打断次数
 * @property {number} durationMinutes - 持续时间（分钟）
 * @property {number} wordsPerMinute - 每分钟写作速度
 * @property {string[]} milestones - 里程碑事件（如达到某个字数）
 * @property {string} [notes] - 会话备注
 */

/**
 * 写作会话管理器
 */
export const writingSessionTracker = {
  _currentSession: null,

  /** 开始新的写作会话 */
  start(projectId, chapterId, currentWordCount) {
    this._currentSession = {
      id: 'sess_' + Date.now().toString(36),
      projectId,
      chapterId,
      startTime: new Date().toISOString(),
      endTime: null,
      startWordCount: currentWordCount || 0,
      endWordCount: currentWordCount || 0,
      wordsWritten: 0,
      wordsDeleted: 0,
      interruptionCount: 0,
      durationMinutes: 0,
      wordsPerMinute: 0,
      milestones: [],
      notes: ''
    }
    return this._currentSession
  },

  /** 更新当前字数 */
  updateWordCount(currentWordCount) {
    if (!this._currentSession) return
    const diff = currentWordCount - this._currentSession.endWordCount
    if (diff > 0) {
      this._currentSession.wordsWritten += diff
    } else if (diff < 0) {
      this._currentSession.wordsDeleted += Math.abs(diff)
    }
    this._currentSession.endWordCount = currentWordCount

    // 检查里程碑
    this._checkMilestones()
  },

  /** 记录打断 */
  recordInterruption() {
    if (!this._currentSession) return
    this._currentSession.interruptionCount++
  },

  /** 添加备注 */
  addNote(note) {
    if (!this._currentSession) return
    this._currentSession.notes = note
  },

  /** 结束写作会话 */
  end() {
    if (!this._currentSession) return null

    this._currentSession.endTime = new Date().toISOString()
    const startMs = new Date(this._currentSession.startTime).getTime()
    const endMs = new Date(this._currentSession.endTime).getTime()
    this._currentSession.durationMinutes = Math.round((endMs - startMs) / 60000)
    this._currentSession.wordsPerMinute = this._currentSession.durationMinutes > 0
      ? Math.round(this._currentSession.wordsWritten / this._currentSession.durationMinutes * 10) / 10
      : 0

    // 保存会话
    this._saveSession(this._currentSession)
    const completed = { ...this._currentSession }
    this._currentSession = null
    return completed
  },

  /** 获取当前会话状态 */
  getCurrentSession() {
    return this._currentSession
  },

  /** 检查是否正在写作 */
  isActive() {
    return this._currentSession !== null
  },

  /** 获取当前会话持续时间（分钟） */
  getElapsedMinutes() {
    if (!this._currentSession) return 0
    const startMs = new Date(this._currentSession.startTime).getTime()
    const nowMs = Date.now()
    return Math.round((nowMs - startMs) / 60000)
  },

  /** 检查字数里程碑 */
  _checkMilestones() {
    if (!this._currentSession) return
    const milestones = [1000, 2000, 3000, 5000, 8000, 10000, 15000, 20000, 30000, 50000]
    const totalWritten = this._currentSession.wordsWritten

    milestones.forEach(m => {
      if (totalWritten >= m && !this._currentSession.milestones.includes(m)) {
        this._currentSession.milestones.push(m)
      }
    })
  },

  /** 保存会话到 localStorage */
  _saveSession(session) {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY)
      const sessions = data ? JSON.parse(data) : []
      sessions.push(session)
      // 只保留最近365天的会话
      const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      const filtered = sessions.filter(s => s.startTime > cutoff)
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('[写作工具] 保存会话失败:', error)
    }
  },

  /** 加载历史会话 */
  loadSessions(projectId, limit) {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY)
      let sessions = data ? JSON.parse(data) : []
      if (projectId) sessions = sessions.filter(s => s.projectId === projectId)
      sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      if (limit) sessions = sessions.slice(0, limit)
      return sessions
    } catch (error) {
      console.error('[写作工具] 加载会话失败:', error)
      return []
    }
  },

  /** 获取写作统计 */
  getWritingStats(projectId) {
    const sessions = this.loadSessions(projectId)
    const today = new Date().toISOString().split('T')[0]

    // 计算连续写作天数
    const writingDates = [...new Set(
      sessions.map(s => s.startTime.split('T')[0]).sort().reverse()
    )]
    let streakDays = 0
    const checkDate = new Date()
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (writingDates.includes(dateStr)) {
        streakDays++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (i > 0) {
        break
      }
    }

    // 今日统计
    const todaySessions = sessions.filter(s => s.startTime.startsWith(today))
    const todayWords = todaySessions.reduce((sum, s) => sum + s.wordsWritten, 0)
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.durationMinutes, 0)

    // 总计统计
    const totalWords = sessions.reduce((sum, s) => sum + s.wordsWritten, 0)
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
    const totalSessions = sessions.length

    // 最佳记录
    const bestDayWords = this._getBestDayWords(sessions)
    const bestSessionWords = sessions.length > 0
      ? Math.max(...sessions.map(s => s.wordsWritten))
      : 0
    const longestSession = sessions.length > 0
      ? Math.max(...sessions.map(s => s.durationMinutes))
      : 0

    // 平均速度
    const avgWordsPerSession = totalSessions > 0 ? Math.round(totalWords / totalSessions) : 0
    const avgWordsPerMinute = totalMinutes > 0 ? Math.round(totalWords / totalMinutes * 10) / 10 : 0

    return {
      streakDays,
      todayWords,
      todayMinutes,
      todaySessions: todaySessions.length,
      totalWords,
      totalMinutes,
      totalSessions,
      bestDayWords,
      bestSessionWords,
      longestSession,
      avgWordsPerSession,
      avgWordsPerMinute
    }
  },

  /** 获取最佳单日字数 */
  _getBestDayWords(sessions) {
    const dayMap = {}
    sessions.forEach(s => {
      const day = s.startTime.split('T')[0]
      dayMap[day] = (dayMap[day] || 0) + s.wordsWritten
    })
    const entries = Object.values(dayMap)
    return entries.length > 0 ? Math.max(...entries) : 0
  },

  /** 获取每日写作热力图数据（最近90天） */
  getHeatmapData(projectId) {
    const sessions = this.loadSessions(projectId)
    const dayMap = {}
    sessions.forEach(s => {
      const day = s.startTime.split('T')[0]
      if (!dayMap[day]) dayMap[day] = { words: 0, minutes: 0, sessions: 0 }
      dayMap[day].words += s.wordsWritten
      dayMap[day].minutes += s.durationMinutes
      dayMap[day].sessions++
    })

    // 生成最近90天的数据
    const result = []
    const today = new Date()
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        words: dayMap[dateStr]?.words || 0,
        minutes: dayMap[dateStr]?.minutes || 0,
        sessions: dayMap[dateStr]?.sessions || 0
      })
    }

    return result
  }
}

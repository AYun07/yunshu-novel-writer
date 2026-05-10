/**
 * ============================================================================
 * 云书 - 文本质量分析系统 (Text Analysis System)
 * ============================================================================
 * 对标 Quoll Writer 问题查找器
 *
 * 功能概览：
 * - 问题检测规则引擎（副词过度使用、被动语态、重复用词等）
 * - 可读性评分算法（Flesch-Kincaid、平均句长、词汇丰富度等）
 * - 用词频率分析器
 * - 文本统计（字数/句数/段数/对话数/阅读时间）
 * - 中文文本特殊处理（分词、中文标点、段首缩进检查）
 *
 * 使用方式：
 *   import { analyzeText, detectIssues, calculateReadability, ... } from '@/config/textAnalysis'
 * ============================================================================
 */

// ============================================================================
// 一、分析配置（阈值可调）
// ============================================================================

/**
 * 分析配置项
 * 所有阈值均可根据用户偏好调整
 */
export const ANALYSIS_CONFIG = {
  // 副词检测
  adverb: {
    enabled: true,
    threshold: 3,           // 同一副词出现超过此次数则标记
    excludeCommon: true,    // 排除常见副词（很、非常、也等）
    commonAdverbs: ['很', '非常', '也', '还', '都', '就', '才', '已经', '正在', '将要', '不', '没', '没有', '在', '又', '再', '更', '最', '比较', '稍微', '略微', '几乎', '大概', '也许', '可能', '一定', '必须', '忽然', '突然', '渐渐', '慢慢', '悄悄', '默默', '轻轻', '狠狠', '死死', '紧紧', '牢牢', '稳稳', '静静', '暗暗', '偷偷', '悄悄', '猛然', '忽然', '突然', '顿时', '立刻', '马上', '赶紧', '连忙', '急忙', '终于', '究竟', '到底', '简直', '竟然', '居然', '果然', '居然', '竟然', '究竟', '到底', '难道', '岂不是', '何尝', '未必', '不妨', '倒不如', '恰恰', '正好', '刚好', '偏巧', '恰好', '幸亏', '好在', '多亏', '总算', '终于']
  },

  // 被动语态检测
  passiveVoice: {
    enabled: true,
    threshold: 5,           // 被动句数量超过此值则标记
    chineseMarkers: ['被', '受', '遭', '挨', '让', '叫', '给', '为...所', '被...所'],
    englishMarkers: ['was', 'were', 'been', 'being', 'by the', 'by a', 'by an']
  },

  // 重复用词检测
  repetition: {
    enabled: true,
    threshold: 5,           // 同一词在1000字内出现超过此次数则标记
    windowSize: 1000,       // 滑动窗口大小（字数）
    excludeCommon: true,    // 排除常见虚词
    commonWords: ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '他', '她', '它', '们', '那', '里', '什么', '又', '来', '对', '么', '这个', '那个', '但是', '因为', '所以', '如果', '虽然', '已经', '可以', '知道', '时候', '现在', '然后', '或者', '还是', '只是', '这样', '那样', '怎么', '什么', '为什么', '哪里', '谁', '多少', '几', '些', '把', '被', '从', '向', '给', '比', '让', '用', '以', '于', '与', '及', '而', '且', '或']
  },

  // 句子长度检测
  sentenceLength: {
    enabled: true,
    maxLength: 80,          // 中文句子的最大建议长度（字符数）
    warningLength: 60,      // 警告长度
    maxLengthEn: 40,        // 英文句子的最大建议长度（单词数）
    warningLengthEn: 25     // 英文句子的警告长度
  },

  // 段落长度检测
  paragraphLength: {
    enabled: true,
    maxLength: 500,         // 中文段落最大建议长度（字符数）
    warningLength: 300,     // 警告长度
    minLength: 20           // 最小建议长度
  },

  // 对话标签检测
  dialogueTags: {
    enabled: true,
    threshold: 3,           // 同一对话标签使用超过此次数则标记
    commonTags: ['说', '道', '问', '答', '喊', '叫', '吼', '嚷', '嘟囔', '嘀咕', '低语', '轻声说', '大声说', '笑着说', '哭着说', '冷冷地说', '淡淡地说', '缓缓地说', '沉声说', '厉声说', '怒道', '喜道', '悲道', '叹道', '笑道', '哭道']
  },

  // 陈词滥调检测
  cliches: {
    enabled: true,
    customList: []          // 用户自定义陈词滥调列表
  },

  // 标点符号检测
  punctuation: {
    enabled: true,
    checkConsecutive: true,  // 检查连续标点（如 ！！、？？）
    checkMixed: true,        // 检查混用中英文标点
    checkEllipsis: true,     // 检查省略号使用
    maxConsecutive: 2        // 同一标点最大连续次数
  },

  // 段首缩进检查
  indentation: {
    enabled: true,
    expectedSpaces: 2        // 期望的缩进空格数（全角空格）
    checkFirstParagraph: false // 是否检查第一段（通常不缩进）
  }
}

// ============================================================================
// 二、陈词滥调列表（100+常见中文写作陈词滥调）
// ============================================================================

/**
 * 内置陈词滥调列表
 * 包含常见的中英文陈词滥调表达
 */
export const CLICHE_LIST = [
  // 外貌描写
  '眉清目秀', '明眸皓齿', '倾国倾城', '沉鱼落雁', '闭月羞花',
  '如花似玉', '冰肌玉骨', '亭亭玉立', '婀娜多姿', '楚楚动人',
  '虎背熊腰', '面如冠玉', '目若朗星', '鼻若悬胆', '唇红齿白',
  '剑眉星目', '凤眼修眉', '面若桃花', '肤如凝脂', '手如柔荑',

  // 表情神态
  '嘴角微微上扬', '眼中闪过一丝', '脸色一变', '瞳孔骤缩',
  '嘴角勾起一抹', '眼中闪过一丝不易察觉的', '面色铁青',
  '面无表情', '不怒自威', '喜怒不形于色', '嘴角抽搐',
  '眼中闪过一抹', '脸上浮现出', '神情恍惚', '若有所思',

  // 动作描写
  '不由得', '情不自禁', '下意识地', '条件反射般',
  '猛然回头', '缓缓站起身', '拍了拍肩膀', '深吸一口气',
  '长舒一口气', '咬了咬牙', '攥紧拳头', '握紧了拳头',
  '倒吸一口凉气', '不由自主地', '脱口而出', '欲言又止',

  // 心理描写
  '心中一动', '心中一惊', '心中暗想', '心中暗道',
  '心中百感交集', '五味杂陈', '心如刀割', '心如止水',
  '心潮澎湃', '心中涌起一股', '心中五味杂陈', '百感交集',
  '思绪万千', '万千思绪', '心乱如麻', '心如乱麻',

  // 环境描写
  '阳光明媚', '万里无云', '风和日丽', '鸟语花香',
  '月黑风高', '电闪雷鸣', '倾盆大雨', '狂风暴雨',
  '夕阳西下', '旭日东升', '夜幕降临', '华灯初上',
  '秋高气爽', '春暖花开', '白雪皑皑', '碧波荡漾',

  // 情节表达
  '说时迟那时快', '话分两头', '且说', '按下不表',
  '欲知后事如何', '且听下回分解', '光阴似箭', '日月如梭',
  '转眼间', '刹那间', '霎时间', '一瞬间', '弹指一挥间',
  '不知不觉', '恍如隔世', '如梦似幻', '似真似幻',

  // 关系描写
  '一见钟情', '情投意合', '肝胆相照', '义结金兰',
  '形影不离', '如胶似漆', '水火不容', '势不两立',
  '不共戴天', '恩断义绝', '貌合神离', '同床异梦',

  // 战斗/动作
  '刀光剑影', '血雨腥风', '势如破竹', '所向披靡',
  '以一敌百', '毫发无伤', '险象环生', '千钧一发',
  '危在旦夕', '命悬一线', '九死一生', '死里逃生',

  // 英文陈词滥调
  'a dark and stormy night', 'avoid like the plague', 'better late than never',
  'bitter end', 'calm before the storm', 'cry over spilled milk',
  'cut to the chase', 'easier said than done', 'every cloud has a silver lining',
  'last but not least', 'needle in a haystack', 'once upon a time',
  'play it safe', 'read between the lines', 'silver lining',
  'tip of the iceberg', 'when all is said and done', 'in the blink of an eye',
  'a picture is worth a thousand words', 'actions speak louder than words',
  'all in a day\'s work', 'all thumbs', 'at the end of the day',
  'beat around the bush', 'best thing since sliced bread', 'blessing in disguise',
  'break the ice', 'by the book', 'can of worms', 'cold shoulder',
  'come full circle', 'diamond in the rough', 'elephant in the room',
  'hit the nail on the head', 'ignorance is bliss', 'in hot water',
  'let the cat out of the bag', 'miss the boat', 'off the top of my head',
  'on the same page', 'out of the blue', 'piece of cake',
  'pull yourself together', 'so far so good', 'the best of both worlds',
  'time heals all wounds', 'under the weather', 'up in the air',
  'walk on eggshells', 'whole nine yards', 'worse comes to worst'
]

// ============================================================================
// 三、中文文本处理工具
// ============================================================================

/**
 * 判断文本是否主要为中文
 * @param {string} text - 待检测文本
 * @returns {boolean} 是否为中文文本
 */
export function isChineseText(text) {
  if (!text) return false
  const chineseChars = text.match(/[\u4e00-\u9fff]/g) || []
  const totalChars = text.replace(/\s/g, '').length
  return totalChars > 0 && (chineseChars.length / totalChars) > 0.3
}

/**
 * 简易中文分词
 * 基于规则的前向最大匹配分词（适合写作辅助场景，不需要完美精度）
 * @param {string} text - 中文文本
 * @returns {string[]} 分词结果数组
 */
export function simpleChineseSegment(text) {
  if (!text) return []

  // 常见中文词汇词典（按长度降序排列，优先匹配长词）
  const dictionary = [
    // 四字词
    '不知不觉', '恍如隔世', '如梦似幻', '不由自主', '情不自禁',
    '下意识', '条件反射', '倒吸一口凉气', '百感交集', '五味杂陈',
    '心潮澎湃', '思绪万千', '心乱如麻', '千钧一发', '危在旦夕',
    '命悬一线', '九死一生', '死里逃生', '势如破竹', '所向披靡',
    '刀光剑影', '血雨腥风', '倾盆大雨', '狂风暴雨', '阳光明媚',
    '万里无云', '风和日丽', '鸟语花香', '月黑风高', '电闪雷鸣',
    '夕阳西下', '旭日东升', '夜幕降临', '华灯初上', '秋高气爽',
    '春暖花开', '白雪皑皑', '碧波荡漾', '一见钟情', '情投意合',
    '肝胆相照', '义结金兰', '形影不离', '如胶似漆', '水火不容',
    '势不两立', '不共戴天', '恩断义绝', '貌合神离', '同床异梦',
    '眉清目秀', '明眸皓齿', '倾国倾城', '沉鱼落雁', '闭月羞花',
    '冰肌玉骨', '亭亭玉立', '婀娜多姿', '楚楚动人', '虎背熊腰',
    // 三字词
    '不由得', '刹那间', '一瞬间', '霎时间', '转眼间',
    '深吸一口气', '长舒一口气', '倒吸一口凉气',
    // 两字词
    '但是', '因为', '所以', '如果', '虽然', '已经', '可以',
    '知道', '时候', '现在', '然后', '或者', '还是', '只是',
    '这样', '那样', '怎么', '什么', '为什么', '哪里', '怎么',
    '然而', '不过', '于是', '接着', '然后', '后来', '终于',
    '忽然', '突然', '渐渐', '慢慢', '悄悄', '默默', '轻轻',
    '狠狠', '死死', '紧紧', '牢牢', '稳稳', '静静', '暗暗',
    '偷偷', '猛然', '顿时', '立刻', '马上', '赶紧', '连忙',
    '急忙', '终于', '究竟', '到底', '简直', '竟然', '居然',
    '果然', '难道', '也许', '可能', '一定', '必须', '应该',
    '需要', '想要', '希望', '觉得', '认为', '以为', '发现',
    '看到', '听到', '感到', '想到', '知道', '记得', '忘记',
    '明白', '理解', '相信', '怀疑', '担心', '害怕', '恐惧',
    '喜欢', '讨厌', '爱', '恨', '快乐', '悲伤', '愤怒',
    '惊讶', '失望', '满意', '高兴', '难过', '痛苦', '幸福',
    '美丽', '丑陋', '高大', '矮小', '肥胖', '瘦弱', '强壮',
    '勇敢', '懦弱', '聪明', '愚蠢', '善良', '邪恶', '诚实',
    '虚伪', '温柔', '粗暴', '大方', '小气', '谦虚', '骄傲',
    '开始', '结束', '继续', '停止', '进行', '完成', '实现',
    '获得', '失去', '拥有', '缺少', '增加', '减少', '改变',
    '保持', '打破', '建立', '摧毁', '保护', '攻击', '防御',
    '前进', '后退', '上升', '下降', '扩大', '缩小', '发展',
    '消失', '出现', '存在', '死亡', '生存', '战斗', '逃跑',
    '追逐', '等待', '寻找', '发现', '隐藏', '暴露', '揭示',
    '欺骗', '诚实', '背叛', '忠诚', '原谅', '报复', '拯救',
    '毁灭', '创造', '破坏', '修复', '改善', '恶化', '转变'
  ]

  const result = []
  let i = 0
  const maxWordLen = 6

  while (i < text.length) {
    let matched = false

    // 跳过非中文字符
    if (!/[\u4e00-\u9fff]/.test(text[i])) {
      // 收集连续的非中文字符作为一个token
      let j = i
      while (j < text.length && !/[\u4e00-\u9fff]/.test(text[j])) {
        j++
      }
      if (j > i) {
        result.push(text.substring(i, j))
      }
      i = j
      continue
    }

    // 前向最大匹配
    for (let len = Math.min(maxWordLen, text.length - i); len >= 2; len--) {
      const word = text.substring(i, i + len)
      if (dictionary.includes(word)) {
        result.push(word)
        i += len
        matched = true
        break
      }
    }

    // 未匹配到词，按单字处理
    if (!matched) {
      result.push(text[i])
      i++
    }
  }

  return result
}

/**
 * 提取中文文本中的句子
 * @param {string} text - 文本
 * @returns {string[]} 句子数组
 */
export function extractSentences(text) {
  if (!text) return []

  // 中文句子以 。！？... 等结尾
  // 英文句子以 . ! ? 结尾
  const sentenceRegex = /[^。！？!?.…\n]+[。！？!?.…]+/g
  const matches = text.match(sentenceRegex) || []

  // 处理没有结尾标点的最后一段
  const lastPart = text.replace(/[^。！？!?.…\n]+[。！？!?.…]+/g, '').trim()
  if (lastPart.length > 0) {
    matches.push(lastPart)
  }

  return matches
}

/**
 * 提取中文文本中的段落
 * @param {string} text - 文本
 * @returns {string[]} 段落数组
 */
export function extractParagraphs(text) {
  if (!text) return []
  return text.split(/\n\s*\n|\n/).filter(p => p.trim().length > 0)
}

/**
 * 提取对话内容
 * @param {string} text - 文本
 * @returns {Object[]} 对话数组 [{content, tag, position}]
 */
export function extractDialogues(text) {
  if (!text) return []

  const dialogues = []
  // 匹配中文引号对话："..." 或 「...」
  const dialogueRegex = /[""「」]([^""「」]+)[""「」]/g
  let match

  while ((match = dialogueRegex.exec(text)) !== null) {
    const content = match[1]
    const position = match.index

    // 尝试提取对话标签（前面的"XX说"等）
    const beforeText = text.substring(Math.max(0, position - 20), position)
    const tagMatch = beforeText.match(/([\u4e00-\u9fff]{1,4})(说|道|问|答|喊|叫|吼|嚷|嘀咕|低语|轻声说|大声说|冷冷地说|淡淡地说|缓缓地说|沉声说|厉声说|怒道|喜道|悲道|叹道|笑道|哭道)\s*$/)

    dialogues.push({
      content,
      tag: tagMatch ? tagMatch[0].trim() : null,
      position,
      length: match[0].length
    })
  }

  return dialogues
}

// ============================================================================
// 四、问题检测规则引擎
// ============================================================================

/**
 * 问题严重级别
 */
export const ISSUE_SEVERITY = {
  ERROR: 'error',       // 错误（必须修改）
  WARNING: 'warning',   // 警告（建议修改）
  INFO: 'info',         // 提示（可选修改）
  STYLE: 'style'        // 风格建议
}

/**
 * 检测副词过度使用
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectAdverbOveruse(text, config = ANALYSIS_CONFIG.adverb) {
  if (!config.enabled) return []

  const issues = []
  const words = simpleChineseSegment(text)
  const wordCount = {}

  // 统计副词出现次数
  words.forEach(word => {
    if (config.commonAdverbs.includes(word) && config.excludeCommon) return
    // 简单的副词识别：以"地"、"然"结尾的词，或列表中的词
    if (word.endsWith('地') || word.endsWith('然') || word.endsWith('地') || config.commonAdverbs.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })

  // 找出超过阈值的副词
  Object.entries(wordCount).forEach(([word, count]) => {
    if (count > config.threshold) {
      issues.push({
        type: 'adverb_overuse',
        severity: ISSUE_SEVERITY.STYLE,
        message: `副词"${word}"使用了${count}次，建议减少使用`,
        word,
        count,
        threshold: config.threshold,
        suggestion: `尝试用更精确的动词或描写替代"${word}"`
      })
    }
  })

  return issues
}

/**
 * 检测被动语态
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectPassiveVoice(text, config = ANALYSIS_CONFIG.passiveVoice) {
  if (!config.enabled) return []

  const issues = []
  const isChinese = isChineseText(text)

  if (isChinese) {
    // 中文被动语态检测
    config.chineseMarkers.forEach(marker => {
      const regex = new RegExp(marker, 'g')
      const matches = text.match(regex)
      if (matches && matches.length > 0) {
        // 找到具体位置
        let idx = 0
        while ((idx = text.indexOf(marker, idx)) !== -1) {
          const context = text.substring(Math.max(0, idx - 15), Math.min(text.length, idx + marker.length + 15))
          issues.push({
            type: 'passive_voice',
            severity: ISSUE_SEVERITY.STYLE,
            message: `检测到被动语态"${marker}"`,
            marker,
            context: `...${context}...`,
            position: idx,
            suggestion: '考虑改为主动语态，使表达更有力'
          })
          idx += marker.length
        }
      }
    })

    // 如果被动句数量超过阈值，添加汇总警告
    if (issues.length > config.threshold) {
      issues.push({
        type: 'passive_voice_summary',
        severity: ISSUE_SEVERITY.WARNING,
        message: `共检测到${issues.length}处被动语态，超过建议阈值(${config.threshold})`,
        count: issues.length,
        threshold: config.threshold,
        suggestion: '过多被动语态会使文风显得平淡，建议将部分改为主动语态'
      })
    }
  } else {
    // 英文被动语态检测（简化版）
    const passiveRegex = /\b(was|were|been|being)\s+(\w+ed|written|taken|given|made|done|said|told|asked|called|known|shown)\b/gi
    let match
    while ((match = passiveRegex.exec(text)) !== null) {
      const context = text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + match[0].length + 20))
      issues.push({
        type: 'passive_voice',
        severity: ISSUE_SEVERITY.STYLE,
        message: `检测到被动语态"${match[0]}"`,
        marker: match[0],
        context: `...${context}...`,
        position: match.index,
        suggestion: 'Consider rewriting in active voice'
      })
    }
  }

  return issues
}

/**
 * 检测重复用词
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectWordRepetition(text, config = ANALYSIS_CONFIG.repetition) {
  if (!config.enabled) return []

  const issues = []
  const words = simpleChineseSegment(text)
  const windowSize = config.windowSize

  // 滑动窗口检测
  for (let i = 0; i < words.length; i++) {
    const windowEnd = Math.min(i + Math.floor(windowSize / 2), words.length)
    const windowStart = Math.max(0, i - Math.floor(windowSize / 2))
    const windowWords = words.slice(windowStart, windowEnd)

    const word = words[i]
    // 跳过单字和常见虚词
    if (word.length < 2) continue
    if (config.excludeCommon && config.commonWords.includes(word)) continue

    const count = windowWords.filter(w => w === word).length
    if (count > config.threshold) {
      // 避免重复报告同一个词
      const alreadyReported = issues.some(iss => iss.word === word && iss.windowStart === windowStart)
      if (!alreadyReported) {
        issues.push({
          type: 'word_repetition',
          severity: ISSUE_SEVERITY.STYLE,
          message: `"${word}"在附近文本中重复出现${count}次`,
          word,
          count,
          threshold: config.threshold,
          windowStart,
          windowEnd,
          suggestion: `尝试使用同义词替换部分"${word}"`
        })
      }
    }
  }

  // 全文词频统计（找出高频词）
  const globalWordCount = {}
  words.forEach(w => {
    if (w.length < 2) return
    if (config.excludeCommon && config.commonWords.includes(w)) return
    globalWordCount[w] = (globalWordCount[w] || 0) + 1
  })

  // 找出全局高频词
  Object.entries(globalWordCount)
    .filter(([, count]) => count > config.threshold * 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([word, count]) => {
      const alreadyReported = issues.some(iss => iss.word === word && iss.type === 'global_repetition')
      if (!alreadyReported) {
        issues.push({
          type: 'global_repetition',
          severity: ISSUE_SEVERITY.INFO,
          message: `"${word}"在全文中出现${count}次`,
          word,
          count,
          suggestion: `注意"${word}"的使用频率，考虑丰富用词`
        })
      }
    })

  return issues
}

/**
 * 检测句子过长
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectLongSentences(text, config = ANALYSIS_CONFIG.sentenceLength) {
  if (!config.enabled) return []

  const issues = []
  const sentences = extractSentences(text)
  const isChinese = isChineseText(text)

  sentences.forEach((sentence, index) => {
    const length = isChinese
      ? sentence.replace(/[\s\n]/g, '').length
      : sentence.split(/\s+/).filter(w => w.length > 0).length

    const maxLen = isChinese ? config.maxLength : config.maxLengthEn
    const warnLen = isChinese ? config.warningLength : config.warningLengthEn

    if (length > maxLen) {
      issues.push({
        type: 'long_sentence',
        severity: ISSUE_SEVERITY.WARNING,
        message: `第${index + 1}句过长（${length}${isChinese ? '字' : '词'}），建议不超过${maxLen}`,
        sentence: sentence.substring(0, 50) + (sentence.length > 50 ? '...' : ''),
        length,
        maxLength: maxLen,
        sentenceIndex: index,
        suggestion: '考虑将长句拆分为多个短句，提高可读性'
      })
    } else if (length > warnLen) {
      issues.push({
        type: 'long_sentence',
        severity: ISSUE_SEVERITY.INFO,
        message: `第${index + 1}句偏长（${length}${isChinese ? '字' : '词'}），建议不超过${warnLen}`,
        sentence: sentence.substring(0, 50) + (sentence.length > 50 ? '...' : ''),
        length,
        maxLength: warnLen,
        sentenceIndex: index,
        suggestion: '可考虑适当精简'
      })
    }
  })

  return issues
}

/**
 * 检测段落过长
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectLongParagraphs(text, config = ANALYSIS_CONFIG.paragraphLength) {
  if (!config.enabled) return []

  const issues = []
  const paragraphs = extractParagraphs(text)

  paragraphs.forEach((paragraph, index) => {
    const length = paragraph.replace(/[\s\n]/g, '').length

    if (length > config.maxLength) {
      issues.push({
        type: 'long_paragraph',
        severity: ISSUE_SEVERITY.WARNING,
        message: `第${index + 1}段过长（${length}字），建议不超过${config.maxLength}字`,
        length,
        maxLength: config.maxLength,
        paragraphIndex: index,
        suggestion: '考虑将长段落拆分，适当的段落划分有助于阅读节奏'
      })
    } else if (length > config.warningLength) {
      issues.push({
        type: 'long_paragraph',
        severity: ISSUE_SEVERITY.INFO,
        message: `第${index + 1}段偏长（${length}字）`,
        length,
        maxLength: config.warningLength,
        paragraphIndex: index
      })
    } else if (length < config.minLength && length > 0) {
      issues.push({
        type: 'short_paragraph',
        severity: ISSUE_SEVERITY.INFO,
        message: `第${index + 1}段过短（${length}字），可能需要补充内容`,
        length,
        minLength: config.minLength,
        paragraphIndex: index
      })
    }
  })

  return issues
}

/**
 * 检测对话标签重复
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectDialogueTagRepetition(text, config = ANALYSIS_CONFIG.dialogueTags) {
  if (!config.enabled) return []

  const issues = []
  const dialogues = extractDialogues(text)
  const tagCount = {}

  // 统计对话标签
  dialogues.forEach(d => {
    if (d.tag) {
      tagCount[d.tag] = (tagCount[d.tag] || 0) + 1
    }
  })

  // 找出重复使用的标签
  Object.entries(tagCount).forEach(([tag, count]) => {
    if (count > config.threshold) {
      issues.push({
        type: 'dialogue_tag_repetition',
        severity: ISSUE_SEVERITY.STYLE,
        message: `对话标签"${tag}"使用了${count}次，建议丰富对话表达方式`,
        tag,
        count,
        threshold: config.threshold,
        suggestion: '尝试用动作描写、表情描写或省略标签来替代重复的"XX说"'
      })
    }
  })

  // 检查是否有太多无标签对话（可能需要添加标签）
  const noTagDialogues = dialogues.filter(d => !d.tag)
  if (noTagDialogues.length > dialogues.length * 0.6 && dialogues.length > 5) {
    issues.push({
      type: 'missing_dialogue_tags',
      severity: ISSUE_SEVERITY.INFO,
      message: `${noTagDialogues.length}处对话没有标签，读者可能分不清说话人`,
      count: noTagDialogues.length,
      total: dialogues.length,
      suggestion: '在连续对话中适当添加标签或动作描写，帮助读者区分说话人'
    })
  }

  return issues
}

/**
 * 检测陈词滥调
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectCliches(text, config = ANALYSIS_CONFIG.cliches) {
  if (!config.enabled) return []

  const issues = []
  const allCliches = [...CLICHE_LIST, ...config.customList]

  allCliches.forEach(cliche => {
    const regex = new RegExp(escapeRegex(cliche), 'gi')
    let match
    while ((match = regex.exec(text)) !== null) {
      issues.push({
        type: 'cliche',
        severity: ISSUE_SEVERITY.STYLE,
        message: `检测到陈词滥调："${match[0]}"`,
        cliche: match[0],
        position: match.index,
        suggestion: `尝试用更原创的表达替代"${match[0]}"，或赋予其新的语境含义`
      })
    }
  })

  return issues
}

/**
 * 检测标点符号问题
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectPunctuationIssues(text, config = ANALYSIS_CONFIG.punctuation) {
  if (!config.enabled) return []

  const issues = []

  // 检查连续标点
  if (config.checkConsecutive) {
    const consecutiveRegex = /([。！？，、；：…])\1{2,}/g
    let match
    while ((match = consecutiveRegex.exec(text)) !== null) {
      issues.push({
        type: 'consecutive_punctuation',
        severity: ISSUE_SEVERITY.WARNING,
        message: `连续使用标点"${match[0]}"`,
        punctuation: match[0],
        position: match.index,
        suggestion: '避免连续使用同一标点符号超过两次'
      })
    }
  }

  // 检查中英文标点混用
  if (config.checkMixed) {
    // 中文语境中使用英文标点
    const mixedPatterns = [
      { regex: /[\u4e00-\u9fff]\s*[,]\s*[\u4e00-\u9fff]/g, msg: '中文语境中使用英文逗号","', fix: '，' },
      { regex: /[\u4e00-\u9fff]\s*[.]\s*[\u4e00-\u9fff]/g, msg: '中文语境中使用英文句号"."', fix: '。' },
      { regex: /[\u4e00-\u9fff]\s*[!]\s*[\u4e00-\u9fff]/g, msg: '中文语境中使用英文感叹号"!"', fix: '！' },
      { regex: /[\u4e00-\u9fff]\s*[?]\s*[\u4e00-\u9fff]/g, msg: '中文语境中使用英文问号"?"', fix: '？' },
      { regex: /[\u4e00-\u9fff]\s*[:]\s*[\u4e00-\u9fff]/g, msg: '中文语境中使用英文冒号":"', fix: '：' },
      { regex: /[\u4e00-\u9fff]\s*[;]\s*[\u4e00-\u9fff]/g, msg: '中文语境中使用英文分号";"', fix: '；' }
    ]

    mixedPatterns.forEach(({ regex, msg, fix }) => {
      let match
      while ((match = regex.exec(text)) !== null) {
        issues.push({
          type: 'mixed_punctuation',
          severity: ISSUE_SEVERITY.WARNING,
          message: msg,
          position: match.index,
          suggestion: `建议改为中文标点"${fix}"`
        })
      }
    })
  }

  // 检查省略号使用
  if (config.checkEllipsis) {
    // 错误的省略号（用多个句号代替）
    const wrongEllipsis = /\.{3,}/g
    let match
    while ((match = wrongEllipsis.exec(text)) !== null) {
      issues.push({
        type: 'ellipsis_format',
        severity: ISSUE_SEVERITY.WARNING,
        message: '省略号格式不正确，应使用"……"而非"..."',
        position: match.index,
        suggestion: '将"..."替换为中文省略号"……"'
      })
    }
  }

  return issues
}

/**
 * 检测段首缩进问题
 * @param {string} text - 文本
 * @param {Object} [config] - 配置
 * @returns {Object[]} 问题列表
 */
export function detectIndentationIssues(text, config = ANALYSIS_CONFIG.indentation) {
  if (!config.enabled) return []
  if (!isChineseText(text)) return []

  const issues = []
  const paragraphs = extractParagraphs(text)

  paragraphs.forEach((paragraph, index) => {
    // 跳过第一段（如果配置要求）
    if (index === 0 && !config.checkFirstParagraph) return

    // 检查是否以全角空格开头
    const expectedIndent = '\u3000'.repeat(config.expectedSpaces)
    if (!paragraph.startsWith(expectedIndent) && !paragraph.startsWith('　'.repeat(config.expectedSpaces))) {
      // 检查是否有任何缩进
      if (paragraph.startsWith(' ') || paragraph.startsWith('\t')) {
        issues.push({
          type: 'wrong_indentation',
          severity: ISSUE_SEVERITY.INFO,
          message: `第${index + 1}段使用了半角空格缩进，建议使用全角空格`,
          paragraphIndex: index,
          suggestion: `段首缩进应使用${config.expectedSpaces}个全角空格`
        })
      } else if (paragraph.length > 50) {
        issues.push({
          type: 'missing_indentation',
          severity: ISSUE_SEVERITY.INFO,
          message: `第${index + 1}段缺少段首缩进`,
          paragraphIndex: index,
          suggestion: `段首应缩进${config.expectedSpaces}个全角空格`
        })
      }
    }
  })

  return issues
}

// ============================================================================
// 五、可读性评分算法
// ============================================================================

/**
 * 计算 Flesch-Kincaid 可读性指数（中文适配版）
 * 原始公式：206.835 - 1.015 * (总词数/总句数) - 84.6 * (总音节/总词数)
 * 中文适配：使用字数代替词数，简化音节计算
 * @param {string} text - 文本
 * @returns {Object} 可读性评分结果
 */
export function calculateReadability(text) {
  if (!text || text.trim().length === 0) {
    return { score: 0, level: '无内容', details: {} }
  }

  const isChinese = isChineseText(text)
  const sentences = extractSentences(text)
  const words = simpleChineseSegment(text)
  const cleanText = text.replace(/[\s\n\r]/g, '')
  const totalChars = cleanText.length
  const totalSentences = Math.max(sentences.length, 1)
  const totalWords = words.length

  // 平均句子长度
  const avgSentenceLength = isChinese
    ? totalChars / totalSentences
    : totalWords / totalSentences

  // 平均词长
  const avgWordLength = isChinese
    ? totalChars / Math.max(totalWords, 1)
    : words.reduce((sum, w) => sum + w.length, 0) / Math.max(totalWords, 1)

  // 词汇丰富度（独特词/总词数比）
  const uniqueWords = new Set(words.filter(w => w.length >= 2))
  const vocabularyRichness = totalWords > 0
    ? uniqueWords.size / totalWords
    : 0

  // 对话比例
  const dialogues = extractDialogues(text)
  const dialogueChars = dialogues.reduce((sum, d) => sum + d.content.length, 0)
  const dialogueRatio = totalChars > 0 ? dialogueChars / totalChars : 0

  // Flesch-Kincaid 评分（中文适配）
  let fkScore
  if (isChinese) {
    // 中文适配：调整系数
    fkScore = 100 - (avgSentenceLength * 1.2) - (avgWordLength * 10)
    fkScore = Math.max(0, Math.min(100, fkScore))
  } else {
    // 英文原版公式
    const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
    fkScore = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (syllables / Math.max(totalWords, 1))
    fkScore = Math.max(0, Math.min(100, fkScore))
  }

  // 可读性等级
  let level
  if (fkScore >= 90) level = '非常易读'
  else if (fkScore >= 70) level = '较易阅读'
  else if (fkScore >= 50) level = '中等难度'
  else if (fkScore >= 30) level = '较难阅读'
  else level = '非常难读'

  return {
    score: Math.round(fkScore * 10) / 10,
    level,
    details: {
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
      vocabularyRichness: Math.round(vocabularyRichness * 1000) / 1000,
      dialogueRatio: Math.round(dialogueRatio * 1000) / 1000,
      totalWords,
      uniqueWordCount: uniqueWords.size,
      isChinese
    }
  }
}

/**
 * 计算英文单词的音节数（简化版）
 * @param {string} word - 英文单词
 * @returns {number} 音节数
 */
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1

  let count = 0
  const vowels = 'aeiouy'
  let prevIsVowel = false

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !prevIsVowel) count++
    prevIsVowel = isVowel
  }

  // 结尾的 e 不计数
  if (word.endsWith('e') && count > 1) count--
  // 结尾的 le 前有辅音则计数
  if (word.endsWith('le') && word.length > 2 && !vowels.includes(word[word.length - 3])) count++

  return Math.max(1, count)
}

// ============================================================================
// 六、用词频率分析器
// ============================================================================

/**
 * 分析用词频率
 * @param {string} text - 文本
 * @param {Object} [options] - 选项
 * @param {number} [options.topN=50] - 返回前N个高频词
 * @param {number} [options.minLength=2] - 最小词长
 * @param {boolean} [options.excludeCommon=true] - 是否排除常见词
 * @returns {Object} 频率分析结果
 */
export function analyzeWordFrequency(text, options = {}) {
  const {
    topN = 50,
    minLength = 2,
    excludeCommon = true
  } = options

  const words = simpleChineseSegment(text)
  const frequency = {}

  words.forEach(word => {
    if (word.length < minLength) return
    if (excludeCommon && ANALYSIS_CONFIG.repetition.commonWords.includes(word)) return
    frequency[word] = (frequency[word] || 0) + 1
  })

  // 按频率排序
  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }))

  // 词长分布
  const lengthDistribution = {}
  Object.entries(frequency).forEach(([word, count]) => {
    const len = word.length
    lengthDistribution[len] = (lengthDistribution[len] || 0) + count
  })

  return {
    totalUniqueWords: Object.keys(frequency).length,
    totalWords: words.filter(w => w.length >= minLength).length,
    topWords: sorted,
    lengthDistribution,
    frequencyMap: frequency
  }
}

// ============================================================================
// 七、文本统计
// ============================================================================

/**
 * 文本统计数据结构
 * @typedef {Object} TextStats
 * @property {number} charCount - 总字符数（含空格）
 * @property {number} charCountNoSpaces - 总字符数（不含空格）
 * @property {number} chineseCharCount - 中文字符数
 * @property {number} wordCount - 词数/字数
 * @property {number} sentenceCount - 句数
 * @property {number} paragraphCount - 段数
 * @property {number} dialogueCount - 对话数
 * @property {number} dialogueCharCount - 对话字数
 * @property {number} readingTimeMinutes - 预估阅读时间（分钟）
 * @property {number} speakingTimeMinutes - 预估朗读时间（分钟）
 * @property {number} pageEstimate - 预估页数
 */

/**
 * 计算文本统计信息
 * @param {string} text - 文本
 * @returns {TextStats} 统计数据
 */
export function calculateTextStats(text) {
  if (!text || text.trim().length === 0) {
    return {
      charCount: 0, charCountNoSpaces: 0, chineseCharCount: 0,
      wordCount: 0, sentenceCount: 0, paragraphCount: 0,
      dialogueCount: 0, dialogueCharCount: 0,
      readingTimeMinutes: 0, speakingTimeMinutes: 0, pageEstimate: 0
    }
  }

  const isChinese = isChineseText(text)
  const cleanText = text.replace(/[\s\n\r]/g, '')
  const charCount = text.length
  const charCountNoSpaces = cleanText.length
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const sentences = extractSentences(text)
  const paragraphs = extractParagraphs(text)
  const dialogues = extractDialogues(text)
  const dialogueChars = dialogues.reduce((sum, d) => sum + d.content.length, 0)

  // 中文按字数计算，英文按词数计算
  const wordCount = isChinese ? chineseChars : text.split(/\s+/).filter(w => w.length > 0).length

  // 中文阅读速度：约500字/分钟；英文：约250词/分钟
  const readingSpeed = isChinese ? 500 : 250
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / readingSpeed))

  // 朗读速度：中文约250字/分钟；英文约150词/分钟
  const speakingSpeed = isChinese ? 250 : 150
  const speakingTimeMinutes = Math.max(1, Math.ceil(wordCount / speakingSpeed))

  // 预估页数：中文约800字/页；英文约300词/页
  const pageEstimate = isChinese
    ? Math.max(1, Math.ceil(chineseChars / 800))
    : Math.max(1, Math.ceil(wordCount / 300))

  return {
    charCount,
    charCountNoSpaces,
    chineseCharCount,
    wordCount,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    dialogueCount: dialogues.length,
    dialogueCharCount: dialogueChars,
    readingTimeMinutes,
    speakingTimeMinutes,
    pageEstimate
  }
}

// ============================================================================
// 八、综合分析函数
// ============================================================================

/**
 * 分析结果数据结构
 * @typedef {Object} AnalysisResult
 * @property {number} score - 总体评分（0-100）
 * @property {string} level - 总体等级
 * @property {Object[]} issues - 问题列表
 * @property {Object} stats - 文本统计
 * @property {Object} readability - 可读性评分
 * @property {Object} suggestions - 改进建议
 * @property {Object} frequency - 用词频率
 */

/**
 * 执行完整的文本分析
 * @param {string} text - 待分析文本
 * @param {Object} [config] - 分析配置（可覆盖默认配置）
 * @returns {AnalysisResult} 完整的分析结果
 */
export function analyzeText(text, config = {}) {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      level: '无内容',
      issues: [],
      stats: calculateTextStats(''),
      readability: calculateReadability(''),
      suggestions: { overall: [], byCategory: {} },
      frequency: analyzeWordFrequency('')
    }
  }

  // 合并配置
  const mergedConfig = deepMerge(ANALYSIS_CONFIG, config)

  // 运行所有检测
  const allIssues = [
    ...detectAdverbOveruse(text, mergedConfig.adverb),
    ...detectPassiveVoice(text, mergedConfig.passiveVoice),
    ...detectWordRepetition(text, mergedConfig.repetition),
    ...detectLongSentences(text, mergedConfig.sentenceLength),
    ...detectLongParagraphs(text, mergedConfig.paragraphLength),
    ...detectDialogueTagRepetition(text, mergedConfig.dialogueTags),
    ...detectCliches(text, mergedConfig.cliches),
    ...detectPunctuationIssues(text, mergedConfig.punctuation),
    ...detectIndentationIssues(text, mergedConfig.indentation)
  ]

  // 计算统计数据
  const stats = calculateTextStats(text)
  const readability = calculateReadability(text)
  const frequency = analyzeWordFrequency(text)

  // 计算总体评分
  const score = calculateOverallScore(allIssues, readability, stats)

  // 生成建议
  const suggestions = generateSuggestions(allIssues, readability, stats)

  // 按严重级别分类问题
  const issuesBySeverity = {
    [ISSUE_SEVERITY.ERROR]: allIssues.filter(i => i.severity === ISSUE_SEVERITY.ERROR),
    [ISSUE_SEVERITY.WARNING]: allIssues.filter(i => i.severity === ISSUE_SEVERITY.WARNING),
    [ISSUE_SEVERITY.INFO]: allIssues.filter(i => i.severity === ISSUE_SEVERITY.INFO),
    [ISSUE_SEVERITY.STYLE]: allIssues.filter(i => i.severity === ISSUE_SEVERITY.STYLE)
  }

  return {
    score,
    level: getScoreLevel(score),
    issues: allIssues,
    issuesBySeverity,
    stats,
    readability,
    suggestions,
    frequency
  }
}

/**
 * 计算总体评分
 * @param {Object[]} issues - 问题列表
 * @param {Object} readability - 可读性数据
 * @param {Object} stats - 文本统计
 * @returns {number} 评分（0-100）
 */
function calculateOverallScore(issues, readability, stats) {
  let score = readability.score

  // 根据问题扣分
  issues.forEach(issue => {
    switch (issue.severity) {
      case ISSUE_SEVERITY.ERROR: score -= 5; break
      case ISSUE_SEVERITY.WARNING: score -= 3; break
      case ISSUE_SEVERITY.INFO: score -= 1; break
      case ISSUE_SEVERITY.STYLE: score -= 1.5; break
    }
  })

  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * 根据评分获取等级
 * @param {number} score - 评分
 * @returns {string} 等级描述
 */
function getScoreLevel(score) {
  if (score >= 90) return '优秀'
  if (score >= 75) return '良好'
  if (score >= 60) return '中等'
  if (score >= 40) return '待改进'
  return '需要大幅修改'
}

/**
 * 生成改进建议
 * @param {Object[]} issues - 问题列表
 * @param {Object} readability - 可读性数据
 * @param {Object} stats - 文本统计
 * @returns {Object} 建议数据
 */
function generateSuggestions(issues, readability, stats) {
  const suggestions = { overall: [], byCategory: {} }

  // 按问题类型分组
  const typeGroups = {}
  issues.forEach(issue => {
    if (!typeGroups[issue.type]) typeGroups[issue.type] = []
    typeGroups[issue.type].push(issue)
  })

  // 为每种问题类型生成建议
  Object.entries(typeGroups).forEach(([type, items]) => {
    const categorySuggestions = []
    switch (type) {
      case 'adverb_overuse':
        categorySuggestions.push('减少副词使用，尝试用更精确的动词来传达含义')
        break
      case 'passive_voice':
      case 'passive_voice_summary':
        categorySuggestions.push('将部分被动语态改为主动语态，使文风更有力')
        break
      case 'word_repetition':
      case 'global_repetition':
        categorySuggestions.push('注意用词多样性，使用同义词替换重复词汇')
        break
      case 'long_sentence':
        categorySuggestions.push('将过长的句子拆分为短句，提高可读性')
        break
      case 'long_paragraph':
        categorySuggestions.push('适当拆分长段落，控制阅读节奏')
        break
      case 'dialogue_tag_repetition':
      case 'missing_dialogue_tags':
        categorySuggestions.push('丰富对话表达方式，用动作和表情替代重复的对话标签')
        break
      case 'cliche':
        categorySuggestions.push('替换陈词滥调，用更原创的表达方式')
        break
      case 'consecutive_punctuation':
      case 'mixed_punctuation':
      case 'ellipsis_format':
        categorySuggestions.push('统一标点符号使用规范')
        break
      case 'wrong_indentation':
      case 'missing_indentation':
        categorySuggestions.push('检查段首缩进格式')
        break
    }
    if (categorySuggestions.length > 0) {
      suggestions.byCategory[type] = categorySuggestions
    }
  })

  // 整体建议
  if (readability.details.avgSentenceLength > 50) {
    suggestions.overall.push('平均句子偏长，建议增加短句的使用')
  }
  if (readability.details.dialogueRatio < 0.1 && stats.wordCount > 3000) {
    suggestions.overall.push('对话比例偏低，适当增加对话可以使叙事更生动')
  }
  if (readability.details.dialogueRatio > 0.6) {
    suggestions.overall.push('对话比例偏高，适当增加叙述和描写来平衡节奏')
  }
  if (readability.details.vocabularyRichness < 0.3) {
    suggestions.overall.push('词汇丰富度偏低，建议丰富用词')
  }

  return suggestions
}

// ============================================================================
// 九、工具函数
// ============================================================================

/**
 * 正则表达式特殊字符转义
 * @param {string} string - 待转义字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 深度合并对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
  const result = { ...target }
  Object.entries(source).forEach(([key, value]) => {
    if (
      value && typeof value === 'object' && !Array.isArray(value) &&
      result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = value
    }
  })
  return result
}

/**
 * 快速分析（仅返回评分和关键问题，用于实时反馈）
 * @param {string} text - 文本
 * @returns {Object} 快速分析结果
 */
export function quickAnalysis(text) {
  const readability = calculateReadability(text)
  const stats = calculateTextStats(text)

  // 只运行轻量级检测
  const issues = [
    ...detectLongSentences(text),
    ...detectPunctuationIssues(text)
  ]

  return {
    score: Math.max(0, Math.min(100, readability.score - issues.length * 2)),
    readability: readability.level,
    wordCount: stats.wordCount,
    sentenceCount: stats.sentenceCount,
    keyIssues: issues.slice(0, 5)
  }
}

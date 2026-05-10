// 统一的token估算算法：中文约1.5 token/字，英文约1.3 token/词

/**
 * 估算文本的token数量
 * @param {string} text - 输入文本
 * @returns {number} 估算的token数量
 */
export function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0

  const details = estimateTokensDetailed(text)
  return details.total
}

/**
 * 详细估算文本的token数量，按字符类型分类
 * @param {string} text - 输入文本
 * @returns {{ total: number, chinese: number, english: number, other: number }}
 */
export function estimateTokensDetailed(text) {
  if (!text || typeof text !== 'string') {
    return { total: 0, chinese: 0, english: 0, other: 0 }
  }

  let chineseChars = 0
  let englishWords = 0
  let otherChars = 0

  // 匹配中文字符（CJK统一汉字）
  const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf]/g
  const chineseMatches = text.match(chineseRegex)
  chineseChars = chineseMatches ? chineseMatches.length : 0

  // 匹配英文单词
  const englishRegex = /[a-zA-Z]+/g
  const englishMatches = text.match(englishRegex)
  englishWords = englishMatches ? englishMatches.length : 0

  // 其他字符（数字、标点、空白等）
  const countedLength = (chineseMatches ? chineseMatches.join('').length : 0)
    + (englishMatches ? englishMatches.join('').length : 0)
  otherChars = Math.max(0, text.length - countedLength)

  // 中文约1.5 token/字，英文约1.3 token/词，其他约0.5 token/字符
  const chineseTokens = Math.ceil(chineseChars * 1.5)
  const englishTokens = Math.ceil(englishWords * 1.3)
  const otherTokens = Math.ceil(otherChars * 0.5)

  return {
    total: chineseTokens + englishTokens + otherTokens,
    chinese: chineseTokens,
    english: englishTokens,
    other: otherTokens
  }
}

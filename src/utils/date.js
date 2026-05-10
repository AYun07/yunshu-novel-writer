/**
 * 统一日期格式化工具
 */

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、时间戳或日期字符串
 * @param {string} format - 格式模板，支持 YYYY-MM-DD HH:mm:ss
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const tokens = {
    'YYYY': d.getFullYear(),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'DD': String(d.getDate()).padStart(2, '0'),
    'HH': String(d.getHours()).padStart(2, '0'),
    'mm': String(d.getMinutes()).padStart(2, '0'),
    'ss': String(d.getSeconds()).padStart(2, '0')
  }

  let result = format
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value)
  }
  return result
}

/**
 * 格式化日期和时间
 * @param {Date|string|number} date
 * @returns {string} 格式如 "2025-05-09 14:30:00"
 */
export function formatDateTime(date) {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化为相对时间
 * @param {Date|string|number} date
 * @returns {string} 如 "3分钟前"、"2小时前"、"3天前"
 */
export function formatRelative(date) {
  return getTimeAgo(date)
}

/**
 * 获取距离现在的相对时间描述
 * @param {Date|string|number} date
 * @returns {string}
 */
export function getTimeAgo(date) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const now = Date.now()
  const diff = now - d.getTime()
  const absDiff = Math.abs(diff)
  const isFuture = diff < 0

  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let text = ''
  if (seconds < 60) {
    text = '刚刚'
  } else if (minutes < 60) {
    text = `${minutes}分钟前`
  } else if (hours < 24) {
    text = `${hours}小时前`
  } else if (days < 30) {
    text = `${days}天前`
  } else if (months < 12) {
    text = `${months}个月前`
  } else {
    text = `${years}年前`
  }

  if (isFuture && text !== '刚刚') {
    text = text.replace('前', '后')
  }

  return text
}

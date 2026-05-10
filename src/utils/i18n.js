/**
 * 云书 - 国际化工具
 * 提供语言切换、语言检测、语言存储、翻译函数、复数处理和变量插值功能
 * @module utils/i18n
 */

import { ref, computed, watch } from 'vue'

// ============================================
// 一、语言包导入
// ============================================

// 导入所有语言包
import zhCN from '@/locales/zh-CN.js'
import enUS from '@/locales/en-US.js'
import jaJP from '@/locales/ja-JP.js'

// ============================================
// 二、配置与常量
// ============================================

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' }
]

/**
 * 默认语言
 */
export const DEFAULT_LANGUAGE = 'zh-CN'

/**
 * 存储键名
 */
const STORAGE_KEY = 'yunshu_language'

/**
 * 语言包映射
 */
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP
}

// ============================================
// 三、响应式状态
// ============================================

/**
 * 当前语言（响应式）
 */
export const currentLocale = ref(DEFAULT_LANGUAGE)

/**
 * 当前语言包（计算属性）
 */
export const currentMessages = computed(() => {
  return messages[currentLocale.value] || messages[DEFAULT_LANGUAGE]
})

// ============================================
// 四、语言检测
// ============================================

/**
 * 语言检测器
 */
export const LanguageDetector = {
  /**
   * 检测浏览器语言
   * @returns {string} 检测到的语言代码
   */
  detectBrowserLanguage() {
    // 安全检查：确保在浏览器环境中
    if (typeof navigator === 'undefined') {
      return DEFAULT_LANGUAGE
    }
    
    // 获取浏览器语言设置
    const browserLang = navigator.language || navigator.userLanguage
    
    if (!browserLang) {
      return DEFAULT_LANGUAGE
    }
    
    // 标准化语言代码
    const normalizedLang = this.normalizeLanguageCode(browserLang)
    
    // 检查是否支持
    if (this.isSupported(normalizedLang)) {
      return normalizedLang
    }
    
    // 尝试匹配语言主代码（如 zh -> zh-CN）
    const primaryLang = normalizedLang.split('-')[0]
    const matchedLang = SUPPORTED_LANGUAGES.find(
      lang => lang.code.startsWith(primaryLang)
    )
    
    return matchedLang ? matchedLang.code : DEFAULT_LANGUAGE
  },

  /**
   * 从存储中获取语言
   * @returns {string|null} 存储的语言代码
   */
  getStoredLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Failed to get stored language:', e)
      return null
    }
  },

  /**
   * 从 URL 参数获取语言
   * @returns {string|null} URL 参数中的语言代码
   */
  getLanguageFromURL() {
    // 安全检查：确保在浏览器环境中
    if (typeof window === 'undefined') {
      return null
    }
    const urlParams = new URLSearchParams(window.location.search)
    const lang = urlParams.get('lang')
    
    if (lang && this.isSupported(lang)) {
      return lang
    }
    
    return null
  },

  /**
   * 检测最佳语言
   * 优先级：URL参数 > 存储设置 > 浏览器语言 > 默认语言
   * @returns {string} 最佳语言代码
   */
  detectBestLanguage() {
    // 1. 检查 URL 参数
    const urlLang = this.getLanguageFromURL()
    if (urlLang) {
      return urlLang
    }
    
    // 2. 检查存储设置
    const storedLang = this.getStoredLanguage()
    if (storedLang && this.isSupported(storedLang)) {
      return storedLang
    }
    
    // 3. 检测浏览器语言
    const browserLang = this.detectBrowserLanguage()
    if (browserLang) {
      return browserLang
    }
    
    // 4. 返回默认语言
    return DEFAULT_LANGUAGE
  },

  /**
   * 标准化语言代码
   * @param {string} code - 原始语言代码
   * @returns {string} 标准化后的语言代码
   */
  normalizeLanguageCode(code) {
    if (!code) return DEFAULT_LANGUAGE
    
    // 转换为小写
    let normalized = code.toLowerCase()
    
    // 处理常见的语言代码格式
    const mapping = {
      'zh': 'zh-CN',
      'zh-cn': 'zh-CN',
      'zh-tw': 'zh-CN', // 暂时映射到简体中文
      'zh-hk': 'zh-CN',
      'en': 'en-US',
      'en-us': 'en-US',
      'en-gb': 'en-US',
      'ja': 'ja-JP',
      'ja-jp': 'ja-JP'
    }
    
    return mapping[normalized] || normalized
  },

  /**
   * 检查语言是否支持
   * @param {string} code - 语言代码
   * @returns {boolean}
   */
  isSupported(code) {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code)
  }
}

// ============================================
// 五、语言存储
// ============================================

/**
 * 语言存储管理器
 */
export const LanguageStorage = {
  /**
   * 保存语言设置
   * @param {string} locale - 语言代码
   */
  save(locale) {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch (e) {
      console.warn('Failed to save language setting:', e)
    }
  },

  /**
   * 清除语言设置
   */
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Failed to clear language setting:', e)
    }
  },

  /**
   * 获取语言设置
   * @returns {string|null}
   */
  get() {
    return LanguageDetector.getStoredLanguage()
  }
}

// ============================================
// 六、翻译函数
// ============================================

/**
 * 获取嵌套对象的值
 * @param {Object} obj - 对象
 * @param {string} path - 路径（如 'nav.home'）
 * @returns {*} 值
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined
  
  const keys = path.split('.')
  let value = obj
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return undefined
    }
    value = value[key]
  }
  
  return value
}

/**
 * 主翻译函数
 * @param {string} key - 翻译键（如 'nav.home'）
 * @param {Object} params - 插值参数
 * @returns {string} 翻译后的文本
 */
export function t(key, params = {}) {
  // 获取当前语言包
  const message = getNestedValue(currentMessages.value, key)
  
  // 如果找不到翻译，返回键名
  if (message === undefined || message === null) {
    console.warn(`Translation not found: ${key}`)
    return key
  }
  
  // 如果不是字符串，直接返回
  if (typeof message !== 'string') {
    return message
  }
  
  // 处理变量插值
  return interpolate(message, params)
}

/**
 * 变量插值
 * @param {string} message - 消息模板
 * @param {Object} params - 参数对象
 * @returns {string} 插值后的消息
 */
export function interpolate(message, params = {}) {
  if (!message || typeof message !== 'string') {
    return message
  }
  
  // 处理 {name} 格式的插值
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    if (params.hasOwnProperty(key)) {
      return String(params[key])
    }
    return match
  })
}

/**
 * 复数处理
 * @param {string} key - 翻译键
 * @param {number} count - 数量
 * @param {Object} params - 额外参数
 * @returns {string} 翻译后的文本
 */
export function plural(key, count, params = {}) {
  // 获取当前语言
  const locale = currentLocale.value
  
  // 获取基础翻译
  const message = getNestedValue(currentMessages.value, key)
  
  if (message === undefined) {
    console.warn(`Translation not found: ${key}`)
    return key
  }
  
  // 如果消息是字符串，直接插值
  if (typeof message === 'string') {
    return interpolate(message, { ...params, n: count, count })
  }
  
  // 如果消息是对象（包含复数形式）
  if (typeof message === 'object') {
    const pluralForm = getPluralForm(locale, count)
    
    // 尝试获取对应复数形式
    let pluralMessage = message[pluralForm] || message.other || message.one
    
    if (!pluralMessage) {
      // 如果没有复数形式，返回第一个可用的
      const keys = Object.keys(message)
      pluralMessage = message[keys[0]]
    }
    
    return interpolate(pluralMessage, { ...params, n: count, count })
  }
  
  return String(message)
}

/**
 * 获取复数形式
 * @param {string} locale - 语言代码
 * @param {number} count - 数量
 * @returns {string} 复数形式键名
 */
function getPluralForm(locale, count) {
  // 中文没有复数形式
  if (locale.startsWith('zh')) {
    return 'other'
  }
  
  // 日文没有复数形式
  if (locale.startsWith('ja')) {
    return 'other'
  }
  
  // 英文复数规则
  if (locale.startsWith('en')) {
    return count === 1 ? 'one' : 'other'
  }
  
  // 默认
  return count === 1 ? 'one' : 'other'
}

/**
 * 获取语言包中的值（原始值，不进行插值）
 * @param {string} key - 键名
 * @returns {*} 值
 */
export function getRaw(key) {
  return getNestedValue(currentMessages.value, key)
}

/**
 * 检查翻译键是否存在
 * @param {string} key - 键名
 * @returns {boolean}
 */
export function has(key) {
  return getNestedValue(currentMessages.value, key) !== undefined
}

// ============================================
// 七、语言切换
// ============================================

/**
 * 切换语言
 * @param {string} locale - 目标语言代码
 * @returns {boolean} 是否切换成功
 */
export function setLocale(locale) {
  // 验证语言是否支持
  if (!LanguageDetector.isSupported(locale)) {
    console.warn(`Unsupported language: ${locale}`)
    return false
  }
  
  // 如果语言相同，不做任何操作
  if (currentLocale.value === locale) {
    return true
  }
  
  // 更新语言
  currentLocale.value = locale
  
  // 保存到存储
  LanguageStorage.save(locale)
  
  // 更新 HTML lang 属性（仅在浏览器环境）
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
  
  // 触发语言变更事件（仅在浏览器环境）
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('locale-change', {
      detail: { locale }
    }))
  }
  
  console.log(`Language changed to: ${locale}`)
  return true
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export function getLocale() {
  return currentLocale.value
}

/**
 * 获取当前语言信息
 * @returns {Object} 语言信息对象
 */
export function getLocaleInfo() {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLocale.value) ||
         SUPPORTED_LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)
}

/**
 * 切换到下一个语言
 * @returns {string} 新的语言代码
 */
export function cycleLanguage() {
  const currentIndex = SUPPORTED_LANGUAGES.findIndex(
    lang => lang.code === currentLocale.value
  )
  const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length
  const nextLang = SUPPORTED_LANGUAGES[nextIndex].code
  setLocale(nextLang)
  return nextLang
}

// ============================================
// 八、初始化
// ============================================

/**
 * 初始化国际化系统
 */
export function initI18n() {
  // 检测最佳语言
  const bestLocale = LanguageDetector.detectBestLanguage()
  
  // 设置语言
  currentLocale.value = bestLocale
  
  // 更新 HTML lang 属性（仅在浏览器环境）
  if (typeof document !== 'undefined') {
    document.documentElement.lang = bestLocale
  }
  
  // 监听语言变化
  watch(currentLocale, (newLocale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
    }
    LanguageStorage.save(newLocale)
  })
  
  console.log(`i18n initialized with locale: ${bestLocale}`)
}

// ============================================
// 九、组合式 API
// ============================================

/**
 * 使用国际化的组合式函数
 * @returns {Object} 国际化相关的方法和状态
 */
export function useI18n() {
  return {
    // 状态
    locale: currentLocale,
    messages: currentMessages,
    
    // 方法
    t,
    plural,
    interpolate,
    setLocale,
    getLocale,
    getLocaleInfo,
    cycleLanguage,
    getRaw,
    has,
    
    // 语言列表
    availableLocales: SUPPORTED_LANGUAGES
  }
}

// ============================================
// 十、日期和数字格式化
// ============================================

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, options = {}) {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  try {
    return new Intl.DateTimeFormat(currentLocale.value, {
      ...defaultOptions,
      ...options
    }).format(dateObj)
  } catch (e) {
    console.warn('Date formatting error:', e)
    return dateObj.toLocaleDateString()
  }
}

/**
 * 格式化时间
 * @param {Date|string|number} date - 日期
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date, options = {}) {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
  
  try {
    return new Intl.DateTimeFormat(currentLocale.value, {
      ...defaultOptions,
      ...options
    }).format(dateObj)
  } catch (e) {
    console.warn('Time formatting error:', e)
    return dateObj.toLocaleTimeString()
  }
}

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDateTime(date, options = {}) {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  try {
    return new Intl.DateTimeFormat(currentLocale.value, {
      ...defaultOptions,
      ...options
    }).format(dateObj)
  } catch (e) {
    console.warn('DateTime formatting error:', e)
    return dateObj.toLocaleString()
  }
}

/**
 * 格式化数字
 * @param {number} number - 数字
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(number, options = {}) {
  try {
    return new Intl.NumberFormat(currentLocale.value, options).format(number)
  } catch (e) {
    console.warn('Number formatting error:', e)
    return String(number)
  }
}

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {string} currency - 货币代码
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的货币字符串
 */
export function formatCurrency(amount, currency = 'CNY', options = {}) {
  const defaultOptions = {
    style: 'currency',
    currency
  }
  
  try {
    return new Intl.NumberFormat(currentLocale.value, {
      ...defaultOptions,
      ...options
    }).format(amount)
  } catch (e) {
    console.warn('Currency formatting error:', e)
    return `${currency} ${amount}`
  }
}

/**
 * 格式化百分比
 * @param {number} value - 值（0-1）
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的百分比字符串
 */
export function formatPercent(value, options = {}) {
  const defaultOptions = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }
  
  try {
    return new Intl.NumberFormat(currentLocale.value, {
      ...defaultOptions,
      ...options
    }).format(value)
  } catch (e) {
    console.warn('Percent formatting error:', e)
    return `${value * 100}%`
  }
}

/**
 * 格式化相对时间
 * @param {number} value - 数值
 * @param {string} unit - 单位（如 'day', 'hour', 'minute'）
 * @returns {string} 格式化后的相对时间字符串
 */
export function formatRelativeTime(value, unit) {
  try {
    const rtf = new Intl.RelativeTimeFormat(currentLocale.value, {
      numeric: 'auto'
    })
    return rtf.format(value, unit)
  } catch (e) {
    console.warn('Relative time formatting error:', e)
    return `${value} ${unit}`
  }
}

// ============================================
// 十一、导出默认对象
// ============================================

/**
 * 默认导出
 */
export default {
  // 状态
  currentLocale,
  currentMessages,
  
  // 翻译函数
  t,
  plural,
  interpolate,
  getRaw,
  has,
  
  // 语言管理
  setLocale,
  getLocale,
  getLocaleInfo,
  cycleLanguage,
  initI18n,
  
  // 语言检测
  LanguageDetector,
  
  // 语言存储
  LanguageStorage,
  
  // 格式化
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  
  // 组合式 API
  useI18n,
  
  // 常量
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
}

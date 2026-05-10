/**
 * 性能监控工具
 * 提供首屏加载、路由切换、API请求、内存使用等性能指标的监控
 */

import { ref, onMounted, onUnmounted } from 'vue'

// ============================================
// 性能指标类型定义
// ============================================

/**
 * 性能指标数据结构
 * @typedef {Object} PerformanceMetric
 * @property {string} name - 指标名称
 * @property {number} value - 指标值
 * @property {string} unit - 单位
 * @property {number} timestamp - 时间戳
 * @property {string} category - 分类
 */

/**
 * 性能报告数据结构
 * @typedef {Object} PerformanceReport
 * @property {Object} navigation - 导航性能
 * @property {Object} resources - 资源加载性能
 * @property {Object} rendering - 渲染性能
 * @property {Object} memory - 内存使用
 * @property {Object} custom - 自定义指标
 */

// ============================================
// 性能监控配置
// ============================================

const config = {
  // 是否启用监控
  enabled: true,
  // 是否在开发环境显示警告
  devWarnings: true,
  // 长任务阈值（毫秒）
  longTaskThreshold: 50,
  // 内存警告阈值（MB）
  memoryWarningThreshold: 100,
  // API请求慢阈值（毫秒）
  slowApiThreshold: 1000,
  // 是否上报性能数据
  reportEnabled: false,
  // 上报地址
  reportUrl: '',
  // 采样率（0-1）
  sampleRate: 1
}

// ============================================
// 性能指标存储
// ============================================

// 指标存储
const metrics = {
  // 首屏性能
  fcp: null,           // First Contentful Paint
  lcp: null,           // Largest Contentful Paint
  fid: null,           // First Input Delay
  cls: null,           // Cumulative Layout Shift
  ttfb: null,          // Time to First Byte

  // 路由性能
  routeChanges: [],
  currentRouteStart: null,

  // API性能
  apiRequests: [],

  // 长任务
  longTasks: [],

  // 内存使用
  memoryUsage: [],

  // 自定义指标
  customMetrics: {}
}

// ============================================
// 首屏性能监控
// ============================================

/**
 * 初始化首屏性能监控
 * 监控 FCP, LCP, FID, CLS, TTFB 等核心指标
 */
export function initPerformanceObserver() {
  if (!config.enabled || typeof PerformanceObserver === 'undefined') {
    return
  }

  // 监控绘制性能（FCP, LCP）
  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime
            logMetric('FCP (首次内容绘制)', entry.startTime, 'ms')
          }
        }
        if (entry.entryType === 'largest-contentful-paint') {
          metrics.lcp = entry.startTime
          logMetric('LCP (最大内容绘制)', entry.startTime, 'ms')

          // LCP 性能警告
          if (config.devWarnings && entry.startTime > 2500) {
            console.warn(`[性能警告] LCP 过慢: ${entry.startTime.toFixed(2)}ms (建议 < 2500ms)`)
          }
        }
      }
    })
    paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
  } catch (e) {
    // 浏览器不支持
  }

  // 监控首次输入延迟（FID）
  try {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'first-input') {
          metrics.fid = entry.processingStart - entry.startTime
          logMetric('FID (首次输入延迟)', metrics.fid, 'ms')

          // FID 性能警告
          if (config.devWarnings && metrics.fid > 100) {
            console.warn(`[性能警告] FID 过高: ${metrics.fid.toFixed(2)}ms (建议 < 100ms)`)
          }
        }
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
  } catch (e) {
    // 浏览器不支持
  }

  // 监控布局偏移（CLS）
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          metrics.cls = clsValue
        }
      }
    })
    clsObserver.observe({ entryTypes: 'layout-shift' })

    // 页面卸载时记录最终 CLS
    window.addEventListener('pagehide', () => {
      logMetric('CLS (累积布局偏移)', clsValue, '')
      if (config.devWarnings && clsValue > 0.1) {
        console.warn(`[性能警告] CLS 过高: ${clsValue.toFixed(4)} (建议 < 0.1)`)
      }
    })
  } catch (e) {
    // 浏览器不支持
  }

  // 监控长任务
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const task = {
          name: entry.name,
          startTime: entry.startTime,
          duration: entry.duration,
          timestamp: Date.now()
        }
        metrics.longTasks.push(task)

        if (config.devWarnings && entry.duration > config.longTaskThreshold) {
          console.warn(`[性能警告] 检测到长任务: ${entry.duration.toFixed(2)}ms`, entry)
        }
      }
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })
  } catch (e) {
    // 浏览器不支持
  }

  // 获取 TTFB
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0]
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      logMetric('TTFB (首字节时间)', metrics.ttfb, 'ms')

      if (config.devWarnings && metrics.ttfb > 600) {
        console.warn(`[性能警告] TTFB 过慢: ${metrics.ttfb.toFixed(2)}ms (建议 < 600ms)`)
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

/**
 * 获取首屏性能指标
 * @returns {Object} 首屏性能数据
 */
export function getInitialPerformance() {
  return {
    fcp: metrics.fcp,
    lcp: metrics.lcp,
    fid: metrics.fid,
    cls: metrics.cls,
    ttfb: metrics.ttfb,
    // 性能评分
    score: calculatePerformanceScore()
  }
}

/**
 * 计算性能评分
 * @returns {Object} 性能评分
 */
function calculatePerformanceScore() {
  let score = 100
  const issues = []

  // LCP 评分
  if (metrics.lcp) {
    if (metrics.lcp > 4000) {
      score -= 30
      issues.push('LCP 过慢 (>4s)')
    } else if (metrics.lcp > 2500) {
      score -= 15
      issues.push('LCP 较慢 (>2.5s)')
    }
  }

  // FID 评分
  if (metrics.fid) {
    if (metrics.fid > 300) {
      score -= 25
      issues.push('FID 过高 (>300ms)')
    } else if (metrics.fid > 100) {
      score -= 10
      issues.push('FID 较高 (>100ms)')
    }
  }

  // CLS 评分
  if (metrics.cls) {
    if (metrics.cls > 0.25) {
      score -= 25
      issues.push('CLS 过高 (>0.25)')
    } else if (metrics.cls > 0.1) {
      score -= 10
      issues.push('CLS 较高 (>0.1)')
    }
  }

  // TTFB 评分
  if (metrics.ttfb) {
    if (metrics.ttfb > 1000) {
      score -= 15
      issues.push('TTFB 过慢 (>1s)')
    }
  }

  return {
    score: Math.max(0, score),
    grade: score >= 90 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D',
    issues
  }
}

// ============================================
// 路由切换性能监控
// ============================================

/**
 * 开始路由切换计时
 * @param {string} to - 目标路由
 * @param {string} from - 来源路由
 */
export function startRouteChange(to, from) {
  metrics.currentRouteStart = {
    to,
    from,
    startTime: performance.now(),
    timestamp: Date.now()
  }
}

/**
 * 结束路由切换计时
 * @param {string} to - 目标路由
 */
export function endRouteChange(to) {
  if (!metrics.currentRouteStart || metrics.currentRouteStart.to !== to) {
    return
  }

  const duration = performance.now() - metrics.currentRouteStart.startTime
  const routeMetric = {
    to,
    from: metrics.currentRouteStart.from,
    duration,
    timestamp: metrics.currentRouteStart.timestamp
  }

  metrics.routeChanges.push(routeMetric)

  // 只保留最近50条记录
  if (metrics.routeChanges.length > 50) {
    metrics.routeChanges.shift()
  }

  logMetric(`路由切换 [${to}]`, duration, 'ms')

  // 路由切换性能警告
  if (config.devWarnings && duration > 500) {
    console.warn(`[性能警告] 路由切换过慢: ${to} (${duration.toFixed(2)}ms)`)
  }

  metrics.currentRouteStart = null
}

/**
 * 获取路由切换性能数据
 * @returns {Object} 路由性能数据
 */
export function getRoutePerformance() {
  const changes = metrics.routeChanges
  if (changes.length === 0) {
    return { average: 0, max: 0, min: 0, count: 0 }
  }

  const durations = changes.map(c => c.duration)
  return {
    average: durations.reduce((a, b) => a + b, 0) / durations.length,
    max: Math.max(...durations),
    min: Math.min(...durations),
    count: changes.length,
    recent: changes.slice(-10)
  }
}

// ============================================
// API请求性能监控
// ============================================

/**
 * 开始API请求计时
 * @param {string} url - 请求URL
 * @param {string} method - 请求方法
 * @returns {string} 请求ID
 */
export function startApiRequest(url, method = 'GET') {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  if (!metrics.apiRequests.find(r => r.id === id)) {
    metrics.apiRequests.push({
      id,
      url,
      method,
      startTime: performance.now(),
      timestamp: Date.now(),
      status: 'pending'
    })
  }

  return id
}

/**
 * 结束API请求计时
 * @param {string} id - 请求ID
 * @param {number} status - HTTP状态码
 * @param {boolean} success - 是否成功
 */
export function endApiRequest(id, status = 200, success = true) {
  const request = metrics.apiRequests.find(r => r.id === id)
  if (!request) return

  request.duration = performance.now() - request.startTime
  request.status = status
  request.success = success
  request.endTime = Date.now()

  logMetric(`API请求 [${request.method} ${request.url}]`, request.duration, 'ms')

  // API请求性能警告
  if (config.devWarnings && request.duration > config.slowApiThreshold) {
    console.warn(`[性能警告] API请求过慢: ${request.method} ${request.url} (${request.duration.toFixed(2)}ms)`)
  }

  // 只保留最近100条记录
  if (metrics.apiRequests.length > 100) {
    metrics.apiRequests.shift()
  }
}

/**
 * 获取API请求性能数据
 * @returns {Object} API性能数据
 */
export function getApiPerformance() {
  const completed = metrics.apiRequests.filter(r => r.duration !== undefined)
  if (completed.length === 0) {
    return { average: 0, max: 0, min: 0, count: 0, slowCount: 0 }
  }

  const durations = completed.map(r => r.duration)
  const slowRequests = completed.filter(r => r.duration > config.slowApiThreshold)

  return {
    average: durations.reduce((a, b) => a + b, 0) / durations.length,
    max: Math.max(...durations),
    min: Math.min(...durations),
    count: completed.length,
    slowCount: slowRequests.length,
    slowRequests: slowRequests.slice(-10),
    recent: completed.slice(-20)
  }
}

// ============================================
// 内存使用监控
// ============================================

/**
 * 获取内存使用情况
 * @returns {Object|null} 内存使用数据
 */
export function getMemoryUsage() {
  if (!performance.memory) {
    return null
  }

  const memory = performance.memory
  const usage = {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
    totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
    limitMB: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
    usagePercent: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2),
    timestamp: Date.now()
  }

  metrics.memoryUsage.push(usage)

  // 只保留最近50条记录
  if (metrics.memoryUsage.length > 50) {
    metrics.memoryUsage.shift()
  }

  // 内存使用警告
  if (config.devWarnings && usage.usedMB > config.memoryWarningThreshold) {
    console.warn(`[性能警告] 内存使用过高: ${usage.usedMB}MB`)
  }

  return usage
}

/**
 * 开始内存监控
 * @param {number} interval - 监控间隔（毫秒）
 * @returns {number} 定时器ID
 */
export function startMemoryMonitor(interval = 10000) {
  if (!performance.memory) {
    console.warn('[性能监控] 浏览器不支持内存监控')
    return null
  }

  return setInterval(() => {
    getMemoryUsage()
  }, interval)
}

/**
 * 停止内存监控
 * @param {number} timerId - 定时器ID
 */
export function stopMemoryMonitor(timerId) {
  if (timerId) {
    clearInterval(timerId)
  }
}

// ============================================
// 长任务检测
// ============================================

/**
 * 获取长任务列表
 * @param {number} limit - 限制数量
 * @returns {Array} 长任务列表
 */
export function getLongTasks(limit = 20) {
  return metrics.longTasks.slice(-limit)
}

/**
 * 获取长任务统计
 * @returns {Object} 长任务统计
 */
export function getLongTasksStats() {
  const tasks = metrics.longTasks
  if (tasks.length === 0) {
    return { count: 0, averageDuration: 0, maxDuration: 0 }
  }

  const durations = tasks.map(t => t.duration)
  return {
    count: tasks.length,
    averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
    maxDuration: Math.max(...durations),
    recent: tasks.slice(-10)
  }
}

// ============================================
// 自定义性能指标
// ============================================

/**
 * 记录自定义性能指标
 * @param {string} name - 指标名称
 * @param {number} value - 指标值
 * @param {string} unit - 单位
 * @param {string} category - 分类
 */
export function recordMetric(name, value, unit = 'ms', category = 'custom') {
  if (!metrics.customMetrics[category]) {
    metrics.customMetrics[category] = []
  }

  metrics.customMetrics[category].push({
    name,
    value,
    unit,
    category,
    timestamp: Date.now()
  })

  logMetric(name, value, unit)
}

/**
 * 开始计时
 * @param {string} name - 计时器名称
 * @returns {Function} 结束计时函数
 */
export function startTiming(name) {
  const startTime = performance.now()

  return () => {
    const duration = performance.now() - startTime
    recordMetric(name, duration)
    return duration
  }
}

/**
 * 获取自定义指标
 * @param {string} category - 分类（可选）
 * @returns {Object|Array} 自定义指标
 */
export function getCustomMetrics(category) {
  if (category) {
    return metrics.customMetrics[category] || []
  }
  return metrics.customMetrics
}

// ============================================
// 性能报告生成
// ============================================

/**
 * 生成性能报告
 * @returns {PerformanceReport} 性能报告
 */
export function generatePerformanceReport() {
  const report = {
    // 基础信息
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,

    // 首屏性能
    initial: getInitialPerformance(),

    // 路由性能
    route: getRoutePerformance(),

    // API性能
    api: getApiPerformance(),

    // 内存使用
    memory: getMemoryUsage(),

    // 长任务
    longTasks: getLongTasksStats(),

    // 自定义指标
    custom: metrics.customMetrics,

    // 资源加载性能
    resources: getResourcePerformance()
  }

  return report
}

/**
 * 获取资源加载性能
 * @returns {Object} 资源性能数据
 */
export function getResourcePerformance() {
  const resources = performance.getEntriesByType('resource')
  const result = {
    total: resources.length,
    byType: {},
    slowResources: []
  }

  resources.forEach(resource => {
    const type = getResourceType(resource.initiatorType)
    if (!result.byType[type]) {
      result.byType[type] = {
        count: 0,
        totalSize: 0,
        totalDuration: 0
      }
    }

    result.byType[type].count++
    result.byType[type].totalDuration += resource.duration

    // 慢资源
    if (resource.duration > 1000) {
      result.slowResources.push({
        name: resource.name,
        type,
        duration: resource.duration,
        size: resource.transferSize
      })
    }
  })

  return result
}

/**
 * 获取资源类型
 * @param {string} initiatorType - 初始化类型
 * @returns {string} 资源类型
 */
function getResourceType(initiatorType) {
  const typeMap = {
    script: 'js',
    link: 'css',
    img: 'image',
    css: 'css',
    xmlhttprequest: 'xhr',
    fetch: 'fetch',
    other: 'other'
  }
  return typeMap[initiatorType] || initiatorType
}

// ============================================
// 性能数据上报
// ============================================

/**
 * 上报性能数据
 * @param {Object} data - 性能数据
 */
export async function reportPerformance(data) {
  if (!config.reportEnabled || !config.reportUrl) {
    return
  }

  // 采样率检查
  if (Math.random() > config.sampleRate) {
    return
  }

  try {
    // 使用 sendBeacon 确保数据发送
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      navigator.sendBeacon(config.reportUrl, blob)
    } else {
      // 降级使用 fetch
      await fetch(config.reportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      })
    }
  } catch (e) {
    console.error('[性能监控] 上报失败:', e)
  }
}

// ============================================
// 日志输出
// ============================================

/**
 * 输出性能指标日志
 * @param {string} name - 指标名称
 * @param {number} value - 指标值
 * @param {string} unit - 单位
 */
function logMetric(name, value, unit) {
  if (import.meta.env.DEV) {
    console.log(`[性能监控] ${name}: ${typeof value === 'number' ? value.toFixed(2) : value}${unit}`)
  }
}

// ============================================
// Vue 组合式函数
// ============================================

/**
 * 性能监控组合式函数
 * @param {Object} options - 配置选项
 * @returns {Object} 性能监控方法和状态
 */
export function usePerformance(options = {}) {
  // 合并配置
  Object.assign(config, options)

  // 响应式状态
  const initialMetrics = ref(null)
  const routeMetrics = ref(null)
  const apiMetrics = ref(null)
  const memoryMetrics = ref(null)
  const isMonitoring = ref(false)

  // 内存监控定时器
  let memoryTimer = null

  /**
   * 开始监控
   */
  const startMonitoring = () => {
    if (isMonitoring.value) return

    isMonitoring.value = true
    initPerformanceObserver()
    memoryTimer = startMemoryMonitor()

    // 初始获取指标
    setTimeout(() => {
      initialMetrics.value = getInitialPerformance()
    }, 1000)
  }

  /**
   * 停止监控
   */
  const stopMonitoring = () => {
    isMonitoring.value = false
    stopMemoryMonitor(memoryTimer)
  }

  /**
   * 刷新指标
   */
  const refreshMetrics = () => {
    initialMetrics.value = getInitialPerformance()
    routeMetrics.value = getRoutePerformance()
    apiMetrics.value = getApiPerformance()
    memoryMetrics.value = getMemoryUsage()
  }

  /**
   * 生成并上报报告
   */
  const report = async () => {
    const reportData = generatePerformanceReport()
    await reportPerformance(reportData)
    return reportData
  }

  // 组件挂载时自动开始监控
  onMounted(() => {
    if (config.enabled) {
      startMonitoring()
    }
  })

  // 组件卸载时停止监控
  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    // 状态
    initialMetrics,
    routeMetrics,
    apiMetrics,
    memoryMetrics,
    isMonitoring,

    // 方法
    startMonitoring,
    stopMonitoring,
    refreshMetrics,
    report,

    // 直接访问方法
    startRouteChange,
    endRouteChange,
    startApiRequest,
    endApiRequest,
    recordMetric,
    startTiming,
    getMemoryUsage,
    generatePerformanceReport
  }
}

// ============================================
// 配置方法
// ============================================

/**
 * 设置性能监控配置
 * @param {Object} options - 配置选项
 */
export function setPerformanceConfig(options) {
  Object.assign(config, options)
}

/**
 * 获取当前配置
 * @returns {Object} 当前配置
 */
export function getPerformanceConfig() {
  return { ...config }
}

// ============================================
// 初始化
// ============================================

/**
 * 初始化性能监控
 * @param {Object} options - 配置选项
 */
export function initPerformanceMonitoring(options = {}) {
  setPerformanceConfig(options)

  if (config.enabled) {
    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
      initPerformanceObserver()
    } else {
      window.addEventListener('load', initPerformanceObserver)
    }

    // 页面卸载时上报
    window.addEventListener('pagehide', () => {
      if (config.reportEnabled) {
        reportPerformance(generatePerformanceReport())
      }
    })
  }
}

// ============================================
// 默认导出
// ============================================

export default {
  // 初始化
  initPerformanceMonitoring,
  setPerformanceConfig,
  getPerformanceConfig,

  // 首屏性能
  initPerformanceObserver,
  getInitialPerformance,

  // 路由性能
  startRouteChange,
  endRouteChange,
  getRoutePerformance,

  // API性能
  startApiRequest,
  endApiRequest,
  getApiPerformance,

  // 内存监控
  getMemoryUsage,
  startMemoryMonitor,
  stopMemoryMonitor,

  // 长任务
  getLongTasks,
  getLongTasksStats,

  // 自定义指标
  recordMetric,
  startTiming,
  getCustomMetrics,

  // 报告
  generatePerformanceReport,
  getResourcePerformance,
  reportPerformance,

  // 组合式函数
  usePerformance
}

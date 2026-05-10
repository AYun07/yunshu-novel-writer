/**
 * 云书 - 平台检测与适配 Hook
 * 
 * 功能：
 * - 设备类型检测（手机/平板/桌面）
 * - 操作系统检测
 * - 浏览器检测
 * - Termux环境检测
 * - 响应式断点
 * - 触摸设备检测
 * - 安全区域适配
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * 设备断点配置
 */
const BREAKPOINTS = {
  xs: 0,      // 小手机
  sm: 576,    // 大手机
  md: 768,    // 平板竖屏
  lg: 1024,   // 平板横屏/小笔记本
  xl: 1280,   // 桌面
  '2xl': 1536 // 大屏幕
}

/**
 * 检测设备类型
 */
function detectDeviceType() {
  if (typeof window === 'undefined') {
    return { type: 'desktop', isMobile: false, isTablet: false, isDesktop: true }
  }
  
  const width = window.innerWidth
  const ua = navigator.userAgent.toLowerCase()
  
  // 检测移动设备
  const isMobileUA = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
  const isTabletUA = /tablet|ipad|playbook|silk/i.test(ua)
  
  // 基于宽度判断
  const isMobileWidth = width < BREAKPOINTS.md
  const isTabletWidth = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg
  
  // 综合判断
  let type = 'desktop'
  let isMobile = false
  let isTablet = false
  let isDesktop = true
  
  if (isMobileUA || (isMobileWidth && !isTabletUA)) {
    type = 'mobile'
    isMobile = true
    isDesktop = false
  } else if (isTabletUA || isTabletWidth) {
    type = 'tablet'
    isTablet = true
    isDesktop = false
  }
  
  return { type, isMobile, isTablet, isDesktop }
}

/**
 * 检测操作系统
 */
function detectOS() {
  if (typeof navigator === 'undefined') {
    return { name: 'unknown', version: '' }
  }
  
  const ua = navigator.userAgent
  
  // iOS
  if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS (\d+)_?(\d+)?_?(\d+)?/)
    return {
      name: 'ios',
      version: match ? `${match[1]}.${match[2] || 0}.${match[3] || 0}` : '',
      isIOS: true
    }
  }
  
  // Android
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android (\d+).?(\d+)?.?(\d+)?/)
    return {
      name: 'android',
      version: match ? `${match[1]}.${match[2] || 0}.${match[3] || 0}` : '',
      isAndroid: true
    }
  }
  
  // Windows
  if (/Windows/i.test(ua)) {
    const match = ua.match(/Windows NT (\d+).?(\d+)?/)
    return {
      name: 'windows',
      version: match ? `${match[1]}.${match[2] || 0}` : '',
      isWindows: true
    }
  }
  
  // macOS
  if (/Mac/i.test(ua)) {
    const match = ua.match(/Mac OS X (\d+)_?(\d+)?_?(\d+)?/)
    return {
      name: 'macos',
      version: match ? `${match[1]}.${match[2] || 0}.${match[3] || 0}` : '',
      isMacOS: true
    }
  }
  
  // Linux
  if (/Linux/i.test(ua)) {
    return {
      name: 'linux',
      version: '',
      isLinux: true
    }
  }
  
  return { name: 'unknown', version: '' }
}

/**
 * 检测浏览器
 */
function detectBrowser() {
  if (typeof navigator === 'undefined') {
    return { name: 'unknown', version: '' }
  }
  
  const ua = navigator.userAgent
  
  // Edge
  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/(\d+).?(\d+)?/)
    return {
      name: 'edge',
      version: match ? `${match[1]}.${match[2] || 0}` : '',
      isEdge: true
    }
  }
  
  // Chrome
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    const match = ua.match(/Chrome\/(\d+).?(\d+)?/)
    return {
      name: 'chrome',
      version: match ? `${match[1]}.${match[2] || 0}` : '',
      isChrome: true
    }
  }
  
  // Safari
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    const match = ua.match(/Version\/(\d+).?(\d+)?/)
    return {
      name: 'safari',
      version: match ? `${match[1]}.${match[2] || 0}` : '',
      isSafari: true
    }
  }
  
  // Firefox
  if (ua.includes('Firefox/')) {
    const match = ua.match(/Firefox\/(\d+).?(\d+)?/)
    return {
      name: 'firefox',
      version: match ? `${match[1]}.${match[2] || 0}` : '',
      isFirefox: true
    }
  }
  
  return { name: 'unknown', version: '' }
}

/**
 * 检测Termux环境
 */
function detectTermux() {
  if (typeof navigator === 'undefined') return false
  
  const ua = navigator.userAgent.toLowerCase()
  
  // 检查 User Agent
  if (ua.includes('termux')) return true
  
  // 检查 Termux 特有的全局对象
  if (typeof window !== 'undefined') {
    if (window.Termux) return true
    if (window.termux) return true
  }
  
  // 检查 Android WebView 特征
  if (ua.includes('wv') && ua.includes('android')) {
    return true
  }
  
  return false
}

/**
 * 检测触摸设备
 */
function detectTouch() {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * 检测 Capacitor 原生环境
 */
function detectNative() {
  if (typeof window === 'undefined') return false
  
  return window.Capacitor?.isNativePlatform?.() || false
}

/**
 * 获取当前断点
 */
function getCurrentBreakpoint(width) {
  if (width >= BREAKPOINTS['2xl']) return '2xl'
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * 平台检测 Hook
 */
export function usePlatform() {
  // ==================== 响应式状态 ====================
  
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)
  const orientation = ref(typeof window !== 'undefined' ? (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait') : 'portrait')
  
  // ==================== 设备检测 ====================
  
  const deviceType = computed(() => detectDeviceType())
  const os = computed(() => detectOS())
  const browser = computed(() => detectBrowser())
  const isTermux = computed(() => detectTermux())
  const hasTouch = computed(() => detectTouch())
  const isNative = computed(() => detectNative())
  
  // ==================== 断点 ====================
  
  const breakpoint = computed(() => getCurrentBreakpoint(windowWidth.value))
  
  const isXs = computed(() => windowWidth.value < BREAKPOINTS.sm)
  const isSm = computed(() => windowWidth.value >= BREAKPOINTS.sm && windowWidth.value < BREAKPOINTS.md)
  const isMd = computed(() => windowWidth.value >= BREAKPOINTS.md && windowWidth.value < BREAKPOINTS.lg)
  const isLg = computed(() => windowWidth.value >= BREAKPOINTS.lg && windowWidth.value < BREAKPOINTS.xl)
  const isXl = computed(() => windowWidth.value >= BREAKPOINTS.xl && windowWidth.value < BREAKPOINTS['2xl'])
  const is2xl = computed(() => windowWidth.value >= BREAKPOINTS['2xl'])
  
  // ==================== 便捷属性 ====================
  
  const isMobile = computed(() => deviceType.value.isMobile)
  const isTablet = computed(() => deviceType.value.isTablet)
  const isDesktop = computed(() => deviceType.value.isDesktop)
  const isIOS = computed(() => os.value.isIOS)
  const isAndroid = computed(() => os.value.isAndroid)
  const isLandscape = computed(() => orientation.value === 'landscape')
  const isPortrait = computed(() => orientation.value === 'portrait')
  
  // ==================== 安全区域 ====================
  
  const safeAreaTop = ref(0)
  const safeAreaBottom = ref(0)
  const safeAreaLeft = ref(0)
  const safeAreaRight = ref(0)
  
  // ==================== 网络状态 ====================
  
  const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
  
  // ==================== 方法 ====================
  
  /**
   * 更新窗口尺寸
   */
  function updateDimensions() {
    if (typeof window === 'undefined') return
    
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
    orientation.value = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  }
  
  /**
   * 更新安全区域
   */
  function updateSafeArea() {
    if (typeof document === 'undefined') return
    
    const computedStyle = getComputedStyle(document.documentElement)
    
    safeAreaTop.value = parseInt(computedStyle.getPropertyValue('--safe-area-top') || '0')
    safeAreaBottom.value = parseInt(computedStyle.getPropertyValue('--safe-area-bottom') || '0')
    safeAreaLeft.value = parseInt(computedStyle.getPropertyValue('--safe-area-left') || '0')
    safeAreaRight.value = parseInt(computedStyle.getPropertyValue('--safe-area-right') || '0')
  }
  
  /**
   * 处理网络状态变化
   */
  function handleOnline() {
    isOnline.value = true
  }
  
  function handleOffline() {
    isOnline.value = false
  }
  
  // ==================== 生命周期 ====================
  
  onMounted(() => {
    updateDimensions()
    updateSafeArea()
    
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
    window.removeEventListener('orientationchange', updateDimensions)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })
  
  // ==================== 返回 ====================
  
  return {
    // 窗口尺寸
    windowWidth,
    windowHeight,
    orientation,
    
    // 设备类型
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    
    // 操作系统
    os,
    isIOS,
    isAndroid,
    
    // 浏览器
    browser,
    
    // 特殊环境
    isTermux,
    isNative,
    hasTouch,
    
    // 断点
    breakpoint,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    
    // 方向
    isLandscape,
    isPortrait,
    
    // 安全区域
    safeAreaTop,
    safeAreaBottom,
    safeAreaLeft,
    safeAreaRight,
    
    // 网络状态
    isOnline,
    
    // 方法
    updateDimensions,
    updateSafeArea,
  }
}

/**
 * 响应式断点 Hook
 */
export function useBreakpoint() {
  const { breakpoint, isXs, isSm, isMd, isLg, isXl, is2xl } = usePlatform()
  
  return {
    breakpoint,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    
    // 便捷方法
    isMobile: computed(() => isXs.value || isSm.value),
    isTablet: computed(() => isMd.value),
    isDesktop: computed(() => isLg.value || isXl.value || is2xl.value),
  }
}

/**
 * 设备方向 Hook
 */
export function useOrientation() {
  const { orientation, isLandscape, isPortrait } = usePlatform()
  
  return {
    orientation,
    isLandscape,
    isPortrait,
  }
}

/**
 * 安全区域 Hook
 */
export function useSafeArea() {
  const { safeAreaTop, safeAreaBottom, safeAreaLeft, safeAreaRight } = usePlatform()
  
  return {
    top: safeAreaTop,
    bottom: safeAreaBottom,
    left: safeAreaLeft,
    right: safeAreaRight,
    
    // CSS 样式对象
    style: computed(() => ({
      paddingTop: `${safeAreaTop.value}px`,
      paddingBottom: `${safeAreaBottom.value}px`,
      paddingLeft: `${safeAreaLeft.value}px`,
      paddingRight: `${safeAreaRight.value}px`,
    })),
  }
}

/**
 * 触摸设备 Hook
 */
export function useTouch() {
  const { hasTouch } = usePlatform()
  
  return {
    hasTouch,
    
    // 触摸事件处理
    onTouchStart: (callback) => {
      if (hasTouch.value) {
        document.addEventListener('touchstart', callback)
      }
    },
    
    onTouchEnd: (callback) => {
      if (hasTouch.value) {
        document.addEventListener('touchend', callback)
      }
    },
  }
}

export default usePlatform

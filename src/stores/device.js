/**
 * 设备状态存储
 * 管理设备类型、屏幕尺寸等信息
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDeviceStore = defineStore('device', () => {
  // ==================== 状态 ====================

  /**
   * 是否为移动设备
   */
  const isMobile = ref(false)

  /**
   * 是否为平板设备
   */
  const isTablet = ref(false)

  /**
   * 是否为桌面设备
   */
  const isDesktop = ref(true)

  /**
   * 屏幕宽度
   */
  const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

  /**
   * 屏幕高度
   */
  const screenHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)

  // ==================== 计算属性 ====================

  /**
   * 当前平台类型
   */
  const platform = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  /**
   * 是否为小屏幕（小于768px）
   */
  const isSmallScreen = computed(() => screenWidth.value < 768)

  /**
   * 是否为中屏幕（768px - 1024px）
   */
  const isMediumScreen = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024)

  /**
   * 是否为大屏幕（大于1024px）
   */
  const isLargeScreen = computed(() => screenWidth.value >= 1024)

  // ==================== 方法 ====================

  /**
   * 更新设备信息
   * @param {object} deviceInfo - 设备信息
   */
  const updateDeviceInfo = (deviceInfo) => {
    isMobile.value = deviceInfo.isMobile ?? isMobile.value
    isTablet.value = deviceInfo.isTablet ?? isTablet.value
    isDesktop.value = deviceInfo.isDesktop ?? isDesktop.value
    screenWidth.value = deviceInfo.width ?? screenWidth.value
    screenHeight.value = deviceInfo.height ?? screenHeight.value
  }

  /**
   * 检测设备类型
   */
  const detectDevice = () => {
    // 安全检查：确保在浏览器环境中
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      return
    }
    
    const userAgent = navigator.userAgent.toLowerCase()
    const width = window.innerWidth

    // 检测是否为移动设备
    const mobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)

    // 根据屏幕宽度判断
    const mobileWidth = width < 768

    // 检测是否为平板
    const tablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (width >= 768 && width < 1024)

    updateDeviceInfo({
      isMobile: mobileDevice || mobileWidth,
      isTablet: tablet,
      isDesktop: !mobileDevice && !mobileWidth,
      width,
      height: window.innerHeight
    })
  }

  return {
    // 状态
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,

    // 计算属性
    platform,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,

    // 方法
    updateDeviceInfo,
    detectDevice
  }
})

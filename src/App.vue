<template>
  <!-- 全局错误边界 -->
  <ErrorBoundary>
    <!-- 根据平台类型渲染对应布局 -->
    <template v-if="isMobile">
      <MobileLayout />
    </template>
    <template v-else>
      <DesktopLayout />
    </template>

    <!-- 全局同步状态提示 -->
    <SyncToast />

    <!-- 离线提示 -->
    <OfflineBanner v-if="isOffline" />
  </ErrorBoundary>
</template>

<script setup>
/**
 * 云书 - 应用入口组件
 * 负责平台检测、布局切换、全局错误边界
 * 支持桌面端和移动端自适应
 */

import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import DesktopLayout from './layouts/DesktopLayout.vue'
import MobileLayout from './layouts/MobileLayout.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import SyncToast from './components/SyncToast.vue'
import OfflineBanner from './components/OfflineBanner.vue'
import { useDeviceStore } from './stores/device.js'
import { useOfflineStatus } from './composables/useSync.js'
import { useUpdate } from './services/updateService.js'

// ==================== 路由和状态 ====================
const route = useRoute()
const deviceStore = useDeviceStore()
const { isOffline } = useOfflineStatus()
const { checkUpdate } = useUpdate()

// ==================== 响应式数据 ====================
const windowWidth = ref(1024) // 默认值，在onMounted中更新
const isMobileDevice = ref(false)

// ==================== 计算属性 ====================

/**
 * 是否为移动端
 * 根据设备类型和屏幕宽度综合判断
 */
const isMobile = computed(() => {
  // 如果当前路由是移动端路由，强制使用移动端布局
  if (route.path.startsWith('/m/') || route.path === '/m') {
    return true
  }

  // 优先检测 Capacitor 原生环境
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    return true
  }

  // 根据设备存储状态判断
  return deviceStore.isMobile
})

/**
 * 是否为桌面端
 */
const isDesktop = computed(() => {
  return !isMobile.value
})

/**
 * 当前平台类型
 */
const platform = computed(() => {
  return isMobile.value ? 'mobile' : 'desktop'
})

// ==================== 方法 ====================

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
  isMobileDevice.value = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)

  // 根据屏幕宽度判断
  const isMobileWidth = width < 768

  // 检测是否为平板
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (width >= 768 && width < 1024)

  // 更新设备存储
  deviceStore.updateDeviceInfo({
    isMobile: isMobileDevice.value || isMobileWidth,
    isTablet,
    isDesktop: !isMobileDevice.value && !isMobileWidth,
    width
  })

  // 更新窗口宽度
  windowWidth.value = width
}

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  detectDevice()
}

/**
 * 处理全局错误
 */
const handleError = (error) => {
  console.error('[App] 全局错误:', error)
}

// ==================== 提供全局注入 ====================

/**
 * 提供平台信息给子组件
 */
provide('platform', platform)
provide('isMobile', isMobile)
provide('isDesktop', isDesktop)
provide('windowWidth', windowWidth)

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始设备检测
  detectDevice()

  // 监听窗口大小变化（安全检查）
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
  }

  // 初始化同步服务
  initSyncService()

  // 延迟5秒后检查更新（避免影响应用启动速度）
  setTimeout(() => {
    console.log('[App] 开始检查应用更新...')
    checkUpdate()
  }, 5000)
})

onUnmounted(() => {
  // 移除事件监听（安全检查）
  if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('orientationchange', handleResize)
  }
})

/**
 * 初始化同步服务
 */
const initSyncService = async () => {
  try {
    const { syncService } = await import('./services/syncService.js')
    await syncService.initialize()
    console.log('[App] 同步服务已初始化')
  } catch (error) {
    console.error('[App] 同步服务初始化失败:', error)
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #303133;
  background: #f5f7fa;
  line-height: 1.6;
  overflow-x: hidden;
}

/* 移动端适配 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 平板适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  html {
    font-size: 15px;
  }
}

/* 安全区域适配（iPhone X+） */
@supports (padding-top: env(safe-area-inset-top)) {
  .safe-area-top {
    padding-top: env(safe-area-inset-top);
  }

  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 移动端隐藏滚动条 */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    display: none;
  }
}

/* 选中文字样式 */
::selection {
  background: rgba(102, 126, 234, 0.2);
  color: #303133;
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-spin {
  animation: spin 1s linear infinite;
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

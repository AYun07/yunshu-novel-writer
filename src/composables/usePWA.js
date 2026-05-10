/**
 * 云书 - PWA 功能组合式函数
 *
 * 功能说明：
 * - 检测PWA安装状态
 * - 触发安装提示
 * - 监听离线/在线状态
 * - 后台同步任务管理
 * - 推送通知权限和订阅
 * - Service Worker 更新检测
 * - 缓存管理
 *
 * 使用示例：
 * const { isInstallable, installPWA, isOnline, subscribePush } = usePWA()
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// ============================================
// 状态定义
// ============================================

/** 是否可安装 */
const isInstallable = ref(false)

/** 是否已安装 */
const isInstalled = ref(false)

/** 是否在线 */
const isOnline = ref(navigator.onLine)

/** 是否需要更新 */
const needUpdate = ref(false)

/** Service Worker 注册 */
let swRegistration = null

/** 安装提示事件 */
let deferredPrompt = null

/** 新版本的 Service Worker */
let newWorker = null

// ============================================
// 计算属性
// ============================================

/**
 * 是否是 PWA 模式运行
 */
const isStandalone = computed(() => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
})

/**
 * 是否支持 PWA
 */
const isPWASupported = computed(() => {
  return 'serviceWorker' in navigator && 'PushManager' in window
})

// ============================================
// Service Worker 管理
// ============================================

/**
 * 注册 Service Worker
 */
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] 浏览器不支持 Service Worker')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'imports'
    })

    console.log('[PWA] Service Worker 注册成功:', registration.scope)
    swRegistration = registration

    // 监听 Service Worker 更新
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing

      if (installingWorker) {
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 有新版本可用
              console.log('[PWA] 检测到新版本')
              newWorker = installingWorker
              needUpdate.value = true

              // 显示更新提示
              showUpdateNotification()
            } else {
              // 首次安装
              console.log('[PWA] Service Worker 首次安装完成')
            }
          }
        })
      }
    })

    // 监听消息
    navigator.serviceWorker.addEventListener('message', handleSWMessage)

    return registration
  } catch (error) {
    console.error('[PWA] Service Worker 注册失败:', error)
    return null
  }
}

/**
 * 处理 Service Worker 消息
 * @param {MessageEvent} event - 消息事件
 */
function handleSWMessage(event) {
  const { type, data } = event.data || {}

  switch (type) {
    case 'SW_UPDATED':
      console.log('[PWA] Service Worker 已更新:', data?.version)
      break

    case 'CACHE_UPDATED':
      console.log('[PWA] 缓存已更新:', data?.url)
      break

    case 'SYNC_SUCCESS':
      console.log('[PWA] 同步成功:', data?.task)
      ElMessage.success('离线数据已同步')
      break

    case 'PERIODIC_SYNC_COMPLETE':
      console.log('[PWA] 周期性同步完成:', data?.timestamp)
      break

    default:
      console.log('[PWA] 收到消息:', type, data)
  }
}

/**
 * 显示更新提示
 */
function showUpdateNotification() {
  ElNotification({
    title: '发现新版本',
    message: '云书有新版本可用，点击更新',
    type: 'info',
    duration: 0,
    showClose: true,
    onClick: () => {
      updateServiceWorker()
    }
  })
}

/**
 * 更新 Service Worker
 */
async function updateServiceWorker() {
  if (newWorker) {
    // 发送跳过等待消息
    newWorker.postMessage({ type: 'SKIP_WAITING' })

    // 等待新的 Service Worker 激活
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'activated') {
        // 刷新页面
        window.location.reload()
      }
    })
  }
}

/**
 * 检查 Service Worker 更新
 */
async function checkForUpdates() {
  if (!swRegistration) {
    console.log('[PWA] Service Worker 未注册')
    return false
  }

  try {
    await swRegistration.update()
    console.log('[PWA] 已检查更新')
    return true
  } catch (error) {
    console.error('[PWA] 检查更新失败:', error)
    return false
  }
}

// ============================================
// PWA 安装管理
// ============================================

/**
 * 监听安装提示事件
 */
function listenForInstallPrompt() {
  // 监听 beforeinstallprompt 事件
  try { if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('beforeinstallprompt', (e) => {
      // 阻止默认提示
      e.preventDefault()
      // 保存事件以便稍后触发
      deferredPrompt = e
      // 标记为可安装
      isInstallable.value = true
      console.log('[PWA] 应用可安装')
    })
  } } catch(e) {}

  // 监听 appinstalled 事件
  try { if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] 应用已安装')
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt = null

      ElMessage.success('云书已添加到您的主屏幕')
    })
  } } catch(e) {}

  // 检查是否已安装
  if (isStandalone.value) {
    isInstalled.value = true
    isInstallable.value = false
  }
}

/**
 * 触发 PWA 安装
 */
async function installPWA() {
  if (!deferredPrompt) {
    console.log('[PWA] 没有可用的安装提示')

    // 如果已经在独立模式下运行
    if (isStandalone.value) {
      ElMessage.info('云书已经在独立窗口中运行')
    } else {
      ElMessage.info('您的浏览器可能不支持 PWA 安装，请使用 Chrome、Edge 或 Safari')
    }
    return false
  }

  // 显示安装提示
  deferredPrompt.prompt()

  try {
    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice
    console.log('[PWA] 用户安装选择:', outcome)

    // 清除保存的提示
    deferredPrompt = null
    isInstallable.value = false

    return outcome === 'accepted'
  } catch (error) {
    console.error('[PWA] 安装失败:', error)
    ElMessage.error('安装失败，请重试')
    return false
  }
}

/**
 * 获取安装状态
 */
function getInstallStatus() {
  return {
    isInstallable: isInstallable.value,
    isInstalled: isInstalled.value,
    isStandalone: isStandalone.value
  }
}

// ============================================
// 网络状态管理
// ============================================

/**
 * 监听网络状态变化
 */
function listenForNetworkStatus() {
  // 在线事件
  try { if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('online', () => {
      isOnline.value = true
      console.log('[PWA] 网络已连接')
      ElMessage.success('网络已连接')

      // 触发后台同步
      triggerBackgroundSync()
    })
  } } catch(e) {}

  // 离线事件
  try { if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('offline', () => {
      isOnline.value = false
      console.log('[PWA] 网络已断开')
      ElMessage.warning('您已进入离线模式，数据将在联网后自动同步')
    })
  } } catch(e) {}
}

// ============================================
// 后台同步管理
// ============================================

/**
 * 注册后台同步
 * @param {string} tag - 同步标签
 */
async function registerBackgroundSync(tag = 'sync-offline-data') {
  if (!swRegistration) {
    console.log('[PWA] Service Worker 未注册')
    return false
  }

  try {
    await swRegistration.sync.register(tag)
    console.log('[PWA] 后台同步已注册:', tag)
    return true
  } catch (error) {
    console.error('[PWA] 注册后台同步失败:', error)
    return false
  }
}

/**
 * 触发后台同步
 */
async function triggerBackgroundSync() {
  return registerBackgroundSync('sync-offline-data')
}

/**
 * 添加同步任务
 * @param {Object} task - 同步任务
 */
async function addSyncTask(task) {
  if (!swRegistration) {
    console.log('[PWA] Service Worker 未注册')
    return false
  }

  try {
    // 通过 postMessage 添加任务
    const messageChannel = new MessageChannel()

    return new Promise((resolve, reject) => {
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve(true)
        } else {
          reject(new Error(event.data.error))
        }
      }

      swRegistration.active?.postMessage(
        {
          type: 'ADD_SYNC_TASK',
          data: { task }
        },
        [messageChannel.port2]
      )
    })
  } catch (error) {
    console.error('[PWA] 添加同步任务失败:', error)
    return false
  }
}

/**
 * 注册周期性后台同步
 * @param {number} minInterval - 最小间隔（毫秒）
 */
async function registerPeriodicSync(minInterval = 24 * 60 * 60 * 1000) {
  if (!swRegistration) {
    console.log('[PWA] Service Worker 未注册')
    return false
  }

  try {
    // 检查权限
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync'
    })

    if (status.state === 'granted') {
      await swRegistration.periodicSync.register('periodic-sync-data', {
        minInterval
      })
      console.log('[PWA] 周期性后台同步已注册')
      return true
    } else {
      console.log('[PWA] 周期性后台同步权限被拒绝')
      return false
    }
  } catch (error) {
    console.error('[PWA] 注册周期性后台同步失败:', error)
    return false
  }
}

// ============================================
// 推送通知管理
// ============================================

/**
 * 请求通知权限
 * @returns {Promise<string>} 权限状态
 */
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('[PWA] 浏览器不支持通知')
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    console.log('[PWA] 通知权限:', permission)
    return permission
  } catch (error) {
    console.error('[PWA] 请求通知权限失败:', error)
    return 'denied'
  }
}

/**
 * 检查通知权限
 * @returns {string} 权限状态
 */
function checkNotificationPermission() {
  if (!('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

/**
 * 订阅推送通知
 * @param {string} applicationServerKey - VAPID 公钥
 * @returns {Promise<PushSubscription|null>} 订阅对象
 */
async function subscribePush(applicationServerKey) {
  if (!swRegistration) {
    console.log('[PWA] Service Worker 未注册')
    return null
  }

  // 先请求权限
  const permission = await requestNotificationPermission()
  if (permission !== 'granted') {
    console.log('[PWA] 通知权限被拒绝')
    return null
  }

  try {
    // 转换 VAPID 密钥
    const convertedVapidKey = urlBase64ToUint8Array(applicationServerKey)

    // 订阅推送
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    })

    console.log('[PWA] 推送订阅成功:', subscription)
    return subscription
  } catch (error) {
    console.error('[PWA] 推送订阅失败:', error)
    return null
  }
}

/**
 * 取消推送订阅
 * @returns {Promise<boolean>} 是否成功
 */
async function unsubscribePush() {
  if (!swRegistration) {
    return false
  }

  try {
    const subscription = await swRegistration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      console.log('[PWA] 推送订阅已取消')
      return true
    }
    return false
  } catch (error) {
    console.error('[PWA] 取消推送订阅失败:', error)
    return false
  }
}

/**
 * 获取当前推送订阅
 * @returns {Promise<PushSubscription|null>} 订阅对象
 */
async function getPushSubscription() {
  if (!swRegistration) {
    return null
  }

  try {
    return await swRegistration.pushManager.getSubscription()
  } catch (error) {
    console.error('[PWA] 获取推送订阅失败:', error)
    return null
  }
}

/**
 * 显示本地通知
 * @param {Object} options - 通知选项
 */
function showNotification(options) {
  const { title = '云书', body = '', icon = '/icons/icon-192x192.png', tag = 'yunshu', data = {} } = options

  if (!swRegistration) {
    console.log('[PWA] Service Worker 未注册')
    return false
  }

  try {
    swRegistration.showNotification(title, {
      body,
      icon,
      badge: '/icons/badge-72x72.png',
      tag,
      data,
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: '查看' },
        { action: 'close', title: '关闭' }
      ]
    })
    return true
  } catch (error) {
    console.error('[PWA] 显示通知失败:', error)
    return false
  }
}

/**
 * Base64 URL 转 Uint8Array
 * @param {string} base64String - Base64 URL 字符串
 * @returns {Uint8Array} Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

// ============================================
// 缓存管理
// ============================================

/**
 * 获取缓存大小
 * @param {string} cacheName - 缓存名称
 * @returns {Promise<number>} 缓存大小（MB）
 */
async function getCacheSize(cacheName = 'yunshu-cache-v2.1.0') {
  if (!swRegistration) {
    return 0
  }

  try {
    const messageChannel = new MessageChannel()

    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.size || 0)
      }

      swRegistration.active?.postMessage(
        {
          type: 'GET_CACHE_SIZE',
          data: { cacheName }
        },
        [messageChannel.port2]
      )
    })
  } catch (error) {
    console.error('[PWA] 获取缓存大小失败:', error)
    return 0
  }
}

/**
 * 清理缓存
 */
async function clearCache() {
  if (!swRegistration) {
    return false
  }

  try {
    const messageChannel = new MessageChannel()

    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.success || false)
      }

      swRegistration.active?.postMessage(
        { type: 'CLEANUP_CACHE' },
        [messageChannel.port2]
      )
    })
  } catch (error) {
    console.error('[PWA] 清理缓存失败:', error)
    return false
  }
}

/**
 * 清除所有缓存
 */
async function clearAllCaches() {
  if (!swRegistration) {
    return false
  }

  try {
    const messageChannel = new MessageChannel()

    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.success || false)
      }

      swRegistration.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      )
    })
  } catch (error) {
    console.error('[PWA] 清除所有缓存失败:', error)
    return false
  }
}

// ============================================
// 组合式函数
// ============================================

export function usePWA() {
  // 在组件挂载时初始化
  onMounted(async () => {
    // 注册 Service Worker
    await registerServiceWorker()

    // 监听安装提示
    listenForInstallPrompt()

    // 监听网络状态
    listenForNetworkStatus()

    // 注册周期性同步
    if (isOnline.value) {
      await registerPeriodicSync()
    }
  })

  // 在组件卸载时清理
  onUnmounted(() => {
    // 移除事件监听
    navigator.serviceWorker?.removeEventListener('message', handleSWMessage)
  })

  return {
    // 状态
    isInstallable,
    isInstalled,
    isOnline,
    needUpdate,
    isStandalone,
    isPWASupported,

    // Service Worker
    registerServiceWorker,
    updateServiceWorker,
    checkForUpdates,

    // PWA 安装
    installPWA,
    getInstallStatus,

    // 后台同步
    registerBackgroundSync,
    triggerBackgroundSync,
    addSyncTask,
    registerPeriodicSync,

    // 推送通知
    requestNotificationPermission,
    checkNotificationPermission,
    subscribePush,
    unsubscribePush,
    getPushSubscription,
    showNotification,

    // 缓存管理
    getCacheSize,
    clearCache,
    clearAllCaches
  }
}

export default usePWA

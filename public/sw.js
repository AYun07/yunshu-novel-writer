/**
 * 云书 - Service Worker (PWA离线支持增强版)
 * 提供静态资源缓存、API请求策略、离线回退、后台同步、推送通知等功能
 * 
 * 缓存策略：
 * - 静态资源：Stale-While-Revalidate（先返回缓存，后台更新）
 * - API请求：网络优先（Network First）+ 失败回退缓存
 * - 图片资源：缓存优先 + 后台更新
 * - 字体文件：缓存优先（长期缓存）
 * 
 * 新增功能：
 * - 周期性后台同步（Periodic Background Sync）
 * - 后台同步（Background Sync）
 * - 推送通知（Push API）
 * - 缓存清理策略
 * - 更新提示和自动刷新
 */

// ============================================
// 版本配置
// ============================================

const CACHE_VERSION = 'v2.1.0'
const CACHE_NAME = `yunshu-cache-${CACHE_VERSION}`
const DYNAMIC_CACHE_NAME = `yunshu-dynamic-${CACHE_VERSION}`
const IMAGE_CACHE_NAME = `yunshu-images-${CACHE_VERSION}`
const FONT_CACHE_NAME = `yunshu-fonts-${CACHE_VERSION}`

// 最大缓存大小限制（MB）
const MAX_CACHE_SIZE = 100
const MAX_CACHE_AGE = 30 * 24 * 60 * 60 * 1000 // 30天

// ============================================
// 预缓存资源列表
// ============================================

const PRECACHE_URLS = [
  // 核心页面
  '/',
  '/index.html',

  // 离线页面
  '/offline.html',

  // 图标
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-192x192.png',
]

// ============================================
// 缓存策略配置
// ============================================

// Stale-While-Revalidate 策略的资源类型
const STALE_WHILE_REVALIDATE_PATTERNS = [
  /\.(?:js|css)$/,
  /\/assets\//,
  /\/static\//,
]

// 缓存优先的静态资源（长期不变）
const CACHE_FIRST_PATTERNS = [
  /\.(?:woff2?|ttf|eot|otf)$/,
]

// 需要网络优先的API路径
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/v1\//,
  /\/chat\//,
  /\/completions\//,
]

// 图片资源
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico|bmp)$/,
  /\/images\//,
  /\/screenshots\//,
]

// 字体资源
const FONT_PATTERNS = [
  /\.(?:woff2?|ttf|eot|otf)$/,
  /\/fonts\//,
]

// 不缓存的资源
const NO_CACHE_PATTERNS = [
  /\/sockjs-node\//,
  /\/__webpack_hmr/,
  /chrome-extension:\/\//,
  /\/hot-update\./,
  /\/sw\.js$/,
  /\.map$/,
]

// ============================================
// 安装事件 - 预缓存关键资源
// ============================================

self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中...', CACHE_VERSION)

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 预缓存资源')
        // 预缓存关键资源
        return cache.addAll(PRECACHE_URLS.map(url => {
          return new Request(url, { cache: 'reload' })
        })).catch((error) => {
          console.warn('[Service Worker] 部分资源预缓存失败:', error)
          // 即使部分失败也继续安装
          return Promise.resolve()
        })
      })
      .then(() => {
        console.log('[Service Worker] 安装完成')
        // 立即激活新的 Service Worker
        return self.skipWaiting()
      })
  )
})

// ============================================
// 激活事件 - 清理旧缓存
// ============================================

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中...', CACHE_VERSION)

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // 删除旧版本的缓存
              return name.startsWith('yunshu-') && 
                     name !== CACHE_NAME && 
                     name !== DYNAMIC_CACHE_NAME &&
                     name !== IMAGE_CACHE_NAME &&
                     name !== FONT_CACHE_NAME
            })
            .map((name) => {
              console.log('[Service Worker] 删除旧缓存:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => {
        // 清理过期缓存
        return cleanupExpiredCache()
      })
      .then(() => {
        console.log('[Service Worker] 激活完成')
        // 立即控制所有客户端
        return self.clients.claim()
      })
      .then(() => {
        // 通知客户端有新版本
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SW_UPDATED',
              version: CACHE_VERSION
            })
          })
        })
      })
  )
})

// ============================================
// 请求拦截 - 缓存策略
// ============================================

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 跳过不需要缓存的请求
  if (shouldSkipCache(request)) {
    return
  }

  // 根据请求类型选择缓存策略
  if (isStaleWhileRevalidate(request)) {
    // Stale-While-Revalidate 策略（静态资源）
    event.respondWith(staleWhileRevalidate(request))
  } else if (isCacheFirst(request)) {
    // 缓存优先策略（字体文件）
    event.respondWith(cacheFirst(request, FONT_CACHE_NAME))
  } else if (isNetworkFirst(request)) {
    // 网络优先策略（API请求）
    event.respondWith(networkFirst(request))
  } else if (isImageRequest(request)) {
    // 图片缓存策略
    event.respondWith(imageCacheStrategy(request))
  } else {
    // 默认：Stale-While-Revalidate
    event.respondWith(staleWhileRevalidate(request))
  }
})

// ============================================
// 缓存策略实现
// ============================================

/**
 * 判断是否跳过缓存
 * @param {Request} request - 请求对象
 * @returns {boolean} 是否跳过
 */
function shouldSkipCache(request) {
  const url = request.url

  // 非GET请求不缓存
  if (request.method !== 'GET') {
    return true
  }

  // 匹配不缓存的模式
  return NO_CACHE_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * 判断是否使用 Stale-While-Revalidate 策略
 * @param {Request} request - 请求对象
 * @returns {boolean} 是否使用
 */
function isStaleWhileRevalidate(request) {
  const url = request.url
  return STALE_WHILE_REVALIDATE_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * 判断是否使用缓存优先策略
 * @param {Request} request - 请求对象
 * @returns {boolean} 是否缓存优先
 */
function isCacheFirst(request) {
  const url = request.url
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * 判断是否使用网络优先策略
 * @param {Request} request - 请求对象
 * @returns {boolean} 是否网络优先
 */
function isNetworkFirst(request) {
  const url = request.url
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * 判断是否是图片请求
 * @param {Request} request - 请求对象
 * @returns {boolean} 是否是图片
 */
function isImageRequest(request) {
  const url = request.url
  return IMAGE_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * Stale-While-Revalidate 策略
 * 立即返回缓存（如果存在），同时在后台更新缓存
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  // 后台更新函数
  const fetchAndCache = async () => {
    try {
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        // 克隆响应并缓存
        const responseToCache = networkResponse.clone()
        cache.put(request, responseToCache)
        
        // 通知客户端有更新
        notifyClientsOfUpdate(request.url)
      }
      return networkResponse
    } catch (error) {
      console.log('[Service Worker] 后台更新失败:', request.url)
      return null
    }
  }

  if (cachedResponse) {
    // 有缓存，立即返回，后台更新
    fetchAndCache()
    return cachedResponse
  }

  // 没有缓存，等待网络请求
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return getOfflineResponse(request)
  }
}

/**
 * 缓存优先策略
 * 先从缓存获取，缓存不存在则从网络获取并缓存
 * @param {Request} request - 请求对象
 * @param {string} cacheName - 缓存名称
 * @returns {Promise<Response>} 响应
 */
async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return getOfflineResponse(request)
  }
}

/**
 * 网络优先策略
 * 先从网络获取，网络失败则从缓存获取
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request, {
      signal: AbortSignal.timeout(10000)
    })

    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('[Service Worker] 网络请求失败，尝试缓存:', request.url)

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return getOfflineResponse(request)
  }
}

/**
 * 图片缓存策略
 * 使用专门的图片缓存，并限制缓存大小
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应
 */
async function imageCacheStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME)
  const cachedResponse = await cache.match(request)

  // 后台更新
  const fetchAndCache = async () => {
    try {
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        // 检查缓存大小，如果超过限制则清理
        const cacheSize = await getCacheSize(IMAGE_CACHE_NAME)
        if (cacheSize > MAX_CACHE_SIZE) {
          await cleanupLRUCache(IMAGE_CACHE_NAME)
        }
        
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    } catch (error) {
      return null
    }
  }

  if (cachedResponse) {
    fetchAndCache()
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return getOfflineResponse(request)
  }
}

/**
 * 获取离线响应
 * @param {Request} request - 请求对象
 * @returns {Response} 离线响应
 */
async function getOfflineResponse(request) {
  const url = new URL(request.url)

  // HTML页面返回离线页面
  if (request.headers.get('Accept')?.includes('text/html')) {
    const offlinePage = await caches.match('/offline.html')
    if (offlinePage) {
      return offlinePage
    }

    return new Response(
      `<!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>云书 - 离线</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 40px;
          }
          h1 { font-size: 48px; margin-bottom: 20px; }
          p { font-size: 18px; opacity: 0.9; margin-bottom: 30px; }
          button {
            padding: 12px 30px;
            font-size: 16px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: transform 0.2s;
          }
          button:hover { transform: scale(1.05); }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📚</h1>
          <h1>暂无网络连接</h1>
          <p>请检查您的网络设置，或稍后重试</p>
          <button onclick="location.reload()">重新加载</button>
        </div>
      </body>
      </html>`,
      {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    )
  }

  // API请求返回JSON错误
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: '网络连接不可用，请稍后重试'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  return new Response('Service Unavailable', { status: 503 })
}

// ============================================
// 缓存管理
// ============================================

/**
 * 获取缓存大小（MB）
 * @param {string} cacheName - 缓存名称
 * @returns {Promise<number>} 缓存大小（MB）
 */
async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  let size = 0

  for (const request of requests) {
    const response = await cache.match(request)
    if (response) {
      const blob = await response.blob()
      size += blob.size
    }
  }

  return size / (1024 * 1024) // 转换为MB
}

/**
 * 清理过期缓存
 */
async function cleanupExpiredCache() {
  const cacheNames = [DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME]
  const now = Date.now()

  for (const cacheName of cacheNames) {
    try {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()

      for (const request of requests) {
        const response = await cache.match(request)
        if (response) {
          const dateHeader = response.headers.get('date')
          if (dateHeader) {
            const cachedTime = new Date(dateHeader).getTime()
            if (now - cachedTime > MAX_CACHE_AGE) {
              await cache.delete(request)
              console.log('[Service Worker] 删除过期缓存:', request.url)
            }
          }
        }
      }
    } catch (error) {
      console.error('[Service Worker] 清理缓存失败:', error)
    }
  }
}

/**
 * 清理LRU缓存（最少使用）
 * @param {string} cacheName - 缓存名称
 */
async function cleanupLRUCache(cacheName) {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  
  // 删除一半缓存项（简化实现）
  const deleteCount = Math.floor(requests.length / 2)
  for (let i = 0; i < deleteCount; i++) {
    await cache.delete(requests[i])
  }
  
  console.log('[Service Worker] 清理LRU缓存:', deleteCount, '项')
}

/**
 * 通知客户端有更新
 * @param {string} url - 更新的URL
 */
async function notifyClientsOfUpdate(url) {
  const clients = await self.clients.matchAll()
  clients.forEach((client) => {
    client.postMessage({
      type: 'CACHE_UPDATED',
      url: url
    })
  })
}

// ============================================
// 后台同步
// ============================================

// 离线操作队列
let syncQueue = []

/**
 * 添加同步任务
 * @param {Object} task - 同步任务
 */
function addToSyncQueue(task) {
  syncQueue.push({
    ...task,
    timestamp: Date.now(),
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  })

  storeSyncQueue()
}

/**
 * 存储同步队列到 IndexedDB
 */
async function storeSyncQueue() {
  try {
    const db = await openSyncDB()
    const tx = db.transaction('syncQueue', 'readwrite')
    const store = tx.objectStore('syncQueue')

    for (const task of syncQueue) {
      await store.put(task)
    }

    await tx.done
  } catch (error) {
    console.error('[Service Worker] 存储同步队列失败:', error)
  }
}

/**
 * 打开同步数据库
 * @returns {Promise<IDBDatabase>} 数据库实例
 */
function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('yunshu-sync', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' })
      }
    }
  })
}

// 监听后台同步事件
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 后台同步事件:', event.tag)

  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData())
  }
})

/**
 * 同步离线数据
 */
async function syncOfflineData() {
  console.log('[Service Worker] 开始同步离线数据...')

  try {
    const db = await openSyncDB()
    const tx = db.transaction('syncQueue', 'readonly')
    const store = tx.objectStore('syncQueue')
    const tasks = await store.getAll()

    for (const task of tasks) {
      try {
        const response = await fetch(task.url, {
          method: task.method,
          headers: task.headers,
          body: JSON.stringify(task.data)
        })

        if (response.ok) {
          // 同步成功，从队列中移除
          const deleteTx = db.transaction('syncQueue', 'readwrite')
          const deleteStore = deleteTx.objectStore('syncQueue')
          await deleteStore.delete(task.id)

          // 通知客户端
          const clients = await self.clients.matchAll()
          clients.forEach((client) => {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              task: task
            })
          })
        }
      } catch (error) {
        console.error('[Service Worker] 同步任务失败:', task.id, error)
      }
    }
  } catch (error) {
    console.error('[Service Worker] 同步过程出错:', error)
  }
}

// ============================================
// 周期性后台同步
// ============================================

// 监听周期性后台同步事件
self.addEventListener('periodicsync', (event) => {
  console.log('[Service Worker] 周期性后台同步:', event.tag)

  if (event.tag === 'periodic-sync-data') {
    event.waitUntil(periodicSyncData())
  }
})

/**
 * 周期性同步数据
 * 用于在后台定期同步用户数据、检查更新等
 */
async function periodicSyncData() {
  console.log('[Service Worker] 执行周期性同步...')

  try {
    // 1. 同步离线数据
    await syncOfflineData()

    // 2. 预缓存重要资源
    await precacheImportantResources()

    // 3. 通知客户端
    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({
        type: 'PERIODIC_SYNC_COMPLETE',
        timestamp: Date.now()
      })
    })

    console.log('[Service Worker] 周期性同步完成')
  } catch (error) {
    console.error('[Service Worker] 周期性同步失败:', error)
  }
}

/**
 * 预缓存重要资源
 */
async function precacheImportantResources() {
  const importantUrls = [
    '/',
    '/index.html',
    '/offline.html',
  ]

  const cache = await caches.open(CACHE_NAME)

  for (const url of importantUrls) {
    try {
      const response = await fetch(url, { cache: 'reload' })
      if (response.ok) {
        await cache.put(url, response)
      }
    } catch (error) {
      console.log('[Service Worker] 预缓存失败:', url)
    }
  }
}

// ============================================
// 推送通知
// ============================================

// 监听推送事件
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 收到推送消息')

  let data = {
    title: '云书通知',
    body: '您有新的消息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'yunshu-notification',
    data: {}
  }

  // 解析推送数据
  if (event.data) {
    try {
      const pushData = event.data.json()
      data = { ...data, ...pushData }
    } catch (e) {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      { action: 'open', title: '查看' },
      { action: 'close', title: '关闭' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// 监听通知点击事件
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知点击:', event.action)

  event.notification.close()

  if (event.action === 'close') {
    return
  }

  // 打开应用
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 检查是否已有打开的窗口
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }

        // 没有打开的窗口，打开新窗口
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen)
        }
      })
  )
})

// 监听通知关闭事件
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] 通知关闭')
})

// 监听推送订阅变更事件
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[Service Worker] 推送订阅变更')

  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: event.oldSubscription?.options?.applicationServerKey
    }).then((subscription) => {
      // 通知服务器新的订阅信息
      return fetch('/api/push/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription })
      })
    })
  )
})

// ============================================
// 消息通信
// ============================================

self.addEventListener('message', (event) => {
  console.log('[Service Worker] 收到消息:', event.data)

  const { type, data } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      // 跳过等待，立即激活
      self.skipWaiting()
      break

    case 'GET_VERSION':
      // 返回版本信息
      event.ports[0]?.postMessage({
        version: CACHE_VERSION
      })
      break

    case 'CLEAR_CACHE':
      // 清除缓存
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((name) => caches.delete(name))
          )
        }).then(() => {
          event.ports[0]?.postMessage({ success: true })
        })
      )
      break

    case 'CACHE_URLS':
      // 缓存指定URL
      event.waitUntil(
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          return cache.addAll(data.urls)
        }).then(() => {
          event.ports[0]?.postMessage({ success: true })
        })
      )
      break

    case 'ADD_SYNC_TASK':
      // 添加后台同步任务
      addToSyncQueue(data.task)
      // 注册后台同步
      self.registration.sync.register('sync-offline-data')
      event.ports[0]?.postMessage({ success: true })
      break

    case 'SUBSCRIBE_PUSH':
      // 订阅推送通知
      event.waitUntil(
        self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: data.applicationServerKey
        }).then((subscription) => {
          event.ports[0]?.postMessage({ subscription })
        }).catch((error) => {
          event.ports[0]?.postMessage({ error: error.message })
        })
      )
      break

    case 'UNSUBSCRIBE_PUSH':
      // 取消推送订阅
      event.waitUntil(
        self.registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            return subscription.unsubscribe()
          }
          return false
        }).then((result) => {
          event.ports[0]?.postMessage({ success: result })
        }).catch((error) => {
          event.ports[0]?.postMessage({ error: error.message })
        })
      )
      break

    case 'GET_CACHE_SIZE':
      // 获取缓存大小
      event.waitUntil(
        getCacheSize(data.cacheName || CACHE_NAME).then((size) => {
          event.ports[0]?.postMessage({ size })
        })
      )
      break

    case 'CLEANUP_CACHE':
      // 清理缓存
      event.waitUntil(
        cleanupExpiredCache().then(() => {
          event.ports[0]?.postMessage({ success: true })
        })
      )
      break

    case 'REGISTER_PERIODIC_SYNC':
      // 注册周期性后台同步
      event.waitUntil(
        self.registration.periodicSync.register('periodic-sync-data', {
          minInterval: data.minInterval || 24 * 60 * 60 * 1000 // 默认24小时
        }).then(() => {
          event.ports[0]?.postMessage({ success: true })
        }).catch((error) => {
          event.ports[0]?.postMessage({ error: error.message })
        })
      )
      break

    default:
      console.log('[Service Worker] 未知消息类型:', type)
  }
})

// ============================================
// 工具函数
// ============================================

/**
 * 创建 AbortSignal 超时
 * @param {number} ms - 超时时间（毫秒）
 * @returns {AbortSignal} AbortSignal
 */
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function (ms) {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), ms)
    return controller.signal
  }
}

console.log('[Service Worker] 脚本加载完成', CACHE_VERSION)

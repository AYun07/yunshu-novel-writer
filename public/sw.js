/**
 * 云书 - Service Worker (PWA离线支持)
 * 提供静态资源缓存、API请求策略、离线回退、后台同步等功能
 * 
 * 缓存策略：
 * - 静态资源：缓存优先（Cache First）
 * - API请求：网络优先（Network First）
 * - 图片资源：缓存优先 + 网络更新
 */

// ============================================
// 版本配置
// ============================================

const CACHE_VERSION = 'v2.0.0'
const CACHE_NAME = `yunshu-cache-${CACHE_VERSION}`
const DYNAMIC_CACHE_NAME = `yunshu-dynamic-${CACHE_VERSION}`

// ============================================
// 预缓存资源列表
// ============================================

const PRECACHE_URLS = [
  // 核心页面
  '/',
  '/index.html',

  // 样式文件（构建后自动添加）
  // '/assets/index.css',

  // 脚本文件（构建后自动添加）
  // '/assets/index.js',

  // 图标
  '/favicon.svg',

  // 离线页面
  '/offline.html'
]

// ============================================
// 缓存策略配置
// ============================================

// 需要缓存优先的静态资源类型
const CACHE_FIRST_PATTERNS = [
  /\.(?:js|css|woff2?|ttf|eot)$/,
  /\/assets\//,
  /\/static\//
]

// 需要网络优先的API路径
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/v1\//,
  /\/chat\//,
  /\/completions\//
]

// 图片资源
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/
]

// 不缓存的资源
const NO_CACHE_PATTERNS = [
  /\/sockjs-node\//,
  /\/__webpack_hmr/,
  /chrome-extension:\/\//,
  /\/hot-update\./
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
                     name !== DYNAMIC_CACHE_NAME
            })
            .map((name) => {
              console.log('[Service Worker] 删除旧缓存:', name)
              return caches.delete(name)
            })
        )
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
  if (isCacheFirst(request)) {
    // 缓存优先策略（静态资源）
    event.respondWith(cacheFirst(request))
  } else if (isNetworkFirst(request)) {
    // 网络优先策略（API请求）
    event.respondWith(networkFirst(request))
  } else if (isImageRequest(request)) {
    // 图片缓存策略
    event.respondWith(cacheFirstWithUpdate(request))
  } else {
    // 默认：网络优先
    event.respondWith(networkFirst(request))
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
 * 缓存优先策略
 * 先从缓存获取，缓存不存在则从网络获取并缓存
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    // 返回缓存
    return cachedResponse
  }

  try {
    // 从网络获取
    const networkResponse = await fetch(request)

    // 缓存响应
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // 网络失败，返回离线页面
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
    // 尝试从网络获取
    const networkResponse = await fetch(request, {
      // 添加超时控制
      signal: AbortSignal.timeout(10000)
    })

    // 缓存成功的响应
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('[Service Worker] 网络请求失败，尝试缓存:', request.url)

    // 从缓存获取
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    // 返回离线响应
    return getOfflineResponse(request)
  }
}

/**
 * 缓存优先 + 后台更新策略
 * 立即返回缓存，同时在后台更新缓存
 * @param {Request} request - 请求对象
 * @returns {Promise<Response>} 响应
 */
async function cacheFirstWithUpdate(request) {
  const cachedResponse = await caches.match(request)

  // 后台更新
  const updatePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse)
        })
      }
    })
    .catch(() => {
      // 忽略更新失败
    })

  if (cachedResponse) {
    // 返回缓存，同时后台更新
    return cachedResponse
  }

  // 没有缓存，等待网络请求
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
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

    // 没有离线页面，返回默认响应
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

  // 其他请求返回503
  return new Response('Service Unavailable', { status: 503 })
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

  // 存储到 IndexedDB
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
    actions: [
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

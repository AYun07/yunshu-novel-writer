/**
 * 路由懒加载工具
 * 提供路由组件的懒加载、加载状态、错误边界、预加载和重试机制
 */

import { defineAsyncComponent, h, ref, onMounted, onUnmounted } from 'vue'

// ============================================
// 加载状态组件
// ============================================

/**
 * 默认加载中组件
 * 显示一个居中的加载动画
 */
const DefaultLoadingComponent = {
  name: 'RouteLoading',
  setup() {
    return () =>
      h('div', {
        class: 'route-loading-container',
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '200px',
          color: 'var(--el-text-color-secondary)'
        }
      }, [
        h('div', {
          class: 'loading-spinner',
          style: {
            width: '40px',
            height: '40px',
            border: '3px solid var(--el-border-color-lighter)',
            borderTopColor: 'var(--el-color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }
        }),
        h('p', {
          style: {
            marginTop: '16px',
            fontSize: '14px'
          }
        }, '加载中...')
      ])
  }
}

/**
 * 默认错误组件
 * 显示加载失败的错误信息
 */
const DefaultErrorComponent = {
  name: 'RouteError',
  props: {
    error: {
      type: Error,
      required: true
    },
    retry: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'route-error-container',
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '200px',
          padding: '20px'
        }
      }, [
        h('div', {
          style: {
            fontSize: '48px',
            marginBottom: '16px'
          }
        }, '⚠️'),
        h('h3', {
          style: {
            color: 'var(--el-color-danger)',
            marginBottom: '8px'
          }
        }, '加载失败'),
        h('p', {
          style: {
            color: 'var(--el-text-color-secondary)',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center'
          }
        }, props.error.message || '页面加载失败，请重试'),
        h('button', {
          onClick: props.retry,
          style: {
            padding: '8px 24px',
            backgroundColor: 'var(--el-color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }
        }, '重新加载')
      ])
  }
}

// ============================================
// 懒加载配置
// ============================================

/**
 * 懒加载配置选项
 * @typedef {Object} LazyLoadOptions
 * @property {number} delay - 延迟显示加载组件的时间(ms)
 * @property {number} timeout - 超时时间(ms)
 * @property {number} retries - 重试次数
 * @property {number} retryDelay - 重试延迟(ms)
 * @property {Component} loadingComponent - 加载中组件
 * @property {Component} errorComponent - 错误组件
 * @property {Function} onError - 错误回调
 * @property {Function} onLoading - 开始加载回调
 * @property {Function} onLoaded - 加载完成回调
 */

const defaultOptions = {
  delay: 200,           // 延迟200ms显示加载组件，避免闪烁
  timeout: 30000,       // 30秒超时
  retries: 3,           // 重试3次
  retryDelay: 1000,     // 重试间隔1秒
  loadingComponent: DefaultLoadingComponent,
  errorComponent: DefaultErrorComponent,
  onError: null,
  onLoading: null,
  onLoaded: null
}

// ============================================
// 重试机制
// ============================================

/**
 * 创建带重试机制的异步加载器
 * @param {Function} loader - 原始加载函数
 * @param {Object} options - 配置选项
 * @returns {Function} 带重试的加载函数
 */
function createRetryLoader(loader, options) {
  const { retries, retryDelay } = options

  return async () => {
    let lastError = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const component = await loader()
        return component
      } catch (error) {
        lastError = error
        console.warn(`[LazyLoad] 加载失败，第 ${attempt + 1} 次尝试`, error)

        // 如果不是最后一次尝试，等待后重试
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError
  }
}

// ============================================
// 懒加载工厂函数
// ============================================

/**
 * 创建懒加载组件
 * @param {Function} loader - 组件加载函数 () => import('./Component.vue')
 * @param {LazyLoadOptions} options - 配置选项
 * @returns {Component} 异步组件
 */
export function lazyLoad(loader, options = {}) {
  const mergedOptions = { ...defaultOptions, ...options }
  const {
    delay,
    timeout,
    loadingComponent,
    errorComponent,
    onError,
    onLoading,
    onLoaded
  } = mergedOptions

  // 创建带重试的加载器
  const retryLoader = createRetryLoader(loader, mergedOptions)

  // 记录加载状态
  let isLoading = false
  let loadPromise = null

  // 包装加载函数
  const wrappedLoader = async () => {
    if (loadPromise) {
      return loadPromise
    }

    isLoading = true
    onLoading?.()

    loadPromise = retryLoader()
      .then(component => {
        onLoaded?.()
        return component
      })
      .catch(error => {
        onError?.(error)
        loadPromise = null // 失败后清除，允许重试
        throw error
      })
      .finally(() => {
        isLoading = false
      })

    return loadPromise
  }

  return defineAsyncComponent({
    loader: wrappedLoader,
    loadingComponent,
    errorComponent,
    delay,
    timeout,
    onError(error, retry, fail, attempts) {
      if (onError) {
        onError(error)
      }
      // 如果重试次数用尽，显示错误
      if (attempts > mergedOptions.retries) {
        fail()
      }
    }
  })
}

// ============================================
// 预加载策略
// ============================================

/**
 * 预加载管理器
 * 管理组件的预加载和缓存
 */
class PreloadManager {
  constructor() {
    // 已预加载的组件缓存
    this.preloadedComponents = new Map()
    // 预加载队列
    this.preloadQueue = []
    // 是否正在处理队列
    this.isProcessing = false
    // 最大并发预加载数
    this.maxConcurrent = 3
    // 当前并发数
    this.currentConcurrent = 0
  }

  /**
   * 预加载单个组件
   * @param {string} name - 组件名称
   * @param {Function} loader - 加载函数
   * @returns {Promise} 加载Promise
   */
  async preload(name, loader) {
    // 如果已经预加载过，直接返回
    if (this.preloadedComponents.has(name)) {
      return this.preloadedComponents.get(name)
    }

    const promise = loader()
    this.preloadedComponents.set(name, promise)

    try {
      const component = await promise
      return component
    } catch (error) {
      // 预加载失败，从缓存中移除
      this.preloadedComponents.delete(name)
      throw error
    }
  }

  /**
   * 批量预加载组件
   * @param {Array<{name: string, loader: Function}>} components - 组件列表
   */
  async preloadAll(components) {
    const promises = components.map(({ name, loader }) =>
      this.preload(name, loader)
    )
    return Promise.allSettled(promises)
  }

  /**
   * 获取已预加载的组件
   * @param {string} name - 组件名称
   * @returns {Component|null} 组件或null
   */
  getPreloaded(name) {
    return this.preloadedComponents.get(name)
  }

  /**
   * 清除预加载缓存
   */
  clear() {
    this.preloadedComponents.clear()
  }
}

// 导出预加载管理器实例
export const preloadManager = new PreloadManager()

/**
 * 创建带悬停预加载的路由组件
 * 当用户悬停在链接上时预加载组件
 * @param {string} name - 组件名称
 * @param {Function} loader - 加载函数
 * @param {LazyLoadOptions} options - 配置选项
 * @returns {Component} 异步组件
 */
export function lazyLoadWithPreload(name, loader, options = {}) {
  const component = lazyLoad(loader, options)

  // 添加预加载方法
  component.preload = () => preloadManager.preload(name, loader)

  return component
}

// ============================================
// 鼠标悬停预加载指令
// ============================================

/**
 * v-preload 指令
 * 用于在鼠标悬停时预加载组件
 *
 * 使用示例:
 * <router-link to="/dashboard" v-preload="'Dashboard'">Dashboard</router-link>
 */
export const preloadDirective = {
  mounted(el, binding) {
    const componentName = binding.value
    if (!componentName) return

    // 获取组件加载器（需要在路由配置中注册）
    const loader = routeLoaders[componentName]
    if (!loader) return

    // 鼠标进入时预加载
    el.addEventListener('mouseenter', () => {
      preloadManager.preload(componentName, loader)
    }, { passive: true })

    // 触摸开始时预加载（移动端）
    el.addEventListener('touchstart', () => {
      preloadManager.preload(componentName, loader)
    }, { passive: true })
  }
}

// ============================================
// 路由加载器注册表
// ============================================

/**
 * 路由组件加载器注册表
 * 用于预加载指令获取组件加载器
 */
export const routeLoaders = {}

/**
 * 注册路由加载器
 * @param {string} name - 组件名称
 * @param {Function} loader - 加载函数
 */
export function registerRouteLoader(name, loader) {
  routeLoaders[name] = loader
}

// ============================================
// 路由懒加载工厂
// ============================================

/**
 * 创建路由懒加载组件（简化版）
 * 自动注册加载器并支持预加载
 * @param {string} name - 组件名称
 * @param {Function} importer - import函数 () => import('./views/Page.vue')
 * @returns {Component} 异步组件
 */
export function createLazyRoute(name, importer) {
  // 注册加载器
  registerRouteLoader(name, importer)

  // 创建懒加载组件
  return lazyLoadWithPreload(name, importer, {
    onError: (error) => {
      console.error(`[LazyLoad] 路由组件 "${name}" 加载失败:`, error)
    }
  })
}

// ============================================
// 批量创建懒加载路由
// ============================================

/**
 * 批量创建懒加载路由组件
 * @param {Object} routes - 路由配置对象 { name: () => import('./Page.vue') }
 * @returns {Object} 懒加载组件对象 { name: Component }
 */
export function createLazyRoutes(routes) {
  const components = {}

  for (const [name, importer] of Object.entries(routes)) {
    components[name] = createLazyRoute(name, importer)
  }

  return components
}

// ============================================
// 视口预加载 Hook
// ============================================

/**
 * 视口预加载组合式函数
 * 当元素进入视口时预加载组件
 */
export function useViewportPreload() {
  const observer = ref(null)

  /**
   * 开始观察元素
   * @param {HTMLElement} element - 要观察的元素
   * @param {string} componentName - 组件名称
   * @param {Function} loader - 加载函数
   */
  const observe = (element, componentName, loader) => {
    if (!observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // 元素进入视口，预加载组件
              preloadManager.preload(componentName, loader)
              // 预加载后停止观察
              observer.value.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '100px' // 提前100px开始预加载
        }
      )
    }

    observer.value.observe(element)
  }

  /**
   * 停止观察
   */
  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect()
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    disconnect
  }
}

// ============================================
// 加载状态 Hook
// ============================================

/**
 * 加载状态管理组合式函数
 */
export function useLoadingState() {
  const isLoading = ref(false)
  const error = ref(null)
  const retryCount = ref(0)

  /**
   * 执行带加载状态的操作
   * @param {Function} action - 要执行的操作
   */
  const execute = async (action) => {
    isLoading.value = true
    error.value = null

    try {
      await action()
    } catch (e) {
      error.value = e
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 重试操作
   * @param {Function} action - 要重试的操作
   */
  const retry = async (action) => {
    retryCount.value++
    await execute(action)
  }

  /**
   * 重置状态
   */
  const reset = () => {
    isLoading.value = false
    error.value = null
    retryCount.value = 0
  }

  return {
    isLoading,
    error,
    retryCount,
    execute,
    retry,
    reset
  }
}

// ============================================
// 默认导出
// ============================================

export default {
  lazyLoad,
  lazyLoadWithPreload,
  createLazyRoute,
  createLazyRoutes,
  preloadManager,
  preloadDirective,
  registerRouteLoader,
  useViewportPreload,
  useLoadingState,
  DefaultLoadingComponent,
  DefaultErrorComponent
}

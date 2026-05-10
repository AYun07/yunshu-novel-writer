/**
 * 虚拟滚动工具
 * 用于高效渲染长列表，只渲染可见区域的元素
 * 支持动态高度、滚动位置保持、无限滚动加载
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// ============================================
// 虚拟列表核心类
// ============================================

/**
 * 虚拟列表配置
 * @typedef {Object} VirtualListOptions
 * @property {number} itemHeight - 项目高度（固定高度模式）
 * @property {number} buffer - 缓冲区大小（额外渲染的项目数）
 * @property {boolean} dynamicHeight - 是否支持动态高度
 * @property {number} estimatedHeight - 预估高度（动态高度模式）
 * @property {string} direction - 滚动方向 'vertical' | 'horizontal'
 */

const defaultOptions = {
  itemHeight: 50,
  buffer: 5,
  dynamicHeight: false,
  estimatedHeight: 50,
  direction: 'vertical'
}

/**
 * 虚拟列表管理器
 */
class VirtualListManager {
  constructor(options = {}) {
    this.options = { ...defaultOptions, ...options }

    // 列表数据
    this.items = []
    // 总项目数
    this.totalCount = 0
    // 容器高度
    this.containerSize = 0
    // 滚动位置
    this.scrollOffset = 0
    // 项目高度缓存（动态高度模式）
    this.heightCache = new Map()
    // 位置缓存（动态高度模式）
    this.positionCache = new Map()
    // 是否需要重新计算位置
    this.needsRecalculate = true
  }

  /**
   * 设置列表数据
   * @param {Array} items - 列表数据
   */
  setItems(items) {
    this.items = items
    this.totalCount = items.length
    this.needsRecalculate = true
  }

  /**
   * 设置容器大小
   * @param {number} size - 容器尺寸
   */
  setContainerSize(size) {
    this.containerSize = size
  }

  /**
   * 设置滚动位置
   * @param {number} offset - 滚动偏移量
   */
  setScrollOffset(offset) {
    this.scrollOffset = Math.max(0, offset)
  }

  /**
   * 获取项目高度
   * @param {number} index - 项目索引
   * @returns {number} 项目高度
   */
  getItemHeight(index) {
    if (this.options.dynamicHeight) {
      return this.heightCache.get(index) || this.options.estimatedHeight
    }
    return this.options.itemHeight
  }

  /**
   * 设置项目高度（动态高度模式）
   * @param {number} index - 项目索引
   * @param {number} height - 实际高度
   */
  setItemHeight(index, height) {
    if (!this.options.dynamicHeight) return

    const oldHeight = this.heightCache.get(index)
    if (oldHeight !== height) {
      this.heightCache.set(index, height)
      this.needsRecalculate = true
    }
  }

  /**
   * 计算项目位置（动态高度模式）
   */
  calculatePositions() {
    if (!this.needsRecalculate) return

    let position = 0
    for (let i = 0; i < this.totalCount; i++) {
      this.positionCache.set(i, position)
      position += this.getItemHeight(i)
    }

    this.needsRecalculate = false
  }

  /**
   * 获取项目位置
   * @param {number} index - 项目索引
   * @returns {number} 项目位置
   */
  getItemPosition(index) {
    if (this.options.dynamicHeight) {
      this.calculatePositions()
      return this.positionCache.get(index) || 0
    }
    return index * this.options.itemHeight
  }

  /**
   * 获取列表总高度
   * @returns {number} 总高度
   */
  getTotalSize() {
    if (this.options.dynamicHeight) {
      this.calculatePositions()
      let total = 0
      for (let i = 0; i < this.totalCount; i++) {
        total += this.getItemHeight(i)
      }
      return total
    }
    return this.totalCount * this.options.itemHeight
  }

  /**
   * 根据滚动位置查找起始索引
   * @returns {number} 起始索引
   */
  findStartIndex() {
    const { buffer } = this.options

    if (this.options.dynamicHeight) {
      // 动态高度：二分查找
      return this.binarySearchStartIndex() - buffer
    }

    // 固定高度：直接计算
    const index = Math.floor(this.scrollOffset / this.options.itemHeight) - buffer
    return Math.max(0, index)
  }

  /**
   * 二分查找起始索引（动态高度模式）
   * @returns {number} 起始索引
   */
  binarySearchStartIndex() {
    let low = 0
    let high = this.totalCount - 1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const position = this.getItemPosition(mid)
      const height = this.getItemHeight(mid)

      if (position + height < this.scrollOffset) {
        low = mid + 1
      } else if (position > this.scrollOffset) {
        high = mid - 1
      } else {
        return mid
      }
    }

    return low
  }

  /**
   * 根据起始索引和容器大小计算结束索引
   * @param {number} startIndex - 起始索引
   * @returns {number} 结束索引
   */
  findEndIndex(startIndex) {
    const { buffer, dynamicHeight, itemHeight } = this.options
    const endOffset = this.scrollOffset + this.containerSize

    if (dynamicHeight) {
      // 动态高度：累加计算
      let offset = this.getItemPosition(startIndex)
      let index = startIndex

      while (index < this.totalCount && offset < endOffset) {
        offset += this.getItemHeight(index)
        index++
      }

      return Math.min(this.totalCount - 1, index + buffer)
    }

    // 固定高度：直接计算
    const index = Math.ceil(endOffset / itemHeight) + buffer
    return Math.min(this.totalCount - 1, index)
  }

  /**
   * 获取可见范围
   * @returns {{startIndex: number, endIndex: number, items: Array}}
   */
  getVisibleRange() {
    if (this.totalCount === 0) {
      return { startIndex: 0, endIndex: -1, items: [] }
    }

    const startIndex = this.findStartIndex()
    const endIndex = this.findEndIndex(startIndex)

    return {
      startIndex,
      endIndex,
      items: this.items.slice(startIndex, endIndex + 1)
    }
  }

  /**
   * 滚动到指定索引
   * @param {number} index - 目标索引
   * @returns {number} 滚动位置
   */
  scrollToIndex(index) {
    index = Math.max(0, Math.min(index, this.totalCount - 1))
    return this.getItemPosition(index)
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.heightCache.clear()
    this.positionCache.clear()
    this.needsRecalculate = true
  }

  /**
   * 重置
   */
  reset() {
    this.items = []
    this.totalCount = 0
    this.scrollOffset = 0
    this.clearCache()
  }
}

// ============================================
// Vue 组合式函数
// ============================================

/**
 * 虚拟列表组合式函数
 * @param {Object} options - 配置选项
 * @returns {Object} 虚拟列表状态和方法
 */
export function useVirtualList(options = {}) {
  // 创建管理器实例
  const manager = new VirtualListManager(options)

  // 响应式状态
  const items = ref([])
  const containerRef = ref(null)
  const scrollOffset = ref(0)
  const visibleRange = ref({ startIndex: 0, endIndex: -1, items: [] })
  const totalSize = ref(0)
  const isScrolling = ref(false)

  // 滚动防抖定时器
  let scrollTimer = null

  /**
   * 更新可见范围
   */
  const updateVisibleRange = () => {
    manager.setScrollOffset(scrollOffset.value)
    visibleRange.value = manager.getVisibleRange()
    totalSize.value = manager.getTotalSize()
  }

  /**
   * 处理滚动事件
   * @param {Event} event - 滚动事件
   */
  const handleScroll = (event) => {
    const target = event.target
    const { direction } = options

    scrollOffset.value = direction === 'horizontal'
      ? target.scrollLeft
      : target.scrollTop

    isScrolling.value = true

    // 防抖处理滚动结束
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    scrollTimer = setTimeout(() => {
      isScrolling.value = false
    }, 150)

    updateVisibleRange()
  }

  /**
   * 设置列表数据
   * @param {Array} newItems - 新的列表数据
   */
  const setItems = (newItems) => {
    items.value = newItems
    manager.setItems(newItems)
    updateVisibleRange()
  }

  /**
   * 滚动到指定索引
   * @param {number} index - 目标索引
   * @param {Object} scrollOptions - 滚动选项
   */
  const scrollToIndex = (index, scrollOptions = { behavior: 'smooth' }) => {
    if (!containerRef.value) return

    const position = manager.scrollToIndex(index)
    const { direction } = options

    if (direction === 'horizontal') {
      containerRef.value.scrollTo({
        left: position,
        ...scrollOptions
      })
    } else {
      containerRef.value.scrollTo({
        top: position,
        ...scrollOptions
      })
    }
  }

  /**
   * 滚动到顶部
   */
  const scrollToTop = () => {
    scrollToIndex(0)
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    scrollToIndex(items.value.length - 1)
  }

  /**
   * 更新项目高度（动态高度模式）
   * @param {number} index - 项目索引
   * @param {HTMLElement} element - 项目DOM元素
   */
  const updateItemHeight = (index, element) => {
    if (!options.dynamicHeight || !element) return

    const { direction } = options
    const height = direction === 'horizontal'
      ? element.offsetWidth
      : element.offsetHeight

    manager.setItemHeight(index, height)
  }

  /**
   * 刷新列表（重新计算高度）
   */
  const refresh = () => {
    manager.clearCache()
    updateVisibleRange()
  }

  // 监听容器尺寸变化
  let resizeObserver = null

  onMounted(() => {
    if (containerRef.value) {
      // 设置容器尺寸
      const { direction } = options
      manager.setContainerSize(
        direction === 'horizontal'
          ? containerRef.value.offsetWidth
          : containerRef.value.offsetHeight
      )

      // 监听容器尺寸变化
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { direction } = options
          manager.setContainerSize(
            direction === 'horizontal'
              ? entry.contentRect.width
              : entry.contentRect.height
          )
          updateVisibleRange()
        }
      })
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
  })

  return {
    // 状态
    items,
    containerRef,
    scrollOffset,
    visibleRange,
    totalSize,
    isScrolling,

    // 方法
    setItems,
    handleScroll,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
    updateItemHeight,
    refresh,

    // 管理器实例（高级用法）
    manager
  }
}

// ============================================
// 无限滚动加载
// ============================================

/**
 * 无限滚动配置
 * @typedef {Object} InfiniteScrollOptions
 * @property {number} threshold - 触发加载的阈值（距离底部的项目数）
 * @property {Function} onLoad - 加载回调函数
 * @property {boolean} immediate - 是否立即加载第一页
 */

/**
 * 无限滚动组合式函数
 * @param {Object} options - 配置选项
 * @returns {Object} 无限滚动状态和方法
 */
export function useInfiniteScroll(options = {}) {
  const {
    threshold = 10,
    onLoad,
    immediate = true
  } = options

  // 状态
  const isLoading = ref(false)
  const isComplete = ref(false)
  const error = ref(null)
  const page = ref(0)
  const hasMore = ref(true)

  /**
   * 加载更多数据
   */
  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    error.value = null

    try {
      const result = await onLoad?.(page.value)

      if (result) {
        const { data, hasMore: more = true } = result
        page.value++
        hasMore.value = more

        if (!more) {
          isComplete.value = true
        }
      }
    } catch (e) {
      error.value = e
      console.error('[InfiniteScroll] 加载失败:', e)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    isLoading.value = false
    isComplete.value = false
    error.value = null
    page.value = 0
    hasMore.value = true
  }

  /**
   * 检查是否需要加载更多
   * @param {number} startIndex - 可见区域起始索引
   * @param {number} endIndex - 可见区域结束索引
   * @param {number} total - 总项目数
   */
  const checkLoadMore = (startIndex, endIndex, total) => {
    if (isLoading.value || !hasMore.value) return

    // 当距离底部的项目数小于阈值时，触发加载
    if (total - endIndex <= threshold) {
      loadMore()
    }
  }

  // 立即加载第一页
  if (immediate) {
    nextTick(() => {
      loadMore()
    })
  }

  return {
    // 状态
    isLoading,
    isComplete,
    error,
    page,
    hasMore,

    // 方法
    loadMore,
    reset,
    checkLoadMore
  }
}

// ============================================
// 滚动位置保持
// ============================================

/**
 * 滚动位置保持配置
 * @typedef {Object} ScrollRestorationOptions
 * @property {string} key - 存储键名
 * @property {Storage} storage - 存储对象
 */

/**
 * 滚动位置保持组合式函数
 * @param {Object} options - 配置选项
 * @returns {Object} 滚动位置保持方法
 */
export function useScrollRestoration(options = {}) {
  const {
    key = 'virtual-list-scroll',
    storage = sessionStorage
  } = options

  /**
   * 保存滚动位置
   * @param {string} id - 列表标识
   * @param {number} position - 滚动位置
   */
  const saveScrollPosition = (id, position) => {
    try {
      const positions = JSON.parse(storage.getItem(key) || '{}')
      positions[id] = position
      storage.setItem(key, JSON.stringify(positions))
    } catch (e) {
      console.warn('[ScrollRestoration] 保存滚动位置失败:', e)
    }
  }

  /**
   * 恢复滚动位置
   * @param {string} id - 列表标识
   * @returns {number} 滚动位置
   */
  const restoreScrollPosition = (id) => {
    try {
      const positions = JSON.parse(storage.getItem(key) || '{}')
      return positions[id] || 0
    } catch (e) {
      console.warn('[ScrollRestoration] 恢复滚动位置失败:', e)
      return 0
    }
  }

  /**
   * 清除滚动位置
   * @param {string} id - 列表标识（可选，不传则清除所有）
   */
  const clearScrollPosition = (id) => {
    try {
      if (id) {
        const positions = JSON.parse(storage.getItem(key) || '{}')
        delete positions[id]
        storage.setItem(key, JSON.stringify(positions))
      } else {
        storage.removeItem(key)
      }
    } catch (e) {
      console.warn('[ScrollRestoration] 清除滚动位置失败:', e)
    }
  }

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition
  }
}

// ============================================
// 虚拟列表组件 Props 定义
// ============================================

/**
 * 虚拟列表组件属性
 */
export const virtualListProps = {
  // 列表数据
  items: {
    type: Array,
    required: true
  },
  // 项目高度（固定高度模式）
  itemHeight: {
    type: Number,
    default: 50
  },
  // 缓冲区大小
  buffer: {
    type: Number,
    default: 5
  },
  // 是否支持动态高度
  dynamicHeight: {
    type: Boolean,
    default: false
  },
  // 预估高度（动态高度模式）
  estimatedHeight: {
    type: Number,
    default: 50
  },
  // 滚动方向
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value)
  },
  // 容器高度
  height: {
    type: [Number, String],
    default: '100%'
  },
  // 容器宽度
  width: {
    type: [Number, String],
    default: '100%'
  },
  // 列表标识（用于滚动位置保持）
  listKey: {
    type: String,
    default: ''
  }
}

// ============================================
// 工具函数
// ============================================

/**
 * 获取样式尺寸
 * @param {number|string} value - 尺寸值
 * @returns {string} CSS尺寸
 */
export function getSizeStyle(value) {
  if (typeof value === 'number') {
    return `${value}px`
  }
  return value
}

/**
 * 获取项目样式
 * @param {number} index - 项目索引
 * @param {Object} manager - 虚拟列表管理器
 * @param {Object} options - 配置选项
 * @returns {Object} 样式对象
 */
export function getItemStyle(index, manager, options) {
  const { direction } = options
  const position = manager.getItemPosition(index)
  const height = manager.getItemHeight(index)

  if (direction === 'horizontal') {
    return {
      position: 'absolute',
      left: `${position}px`,
      top: 0,
      width: `${height}px`,
      height: '100%'
    }
  }

  return {
    position: 'absolute',
    top: `${position}px`,
    left: 0,
    width: '100%',
    height: `${height}px`
  }
}

// ============================================
// 默认导出
// ============================================

export default {
  useVirtualList,
  useInfiniteScroll,
  useScrollRestoration,
  virtualListProps,
  getSizeStyle,
  getItemStyle,
  VirtualListManager
}

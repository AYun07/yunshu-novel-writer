/**
 * 云书 - 虚拟键盘处理组合式函数
 *
 * 功能说明：
 * - 检测键盘显示/隐藏
 * - 调整布局避免键盘遮挡
 * - 输入框自动聚焦和失焦
 * - 键盘高度计算
 *
 * 使用方式：
 * import { useVirtualKeyboard } from '@/composables/useVirtualKeyboard';
 *
 * const {
 *   // 键盘状态
 *   isVisible,          // 键盘是否显示
 *   keyboardHeight,     // 键盘高度
 *   viewportHeight,     // 可视区域高度
 *   originalHeight,     // 原始窗口高度
 *
 *   // 输入框管理
 *   focusedElement,     // 当前聚焦元素
 *   focus,              // 聚焦方法
 *   blur,               // 失焦方法
 *
 *   // 布局调整
 *   adjustLayout,       // 调整布局
 *   scrollToInput,      // 滚动到输入框
 *
 *   // 样式
 *   keyboardStyle,      // 键盘样式变量
 * } = useVirtualKeyboard();
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

// ============================================
// 常量定义
// ============================================

/** 键盘类型 */
export const KeyboardType = {
  DEFAULT: 'default',
  NUMBER: 'number',
  DECIMAL: 'decimal',
  TEL: 'tel',
  SEARCH: 'search',
  EMAIL: 'email',
  URL: 'url',
};

/** 键盘事件类型 */
export const KeyboardEventType = {
  SHOW: 'show',
  HIDE: 'hide',
  HEIGHT_CHANGE: 'heightChange',
};

/** 默认配置 */
const DEFAULT_CONFIG = {
  // 键盘检测阈值（窗口高度变化超过此值认为是键盘弹出）
  heightThreshold: 150,

  // 输入框底部留白（像素）
  inputBottomPadding: 20,

  // 自动滚动到输入框
  autoScrollToInput: true,

  // 滚动行为配置
  scrollBehavior: 'smooth',

  // 是否监听 visualViewport（现代浏览器）
  useVisualViewport: true,

  // iOS 键盘特殊处理
  handleIOSKeyboard: true,

  // Android 键盘特殊处理
  handleAndroidKeyboard: true,
};

// ============================================
// 工具函数
// ============================================

/**
 * 检测是否为 iOS 设备
 * @returns {boolean}
 */
function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * 检测是否为 Android 设备
 * @returns {boolean}
 */
function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * 获取窗口高度
 * @returns {number}
 */
function getWindowHeight() {
  return typeof window !== 'undefined' ? window.innerHeight : 0;
}

/**
 * 获取可视视口高度
 * @returns {number}
 */
function getVisualViewportHeight() {
  if (typeof window === 'undefined') return 0;
  if (window.visualViewport) {
    return window.visualViewport.height;
  }
  return window.innerHeight;
}

/**
 * 获取元素在视口中的位置
 * @param {HTMLElement} element - 元素
 * @returns {Object} 位置信息
 */
function getElementViewportPosition(element) {
  if (!element) return { top: 0, bottom: 0, left: 0, right: 0 };

  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * 平滑滚动元素到可视区域
 * @param {HTMLElement} element - 要滚动的元素
 * @param {Object} options - 滚动选项
 */
function scrollElementIntoView(element, options = {}) {
  if (!element) return;

  const { behavior = 'smooth', block = 'center', inline = 'nearest' } = options;

  // 使用原生 scrollIntoView
  element.scrollIntoView({ behavior, block, inline });
}

// ============================================
// 主组合式函数
// ============================================

/**
 * 虚拟键盘处理组合式函数
 * @param {Object} options - 配置选项
 * @returns {Object} 键盘相关属性和方法
 */
export function useVirtualKeyboard(options = {}) {
  // 合并配置
  const config = { ...DEFAULT_CONFIG, ...options };

  // ============================================
  // 状态
  // ============================================

  /** 键盘是否显示 */
  const isVisible = ref(false);

  /** 键盘高度 */
  const keyboardHeight = ref(0);

  /** 原始窗口高度 */
  const originalHeight = ref(0);

  /** 当前可视区域高度 */
  const viewportHeight = ref(0);

  /** 当前聚焦的元素 */
  const focusedElement = ref(null);

  /** 聚焦元素的原始位置 */
  const focusedElementPosition = ref(null);

  /** 是否正在调整布局 */
  const isAdjusting = ref(false);

  /** 事件处理器列表 */
  const eventHandlers = {
    show: [],
    hide: [],
    heightChange: [],
  };

  // ============================================
  // 计算属性
  // ============================================

  /** 可视区域高度变化 */
  const heightChange = computed(() => {
    if (originalHeight.value === 0) return 0;
    return originalHeight.value - viewportHeight.value;
  });

  /** 键盘样式变量 */
  const keyboardStyle = computed(() => ({
    '--keyboard-height': `${keyboardHeight.value}px`,
    '--viewport-height': `${viewportHeight.value}px`,
    '--keyboard-visible': isVisible.value ? '1' : '0',
  }));

  /** 是否需要调整布局 */
  const needsAdjustment = computed(() => {
    return isVisible.value && focusedElement.value && config.autoScrollToInput;
  });

  // ============================================
  // 事件监听
  // ============================================

  /**
   * 添加键盘事件监听
   * @param {string} type - 事件类型
   * @param {Function} callback - 回调函数
   */
  function on(type, callback) {
    if (eventHandlers[type]) {
      eventHandlers[type].push(callback);
      return () => {
        const index = eventHandlers[type].indexOf(callback);
        if (index > -1) eventHandlers[type].splice(index, 1);
      };
    }
    console.warn(`[useVirtualKeyboard] 未知的事件类型: ${type}`);
    return () => {};
  }

  /**
   * 触发事件
   * @param {string} type - 事件类型
   * @param {Object} data - 事件数据
   */
  function emit(type, data = {}) {
    const handlers = eventHandlers[type];
    if (handlers) {
      handlers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[useVirtualKeyboard] 事件处理错误 (${type}):`, error);
        }
      });
    }
  }

  /**
   * 监听键盘显示
   * @param {Function} callback - 回调函数
   */
  function onShow(callback) {
    return on(KeyboardEventType.SHOW, callback);
  }

  /**
   * 监听键盘隐藏
   * @param {Function} callback - 回调函数
   */
  function onHide(callback) {
    return on(KeyboardEventType.HIDE, callback);
  }

  /**
   * 监听键盘高度变化
   * @param {Function} callback - 回调函数
   */
  function onHeightChange(callback) {
    return on(KeyboardEventType.HEIGHT_CHANGE, callback);
  }

  // ============================================
  // 键盘检测
  // ============================================

  /**
   * 更新键盘状态
   */
  function updateKeyboardState() {
    const currentViewportHeight = getVisualViewportHeight();
    const currentWindowHeight = getWindowHeight();

    // 使用 visualViewport 或 window.innerHeight
    const effectiveHeight = config.useVisualViewport && window.visualViewport
      ? currentViewportHeight
      : currentWindowHeight;

    viewportHeight.value = effectiveHeight;

    // 检测键盘状态变化
    const heightDiff = originalHeight.value - effectiveHeight;
    const wasVisible = isVisible.value;
    const isNowVisible = heightDiff > config.heightThreshold;

    if (isNowVisible !== wasVisible) {
      isVisible.value = isNowVisible;
      keyboardHeight.value = isNowVisible ? heightDiff : 0;

      if (isNowVisible) {
        emit(KeyboardEventType.SHOW, {
          height: keyboardHeight.value,
          viewportHeight: effectiveHeight,
        });
      } else {
        emit(KeyboardEventType.HIDE, {
          viewportHeight: effectiveHeight,
        });
      }
    }

    // 高度变化事件
    if (heightDiff !== heightChange.value) {
      emit(KeyboardEventType.HEIGHT_CHANGE, {
        height: heightDiff,
        viewportHeight: effectiveHeight,
        isVisible: isNowVisible,
      });
    }
  }

  /**
   * 处理 visualViewport 变化（现代浏览器）
   */
  function handleVisualViewportChange() {
    if (!window.visualViewport) return;

    const vv = window.visualViewport;
    viewportHeight.value = vv.height;

    // 计算键盘高度
    const heightDiff = originalHeight.value - vv.height;
    const wasVisible = isVisible.value;
    const isNowVisible = heightDiff > config.heightThreshold;

    if (isNowVisible !== wasVisible) {
      isVisible.value = isNowVisible;
      keyboardHeight.value = isNowVisible ? heightDiff : 0;

      if (isNowVisible) {
        emit(KeyboardEventType.SHOW, {
          height: keyboardHeight.value,
          viewportHeight: vv.height,
          offsetTop: vv.offsetTop,
          offsetLeft: vv.offsetLeft,
          scale: vv.scale,
        });

        // 自动调整布局
        if (config.autoScrollToInput && focusedElement.value) {
          nextTick(() => scrollToInput(focusedElement.value));
        }
      } else {
        emit(KeyboardEventType.HIDE, {
          viewportHeight: vv.height,
        });
      }
    }
  }

  /**
   * 处理窗口大小变化（降级方案）
   */
  function handleResize() {
    if (window.visualViewport && config.useVisualViewport) {
      // 如果支持 visualViewport，优先使用它
      return;
    }

    updateKeyboardState();

    // 自动调整布局
    if (isVisible.value && config.autoScrollToInput && focusedElement.value) {
      nextTick(() => scrollToInput(focusedElement.value));
    }
  }

  // ============================================
  // 输入框管理
  // ============================================

  /**
   * 处理输入框聚焦
   * @param {FocusEvent} event
   */
  function handleFocus(event) {
    const target = event.target;

    // 只处理输入元素
    if (!isInputElement(target)) return;

    focusedElement.value = target;
    focusedElementPosition.value = getElementViewportPosition(target);

    // iOS 特殊处理：延迟调整以确保键盘已弹出
    if (isIOS() && config.handleIOSKeyboard) {
      setTimeout(() => {
        scrollToInput(target);
      }, 300);
    } else if (config.autoScrollToInput) {
      nextTick(() => scrollToInput(target));
    }
  }

  /**
   * 处理输入框失焦
   * @param {FocusEvent} event
   */
  function handleBlur(event) {
    // 延迟清除，以便检查是否是切换到另一个输入框
    setTimeout(() => {
      if (document.activeElement === document.body || !isInputElement(document.activeElement)) {
        focusedElement.value = null;
        focusedElementPosition.value = null;
      }
    }, 100);
  }

  /**
   * 检查元素是否为输入元素
   * @param {Element} element - 元素
   * @returns {boolean}
   */
  function isInputElement(element) {
    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const inputTypes = ['input', 'textarea', 'select'];

    if (!inputTypes.includes(tagName)) {
      // 检查 contenteditable
      return element.isContentEditable;
    }

    // 排除特定类型的 input
    const excludedTypes = ['button', 'submit', 'reset', 'image', 'hidden'];
    if (tagName === 'input') {
      const type = element.type.toLowerCase();
      return !excludedTypes.includes(type);
    }

    return true;
  }

  /**
   * 聚焦到指定元素
   * @param {HTMLElement|string} element - 元素或选择器
   */
  function focus(element) {
    let target = element;

    if (typeof element === 'string') {
      target = document.querySelector(element);
    }

    if (target && isInputElement(target)) {
      target.focus();
      focusedElement.value = target;
    }
  }

  /**
   * 失焦当前元素
   */
  function blur() {
    if (focusedElement.value) {
      focusedElement.value.blur();
    }
    document.activeElement?.blur();
    focusedElement.value = null;
  }

  // ============================================
  // 布局调整
  // ============================================

  /**
   * 滚动到输入框
   * @param {HTMLElement} element - 输入框元素
   * @param {Object} options - 滚动选项
   */
  function scrollToInput(element, options = {}) {
    if (!element) return;

    const {
      padding = config.inputBottomPadding,
      behavior = config.scrollBehavior,
    } = options;

    isAdjusting.value = true;

    const elementPos = getElementViewportPosition(element);
    const viewportBottom = viewportHeight.value;
    const elementBottom = elementPos.bottom;

    // 检查输入框是否被键盘遮挡
    if (elementBottom > viewportBottom - padding) {
      const scrollAmount = elementBottom - viewportBottom + padding;

      // 方法1：使用 scrollIntoView
      scrollElementIntoView(element, { behavior, block: 'center' });

      // 方法2：如果方法1不够，手动滚动
      setTimeout(() => {
        const newPos = getElementViewportPosition(element);
        if (newPos.bottom > viewportHeight.value - padding) {
          window.scrollBy({
            top: newPos.bottom - viewportHeight.value + padding,
            behavior,
          });
        }
      }, 100);
    }

    isAdjusting.value = false;
  }

  /**
   * 调整布局
   * @param {Object} options - 调整选项
   */
  function adjustLayout(options = {}) {
    if (!isVisible.value) return;

    const {
      scrollToFocused = true,
      padding = config.inputBottomPadding,
    } = options;

    if (scrollToFocused && focusedElement.value) {
      scrollToInput(focusedElement.value, { padding });
    }
  }

  /**
   * 获取安全的输入区域高度
   * @returns {number}
   */
  function getSafeInputArea() {
    if (!isVisible.value) return viewportHeight.value;
    return viewportHeight.value - keyboardHeight.value;
  }

  // ============================================
  // iOS 特殊处理
  // ============================================

  /**
   * iOS 键盘处理
   */
  function setupIOSHandling() {
    if (!isIOS() || !config.handleIOSKeyboard) return;

    // iOS 键盘弹出时，页面不会自动调整，需要手动处理
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      // 确保 viewport 设置正确
      let content = metaViewport.getAttribute('content') || '';
      if (!content.includes('viewport-fit=cover')) {
        content += ', viewport-fit=cover';
        metaViewport.setAttribute('content', content);
      }
    }
  }

  // ============================================
  // Android 特殊处理
  // ============================================

  /**
   * Android 键盘处理
   */
  function setupAndroidHandling() {
    if (!isAndroid() || !config.handleAndroidKeyboard) return;

    // Android 键盘会改变 window.innerHeight
    // 确保正确检测
  }

  // ============================================
  // 生命周期
  // ============================================

  onMounted(() => {
    if (typeof window === 'undefined') return;

    // 初始化高度
    originalHeight.value = getWindowHeight();
    viewportHeight.value = getVisualViewportHeight();

    // 设置平台特殊处理
    setupIOSHandling();
    setupAndroidHandling();

    // 监听 visualViewport（现代浏览器）
    if (window.visualViewport && config.useVisualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      window.visualViewport.addEventListener('scroll', handleVisualViewportChange);
    }

    // 监听窗口大小变化（降级方案）
    window.addEventListener('resize', handleResize);

    // 监听输入框聚焦/失焦
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    // 监听键盘事件（辅助检测）
    document.addEventListener('keydown', (e) => {
      // Tab 键切换输入框时调整布局
      if (e.key === 'Tab' && isInputElement(e.target)) {
        setTimeout(() => scrollToInput(e.target), 100);
      }
    });
  });

  onUnmounted(() => {
    if (typeof window === 'undefined') return;

    if (window.visualViewport && config.useVisualViewport) {
      window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      window.visualViewport.removeEventListener('scroll', handleVisualViewportChange);
    }

    window.removeEventListener('resize', handleResize);
    document.removeEventListener('focusin', handleFocus);
    document.removeEventListener('focusout', handleBlur);
  });

  // ============================================
  // 返回值
  // ============================================

  return {
    // 状态
    isVisible,
    keyboardHeight,
    viewportHeight,
    originalHeight,
    heightChange,
    focusedElement,
    isAdjusting,

    // 计算属性
    keyboardStyle,
    needsAdjustment,

    // 事件监听
    on,
    onShow,
    onHide,
    onHeightChange,

    // 输入框管理
    focus,
    blur,
    isInputElement,
    scrollToInput,

    // 布局调整
    adjustLayout,
    getSafeInputArea,

    // 工具
    getElementViewportPosition,
  };
}

// ============================================
// 辅助组合式函数
// ============================================

/**
 * 简单的键盘可见性检测
 * @param {Object} options - 配置选项
 * @returns {Object} 键盘可见性相关属性
 */
export function useKeyboardVisibility(options = {}) {
  const keyboard = useVirtualKeyboard({
    autoScrollToInput: false,
    ...options,
  });

  return {
    isVisible: keyboard.isVisible,
    height: keyboard.keyboardHeight,
    onShow: keyboard.onShow,
    onHide: keyboard.onHide,
  };
}

/**
 * 输入框自动聚焦管理
 * @param {Object} options - 配置选项
 * @returns {Object} 自动聚焦相关属性和方法
 */
export function useAutoFocus(options = {}) {
  const keyboard = useVirtualKeyboard({
    autoScrollToInput: true,
    ...options,
  });

  /**
   * 自动聚焦到第一个输入框
   * @param {HTMLElement} container - 容器元素
   */
  function focusFirstInput(container) {
    if (!container) return;

    const inputs = container.querySelectorAll('input, textarea, select, [contenteditable]');
    for (const input of inputs) {
      if (keyboard.isInputElement(input) && !input.disabled && !input.readOnly) {
        keyboard.focus(input);
        break;
      }
    }
  }

  /**
   * 聚焦到下一个输入框
   */
  function focusNextInput() {
    const current = keyboard.focusedElement.value;
    if (!current) return;

    const inputs = Array.from(document.querySelectorAll('input, textarea, select, [contenteditable]'))
      .filter(el => keyboard.isInputElement(el) && !el.disabled && !el.readOnly);

    const currentIndex = inputs.indexOf(current);
    if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
      keyboard.focus(inputs[currentIndex + 1]);
    }
  }

  /**
   * 聚焦到上一个输入框
   */
  function focusPrevInput() {
    const current = keyboard.focusedElement.value;
    if (!current) return;

    const inputs = Array.from(document.querySelectorAll('input, textarea, select, [contenteditable]'))
      .filter(el => keyboard.isInputElement(el) && !el.disabled && !el.readOnly);

    const currentIndex = inputs.indexOf(current);
    if (currentIndex > 0) {
      keyboard.focus(inputs[currentIndex - 1]);
    }
  }

  return {
    focusedElement: keyboard.focusedElement,
    focus: keyboard.focus,
    blur: keyboard.blur,
    focusFirstInput,
    focusNextInput,
    focusPrevInput,
    isInputElement: keyboard.isInputElement,
  };
}

// 默认导出
export default useVirtualKeyboard;

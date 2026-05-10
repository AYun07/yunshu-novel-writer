/**
 * 云书 - 触摸手势支持组合式函数
 *
 * 功能说明：
 * - 滑动手势（左滑/右滑/上滑/下滑）
 * - 捏合缩放
 * - 长按
 * - 双击
 * - 拖拽
 * - 与鼠标事件的统一抽象
 *
 * 使用方式：
 * import { useTouch } from '@/composables/useTouch';
 *
 * const {
 *   // 绑定元素
 *   bindElement,
 *   unbindElement,
 *
 *   // 手势状态
 *   isSwiping,
 *   swipeDirection,
 *   swipeDistance,
 *   isPinching,
 *   pinchScale,
 *   isLongPress,
 *   isDragging,
 *   dragPosition,
 *
 *   // 事件监听
 *   onSwipe,
 *   onSwipeLeft,
 *   onSwipeRight,
 *   onSwipeUp,
 *   onSwipeDown,
 *   onPinch,
 *   onLongPress,
 *   onDoubleTap,
 *   onDrag,
 *   onTap,
 * } = useTouch();
 *
 * // 在模板中使用
 * <div ref="touchElement">...</div>
 * bindElement(touchElement.value);
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';

// ============================================
// 常量定义
// ============================================

/** 滑动方向 */
export const SwipeDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  NONE: 'none',
};

/** 默认配置 */
const DEFAULT_CONFIG = {
  // 滑动检测阈值
  swipeThreshold: 50,        // 滑动触发阈值（像素）
  swipeVelocity: 0.3,        // 滑动速度阈值（像素/毫秒）
  swipeTimeout: 300,         // 滑动最大持续时间（毫秒）

  // 捏合检测
  pinchThreshold: 0.1,       // 捏合触发阈值

  // 长按检测
  longPressDelay: 500,       // 长按触发延迟（毫秒）
  longPressMoveThreshold: 10, // 长按允许移动阈值（像素）

  // 双击检测
  doubleTapDelay: 300,       // 双击最大间隔（毫秒）
  doubleTapThreshold: 30,    // 双击位置阈值（像素）

  // 拖拽检测
  dragThreshold: 5,          // 拖拽触发阈值（像素）

  // 其他
  preventDefault: true,      // 是否阻止默认行为
  stopPropagation: false,    // 是否阻止事件冒泡
};

// ============================================
// 工具函数
// ============================================

/**
 * 获取触摸点位置
 * @param {TouchEvent|MouseEvent} event - 事件对象
 * @returns {Object} 位置信息
 */
function getPosition(event) {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }
  if (event.changedTouches && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

/**
 * 获取两点间距离
 * @param {Object} p1 - 点1
 * @param {Object} p2 - 点2
 * @returns {number}
 */
function getDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 获取两点间中心点
 * @param {Object} p1 - 点1
 * @param {Object} p2 - 点2
 * @returns {Object}
 */
function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/**
 * 计算滑动方向
 * @param {number} dx - X轴位移
 * @param {number} dy - Y轴位移
 * @returns {string} 方向
 */
function calculateDirection(dx, dy) {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (absX < 10 && absY < 10) {
    return SwipeDirection.NONE;
  }

  if (absX > absY) {
    return dx > 0 ? SwipeDirection.RIGHT : SwipeDirection.LEFT;
  } else {
    return dy > 0 ? SwipeDirection.DOWN : SwipeDirection.UP;
  }
}

// ============================================
// 主组合式函数
// ============================================

/**
 * 触摸手势支持组合式函数
 * @param {Object} options - 配置选项
 * @returns {Object} 手势相关属性和方法
 */
export function useTouch(options = {}) {
  // 合并配置
  const config = { ...DEFAULT_CONFIG, ...options };

  // ============================================
  // 状态
  // ============================================

  /** 绑定的元素 */
  const boundElement = ref(null);

  /** 是否正在滑动 */
  const isSwiping = ref(false);

  /** 滑动方向 */
  const swipeDirection = ref(SwipeDirection.NONE);

  /** 滑动距离 */
  const swipeDistance = ref({ x: 0, y: 0 });

  /** 是否正在捏合 */
  const isPinching = ref(false);

  /** 捏合缩放比例 */
  const pinchScale = ref(1);

  /** 是否长按中 */
  const isLongPress = ref(false);

  /** 是否正在拖拽 */
  const isDragging = ref(false);

  /** 拖拽位置 */
  const dragPosition = ref({ x: 0, y: 0 });

  /** 触摸起始位置 */
  const touchStartPos = ref({ x: 0, y: 0 });

  /** 触摸起始时间 */
  const touchStartTime = ref(0);

  /** 上一次触摸位置 */
  const lastTouchPos = ref({ x: 0, y: 0 });

  /** 上一次触摸时间 */
  const lastTouchTime = ref(0);

  /** 捏合起始距离 */
  const pinchStartDistance = ref(0);

  /** 长按定时器 */
  let longPressTimer = null;

  /** 上一次点击时间 */
  let lastTapTime = 0;

  /** 上一次点击位置 */
  let lastTapPos = { x: 0, y: 0 };

  // ============================================
  // 事件处理器存储
  // ============================================

  const handlers = {
    swipe: [],
    swipeLeft: [],
    swipeRight: [],
    swipeUp: [],
    swipeDown: [],
    pinch: [],
    pinchStart: [],
    pinchEnd: [],
    longPress: [],
    doubleTap: [],
    tap: [],
    drag: [],
    dragStart: [],
    dragEnd: [],
  };

  // ============================================
  // 计算属性
  // ============================================

  /** 滑动速度 */
  const swipeVelocity = computed(() => {
    const dt = Date.now() - touchStartTime.value;
    if (dt === 0) return 0;

    const distance = Math.sqrt(
      swipeDistance.value.x ** 2 + swipeDistance.value.y ** 2
    );
    return distance / dt;
  });

  /** 是否可以触发滑动 */
  const canTriggerSwipe = computed(() => {
    return (
      swipeVelocity.value >= config.swipeVelocity ||
      Math.abs(swipeDistance.value.x) >= config.swipeThreshold ||
      Math.abs(swipeDistance.value.y) >= config.swipeThreshold
    );
  });

  // ============================================
  // 事件监听方法
  // ============================================

  /**
   * 添加滑动事件监听
   * @param {Function} callback - 回调函数
   */
  function onSwipe(callback) {
    handlers.swipe.push(callback);
    return () => {
      const index = handlers.swipe.indexOf(callback);
      if (index > -1) handlers.swipe.splice(index, 1);
    };
  }

  /**
   * 添加左滑事件监听
   * @param {Function} callback - 回调函数
   */
  function onSwipeLeft(callback) {
    handlers.swipeLeft.push(callback);
    return () => {
      const index = handlers.swipeLeft.indexOf(callback);
      if (index > -1) handlers.swipeLeft.splice(index, 1);
    };
  }

  /**
   * 添加右滑事件监听
   * @param {Function} callback - 回调函数
   */
  function onSwipeRight(callback) {
    handlers.swipeRight.push(callback);
    return () => {
      const index = handlers.swipeRight.indexOf(callback);
      if (index > -1) handlers.swipeRight.splice(index, 1);
    };
  }

  /**
   * 添加上滑事件监听
   * @param {Function} callback - 回调函数
   */
  function onSwipeUp(callback) {
    handlers.swipeUp.push(callback);
    return () => {
      const index = handlers.swipeUp.indexOf(callback);
      if (index > -1) handlers.swipeUp.splice(index, 1);
    };
  }

  /**
   * 添加下滑事件监听
   * @param {Function} callback - 回调函数
   */
  function onSwipeDown(callback) {
    handlers.swipeDown.push(callback);
    return () => {
      const index = handlers.swipeDown.indexOf(callback);
      if (index > -1) handlers.swipeDown.splice(index, 1);
    };
  }

  /**
   * 添加捏合事件监听
   * @param {Function} callback - 回调函数
   */
  function onPinch(callback) {
    handlers.pinch.push(callback);
    return () => {
      const index = handlers.pinch.indexOf(callback);
      if (index > -1) handlers.pinch.splice(index, 1);
    };
  }

  /**
   * 添加捏合开始事件监听
   * @param {Function} callback - 回调函数
   */
  function onPinchStart(callback) {
    handlers.pinchStart.push(callback);
    return () => {
      const index = handlers.pinchStart.indexOf(callback);
      if (index > -1) handlers.pinchStart.splice(index, 1);
    };
  }

  /**
   * 添加捏合结束事件监听
   * @param {Function} callback - 回调函数
   */
  function onPinchEnd(callback) {
    handlers.pinchEnd.push(callback);
    return () => {
      const index = handlers.pinchEnd.indexOf(callback);
      if (index > -1) handlers.pinchEnd.splice(index, 1);
    };
  }

  /**
   * 添加长按事件监听
   * @param {Function} callback - 回调函数
   */
  function onLongPress(callback) {
    handlers.longPress.push(callback);
    return () => {
      const index = handlers.longPress.indexOf(callback);
      if (index > -1) handlers.longPress.splice(index, 1);
    };
  }

  /**
   * 添加双击事件监听
   * @param {Function} callback - 回调函数
   */
  function onDoubleTap(callback) {
    handlers.doubleTap.push(callback);
    return () => {
      const index = handlers.doubleTap.indexOf(callback);
      if (index > -1) handlers.doubleTap.splice(index, 1);
    };
  }

  /**
   * 添加点击事件监听
   * @param {Function} callback - 回调函数
   */
  function onTap(callback) {
    handlers.tap.push(callback);
    return () => {
      const index = handlers.tap.indexOf(callback);
      if (index > -1) handlers.tap.splice(index, 1);
    };
  }

  /**
   * 添加拖拽事件监听
   * @param {Function} callback - 回调函数
   */
  function onDrag(callback) {
    handlers.drag.push(callback);
    return () => {
      const index = handlers.drag.indexOf(callback);
      if (index > -1) handlers.drag.splice(index, 1);
    };
  }

  /**
   * 添加拖拽开始事件监听
   * @param {Function} callback - 回调函数
   */
  function onDragStart(callback) {
    handlers.dragStart.push(callback);
    return () => {
      const index = handlers.dragStart.indexOf(callback);
      if (index > -1) handlers.dragStart.splice(index, 1);
    };
  }

  /**
   * 添加拖拽结束事件监听
   * @param {Function} callback - 回调函数
   */
  function onDragEnd(callback) {
    handlers.dragEnd.push(callback);
    return () => {
      const index = handlers.dragEnd.indexOf(callback);
      if (index > -1) handlers.dragEnd.splice(index, 1);
    };
  }

  // ============================================
  // 触发事件
  // ============================================

  /**
   * 触发事件
   * @param {string} type - 事件类型
   * @param {Object} data - 事件数据
   */
  function trigger(type, data = {}) {
    const eventHandlers = handlers[type];
    if (eventHandlers) {
      eventHandlers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[useTouch] 事件处理错误 (${type}):`, error);
        }
      });
    }
  }

  // ============================================
  // 事件处理
  // ============================================

  /**
   * 处理触摸/鼠标开始
   * @param {TouchEvent|MouseEvent} event
   */
  function handleStart(event) {
    if (config.preventDefault && event.type.startsWith('touch')) {
      // 不阻止默认行为，让页面可以正常滚动
      // event.preventDefault();
    }
    if (config.stopPropagation) {
      event.stopPropagation();
    }

    const pos = getPosition(event);
    touchStartPos.value = { ...pos };
    lastTouchPos.value = { ...pos };
    touchStartTime.value = Date.now();

    // 重置状态
    isSwiping.value = false;
    swipeDirection.value = SwipeDirection.NONE;
    swipeDistance.value = { x: 0, y: 0 };
    isDragging.value = false;
    isLongPress.value = false;

    // 处理多点触摸（捏合）
    if (event.touches && event.touches.length === 2) {
      const p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      const p2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
      pinchStartDistance.value = getDistance(p1, p2);
      isPinching.value = true;
      trigger('pinchStart', { scale: 1, center: getCenter(p1, p2) });
      return;
    }

    // 设置长按定时器
    longPressTimer = setTimeout(() => {
      const moveDistance = getDistance(touchStartPos.value, lastTouchPos.value);
      if (moveDistance < config.longPressMoveThreshold) {
        isLongPress.value = true;
        trigger('longPress', {
          x: touchStartPos.value.x,
          y: touchStartPos.value.y,
          originalEvent: event,
        });
      }
    }, config.longPressDelay);
  }

  /**
   * 处理触摸/鼠标移动
   * @param {TouchEvent|MouseEvent} event
   */
  function handleMove(event) {
    if (config.preventDefault && isSwiping.value) {
      event.preventDefault();
    }
    if (config.stopPropagation) {
      event.stopPropagation();
    }

    const pos = getPosition(event);
    const dx = pos.x - touchStartPos.value.x;
    const dy = pos.y - touchStartPos.value.y;

    // 更新滑动距离
    swipeDistance.value = { x: dx, y: dy };

    // 处理捏合
    if (event.touches && event.touches.length === 2 && isPinching.value) {
      const p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      const p2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
      const distance = getDistance(p1, p2);
      const scale = distance / pinchStartDistance.value;
      pinchScale.value = scale;

      trigger('pinch', {
        scale,
        center: getCenter(p1, p2),
        originalEvent: event,
      });
      return;
    }

    // 检测拖拽
    const moveDistance = Math.sqrt(dx * dx + dy * dy);
    if (!isDragging.value && moveDistance > config.dragThreshold) {
      isDragging.value = true;
      trigger('dragStart', {
        x: pos.x,
        y: pos.y,
        dx,
        dy,
        originalEvent: event,
      });
    }

    if (isDragging.value) {
      dragPosition.value = { x: pos.x, y: pos.y };
      trigger('drag', {
        x: pos.x,
        y: pos.y,
        dx: pos.x - lastTouchPos.value.x,
        dy: pos.y - lastTouchPos.value.y,
        totalDx: dx,
        totalDy: dy,
        originalEvent: event,
      });
    }

    // 检测滑动方向
    if (!isSwiping.value) {
      const direction = calculateDirection(dx, dy);
      if (direction !== SwipeDirection.NONE) {
        isSwiping.value = true;
        swipeDirection.value = direction;
      }
    }

    lastTouchPos.value = { ...pos };

    // 如果移动距离超过阈值，取消长按
    if (moveDistance > config.longPressMoveThreshold && longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  /**
   * 处理触摸/鼠标结束
   * @param {TouchEvent|MouseEvent} event
   */
  function handleEnd(event) {
    if (config.stopPropagation) {
      event.stopPropagation();
    }

    // 清除长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    // 处理捏合结束
    if (isPinching.value) {
      isPinching.value = false;
      trigger('pinchEnd', {
        scale: pinchScale.value,
        originalEvent: event,
      });
      pinchScale.value = 1;
      return;
    }

    // 处理拖拽结束
    if (isDragging.value) {
      trigger('dragEnd', {
        x: lastTouchPos.value.x,
        y: lastTouchPos.value.y,
        dx: swipeDistance.value.x,
        dy: swipeDistance.value.y,
        originalEvent: event,
      });
      isDragging.value = false;
    }

    // 处理滑动
    if (isSwiping.value && canTriggerSwipe.value) {
      const direction = swipeDirection.value;
      const data = {
        direction,
        distance: swipeDistance.value,
        velocity: swipeVelocity.value,
        duration: Date.now() - touchStartTime.value,
        originalEvent: event,
      };

      trigger('swipe', data);
      trigger(`swipe${direction.charAt(0).toUpperCase() + direction.slice(1)}`, data);
    }

    // 处理点击/双击
    const dt = Date.now() - touchStartTime.value;
    const moveDistance = getDistance(touchStartPos.value, lastTouchPos.value);

    if (dt < config.swipeTimeout && moveDistance < config.dragThreshold && !isLongPress.value) {
      const now = Date.now();
      const tapInterval = now - lastTapTime;
      const tapDistance = getDistance(lastTapPos, touchStartPos.value);

      if (tapInterval < config.doubleTapDelay && tapDistance < config.doubleTapThreshold) {
        // 双击
        trigger('doubleTap', {
          x: touchStartPos.value.x,
          y: touchStartPos.value.y,
          originalEvent: event,
        });
        lastTapTime = 0;
      } else {
        // 单击（延迟触发以区分双击）
        setTimeout(() => {
          if (Date.now() - lastTapTime >= config.doubleTapDelay) {
            trigger('tap', {
              x: touchStartPos.value.x,
              y: touchStartPos.value.y,
              originalEvent: event,
            });
          }
        }, config.doubleTapDelay);
        lastTapTime = now;
        lastTapPos = { ...touchStartPos.value };
      }
    }

    // 重置状态
    isSwiping.value = false;
    swipeDirection.value = SwipeDirection.NONE;
    swipeDistance.value = { x: 0, y: 0 };
    isLongPress.value = false;
  }

  /**
   * 处理触摸/鼠标取消
   * @param {TouchEvent|MouseEvent} event
   */
  function handleCancel(event) {
    // 清除长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    // 重置所有状态
    isSwiping.value = false;
    isPinching.value = false;
    isLongPress.value = false;
    isDragging.value = false;
    pinchScale.value = 1;
  }

  // ============================================
  // 元素绑定
  // ============================================

  /**
   * 绑定元素
   * @param {HTMLElement} element - 要绑定的元素
   */
  function bindElement(element) {
    if (!element || !(element instanceof HTMLElement)) {
      console.warn('[useTouch] 无效的元素');
      return;
    }

    // 解绑之前的元素
    if (boundElement.value) {
      unbindElement();
    }

    boundElement.value = element;

    // 检测是否支持触摸
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // 触摸事件
      element.addEventListener('touchstart', handleStart, { passive: !config.preventDefault });
      element.addEventListener('touchmove', handleMove, { passive: !config.preventDefault });
      element.addEventListener('touchend', handleEnd);
      element.addEventListener('touchcancel', handleCancel);
    } else {
      // 鼠标事件（降级方案）
      element.addEventListener('mousedown', handleStart);
      element.addEventListener('mousemove', handleMove);
      element.addEventListener('mouseup', handleEnd);
      element.addEventListener('mouseleave', handleCancel);
    }

    // 禁用默认的触摸行为（防止页面滚动干扰）
    element.style.touchAction = 'pan-y';
  }

  /**
   * 解绑元素
   */
  function unbindElement() {
    const element = boundElement.value;
    if (!element) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('touchcancel', handleCancel);
    } else {
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('mouseleave', handleCancel);
    }

    boundElement.value = null;
  }

  // ============================================
  // 生命周期
  // ============================================

  onUnmounted(() => {
    unbindElement();

    // 清除定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  });

  // ============================================
  // 返回值
  // ============================================

  return {
    // 状态
    isSwiping,
    swipeDirection,
    swipeDistance,
    swipeVelocity,
    isPinching,
    pinchScale,
    isLongPress,
    isDragging,
    dragPosition,
    canTriggerSwipe,

    // 元素绑定
    bindElement,
    unbindElement,
    boundElement,

    // 事件监听
    onSwipe,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onPinchStart,
    onPinchEnd,
    onLongPress,
    onDoubleTap,
    onTap,
    onDrag,
    onDragStart,
    onDragEnd,
  };
}

// ============================================
// 辅助组合式函数
// ============================================

/**
 * 简单的滑动检测
 * @param {Object} options - 配置选项
 * @returns {Object} 滑动相关属性和方法
 */
export function useSwipe(options = {}) {
  const touch = useTouch({
    preventDefault: false,
    ...options,
  });

  return {
    isSwiping: touch.isSwiping,
    direction: touch.swipeDirection,
    distance: touch.swipeDistance,
    velocity: touch.swipeVelocity,
    onSwipeLeft: touch.onSwipeLeft,
    onSwipeRight: touch.onSwipeRight,
    onSwipeUp: touch.onSwipeUp,
    onSwipeDown: touch.onSwipeDown,
    bindElement: touch.bindElement,
    unbindElement: touch.unbindElement,
  };
}

/**
 * 简单的长按检测
 * @param {Object} options - 配置选项
 * @returns {Object} 长按相关属性和方法
 */
export function useLongPress(options = {}) {
  const touch = useTouch({
    preventDefault: false,
    ...options,
  });

  return {
    isLongPress: touch.isLongPress,
    onLongPress: touch.onLongPress,
    bindElement: touch.bindElement,
    unbindElement: touch.unbindElement,
  };
}

/**
 * 简单的拖拽检测
 * @param {Object} options - 配置选项
 * @returns {Object} 拖拽相关属性和方法
 */
export function useDrag(options = {}) {
  const touch = useTouch({
    preventDefault: true,
    ...options,
  });

  return {
    isDragging: touch.isDragging,
    position: touch.dragPosition,
    onDrag: touch.onDrag,
    onDragStart: touch.onDragStart,
    onDragEnd: touch.onDragEnd,
    bindElement: touch.bindElement,
    unbindElement: touch.unbindElement,
  };
}

// 默认导出
export default useTouch;

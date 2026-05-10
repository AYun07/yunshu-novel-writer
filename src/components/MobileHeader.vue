<template>
  <!--
    云书 - 移动端顶部标题栏组件

    功能说明：
    - 返回按钮
    - 页面标题
    - 右侧操作按钮
    - 固定在顶部
    - 适配安全区域

    使用方式：
    <MobileHeader title="页面标题" />

    或

    <MobileHeader
      title="页面标题"
      :show-back="true"
      :right-buttons="rightButtons"
      @back="handleBack"
    />
  -->
  <header
    class="mobile-header"
    :class="{
      'mobile-header--safe-area': enableSafeArea,
      'mobile-header--transparent': transparent,
      'mobile-header--borderless': !showBorder,
    }"
    role="banner"
  >
    <!-- 左侧区域 -->
    <div class="mobile-header__left">
      <!-- 返回按钮 -->
      <button
        v-if="showBack"
        class="mobile-header__btn mobile-header__back"
        :aria-label="backText"
        @click="handleBack"
      >
        <el-icon :size="iconSize">
          <component :is="backIcon" />
        </el-icon>
        <span v-if="showBackText" class="mobile-header__back-text">{{ backText }}</span>
      </button>

      <!-- 左侧插槽 -->
      <slot name="left" />
    </div>

    <!-- 中间标题区域 -->
    <div class="mobile-header__center">
      <!-- 标题插槽 -->
      <slot name="title">
        <h1
          v-if="title"
          class="mobile-header__title"
          :class="{ 'mobile-header__title--center': centerTitle }"
        >
          {{ title }}
        </h1>
      </slot>
    </div>

    <!-- 右侧区域 -->
    <div class="mobile-header__right">
      <!-- 右侧按钮组 -->
      <template v-if="rightButtons.length > 0">
        <button
          v-for="(btn, index) in visibleRightButtons"
          :key="index"
          class="mobile-header__btn"
          :class="{
            'mobile-header__btn--primary': btn.primary,
            'mobile-header__btn--text': btn.text,
          }"
          :aria-label="btn.label || btn.text"
          :disabled="btn.disabled"
          @click="handleRightButtonClick(btn, index)"
        >
          <el-icon v-if="btn.icon" :size="iconSize">
            <component :is="btn.icon" />
          </el-icon>
          <span v-if="btn.text" class="mobile-header__btn-text">{{ btn.text }}</span>
          <!-- 徽章 -->
          <span
            v-if="btn.badge"
            class="mobile-header__badge"
            :class="{ 'mobile-header__badge--dot': btn.badgeDot }"
          >
            {{ btn.badgeDot ? '' : btn.badge }}
          </span>
        </button>
      </template>

      <!-- 更多按钮（下拉菜单） -->
      <el-dropdown
        v-if="showMoreButton && moreButtons.length > 0"
        trigger="click"
        placement="bottom-end"
        @command="handleMoreCommand"
      >
        <button
          class="mobile-header__btn"
          :aria-label="moreButtonText"
        >
          <el-icon :size="iconSize">
            <MoreFilled />
          </el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(btn, index) in moreButtons"
              :key="index"
              :command="index"
              :disabled="btn.disabled"
              :divided="btn.divided"
            >
              <el-icon v-if="btn.icon">
                <component :is="btn.icon" />
              </el-icon>
              <span>{{ btn.text }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 右侧插槽 -->
      <slot name="right" />
    </div>
  </header>
</template>

<script setup>
/**
 * 移动端顶部标题栏组件
 *
 * @component MobileHeader
 * @example
 * <MobileHeader title="页面标题" show-back @back="goBack" />
 */
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowLeft,
  MoreFilled,
} from '@element-plus/icons-vue';

// ============================================
// Props 定义
// ============================================

const props = defineProps({
  /**
   * 页面标题
   */
  title: {
    type: String,
    default: '',
  },

  /**
   * 是否显示返回按钮
   */
  showBack: {
    type: Boolean,
    default: true,
  },

  /**
   * 返回按钮图标
   */
  backIcon: {
    type: Object,
    default: () => ArrowLeft,
  },

  /**
   * 返回按钮文字
   */
  backText: {
    type: String,
    default: '返回',
  },

  /**
   * 是否显示返回文字
   */
  showBackText: {
    type: Boolean,
    default: false,
  },

  /**
   * 标题是否居中
   */
  centerTitle: {
    type: Boolean,
    default: true,
  },

  /**
   * 右侧按钮组
   */
  rightButtons: {
    type: Array,
    default: () => [],
  },

  /**
   * 更多按钮列表（下拉菜单）
   */
  moreButtons: {
    type: Array,
    default: () => [],
  },

  /**
   * 是否显示更多按钮
   */
  showMoreButton: {
    type: Boolean,
    default: false,
  },

  /**
   * 更多按钮文字
   */
  moreButtonText: {
    type: String,
    default: '更多',
  },

  /**
   * 图标大小
   */
  iconSize: {
    type: Number,
    default: 20,
  },

  /**
   * 是否启用安全区域适配
   */
  enableSafeArea: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否透明背景
   */
  transparent: {
    type: Boolean,
    default: false,
  },

  /**
   * 是否显示边框
   */
  showBorder: {
    type: Boolean,
    default: true,
  },

  /**
   * 自定义返回处理函数
   */
  customBack: {
    type: Function,
    default: null,
  },

  /**
   * 返回路径
   */
  backTo: {
    type: String,
    default: '',
  },
});

// ============================================
// Emits 定义
// ============================================

const emit = defineEmits([
  'back',
  'rightButtonClick',
  'moreCommand',
]);

// ============================================
// 路由
// ============================================

const router = useRouter();

// ============================================
// 计算属性
// ============================================

/**
 * 可见的右侧按钮（最多显示2个）
 */
const visibleRightButtons = computed(() => {
  return props.rightButtons.slice(0, 2);
});

// ============================================
// 方法
// ============================================

/**
 * 处理返回按钮点击
 */
function handleBack() {
  // 触发自定义返回事件
  emit('back');

  // 如果有自定义返回处理函数
  if (props.customBack) {
    props.customBack();
    return;
  }

  // 如果有指定返回路径
  if (props.backTo) {
    router.push(props.backTo);
    return;
  }

  // 默认返回上一页
  router.back();
}

/**
 * 处理右侧按钮点击
 * @param {Object} btn - 按钮配置
 * @param {number} index - 按钮索引
 */
function handleRightButtonClick(btn, index) {
  if (btn.disabled) return;

  emit('rightButtonClick', btn, index);

  // 如果按钮有处理函数，调用它
  if (btn.handler && typeof btn.handler === 'function') {
    btn.handler(btn, index);
  }
}

/**
 * 处理更多菜单命令
 * @param {number} index - 选中的索引
 */
function handleMoreCommand(index) {
  const btn = props.moreButtons[index];
  if (!btn || btn.disabled) return;

  emit('moreCommand', btn, index);

  // 如果按钮有处理函数，调用它
  if (btn.handler && typeof btn.handler === 'function') {
    btn.handler(btn, index);
  }
}
</script>

<style scoped>
/* ============================================
   移动端顶部标题栏样式
   ============================================ */

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height, 56px);
  padding: 0 var(--spacing-md, 16px);
  background-color: var(--background-light);
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* 透明背景 */
.mobile-header--transparent {
  background-color: transparent;
  border-bottom-color: transparent;
}

/* 无边框 */
.mobile-header--borderless {
  border-bottom: none;
}

/* 安全区域适配 */
.mobile-header--safe-area {
  padding-top: env(safe-area-inset-top, 0px);
  height: calc(var(--header-height, 56px) + env(safe-area-inset-top, 0px));
}

/* 左侧区域 */
.mobile-header__left {
  display: flex;
  align-items: center;
  min-width: 60px;
  flex-shrink: 0;
}

/* 中间区域 */
.mobile-header__center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 0 var(--spacing-sm, 8px);
}

/* 右侧区域 */
.mobile-header__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 60px;
  flex-shrink: 0;
  gap: 4px;
}

/* 标题 */
.mobile-header__title {
  font-size: var(--font-size-large, 18px);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}

.mobile-header__title--center {
  text-align: center;
}

/* 按钮基础样式 */
.mobile-header__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 36px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--font-size-base, 14px);
  cursor: pointer;
  border-radius: var(--radius-md, 8px);
  transition: all 0.2s ease;
  position: relative;
}

.mobile-header__btn:hover {
  background-color: var(--background-dark);
}

.mobile-header__btn:active {
  opacity: 0.8;
}

.mobile-header__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 返回按钮 */
.mobile-header__back {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
  margin-left: -8px;
}

.mobile-header__back-text {
  font-size: var(--font-size-base, 14px);
  color: var(--text-primary);
}

/* 按钮文字 */
.mobile-header__btn-text {
  margin-left: 4px;
  font-size: var(--font-size-base, 14px);
  white-space: nowrap;
}

/* 主要按钮样式 */
.mobile-header__btn--primary {
  color: var(--primary-color);
}

.mobile-header__btn--primary:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

/* 文字按钮样式 */
.mobile-header__btn--text {
  padding: 0 12px;
}

/* 徽章 */
.mobile-header__badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: var(--danger-color);
  color: white;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
  border: 2px solid var(--background-light);
}

.mobile-header__badge--dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
}

/* ============================================
   响应式适配
   ============================================ */

/* 小屏幕手机 */
@media (max-width: 375px) {
  .mobile-header {
    padding: 0 var(--spacing-sm, 8px);
  }

  .mobile-header__btn {
    height: 32px;
    min-width: 32px;
  }

  .mobile-header__title {
    font-size: var(--font-size-medium, 16px);
  }
}

/* 平板设备 */
@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

/* ============================================
   深色模式适配
   ============================================ */

@media (prefers-color-scheme: dark) {
  .mobile-header {
    background-color: var(--background-dark);
    border-bottom-color: var(--border-base);
  }

  .mobile-header--transparent {
    background-color: transparent;
    border-bottom-color: transparent;
  }

  .mobile-header__badge {
    border-color: var(--background-dark);
  }
}

/* ============================================
   无障碍支持
   ============================================ */

/* 焦点样式 */
.mobile-header__btn:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.mobile-header__title:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 4px;
  border-radius: 4px;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .mobile-header,
  .mobile-header__btn {
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: more) {
  .mobile-header {
    border-bottom-width: 2px;
  }
}
</style>

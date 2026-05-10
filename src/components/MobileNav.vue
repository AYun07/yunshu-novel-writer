<template>
  <!--
    云书 - 移动端底部导航栏组件

    功能说明：
    - 5个主要入口（首页、创作、项目、工具、我的）
    - 图标+文字
    - 当前页面高亮
    - 中间突出按钮（快速创作）
    - 适配安全区域

    使用方式：
    <MobileNav v-model="activeTab" @create="handleCreate" />

    或

    <MobileNav
      :items="customItems"
      v-model="activeTab"
      @change="handleChange"
      @create="handleCreate"
    />
  -->
  <nav
    class="mobile-nav"
    :class="{
      'mobile-nav--safe-area': enableSafeArea,
      'mobile-nav--keyboard-visible': keyboardVisible,
    }"
    role="navigation"
    aria-label="主导航"
  >
    <!-- 导航项列表 -->
    <div class="mobile-nav__items">
      <template v-for="(item, index) in displayItems" :key="item.key">
        <!-- 中间突出按钮位置 -->
        <div
          v-if="index === centerButtonPosition"
          class="mobile-nav__center-wrapper"
        >
          <button
            class="mobile-nav__center-btn"
            :class="{ 'mobile-nav__center-btn--active': centerButtonActive }"
            :style="centerButtonStyle"
            @click="handleCenterClick"
            :aria-label="centerButtonText"
            role="button"
          >
            <el-icon :size="centerButtonIconSize">
              <component :is="centerButtonIcon" />
            </el-icon>
          </button>
          <span class="mobile-nav__center-text">{{ centerButtonText }}</span>
        </div>

        <!-- 普通导航项 -->
        <router-link
          v-if="item.to"
          :to="item.to"
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--active': isActive(item),
            'mobile-nav__item--disabled': item.disabled,
          }"
          :aria-current="isActive(item) ? 'page' : undefined"
          :aria-label="item.label"
          @click="handleItemClick(item, index)"
        >
          <div class="mobile-nav__icon-wrapper">
            <el-icon :size="iconSize" class="mobile-nav__icon">
              <component :is="isActive(item) && item.activeIcon ? item.activeIcon : item.icon" />
            </el-icon>
            <!-- 徽章 -->
            <span
              v-if="item.badge"
              class="mobile-nav__badge"
              :class="{ 'mobile-nav__badge--dot': item.badgeDot }"
            >
              {{ item.badgeDot ? '' : item.badge }}
            </span>
          </div>
          <span class="mobile-nav__label">{{ item.label }}</span>
        </router-link>

        <!-- 普通按钮导航项 -->
        <button
          v-else
          class="mobile-nav__item"
          :class="{
            'mobile-nav__item--active': isActive(item),
            'mobile-nav__item--disabled': item.disabled,
          }"
          :aria-label="item.label"
          :disabled="item.disabled"
          @click="handleItemClick(item, index)"
        >
          <div class="mobile-nav__icon-wrapper">
            <el-icon :size="iconSize" class="mobile-nav__icon">
              <component :is="isActive(item) && item.activeIcon ? item.activeIcon : item.icon" />
            </el-icon>
            <!-- 徽章 -->
            <span
              v-if="item.badge"
              class="mobile-nav__badge"
              :class="{ 'mobile-nav__badge--dot': item.badgeDot }"
            >
              {{ item.badgeDot ? '' : item.badge }}
            </span>
          </div>
          <span class="mobile-nav__label">{{ item.label }}</span>
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
/**
 * 移动端底部导航栏组件
 *
 * @component MobileNav
 * @example
 * <MobileNav v-model="activeTab" />
 */
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  HomeFilled,
  EditPen,
  FolderOpened,
  Tools,
  UserFilled,
  Plus,
} from '@element-plus/icons-vue';

// ============================================
// Props 定义
// ============================================

const props = defineProps({
  /**
   * 当前激活的导航项
   */
  modelValue: {
    type: String,
    default: 'home',
  },

  /**
   * 自定义导航项
   */
  items: {
    type: Array,
    default: () => [],
  },

  /**
   * 是否启用安全区域适配
   */
  enableSafeArea: {
    type: Boolean,
    default: true,
  },

  /**
   * 键盘是否可见（用于隐藏导航栏）
   */
  keyboardVisible: {
    type: Boolean,
    default: false,
  },

  /**
   * 中间按钮位置（索引）
   */
  centerButtonPosition: {
    type: Number,
    default: 2, // 默认在第3个位置
  },

  /**
   * 中间按钮图标
   */
  centerButtonIcon: {
    type: Object,
    default: () => Plus,
  },

  /**
   * 中间按钮文字
   */
  centerButtonText: {
    type: String,
    default: '创作',
  },

  /**
   * 中间按钮图标大小
   */
  centerButtonIconSize: {
    type: Number,
    default: 24,
  },

  /**
   * 中间按钮背景色
   */
  centerButtonColor: {
    type: String,
    default: '',
  },

  /**
   * 图标大小
   */
  iconSize: {
    type: Number,
    default: 22,
  },

  /**
   * 是否使用路由匹配激活状态
   */
  useRouteMatch: {
    type: Boolean,
    default: true,
  },
});

// ============================================
// Emits 定义
// ============================================

const emit = defineEmits([
  'update:modelValue',
  'change',
  'create',
  'itemClick',
]);

// ============================================
// 路由
// ============================================

const route = useRoute();

// ============================================
// 默认导航项
// ============================================

const defaultItems = [
  {
    key: 'home',
    label: '首页',
    icon: HomeFilled,
    to: '/',
  },
  {
    key: 'projects',
    label: '项目',
    icon: FolderOpened,
    to: '/novels',
  },
  {
    key: 'placeholder', // 占位符，用于中间按钮
    label: '',
    icon: null,
  },
  {
    key: 'tools',
    label: '工具',
    icon: Tools,
    to: '/tools',
  },
  {
    key: 'profile',
    label: '我的',
    icon: UserFilled,
    to: '/settings',
  },
];

// ============================================
// 计算属性
// ============================================

/**
 * 显示的导航项
 */
const displayItems = computed(() => {
  if (props.items.length > 0) {
    return props.items;
  }
  return defaultItems;
});

/**
 * 中间按钮样式
 */
const centerButtonStyle = computed(() => {
  if (props.centerButtonColor) {
    return {
      backgroundColor: props.centerButtonColor,
    };
  }
  return {};
});

/**
 * 中间按钮是否激活
 */
const centerButtonActive = computed(() => {
  return props.modelValue === 'create';
});

// ============================================
// 方法
// ============================================

/**
 * 检查导航项是否激活
 * @param {Object} item - 导航项
 * @returns {boolean}
 */
function isActive(item) {
  // 如果启用了路由匹配，优先使用路由匹配
  if (props.useRouteMatch && item.to && route.path) {
    const itemPath = item.to;
    const currentPath = route.path;

    // 精确匹配或前缀匹配
    if (itemPath === currentPath || currentPath.startsWith(itemPath + '/')) {
      return true;
    }
  }

  // 使用 modelValue 匹配
  return props.modelValue === item.key;
}

/**
 * 处理导航项点击
 * @param {Object} item - 导航项
 * @param {number} index - 索引
 */
function handleItemClick(item, index) {
  if (item.disabled) return;

  // 触发事件
  emit('itemClick', item, index);
  emit('change', item.key, item);
  emit('update:modelValue', item.key);
}

/**
 * 处理中间按钮点击
 */
function handleCenterClick() {
  emit('create');
  emit('update:modelValue', 'create');
}

// ============================================
// 监听路由变化
// ============================================

if (props.useRouteMatch) {
  watch(
    () => route.path,
    (newPath) => {
      // 根据路由自动更新激活状态
      for (const item of displayItems.value) {
        if (item.to && (item.to === newPath || newPath.startsWith(item.to + '/'))) {
          emit('update:modelValue', item.key);
          break;
        }
      }
    },
    { immediate: true }
  );
}
</script>

<style scoped>
/* ============================================
   移动端底部导航栏样式
   ============================================ */

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--background-light);
  border-top: 1px solid var(--border-light);
  transition: transform 0.3s ease;
}

/* 键盘可见时隐藏导航栏 */
.mobile-nav--keyboard-visible {
  transform: translateY(100%);
}

/* 安全区域适配 */
.mobile-nav--safe-area {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* 导航项容器 */
.mobile-nav__items {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: var(--bottom-nav-height, 64px);
  padding: 0 var(--spacing-sm, 8px);
}

/* 普通导航项 */
.mobile-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  padding: 4px 0;
  color: var(--text-secondary);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
}

.mobile-nav__item:hover {
  color: var(--text-regular);
}

.mobile-nav__item:active {
  opacity: 0.8;
}

/* 激活状态 */
.mobile-nav__item--active {
  color: var(--primary-color);
}

.mobile-nav__item--active .mobile-nav__icon {
  transform: scale(1.1);
}

/* 禁用状态 */
.mobile-nav__item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 图标容器 */
.mobile-nav__icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-bottom: 2px;
}

.mobile-nav__icon {
  transition: transform 0.2s ease;
}

/* 徽章 */
.mobile-nav__badge {
  position: absolute;
  top: -4px;
  right: -6px;
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

.mobile-nav__badge--dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
}

/* 标签文字 */
.mobile-nav__label {
  font-size: 10px;
  line-height: 1.2;
  white-space: nowrap;
}

/* 中间按钮容器 */
.mobile-nav__center-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  height: 100%;
  position: relative;
}

/* 中间突出按钮 */
.mobile-nav__center-btn {
  position: relative;
  top: -16px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: 4px solid var(--background-light);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transition: all 0.2s ease;
}

.mobile-nav__center-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.5);
}

.mobile-nav__center-btn:active {
  transform: scale(0.95);
}

.mobile-nav__center-btn--active {
  background: var(--primary-dark);
}

/* 中间按钮文字 */
.mobile-nav__center-text {
  position: relative;
  top: -12px;
  font-size: 10px;
  color: var(--text-secondary);
  line-height: 1.2;
}

/* ============================================
   响应式适配
   ============================================ */

/* 小屏幕手机 */
@media (max-width: 375px) {
  .mobile-nav__items {
    height: 56px;
  }

  .mobile-nav__icon-wrapper {
    width: 24px;
    height: 24px;
  }

  .mobile-nav__center-btn {
    width: 48px;
    height: 48px;
    top: -14px;
  }

  .mobile-nav__center-text {
    top: -10px;
  }

  .mobile-nav__label,
  .mobile-nav__center-text {
    font-size: 9px;
  }
}

/* 大屏幕手机 */
@media (min-width: 414px) {
  .mobile-nav__items {
    height: 68px;
  }

  .mobile-nav__center-btn {
    width: 56px;
    height: 56px;
    top: -18px;
  }

  .mobile-nav__center-text {
    top: -14px;
  }
}

/* 平板设备 */
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}

/* ============================================
   深色模式适配
   ============================================ */

@media (prefers-color-scheme: dark) {
  .mobile-nav {
    background-color: var(--background-dark);
    border-top-color: var(--border-base);
  }

  .mobile-nav__badge {
    border-color: var(--background-dark);
  }

  .mobile-nav__center-btn {
    border-color: var(--background-dark);
  }
}

/* ============================================
   无障碍支持
   ============================================ */

/* 焦点样式 */
.mobile-nav__item:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: -2px;
  border-radius: 8px;
}

.mobile-nav__center-btn:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .mobile-nav,
  .mobile-nav__item,
  .mobile-nav__icon,
  .mobile-nav__center-btn {
    transition: none;
  }

  .mobile-nav__center-btn:hover {
    transform: none;
  }
}
</style>

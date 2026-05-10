<template>
  <!--
    云书 - 响应式布局容器组件

    功能说明：
    - 根据屏幕尺寸自动选择 MobileLayout 或 DesktopLayout
    - 过渡动画
    - 统一的数据传递和事件处理

    使用方式：
    <ResponsiveLayout title="页面标题">
      <div>页面内容</div>
    </ResponsiveLayout>
  -->
  <div class="responsive-layout">
    <!-- 移动端布局 -->
    <MobileLayout
      v-if="isMobile"
      :title="title"
      :show-back="showBack"
      :back-to="backTo"
      :header-right-buttons="headerRightButtons"
      :header-more-buttons="headerMoreButtons"
      :show-more-button="showMoreButton"
      :header-transparent="headerTransparent"
      :header-show-border="headerShowBorder"
      :show-nav="showNav"
      :active-tab="activeTab"
      :enable-pull-refresh="enablePullRefresh"
      :enable-load-more="enableLoadMore"
      :show-load-more="showLoadMore"
      :is-loading-more="isLoadingMore"
      :load-more-text="loadMoreText"
      :show-back-to-top="showBackToTop"
      @back="handleBack"
      @header-right-click="handleHeaderRightClick"
      @header-more-command="handleHeaderMoreCommand"
      @nav-change="handleNavChange"
      @nav-create="handleNavCreate"
      @refresh="handleRefresh"
      @load-more="handleLoadMore"
      @scroll="handleScroll"
    >
      <template #header-left>
        <slot name="header-left" />
      </template>
      <template #header-title>
        <slot name="header-title" />
      </template>
      <template #header-right>
        <slot name="header-right" />
      </template>
      <slot />
    </MobileLayout>

    <!-- 桌面端布局 -->
    <DesktopLayout
      v-else
      :show-sidebar="showSidebar"
      :sidebar-width="sidebarWidth"
      :resizable="resizable"
      :collapsible="collapsible"
      :default-collapsed="defaultCollapsed"
      :show-sidebar-header="showSidebarHeader"
      :show-sidebar-footer="showSidebarFooter"
      :show-collapse-btn="showCollapseBtn"
      :show-header="showHeader"
      :show-breadcrumb="showBreadcrumb"
      :show-search="showSearch"
      :show-notification="showNotification"
      :notification-count="notificationCount"
      :show-fullscreen="showFullscreen"
      :show-settings="showSettings"
      :show-tabs="showTabs"
      :tabs="tabs"
      :active-tab-path="activeTabPath"
      :show-footer="showFooter"
      :no-content-padding="noContentPadding"
      :breadcrumbs="breadcrumbs"
      @collapse-change="handleCollapseChange"
      @width-change="handleWidthChange"
      @tab-change="handleTabChange"
      @tab-remove="handleTabRemove"
      @notification-click="handleNotificationClick"
      @settings-click="handleSettingsClick"
      @content-scroll="handleContentScroll"
    >
      <template #logo>
        <slot name="logo" />
      </template>
      <template #sidebar>
        <slot name="sidebar" />
      </template>
      <template #sidebar-footer>
        <slot name="sidebar-footer" />
      </template>
      <template #header>
        <slot name="desktop-header" />
      </template>
      <template #header-tools>
        <slot name="header-tools" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
      <slot />
    </DesktopLayout>
  </div>
</template>

<script setup>
/**
 * 响应式布局容器组件
 *
 * @component ResponsiveLayout
 * @description 根据屏幕尺寸自动切换移动端和桌面端布局
 *
 * @example
 * <ResponsiveLayout title="页面标题" show-back>
 *   <div>页面内容</div>
 * </ResponsiveLayout>
 */
import { computed, watch } from 'vue';
import MobileLayout from './MobileLayout.vue';
import DesktopLayout from './DesktopLayout.vue';
import { useResponsive } from '@/composables/useResponsive.js';

// ============================================
// Props 定义 - 移动端特有
// ============================================

const props = defineProps({
  // ========== 通用配置 ==========
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
   * 返回路径
   */
  backTo: {
    type: String,
    default: '',
  },

  // ========== 移动端配置 ==========
  /**
   * 顶部右侧按钮组
   */
  headerRightButtons: {
    type: Array,
    default: () => [],
  },

  /**
   * 顶部更多按钮列表
   */
  headerMoreButtons: {
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
   * 标题栏是否透明
   */
  headerTransparent: {
    type: Boolean,
    default: false,
  },

  /**
   * 是否显示标题栏边框
   */
  headerShowBorder: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示底部导航
   */
  showNav: {
    type: Boolean,
    default: true,
  },

  /**
   * 当前激活的导航项
   */
  activeTab: {
    type: String,
    default: '',
  },

  /**
   * 是否启用下拉刷新
   */
  enablePullRefresh: {
    type: Boolean,
    default: false,
  },

  /**
   * 是否启用加载更多
   */
  enableLoadMore: {
    type: Boolean,
    default: false,
  },

  /**
   * 是否显示加载更多
   */
  showLoadMore: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否正在加载更多
   */
  isLoadingMore: {
    type: Boolean,
    default: false,
  },

  /**
   * 加载更多提示文字
   */
  loadMoreText: {
    type: String,
    default: '加载更多',
  },

  /**
   * 是否显示回到顶部按钮
   */
  showBackToTop: {
    type: Boolean,
    default: true,
  },

  // ========== 桌面端配置 ==========
  /**
   * 是否显示侧边栏
   */
  showSidebar: {
    type: Boolean,
    default: true,
  },

  /**
   * 侧边栏宽度
   */
  sidebarWidth: {
    type: Number,
    default: 260,
  },

  /**
   * 是否可调整侧边栏宽度
   */
  resizable: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否可折叠
   */
  collapsible: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否默认折叠
   */
  defaultCollapsed: {
    type: Boolean,
    default: false,
  },

  /**
   * 是否显示侧边栏头部
   */
  showSidebarHeader: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示侧边栏底部
   */
  showSidebarFooter: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示折叠按钮
   */
  showCollapseBtn: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示顶部标题栏
   */
  showHeader: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示面包屑
   */
  showBreadcrumb: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示搜索
   */
  showSearch: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示通知
   */
  showNotification: {
    type: Boolean,
    default: true,
  },

  /**
   * 通知数量
   */
  notificationCount: {
    type: Number,
    default: 0,
  },

  /**
   * 是否显示全屏按钮
   */
  showFullscreen: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示设置按钮
   */
  showSettings: {
    type: Boolean,
    default: true,
  },

  /**
   * 是否显示标签页
   */
  showTabs: {
    type: Boolean,
    default: false,
  },

  /**
   * 标签页列表
   */
  tabs: {
    type: Array,
    default: () => [],
  },

  /**
   * 当前激活的标签页
   */
  activeTabPath: {
    type: String,
    default: '',
  },

  /**
   * 是否显示底部
   */
  showFooter: {
    type: Boolean,
    default: false,
  },

  /**
   * 内容区域是否无内边距
   */
  noContentPadding: {
    type: Boolean,
    default: false,
  },

  /**
   * 面包屑配置
   */
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
});

// ============================================
// Emits 定义
// ============================================

const emit = defineEmits([
  // 移动端事件
  'back',
  'headerRightClick',
  'headerMoreCommand',
  'navChange',
  'navCreate',
  'refresh',
  'loadMore',
  'scroll',

  // 桌面端事件
  'collapseChange',
  'widthChange',
  'tabChange',
  'tabRemove',
  'notificationClick',
  'settingsClick',
  'contentScroll',
]);

// ============================================
// 响应式检测
// ============================================

const responsive = useResponsive();

/**
 * 是否为移动端
 */
const isMobile = computed(() => responsive.isMobile.value);

// ============================================
// 事件处理 - 移动端
// ============================================

function handleBack() {
  emit('back');
}

function handleHeaderRightClick(btn, index) {
  emit('headerRightClick', btn, index);
}

function handleHeaderMoreCommand(btn, index) {
  emit('headerMoreCommand', btn, index);
}

function handleNavChange(key, item) {
  emit('navChange', key, item);
}

function handleNavCreate() {
  emit('navCreate');
}

function handleRefresh(done) {
  emit('refresh', done);
}

function handleLoadMore() {
  emit('loadMore');
}

function handleScroll(event) {
  emit('scroll', event);
}

// ============================================
// 事件处理 - 桌面端
// ============================================

function handleCollapseChange(collapsed) {
  emit('collapseChange', collapsed);
}

function handleWidthChange(width) {
  emit('widthChange', width);
}

function handleTabChange(path) {
  emit('tabChange', path);
}

function handleTabRemove(path) {
  emit('tabRemove', path);
}

function handleNotificationClick() {
  emit('notificationClick');
}

function handleSettingsClick() {
  emit('settingsClick');
}

function handleContentScroll(event) {
  emit('contentScroll', event);
}

// ============================================
// 监听断点变化
// ============================================

watch(
  () => responsive.breakpoint.value,
  (newBreakpoint, oldBreakpoint) => {
    console.log(`[ResponsiveLayout] 布局切换: ${oldBreakpoint} -> ${newBreakpoint}`);
  }
);
</script>

<style scoped>
/* ============================================
   响应式布局容器样式
   ============================================ */

.responsive-layout {
  width: 100%;
  height: 100%;
}

/* 布局切换过渡动画 */
.responsive-layout > * {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .responsive-layout > * {
    animation: none;
  }
}
</style>

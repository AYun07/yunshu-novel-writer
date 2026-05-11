<template>
  <!--
    云书 - 桌面端布局容器组件

    功能说明：
    - 左侧侧边栏
    - 右侧内容区
    - 可调整侧边栏宽度
    - 支持多窗口/多标签

    使用方式：
    <DesktopLayout>
      <template #sidebar>
        <div>侧边栏内容</div>
      </template>
      <div>主内容区</div>
    </DesktopLayout>
  -->
  <div
    class="desktop-layout"
    :class="{
      'desktop-layout--collapsed': isCollapsed,
      'desktop-layout--resizing': isResizing,
      'desktop-layout--mini': isMiniSidebar,
    }"
  >
    <!-- 侧边栏 -->
    <aside
      v-if="showSidebar"
      ref="sidebarRef"
      class="desktop-layout__sidebar"
      :style="sidebarStyle"
      role="navigation"
      aria-label="主导航"
    >
      <!-- 侧边栏头部 -->
      <div v-if="showSidebarHeader" class="desktop-layout__sidebar-header">
        <!-- Logo 区域 -->
        <div class="desktop-layout__logo">
          <slot name="logo">
            <div class="desktop-layout__logo-default">
              <el-icon :size="28" class="desktop-layout__logo-icon">
                <Reading />
              </el-icon>
              <span v-if="!isCollapsed" class="desktop-layout__logo-text">云书</span>
            </div>
          </slot>
        </div>

        <!-- 折叠按钮 -->
        <button
          v-if="showCollapseBtn"
          class="desktop-layout__collapse-btn"
          :aria-label="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
          @click="toggleCollapse"
        >
          <el-icon :size="16">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </button>
      </div>

      <!-- 侧边栏内容 -->
      <div class="desktop-layout__sidebar-content">
        <slot name="sidebar">
          <!-- 默认导航菜单 -->
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapsed"
            :collapse-transition="false"
            router
            class="desktop-layout__menu"
          >
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>
              <template #title>首页</template>
            </el-menu-item>
            <el-menu-item index="/novels">
              <el-icon><FolderOpened /></el-icon>
              <template #title>我的项目</template>
            </el-menu-item>
            <el-menu-item index="/tools">
              <el-icon><Tools /></el-icon>
              <template #title>写作工具</template>
            </el-menu-item>
            <el-menu-item index="/settings">
              <el-icon><Setting /></el-icon>
              <template #title>设置</template>
            </el-menu-item>
          </el-menu>
        </slot>
      </div>

      <!-- 侧边栏底部 -->
      <div v-if="showSidebarFooter" class="desktop-layout__sidebar-footer">
        <slot name="sidebar-footer">
          <!-- 用户信息 -->
          <div class="desktop-layout__user">
            <el-avatar :size="isCollapsed ? 32 : 36" :icon="UserFilled" />
            <div v-if="!isCollapsed" class="desktop-layout__user-info">
              <div class="desktop-layout__user-name">用户</div>
              <div class="desktop-layout__user-role">作者</div>
            </div>
          </div>
        </slot>
      </div>

      <!-- 拖拽调整宽度手柄 -->
      <div
        v-if="resizable"
        class="desktop-layout__resize-handle"
        :class="{ 'desktop-layout__resize-handle--active': isResizing }"
        @mousedown="handleResizeStart"
        @touchstart="handleResizeStart"
      />
    </aside>

    <!-- 主内容区域 -->
    <main class="desktop-layout__main">
      <!-- 顶部工具栏 -->
      <header
        v-if="showHeader"
        class="desktop-layout__header"
        role="banner"
      >
        <!-- 面包屑导航 -->
        <div v-if="showBreadcrumb" class="desktop-layout__breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumbs"
              :key="index"
              :to="item.path"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 头部插槽 -->
        <div class="desktop-layout__header-content">
          <slot name="header" />
        </div>

        <!-- 头部右侧工具 -->
        <div class="desktop-layout__header-tools">
          <slot name="header-tools">
            <!-- 搜索 -->
            <el-input
              v-if="showSearch"
              v-model="searchQuery"
              placeholder="搜索..."
              class="desktop-layout__search"
              :prefix-icon="Search"
              clearable
            />

            <!-- 通知 -->
            <el-badge v-if="showNotification" :value="notificationCount" class="desktop-layout__notification">
              <el-button :icon="Bell" circle @click="handleNotificationClick" />
            </el-badge>

            <!-- 全屏 -->
            <el-button
              v-if="showFullscreen"
              :icon="isFullscreen ? FullScreen : Crop"
              circle
              @click="toggleFullscreen"
            />

            <!-- 设置 -->
            <el-button
              v-if="showSettings"
              :icon="Setting"
              circle
              @click="handleSettingsClick"
            />
          </slot>
        </div>
      </header>

      <!-- 标签页导航 -->
      <div
        v-if="showTabs"
        class="desktop-layout__tabs"
      >
        <el-tabs
          v-model="activeTab"
          type="card"
          closable
          @tab-remove="handleTabRemove"
          @tab-click="handleTabClick"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.path"
            :label="tab.title"
            :name="tab.path"
          />
        </el-tabs>
      </div>

      <!-- 内容区域 -->
      <div
        ref="contentRef"
        class="desktop-layout__content"
        :class="{ 'desktop-layout__content--no-padding': noContentPadding }"
        @scroll="handleContentScroll"
      >
        <!-- 页面内容 -->
        <slot />
      </div>

      <!-- 底部 -->
      <footer
        v-if="showFooter"
        class="desktop-layout__footer"
      >
        <slot name="footer">
          <div class="desktop-layout__footer-default">
            <span>云书 - 专业小说创作平台</span>
            <span>© 2024 云书</span>
          </div>
        </slot>
      </footer>
    </main>

    <!-- 更新对话框 -->
    <UpdateDialog />
  </div>
</template>

<script setup>
/**
 * 桌面端布局容器组件
 *
 * @component DesktopLayout
 * @example
 * <DesktopLayout>
 *   <template #sidebar>
 *     <div>自定义侧边栏</div>
 *   </template>
 *   <div>主内容区</div>
 * </DesktopLayout>
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Reading,
  HomeFilled,
  FolderOpened,
  Tools,
  Setting,
  UserFilled,
  Fold,
  Expand,
  Search,
  Bell,
  FullScreen,
  Crop,
} from '@element-plus/icons-vue';
import { useResponsive } from '@/composables/useResponsive.js';
import UpdateDialog from '@/components/UpdateDialog.vue';

// ============================================
// Props 定义
// ============================================

const props = defineProps({
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
   * 最小侧边栏宽度
   */
  minSidebarWidth: {
    type: Number,
    default: 180,
  },

  /**
   * 最大侧边栏宽度
   */
  maxSidebarWidth: {
    type: Number,
    default: 400,
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
  'collapse-change',
  'width-change',
  'tab-change',
  'tab-remove',
  'notification-click',
  'settings-click',
  'content-scroll',
]);

// ============================================
// 路由
// ============================================

const route = useRoute();
const router = useRouter();

// ============================================
// 响应式布局
// ============================================

const responsive = useResponsive();

// ============================================
// 状态
// ============================================

const sidebarRef = ref(null);
const contentRef = ref(null);
const isCollapsed = ref(props.defaultCollapsed);
const isMiniSidebar = ref(false);
const currentSidebarWidth = ref(props.sidebarWidth);
const isResizing = ref(false);
const searchQuery = ref('');
const isFullscreen = ref(false);
const activeTab = ref(props.activeTabPath || route.path);

// 拖拽调整相关
let resizeStartX = 0;
let resizeStartWidth = 0;

// ============================================
// 计算属性
// ============================================

/**
 * 侧边栏样式
 */
const sidebarStyle = computed(() => {
  if (isCollapsed.value) {
    return {
      width: '64px',
    };
  }
  return {
    width: `${currentSidebarWidth.value}px`,
  };
});

/**
 * 当前激活的菜单项
 */
const activeMenu = computed(() => {
  return route.path;
});

// ============================================
// 方法
// ============================================

/**
 * 切换侧边栏折叠状态
 */
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-change', isCollapsed.value);

  // 保存折叠状态到本地存储（安全检查）
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('yunshu_sidebar_collapsed', JSON.stringify(isCollapsed.value));
  }
}

/**
 * 处理拖拽调整开始
 */
function handleResizeStart(event) {
  if (!props.resizable || isCollapsed.value) return;

  isResizing.value = true;
  resizeStartX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
  resizeStartWidth = currentSidebarWidth.value;

  // 添加全局事件监听（安全检查）
  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchmove', handleResizeMove);
    document.addEventListener('touchend', handleResizeEnd);

    // 禁用文本选择
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }
}

/**
 * 处理拖拽调整移动
 */
function handleResizeMove(event) {
  if (!isResizing.value) return;

  const clientX = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
  const diff = clientX - resizeStartX;
  let newWidth = resizeStartWidth + diff;

  // 限制宽度范围
  newWidth = Math.max(props.minSidebarWidth, Math.min(props.maxSidebarWidth, newWidth));

  // 如果宽度小于最小宽度的1.5倍，自动折叠
  if (newWidth < props.minSidebarWidth * 1.2) {
    isCollapsed.value = true;
    currentSidebarWidth.value = props.sidebarWidth;
  } else {
    isCollapsed.value = false;
    currentSidebarWidth.value = newWidth;
  }

  emit('width-change', currentSidebarWidth.value);
}

/**
 * 处理拖拽调整结束
 */
function handleResizeEnd() {
  isResizing.value = false;

  // 移除全局事件监听（安全检查）
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.removeEventListener('touchmove', handleResizeMove);
    document.removeEventListener('touchend', handleResizeEnd);

    // 恢复文本选择
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  // 保存宽度到本地存储（安全检查）
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('yunshu_sidebar_width', currentSidebarWidth.value.toString());
  }
}

/**
 * 处理通知点击
 */
function handleNotificationClick() {
  emit('notification-click');
}

/**
 * 处理设置点击
 */
function handleSettingsClick() {
  emit('settings-click');
}

/**
 * 切换全屏
 */
function toggleFullscreen() {
  if (typeof document === 'undefined') return;
  
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(() => {
      // 全屏请求被拒绝
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
}

/**
 * 处理标签页移除
 */
function handleTabRemove(path) {
  emit('tab-remove', path);
}

/**
 * 处理标签页点击
 */
function handleTabClick(tab) {
  emit('tab-change', tab.props.name);
  router.push(tab.props.name);
}

/**
 * 处理内容区域滚动
 */
function handleContentScroll(event) {
  emit('content-scroll', event);
}

// ============================================
// 监听全屏变化
// ============================================

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

// ============================================
// 生命周期
// ============================================

onMounted(() => {
  // 恢复侧边栏状态（安全检查）
  if (typeof localStorage !== 'undefined') {
    const savedCollapsed = localStorage.getItem('yunshu_sidebar_collapsed');
    if (savedCollapsed !== null) {
      isCollapsed.value = JSON.parse(savedCollapsed);
    }

    const savedWidth = localStorage.getItem('yunshu_sidebar_width');
    if (savedWidth !== null) {
      currentSidebarWidth.value = parseInt(savedWidth, 10);
    }
  }

  // 监听全屏变化（安全检查）
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  }
});

onUnmounted(() => {
  // 移除全屏监听（安全检查）
  if (typeof document !== 'undefined') {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }
});

// ============================================
// 监听标签页变化
// ============================================

watch(
  () => props.activeTabPath,
  (newPath) => {
    if (newPath) {
      activeTab.value = newPath;
    }
  }
);

watch(
  () => route.path,
  (newPath) => {
    if (props.showTabs) {
      activeTab.value = newPath;
    }
  }
);

// ============================================
// 暴露方法
// ============================================

defineExpose({
  /**
   * 侧边栏元素
   */
  sidebarRef,

  /**
   * 内容区域元素
   */
  contentRef,

  /**
   * 是否折叠
   */
  isCollapsed,

  /**
   * 当前侧边栏宽度
   */
  currentSidebarWidth,

  /**
   * 切换折叠状态
   */
  toggleCollapse,

  /**
   * 设置侧边栏宽度
   */
  setSidebarWidth: (width) => {
    currentSidebarWidth.value = Math.max(
      props.minSidebarWidth,
      Math.min(props.maxSidebarWidth, width)
    );
  },
});
</script>

<style scoped>
/* ============================================
   桌面端布局容器样式
   ============================================ */

.desktop-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--background-base);
}

/* 侧边栏 */
.desktop-layout__sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: var(--background-light);
  border-right: 1px solid var(--border-light);
  transition: width 0.3s ease;
  position: relative;
}

/* 侧边栏头部 */
.desktop-layout__sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

/* Logo */
.desktop-layout__logo {
  flex: 1;
  min-width: 0;
}

.desktop-layout__logo-default {
  display: flex;
  align-items: center;
  gap: 12px;
}

.desktop-layout__logo-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.desktop-layout__logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 折叠按钮 */
.desktop-layout__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.desktop-layout__collapse-btn:hover {
  background-color: var(--background-dark);
  color: var(--text-primary);
}

/* 侧边栏内容 */
.desktop-layout__sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

/* 菜单样式 */
.desktop-layout__menu {
  border-right: none;
}

.desktop-layout__menu :deep(.el-menu-item),
.desktop-layout__menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
}

/* 侧边栏底部 */
.desktop-layout__sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-light);
  flex-shrink: 0;
}

/* 用户信息 */
.desktop-layout__user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.desktop-layout__user-info {
  flex: 1;
  min-width: 0;
}

.desktop-layout__user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desktop-layout__user-role {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 拖拽调整手柄 */
.desktop-layout__resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  transition: background-color 0.2s ease;
}

.desktop-layout__resize-handle:hover,
.desktop-layout__resize-handle--active {
  background-color: var(--primary-color);
}

/* 主内容区域 */
.desktop-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* 顶部标题栏 */
.desktop-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background-color: var(--background-light);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  gap: 16px;
}

.desktop-layout__breadcrumb {
  flex-shrink: 0;
}

.desktop-layout__header-content {
  flex: 1;
  min-width: 0;
}

.desktop-layout__header-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 搜索框 */
.desktop-layout__search {
  width: 200px;
}

.desktop-layout__search :deep(.el-input__wrapper) {
  border-radius: 20px;
}

/* 标签页区域 */
.desktop-layout__tabs {
  flex-shrink: 0;
  background-color: var(--background-light);
  border-bottom: 1px solid var(--border-light);
  padding: 0 24px;
}

.desktop-layout__tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.desktop-layout__tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

/* 内容区域 */
.desktop-layout__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
}

.desktop-layout__content--no-padding {
  padding: 0;
}

/* 底部 */
.desktop-layout__footer {
  flex-shrink: 0;
  padding: 16px 24px;
  background-color: var(--background-light);
  border-top: 1px solid var(--border-light);
}

.desktop-layout__footer-default {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

/* ============================================
   折叠状态样式
   ============================================ */

.desktop-layout--collapsed .desktop-layout__sidebar-header {
  justify-content: center;
  padding: 0 8px;
}

.desktop-layout--collapsed .desktop-layout__sidebar-footer {
  padding: 16px 8px;
  display: flex;
  justify-content: center;
}

.desktop-layout--collapsed .desktop-layout__user {
  justify-content: center;
}

/* ============================================
   响应式适配
   ============================================ */

/* 小屏幕桌面 */
@media (max-width: 1200px) {
  .desktop-layout__header {
    padding: 0 16px;
  }

  .desktop-layout__content {
    padding: 16px;
  }

  .desktop-layout__search {
    width: 160px;
  }
}

/* 平板及以下隐藏 */
@media (max-width: 991px) {
  .desktop-layout {
    display: none;
  }
}

/* ============================================
   深色模式适配
   ============================================ */

@media (prefers-color-scheme: dark) {
  .desktop-layout {
    background-color: var(--background-dark);
  }

  .desktop-layout__sidebar,
  .desktop-layout__header,
  .desktop-layout__footer {
    background-color: var(--background-light);
    border-color: var(--border-base);
  }

  .desktop-layout__tabs {
    background-color: var(--background-light);
    border-color: var(--border-base);
  }
}

/* ============================================
   无障碍支持
   ============================================ */

/* 焦点样式 */
.desktop-layout__collapse-btn:focus-visible,
.desktop-layout__resize-handle:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .desktop-layout__sidebar {
    transition: none;
  }

  .desktop-layout__collapse-btn {
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: more) {
  .desktop-layout__sidebar {
    border-right-width: 2px;
  }

  .desktop-layout__header,
  .desktop-layout__footer {
    border-width: 2px;
  }
}
</style>

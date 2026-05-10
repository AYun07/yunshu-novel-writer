<template>
  <div class="mobile-layout" :class="{ 'has-bottom-nav': showBottomNav }">
    <!-- 顶部状态栏（安全区域） -->
    <div class="status-bar safe-area-top"></div>
    
    <!-- 主内容区域 -->
    <main class="main-content scroll-ios" :style="mainContentStyle">
      <router-view v-slot="{ Component, route }">
        <transition :name="pageTransition" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
    
    <!-- 底部导航栏 -->
    <nav v-if="showBottomNav" class="bottom-nav safe-area-bottom">
      <div class="bottom-nav-items">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="bottom-nav-item touch-target"
          :class="{ active: isActive(item.path) }"
        >
          <span class="bottom-nav-icon">
            <component :is="item.icon" />
          </span>
          <span class="bottom-nav-label">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
    
    <!-- 快速操作按钮（浮动） -->
    <button 
      v-if="showQuickAction"
      class="quick-action-btn touch-target"
      @click="handleQuickAction"
      :style="quickActionStyle"
    >
      <span class="quick-action-icon">✏️</span>
    </button>
    
    <!-- 更新提示弹窗 -->
    <UpdateDialog />
  </div>
</template>

<script setup>
/**
 * 移动端布局组件
 * 
 * 功能：
 * - 响应式布局
 * - 底部导航栏
 * - 安全区域适配
 * - 页面切换动画
 * - 快速操作按钮
 */

import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '../stores/device.js'
import UpdateDialog from '../components/UpdateDialog.vue'

// ==================== 路由和状态 ====================
const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()

// ==================== 响应式数据 ====================
const keyboardHeight = ref(0)
const cachedViews = ref(['MobileHome', 'MobileProjects'])

// ==================== 导航项配置 ====================
const navItems = [
  {
    path: '/m',
    label: '首页',
    icon: {
      render() {
        return h('span', '🏠')
      }
    }
  },
  {
    path: '/m/projects',
    label: '项目',
    icon: {
      render() {
        return h('span', '📚')
      }
    }
  },
  {
    path: '/m/writer',
    label: '写作',
    icon: {
      render() {
        return h('span', '✍️')
      }
    }
  },
  {
    path: '/m/profile',
    label: '我的',
    icon: {
      render() {
        return h('span', '👤')
      }
    }
  }
]

// ==================== 计算属性 ====================

/**
 * 是否显示底部导航
 */
const showBottomNav = computed(() => {
  // 某些页面可能需要隐藏底部导航
  const hideOnPages = ['/m/writer', '/m/quick-write']
  return !hideOnPages.includes(route.path)
})

/**
 * 是否显示快速操作按钮
 */
const showQuickAction = computed(() => {
  // 在首页和项目页显示
  return ['/m', '/m/projects'].includes(route.path)
})

/**
 * 页面切换动画
 */
const pageTransition = computed(() => {
  // 根据路由深度决定动画方向
  return 'page-slide'
})

/**
 * 主内容区域样式
 */
const mainContentStyle = computed(() => {
  const style = {}
  
  // 键盘弹出时调整高度
  if (keyboardHeight.value > 0) {
    style.paddingBottom = `${keyboardHeight.value}px`
  }
  
  // 底部导航栏高度
  if (showBottomNav.value) {
    style.paddingBottom = 'calc(56px + env(safe-area-inset-bottom, 0px))'
  }
  
  return style
})

/**
 * 快速操作按钮样式
 */
const quickActionStyle = computed(() => {
  return {
    bottom: `calc(72px + env(safe-area-inset-bottom, 0px))`
  }
})

// ==================== 方法 ====================

/**
 * 判断导航项是否激活
 */
function isActive(path) {
  if (path === '/m') {
    return route.path === '/m' || route.path === '/m/'
  }
  return route.path.startsWith(path)
}

/**
 * 处理快速操作
 */
function handleQuickAction() {
  router.push('/m/quick-write')
}

/**
 * 处理键盘显示
 */
function handleKeyboardShow(height) {
  keyboardHeight.value = height
}

/**
 * 处理键盘隐藏
 */
function handleKeyboardHide() {
  keyboardHeight.value = 0
}

/**
 * 处理返回按钮
 */
function handleBackButton() {
  if (route.path !== '/m') {
    router.back()
  } else {
    // 询问是否退出
    if (confirm('确定要退出应用吗？')) {
      // 退出应用
      if (window.Capacitor) {
        window.Capacitor.Plugins.App.exitApp()
      }
    }
  }
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 初始化设备检测
  deviceStore.detectDevice()
  
  // 监听键盘事件
  if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.Keyboard) {
    window.Capacitor.Plugins.Keyboard.addListener('keyboardWillShow', (info) => {
      handleKeyboardShow(info.keyboardHeight)
    })
    window.Capacitor.Plugins.Keyboard.addListener('keyboardWillHide', handleKeyboardHide)
  }
  
  // 监听返回按钮（Android）
  if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.App) {
    window.Capacitor.Plugins.App.addListener('backButton', handleBackButton)
  }
  
  // 监听窗口大小变化
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', () => {
      deviceStore.detectDevice()
    })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
    window.removeEventListener('resize', deviceStore.detectDevice)
  }
})
</script>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
}

.status-bar {
  flex-shrink: 0;
  background: #fff;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #ebedf0;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.bottom-nav-items {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  max-width: 500px;
  margin: 0 auto;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 44px;
  color: #999;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.bottom-nav-item:active {
  background: #f5f5f5;
}

.bottom-nav-item.active {
  color: #667eea;
}

.bottom-nav-item.active .bottom-nav-icon {
  transform: scale(1.1);
}

.bottom-nav-icon {
  font-size: 24px;
  line-height: 1;
  margin-bottom: 2px;
  transition: transform 0.2s ease;
}

.bottom-nav-label {
  font-size: 11px;
  font-weight: 500;
}

/* 快速操作按钮 */
.quick-action-btn {
  position: fixed;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quick-action-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.quick-action-icon {
  font-size: 24px;
}

/* 页面切换动画 */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s ease;
}

.page-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.page-slide-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 横屏适配 */
@media (max-height: 500px) and (orientation: landscape) {
  .bottom-nav {
    height: 48px;
  }
  
  .bottom-nav-items {
    height: 48px;
  }
  
  .bottom-nav-icon {
    font-size: 20px;
  }
  
  .bottom-nav-label {
    font-size: 10px;
  }
  
  .quick-action-btn {
    width: 48px;
    height: 48px;
  }
  
  .quick-action-icon {
    font-size: 20px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .mobile-layout {
    background: #1a1a1a;
  }
  
  .status-bar {
    background: #1a1a1a;
  }
  
  .bottom-nav {
    background: #2d2d2d;
    border-top-color: #404040;
  }
  
  .bottom-nav-item:active {
    background: #3d3d3d;
  }
  
  .bottom-nav-item {
    color: #a0a0a0;
  }
  
  .bottom-nav-item.active {
    color: #8b9cf7;
  }
}

/* 小屏幕手机适配 */
@media (max-width: 375px) {
  .bottom-nav-label {
    font-size: 10px;
  }
  
  .bottom-nav-icon {
    font-size: 22px;
  }
}
</style>

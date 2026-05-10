<!--
  云书 - PWA 安装提示组件

  功能说明：
  - 检测 PWA 可安装状态
  - 显示安装横幅/弹窗
  - 引导用户安装
  - 支持多种展示模式（banner、modal、mini）
  - 记住用户选择（不再提示）

  使用示例：
  <PWAInstallPrompt mode="banner" :auto-show="true" />
  <PWAInstallPrompt mode="modal" v-model="showPrompt" />
  <PWAInstallPrompt mode="mini" position="bottom-right" />
-->

<template>
  <!-- Banner 模式 -->
  <transition name="slide-down">
    <div
      v-if="mode === 'banner' && showBanner"
      class="pwa-install-banner"
      :class="{ 'is-dark': isDark }"
    >
      <div class="banner-content">
        <div class="banner-icon">
          <img src="/icons/icon-72x72.png" alt="云书" />
        </div>
        <div class="banner-text">
          <h3>安装云书到您的设备</h3>
          <p>随时随地创作，离线也能使用</p>
        </div>
      </div>
      <div class="banner-actions">
        <el-button
          type="primary"
          size="small"
          :loading="isInstalling"
          @click="handleInstall"
        >
          {{ isInstalling ? '安装中...' : '安装' }}
        </el-button>
        <el-button
          text
          size="small"
          @click="dismissBanner"
        >
          稍后
        </el-button>
        <el-button
          text
          size="small"
          @click="neverShowAgain"
        >
          不再提示
        </el-button>
      </div>
      <button class="banner-close" @click="dismissBanner">
        <el-icon><Close /></el-icon>
      </button>
    </div>
  </transition>

  <!-- Modal 模式 -->
  <el-dialog
    v-else-if="mode === 'modal'"
    v-model="dialogVisible"
    title="安装云书"
    width="420px"
    :show-close="true"
    class="pwa-install-modal"
  >
    <div class="modal-content">
      <div class="modal-icon">
        <img src="/icons/icon-192x192.png" alt="云书" />
      </div>
      <h3>将云书安装到您的设备</h3>
      <p class="modal-description">
        安装后，您可以：
      </p>
      <ul class="feature-list">
        <li>
          <el-icon><Check /></el-icon>
          <span>从桌面或主屏幕快速启动</span>
        </li>
        <li>
          <el-icon><Check /></el-icon>
          <span>离线模式下继续创作</span>
        </li>
        <li>
          <el-icon><Check /></el-icon>
          <span>获得更好的全屏体验</span>
        </li>
        <li>
          <el-icon><Check /></el-icon>
          <span>接收写作提醒通知</span>
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="modal-footer">
        <el-button @click="dialogVisible = false">稍后</el-button>
        <el-button type="primary" :loading="isInstalling" @click="handleInstall">
          {{ isInstalling ? '安装中...' : '立即安装' }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Mini 模式 -->
  <transition name="fade">
    <div
      v-else-if="mode === 'mini' && showMini"
      class="pwa-install-mini"
      :class="[position, { 'is-dark': isDark }]"
    >
      <div class="mini-content" @click="handleInstall">
        <img src="/icons/icon-48x48.png" alt="云书" />
        <span>安装云书</span>
      </div>
      <button class="mini-close" @click.stop="dismissMini">
        <el-icon><Close /></el-icon>
      </button>
    </div>
  </transition>

  <!-- Fab 模式 -->
  <transition name="scale">
    <div
      v-else-if="mode === 'fab' && showFab"
      class="pwa-install-fab"
      :class="position"
      @click="handleInstall"
    >
      <el-tooltip content="安装云书" placement="left">
        <div class="fab-button">
          <el-icon><Download /></el-icon>
        </div>
      </el-tooltip>
    </div>
  </transition>
</template>

<script setup>
/**
 * PWA 安装提示组件
 */
import { ref, computed, onMounted, watch } from 'vue'
import { Close, Check, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { usePWA } from '@/composables/usePWA'

// ============================================
// Props 定义
// ============================================

const props = defineProps({
  /**
   * 显示模式
   * - banner: 顶部横幅
   * - modal: 对话框
   * - mini: 小浮窗
   * - fab: 浮动按钮
   */
  mode: {
    type: String,
    default: 'banner',
    validator: (value) => ['banner', 'modal', 'mini', 'fab'].includes(value)
  },

  /**
   * 是否自动显示
   */
  autoShow: {
    type: Boolean,
    default: true
  },

  /**
   * 自动显示延迟（毫秒）
   */
  autoShowDelay: {
    type: Number,
    default: 3000
  },

  /**
   * 位置（用于 mini 和 fab 模式）
   */
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => [
      'top-left', 'top-right',
      'bottom-left', 'bottom-right'
    ].includes(value)
  },

  /**
   * 是否使用深色主题
   */
  isDark: {
    type: Boolean,
    default: false
  },

  /**
   * 模态框显示状态（用于 modal 模式）
   */
  modelValue: {
    type: Boolean,
    default: false
  }
})

// ============================================
// Emits 定义
// ============================================

const emit = defineEmits(['update:modelValue', 'install', 'dismiss', 'installing'])

// ============================================
// 状态定义
// ============================================

const { isInstallable, isInstalled, installPWA } = usePWA()

/** 是否显示 Banner */
const showBanner = ref(false)

/** 是否显示 Mini */
const showMini = ref(false)

/** 是否显示 Fab */
const showFab = ref(false)

/** 是否正在安装 */
const isInstalling = ref(false)

/** 存储键名 */
const STORAGE_KEY = 'pwa-install-prompt-dismissed'

// ============================================
// 计算属性
// ============================================

/**
 * 模态框显示状态
 */
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// ============================================
// 方法定义
// ============================================

/**
 * 处理安装
 */
async function handleInstall() {
  if (isInstalling.value) return

  isInstalling.value = true
  emit('installing')

  try {
    const result = await installPWA()

    if (result) {
      ElMessage.success('云书安装成功！')
      emit('install', true)

      // 隐藏所有提示
      hideAllPrompts()
    } else {
      emit('install', false)
    }
  } catch (error) {
    console.error('[PWA Install] 安装失败:', error)
    ElMessage.error('安装失败，请重试')
    emit('install', false)
  } finally {
    isInstalling.value = false
  }
}

/**
 * 隐藏 Banner
 */
function dismissBanner() {
  showBanner.value = false
  emit('dismiss')
}

/**
 * 隐藏 Mini
 */
function dismissMini() {
  showMini.value = false
  emit('dismiss')
}

/**
 * 不再提示
 */
function neverShowAgain() {
  localStorage.setItem(STORAGE_KEY, 'true')
  hideAllPrompts()
  emit('dismiss')
}

/**
 * 隐藏所有提示
 */
function hideAllPrompts() {
  showBanner.value = false
  showMini.value = false
  showFab.value = false
  dialogVisible.value = false
}

/**
 * 检查是否应该显示提示
 */
function shouldShowPrompt() {
  // 检查用户是否选择了不再提示
  const dismissed = localStorage.getItem(STORAGE_KEY)
  if (dismissed === 'true') return false

  // 检查是否已安装
  if (isInstalled.value) return false

  // 检查是否可安装
  if (!isInstallable.value) return false

  return true
}

/**
 * 显示提示
 */
function showPrompt() {
  if (!shouldShowPrompt()) return

  switch (props.mode) {
    case 'banner':
      showBanner.value = true
      break
    case 'modal':
      dialogVisible.value = true
      break
    case 'mini':
      showMini.value = true
      break
    case 'fab':
      showFab.value = true
      break
  }
}

/**
 * 手动触发显示
 */function prompt() {
  showPrompt()
}

// ============================================
// 生命周期
// ============================================

onMounted(() => {
  // 监听安装状态变化
  watch(isInstallable, (newValue) => {
    if (newValue && props.autoShow) {
      // 延迟显示
      setTimeout(() => {
        showPrompt()
      }, props.autoShowDelay)
    }
  }, { immediate: true })

  // 监听已安装状态
  watch(isInstalled, (newValue) => {
    if (newValue) {
      hideAllPrompts()
    }
  })
})

// ============================================
// 暴露方法
// ============================================

defineExpose({
  show: showPrompt,
  hide: hideAllPrompts,
  prompt
})
</script>

<style scoped>
/* ============================================
   Banner 样式
   ============================================ */

.pwa-install-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pwa-install-banner.is-dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-icon img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.banner-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.banner-text p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.9;
}

.banner-actions {
  display: flex;
  gap: 8px;
}

.banner-close {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.banner-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ============================================
   Modal 样式
   ============================================ */

.pwa-install-modal :deep(.el-dialog__body) {
  padding: 20px 24px;
}

.modal-content {
  text-align: center;
}

.modal-icon img {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.modal-content h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.modal-description {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list .el-icon {
  color: var(--el-color-success);
  font-size: 18px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ============================================
   Mini 样式
   ============================================ */

.pwa-install-mini {
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.pwa-install-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.pwa-install-mini.is-dark {
  background: #1a1a2e;
  color: white;
}

.pwa-install-mini.top-left {
  top: 20px;
  left: 20px;
}

.pwa-install-mini.top-right {
  top: 20px;
  right: 20px;
}

.pwa-install-mini.bottom-left {
  bottom: 20px;
  left: 20px;
}

.pwa-install-mini.bottom-right {
  bottom: 20px;
  right: 20px;
}

.mini-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-content img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.mini-content span {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.mini-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.mini-close:hover {
  color: var(--el-text-color-primary);
}

/* ============================================
   Fab 样式
   ============================================ */

.pwa-install-fab {
  position: fixed;
  z-index: 9999;
}

.pwa-install-fab.top-left {
  top: 20px;
  left: 20px;
}

.pwa-install-fab.top-right {
  top: 20px;
  right: 20px;
}

.pwa-install-fab.bottom-left {
  bottom: 20px;
  left: 20px;
}

.pwa-install-fab.bottom-right {
  bottom: 20px;
  right: 20px;
}

.fab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.fab-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.fab-button .el-icon {
  font-size: 24px;
  color: white;
}

/* ============================================
   动画效果
   ============================================ */

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}

/* ============================================
   响应式适配
   ============================================ */

@media (max-width: 768px) {
  .pwa-install-banner {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }

  .banner-content {
    width: 100%;
  }

  .banner-actions {
    width: 100%;
    justify-content: center;
  }

  .banner-close {
    top: 4px;
    right: 4px;
  }

  .pwa-install-mini {
    padding: 6px 10px;
  }

  .mini-content span {
    display: none;
  }
}
</style>

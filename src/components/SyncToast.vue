<template>
  <div class="sync-toast">
    <!-- 同步状态提示 -->
    <transition name="slide-fade">
      <div
        v-if="showToast"
        class="toast-content"
        :class="toastType"
      >
        <el-icon class="toast-icon" :class="{ 'is-loading': isSyncing }">
          <component :is="toastIcon" />
        </el-icon>
        <span class="toast-message">{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 同步状态提示组件
 * 显示全局同步状态提示
 */

import { ref, computed, watch } from 'vue'
import { Loading, CircleCheck, CircleClose, Warning } from '@element-plus/icons-vue'
import { syncState, SyncStatus } from '../services/syncService.js'

// ==================== 响应式数据 ====================
const showToast = ref(false)
const toastTimer = ref(null)

// ==================== 计算属性 ====================

/**
 * 是否正在同步
 */
const isSyncing = computed(() => syncState.status === SyncStatus.SYNCING)

/**
 * 提示类型
 */
const toastType = computed(() => {
  switch (syncState.status) {
    case SyncStatus.SYNCING:
      return 'info'
    case SyncStatus.SUCCESS:
      return 'success'
    case SyncStatus.ERROR:
      return 'error'
    case SyncStatus.OFFLINE:
      return 'warning'
    default:
      return 'info'
  }
})

/**
 * 提示图标
 */
const toastIcon = computed(() => {
  switch (syncState.status) {
    case SyncStatus.SYNCING:
      return Loading
    case SyncStatus.SUCCESS:
      return CircleCheck
    case SyncStatus.ERROR:
      return CircleClose
    case SyncStatus.OFFLINE:
      return Warning
    default:
      return CircleCheck
  }
})

/**
 * 提示消息
 */
const toastMessage = computed(() => {
  switch (syncState.status) {
    case SyncStatus.SYNCING:
      return syncState.currentOperation || '正在同步...'
    case SyncStatus.SUCCESS:
      return '同步成功'
    case SyncStatus.ERROR:
      return '同步失败'
    case SyncStatus.OFFLINE:
      return '离线模式'
    default:
      return ''
  }
})

// ==================== 监听 ====================

// 监听同步状态变化
watch(() => syncState.status, (newStatus, oldStatus) => {
  // 清除之前的定时器
  if (toastTimer.value) {
    clearTimeout(toastTimer.value)
  }

  // 显示提示
  if (newStatus === SyncStatus.SYNCING) {
    showToast.value = true
  } else if (newStatus === SyncStatus.SUCCESS && oldStatus === SyncStatus.SYNCING) {
    showToast.value = true
    // 2秒后自动隐藏
    toastTimer.value = setTimeout(() => {
      showToast.value = false
    }, 2000)
  } else if (newStatus === SyncStatus.ERROR) {
    showToast.value = true
    // 3秒后自动隐藏
    toastTimer.value = setTimeout(() => {
      showToast.value = false
    }, 3000)
  } else if (newStatus === SyncStatus.OFFLINE) {
    showToast.value = true
  } else {
    showToast.value = false
  }
})
</script>

<style scoped>
.sync-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  pointer-events: auto;
}

.toast-icon {
  font-size: 16px;
}

.toast-icon.is-loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.toast-message {
  color: #303133;
}

/* 不同类型样式 */
.toast-content.success .toast-icon {
  color: #67c23a;
}

.toast-content.error .toast-icon {
  color: #f56c6c;
}

.toast-content.warning .toast-icon {
  color: #e6a23c;
}

.toast-content.info .toast-icon {
  color: #409eff;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sync-toast {
    top: 12px;
  }

  .toast-content {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>

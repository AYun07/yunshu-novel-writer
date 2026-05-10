<template>
  <div class="sync-status" :class="[statusClass, { 'compact': !showDetails }]">
    <!-- 简洁模式 - 仅显示图标和状态 -->
    <div v-if="!showDetails" class="sync-status-compact" @click="handleClick">
      <el-icon class="status-icon" :class="{ 'is-loading': isSyncing }">
        <component :is="currentIcon" />
      </el-icon>
      <span class="status-text">{{ statusText }}</span>
      <span v-if="lastSyncTime" class="sync-time">{{ lastSyncTimeText }}</span>
    </div>

    <!-- 详细模式 - 显示完整信息 -->
    <div v-else class="sync-status-detail">
      <!-- 状态头部 -->
      <div class="status-header" @click="toggleExpanded">
        <div class="status-main">
          <el-icon class="status-icon" :class="{ 'is-loading': isSyncing }" :size="20">
            <component :is="currentIcon" />
          </el-icon>
          <div class="status-info">
            <span class="status-title">{{ statusTitle }}</span>
            <span class="status-desc">{{ statusDescription }}</span>
          </div>
        </div>
        <el-icon class="expand-icon" :class="{ 'is-expanded': isExpanded }">
          <ArrowDown />
        </el-icon>
      </div>

      <!-- 展开的详细信息 -->
      <el-collapse-transition>
        <div v-show="isExpanded" class="status-detail-content">
          <!-- 同步进度 -->
          <div v-if="isSyncing" class="sync-progress">
            <el-progress
              :percentage="syncProgress"
              :stroke-width="4"
              :show-text="false"
              :status="syncProgress === 100 ? 'success' : ''"
            />
            <span class="progress-text">{{ currentOperation }}</span>
          </div>

          <!-- 统计信息 -->
          <div class="sync-stats">
            <div class="stat-item">
              <span class="stat-label">总项目</span>
              <span class="stat-value">{{ syncStats.totalItems }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">已同步</span>
              <span class="stat-value success">{{ syncStats.syncedItems }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">待同步</span>
              <span class="stat-value warning">{{ syncStats.pendingItems }}</span>
            </div>
          </div>

          <!-- 上次同步时间 -->
          <div v-if="lastSyncTime" class="last-sync-info">
            <el-icon><Clock /></el-icon>
            <span>上次同步: {{ lastSyncTimeText }}</span>
          </div>

          <!-- 错误提示 -->
          <div v-if="lastSyncError" class="error-message">
            <el-icon><Warning /></el-icon>
            <span>{{ lastSyncError }}</span>
          </div>

          <!-- 操作按钮 -->
          <div class="sync-actions">
            <el-button
              type="primary"
              size="small"
              :loading="isSyncing"
              :disabled="isOffline"
              @click="triggerSync"
            >
              <el-icon><Refresh /></el-icon>
              {{ isSyncing ? '同步中...' : '立即同步' }}
            </el-button>
            <el-button
              v-if="hasPendingChanges"
              size="small"
              @click="showPendingDetails"
            >
              <el-icon><List /></el-icon>
              查看待同步 ({{ pendingChangesCount }})
            </el-button>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <!-- 离线提示条 -->
    <transition name="slide-fade">
      <div v-if="isOffline && showOfflineTip" class="offline-banner">
        <el-icon><Warning /></el-icon>
        <span>当前处于离线模式，数据将在联网后自动同步</span>
        <el-button type="primary" link size="small" @click="dismissOfflineTip">
          知道了
        </el-button>
      </div>
    </transition>

    <!-- 同步成功提示 -->
    <transition name="fade">
      <div v-if="showSuccessToast" class="success-toast">
        <el-icon><CircleCheck /></el-icon>
        <span>同步成功</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 同步状态组件
 * 显示同步中动画、上次同步时间、同步错误提示、手动同步按钮
 * 支持简洁模式和详细模式
 */

import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Loading, CircleCheck, CircleClose, Warning,
  WarningFilled, QuestionFilled, Clock, Refresh,
  List, ArrowDown
} from '@element-plus/icons-vue'
import { useSync, useOfflineStatus } from '../composables/useSync.js'

// ==================== 组件属性 ====================
const props = defineProps({
  /**
   * 是否显示详细信息
   */
  showDetails: {
    type: Boolean,
    default: false
  },
  /**
   * 是否显示离线提示
   */
  showOfflineTip: {
    type: Boolean,
    default: true
  },
  /**
   * 是否自动触发同步
   */
  autoSync: {
    type: Boolean,
    default: false
  }
})

// ==================== 组件事件 ====================
const emit = defineEmits(['sync', 'error', 'click'])

// ==================== 使用组合式函数 ====================
const {
  syncState,
  isSyncing,
  isOffline,
  hasError,
  hasPendingChanges,
  syncStats,
  pendingChangesCount,
  statusText,
  statusIcon,
  lastSyncTimeText,
  triggerSync: doSync
} = useSync({
  autoSync: props.autoSync,
  showNotifications: false
})

const { isOffline: offlineStatus } = useOfflineStatus()

// ==================== 本地状态 ====================
const isExpanded = ref(false)
const showOfflineTip = ref(props.showOfflineTip)
const showSuccessToast = ref(false)

// ==================== 计算属性 ====================

/**
 * 当前状态对应的CSS类名
 */
const statusClass = computed(() => {
  switch (syncState.status) {
    case 'syncing':
      return 'status-syncing'
    case 'success':
      return 'status-success'
    case 'error':
      return 'status-error'
    case 'offline':
      return 'status-offline'
    case 'conflict':
      return 'status-conflict'
    default:
      return 'status-idle'
  }
})

/**
 * 当前图标组件
 */
const currentIcon = computed(() => {
  switch (syncState.status) {
    case 'syncing':
      return Loading
    case 'success':
      return CircleCheck
    case 'error':
      return CircleClose
    case 'offline':
      return Warning
    case 'conflict':
      return WarningFilled
    default:
      return CircleCheck
  }
})

/**
 * 状态标题
 */
const statusTitle = computed(() => {
  switch (syncState.status) {
    case 'syncing':
      return '正在同步'
    case 'success':
      return '同步成功'
    case 'error':
      return '同步失败'
    case 'offline':
      return '离线模式'
    case 'conflict':
      return '需要解决冲突'
    default:
      return '已同步'
  }
})

/**
 * 状态描述
 */
const statusDescription = computed(() => {
  if (isSyncing.value) {
    return syncState.currentOperation || '正在同步数据...'
  }
  if (isOffline.value) {
    return '网络已断开，数据将在联网后自动同步'
  }
  if (hasError.value) {
    return syncState.lastSyncError || '同步过程中发生错误'
  }
  if (hasPendingChanges.value) {
    return `有 ${pendingChangesCount.value} 项变更等待同步`
  }
  return lastSyncTimeText.value
})

/**
 * 同步进度
 */
const syncProgress = computed(() => syncState.syncProgress || 0)

/**
 * 当前操作
 */
const currentOperation = computed(() => syncState.currentOperation || '')

/**
 * 上次同步时间
 */
const lastSyncTime = computed(() => syncState.lastSyncTime)

/**
 * 上次同步错误
 */
const lastSyncError = computed(() => syncState.lastSyncError)

// ==================== 方法 ====================

/**
 * 处理点击事件
 */
const handleClick = () => {
  emit('click')

  // 简洁模式下点击触发同步
  if (!props.showDetails && !isSyncing.value && !isOffline.value) {
    triggerSync()
  }
}

/**
 * 切换展开状态
 */
const toggleExpanded = () => {
  if (props.showDetails) {
    isExpanded.value = !isExpanded.value
  }
}

/**
 * 触发同步
 */
const triggerSync = async () => {
  if (isSyncing.value) return

  const result = await doSync()

  if (result.success) {
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 2000)
    emit('sync', result)
  } else {
    emit('error', result.error)
  }
}

/**
 * 关闭离线提示
 */
const dismissOfflineTip = () => {
  showOfflineTip.value = false
}

/**
 * 显示待同步详情
 */
const showPendingDetails = () => {
  ElMessage.info(`有 ${pendingChangesCount.value} 项变更等待同步`)
}

// ==================== 监听 ====================

// 监听同步成功显示提示
watch(() => syncState.status, (newStatus, oldStatus) => {
  if (oldStatus === 'syncing' && newStatus === 'success') {
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 2000)
  }
})

// 监听离线状态变化
watch(() => offlineStatus.value, (isOffline) => {
  if (isOffline) {
    showOfflineTip.value = true
  }
})
</script>

<style scoped>
.sync-status {
  position: relative;
}

/* 简洁模式 */
.sync-status-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: background 0.2s;
  font-size: 12px;
  color: white;
}

.sync-status-compact:hover {
  background: rgba(255, 255, 255, 0.25);
}

.status-icon {
  font-size: 14px;
}

.status-icon.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.status-text {
  white-space: nowrap;
}

.sync-time {
  opacity: 0.8;
  font-size: 11px;
}

/* 详细模式 */
.sync-status-detail {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.status-header:hover {
  background: #f5f7fa;
}

.status-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.status-desc {
  font-size: 13px;
  color: #909399;
}

.expand-icon {
  font-size: 16px;
  color: #c0c4cc;
  transition: transform 0.3s;
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
}

/* 详细内容 */
.status-detail-content {
  padding: 0 16px 16px;
  border-top: 1px solid #ebeef5;
}

.sync-progress {
  padding: 16px 0;
}

.progress-text {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.sync-stats {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-top: 1px solid #ebeef5;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.warning {
  color: #e6a23c;
}

.last-sync-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  font-size: 13px;
  color: #909399;
  border-top: 1px solid #ebeef5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px;
  margin-top: 12px;
  background: #fef0f0;
  border-radius: 8px;
  font-size: 13px;
  color: #f56c6c;
}

.sync-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.sync-actions .el-button {
  flex: 1;
}

/* 离线提示条 */
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fdf6ec;
  color: #e6a23c;
  font-size: 13px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 24px;
  font-size: 14px;
  z-index: 2000;
}

/* 状态颜色 */
.status-idle .status-icon {
  color: #67c23a;
}

.status-syncing .status-icon {
  color: #409eff;
}

.status-success .status-icon {
  color: #67c23a;
}

.status-error .status-icon,
.status-error .status-title {
  color: #f56c6c;
}

.status-offline .status-icon,
.status-offline .status-title {
  color: #e6a23c;
}

.status-conflict .status-icon,
.status-conflict .status-title {
  color: #f56c6c;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .sync-status-compact {
    padding: 3px 6px;
    font-size: 11px;
  }

  .status-icon {
    font-size: 12px;
  }

  .sync-time {
    display: none;
  }
}
</style>

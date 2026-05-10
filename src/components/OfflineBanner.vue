<template>
  <div class="offline-banner">
    <el-icon><Warning /></el-icon>
    <span class="message">网络已断开，已切换到离线模式</span>
    <el-button
      type="primary"
      link
      size="small"
      :loading="isRetrying"
      @click="handleRetry"
    >
      重试连接
    </el-button>
  </div>
</template>

<script setup>
/**
 * 离线状态提示条
 * 显示在网络断开时的顶部提示
 */

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'

// ==================== 响应式数据 ====================
const isRetrying = ref(false)

// ==================== 方法 ====================

/**
 * 处理重试连接
 */
const handleRetry = async () => {
  isRetrying.value = true

  try {
    // 尝试检测网络状态
    if (navigator.onLine) {
      ElMessage.success('网络已恢复')
      // 触发同步
      const { syncService } = await import('../services/syncService.js')
      await syncService.sync()
    } else {
      ElMessage.warning('网络仍未恢复，请检查网络设置')
    }
  } catch (error) {
    console.error('[OfflineBanner] 重试连接失败:', error)
  } finally {
    isRetrying.value = false
  }
}
</script>

<style scoped>
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
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.offline-banner .el-icon {
  font-size: 16px;
}

.message {
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .offline-banner {
    padding: 10px 12px;
    font-size: 13px;
  }

  .message {
    flex: 1;
    text-align: center;
  }
}
</style>

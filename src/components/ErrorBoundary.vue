<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    <div v-else class="error-fallback">
      <div class="error-content">
        <el-icon :size="64" class="error-icon"><WarningFilled /></el-icon>
        <h2 class="error-title">出错了</h2>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="error-actions">
          <el-button type="primary" @click="handleRetry">
            <el-icon><Refresh /></el-icon>
            重试
          </el-button>
          <el-button @click="handleReload">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
        </div>
        <details v-if="showDetails" class="error-details">
          <summary>查看详情</summary>
          <pre>{{ errorStack }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 错误边界组件
 * 捕获子组件的错误并显示友好的错误页面
 */

import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { WarningFilled, Refresh, HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 响应式数据 ====================
const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const showDetails = ref(false)

// ==================== 方法 ====================

/**
 * 处理重试
 */
const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}

/**
 * 处理返回首页
 */
const handleReload = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  router.push('/')
}

// ==================== 错误捕获 ====================

onErrorCaptured((error, instance, info) => {
  console.error('[ErrorBoundary] 捕获到错误:', error)
  console.error('[ErrorBoundary] 错误信息:', info)

  hasError.value = true
  errorMessage.value = error.message || '发生未知错误'
  errorStack.value = error.stack || ''

  // 显示错误提示
  ElMessage.error('应用发生错误，请重试')

  // 阻止错误继续传播
  return false
})
</script>

<style scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: #f5f7fa;
}

.error-content {
  text-align: center;
  max-width: 480px;
}

.error-icon {
  color: #f56c6c;
  margin-bottom: 16px;
}

.error-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.error-message {
  font-size: 14px;
  color: #606266;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.error-details {
  text-align: left;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.error-details summary {
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  user-select: none;
}

.error-details pre {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  font-size: 12px;
  color: #f56c6c;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

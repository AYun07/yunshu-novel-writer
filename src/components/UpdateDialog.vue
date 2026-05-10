<template>
  <!-- 更新提示弹窗 -->
  <el-dialog
    v-model="visible"
    :title="null"
    :close-on-click-modal="!forceUpdate"
    :close-on-press-escape="!forceUpdate"
    :show-close="!forceUpdate"
    width="360px"
    align-center
    class="update-dialog"
  >
    <!-- 头部 -->
    <div class="update-header">
      <div class="update-icon-circle">
        <el-icon :size="32" color="#409eff"><Upload /></el-icon>
      </div>
      <h3 class="update-title">发现新版本</h3>
      <el-tag type="primary" size="small" round>v{{ latestVersion }}</el-tag>
    </div>

    <!-- 更新内容 -->
    <div class="update-body">
      <div class="current-version">当前版本: v{{ currentVersion }}</div>
      
      <div class="release-notes">
        <h4>更新内容:</h4>
        <div class="notes-content" v-html="formattedReleaseNotes"></div>
      </div>

      <!-- 下载进度 -->
      <div v-if="downloading" class="download-progress">
        <el-progress :percentage="downloadProgress" :stroke-width="8" />
        <p class="progress-text">正在下载 {{ downloadProgress }}%</p>
      </div>
    </div>

    <!-- 按钮组 -->
    <template #footer>
      <div class="update-footer">
        <template v-if="!downloading">
          <el-button v-if="!forceUpdate" size="small" @click="onLater">稍后</el-button>
          <el-button v-if="!forceUpdate" size="small" @click="onIgnore">忽略</el-button>
          <el-button size="small" type="primary" :loading="checking" @click="onUpdate">
            立即更新
          </el-button>
        </template>
        <template v-else>
          <el-button size="small" disabled>下载中...</el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useUpdate } from '@/services/updateService';
import { marked } from 'marked';
import { Upload } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const {
  checking,
  hasUpdate,
  downloading,
  downloadProgress,
  latestVersion,
  releaseNotes,
  forceUpdate,
  startUpdate,
  ignoreUpdate,
  remindLater,
} = useUpdate();

const currentVersion = import.meta.env.VITE_APP_VERSION || '2.6.0';

const visible = computed({
  get: () => props.modelValue || hasUpdate.value,
  set: (val) => emit('update:modelValue', val),
});

const formattedReleaseNotes = computed(() => {
  if (!releaseNotes.value) return '暂无更新说明';
  try {
    return marked.parse(releaseNotes.value);
  } catch {
    return releaseNotes.value;
  }
});

watch(hasUpdate, (val) => {
  if (val) visible.value = true;
});

async function onUpdate() {
  try {
    await startUpdate();
  } catch (error) {
    // 错误已在 service 中处理
  }
}

function onLater() {
  remindLater();
  visible.value = false;
}

function onIgnore() {
  ignoreUpdate();
  visible.value = false;
}
</script>

<style scoped>
.update-dialog :deep(.el-dialog__header) {
  display: none;
}

.update-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.update-header {
  text-align: center;
  padding: 24px 20px 16px;
}

.update-icon-circle {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.update-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.update-body {
  padding: 0 20px 20px;
}

.current-version {
  font-size: 13px;
  color: #909399;
  text-align: center;
  margin-bottom: 12px;
}

.release-notes {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.release-notes h4 {
  font-size: 14px;
  color: #606266;
  margin: 0 0 8px;
}

.notes-content {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
}

.notes-content :deep(ul) {
  padding-left: 16px;
  margin: 0;
}

.notes-content :deep(li) {
  margin-bottom: 4px;
}

.download-progress {
  margin-top: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.progress-text {
  text-align: center;
  font-size: 13px;
  color: #606266;
  margin: 8px 0 0;
}

.update-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>

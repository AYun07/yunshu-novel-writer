<template>
  <!-- 更新提示弹窗 -->
  <van-popup
    v-model:show="visible"
    position="center"
    round
    :closeable="!forceUpdate"
    :close-on-click-overlay="!forceUpdate"
    class="update-dialog"
  >
    <div class="update-content">
      <!-- 头部图标 -->
      <div class="update-header">
        <div class="update-icon">
          <van-icon name="upgrade" size="40" color="#409eff" />
        </div>
        <h3 class="update-title">发现新版本</h3>
        <span class="version-tag">v{{ latestVersion }}</span>
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
          <van-progress
            :percentage="downloadProgress"
            :stroke-width="8"
            color="#409eff"
          />
          <p class="progress-text">正在下载 {{ downloadProgress }}%</p>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="update-footer">
        <template v-if="!downloading">
          <van-button
            v-if="!forceUpdate"
            size="small"
            plain
            type="default"
            @click="onLater"
          >
            稍后
          </van-button>
          <van-button
            v-if="!forceUpdate"
            size="small"
            plain
            type="default"
            @click="onIgnore"
          >
            忽略
          </van-button>
          <van-button
            size="small"
            type="primary"
            :loading="checking"
            @click="onUpdate"
          >
            立即更新
          </van-button>
        </template>
        <template v-else>
          <van-button
            size="small"
            type="default"
            disabled
          >
            下载中...
          </van-button>
        </template>
      </div>
    </div>
  </van-popup>

  <!-- 强制更新遮罩 -->
  <van-overlay v-if="forceUpdate && visible" :show="true" z-index="9999" />
</template>

<script setup>
import { computed, watch } from 'vue';
import { useUpdate } from '@/services/updateService';
import { marked } from 'marked';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const {
  state,
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

// 格式化发布说明（Markdown 转 HTML）
const formattedReleaseNotes = computed(() => {
  if (!releaseNotes.value) return '暂无更新说明';
  try {
    return marked.parse(releaseNotes.value);
  } catch {
    return releaseNotes.value;
  }
});

// 监听 hasUpdate 变化，自动显示弹窗
watch(hasUpdate, (val) => {
  if (val) {
    visible.value = true;
  }
});

// 立即更新
async function onUpdate() {
  try {
    await startUpdate();
  } catch (error) {
    // 错误已在 service 中处理
  }
}

// 稍后提醒
function onLater() {
  remindLater();
  visible.value = false;
}

// 忽略此版本
function onIgnore() {
  ignoreUpdate();
  visible.value = false;
}
</script>

<style scoped>
.update-dialog {
  width: 85%;
  max-width: 360px;
}

.update-content {
  padding: 20px;
}

.update-header {
  text-align: center;
  margin-bottom: 16px;
}

.update-icon {
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
  color: #333;
  margin: 0 0 4px;
}

.version-tag {
  display: inline-block;
  background: #409eff;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.update-body {
  margin-bottom: 20px;
}

.current-version {
  font-size: 13px;
  color: #999;
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
  color: #666;
  margin: 0 0 8px;
}

.notes-content {
  font-size: 13px;
  color: #333;
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
  color: #666;
  margin: 8px 0 0;
}

.update-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.update-footer .van-button {
  min-width: 70px;
}
</style>

<template>
  <div class="sync-settings">
    <!-- 顶部导航 -->
    <div class="header">
      <el-button type="text" @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h1 class="title">数据同步</h1>
      <el-button type="text" @click="showHelp = true">
        <el-icon><QuestionFilled /></el-icon>
      </el-button>
    </div>
    
    <div class="sync-content">
      <!-- 未配置状态 -->
      <div v-if="!isConfigured" class="setup-section">
        <el-empty description="尚未配置同步">
          <template #image>
            <el-icon :size="64" color="#ccc"><Upload /></el-icon>
          </template>
        </el-empty>
        
        <el-form :model="form" label-position="top" class="setup-form">
          <el-form-item label="服务器地址">
            <el-input 
              v-model="form.serverUrl" 
              placeholder="https://dav.jianguoyun.com/dav/"
            />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" />
          </el-form-item>
          
          <div class="form-tips">
            <p>支持坚果云、Nextcloud 等 WebDAV 服务器</p>
            <p>坚果云地址: https://dav.jianguoyun.com/dav/</p>
          </div>
          
          <el-divider>加密设置（可选）</el-divider>
          
          <el-form-item label="加密密码">
            <el-input 
              v-model="form.encryptPassword" 
              type="password" 
              placeholder="设置后数据将被加密存储"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.enableEncrypt">启用端到端加密</el-checkbox>
          </el-form-item>
          
          <el-button
            type="primary"
            size="large"
            :loading="testing"
            @click="onSetupSubmit"
            class="submit-btn"
          >
            {{ testing ? '正在测试连接...' : '测试并保存' }}
          </el-button>
        </el-form>
      </div>
      
      <!-- 已配置状态 -->
      <div v-else class="sync-status">
        <el-card class="status-card">
          <div class="status-row">
            <span>同步状态</span>
            <el-tag :type="syncStatusType">{{ syncStatusText }}</el-tag>
          </div>
          <div class="status-row">
            <span>最后同步</span>
            <span>{{ lastSyncTimeText }}</span>
          </div>
          <div class="status-row">
            <span>服务器</span>
            <span class="text-ellipsis">{{ config?.serverUrl }}</span>
          </div>
          <div class="status-row">
            <span>用户名</span>
            <span>{{ config?.username }}</span>
          </div>
          <div class="status-row">
            <span>加密保护</span>
            <el-tag :type="config?.hasEncryptPassword ? 'success' : 'info'" size="small">
              {{ config?.hasEncryptPassword ? '已启用' : '未启用' }}
            </el-tag>
          </div>
        </el-card>
        
        <!-- 同步进度 -->
        <el-card v-if="isSyncing" class="progress-card">
          <el-progress :percentage="progress" :stroke-width="8" />
          <p class="progress-text">{{ message }}</p>
        </el-card>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button
            type="primary"
            size="large"
            :loading="isSyncing"
            @click="onSyncNow"
            class="action-btn"
          >
            {{ isSyncing ? '同步中...' : '立即同步' }}
          </el-button>
          
          <el-button
            size="large"
            @click="onClearConfig"
            class="action-btn"
          >
            断开同步
          </el-button>
        </div>
        
        <!-- 冲突列表 -->
        <el-card v-if="conflicts.length > 0" class="conflicts-card">
          <template #header>
            <span>检测到 {{ conflicts.length }} 个冲突</span>
          </template>
          <div
            v-for="(conflict, index) in conflicts"
            :key="index"
            class="conflict-item"
            @click="showConflictDetail(conflict)"
          >
            <span>{{ conflict.table }} #{{ conflict.id }}</span>
            <el-icon><Warning /></el-icon>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 帮助对话框 -->
    <el-dialog v-model="showHelp" title="数据同步说明" width="90%">
      <div class="help-content">
        <h4>什么是 WebDAV 同步？</h4>
        <p>WebDAV 是一种网络存储协议，可以让您将数据同步到云端服务器，实现多设备数据同步。</p>
        
        <h4>支持的云存储</h4>
        <ul>
          <li><strong>坚果云</strong>（推荐）- 国内稳定，免费版每月 1GB 上传流量</li>
          <li><strong>Nextcloud</strong> - 自建服务器，完全掌控数据</li>
          <li>其他支持 WebDAV 协议的云存储服务</li>
        </ul>
        
        <h4>端到端加密</h4>
        <p>启用加密后，您的数据会在本地加密后再上传到云端。即使云存储服务商也无法读取您的数据内容。</p>
        
        <h4>注意事项</h4>
        <ul>
          <li>请妥善保管加密密码，丢失后无法恢复数据</li>
          <li>建议定期进行本地备份</li>
          <li>首次同步可能需要较长时间，请保持网络畅通</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useWebDAVSync } from '../services/webdavSync.js';
import {
  ArrowLeft, QuestionFilled, Upload, Warning
} from '@element-plus/icons-vue';

const router = useRouter();

const {
  isConfigured,
  isSyncing,
  progress,
  lastSyncTime,
  error,
  conflicts,
  initSync,
  performSync,
  clearConfig,
  getConfig,
} = useWebDAVSync();

const config = computed(() => getConfig());

const form = ref({
  serverUrl: 'https://dav.jianguoyun.com/dav/',
  username: '',
  password: '',
  encryptPassword: '',
  enableEncrypt: false,
});

const testing = ref(false);
const message = ref('');
const showHelp = ref(false);

// 同步状态文本
const syncStatusText = computed(() => {
  if (isSyncing.value) return '同步中';
  if (error.value) return '同步失败';
  if (conflicts.value.length > 0) return '有冲突';
  return '正常';
});

const syncStatusType = computed(() => {
  if (isSyncing.value) return 'primary';
  if (error.value) return 'danger';
  if (conflicts.value.length > 0) return 'warning';
  return 'success';
});

// 最后同步时间文本
const lastSyncTimeText = computed(() => {
  if (!lastSyncTime.value) return '从未同步';
  const date = new Date(lastSyncTime.value);
  return date.toLocaleString('zh-CN');
});

// 测试并保存配置
async function onSetupSubmit() {
  if (!form.value.serverUrl || !form.value.username || !form.value.password) {
    ElMessage.warning('请填写完整的服务器信息');
    return;
  }
  
  testing.value = true;
  
  try {
    await initSync({
      serverUrl: form.value.serverUrl,
      username: form.value.username,
      password: form.value.password,
      encryptPassword: form.value.enableEncrypt ? form.value.encryptPassword : null,
    });
    
    ElMessage.success('配置成功');
    
    // 立即执行一次同步
    await performSync({
      encryptPassword: form.value.enableEncrypt ? form.value.encryptPassword : null,
    });
  } catch (err) {
    ElMessage.error('配置失败: ' + err.message);
  } finally {
    testing.value = false;
  }
}

// 立即同步
async function onSyncNow() {
  try {
    const result = await performSync();
    
    if (result?.hasConflicts) {
      ElMessage.warning('检测到冲突，请处理');
    } else {
      ElMessage.success('同步成功');
    }
  } catch (err) {
    ElMessage.error('同步失败: ' + err.message);
  }
}

// 断开同步
async function onClearConfig() {
  try {
    await ElMessageBox.confirm(
      '断开同步后，本地数据将保留，但不再自动同步到云端。确定要继续吗？',
      '确认断开',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    
    clearConfig();
    ElMessage.success('已断开同步');
  } catch {
    // 用户取消
  }
}

// 显示冲突详情
function showConflictDetail(conflict) {
  ElMessageBox.confirm(
    '本地和远程都有更新，请选择保留哪个版本？',
    `${conflict.table} #${conflict.id} 冲突`,
    { confirmButtonText: '使用本地', cancelButtonText: '使用远程', type: 'warning' }
  ).then(() => {
    ElMessage.success('已选择本地版本');
  }).catch(() => {
    ElMessage.success('已选择远程版本');
  });
}
</script>

<style scoped>
.sync-settings {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.sync-content {
  padding: 16px;
}

.setup-section {
  padding: 16px 0;
}

.setup-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-tips {
  padding: 12px 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}

.form-tips p {
  margin: 4px 0;
}

.submit-btn {
  width: 100%;
  margin-top: 24px;
}

.status-card {
  margin-bottom: 16px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.status-row:last-child {
  border-bottom: none;
}

.status-row span:first-child {
  color: #606266;
}

.text-ellipsis {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-card {
  margin-bottom: 16px;
}

.progress-text {
  text-align: center;
  font-size: 13px;
  color: #606266;
  margin-top: 12px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.action-btn {
  width: 100%;
}

.conflicts-card {
  margin-top: 16px;
}

.conflict-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}

.conflict-item:last-child {
  border-bottom: none;
}

.conflict-item:hover {
  background: #f5f7fa;
}

.help-content {
  line-height: 1.8;
}

.help-content h4 {
  margin: 16px 0 8px;
  color: #303133;
}

.help-content p {
  margin: 8px 0;
  color: #606266;
}

.help-content ul {
  padding-left: 20px;
  color: #606266;
}

.help-content li {
  margin: 4px 0;
}
</style>

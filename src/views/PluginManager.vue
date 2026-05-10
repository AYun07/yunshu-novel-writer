<template>
  <div class="plugin-manager">
    <div class="page-header">
      <h2>插件管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showInstallDialog = true">
          <el-icon><Plus /></el-icon> 安装插件
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 已安装插件 Tab -->
      <el-tab-pane label="已安装" name="installed">
        <div class="plugin-grid">
          <div v-for="plugin in installedPlugins" :key="plugin.name" class="plugin-card">
            <div class="plugin-card-header">
              <div class="plugin-icon" :style="{ backgroundColor: getPluginColor(plugin.name) }">
                <el-icon :size="24"><component :is="getPluginIcon(plugin.name)" /></el-icon>
              </div>
              <div class="plugin-meta">
                <div class="plugin-name">{{ plugin.displayName }}</div>
                <div class="plugin-version">v{{ plugin.version }} · {{ plugin.author }}</div>
              </div>
              <el-switch
                :model-value="plugin.status === 'active'"
                @change="(val) => togglePlugin(plugin.name, val)"
                active-text="启用"
                inactive-text="禁用"
              />
            </div>
            <p class="plugin-desc">{{ plugin.description }}</p>
            <div class="plugin-card-footer">
              <el-tag size="small" :type="getStatusTagType(plugin.status)">
                {{ getStatusLabel(plugin.status) }}
              </el-tag>
              <div class="plugin-card-actions">
                <el-button type="primary" link size="small" @click="showPluginDetail(plugin)">详情</el-button>
                <el-button type="primary" link size="small" @click="openPluginConfig(plugin)">配置</el-button>
                <el-button type="danger" link size="small" @click="uninstallPlugin(plugin.name)">卸载</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="installedPlugins.length === 0" description="暂无已安装插件" />
      </el-tab-pane>

      <!-- 插件市场 Tab -->
      <el-tab-pane label="插件市场" name="market">
        <div class="market-placeholder">
          <el-icon :size="64" color="#c0c4cc"><Shop /></el-icon>
          <h3>插件市场即将开放</h3>
          <p>我们正在积极建设插件生态系统，敬请期待。</p>
          <p class="market-hint">您也可以通过"安装插件"按钮从 JSON 字符串或 URL 手动安装插件。</p>
        </div>
      </el-tab-pane>

      <!-- 插件日志 Tab -->
      <el-tab-pane label="运行日志" name="logs">
        <div class="log-toolbar">
          <el-button size="small" @click="clearLogs">清空日志</el-button>
          <el-select v-model="logFilter" size="small" style="width: 120px;">
            <el-option label="全部" value="all" />
            <el-option label="信息" value="info" />
            <el-option label="警告" value="warn" />
            <el-option label="错误" value="error" />
          </el-select>
        </div>
        <div class="log-container">
          <div v-for="(log, idx) in filteredLogs" :key="idx" class="log-item" :class="'log-' + log.level">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-level" :class="'level-' + log.level">[{{ log.level.toUpperCase() }}]</span>
            <span class="log-plugin">[{{ log.plugin }}]</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
          <el-empty v-if="filteredLogs.length === 0" description="暂无日志" />
        </div>
      </el-tab-pane>

      <!-- 开发文档 Tab -->
      <el-tab-pane label="开发文档" name="docs">
        <div class="docs-content">
          <h3>插件开发指南</h3>
          <el-collapse>
            <el-collapse-item title="1. 插件接口规范" name="spec">
              <p>每个云书插件必须实现以下接口：</p>
              <pre class="code-block">{
  name: 'my-plugin',        // 插件唯一标识名
  version: '1.0.0',         // 语义化版本号
  displayName: '我的插件',  // 显示名称
  description: '插件描述',  // 描述
  author: '作者名',         // 作者
  permissions: ['data:read'], // 所需权限
  install(api) { },         // 安装钩子
  activate(api) { },        // 激活钩子
  deactivate(api) { },      // 停用钩子（可选）
  uninstall(api) { }        // 卸载钩子（可选）
}</pre>
            </el-collapse-item>
            <el-collapse-item title="2. 可用权限列表" name="permissions">
              <el-table :data="permissionList" size="small" stripe>
                <el-table-column prop="key" label="权限标识" width="160" />
                <el-table-column prop="desc" label="说明" />
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="3. API 使用示例" name="api">
              <pre class="code-block">// 读取项目数据
const chapters = await api.queryData('chapters', { projectId: 1 })

// 注册侧边栏面板
api.registerPanel({
  id: 'my-panel',
  title: '我的面板',
  icon: 'Star',
  component: MyPanelComponent
})

// 发送通知
api.notify('操作完成', 'success')

// 使用私有存储
api.storage.set('config', { theme: 'dark' })
const config = api.storage.get('config')

// 订阅事件
api.on('chapter:saved', (data) => {
  console.log('章节已保存:', data)
})</pre>
            </el-collapse-item>
            <el-collapse-item title="4. 插件打包与分发" name="packaging">
              <p>插件以 JavaScript 对象形式分发，可通过以下方式安装：</p>
              <ul>
                <li>JSON 字符串导入：将插件代码粘贴到安装对话框</li>
                <li>URL 加载：提供插件代码的在线地址</li>
                <li>内置插件：随应用一起发布的官方插件</li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 安装插件对话框 -->
    <el-dialog v-model="showInstallDialog" title="安装插件" width="560px">
      <el-tabs v-model="installTab">
        <el-tab-pane label="JSON 导入" name="json">
          <el-input
            v-model="installJson"
            type="textarea"
            :rows="10"
            placeholder="请粘贴插件 JSON 代码..."
          />
        </el-tab-pane>
        <el-tab-pane label="URL 加载" name="url">
          <el-input v-model="installUrl" placeholder="请输入插件代码的 URL 地址" />
          <p class="install-hint">从指定 URL 加载插件代码，请确保来源可信。</p>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="showInstallDialog = false">取消</el-button>
        <el-button type="primary" @click="handleInstall" :loading="installing">安装</el-button>
      </template>
    </el-dialog>

    <!-- 插件详情对话框 -->
    <el-dialog v-model="showDetailDialog" :title="detailPlugin?.displayName || '插件详情'" width="560px">
      <template v-if="detailPlugin">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="名称">{{ detailPlugin.displayName }}</el-descriptions-item>
          <el-descriptions-item label="标识">{{ detailPlugin.name }}</el-descriptions-item>
          <el-descriptions-item label="版本">v{{ detailPlugin.version }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ detailPlugin.author }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small" :type="getStatusTagType(detailPlugin.status)">{{ getStatusLabel(detailPlugin.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述">{{ detailPlugin.description }}</el-descriptions-item>
          <el-descriptions-item label="权限">
            <el-tag v-for="p in (detailPlugin.permissions || [])" :key="p" size="small" style="margin-right: 4px;">{{ p }}</el-tag>
            <span v-if="!detailPlugin.permissions || detailPlugin.permissions.length === 0">无特殊权限</span>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 插件配置对话框 -->
    <el-dialog v-model="showConfigDialog" :title="`配置 - ${configPlugin?.displayName || ''}`" width="480px">
      <div v-if="configPlugin" class="config-panel">
        <el-form label-width="100px" size="small">
          <el-form-item v-for="item in getPluginConfigItems(configPlugin.name)" :key="item.key" :label="item.label">
            <el-switch v-if="item.type === 'switch'" v-model="item.value" />
            <el-input-number v-else-if="item.type === 'number'" v-model="item.value" :min="item.min" :max="item.max" />
            <el-input v-else v-model="item.value" :placeholder="item.placeholder || ''" />
          </el-form-item>
          <el-empty v-if="getPluginConfigItems(configPlugin.name).length === 0" description="该插件暂无可配置项" :image-size="60" />
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showConfigDialog = false">取消</el-button>
        <el-button type="primary" @click="savePluginConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import pluginSystem from '../services/pluginSystem.js'
const pluginManager = pluginSystem.manager
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Shop, DataAnalysis, Timer, Bell, Setting, Document } from '@element-plus/icons-vue'

// ==================== Tab 状态 ====================
const activeTab = ref('installed')

// ==================== 已安装插件 ====================
const installedPlugins = ref([])

function refreshPlugins() {
  installedPlugins.value = pluginManager.getAllPlugins()
}

function getPluginColor(name) {
  const colors = { 'word-counter': '#409eff', 'writing-timer': '#67c23a', 'auto-save-reminder': '#e6a23c' }
  return colors[name] || 'var(--primary-color)'
}
function getPluginIcon(name) {
  const icons = { 'word-counter': 'DataAnalysis', 'writing-timer': 'Timer', 'auto-save-reminder': 'Bell' }
  return icons[name] || 'Document'
}
function getStatusTagType(status) {
  const map = { active: 'success', disabled: 'info', loaded: 'warning', error: 'danger' }
  return map[status] || 'info'
}
function getStatusLabel(status) {
  const map = { active: '运行中', disabled: '已禁用', loaded: '已加载', error: '错误' }
  return map[status] || status
}

async function togglePlugin(name, enabled) {
  try {
    if (enabled) {
      await pluginManager.activate(name)
      ElMessage.success('插件已启用')
    } else {
      await pluginManager.deactivate(name)
      ElMessage.success('插件已禁用')
    }
    refreshPlugins()
  } catch (e) {
    ElMessage.error(`操作失败：${e.message}`)
  }
}

async function uninstallPlugin(name) {
  try {
    await ElMessageBox.confirm('确定卸载该插件？卸载后插件数据将被清除。', '确认卸载', { type: 'warning' })
    await pluginManager.unload(name)
    refreshPlugins()
    ElMessage.success('插件已卸载')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(`卸载失败：${e.message}`)
  }
}

// ==================== 插件详情 ====================
const showDetailDialog = ref(false)
const detailPlugin = ref(null)

function showPluginDetail(plugin) {
  detailPlugin.value = plugin
  showDetailDialog.value = true
}

// ==================== 插件配置 ====================
const showConfigDialog = ref(false)
const configPlugin = ref(null)
const pluginConfigs = ref({
  'word-counter': [
    { key: 'targetWords', label: '目标字数', type: 'number', value: 50000, min: 1000, max: 1000000 }
  ],
  'writing-timer': [
    { key: 'pomodoroDuration', label: '番茄时长(分钟)', type: 'number', value: 25, min: 5, max: 120 },
    { key: 'breakDuration', label: '休息时长(分钟)', type: 'number', value: 5, min: 1, max: 30 }
  ],
  'auto-save-reminder': [
    { key: 'reminderInterval', label: '提醒间隔(分钟)', type: 'number', value: 10, min: 1, max: 120 },
    { key: 'soundEnabled', label: '提示音', type: 'switch', value: true }
  ]
})

function openPluginConfig(plugin) {
  configPlugin.value = plugin
  showConfigDialog.value = true
}
function getPluginConfigItems(name) {
  return pluginConfigs.value[name] || []
}
function savePluginConfig() {
  showConfigDialog.value = false
  ElMessage.success('配置已保存')
}

// ==================== 安装插件 ====================
const showInstallDialog = ref(false)
const installTab = ref('json')
const installJson = ref('')
const installUrl = ref('')
const installing = ref(false)

async function handleInstall() {
  if (installTab.value === 'json') {
    if (!installJson.value.trim()) {
      ElMessage.warning('请输入插件代码')
      return
    }
    installing.value = true
    try {
      await pluginManager.loadFromString('user-plugin', installJson.value)
      refreshPlugins()
      showInstallDialog.value = false
      installJson.value = ''
      ElMessage.success('插件安装成功')
    } catch (e) {
      ElMessage.error(`安装失败：${e.message}`)
    } finally {
      installing.value = false
    }
  } else {
    if (!installUrl.value.trim()) {
      ElMessage.warning('请输入 URL 地址')
      return
    }
    installing.value = true
    try {
      const resp = await fetch(installUrl.value)
      const code = await resp.text()
      await pluginManager.loadFromString('url-plugin', code)
      refreshPlugins()
      showInstallDialog.value = false
      installUrl.value = ''
      ElMessage.success('插件安装成功')
    } catch (e) {
      ElMessage.error(`安装失败：${e.message}`)
    } finally {
      installing.value = false
    }
  }
}

// ==================== 日志系统 ====================
const pluginLogs = ref([
  { time: '10:30:15', level: 'info', plugin: 'word-counter', message: '插件已加载' },
  { time: '10:30:16', level: 'info', plugin: 'word-counter', message: '插件已激活' },
  { time: '10:30:16', level: 'info', plugin: 'writing-timer', message: '插件已加载' },
  { time: '10:31:00', level: 'warn', plugin: 'auto-save-reminder', message: '距离上次保存已过10分钟，请保存' },
  { time: '10:35:22', level: 'info', plugin: 'word-counter', message: '当前章节字数：3,200' }
])
const logFilter = ref('all')

const filteredLogs = computed(() => {
  if (logFilter.value === 'all') return pluginLogs.value
  return pluginLogs.value.filter(l => l.level === logFilter.value)
})

function clearLogs() {
  pluginLogs.value = []
  ElMessage.success('日志已清空')
}

// ==================== 开发文档 ====================
const permissionList = [
  { key: 'data:read', desc: '读取项目数据' },
  { key: 'data:write', desc: '写入项目数据' },
  { key: 'ui:panel', desc: '注册侧边栏面板' },
  { key: 'ui:menu', desc: '注册菜单项' },
  { key: 'ui:toolbar', desc: '注册工具栏按钮' },
  { key: 'ui:dialog', desc: '注册对话框' },
  { key: 'ai:call', desc: '调用 AI 接口' },
  { key: 'storage', desc: '使用本地存储' },
  { key: 'network', desc: '网络请求' },
  { key: 'clipboard', desc: '访问剪贴板' },
  { key: 'notification', desc: '发送通知' }
]

// ==================== 初始化 ====================
onMounted(() => {
  refreshPlugins()
})
</script>

<style scoped>
.plugin-manager {
  padding: 20px;
  background: var(--bg-color, #f5f7fa);
  min-height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-color, #303133);
}
.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
  padding: 16px;
}
.plugin-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}
.plugin-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.plugin-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.plugin-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.plugin-meta {
  flex: 1;
  min-width: 0;
}
.plugin-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color, #303133);
}
.plugin-version {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
.plugin-desc {
  margin: 8px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}
.plugin-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.plugin-card-actions {
  display: flex;
  gap: 4px;
}
.market-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}
.market-placeholder h3 {
  margin: 16px 0 8px;
  color: var(--text-color, #303133);
}
.market-placeholder p {
  color: #909399;
  font-size: 14px;
  margin: 4px 0;
}
.market-hint {
  font-size: 12px !important;
  color: #c0c4cc !important;
  margin-top: 16px !important;
}
.log-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.log-container {
  padding: 12px 16px;
  max-height: 400px;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 0 0 4px 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
}
.log-item {
  padding: 3px 0;
  line-height: 1.6;
  color: #d4d4d4;
}
.log-time {
  color: #6a9955;
  margin-right: 8px;
}
.log-level {
  margin-right: 8px;
  font-weight: 600;
}
.level-info { color: #569cd6; }
.level-warn { color: #dcdcaa; }
.level-error { color: #f44747; }
.log-plugin {
  color: #9cdcfe;
  margin-right: 8px;
}
.log-message {
  color: #d4d4d4;
}
.docs-content {
  padding: 20px;
}
.docs-content h3 {
  margin: 0 0 16px;
  color: var(--text-color, #303133);
}
.docs-content p {
  color: #606266;
  line-height: 1.8;
  font-size: 14px;
}
.docs-content ul {
  padding-left: 20px;
  color: #606266;
  line-height: 2;
}
.code-block {
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.install-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #909399;
}
.config-panel {
  padding: 8px 0;
}
</style>

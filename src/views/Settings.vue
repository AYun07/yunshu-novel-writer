<template>
  <div class="settings-page">

    <!-- 设置内容 -->
    <div class="settings-content">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- API配置 -->
        <el-tab-pane label="API配置" name="api">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>🔑 AI模型API配置</span>
                <el-button type="primary" @click="testAllConnections">测试所有连接</el-button>
              </div>
            </template>
            
            <ApiConfig />
          </el-card>
        </el-tab-pane>

        

        <!-- 数据管理 -->
        <el-tab-pane label="数据管理" name="data">
          <el-card shadow="never">
            <template #header>
              <span>💾 数据备份与恢复</span>
            </template>
            
            <div class="data-management">
              <!-- 数据概览 -->
              <div class="data-overview">
                <h3>📊 数据概览</h3>
                <div class="data-stats">
                  <div class="stat-item">
                    <div class="stat-label">小说作品</div>
                    <div class="stat-value">{{ dataStats.novels }}部</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">提示词库</div>
                    <div class="stat-value">{{ dataStats.prompts }}条</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">小说类型</div>
                    <div class="stat-value">{{ dataStats.genres }}种</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">写作目标</div>
                    <div class="stat-value">{{ dataStats.goals }}个</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">数据大小</div>
                    <div class="stat-value">{{ dataStats.size }}</div>
                  </div>
                </div>
              </div>

              <el-divider />

              <div class="data-section">
                <h3>📤 数据导出</h3>
                <p>导出您的小说数据、设置和提示词库，支持完整备份或分类导出</p>
                <div class="data-actions">
                  <el-button type="primary" @click="exportAllData">
                    <el-icon><Download /></el-icon>
                    导出所有数据
                  </el-button>
                  <el-button @click="exportNovels">
                    <el-icon><Document /></el-icon>
                    小说数据
                  </el-button>
                  <el-button @click="exportPrompts">
                    <el-icon><ChatLineSquare /></el-icon>
                    提示词库
                  </el-button>
                  <el-button @click="exportGenres">
                    <el-icon><Collection /></el-icon>
                    小说类型
                  </el-button>
                  <el-button @click="exportSettings">
                    <el-icon><Setting /></el-icon>
                    API配置
                  </el-button>
                </div>
              </div>
              
              <el-divider />
              
              <div class="data-section">
                <h3>📥 数据导入</h3>
                <p>从备份文件恢复您的数据，支持完整恢复或选择性导入</p>
                <div class="data-actions">
                  <el-upload
                    :before-upload="beforeImport"
                    :show-file-list="false"
                    accept=".json"
                  >
                    <el-button type="success">
                      <el-icon><Upload /></el-icon>
                      选择备份文件
                    </el-button>
                  </el-upload>
                  <el-button @click="showImportDialog = true">
                    <el-icon><Setting /></el-icon>
                    导入选项
                  </el-button>
                </div>
              </div>
              
              <el-divider />
              
              <div class="data-section">
                <h3>🗑️ 数据清除</h3>
                <p class="warning-text">⚠️ 危险操作：将清除本地数据，请谨慎操作</p>
                <div class="data-actions">
                  <el-button type="danger" @click="clearAllData">
                    <el-icon><Delete /></el-icon>
                    清除所有数据
                  </el-button>
                  <el-button type="warning" @click="clearNovels">
                    <el-icon><Document /></el-icon>
                    仅清除小说
                  </el-button>
                  <el-button type="warning" @click="clearSettings">
                    <el-icon><Setting /></el-icon>
                    重置API配置
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-tab-pane>

        <!-- 关于 -->
        <el-tab-pane label="关于" name="about">
          <el-card shadow="never">
            <template #header>
              <span>ℹ️ 关于应用</span>
            </template>
            
            <div class="about-content">
              <div class="app-info">
                <div class="app-logo">
                  <h1>☁️ 云书</h1>
                </div>
                <div class="app-details">
                  <p><strong>版本：</strong>v1.0.0</p>
                  <p><strong>更新时间：</strong>2025年5月9日</p>
                  <p><strong>开发者：</strong>云书团队</p>
                  <p><strong>描述：</strong>专业的AI小说创作平台，支持多种AI模型，提供大纲生成、章节创作、角色设定等一站式写作服务</p>
                </div>
              </div>
              
              <el-divider />
              
              <div class="features-list">
                <h3>🌟 主要功能</h3>
                <div class="features-grid">
                  <div class="feature-category">
                    <h4>📖 小说管理</h4>
                    <ul>
                      <li>• 多小说项目管理</li>
                      <li>• 小说类型与标签</li>
                      <li>• 详细作品信息</li>
                      <li>• 数据统计分析</li>
                    </ul>
                  </div>
                  
                  <div class="feature-category">
                    <h4>✍️ 智能编辑</h4>
                    <ul>
                      <li>• 章节状态管理</li>
                      <li>• 事件时间线</li>
                      <li>• AI内容润色</li>
                      <li>• AI智能续写</li>
                      <li>• 流式生成体验</li>
                    </ul>
                  </div>
                  
                  <div class="feature-category">
                    <h4>🤖 AI辅助</h4>
                    <ul>
                      <li>• 章节大纲生成</li>
                      <li>• 正文内容生成</li>
                      <li>• 人物角色生成</li>
                      <li>• 世界观设定生成</li>
                      <li>• 多种生成类型</li>
                    </ul>
                  </div>
                  
                  <div class="feature-category">
                    <h4>💡 创作工具</h4>
                    <ul>
                      <li>• 丰富提示词库</li>
                      <li>• 人物设定管理</li>
                      <li>• 世界观设定</li>
                      <li>• 语料库管理</li>
                      <li>• 写作目标设定</li>
                    </ul>
                  </div>
                  
                  <div class="feature-category">
                    <h4>⚙️ 系统功能</h4>
                    <ul>
                      <li>• 多AI模型支持</li>
                      <li>• API配置管理</li>
                      <li>• 数据备份恢复</li>
                      <li>• 短篇小说生成</li>
                      <li>• 书籍分析工具</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <el-divider />
              
              <div class="update-log">
                <h3>📋 更新日志</h3>
                
                <div class="log-item current-version">
                  <h4>v1.0.0 (2025-05-09) - 当前版本</h4>
                  <ul>
                    <li>• 🎉 云书正式发布</li>
                    <li>• ✨ 新增多主题切换功能（5种风格）</li>
                    <li>• 🔧 简化API配置，支持多种AI模型</li>
                    <li>• 🎨 全新UI设计，更现代的界面</li>
                    <li>• 🐛 修复若干已知问题</li>
                  </ul>
                </div>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 导入选项对话框 -->
    <el-dialog v-model="showImportDialog" title="导入选项" width="500px">
      <div class="import-options">
        <p>选择要导入的数据类型：</p>
        <el-checkbox-group v-model="importOptions">
          <el-checkbox label="novels">小说数据</el-checkbox>
          <el-checkbox label="prompts">提示词库</el-checkbox>
          <el-checkbox label="novelGenres">小说类型</el-checkbox>
          <el-checkbox label="writingGoals">写作目标</el-checkbox>
          <el-checkbox label="settings">API配置</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmImportOptions">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Upload, Document, Setting, Delete, ChatLineSquare, Collection } from '@element-plus/icons-vue'
import ApiConfig from '@/components/ApiConfig.vue'
import { STORAGE_KEYS } from '@/utils/constants.js'

// 响应式数据
const activeTab = ref('api')
const showImportDialog = ref(false)
const importOptions = ref(['novels', 'prompts', 'novelGenres', 'writingGoals'])

// 数据统计
const dataStats = ref({
  novels: 0,
  prompts: 0,
  genres: 0,
  goals: 0,
  size: '0KB'
})

// 方法
const testAllConnections = () => {
  ElMessage.info('正在测试所有API连接...')
  // 这里调用API配置组件的测试方法
}

// 计算数据统计
const calculateDataStats = () => {
  try {
    const novels = JSON.parse(localStorage.getItem('novels') || '[]')
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]')
    const genres = JSON.parse(localStorage.getItem('novelGenres') || '[]')
    const goals = JSON.parse(localStorage.getItem('writingGoals') || '[]')
    
    // 计算数据大小
    const allData = JSON.stringify({
      novels,
      prompts,
      genres,
      goals
    })
    
    const sizeInBytes = new Blob([allData]).size
    const sizeInKB = (sizeInBytes / 1024).toFixed(1)
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
    
    dataStats.value = {
      novels: novels.length,
      prompts: prompts.length,
      genres: genres.length,
      goals: goals.length,
      size: sizeInBytes > 1024 * 1024 ? `${sizeInMB}MB` : `${sizeInKB}KB`
    }
  } catch (error) {
    console.error('计算数据统计失败:', error)
  }
}

const exportAllData = () => {
  const data = {
    novels: JSON.parse(localStorage.getItem('novels') || '[]'),
    prompts: JSON.parse(localStorage.getItem('prompts') || '[]'),
    novelGenres: JSON.parse(localStorage.getItem('novelGenres') || '[]'),
    writingGoals: JSON.parse(localStorage.getItem('writingGoals') || '[]'),
    settings: {
      apiConfig: JSON.parse(localStorage.getItem(STORAGE_KEYS.API_CONFIG) || '{}'),
      tokenUsage: JSON.parse(localStorage.getItem(STORAGE_KEYS.TOKEN_USAGE) || '{}')
    },
    exportTime: new Date().toISOString(),
    version: 'v0.7.0'
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-完整备份-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('完整数据导出成功')
}

const exportNovels = () => {
  const novels = JSON.parse(localStorage.getItem('novels') || '[]')
  const data = {
    novels,
    exportTime: new Date().toISOString(),
    type: 'novels'
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-小说数据-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('小说数据导出成功')
}

const exportPrompts = () => {
  const prompts = JSON.parse(localStorage.getItem('prompts') || '[]')
  const data = {
    prompts,
    exportTime: new Date().toISOString(),
    type: 'prompts'
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-提示词库-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('提示词库导出成功')
}

const exportGenres = () => {
  const genres = JSON.parse(localStorage.getItem('novelGenres') || '[]')
  const data = {
    novelGenres: genres,
    exportTime: new Date().toISOString(),
    type: 'genres'
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-小说类型-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('小说类型数据导出成功')
}

const exportSettings = () => {
  const settings = {
    apiConfig: JSON.parse(localStorage.getItem(STORAGE_KEYS.API_CONFIG) || '{}'),
    tokenUsage: JSON.parse(localStorage.getItem(STORAGE_KEYS.TOKEN_USAGE) || '{}'),
    exportTime: new Date().toISOString(),
    type: 'settings'
  }
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `云书-系统设置-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('系统设置导出成功')
}

const confirmImportOptions = () => {
  if (importOptions.value.length === 0) {
    ElMessage.warning('请至少选择一种数据类型进行导入')
    return
  }
  
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      beforeImport(file)
    }
  }
  input.click()
  showImportDialog.value = false
}

const beforeImport = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      
      ElMessageBox.confirm(
        `即将导入以下数据类型：${importOptions.value.join('、')}。这将覆盖现有数据，是否继续？`,
        '确认导入',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let importCount = 0
        
        // 根据选择导入数据
        if (importOptions.value.includes('novels') && data.novels) {
          localStorage.setItem('novels', JSON.stringify(data.novels))
          importCount++
        }
        
        if (importOptions.value.includes('prompts') && data.prompts) {
          localStorage.setItem('prompts', JSON.stringify(data.prompts))
          importCount++
        }
        
        if (importOptions.value.includes('novelGenres') && data.novelGenres) {
          localStorage.setItem('novelGenres', JSON.stringify(data.novelGenres))
          importCount++
        }
        
        if (importOptions.value.includes('writingGoals')) {
          if (data.writingGoals) {
            localStorage.setItem('writingGoals', JSON.stringify(data.writingGoals))
            importCount++
          } else if (data.goals) {
            localStorage.setItem('writingGoals', JSON.stringify(data.goals))
            importCount++
          }
        }
        
        if (importOptions.value.includes('settings') && data.settings) {
          if (data.settings.apiConfig) {
            localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(data.settings.apiConfig))
            importCount++
          }
          if (data.settings.tokenUsage) {
            localStorage.setItem(STORAGE_KEYS.TOKEN_USAGE, JSON.stringify(data.settings.tokenUsage))
            importCount++
          }
        }
        
        // 重新计算数据统计
        calculateDataStats()
        
        if (importCount > 0) {
          ElMessage.success(`成功导入 ${importCount} 项数据`)
        } else {
          ElMessage.warning('未找到匹配的数据进行导入')
        }
      })
    } catch (error) {
      ElMessage.error('文件格式错误，请选择有效的备份文件')
    }
  }
  reader.readAsText(file)
  return false // 阻止自动上传
}

const clearAllData = () => {
  ElMessageBox.confirm(
    '这将清除所有本地数据，包括小说、设置、提示词等。此操作不可恢复，确定继续吗？',
    '确认清除',
    {
      confirmButtonText: '确定清除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    localStorage.clear()
    ElMessage.success('所有数据已清除')
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

const clearNovels = () => {
  ElMessageBox.confirm(
    '这将清除所有小说数据，此操作不可恢复，确定继续吗？',
    '确认清除小说',
    {
      confirmButtonText: '确定清除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    localStorage.removeItem('novels')
    calculateDataStats()
    ElMessage.success('小说数据已清除')
  })
}

const clearSettings = () => {
  ElMessageBox.confirm(
    '这将清除API配置等系统设置，确定继续吗？',
    '确认重置设置',
    {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 清除API配置等设置
    const settingsKeys = [STORAGE_KEYS.API_CONFIG, STORAGE_KEYS.TOKEN_USAGE]
    settingsKeys.forEach(key => localStorage.removeItem(key))
    
    ElMessage.success('系统设置已重置')
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

// 生命周期
onMounted(() => {
  calculateDataStats()
})
</script>

<style scoped>
.settings-page {
  padding: 0;
}


.settings-content {
  background: white;
  border-radius: 8px;
}

.settings-tabs {
  min-height: 600px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.data-management {
  padding: 10px 0;
}

.data-overview {
  margin-bottom: 20px;
}

.data-overview h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.data-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 10px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #495057;
}

.data-section {
  margin-bottom: 20px;
}

.data-section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.data-section p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.warning-text {
  color: #f56c6c !important;
}

.data-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.about-content {
  padding: 10px 0;
}

.app-info {
  text-align: center;
  margin-bottom: 20px;
}

.app-logo h1 {
  margin: 0 0 20px 0;
  font-size: 32px;
  color: #409eff;
}

.app-details p {
  margin: 8px 0;
  color: #606266;
}

.features-list h3,
.update-log h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.feature-category {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
}

.feature-category h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

.feature-category ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature-category li {
  margin: 6px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
}

.features-list ul {
  margin: 0;
  padding-left: 20px;
}

.features-list li {
  margin: 8px 0;
  color: #606266;
}

.log-item {
  margin-bottom: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
}

.log-item.current-version {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border: 2px solid #409eff;
}

.log-item h4 {
  margin: 0 0 15px 0;
  font-size: 15px;
  font-weight: 600;
  color: #409eff;
  padding-bottom: 8px;
  border-bottom: 1px solid #409eff;
}

.log-category {
  margin-bottom: 15px;
}

.log-category h5 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #67c23a;
}

.import-options {
  padding: 10px 0;
}

.import-options p {
  margin: 0 0 15px 0;
  color: #606266;
}

.import-options .el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-item ul {
  margin: 0;
  padding-left: 20px;
}

.log-item li {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-actions {
    flex-direction: column;
  }
  
  .data-actions .el-button {
    width: 100%;
  }
}

/* 主题样式 */
:root[data-theme="light"] {
  --bg-color: #ffffff;
  --text-color: #303133;
  --border-color: #e4e7ed;
}

:root[data-theme="dark"] {
  --bg-color: #1d1d1d;
  --text-color: #ffffff;
  --border-color: #434343;
}

:root[data-theme="dark"] .settings-page {
  background-color: var(--bg-color);
  color: var(--text-color);
}

:root[data-theme="dark"] .el-card {
  background-color: #2d2d2d;
  border-color: var(--border-color);
}

/* 禁用动画 */
.no-animations * {
  animation-duration: 0ms !important;
  animation-delay: 0ms !important;
  transition-duration: 0ms !important;
  transition-delay: 0ms !important;
}
</style>
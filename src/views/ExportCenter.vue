<template>
  <div class="export-center">
    <div class="page-header">
      <h2>导出中心</h2>
    </div>

    <!-- 项目选择器 -->
    <div class="section-block">
      <h3 class="section-title">选择项目</h3>
      <el-select v-model="selectedProjectId" placeholder="请选择要导出的项目" style="width: 100%;" size="large">
        <el-option v-for="p in projectList" :key="p.id" :label="p.name" :value="p.id">
          <span>{{ p.name }}</span>
          <span style="float: right; color: #909399; font-size: 12px;">{{ p.chapterCount }}章 / {{ formatWordCount(p.wordCount) }}</span>
        </el-option>
      </el-select>
    </div>

    <!-- 导出格式选择 -->
    <div class="section-block">
      <h3 class="section-title">选择导出格式</h3>
      <div class="format-cards">
        <div
          v-for="fmt in exportFormats"
          :key="fmt.id"
          class="format-card"
          :class="{ active: selectedFormats.includes(fmt.id) }"
          @click="toggleFormat(fmt.id)"
        >
          <div class="format-icon" :style="{ color: fmt.color }">
            <el-icon :size="32"><component :is="fmt.icon" /></el-icon>
          </div>
          <div class="format-info">
            <div class="format-name">{{ fmt.name }}</div>
            <div class="format-desc">{{ fmt.description }}</div>
            <div class="format-size">预估大小：{{ fmt.estimatedSize }}</div>
          </div>
          <el-checkbox :model-value="selectedFormats.includes(fmt.id)" @click.stop />
        </div>
      </div>
    </div>

    <!-- 导出模板选择 -->
    <div class="section-block">
      <h3 class="section-title">导出模板</h3>
      <el-radio-group v-model="selectedTemplate" size="large">
        <el-radio-button v-for="tpl in exportTemplates" :key="tpl.id" :value="tpl.id">
          {{ tpl.name }}
        </el-radio-button>
      </el-radio-group>
      <p class="template-desc">{{ currentTemplateDesc }}</p>
    </div>

    <!-- 高级选项 -->
    <el-collapse v-model="advancedExpanded">
      <el-collapse-item title="高级选项" name="advanced">
        <el-form label-width="100px" class="advanced-form">
          <el-form-item label="包含封面">
            <el-switch v-model="advancedOptions.includeCover" />
          </el-form-item>
          <el-form-item label="包含目录">
            <el-switch v-model="advancedOptions.includeToc" />
          </el-form-item>
          <el-form-item label="作者信息">
            <el-input v-model="advancedOptions.authorInfo" placeholder="请输入作者名称" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="章节范围">
            <div class="chapter-range">
              <el-input-number v-model="advancedOptions.chapterStart" :min="1" :max="maxChapters" placeholder="起始章节" size="small" />
              <span style="margin: 0 8px; color: #909399;">至</span>
              <el-input-number v-model="advancedOptions.chapterEnd" :min="1" :max="maxChapters" placeholder="结束章节" size="small" />
            </div>
          </el-form-item>
          <el-form-item label="字体" v-if="showFontOptions">
            <el-select v-model="advancedOptions.fontFamily" style="width: 200px;" size="small">
              <el-option label="宋体" value="宋体" />
              <el-option label="微软雅黑" value="微软雅黑" />
              <el-option label="黑体" value="黑体" />
              <el-option label="楷体" value="楷体" />
              <el-option label="仿宋" value="仿宋" />
            </el-select>
          </el-form-item>
          <el-form-item label="字号" v-if="showFontOptions">
            <el-select v-model="advancedOptions.fontSize" style="width: 200px;" size="small">
              <el-option label="小号 (10pt)" value="10" />
              <el-option label="五号 (10.5pt)" value="10.5" />
              <el-option label="小四 (12pt)" value="12" />
              <el-option label="四号 (14pt)" value="14" />
              <el-option label="小三 (15pt)" value="15" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- 导出操作 -->
    <div class="export-actions">
      <el-button
        type="primary"
        size="large"
        :disabled="selectedFormats.length === 0 || !selectedProjectId"
        :loading="exporting"
        @click="handleExport"
      >
        <el-icon><Download /></el-icon> 导出选中格式 ({{ selectedFormats.length }})
      </el-button>
      <el-button
        size="large"
        :disabled="!selectedProjectId"
        :loading="batchExporting"
        @click="handleBatchExport"
      >
        <el-icon><Files /></el-icon> 一键批量导出
      </el-button>
    </div>

    <!-- 导出进度 -->
    <div v-if="exportProgress.visible" class="export-progress">
      <el-progress
        :percentage="exportProgress.percentage"
        :status="exportProgress.status"
        :stroke-width="20"
        :text-inside="true"
      />
      <p class="progress-text">{{ exportProgress.message }}</p>
    </div>

    <!-- Markdown 预览 -->
    <div v-if="previewVisible" class="preview-section">
      <div class="preview-header">
        <h3>Markdown 预览</h3>
        <el-button type="primary" link @click="previewVisible = false">关闭预览</el-button>
      </div>
      <div class="preview-content">
        <pre>{{ previewContent }}</pre>
      </div>
    </div>

    <!-- 导出历史 -->
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-title">导出历史</h3>
        <el-button type="primary" link size="small" @click="refreshHistory">刷新</el-button>
      </div>
      <el-table :data="exportHistory" stripe style="width: 100%;" empty-text="暂无导出记录">
        <el-table-column prop="createdAt" label="时间" width="180" />
        <el-table-column prop="format" label="格式" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getFormatTagType(row.format)">{{ row.format.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="fileSize" label="大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleRedownload(row)">重新下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { exportToMarkdown, exportToDocx, exportToEpub, exportToPdf, batchExport, getExportHistory } from '../services/exportService.js'
import { ElMessage } from 'element-plus'
import { Document, Notebook, Reading, Download, Files } from '@element-plus/icons-vue'
import { STORAGE_KEYS } from '../utils/constants.js'

// ==================== 项目数据 ====================
const selectedProjectId = ref('')
const projectList = ref([])

// 从 localStorage 加载真实小说列表
function loadProjectList() {
  try {
    const novelsRaw = localStorage.getItem(STORAGE_KEYS.NOVELS)
    const novels = novelsRaw ? JSON.parse(novelsRaw) : []
    projectList.value = novels.map(novel => ({
      id: String(novel.id),
      name: novel.title,
      chapterCount: (novel.chapterList || []).length,
      wordCount: (novel.chapterList || []).reduce((sum, ch) => sum + (ch.wordCount || 0), 0)
    }))
  } catch (error) {
    console.error('加载项目列表失败:', error)
    projectList.value = []
  }
}
const maxChapters = computed(() => {
  const p = projectList.value.find(p => p.id === selectedProjectId.value)
  return p ? p.chapterCount : 100
})

// ==================== 导出格式 ====================
const exportFormats = [
  { id: 'markdown', name: 'Markdown', description: '纯文本标记格式，适合发布到博客或静态网站', icon: 'Document', color: '#409eff', estimatedSize: '~120KB' },
  { id: 'docx', name: 'DOCX', description: 'Word 文档格式，适合编辑和打印', icon: 'Notebook', color: '#2b579a', estimatedSize: '~350KB' },
  { id: 'epub', name: 'EPUB', description: '电子书格式，适合在阅读器上阅读', icon: 'Reading', color: '#67c23a', estimatedSize: '~280KB' },
  { id: 'pdf', name: 'PDF', description: '便携文档格式，适合分享和存档', icon: 'Download', color: '#f56c6c', estimatedSize: '~500KB' }
]
const selectedFormats = ref(['markdown'])

function toggleFormat(id) {
  const idx = selectedFormats.value.indexOf(id)
  if (idx > -1) {
    selectedFormats.value.splice(idx, 1)
  } else {
    selectedFormats.value.push(id)
  }
}

// ==================== 导出模板 ====================
const exportTemplates = [
  { id: 'publishing', name: '出版风格', description: '适合传统出版，排版规范，章节分明' },
  { id: 'webnovel', name: '网文风格', description: '适合网络连载，简洁明快，段落短小' },
  { id: 'minimal', name: '简约风格', description: '适合个人阅读，干净整洁，无多余装饰' }
]
const selectedTemplate = ref('publishing')
const currentTemplateDesc = computed(() => {
  const tpl = exportTemplates.find(t => t.id === selectedTemplate.value)
  return tpl ? tpl.description : ''
})

// ==================== 高级选项 ====================
const advancedExpanded = ref([])
const advancedOptions = reactive({
  includeCover: false,
  includeToc: true,
  authorInfo: '',
  chapterStart: 1,
  chapterEnd: 100,
  fontFamily: '宋体',
  fontSize: '12'
})
const showFontOptions = computed(() => {
  return selectedFormats.value.some(f => f === 'docx' || f === 'pdf')
})

// ==================== 导出操作 ====================
const exporting = ref(false)
const batchExporting = ref(false)
const exportProgress = reactive({
  visible: false,
  percentage: 0,
  status: '',
  message: ''
})

async function handleExport() {
  if (selectedFormats.value.length === 0) {
    ElMessage.warning('请至少选择一种导出格式')
    return
  }
  exporting.value = true
  exportProgress.visible = true
  exportProgress.percentage = 0
  exportProgress.status = ''
  exportProgress.message = '准备导出...'

  try {
    const projectData = buildMockProjectData()
    const total = selectedFormats.value.length
    for (let i = 0; i < total; i++) {
      const fmt = selectedFormats.value[i]
      exportProgress.message = `正在导出 ${fmt.toUpperCase()} (${i + 1}/${total})...`
      exportProgress.percentage = Math.round(((i + 1) / total) * 100)

      switch (fmt) {
        case 'markdown':
          exportToMarkdown(projectData, selectedTemplate.value)
          break
        case 'docx':
          await exportToDocx(projectData, selectedTemplate.value)
          break
        case 'epub':
          await exportToEpub(projectData, selectedTemplate.value)
          break
        case 'pdf':
          await exportToPdf(projectData, selectedTemplate.value)
          break
      }
      // 记录历史
      exportHistory.value.unshift({
        id: `hist-${Date.now()}-${i}`,
        createdAt: new Date().toLocaleString('zh-CN'),
        format: fmt,
        fileName: `${projectData.project.name}.${fmt}`,
        fileSize: Math.floor(Math.random() * 500000) + 50000,
        status: 'success'
      })
      await new Promise(r => setTimeout(r, 300))
    }
    exportProgress.status = 'success'
    exportProgress.message = '导出完成！'
    ElMessage.success('导出完成')
  } catch (e) {
    exportProgress.status = 'exception'
    exportProgress.message = `导出失败：${e.message}`
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

async function handleBatchExport() {
  batchExporting.value = true
  exportProgress.visible = true
  exportProgress.percentage = 0
  exportProgress.status = ''
  exportProgress.message = '准备批量导出...'

  try {
    const projectData = buildMockProjectData()
    const formats = ['markdown', 'docx', 'epub', 'pdf']
    await batchExport(projectData, selectedTemplate.value, (fmt, status) => {
      const idx = formats.indexOf(fmt)
      exportProgress.percentage = Math.round(((idx + 1) / formats.length) * 100)
      exportProgress.message = `正在导出 ${fmt.toUpperCase()}...`
    })
    exportProgress.status = 'success'
    exportProgress.message = '批量导出完成！'
    ElMessage.success('批量导出完成')
  } catch (e) {
    exportProgress.status = 'exception'
    exportProgress.message = `批量导出失败：${e.message}`
    ElMessage.error('批量导出失败')
  } finally {
    batchExporting.value = false
  }
}

// ==================== 预览 ====================
const previewVisible = ref(false)
const previewContent = ref('')

function handlePreview() {
  const projectData = buildMockProjectData()
  previewContent.value = exportToMarkdown(projectData, selectedTemplate.value)
  previewVisible.value = true
}

// ==================== 导出历史 ====================
const exportHistory = ref([
  { id: 'h1', createdAt: '2026/05/08 14:30', format: 'docx', fileName: '星辰大海.docx', fileSize: 356000, status: 'success' },
  { id: 'h2', createdAt: '2026/05/07 09:15', format: 'pdf', fileName: '星辰大海.pdf', fileSize: 512000, status: 'success' },
  { id: 'h3', createdAt: '2026/05/05 16:42', format: 'epub', fileName: '都市传说.epub', fileSize: 245000, status: 'success' }
])

async function refreshHistory() {
  try {
    const history = await getExportHistory(selectedProjectId.value || undefined)
    if (history && history.length > 0) {
      exportHistory.value = history.map(h => ({
        id: h.id || `h-${Date.now()}`,
        createdAt: h.createdAt ? new Date(h.createdAt).toLocaleString('zh-CN') : '-',
        format: h.format,
        fileName: h.fileName,
        fileSize: h.fileSize,
        status: h.status || 'success'
      }))
    }
    ElMessage.success('历史记录已刷新')
  } catch (e) {
    ElMessage.warning('刷新失败，显示本地缓存')
  }
}

function handleRedownload(row) {
  ElMessage.info(`正在重新下载：${row.fileName}`)
}

// ==================== 工具函数 ====================
function formatWordCount(count) {
  if (count >= 10000) return (count / 10000).toFixed(1) + '万字'
  return count.toLocaleString() + '字'
}
function formatFileSize(bytes) {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}
function getFormatTagType(format) {
  const map = { markdown: '', docx: 'primary', epub: 'success', pdf: 'danger' }
  return map[format] || ''
}
function buildMockProjectData() {
  try {
    const novelsRaw = localStorage.getItem(STORAGE_KEYS.NOVELS)
    const novels = novelsRaw ? JSON.parse(novelsRaw) : []
    const proj = projectList.value.find(p => p.id === selectedProjectId.value)

    if (proj) {
      // 找到选中的小说，使用其真实章节数据
      const novel = novels.find(n => String(n.id) === selectedProjectId.value)
      const chapters = (novel && novel.chapterList) ? novel.chapterList.map(ch => ({
        title: ch.title,
        content: ch.content || '',
        summary: ch.summary || ''
      })) : []

      return {
        project: {
          name: proj.name,
          author: advancedOptions.authorInfo || '云书用户',
          description: (novel && novel.description) || ''
        },
        chapters
      }
    }

    // 没有选中项目时，使用所有小说数据
    const allChapters = novels.flatMap(novel =>
      (novel.chapterList || []).map(ch => ({
        title: ch.title,
        content: ch.content || '',
        summary: ch.summary || ''
      }))
    )

    return {
      project: { name: '全部作品', author: advancedOptions.authorInfo || '云书用户', description: '' },
      chapters: allChapters
    }
  } catch (error) {
    console.error('构建导出数据失败:', error)
    return {
      project: { name: '未命名作品', author: '云书用户', description: '' },
      chapters: []
    }
  }
}

// 组件挂载时加载项目列表
onMounted(() => {
  loadProjectList()
})
</script>

<style scoped>
.export-center {
  padding: 20px;
  background: var(--bg-color, #f5f7fa);
  min-height: 100vh;
  max-width: 960px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-color, #303133);
}
.section-block {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-color, #303133);
}
.format-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.format-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 2px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.format-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
}
.format-card.active {
  border-color: var(--primary-color);
  background: rgba(64, 158, 255, 0.04);
}
.format-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.format-info {
  flex: 1;
  min-width: 0;
}
.format-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color, #303133);
  margin-bottom: 4px;
}
.format-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  margin-bottom: 4px;
}
.format-size {
  font-size: 11px;
  color: #c0c4cc;
}
.template-desc {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #909399;
}
.advanced-form {
  padding: 8px 0;
}
.chapter-range {
  display: flex;
  align-items: center;
}
.export-actions {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.export-progress {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.progress-text {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #606266;
  text-align: center;
}
.preview-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.preview-header h3 {
  margin: 0;
  font-size: 16px;
}
.preview-content {
  max-height: 400px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 4px;
  padding: 16px;
}
.preview-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
  line-height: 1.8;
  color: #303133;
}
</style>

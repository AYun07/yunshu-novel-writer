<template>
  <div class="foreshadowing-page">
    <div class="page-header">
      <h2>伏笔管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>新增伏笔
        </el-button>
        <el-button @click="handleExtractForeshadowing" :loading="isExtracting">
          <el-icon><MagicStick /></el-icon>AI提取伏笔
        </el-button>
        <el-button @click="handleShowRemindPanel">
          <el-icon><Bell /></el-icon>回收提醒
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>导出
        </el-button>
        <el-button @click="handleImport">
          <el-icon><Upload /></el-icon>导入
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card planted">
        <div class="stat-number">{{ stats.planted }}</div>
        <div class="stat-label">已埋设</div>
      </div>
      <div class="stat-card developing">
        <div class="stat-number">{{ stats.developing }}</div>
        <div class="stat-label">发展中</div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-number">{{ stats.resolved }}</div>
        <div class="stat-label">已回收</div>
      </div>
      <div class="stat-card unresolved">
        <div class="stat-number">{{ stats.unresolved }}</div>
        <div class="stat-label">未回收</div>
      </div>
    </div>

    <!-- 筛选与搜索 -->
    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索伏笔描述..."
        clearable
        style="width: 240px"
        @input="handleFilter"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 140px" @change="handleFilter">
        <el-option label="已埋设" value="planted" />
        <el-option label="发展中" value="developing" />
        <el-option label="已回收" value="resolved" />
      </el-select>
      <el-select v-model="filterType" placeholder="类型筛选" clearable style="width: 140px" @change="handleFilter">
        <el-option v-for="(label, key) in typeLabels" :key="key" :label="label" :value="key" />
      </el-select>
      <el-select v-model="filterImportance" placeholder="重要性" clearable style="width: 140px" @change="handleFilter">
        <el-option label="高" value="high" />
        <el-option label="中" value="medium" />
        <el-option label="低" value="low" />
      </el-select>
      <div style="flex:1"></div>
      <el-button-group v-if="selectedIds.length > 0">
        <el-button size="small" @click="handleBatchResolve">批量标记已回收</el-button>
        <el-button size="small" type="danger" @click="handleBatchDelete">批量删除</el-button>
      </el-button-group>
      <el-button size="small" @click="showTimeline = !showTimeline">
        {{ showTimeline ? '列表视图' : '时间线视图' }}
      </el-button>
    </div>

    <!-- 伏笔列表 -->
    <div v-if="!showTimeline" class="table-wrapper">
      <el-table
        :data="filteredForeshadowings"
        stripe
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getTypeTagType(row.type)">{{ typeLabels[row.type] || row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getStatusTagType(row.status)">{{ statusLabels[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="重要性" width="80">
          <template #default="{ row }">
            <span class="importance-dot" :class="row.importance"></span>
            {{ importanceLabels[row.importance] }}
          </template>
        </el-table-column>
        <el-table-column prop="chapterId" label="章节" width="90" show-overflow-tooltip />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" link @click="handleDevelop(row)" v-if="row.status === 'planted'">标记发展</el-button>
            <el-button size="small" link type="success" @click="handleResolve(row)" v-if="row.status !== 'resolved'">回收</el-button>
            <el-button size="small" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 时间线视图 -->
    <div v-else class="timeline-wrapper">
      <el-timeline>
        <el-timeline-item
          v-for="event in timelineData"
          :key="event.id"
          :type="getTimelineType(event.type)"
          :hollow="event.type === 'note'"
          :timestamp="event.chapterId || ''"
          placement="top"
        >
          <div class="timeline-content">
            <div class="timeline-desc">{{ event.detail }}</div>
            <div class="timeline-meta">
              <el-tag size="small" :type="getImportanceTagType(event.importance)">{{ importanceLabels[event.importance] }}</el-tag>
              <span class="timeline-type">{{ typeLabels[event.foreshadowingType] }}</span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="timelineData.length === 0" description="暂无时间线数据" />
    </div>

    <!-- 新增/编辑伏笔对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingForeshadowing ? '编辑伏笔' : '新增伏笔'"
      width="560px"
      destroy-on-close
    >
      <el-form :model="formData" label-width="90px" label-position="top">
        <el-form-item label="伏笔描述" required>
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="描述伏笔的具体内容" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="formData.type" style="width: 100%">
                <el-option v-for="(label, key) in typeLabels" :key="key" :label="label" :value="key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重要性">
              <el-select v-model="formData.importance" style="width: 100%">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="关联章节">
          <el-input v-model="formData.chapterId" placeholder="章节ID或名称" />
        </el-form-item>
        <el-form-item label="关联角色">
          <el-select v-model="formData.relatedCharacters" multiple filterable allow-create placeholder="选择或输入角色" style="width: 100%">
            <el-option v-for="char in novelStore.characters" :key="char.id" :label="char.name || char.id" :value="String(char.id)" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.note" type="textarea" :rows="2" placeholder="可选备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveForeshadowing" :loading="isSaving">保存</el-button>
      </template>
    </el-dialog>

    <!-- AI回收提醒面板 -->
    <el-drawer v-model="showRemindDrawer" title="AI回收提醒" size="420px" direction="rtl">
      <div class="remind-panel">
        <p class="remind-summary">当前共有 <strong>{{ unresolvedList.length }}</strong> 个伏笔未回收</p>
        <div v-if="unresolvedList.length === 0" class="remind-empty">
          <el-empty description="所有伏笔均已回收" :image-size="80" />
        </div>
        <div v-else class="remind-list">
          <div v-for="item in unresolvedList" :key="item.id" class="remind-item" :class="item.importance">
            <div class="remind-item-header">
              <el-tag size="small" :type="getImportanceTagType(item.importance)">{{ importanceLabels[item.importance] }}</el-tag>
              <el-tag size="small" :type="getStatusTagType(item.status)">{{ statusLabels[item.status] }}</el-tag>
            </div>
            <div class="remind-item-desc">{{ item.description }}</div>
            <div class="remind-item-meta">
              章节: {{ item.chapterId || '未指定' }}
              <span v-if="item.expectedResolveChapter"> | 预计回收: 第{{ item.expectedResolveChapter }}章</span>
            </div>
            <div class="remind-item-actions">
              <el-button size="small" type="success" @click="handleResolve(item)">标记回收</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 隐藏的文件导入input -->
    <input ref="fileInputRef" type="file" accept=".json" style="display:none" @change="handleFileImport" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, MagicStick, Bell, Download, Upload } from '@element-plus/icons-vue'
import {
  addForeshadowing, getForeshadowingsByProject, updateForeshadowing,
  deleteForeshadowing, developForeshadowing, resolveForeshadowing,
  getForeshadowingStats, generateForeshadowingTimeline,
  buildForeshadowingExtractPrompt, buildForeshadowingRemindPrompt
} from '../config/foreshadowingSystem.js'
import { useNovelStore } from '../stores/novel.js'

const novelStore = useNovelStore()

// 状态标签映射
const statusLabels = { planted: '已埋设', developing: '发展中', resolved: '已回收' }
const typeLabels = {
  plot: '情节', character: '角色', symbolic: '象征', worldview: '世界观',
  emotional: '情感', mystery: '悬疑', prophecy: '预言', callback: '回调'
}
const importanceLabels = { high: '高', medium: '中', low: '低' }

// 筛选与搜索
const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const filterImportance = ref('')
const showTimeline = ref(false)
const selectedIds = ref([])

// 对话框
const showAddDialog = ref(false)
const editingForeshadowing = ref(null)
const isSaving = ref(false)
const isExtracting = ref(false)
const showRemindDrawer = ref(false)
const fileInputRef = ref(null)

// 表单数据
const formData = reactive({
  description: '',
  type: 'plot',
  importance: 'medium',
  chapterId: '',
  relatedCharacters: [],
  note: ''
})

// 项目ID（从store或路由获取）
const projectId = computed(() => novelStore.currentProjectId || 'default')

// 伏笔列表
const foreshadowings = ref([])
const stats = ref({ planted: 0, developing: 0, resolved: 0, unresolved: 0 })

// 时间线数据
const timelineData = computed(() => {
  return generateForeshadowingTimeline(projectId.value)
})

// 未回收列表
const unresolvedList = computed(() => {
  return foreshadowings.value.filter(f => f.status !== 'resolved')
})

// 筛选后的伏笔列表
const filteredForeshadowings = computed(() => {
  let list = [...foreshadowings.value]
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(f => f.description.toLowerCase().includes(kw))
  }
  if (filterStatus.value) list = list.filter(f => f.status === filterStatus.value)
  if (filterType.value) list = list.filter(f => f.type === filterType.value)
  if (filterImportance.value) list = list.filter(f => f.importance === filterImportance.value)
  return list
})

// 加载数据
const loadData = () => {
  foreshadowings.value = getForeshadowingsByProject(projectId.value)
  stats.value = getForeshadowingStats(projectId.value)
}

// 筛选处理
const handleFilter = () => {}

// 表格选择
const handleSelectionChange = (rows) => {
  selectedIds.value = rows.map(r => r.id)
}

// 重置表单
const resetForm = () => {
  formData.description = ''
  formData.type = 'plot'
  formData.importance = 'medium'
  formData.chapterId = ''
  formData.relatedCharacters = []
  formData.note = ''
  editingForeshadowing.value = null
}

// 保存伏笔
const handleSaveForeshadowing = () => {
  if (!formData.description.trim()) {
    ElMessage.warning('请输入伏笔描述')
    return
  }
  isSaving.value = true
  try {
    if (editingForeshadowing.value) {
      updateForeshadowing(editingForeshadowing.value.id, {
        description: formData.description,
        type: formData.type,
        importance: formData.importance,
        chapterId: formData.chapterId,
        relatedCharacters: formData.relatedCharacters
      })
      if (formData.note) {
        updateForeshadowing(editingForeshadowing.value.id, {
          notes: [...(editingForeshadowing.value.notes || []), formData.note]
        })
      }
      ElMessage.success('伏笔已更新')
    } else {
      addForeshadowing({
        projectId: projectId.value,
        description: formData.description,
        type: formData.type,
        importance: formData.importance,
        chapterId: formData.chapterId,
        relatedCharacters: formData.relatedCharacters,
        notes: formData.note ? [formData.note] : []
      })
      ElMessage.success('伏笔已添加')
    }
    showAddDialog.value = false
    resetForm()
    loadData()
  } finally {
    isSaving.value = false
  }
}

// 编辑
const handleEdit = (row) => {
  editingForeshadowing.value = row
  formData.description = row.description
  formData.type = row.type
  formData.importance = row.importance
  formData.chapterId = row.chapterId || ''
  formData.relatedCharacters = row.relatedCharacters || []
  formData.note = ''
  showAddDialog.value = true
}

// 标记发展中
const handleDevelop = (row) => {
  developForeshadowing(row.id)
  ElMessage.success('已标记为发展中')
  loadData()
}

// 回收
const handleResolve = (row) => {
  resolveForeshadowing(row.id, row.chapterId || 'unknown')
  ElMessage.success('伏笔已回收')
  loadData()
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除伏笔"${row.description}"？`, '确认删除', { type: 'warning' })
    .then(() => {
      deleteForeshadowing(row.id)
      ElMessage.success('已删除')
      loadData()
    }).catch(() => {})
}

// 批量回收
const handleBatchResolve = () => {
  ElMessageBox.confirm(`确定将选中的 ${selectedIds.value.length} 个伏笔标记为已回收？`, '批量操作', { type: 'info' })
    .then(() => {
      selectedIds.value.forEach(id => resolveForeshadowing(id, 'batch'))
      ElMessage.success('批量回收完成')
      loadData()
    }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个伏笔？此操作不可撤销。`, '批量删除', { type: 'error' })
    .then(() => {
      selectedIds.value.forEach(id => deleteForeshadowing(id))
      ElMessage.success('批量删除完成')
      loadData()
    }).catch(() => {})
}

// AI提取伏笔
const handleExtractForeshadowing = async () => {
  isExtracting.value = true
  try {
    const prompt = buildForeshadowingExtractPrompt({
      chapterTitle: '当前章节',
      chapterContent: novelStore.currentNovel || '',
      novelGenre: '通用',
      existingForeshadowings: JSON.stringify(foreshadowings.value.map(f => f.description))
    })
    if (novelStore.isApiConfigured) {
      const result = await novelStore.generateContent(prompt)
      ElMessage.success('AI伏笔提取完成，请查看结果')
    } else {
      ElMessage.warning('请先配置API密钥以使用AI提取功能')
    }
  } catch (e) {
    ElMessage.error('AI提取失败: ' + e.message)
  } finally {
    isExtracting.value = false
  }
}

// 回收提醒
const handleShowRemindPanel = () => {
  showRemindDrawer.value = true
}

// 导出
const handleExport = () => {
  const data = JSON.stringify(foreshadowings.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'foreshadowings.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

// 导入
const handleImport = () => {
  fileInputRef.value?.click()
}

const handleFileImport = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      if (!Array.isArray(data)) throw new Error('格式错误')
      data.forEach(item => {
        addForeshadowing({ ...item, projectId: projectId.value })
      })
      ElMessage.success(`成功导入 ${data.length} 个伏笔`)
      loadData()
    } catch (err) {
      ElMessage.error('导入失败: 文件格式不正确')
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

// 辅助方法
const getStatusTagType = (status) => {
  const map = { planted: 'info', developing: 'warning', resolved: 'success' }
  return map[status] || 'info'
}

const getTypeTagType = (type) => {
  const map = { plot: '', character: 'success', symbolic: 'warning', worldview: 'danger', emotional: 'info', mystery: '', prophecy: 'warning', callback: 'info' }
  return map[type] || ''
}

const getImportanceTagType = (imp) => {
  const map = { high: 'danger', medium: 'warning', low: 'info' }
  return map[imp] || 'info'
}

const getTimelineType = (type) => {
  const map = { planted: 'primary', developing: 'warning', resolved: 'success', note: 'info' }
  return map[type] || 'info'
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.foreshadowing-page {
  padding: 4px;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}
.header-actions {
  display: flex;
  gap: 8px;
}
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card {
  flex: 1;
  padding: 18px 20px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  min-width: 120px;
}
.stat-card.planted { background: linear-gradient(135deg, #409eff, #66b1ff); }
.stat-card.developing { background: linear-gradient(135deg, #e6a23c, #f0c78a); }
.stat-card.resolved { background: linear-gradient(135deg, #67c23a, #95d475); }
.stat-card.unresolved { background: linear-gradient(135deg, #f56c6c, #fab6b6); }
.stat-number {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 4px;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.table-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.importance-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.importance-dot.high { background: #f56c6c; }
.importance-dot.medium { background: #e6a23c; }
.importance-dot.low { background: #909399; }
.timeline-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  max-height: 600px;
  overflow-y: auto;
}
.timeline-content {
  padding: 4px 0;
}
.timeline-desc {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}
.timeline-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.timeline-type {
  font-size: 12px;
  color: #909399;
}
.remind-panel {
  padding: 0 4px;
}
.remind-summary {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
}
.remind-empty {
  margin-top: 40px;
}
.remind-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.remind-item {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  background: #fafafa;
}
.remind-item.high { border-left: 4px solid #f56c6c; }
.remind-item.medium { border-left: 4px solid #e6a23c; }
.remind-item.low { border-left: 4px solid #909399; }
.remind-item-header {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
.remind-item-desc {
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
  margin-bottom: 6px;
}
.remind-item-meta {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}
</style>

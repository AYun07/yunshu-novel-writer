<template>
  <div class="mobile-projects">
    <!-- 顶部导航栏 -->
    <div class="header">
      <el-button type="text" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h1 class="title">项目管理</h1>
      <el-button type="primary" text @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索项目..."
        clearable
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="filter-tabs">
        <div
          v-for="filter in filterOptions"
          :key="filter.value"
          class="filter-tab"
          :class="{ active: currentFilter === filter.value }"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </div>
      </div>

      <div class="sort-bar">
        <span class="sort-label">排序:</span>
        <el-select v-model="sortBy" size="small" class="sort-select">
          <el-option label="最近更新" value="updatedAt" />
          <el-option label="创建时间" value="createdAt" />
          <el-option label="字数最多" value="wordCount" />
          <el-option label="名称排序" value="name" />
        </el-select>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="projects-list" ref="listRef">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-item"
        :class="{ 'swiping': swipingProjectId === project.id }"
        @touchstart="handleTouchStart($event, project)"
        @touchmove="handleTouchMove($event, project)"
        @touchend="handleTouchEnd($event, project)"
        @click="openProject(project)"
      >
        <!-- 滑动删除背景 -->
        <div class="swipe-actions">
          <div class="swipe-action edit" @click.stop="editProject(project)">
            <el-icon><Edit /></el-icon>
            <span>编辑</span>
          </div>
          <div class="swipe-action delete" @click.stop="confirmDelete(project)">
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </div>
        </div>

        <!-- 项目内容 -->
        <div
          class="project-content"
          :style="{ transform: `translateX(${swipeOffset[project.id] || 0}px)` }"
        >
          <div class="project-cover">
            <div
              class="cover-placeholder"
              :style="{ backgroundColor: getProjectColor(project.id) }"
            >
              <span class="cover-initial">{{ project.name.charAt(0) }}</span>
            </div>
            <div class="project-badge" v-if="project.status === 'writing'">
              <el-icon><Loading /></el-icon>
            </div>
          </div>

          <div class="project-info">
            <div class="project-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <el-tag size="small" :type="getStatusType(project.status)">
                {{ getStatusText(project.status) }}
              </el-tag>
            </div>

            <p class="project-desc" v-if="project.description">
              {{ project.description }}
            </p>

            <div class="project-meta">
              <span class="meta-item">
                <el-icon><Document /></el-icon>
                {{ project.chapterCount || 0 }} 章
              </span>
              <span class="meta-item">
                <el-icon><Edit /></el-icon>
                {{ formatNumber(project.wordCount || 0) }} 字
              </span>
              <span class="meta-item">
                <el-icon><Clock /></el-icon>
                {{ formatDate(project.updatedAt) }}
              </span>
            </div>

            <div class="project-progress" v-if="project.targetWordCount > 0">
              <el-progress
                :percentage="getProgress(project)"
                :stroke-width="6"
                :show-text="false"
                :color="getProgressColor(project)"
              />
              <span class="progress-text">
                {{ formatNumber(project.wordCount || 0) }} / {{ formatNumber(project.targetWordCount) }}
              </span>
            </div>
          </div>

          <el-icon class="project-arrow"><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredProjects.length === 0">
        <el-icon :size="64" class="empty-icon"><FolderOpened /></el-icon>
        <p class="empty-title">{{ searchQuery ? '没有找到匹配的项目' : '还没有项目' }}</p>
        <p class="empty-desc" v-if="!searchQuery">点击右上角创建你的第一个项目</p>
        <el-button
          v-if="searchQuery"
          type="primary"
          @click="searchQuery = ''; currentFilter = 'all'"
        >
          清除筛选
        </el-button>
      </div>
    </div>

    <!-- 项目详情抽屉 -->
    <el-drawer
      v-model="showDetailDrawer"
      title="项目详情"
      size="90%"
      direction="btt"
      class="project-drawer"
    >
      <div v-if="selectedProject" class="drawer-content">
        <!-- 项目封面 -->
        <div class="drawer-cover">
          <div
            class="cover-large"
            :style="{ backgroundColor: getProjectColor(selectedProject.id) }"
          >
            <span class="cover-initial-large">{{ selectedProject.name.charAt(0) }}</span>
          </div>
          <h2 class="drawer-title">{{ selectedProject.name }}</h2>
          <p class="drawer-genre">{{ selectedProject.genre || '未分类' }}</p>
        </div>

        <!-- 统计信息 -->
        <div class="drawer-stats">
          <div class="stat-item">
            <span class="stat-value">{{ selectedProject.chapterCount || 0 }}</span>
            <span class="stat-label">章节</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(selectedProject.wordCount || 0) }}</span>
            <span class="stat-label">字数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatNumber(selectedProject.characterCount || 0) }}</span>
            <span class="stat-label">角色</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ formatDate(selectedProject.createdAt) }}</span>
            <span class="stat-label">创建</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="drawer-actions">
          <el-button type="primary" size="large" @click="continueWriting(selectedProject)">
            <el-icon><EditPen /></el-icon>
            继续写作
          </el-button>
          <el-button size="large" @click="showChapters(selectedProject)">
            <el-icon><List /></el-icon>
            章节列表
          </el-button>
          <el-button size="large" @click="exportProject(selectedProject)">
            <el-icon><Download /></el-icon>
            导出项目
          </el-button>
        </div>

        <!-- 项目设置 -->
        <div class="drawer-settings">
          <h4>项目设置</h4>
          <el-form label-position="top">
            <el-form-item label="项目状态">
              <el-select v-model="selectedProject.status" style="width: 100%">
                <el-option label="草稿" value="draft" />
                <el-option label="写作中" value="writing" />
                <el-option label="已完成" value="completed" />
                <el-option label="暂停" value="paused" />
              </el-select>
            </el-form-item>
            <el-form-item label="目标字数">
              <el-input-number
                v-model="selectedProject.targetWordCount"
                :min="0"
                :step="10000"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-drawer>

    <!-- 新建项目对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建项目"
      width="90%"
      class="mobile-dialog"
    >
      <el-form :model="newProject" label-position="top">
        <el-form-item label="项目名称">
          <el-input
            v-model="newProject.name"
            placeholder="给你的作品起个名字"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="作品类型">
          <el-select v-model="newProject.genre" placeholder="选择类型" style="width: 100%">
            <el-option
              v-for="genre in genreOptions"
              :key="genre.value"
              :label="genre.label"
              :value="genre.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input
            v-model="newProject.description"
            type="textarea"
            rows="3"
            placeholder="简单描述一下你的作品..."
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="目标字数">
          <el-slider v-model="newProject.targetWordCount" :max="1000000" :step="10000" />
          <span class="target-display">{{ formatNumber(newProject.targetWordCount) }} 字</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createProject" :loading="creating">
          创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑项目对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑项目"
      width="90%"
      class="mobile-dialog"
    >
      <el-form v-if="editingProject" :model="editingProject" label-position="top">
        <el-form-item label="项目名称">
          <el-input v-model="editingProject.name" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="作品类型">
          <el-select v-model="editingProject.genre" style="width: 100%">
            <el-option
              v-for="genre in genreOptions"
              :key="genre.value"
              :label="genre.label"
              :value="genre.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input
            v-model="editingProject.description"
            type="textarea"
            rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="saving">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 底部安全区域 -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup>
/**
 * 移动端项目管理组件
 * 提供项目列表、搜索筛选、滑动删除、项目详情抽屉等功能
 * 支持手势操作，适配移动端触摸交互
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Plus, Search, Edit, Delete, ArrowRight,
  Document, Clock, FolderOpened, EditPen, List,
  Download, Loading
} from '@element-plus/icons-vue'
import database from '../../services/database.js'

// ==================== 路由和状态 ====================
const router = useRouter()

// ==================== 响应式数据 ====================
const projects = ref([])
const searchQuery = ref('')
const currentFilter = ref('all')
const sortBy = ref('updatedAt')
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDrawer = ref(false)
const selectedProject = ref(null)
const editingProject = ref(null)
const creating = ref(false)
const saving = ref(false)
const listRef = ref(null)

// 滑动相关状态
const swipingProjectId = ref(null)
const swipeOffset = ref({})
const touchStartX = ref(0)
const touchStartY = ref(0)
const currentSwipeOffset = ref(0)
const isSwiping = ref(false)

// 筛选选项
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '写作中', value: 'writing' },
  { label: '已完成', value: 'completed' },
  { label: '草稿', value: 'draft' }
]

// 作品类型选项
const genreOptions = [
  { label: '玄幻奇幻', value: 'fantasy' },
  { label: '都市言情', value: 'urban' },
  { label: '仙侠武侠', value: 'wuxia' },
  { label: '科幻未来', value: 'scifi' },
  { label: '悬疑推理', value: 'mystery' },
  { label: '历史军事', value: 'history' },
  { label: '游戏竞技', value: 'game' },
  { label: '灵异恐怖', value: 'horror' },
  { label: '其他类型', value: 'other' }
]

// 新建项目表单
const newProject = ref({
  name: '',
  genre: '',
  description: '',
  targetWordCount: 100000
})

// ==================== 计算属性 ====================

/**
 * 筛选和排序后的项目列表
 */
const filteredProjects = computed(() => {
  let result = [...projects.value]

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    )
  }

  // 状态筛选
  if (currentFilter.value !== 'all') {
    result = result.filter(p => p.status === currentFilter.value)
  }

  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'updatedAt':
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'wordCount':
        return (b.wordCount || 0) - (a.wordCount || 0)
      case 'name':
        return a.name.localeCompare(b.name, 'zh-CN')
      default:
        return 0
    }
  })

  return result
})

// ==================== 方法 ====================

/**
 * 格式化数字显示
 */
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString('zh-CN')
}

/**
 * 格式化日期显示
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date

  // 小于24小时显示相对时间
  if (diff < 24 * 60 * 60 * 1000) {
    if (diff < 60 * 60 * 1000) {
      return Math.floor(diff / (60 * 1000)) + '分钟前'
    }
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
  }

  // 小于7天显示星期几
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 获取项目状态文本
 */
const getStatusText = (status) => {
  const statusMap = {
    'draft': '草稿',
    'writing': '写作中',
    'completed': '已完成',
    'paused': '暂停'
  }
  return statusMap[status] || '草稿'
}

/**
 * 获取项目状态标签类型
 */
const getStatusType = (status) => {
  const typeMap = {
    'draft': 'info',
    'writing': 'primary',
    'completed': 'success',
    'paused': 'warning'
  }
  return typeMap[status] || 'info'
}

/**
 * 获取项目进度百分比
 */
const getProgress = (project) => {
  if (!project.targetWordCount || project.targetWordCount === 0) return 0
  return Math.min(100, Math.round((project.wordCount || 0) / project.targetWordCount * 100))
}

/**
 * 获取进度条颜色
 */
const getProgressColor = (project) => {
  const progress = getProgress(project)
  if (progress >= 100) return '#67c23a'
  if (progress >= 50) return '#409eff'
  return '#e6a23c'
}

/**
 * 获取项目颜色
 */
const getProjectColor = (id) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#8E44AD', '#16A085']
  return colors[id % colors.length]
}

/**
 * 打开项目
 */
const openProject = (project) => {
  if (isSwiping.value) return
  selectedProject.value = project
  showDetailDrawer.value = true
}

/**
 * 继续写作
 */
const continueWriting = (project) => {
  showDetailDrawer.value = false
  router.push({
    path: '/m/writer',
    query: { projectId: project.id }
  })
}

/**
 * 显示章节列表
 */
const showChapters = (project) => {
  showDetailDrawer.value = false
  router.push({
    path: '/m/chapters',
    query: { projectId: project.id }
  })
}

/**
 * 导出项目
 */
const exportProject = async (project) => {
  try {
    await database.projectIO.exportAsFile(project.id)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

/**
 * 编辑项目
 */
const editProject = (project) => {
  // 重置滑动位置
  swipeOffset.value[project.id] = 0
  swipingProjectId.value = null

  editingProject.value = { ...project }
  showEditDialog.value = true
}

/**
 * 保存编辑
 */
const saveEdit = async () => {
  if (!editingProject.value.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }

  saving.value = true
  try {
    await database.updateProject(editingProject.value.id, {
      name: editingProject.value.name,
      genre: editingProject.value.genre,
      description: editingProject.value.description,
      status: editingProject.value.status,
      targetWordCount: editingProject.value.targetWordCount
    })

    ElMessage.success('保存成功')
    showEditDialog.value = false
    loadProjects()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

/**
 * 确认删除项目
 */
const confirmDelete = (project) => {
  // 重置滑动位置
  swipeOffset.value[project.id] = 0
  swipingProjectId.value = null

  ElMessageBox.confirm(
    `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteProject(project)
  }).catch(() => {})
}

/**
 * 删除项目
 */
const deleteProject = async (project) => {
  try {
    await database.deleteProject(project.id)
    ElMessage.success('删除成功')
    loadProjects()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

/**
 * 创建新项目
 */
const createProject = async () => {
  if (!newProject.value.name.trim()) {
    ElMessage.warning('请输入项目名称')
    return
  }

  creating.value = true
  try {
    const projectId = await database.createProject({
      name: newProject.value.name,
      genre: newProject.value.genre,
      description: newProject.value.description,
      targetWordCount: newProject.value.targetWordCount,
      status: 'draft'
    })

    ElMessage.success('项目创建成功')
    showCreateDialog.value = false

    // 重置表单
    newProject.value = {
      name: '',
      genre: '',
      description: '',
      targetWordCount: 100000
    }

    // 跳转到新项目
    router.push({
      path: '/m/writer',
      query: { projectId }
    })
  } catch (error) {
    console.error('创建项目失败:', error)
    ElMessage.error('创建项目失败')
  } finally {
    creating.value = false
  }
}

// ==================== 滑动删除手势处理 ====================

/**
 * 触摸开始
 */
const handleTouchStart = (e, project) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  swipingProjectId.value = project.id
  isSwiping.value = false
  currentSwipeOffset.value = swipeOffset.value[project.id] || 0
}

/**
 * 触摸移动
 */
const handleTouchMove = (e, project) => {
  if (!swipingProjectId.value) return

  const touchX = e.touches[0].clientX
  const touchY = e.touches[0].clientY
  const deltaX = touchX - touchStartX.value
  const deltaY = touchY - touchStartY.value

  // 判断是水平滑动还是垂直滑动
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
    isSwiping.value = true
    e.preventDefault()

    // 限制滑动范围
    let newOffset = currentSwipeOffset.value + deltaX
    newOffset = Math.max(-160, Math.min(0, newOffset))

    swipeOffset.value[project.id] = newOffset
  }
}

/**
 * 触摸结束
 */
const handleTouchEnd = (e, project) => {
  if (!swipingProjectId.value) return

  const currentOffset = swipeOffset.value[project.id] || 0

  // 根据滑动距离决定是否展开或收起
  if (currentOffset < -80) {
    // 展开显示操作按钮
    swipeOffset.value[project.id] = -120
  } else {
    // 收起
    swipeOffset.value[project.id] = 0
    swipingProjectId.value = null
  }

  // 延迟重置滑动状态，避免触发点击
  setTimeout(() => {
    isSwiping.value = false
  }, 100)
}

// ==================== 数据加载 ====================

/**
 * 加载项目列表
 */
const loadProjects = async () => {
  try {
    const list = await database.getProjects()

    // 获取每个项目的统计信息
    const projectsWithStats = await Promise.all(
      list.map(async (project) => {
        const stats = await database.statistics.getProjectStats(project.id)
        return {
          ...project,
          wordCount: stats.totalWords,
          chapterCount: stats.chapterCount,
          characterCount: stats.characterCount
        }
      })
    )

    projects.value = projectsWithStats
  } catch (error) {
    console.error('加载项目失败:', error)
    ElMessage.error('加载项目失败')
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.mobile-projects {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

/* 顶部导航 */
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

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.search-input {
  margin-bottom: 12px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-tab {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  color: #606266;
  background: #f5f7fa;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #667eea;
  color: white;
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  font-size: 13px;
  color: #909399;
}

.sort-select {
  width: 120px;
}

/* 项目列表 */
.projects-list {
  padding: 12px 16px;
}

.project-item {
  position: relative;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0;
}

.swipe-action {
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.swipe-action.edit {
  background: #409eff;
}

.swipe-action.delete {
  background: #f56c6c;
}

.project-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
  position: relative;
  z-index: 1;
}

.project-cover {
  position: relative;
  flex-shrink: 0;
}

.cover-placeholder {
  width: 56px;
  height: 72px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.project-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #67c23a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.project-desc {
  font-size: 12px;
  color: #909399;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-progress :deep(.el-progress) {
  flex: 1;
}

.progress-text {
  font-size: 11px;
  color: #909399;
  min-width: 80px;
  text-align: right;
}

.project-arrow {
  color: #c0c4cc;
  font-size: 16px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  margin-bottom: 16px;
  color: #dcdfe6;
}

.empty-title {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #606266;
}

.empty-desc {
  font-size: 13px;
  margin: 0 0 16px 0;
}

/* 抽屉样式 */
:deep(.project-drawer) {
  border-radius: 20px 20px 0 0;
}

:deep(.project-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
}

.drawer-content {
  padding: 0 20px 20px;
}

.drawer-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.cover-large {
  width: 100px;
  height: 130px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.drawer-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #303133;
}

.drawer-genre {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.drawer-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
}

.drawer-actions .el-button {
  width: 100%;
  justify-content: center;
}

.drawer-settings {
  padding-top: 20px;
}

.drawer-settings h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 16px 0;
}

/* 对话框样式 */
:deep(.mobile-dialog) {
  border-radius: 16px;
}

.target-display {
  font-size: 13px;
  color: #606266;
  margin-top: 8px;
  display: block;
}

/* 安全区域 */
.safe-area-bottom {
  height: env(safe-area-inset-bottom, 0);
}
</style>

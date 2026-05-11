<template>
  <div class="mobile-home">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-header">
        <div class="user-avatar">
          <el-avatar :size="48" :icon="UserFilled" />
        </div>
        <div class="welcome-text">
          <h1 class="greeting">{{ greeting }}，作家</h1>
          <p class="date">{{ currentDate }}</p>
        </div>
      </div>
      <!-- 同步状态组件 -->
      <SyncStatus class="sync-status-bar" />
    </div>

    <!-- 今日写作统计卡片 - 横向滑动 -->
    <div class="stats-section">
      <h2 class="section-title">今日写作</h2>
      <div class="stats-scroll" ref="statsScrollRef">
        <div class="stats-cards">
          <!-- 今日字数卡片 -->
          <div class="stat-card primary">
            <div class="stat-icon">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ formatNumber(todayStats.words) }}</span>
              <span class="stat-label">今日字数</span>
            </div>
            <div class="stat-trend" v-if="todayStats.words > yesterdayStats.words">
              <el-icon><ArrowUp /></el-icon>
            </div>
          </div>

          <!-- 写作时长卡片 -->
          <div class="stat-card secondary">
            <div class="stat-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ formatDuration(todayStats.duration) }}</span>
              <span class="stat-label">写作时长</span>
            </div>
          </div>

          <!-- 连续天数卡片 -->
          <div class="stat-card success">
            <div class="stat-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ streakDays }}天</span>
              <span class="stat-label">连续写作</span>
            </div>
          </div>

          <!-- 完成章节卡片 -->
          <div class="stat-card warning">
            <div class="stat-icon">
              <el-icon><DocumentChecked /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ todayStats.chapters }}</span>
              <span class="stat-label">完成章节</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作按钮 -->
    <div class="quick-actions">
      <el-button
        type="primary"
        size="large"
        class="action-btn primary"
        @click="handleQuickWrite"
      >
        <el-icon><EditPen /></el-icon>
        <span>快速写作</span>
      </el-button>
      <el-button
        type="success"
        size="large"
        class="action-btn secondary"
        @click="handleContinueWriting"
        :disabled="!lastProject"
      >
        <el-icon><Reading /></el-icon>
        <span>继续写作</span>
      </el-button>
    </div>

    <!-- 最近项目列表 -->
    <div class="projects-section">
      <div class="section-header">
        <h2 class="section-title">最近项目</h2>
        <el-button
          type="text"
          size="small"
          @click="router.push('/m/projects')"
        >
          查看全部
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <div class="projects-list" v-if="recentProjects.length > 0">
        <div
          v-for="project in recentProjects"
          :key="project.id"
          class="project-card"
          @click="openProject(project)"
        >
          <div class="project-cover">
            <div class="cover-placeholder" :style="{ backgroundColor: getProjectColor(project.id) }">
              <span class="cover-initial">{{ project.name.charAt(0) }}</span>
            </div>
            <div class="project-status" :class="project.status">
              {{ getStatusText(project.status) }}
            </div>
          </div>
          <div class="project-info">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-meta">
              <span class="project-genre">{{ project.genre || '未分类' }}</span>
              <span class="project-words">{{ formatNumber(project.wordCount || 0) }}字</span>
            </p>
            <div class="project-progress">
              <el-progress
                :percentage="getProjectProgress(project)"
                :stroke-width="4"
                :show-text="false"
              />
              <span class="progress-text">{{ getProjectProgress(project) }}%</span>
            </div>
          </div>
          <el-icon class="project-arrow"><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <el-icon :size="48" class="empty-icon"><Document /></el-icon>
        <p class="empty-text">还没有项目</p>
        <el-button type="primary" @click="handleCreateProject">
          创建第一个项目
        </el-button>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <div
        class="nav-item active"
        @click="router.push('/m')"
      >
        <el-icon><House /></el-icon>
        <span>首页</span>
      </div>
      <div
        class="nav-item"
        @click="router.push('/m/projects')"
      >
        <el-icon><Folder /></el-icon>
        <span>项目</span>
      </div>
      <div class="nav-item center" @click="handleQuickWrite">
        <div class="center-btn">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <div
        class="nav-item"
        @click="router.push('/m/writer')"
      >
        <el-icon><Edit /></el-icon>
        <span>写作</span>
      </div>
      <div
        class="nav-item"
        @click="router.push('/m/profile')"
      >
        <el-icon><User /></el-icon>
        <span>我的</span>
      </div>
    </div>

    <!-- 底部安全区域留白 -->
    <div class="safe-area-bottom"></div>

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
        <el-form-item label="目标字数">
          <el-slider v-model="newProject.targetWordCount" :max="1000000" :step="10000" show-stops />
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
  </div>
</template>

<script setup>
/**
 * 移动端首页组件
 * 提供今日写作统计、最近项目列表、快捷操作等功能
 * 适配移动端触摸操作和屏幕尺寸
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  UserFilled, Edit, Timer, Calendar, DocumentChecked,
  ArrowRight, EditPen, Reading, House, Folder, Plus,
  User, Document, ArrowUp
} from '@element-plus/icons-vue'
import SyncStatus from '../../components/SyncStatus.vue'
import { STORAGE_KEYS } from '../../utils/constants.js'

// ==================== 路由和状态 ====================
const router = useRouter()

// ==================== 响应式数据 ====================
const currentDate = ref('')
const todayStats = ref({
  words: 0,
  duration: 0,
  chapters: 0
})
const yesterdayStats = ref({
  words: 0
})
const streakDays = ref(0)
const recentProjects = ref([])
const lastProject = ref(null)
const showCreateDialog = ref(false)
const creating = ref(false)
const statsScrollRef = ref(null)

// 新建项目表单
const newProject = ref({
  name: '',
  genre: '',
  targetWordCount: 100000
})

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

// ==================== 计算属性 ====================

/**
 * 根据时间获取问候语
 */
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// ==================== 方法 ====================

/**
 * 格式化数字显示
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString('zh-CN')
}

/**
 * 格式化时长显示
 * @param {number} minutes - 分钟数
 * @returns {string} 格式化后的字符串
 */
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`
}

/**
 * 获取项目状态文本
 * @param {string} status - 状态码
 * @returns {string} 状态文本
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
 * 获取项目进度百分比
 * @param {object} project - 项目对象
 * @returns {number} 进度百分比
 */
const getProjectProgress = (project) => {
  if (!project.targetWordCount || project.targetWordCount === 0) return 0
  return Math.min(100, Math.round((project.wordCount || 0) / project.targetWordCount * 100))
}

/**
 * 获取项目颜色（用于封面）
 * @param {number} id - 项目ID
 * @returns {string} 颜色值
 */
const getProjectColor = (id) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#8E44AD', '#16A085']
  return colors[id % colors.length]
}

/**
 * 处理快速写作
 */
const handleQuickWrite = () => {
  router.push('/m/quick-write')
}

/**
 * 处理继续写作
 */
const handleContinueWriting = () => {
  if (lastProject.value) {
    router.push({
      path: '/m/writer',
      query: { projectId: lastProject.value.id }
    })
  }
}

/**
 * 打开项目
 * @param {object} project - 项目对象
 */
const openProject = (project) => {
  router.push({
    path: '/m/writer',
    query: { projectId: project.id }
  })
}

/**
 * 处理创建项目按钮点击
 */
const handleCreateProject = () => {
  newProject.value = {
    name: '',
    genre: '',
    targetWordCount: 100000
  }
  showCreateDialog.value = true
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
      targetWordCount: newProject.value.targetWordCount,
      status: 'draft'
    })

    ElMessage.success('项目创建成功')
    showCreateDialog.value = false

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

// ==================== 数据加载 ====================

/**
 * 加载今日统计数据
 */
const loadTodayStats = () => {
  try {
    const novelsRaw = localStorage.getItem(STORAGE_KEYS.NOVELS)
    const novels = novelsRaw ? JSON.parse(novelsRaw) : []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let todayWords = 0
    let todayChapters = 0

    novels.forEach(novel => {
      if (novel.chapterList) {
        novel.chapterList.forEach(chapter => {
          const updatedAt = new Date(chapter.updatedAt)
          if (updatedAt >= today) {
            todayWords += (chapter.wordCount || 0)
            todayChapters++
          }
        })
      }
    })

    todayStats.value = {
      words: todayWords,
      duration: 0,
      chapters: todayChapters
    }

    // 获取昨日数据用于对比
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    let yesterdayWords = 0
    novels.forEach(novel => {
      if (novel.chapterList) {
        novel.chapterList.forEach(chapter => {
          const updatedAt = new Date(chapter.updatedAt)
          if (updatedAt >= yesterday && updatedAt < today) {
            yesterdayWords += (chapter.wordCount || 0)
          }
        })
      }
    })
    yesterdayStats.value = { words: yesterdayWords }
  } catch (error) {
    console.error('加载今日统计失败:', error)
  }
}

/**
 * 加载连续写作天数
 */
const loadStreakDays = () => {
  try {
    const gamificationRaw = localStorage.getItem(STORAGE_KEYS.GAMIFICATION_DATA)
    if (gamificationRaw) {
      const gamification = JSON.parse(gamificationRaw)
      streakDays.value = gamification.streakDays || gamification.currentStreak || 0
    } else {
      streakDays.value = 0
    }
  } catch (error) {
    console.error('加载连续天数失败:', error)
  }
}

/**
 * 加载最近项目
 */
const loadRecentProjects = () => {
  try {
    const novelsRaw = localStorage.getItem(STORAGE_KEYS.NOVELS)
    const novels = novelsRaw ? JSON.parse(novelsRaw) : []

    const projects = novels
      .map(novel => ({
        id: novel.id,
        name: novel.title,
        genre: novel.genre || '',
        wordCount: (novel.chapterList || []).reduce((sum, ch) => sum + (ch.wordCount || 0), 0),
        targetWordCount: novel.targetWordCount || 100000,
        status: novel.status || 'draft',
        updatedAt: new Date(novel.updatedAt)
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)

    recentProjects.value = projects

    if (projects.length > 0) {
      lastProject.value = projects[0]
    }
  } catch (error) {
    console.error('加载最近项目失败:', error)
  }
}

/**
 * 更新日期显示
 */
const updateDate = () => {
  const now = new Date()
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  currentDate.value = now.toLocaleDateString('zh-CN', options)
}

// ==================== 生命周期 ====================

onMounted(() => {
  updateDate()
  loadTodayStats()
  loadStreakDays()
  loadRecentProjects()
})
</script>

<style scoped>
.mobile-home {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding-bottom: 80px;
}

/* 欢迎区域 */
.welcome-section {
  padding: 20px 16px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0 0 24px 24px;
  margin-bottom: 16px;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  flex-shrink: 0;
}

.welcome-text {
  flex: 1;
}

.greeting {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.date {
  font-size: 13px;
  opacity: 0.9;
  margin: 0;
}

.sync-status-bar {
  margin-top: 8px;
}

/* 统计区域 */
.stats-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.stats-scroll {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0 -16px;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

.stats-scroll::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 30px;
  background: linear-gradient(to right, transparent, #f5f7fa);
  pointer-events: none;
}

.stats-scroll::-webkit-scrollbar {
  display: none;
}

.stats-cards {
  display: flex;
  gap: 12px;
  width: max-content;
}

.stat-card {
  width: 140px;
  padding: 16px;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  flex-shrink: 0;
}

.stat-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.secondary {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.success {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-icon {
  font-size: 24px;
  opacity: 0.9;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.stat-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 14px;
  opacity: 0.8;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 24px;
}

.action-btn {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.action-btn.secondary {
  background: #f0f2f5;
  border: none;
  color: #606266;
}

/* 项目区域 */
.projects-section {
  padding: 0 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
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

.project-status {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: white;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-status.draft {
  color: #909399;
}

.project-status.writing {
  color: #409eff;
}

.project-status.completed {
  color: #67c23a;
}

.project-status.paused {
  color: #e6a23c;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
  margin: 0 0 8px 0;
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
  min-width: 32px;
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
  padding: 40px 20px;
  color: #909399;
}

.empty-icon {
  margin-bottom: 12px;
  color: #dcdfe6;
}

.empty-text {
  margin: 0 0 16px 0;
  font-size: 14px;
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 11px;
  cursor: pointer;
  transition: color 0.2s;
  flex: 1;
}

.nav-item.active {
  color: #667eea;
}

.nav-item.center {
  position: relative;
  top: -16px;
}

.center-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 安全区域 */
.safe-area-bottom {
  height: calc(60px + env(safe-area-inset-bottom, 0));
}

/* 对话框样式 */
:deep(.mobile-dialog) {
  border-radius: 16px;
}

:deep(.mobile-dialog .el-dialog__header) {
  padding: 20px 20px 0;
}

:deep(.mobile-dialog .el-dialog__body) {
  padding: 20px;
}

:deep(.mobile-dialog .el-dialog__footer) {
  padding: 0 20px 20px;
}

.target-display {
  font-size: 13px;
  color: #606266;
  margin-top: 8px;
  display: block;
}
</style>

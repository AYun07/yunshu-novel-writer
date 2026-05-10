<template>
  <!-- 
    云书 - 首页组件
    包含欢迎区域、功能展示、最近项目、写作统计、快捷入口和帮助提示
  -->
  <div class="home-page" role="main" id="main-content" aria-label="主要内容">
    <!-- 跳过链接目标 -->
    <a id="main-content" href="#main-content" class="sr-only">主要内容</a>
    
    <!-- 欢迎区域 -->
    <section class="welcome-section" aria-labelledby="welcome-heading">
      <div class="welcome-content">
        <h1 id="welcome-heading" class="welcome-title">
          {{ t('app.fullName') }}
        </h1>
        <p class="welcome-slogan">{{ t('app.slogan') }}</p>
        <div class="welcome-actions">
          <el-button 
            type="primary" 
            size="large" 
            @click="goToNovels"
            data-action="new"
            aria-label="创建新小说"
          >
            <el-icon><Plus /></el-icon>
            {{ t('home.createNovel') }}
          </el-button>
          <el-button 
            size="large" 
            @click="goToWriter"
            aria-label="快速开始写作"
          >
            <el-icon><Edit /></el-icon>
            {{ t('home.quickStart') }}
          </el-button>
        </div>
      </div>
      
      <!-- 今日统计卡片 -->
      <div class="today-stats" aria-label="今日写作统计">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="32"><Document /></el-icon>
            <div class="stat-info">
              <span class="stat-value">{{ todayWords.toLocaleString() }}</span>
              <span class="stat-label">{{ t('home.todayWords') }}</span>
            </div>
          </div>
        </el-card>
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="32"><TrendCharts /></el-icon>
            <div class="stat-info">
              <span class="stat-value">{{ streakDays }}</span>
              <span class="stat-label">{{ t('home.streakDays') }}</span>
            </div>
          </div>
        </el-card>
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="32"><Notebook /></el-icon>
            <div class="stat-info">
              <span class="stat-value">{{ totalWords.toLocaleString() }}</span>
              <span class="stat-label">{{ t('home.totalWords') }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 功能展示区域 -->
    <section class="features-section" aria-labelledby="features-heading">
      <h2 id="features-heading" class="section-title">{{ t('home.features') }}</h2>
      
      <div class="features-grid">
        <!-- AI创作 -->
        <el-card class="feature-card" shadow="hover" @click="navigateTo('master')">
          <template #header>
            <div class="feature-header">
              <el-icon class="feature-icon" :size="24"><MagicStick /></el-icon>
              <span>{{ t('home.featureCategories.aiCreation.title') }}</span>
            </div>
          </template>
          <p class="feature-description">{{ t('home.featureCategories.aiCreation.description') }}</p>
          <div class="feature-links">
            <el-link type="primary" @click.stop="navigateTo('master')">{{ t('nav.master') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('imitation')">{{ t('nav.imitation') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('literary')">{{ t('nav.literary') }}</el-link>
          </div>
        </el-card>

        <!-- 写作工具 -->
        <el-card class="feature-card" shadow="hover" @click="navigateTo('focus')">
          <template #header>
            <div class="feature-header">
              <el-icon class="feature-icon" :size="24"><EditPen /></el-icon>
              <span>{{ t('home.featureCategories.writingTools.title') }}</span>
            </div>
          </template>
          <p class="feature-description">{{ t('home.featureCategories.writingTools.description') }}</p>
          <div class="feature-links">
            <el-link type="primary" @click.stop="navigateTo('focus')">{{ t('nav.focus') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('analysis')">{{ t('nav.analysis') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('ideas')">{{ t('nav.ideas') }}</el-link>
          </div>
        </el-card>

        <!-- 项目管理 -->
        <el-card class="feature-card" shadow="hover" @click="navigateTo('novels')">
          <template #header>
            <div class="feature-header">
              <el-icon class="feature-icon" :size="24"><Folder /></el-icon>
              <span>{{ t('home.featureCategories.projectManagement.title') }}</span>
            </div>
          </template>
          <p class="feature-description">{{ t('home.featureCategories.projectManagement.description') }}</p>
          <div class="feature-links">
            <el-link type="primary" @click.stop="navigateTo('mega-novel')">{{ t('nav.megaNovel') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('graph')">{{ t('nav.graph') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('cards')">{{ t('nav.cards') }}</el-link>
          </div>
        </el-card>

        <!-- 叙事工程 -->
        <el-card class="feature-card" shadow="hover" @click="navigateTo('foreshadowing')">
          <template #header>
            <div class="feature-header">
              <el-icon class="feature-icon" :size="24"><Connection /></el-icon>
              <span>{{ t('home.featureCategories.narrativeEngineering.title') }}</span>
            </div>
          </template>
          <p class="feature-description">{{ t('home.featureCategories.narrativeEngineering.description') }}</p>
          <div class="feature-links">
            <el-link type="primary" @click.stop="navigateTo('foreshadowing')">{{ t('nav.foreshadowing') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('narrative')">{{ t('nav.narrative') }}</el-link>
          </div>
        </el-card>

        <!-- 导出协作 -->
        <el-card class="feature-card" shadow="hover" @click="navigateTo('export')">
          <template #header>
            <div class="feature-header">
              <el-icon class="feature-icon" :size="24"><Share /></el-icon>
              <span>{{ t('home.featureCategories.exportCollaboration.title') }}</span>
            </div>
          </template>
          <p class="feature-description">{{ t('home.featureCategories.exportCollaboration.description') }}</p>
          <div class="feature-links">
            <el-link type="primary" @click.stop="navigateTo('export')">{{ t('nav.export') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('collaboration-hub')">{{ t('nav.collaborationHub') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('review')">{{ t('nav.review') }}</el-link>
          </div>
        </el-card>

        <!-- 扩展功能 -->
        <el-card class="feature-card" shadow="hover" @click="navigateTo('plugins')">
          <template #header>
            <div class="feature-header">
              <el-icon class="feature-icon" :size="24"><Grid /></el-icon>
              <span>{{ t('home.featureCategories.extensions.title') }}</span>
            </div>
          </template>
          <p class="feature-description">{{ t('home.featureCategories.extensions.description') }}</p>
          <div class="feature-links">
            <el-link type="primary" @click.stop="navigateTo('plugins')">{{ t('nav.plugins') }}</el-link>
            <el-link type="primary" @click.stop="navigateTo('gamification')">{{ t('nav.gamification') }}</el-link>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 最近项目区域 -->
    <section class="recent-section" aria-labelledby="recent-heading">
      <div class="section-header">
        <h2 id="recent-heading" class="section-title">{{ t('home.recentProjects') }}</h2>
        <el-button text type="primary" @click="navigateTo('novels')">
          {{ t('common.viewAll') }}
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <div v-if="recentProjects.length > 0" class="projects-grid">
        <el-card 
          v-for="project in recentProjects" 
          :key="project.id" 
          class="project-card" 
          shadow="hover"
          @click="openProject(project)"
          tabindex="0"
          role="button"
          :aria-label="`打开项目: ${project.title}`"
        >
          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-meta">
              <span>{{ project.chapterCount }} {{ t('novel.fields.chapterCount') }}</span>
              <span> · </span>
              <span>{{ project.wordCount.toLocaleString() }} {{ t('home.wordsUnit') }}</span>
            </p>
            <p class="project-time">
              {{ t('home.lastEdited') }}: {{ formatRelativeTime(project.updatedAt) }}
            </p>
          </div>
          <div class="project-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click.stop="continueWriting(project)"
              :aria-label="`继续写作: ${project.title}`"
            >
              {{ t('home.continueWriting') }}
            </el-button>
          </div>
        </el-card>
      </div>

      <el-empty 
        v-else 
        :description="t('home.noProjects')"
        :image-size="120"
      >
        <el-button type="primary" @click="navigateTo('novels')">
          {{ t('home.createFirst') }}
        </el-button>
      </el-empty>
    </section>

    <!-- 快捷入口区域 -->
    <section class="quick-access-section" aria-labelledby="quick-access-heading">
      <h2 id="quick-access-heading" class="section-title">{{ t('home.quickAccess') }}</h2>
      
      <div class="quick-buttons">
        <el-button 
          v-for="item in quickAccessItems" 
          :key="item.route"
          class="quick-button"
          @click="navigateTo(item.route)"
          :aria-label="item.label"
        >
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </el-button>
      </div>
    </section>

    <!-- 帮助提示区域 -->
    <section class="help-section" aria-labelledby="help-heading">
      <h2 id="help-heading" class="section-title">{{ t('home.helpTips') }}</h2>
      
      <div class="help-cards">
        <el-card class="help-card" shadow="hover" @click="showBeginnerGuide">
          <div class="help-content">
            <el-icon class="help-icon" :size="32"><Guide /></el-icon>
            <div class="help-info">
              <h3>{{ t('home.beginnerGuide') }}</h3>
              <p>{{ t('help.beginner.welcome') }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="help-card" shadow="hover" @click="showShortcuts">
          <div class="help-content">
            <el-icon class="help-icon" :size="32"><Key /></el-icon>
            <div class="help-info">
              <h3>{{ t('home.keyboardShortcuts') }}</h3>
              <p>{{ t('help.shortcuts.global.save') }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 快捷键帮助对话框 -->
    <el-dialog 
      v-model="shortcutsDialogVisible" 
      :title="t('help.shortcuts.title')"
      width="600px"
      aria-labelledby="shortcuts-dialog-title"
    >
      <div class="shortcuts-content">
        <div v-for="category in shortcutsCategories" :key="category.title" class="shortcuts-category">
          <h4>{{ category.title }}</h4>
          <ul class="shortcuts-list">
            <li v-for="shortcut in category.items" :key="shortcut">
              {{ shortcut }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 云书 - 首页组件
 * 使用 Vue 3 Composition API
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/utils/i18n.js'
import { ElMessage } from 'element-plus'

// Element Plus 图标
import { 
  Plus, 
  Edit, 
  Document, 
  TrendCharts, 
  Notebook,
  MagicStick,
  EditPen,
  Folder,
  Connection,
  Share,
  Grid,
  ArrowRight,
  Guide,
  Key
} from '@element-plus/icons-vue'

// ============================================
// 组合式 API 设置
// ============================================

const router = useRouter()
const { t, formatRelativeTime: formatRelative } = useI18n()

// ============================================
// 响应式数据
// ============================================

// 今日统计
const todayWords = ref(0)
const streakDays = ref(0)
const totalWords = ref(0)

// 最近项目
const recentProjects = ref([])

// 快捷键对话框
const shortcutsDialogVisible = ref(false)

// ============================================
// 计算属性
// ============================================

// 快捷入口项目
const quickAccessItems = computed(() => [
  { route: 'master', label: t('nav.master'), icon: MagicStick },
  { route: 'focus', label: t('nav.focus'), icon: EditPen },
  { route: 'writer', label: t('nav.writer'), icon: Edit },
  { route: 'cards', label: t('nav.cards'), icon: Document },
  { route: 'export', label: t('nav.export'), icon: Share },
  { route: 'gamification', label: t('nav.gamification'), icon: TrendCharts }
])

// 快捷键分类
const shortcutsCategories = computed(() => [
  {
    title: t('help.shortcuts.global.title'),
    items: [
      t('help.shortcuts.global.commandPalette'),
      t('help.shortcuts.global.newNovel'),
      t('help.shortcuts.global.save'),
      t('help.shortcuts.global.search'),
      t('help.shortcuts.global.settings')
    ]
  },
  {
    title: t('help.shortcuts.editor.title'),
    items: [
      t('help.shortcuts.editor.bold'),
      t('help.shortcuts.editor.italic'),
      t('help.shortcuts.editor.underline'),
      t('help.shortcuts.editor.undo'),
      t('help.shortcuts.editor.redo')
    ]
  },
  {
    title: t('help.shortcuts.navigation.title'),
    items: [
      t('help.shortcuts.navigation.home'),
      t('help.shortcuts.navigation.back'),
      t('help.shortcuts.navigation.forward'),
      t('help.shortcuts.navigation.skipToContent')
    ]
  }
])

// ============================================
// 方法
// ============================================

/**
 * 导航到指定路由
 * @param {string} routeName - 路由名称
 */
function navigateTo(routeName) {
  router.push({ name: routeName })
}

/**
 * 跳转到小说列表页
 */
function goToNovels() {
  navigateTo('NovelManagement')
}

/**
 * 跳转到写作页面
 */
function goToWriter() {
  navigateTo('Writer')
}

/**
 * 打开项目
 * @param {Object} project - 项目对象
 */
function openProject(project) {
  router.push({
    name: 'ChapterManagement',
    query: { novelId: project.id }
  })
}

/**
 * 继续写作
 * @param {Object} project - 项目对象
 */
function continueWriting(project) {
  router.push({
    name: 'Writer',
    query: { novelId: project.id }
  })
}

/**
 * 显示新手引导
 */
function showBeginnerGuide() {
  ElMessage.info(t('help.beginner.step1'))
}

/**
 * 显示快捷键帮助
 */
function showShortcuts() {
  shortcutsDialogVisible.value = true
}

/**
 * 格式化相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的时间
 */
function formatRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = now - target
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return t('common.time.justNow')
  if (minutes < 60) return t('common.time.minutesAgo', { n: minutes })
  if (hours < 24) return t('common.time.hoursAgo', { n: hours })
  if (days < 7) return t('common.time.daysAgo', { n: days })
  
  return formatRelative(-days, 'day')
}

/**
 * 加载统计数据
 */
async function loadStats() {
  // 模拟数据，实际应从 store 或 API 获取
  todayWords.value = 2580
  streakDays.value = 15
  totalWords.value = 156789
}

/**
 * 加载最近项目
 */
async function loadRecentProjects() {
  // 模拟数据，实际应从 store 或 API 获取
  recentProjects.value = [
    {
      id: 1,
      title: '星际迷途',
      chapterCount: 45,
      wordCount: 89234,
      updatedAt: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      title: '都市修仙传',
      chapterCount: 120,
      wordCount: 245678,
      updatedAt: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      title: '时光倒流',
      chapterCount: 28,
      wordCount: 56789,
      updatedAt: new Date(Date.now() - 172800000)
    }
  ]
}

// ============================================
// 生命周期钩子
// ============================================

onMounted(() => {
  loadStats()
  loadRecentProjects()
})
</script>

<style scoped>
/* ============================================
   首页样式
   ============================================ */

.home-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* -------------------------------------------
   欢迎区域
   ------------------------------------------- */
.welcome-section {
  margin-bottom: 32px;
}

.welcome-content {
  text-align: center;
  padding: 48px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: white;
}

.welcome-slogan {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 24px;
}

.welcome-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 今日统计卡片 */
.today-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  color: var(--primary-color);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* -------------------------------------------
   功能展示区域
   ------------------------------------------- */
.features-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1.125rem;
}

.feature-icon {
  color: var(--primary-color);
}

.feature-description {
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}

.feature-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* -------------------------------------------
   最近项目区域
   ------------------------------------------- */
.recent-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.project-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
}

.project-card:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.project-content {
  margin-bottom: 12px;
}

.project-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.project-meta {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.project-time {
  font-size: 0.75rem;
  color: var(--text-placeholder);
}

.project-actions {
  display: flex;
  justify-content: flex-end;
}

/* -------------------------------------------
   快捷入口区域
   ------------------------------------------- */
.quick-access-section {
  margin-bottom: 32px;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--background-base);
  border: 1px solid var(--border-base);
  transition: all 0.2s ease;
}

.quick-button:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.quick-button:hover .el-icon {
  color: white;
}

/* -------------------------------------------
   帮助提示区域
   ------------------------------------------- */
.help-section {
  margin-bottom: 32px;
}

.help-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.help-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.help-card:hover {
  transform: translateY(-4px);
}

.help-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.help-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.help-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.help-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* -------------------------------------------
   快捷键对话框
   ------------------------------------------- */
.shortcuts-content {
  max-height: 400px;
  overflow-y: auto;
}

.shortcuts-category {
  margin-bottom: 20px;
}

.shortcuts-category h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.shortcuts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shortcuts-list li {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-lighter);
  color: var(--text-regular);
  font-size: 0.875rem;
}

.shortcuts-list li:last-child {
  border-bottom: none;
}

/* -------------------------------------------
   响应式设计
   ------------------------------------------- */
@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }

  .welcome-content {
    padding: 32px 16px;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .welcome-slogan {
    font-size: 1rem;
  }

  .welcome-actions {
    flex-direction: column;
  }

  .welcome-actions .el-button {
    width: 100%;
  }

  .today-stats {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .quick-buttons {
    flex-direction: column;
  }

  .quick-button {
    width: 100%;
    justify-content: center;
  }

  .help-cards {
    grid-template-columns: 1fr;
  }
}

/* -------------------------------------------
   无障碍增强
   ------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .project-card,
  .stat-card,
  .help-card,
  .quick-button {
    transition: none;
  }
}

/* 高对比度模式 */
.a11y-high-contrast .welcome-content {
  background: #000;
  border: 2px solid #fff;
}

.a11y-high-contrast .feature-card,
.a11y-high-contrast .project-card,
.a11y-high-contrast .stat-card,
.a11y-high-contrast .help-card {
  border: 2px solid #000;
}
</style>

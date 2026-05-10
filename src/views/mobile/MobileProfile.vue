<template>
  <div class="mobile-profile">
    <!-- 顶部导航 -->
    <div class="header">
      <el-button type="text" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h1 class="title">个人中心</h1>
      <el-button type="text" @click="showSettings = true">
        <el-icon><Setting /></el-icon>
      </el-button>
    </div>

    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar-section">
        <el-avatar :size="80" :icon="UserFilled" class="user-avatar" />
        <div class="user-info">
          <h2 class="user-name">{{ userName }}</h2>
          <p class="user-level">{{ levelInfo.title }}</p>
          <div class="level-progress">
            <el-progress
              :percentage="levelProgress"
              :stroke-width="8"
              :show-text="false"
              color="#667eea"
            />
            <span class="level-text">{{ levelInfo.current }} / {{ levelInfo.next }} XP</span>
          </div>
        </div>
      </div>

      <!-- 连续写作天数 -->
      <div class="streak-section">
        <div class="streak-icon">
          <el-icon><Aim /></el-icon>
        </div>
        <div class="streak-info">
          <span class="streak-count">{{ streakDays }}天</span>
          <span class="streak-label">连续写作</span>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-section">
      <h3 class="section-title">写作统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(totalStats.words) }}</span>
            <span class="stat-label">总字数</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ formatDuration(totalStats.duration) }}</span>
            <span class="stat-label">写作时长</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <el-icon><Collection /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalStats.projects }}</span>
            <span class="stat-label">项目数</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon danger">
            <el-icon><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalStats.chapters }}</span>
            <span class="stat-label">章节数</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section">
      <div class="section-header">
        <h3 class="section-title">我的成就</h3>
        <el-button type="text" size="small" @click="showAllAchievements">
          查看全部
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="achievements-list">
        <div
          v-for="achievement in recentAchievements"
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon" :class="achievement.type">
            <el-icon>
              <component :is="achievement.icon" />
            </el-icon>
          </div>
          <div class="achievement-info">
            <span class="achievement-name">{{ achievement.name }}</span>
            <span class="achievement-desc">{{ achievement.description }}</span>
          </div>
          <el-icon v-if="achievement.unlocked" class="achievement-check"><CircleCheck /></el-icon>
        </div>
      </div>
    </div>

    <!-- 设置入口列表 -->
    <div class="settings-section">
      <h3 class="section-title">设置</h3>
      <div class="settings-list">
        <div class="setting-item" @click="showThemeSettings = true">
          <div class="setting-icon">
            <el-icon><Brush /></el-icon>
          </div>
          <div class="setting-content">
            <span class="setting-name">主题设置</span>
            <span class="setting-value">{{ currentThemeName }}</span>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </div>

        <div class="setting-item" @click="showLanguageSettings = true">
          <div class="setting-icon">
            <el-icon><Place /></el-icon>
          </div>
          <div class="setting-content">
            <span class="setting-name">语言切换</span>
            <span class="setting-value">{{ currentLanguage }}</span>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </div>

        <div class="setting-item" @click="router.push('/m/sync')">
          <div class="setting-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="setting-content">
            <span class="setting-name">数据同步</span>
            <span class="setting-value">{{ syncStatus }}</span>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </div>

        <div class="setting-item" @click="showBackupSettings = true">
          <div class="setting-icon">
            <el-icon><Download /></el-icon>
          </div>
          <div class="setting-content">
            <span class="setting-name">备份与恢复</span>
            <span class="setting-value"></span>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </div>

        <div class="setting-item" @click="showAbout = true">
          <div class="setting-icon">
            <el-icon><InfoFilled /></el-icon>
          </div>
          <div class="setting-content">
            <span class="setting-name">关于云书</span>
            <span class="setting-value">v{{ appVersion }}</span>
          </div>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 主题设置抽屉 -->
    <el-drawer
      v-model="showThemeSettings"
      title="主题设置"
      direction="btt"
      size="50%"
      class="settings-drawer"
    >
      <div class="theme-options">
        <div
          v-for="theme in themeOptions"
          :key="theme.value"
          class="theme-option"
          :class="{ active: currentTheme === theme.value }"
          @click="setTheme(theme.value)"
        >
          <div class="theme-preview" :style="{ background: theme.gradient }"></div>
          <span class="theme-name">{{ theme.label }}</span>
          <el-icon v-if="currentTheme === theme.value" class="theme-check"><Check /></el-icon>
        </div>
      </div>
    </el-drawer>

    <!-- 语言设置抽屉 -->
    <el-drawer
      v-model="showLanguageSettings"
      title="语言设置"
      direction="btt"
      size="50%"
      class="settings-drawer"
    >
      <div class="language-options">
        <div
          v-for="lang in languageOptions"
          :key="lang.value"
          class="language-option"
          :class="{ active: currentLanguage === lang.label }"
          @click="setLanguage(lang)"
        >
          <span class="language-name">{{ lang.label }}</span>
          <span class="language-code">{{ lang.code }}</span>
          <el-icon v-if="currentLanguage === lang.label" class="language-check"><Check /></el-icon>
        </div>
      </div>
    </el-drawer>

    <!-- 数据同步抽屉 -->
    <el-drawer
      v-model="showSyncSettings"
      title="数据同步"
      direction="rtl"
      size="85%"
      class="settings-drawer"
    >
      <div class="sync-content">
        <SyncStatus show-details />

        <div class="sync-actions">
          <el-button type="primary" @click="triggerSync" :loading="isSyncing">
            <el-icon><Refresh /></el-icon>
            立即同步
          </el-button>
          <el-button @click="showSyncHistory = true">
            <el-icon><Clock /></el-icon>
            同步历史
          </el-button>
        </div>

        <div class="sync-settings">
          <h4>同步设置</h4>
          <div class="sync-setting-item">
            <span>自动同步</span>
            <el-switch v-model="autoSync" />
          </div>
          <div class="sync-setting-item">
            <span>仅在WiFi下同步</span>
            <el-switch v-model="syncOnWifiOnly" />
          </div>
          <div class="sync-setting-item">
            <span>同步频率</span>
            <el-select v-model="syncFrequency" size="small">
              <el-option label="实时" value="realtime" />
              <el-option label="每15分钟" value="15min" />
              <el-option label="每1小时" value="1hour" />
              <el-option label="仅手动" value="manual" />
            </el-select>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 关于对话框 -->
    <el-dialog
      v-model="showAbout"
      title="关于云书"
      width="90%"
      class="mobile-dialog"
      align-center
    >
      <div class="about-content">
        <div class="about-logo">
          <div class="logo-icon">☁️</div>
          <h2>云书</h2>
          <p class="version">版本 {{ appVersion }}</p>
        </div>
        <p class="about-desc">
          云书是一款专业的AI辅助写作工具，帮助作家高效创作小说、管理项目、分析文本质量。
        </p>
        <div class="about-links">
          <el-button type="primary" text @click="openWebsite">
            访问官网
          </el-button>
          <el-button type="primary" text @click="openFeedback">
            意见反馈
          </el-button>
          <el-button type="primary" text @click="openPrivacy">
            隐私政策
          </el-button>
        </div>
        <p class="copyright">
          © 2024 云书. All rights reserved.
        </p>
      </div>
    </el-dialog>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <div class="nav-item" @click="router.push('/m')">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </div>
      <div class="nav-item" @click="router.push('/m/projects')">
        <el-icon><Folder /></el-icon>
        <span>项目</span>
      </div>
      <div class="nav-item center" @click="router.push('/m/quick-write')">
        <div class="center-btn">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
      <div class="nav-item" @click="router.push('/m/writer')">
        <el-icon><Edit /></el-icon>
        <span>写作</span>
      </div>
      <div class="nav-item active">
        <el-icon><User /></el-icon>
        <span>我的</span>
      </div>
    </div>

    <!-- 安全区域 -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup>
/**
 * 移动端个人中心组件
 * 提供用户信息、写作统计、成就展示、设置入口等功能
 * 支持主题切换、语言切换、数据同步设置
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Setting, UserFilled, Aim as Fire,
  Document, Timer, Collection, Reading, ArrowRight,
  CircleCheck, Brush, Place, Connection, Download,
  InfoFilled, Check, Refresh, Clock, House, Folder,
  Plus, Edit, User, Trophy, Star, Medal, FirstAidKit
} from '@element-plus/icons-vue'
import SyncStatus from '../../components/SyncStatus.vue'
import database from '../../services/database.js'

// ==================== 路由和状态 ====================
const router = useRouter()

// ==================== 响应式数据 ====================
const userName = ref('作家')
const streakDays = ref(0)
const totalStats = ref({
  words: 0,
  duration: 0,
  projects: 0,
  chapters: 0
})
const achievements = ref([])
const currentTheme = ref('default')
const currentLanguage = ref('简体中文')
const appVersion = ref('2.2.0')

// 设置面板显示状态
const showSettings = ref(false)
const showThemeSettings = ref(false)
const showLanguageSettings = ref(false)
const showSyncSettings = ref(false)
const showBackupSettings = ref(false)
const showAbout = ref(false)
const showSyncHistory = ref(false)

// 同步设置
const isSyncing = ref(false)
const autoSync = ref(true)
const syncOnWifiOnly = ref(false)
const syncFrequency = ref('15min')

// 主题选项
const themeOptions = [
  { label: '默认蓝', value: 'default', gradient: 'linear-gradient(135deg, #409eff, #66b1ff)' },
  { label: '暗夜黑', value: 'dark', gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { label: '护眼绿', value: 'green', gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)' },
  { label: '优雅紫', value: 'purple', gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)' },
  { label: '暖阳橙', value: 'warm', gradient: 'linear-gradient(135deg, #f39c12, #e67e22)' }
]

// 语言选项
const languageOptions = [
  { label: '简体中文', value: 'zh-CN', code: 'ZH' },
  { label: '繁體中文', value: 'zh-TW', code: 'TW' },
  { label: 'English', value: 'en-US', code: 'EN' },
  { label: '日本語', value: 'ja-JP', code: 'JP' }
]

// 成就定义
const achievementDefinitions = [
  { id: 'first_word', name: '初出茅庐', description: '写下第一个字', icon: 'Document', type: 'bronze' },
  { id: 'thousand_words', name: '千字文', description: '累计写作1000字', icon: 'Document', type: 'bronze' },
  { id: 'ten_thousand_words', name: '万字长文', description: '累计写作10000字', icon: 'Reading', type: 'silver' },
  { id: 'hundred_thousand_words', name: '百万字作家', description: '累计写作100000字', icon: 'Trophy', type: 'gold' },
  { id: 'first_project', name: '项目启动', description: '创建第一个项目', icon: 'Folder', type: 'bronze' },
  { id: 'five_projects', name: '多面手', description: '创建5个项目', icon: 'Collection', type: 'silver' },
  { id: 'three_day_streak', name: '坚持不懈', description: '连续写作3天', icon: 'Fire', type: 'bronze' },
  { id: 'seven_day_streak', name: '写作达人', description: '连续写作7天', icon: 'Star', type: 'silver' },
  { id: 'thirty_day_streak', name: '写作大师', description: '连续写作30天', icon: 'Medal', type: 'gold' },
  { id: 'early_bird', name: '早起鸟', description: '在早上6点前写作', icon: 'Timer', type: 'bronze' },
  { id: 'night_owl', name: '夜猫子', description: '在晚上12点后写作', icon: 'Timer', type: 'bronze' },
  { id: 'completer', name: '完美收官', description: '完成一个项目', icon: 'CircleCheck', type: 'silver' }
]

// ==================== 计算属性 ====================

/**
 * 等级信息
 */
const levelInfo = computed(() => {
  const words = totalStats.value.words
  const levels = [
    { title: '写作新手', min: 0, max: 1000 },
    { title: '初级作家', min: 1000, max: 5000 },
    { title: '中级作家', min: 5000, max: 20000 },
    { title: '高级作家', min: 20000, max: 50000 },
    { title: '资深作家', min: 50000, max: 100000 },
    { title: '写作大师', min: 100000, max: 500000 },
    { title: '传奇作家', min: 500000, max: Infinity }
  ]

  const currentLevel = levels.find(l => words >= l.min && words < l.max) || levels[0]
  const nextLevel = levels.find(l => l.min > words)

  return {
    title: currentLevel.title,
    current: words,
    next: nextLevel ? nextLevel.min : currentLevel.max,
    max: currentLevel.max
  }
})

/**
 * 等级进度
 */
const levelProgress = computed(() => {
  const info = levelInfo.value
  if (info.next === Infinity) return 100
  return Math.min(100, Math.round((info.current / info.next) * 100))
})

/**
 * 当前主题名称
 */
const currentThemeName = computed(() => {
  const theme = themeOptions.find(t => t.value === currentTheme.value)
  return theme?.label || '默认蓝'
})

/**
 * 同步状态文本
 */
const syncStatus = computed(() => {
  return autoSync.value ? '自动同步开启' : '手动同步'
})

/**
 * 最近获得的成就
 */
const recentAchievements = computed(() => {
  return achievements.value.slice(0, 5)
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
 * 格式化时长显示
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
 * 设置主题
 */
const setTheme = (theme) => {
  currentTheme.value = theme
  localStorage.setItem('yunshu_theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
  showThemeSettings.value = false
  ElMessage.success('主题已切换')
}

/**
 * 设置语言
 */
const setLanguage = (lang) => {
  currentLanguage.value = lang.label
  localStorage.setItem('yunshu_language', lang.value)
  showLanguageSettings.value = false
  ElMessage.success('语言已切换')
}

/**
 * 触发同步
 */
const triggerSync = async () => {
  isSyncing.value = true
  try {
    // 这里调用同步服务
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('同步成功')
  } catch (error) {
    console.error('同步失败:', error)
    ElMessage.error('同步失败')
  } finally {
    isSyncing.value = false
  }
}

/**
 * 查看全部成就
 */
const showAllAchievements = () => {
  router.push('/m/achievements')
}

/**
 * 打开官网
 */
const openWebsite = () => {
  window.open('https://yunshu.app', '_blank')
}

/**
 * 打开反馈
 */
const openFeedback = () => {
  window.open('https://yunshu.app/feedback', '_blank')
}

/**
 * 打开隐私政策
 */
const openPrivacy = () => {
  window.open('https://yunshu.app/privacy', '_blank')
}

// ==================== 数据加载 ====================

/**
 * 加载用户统计数据
 */
const loadStats = async () => {
  try {
    const globalStats = await database.statistics.getGlobalStats()
    totalStats.value = {
      words: globalStats.totalWords,
      duration: globalStats.weeklyStats.reduce((sum, s) => sum + s.duration, 0),
      projects: globalStats.projectCount,
      chapters: globalStats.chapterCount
    }
  } catch (error) {
    console.error('加载统计失败:', error)
  }
}

/**
 * 加载连续写作天数
 */
const loadStreakDays = async () => {
  try {
    const sessions = await database.db.writingSessions
      .orderBy('startTime')
      .reverse()
      .toArray()

    if (sessions.length === 0) {
      streakDays.value = 0
      return
    }

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const dateSet = new Set(sessions.map(s =>
      new Date(s.startTime).toDateString()
    ))

    // 检查今天或昨天是否有写作
    const todayStr = currentDate.toDateString()
    const hasToday = dateSet.has(todayStr)

    if (!hasToday) {
      const yesterday = new Date(currentDate)
      yesterday.setDate(yesterday.getDate() - 1)
      if (!dateSet.has(yesterday.toDateString())) {
        streakDays.value = 0
        return
      }
    }

    while (dateSet.has(currentDate.toDateString())) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    streakDays.value = streak
  } catch (error) {
    console.error('加载连续天数失败:', error)
  }
}

/**
 * 加载成就
 */
const loadAchievements = async () => {
  try {
    const unlockedAchievements = await database.getAchievements()
    const unlockedIds = new Set(unlockedAchievements.map(a => a.type))

    achievements.value = achievementDefinitions.map(def => ({
      ...def,
      unlocked: unlockedIds.has(def.id),
      unlockedAt: unlockedAchievements.find(a => a.type === def.id)?.unlockedAt
    })).sort((a, b) => {
      // 已解锁的排在前面
      if (a.unlocked && !b.unlocked) return -1
      if (!a.unlocked && b.unlocked) return 1
      return 0
    })
  } catch (error) {
    console.error('加载成就失败:', error)
  }
}

/**
 * 检查并解锁成就
 */
const checkAchievements = async () => {
  const stats = totalStats.value

  // 检查各项成就条件
  const checks = [
    { id: 'first_word', condition: stats.words > 0 },
    { id: 'thousand_words', condition: stats.words >= 1000 },
    { id: 'ten_thousand_words', condition: stats.words >= 10000 },
    { id: 'hundred_thousand_words', condition: stats.words >= 100000 },
    { id: 'first_project', condition: stats.projects >= 1 },
    { id: 'five_projects', condition: stats.projects >= 5 },
    { id: 'three_day_streak', condition: streakDays.value >= 3 },
    { id: 'seven_day_streak', condition: streakDays.value >= 7 },
    { id: 'thirty_day_streak', condition: streakDays.value >= 30 }
  ]

  for (const check of checks) {
    if (check.condition) {
      try {
        await database.unlockAchievement(check.id)
      } catch (error) {
        // 成就已存在，忽略错误
      }
    }
  }

  // 重新加载成就列表
  await loadAchievements()
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 加载保存的设置
  const savedTheme = localStorage.getItem('yunshu_theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }

  const savedLanguage = localStorage.getItem('yunshu_language')
  if (savedLanguage) {
    const lang = languageOptions.find(l => l.value === savedLanguage)
    if (lang) {
      currentLanguage.value = lang.label
    }
  }

  // 加载数据
  await loadStats()
  await loadStreakDays()
  await loadAchievements()

  // 检查成就
  await checkAchievements()
})
</script>

<style scoped>
.mobile-profile {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
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

/* 用户卡片 */
.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 16px;
  border-radius: 16px;
  padding: 20px;
  color: white;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.user-level {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 8px 0;
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-progress :deep(.el-progress) {
  flex: 1;
}

.level-text {
  font-size: 12px;
  white-space: nowrap;
}

.streak-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
}

.streak-icon {
  font-size: 28px;
  color: #ff6b6b;
}

.streak-info {
  display: flex;
  flex-direction: column;
}

.streak-count {
  font-size: 18px;
  font-weight: 600;
}

.streak-label {
  font-size: 12px;
  opacity: 0.9;
}

/* 统计区域 */
.stats-section {
  margin: 0 16px 16px;
  background: white;
  border-radius: 16px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-icon.success {
  background: linear-gradient(135deg, #11998e, #38ef7d);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-icon.danger {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

/* 成就区域 */
.achievements-section {
  margin: 0 16px 16px;
  background: white;
  border-radius: 16px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f5f7fa;
  opacity: 0.6;
}

.achievement-item.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.achievement-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.achievement-icon.bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
}

.achievement-icon.silver {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
}

.achievement-icon.gold {
  background: linear-gradient(135deg, #ffd700, #ffb700);
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.achievement-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.achievement-desc {
  font-size: 12px;
  color: #909399;
}

.achievement-check {
  color: #67c23a;
  font-size: 20px;
}

/* 设置区域 */
.settings-section {
  margin: 0 16px;
  background: white;
  border-radius: 16px;
  padding: 16px;
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 18px;
}

.setting-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.setting-name {
  font-size: 14px;
  color: #303133;
}

.setting-value {
  font-size: 12px;
  color: #909399;
}

/* 主题选项 */
.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-option.active .theme-preview {
  box-shadow: 0 0 0 3px #667eea;
}

.theme-name {
  font-size: 13px;
  color: #606266;
}

.theme-check {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  padding: 2px;
  font-size: 12px;
}

/* 语言选项 */
.language-options {
  padding: 8px 0;
}

.language-option {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
}

.language-option:last-child {
  border-bottom: none;
}

.language-name {
  flex: 1;
  font-size: 15px;
  color: #303133;
}

.language-code {
  font-size: 13px;
  color: #909399;
  margin-right: 12px;
}

.language-check {
  color: #667eea;
  font-size: 18px;
}

/* 同步内容 */
.sync-content {
  padding: 16px;
}

.sync-actions {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

.sync-actions .el-button {
  flex: 1;
}

.sync-settings {
  margin-top: 24px;
}

.sync-settings h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 16px 0;
}

.sync-setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.sync-setting-item:last-child {
  border-bottom: none;
}

.sync-setting-item span {
  font-size: 14px;
  color: #606266;
}

/* 关于内容 */
.about-content {
  text-align: center;
  padding: 20px;
}

.about-logo {
  margin-bottom: 24px;
}

.logo-icon {
  font-size: 64px;
  margin-bottom: 8px;
}

.about-logo h2 {
  font-size: 24px;
  margin: 0 0 4px 0;
  color: #303133;
}

.version {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.about-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 24px;
}

.about-links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
}

.copyright {
  font-size: 12px;
  color: #c0c4cc;
  margin: 0;
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

/* 抽屉样式 */
:deep(.settings-drawer) {
  border-radius: 20px 20px 0 0;
}

:deep(.settings-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
}
</style>

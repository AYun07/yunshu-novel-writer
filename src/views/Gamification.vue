<template>
  <div class="gamification-page">
    <div class="page-header">
      <h2>游戏化中心</h2>
      <p class="page-desc">记录你的写作旅程，解锁成就，挑战自我</p>
    </div>

    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div class="stat-card level-card">
        <div class="stat-value">{{ levelInfo.level }}</div>
        <div class="stat-label">Lv.{{ levelInfo.title }}</div>
        <el-progress
          :percentage="levelInfo.progress"
          :stroke-width="8"
          :show-text="false"
          style="width: 100%; margin-top: 8px"
          color="var(--primary-color)"
        />
        <div class="stat-extra">{{ levelInfo.totalExp }} / {{ levelInfo.nextLevelMinExp || 'MAX' }} EXP</div>
      </div>
      <div class="stat-card streak-card">
        <div class="stat-icon">
          <el-icon :size="28"><Promotion /></el-icon>
        </div>
        <div class="stat-value">{{ stats.currentStreak }}</div>
        <div class="stat-label">连续写作天数</div>
      </div>
      <div class="stat-card words-card">
        <div class="stat-icon">
          <el-icon :size="28"><EditPen /></el-icon>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalWords) }}</div>
        <div class="stat-label">总字数</div>
      </div>
      <div class="stat-card time-card">
        <div class="stat-icon">
          <el-icon :size="28"><Timer /></el-icon>
        </div>
        <div class="stat-value">{{ formatTime(stats.totalWritingTime || 0) }}</div>
        <div class="stat-label">总写作时间</div>
      </div>
    </div>

    <!-- 写作热力图 -->
    <div class="heatmap-section">
      <div class="section-header">
        <h3>写作热力图</h3>
        <span class="heatmap-summary">
          过去 {{ heatmapData.totalDays }} 天，活跃 {{ heatmapData.activeDays }} 天，共写 {{ formatNumber(heatmapData.totalWords) }} 字
        </span>
      </div>
      <div class="heatmap-container">
        <div class="heatmap-labels">
          <span v-for="d in dayLabels" :key="d" class="day-label">{{ d }}</span>
        </div>
        <div class="heatmap-grid">
          <div
            v-for="(week, wi) in heatmapData.weeks"
            :key="wi"
            class="heatmap-week"
          >
            <div
              v-for="(cell, di) in week"
              :key="di"
              class="heatmap-cell"
              :class="'level-' + cell.level"
              :title="`${cell.date}: ${cell.words} 字`"
            />
          </div>
        </div>
        <div class="heatmap-legend">
          <span class="legend-label">少</span>
          <div v-for="l in 5" :key="l" class="legend-cell" :class="'level-' + (l - 1)" />
          <span class="legend-label">多</span>
        </div>
      </div>
    </div>

    <!-- 成就展示 -->
    <div class="achievements-section">
      <div class="section-header">
        <h3>成就殿堂</h3>
        <span class="achievement-progress">
          已解锁 {{ achievementProgress.unlocked }} / {{ achievementProgress.total }}
          ({{ achievementProgress.percentage }}%)
        </span>
      </div>
      <el-tabs v-model="achievementTab" class="achievement-tabs">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="写作" name="writing" />
        <el-tab-pane label="连续" name="streak" />
        <el-tab-pane label="字数" name="word_count" />
        <el-tab-pane label="功能" name="feature" />
        <el-tab-pane label="社交" name="social" />
      </el-tabs>
      <div class="achievement-grid">
        <div
          v-for="ach in filteredAchievements"
          :key="ach.id"
          class="achievement-card"
          :class="[ach.unlocked ? 'unlocked' : 'locked', 'rarity-' + ach.rarity]"
        >
          <div class="ach-icon">
            <el-icon :size="28"><component :is="ach.icon" /></el-icon>
          </div>
          <div class="ach-info">
            <div class="ach-name">{{ ach.name }}</div>
            <div class="ach-desc">{{ ach.description }}</div>
          </div>
          <div class="ach-rarity" :class="ach.rarity">
            {{ rarityLabel(ach.rarity) }}
          </div>
          <div v-if="ach.unlocked" class="ach-check">
            <el-icon><CircleCheckFilled /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 每日签到 -->
    <div class="checkin-section">
      <div class="section-header">
        <h3>每日签到</h3>
      </div>
      <div class="checkin-panel">
        <div class="checkin-left">
          <el-button
            type="primary"
            size="large"
            round
            :disabled="isCheckedInToday"
            @click="doCheckin"
          >
            {{ isCheckedInToday ? '今日已签到' : '立即签到' }}
          </el-button>
          <div class="checkin-streak">
            连续签到 <strong>{{ checkinStreak }}</strong> 天
          </div>
        </div>
        <div class="checkin-right">
          <div class="week-calendar">
            <div
              v-for="day in weekCheckins"
              :key="day.date"
              class="week-day"
              :class="{ checked: day.checkedIn }"
            >
              <span class="week-day-label">{{ day.dayOfWeek }}</span>
              <span class="week-day-dot" />
            </div>
          </div>
          <div class="streak-rewards">
            <div class="reward-item" :class="{ reached: checkinStreak >= 7 }">
              <span class="reward-day">7天</span>
              <span class="reward-bonus">+14 EXP</span>
            </div>
            <div class="reward-item" :class="{ reached: checkinStreak >= 14 }">
              <span class="reward-day">14天</span>
              <span class="reward-bonus">+28 EXP</span>
            </div>
            <div class="reward-item" :class="{ reached: checkinStreak >= 30 }">
              <span class="reward-day">30天</span>
              <span class="reward-bonus">+60 EXP</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 激励语 -->
    <div class="quote-section">
      <div class="quote-card" @click="refreshQuote">
        <el-icon class="quote-icon"><ChatLineSquare /></el-icon>
        <p class="quote-text">{{ currentQuote }}</p>
        <span class="quote-hint">点击刷新</span>
      </div>
    </div>

    <!-- 写作统计面板 -->
    <div class="stats-panel-section">
      <div class="section-header">
        <h3>写作统计</h3>
      </div>
      <el-tabs v-model="statsTab" class="stats-tabs">
        <el-tab-pane label="今日" name="today" />
        <el-tab-pane label="本周" name="week" />
        <el-tab-pane label="本月" name="month" />
        <el-tab-pane label="全部" name="all" />
      </el-tabs>
      <div class="stats-content">
        <div class="stats-summary">
          <div class="summary-item">
            <span class="summary-value">{{ currentStats.words }}</span>
            <span class="summary-label">字数</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">{{ currentStats.activeDays || 0 }}</span>
            <span class="summary-label">活跃天数</span>
          </div>
          <div class="summary-item">
            <span class="summary-value">{{ currentStats.averageDaily || 0 }}</span>
            <span class="summary-label">日均字数</span>
          </div>
        </div>
        <!-- 简易折线图 -->
        <div class="chart-container">
          <div class="chart-bars">
            <div
              v-for="(day, i) in chartData"
              :key="i"
              class="chart-bar-wrapper"
            >
              <div
                class="chart-bar"
                :style="{ height: getBarHeight(day.words) + '%' }"
                :title="`${day.date}: ${day.words} 字`"
              />
              <span class="chart-label">{{ day.date.slice(5) }}</span>
            </div>
          </div>
        </div>
        <div class="best-record">
          <el-icon><Trophy /></el-icon>
          <span>最佳记录：{{ bestRecord }} 字</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Promotion, EditPen, Timer, CircleCheckFilled,
  ChatLineSquare, Trophy
} from '@element-plus/icons-vue'
import gamificationSystem from '../config/gamification.js'
import {
  achievements as achievementDefs,
  levelDefinitions,
  motivationalQuotes,
  getRandomQuote,
  generateHeatmapData,
  calculateLevel,
  AchievementCategory
} from '../config/gamification.js'

// ========== 游戏化系统 ==========
const system = gamificationSystem

// ========== 响应式数据 ==========
const achievementTab = ref('all')
const statsTab = ref('today')
const currentQuote = ref(getRandomQuote())
const checkinStreak = ref(0)
const isCheckedInToday = ref(false)

// 初始化模拟数据
onMounted(() => {
  // 模拟一些历史写作记录用于热力图
  const mockRecords = []
  const today = new Date()
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = formatDate(d)
    if (Math.random() > 0.3) {
      mockRecords.push({
        date: dateStr,
        words: Math.floor(Math.random() * 5000)
      })
    }
  }
  system.writingRecords = mockRecords
  system.stats.totalWords = mockRecords.reduce((s, r) => s + r.words, 0)
  system.stats.currentStreak = 12
  system.stats.maxStreak = 30
  system.totalExp = 3500
  system.unlockedAchievements = [
    'first_creation', 'first_chapter', 'daily_1000',
    'streak_3', 'streak_7', 'first_ai_creation',
    'cumulative_10k', 'first_focus_mode'
  ]
  checkinStreak.value = system.stats.currentStreak
  isCheckedInToday.value = system.checkin.isCheckedInToday()
})

// ========== 计算属性 ==========
const levelInfo = computed(() => calculateLevel(system.totalExp))

const stats = computed(() => system.stats)

const heatmapData = computed(() => {
  return generateHeatmapData(system.writingRecords, 26)
})

const dayLabels = ['一', '', '三', '', '五', '', '日']

const achievementProgress = computed(() => system.getAchievementProgress())

const filteredAchievements = computed(() => {
  const all = system.getAchievements()
  if (achievementTab.value === 'all') return all
  return all.filter(a => a.category === achievementTab.value)
})

const weekCheckins = computed(() => system.checkin.getWeekCheckins())

const currentStats = computed(() => {
  const s = system.getStats()
  const tabMap = { today: 'today', week: 'week', month: 'month', all: 'allTime' }
  return s[tabMap[statsTab.value]] || s.today
})

const chartData = computed(() => {
  const s = system.getStats()
  return s.last7Days || []
})

const bestRecord = computed(() => {
  const records = system.writingRecords
  if (records.length === 0) return 0
  return Math.max(...records.map(r => r.words))
})

// ========== 方法 ==========
function formatNumber(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toLocaleString()
}

function formatTime(minutes) {
  if (!minutes || minutes === 0) return '0分钟'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}小时${m}分钟`
  return `${m}分钟`
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function rarityLabel(rarity) {
  const map = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' }
  return map[rarity] || rarity
}

function getBarHeight(words) {
  const max = Math.max(...chartData.value.map(d => d.words), 1)
  return Math.max(2, (words / max) * 100)
}

function refreshQuote() {
  currentQuote.value = getRandomQuote()
}

function doCheckin() {
  const result = system.checkin.checkin()
  if (result.success) {
    ElMessage.success(result.message)
    checkinStreak.value = result.currentStreak
    isCheckedInToday.value = true
    system._addExp(result.expGained)
  } else {
    ElMessage.info(result.message)
  }
}
</script>

<style scoped>
.gamification-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.page-header {
  margin-bottom: 24px;
}
.page-header h2 {
  margin: 0 0 4px;
  font-size: 24px;
  color: var(--el-text-color-primary);
}
.page-desc {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

/* ===== 统计卡片 ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
.stat-extra {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
  margin-top: 4px;
}
.stat-icon {
  color: var(--primary-color);
  margin-bottom: 8px;
}

/* ===== 热力图 ===== */
.heatmap-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}
.heatmap-summary {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.heatmap-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}
.heatmap-labels {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 0;
}
.day-label {
  height: 14px;
  line-height: 14px;
  font-size: 10px;
  color: var(--el-text-color-placeholder);
}
.heatmap-grid {
  display: flex;
  gap: 3px;
}
.heatmap-week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.heatmap-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  transition: transform 0.15s;
}
.heatmap-cell:hover {
  transform: scale(1.4);
}
.heatmap-cell.level-0 { background: var(--el-fill-color-lighter); }
.heatmap-cell.level-1 { background: #9be9a8; }
.heatmap-cell.level-2 { background: #40c463; }
.heatmap-cell.level-3 { background: #30a14e; }
.heatmap-cell.level-4 { background: #216e39; }
.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: 8px;
  align-self: flex-end;
}
.legend-label {
  font-size: 10px;
  color: var(--el-text-color-placeholder);
}
.legend-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

/* ===== 成就 ===== */
.achievements-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.achievement-progress {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  border: 2px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}
.achievement-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.achievement-card.unlocked {
  background: var(--el-bg-color);
}
.achievement-card.locked {
  opacity: 0.5;
}
.achievement-card.locked .ach-icon {
  filter: grayscale(1);
}
/* 稀有度边框 */
.achievement-card.rarity-common { border-color: #b0b0b0; }
.achievement-card.rarity-rare { border-color: #4fc3f7; }
.achievement-card.rarity-epic { border-color: #ab47bc; }
.achievement-card.rarity-legendary { border-color: #ffb300; }
.ach-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--el-fill-color-light);
}
.achievement-card.unlocked .ach-icon {
  color: var(--primary-color);
}
.ach-info {
  flex: 1;
  min-width: 0;
}
.ach-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.ach-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ach-rarity {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
.ach-rarity.common { background: #f5f5f5; color: #757575; }
.ach-rarity.rare { background: #e1f5fe; color: #0288d1; }
.ach-rarity.epic { background: #f3e5f5; color: #7b1fa2; }
.ach-rarity.legendary { background: #fff8e1; color: #f57f17; }
.ach-check {
  position: absolute;
  top: 6px;
  right: 6px;
  color: var(--primary-color);
  font-size: 16px;
}

/* ===== 签到 ===== */
.checkin-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.checkin-panel {
  display: flex;
  align-items: center;
  gap: 32px;
}
.checkin-left {
  text-align: center;
  flex-shrink: 0;
}
.checkin-streak {
  margin-top: 8px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.checkin-streak strong {
  color: var(--primary-color);
  font-size: 18px;
}
.checkin-right {
  flex: 1;
}
.week-calendar {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}
.week-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.week-day-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.week-day-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--el-fill-color-light);
  border: 2px solid var(--el-border-color);
  transition: all 0.3s;
}
.week-day.checked .week-day-dot {
  background: var(--primary-color);
  border-color: var(--primary-color);
}
.streak-rewards {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  opacity: 0.4;
  transition: opacity 0.3s;
}
.reward-item.reached {
  opacity: 1;
}
.reward-day {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.reward-bonus {
  font-size: 11px;
  color: var(--primary-color);
}

/* ===== 激励语 ===== */
.quote-section {
  margin-bottom: 24px;
}
.quote-card {
  background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 70%, #000));
  border-radius: 12px;
  padding: 28px 32px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  color: #fff;
}
.quote-card:hover {
  transform: scale(1.01);
}
.quote-icon {
  font-size: 24px;
  margin-bottom: 12px;
  opacity: 0.7;
}
.quote-text {
  font-size: 18px;
  line-height: 1.8;
  margin: 0 0 12px;
  font-style: italic;
}
.quote-hint {
  font-size: 12px;
  opacity: 0.5;
}

/* ===== 统计面板 ===== */
.stats-panel-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.stats-content {
  margin-top: 12px;
}
.stats-summary {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
}
.summary-item {
  text-align: center;
}
.summary-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}
.summary-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.chart-container {
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 160px;
}
.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.chart-bar {
  width: 100%;
  max-width: 40px;
  min-height: 2px;
  background: linear-gradient(180deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 50%, #fff));
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}
.chart-label {
  font-size: 10px;
  color: var(--el-text-color-placeholder);
  margin-top: 6px;
}
.best-record {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.best-record .el-icon {
  color: #ffb300;
}
</style>

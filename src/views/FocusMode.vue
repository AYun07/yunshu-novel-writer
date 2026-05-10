<template>
  <transition name="focus-fade">
    <div
      class="focus-mode"
      :style="themeStyle"
      @mousemove="onMouseMove"
      @mouseleave="showToolbar = false"
    >
      <!-- 顶部工具栏（鼠标移到顶部显示） -->
      <transition name="slide-down">
        <div v-show="showToolbar" class="focus-toolbar">
          <div class="toolbar-left">
            <el-select v-model="currentProject" placeholder="选择项目" size="small" style="width: 140px">
              <el-option v-for="p in projects" :key="p.id" :label="p.title" :value="p.id" />
            </el-select>
            <el-select v-model="currentChapter" placeholder="选择章节" size="small" style="width: 140px">
              <el-option v-for="c in chapters" :key="c.id" :label="c.title" :value="c.id" />
            </el-select>
          </div>
          <div class="toolbar-center">
            <span class="toolbar-timer">{{ formattedTimer }}</span>
            <span class="toolbar-divider">|</span>
            <span class="toolbar-words">{{ wordCount }} 字</span>
            <span class="toolbar-divider">|</span>
            <el-progress
              :percentage="goalProgress"
              :stroke-width="6"
              :show-text="false"
              style="width: 120px"
              :color="config.theme.cursorColor"
            />
            <span class="toolbar-goal-text">{{ goalProgress }}%</span>
          </div>
          <div class="toolbar-right">
            <el-button size="small" text @click="toggleRightPanel">
              <el-icon><Setting /></el-icon>
            </el-button>
            <el-button size="small" type="danger" text @click="exitFocusMode">
              <el-icon><Close /></el-icon> 退出
            </el-button>
          </div>
        </div>
      </transition>

      <!-- 中央编辑区 -->
      <div class="editor-area" :style="typographyStyle" @click="focusEditor">
        <textarea
          ref="editorRef"
          v-model="content"
          class="focus-editor"
          :style="editorStyle"
          placeholder="开始写作..."
          @input="onInput"
          @keydown="onKeydown"
          spellcheck="false"
        />
      </div>

      <!-- 右侧面板 -->
      <transition name="slide-left">
        <div v-show="rightPanelVisible" class="right-panel">
          <!-- 番茄钟面板 -->
          <div class="panel-section">
            <h4 class="panel-title">番茄钟</h4>
            <div class="pomodoro-ring">
              <svg viewBox="0 0 120 120" class="ring-svg">
                <circle cx="60" cy="60" r="52" fill="none" :stroke="ringBgColor" stroke-width="6" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  :stroke="config.theme.cursorColor"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="ringOffset"
                  transform="rotate(-90 60 60)"
                  class="ring-progress"
                />
              </svg>
              <div class="ring-text">
                <span class="ring-time">{{ formattedPomodoro }}</span>
                <span class="ring-label">{{ pomodoroLabel }}</span>
              </div>
            </div>
            <div class="pomodoro-controls">
              <el-button size="small" round @click="togglePomodoro">
                {{ pomodoroRunning ? '暂停' : '开始' }}
              </el-button>
              <el-button size="small" round @click="resetPomodoro">重置</el-button>
            </div>
            <div class="pomodoro-count">已完成 {{ totalPomodoros }} 个番茄钟</div>
          </div>

          <!-- 环境音效 -->
          <div class="panel-section">
            <h4 class="panel-title">环境音效</h4>
            <div class="sound-grid">
              <button
                v-for="sound in availableSounds"
                :key="sound.id"
                class="sound-btn"
                :class="{ active: activeSound === sound.id }"
                @click="toggleSound(sound.id)"
                :title="sound.description"
              >
                <el-icon><component :is="sound.icon" /></el-icon>
                <span>{{ sound.name }}</span>
              </button>
            </div>
            <div class="volume-control">
              <el-icon><Microphone /></el-icon>
              <el-slider v-model="soundVolume" :min="0" :max="100" size="small" @input="onVolumeChange" />
            </div>
          </div>

          <!-- 排版设置 -->
          <div class="panel-section">
            <h4 class="panel-title">排版设置</h4>
            <div class="setting-row">
              <label>字号</label>
              <el-slider v-model="fontSize" :min="14" :max="32" :step="1" size="small" style="flex:1" />
              <span class="setting-value">{{ fontSize }}px</span>
            </div>
            <div class="setting-row">
              <label>行高</label>
              <el-slider v-model="lineHeight" :min="1.2" :max="3.0" :step="0.1" size="small" style="flex:1" />
              <span class="setting-value">{{ lineHeight }}</span>
            </div>
            <div class="setting-row">
              <label>段间距</label>
              <el-slider v-model="paragraphSpacing" :min="4" :max="40" :step="2" size="small" style="flex:1" />
              <span class="setting-value">{{ paragraphSpacing }}px</span>
            </div>
          </div>

          <!-- 颜色主题 -->
          <div class="panel-section">
            <h4 class="panel-title">颜色主题</h4>
            <div class="theme-grid">
              <div
                v-for="theme in themePresets"
                :key="theme.id"
                class="theme-card"
                :class="{ active: currentThemeId === theme.id }"
                @click="applyTheme(theme.id)"
              >
                <div class="theme-preview" :style="{ background: theme.theme.backgroundColor, color: theme.theme.textColor }">
                  Aa
                </div>
                <span class="theme-name">{{ theme.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 底部状态栏 -->
      <div class="status-bar" :style="statusBarStyle">
        <div class="status-left">
          <span>{{ wordCount }} 字</span>
          <span class="status-divider">|</span>
          <span>{{ sentenceCount }} 句</span>
          <span class="status-divider">|</span>
          <span>{{ paragraphCount }} 段</span>
        </div>
        <div class="status-center">
          <span>已用 {{ formattedElapsedTime }}</span>
        </div>
        <div class="status-right">
          <span>{{ writingSpeed }} 字/分钟</span>
        </div>
      </div>

      <!-- 进入动画遮罩 -->
      <transition name="focus-fade">
        <div v-if="isEntering" class="enter-overlay" @animationend="isEntering = false" />
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Setting, Close, Microphone } from '@element-plus/icons-vue'
import { FocusModeManager, FOCUS_THEMES, AMBIENT_SOUNDS } from '../config/focusMode.js'

const router = useRouter()

// ========== 专注模式管理器 ==========
const manager = new FocusModeManager()
const config = reactive(manager.config)

// ========== 状态 ==========
const showToolbar = ref(false)
const rightPanelVisible = ref(false)
const isEntering = ref(true)
const content = ref('')
const editorRef = ref(null)

// 项目和章节（模拟数据）
const projects = ref([
  { id: 'p1', title: '我的小说' },
  { id: 'p2', title: '短篇集' }
])
const currentProject = ref('p1')
const chapters = ref([
  { id: 'c1', title: '第一章 开始' },
  { id: 'c2', title: '第二章 发展' }
])
const currentChapter = ref('c1')

// 计时器
const pomodoroRunning = ref(false)
const pomodoroRemaining = ref(0)
const pomodoroState = ref('idle')
const totalPomodoros = ref(0)
const elapsedSeconds = ref(0)
let elapsedTimer = null

// 排版设置
const fontSize = ref(config.typography.fontSize)
const lineHeight = ref(config.typography.lineHeight)
const paragraphSpacing = ref(config.typography.paragraphSpacing)

// 音效
const activeSound = ref('')
const soundVolume = ref(50)
let audioContext = null
let noiseNode = null
let gainNode = null

// 主题
const currentThemeId = ref(config.theme.preset)
const themePresets = config.themePresets
const availableSounds = config.availableSounds

// ========== 计算属性 ==========
const wordCount = computed(() => {
  return content.value.replace(/\s/g, '').length
})

const sentenceCount = computed(() => {
  const matches = content.value.match(/[。！？；…]+/g)
  return matches ? matches.length : 0
})

const paragraphCount = computed(() => {
  if (!content.value.trim()) return 0
  return content.value.split(/\n+/).filter(p => p.trim()).length
})

const goalProgress = computed(() => {
  const goal = config.wordGoal.dailyGoal
  return goal > 0 ? Math.min(100, Math.round((wordCount.value / goal) * 100)) : 0
})

const formattedTimer = computed(() => {
  const m = Math.floor(elapsedSeconds.value / 60)
  const s = elapsedSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const formattedElapsedTime = computed(() => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  const s = elapsedSeconds.value % 60
  if (h > 0) return `${h}时${m}分${s}秒`
  return `${m}分${s}秒`
})

const writingSpeed = computed(() => {
  const minutes = elapsedSeconds.value / 60
  return minutes > 0 ? Math.round(wordCount.value / minutes) : 0
})

const formattedPomodoro = computed(() => {
  const m = Math.floor(pomodoroRemaining.value / 60)
  const s = pomodoroRemaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const pomodoroLabel = computed(() => {
  const labels = { idle: '准备就绪', working: '专注写作', short_break: '短休息', long_break: '长休息' }
  return labels[pomodoroState.value] || '准备就绪'
})

const circumference = computed(() => 2 * Math.PI * 52)

const ringOffset = computed(() => {
  const total = pomodoroState.value === 'working'
    ? config.timer.workDuration * 60
    : pomodoroState.value === 'short_break'
      ? config.timer.shortBreakDuration * 60
      : pomodoroState.value === 'long_break'
        ? config.timer.longBreakDuration * 60
        : config.timer.workDuration * 60
  const progress = total > 0 ? pomodoroRemaining.value / total : 0
  return circumference.value * (1 - progress)
})

const ringBgColor = computed(() => {
  return config.theme.textColor === '#e0e0e0' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
})

// ========== 样式计算 ==========
const themeStyle = computed(() => ({
  backgroundColor: config.theme.backgroundColor,
  color: config.theme.textColor,
  caretColor: config.theme.cursorColor
}))

const typographyStyle = computed(() => ({
  fontFamily: config.typography.fontFamily,
  fontSize: fontSize.value + 'px',
  lineHeight: lineHeight.value,
  letterSpacing: config.typography.letterSpacing + 'px'
}))

const editorStyle = computed(() => ({
  backgroundColor: 'transparent',
  color: config.theme.textColor,
  caretColor: config.theme.cursorColor,
  fontSize: fontSize.value + 'px',
  lineHeight: lineHeight.value,
  letterSpacing: config.typography.letterSpacing + 'px',
  textIndent: config.typography.textIndent + 'em',
  maxHeight: 'none',
  overflow: 'hidden'
}))

const statusBarStyle = computed(() => ({
  backgroundColor: config.theme.textColor === '#e0e0e0'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.05)',
  color: config.theme.textColor,
  opacity: 0.6
}))

// ========== 方法 ==========
function onMouseMove(e) {
  if (e.clientY < 40) {
    showToolbar.value = true
  }
}

function toggleRightPanel() {
  rightPanelVisible.value = !rightPanelVisible.value
}

function focusEditor() {
  editorRef.value?.focus()
}

function onInput() {
  manager.updateWordCount(wordCount.value)
}

function onKeydown(e) {
  // Ctrl+S 保存
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    ElMessage.success('内容已保存')
  }
  // Esc 退出
  if (e.key === 'Escape') {
    exitFocusMode()
  }
  // F11 全屏
  if (e.key === 'F11') {
    e.preventDefault()
    toggleFullscreen()
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

function exitFocusMode() {
  manager.exitFocusMode()
  stopElapsedTimer()
  stopNoise()
  router.back()
}

// ========== 番茄钟 ==========
function togglePomodoro() {
  if (pomodoroRunning.value) {
    pausePomodoro()
  } else {
    startPomodoro()
  }
}

function startPomodoro() {
  if (pomodoroState.value === 'idle') {
    pomodoroState.value = 'working'
    pomodoroRemaining.value = config.timer.workDuration * 60
  }
  pomodoroRunning.value = true
  manager.startPomodoro()

  manager.onPomodoroChange((state, remaining) => {
    pomodoroState.value = state
    pomodoroRemaining.value = remaining
    if (state === 'working') {
      totalPomodoros.value = manager.totalPomodoros
    }
  })
}

function pausePomodoro() {
  pomodoroRunning.value = false
  manager.pausePomodoro()
}

function resetPomodoro() {
  pomodoroRunning.value = false
  pomodoroState.value = 'idle'
  pomodoroRemaining.value = 0
  manager.resetPomodoro()
}

// ========== 已用时间计时器 ==========
function startElapsedTimer() {
  elapsedTimer = setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
}

function stopElapsedTimer() {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

// ========== 环境音效（Web Audio API 噪音生成） ==========
function toggleSound(soundId) {
  if (activeSound.value === soundId) {
    stopNoise()
    activeSound.value = ''
    return
  }
  stopNoise()
  activeSound.value = soundId
  playNoise(soundId)
}

function playNoise(soundId) {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const bufferSize = 2 * audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // 根据音效类型生成不同噪音
    const type = soundId.replace(/-.*/g, '')
    if (type === 'white-noise' || soundId === 'white-noise') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
    } else if (soundId === 'pink-noise') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      }
    } else {
      // 棕噪音（低频噪音，适合雨声/风声等模拟）
      let lastOut = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        data[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = data[i]
        data[i] *= 3.5
      }
    }

    noiseNode = audioContext.createBufferSource()
    noiseNode.buffer = buffer
    noiseNode.loop = true

    gainNode = audioContext.createGain()
    gainNode.gain.value = soundVolume.value / 100 * 0.3

    noiseNode.connect(gainNode)
    gainNode.connect(audioContext.destination)
    noiseNode.start()
  } catch (e) {
    console.warn('音效播放失败:', e)
  }
}

function stopNoise() {
  if (noiseNode) {
    try { noiseNode.stop() } catch (_) {}
    noiseNode = null
  }
  if (audioContext) {
    audioContext.close?.()
    audioContext = null
  }
}

function onVolumeChange(val) {
  if (gainNode) {
    gainNode.gain.value = val / 100 * 0.3
  }
}

// ========== 主题 ==========
function applyTheme(presetId) {
  manager.applyThemePreset(presetId)
  currentThemeId.value = presetId
}

// ========== 生命周期 ==========
onMounted(() => {
  manager.enterFocusMode({ chapterId: currentChapter.value, projectId: currentProject.value })
  startElapsedTimer()
  nextTick(() => {
    editorRef.value?.focus()
  })
  // 进入动画结束
  setTimeout(() => { isEntering.value = false }, 600)
})

onBeforeUnmount(() => {
  stopElapsedTimer()
  stopNoise()
  manager.exitFocusMode()
})
</script>

<style scoped>
.focus-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  transition: background-color 0.5s, color 0.5s;
}

/* ===== 顶部工具栏 ===== */
.focus-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.toolbar-left, .toolbar-center, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.toolbar-timer {
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.toolbar-words {
  font-size: 14px;
  opacity: 0.8;
}
.toolbar-divider {
  opacity: 0.3;
}
.toolbar-goal-text {
  font-size: 12px;
  opacity: 0.6;
}

/* ===== 编辑区 ===== */
.editor-area {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 60px 40px 40px;
  overflow-y: auto;
}
.focus-editor {
  width: 100%;
  max-width: 720px;
  min-height: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  text-align: justify;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.focus-editor::placeholder {
  opacity: 0.3;
}

/* ===== 右侧面板 ===== */
.right-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  padding: 16px;
  z-index: 90;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
}
.panel-section {
  margin-bottom: 24px;
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 12px;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ===== 番茄钟 ===== */
.pomodoro-ring {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
}
.ring-svg {
  width: 100%;
  height: 100%;
}
.ring-progress {
  transition: stroke-dashoffset 1s linear;
}
.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.ring-time {
  display: block;
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ring-label {
  display: block;
  font-size: 11px;
  opacity: 0.6;
  margin-top: 2px;
}
.pomodoro-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}
.pomodoro-count {
  text-align: center;
  font-size: 12px;
  opacity: 0.5;
}

/* ===== 环境音效 ===== */
.sound-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}
.sound-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}
.sound-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.sound-btn.active {
  border-color: var(--primary-color, #64ffda);
  background: rgba(100, 255, 218, 0.1);
  color: var(--primary-color, #64ffda);
}
.sound-btn .el-icon {
  font-size: 18px;
}
.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== 排版设置 ===== */
.setting-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.setting-row label {
  font-size: 12px;
  opacity: 0.7;
  width: 48px;
  flex-shrink: 0;
}
.setting-value {
  font-size: 11px;
  opacity: 0.5;
  width: 42px;
  text-align: right;
  flex-shrink: 0;
}

/* ===== 颜色主题 ===== */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.theme-card {
  text-align: center;
  cursor: pointer;
}
.theme-preview {
  width: 100%;
  aspect-ratio: 1.4;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}
.theme-card.active .theme-preview {
  border-color: var(--primary-color, #64ffda);
}
.theme-name {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
  display: block;
}

/* ===== 底部状态栏 ===== */
.status-bar {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 12px;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
.status-left, .status-center, .status-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-divider {
  opacity: 0.3;
}

/* ===== 进入动画 ===== */
.enter-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  animation: enterFade 0.6s ease-out forwards;
  z-index: 200;
  pointer-events: none;
}
@keyframes enterFade {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

/* ===== 过渡动画 ===== */
.focus-fade-enter-active { transition: opacity 0.4s ease; }
.focus-fade-leave-active { transition: opacity 0.3s ease; }
.focus-fade-enter-from, .focus-fade-leave-to { opacity: 0; }

.slide-down-enter-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-down-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0; }

.slide-left-enter-active { transition: transform 0.3s ease; }
.slide-left-leave-active { transition: transform 0.2s ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(100%); }
</style>

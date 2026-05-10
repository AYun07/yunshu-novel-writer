<template>
  <div class="mobile-quick-write" :class="{ 'timer-running': isTimerRunning }">
    <!-- 顶部导航 -->
    <div class="header">
      <el-button type="text" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h1 class="title">快速写作</h1>
      <el-button type="primary" text @click="saveSnippet" :loading="isSaving">
        保存
      </el-button>
    </div>

    <!-- 计时器和目标区域 -->
    <div class="timer-section">
      <div class="timer-display" @click="toggleTimer">
        <div class="timer-circle" :class="{ running: isTimerRunning }">
          <span class="timer-time">{{ formatTimerTime }}</span>
          <span class="timer-status">{{ isTimerRunning ? '点击暂停' : '点击开始' }}</span>
        </div>
      </div>

      <div class="word-goal">
        <div class="goal-label">目标字数</div>
        <div class="goal-value">
          <el-input-number
            v-model="wordGoal"
            :min="100"
            :max="5000"
            :step="100"
            size="small"
            controls-position="right"
          />
        </div>
        <div class="goal-progress">
          <el-progress
            :percentage="goalPercentage"
            :color="goalColor"
            :stroke-width="8"
            :show-text="false"
          />
          <span class="progress-text">{{ currentWordCount }} / {{ wordGoal }}</span>
        </div>
      </div>
    </div>

    <!-- 编辑器区域 -->
    <div class="editor-section">
      <textarea
        ref="editorRef"
        v-model="content"
        class="quick-editor"
        placeholder="在这里写下你的想法...&#10;&#10;快速写作模式帮助你专注于创作，不受干扰。&#10;设置一个字数目标，开始你的写作之旅吧！"
        @input="handleInput"
      ></textarea>

      <!-- 字数统计浮层 -->
      <div class="word-count-float">
        <el-icon><Document /></el-icon>
        <span>{{ currentWordCount }} 字</span>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="footer-actions">
      <el-button @click="clearContent" :disabled="!content">
        <el-icon><Delete /></el-icon>
        清空
      </el-button>
      <el-button type="primary" @click="saveSnippet" :loading="isSaving">
        <el-icon><FolderAdd /></el-icon>
        保存到片段库
      </el-button>
    </div>

    <!-- 保存对话框 -->
    <el-dialog
      v-model="showSaveDialog"
      title="保存片段"
      width="90%"
      class="mobile-dialog"
    >
      <el-form label-position="top">
        <el-form-item label="片段标题">
          <el-input
            v-model="snippetTitle"
            placeholder="给这个片段起个标题"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="分类标签">
          <el-select
            v-model="snippetCategory"
            placeholder="选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联项目（可选）">
          <el-select
            v-model="selectedProject"
            placeholder="选择项目"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.name"
              :value="project.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="tag in snippetTags"
            :key="tag"
            closable
            @close="removeTag(tag)"
            class="snippet-tag"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputTagVisible"
            ref="tagInputRef"
            v-model="inputTagValue"
            size="small"
            style="width: 80px"
            @keyup.enter="confirmTag"
            @blur="confirmTag"
          />
          <el-button v-else size="small" @click="showTagInput">
            <el-icon><Plus /></el-icon>
            添加标签
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSaveDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSave" :loading="isSaving">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 完成提示 -->
    <el-dialog
      v-model="showCompleteDialog"
      title="恭喜完成目标！"
      width="90%"
      class="mobile-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      align-center
    >
      <div class="complete-content">
        <div class="complete-icon">
          <el-icon><Trophy /></el-icon>
        </div>
        <h3>太棒了！</h3>
        <p>你已经完成了 {{ wordGoal }} 字的写作目标</p>
        <div class="complete-stats">
          <div class="stat">
            <span class="value">{{ formatTimerTime }}</span>
            <span class="label">用时</span>
          </div>
          <div class="stat">
            <span class="value">{{ Math.round(currentWordCount / (timerSeconds / 60)) }}</span>
            <span class="label">字/分钟</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="continueWriting">继续写作</el-button>
        <el-button type="primary" @click="saveAndExit">保存并退出</el-button>
      </template>
    </el-dialog>

    <!-- 安全区域 -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup>
/**
 * 移动端快速写作组件
 * 提供极简界面、大输入框、计时器、字数目标等功能
 * 支持快速保存到片段库
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Delete, FolderAdd, Plus, Document, Trophy
} from '@element-plus/icons-vue'
import database from '../../services/database.js'

// ==================== 路由和状态 ====================
const router = useRouter()

// ==================== 响应式数据 ====================
const content = ref('')
const wordGoal = ref(500)
const timerSeconds = ref(0)
const isTimerRunning = ref(false)
const isSaving = ref(false)
const showSaveDialog = ref(false)
const showCompleteDialog = ref(false)

// 保存表单
const snippetTitle = ref('')
const snippetCategory = ref('general')
const selectedProject = ref(null)
const snippetTags = ref([])
const inputTagVisible = ref(false)
const inputTagValue = ref('')

// 编辑器引用
const editorRef = ref(null)
const tagInputRef = ref(null)

// 定时器
let timerInterval = null

// 项目列表
const projects = ref([])

// 分类选项
const categories = [
  { label: '一般', value: 'general' },
  { label: '灵感', value: 'idea' },
  { label: '对话', value: 'dialogue' },
  { label: '场景', value: 'scene' },
  { label: '人物', value: 'character' },
  { label: '情节', value: 'plot' },
  { label: '设定', value: 'setting' }
]

// ==================== 计算属性 ====================

/**
 * 当前字数（中文字符+英文单词）
 */
const currentWordCount = computed(() => {
  const text = content.value || ''
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
})

/**
 * 目标完成百分比
 */
const goalPercentage = computed(() => {
  return Math.min(100, Math.round((currentWordCount.value / wordGoal.value) * 100))
})

/**
 * 进度条颜色
 */
const goalColor = computed(() => {
  const percentage = goalPercentage.value
  if (percentage >= 100) return '#67c23a'
  if (percentage >= 75) return '#409eff'
  if (percentage >= 50) return '#e6a23c'
  return '#f56c6c'
})

/**
 * 格式化计时器时间
 */
const formatTimerTime = computed(() => {
  const hours = Math.floor(timerSeconds.value / 3600)
  const minutes = Math.floor((timerSeconds.value % 3600) / 60)
  const seconds = timerSeconds.value % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// ==================== 方法 ====================

/**
 * 处理返回
 */
const handleBack = () => {
  if (content.value && !showSaveDialog.value) {
    ElMessageBox.confirm(
      '有未保存的内容，确定要退出吗？',
      '确认退出',
      {
        confirmButtonText: '保存并退出',
        cancelButtonText: '直接退出',
        type: 'warning',
        distinguishCancelAndClose: true
      }
    ).then(() => {
      saveSnippet().then(() => router.back())
    }).catch((action) => {
      if (action === 'cancel') {
        router.back()
      }
    })
  } else {
    router.back()
  }
}

/**
 * 处理输入
 */
const handleInput = () => {
  // 自动开始计时
  if (!isTimerRunning.value && content.value) {
    startTimer()
  }

  // 检查是否完成目标
  if (currentWordCount.value >= wordGoal.value && !showCompleteDialog.value) {
    pauseTimer()
    showCompleteDialog.value = true
  }
}

/**
 * 切换计时器
 */
const toggleTimer = () => {
  if (isTimerRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

/**
 * 开始计时
 */
const startTimer = () => {
  isTimerRunning.value = true
  timerInterval = setInterval(() => {
    timerSeconds.value++
  }, 1000)
}

/**
 * 暂停计时
 */
const pauseTimer = () => {
  isTimerRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

/**
 * 清空内容
 */
const clearContent = () => {
  ElMessageBox.confirm(
    '确定要清空所有内容吗？此操作不可恢复。',
    '确认清空',
    {
      confirmButtonText: '清空',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    content.value = ''
    pauseTimer()
    timerSeconds.value = 0
    ElMessage.success('已清空')
  }).catch(() => {})
}

/**
 * 保存片段
 */
const saveSnippet = async () => {
  if (!content.value.trim()) {
    ElMessage.warning('请先输入内容')
    return
  }

  // 生成默认标题
  if (!snippetTitle.value) {
    const date = new Date()
    snippetTitle.value = `快速写作 ${date.toLocaleDateString('zh-CN')} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  }

  showSaveDialog.value = true
}

/**
 * 确认保存
 */
const confirmSave = async () => {
  if (!snippetTitle.value.trim()) {
    ElMessage.warning('请输入片段标题')
    return
  }

  isSaving.value = true
  try {
    await database.createSnippet({
      projectId: selectedProject.value,
      title: snippetTitle.value,
      content: content.value,
      category: snippetCategory.value,
      tags: snippetTags.value,
      wordCount: currentWordCount.value,
      writingTime: timerSeconds.value
    })

    ElMessage.success('保存成功')
    showSaveDialog.value = false

    // 重置表单
    content.value = ''
    snippetTitle.value = ''
    snippetTags.value = []
    pauseTimer()
    timerSeconds.value = 0
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    isSaving.value = false
  }
}

/**
 * 显示标签输入
 */
const showTagInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

/**
 * 确认添加标签
 */
const confirmTag = () => {
  if (inputTagValue.value) {
    if (!snippetTags.value.includes(inputTagValue.value)) {
      snippetTags.value.push(inputTagValue.value)
    }
  }
  inputTagVisible.value = false
  inputTagValue.value = ''
}

/**
 * 移除标签
 */
const removeTag = (tag) => {
  const index = snippetTags.value.indexOf(tag)
  if (index > -1) {
    snippetTags.value.splice(index, 1)
  }
}

/**
 * 继续写作
 */
const continueWriting = () => {
  showCompleteDialog.value = false
  // 增加目标
  wordGoal.value += 500
}

/**
 * 保存并退出
 */
const saveAndExit = async () => {
  await confirmSave()
  router.back()
}

// ==================== 数据加载 ====================

/**
 * 加载项目列表
 */
const loadProjects = async () => {
  try {
    projects.value = await database.getProjects()
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadProjects()

  // 加载保存的设置
  const savedSettings = localStorage.getItem('quick_write_settings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      wordGoal.value = settings.wordGoal || 500
      snippetCategory.value = settings.defaultCategory || 'general'
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  // 聚焦编辑器
  nextTick(() => {
    editorRef.value?.focus()
  })
})

onUnmounted(() => {
  pauseTimer()

  // 保存设置
  localStorage.setItem('quick_write_settings', JSON.stringify({
    wordGoal: wordGoal.value,
    defaultCategory: snippetCategory.value
  }))
})
</script>

<style scoped>
.mobile-quick-write {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafafa;
}

.mobile-quick-write.timer-running {
  background: linear-gradient(180deg, #f0f7ff 0%, #fafafa 100%);
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

/* 计时器区域 */
.timer-section {
  background: white;
  padding: 20px 16px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.timer-display {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.timer-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.timer-circle.running {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 4px 32px rgba(102, 126, 234, 0.5);
  }
}

.timer-circle:active {
  transform: scale(0.95);
}

.timer-time {
  font-size: 28px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.timer-status {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}

/* 字数目标 */
.word-goal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-label {
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.goal-value {
  display: flex;
  justify-content: center;
}

.goal-value :deep(.el-input-number) {
  width: 140px;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.goal-progress :deep(.el-progress) {
  flex: 1;
}

.progress-text {
  font-size: 13px;
  color: #606266;
  min-width: 80px;
  text-align: right;
}

/* 编辑器区域 */
.editor-section {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.quick-editor {
  width: 100%;
  height: 100%;
  padding: 20px;
  border: none;
  outline: none;
  resize: none;
  font-size: 18px;
  line-height: 1.8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: transparent;
  color: #303133;
}

.quick-editor::placeholder {
  color: #c0c4cc;
  font-size: 16px;
}

.word-count-float {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 底部操作栏 */
.footer-actions {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;
}

.footer-actions .el-button {
  flex: 1;
}

/* 对话框样式 */
:deep(.mobile-dialog) {
  border-radius: 16px;
}

.snippet-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

/* 完成提示 */
.complete-content {
  text-align: center;
  padding: 20px;
}

.complete-icon {
  font-size: 64px;
  color: #e6a23c;
  margin-bottom: 16px;
}

.complete-content h3 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
}

.complete-content p {
  font-size: 14px;
  color: #606266;
  margin: 0 0 24px 0;
}

.complete-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.complete-stats .stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.complete-stats .value {
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
}

.complete-stats .label {
  font-size: 12px;
  color: #909399;
}

/* 安全区域 */
.safe-area-bottom {
  height: env(safe-area-inset-bottom, 0);
  flex-shrink: 0;
}
</style>

<template>
  <div class="mobile-writer" :class="{ 'focus-mode': isFocusMode }">
    <!-- 顶部标题栏 -->
    <div class="writer-header" v-show="!isFocusMode">
      <div class="header-left">
        <el-button type="text" @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="title-section" @click="showTitleEdit = true">
          <h1 class="chapter-title">{{ currentChapter?.title || '未命名章节' }}</h1>
          <p class="project-name">{{ currentProject?.name || '未选择项目' }}</p>
        </div>
      </div>
      <div class="header-right">
        <el-button
          type="primary"
          text
          :loading="isSaving"
          @click="saveContent"
        >
          <el-icon v-if="!isSaving"><Check /></el-icon>
          <span>{{ saveStatus }}</span>
        </el-button>
        <el-button type="text" @click="showSettings = true">
          <el-icon><Setting /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 专注模式退出按钮 -->
    <div class="focus-exit" v-show="isFocusMode" @click="toggleFocusMode">
      <el-icon><Close /></el-icon>
    </div>

    <!-- 编辑器区域 -->
    <div class="editor-container">
      <textarea
        ref="editorRef"
        v-model="content"
        class="writer-editor"
        placeholder="开始你的创作..."
        @input="handleInput"
        @keydown="handleKeydown"
      ></textarea>

      <!-- 自动保存提示 -->
      <transition name="fade">
        <div class="autosave-toast" v-if="showAutoSaveToast">
          <el-icon><CircleCheck /></el-icon>
          <span>已自动保存</span>
        </div>
      </transition>
    </div>

    <!-- 底部工具栏 -->
    <div class="writer-footer" v-show="!isFocusMode">
      <div class="footer-left">
        <span class="word-count">
          <el-icon><Document /></el-icon>
          {{ wordCount }} 字
        </span>
        <span class="char-count">
          {{ charCount }} 字符
        </span>
      </div>
      <div class="footer-center">
        <el-button
          type="primary"
          text
          size="small"
          @click="toggleFocusMode"
        >
          <el-icon><FullScreen /></el-icon>
          专注
        </el-button>
      </div>
      <div class="footer-right">
        <el-button type="text" size="small" @click="showChapters = true">
          <el-icon><List /></el-icon>
          章节
        </el-button>
        <el-button type="text" size="small" @click="showTools = true">
          <el-icon><Tools /></el-icon>
          工具
        </el-button>
      </div>
    </div>

    <!-- 专注模式底部信息 -->
    <div class="focus-footer" v-show="isFocusMode">
      <span class="focus-word-count">{{ wordCount }} 字</span>
      <span class="focus-time">{{ formatTime(writingTime) }}</span>
    </div>

    <!-- 章节列表面板 -->
    <el-drawer
      v-model="showChapters"
      title="章节列表"
      direction="ltr"
      size="80%"
      class="chapters-drawer"
    >
      <div class="chapters-list">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          class="chapter-item"
          :class="{ active: currentChapter?.id === chapter.id }"
          @click="selectChapter(chapter)"
        >
          <div class="chapter-info">
            <span class="chapter-order">第{{ chapter.order }}章</span>
            <span class="chapter-name">{{ chapter.title }}</span>
          </div>
          <el-icon v-if="currentChapter?.id === chapter.id"><Check /></el-icon>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="createNewChapter">
          <el-icon><Plus /></el-icon>
          新建章节
        </el-button>
      </template>
    </el-drawer>

    <!-- 工具面板 -->
    <el-drawer
      v-model="showTools"
      title="写作工具"
      direction="btt"
      size="60%"
      class="tools-drawer"
    >
      <div class="tools-grid">
        <div class="tool-item" @click="insertTemplate">
          <el-icon><DocumentCopy /></el-icon>
          <span>插入模板</span>
        </div>
        <div class="tool-item" @click="generateWithAI">
          <el-icon><MagicStick /></el-icon>
          <span>AI续写</span>
        </div>
        <div class="tool-item" @click="showHistory = true">
          <el-icon><Clock /></el-icon>
          <span>历史版本</span>
        </div>
        <div class="tool-item" @click="exportCurrent">
          <el-icon><Download /></el-icon>
          <span>导出</span>
        </div>
      </div>
    </el-drawer>

    <!-- 设置面板 -->
    <el-drawer
      v-model="showSettings"
      title="编辑器设置"
      direction="rtl"
      size="80%"
      class="settings-drawer"
    >
      <div class="settings-list">
        <div class="setting-item">
          <span class="setting-label">字体大小</span>
          <el-slider v-model="fontSize" :min="14" :max="24" :step="1" show-stops />
          <span class="setting-value">{{ fontSize }}px</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">行间距</span>
          <el-slider v-model="lineHeight" :min="1.5" :max="2.5" :step="0.1" show-stops />
          <span class="setting-value">{{ lineHeight }}</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">自动保存</span>
          <el-switch v-model="autoSaveEnabled" />
        </div>
        <div class="setting-item">
          <span class="setting-label">打字音效</span>
          <el-switch v-model="typingSoundEnabled" />
        </div>
        <div class="setting-item">
          <span class="setting-label">屏幕常亮</span>
          <el-switch v-model="keepScreenOn" />
        </div>
      </div>
    </el-drawer>

    <!-- 标题编辑对话框 -->
    <el-dialog
      v-model="showTitleEdit"
      title="编辑章节标题"
      width="90%"
      class="mobile-dialog"
    >
      <el-input
        v-model="editingTitle"
        placeholder="输入章节标题"
        maxlength="50"
        show-word-limit
      />
      <template #footer>
        <el-button @click="showTitleEdit = false">取消</el-button>
        <el-button type="primary" @click="saveTitle">保存</el-button>
      </template>
    </el-dialog>

    <!-- 新建章节对话框 -->
    <el-dialog
      v-model="showNewChapterDialog"
      title="新建章节"
      width="90%"
      class="mobile-dialog"
    >
      <el-form label-position="top">
        <el-form-item label="章节标题">
          <el-input
            v-model="newChapterTitle"
            placeholder="输入章节标题"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="插入位置">
          <el-radio-group v-model="newChapterPosition">
            <el-radio label="after">当前章节之后</el-radio>
            <el-radio label="end">章节末尾</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNewChapterDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateChapter" :loading="creating">
          创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 安全区域 -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup>
/**
 * 移动端写作编辑器组件
 * 提供全屏编辑器、自动保存、专注模式、手势支持等功能
 * 适配移动端虚拟键盘和触摸操作
 */

import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Check, Setting, Document, List, Tools,
  FullScreen, Close, Plus, DocumentCopy, MagicStick,
  Clock, Download, CircleCheck
} from '@element-plus/icons-vue'
import database from '../../services/database.js'

// ==================== 路由和状态 ====================
const router = useRouter()
const route = useRoute()

// ==================== 响应式数据 ====================
const content = ref('')
const currentProject = ref(null)
const currentChapter = ref(null)
const chapters = ref([])
const isSaving = ref(false)
const saveStatus = ref('保存')
const showAutoSaveToast = ref(false)
const isFocusMode = ref(false)
const showChapters = ref(false)
const showTools = ref(false)
const showSettings = ref(false)
const showTitleEdit = ref(false)
const showNewChapterDialog = ref(false)
const creating = ref(false)

// 编辑器设置
const fontSize = ref(18)
const lineHeight = ref(1.8)
const autoSaveEnabled = ref(true)
const typingSoundEnabled = ref(false)
const keepScreenOn = ref(true)

// 章节编辑
const editingTitle = ref('')
const newChapterTitle = ref('')
const newChapterPosition = ref('after')

// 编辑器引用
const editorRef = ref(null)

// 自动保存定时器
let autoSaveTimer = null
let lastSavedContent = ''

// 写作计时
const writingTime = ref(0)
let writingTimer = null
let lastInputTime = Date.now()

// 手势相关
const touchStartX = ref(0)
const touchStartY = ref(0)

// ==================== 计算属性 ====================

/**
 * 计算字数（中文字符+英文单词）
 */
const wordCount = computed(() => {
  const text = content.value || ''
  // 中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  // 英文单词数
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
})

/**
 * 计算字符数（包含所有字符）
 */
const charCount = computed(() => {
  return (content.value || '').length
})

/**
 * 编辑器样式
 */
const editorStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  lineHeight: lineHeight.value
}))

// ==================== 方法 ====================

/**
 * 处理返回按钮
 */
const handleBack = () => {
  if (content.value !== lastSavedContent) {
    ElMessageBox.confirm(
      '有未保存的内容，是否保存后退出？',
      '确认退出',
      {
        confirmButtonText: '保存并退出',
        cancelButtonText: '直接退出',
        type: 'warning',
        distinguishCancelAndClose: true
      }
    ).then(() => {
      saveContent().then(() => router.back())
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
  lastInputTime = Date.now()

  // 重置自动保存定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }

  if (autoSaveEnabled.value) {
    autoSaveTimer = setTimeout(() => {
      autoSave()
    }, 30000) // 30秒后自动保存
  }
}

/**
 * 处理键盘事件
 */
const handleKeydown = (e) => {
  // Ctrl+S 保存
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveContent()
  }
}

/**
 * 自动保存
 */
const autoSave = async () => {
  if (content.value === lastSavedContent) return

  try {
    await saveContent()
    showAutoSaveToast.value = true
    setTimeout(() => {
      showAutoSaveToast.value = false
    }, 2000)
  } catch (error) {
    console.error('自动保存失败:', error)
  }
}

/**
 * 保存内容
 */
const saveContent = async () => {
  if (!currentChapter.value) {
    ElMessage.warning('请先选择章节')
    return
  }

  isSaving.value = true
  saveStatus.value = '保存中...'

  try {
    await database.updateChapter(currentChapter.value.id, {
      content: content.value,
      wordCount: wordCount.value
    })

    lastSavedContent = content.value
    saveStatus.value = '已保存'

    // 记录写作会话
    await database.statistics.recordWritingSession(
      currentProject.value.id,
      wordCount.value,
      writingTime.value
    )

    setTimeout(() => {
      saveStatus.value = '保存'
    }, 2000)
  } catch (error) {
    console.error('保存失败:', error)
    saveStatus.value = '保存失败'
    ElMessage.error('保存失败')
  } finally {
    isSaving.value = false
  }
}

/**
 * 切换专注模式
 */
const toggleFocusMode = () => {
  isFocusMode.value = !isFocusMode.value

  if (isFocusMode.value) {
    // 进入专注模式，请求屏幕常亮
    if (keepScreenOn.value && 'wakeLock' in navigator) {
      requestWakeLock()
    }
  } else {
    // 退出专注模式
    releaseWakeLock()
  }
}

/**
 * 请求屏幕常亮
 */
let wakeLock = null
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen')
  } catch (error) {
    console.error('请求屏幕常亮失败:', error)
  }
}

/**
 * 释放屏幕常亮
 */
const releaseWakeLock = () => {
  if (wakeLock) {
    wakeLock.release()
    wakeLock = null
  }
}

/**
 * 格式化时间显示
 */
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 选择章节
 */
const selectChapter = async (chapter) => {
  // 保存当前章节
  if (currentChapter.value && content.value !== lastSavedContent) {
    await saveContent()
  }

  currentChapter.value = chapter
  content.value = chapter.content || ''
  lastSavedContent = content.value
  showChapters.value = false

  // 更新标题
  editingTitle.value = chapter.title
}

/**
 * 保存标题
 */
const saveTitle = async () => {
  if (!currentChapter.value || !editingTitle.value.trim()) {
    ElMessage.warning('请输入章节标题')
    return
  }

  try {
    await database.updateChapter(currentChapter.value.id, {
      title: editingTitle.value
    })
    currentChapter.value.title = editingTitle.value
    showTitleEdit.value = false
    ElMessage.success('标题已更新')
  } catch (error) {
    console.error('更新标题失败:', error)
    ElMessage.error('更新失败')
  }
}

/**
 * 创建新章节
 */
const createNewChapter = () => {
  showChapters.value = false
  newChapterTitle.value = ''
  showNewChapterDialog.value = true
}

/**
 * 确认创建章节
 */
const confirmCreateChapter = async () => {
  if (!newChapterTitle.value.trim()) {
    ElMessage.warning('请输入章节标题')
    return
  }

  creating.value = true
  try {
    let order = chapters.value.length + 1
    if (newChapterPosition.value === 'after' && currentChapter.value) {
      order = currentChapter.value.order + 1
      // 更新后续章节的顺序
      for (const chapter of chapters.value) {
        if (chapter.order >= order) {
          await database.updateChapter(chapter.id, {
            order: chapter.order + 1
          })
        }
      }
    }

    const chapterId = await database.createChapter({
      projectId: currentProject.value.id,
      title: newChapterTitle.value,
      content: '',
      order: order,
      status: 'draft'
    })

    // 重新加载章节列表
    await loadChapters()

    // 选中新章节
    const newChapter = chapters.value.find(c => c.id === chapterId)
    if (newChapter) {
      await selectChapter(newChapter)
    }

    showNewChapterDialog.value = false
    ElMessage.success('章节创建成功')
  } catch (error) {
    console.error('创建章节失败:', error)
    ElMessage.error('创建失败')
  } finally {
    creating.value = false
  }
}

/**
 * 插入模板
 */
const insertTemplate = () => {
  showTools.value = false
  // 这里可以展开模板选择
  ElMessage.info('模板功能开发中')
}

/**
 * AI续写
 */
const generateWithAI = () => {
  showTools.value = false
  // 这里可以调用AI服务
  ElMessage.info('AI续写功能开发中')
}

/**
 * 导出当前章节
 */
const exportCurrent = async () => {
  showTools.value = false
  if (!currentChapter.value) {
    ElMessage.warning('请先选择章节')
    return
  }

  try {
    const blob = new Blob([content.value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentChapter.value.title}.txt`
    link.click()
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// ==================== 手势支持 ====================

/**
 * 处理触摸开始
 */
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

/**
 * 处理触摸结束（左滑返回）
 */
const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY

  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value

  // 判断是否为左滑手势（从右向左滑动超过100px）
  if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -100) {
    // 在编辑器边缘左滑才触发返回
    if (touchStartX.value < 50) {
      handleBack()
    }
  }
}

// ==================== 数据加载 ====================

/**
 * 加载项目信息
 */
const loadProject = async (projectId) => {
  try {
    currentProject.value = await database.getProject(projectId)
  } catch (error) {
    console.error('加载项目失败:', error)
    ElMessage.error('加载项目失败')
  }
}

/**
 * 加载章节列表
 */
const loadChapters = async () => {
  if (!currentProject.value) return

  try {
    chapters.value = await database.getChapters(currentProject.value.id)
  } catch (error) {
    console.error('加载章节失败:', error)
  }
}

/**
 * 加载章节内容
 */
const loadChapter = async (chapterId) => {
  try {
    const chapter = await database.getChapter(chapterId)
    if (chapter) {
      currentChapter.value = chapter
      content.value = chapter.content || ''
      lastSavedContent = content.value
      editingTitle.value = chapter.title
    }
  } catch (error) {
    console.error('加载章节失败:', error)
  }
}

// ==================== 生命周期 ====================

onMounted(async () => {
  const { projectId, chapterId } = route.query

  if (projectId) {
    await loadProject(parseInt(projectId))
    await loadChapters()

    if (chapterId) {
      await loadChapter(parseInt(chapterId))
    } else if (chapters.value.length > 0) {
      await selectChapter(chapters.value[0])
    }
  }

  // 启动写作计时器
  writingTimer = setInterval(() => {
    // 如果30秒内没有输入，不计时
    if (Date.now() - lastInputTime < 30000) {
      writingTime.value++
    }
  }, 1000)

  // 添加手势监听
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  // 清理定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  if (writingTimer) {
    clearInterval(writingTimer)
  }

  // 释放屏幕常亮
  releaseWakeLock()

  // 移除手势监听
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})

// 监听设置变化并保存到本地存储
watch([fontSize, lineHeight, autoSaveEnabled, typingSoundEnabled, keepScreenOn], () => {
  localStorage.setItem('writer_settings', JSON.stringify({
    fontSize: fontSize.value,
    lineHeight: lineHeight.value,
    autoSaveEnabled: autoSaveEnabled.value,
    typingSoundEnabled: typingSoundEnabled.value,
    keepScreenOn: keepScreenOn.value
  }))
})

// 加载设置
onMounted(() => {
  const savedSettings = localStorage.getItem('writer_settings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      fontSize.value = settings.fontSize || 18
      lineHeight.value = settings.lineHeight || 1.8
      autoSaveEnabled.value = settings.autoSaveEnabled !== false
      typingSoundEnabled.value = settings.typingSoundEnabled || false
      keepScreenOn.value = settings.keepScreenOn !== false
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
})
</script>

<style scoped>
.mobile-writer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafafa;
}

.mobile-writer.focus-mode {
  background: #ffffff;
}

/* 顶部标题栏 */
.writer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.title-section {
  flex: 1;
  min-width: 0;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.title-section:active {
  background: #f5f7fa;
}

.chapter-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #303133;
}

.project-name {
  font-size: 12px;
  color: #909399;
  margin: 2px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 专注模式退出按钮 */
.focus-exit {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  color: #606266;
}

/* 编辑器容器 */
.editor-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.writer-editor {
  width: 100%;
  height: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-size: v-bind('fontSize + "px"');
  line-height: v-bind('lineHeight');
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: transparent;
  color: #303133;
}

.writer-editor::placeholder {
  color: #c0c4cc;
}

/* 自动保存提示 */
.autosave-toast {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* 底部工具栏 */
.writer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.word-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.char-count {
  font-size: 12px;
  color: #909399;
}

.footer-center,
.footer-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 专注模式底部 */
.focus-footer {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 24px;
  color: #909399;
  font-size: 13px;
  z-index: 10;
}

/* 章节列表 */
.chapters-list {
  padding: 8px 0;
}

.chapter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background 0.2s;
}

.chapter-item:active {
  background: #f5f7fa;
}

.chapter-item.active {
  background: #f0f7ff;
  color: #409eff;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chapter-order {
  font-size: 12px;
  color: #909399;
}

.chapter-name {
  font-size: 14px;
  color: #303133;
}

.chapter-item.active .chapter-name {
  color: #409eff;
  font-weight: 500;
}

/* 工具面板 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.tool-item:active {
  background: #f5f7fa;
}

.tool-item .el-icon {
  font-size: 24px;
  color: #667eea;
}

.tool-item span {
  font-size: 12px;
  color: #606266;
}

/* 设置面板 */
.settings-list {
  padding: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f2f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 14px;
  color: #303133;
  min-width: 80px;
}

.setting-item .el-slider {
  flex: 1;
}

.setting-value {
  font-size: 13px;
  color: #909399;
  min-width: 50px;
  text-align: right;
}

/* 对话框样式 */
:deep(.mobile-dialog) {
  border-radius: 16px;
}

/* 安全区域 */
.safe-area-bottom {
  height: env(safe-area-inset-bottom, 0);
  flex-shrink: 0;
}

/* 抽屉样式 */
:deep(.chapters-drawer .el-drawer__body) {
  padding: 0;
}

:deep(.tools-drawer .el-drawer__body) {
  padding: 0;
}

:deep(.settings-drawer .el-drawer__body) {
  padding: 0;
}
</style>

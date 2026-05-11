<template>
  <div class="mobile-writer">
    <!-- 顶部工具栏 -->
    <header class="writer-header safe-area-top">
      <button class="back-btn touch-target" @click="goBack">
        <span>←</span>
      </button>
      <h1 class="writer-title">{{ novelTitle || '新建章节' }}</h1>
      <button class="save-btn touch-target" @click="saveChapter" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </header>
    
    <!-- 章节信息 -->
    <div class="chapter-info">
      <input 
        v-model="chapterTitle"
        type="text"
        class="chapter-title-input input-mobile"
        placeholder="章节标题"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
      />
      <div class="word-count">
        <span>{{ wordCount }} 字</span>
        <span v-if="dailyGoal" class="goal-progress">
          | 今日 {{ dailyWordCount }}/{{ dailyGoal }}
        </span>
      </div>
    </div>
    
    <!-- 写作区域 -->
    <div class="editor-container" :style="editorStyle">
      <textarea
        ref="editorRef"
        v-model="content"
        class="editor textarea-mobile"
        placeholder="开始写作..."
        @input="handleInput"
        @focus="handleEditorFocus"
        @blur="handleEditorBlur"
      ></textarea>
    </div>
    
    <!-- 底部工具栏 -->
    <footer class="writer-footer safe-area-bottom" :class="{ 'keyboard-visible': keyboardVisible }">
      <div class="toolbar">
        <button class="tool-btn touch-target" @click="insertFormat('bold')" title="加粗">
          <strong>B</strong>
        </button>
        <button class="tool-btn touch-target" @click="insertFormat('italic')" title="斜体">
          <em>I</em>
        </button>
        <button class="tool-btn touch-target" @click="insertFormat('quote')" title="引用">
          "
        </button>
        <button class="tool-btn touch-target" @click="insertFormat('dialog')" title="对话">
          💬
        </button>
        <button class="tool-btn touch-target" @click="showChapterList = true" title="章节">
          📑
        </button>
        <button class="tool-btn touch-target" @click="showAIAssistant = true" title="AI助手">
          🤖
        </button>
      </div>
      
      <!-- 快捷操作 -->
      <div class="quick-actions" v-if="!keyboardVisible">
        <button class="action-btn" @click="quickSave">
          快速保存
        </button>
        <button class="action-btn" @click="exportChapter">
          导出
        </button>
      </div>
    </footer>
    
    <!-- 章节列表抽屉 -->
    <el-drawer
      v-model="showChapterList"
      direction="rtl"
      size="80%"
      :show-close="false"
      class="chapter-drawer-comp"
    >
      <template #header>
        <h3 style="margin:0;font-size:18px;">章节列表</h3>
      </template>
      <div class="chapter-list">
        <div
          v-for="(chapter, index) in chapters"
          :key="chapter.id"
          class="chapter-item list-item-mobile"
          :class="{ active: currentChapterId === chapter.id }"
          @click="selectChapter(chapter)"
        >
          <span class="chapter-number">第{{ index + 1 }}章</span>
          <span class="chapter-name">{{ chapter.title }}</span>
          <span class="chapter-words">{{ chapter.wordCount || 0 }}字</span>
        </div>
      </div>
      <div style="padding:16px;">
        <el-button type="primary" style="width:100%;" @click="addNewChapter">+ 新建章节</el-button>
      </div>
    </el-drawer>
    
    <!-- AI助手面板 -->
    <el-drawer
      v-model="showAIAssistant"
      direction="btt"
      size="60%"
      :show-close="false"
      class="ai-drawer-comp"
    >
      <template #header>
        <h3 style="margin:0;font-size:18px;">AI 写作助手</h3>
      </template>
      <div class="ai-options">
        <button class="ai-option-btn" @click="aiGenerate('continue')">
          <span class="ai-icon">✨</span>
          <span>续写</span>
        </button>
        <button class="ai-option-btn" @click="aiGenerate('expand')">
          <span class="ai-icon">📝</span>
          <span>扩写</span>
        </button>
        <button class="ai-option-btn" @click="aiGenerate('polish')">
          <span class="ai-icon">✏️</span>
          <span>润色</span>
        </button>
        <button class="ai-option-btn" @click="aiGenerate('dialog')">
          <span class="ai-icon">💬</span>
          <span>生成对话</span>
        </button>
        <button class="ai-option-btn" @click="aiGenerate('describe')">
          <span class="ai-icon">🎨</span>
          <span>场景描写</span>
        </button>
        <button class="ai-option-btn" @click="aiGenerate('character')">
          <span class="ai-icon">👤</span>
          <span>人物刻画</span>
        </button>
      </div>
      <div class="ai-result" v-if="aiResult">
        <div class="result-content">{{ aiResult }}</div>
        <div class="result-actions">
          <button class="action-btn" @click="applyAIResult">应用</button>
          <button class="action-btn" @click="regenerateAI">重新生成</button>
        </div>
      </div>
    </el-drawer>
    
    <!-- 自动保存提示 -->
    <transition name="fade">
      <div v-if="autoSaveStatus" class="auto-save-toast">
        {{ autoSaveStatus }}
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * 移动端写作页面
 * 
 * 功能：
 * - 全屏写作体验
 * - 章节管理
 * - AI辅助写作
 * - 自动保存
 * - 字数统计
 * - 格式化工具
 */

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNovelStore } from '../../stores/novel.js'
import { mobileAPI } from '../../utils/mobileAPI.js'
import { termuxAPI } from '../../utils/termuxAPI.js'

// ==================== 路由和状态 ====================
const route = useRoute()
const router = useRouter()
const novelStore = useNovelStore()

// ==================== 响应式数据 ====================
const editorRef = ref(null)
const content = ref('')
const chapterTitle = ref('')
const novelTitle = ref('')
const currentChapterId = ref(null)
const chapters = ref([])
const saving = ref(false)
const showChapterList = ref(false)
const showAIAssistant = ref(false)
const aiResult = ref('')
const keyboardVisible = ref(false)
const autoSaveStatus = ref('')
const dailyWordCount = ref(0)
const dailyGoal = ref(2000)

// 自动保存定时器
let autoSaveTimer = null

// ==================== 计算属性 ====================

/**
 * 字数统计
 */
const wordCount = computed(() => {
  return content.value.replace(/\s/g, '').length
})

/**
 * 编辑器样式
 */
const editorStyle = computed(() => {
  const style = {}
  
  if (keyboardVisible.value) {
    style.paddingBottom = '60px'
  }
  
  return style
})

// ==================== 方法 ====================

/**
 * 返回上一页
 */
function goBack() {
  // 检查是否有未保存的内容
  if (content.value) {
    saveChapter()
  }
  router.back()
}

/**
 * 保存章节
 */
async function saveChapter() {
  if (saving.value || !content.value) return
  
  saving.value = true
  
  try {
    const chapterData = {
      id: currentChapterId.value || Date.now().toString(),
      title: chapterTitle.value || `第${chapters.value.length + 1}章`,
      content: content.value,
      wordCount: wordCount.value,
      updatedAt: new Date().toISOString(),
    }
    
    await novelStore.saveChapter(route.params.novelId, chapterData)
    
    // 更新章节列表
    if (!currentChapterId.value) {
      chapters.value.push(chapterData)
      currentChapterId.value = chapterData.id
    } else {
      const index = chapters.value.findIndex(c => c.id === currentChapterId.value)
      if (index !== -1) {
        chapters.value[index] = chapterData
      }
    }
    
    // Termux 环境自动保存到文件
    if (termuxAPI.isTermux) {
      await termuxAPI.files.saveNovel(novelTitle.value, content.value)
    }
    
    showAutoSaveStatus('已保存')
  } catch (error) {
    console.error('保存失败:', error)
    showAutoSaveStatus('保存失败')
  } finally {
    saving.value = false
  }
}

/**
 * 快速保存
 */
async function quickSave() {
  await saveChapter()
  
  // 震动反馈
  if (mobileAPI.isNative) {
    mobileAPI.biometric.vibrate?.(50)
  }
}

/**
 * 导出章节
 */
async function exportChapter() {
  if (!content.value) return
  
  try {
    if (termuxAPI.isTermux) {
      const path = await termuxAPI.files.saveNovel(
        chapterTitle.value || '未命名章节',
        content.value
      )
      showAutoSaveStatus(`已导出到: ${path}`)
    } else if (mobileAPI.isNative) {
      await mobileAPI.share.shareContent({
        title: chapterTitle.value,
        text: content.value,
      })
    } else {
      // Web 环境下载
      const blob = new Blob([content.value], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${chapterTitle.value || '章节'}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}

/**
 * 选择章节
 */
function selectChapter(chapter) {
  currentChapterId.value = chapter.id
  chapterTitle.value = chapter.title
  content.value = chapter.content || ''
  showChapterList.value = false
  
  nextTick(() => {
    editorRef.value?.focus()
  })
}

/**
 * 新建章节
 */
function addNewChapter() {
  currentChapterId.value = null
  chapterTitle.value = ''
  content.value = ''
  showChapterList.value = false
  
  nextTick(() => {
    editorRef.value?.focus()
  })
}

/**
 * 插入格式
 */
function insertFormat(type) {
  const editor = editorRef.value
  if (!editor) return
  
  const start = editor.selectionStart
  const end = editor.selectionEnd
  const selectedText = content.value.substring(start, end)
  
  let insertText = ''
  
  switch (type) {
    case 'bold':
      insertText = `**${selectedText || '粗体文本'}**`
      break
    case 'italic':
      insertText = `*${selectedText || '斜体文本'}*`
      break
    case 'quote':
      insertText = `\n> ${selectedText || '引用内容'}\n`
      break
    case 'dialog':
      insertText = `"${selectedText || '对话内容'}"`
      break
  }
  
  content.value = 
    content.value.substring(0, start) + 
    insertText + 
    content.value.substring(end)
  
  // 移动光标
  nextTick(() => {
    editor.focus()
    const newPos = start + insertText.length
    editor.setSelectionRange(newPos, newPos)
  })
}

/**
 * AI生成
 */
async function aiGenerate(type) {
  // 这里应该调用实际的AI API
  // 目前显示模拟结果
  const prompts = {
    continue: '正在续写...',
    expand: '正在扩写...',
    polish: '正在润色...',
    dialog: '正在生成对话...',
    describe: '正在生成场景描写...',
    character: '正在生成人物刻画...',
  }
  
  aiResult.value = prompts[type] || 'AI生成中...'
  
  // 模拟AI响应
  setTimeout(() => {
    const results = {
      continue: '阳光透过窗帘洒落在书桌上，她轻轻翻过一页，目光在字里行间流连。',
      expand: '街道上人来人往，每个人都在为自己的生活奔波。小贩的叫卖声、汽车的鸣笛声、行人的脚步声，交织成一首城市的交响曲。',
      polish: '月光如水，静静地流淌在这片古老的土地上。',
      dialog: '"你真的决定要走了吗？"她轻声问道，声音里带着一丝不易察觉的颤抖。\n\n"是的，"他沉默了片刻，"有些事情，我必须去面对。"',
      describe: '远处的山峦在夕阳的映照下呈现出金红色的光芒，近处的溪水潺潺流淌，清澈见底，偶尔有几尾小鱼游过，激起一圈圈涟漪。',
      character: '他身材高大，眉宇间透着一股英气。那双深邃的眼睛仿佛能看透一切，却又带着一丝难以捉摸的神秘。',
    }
    
    aiResult.value = results[type] || 'AI生成完成'
  }, 1500)
}

/**
 * 应用AI结果
 */
function applyAIResult() {
  if (!aiResult.value) return
  
  content.value += '\n\n' + aiResult.value
  aiResult.value = ''
  showAIAssistant.value = false
}

/**
 * 重新生成AI结果
 */
function regenerateAI() {
  aiResult.value = ''
  // 重新调用AI生成
}

/**
 * 显示自动保存状态
 */
function showAutoSaveStatus(status) {
  autoSaveStatus.value = status
  setTimeout(() => {
    autoSaveStatus.value = ''
  }, 2000)
}

/**
 * 处理输入
 */
function handleInput() {
  // 触发自动保存
  clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => {
    saveChapter()
  }, 3000)
}

/**
 * 处理编辑器聚焦
 */
function handleEditorFocus() {
  keyboardVisible.value = true
}

/**
 * 处理编辑器失焦
 */
function handleEditorBlur() {
  setTimeout(() => {
    keyboardVisible.value = false
  }, 100)
}

/**
 * 处理输入框聚焦
 */
function handleInputFocus() {
  keyboardVisible.value = true
}

/**
 * 处理输入框失焦
 */
function handleInputBlur() {
  setTimeout(() => {
    keyboardVisible.value = false
  }, 100)
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 加载小说数据
  if (route.params.novelId) {
    const novel = await novelStore.getNovel(route.params.novelId)
    if (novel) {
      novelTitle.value = novel.title
      chapters.value = novel.chapters || []
      
      // 加载指定章节
      if (route.params.chapterId) {
        const chapter = chapters.value.find(c => c.id === route.params.chapterId)
        if (chapter) {
          selectChapter(chapter)
        }
      }
    }
  }
  
  // 监听键盘事件
  if (mobileAPI.isNative) {
    mobileAPI.keyboard.onShow((height) => {
      keyboardVisible.value = true
    })
    mobileAPI.keyboard.onHide(() => {
      keyboardVisible.value = false
    })
  }
})

onUnmounted(() => {
  clearTimeout(autoSaveTimer)
})
</script>

<style scoped>
.mobile-writer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}

/* 顶部工具栏 */
.writer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  background: #fff;
  border-bottom: 1px solid #ebedf0;
  flex-shrink: 0;
}

.back-btn,
.save-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #667eea;
  padding: 8px;
}

.save-btn:disabled {
  color: #ccc;
}

.writer-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 章节信息 */
.chapter-info {
  padding: 12px 16px;
  background: #f9f9f9;
  border-bottom: 1px solid #ebedf0;
}

.chapter-title-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.chapter-title-input:focus {
  outline: none;
}

.word-count {
  font-size: 13px;
  color: #999;
}

.goal-progress {
  color: #667eea;
}

/* 编辑器 */
.editor-container {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}

.editor {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  font-size: 17px;
  line-height: 1.8;
  color: #333;
}

.editor:focus {
  outline: none;
}

/* 底部工具栏 */
.writer-footer {
  background: #fff;
  border-top: 1px solid #ebedf0;
  transition: transform 0.3s ease;
}

.toolbar {
  display: flex;
  justify-content: space-around;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.tool-btn {
  background: none;
  border: none;
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 8px;
}

.tool-btn:active {
  background: #f5f5f5;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px;
}

.action-btn {
  padding: 8px 24px;
  border: 1px solid #667eea;
  border-radius: 20px;
  background: #fff;
  color: #667eea;
  font-size: 14px;
}

.action-btn:active {
  background: #f5f5ff;
}

/* 章节抽屉 */
.chapter-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
}

.chapter-list {
  flex: 1;
  overflow-y: auto;
}

.chapter-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.chapter-item.active {
  background: #f5f5ff;
}

.chapter-number {
  color: #667eea;
  font-size: 13px;
  margin-right: 8px;
}

.chapter-name {
  flex: 1;
  font-size: 15px;
}

.chapter-words {
  font-size: 12px;
  color: #999;
}

.add-chapter-btn {
  margin: 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
}

/* AI助手面板 */
.ai-assistant-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
}

.ai-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.ai-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background: #f9f9f9;
  border: none;
  border-radius: 12px;
  font-size: 13px;
}

.ai-option-btn:active {
  background: #f0f0f0;
}

.ai-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.ai-result {
  flex: 1;
  padding: 16px;
  border-top: 1px solid #ebedf0;
}

.result-content {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.8;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

/* 自动保存提示 */
.auto-save-toast {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  z-index: 1000;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .mobile-writer {
    background: #1a1a1a;
  }
  
  .writer-header {
    background: #1a1a1a;
    border-bottom-color: #404040;
  }
  
  .chapter-info {
    background: #2d2d2d;
    border-bottom-color: #404040;
  }
  
  .editor {
    color: #e0e0e0;
  }
  
  .writer-footer {
    background: #1a1a1a;
    border-top-color: #404040;
  }
  
  .tool-btn:active {
    background: #3d3d3d;
  }
}
</style>

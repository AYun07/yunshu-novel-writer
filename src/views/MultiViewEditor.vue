<!--
  MultiViewEditor.vue - 四视图窗口编辑器
  对标 Skribisto 的多视图功能
  
  功能特性：
  - 4个可调整大小的视图区域
  - 每个视图可加载不同章节/文档
  - 视图标签页（每个视图支持多标签）
  - 视图布局预设（2列/2行/4宫格/主从）
  - 视图同步滚动（可选）
  - 视图间拖拽内容
  - 视图独立历史记录
  - 全屏单个视图
-->
<template>
  <div class="multi-view-editor">
    <!-- 顶部工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <el-dropdown @command="handleLayoutChange" trigger="click">
          <el-button type="primary" size="small">
            <el-icon><Grid /></el-icon>
            布局: {{ currentLayoutName }}
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="horizontal" :class="{ 'is-active': layout === 'horizontal' }">
                <el-icon><Tickets /></el-icon> 左右分栏
              </el-dropdown-item>
              <el-dropdown-item command="vertical" :class="{ 'is-active': layout === 'vertical' }">
                <el-icon><More /></el-icon> 上下分栏
              </el-dropdown-item>
              <el-dropdown-item command="grid" :class="{ 'is-active': layout === 'grid' }">
                <el-icon><Grid /></el-icon> 四宫格
              </el-dropdown-item>
              <el-dropdown-item command="main" :class="{ 'is-active': layout === 'main' }">
                <el-icon><FullScreen /></el-icon> 主从布局
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-checkbox v-model="syncScroll" size="small">
          <el-icon><Connection /></el-icon> 同步滚动
        </el-checkbox>

        <el-button size="small" @click="handleSaveAll">
          <el-icon><DocumentChecked /></el-icon> 保存全部
        </el-button>
      </div>

      <div class="toolbar-right">
        <el-button size="small" @click="handleOpenChapterDialog">
          <el-icon><FolderOpened /></el-icon> 打开章节
        </el-button>
        <el-button size="small" @click="handleCompareView" :disabled="activeViews.length < 2">
          <el-icon><Switch /></el-icon> 对比视图
        </el-button>
      </div>
    </div>

    <!-- 编辑器区域 -->
    <div class="editor-container" :class="`layout-${layout}`">
      <!-- 视图1 -->
      <div
        v-for="(view, index) in visibleViews"
        :key="view.id"
        class="view-pane"
        :class="{ 'fullscreen': fullscreenView === view.id }"
        :style="getPaneStyle(index)"
      >
        <!-- 视图头部 -->
        <div class="view-header">
          <!-- 标签页 -->
          <div class="view-tabs">
            <div
              v-for="tab in view.tabs"
              :key="tab.id"
              class="view-tab"
              :class="{ 'active': view.activeTabId === tab.id }"
              @click="switchTab(view.id, tab.id)"
            >
              <span class="tab-title">{{ tab.title }}</span>
              <el-icon
                class="tab-close"
                @click.stop="closeTab(view.id, tab.id)"
              >
                <Close />
              </el-icon>
            </div>
            <el-button
              type="text"
              size="small"
              class="add-tab-btn"
              @click="openChapterInNewTab(view.id)"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>

          <!-- 视图操作 -->
          <div class="view-actions">
            <el-button
              type="text"
              size="small"
              @click="toggleFullscreen(view.id)"
            >
              <el-icon><FullScreen v-if="fullscreenView !== view.id" /><Close v-else /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 编辑器内容 -->
        <div class="view-content" ref="editorRefs" :data-view-id="view.id">
          <template v-if="view.activeTabId">
            <div
              v-for="tab in view.tabs"
              :key="tab.id"
              v-show="view.activeTabId === tab.id"
              class="editor-wrapper"
            >
              <!-- 工具栏 -->
              <div class="editor-mini-toolbar">
                <el-button-group size="small">
                  <el-button @click="formatText(view.id, 'bold')">
                    <strong>B</strong>
                  </el-button>
                  <el-button @click="formatText(view.id, 'italic')">
                    <em>I</em>
                  </el-button>
                  <el-button @click="formatText(view.id, 'underline')">
                    <u>U</u>
                  </el-button>
                </el-button-group>

                <el-button-group size="small">
                  <el-button @click="formatText(view.id, 'h1')">H1</el-button>
                  <el-button @click="formatText(view.id, 'h2')">H2</el-button>
                  <el-button @click="formatText(view.id, 'h3')">H3</el-button>
                </el-button-group>

                <div class="editor-stats">
                  <span>{{ getTabWordCount(tab) }} 字</span>
                  <span>|</span>
                  <span>{{ getTabReadingTime(tab) }} 分钟</span>
                </div>
              </div>

              <!-- 文本编辑区 -->
              <textarea
                v-model="tab.content"
                class="editor-textarea"
                placeholder="开始写作..."
                @scroll="handleEditorScroll($event, view.id)"
                @input="handleEditorInput($event, view.id, tab.id)"
              />
            </div>
          </template>

          <!-- 空状态 -->
          <div v-if="!view.activeTabId" class="view-empty">
            <el-icon :size="48"><Document /></el-icon>
            <p>打开一个章节开始编辑</p>
            <el-button type="primary" @click="openChapterInNewTab(view.id)">
              <el-icon><FolderOpened /></el-icon> 打开章节
            </el-button>
          </div>
        </div>

        <!-- 视图底部状态栏 -->
        <div class="view-footer" v-if="view.activeTabId">
          <span class="status-item">
            <el-icon><Document /></el-icon>
            {{ getActiveTab(view)?.title || '未命名' }}
          </span>
          <span class="status-item">
            <el-icon><Clock /></el-icon>
            {{ getActiveTab(view)?.lastModified || '未修改' }}
          </span>
          <div class="status-right">
            <el-button type="text" size="small" @click="undoIn(view.id)" :disabled="!canUndo(view.id)">
              <el-icon><RefreshLeft /></el-icon>
            </el-button>
            <el-button type="text" size="small" @click="redoIn(view.id)" :disabled="!canRedo(view.id)">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分割线（可拖拽调整大小） -->
      <template v-if="layout === 'horizontal' || layout === 'vertical'">
        <div
          class="resize-handle"
          :class="layout === 'horizontal' ? 'resize-vertical' : 'resize-horizontal'"
          @mousedown="startResize"
        />
      </template>
    </div>

    <!-- 打开章节对话框 -->
    <el-dialog v-model="showChapterDialog" title="选择要打开的章节" width="600px">
      <div class="chapter-list">
        <el-input
          v-model="chapterSearchQuery"
          placeholder="搜索章节..."
          clearable
          style="margin-bottom: 12px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-tree
          :data="chapterTreeData"
          :props="{ label: 'title', children: 'children' }"
          node-key="id"
          :expand-on-click-node="false"
          :filter-node-method="filterChapterNode"
          ref="chapterTreeRef"
          @node-click="handleChapterSelect"
        >
          <template #default="{ node, data }">
            <span class="chapter-node">
              <span class="chapter-title">{{ data.title }}</span>
              <span class="chapter-meta" v-if="!data.children">
                <el-tag size="small" type="info">{{ data.wordCount || 0 }} 字</el-tag>
              </span>
            </span>
          </template>
        </el-tree>
      </div>

      <template #footer>
        <el-button @click="showChapterDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmOpenChapter" :disabled="!selectedChapterId">
          打开
        </el-button>
      </template>
    </el-dialog>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="context-menu-item" @click="handleContextAction('copy')">
        <el-icon><CopyDocument /></el-icon> 复制
      </div>
      <div class="context-menu-item" @click="handleContextAction('cut')">
        <el-icon><EditPen /></el-icon> 剪切
      </div>
      <div class="context-menu-item" @click="handleContextAction('paste')">
        <el-icon><DocumentCopy /></el-icon> 粘贴
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" @click="handleContextAction('selectAll')">
        <el-icon><Select /></el-icon> 全选
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * MultiViewEditor.vue - 四视图窗口编辑器
 * 
 * 功能说明：
 * 1. 多视图布局 - 支持2列/2行/4宫格/主从四种布局
 * 2. 标签页系统 - 每个视图支持多标签切换
 * 3. 同步滚动 - 多视图同步滚动功能
 * 4. 独立历史 - 每个视图独立的撤销/重做
 * 5. 全屏模式 - 单个视图全屏编辑
 * 6. 格式工具 - 基础文本格式化
 */
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Grid, ArrowDown, Tickets, More, FullScreen, Connection,
  DocumentChecked, FolderOpened, Switch, Plus, Close, Document,
  Clock, RefreshLeft, RefreshRight, Search, CopyDocument,
  EditPen, DocumentCopy, Select
} from '@element-plus/icons-vue'

// ==================== 布局配置 ====================
const layouts = {
  horizontal: { name: '左右分栏', panes: 2 },
  vertical: { name: '上下分栏', panes: 2 },
  grid: { name: '四宫格', panes: 4 },
  main: { name: '主从布局', panes: 2 }
}

// ==================== 响应式数据 ====================

// 当前布局
const layout = ref('horizontal')

// 视图数据
const views = ref([
  { id: 'view-1', tabs: [], activeTabId: null, history: { undo: [], redo: [] } },
  { id: 'view-2', tabs: [], activeTabId: null, history: { undo: [], redo: [] } },
  { id: 'view-3', tabs: [], activeTabId: null, history: { undo: [], redo: [] } },
  { id: 'view-4', tabs: [], activeTabId: null, history: { undo: [], redo: [] } }
])

// 当前操作的视图ID（用于打开章节）
const currentViewId = ref('view-1')

// 全屏视图
const fullscreenView = ref(null)

// 同步滚动
const syncScroll = ref(false)

// 分割比例
const splitRatio = ref(50)

// 章节对话框
const showChapterDialog = ref(false)
const chapterSearchQuery = ref('')
const selectedChapterId = ref(null)
const chapterTreeRef = ref(null)

// 右键菜单
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  viewId: null
})

// 编辑器引用
const editorRefs = ref([])

// 章节数据（示例）
const chapters = ref([
  { id: 'ch1', title: '第一章 命运的起点', content: '这是第一章的内容...\n\n主角站在窗前，望着远方的山峦，心中充满了对未来的期待。', wordCount: 3200, volumeId: 'vol1' },
  { id: 'ch2', title: '第二章 暗流涌动', content: '这是第二章的内容...\n\n城市的霓虹灯下，一场阴谋正在悄然酝酿。', wordCount: 2800, volumeId: 'vol1' },
  { id: 'ch3', title: '第三章 意外相遇', content: '这是第三章的内容...\n\n命运的齿轮开始转动，两个原本毫不相干的人相遇了。', wordCount: 3500, volumeId: 'vol1' },
  { id: 'ch4', title: '第四章 真相浮现', content: '这是第四章的内容...\n\n随着调查的深入，真相逐渐浮出水面。', wordCount: 3100, volumeId: 'vol2' },
  { id: 'ch5', title: '第五章 最终对决', content: '这是第五章的内容...\n\n所有的伏笔在此收束，主角与反派展开最终对决。', wordCount: 4000, volumeId: 'vol3' }
])

// 卷数据
const volumes = ref([
  { id: 'vol1', name: '第一卷：起源' },
  { id: 'vol2', name: '第二卷：成长' },
  { id: 'vol3', name: '第三卷：高潮' }
])

// ==================== 计算属性 ====================

/**
 * 当前布局名称
 */
const currentLayoutName = computed(() => layouts[layout.value]?.name || '左右分栏')

/**
 * 可见视图列表
 */
const visibleViews = computed(() => {
  const paneCount = layouts[layout.value]?.panes || 2
  return views.value.slice(0, paneCount)
})

/**
 * 活跃视图列表
 */
const activeViews = computed(() => {
  return visibleViews.value.filter(v => v.tabs.length > 0)
})

/**
 * 章节树形数据
 */
const chapterTreeData = computed(() => {
  return volumes.value.map(vol => ({
    id: vol.id,
    title: vol.name,
    children: chapters.value
      .filter(ch => ch.volumeId === vol.id)
      .map(ch => ({
        id: ch.id,
        title: ch.title,
        content: ch.content,
        wordCount: ch.wordCount
      }))
  }))
})

// ==================== 方法 ====================

/**
 * 获取面板样式
 */
function getPaneStyle(index) {
  if (fullscreenView.value) {
    return {}
  }

  if (layout.value === 'horizontal') {
    return {
      width: index === 0 ? `${splitRatio.value}%` : `${100 - splitRatio.value}%`
    }
  } else if (layout.value === 'vertical') {
    return {
      height: index === 0 ? `${splitRatio.value}%` : `${100 - splitRatio.value}%`
    }
  } else if (layout.value === 'main') {
    return {
      flex: index === 0 ? '1' : '0 0 300px'
    }
  }

  return {}
}

/**
 * 切换布局
 */
function handleLayoutChange(newLayout) {
  layout.value = newLayout
  fullscreenView.value = null
  ElMessage.success(`已切换到${layouts[newLayout].name}`)
}

/**
 * 切换标签页
 */
function switchTab(viewId, tabId) {
  const view = views.value.find(v => v.id === viewId)
  if (view) {
    view.activeTabId = tabId
  }
}

/**
 * 关闭标签页
 */
function closeTab(viewId, tabId) {
  const view = views.value.find(v => v.id === viewId)
  if (!view) return

  const tabIndex = view.tabs.findIndex(t => t.id === tabId)
  view.tabs = view.tabs.filter(t => t.id !== tabId)

  // 如果关闭的是当前激活的标签，切换到其他标签
  if (view.activeTabId === tabId) {
    if (view.tabs.length > 0) {
      const newIndex = Math.min(tabIndex, view.tabs.length - 1)
      view.activeTabId = view.tabs[newIndex].id
    } else {
      view.activeTabId = null
    }
  }
}

/**
 * 打开章节对话框
 */
function handleOpenChapterDialog() {
  currentViewId.value = 'view-1'
  showChapterDialog.value = true
}

/**
 * 在新标签页打开章节
 */
function openChapterInNewTab(viewId) {
  currentViewId.value = viewId
  showChapterDialog.value = true
}

/**
 * 过滤章节节点
 */
function filterChapterNode(value, data) {
  if (!value) return true
  return data.title.toLowerCase().includes(value.toLowerCase())
}

/**
 * 选择章节
 */
function handleChapterSelect(data) {
  if (!data.children) {
    selectedChapterId.value = data.id
  }
}

/**
 * 确认打开章节
 */
function confirmOpenChapter() {
  if (!selectedChapterId.value) return

  const chapter = chapters.value.find(ch => ch.id === selectedChapterId.value)
  if (!chapter) return

  const view = views.value.find(v => v.id === currentViewId.value)
  if (!view) return

  // 检查是否已打开
  const existingTab = view.tabs.find(t => t.chapterId === chapter.id)
  if (existingTab) {
    view.activeTabId = existingTab.id
  } else {
    // 创建新标签
    const newTab = {
      id: `tab-${Date.now()}`,
      chapterId: chapter.id,
      title: chapter.title,
      content: chapter.content,
      wordCount: chapter.wordCount,
      lastModified: new Date().toLocaleTimeString(),
      isModified: false
    }
    view.tabs.push(newTab)
    view.activeTabId = newTab.id
  }

  showChapterDialog.value = false
  selectedChapterId.value = null
  ElMessage.success(`已打开: ${chapter.title}`)
}

/**
 * 获取当前激活的标签
 */
function getActiveTab(view) {
  if (!view.activeTabId) return null
  return view.tabs.find(t => t.id === view.activeTabId)
}

/**
 * 获取标签字数
 */
function getTabWordCount(tab) {
  if (!tab || !tab.content) return 0
  return tab.content.replace(/\s/g, '').length
}

/**
 * 获取标签阅读时间
 */
function getTabReadingTime(tab) {
  const wordCount = getTabWordCount(tab)
  return Math.ceil(wordCount / 300) // 假设每分钟阅读300字
}

/**
 * 处理编辑器滚动
 */
function handleEditorScroll(event, viewId) {
  if (!syncScroll.value) return

  const scrollTop = event.target.scrollTop
  const scrollRatio = scrollTop / event.target.scrollHeight

  // 同步其他视图的滚动
  visibleViews.value.forEach(view => {
    if (view.id !== viewId && view.activeTabId) {
      const textarea = document.querySelector(`[data-view-id="${view.id}"] .editor-textarea`)
      if (textarea) {
        textarea.scrollTop = scrollRatio * textarea.scrollHeight
      }
    }
  })
}

/**
 * 处理编辑器输入
 */
function handleEditorInput(event, viewId, tabId) {
  const view = views.value.find(v => v.id === viewId)
  if (!view) return

  const tab = view.tabs.find(t => t.id === tabId)
  if (tab) {
    tab.isModified = true
    tab.lastModified = new Date().toLocaleTimeString()
    tab.wordCount = tab.content.replace(/\s/g, '').length

    // 添加到历史记录
    view.history.undo.push({
      tabId,
      content: tab.content,
      timestamp: Date.now()
    })

    // 限制历史记录数量
    if (view.history.undo.length > 50) {
      view.history.undo.shift()
    }
  }
}

/**
 * 格式化文本
 */
function formatText(viewId, format) {
  const view = views.value.find(v => v.id === viewId)
  if (!view || !view.activeTabId) return

  const tab = view.tabs.find(t => t.id === view.activeTabId)
  if (!tab) return

  // 简单的格式化实现
  const textarea = document.querySelector(`[data-view-id="${viewId}"] .editor-textarea`)
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = tab.content.substring(start, end)

  let formattedText = selectedText
  switch (format) {
    case 'bold':
      formattedText = `**${selectedText}**`
      break
    case 'italic':
      formattedText = `*${selectedText}*`
      break
    case 'underline':
      formattedText = `__${selectedText}__`
      break
    case 'h1':
      formattedText = `# ${selectedText}`
      break
    case 'h2':
      formattedText = `## ${selectedText}`
      break
    case 'h3':
      formattedText = `### ${selectedText}`
      break
  }

  tab.content = tab.content.substring(0, start) + formattedText + tab.content.substring(end)
  tab.isModified = true

  // 恢复光标位置
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
  })
}

/**
 * 切换全屏
 */
function toggleFullscreen(viewId) {
  fullscreenView.value = fullscreenView.value === viewId ? null : viewId
}

/**
 * 撤销
 */
function undoIn(viewId) {
  const view = views.value.find(v => v.id === viewId)
  if (!view || view.history.undo.length === 0) return

  const lastState = view.history.undo.pop()
  const tab = view.tabs.find(t => t.id === lastState.tabId)
  if (tab) {
    view.history.redo.push({
      tabId: tab.id,
      content: tab.content,
      timestamp: Date.now()
    })
    tab.content = lastState.content
  }
}

/**
 * 重做
 */
function redoIn(viewId) {
  const view = views.value.find(v => v.id === viewId)
  if (!view || view.history.redo.length === 0) return

  const nextState = view.history.redo.pop()
  const tab = view.tabs.find(t => t.id === nextState.tabId)
  if (tab) {
    view.history.undo.push({
      tabId: tab.id,
      content: tab.content,
      timestamp: Date.now()
    })
    tab.content = nextState.content
  }
}

/**
 * 是否可以撤销
 */
function canUndo(viewId) {
  const view = views.value.find(v => v.id === viewId)
  return view && view.history.undo.length > 0
}

/**
 * 是否可以重做
 */
function canRedo(viewId) {
  const view = views.value.find(v => v.id === viewId)
  return view && view.history.redo.length > 0
}

/**
 * 保存全部
 */
function handleSaveAll() {
  let savedCount = 0

  visibleViews.value.forEach(view => {
    view.tabs.forEach(tab => {
      if (tab.isModified) {
        // 更新章节数据
        const chapter = chapters.value.find(ch => ch.id === tab.chapterId)
        if (chapter) {
          chapter.content = tab.content
          chapter.wordCount = tab.wordCount
        }
        tab.isModified = false
        savedCount++
      }
    })
  })

  if (savedCount > 0) {
    ElMessage.success(`已保存 ${savedCount} 个文档`)
  } else {
    ElMessage.info('没有需要保存的更改')
  }
}

/**
 * 对比视图
 */
function handleCompareView() {
  if (activeViews.value.length < 2) {
    ElMessage.warning('需要至少打开2个文档才能对比')
    return
  }
  // 切换到左右分栏布局
  layout.value = 'horizontal'
  ElMessage.success('已切换到对比视图')
}

/**
 * 开始调整大小
 */
function startResize(event) {
  const startX = event.clientX
  const startY = event.clientY
  const startRatio = splitRatio.value

  const handleMove = (e) => {
    if (layout.value === 'horizontal') {
      const delta = e.clientX - startX
      const containerWidth = window.innerWidth
      splitRatio.value = Math.max(20, Math.min(80, startRatio + (delta / containerWidth) * 100))
    } else if (layout.value === 'vertical') {
      const delta = e.clientY - startY
      const containerHeight = window.innerHeight - 60 // 减去工具栏高度
      splitRatio.value = Math.max(20, Math.min(80, startRatio + (delta / containerHeight) * 100))
    }
  }

  const handleUp = () => {
    try { if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    } } catch(e) {}
  }

  try { if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  } } catch(e) {}
}

/**
 * 处理右键菜单操作
 */
function handleContextAction(action) {
  const view = views.value.find(v => v.id === contextMenu.viewId)
  if (!view || !view.activeTabId) return

  const tab = view.tabs.find(t => t.id === view.activeTabId)
  if (!tab) return

  const textarea = document.querySelector(`[data-view-id="${contextMenu.viewId}"] .editor-textarea`)

  switch (action) {
    case 'copy':
      if (textarea) {
        navigator.clipboard.writeText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd))
      }
      break
    case 'cut':
      if (textarea) {
        navigator.clipboard.writeText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd))
        tab.content = tab.content.substring(0, textarea.selectionStart) + tab.content.substring(textarea.selectionEnd)
      }
      break
    case 'paste':
      navigator.clipboard.readText().then(text => {
        if (textarea) {
          tab.content = tab.content.substring(0, textarea.selectionStart) + text + tab.content.substring(textarea.selectionEnd)
        }
      })
      break
    case 'selectAll':
      if (textarea) {
        textarea.select()
      }
      break
  }

  contextMenu.visible = false
}

/**
 * 隐藏右键菜单
 */
function hideContextMenu() {
  contextMenu.visible = false
}

// ==================== 监听器 ====================

watch(chapterSearchQuery, (val) => {
  chapterTreeRef.value?.filter(val)
})

// ==================== 生命周期 ====================

onMounted(() => {
  // 监听右键菜单
  try { if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('click', hideContextMenu)
  } } catch(e) {}

  // 默认打开一个章节
  const view = views.value[0]
  const chapter = chapters.value[0]
  if (chapter) {
    view.tabs.push({
      id: `tab-${Date.now()}`,
      chapterId: chapter.id,
      title: chapter.title,
      content: chapter.content,
      wordCount: chapter.wordCount,
      lastModified: new Date().toLocaleTimeString(),
      isModified: false
    })
    view.activeTabId = view.tabs[0].id
  }
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})
</script>

<style scoped>
/* 编辑器容器 */
.multi-view-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

/* 工具栏 */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 编辑器区域 */
.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-container.layout-horizontal {
  flex-direction: row;
}

.editor-container.layout-vertical {
  flex-direction: column;
}

.editor-container.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.editor-container.layout-main {
  flex-direction: row;
}

/* 视图面板 */
.view-pane {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  transition: all 0.3s ease;
}

.view-pane.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

/* 视图头部 */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.view-tabs {
  display: flex;
  align-items: center;
  flex: 1;
  overflow-x: auto;
  padding: 0 8px;
}

.view-tabs::-webkit-scrollbar {
  height: 4px;
}

.view-tabs::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 2px;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border-right: 1px solid #e4e7ed;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.view-tab:hover {
  background: #f0f2f5;
}

.view-tab.active {
  background: #fff;
  border-bottom: 2px solid var(--primary-color, #409eff);
}

.tab-title {
  font-size: 13px;
  color: #606266;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  font-size: 12px;
  color: #909399;
  opacity: 0;
  transition: opacity 0.2s;
}

.view-tab:hover .tab-close {
  opacity: 1;
}

.tab-close:hover {
  color: #f56c6c;
}

.add-tab-btn {
  padding: 4px 8px;
}

.view-actions {
  padding: 0 8px;
}

/* 视图内容 */
.view-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 编辑器迷你工具栏 */
.editor-mini-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.editor-stats {
  margin-left: auto;
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

/* 文本编辑区 */
.editor-textarea {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  outline: none;
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
  resize: none;
  background: #fff;
}

.editor-textarea::placeholder {
  color: #c0c4cc;
}

/* 视图底部状态栏 */
.view-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 6px 12px;
  background: #fafafa;
  border-top: 1px solid #e4e7ed;
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-right {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

/* 空状态 */
.view-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.view-empty p {
  margin: 16px 0;
}

/* 分割线 */
.resize-handle {
  background: #e4e7ed;
  flex-shrink: 0;
  transition: background 0.2s;
}

.resize-handle:hover {
  background: var(--primary-color, #409eff);
}

.resize-handle.resize-vertical {
  width: 4px;
  cursor: col-resize;
}

.resize-handle.resize-horizontal {
  height: 4px;
  cursor: row-resize;
}

/* 章节列表 */
.chapter-list {
  max-height: 400px;
  overflow-y: auto;
}

.chapter-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
}

.chapter-title {
  font-size: 14px;
}

.chapter-meta {
  margin-left: 8px;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 2000;
  min-width: 120px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: background 0.2s;
}

.context-menu-item:hover {
  background: #f0f2f5;
}

.context-menu-divider {
  height: 1px;
  background: #e4e7ed;
  margin: 4px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .editor-container.layout-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
  }

  .editor-toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>

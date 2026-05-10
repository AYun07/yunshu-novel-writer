<template>
  <div class="idea-board-page">
    <div class="page-header">
      <h2>想法板与片段库</h2>
      <p class="page-desc">记录灵感，管理片段，热身写作</p>
    </div>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <el-tab-pane label="想法板" name="ideas">
        <div class="tab-toolbar">
          <el-input
            v-model="ideaSearch"
            placeholder="搜索想法..."
            prefix-icon="Search"
            clearable
            style="width: 200px"
          />
          <el-select v-model="ideaCategoryFilter" placeholder="分类" clearable size="default" style="width: 120px">
            <el-option v-for="c in ideaCategories" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
          <el-select v-model="ideaPriorityFilter" placeholder="优先级" clearable size="default" style="width: 120px">
            <el-option label="紧急" value="critical" />
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
          <el-button type="primary" @click="showIdeaDialog = true">
            <el-icon><Plus /></el-icon> 新建想法
          </el-button>
        </div>

        <!-- 想法卡片瀑布流 -->
        <div class="idea-columns">
          <div
            v-for="idea in filteredIdeas"
            :key="idea.id"
            class="idea-card"
            :class="'priority-' + (idea.priority || 'medium')"
          >
            <div class="idea-card-header">
              <span class="idea-title">{{ idea.title }}</span>
              <el-dropdown trigger="click" @command="(cmd) => handleIdeaAction(cmd, idea)">
                <el-icon class="idea-more"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="toChapter">转化为章节</el-dropdown-item>
                    <el-dropdown-item command="toCharacter">转化为角色</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      <span style="color: var(--el-color-danger)">删除</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <p class="idea-desc">{{ truncate(idea.description, 100) }}</p>
            <div class="idea-meta">
              <el-tag size="small" :type="categoryTagType(idea.category)">{{ categoryLabel(idea.category) }}</el-tag>
              <div class="idea-score">
                <el-icon v-for="s in 5" :key="s" :style="{ color: s <= (idea.score || 0) ? '#f7ba2a' : '#ddd' }">
                  <Star />
                </el-icon>
              </div>
            </div>
            <div class="idea-footer">
              <span class="idea-time">{{ formatTime(idea.createdAt) }}</span>
              <div class="idea-actions">
                <el-button size="small" text @click="moveIdea(idea.id, 'up')" :disabled="isFirstIdea(idea.id)">
                  <el-icon><Top /></el-icon>
                </el-button>
                <el-button size="small" text @click="moveIdea(idea.id, 'down')" :disabled="isLastIdea(idea.id)">
                  <el-icon><Bottom /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="filteredIdeas.length === 0" description="暂无想法，点击右上角新建" />
      </el-tab-pane>

      <el-tab-pane label="片段库" name="fragments">
        <div class="tab-toolbar">
          <el-input
            v-model="fragmentSearch"
            placeholder="搜索片段..."
            prefix-icon="Search"
            clearable
            style="width: 200px"
          />
          <el-select v-model="fragmentCategoryFilter" placeholder="分类" clearable size="default" style="width: 120px">
            <el-option v-for="c in fragmentCategories" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
          <el-button type="primary" @click="showFragmentDialog = true">
            <el-icon><Plus /></el-icon> 新建片段
          </el-button>
        </div>

        <!-- 片段列表 -->
        <div class="fragment-list">
          <div
            v-for="frag in filteredFragments"
            :key="frag.id"
            class="fragment-item"
          >
            <div class="fragment-header">
              <div class="fragment-title-row">
                <el-icon
                  class="fragment-fav"
                  :style="{ color: frag.isFavorited ? '#f7ba2a' : '#ccc' }"
                  @click="toggleFavorite(frag.id)"
                >
                  <StarFilled />
                </el-icon>
                <span class="fragment-title">{{ frag.title }}</span>
                <el-tag size="small" type="info">{{ frag.category || '未分类' }}</el-tag>
                <el-tag v-for="tag in (frag.tags || []).slice(0, 3)" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
              </div>
              <div class="fragment-actions">
                <el-button size="small" text type="primary" @click="insertFragment(frag)">插入编辑器</el-button>
                <el-button size="small" text @click="editFragment(frag)">编辑</el-button>
                <el-button size="small" text type="danger" @click="deleteFragment(frag.id)">删除</el-button>
              </div>
            </div>
            <p class="fragment-preview">{{ truncate(frag.content, 200) }}</p>
            <div class="fragment-meta">
              <span>{{ frag.wordCount || 0 }} 字</span>
              <span>{{ formatTime(frag.updatedAt) }}</span>
            </div>
          </div>
        </div>
        <el-empty v-if="filteredFragments.length === 0" description="暂无片段，点击右上角新建" />
      </el-tab-pane>

      <el-tab-pane label="写作热身" name="warmup">
        <div class="warmup-container">
          <div class="warmup-controls">
            <el-select v-model="promptCategory" placeholder="选择分类" clearable size="default" style="width: 140px">
              <el-option v-for="c in promptCategoryOptions" :key="c.value" :label="c.label" :value="c.value" />
            </el-select>
            <el-button @click="refreshPrompt">
              <el-icon><Refresh /></el-icon> 换一个
            </el-button>
            <div class="warmup-timer-group">
              <el-radio-group v-model="warmupDuration" size="small">
                <el-radio-button :value="5">5分钟</el-radio-button>
                <el-radio-button :value="10">10分钟</el-radio-button>
                <el-radio-button :value="15">15分钟</el-radio-button>
                <el-radio-button :value="30">30分钟</el-radio-button>
              </el-radio-group>
              <el-button
                v-if="!warmupTimerActive"
                type="primary"
                size="small"
                @click="startWarmupTimer"
              >
                开始计时
              </el-button>
              <el-button
                v-else
                type="danger"
                size="small"
                @click="stopWarmupTimer"
              >
                停止
              </el-button>
              <span v-if="warmupTimerActive" class="warmup-countdown">
                {{ formatCountdown(warmupRemaining) }}
              </span>
            </div>
          </div>

          <!-- 提示卡片 -->
          <div class="prompt-card">
            <div class="prompt-label">写作提示</div>
            <p class="prompt-text">{{ currentPrompt?.content || '点击"换一个"获取写作提示' }}</p>
            <div v-if="currentPrompt" class="prompt-meta">
              <el-tag size="small">{{ categoryLabel(currentPrompt.category) }}</el-tag>
              <span>难度：{{ difficultyLabel(currentPrompt.difficulty) }}</span>
              <span>建议用时：{{ currentPrompt.time }}分钟</span>
            </div>
          </div>

          <!-- 写作区域 -->
          <el-input
            v-model="warmupText"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 20 }"
            placeholder="开始你的自由写作..."
            class="warmup-editor"
          />

          <div class="warmup-footer">
            <span class="warmup-wordcount">{{ warmupText.replace(/\s/g, '').length }} 字</span>
            <el-button type="primary" @click="saveAsFragment" :disabled="!warmupText.trim()">
              保存为片段
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新建/编辑想法对话框 -->
    <el-dialog
      v-model="showIdeaDialog"
      :title="editingIdea ? '编辑想法' : '新建想法'"
      width="520px"
      destroy-on-close
    >
      <el-form :model="ideaForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="ideaForm.title" placeholder="想法标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="ideaForm.description" type="textarea" :rows="4" placeholder="详细描述" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="ideaForm.category" placeholder="选择分类" style="width: 100%">
            <el-option v-for="c in ideaCategories" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="ideaForm.priority" placeholder="选择优先级" style="width: 100%">
            <el-option label="紧急" value="critical" />
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="ideaForm.score" :max="5" />
        </el-form-item>
        <el-form-item label="关联项目">
          <el-select v-model="ideaForm.projectId" placeholder="选择项目" clearable style="width: 100%">
            <el-option label="默认项目" value="default" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showIdeaDialog = false">取消</el-button>
        <el-button type="primary" @click="saveIdea">{{ editingIdea ? '保存' : '创建' }}</el-button>
      </template>
    </el-dialog>

    <!-- 新建/编辑片段对话框 -->
    <el-dialog
      v-model="showFragmentDialog"
      :title="editingFragment ? '编辑片段' : '新建片段'"
      width="600px"
      destroy-on-close
    >
      <el-form :model="fragmentForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="fragmentForm.title" placeholder="片段标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="fragmentForm.content" type="textarea" :rows="6" placeholder="片段内容" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="fragmentForm.category" placeholder="选择分类" style="width: 100%">
            <el-option v-for="c in fragmentCategories" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="fragmentForm.tags" multiple filterable allow-create placeholder="添加标签" style="width: 100%">
            <el-option v-for="t in allFragmentTags" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showFragmentDialog = false">取消</el-button>
        <el-button type="primary" @click="saveFragment">{{ editingFragment ? '保存' : '创建' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, MoreFilled, Star, StarFilled, Top, Bottom, Refresh, Search
} from '@element-plus/icons-vue'
import { ideaBoardStore, fragmentStore, WRITING_PROMPTS, PROMPT_CATEGORIES } from '../config/writingTools.js'

// ========== Tab 状态 ==========
const activeTab = ref('ideas')

// ========== 想法板 ==========
const ideas = ref([])
const ideaSearch = ref('')
const ideaCategoryFilter = ref('')
const ideaPriorityFilter = ref('')
const showIdeaDialog = ref(false)
const editingIdea = ref(null)
const ideaForm = ref({
  title: '',
  description: '',
  category: 'plot',
  priority: 'medium',
  score: 3,
  projectId: 'default'
})

const ideaCategories = [
  { value: 'plot', label: '情节' },
  { value: 'character', label: '角色' },
  { value: 'worldbuilding', label: '世界观' },
  { value: 'theme', label: '主题' },
  { value: 'dialogue', label: '对话' },
  { value: 'scene', label: '场景' },
  { value: 'other', label: '其他' }
]

const filteredIdeas = computed(() => {
  let result = ideas.value
  if (ideaSearch.value) {
    const kw = ideaSearch.value.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(kw) ||
      (i.description && i.description.toLowerCase().includes(kw))
    )
  }
  if (ideaCategoryFilter.value) {
    result = result.filter(i => i.category === ideaCategoryFilter.value)
  }
  if (ideaPriorityFilter.value) {
    result = result.filter(i => i.priority === ideaPriorityFilter.value)
  }
  return result
})

function loadIdeas() {
  ideas.value = ideaBoardStore.load()
}

function saveIdea() {
  if (!ideaForm.value.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (editingIdea.value) {
    ideaBoardStore.update(editingIdea.value.id, ideaForm.value)
    ElMessage.success('想法已更新')
  } else {
    ideaBoardStore.add(ideaForm.value)
    ElMessage.success('想法已创建')
  }
  showIdeaDialog.value = false
  editingIdea.value = null
  ideaForm.value = { title: '', description: '', category: 'plot', priority: 'medium', score: 3, projectId: 'default' }
  loadIdeas()
}

function handleIdeaAction(cmd, idea) {
  if (cmd === 'edit') {
    editingIdea.value = idea
    ideaForm.value = { ...idea }
    showIdeaDialog.value = true
  } else if (cmd === 'delete') {
    ElMessageBox.confirm('确定删除这个想法吗？', '确认删除', { type: 'warning' }).then(() => {
      ideaBoardStore.remove(idea.id)
      loadIdeas()
      ElMessage.success('已删除')
    }).catch(() => {})
  } else if (cmd === 'toChapter') {
    ElMessage.success(`想法"${idea.title}"已转化为章节草稿`)
  } else if (cmd === 'toCharacter') {
    ElMessage.success(`想法"${idea.title}"已转化为角色卡片`)
  }
}

function moveIdea(id, direction) {
  const list = ideas.value
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= list.length) return
  const temp = list[idx]
  list[idx] = list[swapIdx]
  list[swapIdx] = temp
  ideas.value = [...list]
}

function isFirstIdea(id) {
  return ideas.value.length > 0 && ideas.value[0].id === id
}

function isLastIdea(id) {
  return ideas.value.length > 0 && ideas.value[ideas.value.length - 1].id === id
}

// ========== 片段库 ==========
const fragments = ref([])
const fragmentSearch = ref('')
const fragmentCategoryFilter = ref('')
const showFragmentDialog = ref(false)
const editingFragment = ref(null)
const fragmentForm = ref({
  title: '',
  content: '',
  category: 'scene',
  tags: [],
  projectId: 'default'
})

const fragmentCategories = [
  { value: 'scene', label: '场景' },
  { value: 'character', label: '角色' },
  { value: 'dialogue', label: '对话' },
  { value: 'description', label: '描写' },
  { value: 'idea', label: '灵感' },
  { value: 'other', label: '其他' }
]

const allFragmentTags = computed(() => fragmentStore.getAllTags())

const filteredFragments = computed(() => {
  let result = fragments.value
  if (fragmentSearch.value) {
    const kw = fragmentSearch.value.toLowerCase()
    result = result.filter(f =>
      f.title.toLowerCase().includes(kw) ||
      (f.content && f.content.toLowerCase().includes(kw))
    )
  }
  if (fragmentCategoryFilter.value) {
    result = result.filter(f => f.category === fragmentCategoryFilter.value)
  }
  // 收藏的排在前面
  result.sort((a, b) => (b.isFavorited ? 1 : 0) - (a.isFavorited ? 1 : 0))
  return result
})

function loadFragments() {
  fragments.value = fragmentStore.load()
}

function saveFragment() {
  if (!fragmentForm.value.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (editingFragment.value) {
    fragmentStore.update(editingFragment.value.id, fragmentForm.value)
    ElMessage.success('片段已更新')
  } else {
    fragmentStore.add(fragmentForm.value)
    ElMessage.success('片段已创建')
  }
  showFragmentDialog.value = false
  editingFragment.value = null
  fragmentForm.value = { title: '', content: '', category: 'scene', tags: [], projectId: 'default' }
  loadFragments()
}

function editFragment(frag) {
  editingFragment.value = frag
  fragmentForm.value = { ...frag }
  showFragmentDialog.value = true
}

function deleteFragment(id) {
  ElMessageBox.confirm('确定删除这个片段吗？', '确认删除', { type: 'warning' }).then(() => {
    fragmentStore.remove(id)
    loadFragments()
    ElMessage.success('已删除')
  }).catch(() => {})
}

function toggleFavorite(id) {
  const frag = fragments.value.find(f => f.id === id)
  if (frag) {
    fragmentStore.update(id, { isFavorited: !frag.isFavorited })
    loadFragments()
  }
}

function insertFragment(frag) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(frag.content || '')
    ElMessage.success('片段内容已复制到剪贴板，可粘贴到编辑器')
  }
}

// ========== 写作热身 ==========
const promptCategory = ref('')
const currentPrompt = ref(null)
const warmupText = ref('')
const warmupDuration = ref(15)
const warmupTimerActive = ref(false)
const warmupRemaining = ref(0)
let warmupInterval = null

const promptCategoryOptions = [
  { value: PROMPT_CATEGORIES.SCENE, label: '场景描写' },
  { value: PROMPT_CATEGORIES.CHARACTER, label: '角色塑造' },
  { value: PROMPT_CATEGORIES.DIALOGUE, label: '对话练习' },
  { value: PROMPT_CATEGORIES.PLOT, label: '情节构思' },
  { value: PROMPT_CATEGORIES.EMOTION, label: '情感表达' },
  { value: PROMPT_CATEGORIES.WORLD, label: '世界观' },
  { value: PROMPT_CATEGORIES.SENSORY, label: '感官描写' },
  { value: PROMPT_CATEGORIES.CONFLICT, label: '冲突设计' },
  { value: PROMPT_CATEGORIES.BEGINNING, label: '开头练习' },
  { value: PROMPT_CATEGORIES.ENDING, label: '结尾练习' },
  { value: PROMPT_CATEGORIES.METAPHOR, label: '比喻意象' },
  { value: PROMPT_CATEGORIES.PERSPECTIVE, label: '视角练习' }
]

function refreshPrompt() {
  const pool = promptCategory.value
    ? WRITING_PROMPTS.filter(p => p.category === promptCategory.value)
    : WRITING_PROMPTS
  if (pool.length > 0) {
    currentPrompt.value = pool[Math.floor(Math.random() * pool.length)]
  }
}

function startWarmupTimer() {
  warmupRemaining.value = warmupDuration.value * 60
  warmupTimerActive.value = true
  warmupInterval = setInterval(() => {
    warmupRemaining.value--
    if (warmupRemaining.value <= 0) {
      stopWarmupTimer()
      ElMessage.success('写作时间到！')
    }
  }, 1000)
}

function stopWarmupTimer() {
  warmupTimerActive.value = false
  if (warmupInterval) {
    clearInterval(warmupInterval)
    warmupInterval = null
  }
}

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function saveAsFragment() {
  if (!warmupText.value.trim()) return
  fragmentStore.add({
    title: `热身写作 - ${new Date().toLocaleDateString()}`,
    content: warmupText.value,
    category: 'idea',
    tags: ['热身', '自由写作'],
    projectId: 'default'
  })
  ElMessage.success('已保存为片段')
  warmupText.value = ''
  loadFragments()
}

// ========== 通用工具 ==========
function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function categoryLabel(cat) {
  const map = {
    plot: '情节', character: '角色', worldbuilding: '世界观',
    theme: '主题', dialogue: '对话', scene: '场景',
    description: '描写', idea: '灵感', other: '其他',
    sensory: '感官', conflict: '冲突', beginning: '开头',
    ending: '结尾', metaphor: '比喻', perspective: '视角',
    emotion: '情感', world: '世界观'
  }
  return map[cat] || cat
}

function categoryTagType(cat) {
  const map = {
    plot: '', character: 'success', worldbuilding: 'warning',
    theme: 'danger', dialogue: 'info', scene: '',
    description: 'success', idea: 'warning', other: 'info'
  }
  return map[cat] || 'info'
}

function difficultyLabel(diff) {
  const map = { easy: '简单', medium: '中等', hard: '困难' }
  return map[diff] || diff
}

// ========== 生命周期 ==========
onMounted(() => {
  loadIdeas()
  loadFragments()
  refreshPrompt()
})
</script>

<style scoped>
.idea-board-page {
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

/* ===== Tab 工具栏 ===== */
.tab-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

/* ===== 想法板瀑布流 ===== */
.idea-columns {
  columns: 3;
  column-gap: 16px;
}
.idea-card {
  break-inside: avoid;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  border-left: 4px solid var(--el-border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}
.idea-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.idea-card.priority-critical { border-left-color: #f56c6c; }
.idea-card.priority-high { border-left-color: #e6a23c; }
.idea-card.priority-medium { border-left-color: #409eff; }
.idea-card.priority-low { border-left-color: #909399; }
.idea-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.idea-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.idea-more {
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: color 0.2s;
}
.idea-more:hover {
  color: var(--primary-color);
}
.idea-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin: 0 0 10px;
}
.idea-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.idea-score {
  display: flex;
  gap: 1px;
}
.idea-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.idea-time {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
}
.idea-actions {
  display: flex;
  gap: 0;
}

/* ===== 片段列表 ===== */
.fragment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fragment-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  padding: 16px;
  transition: transform 0.2s;
}
.fragment-item:hover {
  transform: translateX(4px);
}
.fragment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.fragment-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.fragment-fav {
  cursor: pointer;
  font-size: 18px;
  transition: color 0.2s;
  flex-shrink: 0;
}
.fragment-fav:hover {
  color: #f7ba2a !important;
}
.fragment-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fragment-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.fragment-preview {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin: 0 0 8px;
}
.fragment-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

/* ===== 写作热身 ===== */
.warmup-container {
  max-width: 800px;
  margin: 0 auto;
}
.warmup-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.warmup-timer-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.warmup-countdown {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
  font-variant-numeric: tabular-nums;
  min-width: 60px;
}
.prompt-card {
  background: linear-gradient(135deg, var(--el-fill-color), var(--el-bg-color));
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
  text-align: center;
}
.prompt-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.prompt-text {
  font-size: 20px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  margin: 0 0 16px;
  font-weight: 500;
}
.prompt-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.warmup-editor {
  margin-bottom: 16px;
}
.warmup-editor :deep(.el-textarea__inner) {
  font-size: 16px;
  line-height: 1.8;
  font-family: inherit;
}
.warmup-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.warmup-wordcount {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .idea-columns {
    columns: 2;
  }
}
@media (max-width: 600px) {
  .idea-columns {
    columns: 1;
  }
}
</style>

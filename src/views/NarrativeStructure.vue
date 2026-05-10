<template>
  <div class="narrative-structure-page">
    <div class="page-header">
      <h2>叙事结构建模</h2>
      <el-button type="primary" @click="handleAiAnalysis" :loading="isAnalyzing">
        <el-icon><MagicStick /></el-icon>AI分析
      </el-button>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 前提Tab -->
      <el-tab-pane label="前提" name="premise">
        <div class="premise-editor">
          <div class="section-desc">故事的核心假设或命题，是整个叙事的基础。</div>
          <el-form label-position="top">
            <el-form-item label="一句话前提">
              <div class="input-with-action">
                <el-input v-model="premiseData.statement" type="textarea" :rows="2" placeholder="例如：如果一个普通人突然获得了读心术，他该如何面对身边人最真实的想法？" />
                <el-button type="primary" size="small" @click="handleAiPremiseSuggestion" :loading="isPremiseLoading" class="action-btn">AI生成建议</el-button>
              </div>
            </el-form-item>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="如果...会怎样">
                  <el-input v-model="premiseData.whatIf" placeholder="核心假设" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主角目标">
                  <el-input v-model="premiseData.protagonistGoal" placeholder="主角想要达成什么" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="核心冲突">
                  <el-input v-model="premiseData.centralConflict" placeholder="推动故事的主要矛盾" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="赌注/代价">
                  <el-input v-model="premiseData.stakes" placeholder="失败的后果" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-button type="primary" @click="savePremise">保存前提</el-button>
        </div>
      </el-tab-pane>

      <!-- 故事线Tab -->
      <el-tab-pane label="故事线" name="strands">
        <div class="section-desc">管理多条交织的叙事线索，每条线索有自己的起承转合。</div>
        <div class="strand-actions">
          <el-button type="primary" size="small" @click="addStrand"><el-icon><Plus /></el-icon>添加线索</el-button>
        </div>
        <div class="strand-list">
          <div v-for="(strand, idx) in strands" :key="strand.id" class="strand-card" :style="{ borderLeftColor: strand.color }">
            <div class="strand-header">
              <el-input v-model="strand.name" size="small" style="width: 180px" placeholder="线索名称" />
              <el-color-picker v-model="strand.color" size="small" />
              <el-select v-model="strand.type" size="small" style="width: 120px">
                <el-option label="主线" value="main" />
                <el-option label="副线" value="subplot" />
                <el-option label="平行线" value="parallel" />
                <el-option label="闪回" value="flashback" />
              </el-select>
              <el-select v-model="strand.status" size="small" style="width: 100px">
                <el-option label="进行中" value="active" />
                <el-option label="暂停" value="paused" />
                <el-option label="已结束" value="concluded" />
              </el-select>
              <el-button size="small" type="danger" link @click="removeStrand(idx)">删除</el-button>
            </div>
            <el-input v-model="strand.description" type="textarea" :rows="2" size="small" placeholder="线索描述" style="margin-top: 8px" />
            <div class="strand-chapters">
              <el-tag v-for="ch in strand.chapterIds" :key="ch" size="small" closable @close="removeChapterFromStrand(strand, ch)">{{ ch }}</el-tag>
              <el-input v-if="strand.showChapterInput" v-model="strand.newChapter" size="small" style="width: 120px" placeholder="章节ID" @keyup.enter="addChapterToStrand(strand)" @blur="strand.showChapterInput = false" />
              <el-button v-else size="small" link @click="strand.showChapterInput = true">+ 关联章节</el-button>
            </div>
          </div>
          <el-empty v-if="strands.length === 0" description="暂无叙事线索" :image-size="60" />
        </div>
      </el-tab-pane>

      <!-- 主题Tab -->
      <el-tab-pane label="主题" name="themes">
        <div class="section-desc">作品探讨的核心思想，通过情节、角色和象征反复体现。</div>
        <div class="strand-actions">
          <el-button type="primary" size="small" @click="addTheme"><el-icon><Plus /></el-icon>添加主题</el-button>
        </div>
        <div class="theme-list">
          <div v-for="(theme, idx) in themes" :key="theme.id" class="theme-card">
            <div class="theme-header">
              <el-input v-model="theme.name" size="small" style="width: 160px" placeholder="主题名称" />
              <el-select v-model="theme.type" size="small" style="width: 120px">
                <el-option label="核心主题" value="central" />
                <el-option label="次要主题" value="secondary" />
                <el-option label="反复主题" value="recurring" />
              </el-select>
              <el-button size="small" type="danger" link @click="removeTheme(idx)">删除</el-button>
            </div>
            <el-input v-model="theme.statement" type="textarea" :rows="2" size="small" placeholder="主题陈述（作者想表达的观点）" style="margin-top: 8px" />
            <el-row :gutter="12" style="margin-top: 8px">
              <el-col :span="12">
                <el-input v-model="theme.question" size="small" placeholder="主题提出的问题" />
              </el-col>
              <el-col :span="12">
                <el-input v-model="theme.opposite" size="small" placeholder="反面观点" />
              </el-col>
            </el-row>
            <div class="theme-symbols">
              <span class="label">象征元素:</span>
              <el-tag v-for="sym in theme.symbols" :key="sym" size="small" closable @close="removeSymbolFromTheme(theme, sym)">{{ sym }}</el-tag>
              <el-input v-if="theme.showSymbolInput" v-model="theme.newSymbol" size="small" style="width: 100px" placeholder="元素" @keyup.enter="addSymbolToTheme(theme)" @blur="theme.showSymbolInput = false" />
              <el-button v-else size="small" link @click="theme.showSymbolInput = true">+ 添加</el-button>
            </div>
            <div class="theme-chars">
              <span class="label">关联角色:</span>
              <el-select v-model="theme.characterIds" multiple filterable allow-create size="small" placeholder="选择角色" style="width: 260px">
                <el-option v-for="c in novelStore.characters" :key="c.id" :label="c.name || c.id" :value="String(c.id)" />
              </el-select>
            </div>
          </div>
          <el-empty v-if="themes.length === 0" description="暂无主题" :image-size="60" />
        </div>
      </el-tab-pane>

      <!-- 冲突Tab -->
      <el-tab-pane label="冲突" name="conflicts">
        <div class="section-desc">推动故事发展的矛盾和对立，是叙事的核心动力。</div>
        <div class="strand-actions">
          <el-button type="primary" size="small" @click="addConflict"><el-icon><Plus /></el-icon>添加冲突</el-button>
        </div>
        <div class="conflict-list">
          <div v-for="(conflict, idx) in conflicts" :key="conflict.id" class="conflict-card">
            <div class="conflict-header">
              <el-input v-model="conflict.name" size="small" style="width: 180px" placeholder="冲突名称" />
              <el-select v-model="conflict.type" size="small" style="width: 140px">
                <el-option label="人 vs 人" value="interpersonal" />
                <el-option label="人 vs 自我" value="internal" />
                <el-option label="人 vs 社会" value="societal" />
                <el-option label="人 vs 自然" value="environmental" />
                <el-option label="人 vs 科技" value="supernatural" />
              </el-select>
              <el-select v-model="conflict.level" size="small" style="width: 100px">
                <el-option label="核心" value="core" />
                <el-option label="次要" value="secondary" />
                <el-option label="轻微" value="minor" />
              </el-select>
              <el-select v-model="conflict.status" size="small" style="width: 110px">
                <el-option label="酝酿中" value="brewing" />
                <el-option label="进行中" value="active" />
                <el-option label="升级中" value="escalating" />
                <el-option label="高潮" value="climax" />
                <el-option label="已解决" value="resolved" />
              </el-select>
              <el-button size="small" type="danger" link @click="removeConflict(idx)">删除</el-button>
            </div>
            <el-input v-model="conflict.description" type="textarea" :rows="2" size="small" placeholder="冲突描述" style="margin-top: 8px" />
            <el-row :gutter="12" style="margin-top: 8px">
              <el-col :span="12">
                <el-input v-model="conflict.cause" size="small" placeholder="起因" />
              </el-col>
              <el-col :span="12">
                <el-input v-model="conflict.resolution" size="small" placeholder="解决方式" />
              </el-col>
            </el-row>
          </div>
          <el-empty v-if="conflicts.length === 0" description="暂无冲突" :image-size="60" />
        </div>
      </el-tab-pane>

      <!-- 象征Tab -->
      <el-tab-pane label="象征" name="symbols">
        <div class="section-desc">承载深层意义的物体、场景、颜色等意象。</div>
        <div class="strand-actions">
          <el-button type="primary" size="small" @click="addSymbol"><el-icon><Plus /></el-icon>添加象征</el-button>
        </div>
        <div class="symbol-list">
          <div v-for="(sym, idx) in symbols" :key="sym.id" class="symbol-card">
            <div class="symbol-header">
              <el-input v-model="sym.name" size="small" style="width: 160px" placeholder="象征名称" />
              <el-select v-model="sym.form" size="small" style="width: 120px">
                <el-option label="物体" value="object" />
                <el-option label="颜色" value="color" />
                <el-option label="动物" value="animal" />
                <el-option label="地点" value="place" />
                <el-option label="动作" value="action" />
                <el-option label="天气" value="weather" />
                <el-option label="其他" value="other" />
              </el-select>
              <el-button size="small" type="danger" link @click="removeSymbol(idx)">删除</el-button>
            </div>
            <el-row :gutter="12" style="margin-top: 8px">
              <el-col :span="12">
                <el-input v-model="sym.literalDescription" size="small" placeholder="字面描述" />
              </el-col>
              <el-col :span="12">
                <el-input v-model="sym.symbolicMeaning" size="small" placeholder="象征意义" />
              </el-col>
            </el-row>
            <el-input v-model="sym.context" type="textarea" :rows="2" size="small" placeholder="使用场景/上下文" style="margin-top: 8px" />
          </div>
          <el-empty v-if="symbols.length === 0" description="暂无象征元素" :image-size="60" />
        </div>
      </el-tab-pane>

      <!-- 角色深度Tab -->
      <el-tab-pane label="角色深度" name="characters">
        <div class="section-desc">深入探索角色心理、关系和成长弧线。</div>
        <!-- 角色列表 -->
        <div v-if="!selectedCharacter" class="character-grid">
          <div v-for="char in novelStore.characters" :key="char.id" class="character-card-item" @click="selectCharacter(char)">
            <div class="char-avatar">{{ (char.name || '?')[0] }}</div>
            <div class="char-info">
              <div class="char-name">{{ char.name || '未命名角色' }}</div>
              <div class="char-role">{{ char.role || '角色' }}</div>
            </div>
          </div>
          <el-empty v-if="novelStore.characters.length === 0" description="暂无角色，请先在写作工具中添加角色" :image-size="80" />
        </div>

        <!-- 角色详情 -->
        <div v-else class="character-detail">
          <div class="detail-header">
            <el-button size="small" @click="selectedCharacter = null">返回列表</el-button>
            <h3>{{ selectedCharacter.name || '未命名角色' }}</h3>
            <el-select v-model="selectedCharacterArc" placeholder="选择弧线类型" size="small" style="width: 160px" @change="saveCharacterData">
              <el-option v-for="(arc, key) in ARC_TYPES" :key="key" :label="arc.label" :value="key" />
            </el-select>
          </div>

          <el-tabs v-model="characterSubTab" type="line">
            <!-- 心理引导问卷 -->
            <el-tab-pane v-for="cat in questionCategories" :key="cat.key" :label="cat.label" :name="cat.key">
              <div class="questionnaire">
                <div v-for="q in getQuestionsByCategory(cat.key)" :key="q.id" class="question-item">
                  <div class="question-text">{{ q.question }}</div>
                  <div class="question-followup">{{ q.followUp }}</div>
                  <el-input
                    v-model="characterAnswers[q.id]"
                    type="textarea"
                    :rows="2"
                    size="small"
                    :placeholder="q.purpose"
                  />
                </div>
              </div>
            </el-tab-pane>

            <!-- 角色关系图 -->
            <el-tab-pane label="关系图" name="relationship-graph">
              <div class="relationship-graph" ref="graphRef">
                <div
                  v-for="(node, idx) in graphNodes"
                  :key="node.id"
                  class="graph-node"
                  :class="{ active: node.id === selectedCharacter?.id }"
                  :style="{ left: node.x + 'px', top: node.y + 'px' }"
                  @mousedown="startDrag($event, idx)"
                >
                  <div class="node-avatar">{{ (node.name || '?')[0] }}</div>
                  <div class="node-name">{{ node.name }}</div>
                </div>
                <svg class="graph-lines" :width="graphWidth" :height="graphHeight">
                  <line v-for="(edge, eIdx) in graphEdges" :key="eIdx"
                    :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2"
                    stroke="var(--primary-color)" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.5"
                  />
                </svg>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, MagicStick } from '@element-plus/icons-vue'
import {
  buildNarrativeAnalysisPrompt,
  CHARACTER_PSYCHOLOGY_QUESTIONS as CHARACTER_QUESTIONS,
  CHARACTER_RELATIONSHIP_TYPES as RELATIONSHIP_TYPES,
  CHARACTER_ARC_TYPES as ARC_TYPES,
  STORY_TEMPLATES
} from '../config/narrativeStructure.js'
import { useNovelStore } from '../stores/novel.js'

const novelStore = useNovelStore()

const STORAGE_KEY = 'yunshu_narrative_structure'
const activeTab = ref('premise')
const isAnalyzing = ref(false)
const isPremiseLoading = ref(false)

// 前提数据
const premiseData = reactive({
  statement: '',
  whatIf: '',
  protagonistGoal: '',
  centralConflict: '',
  stakes: ''
})

// 故事线
const strands = ref([])
// 主题
const themes = ref([])
// 冲突
const conflicts = ref([])
// 象征
const symbols = ref([])

// 角色深度
const selectedCharacter = ref(null)
const characterSubTab = ref('contradiction')
const selectedCharacterArc = ref('')
const characterAnswers = reactive({})

// 关系图
const graphRef = ref(null)
const graphWidth = ref(800)
const graphHeight = ref(500)
const graphNodes = ref([])
const graphEdges = ref([])
let dragIndex = null

// 问题分类
const questionCategories = [
  { key: 'contradiction', label: '矛盾' },
  { key: 'fear', label: '恐惧' },
  { key: 'desire', label: '欲望' },
  { key: 'growthArc', label: '成长弧线' },
  { key: 'relationship', label: '关系' },
  { key: 'motivation', label: '动机' },
  { key: 'identity', label: '自我认同' },
  { key: 'morality', label: '道德观' },
  { key: 'past', label: '过去' },
  { key: 'secret', label: '秘密' }
]

const getQuestionsByCategory = (cat) => {
  return CHARACTER_QUESTIONS.filter(q => q.category === cat)
}

// 生成唯一ID
const genId = () => 'ns_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)

// 本地存储
const saveData = () => {
  const data = { premiseData, strands: strands.value, themes: themes.value, conflicts: conflicts.value, symbols: symbols.value, characterAnswers }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.premiseData) Object.assign(premiseData, data.premiseData)
      if (data.strands) strands.value = data.strands
      if (data.themes) themes.value = data.themes
      if (data.conflicts) conflicts.value = data.conflicts
      if (data.symbols) symbols.value = data.symbols
      if (data.characterAnswers) Object.assign(characterAnswers, data.characterAnswers)
    }
  } catch (e) {
    console.error('加载叙事结构数据失败:', e)
  }
}

// 保存前提
const savePremise = () => {
  saveData()
  ElMessage.success('前提已保存')
}

// AI生成前提建议
const handleAiPremiseSuggestion = async () => {
  isPremiseLoading.value = true
  try {
    const prompt = `请根据以下信息生成3个小说前提建议，每个用一句话概括，用换行分隔：\n当前内容: ${novelStore.currentNovel?.substring(0, 500) || '暂无内容'}`
    if (novelStore.isApiConfigured) {
      const result = await novelStore.generateContent(prompt)
      ElMessage.success('AI建议已生成')
    } else {
      ElMessage.warning('请先配置API密钥')
    }
  } catch (e) {
    ElMessage.error('AI生成失败')
  } finally {
    isPremiseLoading.value = false
  }
}

// 故事线操作
const addStrand = () => {
  strands.value.push({ id: genId(), name: '', type: 'main', description: '', color: '#409eff', status: 'active', chapterIds: [], showChapterInput: false, newChapter: '' })
}
const removeStrand = (idx) => { strands.value.splice(idx, 1); saveData() }
const addChapterToStrand = (strand) => {
  if (strand.newChapter?.trim()) {
    strand.chapterIds.push(strand.newChapter.trim())
    strand.newChapter = ''
    strand.showChapterInput = false
    saveData()
  }
}
const removeChapterFromStrand = (strand, ch) => {
  strand.chapterIds = strand.chapterIds.filter(c => c !== ch)
  saveData()
}

// 主题操作
const addTheme = () => {
  themes.value.push({ id: genId(), name: '', type: 'central', statement: '', question: '', opposite: '', symbols: [], characterIds: [], showSymbolInput: false, newSymbol: '' })
}
const removeTheme = (idx) => { themes.value.splice(idx, 1); saveData() }
const addSymbolToTheme = (theme) => {
  if (theme.newSymbol?.trim()) {
    theme.symbols.push(theme.newSymbol.trim())
    theme.newSymbol = ''
    theme.showSymbolInput = false
    saveData()
  }
}
const removeSymbolFromTheme = (theme, sym) => {
  theme.symbols = theme.symbols.filter(s => s !== sym)
  saveData()
}

// 冲突操作
const addConflict = () => {
  conflicts.value.push({ id: genId(), name: '', type: 'interpersonal', level: 'core', description: '', cause: '', resolution: '', status: 'brewing' })
}
const removeConflict = (idx) => { conflicts.value.splice(idx, 1); saveData() }

// 象征操作
const addSymbol = () => {
  symbols.value.push({ id: genId(), name: '', form: 'object', literalDescription: '', symbolicMeaning: '', context: '' })
}
const removeSymbol = (idx) => { symbols.value.splice(idx, 1); saveData() }

// 角色选择
const selectCharacter = (char) => {
  selectedCharacter.value = char
  selectedCharacterArc.value = char.arcType || ''
  buildRelationshipGraph()
}

const saveCharacterData = () => {
  if (selectedCharacter.value) {
    selectedCharacter.value.arcType = selectedCharacterArc.value
  }
  saveData()
}

// 关系图
const buildRelationshipGraph = () => {
  const chars = novelStore.characters
  if (!chars.length) return
  const centerX = graphWidth.value / 2
  const centerY = graphHeight.value / 2
  const radius = Math.min(centerX, centerY) - 60

  graphNodes.value = chars.map((c, i) => {
    const angle = (2 * Math.PI * i) / chars.length - Math.PI / 2
    return {
      id: String(c.id),
      name: c.name || '未命名',
      x: centerX + radius * Math.cos(angle) - 30,
      y: centerY + radius * Math.sin(angle) - 25
    }
  })

  graphEdges.value = []
  for (let i = 0; i < graphNodes.value.length; i++) {
    for (let j = i + 1; j < graphNodes.value.length; j++) {
      graphEdges.value.push({
        x1: graphNodes.value[i].x + 30,
        y1: graphNodes.value[i].y + 25,
        x2: graphNodes.value[j].x + 30,
        y2: graphNodes.value[j].y + 25
      })
    }
  }
}

const startDrag = (e, idx) => {
  dragIndex = idx
  const startX = e.clientX - graphNodes.value[idx].x
  const startY = e.clientY - graphNodes.value[idx].y
  const onMove = (ev) => {
    if (dragIndex === null) return
    graphNodes.value[dragIndex].x = ev.clientX - startX
    graphNodes.value[dragIndex].y = ev.clientY - startY
    buildRelationshipGraph()
  }
  const onUp = () => {
    dragIndex = null
    try { if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    } } catch(e) {}
  }
  try { if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  } } catch(e) {}
}

// AI分析
const handleAiAnalysis = async () => {
  isAnalyzing.value = true
  try {
    const prompt = buildNarrativeAnalysisPrompt({
      content: novelStore.currentNovel?.substring(0, 3000) || '',
      contentType: 'draft',
      novelGenre: '通用'
    })
    if (novelStore.isApiConfigured) {
      await novelStore.generateContent(prompt)
      ElMessage.success('AI叙事分析完成')
    } else {
      ElMessage.warning('请先配置API密钥')
    }
  } catch (e) {
    ElMessage.error('AI分析失败')
  } finally {
    isAnalyzing.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.narrative-structure-page {
  padding: 4px;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}
.section-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 16px;
}
.input-with-action {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.input-with-action .el-input {
  flex: 1;
}
.action-btn {
  margin-top: 0;
  white-space: nowrap;
}
.strand-actions {
  margin-bottom: 12px;
}
.strand-list, .theme-list, .conflict-list, .symbol-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.strand-card {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  border-left: 4px solid #409eff;
  background: #fafafa;
}
.strand-header, .theme-header, .conflict-header, .symbol-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.strand-chapters, .theme-symbols, .theme-chars {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.label {
  font-size: 12px;
  color: #909399;
  margin-right: 4px;
}
.theme-card, .conflict-card, .symbol-card {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  background: #fafafa;
}
.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}
.character-card-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.character-card-item:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.char-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--primary-color, #409eff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}
.char-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}
.char-role {
  font-size: 12px;
  color: #909399;
}
.character-detail {
  margin-top: 12px;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.detail-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}
.questionnaire {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.question-item {
  padding: 12px;
  border-radius: 6px;
  background: #f9fafc;
  border: 1px solid #ebeef5;
}
.question-text {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}
.question-followup {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}
.relationship-graph {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;
}
.graph-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.graph-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: grab;
  user-select: none;
  z-index: 1;
}
.graph-node.active .node-avatar {
  box-shadow: 0 0 0 3px var(--primary-color, #409eff);
}
.node-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e6e8eb;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  transition: box-shadow 0.2s;
}
.graph-node.active .node-avatar {
  background: var(--primary-color, #409eff);
  color: #fff;
}
.node-name {
  font-size: 11px;
  color: #606266;
  white-space: nowrap;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

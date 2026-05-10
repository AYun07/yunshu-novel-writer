<template>
  <div class="chapter-graph">
    <div class="page-header">
      <h2>章节关系图谱</h2>
      <el-button type="primary" @click="handleLoadDemoData">加载示例数据</el-button>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 关系图谱 Tab -->
      <el-tab-pane label="关系图谱" name="graph">
        <div class="graph-toolbar">
          <el-button type="primary" size="small" @click="showAddNodeDialog = true">
            <el-icon><Plus /></el-icon> 添加章节节点
          </el-button>
          <el-button size="small" @click="showAddEdgeDialog = true">
            <el-icon><Connection /></el-icon> 添加关系
          </el-button>
          <el-button type="success" size="small" @click="handleAiAnalyze" :loading="aiAnalyzing">
            <el-icon><MagicStick /></el-icon> AI自动分析
          </el-button>
          <div class="graph-legend">
            <span v-for="rt in relationTypes" :key="rt.value" class="legend-item">
              <span class="legend-line" :style="{ borderTopColor: rt.color, borderStyle: rt.lineStyle }"></span>
              {{ rt.label }}
            </span>
          </div>
        </div>
        <div class="graph-container">
          <VueFlow
            v-model:nodes="graphNodes"
            v-model:edges="graphEdges"
            :default-viewport="{ zoom: 0.8 }"
            :min-zoom="0.2"
            :max-zoom="3"
            fit-view-on-init
            @nodes-change="onNodesChange"
            @edges-change="onEdgesChange"
            @connect="onConnect"
          >
            <Background :gap="20" />
            <Controls position="bottom-right" />
          </VueFlow>
        </div>
      </el-tab-pane>

      <!-- 时间线 Tab -->
      <el-tab-pane label="时间线" name="timeline">
        <div class="timeline-toolbar">
          <el-button type="primary" size="small" @click="showAddEventDialog = true">
            <el-icon><Plus /></el-icon> 添加事件
          </el-button>
          <el-radio-group v-model="timelineZoom" size="small">
            <el-radio-button value="day">日</el-radio-button>
            <el-radio-button value="week">周</el-radio-button>
            <el-radio-button value="month">月</el-radio-button>
            <el-radio-button value="year">年</el-radio-button>
          </el-radio-group>
        </div>
        <div class="timeline-container">
          <el-timeline>
            <el-timeline-item
              v-for="event in sortedTimelineEvents"
              :key="event.id"
              :timestamp="event.storyTimestamp"
              :color="event.color || 'var(--primary-color)'"
              :hollow="false"
              placement="top"
            >
              <el-card shadow="hover" class="timeline-card">
                <div class="event-header">
                  <span class="event-title">{{ event.title }}</span>
                  <el-tag size="small" :type="getEventTypeTag(event.type)">{{ getEventTypeName(event.type) }}</el-tag>
                </div>
                <p class="event-desc">{{ event.description }}</p>
                <div class="event-meta">
                  <span v-if="event.location" class="event-location">
                    <el-icon><Location /></el-icon> {{ event.location }}
                  </span>
                  <span v-if="event.characterIds && event.characterIds.length" class="event-characters">
                    <el-icon><User /></el-icon> {{ event.characterIds.join('、') }}
                  </span>
                  <span v-if="event.chapterId" class="event-chapter">
                    <el-icon><Notebook /></el-icon> {{ event.chapterId }}
                  </span>
                </div>
                <div class="event-actions">
                  <el-button type="primary" link size="small" @click="editTimelineEvent(event)">编辑</el-button>
                  <el-button type="danger" link size="small" @click="deleteTimelineEvent(event.id)">删除</el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-if="timelineEvents.length === 0" description="暂无时间线事件，点击上方按钮添加" />
        </div>
      </el-tab-pane>

      <!-- 故事线 Tab -->
      <el-tab-pane label="故事线" name="storylines">
        <div class="storyline-toolbar">
          <el-button type="primary" size="small" @click="showAddStorylineDialog = true">
            <el-icon><Plus /></el-icon> 添加故事线
          </el-button>
          <el-dropdown trigger="click" @command="applyTemplate">
            <el-button size="small">
              应用模板 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="tpl in storyTemplates"
                  :key="tpl.id"
                  :command="tpl.id"
                >
                  {{ tpl.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 故事线列表 -->
        <div class="storyline-list">
          <div v-for="line in storylines" :key="line.id" class="storyline-item">
            <div class="storyline-header">
              <span class="storyline-color-dot" :style="{ backgroundColor: line.color }"></span>
              <span class="storyline-name">{{ line.name }}</span>
              <div class="storyline-actions">
                <el-button type="primary" link size="small" @click="editStoryline(line)">编辑</el-button>
                <el-button type="danger" link size="small" @click="deleteStoryline(line.id)">删除</el-button>
              </div>
            </div>
            <!-- 甘特图可视化 -->
            <div class="gantt-chart">
              <div class="gantt-labels">
                <div v-for="ch in ganttChapters" :key="ch.id" class="gantt-label">{{ ch.title }}</div>
              </div>
              <div class="gantt-bars">
                <div v-for="ch in ganttChapters" :key="ch.id" class="gantt-row">
                  <div
                    v-if="line.chapters.includes(ch.id)"
                    class="gantt-bar"
                    :style="{ backgroundColor: line.color }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="storyline-chapters">
              <el-tag
                v-for="chId in line.chapters"
                :key="chId"
                size="small"
                closable
                @close="removeChapterFromStoryline(line.id, chId)"
              >
                {{ getChapterTitle(chId) }}
              </el-tag>
            </div>
          </div>
        </div>
        <el-empty v-if="storylines.length === 0" description="暂无故事线，点击上方按钮添加" />
      </el-tab-pane>
    </el-tabs>

    <!-- 添加章节节点对话框 -->
    <el-dialog v-model="showAddNodeDialog" title="添加章节节点" width="480px">
      <el-form :model="newNode" label-width="80px">
        <el-form-item label="章节标题">
          <el-input v-model="newNode.label" placeholder="请输入章节标题" />
        </el-form-item>
        <el-form-item label="字数">
          <el-input-number v-model="newNode.wordCount" :min="0" :step="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddNodeDialog = false">取消</el-button>
        <el-button type="primary" @click="addNode">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加关系对话框 -->
    <el-dialog v-model="showAddEdgeDialog" title="添加章节关系" width="480px">
      <el-form :model="newEdge" label-width="80px">
        <el-form-item label="源章节">
          <el-select v-model="newEdge.source" placeholder="选择源章节">
            <el-option v-for="n in graphNodes" :key="n.id" :label="n.label" :value="n.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标章节">
          <el-select v-model="newEdge.target" placeholder="选择目标章节">
            <el-option v-for="n in graphNodes" :key="n.id" :label="n.label" :value="n.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关系类型">
          <el-select v-model="newEdge.relationType" placeholder="选择关系类型">
            <el-option v-for="rt in relationTypes" :key="rt.value" :label="rt.label" :value="rt.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddEdgeDialog = false">取消</el-button>
        <el-button type="primary" @click="addEdge">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加时间线事件对话框 -->
    <el-dialog v-model="showAddEventDialog" title="添加时间线事件" width="520px">
      <el-form :model="newEvent" label-width="80px">
        <el-form-item label="事件标题">
          <el-input v-model="newEvent.title" placeholder="请输入事件标题" />
        </el-form-item>
        <el-form-item label="故事时间">
          <el-input v-model="newEvent.storyTimestamp" placeholder="如：2024年春天" />
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="newEvent.type" placeholder="选择类型">
            <el-option label="情节事件" value="plot" />
            <el-option label="角色事件" value="character" />
            <el-option label="关系变化" value="relationship" />
            <el-option label="世界观事件" value="world" />
            <el-option label="闪回" value="flashback" />
            <el-option label="伏笔" value="foreshadow" />
            <el-option label="高潮" value="climax" />
            <el-option label="转折点" value="turning_point" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件描述">
          <el-input v-model="newEvent.description" type="textarea" :rows="3" placeholder="请输入事件描述" />
        </el-form-item>
        <el-form-item label="发生地点">
          <el-input v-model="newEvent.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="涉及角色">
          <el-input v-model="newEvent.characterIdsText" placeholder="多个角色用顿号分隔" />
        </el-form-item>
        <el-form-item label="关联章节">
          <el-input v-model="newEvent.chapterId" placeholder="章节标题或编号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddEventDialog = false">取消</el-button>
        <el-button type="primary" @click="addTimelineEvent">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑故事线对话框 -->
    <el-dialog v-model="showAddStorylineDialog" :title="editingStoryline ? '编辑故事线' : '添加故事线'" width="520px">
      <el-form :model="storylineForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="storylineForm.name" placeholder="请输入故事线名称" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="storylineForm.color" />
        </el-form-item>
        <el-form-item label="关联章节">
          <el-checkbox-group v-model="storylineForm.chapters">
            <el-checkbox v-for="ch in allChapters" :key="ch.id" :label="ch.id" :value="ch.id">
              {{ ch.title }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddStorylineDialog = false">取消</el-button>
        <el-button type="primary" @click="saveStoryline">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { VueFlow, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { STORY_TEMPLATES } from '../config/narrativeStructure.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// ==================== Tab 状态 ====================
const activeTab = ref('graph')

// ==================== 关系类型定义 ====================
const relationTypes = [
  { value: 'causal', label: '因果', color: '#e6a23c', lineStyle: 'solid' },
  { value: 'parallel', label: '并行', color: '#409eff', lineStyle: 'dashed' },
  { value: 'flashback', label: '回忆', color: '#909399', lineStyle: 'dotted' },
  { value: 'foreshadow', label: '伏笔', color: '#f56c6c', lineStyle: 'dash-dot' },
  { value: 'twist', label: '转折', color: '#67c23a', lineStyle: 'solid' }
]

// ==================== 关系图谱数据 ====================
const graphNodes = ref([])
const graphEdges = ref([])
const aiAnalyzing = ref(false)

const showAddNodeDialog = ref(false)
const showAddEdgeDialog = ref(false)
const newNode = reactive({ label: '', wordCount: 0 })
const newEdge = reactive({ source: '', target: '', relationType: 'causal' })

function onNodesChange(changes) {
  // VueFlow 自动处理节点变更
}
function onEdgesChange(changes) {
  // VueFlow 自动处理边变更
}
function onConnect(params) {
  const rt = relationTypes[0]
  graphEdges.value.push({
    ...params,
    id: `e-${params.source}-${params.target}`,
    type: 'smoothstep',
    label: rt.label,
    style: { stroke: rt.color, strokeWidth: 2 },
    labelStyle: { fill: rt.color, fontSize: 12 },
    animated: rt.value === 'causal'
  })
}
function addNode() {
  if (!newNode.label.trim()) {
    ElMessage.warning('请输入章节标题')
    return
  }
  const id = `node-${Date.now()}`
  graphNodes.value.push({
    id,
    label: newNode.label,
    wordCount: newNode.wordCount,
    position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    style: {
      background: 'var(--primary-color)',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      minWidth: '120px',
      textAlign: 'center'
    }
  })
  newNode.label = ''
  newNode.wordCount = 0
  showAddNodeDialog.value = false
  ElMessage.success('节点已添加')
}
function addEdge() {
  if (!newEdge.source || !newEdge.target) {
    ElMessage.warning('请选择源章节和目标章节')
    return
  }
  if (newEdge.source === newEdge.target) {
    ElMessage.warning('源章节和目标章节不能相同')
    return
  }
  const rt = relationTypes.find(r => r.value === newEdge.relationType) || relationTypes[0]
  graphEdges.value.push({
    id: `e-${newEdge.source}-${newEdge.target}-${Date.now()}`,
    source: newEdge.source,
    target: newEdge.target,
    type: 'smoothstep',
    label: rt.label,
    style: { stroke: rt.color, strokeWidth: 2 },
    labelStyle: { fill: rt.color, fontSize: 12 },
    animated: rt.value === 'causal'
  })
  newEdge.source = ''
  newEdge.target = ''
  newEdge.relationType = 'causal'
  showAddEdgeDialog.value = false
  ElMessage.success('关系已添加')
}
async function handleAiAnalyze() {
  aiAnalyzing.value = true
  try {
    // 模拟 AI 分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('AI 分析完成，已自动识别章节关系')
  } catch (e) {
    ElMessage.error('AI 分析失败')
  } finally {
    aiAnalyzing.value = false
  }
}

// ==================== 时间线数据 ====================
const timelineEvents = ref([])
const timelineZoom = ref('month')
const showAddEventDialog = ref(false)
const newEvent = reactive({
  title: '', storyTimestamp: '', type: 'plot', description: '',
  location: '', characterIdsText: '', chapterId: ''
})

const sortedTimelineEvents = computed(() => {
  return [...timelineEvents.value].sort((a, b) => a.order - b.order)
})

function getEventTypeName(type) {
  const map = {
    plot: '情节', character: '角色', relationship: '关系', world: '世界观',
    flashback: '闪回', foreshadow: '伏笔', climax: '高潮', turning_point: '转折'
  }
  return map[type] || type
}
function getEventTypeTag(type) {
  const map = {
    plot: '', character: 'success', relationship: 'warning', world: 'info',
    flashback: 'info', foreshadow: 'danger', climax: 'danger', turning_point: 'success'
  }
  return map[type] || ''
}
function addTimelineEvent() {
  if (!newEvent.title.trim()) {
    ElMessage.warning('请输入事件标题')
    return
  }
  timelineEvents.value.push({
    id: `evt-${Date.now()}`,
    title: newEvent.title,
    storyTimestamp: newEvent.storyTimestamp || '未知时间',
    type: newEvent.type,
    description: newEvent.description,
    location: newEvent.location,
    characterIds: newEvent.characterIdsText ? newEvent.characterIdsText.split(/[、,，]/).filter(Boolean) : [],
    chapterId: newEvent.chapterId,
    color: '',
    order: timelineEvents.value.length + 1
  })
  Object.assign(newEvent, {
    title: '', storyTimestamp: '', type: 'plot', description: '',
    location: '', characterIdsText: '', chapterId: ''
  })
  showAddEventDialog.value = false
  ElMessage.success('事件已添加')
}
function editTimelineEvent(event) {
  Object.assign(newEvent, {
    title: event.title,
    storyTimestamp: event.storyTimestamp,
    type: event.type,
    description: event.description,
    location: event.location || '',
    characterIdsText: (event.characterIds || []).join('、'),
    chapterId: event.chapterId || ''
  })
  showAddEventDialog.value = true
  // 删除原事件，保存时重新添加
  timelineEvents.value = timelineEvents.value.filter(e => e.id !== event.id)
}
function deleteTimelineEvent(id) {
  ElMessageBox.confirm('确定删除该事件？', '提示', { type: 'warning' }).then(() => {
    timelineEvents.value = timelineEvents.value.filter(e => e.id !== id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// ==================== 故事线数据 ====================
const storylines = ref([])
const showAddStorylineDialog = ref(false)
const editingStoryline = ref(null)
const storylineForm = reactive({ name: '', color: '#409eff', chapters: [] })

const storyTemplates = computed(() => Object.values(STORY_TEMPLATES))
const allChapters = computed(() => graphNodes.value.map(n => ({ id: n.id, title: n.label })))
const ganttChapters = computed(() => allChapters.value)

function getChapterTitle(id) {
  const ch = allChapters.value.find(c => c.id === id)
  return ch ? ch.title : id
}
function applyTemplate(templateId) {
  const tpl = STORY_TEMPLATES[templateId]
  if (!tpl) return
  // 根据模板生成故事线
  const lines = tpl.acts.map(act => ({
    id: `sl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: act.name,
    color: getRandomColor(),
    chapters: []
  }))
  storylines.value.push(...lines)
  ElMessage.success(`已应用模板：${tpl.label}`)
}
function getRandomColor() {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb', '#36cfc9']
  return colors[Math.floor(Math.random() * colors.length)]
}
function editStoryline(line) {
  editingStoryline.value = line
  storylineForm.name = line.name
  storylineForm.color = line.color
  storylineForm.chapters = [...line.chapters]
  showAddStorylineDialog.value = true
}
function saveStoryline() {
  if (!storylineForm.name.trim()) {
    ElMessage.warning('请输入故事线名称')
    return
  }
  if (editingStoryline.value) {
    Object.assign(editingStoryline.value, {
      name: storylineForm.name,
      color: storylineForm.color,
      chapters: [...storylineForm.chapters]
    })
    editingStoryline.value = null
  } else {
    storylines.value.push({
      id: `sl-${Date.now()}`,
      name: storylineForm.name,
      color: storylineForm.color,
      chapters: [...storylineForm.chapters]
    })
  }
  storylineForm.name = ''
  storylineForm.color = '#409eff'
  storylineForm.chapters = []
  showAddStorylineDialog.value = false
  ElMessage.success('故事线已保存')
}
function deleteStoryline(id) {
  ElMessageBox.confirm('确定删除该故事线？', '提示', { type: 'warning' }).then(() => {
    storylines.value = storylines.value.filter(l => l.id !== id)
    ElMessage.success('已删除')
  }).catch(() => {})
}
function removeChapterFromStoryline(lineId, chId) {
  const line = storylines.value.find(l => l.id === lineId)
  if (line) {
    line.chapters = line.chapters.filter(c => c !== chId)
  }
}

// ==================== 加载示例数据 ====================
function handleLoadDemoData() {
  const demoChapters = [
    { id: 'ch1', label: '第一章 命运的起点', wordCount: 3200 },
    { id: 'ch2', label: '第二章 暗流涌动', wordCount: 2800 },
    { id: 'ch3', label: '第三章 意外相遇', wordCount: 3500 },
    { id: 'ch4', label: '第四章 真相浮现', wordCount: 3100 },
    { id: 'ch5', label: '第五章 最终对决', wordCount: 4000 },
    { id: 'ch6', label: '第六章 新的开始', wordCount: 2600 }
  ]
  graphNodes.value = demoChapters.map((ch, i) => ({
    id: ch.id,
    label: ch.label,
    wordCount: ch.wordCount,
    position: { x: i * 220 + 50, y: 100 + Math.sin(i) * 80 },
    style: {
      background: 'var(--primary-color)',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      minWidth: '160px',
      textAlign: 'center'
    }
  }))
  graphEdges.value = [
    { id: 'e-ch1-ch2', source: 'ch1', target: 'ch2', type: 'smoothstep', label: '因果', style: { stroke: '#e6a23c', strokeWidth: 2 }, labelStyle: { fill: '#e6a23c', fontSize: 12 }, animated: true },
    { id: 'e-ch2-ch3', source: 'ch2', target: 'ch3', type: 'smoothstep', label: '转折', style: { stroke: '#67c23a', strokeWidth: 2 }, labelStyle: { fill: '#67c23a', fontSize: 12 } },
    { id: 'e-ch1-ch4', source: 'ch1', target: 'ch4', type: 'smoothstep', label: '伏笔', style: { stroke: '#f56c6c', strokeWidth: 2, strokeDasharray: '8 4' }, labelStyle: { fill: '#f56c6c', fontSize: 12 } },
    { id: 'e-ch3-ch5', source: 'ch3', target: 'ch5', type: 'smoothstep', label: '因果', style: { stroke: '#e6a23c', strokeWidth: 2 }, labelStyle: { fill: '#e6a23c', fontSize: 12 }, animated: true },
    { id: 'e-ch2-ch4', source: 'ch2', target: 'ch4', type: 'smoothstep', label: '并行', style: { stroke: '#409eff', strokeWidth: 2, strokeDasharray: '6 3' }, labelStyle: { fill: '#409eff', fontSize: 12 } },
    { id: 'e-ch5-ch6', source: 'ch5', target: 'ch6', type: 'smoothstep', label: '因果', style: { stroke: '#e6a23c', strokeWidth: 2 }, labelStyle: { fill: '#e6a23c', fontSize: 12 }, animated: true }
  ]
  timelineEvents.value = [
    { id: 'evt1', title: '主角发现神秘信件', storyTimestamp: '第一年春天', type: 'plot', description: '主角在阁楼发现一封来自已故父亲的神秘信件', location: '老宅阁楼', characterIds: ['主角'], chapterId: '第一章', order: 1 },
    { id: 'evt2', title: '暗杀阴谋启动', storyTimestamp: '第一年夏天', type: 'plot', description: '反派暗中策划对主角的暗杀行动', location: '城市暗巷', characterIds: ['反派'], chapterId: '第二章', order: 2 },
    { id: 'evt3', title: '童年回忆闪回', storyTimestamp: '十年前', type: 'flashback', description: '主角回忆起与父亲的最后对话', location: '海边', characterIds: ['主角', '父亲'], chapterId: '第三章', order: 3 },
    { id: 'evt4', title: '真相大白', storyTimestamp: '第一年秋天', type: 'turning_point', description: '主角发现父亲的真实身份和隐藏的秘密', location: '档案馆', characterIds: ['主角'], chapterId: '第四章', order: 4 },
    { id: 'evt5', title: '最终对决', storyTimestamp: '第一年冬天', type: 'climax', description: '主角与反派在废弃工厂展开最终对决', location: '废弃工厂', characterIds: ['主角', '反派'], chapterId: '第五章', order: 5 }
  ]
  storylines.value = [
    { id: 'sl-main', name: '主线：寻父之路', color: '#409eff', chapters: ['ch1', 'ch2', 'ch4', 'ch5', 'ch6'] },
    { id: 'sl-love', name: '副线：爱情萌芽', color: '#f56c6c', chapters: ['ch3', 'ch5', 'ch6'] },
    { id: 'sl-revenge', name: '暗线：复仇计划', color: '#e6a23c', chapters: ['ch2', 'ch4', 'ch5'] }
  ]
  ElMessage.success('示例数据已加载')
}
</script>

<style scoped>
.chapter-graph {
  padding: 20px;
  background: var(--bg-color, #f5f7fa);
  min-height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-color, #303133);
}
.graph-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
}
.graph-legend {
  display: flex;
  gap: 16px;
  margin-left: auto;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}
.legend-line {
  display: inline-block;
  width: 30px;
  border-top: 2px solid #ccc;
}
.graph-container {
  height: 500px;
  background: #fafafa;
  border-radius: 4px;
}
.timeline-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.timeline-container {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}
.timeline-card {
  max-width: 600px;
}
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.event-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color, #303133);
}
.event-desc {
  margin: 8px 0;
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
}
.event-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
  flex-wrap: wrap;
}
.event-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.event-actions {
  margin-top: 8px;
  text-align: right;
}
.storyline-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.storyline-list {
  padding: 16px;
}
.storyline-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.storyline-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.storyline-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.storyline-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color, #303133);
  flex: 1;
}
.storyline-actions {
  display: flex;
  gap: 4px;
}
.gantt-chart {
  display: flex;
  margin-bottom: 12px;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
}
.gantt-labels {
  flex-shrink: 0;
  width: 140px;
}
.gantt-label {
  height: 28px;
  line-height: 28px;
  padding: 0 8px;
  font-size: 12px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gantt-bars {
  flex: 1;
  overflow-x: auto;
}
.gantt-row {
  height: 28px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
}
.gantt-bar {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 8px;
  right: 8px;
  border-radius: 4px;
  opacity: 0.7;
}
.storyline-chapters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>

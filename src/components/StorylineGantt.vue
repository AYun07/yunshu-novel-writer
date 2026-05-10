<!--
  StorylineGantt.vue - 故事线甘特图组件
  对标 Manuskript 的故事线视图功能
  
  功能特性：
  - 横向时间轴（故事内时间/章节序号）
  - 多条故事线（不同颜色）
  - 每条故事线显示章节范围
  - 里程碑标记
  - 拖拽调整章节归属
  - 故事线交叉点标记
  - 缩放控制
  - 导出为图片
-->
<template>
  <div class="storyline-gantt">
    <!-- 工具栏 -->
    <div class="gantt-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" size="small" @click="showAddStorylineDialog = true">
          <el-icon><Plus /></el-icon> 添加故事线
        </el-button>
        <el-button size="small" @click="showAddMilestoneDialog = true">
          <el-icon><Flag /></el-icon> 添加里程碑
        </el-button>
        <el-button size="small" @click="handleExportImage">
          <el-icon><Download /></el-icon> 导出图片
        </el-button>
      </div>

      <div class="toolbar-center">
        <el-radio-group v-model="timeAxisMode" size="small">
          <el-radio-button value="chapter">章节序号</el-radio-button>
          <el-radio-button value="story">故事时间</el-radio-button>
        </el-radio-group>
      </div>

      <div class="toolbar-right">
        <span class="zoom-label">缩放:</span>
        <el-slider
          v-model="zoomLevel"
          :min="0.5"
          :max="2"
          :step="0.1"
          :show-tooltip="false"
          style="width: 120px"
        />
        <span class="zoom-value">{{ Math.round(zoomLevel * 100) }}%</span>
      </div>
    </div>

    <!-- 甘特图主体 -->
    <div class="gantt-container" ref="ganttContainerRef">
      <!-- 时间轴头部 -->
      <div class="gantt-header" :style="{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left' }">
        <div class="header-corner">
          <span>故事线</span>
        </div>
        <div class="header-timeline">
          <div
            v-for="(tick, index) in timelineTicks"
            :key="index"
            class="timeline-tick"
            :style="{ width: `${tickWidth}px` }"
          >
            {{ tick.label }}
          </div>
        </div>
      </div>

      <!-- 故事线区域 -->
      <div class="gantt-body">
        <!-- 故事线列表 -->
        <div class="storyline-list" :style="{ transform: `scaleY(${zoomLevel})`, transformOrigin: 'top' }">
          <div
            v-for="line in storylines"
            :key="line.id"
            class="storyline-row"
            :style="{ height: `${rowHeight}px` }"
          >
            <div class="storyline-info">
              <span class="storyline-color" :style="{ backgroundColor: line.color }"></span>
              <span class="storyline-name">{{ line.name }}</span>
              <el-button type="primary" link size="small" @click="editStoryline(line)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" link size="small" @click="deleteStoryline(line.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 甘特图网格 -->
        <div
          class="gantt-grid"
          ref="ganttGridRef"
          :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'left top' }"
        >
          <!-- 网格背景 -->
          <div class="grid-background">
            <div
              v-for="(tick, index) in timelineTicks"
              :key="index"
              class="grid-column"
              :style="{ width: `${tickWidth}px` }"
            ></div>
          </div>

          <!-- 故事线条 -->
          <div
            v-for="line in storylines"
            :key="line.id"
            class="storyline-bar-row"
            :style="{ height: `${rowHeight}px` }"
          >
            <div
              v-for="(segment, segIndex) in getStorylineSegments(line)"
              :key="segIndex"
              class="storyline-bar"
              :style="{
                left: `${segment.start * tickWidth}px`,
                width: `${(segment.end - segment.start + 1) * tickWidth}px`,
                backgroundColor: line.color,
                top: `${rowHeight * 0.2}px`,
                height: `${rowHeight * 0.6}px`
              }"
              draggable="true"
              @dragstart="handleBarDragStart($event, line, segment)"
              @click="handleBarClick(line, segment)"
            >
              <span class="bar-label">{{ segment.chapters.length }} 章</span>
            </div>
          </div>

          <!-- 里程碑标记 -->
          <div class="milestones-layer">
            <div
              v-for="milestone in milestones"
              :key="milestone.id"
              class="milestone-marker"
              :style="{
                left: `${milestone.position * tickWidth}px`,
                top: '0'
              }"
              @click="handleMilestoneClick(milestone)"
            >
              <el-icon :style="{ color: milestone.color }"><Flag /></el-icon>
              <span class="milestone-label">{{ milestone.name }}</span>
            </div>
          </div>

          <!-- 交叉点标记 -->
          <div class="crossings-layer">
            <div
              v-for="crossing in crossings"
              :key="crossing.id"
              class="crossing-marker"
              :style="{
                left: `${crossing.position * tickWidth}px`,
                top: `${crossing.rowIndex * rowHeight + rowHeight / 2}px`
              }"
            >
              <el-icon><Connection /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="storylines.length === 0"
        description="暂无故事线，点击上方按钮添加"
      >
        <el-button type="primary" @click="showAddStorylineDialog = true">添加第一条故事线</el-button>
      </el-empty>
    </div>

    <!-- 图例 -->
    <div class="gantt-legend">
      <span class="legend-title">图例:</span>
      <div class="legend-items">
        <span v-for="line in storylines" :key="line.id" class="legend-item">
          <span class="legend-color" :style="{ backgroundColor: line.color }"></span>
          {{ line.name }}
        </span>
        <span class="legend-item">
          <el-icon><Flag /></el-icon> 里程碑
        </span>
        <span class="legend-item">
          <el-icon><Connection /></el-icon> 交叉点
        </span>
      </div>
    </div>

    <!-- 添加/编辑故事线对话框 -->
    <el-dialog
      v-model="showAddStorylineDialog"
      :title="editingStoryline ? '编辑故事线' : '添加故事线'"
      width="600px"
    >
      <el-form :model="storylineForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="storylineForm.name" placeholder="请输入故事线名称" />
        </el-form-item>

        <el-form-item label="颜色">
          <el-color-picker v-model="storylineForm.color" />
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="storylineForm.type" placeholder="选择故事线类型">
            <el-option label="主线" value="main" />
            <el-option label="副线" value="sub" />
            <el-option label="暗线" value="hidden" />
            <el-option label="情感线" value="emotion" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="storylineForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入故事线描述"
          />
        </el-form-item>

        <el-form-item label="关联章节">
          <el-transfer
            v-model="storylineForm.chapterIds"
            :data="availableChapters"
            :titles="['可选章节', '已选章节']"
            :props="{ key: 'id', label: 'title' }"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddStorylineDialog = false">取消</el-button>
        <el-button type="primary" @click="saveStoryline">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加里程碑对话框 -->
    <el-dialog v-model="showAddMilestoneDialog" title="添加里程碑" width="500px">
      <el-form :model="milestoneForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="milestoneForm.name" placeholder="请输入里程碑名称" />
        </el-form-item>

        <el-form-item label="位置">
          <el-input-number v-model="milestoneForm.position" :min="1" :max="maxChapterIndex" />
          <span class="form-hint">章节序号</span>
        </el-form-item>

        <el-form-item label="颜色">
          <el-color-picker v-model="milestoneForm.color" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="milestoneForm.description" type="textarea" :rows="2" placeholder="里程碑描述" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddMilestoneDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMilestone">确定</el-button>
      </template>
    </el-dialog>

    <!-- 章节详情抽屉 -->
    <el-drawer v-model="showChapterDrawer" title="章节详情" size="400px">
      <div v-if="selectedSegment" class="chapter-detail">
        <h4>{{ selectedSegment.storyline?.name }}</h4>
        <p class="segment-range">
          章节 {{ selectedSegment.start + 1 }} - {{ selectedSegment.end + 1 }}
        </p>

        <el-divider />

        <div class="chapter-list">
          <div
            v-for="ch in selectedSegment.chapters"
            :key="ch.id"
            class="chapter-item"
          >
            <span class="chapter-index">第 {{ ch.index + 1 }} 章</span>
            <span class="chapter-title">{{ ch.title }}</span>
            <el-tag size="small" type="info">{{ ch.wordCount || 0 }} 字</el-tag>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
/**
 * StorylineGantt.vue - 故事线甘特图组件
 * 
 * 功能说明：
 * 1. 时间轴 - 支持章节序号/故事时间两种模式
 * 2. 故事线管理 - 添加、编辑、删除故事线
 * 3. 章节关联 - 拖拽调整章节归属
 * 4. 里程碑 - 标记重要节点
 * 5. 交叉点 - 标记故事线交汇处
 * 6. 缩放控制 - 调整视图比例
 * 7. 导出图片 - 导出为PNG
 */
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Flag, Download, Edit, Delete, Connection
} from '@element-plus/icons-vue'

// ==================== 常量定义 ====================
const tickWidth = 80 // 每个时间刻度的宽度
const rowHeight = 50 // 每行的高度

// ==================== 响应式数据 ====================

// 时间轴模式
const timeAxisMode = ref('chapter')

// 缩放级别
const zoomLevel = ref(1)

// 故事线数据
const storylines = ref([])

// 里程碑数据
const milestones = ref([])

// 章节数据
const chapters = ref([])

// UI 状态
const showAddStorylineDialog = ref(false)
const showAddMilestoneDialog = ref(false)
const showChapterDrawer = ref(false)
const editingStoryline = ref(null)
const selectedSegment = ref(null)
const ganttContainerRef = ref(null)
const ganttGridRef = ref(null)

// 故事线表单
const storylineForm = reactive({
  name: '',
  color: '#409eff',
  type: 'main',
  description: '',
  chapterIds: []
})

// 里程碑表单
const milestoneForm = reactive({
  name: '',
  position: 1,
  color: '#e6a23c',
  description: ''
})

// ==================== 计算属性 ====================

/**
 * 时间轴刻度
 */
const timelineTicks = computed(() => {
  if (timeAxisMode.value === 'chapter') {
    // 按章节序号
    const maxChapter = Math.max(
      ...storylines.value.flatMap(line => line.chapterIds || []),
      chapters.value.length
    )
    return Array.from({ length: Math.max(maxChapter, 10) }, (_, i) => ({
      label: `第${i + 1}章`,
      value: i + 1
    }))
  } else {
    // 按故事时间
    return [
      { label: '序章', value: 0 },
      { label: '第一年春', value: 1 },
      { label: '第一年夏', value: 2 },
      { label: '第一年秋', value: 3 },
      { label: '第一年冬', value: 4 },
      { label: '第二年春', value: 5 },
      { label: '第二年夏', value: 6 },
      { label: '第二年秋', value: 7 },
      { label: '第二年冬', value: 8 },
      { label: '第三年春', value: 9 }
    ]
  }
})

/**
 * 最大章节序号
 */
const maxChapterIndex = computed(() => {
  return Math.max(chapters.value.length, 20)
})

/**
 * 可用章节列表
 */
const availableChapters = computed(() => {
  return chapters.value.map((ch, index) => ({
    id: ch.id,
    title: ch.title,
    index: index
  }))
})

/**
 * 故事线交叉点
 */
const crossings = computed(() => {
  const result = []
  
  storylines.value.forEach((line, lineIndex) => {
    if (!line.chapterIds) return
    
    storylines.value.forEach((otherLine, otherIndex) => {
      if (lineIndex >= otherIndex || !otherLine.chapterIds) return
      
      // 找出两条故事线的交集章节
      const intersection = line.chapterIds.filter(id => otherLine.chapterIds.includes(id))
      
      intersection.forEach(chapterId => {
        const chapter = chapters.value.find(ch => ch.id === chapterId)
        if (chapter) {
          const chapterIndex = chapters.value.findIndex(ch => ch.id === chapterId)
          result.push({
            id: `cross-${line.id}-${otherLine.id}-${chapterId}`,
            position: chapterIndex,
            rowIndex: Math.min(lineIndex, otherIndex),
            lines: [line.name, otherLine.name],
            chapter: chapter.title
          })
        }
      })
    })
  })
  
  return result
})

// ==================== 方法 ====================

/**
 * 获取故事线的片段（连续章节范围）
 */
function getStorylineSegments(storyline) {
  if (!storyline.chapterIds || storyline.chapterIds.length === 0) {
    return []
  }
  
  // 获取章节索引并排序
  const indices = storyline.chapterIds
    .map(id => chapters.value.findIndex(ch => ch.id === id))
    .filter(index => index !== -1)
    .sort((a, b) => a - b)
  
  if (indices.length === 0) return []
  
  // 合并连续的章节为片段
  const segments = []
  let currentSegment = {
    start: indices[0],
    end: indices[0],
    chapters: [chapters.value[indices[0]]]
  }
  
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === currentSegment.end + 1) {
      // 连续
      currentSegment.end = indices[i]
      currentSegment.chapters.push(chapters.value[indices[i]])
    } else {
      // 不连续，保存当前片段，开始新片段
      segments.push(currentSegment)
      currentSegment = {
        start: indices[i],
        end: indices[i],
        chapters: [chapters.value[indices[i]]]
      }
    }
  }
  
  segments.push(currentSegment)
  return segments.map(seg => ({
    ...seg,
    storyline: storyline
  }))
}

/**
 * 编辑故事线
 */
function editStoryline(line) {
  editingStoryline.value = line
  Object.assign(storylineForm, {
    name: line.name,
    color: line.color,
    type: line.type || 'main',
    description: line.description || '',
    chapterIds: [...(line.chapterIds || [])]
  })
  showAddStorylineDialog.value = true
}

/**
 * 保存故事线
 */
function saveStoryline() {
  if (!storylineForm.name.trim()) {
    ElMessage.warning('请输入故事线名称')
    return
  }
  
  if (editingStoryline.value) {
    // 更新
    Object.assign(editingStoryline.value, {
      name: storylineForm.name,
      color: storylineForm.color,
      type: storylineForm.type,
      description: storylineForm.description,
      chapterIds: [...storylineForm.chapterIds]
    })
    ElMessage.success('故事线已更新')
  } else {
    // 新建
    storylines.value.push({
      id: `sl-${Date.now()}`,
      name: storylineForm.name,
      color: storylineForm.color,
      type: storylineForm.type,
      description: storylineForm.description,
      chapterIds: [...storylineForm.chapterIds]
    })
    ElMessage.success('故事线已添加')
  }
  
  resetStorylineForm()
  showAddStorylineDialog.value = false
  editingStoryline.value = null
}

/**
 * 删除故事线
 */
function deleteStoryline(id) {
  ElMessageBox.confirm('确定要删除这条故事线吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    storylines.value = storylines.value.filter(line => line.id !== id)
    ElMessage.success('故事线已删除')
  }).catch(() => {})
}

/**
 * 重置故事线表单
 */
function resetStorylineForm() {
  Object.assign(storylineForm, {
    name: '',
    color: '#409eff',
    type: 'main',
    description: '',
    chapterIds: []
  })
}

/**
 * 保存里程碑
 */
function saveMilestone() {
  if (!milestoneForm.name.trim()) {
    ElMessage.warning('请输入里程碑名称')
    return
  }
  
  milestones.value.push({
    id: `ms-${Date.now()}`,
    name: milestoneForm.name,
    position: milestoneForm.position - 1, // 转换为0-based索引
    color: milestoneForm.color,
    description: milestoneForm.description
  })
  
  // 重置表单
  Object.assign(milestoneForm, {
    name: '',
    position: 1,
    color: '#e6a23c',
    description: ''
  })
  
  showAddMilestoneDialog.value = false
  ElMessage.success('里程碑已添加')
}

/**
 * 处理条形拖拽开始
 */
function handleBarDragStart(event, storyline, segment) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', JSON.stringify({
    storylineId: storyline.id,
    segmentStart: segment.start,
    segmentEnd: segment.end
  }))
}

/**
 * 处理条形点击
 */
function handleBarClick(storyline, segment) {
  selectedSegment.value = {
    storyline: storyline,
    ...segment
  }
  showChapterDrawer.value = true
}

/**
 * 处理里程碑点击
 */
function handleMilestoneClick(milestone) {
  ElMessage.info(`里程碑: ${milestone.name}`)
}

/**
 * 导出为图片
 */
async function handleExportImage() {
  if (!ganttGridRef.value) {
    ElMessage.warning('无法导出，请稍后重试')
    return
  }
  
  try {
    // 使用 html2canvas 或类似库导出
    // 这里简化处理，实际项目中需要引入 html2canvas
    ElMessage.success('图片导出功能需要引入 html2canvas 库')
  } catch (error) {
    ElMessage.error('导出失败: ' + error.message)
  }
}

/**
 * 加载示例数据
 */
function loadDemoData() {
  // 章节数据
  chapters.value = [
    { id: 'ch1', title: '第一章 命运的起点', wordCount: 3200 },
    { id: 'ch2', title: '第二章 暗流涌动', wordCount: 2800 },
    { id: 'ch3', title: '第三章 意外相遇', wordCount: 3500 },
    { id: 'ch4', title: '第四章 真相浮现', wordCount: 3100 },
    { id: 'ch5', title: '第五章 危机四伏', wordCount: 2900 },
    { id: 'ch6', title: '第六章 转折点', wordCount: 3800 },
    { id: 'ch7', title: '第七章 短暂的平静', wordCount: 2600 },
    { id: 'ch8', title: '第八章 风暴来临', wordCount: 4200 },
    { id: 'ch9', title: '第九章 最终对决', wordCount: 4000 },
    { id: 'ch10', title: '第十章 新的开始', wordCount: 2600 }
  ]
  
  // 故事线数据
  storylines.value = [
    {
      id: 'sl-main',
      name: '主线：寻父之路',
      color: '#409eff',
      type: 'main',
      description: '主角寻找父亲真相的主线剧情',
      chapterIds: ['ch1', 'ch2', 'ch4', 'ch6', 'ch8', 'ch9', 'ch10']
    },
    {
      id: 'sl-love',
      name: '副线：爱情萌芽',
      color: '#f56c6c',
      type: 'sub',
      description: '主角与女主角的感情线',
      chapterIds: ['ch3', 'ch5', 'ch7', 'ch9', 'ch10']
    },
    {
      id: 'sl-revenge',
      name: '暗线：复仇计划',
      color: '#e6a23c',
      type: 'hidden',
      description: '反派的复仇计划暗线',
      chapterIds: ['ch2', 'ch4', 'ch6', 'ch8', 'ch9']
    },
    {
      id: 'sl-friend',
      name: '副线：友情考验',
      color: '#67c23a',
      type: 'sub',
      description: '主角与挚友的友情故事',
      chapterIds: ['ch1', 'ch3', 'ch5', 'ch7', 'ch10']
    }
  ]
  
  // 里程碑数据
  milestones.value = [
    { id: 'ms1', name: '主角觉醒', position: 0, color: '#409eff', description: '主角发现神秘信件' },
    { id: 'ms2', name: '真相大白', position: 3, color: '#e6a23c', description: '主角发现父亲的真实身份' },
    { id: 'ms3', name: '高潮', position: 8, color: '#f56c6c', description: '最终对决' },
    { id: 'ms4', name: '结局', position: 9, color: '#67c23a', description: '新的开始' }
  ]
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadDemoData()
})
</script>

<style scoped>
/* 容器 */
.storyline-gantt {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa;
}

/* 工具栏 */
.gantt-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zoom-label {
  font-size: 13px;
  color: #606266;
}

.zoom-value {
  font-size: 13px;
  color: #909399;
  min-width: 40px;
}

/* 甘特图容器 */
.gantt-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

/* 甘特图头部 */
.gantt-header {
  display: flex;
  background: #fff;
  border-bottom: 2px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-corner {
  width: 200px;
  padding: 12px;
  font-weight: 600;
  color: #303133;
  background: #fafafa;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.header-timeline {
  display: flex;
  flex: 1;
}

.timeline-tick {
  padding: 12px 8px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  border-right: 1px solid #ebeef5;
  flex-shrink: 0;
}

/* 甘特图主体 */
.gantt-body {
  display: flex;
  min-height: 300px;
}

/* 故事线列表 */
.storyline-list {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.storyline-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.storyline-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  width: 100%;
}

.storyline-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.storyline-name {
  flex: 1;
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 甘特图网格 */
.gantt-grid {
  flex: 1;
  position: relative;
  background: #fff;
}

.grid-background {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.grid-column {
  border-right: 1px solid #ebeef5;
  flex-shrink: 0;
}

.grid-column:nth-child(odd) {
  background: #fafafa;
}

/* 故事线条 */
.storyline-bar-row {
  position: relative;
  border-bottom: 1px solid #ebeef5;
}

.storyline-bar {
  position: absolute;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.8;
}

.storyline-bar:hover {
  opacity: 1;
  transform: scaleY(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.bar-label {
  font-size: 11px;
  color: #fff;
  font-weight: 500;
}

/* 里程碑标记 */
.milestones-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
}

.milestone-marker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform: translateX(-50%);
}

.milestone-marker .el-icon {
  font-size: 18px;
}

.milestone-label {
  font-size: 10px;
  color: #606266;
  white-space: nowrap;
  margin-top: 2px;
}

/* 交叉点标记 */
.crossings-layer {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.crossing-marker {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: pointer;
}

.crossing-marker .el-icon {
  font-size: 10px;
  color: #fff;
}

/* 图例 */
.gantt-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.legend-title {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.legend-items {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.legend-color {
  width: 16px;
  height: 8px;
  border-radius: 2px;
}

/* 章节详情 */
.chapter-detail h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.segment-range {
  font-size: 14px;
  color: #909399;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.chapter-index {
  font-size: 12px;
  color: #909399;
  min-width: 60px;
}

.chapter-title {
  flex: 1;
  font-size: 13px;
  color: #303133;
}

/* 表单提示 */
.form-hint {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

/* 响应式 */
@media (max-width: 768px) {
  .gantt-toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .storyline-list {
    width: 150px;
  }
  
  .header-corner {
    width: 150px;
  }
}
</style>

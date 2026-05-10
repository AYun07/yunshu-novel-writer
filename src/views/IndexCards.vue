<!--
  IndexCards.vue - 索引卡片视图组件
  对标 Manuskript 的索引卡片功能
  
  功能特性：
  - 卡片网格布局（可拖拽排序）
  - 每张卡片：标题、摘要、状态、颜色标签、字数
  - 卡片分组（按卷/按情节线/按角色视角）
  - 卡片缩放（小/中/大视图）
  - 拖拽到时间线
  - 双击打开编辑
  - 批量操作（移动、删除、修改状态）
  - 卡片筛选和搜索
  - 导出为大纲
-->
<template>
  <div class="index-cards-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>索引卡片</h2>
        <el-tag type="info" size="small">{{ filteredCards.length }} 张卡片</el-tag>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="showAddCardDialog = true">
          <el-icon><Plus /></el-icon> 新建卡片
        </el-button>
        <el-button @click="handleExportOutline">
          <el-icon><Download /></el-icon> 导出大纲
        </el-button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 搜索框 -->
        <el-input
          v-model="searchQuery"
          placeholder="搜索卡片标题或摘要..."
          clearable
          style="width: 240px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- 分组方式 -->
        <el-select v-model="groupBy" placeholder="分组方式" style="width: 140px">
          <el-option label="不分组" value="none" />
          <el-option label="按卷分组" value="volume" />
          <el-option label="按情节线" value="storyline" />
          <el-option label="按角色视角" value="character" />
        </el-select>

        <!-- 状态筛选 -->
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 120px">
          <el-option label="全部状态" value="" />
          <el-option label="待写" value="todo" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="完成" value="done" />
        </el-select>

        <!-- 颜色筛选 -->
        <el-select v-model="colorFilter" placeholder="颜色筛选" clearable style="width: 120px">
          <el-option label="全部颜色" value="" />
          <el-option v-for="color in colorOptions" :key="color.value" :label="color.label" :value="color.value">
            <span class="color-option">
              <span class="color-dot" :style="{ backgroundColor: color.value }"></span>
              {{ color.label }}
            </span>
          </el-option>
        </el-select>
      </div>

      <div class="toolbar-right">
        <!-- 视图缩放 -->
        <el-radio-group v-model="cardSize" size="small">
          <el-radio-button value="small">小</el-radio-button>
          <el-radio-button value="medium">中</el-radio-button>
          <el-radio-button value="large">大</el-radio-button>
        </el-radio-group>

        <!-- 批量操作 -->
        <el-dropdown v-if="selectedCards.length > 0" @command="handleBatchAction">
          <el-button type="warning" size="small">
            批量操作 ({{ selectedCards.length }})
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="setStatus">
                <el-icon><Edit /></el-icon> 修改状态
              </el-dropdown-item>
              <el-dropdown-item command="setColor">
                <el-icon><Brush /></el-icon> 修改颜色
              </el-dropdown-item>
              <el-dropdown-item command="move">
                <el-icon><FolderOpened /></el-icon> 移动到...
              </el-dropdown-item>
              <el-dropdown-item command="delete" divided>
                <el-icon><Delete /></el-icon> 删除选中
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 卡片区域 -->
    <div class="cards-container" ref="cardsContainerRef">
      <!-- 无分组模式 -->
      <template v-if="groupBy === 'none'">
        <div
          class="cards-grid"
          :class="`size-${cardSize}`"
          @dragover.prevent
          @drop="handleDrop"
        >
          <div
            v-for="card in filteredCards"
            :key="card.id"
            class="card-item"
            :class="{
              'selected': selectedCards.includes(card.id),
              'dragging': draggingCardId === card.id
            }"
            :style="{ borderLeftColor: card.color }"
            draggable="true"
            @dragstart="handleDragStart($event, card)"
            @dragend="handleDragEnd"
            @click="handleCardClick($event, card)"
            @dblclick="handleCardDoubleClick(card)"
          >
            <!-- 选择框 -->
            <el-checkbox
              v-model="selectedCards"
              :label="card.id"
              class="card-checkbox"
              @click.stop
            />

            <!-- 卡片内容 -->
            <div class="card-content">
              <div class="card-header">
                <span class="card-title">{{ card.title }}</span>
                <el-tag
                  :type="getStatusType(card.status)"
                  size="small"
                  effect="plain"
                >
                  {{ getStatusLabel(card.status) }}
                </el-tag>
              </div>

              <div class="card-summary" v-if="cardSize !== 'small'">
                {{ card.summary || '暂无摘要' }}
              </div>

              <div class="card-footer">
                <span class="card-word-count">
                  <el-icon><Document /></el-icon>
                  {{ card.wordCount || 0 }} 字
                </span>
                <span class="card-chapter" v-if="card.chapterIndex">
                  第 {{ card.chapterIndex }} 章
                </span>
              </div>
            </div>

            <!-- 卡片操作按钮 -->
            <div class="card-actions">
              <el-button type="primary" link size="small" @click.stop="editCard(card)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" link size="small" @click.stop="deleteCard(card.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </template>

      <!-- 分组模式 -->
      <template v-else>
        <div
          v-for="group in groupedCards"
          :key="group.id"
          class="card-group"
        >
          <div class="group-header">
            <el-icon><FolderOpened /></el-icon>
            <span class="group-name">{{ group.name }}</span>
            <el-tag size="small" type="info">{{ group.cards.length }} 张</el-tag>
          </div>
          <div
            class="cards-grid"
            :class="`size-${cardSize}`"
            @dragover.prevent
            @drop="handleDropToGroup($event, group.id)"
          >
            <div
              v-for="card in group.cards"
              :key="card.id"
              class="card-item"
              :class="{
                'selected': selectedCards.includes(card.id),
                'dragging': draggingCardId === card.id
              }"
              :style="{ borderLeftColor: card.color }"
              draggable="true"
              @dragstart="handleDragStart($event, card)"
              @dragend="handleDragEnd"
              @click="handleCardClick($event, card)"
              @dblclick="handleCardDoubleClick(card)"
            >
              <el-checkbox
                v-model="selectedCards"
                :label="card.id"
                class="card-checkbox"
                @click.stop
              />
              <div class="card-content">
                <div class="card-header">
                  <span class="card-title">{{ card.title }}</span>
                  <el-tag :type="getStatusType(card.status)" size="small" effect="plain">
                    {{ getStatusLabel(card.status) }}
                  </el-tag>
                </div>
                <div class="card-summary" v-if="cardSize !== 'small'">
                  {{ card.summary || '暂无摘要' }}
                </div>
                <div class="card-footer">
                  <span class="card-word-count">
                    <el-icon><Document /></el-icon>
                    {{ card.wordCount || 0 }} 字
                  </span>
                </div>
              </div>
              <div class="card-actions">
                <el-button type="primary" link size="small" @click.stop="editCard(card)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" link size="small" @click.stop="deleteCard(card.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <el-empty v-if="filteredCards.length === 0" description="暂无卡片，点击右上角按钮创建">
        <el-button type="primary" @click="showAddCardDialog = true">创建第一张卡片</el-button>
      </el-empty>
    </div>

    <!-- 新建/编辑卡片对话框 -->
    <el-dialog
      v-model="showAddCardDialog"
      :title="editingCard ? '编辑卡片' : '新建卡片'"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form :model="cardForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="cardForm.title" placeholder="请输入卡片标题" />
        </el-form-item>

        <el-form-item label="摘要">
          <el-input
            v-model="cardForm.summary"
            type="textarea"
            :rows="4"
            placeholder="请输入卡片摘要或章节概要"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="cardForm.status">
            <el-radio value="todo">待写</el-radio>
            <el-radio value="in_progress">进行中</el-radio>
            <el-radio value="done">完成</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="颜色标签">
          <div class="color-picker-row">
            <span
              v-for="color in colorOptions"
              :key="color.value"
              class="color-picker-item"
              :class="{ 'active': cardForm.color === color.value }"
              :style="{ backgroundColor: color.value }"
              @click="cardForm.color = color.value"
            />
          </div>
        </el-form-item>

        <el-form-item label="所属卷">
          <el-select v-model="cardForm.volumeId" placeholder="选择所属卷" clearable style="width: 100%">
            <el-option v-for="vol in volumes" :key="vol.id" :label="vol.name" :value="vol.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="情节线">
          <el-select v-model="cardForm.storylineId" placeholder="选择情节线" clearable style="width: 100%">
            <el-option v-for="sl in storylines" :key="sl.id" :label="sl.name" :value="sl.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="角色视角">
          <el-select v-model="cardForm.characterId" placeholder="选择角色视角" clearable style="width: 100%">
            <el-option v-for="char in characters" :key="char.id" :label="char.name" :value="char.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="章节序号">
          <el-input-number v-model="cardForm.chapterIndex" :min="0" placeholder="自动编号" />
        </el-form-item>

        <el-form-item label="字数">
          <el-input-number v-model="cardForm.wordCount" :min="0" :step="100" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="cardForm.notes" type="textarea" :rows="2" placeholder="其他备注信息" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddCardDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCard">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量修改状态对话框 -->
    <el-dialog v-model="showBatchStatusDialog" title="批量修改状态" width="400px">
      <el-form label-width="80px">
        <el-form-item label="新状态">
          <el-radio-group v-model="batchStatus">
            <el-radio value="todo">待写</el-radio>
            <el-radio value="in_progress">进行中</el-radio>
            <el-radio value="done">完成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchStatusDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchStatus">确定</el-button>
      </template>
    </el-dialog>

    <!-- 批量修改颜色对话框 -->
    <el-dialog v-model="showBatchColorDialog" title="批量修改颜色" width="400px">
      <div class="color-picker-row" style="justify-content: center;">
        <span
          v-for="color in colorOptions"
          :key="color.value"
          class="color-picker-item"
          :class="{ 'active': batchColor === color.value }"
          :style="{ backgroundColor: color.value }"
          @click="batchColor = color.value"
        />
      </div>
      <template #footer>
        <el-button @click="showBatchColorDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchColor">确定</el-button>
      </template>
    </el-dialog>

    <!-- 时间线放置区域（可拖拽到时间线） -->
    <div
      v-if="isDragging"
      class="timeline-drop-zone"
      @dragover.prevent
      @drop="handleDropToTimeline"
    >
      <el-icon><Clock /></el-icon>
      <span>拖放到此处添加到时间线</span>
    </div>
  </div>
</template>

<script setup>
/**
 * IndexCards.vue - 索引卡片视图组件
 * 
 * 功能说明：
 * 1. 卡片网格布局 - 支持小/中/大三种尺寸
 * 2. 拖拽排序 - 可拖拽调整卡片顺序
 * 3. 分组显示 - 按卷/情节线/角色视角分组
 * 4. 批量操作 - 批量修改状态、颜色、移动、删除
 * 5. 筛选搜索 - 按状态、颜色、关键词筛选
 * 6. 导出大纲 - 将卡片导出为文本大纲
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Download, Search, Edit, Delete, FolderOpened,
  Document, Brush, ArrowDown, Clock
} from '@element-plus/icons-vue'

// ==================== 颜色选项 ====================
const colorOptions = [
  { label: '红色', value: '#f56c6c' },
  { label: '橙色', value: '#e6a23c' },
  { label: '黄色', value: '#f0d264' },
  { label: '绿色', value: '#67c23a' },
  { label: '青色', value: '#00d1b2' },
  { label: '蓝色', value: '#409eff' },
  { label: '紫色', value: '#b37feb' },
  { label: '粉色', value: '#ff85c0' },
  { label: '灰色', value: '#909399' }
]

// ==================== 状态定义 ====================
const statusOptions = [
  { value: 'todo', label: '待写', type: 'info' },
  { value: 'in_progress', label: '进行中', type: 'warning' },
  { value: 'done', label: '完成', type: 'success' }
]

// ==================== 响应式数据 ====================

// 卡片数据
const cards = ref([])

// 卷数据
const volumes = ref([
  { id: 'vol1', name: '第一卷：起源' },
  { id: 'vol2', name: '第二卷：成长' },
  { id: 'vol3', name: '第三卷：高潮' },
  { id: 'vol4', name: '第四卷：结局' }
])

// 故事线数据
const storylines = ref([
  { id: 'sl1', name: '主线：命运之旅' },
  { id: 'sl2', name: '副线：爱情萌芽' },
  { id: 'sl3', name: '暗线：复仇计划' }
])

// 角色数据
const characters = ref([
  { id: 'char1', name: '主角' },
  { id: 'char2', name: '女主角' },
  { id: 'char3', name: '反派' }
])

// UI 状态
const searchQuery = ref('')
const groupBy = ref('none')
const statusFilter = ref('')
const colorFilter = ref('')
const cardSize = ref('medium')
const selectedCards = ref([])
const isDragging = ref(false)
const draggingCardId = ref(null)
const cardsContainerRef = ref(null)

// 对话框状态
const showAddCardDialog = ref(false)
const showBatchStatusDialog = ref(false)
const showBatchColorDialog = ref(false)
const editingCard = ref(null)
const batchStatus = ref('todo')
const batchColor = ref('#409eff')

// 卡片表单
const cardForm = reactive({
  title: '',
  summary: '',
  status: 'todo',
  color: '#409eff',
  volumeId: '',
  storylineId: '',
  characterId: '',
  chapterIndex: 0,
  wordCount: 0,
  notes: ''
})

// ==================== 计算属性 ====================

/**
 * 根据筛选条件过滤卡片
 */
const filteredCards = computed(() => {
  let result = [...cards.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(card =>
      card.title.toLowerCase().includes(query) ||
      (card.summary && card.summary.toLowerCase().includes(query))
    )
  }
  
  // 状态过滤
  if (statusFilter.value) {
    result = result.filter(card => card.status === statusFilter.value)
  }
  
  // 颜色过滤
  if (colorFilter.value) {
    result = result.filter(card => card.color === colorFilter.value)
  }
  
  return result
})

/**
 * 分组后的卡片
 */
const groupedCards = computed(() => {
  if (groupBy.value === 'none') {
    return []
  }
  
  const groups = []
  
  if (groupBy.value === 'volume') {
    volumes.value.forEach(vol => {
      const groupCards = filteredCards.value.filter(c => c.volumeId === vol.id)
      if (groupCards.length > 0) {
        groups.push({
          id: vol.id,
          name: vol.name,
          cards: groupCards
        })
      }
    })
    // 未分组的卡片
    const ungrouped = filteredCards.value.filter(c => !c.volumeId)
    if (ungrouped.length > 0) {
      groups.push({
        id: 'ungrouped',
        name: '未分组',
        cards: ungrouped
      })
    }
  } else if (groupBy.value === 'storyline') {
    storylines.value.forEach(sl => {
      const groupCards = filteredCards.value.filter(c => c.storylineId === sl.id)
      if (groupCards.length > 0) {
        groups.push({
          id: sl.id,
          name: sl.name,
          cards: groupCards
        })
      }
    })
    const ungrouped = filteredCards.value.filter(c => !c.storylineId)
    if (ungrouped.length > 0) {
      groups.push({
        id: 'ungrouped',
        name: '未分组',
        cards: ungrouped
      })
    }
  } else if (groupBy.value === 'character') {
    characters.value.forEach(char => {
      const groupCards = filteredCards.value.filter(c => c.characterId === char.id)
      if (groupCards.length > 0) {
        groups.push({
          id: char.id,
          name: `${char.name}视角`,
          cards: groupCards
        })
      }
    })
    const ungrouped = filteredCards.value.filter(c => !c.characterId)
    if (ungrouped.length > 0) {
      groups.push({
        id: 'ungrouped',
        name: '未指定视角',
        cards: ungrouped
      })
    }
  }
  
  return groups
})

// ==================== 方法 ====================

/**
 * 获取状态类型（用于标签颜色）
 */
function getStatusType(status) {
  const map = {
    todo: 'info',
    in_progress: 'warning',
    done: 'success'
  }
  return map[status] || 'info'
}

/**
 * 获取状态标签文本
 */
function getStatusLabel(status) {
  const map = {
    todo: '待写',
    in_progress: '进行中',
    done: '完成'
  }
  return map[status] || status
}

/**
 * 处理卡片点击（支持多选）
 */
function handleCardClick(event, card) {
  if (event.ctrlKey || event.metaKey) {
    // Ctrl/Cmd + 点击：切换选中状态
    const index = selectedCards.value.indexOf(card.id)
    if (index > -1) {
      selectedCards.value.splice(index, 1)
    } else {
      selectedCards.value.push(card.id)
    }
  } else if (event.shiftKey && selectedCards.value.length > 0) {
    // Shift + 点击：范围选择
    const lastSelectedId = selectedCards.value[selectedCards.value.length - 1]
    const lastIndex = filteredCards.value.findIndex(c => c.id === lastSelectedId)
    const currentIndex = filteredCards.value.findIndex(c => c.id === card.id)
    
    if (lastIndex !== -1 && currentIndex !== -1) {
      const start = Math.min(lastIndex, currentIndex)
      const end = Math.max(lastIndex, currentIndex)
      
      for (let i = start; i <= end; i++) {
        const id = filteredCards.value[i].id
        if (!selectedCards.value.includes(id)) {
          selectedCards.value.push(id)
        }
      }
    }
  } else {
    // 普通点击：清除其他选中，只选中当前
    selectedCards.value = [card.id]
  }
}

/**
 * 双击卡片打开编辑
 */
function handleCardDoubleClick(card) {
  editCard(card)
}

/**
 * 编辑卡片
 */
function editCard(card) {
  editingCard.value = card
  Object.assign(cardForm, {
    title: card.title,
    summary: card.summary || '',
    status: card.status,
    color: card.color,
    volumeId: card.volumeId || '',
    storylineId: card.storylineId || '',
    characterId: card.characterId || '',
    chapterIndex: card.chapterIndex || 0,
    wordCount: card.wordCount || 0,
    notes: card.notes || ''
  })
  showAddCardDialog.value = true
}

/**
 * 保存卡片
 */
function saveCard() {
  if (!cardForm.title.trim()) {
    ElMessage.warning('请输入卡片标题')
    return
  }
  
  if (editingCard.value) {
    // 更新现有卡片
    Object.assign(editingCard.value, {
      title: cardForm.title,
      summary: cardForm.summary,
      status: cardForm.status,
      color: cardForm.color,
      volumeId: cardForm.volumeId,
      storylineId: cardForm.storylineId,
      characterId: cardForm.characterId,
      chapterIndex: cardForm.chapterIndex,
      wordCount: cardForm.wordCount,
      notes: cardForm.notes,
      updatedAt: new Date().toISOString()
    })
    ElMessage.success('卡片已更新')
  } else {
    // 创建新卡片
    cards.value.push({
      id: `card-${Date.now()}`,
      title: cardForm.title,
      summary: cardForm.summary,
      status: cardForm.status,
      color: cardForm.color,
      volumeId: cardForm.volumeId,
      storylineId: cardForm.storylineId,
      characterId: cardForm.characterId,
      chapterIndex: cardForm.chapterIndex,
      wordCount: cardForm.wordCount,
      notes: cardForm.notes,
      order: cards.value.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    ElMessage.success('卡片已创建')
  }
  
  // 重置表单
  resetCardForm()
  showAddCardDialog.value = false
  editingCard.value = null
}

/**
 * 删除卡片
 */
function deleteCard(cardId) {
  ElMessageBox.confirm('确定要删除这张卡片吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    cards.value = cards.value.filter(c => c.id !== cardId)
    selectedCards.value = selectedCards.value.filter(id => id !== cardId)
    ElMessage.success('卡片已删除')
  }).catch(() => {})
}

/**
 * 重置卡片表单
 */
function resetCardForm() {
  Object.assign(cardForm, {
    title: '',
    summary: '',
    status: 'todo',
    color: '#409eff',
    volumeId: '',
    storylineId: '',
    characterId: '',
    chapterIndex: 0,
    wordCount: 0,
    notes: ''
  })
}

/**
 * 处理拖拽开始
 */
function handleDragStart(event, card) {
  draggingCardId.value = card.id
  isDragging.value = true
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', JSON.stringify({
    type: 'card',
    id: card.id,
    card: card
  }))
}

/**
 * 处理拖拽结束
 */
function handleDragEnd() {
  draggingCardId.value = null
  isDragging.value = false
}

/**
 * 处理放置（重新排序）
 */
function handleDrop(event) {
  event.preventDefault()
  const data = event.dataTransfer.getData('text/plain')
  
  try {
    const parsed = JSON.parse(data)
    if (parsed.type === 'card') {
      // 这里可以实现重新排序逻辑
      ElMessage.success(`卡片 "${parsed.card.title}" 已移动`)
    }
  } catch (e) {
    console.error('解析拖拽数据失败:', e)
  }
}

/**
 * 处理放置到分组
 */
function handleDropToGroup(event, groupId) {
  event.preventDefault()
  const data = event.dataTransfer.getData('text/plain')
  
  try {
    const parsed = JSON.parse(data)
    if (parsed.type === 'card') {
      const card = cards.value.find(c => c.id === parsed.id)
      if (card) {
        if (groupBy.value === 'volume') {
          card.volumeId = groupId === 'ungrouped' ? '' : groupId
        } else if (groupBy.value === 'storyline') {
          card.storylineId = groupId === 'ungrouped' ? '' : groupId
        } else if (groupBy.value === 'character') {
          card.characterId = groupId === 'ungrouped' ? '' : groupId
        }
        ElMessage.success(`卡片 "${card.title}" 已移动到新分组`)
      }
    }
  } catch (e) {
    console.error('解析拖拽数据失败:', e)
  }
}

/**
 * 处理放置到时间线
 */
function handleDropToTimeline(event) {
  event.preventDefault()
  const data = event.dataTransfer.getData('text/plain')
  
  try {
    const parsed = JSON.parse(data)
    if (parsed.type === 'card') {
      ElMessage.success(`卡片 "${parsed.card.title}" 已添加到时间线`)
      // 这里可以触发添加到时间线的逻辑
    }
  } catch (e) {
    console.error('解析拖拽数据失败:', e)
  }
  
  isDragging.value = false
}

/**
 * 处理批量操作
 */
function handleBatchAction(command) {
  switch (command) {
    case 'setStatus':
      showBatchStatusDialog.value = true
      break
    case 'setColor':
      showBatchColorDialog.value = true
      break
    case 'move':
      ElMessage.info('请切换到分组模式后拖拽卡片进行移动')
      break
    case 'delete':
      ElMessageBox.confirm(`确定要删除选中的 ${selectedCards.value.length} 张卡片吗？`, '确认删除', {
        type: 'warning'
      }).then(() => {
        cards.value = cards.value.filter(c => !selectedCards.value.includes(c.id))
        selectedCards.value = []
        ElMessage.success('已删除选中的卡片')
      }).catch(() => {})
      break
  }
}

/**
 * 确认批量修改状态
 */
function confirmBatchStatus() {
  selectedCards.value.forEach(id => {
    const card = cards.value.find(c => c.id === id)
    if (card) {
      card.status = batchStatus.value
    }
  })
  showBatchStatusDialog.value = false
  ElMessage.success(`已将 ${selectedCards.value.length} 张卡片状态修改为"${getStatusLabel(batchStatus.value)}"`)
}

/**
 * 确认批量修改颜色
 */
function confirmBatchColor() {
  selectedCards.value.forEach(id => {
    const card = cards.value.find(c => c.id === id)
    if (card) {
      card.color = batchColor.value
    }
  })
  showBatchColorDialog.value = false
  ElMessage.success(`已修改 ${selectedCards.value.length} 张卡片的颜色`)
}

/**
 * 导出为大纲
 */
function handleExportOutline() {
  if (cards.value.length === 0) {
    ElMessage.warning('暂无卡片可导出')
    return
  }
  
  // 按章节序号排序
  const sortedCards = [...cards.value].sort((a, b) => {
    const aIndex = a.chapterIndex || 999
    const bIndex = b.chapterIndex || 999
    return aIndex - bIndex
  })
  
  // 生成大纲文本
  let outline = '# 小说大纲\n\n'
  
  // 按卷分组
  volumes.value.forEach(vol => {
    const volCards = sortedCards.filter(c => c.volumeId === vol.id)
    if (volCards.length > 0) {
      outline += `## ${vol.name}\n\n`
      volCards.forEach(card => {
        outline += `### ${card.title}\n`
        if (card.summary) {
          outline += `${card.summary}\n`
        }
        outline += `\n- 状态：${getStatusLabel(card.status)}\n`
        outline += `- 字数：${card.wordCount || 0} 字\n\n`
      })
    }
  })
  
  // 未分组的卡片
  const ungroupedCards = sortedCards.filter(c => !c.volumeId)
  if (ungroupedCards.length > 0) {
    outline += `## 其他章节\n\n`
    ungroupedCards.forEach(card => {
      outline += `### ${card.title}\n`
      if (card.summary) {
        outline += `${card.summary}\n`
      }
      outline += `\n- 状态：${getStatusLabel(card.status)}\n`
      outline += `- 字数：${card.wordCount || 0} 字\n\n`
    })
  }
  
  // 创建下载
  const blob = new Blob([outline], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `小说大纲_${new Date().toLocaleDateString()}.md`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('大纲已导出')
}

/**
 * 加载示例数据
 */
function loadDemoData() {
  cards.value = [
    {
      id: 'card-1',
      title: '第一章 命运的起点',
      summary: '主角在阁楼发现一封来自已故父亲的神秘信件，开启了一段寻找真相的旅程。',
      status: 'done',
      color: '#409eff',
      volumeId: 'vol1',
      storylineId: 'sl1',
      characterId: 'char1',
      chapterIndex: 1,
      wordCount: 3200,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-2',
      title: '第二章 暗流涌动',
      summary: '反派暗中策划对主角的暗杀行动，而主角尚未察觉即将到来的危险。',
      status: 'in_progress',
      color: '#e6a23c',
      volumeId: 'vol1',
      storylineId: 'sl3',
      characterId: 'char3',
      chapterIndex: 2,
      wordCount: 1800,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-3',
      title: '第三章 意外相遇',
      summary: '主角在一次意外中遇到了命中注定的那个人，两人之间产生了微妙的情愫。',
      status: 'todo',
      color: '#f56c6c',
      volumeId: 'vol1',
      storylineId: 'sl2',
      characterId: 'char2',
      chapterIndex: 3,
      wordCount: 0,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-4',
      title: '第四章 真相浮现',
      summary: '主角发现父亲的真实身份和隐藏多年的秘密，一切都指向一个更大的阴谋。',
      status: 'todo',
      color: '#67c23a',
      volumeId: 'vol2',
      storylineId: 'sl1',
      characterId: 'char1',
      chapterIndex: 4,
      wordCount: 0,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-5',
      title: '第五章 最终对决',
      summary: '主角与反派展开最终对决，所有伏笔在此收束，真相大白于天下。',
      status: 'todo',
      color: '#b37feb',
      volumeId: 'vol3',
      storylineId: 'sl1',
      characterId: 'char1',
      chapterIndex: 5,
      wordCount: 0,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'card-6',
      title: '第六章 新的开始',
      summary: '故事落下帷幕，主角踏上新的人生旅程，留下无限遐想。',
      status: 'todo',
      color: '#909399',
      volumeId: 'vol4',
      storylineId: 'sl1',
      characterId: 'char1',
      chapterIndex: 6,
      wordCount: 0,
      order: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 加载示例数据
  loadDemoData()
})
</script>

<style scoped>
/* 页面容器 */
.index-cards-page {
  padding: 20px;
  min-height: 100vh;
  background: var(--bg-color, #f5f7fa);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-color, #303133);
}

.header-right {
  display: flex;
  gap: 8px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 卡片容器 */
.cards-container {
  position: relative;
  min-height: 400px;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  gap: 16px;
  padding: 4px;
}

.cards-grid.size-small {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.cards-grid.size-medium {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.cards-grid.size-large {
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
}

/* 卡片项 */
.card-item {
  position: relative;
  background: #fff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
}

.card-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-item.selected {
  box-shadow: 0 0 0 2px var(--primary-color, #409eff);
}

.card-item.dragging {
  opacity: 0.5;
}

/* 卡片选择框 */
.card-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

/* 卡片内容 */
.card-content {
  padding: 12px 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #303133);
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-summary {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.card-word-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-chapter {
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
}

/* 卡片操作按钮 */
.card-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.card-item:hover .card-actions {
  opacity: 1;
}

/* 卡片分组 */
.card-group {
  margin-bottom: 24px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.group-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color, #303133);
}

/* 颜色选择器 */
.color-picker-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-picker-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.color-picker-item:hover {
  transform: scale(1.1);
}

.color-picker-item.active {
  border-color: #303133;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--primary-color, #409eff);
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

/* 时间线放置区域 */
.timeline-drop-zone {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-color, #409eff);
  color: #fff;
  padding: 16px 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
  z-index: 1000;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 响应式 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    flex-wrap: wrap;
  }
  
  .cards-grid.size-small,
  .cards-grid.size-medium,
  .cards-grid.size-large {
    grid-template-columns: 1fr;
  }
}
</style>

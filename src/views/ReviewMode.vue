<template>
  <div class="review-mode">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">审阅模式</h1>
        <el-tag :type="reviewStats.pending > 0 ? 'warning' : 'success'">
          {{ reviewStats.pending }} 项待审阅
        </el-tag>
      </div>
      <div class="header-actions">
        <el-button @click="toggleViewMode">
          <el-icon><View /></el-icon>
          {{ viewMode === 'list' ? '卡片视图' : '列表视图' }}
        </el-button>
        <el-button type="primary" @click="refreshReviewList">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="review-container">
      <!-- 左侧：待审阅列表 -->
      <div class="review-list-panel">
        <div class="panel-header">
          <h3>待审阅列表</h3>
          <div class="filter-controls">
            <el-select v-model="filterStatus" size="small" placeholder="状态筛选" style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option label="待审阅" value="pending" />
              <el-option label="已审阅" value="reviewed" />
              <el-option label="需修改" value="revision" />
            </el-select>
            <el-select v-model="sortBy" size="small" placeholder="排序" style="width: 120px">
              <el-option label="提交时间" value="submitTime" />
              <el-option label="优先级" value="priority" />
              <el-option label="字数" value="wordCount" />
            </el-select>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="review-list">
          <div
            v-for="item in filteredReviewItems"
            :key="item.id"
            class="review-item"
            :class="{ active: currentReviewId === item.id }"
            @click="selectReview(item.id)"
          >
            <div class="item-header">
              <div class="item-title">{{ item.title }}</div>
              <el-tag :type="getStatusTagType(item.status)" size="small">
                {{ getStatusName(item.status) }}
              </el-tag>
            </div>
            <div class="item-meta">
              <span class="item-author">
                <el-icon><User /></el-icon> {{ item.author }}
              </span>
              <span class="item-time">
                <el-icon><Clock /></el-icon> {{ formatTime(item.submitTime) }}
              </span>
              <span class="item-words">
                <el-icon><Document /></el-icon> {{ item.wordCount }} 字
              </span>
            </div>
            <div class="item-priority" v-if="item.priority === 'high'">
              <el-tag type="danger" size="small">高优先级</el-tag>
            </div>
          </div>

          <div v-if="filteredReviewItems.length === 0" class="empty-state">
            <el-icon :size="48"><Document /></el-icon>
            <p>暂无待审阅内容</p>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-else class="review-cards">
          <div
            v-for="item in filteredReviewItems"
            :key="item.id"
            class="review-card"
            :class="{ active: currentReviewId === item.id }"
            @click="selectReview(item.id)"
          >
            <div class="card-header">
              <div class="card-title">{{ item.title }}</div>
              <el-tag :type="getStatusTagType(item.status)" size="small">
                {{ getStatusName(item.status) }}
              </el-tag>
            </div>
            <div class="card-preview">{{ item.preview }}</div>
            <div class="card-footer">
              <div class="card-meta">
                <span>{{ item.author }}</span>
                <span>{{ formatTime(item.submitTime) }}</span>
              </div>
              <div class="card-stats">
                <el-badge :value="item.commentCount" type="primary">
                  <el-icon><ChatDotRound /></el-icon>
                </el-badge>
              </div>
            </div>
          </div>
        </div>

        <!-- 审阅进度 -->
        <div class="review-progress">
          <h4>审阅进度</h4>
          <el-progress
            :percentage="reviewProgress"
            :color="progressColors"
            :stroke-width="12"
          />
          <div class="progress-stats">
            <span>已完成: {{ reviewStats.completed }}</span>
            <span>待审阅: {{ reviewStats.pending }}</span>
            <span>需修改: {{ reviewStats.revision }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧：审阅工作区 -->
      <div class="review-workspace">
        <template v-if="currentReview">
          <!-- 审阅头部 -->
          <div class="workspace-header">
            <div class="header-info">
              <h2>{{ currentReview.title }}</h2>
              <div class="header-meta">
                <span>作者: {{ currentReview.author }}</span>
                <span>提交时间: {{ formatTime(currentReview.submitTime) }}</span>
                <span>字数: {{ currentReview.wordCount }}</span>
              </div>
            </div>
            <div class="header-actions">
              <el-button-group>
                <el-button :type="activeTool === 'comment' ? 'primary' : 'default'" @click="activeTool = 'comment'">
                  <el-icon><ChatDotRound /></el-icon> 批注
                </el-button>
                <el-button :type="activeTool === 'suggest' ? 'primary' : 'default'" @click="activeTool = 'suggest'">
                  <el-icon><Edit /></el-icon> 建议
                </el-button>
                <el-button :type="activeTool === 'score' ? 'primary' : 'default'" @click="activeTool = 'score'">
                  <el-icon><Star /></el-icon> 评分
                </el-button>
              </el-button-group>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="workspace-content">
            <!-- 内容展示 -->
            <div class="content-display">
              <div
                class="content-text"
                @mouseup="handleTextSelect"
                v-html="annotatedContent"
              ></div>
            </div>

            <!-- 批注面板 -->
            <div class="annotation-panel" v-if="activeTool === 'comment'">
              <h4>行内批注</h4>
              
              <!-- 选中文本提示 -->
              <div v-if="selectedText" class="selected-text-info">
                <div class="selected-label">选中文本:</div>
                <div class="selected-content">"{{ selectedText }}"</div>
              </div>
              
              <!-- 添加批注 -->
              <div class="add-annotation">
                <el-input
                  v-model="newAnnotation"
                  type="textarea"
                  :rows="3"
                  placeholder="输入批注内容..."
                />
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!newAnnotation || !selectedText"
                  @click="addAnnotation"
                >
                  添加批注
                </el-button>
              </div>

              <!-- 批注列表 -->
              <div class="annotation-list">
                <div
                  v-for="annotation in currentAnnotations"
                  :key="annotation.id"
                  class="annotation-item"
                  :class="{ resolved: annotation.resolved }"
                >
                  <div class="annotation-header">
                    <span class="annotation-text">"{{ annotation.selectedText }}"</span>
                    <el-button
                      v-if="!annotation.resolved"
                      size="small"
                      text
                      type="success"
                      @click="resolveAnnotation(annotation.id)"
                    >
                      解决
                    </el-button>
                  </div>
                  <div class="annotation-content">{{ annotation.content }}</div>
                  <div class="annotation-meta">
                    <span>{{ annotation.author }}</span>
                    <span>{{ formatTime(annotation.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 建议修改面板 -->
            <div class="suggestion-panel" v-if="activeTool === 'suggest'">
              <h4>修改建议</h4>
              
              <!-- 添加建议 -->
              <div class="add-suggestion">
                <el-form :model="suggestionForm" label-width="80px" size="small">
                  <el-form-item label="原文">
                    <el-input v-model="suggestionForm.originalText" placeholder="选中的原文" />
                  </el-form-item>
                  <el-form-item label="建议修改">
                    <el-input v-model="suggestionForm.suggestedText" type="textarea" :rows="2" placeholder="建议修改为..." />
                  </el-form-item>
                  <el-form-item label="说明">
                    <el-input v-model="suggestionForm.reason" placeholder="修改原因" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addSuggestion">添加建议</el-button>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 建议列表 -->
              <div class="suggestion-list">
                <div
                  v-for="suggestion in currentSuggestions"
                  :key="suggestion.id"
                  class="suggestion-item"
                  :class="suggestion.status"
                >
                  <div class="suggestion-diff">
                    <div class="diff-original">
                      <span class="diff-label">原文:</span>
                      <span class="diff-text deleted">{{ suggestion.originalText }}</span>
                    </div>
                    <div class="diff-suggested">
                      <span class="diff-label">建议:</span>
                      <span class="diff-text added">{{ suggestion.suggestedText }}</span>
                    </div>
                  </div>
                  <div class="suggestion-reason" v-if="suggestion.reason">
                    {{ suggestion.reason }}
                  </div>
                  <div class="suggestion-actions">
                    <el-button size="small" type="success" @click="acceptSuggestion(suggestion.id)">
                      接受
                    </el-button>
                    <el-button size="small" type="danger" @click="rejectSuggestion(suggestion.id)">
                      拒绝
                    </el-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评分面板 -->
            <div class="score-panel" v-if="activeTool === 'score'">
              <h4>评分系统</h4>
              
              <div class="score-form">
                <div
                  v-for="dimension in scoreDimensions"
                  :key="dimension.id"
                  class="score-item"
                >
                  <div class="score-label">
                    <span>{{ dimension.name }}</span>
                    <el-rate
                      v-model="reviewScores[dimension.id]"
                      :max="5"
                      show-score
                      :texts="['很差', '较差', '一般', '良好', '优秀']"
                    />
                  </div>
                  <el-input
                    v-model="reviewScoreComments[dimension.id]"
                    type="textarea"
                    :rows="2"
                    placeholder="评分说明..."
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 审阅操作栏 -->
          <div class="workspace-footer">
            <div class="footer-left">
              <el-button @click="prevReview" :disabled="!hasPrevReview">
                <el-icon><ArrowLeft /></el-icon> 上一个
              </el-button>
              <el-button @click="nextReview" :disabled="!hasNextReview">
                下一个 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <div class="footer-right">
              <el-button type="warning" @click="requestRevision">
                <el-icon><EditPen /></el-icon> 要求修改
              </el-button>
              <el-button type="success" @click="approveReview">
                <el-icon><Check /></el-icon> 批准通过
              </el-button>
            </div>
          </div>
        </template>

        <!-- 无选中内容 -->
        <div v-else class="empty-workspace">
          <div class="empty-icon">📋</div>
          <h3>选择要审阅的内容</h3>
          <p>从左侧列表中选择一项开始审阅</p>
        </div>
      </div>

      <!-- 沟通工具面板 -->
      <div class="communication-panel">
        <div class="panel-header">
          <h3>沟通工具</h3>
          <el-badge :value="unreadMessages" :hidden="unreadMessages === 0">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </div>

        <!-- 聊天区域 -->
        <div class="chat-area">
          <div class="chat-messages" ref="chatMessagesRef">
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              class="chat-message"
              :class="{ self: msg.isSelf }"
            >
              <div class="message-avatar">
                <el-avatar :size="32">{{ msg.author.charAt(0) }}</el-avatar>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-author">{{ msg.author }}</span>
                  <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
                </div>
                <div class="message-text" v-html="parseMentions(msg.content)"></div>
              </div>
            </div>
          </div>

          <!-- 消息输入 -->
          <div class="chat-input">
            <el-input
              v-model="chatInput"
              type="textarea"
              :rows="2"
              placeholder="输入消息，使用 @ 提及他人..."
              @keyup.enter.ctrl="sendMessage"
            />
            <div class="input-actions">
              <el-button size="small" @click="showMentionList = !showMentionList">
                @ 提及
              </el-button>
              <el-button type="primary" size="small" @click="sendMessage">
                发送
              </el-button>
            </div>
            
            <!-- 提及列表 -->
            <div v-if="showMentionList" class="mention-list">
              <div
                v-for="member in mentionableMembers"
                :key="member.id"
                class="mention-item"
                @click="insertMention(member)"
              >
                {{ member.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 审阅报告对话框 -->
    <el-dialog v-model="showReportDialog" title="审阅报告" width="700px">
      <div class="review-report">
        <h3>{{ currentReview?.title }}</h3>
        
        <div class="report-section">
          <h4>评分详情</h4>
          <div class="report-scores">
            <div
              v-for="dimension in scoreDimensions"
              :key="dimension.id"
              class="report-score-item"
            >
              <span class="score-name">{{ dimension.name }}</span>
              <el-rate :model-value="reviewScores[dimension.id]" disabled />
              <span class="score-value">{{ reviewScores[dimension.id] || 0 }}/5</span>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h4>问题汇总</h4>
          <div class="report-issues">
            <div v-for="issue in reportIssues" :key="issue.id" class="issue-item">
              <el-tag :type="issue.type">{{ issue.label }}</el-tag>
              <span class="issue-text">{{ issue.text }}</span>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h4>改进建议</h4>
          <el-input
            v-model="reportSuggestions"
            type="textarea"
            :rows="4"
            placeholder="输入改进建议..."
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="showReportDialog = false">取消</el-button>
        <el-button type="primary" @click="submitReport">提交报告</el-button>
      </template>
    </el-dialog>

    <!-- 要求修改对话框 -->
    <el-dialog v-model="showRevisionDialog" title="要求修改" width="500px">
      <el-form :model="revisionForm" label-width="80px">
        <el-form-item label="修改要求">
          <el-input v-model="revisionForm.requirements" type="textarea" :rows="4" placeholder="详细说明需要修改的内容..." />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="revisionForm.deadline" type="date" placeholder="选择截止日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRevisionDialog = false">取消</el-button>
        <el-button type="warning" @click="submitRevisionRequest">发送修改要求</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 编辑者审阅模式页面
 * 
 * 功能：
 * 1. 审阅面板（待审阅列表、审阅进度、优先级排序）
 * 2. 审阅工具（行内批注、整体评论、评分系统、建议修改）
 * 3. 审阅报告（问题汇总、改进建议、评分详情）
 * 4. 沟通工具（内置聊天、@提及、消息历史）
 */
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  View, Refresh, User, Clock, Document, ChatDotRound, Edit, Star,
  ArrowLeft, ArrowRight, EditPen, Check, Bell
} from '@element-plus/icons-vue'

// ============================================================================
// 响应式状态
// ============================================================================

const novelStore = useNovelStore()

// 视图模式
const viewMode = ref('list')

// 筛选和排序
const filterStatus = ref('all')
const sortBy = ref('submitTime')

// 当前审阅项
const currentReviewId = ref('')
const activeTool = ref('comment')

// 选中文本
const selectedText = ref('')
const selectedRange = ref({ start: 0, end: 0 })

// 批注
const newAnnotation = ref('')
const currentAnnotations = ref([])

// 建议修改
const suggestionForm = ref({
  originalText: '',
  suggestedText: '',
  reason: ''
})
const currentSuggestions = ref([])

// 评分
const scoreDimensions = [
  { id: 'content', name: '内容质量' },
  { id: 'structure', name: '结构组织' },
  { id: 'language', name: '语言表达' },
  { id: 'creativity', name: '创意创新' },
  { id: 'readability', name: '可读性' }
]
const reviewScores = ref({})
const reviewScoreComments = ref({})

// 聊天
const chatMessages = ref([])
const chatInput = ref('')
const showMentionList = ref(false)
const unreadMessages = ref(0)
const chatMessagesRef = ref(null)

// 可提及成员
const mentionableMembers = ref([
  { id: 'user_001', name: '张三' },
  { id: 'user_002', name: '李四' },
  { id: 'user_003', name: '王五' }
])

// 对话框
const showReportDialog = ref(false)
const showRevisionDialog = ref(false)
const reportSuggestions = ref('')
const revisionForm = ref({
  requirements: '',
  deadline: null
})

// 审阅项数据
const reviewItems = ref([
  {
    id: 'review_001',
    title: '第一章 开端',
    author: '张三',
    status: 'pending',
    priority: 'high',
    submitTime: new Date(Date.now() - 86400000).toISOString(),
    wordCount: 3500,
    preview: '那是一个阳光明媚的早晨，小镇上的居民们开始了他们忙碌的一天...',
    content: '那是一个阳光明媚的早晨，小镇上的居民们开始了他们忙碌的一天。街道上人来人往，小贩们的叫卖声此起彼伏。\n\n李明站在窗前，看着这熟悉的一切，心中却涌起一股莫名的烦躁。他已经在这个小镇生活了二十多年，每一天都是如此相似，仿佛时间在这里停滞了。\n\n"李明，该上班了！"楼下传来母亲的催促声。\n\n他叹了口气，转身拿起放在床头的公文包。又是新的一天，又是同样的生活。',
    commentCount: 3
  },
  {
    id: 'review_002',
    title: '第二章 相遇',
    author: '李四',
    status: 'pending',
    priority: 'normal',
    submitTime: new Date(Date.now() - 43200000).toISOString(),
    wordCount: 2800,
    preview: '咖啡馆里弥漫着浓郁的香气，她坐在角落的位置...',
    content: '咖啡馆里弥漫着浓郁的香气，她坐在角落的位置，手里捧着一本书，阳光透过玻璃窗洒在她的侧脸上。\n\n他推门而入，目光不经意间扫过整个咖啡馆，然后停在了她的身上。那一刻，时间仿佛静止了。\n\n"请问，这里有人吗？"他走到她面前，声音有些紧张。\n\n她抬起头，清澈的眼眸中带着一丝惊讶，随即微微一笑："没有，请坐。"',
    commentCount: 1
  },
  {
    id: 'review_003',
    title: '第三章 转折',
    author: '王五',
    status: 'reviewed',
    priority: 'normal',
    submitTime: new Date(Date.now() - 172800000).toISOString(),
    wordCount: 4200,
    preview: '事情的发展出乎所有人的意料，那个看似平静的决定...',
    content: '事情的发展出乎所有人的意料，那个看似平静的决定，却引发了一连串的连锁反应。\n\n没有人想到，一次简单的选择会改变这么多人的命运。当真相浮出水面时，所有人都陷入了沉默。\n\n"我们该怎么办？"有人问道。\n\n没有人能给出答案。',
    commentCount: 5
  }
])

// ============================================================================
// 计算属性
// ============================================================================

// 过滤后的审阅项
const filteredReviewItems = computed(() => {
  let items = [...reviewItems.value]

  // 状态筛选
  if (filterStatus.value !== 'all') {
    items = items.filter(item => item.status === filterStatus.value)
  }

  // 排序
  switch (sortBy.value) {
    case 'submitTime':
      items.sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime))
      break
    case 'priority':
      items.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1
        if (a.priority !== 'high' && b.priority === 'high') return 1
        return 0
      })
      break
    case 'wordCount':
      items.sort((a, b) => b.wordCount - a.wordCount)
      break
  }

  return items
})

// 当前审阅项
const currentReview = computed(() => {
  return reviewItems.value.find(item => item.id === currentReviewId.value)
})

// 带批注的内容
const annotatedContent = computed(() => {
  if (!currentReview.value) return ''
  let content = currentReview.value.content
  
  // 应用批注高亮
  currentAnnotations.value.forEach(annotation => {
    if (annotation.selectedText) {
      const regex = new RegExp(annotation.selectedText, 'g')
      content = content.replace(regex, `<span class="annotation-highlight" data-id="${annotation.id}">${annotation.selectedText}</span>`)
    }
  })
  
  // 换行处理
  content = content.replace(/\n/g, '<br>')
  
  return content
})

// 审阅统计
const reviewStats = computed(() => {
  const items = reviewItems.value
  return {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    completed: items.filter(i => i.status === 'reviewed').length,
    revision: items.filter(i => i.status === 'revision').length
  }
})

// 审阅进度
const reviewProgress = computed(() => {
  const stats = reviewStats.value
  if (stats.total === 0) return 0
  return Math.round((stats.completed / stats.total) * 100)
})

// 进度条颜色
const progressColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#409eff', percentage: 60 },
  { color: '#67c23a', percentage: 80 },
  { color: '#67c23a', percentage: 100 }
]

// 是否有上一个/下一个
const hasPrevReview = computed(() => {
  const index = filteredReviewItems.value.findIndex(item => item.id === currentReviewId.value)
  return index > 0
})

const hasNextReview = computed(() => {
  const index = filteredReviewItems.value.findIndex(item => item.id === currentReviewId.value)
  return index < filteredReviewItems.value.length - 1
})

// 报告问题
const reportIssues = computed(() => {
  const issues = []
  
  currentAnnotations.value.forEach(a => {
    if (!a.resolved) {
      issues.push({
        id: a.id,
        type: 'warning',
        label: '批注',
        text: a.content
      })
    }
  })
  
  currentSuggestions.value.filter(s => s.status === 'pending').forEach(s => {
    issues.push({
      id: s.id,
      type: 'info',
      label: '建议',
      text: s.reason || s.suggestedText
    })
  })
  
  return issues
})

// ============================================================================
// 方法
// ============================================================================

/**
 * 切换视图模式
 */
function toggleViewMode() {
  viewMode.value = viewMode.value === 'list' ? 'card' : 'list'
}

/**
 * 刷新审阅列表
 */
function refreshReviewList() {
  ElMessage.success('列表已刷新')
}

/**
 * 选择审阅项
 */
function selectReview(id) {
  currentReviewId.value = id
  
  // 加载该审阅项的批注和建议
  loadReviewData(id)
}

/**
 * 加载审阅数据
 */
function loadReviewData(reviewId) {
  // 模拟加载批注
  currentAnnotations.value = [
    {
      id: 'anno_001',
      selectedText: '阳光明媚的早晨',
      content: '这个开头比较常见，可以考虑更有特色的描写',
      author: '审阅者',
      createdAt: new Date().toISOString(),
      resolved: false
    }
  ]

  // 模拟加载建议
  currentSuggestions.value = [
    {
      id: 'sugg_001',
      originalText: '他叹了口气',
      suggestedText: '他深吸一口气，目光坚定',
      reason: '增加人物情感的层次感',
      status: 'pending'
    }
  ]

  // 重置评分
  reviewScores.value = {}
  reviewScoreComments.value = {}
}

/**
 * 获取状态标签类型
 */
function getStatusTagType(status) {
  const types = {
    pending: 'warning',
    reviewed: 'success',
    revision: 'danger'
  }
  return types[status] || 'info'
}

/**
 * 获取状态名称
 */
function getStatusName(status) {
  const names = {
    pending: '待审阅',
    reviewed: '已审阅',
    revision: '需修改'
  }
  return names[status] || status
}

/**
 * 格式化时间
 */
function formatTime(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 处理文本选择
 */
function handleTextSelect(event) {
  const selection = window.getSelection()
  if (selection.toString().trim()) {
    selectedText.value = selection.toString().trim()
    // 记录选择范围
    const range = selection.getRangeAt(0)
    selectedRange.value = {
      start: range.startOffset,
      end: range.endOffset
    }
  }
}

/**
 * 添加批注
 */
function addAnnotation() {
  if (!newAnnotation.value || !selectedText.value) return

  const annotation = {
    id: 'anno_' + Date.now(),
    selectedText: selectedText.value,
    content: newAnnotation.value,
    author: '审阅者',
    createdAt: new Date().toISOString(),
    resolved: false
  }

  currentAnnotations.value.push(annotation)
  newAnnotation.value = ''
  selectedText.value = ''
  ElMessage.success('批注已添加')
}

/**
 * 解决批注
 */
function resolveAnnotation(annotationId) {
  const annotation = currentAnnotations.value.find(a => a.id === annotationId)
  if (annotation) {
    annotation.resolved = true
    ElMessage.success('批注已标记为解决')
  }
}

/**
 * 添加建议
 */
function addSuggestion() {
  if (!suggestionForm.value.originalText || !suggestionForm.value.suggestedText) {
    ElMessage.warning('请填写原文和建议修改')
    return
  }

  const suggestion = {
    id: 'sugg_' + Date.now(),
    originalText: suggestionForm.value.originalText,
    suggestedText: suggestionForm.value.suggestedText,
    reason: suggestionForm.value.reason,
    status: 'pending'
  }

  currentSuggestions.value.push(suggestion)
  suggestionForm.value = { originalText: '', suggestedText: '', reason: '' }
  ElMessage.success('建议已添加')
}

/**
 * 接受建议
 */
function acceptSuggestion(suggestionId) {
  const suggestion = currentSuggestions.value.find(s => s.id === suggestionId)
  if (suggestion) {
    suggestion.status = 'accepted'
    ElMessage.success('建议已接受')
  }
}

/**
 * 拒绝建议
 */
function rejectSuggestion(suggestionId) {
  const suggestion = currentSuggestions.value.find(s => s.id === suggestionId)
  if (suggestion) {
    suggestion.status = 'rejected'
    ElMessage.success('建议已拒绝')
  }
}

/**
 * 上一个审阅
 */
function prevReview() {
  const index = filteredReviewItems.value.findIndex(item => item.id === currentReviewId.value)
  if (index > 0) {
    selectReview(filteredReviewItems.value[index - 1].id)
  }
}

/**
 * 下一个审阅
 */
function nextReview() {
  const index = filteredReviewItems.value.findIndex(item => item.id === currentReviewId.value)
  if (index < filteredReviewItems.value.length - 1) {
    selectReview(filteredReviewItems.value[index + 1].id)
  }
}

/**
 * 要求修改
 */
function requestRevision() {
  showRevisionDialog.value = true
}

/**
 * 提交修改要求
 */
function submitRevisionRequest() {
  if (!revisionForm.value.requirements) {
    ElMessage.warning('请填写修改要求')
    return
  }

  // 更新状态
  if (currentReview.value) {
    currentReview.value.status = 'revision'
  }

  showRevisionDialog.value = false
  revisionForm.value = { requirements: '', deadline: null }
  ElMessage.success('修改要求已发送')
}

/**
 * 批准审阅
 */
async function approveReview() {
  try {
    await ElMessageBox.confirm('确定批准此内容吗？', '确认批准', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })

    // 更新状态
    if (currentReview.value) {
      currentReview.value.status = 'reviewed'
    }

    ElMessage.success('已批准通过')
  } catch {
    // 取消
  }
}

/**
 * 发送消息
 */
function sendMessage() {
  if (!chatInput.value.trim()) return

  const message = {
    id: 'msg_' + Date.now(),
    content: chatInput.value,
    author: '审阅者',
    isSelf: true,
    createdAt: new Date().toISOString()
  }

  chatMessages.value.push(message)
  chatInput.value = ''
  showMentionList.value = false

  // 滚动到底部
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

/**
 * 解析@提及
 */
function parseMentions(content) {
  return content.replace(/@(\S+)/g, '<span class="mention">@$1</span>')
}

/**
 * 插入提及
 */
function insertMention(member) {
  chatInput.value += `@${member.name} `
  showMentionList.value = false
}

/**
 * 提交报告
 */
function submitReport() {
  showReportDialog.value = false
  ElMessage.success('审阅报告已提交')
}

// ============================================================================
// 生命周期
// ============================================================================

onMounted(() => {
  // 模拟聊天消息
  chatMessages.value = [
    {
      id: 'msg_001',
      content: '第一章的描写很生动，但开头可以更有特色',
      author: '张三',
      isSelf: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg_002',
      content: '@张三 同意，我会修改开头部分',
      author: '审阅者',
      isSelf: true,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ]
})
</script>

<style scoped>
.review-mode {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 主容器 */
.review-container {
  display: grid;
  grid-template-columns: 320px 1fr 280px;
  gap: 20px;
}

/* 审阅列表面板 */
.review-list-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.panel-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
}

.filter-controls {
  display: flex;
  gap: 8px;
}

/* 审阅列表 */
.review-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.review-item {
  padding: 12px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.review-item:hover {
  border-color: #409eff;
}

.review-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.item-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-priority {
  margin-top: 8px;
}

/* 卡片视图 */
.review-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 12px;
}

.review-card {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.review-card:hover {
  border-color: #409eff;
}

.review-card.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.card-preview {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

/* 审阅进度 */
.review-progress {
  padding: 16px;
  border-top: 1px solid #ebeef5;
}

.review-progress h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

/* 审阅工作区 */
.review-workspace {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  min-height: 600px;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.header-info h2 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.header-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #909399;
}

/* 内容区域 */
.workspace-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.content-display {
  overflow-y: auto;
}

.content-text {
  font-size: 15px;
  line-height: 2;
  color: #303133;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  user-select: text;
}

.content-text :deep(.annotation-highlight) {
  background: #fdf6ec;
  border-bottom: 2px solid #e6a23c;
  cursor: pointer;
}

/* 批注面板 */
.annotation-panel,
.suggestion-panel,
.score-panel {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  overflow-y: auto;
}

.annotation-panel h4,
.suggestion-panel h4,
.score-panel h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.selected-text-info {
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
}

.selected-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.selected-content {
  font-size: 13px;
  color: #303133;
  font-style: italic;
}

.add-annotation {
  margin-bottom: 16px;
}

.add-annotation .el-button {
  margin-top: 8px;
}

.annotation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.annotation-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #409eff;
}

.annotation-item.resolved {
  border-left-color: #67c23a;
  opacity: 0.7;
}

.annotation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.annotation-text {
  font-size: 12px;
  color: #606266;
  font-style: italic;
}

.annotation-content {
  font-size: 13px;
  color: #303133;
  margin-bottom: 8px;
}

.annotation-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

/* 建议面板 */
.add-suggestion {
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #e6a23c;
}

.suggestion-item.accepted {
  border-left-color: #67c23a;
}

.suggestion-item.rejected {
  border-left-color: #f56c6c;
  opacity: 0.7;
}

.suggestion-diff {
  margin-bottom: 8px;
}

.diff-original,
.diff-suggested {
  font-size: 13px;
  margin-bottom: 4px;
}

.diff-label {
  color: #909399;
  margin-right: 8px;
}

.diff-text.deleted {
  text-decoration: line-through;
  color: #f56c6c;
}

.diff-text.added {
  color: #67c23a;
  font-weight: 500;
}

.suggestion-reason {
  font-size: 12px;
  color: #909399;
  font-style: italic;
  margin-bottom: 8px;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
}

/* 评分面板 */
.score-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.score-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

/* 工作区底部 */
.workspace-footer {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #ebeef5;
}

/* 空状态 */
.empty-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-workspace h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #606266;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-state p {
  margin: 8px 0 0 0;
}

/* 沟通面板 */
.communication-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.communication-panel .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.communication-panel .panel-header h3 {
  margin: 0;
  font-size: 14px;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  min-height: 300px;
}

.chat-message {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.chat-message.self {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 80%;
}

.message-header {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
}

.chat-message.self .message-header {
  flex-direction: row-reverse;
}

.message-author {
  color: #303133;
  font-weight: 500;
}

.message-time {
  color: #909399;
}

.message-text {
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 13px;
  color: #303133;
  line-height: 1.5;
}

.chat-message.self .message-text {
  background: #ecf5ff;
}

.message-text :deep(.mention) {
  color: #409eff;
  font-weight: 500;
}

.chat-input {
  padding: 12px;
  border-top: 1px solid #ebeef5;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.mention-list {
  position: absolute;
  bottom: 100%;
  left: 12px;
  right: 12px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
}

.mention-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
}

.mention-item:hover {
  background: #f5f7fa;
}

/* 审阅报告 */
.review-report h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #303133;
}

.report-section {
  margin-bottom: 20px;
}

.report-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.report-scores {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-score-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-name {
  min-width: 80px;
  font-size: 13px;
  color: #606266;
}

.score-value {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}

.report-issues {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.issue-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.issue-text {
  color: #606266;
}

/* 响应式 */
@media (max-width: 1200px) {
  .review-container {
    grid-template-columns: 280px 1fr;
  }

  .communication-panel {
    display: none;
  }
}

@media (max-width: 768px) {
  .review-container {
    grid-template-columns: 1fr;
  }

  .workspace-content {
    grid-template-columns: 1fr;
  }

  .annotation-panel,
  .suggestion-panel,
  .score-panel {
    display: none;
  }
}
</style>

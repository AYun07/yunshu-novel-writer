<template>
  <div class="collaboration-page">
    <div class="page-header">
      <h2>协作中心</h2>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 分享管理 Tab -->
      <el-tab-pane label="分享管理" name="share">
        <div class="share-toolbar">
          <el-button type="primary" @click="showCreateShareDialog = true">
            <el-icon><Plus /></el-icon> 创建分享链接
          </el-button>
        </div>
        <div class="share-stats">
          <el-statistic title="活跃链接" :value="activeShareLinks.length" />
          <el-statistic title="总访问量" :value="totalViews" />
          <el-statistic title="总评论数" :value="totalComments" />
        </div>
        <el-table :data="activeShareLinks" stripe empty-text="暂无活跃分享链接">
          <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
          <el-table-column prop="mode" label="权限" width="100">
            <template #default="{ row }">
              <el-tag size="small" :type="row.mode === 'readonly' ? 'info' : 'warning'">
                {{ row.mode === 'readonly' ? '只读' : '可评论' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="170" />
          <el-table-column prop="expiresAt" label="过期时间" width="170">
            <template #default="{ row }">
              {{ row.expiresAt || '永不过期' }}
            </template>
          </el-table-column>
          <el-table-column prop="viewCount" label="访问量" width="80" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="copyShareLink(row)">复制链接</el-button>
              <el-button type="danger" link size="small" @click="revokeShareLink(row.id)">撤销</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 评论审阅 Tab -->
      <el-tab-pane label="评论审阅" name="review">
        <div class="review-toolbar">
          <el-select v-model="reviewChapterId" placeholder="选择章节" style="width: 240px;" @change="loadChapterReviews">
            <el-option v-for="ch in chapterList" :key="ch.id" :label="ch.title" :value="ch.id" />
          </el-select>
          <el-button type="primary" size="small" @click="showAddCommentDialog = true" :disabled="!reviewChapterId">
            <el-icon><Plus /></el-icon> 添加评论
          </el-button>
        </div>
        <div v-if="reviewChapterId" class="review-content">
          <div class="chapter-text">
            <div v-for="(line, idx) in chapterLines" :key="idx" class="text-line" :class="{ 'has-comment': getLineComments(idx + 1).length > 0 }">
              <span class="line-number">{{ idx + 1 }}</span>
              <span class="line-text">{{ line }}</span>
              <span v-if="getLineComments(idx + 1).length > 0" class="comment-badge">
                {{ getLineComments(idx + 1).length }}
              </span>
            </div>
          </div>
          <div class="comments-panel">
            <h4>评论列表 ({{ currentComments.length }})</h4>
            <div v-for="comment in currentComments" :key="comment.id" class="comment-item" :class="{ resolved: comment.resolved }">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                <el-tag v-if="comment.resolved" size="small" type="success">已解决</el-tag>
              </div>
              <div class="comment-body">
                <span class="comment-line-ref">第{{ comment.lineNumber }}行</span>
                <p>{{ comment.text }}</p>
              </div>
              <div class="comment-actions">
                <el-button v-if="!comment.resolved" type="success" link size="small" @click="resolveComment(comment.id)">解决</el-button>
                <el-button v-else type="warning" link size="small" @click="unresolveComment(comment.id)">取消解决</el-button>
                <el-button type="danger" link size="small" @click="deleteComment(comment.id)">删除</el-button>
              </div>
              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <span class="reply-author">{{ reply.author }}：</span>
                  <span class="reply-text">{{ reply.text }}</span>
                </div>
              </div>
            </div>
            <el-empty v-if="currentComments.length === 0" description="暂无评论" :image-size="60" />
          </div>
        </div>
        <el-empty v-else description="请先选择一个章节" />
      </el-tab-pane>

      <!-- 版本对比 Tab -->
      <el-tab-pane label="版本对比" name="diff">
        <div class="diff-toolbar">
          <el-select v-model="diffVersion1" placeholder="选择版本1" style="width: 200px;" @change="computeDiff">
            <el-option v-for="v in versionList" :key="v.id" :label="`v${v.id} - ${v.message || v.time}`" :value="v.id" />
          </el-select>
          <span style="color: #909399;">对比</span>
          <el-select v-model="diffVersion2" placeholder="选择版本2" style="width: 200px;" @change="computeDiff">
            <el-option v-for="v in versionList" :key="v.id" :label="`v${v.id} - ${v.message || v.time}`" :value="v.id" />
          </el-select>
        </div>
        <div v-if="diffResult" class="diff-stats">
          <el-statistic title="新增行数" :value="diffResult.addedLines" class="stat-added" />
          <el-statistic title="删除行数" :value="diffResult.deletedLines" class="stat-deleted" />
          <el-statistic title="修改行数" :value="diffResult.changedLines" class="stat-changed" />
        </div>
        <div v-if="diffLines.length > 0" class="diff-content">
          <div v-for="(line, idx) in diffLines" :key="idx" class="diff-line" :class="'diff-' + line.type">
            <span class="diff-line-num">{{ line.num }}</span>
            <span class="diff-line-text">{{ line.text }}</span>
          </div>
        </div>
        <div v-else-if="diffVersion1 && diffVersion2" class="diff-empty">
          <el-empty description="两个版本内容相同" :image-size="60" />
        </div>
        <el-empty v-else description="请选择两个版本进行对比" />
      </el-tab-pane>

      <!-- 修订历史 Tab -->
      <el-tab-pane label="修订历史" name="history">
        <div class="history-toolbar">
          <el-select v-model="historyChapterId" placeholder="选择章节" style="width: 240px;" @change="loadHistory">
            <el-option v-for="ch in chapterList" :key="ch.id" :label="ch.title" :value="ch.id" />
          </el-select>
          <el-button type="primary" link size="small" @click="exportRevisionReport">
            <el-icon><Download /></el-icon> 导出修订报告
          </el-button>
        </div>
        <el-table v-if="historyChapterId" :data="revisionList" stripe empty-text="暂无修订记录">
          <el-table-column prop="createdAt" label="时间" width="170" />
          <el-table-column prop="author" label="修改者" width="100" />
          <el-table-column prop="message" label="说明" min-width="200" show-overflow-tooltip />
          <el-table-column prop="wordCount" label="字数" width="80" />
          <el-table-column prop="wordChange" label="字数变化" width="100">
            <template #default="{ row }">
              <span :class="row.wordChange > 0 ? 'text-added' : row.wordChange < 0 ? 'text-deleted' : ''">
                {{ row.wordChange > 0 ? '+' : '' }}{{ row.wordChange }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="compareWithPrevious(row)">对比</el-button>
              <el-button type="warning" link size="small" @click="restoreVersion(row)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else description="请先选择一个章节" />
      </el-tab-pane>
    </el-tabs>

    <!-- 创建分享链接对话框 -->
    <el-dialog v-model="showCreateShareDialog" title="创建分享链接" width="480px">
      <el-form :model="shareForm" label-width="80px">
        <el-form-item label="分享标题">
          <el-input v-model="shareForm.title" placeholder="请输入分享标题" />
        </el-form-item>
        <el-form-item label="选择项目">
          <el-select v-model="shareForm.projectId" placeholder="选择项目" style="width: 100%;">
            <el-option label="星辰大海" value="proj1" />
            <el-option label="都市传说" value="proj2" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择章节">
          <el-select v-model="shareForm.chapterId" placeholder="不选则分享整个项目" style="width: 100%;" clearable>
            <el-option v-for="ch in chapterList" :key="ch.id" :label="ch.title" :value="ch.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-radio-group v-model="shareForm.mode">
            <el-radio value="readonly">只读</el-radio>
            <el-radio value="commentable">可评论</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期">
          <el-select v-model="shareForm.expiresInDays" placeholder="选择有效期" style="width: 100%;">
            <el-option label="永不过期" :value="0" />
            <el-option label="7天" :value="7" />
            <el-option label="30天" :value="30" />
            <el-option label="90天" :value="90" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateShareDialog = false">取消</el-button>
        <el-button type="primary" @click="createShareLink">创建</el-button>
      </template>
    </el-dialog>

    <!-- 添加评论对话框 -->
    <el-dialog v-model="showAddCommentDialog" title="添加评论" width="480px">
      <el-form :model="commentForm" label-width="80px">
        <el-form-item label="行号">
          <el-input-number v-model="commentForm.lineNumber" :min="1" :max="chapterLines.length" />
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="commentForm.text" type="textarea" :rows="4" placeholder="请输入评论内容" />
        </el-form-item>
        <el-form-item label="评论者">
          <el-input v-model="commentForm.author" placeholder="请输入评论者名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddCommentDialog = false">取消</el-button>
        <el-button type="primary" @click="addComment">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { collaborationService } from '../services/collaborationService.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'

// ==================== Tab 状态 ====================
const activeTab = ref('share')

// ==================== 章节数据 ====================
const chapterList = ref([
  { id: 'ch1', title: '第一章 命运的起点' },
  { id: 'ch2', title: '第二章 暗流涌动' },
  { id: 'ch3', title: '第三章 意外相遇' },
  { id: 'ch4', title: '第四章 真相浮现' },
  { id: 'ch5', title: '第五章 最终对决' }
])

// ==================== 分享管理 ====================
const showCreateShareDialog = ref(false)
const shareForm = reactive({ title: '', projectId: '', chapterId: '', mode: 'readonly', expiresInDays: 30 })
const shareLinks = ref([
  { id: 's1', title: '星辰大海 - 全文', token: 'abc123def456', projectId: 'proj1', chapterId: '', mode: 'readonly', createdAt: '2026/05/01 10:00', expiresAt: '2026/06/01 10:00', viewCount: 42, active: true },
  { id: 's2', title: '第一章审阅', token: 'xyz789', projectId: 'proj1', chapterId: 'ch1', mode: 'commentable', createdAt: '2026/05/05 14:30', expiresAt: '', viewCount: 18, active: true }
])

const activeShareLinks = computed(() => shareLinks.value.filter(s => s.active))
const totalViews = computed(() => shareLinks.value.reduce((sum, s) => sum + s.viewCount, 0))
const totalComments = computed(() => comments.value.length)

function createShareLink() {
  if (!shareForm.title.trim()) {
    ElMessage.warning('请输入分享标题')
    return
  }
  const link = collaborationService.createShareLink({
    projectId: shareForm.projectId,
    chapterId: shareForm.chapterId,
    mode: shareForm.mode,
    title: shareForm.title,
    createdBy: '当前用户',
    expiresInDays: shareForm.expiresInDays || undefined
  })
  shareLinks.value.push({
    id: link.id,
    title: shareForm.title,
    token: link.token,
    projectId: shareForm.projectId,
    chapterId: shareForm.chapterId,
    mode: shareForm.mode,
    createdAt: new Date().toLocaleString('zh-CN'),
    expiresAt: shareForm.expiresInDays ? new Date(Date.now() + shareForm.expiresInDays * 86400000).toLocaleString('zh-CN') : '',
    viewCount: 0,
    active: true
  })
  showCreateShareDialog.value = false
  ElMessage.success('分享链接已创建')
}
function copyShareLink(row) {
  const url = collaborationService.generateShareUrl(row.token)
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  }).catch(() => {
    ElMessage.info(`链接：${url}`)
  })
}
function revokeShareLink(id) {
  ElMessageBox.confirm('确定撤销该分享链接？', '提示', { type: 'warning' }).then(() => {
    const link = shareLinks.value.find(s => s.id === id)
    if (link) link.active = false
    ElMessage.success('链接已撤销')
  }).catch(() => {})
}

// ==================== 评论审阅 ====================
const reviewChapterId = ref('')
const showAddCommentDialog = ref(false)
const commentForm = reactive({ lineNumber: 1, text: '', author: '审阅者' })

const chapterContent = {
  ch1: '清晨的阳光透过窗帘缝隙洒进房间，主角缓缓睁开了双眼。\n窗外的鸟鸣声此起彼伏，仿佛在诉说着什么。\n他起身走到窗前，推开窗户，深深吸了一口气。\n远处的山峦在薄雾中若隐若现，宛如一幅水墨画。\n桌上放着一封未拆的信件，信封已经泛黄。',
  ch2: '城市的另一端，一场阴谋正在悄然酝酿。\n昏暗的灯光下，几个人围坐在圆桌旁。\n他们的表情严肃，空气中弥漫着紧张的气氛。\n"计划已经准备好了，"其中一人低声说道。\n其他人纷纷点头，眼中闪烁着危险的光芒。',
  ch3: '命运的齿轮开始转动，两个看似毫无关联的人在一座古老的图书馆中相遇了。\n她正在翻阅一本泛黄的古籍，手指轻轻划过书页。\n他推门而入，带着一身雨水和疲惫。\n四目相对的瞬间，时间仿佛静止了。'
}

const chapterLines = computed(() => {
  const content = chapterContent[reviewChapterId.value]
  return content ? content.split('\n') : []
})

const comments = ref([
  { id: 'c1', chapterId: 'ch1', lineNumber: 5, text: '这封信的伏笔设置得很好，建议在后续章节中尽早揭示内容。', author: '编辑A', createdAt: new Date('2026-05-06T10:30:00').toISOString(), resolved: false, replies: [{ id: 'r1', author: '作者', text: '好的，我会在第三章揭示。', createdAt: new Date('2026-05-06T11:00:00').toISOString() }] },
  { id: 'c2', chapterId: 'ch1', lineNumber: 1, text: '开头的环境描写很优美，但建议增加主角的心理活动。', author: '编辑B', createdAt: new Date('2026-05-07T09:15:00').toISOString(), resolved: true, replies: [] },
  { id: 'c3', chapterId: 'ch2', lineNumber: 4, text: '对话可以更加紧凑，"计划已经准备好了"这句略显平淡。', author: '编辑A', createdAt: new Date('2026-05-08T14:20:00').toISOString(), resolved: false, replies: [] }
])

const currentComments = computed(() => {
  return comments.value.filter(c => c.chapterId === reviewChapterId.value)
})

function getLineComments(lineNum) {
  return currentComments.value.filter(c => c.lineNumber === lineNum)
}
function loadChapterReviews() {
  // 章节切换时自动加载评论
}
function addComment() {
  if (!commentForm.text.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  comments.value.push({
    id: `c-${Date.now()}`,
    chapterId: reviewChapterId.value,
    lineNumber: commentForm.lineNumber,
    text: commentForm.text,
    author: commentForm.author || '匿名',
    createdAt: new Date().toISOString(),
    resolved: false,
    replies: []
  })
  commentForm.text = ''
  showAddCommentDialog.value = false
  ElMessage.success('评论已添加')
}
function resolveComment(id) {
  const c = comments.value.find(c => c.id === id)
  if (c) c.resolved = true
}
function unresolveComment(id) {
  const c = comments.value.find(c => c.id === id)
  if (c) c.resolved = false
}
function deleteComment(id) {
  comments.value = comments.value.filter(c => c.id !== id)
  ElMessage.success('评论已删除')
}

// ==================== 版本对比 ====================
const diffVersion1 = ref('')
const diffVersion2 = ref('')
const diffLines = ref([])
const diffResult = ref(null)

const versionList = ref([
  { id: 1, time: '05/01 10:00', message: '初稿', content: '清晨的阳光透过窗帘缝隙洒进房间。\n他起身走到窗前。\n桌上放着一封未拆的信件。' },
  { id: 2, time: '05/03 15:00', message: '修改描写', content: '清晨的金色阳光透过窗帘缝隙洒进房间，主角缓缓睁开了双眼。\n他起身走到窗前，推开窗户。\n桌上放着一封未拆的信件，信封已经泛黄。' },
  { id: 3, time: '05/06 09:00', message: '润色', content: '清晨的金色阳光透过窗帘缝隙洒进房间，主角缓缓睁开了双眼。\n窗外的鸟鸣声此起彼伏。\n他起身走到窗前，推开窗户，深深吸了一口气。\n桌上放着一封未拆的信件，信封已经泛黄，散发着陈旧的气息。' }
])

function computeDiff() {
  if (!diffVersion1.value || !diffVersion2.value) return
  const v1 = versionList.value.find(v => v.id === diffVersion1.value)
  const v2 = versionList.value.find(v => v.id === diffVersion2.value)
  if (!v1 || !v2) return

  const report = collaborationService.generateDiffReport(v1.content, v2.content)
  const lines1 = v1.content.split('\n')
  const lines2 = v2.content.split('\n')

  const result = []
  let num = 0
  let addedLines = 0
  let deletedLines = 0
  let changedLines = 0

  for (const diff of report.diffs) {
    num++
    if (diff.type === 'insert') {
      addedLines++
      result.push({ num: '', text: diff.text, type: 'added' })
    } else if (diff.type === 'delete') {
      deletedLines++
      result.push({ num, text: diff.text, type: 'deleted' })
    } else {
      result.push({ num, text: diff.text, type: 'equal' })
    }
  }

  diffLines.value = result
  diffResult.value = { addedLines, deletedLines, changedLines: Math.min(addedLines, deletedLines) }
}

// ==================== 修订历史 ====================
const historyChapterId = ref('')
const revisionList = ref([])

function loadHistory() {
  if (!historyChapterId.value) return
  revisionList.value = [
    { id: 'rev5', createdAt: '2026/05/08 16:30', author: '作者', message: '润色第三章结尾', wordCount: 3500, wordChange: +200 },
    { id: 'rev4', createdAt: '2026/05/07 11:00', author: '作者', message: '修改对话描写', wordCount: 3300, wordChange: +150 },
    { id: 'rev3', createdAt: '2026/05/05 09:30', author: '编辑A', message: '审阅修改', wordCount: 3150, wordChange: -50 },
    { id: 'rev2', createdAt: '2026/05/03 15:00', author: '作者', message: '补充环境描写', wordCount: 3200, wordChange: +400 },
    { id: 'rev1', createdAt: '2026/05/01 10:00', author: '作者', message: '初稿完成', wordCount: 2800, wordChange: 0 }
  ]
}

function compareWithPrevious(row) {
  activeTab.value = 'diff'
  diffVersion2.value = row.id
  // 查找上一个版本
  const idx = revisionList.value.findIndex(r => r.id === row.id)
  if (idx < revisionList.value.length - 1) {
    diffVersion1.value = revisionList.value[idx + 1].id
  }
  computeDiff()
}

function restoreVersion(row) {
  ElMessageBox.confirm(`确定恢复到版本「${row.message}」？当前内容将被替换。`, '恢复版本', { type: 'warning' }).then(() => {
    ElMessage.success(`已恢复到版本：${row.message}`)
  }).catch(() => {})
}

function exportRevisionReport() {
  if (!historyChapterId.value) {
    ElMessage.warning('请先选择章节')
    return
  }
  const ch = chapterList.value.find(c => c.id === historyChapterId.value)
  const report = collaborationService.exportChapter(
    historyChapterId.value,
    chapterContent[historyChapterId.value] || '',
    'report'
  )
  // 触发下载
  const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `修订报告_${ch?.title || '章节'}.md`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('修订报告已导出')
}

// ==================== 工具函数 ====================
function formatTime(isoStr) {
  return new Date(isoStr).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.collaboration-page {
  padding: 20px;
  background: var(--bg-color, #f5f7fa);
  min-height: 100vh;
}
.page-header {
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: var(--text-color, #303133);
}
.share-toolbar,
.review-toolbar,
.diff-toolbar,
.history-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.share-stats {
  display: flex;
  gap: 40px;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.review-content {
  display: flex;
  gap: 0;
  min-height: 400px;
}
.chapter-text {
  flex: 1;
  padding: 16px;
  background: #fafafa;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  max-height: 500px;
}
.text-line {
  display: flex;
  align-items: flex-start;
  padding: 2px 8px;
  border-radius: 2px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.8;
  position: relative;
}
.text-line:hover {
  background: rgba(64, 158, 255, 0.06);
}
.text-line.has-comment {
  background: rgba(230, 162, 60, 0.08);
}
.line-number {
  color: #c0c4cc;
  width: 40px;
  text-align: right;
  margin-right: 12px;
  flex-shrink: 0;
  user-select: none;
}
.line-text {
  flex: 1;
  color: #303133;
  white-space: pre-wrap;
}
.comment-badge {
  position: absolute;
  right: 4px;
  top: 4px;
  background: var(--primary-color);
  color: #fff;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.comments-panel {
  width: 340px;
  padding: 16px;
  overflow-y: auto;
  max-height: 500px;
  flex-shrink: 0;
}
.comments-panel h4 {
  margin: 0 0 12px;
  font-size: 15px;
  color: var(--text-color, #303133);
}
.comment-item {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border-left: 3px solid var(--primary-color);
}
.comment-item.resolved {
  opacity: 0.6;
  border-left-color: #67c23a;
}
.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.comment-author {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-color, #303133);
}
.comment-time {
  font-size: 11px;
  color: #c0c4cc;
}
.comment-body {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}
.comment-line-ref {
  font-size: 11px;
  color: var(--primary-color);
  background: rgba(64, 158, 255, 0.08);
  padding: 1px 6px;
  border-radius: 3px;
  margin-right: 6px;
}
.comment-body p {
  margin: 4px 0 0;
}
.comment-actions {
  margin-top: 6px;
  display: flex;
  gap: 4px;
}
.comment-replies {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.reply-item {
  font-size: 12px;
  color: #909399;
  padding: 2px 0;
}
.reply-author {
  font-weight: 600;
  color: #606266;
}
.diff-stats {
  display: flex;
  gap: 40px;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.stat-added :deep(.el-statistic__number) { color: #67c23a; }
.stat-deleted :deep(.el-statistic__number) { color: #f56c6c; }
.stat-changed :deep(.el-statistic__number) { color: #e6a23c; }
.diff-content {
  padding: 16px;
  background: #fff;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.8;
}
.diff-line {
  display: flex;
  padding: 1px 12px;
  border-radius: 2px;
}
.diff-line-num {
  width: 40px;
  color: #c0c4cc;
  text-align: right;
  margin-right: 12px;
  flex-shrink: 0;
  user-select: none;
}
.diff-line-text {
  white-space: pre-wrap;
  word-break: break-all;
}
.diff-added {
  background: rgba(103, 194, 58, 0.15);
}
.diff-added .diff-line-text {
  color: #67c23a;
}
.diff-deleted {
  background: rgba(245, 108, 108, 0.15);
}
.diff-deleted .diff-line-text {
  color: #f56c6c;
  text-decoration: line-through;
}
.diff-equal {
  color: #303133;
}
.diff-empty {
  padding: 40px;
}
.text-added {
  color: #67c23a;
  font-weight: 600;
}
.text-deleted {
  color: #f56c6c;
  font-weight: 600;
}
</style>

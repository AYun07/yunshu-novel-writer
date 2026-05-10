<template>
  <div class="collaboration-hub">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">协作中心</h1>
      <p class="page-desc">团队协作、实时编辑、版本管理、审阅流程一体化</p>
    </div>

    <!-- 主要内容 -->
    <div class="hub-container">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <!-- 团队管理 -->
        <div class="sidebar-section">
          <div class="section-header">
            <h3><el-icon><UserFilled /></el-icon> 团队成员</h3>
            <el-button type="primary" size="small" @click="showInviteDialog = true">
              <el-icon><Plus /></el-icon> 邀请
            </el-button>
          </div>
          
          <div class="member-list">
            <div
              v-for="member in projectMembers"
              :key="member.userId"
              class="member-item"
              :class="{ online: isUserOnline(member.userId) }"
            >
              <div class="member-avatar">
                <img v-if="member.avatar" :src="member.avatar" :alt="member.username" />
                <div v-else class="avatar-placeholder">{{ member.username.charAt(0) }}</div>
                <span class="online-indicator" v-if="isUserOnline(member.userId)"></span>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.username }}</div>
                <div class="member-role">
                  <el-tag :type="getRoleTagType(member.role)" size="small">
                    {{ getRoleName(member.role) }}
                  </el-tag>
                </div>
              </div>
              <el-dropdown v-if="canManageMembers && member.role !== 'owner'" trigger="click">
                <el-button size="small" text>
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showChangeRoleDialog(member)">修改角色</el-dropdown-item>
                    <el-dropdown-item divided @click="removeMember(member)">移除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>

        <!-- 项目共享 -->
        <div class="sidebar-section">
          <div class="section-header">
            <h3><el-icon><Share /></el-icon> 项目共享</h3>
            <el-button type="primary" size="small" @click="showShareDialog = true">
              <el-icon><Link /></el-icon> 分享
            </el-button>
          </div>
          
          <div class="share-list">
            <div v-for="share in projectShares" :key="share.id" class="share-item">
              <div class="share-info">
                <div class="share-title">{{ share.title }}</div>
                <div class="share-meta">
                  <el-tag :type="share.mode === 'readonly' ? 'info' : 'success'" size="small">
                    {{ share.mode === 'readonly' ? '只读' : '可评论' }}
                  </el-tag>
                  <span class="share-views">{{ share.viewCount }} 次访问</span>
                </div>
              </div>
              <div class="share-actions">
                <el-button size="small" text @click="copyShareLink(share)">
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
                <el-button size="small" text type="danger" @click="disableShare(share)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <div v-if="projectShares.length === 0" class="empty-state">
              暂无分享链接
            </div>
          </div>
        </div>

        <!-- 在线状态 -->
        <div class="sidebar-section">
          <div class="section-header">
            <h3><el-icon><Connection /></el-icon> 在线状态</h3>
            <el-tag type="success" size="small">{{ onlineUsers.length }} 人在线</el-tag>
          </div>
          
          <div class="online-list">
            <div v-for="user in onlineUsers" :key="user.userId" class="online-item">
              <div class="online-avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.username" />
                <div v-else class="avatar-placeholder">{{ user.username.charAt(0) }}</div>
              </div>
              <div class="online-info">
                <div class="online-name">{{ user.username }}</div>
                <div class="online-location" v-if="user.chapterId">
                  正在编辑: {{ getChapterTitle(user.chapterId) }}
                </div>
              </div>
            </div>
            
            <div v-if="onlineUsers.length === 0" class="empty-state">
              暂无在线用户
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- 标签页 -->
        <el-tabs v-model="activeTab" class="content-tabs">
          <!-- 协作编辑器 -->
          <el-tab-pane label="协作编辑" name="editor">
            <div class="editor-container">
              <!-- 编辑器工具栏 -->
              <div class="editor-toolbar">
                <div class="toolbar-left">
                  <el-select v-model="currentChapterId" placeholder="选择章节" style="width: 200px">
                    <el-option
                      v-for="chapter in chapters"
                      :key="chapter.id"
                      :label="chapter.title"
                      :value="chapter.id"
                    />
                  </el-select>
                  
                  <el-button-group>
                    <el-button :disabled="!editLock || editLock.userId !== currentUserId" @click="saveContent">
                      <el-icon><DocumentChecked /></el-icon> 保存
                    </el-button>
                    <el-button @click="createVersionSnapshot">
                      <el-icon><Clock /></el-icon> 创建版本
                    </el-button>
                  </el-button-group>
                </div>
                
                <div class="toolbar-right">
                  <!-- 编辑锁状态 -->
                  <div class="lock-status" v-if="currentChapterId">
                    <template v-if="editLock">
                      <el-tag v-if="editLock.userId === currentUserId" type="success">
                        <el-icon><Unlock /></el-icon> 您正在编辑
                      </el-tag>
                      <el-tag v-else type="warning">
                        <el-icon><Lock /></el-icon> {{ editLock.username }} 正在编辑
                      </el-tag>
                    </template>
                    <el-button v-else type="primary" size="small" @click="requestEditLock">
                      <el-icon><Edit /></el-icon> 请求编辑
                    </el-button>
                  </div>
                  
                  <!-- 在线编辑者 -->
                  <div class="active-editors">
                    <el-avatar
                      v-for="user in chapterOnlineUsers"
                      :key="user.userId"
                      :size="28"
                      :src="user.avatar"
                      class="editor-avatar"
                    >
                      {{ user.username.charAt(0) }}
                    </el-avatar>
                  </div>
                </div>
              </div>
              
              <!-- 编辑器 -->
              <div class="editor-wrapper">
                <el-input
                  v-model="editorContent"
                  type="textarea"
                  :rows="20"
                  :disabled="!editLock || editLock.userId !== currentUserId"
                  placeholder="选择章节开始协作编辑..."
                  @input="onContentChange"
                  class="collaboration-editor"
                />
                
                <!-- 协作者光标 -->
                <div class="collaborator-cursors">
                  <div
                    v-for="cursor in collaboratorCursors"
                    :key="cursor.userId"
                    class="cursor-indicator"
                    :style="{ top: cursor.position + 'px' }"
                  >
                    <div class="cursor-line" :style="{ backgroundColor: cursor.color }"></div>
                    <div class="cursor-label" :style="{ backgroundColor: cursor.color }">
                      {{ cursor.username }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 字数统计 -->
              <div class="editor-footer">
                <span>字数: {{ editorContent.length }}</span>
                <span v-if="lastSaved">最后保存: {{ formatTime(lastSaved) }}</span>
              </div>
            </div>
          </el-tab-pane>

          <!-- 评论和批注 -->
          <el-tab-pane label="评论批注" name="comments">
            <div class="comments-container">
              <!-- 评论列表 -->
              <div class="comments-list">
                <div v-for="comment in chapterComments" :key="comment.id" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-author">
                      <el-avatar :size="32">{{ comment.author.charAt(0) }}</el-avatar>
                      <div class="author-info">
                        <span class="author-name">{{ comment.author }}</span>
                        <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                      </div>
                    </div>
                    <div class="comment-actions">
                      <el-tag v-if="comment.resolved" type="success" size="small">已解决</el-tag>
                      <el-button
                        v-else
                        size="small"
                        text
                        type="success"
                        @click="resolveComment(comment.id)"
                      >
                        标记解决
                      </el-button>
                    </div>
                  </div>
                  
                  <div class="comment-selected-text" v-if="comment.position.selectedText">
                    "{{ comment.position.selectedText }}"
                  </div>
                  
                  <div class="comment-content">{{ comment.text }}</div>
                  
                  <!-- 回复 -->
                  <div class="comment-replies" v-if="comment.replies.length > 0">
                    <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                      <span class="reply-author">{{ reply.author }}:</span>
                      <span class="reply-text">{{ reply.text }}</span>
                      <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                    </div>
                  </div>
                  
                  <!-- 回复输入 -->
                  <div class="reply-input">
                    <el-input
                      v-model="replyInputs[comment.id]"
                      placeholder="回复..."
                      size="small"
                      @keyup.enter="replyToComment(comment.id)"
                    >
                      <template #append>
                        <el-button @click="replyToComment(comment.id)">回复</el-button>
                      </template>
                    </el-input>
                  </div>
                </div>
                
                <div v-if="chapterComments.length === 0" class="empty-state">
                  暂无评论
                </div>
              </div>
              
              <!-- 添加评论 -->
              <div class="add-comment">
                <h4>添加评论</h4>
                <el-input
                  v-model="newComment"
                  type="textarea"
                  :rows="3"
                  placeholder="输入评论内容..."
                />
                <div class="comment-options">
                  <el-input v-model="selectedText" placeholder="选中的文本（可选）" />
                </div>
                <el-button type="primary" @click="addComment" :disabled="!newComment">
                  提交评论
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 版本历史 -->
          <el-tab-pane label="版本历史" name="versions">
            <div class="versions-container">
              <!-- 版本列表 -->
              <div class="version-list">
                <div
                  v-for="version in versionHistory"
                  :key="version.id"
                  class="version-item"
                  :class="{ selected: selectedVersionId === version.id }"
                  @click="selectVersion(version.id)"
                >
                  <div class="version-icon">
                    <el-icon><Document /></el-icon>
                  </div>
                  <div class="version-info">
                    <div class="version-message">{{ version.message || '无说明' }}</div>
                    <div class="version-meta">
                      <span class="version-author">{{ version.author }}</span>
                      <span class="version-time">{{ formatTime(version.createdAt) }}</span>
                      <span class="version-words">{{ version.wordCount }} 字</span>
                    </div>
                  </div>
                  <div class="version-actions">
                    <el-button size="small" text @click.stop="previewVersion(version.id)">
                      <el-icon><View /></el-icon>
                    </el-button>
                    <el-button size="small" text type="warning" @click.stop="confirmRollback(version.id)">
                      <el-icon><RefreshRight /></el-icon>
                    </el-button>
                  </div>
                </div>
                
                <div v-if="versionHistory.length === 0" class="empty-state">
                  暂无版本历史
                </div>
              </div>
              
              <!-- 版本对比 -->
              <div class="version-compare" v-if="selectedVersionId">
                <h4>版本预览</h4>
                <div class="version-preview">
                  {{ versionPreviewContent }}
                </div>
                
                <div class="compare-actions" v-if="compareVersionId">
                  <el-button type="primary" @click="compareVersions">
                    对比选中版本
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <!-- 审阅流程 -->
          <el-tab-pane label="审阅流程" name="review">
            <div class="review-container">
              <!-- 审阅状态 -->
              <div class="review-status">
                <el-steps :active="reviewStep" align-center>
                  <el-step title="提交审阅" description="作者提交作品" />
                  <el-step title="审阅中" description="审阅者查看" />
                  <el-step title="修改" description="作者修改" />
                  <el-step title="批准" description="审阅通过" />
                </el-steps>
              </div>
              
              <!-- 审阅操作 -->
              <div class="review-actions">
                <el-card v-if="canSubmitReview">
                  <template #header>
                    <span>提交审阅</span>
                  </template>
                  <el-form :model="reviewForm" label-width="80px">
                    <el-form-item label="审阅者">
                      <el-select v-model="reviewForm.reviewerId" placeholder="选择审阅者">
                        <el-option
                          v-for="member in reviewers"
                          :key="member.userId"
                          :label="member.username"
                          :value="member.userId"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="说明">
                      <el-input v-model="reviewForm.note" type="textarea" :rows="2" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitForReview">提交审阅</el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
                
                <el-card v-if="isReviewer && pendingReviews.length > 0">
                  <template #header>
                    <span>待审阅列表</span>
                  </template>
                  <div class="pending-list">
                    <div v-for="item in pendingReviews" :key="item.id" class="pending-item">
                      <div class="pending-info">
                        <span class="pending-title">{{ item.title }}</span>
                        <span class="pending-author">{{ item.author }}</span>
                      </div>
                      <div class="pending-actions">
                        <el-button type="primary" size="small" @click="startReview(item)">
                          开始审阅
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
              
              <!-- 审阅历史 -->
              <div class="review-history">
                <h4>审阅历史</h4>
                <el-timeline>
                  <el-timeline-item
                    v-for="record in reviewHistory"
                    :key="record.id"
                    :timestamp="formatTime(record.createdAt)"
                    placement="top"
                  >
                    <el-card>
                      <h4>{{ record.title }}</h4>
                      <p>{{ record.content }}</p>
                      <div class="record-meta">
                        <span>操作者: {{ record.operator }}</span>
                        <el-tag :type="getReviewStatusTagType(record.status)" size="small">
                          {{ getReviewStatusName(record.status) }}
                        </el-tag>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 邀请成员对话框 -->
    <el-dialog v-model="showInviteDialog" title="邀请成员" width="500px">
      <el-form :model="inviteForm" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="inviteForm.email" placeholder="输入成员邮箱" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="inviteForm.role" style="width: 100%">
            <el-option label="编辑者" value="editor" />
            <el-option label="审阅者" value="reviewer" />
            <el-option label="访客" value="viewer" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息">
          <el-input v-model="inviteForm.message" type="textarea" :rows="2" placeholder="邀请消息（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showInviteDialog = false">取消</el-button>
        <el-button type="primary" @click="sendInvitation">发送邀请</el-button>
      </template>
    </el-dialog>

    <!-- 分享对话框 -->
    <el-dialog v-model="showShareDialog" title="创建分享链接" width="500px">
      <el-form :model="shareForm" label-width="80px">
        <el-form-item label="分享标题">
          <el-input v-model="shareForm.title" placeholder="分享标题" />
        </el-form-item>
        <el-form-item label="分享范围">
          <el-select v-model="shareForm.chapterId" style="width: 100%">
            <el-option label="整个项目" value="" />
            <el-option
              v-for="chapter in chapters"
              :key="chapter.id"
              :label="chapter.title"
              :value="chapter.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="访问权限">
          <el-radio-group v-model="shareForm.mode">
            <el-radio label="readonly">只读</el-radio>
            <el-radio label="commentable">可评论</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期">
          <el-select v-model="shareForm.expiresInDays" style="width: 100%">
            <el-option label="永久有效" :value="0" />
            <el-option label="7天" :value="7" />
            <el-option label="30天" :value="30" />
            <el-option label="90天" :value="90" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showShareDialog = false">取消</el-button>
        <el-button type="primary" @click="createShare">创建分享</el-button>
      </template>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog v-model="showRoleDialog" title="修改角色" width="400px">
      <el-form label-width="80px">
        <el-form-item label="成员">
          <span>{{ selectedMember?.username }}</span>
        </el-form-item>
        <el-form-item label="新角色">
          <el-select v-model="newRole" style="width: 100%">
            <el-option label="编辑者" value="editor" />
            <el-option label="审阅者" value="reviewer" />
            <el-option label="访客" value="viewer" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRoleDialog = false">取消</el-button>
        <el-button type="primary" @click="changeMemberRole">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 版本回滚确认 -->
    <el-dialog v-model="showRollbackDialog" title="确认回滚" width="400px">
      <p>确定要回滚到此版本吗？当前内容将被替换。</p>
      <template #footer>
        <el-button @click="showRollbackDialog = false">取消</el-button>
        <el-button type="warning" @click="executeRollback">确认回滚</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 协作中心页面
 * 
 * 功能：
 * 1. 团队管理（成员列表、角色分配、邀请）
 * 2. 项目共享（分享设置、链接生成、访问统计）
 * 3. 实时协作（在线用户、协作编辑器、评论批注）
 * 4. 版本历史（版本列表、对比、回滚）
 * 5. 审阅流程（提交审阅、审阅意见、修改追踪）
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled, Plus, Share, Link, DocumentCopy, Delete,
  Connection, DocumentChecked, Clock, Unlock, Lock, Edit,
  MoreFilled, Document, View, RefreshRight
} from '@element-plus/icons-vue'

// 导入服务
import CollaborationService from '@/services/collaborationService.js'

// ============================================================================
// 响应式状态
// ============================================================================

const novelStore = useNovelStore()

// 协作服务实例
const collaborationService = ref(new CollaborationService())

// 当前标签页
const activeTab = ref('editor')

// 项目ID（模拟）
const currentProjectId = ref('project_001')

// 章节相关
const chapters = ref([
  { id: 'chapter_001', title: '第一章 开端', content: '' },
  { id: 'chapter_002', title: '第二章 发展', content: '' },
  { id: 'chapter_003', title: '第三章 高潮', content: '' }
])
const currentChapterId = ref('')
const editorContent = ref('')
const lastSaved = ref(null)

// 编辑锁
const editLock = ref(null)

// 团队成员
const projectMembers = ref([
  { userId: 'user_001', username: '张三', avatar: '', role: 'owner', addedAt: new Date().toISOString() },
  { userId: 'user_002', username: '李四', avatar: '', role: 'editor', addedAt: new Date().toISOString() },
  { userId: 'user_003', username: '王五', avatar: '', role: 'reviewer', addedAt: new Date().toISOString() }
])

// 在线用户
const onlineUsers = ref([])

// 分享链接
const projectShares = ref([])

// 评论
const chapterComments = ref([])
const newComment = ref('')
const selectedText = ref('')
const replyInputs = ref({})

// 版本历史
const versionHistory = ref([])
const selectedVersionId = ref('')
const compareVersionId = ref('')
const versionPreviewContent = ref('')

// 审阅相关
const reviewStep = ref(0)
const reviewForm = ref({ reviewerId: '', note: '' })
const pendingReviews = ref([])
const reviewHistory = ref([])

// 对话框状态
const showInviteDialog = ref(false)
const showShareDialog = ref(false)
const showRoleDialog = ref(false)
const showRollbackDialog = ref(false)

// 表单数据
const inviteForm = ref({ email: '', role: 'editor', message: '' })
const shareForm = ref({ title: '', chapterId: '', mode: 'readonly', expiresInDays: 0 })
const selectedMember = ref(null)
const newRole = ref('')
const rollbackVersionId = ref('')

// 协作者光标（模拟）
const collaboratorCursors = ref([])

// ============================================================================
// 计算属性
// ============================================================================

// 当前用户ID
const currentUserId = computed(() => 'user_001')

// 是否可以管理成员
const canManageMembers = computed(() => true)

// 是否是审阅者
const isReviewer = computed(() => {
  const member = projectMembers.value.find(m => m.userId === currentUserId.value)
  return member?.role === 'reviewer' || member?.role === 'owner'
})

// 是否可以提交审阅
const canSubmitReview = computed(() => {
  const member = projectMembers.value.find(m => m.userId === currentUserId.value)
  return member?.role === 'editor' || member?.role === 'owner'
})

// 审阅者列表
const reviewers = computed(() => {
  return projectMembers.value.filter(m => m.role === 'reviewer' || m.role === 'owner')
})

// 当前章节在线用户
const chapterOnlineUsers = computed(() => {
  if (!currentChapterId.value) return []
  return onlineUsers.value.filter(u => u.chapterId === currentChapterId.value)
})

// ============================================================================
// 方法
// ============================================================================

/**
 * 获取角色名称
 */
function getRoleName(role) {
  const roleNames = {
    owner: '所有者',
    editor: '编辑者',
    reviewer: '审阅者',
    viewer: '访客'
  }
  return roleNames[role] || role
}

/**
 * 获取角色标签类型
 */
function getRoleTagType(role) {
  const types = {
    owner: 'danger',
    editor: 'primary',
    reviewer: 'warning',
    viewer: 'info'
  }
  return types[role] || 'info'
}

/**
 * 检查用户是否在线
 */
function isUserOnline(userId) {
  return onlineUsers.value.some(u => u.userId === userId)
}

/**
 * 获取章节标题
 */
function getChapterTitle(chapterId) {
  const chapter = chapters.value.find(c => c.id === chapterId)
  return chapter ? chapter.title : '未知章节'
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
 * 请求编辑锁
 */
async function requestEditLock() {
  if (!currentChapterId.value) {
    ElMessage.warning('请先选择章节')
    return
  }

  try {
    // 模拟请求编辑锁
    editLock.value = {
      lockId: 'lock_001',
      userId: currentUserId.value,
      username: '当前用户',
      chapterId: currentChapterId.value
    }
    ElMessage.success('已获取编辑权限')
  } catch (error) {
    ElMessage.error(error.message)
  }
}

/**
 * 释放编辑锁
 */
function releaseEditLock() {
  if (editLock.value && editLock.value.userId === currentUserId.value) {
    editLock.value = null
  }
}

/**
 * 保存内容
 */
async function saveContent() {
  if (!currentChapterId.value) return
  
  // 更新章节内容
  const chapter = chapters.value.find(c => c.id === currentChapterId.value)
  if (chapter) {
    chapter.content = editorContent.value
  }
  
  lastSaved.value = new Date().toISOString()
  ElMessage.success('保存成功')
}

/**
 * 创建版本快照
 */
async function createVersionSnapshot() {
  if (!currentChapterId.value) {
    ElMessage.warning('请先选择章节')
    return
  }

  const { value: message } = await ElMessageBox.prompt('请输入版本说明', '创建版本', {
    confirmButtonText: '创建',
    cancelButtonText: '取消',
    inputPlaceholder: '版本说明（可选）'
  }).catch(() => ({ value: '' }))

  const version = {
    id: 'version_' + Date.now(),
    chapterId: currentChapterId.value,
    content: editorContent.value,
    wordCount: editorContent.value.length,
    author: '当前用户',
    authorId: currentUserId.value,
    message: message || '手动保存',
    createdAt: new Date().toISOString()
  }

  versionHistory.value.unshift(version)
  ElMessage.success('版本已创建')
}

/**
 * 内容变更处理
 */
function onContentChange() {
  // 可以在这里实现自动保存或同步
}

/**
 * 添加评论
 */
function addComment() {
  if (!newComment.value) return

  const comment = {
    id: 'comment_' + Date.now(),
    chapterId: currentChapterId.value,
    text: newComment.value,
    author: '当前用户',
    authorId: currentUserId.value,
    position: {
      startOffset: 0,
      endOffset: 0,
      selectedText: selectedText.value
    },
    createdAt: new Date().toISOString(),
    resolved: false,
    replies: []
  }

  chapterComments.value.unshift(comment)
  newComment.value = ''
  selectedText.value = ''
  ElMessage.success('评论已添加')
}

/**
 * 解决评论
 */
function resolveComment(commentId) {
  const comment = chapterComments.value.find(c => c.id === commentId)
  if (comment) {
    comment.resolved = true
    ElMessage.success('评论已标记为解决')
  }
}

/**
 * 回复评论
 */
function replyToComment(commentId) {
  const replyText = replyInputs.value[commentId]
  if (!replyText) return

  const comment = chapterComments.value.find(c => c.id === commentId)
  if (comment) {
    comment.replies.push({
      id: 'reply_' + Date.now(),
      text: replyText,
      author: '当前用户',
      authorId: currentUserId.value,
      createdAt: new Date().toISOString()
    })
    replyInputs.value[commentId] = ''
    ElMessage.success('回复已添加')
  }
}

/**
 * 选择版本
 */
function selectVersion(versionId) {
  selectedVersionId.value = versionId
  const version = versionHistory.value.find(v => v.id === versionId)
  if (version) {
    versionPreviewContent.value = version.content
  }
}

/**
 * 预览版本
 */
function previewVersion(versionId) {
  selectVersion(versionId)
}

/**
 * 确认回滚
 */
function confirmRollback(versionId) {
  rollbackVersionId.value = versionId
  showRollbackDialog.value = true
}

/**
 * 执行回滚
 */
function executeRollback() {
  const version = versionHistory.value.find(v => v.id === rollbackVersionId.value)
  if (version) {
    editorContent.value = version.content
    ElMessage.success('已回滚到指定版本')
  }
  showRollbackDialog.value = false
}

/**
 * 对比版本
 */
function compareVersions() {
  if (!selectedVersionId.value || !compareVersionId.value) {
    ElMessage.warning('请选择两个版本进行对比')
    return
  }
  ElMessage.info('版本对比功能开发中...')
}

/**
 * 发送邀请
 */
function sendInvitation() {
  if (!inviteForm.value.email) {
    ElMessage.warning('请输入邮箱')
    return
  }

  // 模拟发送邀请
  ElMessage.success(`已向 ${inviteForm.value.email} 发送邀请`)
  showInviteDialog.value = false
  inviteForm.value = { email: '', role: 'editor', message: '' }
}

/**
 * 创建分享
 */
function createShare() {
  if (!shareForm.value.title) {
    ElMessage.warning('请输入分享标题')
    return
  }

  const share = {
    id: 'share_' + Date.now(),
    token: Math.random().toString(36).substring(2, 10),
    title: shareForm.value.title,
    chapterId: shareForm.value.chapterId,
    mode: shareForm.value.mode,
    viewCount: 0,
    createdAt: new Date().toISOString()
  }

  projectShares.value.unshift(share)
  ElMessage.success('分享链接已创建')
  showShareDialog.value = false
  shareForm.value = { title: '', chapterId: '', mode: 'readonly', expiresInDays: 0 }
}

/**
 * 复制分享链接
 */
function copyShareLink(share) {
  const link = `${window.location.origin}/share/${share.token}`
  navigator.clipboard.writeText(link)
  ElMessage.success('链接已复制')
}

/**
 * 禁用分享
 */
function disableShare(share) {
  const index = projectShares.value.findIndex(s => s.id === share.id)
  if (index > -1) {
    projectShares.value.splice(index, 1)
    ElMessage.success('分享已禁用')
  }
}

/**
 * 显示修改角色对话框
 */
function showChangeRoleDialog(member) {
  selectedMember.value = member
  newRole.value = member.role
  showRoleDialog.value = true
}

/**
 * 修改成员角色
 */
function changeMemberRole() {
  if (selectedMember.value) {
    selectedMember.value.role = newRole.value
    ElMessage.success('角色已修改')
  }
  showRoleDialog.value = false
}

/**
 * 移除成员
 */
async function removeMember(member) {
  try {
    await ElMessageBox.confirm(`确定要移除成员 ${member.username} 吗？`, '确认移除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = projectMembers.value.findIndex(m => m.userId === member.userId)
    if (index > -1) {
      projectMembers.value.splice(index, 1)
      ElMessage.success('成员已移除')
    }
  } catch {
    // 取消操作
  }
}

/**
 * 提交审阅
 */
function submitForReview() {
  if (!reviewForm.value.reviewerId) {
    ElMessage.warning('请选择审阅者')
    return
  }

  reviewStep.value = 1
  pendingReviews.value.push({
    id: 'review_' + Date.now(),
    title: chapters.value.find(c => c.id === currentChapterId.value)?.title || '未命名章节',
    author: '当前用户',
    reviewerId: reviewForm.value.reviewerId
  })

  ElMessage.success('已提交审阅')
  reviewForm.value = { reviewerId: '', note: '' }
}

/**
 * 开始审阅
 */
function startReview(item) {
  reviewStep.value = 2
  ElMessage.info('进入审阅模式...')
}

/**
 * 获取审阅状态标签类型
 */
function getReviewStatusTagType(status) {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    revision: 'info'
  }
  return types[status] || 'info'
}

/**
 * 获取审阅状态名称
 */
function getReviewStatusName(status) {
  const names = {
    pending: '待审阅',
    approved: '已批准',
    rejected: '已拒绝',
    revision: '需修改'
  }
  return names[status] || status
}

// ============================================================================
// 生命周期
// ============================================================================

onMounted(() => {
  // 模拟在线用户
  onlineUsers.value = [
    { userId: 'user_001', username: '张三', avatar: '', chapterId: 'chapter_001' },
    { userId: 'user_002', username: '李四', avatar: '', chapterId: 'chapter_002' }
  ]

  // 模拟版本历史
  versionHistory.value = [
    {
      id: 'version_001',
      chapterId: 'chapter_001',
      content: '这是第一个版本的内容...',
      wordCount: 100,
      author: '张三',
      authorId: 'user_001',
      message: '初始版本',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'version_002',
      chapterId: 'chapter_001',
      content: '这是第二个版本的内容，经过了一些修改...',
      wordCount: 150,
      author: '李四',
      authorId: 'user_002',
      message: '修改了开头',
      createdAt: new Date().toISOString()
    }
  ]

  // 模拟评论
  chapterComments.value = [
    {
      id: 'comment_001',
      chapterId: 'chapter_001',
      text: '这段描写很生动，建议保留。',
      author: '王五',
      authorId: 'user_003',
      position: { startOffset: 0, endOffset: 50, selectedText: '开头的描写段落' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      resolved: false,
      replies: []
    }
  ]
})

// 监听章节切换
watch(currentChapterId, (newChapterId) => {
  if (newChapterId) {
    const chapter = chapters.value.find(c => c.id === newChapterId)
    if (chapter) {
      editorContent.value = chapter.content
    }
    // 释放之前的编辑锁
    releaseEditLock()
    editLock.value = null
  }
})

// 组件卸载时释放锁
onUnmounted(() => {
  releaseEditLock()
})
</script>

<style scoped>
.collaboration-hub {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 主容器 */
.hub-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 成员列表 */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.member-item:hover {
  background: #f5f7fa;
}

.member-avatar {
  position: relative;
}

.member-avatar img,
.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: white;
  font-weight: 600;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #67c23a;
  border: 2px solid white;
  border-radius: 50%;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.member-role {
  margin-top: 2px;
}

/* 分享列表 */
.share-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.share-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
}

.share-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.share-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.share-views {
  font-size: 12px;
  color: #909399;
}

.share-actions {
  display: flex;
  gap: 4px;
}

/* 在线列表 */
.online-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.online-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
}

.online-avatar img,
.online-avatar .avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.online-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.online-location {
  font-size: 12px;
  color: #909399;
}

/* 主内容 */
.main-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.content-tabs {
  padding: 16px;
}

/* 编辑器 */
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lock-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.active-editors {
  display: flex;
  gap: -8px;
}

.editor-avatar {
  border: 2px solid white;
  margin-left: -8px;
}

.editor-avatar:first-child {
  margin-left: 0;
}

.editor-wrapper {
  position: relative;
}

.collaboration-editor :deep(textarea) {
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  line-height: 1.8;
}

.collaborator-cursors {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.cursor-indicator {
  position: absolute;
  left: 0;
}

.cursor-line {
  width: 2px;
  height: 20px;
}

.cursor-label {
  position: absolute;
  top: -20px;
  left: 0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  color: white;
  white-space: nowrap;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

/* 评论 */
.comments-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-selected-text {
  padding: 8px 12px;
  background: #fdf6ec;
  border-left: 3px solid #e6a23c;
  font-style: italic;
  color: #606266;
  margin-bottom: 12px;
}

.comment-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.comment-replies {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.reply-item {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.reply-author {
  font-weight: 600;
  color: #303133;
}

.reply-time {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.reply-input {
  margin-top: 12px;
}

.add-comment {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.add-comment h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.comment-options {
  margin: 12px 0;
}

/* 版本历史 */
.versions-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.version-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.version-item:hover {
  border-color: #409eff;
}

.version-item.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.version-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  color: #409eff;
}

.version-info {
  flex: 1;
}

.version-message {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.version-meta {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.version-actions {
  display: flex;
  gap: 4px;
}

.version-compare h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
}

.version-preview {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
}

/* 审阅 */
.review-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-status {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 8px;
}

.review-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.pending-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.pending-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.pending-author {
  font-size: 12px;
  color: #909399;
}

.review-history h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.record-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 13px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .hub-container {
    grid-template-columns: 1fr;
  }

  .comments-container,
  .versions-container {
    grid-template-columns: 1fr;
  }

  .review-actions {
    grid-template-columns: 1fr;
  }
}
</style>

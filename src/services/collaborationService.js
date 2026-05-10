/**
 * 云书 - 编辑者协作模式服务
 * 
 * 对标 Quoll Writer 编辑者模式，提供完整的协作编辑功能。
 * 
 * 功能模块：
 * 1. 分享链接生成（只读/可评论两种模式）
 * 2. 评论系统（行内批注，支持定位、回复、解决状态）
 * 3. 审阅者模式 UI 状态管理
 * 4. Diff 对比功能（基于 diff-match-patch 库）
 *    - 章节版本对比
 *    - 修改建议追踪
 *    - 接受/拒绝修改
 * 5. 修订历史管理
 * 6. 导出带批注版本
 * 
 * 依赖：diff-match-patch
 * 安装：npm install diff-match-patch
 */

import DiffMatchPatch from 'diff-match-patch'

// ============================================================================
// diff-match-patch 实例
// ============================================================================

const dmp = new DiffMatchPatch()

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成唯一 ID
 * @returns {string} 短格式唯一标识（8位随机字符）
 */
function generateId () {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

/**
 * 生成分享令牌
 * @returns {string} 安全的分享令牌
 */
function generateShareToken () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * 格式化日期为可读字符串
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
function formatDate (date) {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// ============================================================================
// 评论系统
// ============================================================================

/**
 * 评论数据结构
 * @typedef {Object} Comment
 * @property {string} id - 评论唯一标识
 * @property {string} chapterId - 所属章节ID
 * @property {Object} position - 定位信息
 * @property {number} position.startOffset - 起始偏移量（字符位置）
 * @property {number} position.endOffset - 结束偏移量（字符位置）
 * @property {string} position.selectedText - 选中的文本片段
 * @property {string} text - 评论内容
 * @property {string} author - 评论者名称
 * @property {string} authorId - 评论者ID
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 * @property {boolean} resolved - 是否已解决
 * @property {Array<CommentReply>} replies - 回复列表
 */

/**
 * 评论回复数据结构
 * @typedef {Object} CommentReply
 * @property {string} id - 回复ID
 * @property {string} text - 回复内容
 * @property {string} author - 回复者名称
 * @property {string} authorId - 回复者ID
 * @property {string} createdAt - 创建时间
 */

/**
 * 评论管理器
 * 负责评论的增删改查、解决状态管理
 */
class CommentManager {
  constructor () {
    /** @type {Map<string, Comment[]>} 按章节ID索引的评论 */
    this.comments = new Map()

    /** 评论变更回调 */
    this.onChangeCallbacks = []
  }

  /**
   * 注册变更回调
   * @param {Function} callback - 回调函数，参数为 (comments: Comment[], action: string, comment: Comment)
   */
  onChange (callback) {
    this.onChangeCallbacks.push(callback)
  }

  /**
   * 触发变更回调
   * @param {string} action - 操作类型 (add/update/delete/resolve/unresolve)
   * @param {Comment} comment - 相关评论
   */
  _emitChange (action, comment) {
    const allComments = this.getAllComments()
    this.onChangeCallbacks.forEach(cb => {
      try {
        cb(allComments, action, comment)
      } catch (e) {
        console.error('[评论管理器] 回调执行失败:', e)
      }
    })
  }

  /**
   * 获取指定章节的所有评论
   * @param {string} chapterId - 章节ID
   * @returns {Comment[]} 评论列表
   */
  getChapterComments (chapterId) {
    return this.comments.get(chapterId) || []
  }

  /**
   * 获取所有评论
   * @returns {Comment[]} 全部评论
   */
  getAllComments () {
    const all = []
    for (const comments of this.comments.values()) {
      all.push(...comments)
    }
    return all
  }

  /**
   * 添加评论
   * @param {Object} params - 评论参数
   * @param {string} params.chapterId - 章节ID
   * @param {Object} params.position - 定位信息
   * @param {string} params.text - 评论内容
   * @param {string} params.author - 评论者名称
   * @param {string} params.authorId - 评论者ID
   * @returns {Comment} 创建的评论
   */
  addComment ({ chapterId, position, text, author, authorId }) {
    const comment = {
      id: generateId(),
      chapterId,
      position: {
        startOffset: position.startOffset || 0,
        endOffset: position.endOffset || 0,
        selectedText: position.selectedText || ''
      },
      text,
      author,
      authorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolved: false,
      replies: []
    }

    if (!this.comments.has(chapterId)) {
      this.comments.set(chapterId, [])
    }
    this.comments.get(chapterId).push(comment)

    this._emitChange('add', comment)
    return comment
  }

  /**
   * 更新评论内容
   * @param {string} commentId - 评论ID
   * @param {string} newText - 新内容
   * @returns {Comment|null} 更新后的评论
   */
  updateComment (commentId, newText) {
    const comment = this._findComment(commentId)
    if (!comment) return null

    comment.text = newText
    comment.updatedAt = new Date().toISOString()
    this._emitChange('update', comment)
    return comment
  }

  /**
   * 删除评论
   * @param {string} commentId - 评论ID
   * @returns {boolean} 是否成功删除
   */
  deleteComment (commentId) {
    for (const [chapterId, comments] of this.comments) {
      const index = comments.findIndex(c => c.id === commentId)
      if (index !== -1) {
        const [removed] = comments.splice(index, 1)
        this._emitChange('delete', removed)
        return true
      }
    }
    return false
  }

  /**
   * 解决评论
   * @param {string} commentId - 评论ID
   * @returns {Comment|null}
   */
  resolveComment (commentId) {
    const comment = this._findComment(commentId)
    if (!comment) return null
    comment.resolved = true
    comment.updatedAt = new Date().toISOString()
    this._emitChange('resolve', comment)
    return comment
  }

  /**
   * 取消解决评论
   * @param {string} commentId - 评论ID
   * @returns {Comment|null}
   */
  unresolveComment (commentId) {
    const comment = this._findComment(commentId)
    if (!comment) return null
    comment.resolved = false
    comment.updatedAt = new Date().toISOString()
    this._emitChange('unresolve', comment)
    return comment
  }

  /**
   * 回复评论
   * @param {string} commentId - 评论ID
   * @param {string} text - 回复内容
   * @param {string} author - 回复者名称
   * @param {string} authorId - 回复者ID
   * @returns {CommentReply|null} 创建的回复
   */
  replyToComment (commentId, text, author, authorId) {
    const comment = this._findComment(commentId)
    if (!comment) return null

    const reply = {
      id: generateId(),
      text,
      author,
      authorId,
      createdAt: new Date().toISOString()
    }

    comment.replies.push(reply)
    comment.updatedAt = new Date().toISOString()
    this._emitChange('reply', comment)
    return reply
  }

  /**
   * 删除回复
   * @param {string} commentId - 评论ID
   * @param {string} replyId - 回复ID
   * @returns {boolean}
   */
  deleteReply (commentId, replyId) {
    const comment = this._findComment(commentId)
    if (!comment) return false

    const index = comment.replies.findIndex(r => r.id === replyId)
    if (index !== -1) {
      comment.replies.splice(index, 1)
      comment.updatedAt = new Date().toISOString()
      this._emitChange('reply', comment)
      return true
    }
    return false
  }

  /**
   * 获取章节评论统计
   * @param {string} chapterId - 章节ID
   * @returns {Object} 统计信息
   */
  getChapterCommentStats (chapterId) {
    const comments = this.getChapterComments(chapterId)
    return {
      total: comments.length,
      unresolved: comments.filter(c => !c.resolved).length,
      resolved: comments.filter(c => c.resolved).length,
      authors: [...new Set(comments.map(c => c.author))]
    }
  }

  /**
   * 内部方法：查找评论
   * @param {string} commentId - 评论ID
   * @returns {Comment|null}
   */
  _findComment (commentId) {
    for (const comments of this.comments.values()) {
      const comment = comments.find(c => c.id === commentId)
      if (comment) return comment
    }
    return null
  }

  /**
   * 导出评论数据为 JSON
   * @returns {Object} 可序列化的评论数据
   */
  exportData () {
    const data = {}
    for (const [chapterId, comments] of this.comments) {
      data[chapterId] = deepClone(comments)
    }
    return data
  }

  /**
   * 从 JSON 导入评论数据
   * @param {Object} data - 评论数据
   */
  importData (data) {
    this.comments.clear()
    for (const [chapterId, comments] of Object.entries(data)) {
      this.comments.set(chapterId, deepClone(comments))
    }
    this._emitChange('import', null)
  }
}

// ============================================================================
// 分享链接管理
// ============================================================================

/**
 * 分享数据结构
 * @typedef {Object} ShareLink
 * @property {string} id - 分享ID
 * @property {string} token - 分享令牌
 * @property {string} projectId - 项目ID
 * @property {string} chapterId - 章节ID（可选，空表示整个项目）
 * @property {'readonly'|'commentable'} mode - 分享模式
 * @property {string} title - 分享标题
 * @property {string} createdBy - 创建者
 * @property {string} createdAt - 创建时间
 * @property {string|null} expiresAt - 过期时间（null表示永不过期）
 * @property {number} viewCount - 访问次数
 * @property {boolean} active - 是否有效
 */

/**
 * 分享链接管理器
 */
class ShareLinkManager {
  constructor () {
    /** @type {Map<string, ShareLink>} 分享链接存储 */
    this.shares = new Map()
  }

  /**
   * 创建分享链接
   * @param {Object} params - 创建参数
   * @param {string} params.projectId - 项目ID
   * @param {string} [params.chapterId] - 章节ID
   * @param {'readonly'|'commentable'} params.mode - 分享模式
   * @param {string} params.title - 分享标题
   * @param {string} params.createdBy - 创建者
   * @param {number} [params.expiresInDays] - 有效天数（不设置则永不过期）
   * @returns {ShareLink} 创建的分享链接
   */
  createShareLink ({ projectId, chapterId = '', mode = 'readonly', title = '未命名分享', createdBy, expiresInDays }) {
    const share = {
      id: generateId(),
      token: generateShareToken(),
      projectId,
      chapterId,
      mode,
      title,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: expiresInDays
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null,
      viewCount: 0,
      active: true
    }

    this.shares.set(share.id, share)
    return share
  }

  /**
   * 通过令牌获取分享链接
   * @param {string} token - 分享令牌
   * @returns {ShareLink|null}
   */
  getByToken (token) {
    for (const share of this.shares.values()) {
      if (share.token === token && share.active) {
        // 检查是否过期
        if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
          share.active = false
          return null
        }
        share.viewCount++
        return share
      }
    }
    return null
  }

  /**
   * 通过ID获取分享链接
   * @param {string} id - 分享ID
   * @returns {ShareLink|null}
   */
  getById (id) {
    return this.shares.get(id) || null
  }

  /**
   * 禁用分享链接
   * @param {string} id - 分享ID
   * @returns {boolean}
   */
  disableShare (id) {
    const share = this.shares.get(id)
    if (share) {
      share.active = false
      return true
    }
    return false
  }

  /**
   * 删除分享链接
   * @param {string} id - 分享ID
   * @returns {boolean}
   */
  deleteShare (id) {
    return this.shares.delete(id)
  }

  /**
   * 获取项目的所有分享链接
   * @param {string} projectId - 项目ID
   * @returns {ShareLink[]}
   */
  getProjectShares (projectId) {
    return Array.from(this.shares.values())
      .filter(s => s.projectId === projectId)
  }

  /**
   * 生成分享 URL
   * @param {string} token - 分享令牌
   * @param {string} [baseUrl] - 基础URL
   * @returns {string} 完整的分享URL
   */
  generateShareUrl (token, baseUrl = window.location.origin) {
    return `${baseUrl}/share/${token}`
  }
}

// ============================================================================
// Diff 对比引擎
// ============================================================================

/**
 * Diff 操作类型
 * @typedef {Object} DiffOperation
 * @property {number} operation - 操作类型 (0=不变, 1=插入, -1=删除)
 * @property {string} text - 文本内容
 */

/**
 * 修改建议数据结构
 * @typedef {Object} Suggestion
 * @property {string} id - 建议ID
 * @property {number} startIndex - 在原文中的起始位置
 * @property {number} endIndex - 在原文中的结束位置
 * @property {string} originalText - 原始文本
 * @property {string} suggestedText - 建议文本
 * @property {string} author - 建议者
 * @property {string} authorId - 建议者ID
 * @property {string} comment - 建议说明
 * @property {string} createdAt - 创建时间
 * @property {'pending'|'accepted'|'rejected'} status - 状态
 */

/**
 * Diff 对比引擎
 * 基于 diff-match-patch 库实现文本对比功能
 */
class DiffEngine {
  constructor () {
    /** @type {Map<string, Suggestion[]>} 按章节ID索引的修改建议 */
    this.suggestions = new Map()

    /** 建议变更回调 */
    this.onSuggestionChangeCallbacks = []
  }

  /**
   * 注册建议变更回调
   * @param {Function} callback - 回调函数
   */
  onSuggestionChange (callback) {
    this.onSuggestionChangeCallbacks.push(callback)
  }

  /**
   * 触发建议变更回调
   * @param {string} action - 操作类型
   * @param {Suggestion} suggestion - 相关建议
   */
  _emitSuggestionChange (action, suggestion) {
    this.onSuggestionChangeCallbacks.forEach(cb => {
      try {
        cb(action, suggestion)
      } catch (e) {
        console.error('[Diff引擎] 回调执行失败:', e)
      }
    })
  }

  /**
   * 计算两个文本的差异
   * @param {string} text1 - 原始文本
   * @param {string} text2 - 修改后文本
   * @returns {DiffOperation[]} 差异操作列表
   */
  computeDiff (text1, text2) {
    const diffs = dmp.diff_main(text1, text2)
    dmp.diff_cleanupSemantic(diffs)
    return diffs.map(([operation, text]) => ({ operation, text }))
  }

  /**
   * 生成人类可读的差异报告
   * @param {string} text1 - 原始文本
   * @param {string} text2 - 修改后文本
   * @returns {Object} 差异报告
   */
  generateDiffReport (text1, text2) {
    const diffs = this.computeDiff(text1, text2)

    let insertions = 0
    let deletions = 0
    let unchanged = 0

    const diffLines = []

    for (const diff of diffs) {
      const lines = diff.text.split('\n')
      for (const line of lines) {
        if (diff.operation === 1) {
          insertions += line.length
          diffLines.push({ type: 'insert', text: line })
        } else if (diff.operation === -1) {
          deletions += line.length
          diffLines.push({ type: 'delete', text: line })
        } else {
          unchanged += line.length
          diffLines.push({ type: 'equal', text: line })
        }
      }
    }

    return {
      summary: {
        insertions,
        deletions,
        unchanged,
        totalChanges: insertions + deletions,
        similarity: text1.length + text2.length > 0
          ? Math.round((1 - (insertions + deletions) / (text1.length + text2.length)) * 100)
          : 100
      },
      diffs: diffLines
    }
  }

  /**
   * 生成 HTML 格式的差异对比
   * @param {string} text1 - 原始文本
   * @param {string} text2 - 修改后文本
   * @returns {string} HTML 字符串
   */
  generateDiffHtml (text1, text2) {
    const diffs = this.computeDiff(text1, text2)

    let html = '<div class="diff-container">'

    for (const diff of diffs) {
      const escapedText = diff.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')

      if (diff.operation === 1) {
        html += `<span class="diff-insert">${escapedText}</span>`
      } else if (diff.operation === -1) {
        html += `<span class="diff-delete">${escapedText}</span>`
      } else {
        html += `<span class="diff-equal">${escapedText}</span>`
      }
    }

    html += '</div>'
    return html
  }

  /**
   * 生成并排对比数据
   * @param {string} text1 - 原始文本
   * @param {string} text2 - 修改后文本
   * @returns {Object} 并排对比数据
   */
  generateSideBySideDiff (text1, text2) {
    const diffs = this.computeDiff(text1, text2)

    const leftLines = []  // 原文行
    const rightLines = [] // 修改后行

    let leftBuffer = ''
    let rightBuffer = ''

    for (const diff of diffs) {
      const lines = diff.text.split('\n')

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const isLast = i === lines.length - 1

        if (diff.operation === 0) {
          // 不变的内容
          if (leftBuffer) {
            leftLines.push({ type: 'delete', text: leftBuffer })
            leftBuffer = ''
          }
          if (rightBuffer) {
            rightLines.push({ type: 'insert', text: rightBuffer })
            rightBuffer = ''
          }
          if (!isLast || line) {
            leftLines.push({ type: 'equal', text: line })
            rightLines.push({ type: 'equal', text: line })
          }
        } else if (diff.operation === -1) {
          leftBuffer += (leftBuffer ? '\n' : '') + line
        } else if (diff.operation === 1) {
          rightBuffer += (rightBuffer ? '\n' : '') + line
        }
      }
    }

    // 处理剩余缓冲
    if (leftBuffer) {
      leftLines.push({ type: 'delete', text: leftBuffer })
    }
    if (rightBuffer) {
      rightLines.push({ type: 'insert', text: rightBuffer })
    }

    return { left: leftLines, right: rightLines }
  }

  /**
   * 添加修改建议
   * @param {Object} params - 建议参数
   * @param {string} params.chapterId - 章节ID
   * @param {number} params.startIndex - 起始位置
   * @param {number} params.endIndex - 结束位置
   * @param {string} params.originalText - 原始文本
   * @param {string} params.suggestedText - 建议文本
   * @param {string} params.author - 建议者
   * @param {string} params.authorId - 建议者ID
   * @param {string} [params.comment] - 建议说明
   * @returns {Suggestion} 创建的建议
   */
  addSuggestion ({ chapterId, startIndex, endIndex, originalText, suggestedText, author, authorId, comment = '' }) {
    const suggestion = {
      id: generateId(),
      chapterId,
      startIndex,
      endIndex,
      originalText,
      suggestedText,
      author,
      authorId,
      comment,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    if (!this.suggestions.has(chapterId)) {
      this.suggestions.set(chapterId, [])
    }
    this.suggestions.get(chapterId).push(suggestion)

    this._emitSuggestionChange('add', suggestion)
    return suggestion
  }

  /**
   * 接受修改建议
   * @param {string} suggestionId - 建议ID
   * @returns {Suggestion|null}
   */
  acceptSuggestion (suggestionId) {
    const suggestion = this._findSuggestion(suggestionId)
    if (!suggestion) return null
    suggestion.status = 'accepted'
    this._emitSuggestionChange('accept', suggestion)
    return suggestion
  }

  /**
   * 拒绝修改建议
   * @param {string} suggestionId - 建议ID
   * @returns {Suggestion|null}
   */
  rejectSuggestion (suggestionId) {
    const suggestion = this._findSuggestion(suggestionId)
    if (!suggestion) return null
    suggestion.status = 'rejected'
    this._emitSuggestionChange('reject', suggestion)
    return suggestion
  }

  /**
   * 将所有待处理的建议应用到文本
   * @param {string} chapterId - 章节ID
   * @param {string} text - 原始文本
   * @returns {string} 应用建议后的文本
   */
  applyAllSuggestions (chapterId, text) {
    const suggestions = this.suggestions.get(chapterId) || []
    const pending = suggestions
      .filter(s => s.status === 'pending')
      .sort((a, b) => b.startIndex - a.startIndex) // 从后往前替换

    let result = text
    for (const suggestion of pending) {
      const before = result.substring(0, suggestion.startIndex)
      const after = result.substring(suggestion.endIndex)
      result = before + suggestion.suggestedText + after
      suggestion.status = 'accepted'
    }

    return result
  }

  /**
   * 获取章节的所有修改建议
   * @param {string} chapterId - 章节ID
   * @returns {Suggestion[]}
   */
  getChapterSuggestions (chapterId) {
    return this.suggestions.get(chapterId) || []
  }

  /**
   * 获取建议统计
   * @param {string} chapterId - 章节ID
   * @returns {Object} 统计信息
   */
  getSuggestionStats (chapterId) {
    const suggestions = this.getChapterSuggestions(chapterId)
    return {
      total: suggestions.length,
      pending: suggestions.filter(s => s.status === 'pending').length,
      accepted: suggestions.filter(s => s.status === 'accepted').length,
      rejected: suggestions.filter(s => s.status === 'rejected').length
    }
  }

  /**
   * 内部方法：查找建议
   * @param {string} suggestionId - 建议ID
   * @returns {Suggestion|null}
   */
  _findSuggestion (suggestionId) {
    for (const suggestions of this.suggestions.values()) {
      const suggestion = suggestions.find(s => s.id === suggestionId)
      if (suggestion) return suggestion
    }
    return null
  }
}

// ============================================================================
// 修订历史管理
// ============================================================================

/**
 * 修订版本数据结构
 * @typedef {Object} Revision
 * @property {string} id - 版本ID
 * @property {string} chapterId - 章节ID
 * @property {string} content - 版本内容
 * @property {number} wordCount - 字数
 * @property {string} author - 修改者
 * @property {string} authorId - 修改者ID
 * @property {string} message - 修订说明
 * @property {string} createdAt - 创建时间
 * @property {string} [parentId] - 父版本ID
 */

/**
 * 修订历史管理器
 */
class RevisionManager {
  constructor () {
    /** @type {Map<string, Revision[]>} 按章节ID索引的修订历史 */
    this.revisions = new Map()

    /** 最大保留版本数 */
    this.maxRevisions = 100
  }

  /**
   * 保存修订版本
   * @param {Object} params - 修订参数
   * @param {string} params.chapterId - 章节ID
   * @param {string} params.content - 章节内容
   * @param {string} params.author - 修改者
   * @param {string} params.authorId - 修改者ID
   * @param {string} [params.message] - 修订说明
   * @param {string} [params.parentId] - 父版本ID
   * @returns {Revision} 创建的修订版本
   */
  saveRevision ({ chapterId, content, author, authorId, message = '', parentId }) {
    const revision = {
      id: generateId(),
      chapterId,
      content,
      wordCount: content.length,
      author,
      authorId,
      message,
      createdAt: new Date().toISOString(),
      parentId: parentId || this._getLatestRevisionId(chapterId)
    }

    if (!this.revisions.has(chapterId)) {
      this.revisions.set(chapterId, [])
    }

    const revisions = this.revisions.get(chapterId)
    revisions.push(revision)

    // 限制最大版本数
    if (revisions.length > this.maxRevisions) {
      this.revisions.set(chapterId, revisions.slice(-this.maxRevisions))
    }

    return revision
  }

  /**
   * 获取章节的修订历史
   * @param {string} chapterId - 章节ID
   * @param {number} [limit=20] - 返回数量限制
   * @returns {Revision[]} 修订历史列表（按时间倒序）
   */
  getRevisions (chapterId, limit = 20) {
    const revisions = this.revisions.get(chapterId) || []
    return revisions.slice(-limit).reverse()
  }

  /**
   * 获取指定版本
   * @param {string} revisionId - 版本ID
   * @returns {Revision|null}
   */
  getRevision (revisionId) {
    for (const revisions of this.revisions.values()) {
      const revision = revisions.find(r => r.id === revisionId)
      if (revision) return revision
    }
    return null
  }

  /**
   * 对比两个版本
   * @param {string} revisionId1 - 版本1 ID
   * @param {string} revisionId2 - 版本2 ID
   * @returns {Object} 差异报告
   */
  compareRevisions (revisionId1, revisionId2) {
    const r1 = this.getRevision(revisionId1)
    const r2 = this.getRevision(revisionId2)

    if (!r1 || !r2) {
      throw new Error('未找到指定的修订版本')
    }

    const engine = new DiffEngine()
    const report = engine.generateDiffReport(r1.content, r2.content)

    return {
      revision1: {
        id: r1.id,
        author: r1.author,
        createdAt: r1.createdAt,
        wordCount: r1.wordCount,
        message: r1.message
      },
      revision2: {
        id: r2.id,
        author: r2.author,
        createdAt: r2.createdAt,
        wordCount: r2.wordCount,
        message: r2.message
      },
      diff: report
    }
  }

  /**
   * 恢复到指定版本
   * @param {string} revisionId - 版本ID
   * @param {string} author - 操作者
   * @param {string} authorId - 操作者ID
   * @returns {Revision|null} 新创建的修订版本
   */
  restoreRevision (revisionId, author, authorId) {
    const revision = this.getRevision(revisionId)
    if (!revision) return null

    return this.saveRevision({
      chapterId: revision.chapterId,
      content: revision.content,
      author,
      authorId,
      message: `恢复到版本 ${revisionId}（${formatDate(revision.createdAt)}）`,
      parentId: revisionId
    })
  }

  /**
   * 获取章节的修订统计
   * @param {string} chapterId - 章节ID
   * @returns {Object} 统计信息
   */
  getRevisionStats (chapterId) {
    const revisions = this.revisions.get(chapterId) || []
    if (revisions.length === 0) {
      return { totalRevisions: 0, contributors: [], firstEdit: null, lastEdit: null }
    }

    const contributors = [...new Set(revisions.map(r => r.author))]

    return {
      totalRevisions: revisions.length,
      contributors,
      firstEdit: revisions[0].createdAt,
      lastEdit: revisions[revisions.length - 1].createdAt,
      wordCountRange: {
        min: Math.min(...revisions.map(r => r.wordCount)),
        max: Math.max(...revisions.map(r => r.wordCount)),
        current: revisions[revisions.length - 1].wordCount
      }
    }
  }

  /**
   * 内部方法：获取最新版本ID
   * @param {string} chapterId - 章节ID
   * @returns {string|null}
   */
  _getLatestRevisionId (chapterId) {
    const revisions = this.revisions.get(chapterId) || []
    return revisions.length > 0 ? revisions[revisions.length - 1].id : null
  }
}

// ============================================================================
// 审阅者模式 UI 状态管理
// ============================================================================

/**
 * 审阅者模式状态
 * @typedef {Object} ReviewerState
 * @property {boolean} isActive - 是否激活审阅模式
 * @property {'comment'|'suggest'|'track'|'diff'} activeTool - 当前激活的工具
 * @property {string} activeChapterId - 当前审阅的章节ID
 * @property {boolean} showComments - 是否显示评论面板
 * @property {boolean} showSuggestions - 是否显示建议面板
 * @property {boolean} showDiffPanel - 是否显示对比面板
 * @property {Object} diffConfig - 对比配置
 * @property {string} diffConfig.revisionId1 - 对比的版本1
 * @property {string} diffConfig.revisionId2 - 对比的版本2
 * @property {string} diffConfig.mode - 对比模式 (inline/sidebyside/unified)
 */

/**
 * 审阅者模式状态管理器
 */
class ReviewerModeManager {
  constructor () {
    /** @type {ReviewerState} */
    this.state = {
      isActive: false,
      activeTool: 'comment',
      activeChapterId: '',
      showComments: true,
      showSuggestions: false,
      showDiffPanel: false,
      diffConfig: {
        revisionId1: '',
        revisionId2: '',
        mode: 'sidebyside'
      }
    }

    /** 状态变更回调 */
    this.onStateChangeCallbacks = []
  }

  /**
   * 注册状态变更回调
   * @param {Function} callback - 回调函数
   */
  onStateChange (callback) {
    this.onStateChangeCallbacks.push(callback)
  }

  /**
   * 触发状态变更
   */
  _emitStateChange () {
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(deepClone(this.state))
      } catch (e) {
        console.error('[审阅模式] 回调执行失败:', e)
      }
    })
  }

  /**
   * 进入审阅模式
   * @param {string} chapterId - 章节ID
   */
  enterReviewMode (chapterId) {
    this.state.isActive = true
    this.state.activeChapterId = chapterId
    this.state.showComments = true
    this._emitStateChange()
  }

  /**
   * 退出审阅模式
   */
  exitReviewMode () {
    this.state = {
      isActive: false,
      activeTool: 'comment',
      activeChapterId: '',
      showComments: true,
      showSuggestions: false,
      showDiffPanel: false,
      diffConfig: {
        revisionId1: '',
        revisionId2: '',
        mode: 'sidebyside'
      }
    }
    this._emitStateChange()
  }

  /**
   * 切换当前工具
   * @param {'comment'|'suggest'|'track'|'diff'} tool - 工具名称
   */
  setActiveTool (tool) {
    this.state.activeTool = tool

    // 根据工具自动切换面板显示
    this.state.showComments = tool === 'comment'
    this.state.showSuggestions = tool === 'suggest'
    this.state.showDiffPanel = tool === 'diff'

    this._emitStateChange()
  }

  /**
   * 切换评论面板
   * @param {boolean} [visible] - 是否可见（不传则切换）
   */
  toggleComments (visible) {
    this.state.showComments = visible !== undefined ? visible : !this.state.showComments
    this._emitStateChange()
  }

  /**
   * 切换建议面板
   * @param {boolean} [visible] - 是否可见
   */
  toggleSuggestions (visible) {
    this.state.showSuggestions = visible !== undefined ? visible : !this.state.showSuggestions
    this._emitStateChange()
  }

  /**
   * 切换对比面板
   * @param {boolean} [visible] - 是否可见
   */
  toggleDiffPanel (visible) {
    this.state.showDiffPanel = visible !== undefined ? visible : !this.state.showDiffPanel
    this._emitStateChange()
  }

  /**
   * 设置对比配置
   * @param {Object} config - 对比配置
   * @param {string} config.revisionId1 - 版本1 ID
   * @param {string} config.revisionId2 - 版本2 ID
   * @param {string} [config.mode] - 对比模式
   */
  setDiffConfig (config) {
    Object.assign(this.state.diffConfig, config)
    this._emitStateChange()
  }

  /**
   * 获取当前状态
   * @returns {ReviewerState}
   */
  getState () {
    return deepClone(this.state)
  }
}

// ============================================================================
// 带批注版本导出
// ============================================================================

/**
 * 导出管理器
 * 负责将章节内容连同批注、建议等导出为各种格式
 */
class ExportManager {
  /**
   * 导出带批注的 Markdown 版本
   * @param {string} content - 章节内容
   * @param {Comment[]} comments - 评论列表
   * @param {Suggestion[]} suggestions - 修改建议列表
   * @returns {string} Markdown 格式文本
   */
  exportAnnotatedMarkdown (content, comments, suggestions) {
    let markdown = ''

    // 按位置排序评论
    const sortedComments = [...comments].sort((a, b) => a.position.startOffset - b.position.startOffset)

    // 按位置排序建议
    const sortedSuggestions = [...suggestions].sort((a, b) => a.startIndex - b.startIndex)

    // 合并评论和建议，按位置排序
    const annotations = [
      ...sortedComments.map(c => ({
        position: c.position.startOffset,
        type: 'comment',
        data: c
      })),
      ...sortedSuggestions.map(s => ({
        position: s.startIndex,
        type: 'suggestion',
        data: s
      }))
    ].sort((a, b) => a.position - b.position)

    let lastPos = 0

    for (const annotation of annotations) {
      // 添加此标注之前的文本
      markdown += content.substring(lastPos, annotation.position)
      lastPos = annotation.position

      if (annotation.type === 'comment') {
        const comment = annotation.data
        markdown += `[批注 #${comment.id}]`
        markdown += `\n> **${comment.author}** (${formatDate(comment.createdAt)}): ${comment.text}`
        if (comment.replies.length > 0) {
          for (const reply of comment.replies) {
            markdown += `\n>> **${reply.author}** 回复: ${reply.text}`
          }
        }
        if (comment.resolved) {
          markdown += ' *(已解决)*'
        }
        markdown += '\n\n'

        lastPos = comment.position.endOffset
      } else if (annotation.type === 'suggestion') {
        const suggestion = annotation.data
        markdown += `[修改建议 #${suggestion.id}]`
        markdown += `\n> ~~${suggestion.originalText}~~ → **${suggestion.suggestedText}**`
        if (suggestion.comment) {
          markdown += `\n> 说明: ${suggestion.comment}`
        }
        markdown += `\n> 状态: ${suggestion.status === 'pending' ? '待处理' : suggestion.status === 'accepted' ? '已接受' : '已拒绝'}`
        markdown += '\n\n'

        lastPos = suggestion.endIndex
      }
    }

    // 添加剩余文本
    markdown += content.substring(lastPos)

    return markdown
  }

  /**
   * 导出纯文本版本（去除所有批注）
   * @param {string} content - 章节内容
   * @returns {string} 纯文本
   */
  exportPlainText (content) {
    return content
  }

  /**
   * 导出修订报告
   * @param {string} chapterTitle - 章节标题
   * @param {Revision[]} revisions - 修订历史
   * @param {Comment[]} comments - 评论列表
   * @param {Suggestion[]} suggestions - 修改建议列表
   * @returns {string} Markdown 格式的修订报告
   */
  exportRevisionReport (chapterTitle, revisions, comments, suggestions) {
    let report = `# 修订报告: ${chapterTitle}\n\n`
    report += `生成时间: ${formatDate(new Date())}\n\n`

    // 修订历史摘要
    report += `## 修订历史\n\n`
    report += `| 版本 | 作者 | 时间 | 字数 | 说明 |\n`
    report += `|------|------|------|------|------|\n`

    for (const revision of revisions) {
      report += `| ${revision.id.substring(0, 8)} | ${revision.author} | ${formatDate(revision.createdAt)} | ${revision.wordCount} | ${revision.message || '-'} |\n`
    }

    // 评论统计
    const unresolvedComments = comments.filter(c => !c.resolved)
    report += `\n## 评论统计\n\n`
    report += `- 总评论数: ${comments.length}\n`
    report += `- 未解决: ${unresolvedComments.length}\n`
    report += `- 已解决: ${comments.length - unresolvedComments.length}\n`

    if (unresolvedComments.length > 0) {
      report += `\n### 未解决的评论\n\n`
      for (const comment of unresolvedComments) {
        report += `- **${comment.author}**: ${comment.text}\n`
        report += `  - 位置: "${comment.position.selectedText}"\n`
      }
    }

    // 修改建议统计
    const pendingSuggestions = suggestions.filter(s => s.status === 'pending')
    report += `\n## 修改建议\n\n`
    report += `- 总建议数: ${suggestions.length}\n`
    report += `- 待处理: ${pendingSuggestions.length}\n`
    report += `- 已接受: ${suggestions.filter(s => s.status === 'accepted').length}\n`
    report += `- 已拒绝: ${suggestions.filter(s => s.status === 'rejected').length}\n`

    if (pendingSuggestions.length > 0) {
      report += `\n### 待处理的建议\n\n`
      for (const suggestion of pendingSuggestions) {
        report += `- "${suggestion.originalText}" → "${suggestion.suggestedText}"\n`
        if (suggestion.comment) {
          report += `  - 说明: ${suggestion.comment}\n`
        }
      }
    }

    return report
  }

  /**
   * 导出 HTML 格式的带批注版本
   * @param {string} content - 章节内容
   * @param {Comment[]} comments - 评论列表
   * @returns {string} HTML 字符串
   */
  exportAnnotatedHtml (content, comments) {
    const sortedComments = [...comments].sort((a, b) => a.position.startOffset - b.position.startOffset)

    let html = '<div class="annotated-content">'

    let lastPos = 0
    for (const comment of sortedComments) {
      // 批注之前的文本
      html += escapeHtml(content.substring(lastPos, comment.position.startOffset))

      // 被选中的文本（高亮显示）
      const selectedText = content.substring(comment.position.startOffset, comment.position.endOffset)
      const commentData = encodeURIComponent(JSON.stringify({
        id: comment.id,
        author: comment.author,
        text: comment.text,
        date: formatDate(comment.createdAt),
        resolved: comment.resolved,
        replies: comment.replies
      }))

      html += `<span class="annotation-highlight" data-comment="${commentData}" title="${escapeHtml(comment.text)}">${escapeHtml(selectedText)}</span>`

      lastPos = comment.position.endOffset
    }

    // 剩余文本
    html += escapeHtml(content.substring(lastPos))
    html += '</div>'

    return html
  }
}

/**
 * HTML 转义
 * @param {string} text - 原始文本
 * @returns {string} 转义后的文本
 */
function escapeHtml (text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ============================================================================
// 协作服务主类
// ============================================================================

/**
 * 协作服务
 * 整合所有协作功能模块，提供统一的 API 接口
 */
class CollaborationService {
  constructor () {
    /** 评论管理器 */
    this.comments = new CommentManager()

    /** 分享链接管理器 */
    this.shares = new ShareLinkManager()

    /** Diff 对比引擎 */
    this.diff = new DiffEngine()

    /** 修订历史管理器 */
    this.revisions = new RevisionManager()

    /** 审阅者模式管理器 */
    this.reviewer = new ReviewerModeManager()

    /** 导出管理器 */
    this.exporter = new ExportManager()
  }

  // ========================================================================
  // 便捷方法 - 评论相关
  // ========================================================================

  /**
   * 添加评论（便捷方法）
   */
  addComment (params) {
    return this.comments.addComment(params)
  }

  /**
   * 获取章节评论（便捷方法）
   */
  getChapterComments (chapterId) {
    return this.comments.getChapterComments(chapterId)
  }

  /**
   * 解决评论（便捷方法）
   */
  resolveComment (commentId) {
    return this.comments.resolveComment(commentId)
  }

  // ========================================================================
  // 便捷方法 - 分享相关
  // ========================================================================

  /**
   * 创建分享链接（便捷方法）
   */
  createShareLink (params) {
    return this.shares.createShareLink(params)
  }

  /**
   * 生成分享 URL（便捷方法）
   */
  generateShareUrl (token, baseUrl) {
    return this.shares.generateShareUrl(token, baseUrl)
  }

  // ========================================================================
  // 便捷方法 - Diff 相关
  // ========================================================================

  /**
   * 计算文本差异（便捷方法）
   */
  computeDiff (text1, text2) {
    return this.diff.computeDiff(text1, text2)
  }

  /**
   * 生成差异报告（便捷方法）
   */
  generateDiffReport (text1, text2) {
    return this.diff.generateDiffReport(text1, text2)
  }

  // ========================================================================
  // 便捷方法 - 修订相关
  // ========================================================================

  /**
   * 保存修订（便捷方法）
   */
  saveRevision (params) {
    return this.revisions.saveRevision(params)
  }

  /**
   * 获取修订历史（便捷方法）
   */
  getRevisions (chapterId, limit) {
    return this.revisions.getRevisions(chapterId, limit)
  }

  // ========================================================================
  // 导出功能
  // ========================================================================

  /**
   * 导出带批注的章节
   * @param {string} chapterId - 章节ID
   * @param {string} content - 章节内容
   * @param {'markdown'|'html'|'report'} format - 导出格式
   * @returns {string} 导出内容
   */
  exportChapter (chapterId, content, format = 'markdown') {
    const comments = this.comments.getChapterComments(chapterId)
    const suggestions = this.diff.getChapterSuggestions(chapterId)
    const revisions = this.revisions.getRevisions(chapterId)

    switch (format) {
      case 'markdown':
        return this.exporter.exportAnnotatedMarkdown(content, comments, suggestions)
      case 'html':
        return this.exporter.exportAnnotatedHtml(content, comments)
      case 'report':
        return this.exporter.exportRevisionReport('章节', revisions, comments, suggestions)
      default:
        return this.exporter.exportPlainText(content)
    }
  }

  // ========================================================================
  // 数据持久化
  // ========================================================================

  /**
   * 导出所有协作数据
   * @returns {Object} 可序列化的完整数据
   */
  exportAllData () {
    return {
      comments: this.comments.exportData(),
      shares: Array.from(this.shares.shares.values()).map(s => deepClone(s)),
      suggestions: Object.fromEntries(
        Array.from(this.diff.suggestions.entries()).map(([k, v]) => [k, deepClone(v)])
      ),
      revisions: Object.fromEntries(
        Array.from(this.revisions.revisions.entries()).map(([k, v]) => [k, deepClone(v)])
      )
    }
  }

  /**
   * 导入协作数据
   * @param {Object} data - 协作数据
   */
  importAllData (data) {
    if (data.comments) {
      this.comments.importData(data.comments)
    }
    if (data.shares) {
      this.shares.shares.clear()
      for (const share of data.shares) {
        this.shares.shares.set(share.id, share)
      }
    }
    if (data.suggestions) {
      this.diff.suggestions.clear()
      for (const [chapterId, suggestions] of Object.entries(data.suggestions)) {
        this.diff.suggestions.set(chapterId, suggestions)
      }
    }
    if (data.revisions) {
      this.revisions.revisions.clear()
      for (const [chapterId, revisions] of Object.entries(data.revisions)) {
        this.revisions.revisions.set(chapterId, revisions)
      }
    }
  }
}

// ============================================================================
// 导出
// ============================================================================

export default CollaborationService

/**
 * 便捷函数：创建协作服务实例
 * @returns {CollaborationService}
 */
export function createCollaborationService () {
  return new CollaborationService()
}

/**
 * 导出各个子模块，支持单独使用
 */
export {
  CommentManager,
  ShareLinkManager,
  DiffEngine,
  RevisionManager,
  ReviewerModeManager,
  ExportManager
}

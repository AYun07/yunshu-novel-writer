/**
 * 云书 - 多用户架构服务
 * 
 * 核心功能：
 * 1. 用户管理（注册/登录、用户资料、头像上传）
 * 2. 项目权限（所有者、编辑者、审阅者、访客）
 * 3. 协作功能（实时协作、在线状态、光标同步、编辑锁定）
 * 4. 版本控制（自动快照、版本对比、版本回滚、分支管理）
 * 5. 通知系统（项目更新、评论、协作邀请）
 *
 * 【待集成】此模块已实现完整功能，计划在 v2.3.0 中集成到主应用。
 * 集成方式：在对应的视图组件中 import 并调用。
 * 依赖：需要先初始化 database.js（IndexedDB）作为主存储。
 * 
 * @author 云书团队
 * @version 1.0.0
 */

// ============================================================================
// 工具函数
// ============================================================================

import { DiffEngine } from './collaborationService.js'

/** DiffEngine 实例，用于版本对比的真正 diff 计算 */
const diffEngine = new DiffEngine()

/**
 * 生成唯一ID
 * @returns {string} 唯一标识符
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
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
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 延迟执行
 * @param {number} ms - 毫秒数
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// 用户管理模块
// ============================================================================

/**
 * 用户数据结构
 * @typedef {Object} User
 * @property {string} id - 用户ID
 * @property {string} email - 邮箱
 * @property {string} username - 用户名
 * @property {string} password - 密码（加密存储）
 * @property {string} avatar - 头像URL
 * @property {string} bio - 个人简介
 * @property {Object} settings - 用户设置
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 * @property {string} lastLoginAt - 最后登录时间
 * @property {boolean} isActive - 是否激活
 */

/**
 * 用户管理器
 * 负责用户的注册、登录、资料管理等功能
 */
class UserManager {
  constructor() {
    /** @type {Map<string, User>} 用户存储 */
    this.users = new Map()
    
    /** @type {Map<string, string>} 邮箱到用户ID的映射 */
    this.emailIndex = new Map()
    
    /** 当前登录用户 */
    this.currentUser = null
    
    /** 用户变更回调 */
    this.onUserChangeCallbacks = []
    
    // 从本地存储加载用户数据
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载用户数据
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem('yunshu_users')
      if (data) {
        const parsed = JSON.parse(data)
        parsed.forEach(user => {
          this.users.set(user.id, user)
          this.emailIndex.set(user.email.toLowerCase(), user.id)
        })
      }
      
      // 尝试恢复登录状态
      const currentUserId = localStorage.getItem('yunshu_current_user')
      if (currentUserId && this.users.has(currentUserId)) {
        this.currentUser = this.users.get(currentUserId)
      }
    } catch (e) {
      console.error('[用户管理器] 加载用户数据失败:', e)
    }
  }

  /**
   * 保存用户数据到本地存储
   */
  saveToStorage() {
    try {
      const data = Array.from(this.users.values())
      localStorage.setItem('yunshu_users', JSON.stringify(data))
      
      if (this.currentUser) {
        localStorage.setItem('yunshu_current_user', this.currentUser.id)
      } else {
        localStorage.removeItem('yunshu_current_user')
      }
    } catch (e) {
      console.error('[用户管理器] 保存用户数据失败:', e)
    }
  }

  /**
   * 注册新用户
   * @param {Object} params - 注册参数
   * @param {string} params.email - 邮箱
   * @param {string} params.username - 用户名
   * @param {string} params.password - 密码
   * @returns {Promise<User>} 创建的用户
   */
  async register({ email, username, password }) {
    // 检查邮箱是否已存在
    if (this.emailIndex.has(email.toLowerCase())) {
      throw new Error('该邮箱已被注册')
    }

    // 创建用户
    const user = {
      id: generateId(),
      email: email.toLowerCase(),
      username,
      password: this.hashPassword(password),
      avatar: this.generateDefaultAvatar(username),
      bio: '',
      settings: {
        theme: 'light',
        language: 'zh-CN',
        notifications: {
          email: true,
          push: true,
          projectUpdates: true,
          comments: true,
          invitations: true
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      isActive: true
    }

    this.users.set(user.id, user)
    this.emailIndex.set(email.toLowerCase(), user.id)
    this.saveToStorage()

    // 返回不含密码的用户信息
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 用户登录
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Promise<User>} 登录的用户
   */
  async login(email, password) {
    const userId = this.emailIndex.get(email.toLowerCase())
    if (!userId) {
      throw new Error('邮箱或密码错误')
    }

    const user = this.users.get(userId)
    if (!user) {
      throw new Error('邮箱或密码错误')
    }

    if (!user.isActive) {
      throw new Error('账户已被禁用')
    }

    // 验证密码
    if (!this.verifyPassword(password, user.password)) {
      throw new Error('邮箱或密码错误')
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date().toISOString()
    this.users.set(user.id, user)
    this.saveToStorage()

    // 设置当前用户
    this.currentUser = user
    this._emitUserChange('login', user)

    // 返回不含密码的用户信息
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * OAuth登录（模拟）
   * @param {string} provider - 提供商（google/github/wechat）
   * @param {Object} profile - 用户资料
   * @returns {Promise<User>} 登录的用户
   */
  async oauthLogin(provider, profile) {
    // 检查是否已有该OAuth用户
    const oauthKey = `${provider}_${profile.id}`
    let user = null
    
    for (const u of this.users.values()) {
      if (u.oauthId === oauthKey) {
        user = u
        break
      }
    }

    if (user) {
      // 已有用户，直接登录
      user.lastLoginAt = new Date().toISOString()
      this.currentUser = user
      this._emitUserChange('login', user)
    } else {
      // 创建新用户
      user = await this.register({
        email: profile.email,
        username: profile.name || profile.login,
        password: generateId() // 随机密码
      })
      user.oauthId = oauthKey
      user.avatar = profile.avatar_url || user.avatar
      this.users.set(user.id, user)
      this.currentUser = this.users.get(user.id)
    }

    this.saveToStorage()
    const { password: _, ...userWithoutPassword } = this.currentUser
    return userWithoutPassword
  }

  /**
   * 用户登出
   */
  logout() {
    const previousUser = this.currentUser
    this.currentUser = null
    localStorage.removeItem('yunshu_current_user')
    this._emitUserChange('logout', previousUser)
  }

  /**
   * 更新用户资料
   * @param {string} userId - 用户ID
   * @param {Object} updates - 更新内容
   * @returns {User} 更新后的用户
   */
  updateProfile(userId, updates) {
    if (!this.users.has(userId)) {
      throw new Error('用户不存在')
    }

    const user = this.users.get(userId)
    
    // 允许更新的字段
    const allowedFields = ['username', 'bio', 'avatar', 'settings']
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = updates[field]
      }
    })

    user.updatedAt = new Date().toISOString()
    this.users.set(userId, user)
    this.saveToStorage()

    if (this.currentUser?.id === userId) {
      this.currentUser = user
      this._emitUserChange('update', user)
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 上传头像
   * @param {string} userId - 用户ID
   * @param {File} file - 头像文件
   * @returns {Promise<string>} 头像URL
   */
  async uploadAvatar(userId, file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const avatarUrl = e.target.result
        
        // 更新用户头像
        this.updateProfile(userId, { avatar: avatarUrl })
        resolve(avatarUrl)
      }
      reader.onerror = () => reject(new Error('头像上传失败'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * 修改密码
   * @param {string} userId - 用户ID
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   */
  changePassword(userId, oldPassword, newPassword) {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error('用户不存在')
    }

    if (!this.verifyPassword(oldPassword, user.password)) {
      throw new Error('原密码错误')
    }

    user.password = this.hashPassword(newPassword)
    user.updatedAt = new Date().toISOString()
    this.users.set(userId, user)
    this.saveToStorage()
  }

  /**
   * 获取用户
   * @param {string} userId - 用户ID
   * @returns {User|null}
   */
  getUser(userId) {
    const user = this.users.get(userId)
    if (!user) return null
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * 获取当前用户
   * @returns {User|null}
   */
  getCurrentUser() {
    if (!this.currentUser) return null
    const { password: _, ...userWithoutPassword } = this.currentUser
    return userWithoutPassword
  }

  /**
   * 检查是否已登录
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.currentUser !== null
  }

  /**
   * 注册用户变更回调
   * @param {Function} callback - 回调函数
   */
  onUserChange(callback) {
    this.onUserChangeCallbacks.push(callback)
  }

  /**
   * 触发用户变更回调
   * @param {string} action - 操作类型
   * @param {User} user - 用户
   */
  _emitUserChange(action, user) {
    this.onUserChangeCallbacks.forEach(cb => {
      try {
        cb(action, user ? deepClone(user) : null)
      } catch (e) {
        console.error('[用户管理器] 回调执行失败:', e)
      }
    })
  }

  /**
   * 密码哈希（演示实现）
   *
   * TODO: 生产环境应使用 bcrypt / argon2 等安全哈希算法。
   * 当前实现使用 btoa() 仅做 Base64 编码，并非真正的哈希，任何人都可以轻易还原明文密码。
   * 推荐方案：
   *   - 后端方案：bcrypt (npm i bcryptjs) / argon2，密码哈希应在服务端完成
   *   - 如果必须在前端哈希：使用 Web Crypto API 的 PBKDF2 / SubtleCrypto
   *
   * @param {string} password - 密码
   * @returns {string} 哈希后的密码
   */
  hashPassword(password) {
    // [演示实现] 简单的Base64编码，生产环境必须替换为安全方案
    return btoa(password + '_yunshu_salt')
  }

  /**
   * 验证密码
   * @param {string} password - 密码
   * @param {string} hash - 哈希值
   * @returns {boolean}
   */
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash
  }

  /**
   * 生成默认头像
   * @param {string} username - 用户名
   * @returns {string} 头像URL（Data URL）
   */
  generateDefaultAvatar(username) {
    // 生成基于用户名的颜色
    const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
    const colorIndex = username.charCodeAt(0) % colors.length
    const color = colors[colorIndex]
    const initial = username.charAt(0).toUpperCase()

    // 创建SVG头像
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect fill="${color}" width="100" height="100"/>
      <text x="50" y="50" font-size="40" font-family="Arial" fill="white" text-anchor="middle" dominant-baseline="central">${initial}</text>
    </svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }
}

// ============================================================================
// 项目权限模块
// ============================================================================

/**
 * 权限级别枚举
 */
const PermissionLevel = {
  OWNER: 'owner',       // 所有者：完全控制
  EDITOR: 'editor',     // 编辑者：可编辑内容
  REVIEWER: 'reviewer', // 审阅者：可评论
  VIEWER: 'viewer'      // 访客：只读
}

/**
 * 权限配置
 */
const PermissionConfig = {
  [PermissionLevel.OWNER]: {
    canRead: true,
    canEdit: true,
    canDelete: true,
    canShare: true,
    canManageMembers: true,
    canManageSettings: true,
    canExport: true,
    canComment: true
  },
  [PermissionLevel.EDITOR]: {
    canRead: true,
    canEdit: true,
    canDelete: false,
    canShare: false,
    canManageMembers: false,
    canManageSettings: false,
    canExport: true,
    canComment: true
  },
  [PermissionLevel.REVIEWER]: {
    canRead: true,
    canEdit: false,
    canDelete: false,
    canShare: false,
    canManageMembers: false,
    canManageSettings: false,
    canExport: false,
    canComment: true
  },
  [PermissionLevel.VIEWER]: {
    canRead: true,
    canEdit: false,
    canDelete: false,
    canShare: false,
    canManageMembers: false,
    canManageSettings: false,
    canExport: false,
    canComment: false
  }
}

/**
 * 项目成员数据结构
 * @typedef {Object} ProjectMember
 * @property {string} userId - 用户ID
 * @property {string} username - 用户名
 * @property {string} avatar - 头像
 * @property {string} role - 角色
 * @property {string} addedAt - 添加时间
 * @property {string} addedBy - 添加者ID
 */

/**
 * 项目权限管理器
 */
class PermissionManager {
  constructor(userManager) {
    /** @type {UserManager} 用户管理器 */
    this.userManager = userManager
    
    /** @type {Map<string, Map<string, ProjectMember>>} 项目成员 projectId -> (userId -> member) */
    this.projectMembers = new Map()
    
    /** 权限变更回调 */
    this.onPermissionChangeCallbacks = []
    
    // 从本地存储加载
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem('yunshu_project_members')
      if (data) {
        const parsed = JSON.parse(data)
        Object.entries(parsed).forEach(([projectId, members]) => {
          const memberMap = new Map()
          Object.entries(members).forEach(([userId, member]) => {
            memberMap.set(userId, member)
          })
          this.projectMembers.set(projectId, memberMap)
        })
      }
    } catch (e) {
      console.error('[权限管理器] 加载数据失败:', e)
    }
  }

  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      const data = {}
      this.projectMembers.forEach((members, projectId) => {
        data[projectId] = Object.fromEntries(members)
      })
      localStorage.setItem('yunshu_project_members', JSON.stringify(data))
    } catch (e) {
      console.error('[权限管理器] 保存数据失败:', e)
    }
  }

  /**
   * 初始化项目权限（创建项目时调用）
   * @param {string} projectId - 项目ID
   * @param {string} ownerId - 所有者ID
   */
  initializeProject(projectId, ownerId) {
    const owner = this.userManager.getUser(ownerId)
    if (!owner) {
      throw new Error('用户不存在')
    }

    const memberMap = new Map()
    memberMap.set(ownerId, {
      userId: ownerId,
      username: owner.username,
      avatar: owner.avatar,
      role: PermissionLevel.OWNER,
      addedAt: new Date().toISOString(),
      addedBy: null
    })

    this.projectMembers.set(projectId, memberMap)
    this.saveToStorage()
  }

  /**
   * 添加项目成员
   * @param {string} projectId - 项目ID
   * @param {string} userId - 用户ID
   * @param {string} role - 角色
   * @param {string} addedBy - 添加者ID
   * @returns {ProjectMember} 添加的成员
   */
  addMember(projectId, userId, role, addedBy) {
    // 检查权限
    if (!this.hasPermission(projectId, addedBy, 'canManageMembers')) {
      throw new Error('没有权限添加成员')
    }

    const user = this.userManager.getUser(userId)
    if (!user) {
      throw new Error('用户不存在')
    }

    if (!this.projectMembers.has(projectId)) {
      this.projectMembers.set(projectId, new Map())
    }

    const memberMap = this.projectMembers.get(projectId)
    
    // 检查是否已是成员
    if (memberMap.has(userId)) {
      throw new Error('该用户已是项目成员')
    }

    const member = {
      userId,
      username: user.username,
      avatar: user.avatar,
      role,
      addedAt: new Date().toISOString(),
      addedBy
    }

    memberMap.set(userId, member)
    this.saveToStorage()
    this._emitPermissionChange('add', projectId, member)

    return member
  }

  /**
   * 更新成员角色
   * @param {string} projectId - 项目ID
   * @param {string} userId - 用户ID
   * @param {string} newRole - 新角色
   * @param {string} updatedBy - 操作者ID
   * @returns {ProjectMember} 更新后的成员
   */
  updateMemberRole(projectId, userId, newRole, updatedBy) {
    // 检查权限
    if (!this.hasPermission(projectId, updatedBy, 'canManageMembers')) {
      throw new Error('没有权限修改成员角色')
    }

    const memberMap = this.projectMembers.get(projectId)
    if (!memberMap || !memberMap.has(userId)) {
      throw new Error('成员不存在')
    }

    // 不能修改所有者的角色
    const member = memberMap.get(userId)
    if (member.role === PermissionLevel.OWNER) {
      throw new Error('不能修改所有者的角色')
    }

    member.role = newRole
    memberMap.set(userId, member)
    this.saveToStorage()
    this._emitPermissionChange('update', projectId, member)

    return member
  }

  /**
   * 移除成员
   * @param {string} projectId - 项目ID
   * @param {string} userId - 用户ID
   * @param {string} removedBy - 操作者ID
   */
  removeMember(projectId, userId, removedBy) {
    // 检查权限
    if (!this.hasPermission(projectId, removedBy, 'canManageMembers')) {
      throw new Error('没有权限移除成员')
    }

    const memberMap = this.projectMembers.get(projectId)
    if (!memberMap || !memberMap.has(userId)) {
      throw new Error('成员不存在')
    }

    // 不能移除所有者
    const member = memberMap.get(userId)
    if (member.role === PermissionLevel.OWNER) {
      throw new Error('不能移除所有者')
    }

    memberMap.delete(userId)
    this.saveToStorage()
    this._emitPermissionChange('remove', projectId, member)
  }

  /**
   * 获取项目成员列表
   * @param {string} projectId - 项目ID
   * @returns {ProjectMember[]}
   */
  getProjectMembers(projectId) {
    const memberMap = this.projectMembers.get(projectId)
    if (!memberMap) return []
    return Array.from(memberMap.values())
  }

  /**
   * 获取用户在项目中的角色
   * @param {string} projectId - 项目ID
   * @param {string} userId - 用户ID
   * @returns {string|null}
   */
  getUserRole(projectId, userId) {
    const memberMap = this.projectMembers.get(projectId)
    if (!memberMap) return null
    const member = memberMap.get(userId)
    return member ? member.role : null
  }

  /**
   * 检查用户是否有某权限
   * @param {string} projectId - 项目ID
   * @param {string} userId - 用户ID
   * @param {string} permission - 权限名称
   * @returns {boolean}
   */
  hasPermission(projectId, userId, permission) {
    const role = this.getUserRole(projectId, userId)
    if (!role) return false
    
    const config = PermissionConfig[role]
    return config ? config[permission] === true : false
  }

  /**
   * 获取用户权限配置
   * @param {string} projectId - 项目ID
   * @param {string} userId - 用户ID
   * @returns {Object|null}
   */
  getUserPermissions(projectId, userId) {
    const role = this.getUserRole(projectId, userId)
    if (!role) return null
    return PermissionConfig[role] || null
  }

  /**
   * 注册权限变更回调
   * @param {Function} callback - 回调函数
   */
  onPermissionChange(callback) {
    this.onPermissionChangeCallbacks.push(callback)
  }

  /**
   * 触发权限变更回调
   */
  _emitPermissionChange(action, projectId, member) {
    this.onPermissionChangeCallbacks.forEach(cb => {
      try {
        cb(action, projectId, deepClone(member))
      } catch (e) {
        console.error('[权限管理器] 回调执行失败:', e)
      }
    })
  }
}

// ============================================================================
// 实时协作模块
// ============================================================================

/**
 * 在线用户状态
 * @typedef {Object} OnlineUser
 * @property {string} userId - 用户ID
 * @property {string} username - 用户名
 * @property {string} avatar - 头像
 * @property {string} projectId - 项目ID
 * @property {string} chapterId - 当前章节ID
 * @property {Object} cursor - 光标位置
 * @property {string} lastActiveAt - 最后活跃时间
 */

/**
 * 编辑锁
 * @typedef {Object} EditLock
 * @property {string} lockId - 锁ID
 * @property {string} projectId - 项目ID
 * @property {string} chapterId - 章节ID
 * @property {string} userId - 用户ID
 * @property {string} username - 用户名
 * @property {string} lockedAt - 锁定时间
 * @property {number} expiresAt - 过期时间戳
 */

/**
 * 实时协作管理器
 */
class RealtimeCollaborationManager {
  constructor(userManager, permissionManager) {
    /** @type {UserManager} */
    this.userManager = userManager
    /** @type {PermissionManager} */
    this.permissionManager = permissionManager
    
    /** @type {Map<string, OnlineUser>} 在线用户 userId -> OnlineUser */
    this.onlineUsers = new Map()
    
    /** @type {Map<string, EditLock>} 编辑锁 lockId -> EditLock */
    this.editLocks = new Map()
    
    /** @type {Map<string, Set<string>>} 项目在线用户 projectId -> Set<userId> */
    this.projectUsers = new Map()
    
    /** WebSocket连接（模拟） */
    this.ws = null
    
    /** 连接状态 */
    this.connected = false
    
    /** 状态变更回调 */
    this.onStateChangeCallbacks = []
    
    /** 消息回调 */
    this.onMessageCallbacks = []
    
    // 编辑锁过期检查
    this.startLockExpirationCheck()
  }

  /**
   * 连接到协作服务器（模拟实现）
   *
   * TODO: 生产环境需要真实的 WebSocket 服务器。
   * 当前实现使用 setTimeout 模拟连接成功，不会建立任何真实的网络连接。
   * 推荐方案：
   *   - 自建 WebSocket 服务：Node.js + ws / Socket.IO
   *   - 托管方案：Supabase Realtime / Firebase Realtime Database / Pusher
   *   - 协议建议：使用 JSON-RPC 或自定义消息协议，支持心跳检测和断线重连
   *
   * @param {string} serverUrl - 服务器地址
   * @returns {Promise<boolean>}
   */
  async connect(serverUrl = 'ws://localhost:8080') {
    // [模拟实现] 使用 setTimeout 假装连接成功，生产环境需替换为真实 WebSocket
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true
        this._emitStateChange('connected')
        resolve(true)
      }, 500)
    })
  }

  /**
   * 断开连接
   */
  disconnect() {
    this.connected = false
    this.onlineUsers.clear()
    this.projectUsers.clear()
    this._emitStateChange('disconnected')
  }

  /**
   * 加入项目协作
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID（可选）
   */
  joinProject(projectId, chapterId = null) {
    const currentUser = this.userManager.getCurrentUser()
    if (!currentUser) {
      throw new Error('请先登录')
    }

    // 检查权限
    if (!this.permissionManager.hasPermission(projectId, currentUser.id, 'canRead')) {
      throw new Error('没有访问该项目的权限')
    }

    // 添加到在线用户
    const onlineUser = {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      projectId,
      chapterId,
      cursor: null,
      lastActiveAt: new Date().toISOString()
    }

    this.onlineUsers.set(currentUser.id, onlineUser)

    // 添加到项目用户集合
    if (!this.projectUsers.has(projectId)) {
      this.projectUsers.set(projectId, new Set())
    }
    this.projectUsers.get(projectId).add(currentUser.id)

    this._emitStateChange('userJoined', onlineUser)
  }

  /**
   * 离开项目协作
   * @param {string} projectId - 项目ID
   */
  leaveProject(projectId) {
    const currentUser = this.userManager.getCurrentUser()
    if (!currentUser) return

    this.onlineUsers.delete(currentUser.id)

    const users = this.projectUsers.get(projectId)
    if (users) {
      users.delete(currentUser.id)
    }

    // 释放所有编辑锁
    this.releaseUserLocks(currentUser.id)

    this._emitStateChange('userLeft', { userId: currentUser.id, projectId })
  }

  /**
   * 切换章节
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   */
  switchChapter(projectId, chapterId) {
    const currentUser = this.userManager.getCurrentUser()
    if (!currentUser) return

    const onlineUser = this.onlineUsers.get(currentUser.id)
    if (onlineUser) {
      onlineUser.chapterId = chapterId
      onlineUser.lastActiveAt = new Date().toISOString()
      this._emitStateChange('chapterChanged', onlineUser)
    }
  }

  /**
   * 更新光标位置
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   * @param {Object} cursor - 光标位置
   */
  updateCursor(projectId, chapterId, cursor) {
    const currentUser = this.userManager.getCurrentUser()
    if (!currentUser) return

    const onlineUser = this.onlineUsers.get(currentUser.id)
    if (onlineUser) {
      onlineUser.cursor = cursor
      onlineUser.lastActiveAt = new Date().toISOString()
      this._emitStateChange('cursorUpdated', onlineUser)
    }
  }

  /**
   * 获取项目在线用户
   * @param {string} projectId - 项目ID
   * @returns {OnlineUser[]}
   */
  getProjectOnlineUsers(projectId) {
    const userIds = this.projectUsers.get(projectId)
    if (!userIds) return []
    
    return Array.from(userIds)
      .map(userId => this.onlineUsers.get(userId))
      .filter(Boolean)
  }

  /**
   * 获取章节在线用户
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   * @returns {OnlineUser[]}
   */
  getChapterOnlineUsers(projectId, chapterId) {
    return this.getProjectOnlineUsers(projectId)
      .filter(user => user.chapterId === chapterId)
  }

  /**
   * 请求编辑锁
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   * @returns {EditLock|null}
   */
  requestEditLock(projectId, chapterId) {
    const currentUser = this.userManager.getCurrentUser()
    if (!currentUser) {
      throw new Error('请先登录')
    }

    // 检查权限
    if (!this.permissionManager.hasPermission(projectId, currentUser.id, 'canEdit')) {
      throw new Error('没有编辑权限')
    }

    // 检查是否已有锁
    const existingLock = this.getChapterLock(projectId, chapterId)
    if (existingLock) {
      if (existingLock.userId === currentUser.id) {
        // 已经是自己持有的锁，刷新过期时间
        existingLock.expiresAt = Date.now() + 30000
        return existingLock
      }
      return null // 被其他人锁定
    }

    // 创建新锁
    const lock = {
      lockId: generateId(),
      projectId,
      chapterId,
      userId: currentUser.id,
      username: currentUser.username,
      lockedAt: new Date().toISOString(),
      expiresAt: Date.now() + 30000 // 30秒过期
    }

    this.editLocks.set(lock.lockId, lock)
    this._emitStateChange('lockAcquired', lock)

    return lock
  }

  /**
   * 释放编辑锁
   * @param {string} lockId - 锁ID
   */
  releaseEditLock(lockId) {
    const lock = this.editLocks.get(lockId)
    if (!lock) return

    const currentUser = this.userManager.getCurrentUser()
    if (!currentUser || lock.userId !== currentUser.id) {
      return // 只能释放自己的锁
    }

    this.editLocks.delete(lockId)
    this._emitStateChange('lockReleased', lock)
  }

  /**
   * 释放用户的所有锁
   * @param {string} userId - 用户ID
   */
  releaseUserLocks(userId) {
    const locksToRemove = []
    this.editLocks.forEach((lock, lockId) => {
      if (lock.userId === userId) {
        locksToRemove.push(lockId)
      }
    })
    
    locksToRemove.forEach(lockId => {
      this.editLocks.delete(lockId)
    })
  }

  /**
   * 获取章节的编辑锁
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   * @returns {EditLock|null}
   */
  getChapterLock(projectId, chapterId) {
    for (const lock of this.editLocks.values()) {
      if (lock.projectId === projectId && lock.chapterId === chapterId) {
        // 检查是否过期
        if (lock.expiresAt > Date.now()) {
          return lock
        } else {
          // 清除过期锁
          this.editLocks.delete(lock.lockId)
        }
      }
    }
    return null
  }

  /**
   * 发送消息
   * @param {string} projectId - 项目ID
   * @param {string} type - 消息类型
   * @param {*} data - 消息数据
   */
  sendMessage(projectId, type, data) {
    if (!this.connected) {
      throw new Error('未连接到协作服务器')
    }

    const currentUser = this.userManager.getCurrentUser()
    const message = {
      id: generateId(),
      projectId,
      type,
      data,
      senderId: currentUser?.id,
      senderName: currentUser?.username,
      timestamp: new Date().toISOString()
    }

    // 模拟发送消息
    this._emitMessage(message)
  }

  /**
   * 开始编辑锁过期检查
   */
  startLockExpirationCheck() {
    setInterval(() => {
      const now = Date.now()
      const expiredLocks = []
      
      this.editLocks.forEach((lock, lockId) => {
        if (lock.expiresAt <= now) {
          expiredLocks.push(lockId)
        }
      })

      expiredLocks.forEach(lockId => {
        const lock = this.editLocks.get(lockId)
        this.editLocks.delete(lockId)
        this._emitStateChange('lockExpired', lock)
      })
    }, 5000)
  }

  /**
   * 注册状态变更回调
   * @param {Function} callback - 回调函数
   */
  onStateChange(callback) {
    this.onStateChangeCallbacks.push(callback)
  }

  /**
   * 触发状态变更回调
   */
  _emitStateChange(type, data) {
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(type, data)
      } catch (e) {
        console.error('[协作管理器] 回调执行失败:', e)
      }
    })
  }

  /**
   * 注册消息回调
   * @param {Function} callback - 回调函数
   */
  onMessage(callback) {
    this.onMessageCallbacks.push(callback)
  }

  /**
   * 触发消息回调
   */
  _emitMessage(message) {
    this.onMessageCallbacks.forEach(cb => {
      try {
        cb(message)
      } catch (e) {
        console.error('[协作管理器] 消息回调执行失败:', e)
      }
    })
  }
}

// ============================================================================
// 版本控制模块
// ============================================================================

/**
 * 版本快照
 * @typedef {Object} VersionSnapshot
 * @property {string} id - 版本ID
 * @property {string} projectId - 项目ID
 * @property {string} chapterId - 章节ID
 * @property {string} content - 内容
 * @property {number} wordCount - 字数
 * @property {string} author - 作者
 * @property {string} authorId - 作者ID
 * @property {string} message - 版本说明
 * @property {string} createdAt - 创建时间
 * @property {string} parentId - 父版本ID
 * @property {string} branch - 分支名称
 */

/**
 * 分支
 * @typedef {Object} Branch
 * @property {string} id - 分支ID
 * @property {string} projectId - 项目ID
 * @property {string} name - 分支名称
 * @property {string} createdBy - 创建者ID
 * @property {string} createdAt - 创建时间
 * @property {string} headVersionId - 最新版本ID
 */

/**
 * 版本控制管理器
 */
class VersionControlManager {
  constructor() {
    /** @type {Map<string, VersionSnapshot[]>} 版本历史 chapterId -> VersionSnapshot[] */
    this.versions = new Map()
    
    /** @type {Map<string, Branch[]>} 分支 projectId -> Branch[] */
    this.branches = new Map()
    
    /** 最大版本数 */
    this.maxVersions = 100
    
    /** 自动保存间隔（毫秒） */
    this.autoSaveInterval = 60000 // 1分钟
    
    /** 自动保存定时器 */
    this.autoSaveTimers = new Map()
    
    // 从本地存储加载
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载
   */
  loadFromStorage() {
    try {
      const versionsData = localStorage.getItem('yunshu_versions')
      if (versionsData) {
        const parsed = JSON.parse(versionsData)
        Object.entries(parsed).forEach(([chapterId, versionList]) => {
          this.versions.set(chapterId, versionList)
        })
      }

      const branchesData = localStorage.getItem('yunshu_branches')
      if (branchesData) {
        const parsed = JSON.parse(branchesData)
        Object.entries(parsed).forEach(([projectId, branchList]) => {
          this.branches.set(projectId, branchList)
        })
      }
    } catch (e) {
      console.error('[版本控制] 加载数据失败:', e)
    }
  }

  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      const versionsData = {}
      this.versions.forEach((versionList, chapterId) => {
        versionsData[chapterId] = versionList
      })
      localStorage.setItem('yunshu_versions', JSON.stringify(versionsData))

      const branchesData = {}
      this.branches.forEach((branchList, projectId) => {
        branchesData[projectId] = branchList
      })
      localStorage.setItem('yunshu_branches', JSON.stringify(branchesData))
    } catch (e) {
      console.error('[版本控制] 保存数据失败:', e)
    }
  }

  /**
   * 创建版本快照
   * @param {Object} params - 参数
   * @returns {VersionSnapshot}
   */
  createSnapshot({ projectId, chapterId, content, author, authorId, message = '', branch = 'main' }) {
    if (!this.versions.has(chapterId)) {
      this.versions.set(chapterId, [])
    }

    const versionList = this.versions.get(chapterId)
    const parentVersion = versionList.length > 0 ? versionList[versionList.length - 1].id : null

    const snapshot = {
      id: generateId(),
      projectId,
      chapterId,
      content,
      wordCount: content.length,
      author,
      authorId,
      message,
      createdAt: new Date().toISOString(),
      parentId: parentVersion,
      branch
    }

    versionList.push(snapshot)

    // 限制版本数量
    if (versionList.length > this.maxVersions) {
      this.versions.set(chapterId, versionList.slice(-this.maxVersions))
    }

    // 更新分支头
    this.updateBranchHead(projectId, branch, snapshot.id)

    this.saveToStorage()
    return snapshot
  }

  /**
   * 获取版本历史
   * @param {string} chapterId - 章节ID
   * @param {number} limit - 数量限制
   * @returns {VersionSnapshot[]}
   */
  getVersionHistory(chapterId, limit = 20) {
    const versionList = this.versions.get(chapterId) || []
    return versionList.slice(-limit).reverse()
  }

  /**
   * 获取特定版本
   * @param {string} versionId - 版本ID
   * @returns {VersionSnapshot|null}
   */
  getVersion(versionId) {
    for (const versionList of this.versions.values()) {
      const version = versionList.find(v => v.id === versionId)
      if (version) return version
    }
    return null
  }

  /**
   * 对比两个版本
   * @param {string} versionId1 - 版本1 ID
   * @param {string} versionId2 - 版本2 ID
   * @returns {Object} 对比结果
   */
  compareVersions(versionId1, versionId2) {
    const v1 = this.getVersion(versionId1)
    const v2 = this.getVersion(versionId2)

    if (!v1 || !v2) {
      throw new Error('版本不存在')
    }

    const content1 = v1.content
    const content2 = v2.content

    // 使用 DiffEngine 进行真正的 diff 计算（基于 Google diff-match-patch 算法）
    const report = diffEngine.generateDiffReport(content1, content2)

    return {
      version1: {
        id: v1.id,
        author: v1.author,
        createdAt: v1.createdAt,
        wordCount: v1.wordCount,
        message: v1.message
      },
      version2: {
        id: v2.id,
        author: v2.author,
        createdAt: v2.createdAt,
        wordCount: v2.wordCount,
        message: v2.message
      },
      diff: {
        additions: report.summary.insertions,
        deletions: report.summary.deletions,
        similarity: report.summary.similarity,
        // 额外提供逐行 diff 详情，方便 UI 展示
        lines: report.diffs
      }
    }
  }

  /**
   * 回滚到指定版本
   * @param {string} chapterId - 章节ID
   * @param {string} versionId - 版本ID
   * @param {string} author - 操作者
   * @param {string} authorId - 操作者ID
   * @returns {VersionSnapshot} 新版本
   */
  rollbackToVersion(chapterId, versionId, author, authorId) {
    const version = this.getVersion(versionId)
    if (!version) {
      throw new Error('版本不存在')
    }

    // 创建新版本（内容为旧版本内容）
    return this.createSnapshot({
      projectId: version.projectId,
      chapterId,
      content: version.content,
      author,
      authorId,
      message: `回滚到版本 ${versionId.substring(0, 8)}`
    })
  }

  /**
   * 创建分支
   * @param {string} projectId - 项目ID
   * @param {string} name - 分支名称
   * @param {string} createdBy - 创建者ID
   * @returns {Branch}
   */
  createBranch(projectId, name, createdBy) {
    if (!this.branches.has(projectId)) {
      this.branches.set(projectId, [])
    }

    const branchList = this.branches.get(projectId)
    
    // 检查分支名是否已存在
    if (branchList.some(b => b.name === name)) {
      throw new Error('分支名称已存在')
    }

    const branch = {
      id: generateId(),
      projectId,
      name,
      createdBy,
      createdAt: new Date().toISOString(),
      headVersionId: null
    }

    branchList.push(branch)
    this.saveToStorage()

    return branch
  }

  /**
   * 获取项目分支列表
   * @param {string} projectId - 项目ID
   * @returns {Branch[]}
   */
  getProjectBranches(projectId) {
    return this.branches.get(projectId) || []
  }

  /**
   * 更新分支头
   * @param {string} projectId - 项目ID
   * @param {string} branchName - 分支名称
   * @param {string} versionId - 版本ID
   */
  updateBranchHead(projectId, branchName, versionId) {
    const branchList = this.branches.get(projectId)
    if (!branchList) return

    const branch = branchList.find(b => b.name === branchName)
    if (branch) {
      branch.headVersionId = versionId
      this.saveToStorage()
    }
  }

  /**
   * 启动自动保存
   * @param {string} chapterId - 章节ID
   * @param {Function} getContentFn - 获取内容的函数
   * @param {Object} context - 上下文（projectId, author, authorId）
   */
  startAutoSave(chapterId, getContentFn, context) {
    if (this.autoSaveTimers.has(chapterId)) {
      this.stopAutoSave(chapterId)
    }

    const timer = setInterval(() => {
      const content = getContentFn()
      if (content) {
        this.createSnapshot({
          ...context,
          chapterId,
          content,
          message: '自动保存'
        })
      }
    }, this.autoSaveInterval)

    this.autoSaveTimers.set(chapterId, timer)
  }

  /**
   * 停止自动保存
   * @param {string} chapterId - 章节ID
   */
  stopAutoSave(chapterId) {
    const timer = this.autoSaveTimers.get(chapterId)
    if (timer) {
      clearInterval(timer)
      this.autoSaveTimers.delete(chapterId)
    }
  }
}

// ============================================================================
// 通知系统模块
// ============================================================================

/**
 * 通知类型枚举
 */
const NotificationType = {
  PROJECT_UPDATE: 'project_update',     // 项目更新
  COMMENT: 'comment',                   // 评论
  INVITATION: 'invitation',             // 协作邀请
  MENTION: 'mention',                   // @提及
  SYSTEM: 'system'                      // 系统通知
}

/**
 * 通知数据结构
 * @typedef {Object} Notification
 * @property {string} id - 通知ID
 * @property {string} type - 类型
 * @property {string} title - 标题
 * @property {string} content - 内容
 * @property {string} projectId - 项目ID（可选）
 * @property {string} chapterId - 章节ID（可选）
 * @property {string} senderId - 发送者ID
 * @property {string} senderName - 发送者名称
 * @property {string} recipientId - 接收者ID
 * @property {boolean} read - 是否已读
 * @property {string} createdAt - 创建时间
 * @property {Object} data - 附加数据
 */

/**
 * 通知管理器
 */
class NotificationManager {
  constructor(userManager) {
    /** @type {UserManager} */
    this.userManager = userManager
    
    /** @type {Map<string, Notification[]>} 用户通知 userId -> Notification[] */
    this.notifications = new Map()
    
    /** 通知回调 */
    this.onNotificationCallbacks = []
    
    // 从本地存储加载
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem('yunshu_notifications')
      if (data) {
        const parsed = JSON.parse(data)
        Object.entries(parsed).forEach(([userId, notificationList]) => {
          this.notifications.set(userId, notificationList)
        })
      }
    } catch (e) {
      console.error('[通知管理器] 加载数据失败:', e)
    }
  }

  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      const data = {}
      this.notifications.forEach((notificationList, userId) => {
        data[userId] = notificationList
      })
      localStorage.setItem('yunshu_notifications', JSON.stringify(data))
    } catch (e) {
      console.error('[通知管理器] 保存数据失败:', e)
    }
  }

  /**
   * 发送通知
   * @param {Object} params - 通知参数
   * @returns {Notification}
   */
  sendNotification({ type, title, content, projectId, chapterId, senderId, senderName, recipientId, data = {} }) {
    if (!this.notifications.has(recipientId)) {
      this.notifications.set(recipientId, [])
    }

    const notification = {
      id: generateId(),
      type,
      title,
      content,
      projectId,
      chapterId,
      senderId,
      senderName,
      recipientId,
      read: false,
      createdAt: new Date().toISOString(),
      data
    }

    this.notifications.get(recipientId).unshift(notification)
    this.saveToStorage()
    this._emitNotification(notification)

    return notification
  }

  /**
   * 发送项目更新通知
   * @param {string} projectId - 项目ID
   * @param {string} projectName - 项目名称
   * @param {string} updateType - 更新类型
   * @param {string} senderId - 发送者ID
   * @param {string} senderName - 发送者名称
   * @param {string[]} recipientIds - 接收者ID列表
   */
  sendProjectUpdateNotification(projectId, projectName, updateType, senderId, senderName, recipientIds) {
    recipientIds.forEach(recipientId => {
      if (recipientId !== senderId) {
        this.sendNotification({
          type: NotificationType.PROJECT_UPDATE,
          title: `项目更新`,
          content: `${senderName} 更新了项目「${projectName}」：${updateType}`,
          projectId,
          senderId,
          senderName,
          recipientId
        })
      }
    })
  }

  /**
   * 发送评论通知
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   * @param {string} chapterTitle - 章节标题
   * @param {string} commentContent - 评论内容
   * @param {string} senderId - 发送者ID
   * @param {string} senderName - 发送者名称
   * @param {string} recipientId - 接收者ID
   */
  sendCommentNotification(projectId, chapterId, chapterTitle, commentContent, senderId, senderName, recipientId) {
    this.sendNotification({
      type: NotificationType.COMMENT,
      title: `新评论`,
      content: `${senderName} 在「${chapterTitle}」中评论：${commentContent.substring(0, 50)}...`,
      projectId,
      chapterId,
      senderId,
      senderName,
      recipientId
    })
  }

  /**
   * 发送协作邀请通知
   * @param {string} projectId - 项目ID
   * @param {string} projectName - 项目名称
   * @param {string} role - 角色
   * @param {string} senderId - 发送者ID
   * @param {string} senderName - 发送者名称
   * @param {string} recipientId - 接收者ID
   */
  sendInvitationNotification(projectId, projectName, role, senderId, senderName, recipientId) {
    this.sendNotification({
      type: NotificationType.INVITATION,
      title: `协作邀请`,
      content: `${senderName} 邀请您加入项目「${projectName}」作为${this.getRoleName(role)}`,
      projectId,
      senderId,
      senderName,
      recipientId,
      data: { role, invitationId: generateId() }
    })
  }

  /**
   * 发送@提及通知
   * @param {string} projectId - 项目ID
   * @param {string} chapterId - 章节ID
   * @param {string} context - 上下文
   * @param {string} senderId - 发送者ID
   * @param {string} senderName - 发送者名称
   * @param {string} recipientId - 接收者ID
   */
  sendMentionNotification(projectId, chapterId, context, senderId, senderName, recipientId) {
    this.sendNotification({
      type: NotificationType.MENTION,
      title: `有人@了你`,
      content: `${senderName} 在评论中提到了你：${context.substring(0, 50)}...`,
      projectId,
      chapterId,
      senderId,
      senderName,
      recipientId
    })
  }

  /**
   * 获取用户通知
   * @param {string} userId - 用户ID
   * @param {number} limit - 数量限制
   * @returns {Notification[]}
   */
  getUserNotifications(userId, limit = 50) {
    const notificationList = this.notifications.get(userId) || []
    return notificationList.slice(0, limit)
  }

  /**
   * 获取未读通知数量
   * @param {string} userId - 用户ID
   * @returns {number}
   */
  getUnreadCount(userId) {
    const notificationList = this.notifications.get(userId) || []
    return notificationList.filter(n => !n.read).length
  }

  /**
   * 标记通知为已读
   * @param {string} userId - 用户ID
   * @param {string} notificationId - 通知ID
   */
  markAsRead(userId, notificationId) {
    const notificationList = this.notifications.get(userId)
    if (!notificationList) return

    const notification = notificationList.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveToStorage()
    }
  }

  /**
   * 标记所有通知为已读
   * @param {string} userId - 用户ID
   */
  markAllAsRead(userId) {
    const notificationList = this.notifications.get(userId)
    if (!notificationList) return

    notificationList.forEach(n => n.read = true)
    this.saveToStorage()
  }

  /**
   * 删除通知
   * @param {string} userId - 用户ID
   * @param {string} notificationId - 通知ID
   */
  deleteNotification(userId, notificationId) {
    const notificationList = this.notifications.get(userId)
    if (!notificationList) return

    const index = notificationList.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notificationList.splice(index, 1)
      this.saveToStorage()
    }
  }

  /**
   * 获取角色名称
   * @param {string} role - 角色代码
   * @returns {string}
   */
  getRoleName(role) {
    const roleNames = {
      [PermissionLevel.OWNER]: '所有者',
      [PermissionLevel.EDITOR]: '编辑者',
      [PermissionLevel.REVIEWER]: '审阅者',
      [PermissionLevel.VIEWER]: '访客'
    }
    return roleNames[role] || role
  }

  /**
   * 注册通知回调
   * @param {Function} callback - 回调函数
   */
  onNotification(callback) {
    this.onNotificationCallbacks.push(callback)
  }

  /**
   * 触发通知回调
   */
  _emitNotification(notification) {
    this.onNotificationCallbacks.forEach(cb => {
      try {
        cb(deepClone(notification))
      } catch (e) {
        console.error('[通知管理器] 回调执行失败:', e)
      }
    })
  }
}

// ============================================================================
// 多用户服务主类
// ============================================================================

/**
 * 多用户服务
 * 整合所有用户相关功能模块
 */
class MultiUserService {
  constructor() {
    // 初始化各模块
    this.users = new UserManager()
    this.permissions = new PermissionManager(this.users)
    this.collaboration = new RealtimeCollaborationManager(this.users, this.permissions)
    this.versionControl = new VersionControlManager()
    this.notifications = new NotificationManager(this.users)
  }

  // ========================================================================
  // 用户相关便捷方法
  // ========================================================================

  /**
   * 注册用户
   */
  async register(params) {
    return this.users.register(params)
  }

  /**
   * 登录
   */
  async login(email, password) {
    return this.users.login(email, password)
  }

  /**
   * 登出
   */
  logout() {
    // 离开所有协作
    this.collaboration.disconnect()
    // 登出
    this.users.logout()
  }

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return this.users.getCurrentUser()
  }

  /**
   * 是否已登录
   */
  isLoggedIn() {
    return this.users.isLoggedIn()
  }

  // ========================================================================
  // 权限相关便捷方法
  // ========================================================================

  /**
   * 初始化项目权限
   */
  initializeProject(projectId) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) throw new Error('请先登录')
    this.permissions.initializeProject(projectId, currentUser.id)
  }

  /**
   * 添加项目成员
   */
  addProjectMember(projectId, userId, role) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) throw new Error('请先登录')
    return this.permissions.addMember(projectId, userId, role, currentUser.id)
  }

  /**
   * 获取项目成员
   */
  getProjectMembers(projectId) {
    return this.permissions.getProjectMembers(projectId)
  }

  /**
   * 检查权限
   */
  hasPermission(projectId, permission) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return false
    return this.permissions.hasPermission(projectId, currentUser.id, permission)
  }

  // ========================================================================
  // 协作相关便捷方法
  // ========================================================================

  /**
   * 加入项目协作
   */
  joinProjectCollaboration(projectId, chapterId) {
    return this.collaboration.joinProject(projectId, chapterId)
  }

  /**
   * 离开项目协作
   */
  leaveProjectCollaboration(projectId) {
    return this.collaboration.leaveProject(projectId)
  }

  /**
   * 获取在线用户
   */
  getOnlineUsers(projectId) {
    return this.collaboration.getProjectOnlineUsers(projectId)
  }

  /**
   * 请求编辑锁
   */
  requestEditLock(projectId, chapterId) {
    return this.collaboration.requestEditLock(projectId, chapterId)
  }

  /**
   * 释放编辑锁
   */
  releaseEditLock(lockId) {
    return this.collaboration.releaseEditLock(lockId)
  }

  // ========================================================================
  // 版本控制便捷方法
  // ========================================================================

  /**
   * 创建版本快照
   */
  createVersionSnapshot(params) {
    return this.versionControl.createSnapshot(params)
  }

  /**
   * 获取版本历史
   */
  getVersionHistory(chapterId, limit) {
    return this.versionControl.getVersionHistory(chapterId, limit)
  }

  /**
   * 回滚版本
   */
  rollbackVersion(chapterId, versionId) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) throw new Error('请先登录')
    return this.versionControl.rollbackToVersion(chapterId, versionId, currentUser.username, currentUser.id)
  }

  // ========================================================================
  // 通知便捷方法
  // ========================================================================

  /**
   * 获取通知
   */
  getNotifications(limit) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return []
    return this.notifications.getUserNotifications(currentUser.id, limit)
  }

  /**
   * 获取未读数量
   */
  getUnreadNotificationCount() {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return 0
    return this.notifications.getUnreadCount(currentUser.id)
  }

  /**
   * 标记通知已读
   */
  markNotificationRead(notificationId) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return
    this.notifications.markAsRead(currentUser.id, notificationId)
  }

  // ========================================================================
  // 数据导出/导入
  // ========================================================================

  /**
   * 导出所有数据
   */
  exportAllData() {
    return {
      users: Array.from(this.users.users.values()).map(u => {
        const { password, ...userWithoutPassword } = u
        return userWithoutPassword
      }),
      permissions: Object.fromEntries(
        Array.from(this.permissions.projectMembers.entries()).map(([k, v]) => [k, Object.fromEntries(v)])
      ),
      versions: Object.fromEntries(this.versionControl.versions),
      branches: Object.fromEntries(this.versionControl.branches),
      notifications: Object.fromEntries(this.notifications.notifications)
    }
  }

  /**
   * 导入数据
   */
  importAllData(data) {
    // 这里可以实现数据导入逻辑
    console.log('导入数据:', data)
  }
}

// ============================================================================
// 导出
// ============================================================================

export default MultiUserService

/**
 * 创建多用户服务实例
 * @returns {MultiUserService}
 */
export function createMultiUserService() {
  return new MultiUserService()
}

/**
 * 导出各模块
 */
export {
  UserManager,
  PermissionManager,
  RealtimeCollaborationManager,
  VersionControlManager,
  NotificationManager,
  PermissionLevel,
  PermissionConfig,
  NotificationType
}

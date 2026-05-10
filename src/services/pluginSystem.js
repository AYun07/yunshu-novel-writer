/**
 * 云书 - 插件系统架构模块
 * 提供插件生命周期管理、API 暴露、沙箱隔离、配置持久化等功能
 * 支持第三方扩展，内置示例插件目录
 */

// ==================== 插件接口规范 ====================

/**
 * 插件接口规范定义
 * 所有云书插件必须实现以下接口
 *
 * @interface YunshuPlugin
 * @property {string} name - 插件唯一标识名（如 'word-counter'）
 * @property {string} version - 插件版本号（遵循语义化版本）
 * @property {string} displayName - 插件显示名称
 * @property {string} description - 插件描述
 * @property {string} author - 插件作者
 * @property {string[]} [permissions] - 插件所需权限列表
 * @property {object} [configSchema] - 插件配置项的 JSON Schema 定义
 * @property {Function} install - 安装钩子，插件被加载时调用
 * @property {Function} activate - 激活钩子，插件被启用时调用
 * @property {Function} [deactivate] - 停用钩子，插件被禁用时调用
 * @property {Function} [uninstall] - 卸载钩子，插件被移除时调用
 */

/**
 * 插件所需权限枚举
 */
const PLUGIN_PERMISSIONS = {
  // 数据读写权限
  DATA_READ: 'data:read',         // 读取项目数据
  DATA_WRITE: 'data:write',       // 写入项目数据
  // UI 注册权限
  UI_PANEL: 'ui:panel',           // 注册侧边栏面板
  UI_MENU: 'ui:menu',             // 注册菜单项
  UI_TOOLBAR: 'ui:toolbar',       // 注册工具栏按钮
  UI_DIALOG: 'ui:dialog',         // 注册对话框
  // AI 调用权限
  AI_CALL: 'ai:call',             // 调用 AI 接口
  // 系统权限
  STORAGE: 'storage',             // 使用本地存储
  NETWORK: 'network',             // 网络请求
  CLIPBOARD: 'clipboard',         // 访问剪贴板
  NOTIFICATION: 'notification'    // 发送通知
}

/**
 * 插件状态枚举
 */
const PLUGIN_STATUS = {
  LOADED: 'loaded',       // 已加载（未激活）
  ACTIVE: 'active',       // 已激活（运行中）
  DISABLED: 'disabled',   // 已禁用
  ERROR: 'error'          // 错误状态
}

// ==================== 插件 API 类 ====================

/**
 * PluginAPI 类
 * 暴露给插件的 API 接口，提供数据 CRUD、UI 注册、事件订阅、AI 调用等能力
 * 每个插件实例会获得独立的 PluginAPI 实例
 */
class PluginAPI {
  /**
   * @param {string} pluginName - 插件名称
   * @param {PluginManager} manager - 插件管理器引用
   */
  constructor(pluginName, manager) {
    /** @type {string} 插件名称 */
    this._pluginName = pluginName
    /** @type {PluginManager} 管理器引用 */
    this._manager = manager
    /** @type {Map<string, Function>} 已注册的事件处理器 */
    this._handlers = new Map()
    /** @type {object} 插件私有存储 */
    this._storage = new PluginStorage(pluginName)
  }

  // ---------- 数据 CRUD API ----------

  /**
   * 读取项目数据
   * @param {string} tableName - 表名
   * @param {number} id - 记录ID
   * @returns {Promise<object|null>}
   */
  async getData(tableName, id) {
    this._checkPermission(PLUGIN_PERMISSIONS.DATA_READ)
    try {
      const database = await this._getDatabase()
      const table = database.db[tableName]
      if (!table) throw new Error(`表不存在: ${tableName}`)
      return table.get(id)
    } catch (error) {
      console.error(`[插件API] 读取数据失败 (${this._pluginName}):`, error)
      throw error
    }
  }

  /**
   * 查询项目数据列表
   * @param {string} tableName - 表名
   * @param {object} [query] - 查询条件
   * @param {number} [query.projectId] - 按项目ID过滤
   * @returns {Promise<Array>}
   */
  async queryData(tableName, query = {}) {
    this._checkPermission(PLUGIN_PERMISSIONS.DATA_READ)
    try {
      const database = await this._getDatabase()
      const table = database.db[tableName]
      if (!table) throw new Error(`表不存在: ${tableName}`)

      if (query.projectId) {
        return table.where('projectId').equals(query.projectId).toArray()
      }
      return table.toArray()
    } catch (error) {
      console.error(`[插件API] 查询数据失败 (${this._pluginName}):`, error)
      throw error
    }
  }

  /**
   * 写入数据
   * @param {string} tableName - 表名
   * @param {object} data - 要写入的数据
   * @returns {Promise<number>} 记录ID
   */
  async setData(tableName, data) {
    this._checkPermission(PLUGIN_PERMISSIONS.DATA_WRITE)
    try {
      const database = await this._getDatabase()
      const table = database.db[tableName]
      if (!table) throw new Error(`表不存在: ${tableName}`)

      // 标记数据来源为插件
      data._pluginSource = this._pluginName
      data._pluginModifiedAt = new Date().toISOString()

      if (data.id) {
        await table.put(data)
        return data.id
      }
      return table.add(data)
    } catch (error) {
      console.error(`[插件API] 写入数据失败 (${this._pluginName}):`, error)
      throw error
    }
  }

  /**
   * 删除数据
   * @param {string} tableName - 表名
   * @param {number} id - 记录ID
   * @returns {Promise<void>}
   */
  async deleteData(tableName, id) {
    this._checkPermission(PLUGIN_PERMISSIONS.DATA_WRITE)
    try {
      const database = await this._getDatabase()
      const table = database.db[tableName]
      if (!table) throw new Error(`表不存在: ${tableName}`)
      await table.delete(id)
    } catch (error) {
      console.error(`[插件API] 删除数据失败 (${this._pluginName}):`, error)
      throw error
    }
  }

  // ---------- UI 注册 API ----------

  /**
   * 注册侧边栏面板
   * @param {object} panel - 面板配置
   * @param {string} panel.id - 面板唯一ID
   * @param {string} panel.title - 面板标题
   * @param {string} panel.icon - 面板图标（Element Plus 图标名）
   * @param {Component} panel.component - Vue 组件
   * @param {object} [panel.options] - 额外选项
   * @returns {boolean} 是否注册成功
   */
  registerPanel(panel) {
    this._checkPermission(PLUGIN_PERMISSIONS.UI_PANEL)
    return this._manager._emitEvent('plugin:register-panel', {
      pluginName: this._pluginName,
      panel
    })
  }

  /**
   * 注册菜单项
   * @param {object} menuItem - 菜单项配置
   * @param {string} menuItem.id - 菜单项唯一ID
   * @param {string} menuItem.label - 菜单项文本
   * @param {string} menuItem.icon - 图标
   * @param {Function} menuItem.action - 点击回调
   * @param {string} [menuItem.parentId] - 父菜单ID
   * @returns {boolean}
   */
  registerMenuItem(menuItem) {
    this._checkPermission(PLUGIN_PERMISSIONS.UI_MENU)
    return this._manager._emitEvent('plugin:register-menu', {
      pluginName: this._pluginName,
      menuItem
    })
  }

  /**
   * 注册工具栏按钮
   * @param {object} button - 按钮配置
   * @param {string} button.id - 按钮唯一ID
   * @param {string} button.label - 按钮文本
   * @param {string} button.icon - 图标
   * @param {Function} button.action - 点击回调
   * @param {string} [button.position='right'] - 位置
   * @returns {boolean}
   */
  registerToolbarButton(button) {
    this._checkPermission(PLUGIN_PERMISSIONS.UI_TOOLBAR)
    return this._manager._emitEvent('plugin:register-toolbar', {
      pluginName: this._pluginName,
      button
    })
  }

  /**
   * 注册对话框
   * @param {object} dialog - 对话框配置
   * @param {string} dialog.id - 对话框唯一ID
   * @param {string} dialog.title - 对话框标题
   * @param {Component} dialog.component - Vue 组件
   * @param {object} [dialog.options] - 额外选项（width 等）
   * @returns {boolean}
   */
  registerDialog(dialog) {
    this._checkPermission(PLUGIN_PERMISSIONS.UI_DIALOG)
    return this._manager._emitEvent('plugin:register-dialog', {
      pluginName: this._pluginName,
      dialog
    })
  }

  // ---------- 事件订阅 API ----------

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  on(eventName, handler) {
    const key = `${this._pluginName}:${eventName}`
    this._handlers.set(key, handler)
    this._manager._onEvent(eventName, handler)
  }

  /**
   * 取消订阅事件
   * @param {string} eventName - 事件名称
   */
  off(eventName) {
    const key = `${this._pluginName}:${eventName}`
    const handler = this._handlers.get(key)
    if (handler) {
      this._manager._offEvent(eventName, handler)
      this._handlers.delete(key)
    }
  }

  /**
   * 触发事件
   * @param {string} eventName - 事件名称
   * @param {*} data - 事件数据
   */
  emit(eventName, data) {
    this._manager._emitEvent(eventName, data)
  }

  // ---------- AI 调用 API ----------

  /**
   * 调用 AI 生成文本
   * @param {string} prompt - 提示词
   * @param {object} [options] - 选项
   * @param {string} [options.model] - 指定模型
   * @param {number} [options.maxTokens] - 最大 token 数
   * @param {number} [options.temperature] - 温度
   * @param {Function} [options.onChunk] - 流式回调
   * @returns {Promise<string>} 生成结果
   */
  async callAI(prompt, options = {}) {
    this._checkPermission(PLUGIN_PERMISSIONS.AI_CALL)
    try {
      const apiService = await this._getAPIService()
      if (options.onChunk) {
        return apiService.generateTextStream(prompt, options, options.onChunk)
      }
      return apiService.generateText(prompt, options)
    } catch (error) {
      console.error(`[插件API] AI调用失败 (${this._pluginName}):`, error)
      throw error
    }
  }

  // ---------- 存储 API ----------

  /**
   * 获取插件私有存储
   * @returns {PluginStorage}
   */
  get storage() {
    this._checkPermission(PLUGIN_PERMISSIONS.STORAGE)
    return this._storage
  }

  // ---------- 通知 API ----------

  /**
   * 发送通知
   * @param {string} message - 通知消息
   * @param {'success'|'warning'|'error'|'info'} [type='info'] - 通知类型
   */
  notify(message, type = 'info') {
    this._checkPermission(PLUGIN_PERMISSIONS.NOTIFICATION)
    this._manager._emitEvent('plugin:notify', {
      pluginName: this._pluginName,
      message,
      type
    })
  }

  // ---------- 内部方法 ----------

  /**
   * 检查权限
   * @param {string} permission - 所需权限
   * @private
   */
  _checkPermission(permission) {
    const plugin = this._manager.getPlugin(this._pluginName)
    if (!plugin) throw new Error(`插件不存在: ${this._pluginName}`)
    if (plugin.permissions && !plugin.permissions.includes(permission)) {
      throw new Error(`插件 ${this._pluginName} 缺少权限: ${permission}`)
    }
  }

  /**
   * 延迟加载数据库服务（避免循环依赖）
   * @private
   */
  async _getDatabase() {
    const mod = await import('./database.js')
    return mod.default
  }

  /**
   * 延迟加载 API 服务
   * @private
   */
  async _getAPIService() {
    const mod = await import('./api.js')
    return mod.default
  }
}

// ==================== 插件私有存储 ====================

/**
 * 插件私有存储
 * 每个插件拥有独立的 localStorage 命名空间，互不干扰
 */
class PluginStorage {
  /**
   * @param {string} pluginName - 插件名称
   */
  constructor(pluginName) {
    this._prefix = `yunshu_plugin_${pluginName}_`
  }

  /**
   * 存储数据
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(this._prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error(`[插件存储] 写入失败:`, error)
    }
  }

  /**
   * 读取数据
   * @param {string} key
   * @param {*} [defaultValue=null]
   * @returns {*}
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this._prefix + key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`[插件存储] 读取失败:`, error)
      return defaultValue
    }
  }

  /**
   * 删除数据
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(this._prefix + key)
  }

  /**
   * 清空该插件的所有存储
   */
  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this._prefix))
    keys.forEach(k => localStorage.removeItem(k))
  }

  /**
   * 获取所有存储的键
   * @returns {string[]}
   */
  keys() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(this._prefix))
      .map(k => k.slice(this._prefix.length))
  }
}

// ==================== 插件沙箱 ====================

/**
 * 插件沙箱
 * 提供基础的隔离环境，限制插件访问全局对象的能力
 * 注意：这是基础隔离，无法完全防止恶意代码，生产环境建议使用 Web Worker
 */
class PluginSandbox {
  /**
   * 在沙箱中执行插件代码
   * @param {string} code - 插件代码字符串
   * @param {object} context - 注入的上下文对象
   * @returns {object} 执行结果（导出的插件对象）
   */
  static execute(code, context = {}) {
    // 创建受限的全局对象代理
    const safeGlobals = {
      console: {
        log: (...args) => console.log(`[插件]`, ...args),
        warn: (...args) => console.warn(`[插件]`, ...args),
        error: (...args) => console.error(`[插件]`, ...args),
        info: (...args) => console.info(`[插件]`, ...args)
      },
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      Date,
      JSON,
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      Map,
      Set,
      Promise,
      Error,
      RegExp,
      encodeURIComponent,
      decodeURIComponent
    }

    // 合并上下文
    const sandboxContext = { ...safeGlobals, ...context }

    // 使用 Function 构造器创建沙箱函数
    // 将上下文变量作为参数传入
    const paramNames = Object.keys(sandboxContext)
    const paramValues = Object.values(sandboxContext)

    try {
      const sandboxFn = new Function(
        ...paramNames,
        `"use strict";\n${code}\nreturn typeof module !== 'undefined' ? module.exports : (typeof exports !== 'undefined' ? exports : {})`
      )

      // 创建空的 module/exports 对象
      const moduleObj = { exports: {} }
      const exportsObj = {}

      const result = sandboxFn(...paramValues, moduleObj, exportsObj)

      // 优先返回 module.exports，其次 exports，最后直接返回结果
      return moduleObj.exports || exportsObj || result
    } catch (error) {
      console.error('[插件沙箱] 执行失败:', error)
      throw new Error(`插件代码执行失败: ${error.message}`)
    }
  }

  /**
   * 验证插件接口合规性
   * @param {object} plugin - 插件对象
   * @returns {{ valid: boolean, errors: string[] }}
   */
  static validate(plugin) {
    const errors = []

    if (!plugin || typeof plugin !== 'object') {
      return { valid: false, errors: ['插件必须是一个对象'] }
    }

    // 必填字段检查
    const requiredFields = [
      { field: 'name', type: 'string', desc: '插件名称' },
      { field: 'version', type: 'string', desc: '版本号' },
      { field: 'displayName', type: 'string', desc: '显示名称' },
      { field: 'description', type: 'string', desc: '描述' },
      { field: 'author', type: 'string', desc: '作者' }
    ]

    for (const { field, type, desc } of requiredFields) {
      if (!plugin[field]) {
        errors.push(`缺少必填字段: ${desc} (${field})`)
      } else if (typeof plugin[field] !== type) {
        errors.push(`${desc} (${field}) 必须是 ${type} 类型`)
      }
    }

    // 必填方法检查
    if (typeof plugin.install !== 'function') {
      errors.push('缺少必填方法: install')
    }
    if (typeof plugin.activate !== 'function') {
      errors.push('缺少必填方法: activate')
    }

    // 名称格式检查
    if (plugin.name && !/^[a-z][a-z0-9-]*$/.test(plugin.name)) {
      errors.push('插件名称只能包含小写字母、数字和连字符，且以字母开头')
    }

    // 版本号格式检查
    if (plugin.version && !/^\d+\.\d+\.\d+/.test(plugin.version)) {
      errors.push('版本号格式不正确，应为语义化版本 (如 1.0.0)')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// ==================== 插件管理器 ====================

/**
 * PluginManager 类
 * 管理所有插件的生命周期：加载、启用、禁用、卸载
 */
class PluginManager {
  constructor() {
    /** @type {Map<string, object>} 已加载的插件实例 */
    this._plugins = new Map()
    /** @type {Map<string, PluginAPI>} 每个插件对应的 API 实例 */
    this._apiInstances = new Map()
    /** @type {Map<string, string>} 插件状态 */
    this._statuses = new Map()
    /** @type {Map<string, Function[]>} 事件监听器 */
    this._eventListeners = new Map()
    /** @type {boolean} 是否已初始化 */
    this._initialized = false
  }

  /**
   * 初始化插件管理器
   * 从持久化存储中加载已保存的插件配置
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this._initialized) return

    console.log('[插件管理器] 正在初始化...')

    try {
      // 加载已保存的插件配置
      const savedConfigs = this._loadPluginConfigs()

      for (const config of savedConfigs) {
        if (config.status === 'active' && config.code) {
          try {
            await this.loadFromString(config.name, config.code)
            await this.activate(config.name)
          } catch (error) {
            console.warn(`[插件管理器] 自动加载插件 ${config.name} 失败:`, error)
          }
        }
      }

      this._initialized = true
      console.log(`[插件管理器] 初始化完成，已加载 ${this._plugins.size} 个插件`)
    } catch (error) {
      console.error('[插件管理器] 初始化失败:', error)
    }
  }

  /**
   * 从代码字符串加载插件
   * @param {string} name - 插件名称（用于标识）
   * @param {string} code - 插件代码字符串
   * @returns {Promise<boolean>} 是否加载成功
   */
  async loadFromString(name, code) {
    try {
      // 在沙箱中执行插件代码
      const pluginExports = PluginSandbox.execute(code, {})

      // 处理默认导出
      const plugin = pluginExports.default || pluginExports

      // 验证插件接口
      const validation = PluginSandbox.validate(plugin)
      if (!validation.valid) {
        throw new Error(`插件验证失败:\n${validation.errors.join('\n')}`)
      }

      // 检查名称是否冲突
      if (this._plugins.has(plugin.name)) {
        throw new Error(`插件名称已存在: ${plugin.name}`)
      }

      // 创建 API 实例
      const api = new PluginAPI(plugin.name, this)

      // 存储插件
      this._plugins.set(plugin.name, plugin)
      this._apiInstances.set(plugin.name, api)
      this._statuses.set(plugin.name, PLUGIN_STATUS.LOADED)

      // 调用安装钩子
      await plugin.install(api)

      console.log(`[插件管理器] 插件已加载: ${plugin.displayName} v${plugin.version}`)
      this._emitEvent('plugin:loaded', { name: plugin.name, plugin })

      return true
    } catch (error) {
      console.error(`[插件管理器] 加载插件失败 (${name}):`, error)
      this._statuses.set(name, PLUGIN_STATUS.ERROR)
      throw error
    }
  }

  /**
   * 从对象直接加载插件（用于内置插件）
   * @param {object} plugin - 插件对象（符合 YunshuPlugin 接口）
   * @returns {Promise<boolean>}
   */
  async loadFromObject(plugin) {
    try {
      const validation = PluginSandbox.validate(plugin)
      if (!validation.valid) {
        throw new Error(`插件验证失败:\n${validation.errors.join('\n')}`)
      }

      if (this._plugins.has(plugin.name)) {
        console.warn(`[插件管理器] 插件已存在，跳过: ${plugin.name}`)
        return false
      }

      const api = new PluginAPI(plugin.name, this)

      this._plugins.set(plugin.name, plugin)
      this._apiInstances.set(plugin.name, api)
      this._statuses.set(plugin.name, PLUGIN_STATUS.LOADED)

      await plugin.install(api)

      console.log(`[插件管理器] 内置插件已加载: ${plugin.displayName} v${plugin.version}`)
      return true
    } catch (error) {
      console.error(`[插件管理器] 加载内置插件失败:`, error)
      throw error
    }
  }

  /**
   * 激活（启用）插件
   * @param {string} name - 插件名称
   * @returns {Promise<boolean>}
   */
  async activate(name) {
    const plugin = this._plugins.get(name)
    if (!plugin) {
      throw new Error(`插件不存在: ${name}`)
    }

    const status = this._statuses.get(name)
    if (status === PLUGIN_STATUS.ACTIVE) {
      console.warn(`[插件管理器] 插件已激活: ${name}`)
      return true
    }

    try {
      await plugin.activate(this._apiInstances.get(name))
      this._statuses.set(name, PLUGIN_STATUS.ACTIVE)

      // 持久化配置
      this._savePluginConfig(name, { status: 'active' })

      console.log(`[插件管理器] 插件已激活: ${name}`)
      this._emitEvent('plugin:activated', { name, plugin })
      return true
    } catch (error) {
      console.error(`[插件管理器] 激活插件失败 (${name}):`, error)
      this._statuses.set(name, PLUGIN_STATUS.ERROR)
      throw error
    }
  }

  /**
   * 停用（禁用）插件
   * @param {string} name - 插件名称
   * @returns {Promise<boolean>}
   */
  async deactivate(name) {
    const plugin = this._plugins.get(name)
    if (!plugin) {
      throw new Error(`插件不存在: ${name}`)
    }

    const status = this._statuses.get(name)
    if (status !== PLUGIN_STATUS.ACTIVE) {
      console.warn(`[插件管理器] 插件未激活: ${name}`)
      return false
    }

    try {
      if (typeof plugin.deactivate === 'function') {
        await plugin.deactivate(this._apiInstances.get(name))
      }

      this._statuses.set(name, PLUGIN_STATUS.DISABLED)
      this._savePluginConfig(name, { status: 'disabled' })

      console.log(`[插件管理器] 插件已停用: ${name}`)
      this._emitEvent('plugin:deactivated', { name, plugin })
      return true
    } catch (error) {
      console.error(`[插件管理器] 停用插件失败 (${name}):`, error)
      throw error
    }
  }

  /**
   * 卸载插件
   * @param {string} name - 插件名称
   * @returns {Promise<boolean>}
   */
  async unload(name) {
    const plugin = this._plugins.get(name)
    if (!plugin) {
      throw new Error(`插件不存在: ${name}`)
    }

    try {
      // 先停用
      const status = this._statuses.get(name)
      if (status === PLUGIN_STATUS.ACTIVE) {
        await this.deactivate(name)
      }

      // 调用卸载钩子
      if (typeof plugin.uninstall === 'function') {
        await plugin.uninstall(this._apiInstances.get(name))
      }

      // 清理事件监听
      const api = this._apiInstances.get(name)
      if (api) {
        for (const [key, handler] of api._handlers) {
          const eventName = key.split(':').slice(1).join(':')
          this._offEvent(eventName, handler)
        }
      }

      // 清理存储
      this._plugins.delete(name)
      this._apiInstances.delete(name)
      this._statuses.delete(name)
      this._removePluginConfig(name)

      console.log(`[插件管理器] 插件已卸载: ${name}`)
      this._emitEvent('plugin:unloaded', { name })
      return true
    } catch (error) {
      console.error(`[插件管理器] 卸载插件失败 (${name}):`, error)
      throw error
    }
  }

  /**
   * 获取插件信息
   * @param {string} name - 插件名称
   * @returns {object|null}
   */
  getPlugin(name) {
    return this._plugins.get(name) || null
  }

  /**
   * 获取插件状态
   * @param {string} name - 插件名称
   * @returns {string}
   */
  getPluginStatus(name) {
    return this._statuses.get(name) || PLUGIN_STATUS.DISABLED
  }

  /**
   * 获取所有已加载的插件列表
   * @returns {Array<{name: string, displayName: string, version: string, description: string, status: string}>}
   */
  getAllPlugins() {
    const list = []
    for (const [name, plugin] of this._plugins) {
      list.push({
        name: plugin.name,
        displayName: plugin.displayName,
        version: plugin.version,
        description: plugin.description,
        author: plugin.author,
        status: this._statuses.get(name)
      })
    }
    return list
  }

  /**
   * 获取所有激活的插件
   * @returns {Array}
   */
  getActivePlugins() {
    return this.getAllPlugins().filter(p => p.status === PLUGIN_STATUS.ACTIVE)
  }

  // ---------- 事件系统 ----------

  /**
   * 注册事件监听
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 处理函数
   * @internal
   */
  _onEvent(eventName, handler) {
    if (!this._eventListeners.has(eventName)) {
      this._eventListeners.set(eventName, [])
    }
    this._eventListeners.get(eventName).push(handler)
  }

  /**
   * 移除事件监听
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 处理函数
   * @internal
   */
  _offEvent(eventName, handler) {
    const listeners = this._eventListeners.get(eventName)
    if (listeners) {
      const index = listeners.indexOf(handler)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   * @param {string} eventName - 事件名称
   * @param {*} data - 事件数据
   * @returns {boolean} 是否有监听器处理了该事件
   * @internal
   */
  _emitEvent(eventName, data) {
    const listeners = this._eventListeners.get(eventName)
    if (!listeners || listeners.length === 0) return false

    for (const handler of listeners) {
      try {
        handler(data)
      } catch (error) {
        console.error(`[插件管理器] 事件处理器错误 (${eventName}):`, error)
      }
    }
    return true
  }

  // ---------- 配置持久化 ----------

  /**
   * 加载插件配置
   * @private
   * @returns {Array}
   */
  _loadPluginConfigs() {
    try {
      const saved = localStorage.getItem('yunshu_plugin_configs')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('[插件管理器] 加载配置失败:', error)
      return []
    }
  }

  /**
   * 保存插件配置
   * @private
   * @param {string} name - 插件名称
   * @param {object} config - 配置数据
   */
  _savePluginConfig(name, config) {
    try {
      const configs = this._loadPluginConfigs()
      const existing = configs.find(c => c.name === name)

      if (existing) {
        Object.assign(existing, config)
      } else {
        configs.push({ name, ...config })
      }

      localStorage.setItem('yunshu_plugin_configs', JSON.stringify(configs))
    } catch (error) {
      console.error('[插件管理器] 保存配置失败:', error)
    }
  }

  /**
   * 移除插件配置
   * @private
   * @param {string} name - 插件名称
   */
  _removePluginConfig(name) {
    try {
      const configs = this._loadPluginConfigs()
      const filtered = configs.filter(c => c.name !== name)
      localStorage.setItem('yunshu_plugin_configs', JSON.stringify(filtered))
    } catch (error) {
      console.error('[插件管理器] 移除配置失败:', error)
    }
  }
}

// ==================== 内置插件目录 ====================

/**
 * 内置插件示例
 * 这些插件随应用一起发布，无需额外安装
 */
const BUILTIN_PLUGINS = [
  /**
   * 字数统计插件
   * 实时统计当前章节和项目的字数
   */
  {
    name: 'word-counter',
    version: '1.0.0',
    displayName: '字数统计',
    description: '实时统计当前章节和项目的字数，显示写作进度',
    author: '云书官方',
    permissions: [PLUGIN_PERMISSIONS.DATA_READ, PLUGIN_PERMISSIONS.UI_PANEL],

    async install(api) {
      console.log('[字数统计插件] 安装中...')
      api.storage.set('targetWords', 50000)
    },

    async activate(api) {
      console.log('[字数统计插件] 已激活')
      api.notify('字数统计插件已启用', 'success')
    },

    async deactivate(api) {
      console.log('[字数统计插件] 已停用')
    }
  },

  /**
   * 写作计时器插件
   * 记录写作时间，提供番茄钟功能
   */
  {
    name: 'writing-timer',
    version: '1.0.0',
    displayName: '写作计时器',
    description: '记录写作时间，提供番茄钟功能，帮助保持专注',
    author: '云书官方',
    permissions: [PLUGIN_PERMISSIONS.DATA_READ, PLUGIN_PERMISSIONS.UI_TOOLBAR, PLUGIN_PERMISSIONS.NOTIFICATION],

    async install(api) {
      console.log('[写作计时器插件] 安装中...')
      api.storage.set('pomodoroDuration', 25)
      api.storage.set('breakDuration', 5)
    },

    async activate(api) {
      console.log('[写作计时器插件] 已激活')
    },

    async deactivate(api) {
      console.log('[写作计时器插件] 已停用')
    }
  },

  /**
   * 自动保存提示插件
   * 定期提醒保存，防止数据丢失
   */
  {
    name: 'auto-save-reminder',
    version: '1.0.0',
    displayName: '保存提醒',
    description: '定期提醒保存写作内容，防止意外丢失',
    author: '云书官方',
    permissions: [PLUGIN_PERMISSIONS.NOTIFICATION, PLUGIN_PERMISSIONS.STORAGE],

    async install(api) {
      console.log('[保存提醒插件] 安装中...')
      api.storage.set('reminderInterval', 10) // 每10分钟提醒
    },

    async activate(api) {
      console.log('[保存提醒插件] 已激活')
    },

    async deactivate(api) {
      console.log('[保存提醒插件] 已停用')
    }
  }
]

// ==================== 创建插件管理器实例并初始化 ====================

const pluginManager = new PluginManager()

/**
 * 初始化插件系统
 * 加载所有内置插件并恢复用户已安装的插件状态
 * @returns {Promise<void>}
 */
async function initializePluginSystem() {
  // 加载内置插件
  for (const plugin of BUILTIN_PLUGINS) {
    try {
      await pluginManager.loadFromObject(plugin)
    } catch (error) {
      console.warn(`[插件系统] 加载内置插件 ${plugin.name} 失败:`, error)
    }
  }

  // 初始化管理器（恢复已保存的插件）
  await pluginManager.initialize()
}

// ==================== 统一导出 ====================

const pluginSystem = {
  // 插件管理器
  manager: pluginManager,
  // 插件 API 类
  PluginAPI,
  // 插件沙箱
  PluginSandbox,
  // 插件存储
  PluginStorage,
  // 权限枚举
  PLUGIN_PERMISSIONS,
  // 状态枚举
  PLUGIN_STATUS,
  // 内置插件
  BUILTIN_PLUGINS,
  // 初始化函数
  initialize: initializePluginSystem
}

export default pluginSystem

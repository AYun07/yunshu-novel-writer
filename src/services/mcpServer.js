/**
 * 云书 - MCP Server 实现
 * 
 * 基于 Model Context Protocol (MCP) 协议，实现 JSON-RPC 2.0 通信。
 * 对标 Inkdrop MCP Server，提供小说创作相关的工具、资源和提示词模板。
 * 
 * 支持两种运行模式：
 * 1. stdio 模式：通过标准输入/输出与 Claude Desktop 集成
 * 2. HTTP 模式：本地 HTTP 服务器（端口 19840），供其他客户端调用
 * 
 * Claude Desktop 集成指南：
 * 在 Claude Desktop 的配置文件中添加以下内容：
 * {
 *   "mcpServers": {
 *     "yunshu": {
 *       "command": "node",
 *       "args": ["/path/to/xiaoshuo/src/services/mcpServer.js"],
 *       "env": {
 *         "YUNSHU_DATA_DIR": "/path/to/data"
 *       }
 *     }
 *   }
 * }
 * 配置文件路径：
 * - macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
 * - Windows: %APPDATA%\Claude\claude_desktop_config.json
 * - Linux: ~/.config/Claude/claude_desktop_config.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { createServer, IncomingMessage, ServerResponse } from 'http'

// ============================================================================
// MCP 协议常量定义
// ============================================================================

/** MCP 协议版本 */
const MCP_VERSION = '2024-11-05'

/** JSON-RPC 协议版本 */
const JSONRPC_VERSION = '2.0'

/** MCP 服务器信息 */
const SERVER_INFO = {
  name: 'yunshu-novel',
  version: '1.0.0'
}

/** MCP 支持的能力 */
const SERVER_CAPABILITIES = {
  tools: { listChanged: true },
  resources: { subscribe: true, listChanged: true },
  prompts: { listChanged: true }
}

// ============================================================================
// MCP 协议消息类型
// ============================================================================

/**
 * 初始化请求参数
 * @typedef {Object} InitializeParams
 * @property {string} protocolVersion - 客户端协议版本
 * @property {Object} capabilities - 客户端能力
 * @property {Object} clientInfo - 客户端信息
 */

/**
 * JSON-RPC 请求
 * @typedef {Object} JsonRpcRequest
 * @property {string} jsonrpc - 固定为 "2.0"
 * @property {string} method - 方法名
 * @property {Object|undefined} params - 参数
 * @property {string|number} id - 请求ID
 */

/**
 * JSON-RPC 响应
 * @typedef {Object} JsonRpcResponse
 * @property {string} jsonrpc - 固定为 "2.0"
 * @property {Object|undefined} result - 成功结果
 * @property {Object|undefined} error - 错误信息
 * @property {string|number} id - 对应请求ID
 */

// ============================================================================
// MCP Server 核心类
// ============================================================================

class MCPServer {
  constructor () {
    /** 已注册的工具列表 */
    this.tools = new Map()

    /** 已注册的资源列表 */
    this.resources = new Map()

    /** 已注册的提示词模板列表 */
    this.prompts = new Map()

    /** 资源订阅回调 */
    this.resourceSubscribers = new Map()

    /** 数据目录路径 */
    this.dataDir = process.env.YUNSHU_DATA_DIR || resolve('./data')

    /** HTTP 服务器实例 */
    this.httpServer = null

    /** 是否已初始化 */
    this.initialized = false

    /** 请求ID计数器 */
    this.requestIdCounter = 0

    /** 日志回调 */
    this.onLog = null

    // 注册内置工具、资源和提示词
    this._registerBuiltinTools()
    this._registerBuiltinResources()
    this._registerBuiltinPrompts()
  }

  // ========================================================================
  // 日志工具
  // ========================================================================

  /**
   * 输出日志信息
   * @param {string} level - 日志级别 (info/warn/error/debug)
   * @param {string} message - 日志消息
   * @param {Object} [data] - 附加数据
   */
  _log (level, message, data = null) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data ? { data } : {})
    }
    // 通过 stderr 输出日志，避免干扰 stdio 的 JSON-RPC 通信
    process.stderr.write(JSON.stringify(logEntry) + '\n')
    if (this.onLog) {
      this.onLog(logEntry)
    }
  }

  // ========================================================================
  // JSON-RPC 消息处理
  // ========================================================================

  /**
   * 处理 JSON-RPC 请求
   * @param {JsonRpcRequest} request - JSON-RPC 请求对象
   * @returns {JsonRpcResponse} JSON-RPC 响应
   */
  async handleRequest (request) {
    // 验证 JSON-RPC 格式
    if (request.jsonrpc !== JSONRPC_VERSION) {
      return this._errorResponse(request.id, -32600, 'Invalid Request: jsonrpc must be "2.0"')
    }

    if (!request.method || typeof request.method !== 'string') {
      return this._errorResponse(request.id, -32600, 'Invalid Request: method is required')
    }

    this._log('debug', `收到请求: ${request.method}`, request.params)

    try {
      let result

      switch (request.method) {
        // --- MCP 协议生命周期 ---
        case 'initialize':
          result = await this._handleInitialize(request.params)
          break

        case 'notifications/initialized':
          // 通知类型，不需要响应
          this.initialized = true
          this._log('info', 'MCP 服务器初始化完成')
          return null

        case 'ping':
          result = {}
          break

        // --- 工具相关 ---
        case 'tools/list':
          result = this._handleToolsList(request.params)
          break

        case 'tools/call':
          result = await this._handleToolCall(request.params)
          break

        // --- 资源相关 ---
        case 'resources/list':
          result = this._handleResourcesList(request.params)
          break

        case 'resources/read':
          result = await this._handleResourceRead(request.params)
          break

        case 'resources/subscribe':
          result = this._handleResourceSubscribe(request.params)
          break

        case 'resources/unsubscribe':
          result = this._handleResourceUnsubscribe(request.params)
          break

        // --- 提示词相关 ---
        case 'prompts/list':
          result = this._handlePromptsList(request.params)
          break

        case 'prompts/get':
          result = this._handlePromptGet(request.params)
          break

        default:
          return this._errorResponse(request.id, -32601, `Method not found: ${request.method}`)
      }

      return this._successResponse(request.id, result)
    } catch (error) {
      this._log('error', `处理请求失败: ${request.method}`, { error: error.message })
      return this._errorResponse(request.id, -32603, `Internal error: ${error.message}`)
    }
  }

  /**
   * 构建成功响应
   * @param {string|number} id - 请求ID
   * @param {*} result - 结果数据
   * @returns {JsonRpcResponse}
   */
  _successResponse (id, result) {
    return {
      jsonrpc: JSONRPC_VERSION,
      result,
      id
    }
  }

  /**
   * 构建错误响应
   * @param {string|number} id - 请求ID
   * @param {number} code - 错误码
   * @param {string} message - 错误信息
   * @returns {JsonRpcResponse}
   */
  _errorResponse (id, code, message) {
    return {
      jsonrpc: JSONRPC_VERSION,
      error: {
        code,
        message
      },
      id
    }
  }

  // ========================================================================
  // MCP 协议生命周期处理
  // ========================================================================

  /**
   * 处理 initialize 请求
   * @param {InitializeParams} params - 初始化参数
   * @returns {Object} 服务器信息和能力
   */
  async _handleInitialize (params) {
    this._log('info', '正在初始化 MCP 服务器', {
      clientInfo: params.clientInfo,
      protocolVersion: params.protocolVersion
    })

    // 确保数据目录存在
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true })
    }

    return {
      protocolVersion: MCP_VERSION,
      capabilities: SERVER_CAPABILITIES,
      serverInfo: SERVER_INFO
    }
  }

  // ========================================================================
  // 工具注册与调用
  // ========================================================================

  /**
   * 注册一个工具
   * @param {Object} tool - 工具定义
   * @param {string} tool.name - 工具名称
   * @param {string} tool.description - 工具描述
   * @param {Object} tool.inputSchema - JSON Schema 格式的输入参数定义
   * @param {Function} tool.handler - 工具处理函数，接收参数返回结果
   */
  registerTool (tool) {
    if (this.tools.has(tool.name)) {
      this._log('warn', `工具 "${tool.name}" 已存在，将被覆盖`)
    }
    this.tools.set(tool.name, {
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      handler: tool.handler
    })
    this._log('info', `注册工具: ${tool.name}`)
  }

  /**
   * 处理 tools/list 请求
   * @returns {Object} 工具列表
   */
  _handleToolsList () {
    const tools = Array.from(this.tools.values()).map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema
    }))
    return { tools }
  }

  /**
   * 处理 tools/call 请求
   * @param {Object} params - 调用参数
   * @param {string} params.name - 工具名称
   * @param {Object} params.arguments - 工具参数
   * @returns {Object} 工具调用结果
   */
  async _handleToolCall (params) {
    const { name, arguments: args = {} } = params

    const tool = this.tools.get(name)
    if (!tool) {
      throw new Error(`未知工具: ${name}`)
    }

    this._log('info', `调用工具: ${name}`, args)

    const result = await tool.handler(args)

    // MCP 工具调用结果格式
    return {
      content: [
        {
          type: 'text',
          text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
        }
      ]
    }
  }

  // ========================================================================
  // 资源注册与读取
  // ========================================================================

  /**
   * 注册一个资源模板
   * @param {Object} resource - 资源定义
   * @param {string} resource.uriTemplate - 资源 URI 模板（如 yunshu://projects/{projectId}/chapters/{chapterId}）
   * @param {string} resource.name - 资源名称
   * @param {string} resource.description - 资源描述
   * @param {string} resource.mimeType - MIME 类型
   * @param {Function} resource.handler - 资源读取处理函数
   */
  registerResource (resource) {
    if (this.resources.has(resource.uriTemplate)) {
      this._log('warn', `资源 "${resource.uriTemplate}" 已存在，将被覆盖`)
    }
    this.resources.set(resource.uriTemplate, {
      uriTemplate: resource.uriTemplate,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType || 'text/plain',
      handler: resource.handler
    })
    this._log('info', `注册资源: ${resource.uriTemplate}`)
  }

  /**
   * 处理 resources/list 请求
   * @returns {Object} 资源列表
   */
  _handleResourcesList () {
    const resources = Array.from(this.resources.values()).map(
      ({ uriTemplate, name, description, mimeType }) => ({
        uriTemplate,
        name,
        description,
        mimeType
      })
    )
    return { resources }
  }

  /**
   * 处理 resources/read 请求
   * @param {Object} params - 读取参数
   * @param {string} params.uri - 资源 URI
   * @returns {Object} 资源内容
   */
  async _handleResourceRead (params) {
    const { uri } = params

    // 查找匹配的资源模板
    for (const [template, resource] of this.resources) {
      const pattern = template.replace(/\{[^}]+\}/g, '([^/]+)')
      const regex = new RegExp(`^${pattern}$`)
      const match = uri.match(regex)

      if (match) {
        // 提取 URI 中的参数
        const paramNames = []
        const paramRegex = /\{([^}]+)\}/g
        let paramMatch
        while ((paramMatch = paramRegex.exec(template)) !== null) {
          paramNames.push(paramMatch[1])
        }

        const uriParams = {}
        paramNames.forEach((name, index) => {
          uriParams[name] = match[index + 1]
        })

        this._log('info', `读取资源: ${uri}`, uriParams)

        const content = await resource.handler(uriParams)

        return {
          contents: [
            {
              uri,
              mimeType: resource.mimeType,
              text: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
            }
          ]
        }
      }
    }

    throw new Error(`未知资源 URI: ${uri}`)
  }

  /**
   * 处理 resources/subscribe 请求
   * @param {Object} params - 订阅参数
   * @param {string} params.uri - 资源 URI
   */
  _handleResourceSubscribe (params) {
    const { uri } = params
    this.resourceSubscribers.set(uri, true)
    this._log('info', `已订阅资源更新: ${uri}`)
    return {}
  }

  /**
   * 处理 resources/unsubscribe 请求
   * @param {Object} params - 取消订阅参数
   * @param {string} params.uri - 资源 URI
   */
  _handleResourceUnsubscribe (params) {
    const { uri } = params
    this.resourceSubscribers.delete(uri)
    this._log('info', `已取消订阅资源: ${uri}`)
    return {}
  }

  /**
   * 通知资源变更
   * @param {string} uri - 变更的资源 URI
   * @param {string} message - 变更描述
   */
  notifyResourceChange (uri, message) {
    if (this.resourceSubscribers.has(uri)) {
      this._log('info', `资源变更通知: ${uri} - ${message}`)
      // 在 HTTP 模式下，可以通过 SSE 或 WebSocket 推送通知
      // 在 stdio 模式下，通过 notifications 发送
    }
  }

  // ========================================================================
  // 提示词模板注册与获取
  // ========================================================================

  /**
   * 注册一个提示词模板
   * @param {Object} prompt - 提示词定义
   * @param {string} prompt.name - 提示词名称
   * @param {string} prompt.description - 提示词描述
   * @param {Array} prompt.arguments - 参数定义列表
   * @param {Function} prompt.handler - 提示词生成函数
   */
  registerPrompt (prompt) {
    if (this.prompts.has(prompt.name)) {
      this._log('warn', `提示词 "${prompt.name}" 已存在，将被覆盖`)
    }
    this.prompts.set(prompt.name, {
      name: prompt.name,
      description: prompt.description,
      arguments: prompt.arguments || [],
      handler: prompt.handler
    })
    this._log('info', `注册提示词: ${prompt.name}`)
  }

  /**
   * 处理 prompts/list 请求
   * @returns {Object} 提示词列表
   */
  _handlePromptsList () {
    const prompts = Array.from(this.prompts.values()).map(
      ({ name, description, arguments: args }) => ({
        name,
        description,
        arguments: args
      })
    )
    return { prompts }
  }

  /**
   * 处理 prompts/get 请求
   * @param {Object} params - 获取参数
   * @param {string} params.name - 提示词名称
   * @param {Object} params.arguments - 提示词参数
   * @returns {Object} 提示词内容
   */
  async _handlePromptGet (params) {
    const { name, arguments: args = {} } = params

    const prompt = this.prompts.get(name)
    if (!prompt) {
      throw new Error(`未知提示词: ${name}`)
    }

    const messages = await prompt.handler(args)

    return {
      description: prompt.description,
      messages
    }
  }

  // ========================================================================
  // 数据访问辅助方法
  // ========================================================================

  /**
   * 获取项目数据目录
   * @param {string} projectId - 项目ID
   * @returns {string} 项目数据目录路径
   */
  _getProjectDir (projectId) {
    const dir = join(this.dataDir, 'projects', projectId)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    return dir
  }

  /**
   * 读取 JSON 文件
   * @param {string} filePath - 文件路径
   * @param {*} defaultValue - 文件不存在时的默认值
   * @returns {*} 解析后的数据
   */
  _readJsonFile (filePath, defaultValue = null) {
    try {
      if (!existsSync(filePath)) return defaultValue
      const content = readFileSync(filePath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      this._log('error', `读取文件失败: ${filePath}`, { error: error.message })
      return defaultValue
    }
  }

  /**
   * 写入 JSON 文件
   * @param {string} filePath - 文件路径
   * @param {*} data - 要写入的数据
   */
  _writeJsonFile (filePath, data) {
    try {
      const dir = filePath.substring(0, filePath.lastIndexOf('/'))
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      this._log('error', `写入文件失败: ${filePath}`, { error: error.message })
      throw error
    }
  }

  /**
   * 生成唯一 ID
   * @returns {string} UUID 格式的唯一标识
   */
  _generateId () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // ========================================================================
  // 内置工具注册
  // ========================================================================

  /**
   * 注册所有内置工具
   */
  _registerBuiltinTools () {
    // ------------------------------------------------------------------
    // search_chapters - 搜索章节
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'search_chapters',
      description: '在指定项目中搜索包含关键词的章节，返回匹配的章节列表',
      inputSchema: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: '搜索关键词'
          },
          projectId: {
            type: 'string',
            description: '项目ID'
          }
        },
        required: ['keyword', 'projectId']
      },
      handler: async (args) => {
        const { keyword, projectId } = args
        const projectDir = this._getProjectDir(projectId)
        const chaptersFile = join(projectDir, 'chapters.json')
        const chapters = this._readJsonFile(chaptersFile, [])

        const results = chapters.filter(chapter => {
          const titleMatch = chapter.title && chapter.title.toLowerCase().includes(keyword.toLowerCase())
          const contentMatch = chapter.content && chapter.content.toLowerCase().includes(keyword.toLowerCase())
          const summaryMatch = chapter.summary && chapter.summary.toLowerCase().includes(keyword.toLowerCase())
          return titleMatch || contentMatch || summaryMatch
        }).map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          summary: chapter.summary || '',
          wordCount: chapter.content ? chapter.content.length : 0,
          updatedAt: chapter.updatedAt || chapter.createdAt
        }))

        return {
          keyword,
          projectId,
          totalMatches: results.length,
          chapters: results
        }
      }
    })

    // ------------------------------------------------------------------
    // read_chapter - 读取章节内容
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'read_chapter',
      description: '读取指定章节的完整内容，包括标题、正文、摘要和元数据',
      inputSchema: {
        type: 'object',
        properties: {
          chapterId: {
            type: 'string',
            description: '章节ID'
          }
        },
        required: ['chapterId']
      },
      handler: async (args) => {
        const { chapterId } = args
        // 在所有项目中搜索章节
        const projectsDir = join(this.dataDir, 'projects')
        if (!existsSync(projectsDir)) {
          throw new Error('没有找到任何项目数据')
        }

        const projectDirs = readdirSync(projectsDir, { withFileTypes: true })
          .filter(d => d.isDirectory())

        for (const projectDir of projectDirs) {
          const chaptersFile = join(projectsDir, projectDir.name, 'chapters.json')
          const chapters = this._readJsonFile(chaptersFile, [])
          const chapter = chapters.find(c => c.id === chapterId)

          if (chapter) {
            return {
              id: chapter.id,
              projectId: projectDir.name,
              title: chapter.title,
              content: chapter.content || '',
              summary: chapter.summary || '',
              wordCount: chapter.content ? chapter.content.length : 0,
              status: chapter.status || 'draft',
              tags: chapter.tags || [],
              createdAt: chapter.createdAt,
              updatedAt: chapter.updatedAt
            }
          }
        }

        throw new Error(`未找到章节: ${chapterId}`)
      }
    })

    // ------------------------------------------------------------------
    // create_chapter - 创建章节
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'create_chapter',
      description: '在指定项目中创建新章节',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: '章节标题'
          },
          content: {
            type: 'string',
            description: '章节内容'
          },
          projectId: {
            type: 'string',
            description: '项目ID'
          },
          summary: {
            type: 'string',
            description: '章节摘要（可选）'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: '标签列表（可选）'
          }
        },
        required: ['title', 'projectId']
      },
      handler: async (args) => {
        const { title, content = '', projectId, summary = '', tags = [] } = args
        const projectDir = this._getProjectDir(projectId)
        const chaptersFile = join(projectDir, 'chapters.json')
        const chapters = this._readJsonFile(chaptersFile, [])

        const newChapter = {
          id: this._generateId(),
          title,
          content,
          summary,
          tags,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        chapters.push(newChapter)
        this._writeJsonFile(chaptersFile, chapters)

        this._log('info', `创建章节: ${title}`, { chapterId: newChapter.id })

        return {
          success: true,
          chapter: {
            id: newChapter.id,
            title: newChapter.title,
            wordCount: content.length,
            createdAt: newChapter.createdAt
          }
        }
      }
    })

    // ------------------------------------------------------------------
    // update_chapter - 更新章节
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'update_chapter',
      description: '更新指定章节的内容或元数据',
      inputSchema: {
        type: 'object',
        properties: {
          chapterId: {
            type: 'string',
            description: '章节ID'
          },
          content: {
            type: 'string',
            description: '新的章节内容'
          },
          title: {
            type: 'string',
            description: '新的章节标题（可选）'
          },
          summary: {
            type: 'string',
            description: '新的章节摘要（可选）'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: '新的标签列表（可选）'
          },
          status: {
            type: 'string',
            enum: ['draft', 'revised', 'final'],
            description: '章节状态（可选）'
          }
        },
        required: ['chapterId']
      },
      handler: async (args) => {
        const { chapterId, content, title, summary, tags, status } = args

        // 在所有项目中搜索章节
        const projectsDir = join(this.dataDir, 'projects')
        if (!existsSync(projectsDir)) {
          throw new Error('没有找到任何项目数据')
        }

        const projectDirs = readdirSync(projectsDir, { withFileTypes: true })
          .filter(d => d.isDirectory())

        for (const projectDir of projectDirs) {
          const chaptersFile = join(projectsDir, projectDir.name, 'chapters.json')
          const chapters = this._readJsonFile(chaptersFile, [])
          const chapterIndex = chapters.findIndex(c => c.id === chapterId)

          if (chapterIndex !== -1) {
            const chapter = chapters[chapterIndex]

            // 更新字段
            if (content !== undefined) chapter.content = content
            if (title !== undefined) chapter.title = title
            if (summary !== undefined) chapter.summary = summary
            if (tags !== undefined) chapter.tags = tags
            if (status !== undefined) chapter.status = status
            chapter.updatedAt = new Date().toISOString()

            // 保存修订历史
            if (!chapter.revisions) chapter.revisions = []
            chapter.revisions.push({
              content: content !== undefined ? content : chapter.content,
              updatedAt: chapter.updatedAt,
              wordCount: chapter.content ? chapter.content.length : 0
            })

            // 最多保留 50 个修订版本
            if (chapter.revisions.length > 50) {
              chapter.revisions = chapter.revisions.slice(-50)
            }

            chapters[chapterIndex] = chapter
            this._writeJsonFile(chaptersFile, chapters)

            this._log('info', `更新章节: ${chapter.title}`, { chapterId })

            return {
              success: true,
              chapter: {
                id: chapter.id,
                title: chapter.title,
                wordCount: chapter.content ? chapter.content.length : 0,
                updatedAt: chapter.updatedAt
              }
            }
          }
        }

        throw new Error(`未找到章节: ${chapterId}`)
      }
    })

    // ------------------------------------------------------------------
    // list_characters - 列出角色
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'list_characters',
      description: '列出指定项目中的所有角色',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: '项目ID'
          }
        },
        required: ['projectId']
      },
      handler: async (args) => {
        const { projectId } = args
        const projectDir = this._getProjectDir(projectId)
        const charactersFile = join(projectDir, 'characters.json')
        const characters = this._readJsonFile(charactersFile, [])

        return {
          projectId,
          totalCharacters: characters.length,
          characters: characters.map(c => ({
            id: c.id,
            name: c.name,
            role: c.role || 'supporting',
            description: c.description || '',
            firstAppearance: c.firstAppearance || ''
          }))
        }
      }
    })

    // ------------------------------------------------------------------
    // read_character - 读取角色详情
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'read_character',
      description: '读取指定角色的详细信息，包括性格、背景、关系等',
      inputSchema: {
        type: 'object',
        properties: {
          characterId: {
            type: 'string',
            description: '角色ID'
          }
        },
        required: ['characterId']
      },
      handler: async (args) => {
        const { characterId } = args
        const projectsDir = join(this.dataDir, 'projects')
        if (!existsSync(projectsDir)) {
          throw new Error('没有找到任何项目数据')
        }

        const projectDirs = readdirSync(projectsDir, { withFileTypes: true })
          .filter(d => d.isDirectory())

        for (const projectDir of projectDirs) {
          const charactersFile = join(projectsDir, projectDir.name, 'characters.json')
          const characters = this._readJsonFile(charactersFile, [])
          const character = characters.find(c => c.id === characterId)

          if (character) {
            return {
              id: character.id,
              name: character.name,
              role: character.role || 'supporting',
              description: character.description || '',
              personality: character.personality || '',
              background: character.background || '',
              appearance: character.appearance || '',
              relationships: character.relationships || [],
              notes: character.notes || '',
              createdAt: character.createdAt,
              updatedAt: character.updatedAt
            }
          }
        }

        throw new Error(`未找到角色: ${characterId}`)
      }
    })

    // ------------------------------------------------------------------
    // get_project_stats - 获取项目统计
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'get_project_stats',
      description: '获取项目的统计数据，包括章节数、总字数、角色数等',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: '项目ID'
          }
        },
        required: ['projectId']
      },
      handler: async (args) => {
        const { projectId } = args
        const projectDir = this._getProjectDir(projectId)

        // 读取项目信息
        const projectFile = join(projectDir, 'project.json')
        const project = this._readJsonFile(projectFile, {})

        // 读取章节
        const chaptersFile = join(projectDir, 'chapters.json')
        const chapters = this._readJsonFile(chaptersFile, [])

        // 读取角色
        const charactersFile = join(projectDir, 'characters.json')
        const characters = this._readJsonFile(charactersFile, [])

        // 读取伏笔
        const foreshadowingsFile = join(projectDir, 'foreshadowings.json')
        const foreshadowings = this._readJsonFile(foreshadowingsFile, [])

        // 计算统计数据
        const totalWordCount = chapters.reduce((sum, ch) => {
          return sum + (ch.content ? ch.content.length : 0)
        }, 0)

        const chapterStats = {
          total: chapters.length,
          draft: chapters.filter(c => c.status === 'draft').length,
          revised: chapters.filter(c => c.status === 'revised').length,
          final: chapters.filter(c => c.status === 'final').length
        }

        const foreshadowingStats = {
          total: foreshadowings.length,
          pending: foreshadowings.filter(f => f.status === 'pending').length,
          resolved: foreshadowings.filter(f => f.status === 'resolved').length,
          abandoned: foreshadowings.filter(f => f.status === 'abandoned').length
        }

        return {
          projectId,
          projectName: project.name || '未命名项目',
          genre: project.genre || '',
          totalWordCount,
          chapterStats,
          totalCharacters: characters.length,
          mainCharacters: characters.filter(c => c.role === 'protagonist' || c.role === 'antagonist').length,
          foreshadowingStats,
          createdAt: project.createdAt,
          lastUpdatedAt: project.updatedAt || chapters.reduce((latest, ch) => {
            if (!latest) return ch.updatedAt
            return ch.updatedAt > latest ? ch.updatedAt : latest
          }, null)
        }
      }
    })

    // ------------------------------------------------------------------
    // search_foreshadowings - 搜索伏笔
    // ------------------------------------------------------------------
    this.registerTool({
      name: 'search_foreshadowings',
      description: '搜索项目中的伏笔，可按状态筛选',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: '项目ID'
          },
          status: {
            type: 'string',
            enum: ['pending', 'resolved', 'abandoned', 'all'],
            description: '伏笔状态筛选（默认为 all）'
          },
          keyword: {
            type: 'string',
            description: '关键词搜索（可选）'
          }
        },
        required: ['projectId']
      },
      handler: async (args) => {
        const { projectId, status = 'all', keyword } = args
        const projectDir = this._getProjectDir(projectId)
        const foreshadowingsFile = join(projectDir, 'foreshadowings.json')
        const foreshadowings = this._readJsonFile(foreshadowingsFile, [])

        let results = foreshadowings

        // 按状态筛选
        if (status !== 'all') {
          results = results.filter(f => f.status === status)
        }

        // 按关键词筛选
        if (keyword) {
          const kw = keyword.toLowerCase()
          results = results.filter(f =>
            (f.title && f.title.toLowerCase().includes(kw)) ||
            (f.description && f.description.toLowerCase().includes(kw)) ||
            (f.hint && f.hint.toLowerCase().includes(kw))
          )
        }

        return {
          projectId,
          status,
          totalMatches: results.length,
          foreshadowings: results.map(f => ({
            id: f.id,
            title: f.title || '',
            description: f.description || '',
            hint: f.hint || '',
            status: f.status,
            chapterId: f.chapterId || '',
            createdAt: f.createdAt,
            resolvedAt: f.resolvedAt
          }))
        }
      }
    })
  }

  // ========================================================================
  // 内置资源注册
  // ========================================================================

  /**
   * 注册所有内置资源
   */
  _registerBuiltinResources () {
    // 项目概览资源
    this.registerResource({
      uriTemplate: 'yunshu://projects/{projectId}',
      name: '项目概览',
      description: '获取项目的整体概览信息',
      mimeType: 'application/json',
      handler: async (params) => {
        const { projectId } = params
        const projectDir = this._getProjectDir(projectId)
        const projectFile = join(projectDir, 'project.json')
        return this._readJsonFile(projectFile, { error: '项目未找到' })
      }
    })

    // 章节内容资源
    this.registerResource({
      uriTemplate: 'yunshu://projects/{projectId}/chapters/{chapterId}',
      name: '章节内容',
      description: '获取指定章节的完整内容',
      mimeType: 'text/markdown',
      handler: async (params) => {
        const { projectId, chapterId } = params
        const projectDir = this._getProjectDir(projectId)
        const chaptersFile = join(projectDir, 'chapters.json')
        const chapters = this._readJsonFile(chaptersFile, [])
        const chapter = chapters.find(c => c.id === chapterId)
        if (!chapter) {
          throw new Error(`未找到章节: ${chapterId}`)
        }
        return `# ${chapter.title}\n\n${chapter.content || ''}`
      }
    })

    // 角色资料资源
    this.registerResource({
      uriTemplate: 'yunshu://projects/{projectId}/characters/{characterId}',
      name: '角色资料',
      description: '获取指定角色的详细资料',
      mimeType: 'application/json',
      handler: async (params) => {
        const { projectId, characterId } = params
        const projectDir = this._getProjectDir(projectId)
        const charactersFile = join(projectDir, 'characters.json')
        const characters = this._readJsonFile(charactersFile, [])
        const character = characters.find(c => c.id === characterId)
        if (!character) {
          throw new Error(`未找到角色: ${characterId}`)
        }
        return character
      }
    })

    // 项目章节列表资源
    this.registerResource({
      uriTemplate: 'yunshu://projects/{projectId}/chapters',
      name: '章节列表',
      description: '获取项目中所有章节的列表',
      mimeType: 'application/json',
      handler: async (params) => {
        const { projectId } = params
        const projectDir = this._getProjectDir(projectId)
        const chaptersFile = join(projectDir, 'chapters.json')
        const chapters = this._readJsonFile(chaptersFile, [])
        return chapters.map(c => ({
          id: c.id,
          title: c.title,
          summary: c.summary || '',
          wordCount: c.content ? c.content.length : 0,
          status: c.status || 'draft'
        }))
      }
    })

    // 项目角色列表资源
    this.registerResource({
      uriTemplate: 'yunshu://projects/{projectId}/characters',
      name: '角色列表',
      description: '获取项目中所有角色的列表',
      mimeType: 'application/json',
      handler: async (params) => {
        const { projectId } = params
        const projectDir = this._getProjectDir(projectId)
        const charactersFile = join(projectDir, 'characters.json')
        const characters = this._readJsonFile(charactersFile, [])
        return characters.map(c => ({
          id: c.id,
          name: c.name,
          role: c.role || 'supporting',
          description: c.description || ''
        }))
      }
    })
  }

  // ========================================================================
  // 内置提示词模板注册
  // ========================================================================

  /**
   * 注册所有内置提示词模板
   */
  _registerBuiltinPrompts () {
    // 章节续写提示词
    this.registerPrompt({
      name: 'continue_chapter',
      description: '根据已有章节内容，生成续写建议',
      arguments: [
        {
          name: 'chapterId',
          description: '章节ID',
          required: true
        },
        {
          name: 'style',
          description: '写作风格（如：悬疑、轻松、严肃）',
          required: false
        },
        {
          name: 'wordCount',
          description: '续写字数目标',
          required: false
        }
      ],
      handler: async (args) => {
        const { chapterId, style = '保持原文风格', wordCount = 500 } = args

        return [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请根据以下章节内容，以${style}的风格续写约${wordCount}字。\n\n章节ID: ${chapterId}\n\n请先使用 read_chapter 工具读取章节内容，然后基于内容进行续写。续写应保持人物性格一致、情节连贯、文风统一。`
            }
          }
        ]
      }
    })

    // 角色分析提示词
    this.registerPrompt({
      name: 'analyze_character',
      description: '对指定角色进行深度分析',
      arguments: [
        {
          name: 'characterId',
          description: '角色ID',
          required: true
        }
      ],
      handler: async (args) => {
        const { characterId } = args

        return [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请对以下角色进行深度分析：\n\n角色ID: ${characterId}\n\n请先使用 read_character 工具读取角色详情，然后从以下维度进行分析：\n1. 角色性格特征与动机\n2. 角色在故事中的作用\n3. 角色成长弧线\n4. 角色关系网络\n5. 改进建议`
            }
          }
        ]
      }
    })

    // 伏笔检查提示词
    this.registerPrompt({
      name: 'check_foreshadowings',
      description: '检查项目中的伏笔状态，提供处理建议',
      arguments: [
        {
          name: 'projectId',
          description: '项目ID',
          required: true
        }
      ],
      handler: async (args) => {
        const { projectId } = args

        return [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请检查项目中的伏笔状态：\n\n项目ID: ${projectId}\n\n请先使用 search_foreshadowings 工具搜索所有伏笔，然后：\n1. 列出所有未解决的伏笔\n2. 分析哪些伏笔可能已被遗忘\n3. 为每个未解决伏笔提供处理建议\n4. 检查是否有伏笔与当前情节矛盾`
            }
          }
        ]
      }
    })

    // 大纲生成提示词
    this.registerPrompt({
      name: 'generate_outline',
      description: '根据项目信息生成故事大纲',
      arguments: [
        {
          name: 'projectId',
          description: '项目ID',
          required: true
        },
        {
          name: 'type',
          description: '大纲类型（chapter/arc/full）',
          required: false
        }
      ],
      handler: async (args) => {
        const { projectId, type = 'chapter' } = args

        const typeDesc = {
          chapter: '下一章节的详细大纲',
          arc: '当前故事弧的大纲',
          full: '完整的故事大纲'
        }

        return [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请为项目生成${typeDesc[type] || typeDesc.chapter}：\n\n项目ID: ${projectId}\n\n请先使用 get_project_stats 获取项目概况，然后使用 list_characters 了解角色，最后使用 search_chapters 搜索已有章节内容。基于以上信息生成结构清晰、逻辑严密的大纲。`
            }
          }
        ]
      }
    })
  }

  // ========================================================================
  // stdio 模式 - 标准输入输出通信
  // ========================================================================

  /**
   * 启动 stdio 模式
   * 通过标准输入读取 JSON-RPC 请求，通过标准输出返回响应
   */
  startStdioMode () {
    this._log('info', '启动 stdio 模式')

    let buffer = ''

    process.stdin.setEncoding('utf-8')

    process.stdin.on('data', async (chunk) => {
      buffer += chunk

      // 按行分割处理（每行一个 JSON-RPC 消息）
      const lines = buffer.split('\n')
      buffer = lines.pop() // 保留不完整的行

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        try {
          const request = JSON.parse(trimmed)
          const response = await this.handleRequest(request)

          // 通知类型的请求不需要响应
          if (response !== null) {
            process.stdout.write(JSON.stringify(response) + '\n')
          }
        } catch (error) {
          this._log('error', '解析请求失败', { error: error.message, line: trimmed })
          const errorResponse = {
            jsonrpc: JSONRPC_VERSION,
            error: {
              code: -32700,
              message: `Parse error: ${error.message}`
            },
            id: null
          }
          process.stdout.write(JSON.stringify(errorResponse) + '\n')
        }
      }
    })

    process.stdin.on('end', () => {
      this._log('info', 'stdio 输入流结束')
    })

    process.stdin.on('error', (error) => {
      this._log('error', 'stdio 输入流错误', { error: error.message })
    })
  }

  // ========================================================================
  // HTTP 模式 - 本地 HTTP 服务器
  // ========================================================================

  /**
   * 启动 HTTP 服务器模式
   * @param {number} [port=19840] - 监听端口
   * @returns {Promise<void>}
   */
  startHttpMode (port = 19840) {
    return new Promise((resolve, reject) => {
      this.httpServer = createServer(async (req, res) => {
        await this._handleHttpRequest(req, res)
      })

      this.httpServer.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          this._log('error', `端口 ${port} 已被占用`, { error: error.message })
          reject(new Error(`端口 ${port} 已被占用`))
        } else {
          reject(error)
        }
      })

      this.httpServer.listen(port, () => {
        this._log('info', `HTTP 服务器已启动，监听端口: ${port}`)
        this._log('info', `访问地址: http://localhost:${port}`)
        this._log('info', `API 端点: http://localhost:${port}/mcp`)
        resolve()
      })
    })
  }

  /**
   * 处理 HTTP 请求
   * @param {IncomingMessage} req - HTTP 请求
   * @param {ServerResponse} res - HTTP 响应
   */
  async _handleHttpRequest (req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Content-Type', 'application/json')

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    // 根路径 - 服务器信息
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200)
      res.end(JSON.stringify({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        protocol: MCP_VERSION,
        endpoints: {
          mcp: '/mcp',
          tools: '/mcp/tools',
          resources: '/mcp/resources',
          prompts: '/mcp/prompts',
          health: '/health'
        }
      }, null, 2))
      return
    }

    // 健康检查
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200)
      res.end(JSON.stringify({
        status: 'ok',
        initialized: this.initialized,
        uptime: process.uptime(),
        toolsCount: this.tools.size,
        resourcesCount: this.resources.size,
        promptsCount: this.prompts.size
      }))
      return
    }

    // MCP 端点 - POST 请求
    if (req.method === 'POST' && req.url === '/mcp') {
      try {
        const body = await this._readRequestBody(req)
        const request = JSON.parse(body)
        const response = await this.handleRequest(request)

        if (response !== null) {
          res.writeHead(200)
          res.end(JSON.stringify(response))
        } else {
          res.writeHead(202) // Accepted (for notifications)
          res.end()
        }
      } catch (error) {
        res.writeHead(400)
        res.end(JSON.stringify({
          jsonrpc: JSONRPC_VERSION,
          error: {
            code: -32700,
            message: error.message
          },
          id: null
        }))
      }
      return
    }

    // 工具列表 GET 端点
    if (req.method === 'GET' && req.url === '/mcp/tools') {
      const result = this._handleToolsList()
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    // 资源列表 GET 端点
    if (req.method === 'GET' && req.url === '/mcp/resources') {
      const result = this._handleResourcesList()
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    // 提示词列表 GET 端点
    if (req.method === 'GET' && req.url === '/mcp/prompts') {
      const result = this._handlePromptsList()
      res.writeHead(200)
      res.end(JSON.stringify(result))
      return
    }

    // 404
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'Not Found' }))
  }

  /**
   * 读取 HTTP 请求体
   * @param {IncomingMessage} req - HTTP 请求
   * @returns {Promise<string>} 请求体字符串
   */
  _readRequestBody (req) {
    return new Promise((resolve, reject) => {
      let body = ''
      req.on('data', (chunk) => { body += chunk })
      req.on('end', () => resolve(body))
      req.on('error', reject)
    })
  }

  /**
   * 停止 HTTP 服务器
   * @returns {Promise<void>}
   */
  stopHttpMode () {
    return new Promise((resolve) => {
      if (this.httpServer) {
        this.httpServer.close(() => {
          this._log('info', 'HTTP 服务器已停止')
          this.httpServer = null
          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}

// ============================================================================
// 导出
// ============================================================================

export default MCPServer

/**
 * 便捷函数：创建并启动 MCP 服务器
 * 
 * 使用方式：
 * 
 * // stdio 模式（用于 Claude Desktop 集成）
 * import { createMCPServer } from './mcpServer.js'
 * const server = createMCPServer()
 * server.startStdioMode()
 * 
 * // HTTP 模式（用于本地开发调试）
 * import { createMCPServer } from './mcpServer.js'
 * const server = createMCPServer()
 * await server.startHttpMode(19840)
 * 
 * @param {Object} [options] - 配置选项
 * @param {string} [options.dataDir] - 数据目录路径
 * @param {Function} [options.onLog] - 日志回调
 * @returns {MCPServer} MCP 服务器实例
 */
export function createMCPServer (options = {}) {
  const server = new MCPServer()

  if (options.dataDir) {
    server.dataDir = options.dataDir
  }

  if (options.onLog) {
    server.onLog = options.onLog
  }

  return server
}

/**
 * 当作为独立脚本运行时，自动启动服务器
 * 
 * 使用方式：
 *   # stdio 模式（默认）
 *   node mcpServer.js
 * 
 *   # HTTP 模式
 *   node mcpServer.js --http
 *   node mcpServer.js --http --port 3000
 */
export async function main () {
  const args = process.argv.slice(2)
  const httpMode = args.includes('--http')
  const portArg = args.find(a => a.startsWith('--port='))
  const port = portArg ? parseInt(portArg.split('=')[1]) : 19840

  const server = createMCPServer()

  if (httpMode) {
    try {
      await server.startHttpMode(port)
      console.error(`[云书 MCP] HTTP 服务器已启动: http://localhost:${port}`)
      console.error(`[云书 MCP] 按 Ctrl+C 停止服务器`)
    } catch (error) {
      console.error(`[云书 MCP] 启动失败: ${error.message}`)
      process.exit(1)
    }
  } else {
    server.startStdioMode()
  }
}

// 当直接运行此文件时，自动启动
// 检测是否作为主模块运行（ES Module 中使用 import.meta）
const isMainModule = (() => {
  try {
    // 在 ES Module 中，无法直接判断是否为主模块
    // 通过检查 process.argv 和模块路径来近似判断
    return process.argv[1] && process.argv[1].endsWith('mcpServer.js')
  } catch {
    return false
  }
})()

if (isMainModule) {
  main().catch(error => {
    console.error('[云书 MCP] 启动失败:', error)
    process.exit(1)
  })
}

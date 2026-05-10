/**
 * 云书 - 多模型 AI 提供商抽象层
 * 统一管理 OpenAI、DeepSeek、Claude、Gemini、ChatGLM 等多个 AI 模型提供商
 * 提供 API 预设系统、模型自动发现、统一错误处理和重试机制、流式响应统一接口
 */

// ==================== AI 模型提供商接口定义 ====================

/**
 * AIModelProvider 接口
 * 所有 AI 提供商必须实现此接口
 *
 * @interface AIModelProvider
 * @property {string} id - 提供商唯一标识
 * @property {string} name - 提供商显示名称
 * @property {string} description - 提供商描述
 * @property {string} baseUrl - API 基础地址
 * @property {string[]} availableModels - 可用模型列表
 * @property {boolean} supportsStream - 是否支持流式响应
 * @property {boolean} supportsVision - 是否支持视觉输入
 * @property {Function} chat - 发送聊天请求
 * @property {Function} chatStream - 发送流式聊天请求
 * @property {Function} listModels - 列出可用模型
 * @property {Function} validateConfig - 验证配置是否有效
 */

// ==================== OpenAI 提供商 ====================

/**
 * OpenAIProvider 实现
 * 支持 OpenAI 官方 API 及兼容接口（如 Azure OpenAI、各种代理）
 */
class OpenAIProvider {
  constructor() {
    this.id = 'openai'
    this.name = 'OpenAI'
    this.description = 'OpenAI GPT 系列模型，包括 GPT-4o、GPT-4、GPT-3.5 等'
    this.baseUrl = 'https://api.openai.com/v1'
    this.availableModels = [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'o1-preview',
      'o1-mini'
    ]
    this.supportsStream = true
    this.supportsVision = true
  }

  /**
   * 发送聊天请求
   * @param {object} config - 配置
   * @param {string} config.apiKey - API 密钥
   * @param {string} config.baseUrl - 自定义基础地址
   * @param {string} config.model - 模型名称
   * @param {Array} config.messages - 消息数组
   * @param {number} [config.maxTokens] - 最大 token 数
   * @param {number} [config.temperature] - 温度
   * @returns {Promise<{content: string, usage: object}>}
   */
  async chat(config) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const url = `${baseUrl || this.baseUrl}/chat/completions`

    const response = await this._makeRequest(url, apiKey, {
      model,
      messages,
      max_tokens: maxTokens,
      temperature
    })

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage || null
    }
  }

  /**
   * 发送流式聊天请求
   * @param {object} config - 配置
   * @param {string} config.apiKey
   * @param {string} config.baseUrl
   * @param {string} config.model
   * @param {Array} config.messages
   * @param {number} [config.maxTokens]
   * @param {number} [config.temperature]
   * @param {Function} onChunk - 流式回调 (chunk: string, fullContent: string) => void
   * @returns {Promise<string>} 完整内容
   */
  async chatStream(config, onChunk) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const url = `${baseUrl || this.baseUrl}/chat/completions`

    return this._makeStreamRequest(url, apiKey, {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: true
    }, onChunk)
  }

  /**
   * 列出可用模型
   * @param {string} apiKey
   * @param {string} [baseUrl]
   * @returns {Promise<string[]>}
   */
  async listModels(apiKey, baseUrl) {
    const url = `${baseUrl || this.baseUrl}/models`
    const response = await this._makeRawRequest(url, apiKey, 'GET')
    const models = response.data || []
    return models.map(m => m.id).sort()
  }

  /**
   * 验证 API 配置
   * @param {string} apiKey
   * @param {string} [baseUrl]
   * @returns {Promise<boolean>}
   */
  async validateConfig(apiKey, baseUrl) {
    try {
      await this.listModels(apiKey, baseUrl)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 发送普通请求
   * @private
   */
  async _makeRequest(url, apiKey, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `OpenAI API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`
      )
    }

    return response.json()
  }

  /**
   * 发送原始请求（用于 listModels 等）
   * @private
   */
  async _makeRawRequest(url, apiKey, method = 'GET') {
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`OpenAI API 错误 (${response.status}): ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * 发送流式请求
   * @private
   */
  async _makeStreamRequest(url, apiKey, body, onChunk) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300000) // 5分钟超时
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API 错误 (${response.status}): ${errorText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6).trim()
          if (data === '[DONE]') return fullContent

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ''
            if (content) {
              fullContent += content
              if (onChunk) onChunk(content, fullContent)
            }
          } catch (e) {
            // 忽略解析错误，继续处理下一行
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return fullContent
  }
}

// ==================== DeepSeek 提供商 ====================

/**
 * DeepSeekProvider 实现
 * DeepSeek API 兼容 OpenAI 格式，但有自己的模型和特性
 */
class DeepSeekProvider {
  constructor() {
    this.id = 'deepseek'
    this.name = 'DeepSeek'
    this.description = 'DeepSeek 系列模型，包括 DeepSeek-V3、DeepSeek-R1 等'
    this.baseUrl = 'https://api.deepseek.com/v1'
    this.availableModels = [
      'deepseek-chat',
      'deepseek-reasoner'
    ]
    this.supportsStream = true
    this.supportsVision = false
  }

  async chat(config) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const url = `${baseUrl || this.baseUrl}/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `DeepSeek API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage || null
    }
  }

  async chatStream(config, onChunk) {
    // DeepSeek 流式格式与 OpenAI 兼容，复用 OpenAI 的流式解析逻辑
    const openaiProvider = new OpenAIProvider()
    return openaiProvider._makeStreamRequest(
      `${config.baseUrl || this.baseUrl}/chat/completions`,
      config.apiKey,
      {
        model: config.model,
        messages: config.messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true
      },
      onChunk
    )
  }

  async listModels(apiKey, baseUrl) {
    // DeepSeek 暂不支持模型列表 API，返回预设列表
    return [...this.availableModels]
  }

  async validateConfig(apiKey, baseUrl) {
    try {
      const result = await this.chat({
        apiKey,
        baseUrl,
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'hi' }],
        maxTokens: 5,
        temperature: 0
      })
      return !!result.content
    } catch (error) {
      return false
    }
  }
}

// ==================== Claude 提供商 ====================

/**
 * ClaudeProvider 实现
 * Anthropic Claude 系列模型，使用 Messages API
 */
class ClaudeProvider {
  constructor() {
    this.id = 'claude'
    this.name = 'Claude'
    this.description = 'Anthropic Claude 系列模型，包括 Claude 4、Claude 3.5 等'
    this.baseUrl = 'https://api.anthropic.com/v1'
    this.availableModels = [
      'claude-sonnet-4-20250514',
      'claude-opus-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ]
    this.supportsStream = true
    this.supportsVision = true
    this._apiVersion = '2023-06-01'
  }

  /**
   * 将通用消息格式转换为 Claude 格式
   * @param {Array} messages - 通用消息数组
   * @returns {{system: string, messages: Array}}
   * @private
   */
  _convertMessages(messages) {
    let system = ''
    const claudeMessages = []

    for (const msg of messages) {
      if (msg.role === 'system') {
        system += (system ? '\n' : '') + msg.content
      } else {
        claudeMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })
      }
    }

    return { system, messages: claudeMessages }
  }

  async chat(config) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const url = `${baseUrl || this.baseUrl}/messages`
    const { system, messages: claudeMessages } = this._convertMessages(messages)

    const body = {
      model,
      messages: claudeMessages,
      max_tokens: maxTokens || 4096,
      temperature: temperature || 0.7
    }
    if (system) body.system = system

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': this._apiVersion
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Claude API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()
    return {
      content: data.content?.[0]?.text || '',
      usage: {
        input_tokens: data.usage?.input_tokens || 0,
        output_tokens: data.usage?.output_tokens || 0
      }
    }
  }

  async chatStream(config, onChunk) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const url = `${baseUrl || this.baseUrl}/messages`
    const { system, messages: claudeMessages } = this._convertMessages(messages)

    const body = {
      model,
      messages: claudeMessages,
      max_tokens: maxTokens || 4096,
      temperature: temperature || 0.7,
      stream: true
    }
    if (system) body.system = system

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': this._apiVersion
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300000)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Claude API 错误 (${response.status}): ${errorText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text || ''
              if (text) {
                fullContent += text
                if (onChunk) onChunk(text, fullContent)
              }
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return fullContent
  }

  async listModels(apiKey, baseUrl) {
    // Claude 暂不支持模型列表 API
    return [...this.availableModels]
  }

  async validateConfig(apiKey, baseUrl) {
    try {
      const result = await this.chat({
        apiKey,
        baseUrl,
        model: 'claude-3-haiku-20240307',
        messages: [{ role: 'user', content: 'hi' }],
        maxTokens: 5,
        temperature: 0
      })
      return !!result.content
    } catch (error) {
      return false
    }
  }
}

// ==================== Gemini 提供商 ====================

/**
 * GeminiProvider 实现
 * Google Gemini 系列模型，使用 generateContent API
 */
class GeminiProvider {
  constructor() {
    this.id = 'gemini'
    this.name = 'Gemini'
    this.description = 'Google Gemini 系列模型，包括 Gemini 2.5、Gemini 2.0 等'
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
    this.availableModels = [
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ]
    this.supportsStream = true
    this.supportsVision = true
  }

  /**
   * 将通用消息格式转换为 Gemini 格式
   * @param {Array} messages
   * @returns {Array}
   * @private
   */
  _convertMessages(messages) {
    const contents = []
    let systemInstruction = null

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })
      }
    }

    return { contents, systemInstruction }
  }

  async chat(config) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const { contents, systemInstruction } = this._convertMessages(messages)

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature || 0.7
      }
    }
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] }
    }

    const url = `${baseUrl || this.baseUrl}/models/${model}:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Gemini API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      content: text,
      usage: {
        input_tokens: data.usageMetadata?.promptTokenCount || 0,
        output_tokens: data.usageMetadata?.candidatesTokenCount || 0
      }
    }
  }

  async chatStream(config, onChunk) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const { contents, systemInstruction } = this._convertMessages(messages)

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature || 0.7
      }
    }
    if (systemInstruction) {
      body.systemInstruction = { parts: [{ text: systemInstruction }] }
    }

    const url = `${baseUrl || this.baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300000)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API 错误 (${response.status}): ${errorText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6).trim()
          try {
            const parsed = JSON.parse(data)
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
            if (text) {
              fullContent += text
              if (onChunk) onChunk(text, fullContent)
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return fullContent
  }

  async listModels(apiKey, baseUrl) {
    const url = `${baseUrl || this.baseUrl}/models?key=${apiKey}`
    try {
      const response = await fetch(url)
      if (!response.ok) return [...this.availableModels]
      const data = await response.json()
      const models = (data.models || [])
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace('models/', ''))
        .sort()
      return models.length > 0 ? models : [...this.availableModels]
    } catch (error) {
      return [...this.availableModels]
    }
  }

  async validateConfig(apiKey, baseUrl) {
    try {
      const models = await this.listModels(apiKey, baseUrl)
      return models.length > 0
    } catch (error) {
      return false
    }
  }
}

// ==================== ChatGLM 提供商 ====================

/**
 * ChatGLMProvider 实现
 * 智谱 AI GLM 系列模型，兼容 OpenAI 格式
 */
class ChatGLMProvider {
  constructor() {
    this.id = 'chatglm'
    this.name = 'ChatGLM'
    this.description = '智谱 AI GLM 系列模型，包括 GLM-4、GLM-3 等'
    this.baseUrl = 'https://open.bigmodel.cn/api/paas/v4'
    this.availableModels = [
      'glm-4-plus',
      'glm-4-0520',
      'glm-4',
      'glm-4-air',
      'glm-4-airx',
      'glm-4-long',
      'glm-4-flash',
      'glm-4-flashx',
      'glm-3-turbo'
    ]
    this.supportsStream = true
    this.supportsVision = false
  }

  async chat(config) {
    const { apiKey, baseUrl, model, messages, maxTokens, temperature } = config
    const url = `${baseUrl || this.baseUrl}/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `ChatGLM API 错误 (${response.status}): ${errorData.error?.message || response.statusText}`
      )
    }

    const data = await response.json()
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage || null
    }
  }

  async chatStream(config, onChunk) {
    // ChatGLM 兼容 OpenAI 流式格式
    const openaiProvider = new OpenAIProvider()
    return openaiProvider._makeStreamRequest(
      `${config.baseUrl || this.baseUrl}/chat/completions`,
      config.apiKey,
      {
        model: config.model,
        messages: config.messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: true
      },
      onChunk
    )
  }

  async listModels(apiKey, baseUrl) {
    // ChatGLM 暂不支持模型列表 API
    return [...this.availableModels]
  }

  async validateConfig(apiKey, baseUrl) {
    try {
      const result = await this.chat({
        apiKey,
        baseUrl,
        model: 'glm-4-flash',
        messages: [{ role: 'user', content: 'hi' }],
        maxTokens: 5,
        temperature: 0
      })
      return !!result.content
    } catch (error) {
      return false
    }
  }
}

// ==================== API 预设系统 ====================

/**
 * API 预设配置
 * 不同任务使用不同的模型，以获得最佳效果和性价比
 */
const API_PRESETS = {
  // 大纲生成：需要较强的推理能力
  outline: {
    label: '大纲生成',
    description: '生成小说大纲，需要强推理能力',
    recommendedModels: ['deepseek-chat', 'gpt-4o', 'claude-sonnet-4-20250514', 'glm-4-plus'],
    defaultModel: 'deepseek-chat',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096
  },

  // 章节生成：需要较强的创作能力
  chapter: {
    label: '章节生成',
    description: '生成章节内容，需要强创作能力',
    recommendedModels: ['deepseek-chat', 'gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.5-flash-preview-05-20'],
    defaultModel: 'deepseek-chat',
    defaultTemperature: 0.8,
    defaultMaxTokens: 8192
  },

  // 文本分析：需要准确的分析能力
  analysis: {
    label: '文本分析',
    description: '分析文本内容、情感、结构',
    recommendedModels: ['gpt-4o-mini', 'deepseek-chat', 'glm-4-air', 'gemini-2.0-flash'],
    defaultModel: 'gpt-4o-mini',
    defaultTemperature: 0.3,
    defaultMaxTokens: 2048
  },

  // 角色生成：需要创造力
  character: {
    label: '角色生成',
    description: '生成角色设定和描述',
    recommendedModels: ['gpt-4o', 'deepseek-chat', 'claude-sonnet-4-20250514'],
    defaultModel: 'gpt-4o',
    defaultTemperature: 0.8,
    defaultMaxTokens: 4096
  },

  // 对话/问答：需要快速响应
  chat: {
    label: '对话问答',
    description: 'AI 写作助手对话',
    recommendedModels: ['gpt-4o-mini', 'deepseek-chat', 'glm-4-flash', 'gemini-2.0-flash-lite'],
    defaultModel: 'gpt-4o-mini',
    defaultTemperature: 0.7,
    defaultMaxTokens: 2048
  },

  // 润色/精修：需要高质量的文本处理能力
  polish: {
    label: '润色精修',
    description: '文本润色和精修',
    recommendedModels: ['claude-sonnet-4-20250514', 'gpt-4o', 'deepseek-chat'],
    defaultModel: 'claude-sonnet-4-20250514',
    defaultTemperature: 0.5,
    defaultMaxTokens: 8192
  },

  // 翻译：需要准确的语言理解
  translation: {
    label: '翻译',
    description: '文本翻译',
    recommendedModels: ['gpt-4o-mini', 'deepseek-chat', 'gemini-2.0-flash'],
    defaultModel: 'gpt-4o-mini',
    defaultTemperature: 0.3,
    defaultMaxTokens: 4096
  },

  // 通用：默认配置
  general: {
    label: '通用',
    description: '通用任务',
    recommendedModels: ['gpt-4o', 'deepseek-chat', 'claude-sonnet-4-20250514', 'glm-4-plus'],
    defaultModel: 'gpt-4o',
    defaultTemperature: 0.7,
    defaultMaxTokens: 4096
  }
}

// ==================== 模型自动发现 ====================

/**
 * 根据 baseURL 猜测可用的提供商和模型
 * @param {string} baseUrl - API 基础地址
 * @returns {Array<{providerId: string, providerName: string, confidence: number}>}
 */
function discoverProvider(baseUrl) {
  const url = baseUrl.toLowerCase()

  const discoveries = []

  // OpenAI
  if (url.includes('openai.com') || url.includes('/v1/chat/completions')) {
    discoveries.push({ providerId: 'openai', providerName: 'OpenAI', confidence: 0.95 })
  }

  // DeepSeek
  if (url.includes('deepseek.com') || url.includes('deepseek')) {
    discoveries.push({ providerId: 'deepseek', providerName: 'DeepSeek', confidence: 0.95 })
  }

  // Claude / Anthropic
  if (url.includes('anthropic.com') || url.includes('claude')) {
    discoveries.push({ providerId: 'claude', providerName: 'Claude', confidence: 0.95 })
  }

  // Gemini / Google
  if (url.includes('generativelanguage.googleapis.com') || url.includes('gemini')) {
    discoveries.push({ providerId: 'gemini', providerName: 'Gemini', confidence: 0.95 })
  }

  // ChatGLM / 智谱
  if (url.includes('bigmodel.cn') || url.includes('chatglm') || url.includes('glm')) {
    discoveries.push({ providerId: 'chatglm', providerName: 'ChatGLM', confidence: 0.95 })
  }

  // 通用 OpenAI 兼容接口（以 /v1 结尾）
  if (url.endsWith('/v1') && discoveries.length === 0) {
    discoveries.push({ providerId: 'openai', providerName: 'OpenAI 兼容', confidence: 0.6 })
  }

  // 如果都没有匹配到，默认为 OpenAI 兼容
  if (discoveries.length === 0) {
    discoveries.push({ providerId: 'openai', providerName: 'OpenAI 兼容（未知）', confidence: 0.3 })
  }

  // 按置信度排序
  discoveries.sort((a, b) => b.confidence - a.confidence)
  return discoveries
}

// ==================== 统一错误处理和重试机制 ====================

/**
 * 带重试的请求包装器
 * @param {Function} requestFn - 请求函数
 * @param {object} [options] - 重试选项
 * @param {number} [options.maxRetries=3] - 最大重试次数
 * @param {number} [options.baseDelay=1000] - 基础延迟（毫秒）
 * @param {number} [options.maxDelay=30000] - 最大延迟
 * @param {Function} [options.onRetry] - 重试回调 (attempt: number, error: Error) => void
 * @returns {Promise<*>}
 */
async function withRetry(requestFn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    onRetry = null
  } = options

  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error

      // 不重试的错误类型
      if (isNonRetryableError(error)) {
        throw error
      }

      // 最后一次尝试失败，不再重试
      if (attempt >= maxRetries) {
        break
      }

      // 计算延迟（指数退避 + 随机抖动）
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 500,
        maxDelay
      )

      console.warn(
        `[重试] 第 ${attempt + 1}/${maxRetries} 次重试，${delay}ms 后执行。错误: ${error.message}`
      )

      if (onRetry) {
        onRetry(attempt + 1, error)
      }

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * 判断是否为不可重试的错误
 * @param {Error} error
 * @returns {boolean}
 */
function isNonRetryableError(error) {
  const message = error.message || ''

  // 认证错误不重试
  if (message.includes('401') || message.includes('Unauthorized') || message.includes('invalid api key')) {
    return true
  }

  // 请求参数错误不重试
  if (message.includes('400') || message.includes('Bad Request') || message.includes('invalid')) {
    return true
  }

  // 频率限制可以重试（返回 false）
  if (message.includes('429') || message.includes('rate limit') || message.includes('Too Many Requests')) {
    return false
  }

  // 内容过滤不重试
  if (message.includes('content_filter') || message.includes('Content policy')) {
    return true
  }

  return false
}

/**
 * 统一错误处理
 * 将各种提供商的错误格式化为统一格式
 * @param {Error} error - 原始错误
 * @param {string} providerId - 提供商ID
 * @returns {{code: string, message: string, provider: string, retryable: boolean}}
 */
function normalizeError(error, providerId) {
  const message = error.message || '未知错误'

  let code = 'unknown_error'
  let retryable = true

  if (message.includes('401') || message.includes('Unauthorized') || message.includes('api key')) {
    code = 'auth_error'
    retryable = false
  } else if (message.includes('429') || message.includes('rate limit') || message.includes('Too Many')) {
    code = 'rate_limit'
    retryable = true
  } else if (message.includes('400') || message.includes('Bad Request') || message.includes('invalid')) {
    code = 'invalid_request'
    retryable = false
  } else if (message.includes('500') || message.includes('Internal Server')) {
    code = 'server_error'
    retryable = true
  } else if (message.includes('timeout') || message.includes('Timeout') || message.includes('超时')) {
    code = 'timeout'
    retryable = true
  } else if (message.includes('network') || message.includes('Network') || message.includes('fetch')) {
    code = 'network_error'
    retryable = true
  } else if (message.includes('content_filter') || message.includes('Content policy')) {
    code = 'content_filter'
    retryable = false
  }

  return {
    code,
    message: `[${providerId}] ${message}`,
    provider: providerId,
    retryable,
    originalError: error
  }
}

// ==================== ProviderManager ====================

/**
 * ProviderManager 类
 * 统一管理所有 AI 提供商，提供统一的调用接口
 */
class ProviderManager {
  constructor() {
    /** @type {Map<string, AIModelProvider>} 已注册的提供商 */
    this._providers = new Map()
    /** @type {string|null} 当前激活的提供商ID */
    this._activeProviderId = null
    /** @type {object} 当前提供商配置 */
    this._activeConfig = null
    /** @type {Map<string, object>} 用户自定义的提供商配置 */
    this._providerConfigs = new Map()
    /** @type {boolean} 是否已初始化 */
    this._initialized = false

    // 注册内置提供商
    this._registerBuiltinProviders()
  }

  /**
   * 注册内置提供商
   * @private
   */
  _registerBuiltinProviders() {
    this.registerProvider(new OpenAIProvider())
    this.registerProvider(new DeepSeekProvider())
    this.registerProvider(new ClaudeProvider())
    this.registerProvider(new GeminiProvider())
    this.registerProvider(new ChatGLMProvider())
  }

  /**
   * 初始化管理器
   * 从 localStorage 恢复用户配置
   */
  initialize() {
    if (this._initialized) return

    try {
      const saved = localStorage.getItem('yunshu_provider_configs')
      if (saved) {
        const configs = JSON.parse(saved)
        for (const config of configs) {
          this._providerConfigs.set(config.providerId, config)
        }
      }

      // 恢复激活的提供商
      const activeId = localStorage.getItem('yunshu_active_provider')
      if (activeId && this._providers.has(activeId)) {
        this._activeProviderId = activeId
        this._activeConfig = this._providerConfigs.get(activeId) || null
      }

      this._initialized = true
      console.log(`[ProviderManager] 初始化完成，已注册 ${this._providers.size} 个提供商`)
    } catch (error) {
      console.error('[ProviderManager] 初始化失败:', error)
    }
  }

  /**
   * 注册提供商
   * @param {AIModelProvider} provider - 提供商实例
   */
  registerProvider(provider) {
    if (!provider.id || !provider.name) {
      throw new Error('提供商必须包含 id 和 name 属性')
    }
    this._providers.set(provider.id, provider)
  }

  /**
   * 获取提供商
   * @param {string} providerId
   * @returns {AIModelProvider|null}
   */
  getProvider(providerId) {
    return this._providers.get(providerId) || null
  }

  /**
   * 获取所有已注册的提供商
   * @returns {Array<{id: string, name: string, description: string, availableModels: string[]}>}
   */
  getAllProviders() {
    return Array.from(this._providers.values()).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      availableModels: p.availableModels,
      supportsStream: p.supportsStream,
      supportsVision: p.supportsVision
    }))
  }

  /**
   * 设置激活的提供商
   * @param {string} providerId - 提供商ID
   * @param {object} config - 配置
   * @param {string} config.apiKey - API 密钥
   * @param {string} [config.baseUrl] - 自定义基础地址
   * @param {string} [config.model] - 默认模型
   * @returns {Promise<boolean>} 是否设置成功
   */
  async setActiveProvider(providerId, config) {
    const provider = this._providers.get(providerId)
    if (!provider) {
      throw new Error(`提供商不存在: ${providerId}`)
    }

    if (!config || !config.apiKey) {
      throw new Error('请提供 API 密钥')
    }

    this._activeProviderId = providerId
    this._activeConfig = {
      providerId,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || provider.baseUrl,
      model: config.model || provider.availableModels[0]
    }

    // 持久化配置
    this._providerConfigs.set(providerId, this._activeConfig)
    this._saveConfigs()

    localStorage.setItem('yunshu_active_provider', providerId)

    console.log(`[ProviderManager] 已激活提供商: ${provider.name}，模型: ${this._activeConfig.model}`)
    return true
  }

  /**
   * 获取当前激活的提供商
   * @returns {{provider: AIModelProvider, config: object}|null}
   */
  getActiveProvider() {
    if (!this._activeProviderId) return null
    const provider = this._providers.get(this._activeProviderId)
    if (!provider) return null
    return { provider, config: this._activeConfig }
  }

  /**
   * 统一聊天接口
   * 使用当前激活的提供商发送聊天请求
   * @param {Array} messages - 消息数组
   * @param {object} [options] - 选项
   * @param {string} [options.model] - 覆盖默认模型
   * @param {number} [options.maxTokens] - 最大 token 数
   * @param {number} [options.temperature] - 温度
   * @param {string} [options.preset] - 使用预设配置
   * @param {boolean} [options.retry=true] - 是否启用重试
   * @returns {Promise<{content: string, usage: object}>}
   */
  async chat(messages, options = {}) {
    const { provider, config } = this._getActiveProviderOrThrow()

    // 应用预设配置
    const presetConfig = options.preset ? API_PRESETS[options.preset] : null
    const model = options.model || presetConfig?.defaultModel || config.model
    const maxTokens = options.maxTokens || presetConfig?.defaultMaxTokens
    const temperature = options.temperature ?? presetConfig?.defaultTemperature

    const requestFn = () => provider.chat({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      model,
      messages,
      maxTokens,
      temperature
    })

    // 是否启用重试
    if (options.retry !== false) {
      return withRetry(requestFn, {
        maxRetries: 3,
        onRetry: (attempt, error) => {
          console.warn(`[ProviderManager] 聊天请求重试 (${attempt}):`, error.message)
        }
      })
    }

    return requestFn()
  }

  /**
   * 统一流式聊天接口
   * @param {Array} messages - 消息数组
   * @param {Function} onChunk - 流式回调
   * @param {object} [options] - 选项
   * @returns {Promise<string>}
   */
  async chatStream(messages, onChunk, options = {}) {
    const { provider, config } = this._getActiveProviderOrThrow()

    const presetConfig = options.preset ? API_PRESETS[options.preset] : null
    const model = options.model || presetConfig?.defaultModel || config.model
    const maxTokens = options.maxTokens || presetConfig?.defaultMaxTokens
    const temperature = options.temperature ?? presetConfig?.defaultTemperature

    if (!provider.supportsStream) {
      // 不支持流式，降级为普通请求
      console.warn(`[ProviderManager] ${provider.name} 不支持流式响应，降级为普通请求`)
      const result = await this.chat(messages, options)
      if (onChunk) onChunk(result.content, result.content)
      return result.content
    }

    const requestFn = () => provider.chatStream({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      model,
      messages,
      maxTokens,
      temperature
    }, onChunk)

    if (options.retry !== false) {
      return withRetry(requestFn, { maxRetries: 2 })
    }

    return requestFn()
  }

  /**
   * 使用预设发送聊天请求
   * @param {string} presetKey - 预设键名
   * @param {Array} messages - 消息数组
   * @param {object} [overrides] - 覆盖预设的选项
   * @returns {Promise<{content: string, usage: object}>}
   */
  async chatWithPreset(presetKey, messages, overrides = {}) {
    return this.chat(messages, {
      preset: presetKey,
      ...overrides
    })
  }

  /**
   * 使用预设发送流式聊天请求
   * @param {string} presetKey - 预设键名
   * @param {Array} messages - 消息数组
   * @param {Function} onChunk - 流式回调
   * @param {object} [overrides] - 覆盖预设的选项
   * @returns {Promise<string>}
   */
  async chatStreamWithPreset(presetKey, messages, onChunk, overrides = {}) {
    return this.chatStream(messages, onChunk, {
      preset: presetKey,
      ...overrides
    })
  }

  /**
   * 验证当前提供商配置
   * @returns {Promise<boolean>}
   */
  async validateCurrentConfig() {
    const { provider, config } = this._getActiveProviderOrThrow()
    return provider.validateConfig(config.apiKey, config.baseUrl)
  }

  /**
   * 获取指定提供商的可用模型列表
   * @param {string} [providerId] - 提供商ID，不传则使用当前激活的
   * @returns {Promise<string[]>}
   */
  async getAvailableModels(providerId) {
    const id = providerId || this._activeProviderId
    if (!id) throw new Error('未设置激活的提供商')

    const provider = this._providers.get(id)
    if (!provider) throw new Error(`提供商不存在: ${id}`)

    const config = this._providerConfigs.get(id)
    if (!config) return provider.availableModels

    try {
      const models = await provider.listModels(config.apiKey, config.baseUrl)
      return models.length > 0 ? models : provider.availableModels
    } catch (error) {
      console.warn(`[ProviderManager] 获取模型列表失败，使用预设列表:`, error.message)
      return provider.availableModels
    }
  }

  /**
   * 自动发现提供商
   * @param {string} baseUrl - API 基础地址
   * @returns {Array}
   */
  autoDiscover(baseUrl) {
    return discoverProvider(baseUrl)
  }

  /**
   * 获取所有预设
   * @returns {object}
   */
  getPresets() {
    return { ...API_PRESETS }
  }

  /**
   * 获取指定预设
   * @param {string} key
   * @returns {object|null}
   */
  getPreset(key) {
    return API_PRESETS[key] || null
  }

  // ---------- 内部方法 ----------

  /**
   * 获取当前激活的提供商，未设置时抛出错误
   * @private
   */
  _getActiveProviderOrThrow() {
    if (!this._activeProviderId || !this._activeConfig) {
      throw new Error('请先设置 AI 提供商和 API 密钥')
    }

    const provider = this._providers.get(this._activeProviderId)
    if (!provider) {
      throw new Error(`提供商不存在: ${this._activeProviderId}`)
    }

    return { provider, config: this._activeConfig }
  }

  /**
   * 保存配置到 localStorage
   * @private
   */
  _saveConfigs() {
    try {
      const configs = Array.from(this._providerConfigs.values())
      // 保存时脱敏 apiKey（只保留前后4位）
      const safeConfigs = configs.map(c => ({
        ...c,
        apiKey: c.apiKey ? c.apiKey.slice(0, 4) + '****' + c.apiKey.slice(-4) : ''
      }))
      localStorage.setItem('yunshu_provider_configs', JSON.stringify(safeConfigs))
    } catch (error) {
      console.error('[ProviderManager] 保存配置失败:', error)
    }
  }
}

// ==================== 创建 ProviderManager 实例 ====================

const providerManager = new ProviderManager()

// ==================== 统一导出 ====================

const multiModelProvider = {
  // 管理器实例
  manager: providerManager,

  // 提供商类
  OpenAIProvider,
  DeepSeekProvider,
  ClaudeProvider,
  GeminiProvider,
  ChatGLMProvider,

  // 预设系统
  API_PRESETS,

  // 工具函数
  discoverProvider,
  withRetry,
  normalizeError,
  isNonRetryableError,

  // 初始化
  initialize: () => providerManager.initialize(),

  // 便捷方法（代理到 manager）
  registerProvider: (provider) => providerManager.registerProvider(provider),
  getProvider: (id) => providerManager.getProvider(id),
  getAllProviders: () => providerManager.getAllProviders(),
  setActiveProvider: (id, config) => providerManager.setActiveProvider(id, config),
  getActiveProvider: () => providerManager.getActiveProvider(),
  chat: (messages, options) => providerManager.chat(messages, options),
  chatStream: (messages, onChunk, options) => providerManager.chatStream(messages, onChunk, options),
  chatWithPreset: (presetKey, messages, overrides) => providerManager.chatWithPreset(presetKey, messages, overrides),
  chatStreamWithPreset: (presetKey, messages, onChunk, overrides) => providerManager.chatStreamWithPreset(presetKey, messages, onChunk, overrides),
  validateCurrentConfig: () => providerManager.validateCurrentConfig(),
  getAvailableModels: (providerId) => providerManager.getAvailableModels(providerId),
  autoDiscover: (baseUrl) => providerManager.autoDiscover(baseUrl),
  getPresets: () => providerManager.getPresets(),
  getPreset: (key) => providerManager.getPreset(key)
}

export default multiModelProvider

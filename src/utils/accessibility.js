/**
 * 云书 - 无障碍支持工具集
 * 提供全面的无障碍功能支持，包括屏幕阅读器、键盘导航、视觉辅助等
 * @module accessibility
 */

// ============================================
// 一、ARIA 属性管理
// ============================================

/**
 * ARIA 属性管理器
 * 用于动态设置和管理 ARIA 属性
 */
export const AriaManager = {
  /**
   * 设置元素的 ARIA 属性
   * @param {HTMLElement} element - 目标元素
   * @param {Object} attributes - ARIA 属性对象
   */
  setAttributes(element, attributes) {
    if (!element || !attributes) return
    
    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`
      if (value === null || value === undefined) {
        element.removeAttribute(ariaKey)
      } else {
        element.setAttribute(ariaKey, String(value))
      }
    })
  },

  /**
   * 获取元素的 ARIA 属性
   * @param {HTMLElement} element - 目标元素
   * @param {string} attribute - 属性名称
   * @returns {string|null} 属性值
   */
  getAttribute(element, attribute) {
    if (!element) return null
    const ariaKey = attribute.startsWith('aria-') ? attribute : `aria-${attribute}`
    return element.getAttribute(ariaKey)
  },

  /**
   * 设置角色属性
   * @param {HTMLElement} element - 目标元素
   * @param {string} role - ARIA 角色
   */
  setRole(element, role) {
    if (!element) return
    element.setAttribute('role', role)
  },

  /**
   * 设置标签
   * @param {HTMLElement} element - 目标元素
   * @param {string} label - 无障碍标签
   */
  setLabel(element, label) {
    if (!element) return
    element.setAttribute('aria-label', label)
  },

  /**
   * 设置描述
   * @param {HTMLElement} element - 目标元素
   * @param {string} description - 无障碍描述
   */
  setDescription(element, description) {
    if (!element) return
    element.setAttribute('aria-description', description)
  },

  /**
   * 设置展开状态
   * @param {HTMLElement} element - 目标元素
   * @param {boolean} expanded - 是否展开
   */
  setExpanded(element, expanded) {
    if (!element) return
    element.setAttribute('aria-expanded', String(expanded))
  },

  /**
   * 设置选中状态
   * @param {HTMLElement} element - 目标元素
   * @param {boolean} selected - 是否选中
   */
  setSelected(element, selected) {
    if (!element) return
    element.setAttribute('aria-selected', String(selected))
  },

  /**
   * 设置禁用状态
   * @param {HTMLElement} element - 目标元素
   * @param {boolean} disabled - 是否禁用
   */
  setDisabled(element, disabled) {
    if (!element) return
    element.setAttribute('aria-disabled', String(disabled))
  },

  /**
   * 设置隐藏状态
   * @param {HTMLElement} element - 目标元素
   * @param {boolean} hidden - 是否隐藏
   */
  setHidden(element, hidden) {
    if (!element) return
    element.setAttribute('aria-hidden', String(hidden))
  }
}

// ============================================
// 二、实时区域公告
// ============================================

/**
 * 实时区域公告管理器
 * 用于向屏幕阅读器发送实时消息
 */
export const LiveAnnouncer = {
  /** 公告区域容器 */
  container: null,
  
  /** 公告区域元素映射 */
  regions: new Map(),

  /**
   * 初始化公告系统
   */
  init() {
    if (this.container) return
    
    // 创建容器
    this.container = document.createElement('div')
    this.container.id = 'a11y-live-region-container'
    this.container.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `
    document.body.appendChild(this.container)
    
    // 创建不同优先级的公告区域
    this.createRegion('polite', 'polite')
    this.createRegion('assertive', 'assertive')
    this.createRegion('status', 'status')
  },

  /**
   * 创建公告区域
   * @param {string} id - 区域ID
   * @param {string} ariaLive - aria-live 值
   */
  createRegion(id, ariaLive) {
    const region = document.createElement('div')
    region.id = `a11y-live-${id}`
    region.setAttribute('role', 'status')
    region.setAttribute('aria-live', ariaLive)
    region.setAttribute('aria-atomic', 'true')
    this.container.appendChild(region)
    this.regions.set(id, region)
  },

  /**
   * 发送公告消息
   * @param {string} message - 公告内容
   * @param {Object} options - 配置选项
   * @param {string} options.priority - 优先级: 'polite' | 'assertive' | 'status'
   * @param {number} options.timeout - 清除时间（毫秒）
   */
  announce(message, options = {}) {
    this.init()
    
    const {
      priority = 'polite',
      timeout = 5000
    } = options
    
    const region = this.regions.get(priority) || this.regions.get('polite')
    if (!region) return
    
    // 清空并设置新消息
    region.textContent = ''
    
    // 使用 setTimeout 确保屏幕阅读器能检测到变化
    setTimeout(() => {
      region.textContent = message
      
      // 自动清除
      if (timeout > 0) {
        setTimeout(() => {
          region.textContent = ''
        }, timeout)
      }
    }, 100)
  },

  /**
   * 发送礼貌公告（不打断当前朗读）
   * @param {string} message - 公告内容
   */
  polite(message) {
    this.announce(message, { priority: 'polite' })
  },

  /**
   * 发送紧急公告（打断当前朗读）
   * @param {string} message - 公告内容
   */
  assertive(message) {
    this.announce(message, { priority: 'assertive' })
  },

  /**
   * 发送状态公告
   * @param {string} message - 状态消息
   */
  status(message) {
    this.announce(message, { priority: 'status' })
  },

  /**
   * 销毁公告系统
   */
  destroy() {
    if (this.container) {
      this.container.remove()
      this.container = null
      this.regions.clear()
    }
  }
}

// ============================================
// 三、焦点管理
// ============================================

/**
 * 焦点管理器
 * 提供焦点追踪、恢复和管理功能
 */
export const FocusManager = {
  /** 焦点历史栈 */
  focusStack: [],
  
  /** 焦点变化监听器 */
  listeners: new Set(),

  /**
   * 初始化焦点管理
   */
  init() {
    document.addEventListener('focusin', this.handleFocusIn.bind(this), true)
    document.addEventListener('focusout', this.handleFocusOut.bind(this), true)
  },

  /**
   * 焦点进入处理
   * @param {FocusEvent} event - 焦点事件
   */
  handleFocusIn(event) {
    const target = event.target
    if (target && target !== document.body) {
      this.listeners.forEach(listener => {
        try {
          listener(target, 'focus')
        } catch (e) {
          console.error('Focus listener error:', e)
        }
      })
    }
  },

  /**
   * 焦点离开处理
   * @param {FocusEvent} event - 焦点事件
   */
  handleFocusOut(event) {
    const target = event.target
    if (target && target !== document.body) {
      this.listeners.forEach(listener => {
        try {
          listener(target, 'blur')
        } catch (e) {
          console.error('Focus listener error:', e)
        }
      })
    }
  },

  /**
   * 保存当前焦点
   */
  saveFocus() {
    const activeElement = document.activeElement
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement)
    }
  },

  /**
   * 恢复上一个焦点
   * @returns {boolean} 是否成功恢复
   */
  restoreFocus() {
    const element = this.focusStack.pop()
    if (element && typeof element.focus === 'function') {
      element.focus()
      return true
    }
    return false
  },

  /**
   * 设置焦点到指定元素
   * @param {HTMLElement|string} target - 目标元素或选择器
   * @param {Object} options - 焦点选项
   */
  setFocus(target, options = {}) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target
    
    if (!element) return false
    
    // 确保元素可聚焦
    if (element.tabIndex < 0) {
      element.tabIndex = -1
    }
    
    element.focus(options)
    return true
  },

  /**
   * 获取当前焦点元素
   * @returns {HTMLElement|null} 当前焦点元素
   */
  getActiveElement() {
    return document.activeElement
  },

  /**
   * 添加焦点变化监听器
   * @param {Function} listener - 监听函数
   */
  addListener(listener) {
    this.listeners.add(listener)
  },

  /**
   * 移除焦点变化监听器
   * @param {Function} listener - 监听函数
   */
  removeListener(listener) {
    this.listeners.delete(listener)
  },

  /**
   * 清空焦点栈
   */
  clearStack() {
    this.focusStack = []
  }
}

// ============================================
// 四、跳过导航链接
// ============================================

/**
 * 跳过导航链接管理器
 * 提供快速跳转到主要内容的无障碍功能
 */
export const SkipLinks = {
  /** 跳过链接容器 */
  container: null,
  
  /** 已注册的跳过目标 */
  targets: new Map(),

  /**
   * 初始化跳过链接
   */
  init() {
    if (this.container) return
    
    this.container = document.createElement('nav')
    this.container.id = 'a11y-skip-links'
    this.container.setAttribute('aria-label', '跳过导航')
    this.container.className = 'skip-links-nav'
    
    // 插入到页面顶部
    document.body.insertBefore(this.container, document.body.firstChild)
  },

  /**
   * 注册跳过目标
   * @param {string} id - 目标元素ID
   * @param {string} label - 链接文本
   */
  register(id, label) {
    this.init()
    
    if (this.targets.has(id)) return
    
    this.targets.set(id, label)
    
    const link = document.createElement('a')
    link.href = `#${id}`
    link.className = 'skip-link'
    link.textContent = label
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(id)
      if (target) {
        FocusManager.setFocus(target)
        LiveAnnouncer.polite(`已跳转到${label}`)
      }
    })
    
    this.container.appendChild(link)
  },

  /**
   * 注销跳过目标
   * @param {string} id - 目标元素ID
   */
  unregister(id) {
    this.targets.delete(id)
    const link = this.container?.querySelector(`a[href="#${id}"]`)
    link?.remove()
  },

  /**
   * 销毁跳过链接
   */
  destroy() {
    this.container?.remove()
    this.container = null
    this.targets.clear()
  }
}

// ============================================
// 五、键盘导航
// ============================================

/**
 * 键盘导航管理器
 * 提供完整的键盘导航支持
 */
export const KeyboardNavigation = {
  /** 快捷键映射 */
  shortcuts: new Map(),
  
  /** 是否已初始化 */
  initialized: false,

  /**
   * 初始化键盘导航
   */
  init() {
    if (this.initialized) return
    
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.initialized = true
    
    // 注册默认快捷键
    this.registerDefaults()
  },

  /**
   * 注册默认快捷键
   */
  registerDefaults() {
    // Alt+1-9 快速导航
    for (let i = 1; i <= 9; i++) {
      this.register(`alt+${i}`, {
        action: () => this.navigateToIndex(i - 1),
        description: `跳转到第${i}个导航区域`
      })
    }
    
    // Alt+Home 跳转到首页
    this.register('alt+home', {
      action: () => this.navigateToHome(),
      description: '跳转到首页'
    })
    
    // Escape 关闭弹窗/取消操作
    this.register('escape', {
      action: () => this.handleEscape(),
      description: '关闭当前对话框或取消操作'
    })
  },

  /**
   * 键盘按下处理
   * @param {KeyboardEvent} event - 键盘事件
   */
  handleKeyDown(event) {
    const key = this.getShortcutKey(event)
    
    if (this.shortcuts.has(key)) {
      const shortcut = this.shortcuts.get(key)
      
      // 检查是否在输入框中（某些快捷键需要排除）
      const isInputFocused = this.isInputFocused()
      if (isInputFocused && !shortcut.allowInInput) {
        return
      }
      
      event.preventDefault()
      shortcut.action(event)
      
      // 公告快捷键执行
      if (shortcut.announce) {
        LiveAnnouncer.polite(shortcut.announce)
      }
    }
  },

  /**
   * 获取快捷键字符串
   * @param {KeyboardEvent} event - 键盘事件
   * @returns {string} 快捷键字符串
   */
  getShortcutKey(event) {
    const parts = []
    
    if (event.ctrlKey) parts.push('ctrl')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')
    if (event.metaKey) parts.push('meta')
    
    // 处理特殊键
    let key = event.key.toLowerCase()
    if (key === ' ') key = 'space'
    
    parts.push(key)
    return parts.join('+')
  },

  /**
   * 检查是否聚焦在输入元素上
   * @returns {boolean}
   */
  isInputFocused() {
    const activeElement = document.activeElement
    const inputTypes = ['input', 'textarea', 'select']
    return inputTypes.includes(activeElement?.tagName.toLowerCase()) ||
           activeElement?.isContentEditable
  },

  /**
   * 注册快捷键
   * @param {string} key - 快捷键（如 'ctrl+s', 'alt+f'）
   * @param {Object} config - 快捷键配置
   * @param {Function} config.action - 执行函数
   * @param {string} config.description - 描述
   * @param {string} config.announce - 执行后公告
   * @param {boolean} config.allowInInput - 是否允许在输入框中触发
   */
  register(key, config) {
    this.shortcuts.set(key.toLowerCase(), config)
  },

  /**
   * 注销快捷键
   * @param {string} key - 快捷键
   */
  unregister(key) {
    this.shortcuts.delete(key.toLowerCase())
  },

  /**
   * 获取所有快捷键
   * @returns {Array} 快捷键列表
   */
  getAllShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, config]) => ({
      key,
      description: config.description
    }))
  },

  /**
   * 导航到指定索引
   * @param {number} index - 索引
   */
  navigateToIndex(index) {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"], main, nav, aside')
    if (landmarks[index]) {
      FocusManager.setFocus(landmarks[index])
      LiveAnnouncer.polite(`已跳转到${landmarks[index].getAttribute('aria-label') || '导航区域'}`)
    }
  },

  /**
   * 导航到首页
   */
  navigateToHome() {
    const homeLink = document.querySelector('a[href="/"], a[href="#/"]')
    if (homeLink) {
      homeLink.click()
    } else {
      window.location.href = '/'
    }
  },

  /**
   * 处理 Escape 键
   */
  handleEscape() {
    // 尝试关闭对话框
    const closeButton = document.querySelector('.el-dialog__headerbtn, [aria-label="关闭"], [data-dismiss="modal"]')
    if (closeButton) {
      closeButton.click()
      return
    }
    
    // 恢复上一个焦点
    FocusManager.restoreFocus()
  },

  /**
   * 销毁键盘导航
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
    this.shortcuts.clear()
    this.initialized = false
  }
}

// ============================================
// 六、焦点陷阱
// ============================================

/**
 * 焦点陷阱管理器
 * 用于模态框等需要限制焦点范围的场景
 */
export const FocusTrap = {
  /** 活动的焦点陷阱 */
  activeTraps: new Map(),
  
  /** 陷阱计数器 */
  trapId: 0,

  /**
   * 创建焦点陷阱
   * @param {HTMLElement|string} container - 容器元素或选择器
   * @param {Object} options - 配置选项
   * @returns {number} 陷阱ID
   */
  create(container, options = {}) {
    const element = typeof container === 'string' 
      ? document.querySelector(container) 
      : container
    
    if (!element) return -1
    
    const {
      initialFocus = null,
      returnFocus = true,
      escapeDeactivates = true
    } = options
    
    const id = ++this.trapId
    
    // 保存当前焦点
    if (returnFocus) {
      FocusManager.saveFocus()
    }
    
    // 获取可聚焦元素
    const focusableElements = this.getFocusableElements(element)
    
    // 创建陷阱配置
    const trap = {
      element,
      options,
      focusableElements,
      handleKeyDown: (e) => this.handleTrapKeyDown(e, id)
    }
    
    this.activeTraps.set(id, trap)
    
    // 添加键盘监听
    element.addEventListener('keydown', trap.handleKeyDown)
    
    // 设置初始焦点
    if (initialFocus) {
      FocusManager.setFocus(initialFocus)
    } else if (focusableElements.length > 0) {
      FocusManager.setFocus(focusableElements[0])
    }
    
    return id
  },

  /**
   * 获取可聚焦元素
   * @param {HTMLElement} container - 容器元素
   * @returns {NodeList} 可聚焦元素列表
   */
  getFocusableElements(container) {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')
    
    return container.querySelectorAll(selector)
  },

  /**
   * 处理陷阱内的键盘事件
   * @param {KeyboardEvent} event - 键盘事件
   * @param {number} trapId - 陷阱ID
   */
  handleTrapKeyDown(event, trapId) {
    const trap = this.activeTraps.get(trapId)
    if (!trap) return
    
    // Escape 键退出
    if (event.key === 'Escape' && trap.options.escapeDeactivates) {
      this.deactivate(trapId)
      return
    }
    
    // Tab 键循环焦点
    if (event.key === 'Tab') {
      const focusableElements = this.getFocusableElements(trap.element)
      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.shiftKey) {
        // Shift+Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  },

  /**
   * 激活焦点陷阱
   * @param {number} trapId - 陷阱ID
   */
  activate(trapId) {
    const trap = this.activeTraps.get(trapId)
    if (trap) {
      trap.element.addEventListener('keydown', trap.handleKeyDown)
    }
  },

  /**
   * 停用焦点陷阱
   * @param {number} trapId - 陷阱ID
   */
  deactivate(trapId) {
    const trap = this.activeTraps.get(trapId)
    if (trap) {
      trap.element.removeEventListener('keydown', trap.handleKeyDown)
      
      // 恢复焦点
      if (trap.options.returnFocus) {
        FocusManager.restoreFocus()
      }
      
      this.activeTraps.delete(trapId)
    }
  },

  /**
   * 销毁所有焦点陷阱
   */
  destroyAll() {
    this.activeTraps.forEach((trap, id) => {
      this.deactivate(id)
    })
  }
}

// ============================================
// 七、视觉辅助模式
// ============================================

/**
 * 视觉辅助管理器
 * 提供高对比度、大字体、色盲友好等模式
 */
export const VisualAssist = {
  /** 当前启用的模式 */
  activeModes: new Set(),
  
  /** 存储键名 */
  STORAGE_KEY: 'a11y_visual_modes',

  /**
   * 初始化视觉辅助
   */
  init() {
    // 从存储恢复设置
    this.loadFromStorage()
    
    // 应用已保存的模式
    this.activeModes.forEach(mode => {
      document.documentElement.classList.add(`a11y-${mode}`)
    })
  },

  /**
   * 启用高对比度模式
   */
  enableHighContrast() {
    this.enableMode('high-contrast')
    LiveAnnouncer.polite('已启用高对比度模式')
  },

  /**
   * 禁用高对比度模式
   */
  disableHighContrast() {
    this.disableMode('high-contrast')
    LiveAnnouncer.polite('已关闭高对比度模式')
  },

  /**
   * 切换高对比度模式
   * @returns {boolean} 切换后的状态
   */
  toggleHighContrast() {
    if (this.activeModes.has('high-contrast')) {
      this.disableHighContrast()
      return false
    } else {
      this.enableHighContrast()
      return true
    }
  },

  /**
   * 启用大字体模式
   */
  enableLargeText() {
    this.enableMode('large-text')
    document.documentElement.style.fontSize = '120%'
    LiveAnnouncer.polite('已启用大字体模式')
  },

  /**
   * 禁用大字体模式
   */
  disableLargeText() {
    this.disableMode('large-text')
    document.documentElement.style.fontSize = ''
    LiveAnnouncer.polite('已关闭大字体模式')
  },

  /**
   * 切换大字体模式
   * @returns {boolean} 切换后的状态
   */
  toggleLargeText() {
    if (this.activeModes.has('large-text')) {
      this.disableLargeText()
      return false
    } else {
      this.enableLargeText()
      return true
    }
  },

  /**
   * 启用色盲友好模式
   * @param {string} type - 色盲类型: 'protanopia' | 'deuteranopia' | 'tritanopia'
   */
  enableColorBlindFriendly(type = 'deuteranopia') {
    this.enableMode(`colorblind-${type}`)
    LiveAnnouncer.polite('已启用色盲友好模式')
  },

  /**
   * 禁用色盲友好模式
   * @param {string} type - 色盲类型
   */
  disableColorBlindFriendly(type) {
    if (type) {
      this.disableMode(`colorblind-${type}`)
    } else {
      // 禁用所有色盲模式
      Array.from(this.activeModes).forEach(mode => {
        if (mode.startsWith('colorblind-')) {
          this.disableMode(mode)
        }
      })
    }
    LiveAnnouncer.polite('已关闭色盲友好模式')
  },

  /**
   * 启用减少动画模式
   */
  enableReducedMotion() {
    this.enableMode('reduced-motion')
    LiveAnnouncer.polite('已启用减少动画模式')
  },

  /**
   * 禁用减少动画模式
   */
  disableReducedMotion() {
    this.disableMode('reduced-motion')
    LiveAnnouncer.polite('已关闭减少动画模式')
  },

  /**
   * 切换减少动画模式
   * @returns {boolean} 切换后的状态
   */
  toggleReducedMotion() {
    if (this.activeModes.has('reduced-motion')) {
      this.disableReducedMotion()
      return false
    } else {
      this.enableReducedMotion()
      return true
    }
  },

  /**
   * 启用模式
   * @param {string} mode - 模式名称
   */
  enableMode(mode) {
    this.activeModes.add(mode)
    document.documentElement.classList.add(`a11y-${mode}`)
    this.saveToStorage()
  },

  /**
   * 禁用模式
   * @param {string} mode - 模式名称
   */
  disableMode(mode) {
    this.activeModes.delete(mode)
    document.documentElement.classList.remove(`a11y-${mode}`)
    this.saveToStorage()
  },

  /**
   * 检查模式是否启用
   * @param {string} mode - 模式名称
   * @returns {boolean}
   */
  isModeEnabled(mode) {
    return this.activeModes.has(mode)
  },

  /**
   * 保存到存储
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.activeModes)))
    } catch (e) {
      console.error('Failed to save visual assist modes:', e)
    }
  },

  /**
   * 从存储加载
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved) {
        const modes = JSON.parse(saved)
        this.activeModes = new Set(modes)
      }
    } catch (e) {
      console.error('Failed to load visual assist modes:', e)
    }
  },

  /**
   * 重置所有模式
   */
  resetAll() {
    this.activeModes.forEach(mode => {
      document.documentElement.classList.remove(`a11y-${mode}`)
    })
    this.activeModes.clear()
    document.documentElement.style.fontSize = ''
    this.saveToStorage()
    LiveAnnouncer.polite('已重置所有视觉辅助设置')
  }
}

// ============================================
// 八、语音控制接口
// ============================================

/**
 * 语音控制管理器
 * 提供语音命令接口和语音反馈功能
 */
export const VoiceControl = {
  /** 语音识别实例 */
  recognition: null,
  
  /** 语音合成实例 */
  synthesis: null,
  
  /** 是否正在监听 */
  isListening: false,
  
  /** 命令映射 */
  commands: new Map(),
  
  /** 回调函数 */
  callbacks: {
    onResult: null,
    onError: null,
    onCommand: null
  },

  /**
   * 初始化语音控制
   * @returns {boolean} 是否支持语音
   */
  init() {
    // 检查浏览器支持
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported')
      return false
    }
    
    // 创建语音识别实例
    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'zh-CN'
    
    // 创建语音合成实例
    this.synthesis = window.speechSynthesis
    
    // 设置事件监听
    this.recognition.onresult = this.handleResult.bind(this)
    this.recognition.onerror = this.handleError.bind(this)
    this.recognition.onend = this.handleEnd.bind(this)
    
    // 注册默认命令
    this.registerDefaults()
    
    return true
  },

  /**
   * 注册默认语音命令
   */
  registerDefaults() {
    this.registerCommand('新建', () => {
      document.querySelector('[data-action="new"]')?.click()
      this.speak('已创建新项目')
    })
    
    this.registerCommand('保存', () => {
      document.querySelector('[data-action="save"]')?.click()
      this.speak('已保存')
    })
    
    this.registerCommand('撤销', () => {
      document.execCommand('undo')
      this.speak('已撤销')
    })
    
    this.registerCommand('重做', () => {
      document.execCommand('redo')
      this.speak('已重做')
    })
  },

  /**
   * 开始语音监听
   */
  startListening() {
    if (!this.recognition) {
      const supported = this.init()
      if (!supported) {
        LiveAnnouncer.assertive('您的浏览器不支持语音识别')
        return false
      }
    }
    
    try {
      this.recognition.start()
      this.isListening = true
      LiveAnnouncer.polite('语音识别已启动')
      return true
    } catch (e) {
      console.error('Failed to start speech recognition:', e)
      return false
    }
  },

  /**
   * 停止语音监听
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
      LiveAnnouncer.polite('语音识别已停止')
    }
  },

  /**
   * 处理语音识别结果
   * @param {SpeechRecognitionEvent} event - 识别事件
   */
  handleResult(event) {
    const result = event.results[event.results.length - 1]
    const transcript = result[0].transcript.trim()
    
    // 调用回调
    if (this.callbacks.onResult) {
      this.callbacks.onResult(transcript, result.isFinal)
    }
    
    // 检查命令
    if (result.isFinal) {
      this.checkCommand(transcript)
    }
  },

  /**
   * 处理错误
   * @param {SpeechRecognitionError} event - 错误事件
   */
  handleError(event) {
    console.error('Speech recognition error:', event.error)
    
    if (this.callbacks.onError) {
      this.callbacks.onError(event.error)
    }
    
    LiveAnnouncer.assertive(`语音识别错误: ${event.error}`)
  },

  /**
   * 处理结束
   */
  handleEnd() {
    this.isListening = false
    
    // 如果不是手动停止，尝试重新启动
    // this.startListening()
  },

  /**
   * 注册语音命令
   * @param {string} phrase - 命令短语
   * @param {Function} action - 执行函数
   */
  registerCommand(phrase, action) {
    this.commands.set(phrase.toLowerCase(), action)
  },

  /**
   * 注销语音命令
   * @param {string} phrase - 命令短语
   */
  unregisterCommand(phrase) {
    this.commands.delete(phrase.toLowerCase())
  },

  /**
   * 检查并执行命令
   * @param {string} transcript - 识别文本
   */
  checkCommand(transcript) {
    const lowerTranscript = transcript.toLowerCase()
    
    for (const [phrase, action] of this.commands) {
      if (lowerTranscript.includes(phrase)) {
        action()
        
        if (this.callbacks.onCommand) {
          this.callbacks.onCommand(phrase)
        }
        
        return
      }
    }
  },

  /**
   * 语音朗读
   * @param {string} text - 要朗读的文本
   * @param {Object} options - 朗读选项
   */
  speak(text, options = {}) {
    if (!this.synthesis) {
      this.synthesis = window.speechSynthesis
    }
    
    const {
      lang = 'zh-CN',
      rate = 1,
      pitch = 1,
      volume = 1
    } = options
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    
    this.synthesis.speak(utterance)
  },

  /**
   * 停止朗读
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  },

  /**
   * 设置回调
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(`on${event.charAt(0).toUpperCase() + event.slice(1)}`)) {
      this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}`] = callback
    }
  },

  /**
   * 销毁语音控制
   */
  destroy() {
    this.stopListening()
    this.stopSpeaking()
    this.commands.clear()
    this.recognition = null
    this.synthesis = null
  }
}

// ============================================
// 九、无障碍检查器
// ============================================

/**
 * 无障碍检查器
 * 自动检测无障碍问题并提供修复建议
 */
export const AccessibilityChecker = {
  /** 检查规则 */
  rules: [],
  
  /** 检查结果 */
  results: [],

  /**
   * 初始化检查器
   */
  init() {
    this.registerDefaultRules()
  },

  /**
   * 注册默认检查规则
   */
  registerDefaultRules() {
    this.rules = [
      {
        id: 'img-alt',
        name: '图片替代文本',
        description: '检查所有图片是否有替代文本',
        check: (el) => {
          if (el.tagName === 'IMG') {
            return el.hasAttribute('alt') || el.hasAttribute('aria-label')
          }
          return true
        },
        fix: '为图片添加 alt 属性或 aria-label'
      },
      {
        id: 'button-label',
        name: '按钮标签',
        description: '检查所有按钮是否有可访问的标签',
        check: (el) => {
          if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
            return el.textContent.trim() || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
          }
          return true
        },
        fix: '为按钮添加文本内容或 aria-label 属性'
      },
      {
        id: 'link-href',
        name: '链接目标',
        description: '检查所有链接是否有有效的目标',
        check: (el) => {
          if (el.tagName === 'A') {
            return el.hasAttribute('href') || el.hasAttribute('aria-label')
          }
          return true
        },
        fix: '为链接添加 href 属性或 aria-label'
      },
      {
        id: 'form-label',
        name: '表单标签',
        description: '检查表单元素是否有关联的标签',
        check: (el) => {
          const formElements = ['INPUT', 'SELECT', 'TEXTAREA']
          if (formElements.includes(el.tagName)) {
            const id = el.id
            if (id) {
              const label = document.querySelector(`label[for="${id}"]`)
              if (label) return true
            }
            return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
          }
          return true
        },
        fix: '为表单元素添加关联的 label 或 aria-label 属性'
      },
      {
        id: 'heading-order',
        name: '标题顺序',
        description: '检查标题是否按正确顺序排列',
        check: (el, context) => {
          if (/^H[1-6]$/.test(el.tagName)) {
            const level = parseInt(el.tagName.charAt(1))
            const prevHeadings = context.prevHeadings || []
            
            // 检查是否跳级
            if (prevHeadings.length > 0) {
              const prevLevel = prevHeadings[prevHeadings.length - 1]
              if (level > prevLevel + 1) {
                return false
              }
            }
            
            prevHeadings.push(level)
            context.prevHeadings = prevHeadings
          }
          return true
        },
        fix: '确保标题按顺序排列，不要跳级'
      },
      {
        id: 'color-contrast',
        name: '颜色对比度',
        description: '检查文本颜色对比度是否足够',
        check: (el) => {
          // 简化检查：只检查是否有内联样式
          const style = window.getComputedStyle(el)
          const color = style.color
          const bgColor = style.backgroundColor
          
          // 这里应该使用 WCAG 对比度算法
          // 简化版本只检查是否设置了颜色
          return true
        },
        fix: '确保文本与背景有足够的对比度（至少 4.5:1）'
      },
      {
        id: 'keyboard-focusable',
        name: '键盘可聚焦',
        description: '检查可交互元素是否可以通过键盘聚焦',
        check: (el) => {
          const interactiveElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']
          if (interactiveElements.includes(el.tagName)) {
            return el.tabIndex !== -1 || el.disabled
          }
          
          // 检查具有 click 事件的元素
          if (el.onclick || el.hasAttribute('onclick')) {
            return el.tabIndex >= 0
          }
          
          return true
        },
        fix: '为可交互元素添加 tabindex 属性'
      },
      {
        id: 'aria-valid',
        name: 'ARIA 属性有效性',
        description: '检查 ARIA 属性是否有效',
        check: (el) => {
          const ariaAttrs = Array.from(el.attributes).filter(attr => attr.name.startsWith('aria-'))
          
          // 有效的 ARIA 属性列表
          const validAriaAttrs = [
            'aria-activedescendant', 'aria-atomic', 'aria-autocomplete',
            'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex',
            'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby',
            'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage',
            'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup',
            'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label',
            'aria-labelledby', 'aria-level', 'aria-live', 'aria-modal',
            'aria-multiline', 'aria-multiselectable', 'aria-orientation',
            'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed',
            'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription',
            'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-selected',
            'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin',
            'aria-valuenow', 'aria-valuetext'
          ]
          
          return ariaAttrs.every(attr => validAriaAttrs.includes(attr.name))
        },
        fix: '移除无效的 ARIA 属性'
      }
    ]
  },

  /**
   * 检查单个元素
   * @param {HTMLElement} element - 要检查的元素
   * @param {Object} context - 检查上下文
   * @returns {Array} 问题列表
   */
  checkElement(element, context = {}) {
    const issues = []
    
    this.rules.forEach(rule => {
      try {
        const passed = rule.check(element, context)
        if (!passed) {
          issues.push({
            rule: rule.id,
            name: rule.name,
            description: rule.description,
            fix: rule.fix,
            element: element
          })
        }
      } catch (e) {
        console.error(`Rule ${rule.id} check error:`, e)
      }
    })
    
    return issues
  },

  /**
   * 检查整个页面
   * @param {HTMLElement} root - 根元素，默认为 document.body
   * @returns {Object} 检查结果
   */
  checkPage(root = document.body) {
    this.results = []
    const context = { prevHeadings: [] }
    
    // 遍历所有元素
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    )
    
    let element
    while (element = walker.nextNode()) {
      const issues = this.checkElement(element, context)
      if (issues.length > 0) {
        this.results.push(...issues)
      }
    }
    
    return {
      totalIssues: this.results.length,
      issues: this.results,
      summary: this.generateSummary()
    }
  },

  /**
   * 生成检查摘要
   * @returns {Object} 摘要信息
   */
  generateSummary() {
    const summary = {}
    
    this.results.forEach(issue => {
      if (!summary[issue.rule]) {
        summary[issue.rule] = {
          count: 0,
          name: issue.name,
          fix: issue.fix
        }
      }
      summary[issue.rule].count++
    })
    
    return summary
  },

  /**
   * 获取修复建议
   * @returns {Array} 修复建议列表
   */
  getFixSuggestions() {
    return Object.entries(this.generateSummary()).map(([rule, data]) => ({
      rule,
      name: data.name,
      count: data.count,
      suggestion: data.fix
    }))
  },

  /**
   * 添加自定义规则
   * @param {Object} rule - 规则对象
   */
  addRule(rule) {
    this.rules.push(rule)
  },

  /**
   * 移除规则
   * @param {string} ruleId - 规则ID
   */
  removeRule(ruleId) {
    this.rules = this.rules.filter(r => r.id !== ruleId)
  }
}

// ============================================
// 十、无障碍管理器（统一入口）
// ============================================

/**
 * 无障碍管理器
 * 统一管理所有无障碍功能
 */
export const AccessibilityManager = {
  /** 是否已初始化 */
  initialized: false,
  
  /** 配置选项 */
  config: {
    enableLiveAnnouncer: true,
    enableFocusManager: true,
    enableSkipLinks: true,
    enableKeyboardNavigation: true,
    enableVisualAssist: true,
    enableVoiceControl: false,
    enableAccessibilityChecker: true
  },

  /**
   * 初始化无障碍系统
   * @param {Object} options - 配置选项
   */
  init(options = {}) {
    if (this.initialized) return
    
    // 合并配置
    this.config = { ...this.config, ...options }
    
    // 初始化各模块
    if (this.config.enableLiveAnnouncer) {
      LiveAnnouncer.init()
    }
    
    if (this.config.enableFocusManager) {
      FocusManager.init()
    }
    
    if (this.config.enableSkipLinks) {
      SkipLinks.init()
      // 注册默认跳过目标
      SkipLinks.register('main-content', '跳转到主要内容')
    }
    
    if (this.config.enableKeyboardNavigation) {
      KeyboardNavigation.init()
    }
    
    if (this.config.enableVisualAssist) {
      VisualAssist.init()
    }
    
    if (this.config.enableAccessibilityChecker) {
      AccessibilityChecker.init()
    }
    
    // 检测系统偏好
    this.detectSystemPreferences()
    
    this.initialized = true
    console.log('Accessibility system initialized')
  },

  /**
   * 检测系统无障碍偏好
   */
  detectSystemPreferences() {
    // 检测减少动画偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      VisualAssist.enableReducedMotion()
    }
    
    // 检测高对比度偏好
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      VisualAssist.enableHighContrast()
    }
    
    // 监听偏好变化
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        VisualAssist.enableReducedMotion()
      } else {
        VisualAssist.disableReducedMotion()
      }
    })
    
    window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
      if (e.matches) {
        VisualAssist.enableHighContrast()
      } else {
        VisualAssist.disableHighContrast()
      }
    })
  },

  /**
   * 获取所有可用功能
   * @returns {Object} 功能列表
   */
  getFeatures() {
    return {
      aria: AriaManager,
      announcer: LiveAnnouncer,
      focus: FocusManager,
      skipLinks: SkipLinks,
      keyboard: KeyboardNavigation,
      focusTrap: FocusTrap,
      visualAssist: VisualAssist,
      voiceControl: VoiceControl,
      checker: AccessibilityChecker
    }
  },

  /**
   * 运行无障碍检查
   * @returns {Object} 检查结果
   */
  runCheck() {
    return AccessibilityChecker.checkPage()
  },

  /**
   * 销毁无障碍系统
   */
  destroy() {
    LiveAnnouncer.destroy()
    SkipLinks.destroy()
    KeyboardNavigation.destroy()
    FocusTrap.destroyAll()
    VoiceControl.destroy()
    this.initialized = false
  }
}

// 导出所有模块
export default AccessibilityManager

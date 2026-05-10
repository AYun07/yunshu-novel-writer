/**
 * 云书 - 专注模式配置
 * 
 * 对标 WriteMonkey 的极致极简写作体验，提供沉浸式写作环境。
 * 
 * 功能模块：
 * 1. 全屏模式 - 隐藏侧边栏、头部、所有UI元素
 * 2. 打字机滚动 - 光标始终保持在屏幕中间
 * 3. 当前行高亮 - 高亮当前编辑行
 * 4. 段落聚焦 - 其他段落变暗，透明度可调
 * 5. 句子拆分模式 - 每句独占一行，便于审视句子结构
 * 6. 计时器模式 - 番茄钟（25分钟写作 / 5分钟休息）
 * 7. 字数目标模式 - 当日目标进度条
 * 8. 环境音效配置 - 雨声/咖啡馆/图书馆等白噪音
 * 9. 字体/字号/行间距自定义
 * 10. 背景色/文字色自定义
 * 
 * 使用方式：
 * import { focusModeConfig, focusModeManager } from './focusMode.js'
 */

// ============================================================================
// 专注模式配置项
// ============================================================================

/**
 * 专注模式完整配置
 * 所有配置项均可通过 focusModeManager 动态修改
 */
export const focusModeConfig = {
  // ------------------------------------------------------------------
  // 全屏模式配置
  // ------------------------------------------------------------------
  fullscreen: {
    /** 是否启用全屏模式 */
    enabled: true,
    /** 隐藏侧边栏 */
    hideSidebar: true,
    /** 隐藏顶部导航栏 */
    hideHeader: true,
    /** 隐藏底部状态栏 */
    hideFooter: true,
    /** 隐藏章节面板 */
    hideChapterPanel: true,
    /** 隐藏工具栏 */
    hideToolbar: true,
    /** 隐藏所有浮动面板 */
    hideFloatingPanels: true,
    /** 退出全屏的快捷键提示是否显示 */
    showExitHint: true,
    /** 鼠标移到屏幕边缘时是否临时显示UI */
    edgeHoverShow: true,
    /** 边缘触发区域宽度（像素） */
    edgeHoverWidth: 8
  },

  // ------------------------------------------------------------------
  // 打字机滚动配置
  // ------------------------------------------------------------------
  typewriterScroll: {
    /** 是否启用打字机滚动 */
    enabled: true,
    /** 光标所在行占屏幕的百分比位置（0-1） */
    cursorPosition: 0.4,
    /** 滚动动画持续时间（毫秒） */
    scrollDuration: 150,
    /** 滚动缓动函数 */
    easing: 'ease-out'
  },

  // ------------------------------------------------------------------
  // 当前行高亮配置
  // ------------------------------------------------------------------
  currentLineHighlight: {
    /** 是否启用当前行高亮 */
    enabled: true,
    /** 高亮背景色 */
    highlightColor: 'rgba(255, 255, 255, 0.05)',
    /** 高亮行的高度模式：'line' 仅行高 | 'paragraph' 整段高亮 */
    highlightMode: 'line',
    /** 是否显示行号 */
    showLineNumbers: false
  },

  // ------------------------------------------------------------------
  // 段落聚焦配置
  // ------------------------------------------------------------------
  paragraphFocus: {
    /** 是否启用段落聚焦 */
    enabled: false,
    /** 非聚焦段落的透明度（0-1，0为完全透明） */
    dimOpacity: 0.3,
    /** 聚焦段落过渡动画时长（毫秒） */
    transitionDuration: 300,
    /** 聚焦范围：'single' 仅当前段 | 'adjacent' 当前段及相邻段 */
    focusRange: 'single',
    /** 相邻段落的透明度（仅 focusRange 为 'adjacent' 时生效） */
    adjacentOpacity: 0.7
  },

  // ------------------------------------------------------------------
  // 句子拆分模式配置
  // ------------------------------------------------------------------
  sentenceSplit: {
    /** 是否启用句子拆分模式 */
    enabled: false,
    /** 句子分隔符正则表达式 */
    separatorRegex: /[。！？；…]+/g,
    /** 拆分后句子之间的间距（像素） */
    sentenceGap: 24,
    /** 句子序号是否显示 */
    showSentenceNumbers: false,
    /** 句子序号的起始值 */
    startNumber: 1
  },

  // ------------------------------------------------------------------
  // 计时器模式配置（番茄钟）
  // ------------------------------------------------------------------
  timer: {
    /** 是否启用计时器 */
    enabled: false,
    /** 工作时长（分钟） */
    workDuration: 25,
    /** 短休息时长（分钟） */
    shortBreakDuration: 5,
    /** 长休息时长（分钟） */
    longBreakDuration: 15,
    /** 长休息间隔（几个番茄钟后） */
    longBreakInterval: 4,
    /** 是否自动开始下一个番茄钟 */
    autoStartNext: false,
    /** 是否在休息时暂停计时器 */
    pauseOnBreak: false,
    /** 计时器显示位置：'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' */
    displayPosition: 'top-right',
    /** 计时器提醒音效 */
    alarmSound: 'gentle',
    /** 计时结束是否弹出提示 */
    showNotification: true
  },

  // ------------------------------------------------------------------
  // 字数目标模式配置
  // ------------------------------------------------------------------
  wordGoal: {
    /** 是否启写字数目标 */
    enabled: false,
    /** 每日目标字数 */
    dailyGoal: 2000,
    /** 进度条显示位置：'top' | 'bottom' */
    progressBarPosition: 'bottom',
    /** 进度条颜色 */
    progressBarColor: '#4CAF50',
    /** 进度条背景色 */
    progressBarBgColor: 'rgba(255, 255, 255, 0.1)',
    /** 进度条高度（像素） */
    progressBarHeight: 3,
    /** 是否显示剩余字数 */
    showRemainingWords: true,
    /** 是否在达到目标时显示庆祝动画 */
    showCelebration: true,
    /** 自定义目标（按日期索引） */
    customGoals: {}
  },

  // ------------------------------------------------------------------
  // 环境音效配置
  // ------------------------------------------------------------------
  ambientSound: {
    /** 是否启用环境音效 */
    enabled: false,
    /** 当前选中的音效 */
    currentSound: 'rain',
    /** 音量（0-1） */
    volume: 0.5,
    /** 是否循环播放 */
    loop: true,
    /** 淡入时长（毫秒） */
    fadeInDuration: 2000,
    /** 淡出时长（毫秒） */
    fadeOutDuration: 1000
  },

  /**
   * 可用环境音效列表
   * 每个音效包含名称、描述和音频源配置
   * 注意：实际音频文件需要自行提供，此处仅定义配置结构
   */
  availableSounds: [
    {
      id: 'rain',
      name: '雨声',
      description: '轻柔的雨滴声，适合安静创作',
      icon: 'cloud-rain',
      category: 'nature',
      /** 音频文件路径（相对于 public/audio/ 目录） */
      src: '/audio/rain.mp3'
    },
    {
      id: 'heavy-rain',
      name: '暴雨',
      description: '密集的暴雨声，隔绝外界干扰',
      icon: 'cloud-showers-heavy',
      category: 'nature',
      src: '/audio/heavy-rain.mp3'
    },
    {
      id: 'thunder',
      name: '雷雨',
      description: '雷雨交加，营造紧张氛围',
      icon: 'bolt',
      category: 'nature',
      src: '/audio/thunder.mp3'
    },
    {
      id: 'forest',
      name: '森林',
      description: '鸟鸣虫叫，回归自然',
      icon: 'tree',
      category: 'nature',
      src: '/audio/forest.mp3'
    },
    {
      id: 'ocean',
      name: '海浪',
      description: '海浪拍岸，心旷神怡',
      icon: 'water',
      category: 'nature',
      src: '/audio/ocean.mp3'
    },
    {
      id: 'cafe',
      name: '咖啡馆',
      description: '轻柔的咖啡馆背景音，有适度的人声',
      icon: 'coffee',
      category: 'urban',
      src: '/audio/cafe.mp3'
    },
    {
      id: 'library',
      name: '图书馆',
      description: '安静的图书馆环境，偶尔的翻书声',
      icon: 'book',
      category: 'urban',
      src: '/audio/library.mp3'
    },
    {
      id: 'fireplace',
      name: '壁炉',
      description: '温暖的壁炉燃烧声',
      icon: 'fire',
      category: 'indoor',
      src: '/audio/fireplace.mp3'
    },
    {
      id: 'wind',
      name: '风声',
      description: '轻柔的风声，适合冥想写作',
      icon: 'wind',
      category: 'nature',
      src: '/audio/wind.mp3'
    },
    {
      id: 'train',
      name: '火车',
      description: '火车行驶的节奏声，适合长途写作',
      icon: 'train',
      category: 'transport',
      src: '/audio/train.mp3'
    },
    {
      id: 'white-noise',
      name: '白噪音',
      description: '纯白噪音，完全隔绝外界',
      icon: 'wave-square',
      category: 'noise',
      src: '/audio/white-noise.mp3'
    },
    {
      id: 'pink-noise',
      name: '粉红噪音',
      description: '更柔和的噪音，比白噪音更自然',
      icon: 'wave-square',
      category: 'noise',
      src: '/audio/pink-noise.mp3'
    }
  ],

  // ------------------------------------------------------------------
  // 字体与排版配置
  // ------------------------------------------------------------------
  typography: {
    /** 字体族 */
    fontFamily: '"Noto Serif SC", "Source Han Serif SC", "STSong", Georgia, serif',
    /** 字号（像素） */
    fontSize: 18,
    /** 行高 */
    lineHeight: 1.8,
    /** 字间距（像素） */
    letterSpacing: 0.5,
    /** 段间距（像素） */
    paragraphSpacing: 16,
    /** 首行缩进（字符数） */
    textIndent: 2,
    /** 文本对齐方式 */
    textAlign: 'justify',
    /** 最大文本宽度（像素），null 表示自适应 */
    maxWidth: 720,
    /** 文本区域左右内边距（像素） */
    paddingX: 40,
    /** 文本区域上下内边距（像素） */
    paddingY: 60
  },

  // ------------------------------------------------------------------
  // 颜色主题配置
  // ------------------------------------------------------------------
  theme: {
    /** 当前主题预设 */
    preset: 'dark',
    /** 编辑器背景色 */
    backgroundColor: '#1a1a2e',
    /** 文字颜色 */
    textColor: '#e0e0e0',
    /** 光标颜色 */
    cursorColor: '#64ffda',
    /** 选中文字背景色 */
    selectionColor: 'rgba(100, 255, 218, 0.2)',
    /** 链接颜色 */
    linkColor: '#82b1ff',
    /** 高亮标记颜色 */
    markerColor: 'rgba(255, 215, 0, 0.3)'
  },

  /**
   * 预设主题列表
   */
  themePresets: [
    {
      id: 'dark',
      name: '暗夜',
      description: '深色背景，适合夜间写作',
      theme: {
        backgroundColor: '#1a1a2e',
        textColor: '#e0e0e0',
        cursorColor: '#64ffda',
        selectionColor: 'rgba(100, 255, 218, 0.2)',
        linkColor: '#82b1ff',
        markerColor: 'rgba(255, 215, 0, 0.3)'
      }
    },
    {
      id: 'sepia',
      name: '羊皮纸',
      description: '温暖的米色背景，护眼舒适',
      theme: {
        backgroundColor: '#f4ecd8',
        textColor: '#5b4636',
        cursorColor: '#8b4513',
        selectionColor: 'rgba(139, 69, 19, 0.2)',
        linkColor: '#2e7d32',
        markerColor: 'rgba(255, 193, 7, 0.3)'
      }
    },
    {
      id: 'light',
      name: '明亮',
      description: '纯白背景，简洁清爽',
      theme: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        cursorColor: '#1976d2',
        selectionColor: 'rgba(25, 118, 210, 0.15)',
        linkColor: '#1565c0',
        markerColor: 'rgba(255, 235, 59, 0.4)'
      }
    },
    {
      id: 'green',
      name: '护眼绿',
      description: '淡绿色背景，长时间写作不疲劳',
      theme: {
        backgroundColor: '#c7edcc',
        textColor: '#2d4a2d',
        cursorColor: '#1b5e20',
        selectionColor: 'rgba(27, 94, 32, 0.15)',
        linkColor: '#2e7d32',
        markerColor: 'rgba(76, 175, 80, 0.3)'
      }
    },
    {
      id: 'midnight',
      name: '午夜蓝',
      description: '深蓝背景，营造深邃氛围',
      theme: {
        backgroundColor: '#0d1b2a',
        textColor: '#e0e1dd',
        cursorColor: '#00b4d8',
        selectionColor: 'rgba(0, 180, 216, 0.2)',
        linkColor: '#48cae4',
        markerColor: 'rgba(144, 224, 239, 0.3)'
      }
    },
    {
      id: 'warm-dark',
      name: '暖夜',
      description: '暖色调深色背景，温馨舒适',
      theme: {
        backgroundColor: '#2d2424',
        textColor: '#e8d5d5',
        cursorColor: '#ff8a65',
        selectionColor: 'rgba(255, 138, 101, 0.2)',
        linkColor: '#ffab91',
        markerColor: 'rgba(255, 171, 145, 0.3)'
      }
    }
  ],

  // ------------------------------------------------------------------
  // 编辑器行为配置
  // ------------------------------------------------------------------
  editor: {
    /** 是否启用自动保存 */
    autoSave: true,
    /** 自动保存间隔（毫秒） */
    autoSaveInterval: 30000,
    /** 是否启用拼写检查 */
    spellCheck: false,
    /** 是否显示标点符号提示 */
    showPunctuationHints: false,
    /** Tab 键行为：'indent' 缩进 | 'space' 插入空格 */
    tabBehavior: 'space',
    /** Tab 键插入的空格数 */
    tabSize: 2,
    /** 是否启用软换行 */
    softWrap: true,
    /** 是否显示段落标记 */
    showParagraphMarks: false
  }
}

// ============================================================================
// 专注模式快捷键定义
// ============================================================================

/**
 * 专注模式快捷键映射
 * 格式：{ keyCombination: { description, action } }
 * keyCombination 支持的修饰键：Ctrl, Shift, Alt, Meta
 * 多个键用 + 连接
 */
export const focusModeShortcuts = {
  // 进入/退出专注模式
  'F11': {
    description: '进入/退出专注模式',
    action: 'toggleFocusMode'
  },
  'Escape': {
    description: '退出专注模式',
    action: 'exitFocusMode'
  },

  // 功能开关切换
  'Alt+T': {
    description: '切换打字机滚动',
    action: 'toggleTypewriterScroll'
  },
  'Alt+H': {
    description: '切换当前行高亮',
    action: 'toggleLineHighlight'
  },
  'Alt+P': {
    description: '切换段落聚焦',
    action: 'toggleParagraphFocus'
  },
  'Alt+S': {
    description: '切换句子拆分模式',
    action: 'toggleSentenceSplit'
  },

  // 计时器控制
  'Alt+Space': {
    description: '开始/暂停计时器',
    action: 'toggleTimer'
  },
  'Alt+R': {
    description: '重置计时器',
    action: 'resetTimer'
  },

  // 字数目标
  'Alt+G': {
    description: '显示/隐藏字数目标',
    action: 'toggleWordGoal'
  },

  // 环境音效
  'Alt+M': {
    description: '切换环境音效开关',
    action: 'toggleAmbientSound'
  },
  'Alt+Up': {
    description: '增大音效音量',
    action: 'volumeUp'
  },
  'Alt+Down': {
    description: '减小音效音量',
    action: 'volumeDown'
  },

  // 主题切换
  'Alt+1': {
    description: '切换到暗夜主题',
    action: 'setTheme',
    params: { preset: 'dark' }
  },
  'Alt+2': {
    description: '切换到羊皮纸主题',
    action: 'setTheme',
    params: { preset: 'sepia' }
  },
  'Alt+3': {
    description: '切换到明亮主题',
    action: 'setTheme',
    params: { preset: 'light' }
  },
  'Alt+4': {
    description: '切换到护眼绿主题',
    action: 'setTheme',
    params: { preset: 'green' }
  },

  // 字体调整
  'Alt+=': {
    description: '增大字号',
    action: 'fontSizeUp'
  },
  'Alt+-': {
    description: '减小字号',
    action: 'fontSizeDown'
  }
}

// ============================================================================
// 专注模式状态管理
// ============================================================================

/**
 * 专注模式状态枚举
 */
export const FocusModeState = {
  /** 未激活 */
  INACTIVE: 'inactive',
  /** 已激活 - 写作中 */
  ACTIVE: 'active',
  /** 已暂停 */
  PAUSED: 'paused'
}

/**
 * 番茄钟状态枚举
 */
export const PomodoroState = {
  /** 未启动 */
  IDLE: 'idle',
  /** 工作中 */
  WORKING: 'working',
  /** 短休息 */
  SHORT_BREAK: 'short_break',
  /** 长休息 */
  LONG_BREAK: 'long_break'
}

/**
 * 写作会话记录
 * @typedef {Object} WritingSession
 * @property {string} id - 会话ID
 * @property {string} startTime - 开始时间（ISO字符串）
 * @property {string|null} endTime - 结束时间
 * @property {number} startWordCount - 开始时的字数
 * @property {number} endWordCount - 结束时的字数
 * @property {number} wordsWritten - 本次会话写作字数
 * @property {number} pomodorosCompleted - 完成的番茄钟数
 * @property {number} durationMinutes - 会话持续时长（分钟）
 * @property {string} chapterId - 关联的章节ID
 * @property {string} projectId - 关联的项目ID
 */

/**
 * 专注模式管理器
 * 管理专注模式的状态切换、计时器、会话记录等
 */
class FocusModeManager {
  constructor () {
    /** 当前专注模式状态 */
    this.state = FocusModeState.INACTIVE

    /** 当前配置（深拷贝默认配置） */
    this.config = JSON.parse(JSON.stringify(focusModeConfig))

    /** 番茄钟状态 */
    this.pomodoroState = PomodoroState.IDLE

    /** 番茄钟剩余秒数 */
    this.pomodoroRemaining = 0

    /** 已完成的番茄钟数（当前长休息周期内） */
    this.pomodoroCount = 0

    /** 总完成番茄钟数（本次会话） */
    this.totalPomodoros = 0

    /** 计时器内部引用 */
    this._timerInterval = null

    /** 当前写作会话 */
    this.currentSession = null

    /** 历史会话记录 */
    this.sessions = []

    /** 当日已写字数 */
    this.todayWordCount = 0

    /** 状态变更回调列表 */
    this._stateChangeCallbacks = []

    /** 番茄钟状态变更回调列表 */
    this._pomodoroChangeCallbacks = []

    /** 字数变更回调列表 */
    this._wordCountChangeCallbacks = []

    /** 配置变更回调列表 */
    this._configChangeCallbacks = []

    /** 音频播放器引用 */
    this._audioPlayer = null
  }

  // ========================================================================
  // 回调注册
  // ========================================================================

  /**
   * 注册专注模式状态变更回调
   * @param {Function} callback - 回调函数 (newState, oldState)
   */
  onStateChange (callback) {
    this._stateChangeCallbacks.push(callback)
  }

  /**
   * 注册番茄钟状态变更回调
   * @param {Function} callback - 回调函数 (pomodoroState, remaining, total)
   */
  onPomodoroChange (callback) {
    this._pomodoroChangeCallbacks.push(callback)
  }

  /**
   * 注册字数变更回调
   * @param {Function} callback - 回调函数 (todayWordCount, dailyGoal)
   */
  onWordCountChange (callback) {
    this._wordCountChangeCallbacks.push(callback)
  }

  /**
   * 注册配置变更回调
   * @param {Function} callback - 回调函数 (configKey, newValue)
   */
  onConfigChange (callback) {
    this._configChangeCallbacks.push(callback)
  }

  // ========================================================================
  // 回调触发
  // ========================================================================

  _emitStateChange (oldState) {
    this._stateChangeCallbacks.forEach(cb => {
      try { cb(this.state, oldState) } catch (e) { console.error(e) }
    })
  }

  _emitPomodoroChange () {
    const total = this._getCurrentPomodoroDuration()
    this._pomodoroChangeCallbacks.forEach(cb => {
      try { cb(this.pomodoroState, this.pomodoroRemaining, total) } catch (e) { console.error(e) }
    })
  }

  _emitWordCountChange () {
    this._wordCountChangeCallbacks.forEach(cb => {
      try { cb(this.todayWordCount, this.config.wordGoal.dailyGoal) } catch (e) { console.error(e) }
    })
  }

  _emitConfigChange (key, value) {
    this._configChangeCallbacks.forEach(cb => {
      try { cb(key, value) } catch (e) { console.error(e) }
    })
  }

  // ========================================================================
  // 专注模式状态管理
  // ========================================================================

  /**
   * 进入专注模式
   * @param {Object} [options] - 进入选项
   * @param {string} [options.chapterId] - 关联章节ID
   * @param {string} [options.projectId] - 关联项目ID
   * @param {number} [options.currentWordCount] - 当前字数
   */
  enterFocusMode ({ chapterId = '', projectId = '', currentWordCount = 0 } = {}) {
    const oldState = this.state
    this.state = FocusModeState.ACTIVE

    // 创建写作会话
    this.currentSession = {
      id: this._generateSessionId(),
      startTime: new Date().toISOString(),
      endTime: null,
      startWordCount: currentWordCount,
      endWordCount: currentWordCount,
      wordsWritten: 0,
      pomodorosCompleted: 0,
      durationMinutes: 0,
      chapterId,
      projectId
    }

    // 如果启用了计时器，自动开始
    if (this.config.timer.enabled) {
      this.startPomodoro()
    }

    // 如果启用了环境音效，自动播放
    if (this.config.ambientSound.enabled) {
      this.playAmbientSound()
    }

    this._emitStateChange(oldState)
  }

  /**
   * 退出专注模式
   */
  exitFocusMode () {
    const oldState = this.state

    // 结束当前会话
    if (this.currentSession) {
      this.currentSession.endTime = new Date().toISOString()
      this.currentSession.pomodorosCompleted = this.totalPomodoros
      const start = new Date(this.currentSession.startTime)
      const end = new Date(this.currentSession.endTime)
      this.currentSession.durationMinutes = Math.round((end - start) / 60000)

      // 保存会话记录
      this.sessions.push({ ...this.currentSession })

      // 最多保留 100 条记录
      if (this.sessions.length > 100) {
        this.sessions = this.sessions.slice(-100)
      }

      this.currentSession = null
    }

    // 停止计时器
    this.stopPomodoro()

    // 停止环境音效
    this.stopAmbientSound()

    // 重置番茄钟计数
    this.totalPomodoros = 0
    this.pomodoroCount = 0

    this.state = FocusModeState.INACTIVE
    this._emitStateChange(oldState)
  }

  /**
   * 暂停专注模式
   */
  pauseFocusMode () {
    const oldState = this.state
    if (this.state === FocusModeState.ACTIVE) {
      this.state = FocusModeState.PAUSED

      // 暂停计时器
      if (this.pomodoroState === PomodoroState.WORKING) {
        this.pausePomodoro()
      }

      this._emitStateChange(oldState)
    }
  }

  /**
   * 恢复专注模式
   */
  resumeFocusMode () {
    const oldState = this.state
    if (this.state === FocusModeState.PAUSED) {
      this.state = FocusModeState.ACTIVE

      // 恢复计时器
      if (this.pomodoroState !== PomodoroState.IDLE) {
        this.resumePomodoro()
      }

      this._emitStateChange(oldState)
    }
  }

  /**
   * 切换专注模式
   */
  toggleFocusMode () {
    if (this.state === FocusModeState.INACTIVE) {
      this.enterFocusMode()
    } else {
      this.exitFocusMode()
    }
  }

  /**
   * 更新当前字数
   * @param {number} wordCount - 当前总字数
   */
  updateWordCount (wordCount) {
    if (this.currentSession) {
      this.currentSession.endWordCount = wordCount
      this.currentSession.wordsWritten = wordCount - this.currentSession.startWordCount
    }
    this.todayWordCount = wordCount
    this._emitWordCountChange()
  }

  // ========================================================================
  // 番茄钟（计时器）管理
  // ========================================================================

  /**
   * 获取当前番茄钟阶段的总时长（秒）
   * @returns {number}
   */
  _getCurrentPomodoroDuration () {
    switch (this.pomodoroState) {
      case PomodoroState.WORKING:
        return this.config.timer.workDuration * 60
      case PomodoroState.SHORT_BREAK:
        return this.config.timer.shortBreakDuration * 60
      case PomodoroState.LONG_BREAK:
        return this.config.timer.longBreakDuration * 60
      default:
        return 0
    }
  }

  /**
   * 开始番茄钟
   */
  startPomodoro () {
    if (this.pomodoroState === PomodoroState.IDLE) {
      this.pomodoroState = PomodoroState.WORKING
      this.pomodoroRemaining = this.config.timer.workDuration * 60
    }

    // 清除已有计时器
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
    }

    // 每秒倒计时
    this._timerInterval = setInterval(() => {
      this.pomodoroRemaining--

      if (this.pomodoroRemaining <= 0) {
        this._onPomodoroComplete()
      }

      this._emitPomodoroChange()
    }, 1000)

    this._emitPomodoroChange()
  }

  /**
   * 暂停番茄钟
   */
  pausePomodoro () {
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
  }

  /**
   * 恢复番茄钟
   */
  resumePomodoro () {
    if (this.pomodoroState !== PomodoroState.IDLE && !this._timerInterval) {
      this._timerInterval = setInterval(() => {
        this.pomodoroRemaining--

        if (this.pomodoroRemaining <= 0) {
          this._onPomodoroComplete()
        }

        this._emitPomodoroChange()
      }, 1000)
    }
  }

  /**
   * 停止番茄钟
   */
  stopPomodoro () {
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }
    this.pomodoroState = PomodoroState.IDLE
    this.pomodoroRemaining = 0
    this._emitPomodoroChange()
  }

  /**
   * 重置番茄钟
   */
  resetPomodoro () {
    this.stopPomodoro()
    this.pomodoroCount = 0
    this.totalPomodoros = 0
  }

  /**
   * 切换番茄钟
   */
  togglePomodoro () {
    if (this._timerInterval) {
      this.pausePomodoro()
    } else {
      this.startPomodoro()
    }
  }

  /**
   * 番茄钟阶段完成处理
   */
  _onPomodoroComplete () {
    if (this._timerInterval) {
      clearInterval(this._timerInterval)
      this._timerInterval = null
    }

    // 播放提示音
    this._playAlarm()

    // 显示通知
    if (this.config.timer.showNotification) {
      this._showNotification()
    }

    switch (this.pomodoroState) {
      case PomodoroState.WORKING:
        // 工作阶段完成
        this.pomodoroCount++
        this.totalPomodoros++

        if (this.currentSession) {
          this.currentSession.pomodorosCompleted = this.totalPomodoros
        }

        // 判断是否需要长休息
        if (this.pomodoroCount >= this.config.timer.longBreakInterval) {
          this.pomodoroState = PomodoroState.LONG_BREAK
          this.pomodoroRemaining = this.config.timer.longBreakDuration * 60
          this.pomodoroCount = 0
        } else {
          this.pomodoroState = PomodoroState.SHORT_BREAK
          this.pomodoroRemaining = this.config.timer.shortBreakDuration * 60
        }

        // 自动开始休息
        if (this.config.timer.autoStartNext) {
          this.startPomodoro()
        }
        break

      case PomodoroState.SHORT_BREAK:
      case PomodoroState.LONG_BREAK:
        // 休息结束，开始新的工作阶段
        this.pomodoroState = PomodoroState.WORKING
        this.pomodoroRemaining = this.config.timer.workDuration * 60

        if (this.config.timer.autoStartNext) {
          this.startPomodoro()
        }
        break
    }
  }

  /**
   * 播放提示音（浏览器环境）
   */
  _playAlarm () {
    try {
      // 使用 Web Audio API 播放简单的提示音
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3

      oscillator.start()
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (e) {
      // 静默失败，不影响写作
    }
  }

  /**
   * 显示通知（浏览器环境）
   */
  _showNotification () {
    try {
      if (window.Notification && Notification.permission === 'granted') {
        const messages = {
          [PomodoroState.WORKING]: '写作时间到！休息一下吧。',
          [PomodoroState.SHORT_BREAK]: '休息结束，继续写作吧！',
          [PomodoroState.LONG_BREAK]: '长休息结束，准备好继续了吗？'
        }
        new Notification('云书 - 专注模式', {
          body: messages[this.pomodoroState] || '时间到！',
          icon: '/favicon.ico'
        })
      }
    } catch (e) {
      // 静默失败
    }
  }

  // ========================================================================
  // 环境音效管理
  // ========================================================================

  /**
   * 播放环境音效
   * @param {string} [soundId] - 音效ID，不传则使用当前配置
   */
  playAmbientSound (soundId) {
    if (soundId) {
      this.config.ambientSound.currentSound = soundId
    }

    try {
      // 停止当前播放
      this.stopAmbientSound()

      const sound = this.config.availableSounds.find(
        s => s.id === this.config.ambientSound.currentSound
      )
      if (!sound) return

      this._audioPlayer = new Audio(sound.src)
      this._audioPlayer.loop = this.config.ambientSound.loop
      this._audioPlayer.volume = this.config.ambientSound.volume

      // 淡入效果
      this._audioPlayer.volume = 0
      this._audioPlayer.play().then(() => {
        const fadeIn = setInterval(() => {
          if (this._audioPlayer.volume < this.config.ambientSound.volume) {
            this._audioPlayer.volume = Math.min(
              this._audioPlayer.volume + 0.05,
              this.config.ambientSound.volume
            )
          } else {
            clearInterval(fadeIn)
          }
        }, this.config.ambientSound.fadeInDuration / 20)
      }).catch(() => {
        // 音频播放失败，静默处理
      })
    } catch (e) {
      // 静默失败
    }
  }

  /**
   * 停止环境音效
   */
  stopAmbientSound () {
    if (this._audioPlayer) {
      try {
        // 淡出效果
        const fadeOut = setInterval(() => {
          if (this._audioPlayer.volume > 0.05) {
            this._audioPlayer.volume -= 0.05
          } else {
            clearInterval(fadeOut)
            this._audioPlayer.pause()
            this._audioPlayer.currentTime = 0
            this._audioPlayer = null
          }
        }, this.config.ambientSound.fadeOutDuration / 20)
      } catch (e) {
        this._audioPlayer = null
      }
    }
  }

  /**
   * 设置音效音量
   * @param {number} volume - 音量（0-1）
   */
  setAmbientVolume (volume) {
    this.config.ambientSound.volume = Math.max(0, Math.min(1, volume))
    if (this._audioPlayer) {
      this._audioPlayer.volume = this.config.ambientSound.volume
    }
    this._emitConfigChange('ambientSound.volume', this.config.ambientSound.volume)
  }

  // ========================================================================
  // 配置管理
  // ========================================================================

  /**
   * 更新配置项
   * @param {string} key - 配置键（支持点号分隔的嵌套路径，如 'typewriterScroll.enabled'）
   * @param {*} value - 配置值
   */
  setConfig (key, value) {
    const keys = key.split('.')
    let target = this.config

    for (let i = 0; i < keys.length - 1; i++) {
      if (target[keys[i]] === undefined) {
        target[keys[i]] = {}
      }
      target = target[keys[i]]
    }

    target[keys[keys.length - 1]] = value
    this._emitConfigChange(key, value)
  }

  /**
   * 获取配置项
   * @param {string} key - 配置键
   * @param {*} [defaultValue] - 默认值
   * @returns {*}
   */
  getConfig (key, defaultValue) {
    const keys = key.split('.')
    let target = this.config

    for (const k of keys) {
      if (target && target[k] !== undefined) {
        target = target[k]
      } else {
        return defaultValue
      }
    }

    return target
  }

  /**
   * 应用主题预设
   * @param {string} presetId - 预设ID
   */
  applyThemePreset (presetId) {
    const preset = this.config.themePresets.find(p => p.id === presetId)
    if (preset) {
      Object.assign(this.config.theme, preset.theme)
      this.config.theme.preset = presetId
      this._emitConfigChange('theme', this.config.theme)
    }
  }

  /**
   * 重置为默认配置
   */
  resetConfig () {
    this.config = JSON.parse(JSON.stringify(focusModeConfig))
    this._emitConfigChange('*', this.config)
  }

  // ========================================================================
  // 会话统计
  // ========================================================================

  /**
   * 获取今日写作统计
   * @returns {Object} 今日统计
   */
  getTodayStats () {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = this.sessions.filter(s =>
      s.startTime && s.startTime.startsWith(today)
    )

    return {
      totalSessions: todaySessions.length,
      totalDuration: todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      totalWords: todaySessions.reduce((sum, s) => sum + (s.wordsWritten || 0), 0),
      totalPomodoros: todaySessions.reduce((sum, s) => sum + (s.pomodorosCompleted || 0), 0),
      averageWordsPerSession: todaySessions.length > 0
        ? Math.round(todaySessions.reduce((sum, s) => sum + (s.wordsWritten || 0), 0) / todaySessions.length)
        : 0
    }
  }

  /**
   * 获取本周写作统计
   * @returns {Object} 本周统计
   */
  getWeekStats () {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekSessions = this.sessions.filter(s =>
      new Date(s.startTime) >= weekStart
    )

    return {
      totalSessions: weekSessions.length,
      totalDuration: weekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
      totalWords: weekSessions.reduce((sum, s) => sum + (s.wordsWritten || 0), 0),
      totalPomodoros: weekSessions.reduce((sum, s) => sum + (s.pomodorosCompleted || 0), 0)
    }
  }

  /**
   * 获取字数目标进度
   * @returns {Object} 进度信息
   */
  getWordGoalProgress () {
    const goal = this.config.wordGoal.dailyGoal
    const current = this.todayWordCount
    const percentage = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
    const remaining = Math.max(0, goal - current)

    return {
      goal,
      current,
      percentage,
      remaining,
      isCompleted: current >= goal
    }
  }

  // ========================================================================
  // 数据持久化
  // ========================================================================

  /**
   * 导出配置和会话数据
   * @returns {Object} 可序列化的数据
   */
  exportData () {
    return {
      config: this.config,
      sessions: this.sessions,
      todayWordCount: this.todayWordCount
    }
  }

  /**
   * 导入配置和会话数据
   * @param {Object} data - 导入数据
   */
  importData (data) {
    if (data.config) {
      this.config = data.config
    }
    if (data.sessions) {
      this.sessions = data.sessions
    }
    if (data.todayWordCount !== undefined) {
      this.todayWordCount = data.todayWordCount
    }
  }

  /**
   * 生成会话ID
   * @returns {string}
   */
  _generateSessionId () {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8)
  }
}

// ============================================================================
// 导出
// ============================================================================

export default focusModeConfig

/**
 * 便捷函数：创建专注模式管理器实例
 * @returns {FocusModeManager}
 */
export function createFocusModeManager () {
  return new FocusModeManager()
}

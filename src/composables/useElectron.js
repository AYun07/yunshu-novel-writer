/**
 * 云书 - Electron 功能组合式函数
 *
 * 功能说明：
 * - 检测 Electron 环境
 * - 窗口控制（最小化/最大化/关闭）
 * - 文件操作（打开/保存）
 * - 系统通知
 * - 全局快捷键监听
 * - 自动更新状态
 * - 剪贴板操作
 * - 应用信息获取
 * - 最近项目列表管理
 * - 菜单动作监听
 * - 托盘动作监听
 *
 * 使用示例：
 * const { isElectron, minimizeWindow, saveFile, showNotification, checkForUpdates } = useElectron()
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// ============================================
// 状态定义
// ============================================

/** 是否是 Electron 环境 */
const isElectronEnv = ref(false)

/** 应用版本 */
const appVersion = ref('')

/** 平台信息 */
const platform = ref('')

/** 是否是开发环境 */
const isDev = ref(false)

/** 应用路径 */
const appPath = ref('')

/** 用户数据路径 */
const userDataPath = ref('')

/** 窗口是否最大化 */
const isMaximized = ref(false)

/** 窗口是否全屏 */
const isFullscreen = ref(false)

/** 是否有未保存的更改 */
const hasUnsavedChanges = ref(false)

/** 是否可以撤销 */
const canUndo = ref(false)

/** 是否可以重做 */
const canRedo = ref(false)

/** 自动更新状态 */
const updateState = ref({
  checking: false,
  available: false,
  downloading: false,
  downloaded: false,
  error: null,
  info: null,
  progress: 0
})

/** 最近打开的项目列表 */
const recentProjects = ref([])

/** 所有窗口列表 */
const windows = ref([])

// ============================================
// 计算属性
// ============================================

/**
 * 是否是 Electron 环境
 */
const isElectron = computed(() => isElectronEnv.value)

/**
 * 是否是 macOS
 */
const isMac = computed(() => platform.value === 'darwin')

/**
 * 是否是 Windows
 */
const isWindows = computed(() => platform.value === 'win32')

/**
 * 是否是 Linux
 */
const isLinux = computed(() => platform.value === 'linux')

/**
 * 是否有可用更新
 */
const hasUpdate = computed(() => updateState.value.available && !updateState.value.downloaded)

/**
 * 更新是否已下载完成
 */
const isUpdateReady = computed(() => updateState.value.downloaded)

// ============================================
// 环境检测
// ============================================

/**
 * 检测是否在 Electron 环境中运行
 * @returns {boolean} 是否是 Electron 环境
 */
function detectElectron() {
  // 检查 userAgent
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('electron')) {
    return true
  }

  // 检查是否有 window.electronAPI
  if (typeof window !== 'undefined' && window.electronAPI) {
    return true
  }

  // 检查 process.versions.electron
  if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    return true
  }

  return false
}

/**
 * 获取 Electron API
 * @returns {Object|null} Electron API 对象
 */
function getElectronAPI() {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI
  }
  return null
}

// ============================================
// 应用信息
// ============================================

/**
 * 获取应用版本
 * @returns {Promise<string>} 应用版本
 */
async function getAppVersion() {
  const api = getElectronAPI()
  if (!api) return ''

  try {
    const version = await api.getAppVersion()
    appVersion.value = version
    return version
  } catch (error) {
    console.error('[useElectron] 获取应用版本失败:', error)
    return ''
  }
}

/**
 * 获取应用路径
 * @param {string} name - 路径名称
 * @returns {Promise<string>} 路径
 */
async function getAppPath(name) {
  const api = getElectronAPI()
  if (!api) return ''

  try {
    return await api.getAppPath(name)
  } catch (error) {
    console.error('[useElectron] 获取应用路径失败:', error)
    return ''
  }
}

/**
 * 初始化应用信息
 */
async function initAppInfo() {
  const api = getElectronAPI()
  if (!api) return

  try {
    // 监听 app-ready 事件
    api.onAppReady((info) => {
      appVersion.value = info.version
      platform.value = info.platform
      isDev.value = info.isDev
      appPath.value = info.appPath
      userDataPath.value = info.userDataPath

      console.log('[useElectron] 应用信息:', info)
    })
  } catch (error) {
    console.error('[useElectron] 初始化应用信息失败:', error)
  }
}

// ============================================
// 窗口控制
// ============================================

/**
 * 最小化窗口
 */
function minimizeWindow() {
  const api = getElectronAPI()
  if (api) {
    api.minimizeWindow()
  }
}

/**
 * 最大化/取消最大化窗口
 */
function maximizeWindow() {
  const api = getElectronAPI()
  if (api) {
    api.maximizeWindow()
  }
}

/**
 * 关闭窗口
 */
function closeWindow() {
  const api = getElectronAPI()
  if (api) {
    api.closeWindow()
  }
}

/**
 * 恢复窗口
 */
function restoreWindow() {
  const api = getElectronAPI()
  if (api) {
    api.restoreWindow()
  }
}

/**
 * 切换全屏
 */
function toggleFullscreen() {
  const api = getElectronAPI()
  if (api) {
    api.toggleFullscreen()
  }
}

/**
 * 设置窗口标题
 * @param {string} title - 标题
 */
function setWindowTitle(title) {
  document.title = title
}

// ============================================
// 文件操作
// ============================================

/**
 * 打开文件对话框
 * @param {Object} options - 对话框选项
 * @returns {Promise<string[]>} 选择的文件路径数组
 */
async function openFileDialog(options = {}) {
  const api = getElectronAPI()
  if (!api) {
    // 非 Electron 环境使用原生文件选择
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = options.properties?.includes('multiSelections') || false
      input.accept = options.filters?.map(f => f.extensions.map(e => `.${e}`).join(',')).join(',') || '*'

      input.onchange = (e) => {
        const files = Array.from(e.target.files).map(f => f.path || f.name)
        resolve(files)
      }

      input.click()
    })
  }

  try {
    return await api.openFileDialog(options)
  } catch (error) {
    console.error('[useElectron] 打开文件对话框失败:', error)
    return []
  }
}

/**
 * 保存文件对话框
 * @param {Object} options - 对话框选项
 * @returns {Promise<string|null>} 保存的文件路径
 */
async function saveFileDialog(options = {}) {
  const api = getElectronAPI()
  if (!api) {
    // 非 Electron 环境使用下载
    return null
  }

  try {
    return await api.saveFileDialog(options)
  } catch (error) {
    console.error('[useElectron] 保存文件对话框失败:', error)
    return null
  }
}

/**
 * 读取文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<string>} 文件内容
 */
async function readFile(filePath) {
  const api = getElectronAPI()
  if (!api) {
    throw new Error('非 Electron 环境不支持直接读取文件')
  }

  try {
    return await api.readFile(filePath)
  } catch (error) {
    console.error('[useElectron] 读取文件失败:', error)
    throw error
  }
}

/**
 * 写入文件
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {Promise<boolean>} 是否成功
 */
async function writeFile(filePath, content) {
  const api = getElectronAPI()
  if (!api) {
    throw new Error('非 Electron 环境不支持直接写入文件')
  }

  try {
    return await api.writeFile(filePath, content)
  } catch (error) {
    console.error('[useElectron] 写入文件失败:', error)
    throw error
  }
}

/**
 * 保存文件
 * @param {Object} options - 保存选项
 * @returns {Promise<boolean>} 是否成功
 */
async function saveFile(options = {}) {
  const { content, defaultPath, filters } = options

  const filePath = await saveFileDialog({
    defaultPath,
    filters: filters || [
      { name: '文本文件', extensions: ['txt'] },
      { name: 'Markdown', extensions: ['md'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  })

  if (!filePath) return false

  try {
    await writeFile(filePath, content)
    ElMessage.success('文件保存成功')
    return true
  } catch (error) {
    ElMessage.error('文件保存失败')
    return false
  }
}

/**
 * 打开文件
 * @param {Object} options - 打开选项
 * @returns {Promise<{path: string, content: string}|null>} 文件信息
 */
async function openFile(options = {}) {
  const { filters } = options

  const filePaths = await openFileDialog({
    properties: ['openFile'],
    filters: filters || [
      { name: '文本文件', extensions: ['txt', 'md'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  })

  if (!filePaths || filePaths.length === 0) return null

  try {
    const content = await readFile(filePaths[0])
    return {
      path: filePaths[0],
      content
    }
  } catch (error) {
    ElMessage.error('文件读取失败')
    return null
  }
}

// ============================================
// 系统通知
// ============================================

/**
 * 显示系统通知
 * @param {Object} options - 通知选项
 */
function showNotification(options) {
  const { title = '云书', body = '', icon = '/icons/icon-192x192.png' } = options

  // 优先使用 Electron 通知
  const api = getElectronAPI()
  if (api && api.showNotification) {
    api.showNotification({ title, body, icon })
    return
  }

  // 回退到 Web Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon
    })
  } else {
    // 使用 Element Plus 通知
    ElNotification({
      title,
      message: body,
      type: 'info'
    })
  }
}

/**
 * 显示保存成功通知
 */
function showSaveSuccessNotification() {
  showNotification({
    title: '保存成功',
    body: '您的作品已保存'
  })
}

/**
 * 显示自动保存通知
 */
function showAutoSaveNotification() {
  showNotification({
    title: '自动保存',
    body: '您的作品已自动保存'
  })
}

// ============================================
// 剪贴板操作
// ============================================

/**
 * 读取剪贴板内容
 * @returns {Promise<string>} 剪贴板内容
 */
async function readClipboard() {
  const api = getElectronAPI()
  if (api && api.readClipboard) {
    try {
      return await api.readClipboard()
    } catch (error) {
      console.error('[useElectron] 读取剪贴板失败:', error)
    }
  }

  // 回退到 Web API
  try {
    return await navigator.clipboard.readText()
  } catch (error) {
    console.error('[useElectron] 读取剪贴板失败:', error)
    return ''
  }
}

/**
 * 写入剪贴板
 * @param {string} text - 要写入的文本
 */
async function writeClipboard(text) {
  const api = getElectronAPI()
  if (api && api.writeClipboard) {
    try {
      await api.writeClipboard(text)
      return
    } catch (error) {
      console.error('[useElectron] 写入剪贴板失败:', error)
    }
  }

  // 回退到 Web API
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('[useElectron] 写入剪贴板失败:', error)
  }
}

// ============================================
// 自动更新
// ============================================

/**
 * 检查更新
 */
async function checkForUpdates() {
  const api = getElectronAPI()
  if (!api) {
    ElMessage.warning('当前环境不支持自动更新')
    return
  }

  try {
    await api.checkForUpdates()
    ElMessage.info('正在检查更新...')
  } catch (error) {
    console.error('[useElectron] 检查更新失败:', error)
    ElMessage.error('检查更新失败')
  }
}

/**
 * 下载更新
 */
async function downloadUpdate() {
  const api = getElectronAPI()
  if (!api) return

  try {
    await api.downloadUpdate()
  } catch (error) {
    console.error('[useElectron] 下载更新失败:', error)
    ElMessage.error('下载更新失败')
  }
}

/**
 * 安装更新并重启
 */
async function quitAndInstall() {
  const api = getElectronAPI()
  if (!api) return

  try {
    await api.quitAndInstall()
  } catch (error) {
    console.error('[useElectron] 安装更新失败:', error)
  }
}

/**
 * 初始化自动更新监听
 */
function initUpdateListeners() {
  const api = getElectronAPI()
  if (!api) return

  // 正在检查更新
  api.onUpdateChecking(() => {
    updateState.value.checking = true
    updateState.value.error = null
  })

  // 有可用更新
  api.onUpdateAvailable((info) => {
    updateState.value.checking = false
    updateState.value.available = true
    updateState.value.info = info

    ElMessageBox.confirm(
      `发现新版本 ${info.version}，是否立即下载？`,
      '发现新版本',
      {
        confirmButtonText: '立即下载',
        cancelButtonText: '稍后',
        type: 'info'
      }
    ).then(() => {
      downloadUpdate()
    }).catch(() => {})
  })

  // 没有可用更新
  api.onUpdateNotAvailable((info) => {
    updateState.value.checking = false
    updateState.value.available = false
    ElMessage.info('当前已是最新版本')
  })

  // 下载进度
  api.onUpdateProgress((progress) => {
    updateState.value.downloading = true
    updateState.value.progress = Math.round(progress.percent)
  })

  // 更新下载完成
  api.onUpdateDownloaded((info) => {
    updateState.value.downloading = false
    updateState.value.downloaded = true

    ElMessageBox.confirm(
      '新版本已下载完成，是否立即重启安装？',
      '更新已就绪',
      {
        confirmButtonText: '立即重启',
        cancelButtonText: '稍后',
        type: 'success'
      }
    ).then(() => {
      quitAndInstall()
    }).catch(() => {})
  })

  // 更新错误
  api.onUpdateError((error) => {
    updateState.value.checking = false
    updateState.value.error = error
    ElMessage.error(`更新失败: ${error}`)
  })
}

// ============================================
// 最近项目
// ============================================

/**
 * 获取最近打开的项目列表
 * @returns {Promise<Array>} 项目列表
 */
async function getRecentProjects() {
  const api = getElectronAPI()
  if (!api) return []

  try {
    const projects = await api.getRecentProjects()
    recentProjects.value = projects
    return projects
  } catch (error) {
    console.error('[useElectron] 获取最近项目失败:', error)
    return []
  }
}

/**
 * 添加最近打开的项目
 * @param {Object} project - 项目信息
 */
async function addRecentProject(project) {
  const api = getElectronAPI()
  if (!api) return

  try {
    await api.addRecentProject(project)
    await getRecentProjects()
  } catch (error) {
    console.error('[useElectron] 添加最近项目失败:', error)
  }
}

// ============================================
// 窗口管理
// ============================================

/**
 * 获取所有窗口
 * @returns {Promise<Array>} 窗口列表
 */
async function getAllWindows() {
  const api = getElectronAPI()
  if (!api) return []

  try {
    const windowList = await api.getAllWindows()
    windows.value = windowList
    return windowList
  } catch (error) {
    console.error('[useElectron] 获取窗口列表失败:', error)
    return []
  }
}

/**
 * 聚焦窗口
 * @param {number} windowId - 窗口ID
 */
async function focusWindow(windowId) {
  const api = getElectronAPI()
  if (!api) return

  try {
    await api.focusWindow(windowId)
  } catch (error) {
    console.error('[useElectron] 聚焦窗口失败:', error)
  }
}

/**
 * 创建子窗口
 * @param {Object} options - 窗口选项
 * @returns {Promise<number>} 窗口ID
 */
async function createChildWindow(options = {}) {
  const api = getElectronAPI()
  if (!api) return null

  try {
    return await api.createChildWindow(options)
  } catch (error) {
    console.error('[useElectron] 创建子窗口失败:', error)
    return null
  }
}

// ============================================
// 菜单动作监听
// ============================================

/**
 * 菜单动作处理器
 * @type {Function|null}
 */
let menuActionHandler = null

/**
 * 设置菜单动作处理器
 * @param {Function} handler - 处理器函数
 */
function onMenuAction(handler) {
  menuActionHandler = handler

  const api = getElectronAPI()
  if (!api) return

  api.onMenuAction((event, { action, data }) => {
    console.log('[useElectron] 收到菜单动作:', action, data)

    if (menuActionHandler) {
      menuActionHandler(action, data)
    }

    // 内置处理
    handleBuiltInMenuActions(action, data)
  })
}

/**
 * 处理内置菜单动作
 * @param {string} action - 动作名称
 * @param {Object} data - 动作数据
 */
function handleBuiltInMenuActions(action, data) {
  switch (action) {
    case 'new-project':
      // 触发新建项目事件
      window.dispatchEvent(new CustomEvent('electron:new-project'))
      break
    case 'save-project':
      // 触发保存项目事件
      window.dispatchEvent(new CustomEvent('electron:save-project'))
      break
    case 'open-project':
      // 触发打开项目事件
      window.dispatchEvent(new CustomEvent('electron:open-project'))
      break
    case 'new-chapter':
      // 触发新建章节事件
      window.dispatchEvent(new CustomEvent('electron:new-chapter'))
      break
    case 'close-project':
      // 触发关闭项目事件
      window.dispatchEvent(new CustomEvent('electron:close-project'))
      break
    case 'undo':
      // 触发撤销事件
      document.execCommand('undo')
      break
    case 'redo':
      // 触发重做事件
      document.execCommand('redo')
      break
    case 'find':
      // 触发查找事件
      window.dispatchEvent(new CustomEvent('electron:find'))
      break
    case 'replace':
      // 触发替换事件
      window.dispatchEvent(new CustomEvent('electron:replace'))
      break
    case 'focus-mode':
      // 触发专注模式事件
      window.dispatchEvent(new CustomEvent('electron:focus-mode', { detail: data }))
      break
    case 'open-settings':
      // 触发打开设置事件
      window.dispatchEvent(new CustomEvent('electron:open-settings'))
      break
    case 'check-updates':
      checkForUpdates()
      break
    case 'toggle-sidebar':
      // 触发切换侧边栏事件
      window.dispatchEvent(new CustomEvent('electron:toggle-sidebar'))
      break
    case 'set-theme':
      // 触发设置主题事件
      window.dispatchEvent(new CustomEvent('electron:set-theme', { detail: data }))
      break
    case 'ai-continue':
      // 触发AI续写事件
      window.dispatchEvent(new CustomEvent('electron:ai-continue'))
      break
    case 'ai-rewrite':
      // 触发AI改写事件
      window.dispatchEvent(new CustomEvent('electron:ai-rewrite'))
      break
    case 'ai-expand':
      // 触发AI扩写事件
      window.dispatchEvent(new CustomEvent('electron:ai-expand'))
      break
    case 'word-count':
      // 触发字数统计事件
      window.dispatchEvent(new CustomEvent('electron:word-count'))
      break
    case 'writing-goals':
      // 触发写作目标事件
      window.dispatchEvent(new CustomEvent('electron:writing-goals'))
      break
    case 'pomodoro':
      // 触发番茄钟事件
      window.dispatchEvent(new CustomEvent('electron:pomodoro'))
      break
    case 'show-shortcuts':
      // 触发显示快捷键事件
      window.dispatchEvent(new CustomEvent('electron:show-shortcuts'))
      break
  }
}

// ============================================
// 托盘动作监听
// ============================================

/**
 * 托盘动作处理器
 * @type {Function|null}
 */
let trayActionHandler = null

/**
 * 设置托盘动作处理器
 * @param {Function} handler - 处理器函数
 */
function onTrayAction(handler) {
  trayActionHandler = handler

  const api = getElectronAPI()
  if (!api) return

  api.onTrayAction((event, { action, data }) => {
    console.log('[useElectron] 收到托盘动作:', action, data)

    if (trayActionHandler) {
      trayActionHandler(action, data)
    }

    // 内置处理
    handleBuiltInTrayActions(action, data)
  })
}

/**
 * 处理内置托盘动作
 * @param {string} action - 动作名称
 * @param {Object} data - 动作数据
 */
function handleBuiltInTrayActions(action, data) {
  switch (action) {
    case 'new-project':
      window.dispatchEvent(new CustomEvent('electron:tray-new-project'))
      break
    case 'save-project':
      window.dispatchEvent(new CustomEvent('electron:tray-save-project'))
      break
    case 'focus-mode':
      window.dispatchEvent(new CustomEvent('electron:tray-focus-mode', { detail: data }))
      break
    case 'pomodoro-start':
      window.dispatchEvent(new CustomEvent('electron:tray-pomodoro-start', { detail: data }))
      break
    case 'pomodoro-break':
      window.dispatchEvent(new CustomEvent('electron:tray-pomodoro-break', { detail: data }))
      break
    case 'pomodoro-stop':
      window.dispatchEvent(new CustomEvent('electron:tray-pomodoro-stop'))
      break
    case 'set-daily-goal':
      window.dispatchEvent(new CustomEvent('electron:tray-set-daily-goal', { detail: data }))
      break
    case 'open-settings':
      window.dispatchEvent(new CustomEvent('electron:tray-open-settings'))
      break
    case 'check-updates':
      checkForUpdates()
      break
  }
}

// ============================================
// 外部链接
// ============================================

/**
 * 在默认浏览器中打开外部链接
 * @param {string} url - 链接地址
 */
function openExternal(url) {
  const api = getElectronAPI()
  if (api && api.openExternal) {
    api.openExternal(url)
  } else {
    window.open(url, '_blank')
  }
}

// ============================================
// 组合式函数
// ============================================

export function useElectron() {
  // 在组件挂载时初始化
  onMounted(() => {
    // 检测 Electron 环境
    isElectronEnv.value = detectElectron()

    if (isElectronEnv.value) {
      // 初始化应用信息
      initAppInfo()

      // 初始化自动更新监听
      initUpdateListeners()

      // 获取最近项目列表
      getRecentProjects()

      // 监听窗口状态变化
      const api = getElectronAPI()
      if (api) {
        // 监听窗口最大化状态
        api.onWindowMaximized?.((value) => {
          isMaximized.value = value
        })

        // 监听窗口全屏状态
        api.onWindowFullscreen?.((value) => {
          isFullscreen.value = value
        })
      }
    }
  })

  return {
    // 状态
    isElectron: isElectronEnv,
    isElectronEnv,
    appVersion,
    platform,
    isDev,
    isMac,
    isWindows,
    isLinux,
    appPath,
    userDataPath,
    isMaximized,
    isFullscreen,
    hasUnsavedChanges,
    canUndo,
    canRedo,
    updateState,
    recentProjects,
    windows,

    // 计算属性
    hasUpdate,
    isUpdateReady,

    // 环境检测
    detectElectron,
    getElectronAPI,

    // 应用信息
    getAppVersion,
    getAppPath,

    // 窗口控制
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    restoreWindow,
    toggleFullscreen,
    setWindowTitle,

    // 文件操作
    openFileDialog,
    saveFileDialog,
    readFile,
    writeFile,
    saveFile,
    openFile,

    // 系统通知
    showNotification,
    showSaveSuccessNotification,
    showAutoSaveNotification,

    // 剪贴板
    readClipboard,
    writeClipboard,

    // 自动更新
    checkForUpdates,
    downloadUpdate,
    quitAndInstall,

    // 最近项目
    getRecentProjects,
    addRecentProject,

    // 窗口管理
    getAllWindows,
    focusWindow,
    createChildWindow,

    // 菜单和托盘监听
    onMenuAction,
    onTrayAction,

    // 外部链接
    openExternal
  }
}

export default useElectron

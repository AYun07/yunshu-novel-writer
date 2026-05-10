/**
 * 云书 - Electron 预加载脚本
 * 
 * 功能说明：
 * - 暴露安全的API给渲染进程
 * - 文件系统操作API
 * - 系统信息API
 * - 剪贴板API
 * - 通知API
 * - 自动更新API
 * - 上下文隔离
 * 
 * 安全说明：
 * - 使用contextBridge暴露API，确保上下文隔离
 * - 不直接暴露Node.js API，而是通过IPC通信
 * - 所有敏感操作都需要在主进程中处理
 */

const { contextBridge, ipcRenderer, clipboard, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

// ============================================
// 类型定义（供TypeScript参考）
// ============================================

/**
 * @typedef {Object} FileInfo - 文件信息
 * @property {string} name - 文件名
 * @property {string} path - 文件路径
 * @property {number} size - 文件大小（字节）
 * @property {number} createdAt - 创建时间戳
 * @property {number} modifiedAt - 修改时间戳
 * @property {boolean} isDirectory - 是否为目录
 */

/**
 * @typedef {Object} DialogResult - 文件对话框结果
 * @property {boolean} canceled - 是否取消
 * @property {string[]} filePaths - 选择的文件路径
 */

/**
 * @typedef {Object} SaveDialogResult - 保存对话框结果
 * @property {boolean} canceled - 是否取消
 * @property {string} filePath - 保存的文件路径
 */

/**
 * @typedef {Object} AppInfo - 应用信息
 * @property {string} version - 应用版本
 * @property {string} platform - 操作系统平台
 * @property {boolean} isDev - 是否为开发环境
 */

/**
 * @typedef {Object} WindowState - 窗口状态
 * @property {boolean} isMaximized - 是否最大化
 * @property {boolean} isMinimized - 是否最小化
 * @property {boolean} isFullScreen - 是否全屏
 */

/**
 * @typedef {Object} NotificationOptions - 通知选项
 * @property {string} title - 通知标题
 * @property {string} body - 通知内容
 * @property {string} [icon] - 图标路径
 * @property {boolean} [silent] - 是否静默
 */

/**
 * @typedef {Object} ProjectInfo - 项目信息
 * @property {string} id - 项目ID
 * @property {string} name - 项目名称
 * @property {string} path - 项目路径
 * @property {number} lastOpened - 最后打开时间
 */

// ============================================
// 文件系统API
// ============================================

const fileSystemAPI = {
  /**
   * 显示打开文件对话框
   * @param {Object} options - 对话框选项
   * @param {string} [options.title] - 对话框标题
   * @param {string} [options.defaultPath] - 默认路径
   * @param {string[]} [options.filters] - 文件过滤器
   * @param {boolean} [options.multiSelections] - 是否允许多选
   * @returns {Promise<DialogResult>}
   */
  showOpenDialog: (options = {}) => {
    return ipcRenderer.invoke('show-open-dialog', options);
  },

  /**
   * 显示保存文件对话框
   * @param {Object} options - 对话框选项
   * @param {string} [options.title] - 对话框标题
   * @param {string} [options.defaultPath] - 默认路径
   * @param {string[]} [options.filters] - 文件过滤器
   * @returns {Promise<SaveDialogResult>}
   */
  showSaveDialog: (options = {}) => {
    return ipcRenderer.invoke('show-save-dialog', options);
  },

  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @param {string} [encoding='utf-8'] - 编码方式
   * @returns {Promise<string|Buffer>}
   */
  readFile: (filePath, encoding = 'utf-8') => {
    return ipcRenderer.invoke('read-file', filePath, encoding);
  },

  /**
   * 写入文件内容
   * @param {string} filePath - 文件路径
   * @param {string|Buffer} content - 文件内容
   * @returns {Promise<boolean>}
   */
  writeFile: (filePath, content) => {
    return ipcRenderer.invoke('write-file', filePath, content);
  },

  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>}
   */
  exists: (filePath) => {
    return ipcRenderer.invoke('file-exists', filePath);
  },

  /**
   * 删除文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>}
   */
  deleteFile: (filePath) => {
    return ipcRenderer.invoke('delete-file', filePath);
  },

  /**
   * 获取文件信息
   * @param {string} filePath - 文件路径
   * @returns {Promise<FileInfo>}
   */
  getFileInfo: (filePath) => {
    return ipcRenderer.invoke('get-file-info', filePath);
  },

  /**
   * 列出目录内容
   * @param {string} dirPath - 目录路径
   * @returns {Promise<FileInfo[]>}
   */
  listDirectory: (dirPath) => {
    return ipcRenderer.invoke('list-directory', dirPath);
  },

  /**
   * 创建目录
   * @param {string} dirPath - 目录路径
   * @returns {Promise<boolean>}
   */
  createDirectory: (dirPath) => {
    return ipcRenderer.invoke('create-directory', dirPath);
  },

  /**
   * 复制文件
   * @param {string} source - 源文件路径
   * @param {string} destination - 目标文件路径
   * @returns {Promise<boolean>}
   */
  copyFile: (source, destination) => {
    return ipcRenderer.invoke('copy-file', source, destination);
  },

  /**
   * 移动文件
   * @param {string} source - 源文件路径
   * @param {string} destination - 目标文件路径
   * @returns {Promise<boolean>}
   */
  moveFile: (source, destination) => {
    return ipcRenderer.invoke('move-file', source, destination);
  },

  /**
   * 选择目录
   * @param {Object} options - 对话框选项
   * @returns {Promise<DialogResult>}
   */
  selectDirectory: (options = {}) => {
    return ipcRenderer.invoke('select-directory', options);
  },
};

// ============================================
// 系统信息API
// ============================================

const systemAPI = {
  /**
   * 获取应用版本
   * @returns {Promise<string>}
   */
  getVersion: () => {
    return ipcRenderer.invoke('get-app-version');
  },

  /**
   * 获取应用路径
   * @param {string} name - 路径名称（home, appData, userData, temp等）
   * @returns {Promise<string>}
   */
  getPath: (name) => {
    return ipcRenderer.invoke('get-app-path', name);
  },

  /**
   * 获取系统平台
   * @returns {string} 'darwin' | 'win32' | 'linux'
   */
  getPlatform: () => {
    return process.platform;
  },

  /**
   * 获取系统架构
   * @returns {string} 'x64' | 'arm64' | 'ia32'
   */
  getArch: () => {
    return process.arch;
  },

  /**
   * 获取应用信息
   * @returns {Promise<AppInfo>}
   */
  getAppInfo: () => {
    return ipcRenderer.invoke('get-app-info');
  },

  /**
   * 检查是否为开发环境
   * @returns {boolean}
   */
  isDev: () => {
    return process.env.NODE_ENV === 'development' || !process.env.ELECTRON_RUN_AS_NODE;
  },

  /**
   * 获取系统语言
   * @returns {string}
   */
  getLocale: () => {
    return ipcRenderer.invoke('get-locale');
  },

  /**
   * 打开外部链接
   * @param {string} url - URL地址
   */
  openExternal: (url) => {
    ipcRenderer.send('open-external', url);
  },

  /**
   * 获取用户数据目录
   * @returns {Promise<string>}
   */
  getUserDataPath: () => {
    return ipcRenderer.invoke('get-app-path', 'userData');
  },
};

// ============================================
// 剪贴板API
// ============================================

const clipboardAPI = {
  /**
   * 读取剪贴板文本
   * @returns {Promise<string>}
   */
  readText: () => {
    return ipcRenderer.invoke('read-clipboard');
  },

  /**
   * 写入剪贴板文本
   * @param {string} text - 文本内容
   */
  writeText: (text) => {
    ipcRenderer.send('write-clipboard', text);
  },

  /**
   * 读取剪贴板图片
   * @returns {Promise<string|null>} Base64编码的图片数据
   */
  readImage: () => {
    return ipcRenderer.invoke('read-clipboard-image');
  },

  /**
   * 写入剪贴板图片
   * @param {string} base64Image - Base64编码的图片数据
   */
  writeImage: (base64Image) => {
    ipcRenderer.send('write-clipboard-image', base64Image);
  },

  /**
   * 清空剪贴板
   */
  clear: () => {
    ipcRenderer.send('clear-clipboard');
  },

  /**
   * 检查剪贴板是否有内容
   * @returns {Promise<boolean>}
   */
  hasContent: () => {
    return ipcRenderer.invoke('clipboard-has-content');
  },
};

// ============================================
// 通知API
// ============================================

const notificationAPI = {
  /**
   * 显示原生通知
   * @param {NotificationOptions} options - 通知选项
   * @returns {Promise<boolean>}
   */
  show: (options) => {
    return ipcRenderer.invoke('show-notification', options);
  },

  /**
   * 检查通知权限
   * @returns {Promise<string>} 'granted' | 'denied' | 'default'
   */
  checkPermission: () => {
    return ipcRenderer.invoke('check-notification-permission');
  },

  /**
   * 请求通知权限
   * @returns {Promise<string>}
   */
  requestPermission: () => {
    return ipcRenderer.invoke('request-notification-permission');
  },

  /**
   * 写作提醒通知
   * @param {string} message - 提醒消息
   */
  showWritingReminder: (message) => {
    return ipcRenderer.invoke('show-notification', {
      title: '云书 - 写作提醒',
      body: message,
    });
  },

  /**
   * 目标达成通知
   * @param {string} goalType - 目标类型
   * @param {string} message - 消息内容
   */
  showGoalAchieved: (goalType, message) => {
    return ipcRenderer.invoke('show-notification', {
      title: `云书 - ${goalType}目标达成！`,
      body: message,
    });
  },
};

// ============================================
// 自动更新API
// ============================================

const autoUpdateAPI = {
  /**
   * 检查更新
   * @returns {Promise<Object>}
   */
  checkForUpdates: () => {
    return ipcRenderer.invoke('check-for-updates');
  },

  /**
   * 下载更新
   * @returns {Promise<void>}
   */
  downloadUpdate: () => {
    return ipcRenderer.invoke('download-update');
  },

  /**
   * 安装更新并重启
   */
  quitAndInstall: () => {
    ipcRenderer.send('quit-and-install');
  },

  /**
   * 监听更新可用事件
   * @param {Function} callback - 回调函数
   */
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', (event, info) => callback(info));
  },

  /**
   * 监听更新下载完成事件
   * @param {Function} callback - 回调函数
   */
  onUpdateDownloaded: (callback) => {
    ipcRenderer.on('update-downloaded', (event, info) => callback(info));
  },

  /**
   * 监听更新下载进度
   * @param {Function} callback - 回调函数
   */
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, progress) => callback(progress));
  },

  /**
   * 监听更新错误
   * @param {Function} callback - 回调函数
   */
  onUpdateError: (callback) => {
    ipcRenderer.on('update-error', (event, error) => callback(error));
  },

  /**
   * 移除更新事件监听
   */
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('update-available');
    ipcRenderer.removeAllListeners('update-downloaded');
    ipcRenderer.removeAllListeners('download-progress');
    ipcRenderer.removeAllListeners('update-error');
  },
};

// ============================================
// 窗口控制API
// ============================================

const windowAPI = {
  /**
   * 最小化窗口
   */
  minimize: () => {
    ipcRenderer.send('window-minimize');
  },

  /**
   * 最大化/取消最大化窗口
   */
  maximize: () => {
    ipcRenderer.send('window-maximize');
  },

  /**
   * 关闭窗口
   */
  close: () => {
    ipcRenderer.send('window-close');
  },

  /**
   * 恢复窗口
   */
  restore: () => {
    ipcRenderer.send('window-restore');
  },

  /**
   * 切换全屏
   */
  toggleFullScreen: () => {
    ipcRenderer.send('window-toggle-fullscreen');
  },

  /**
   * 获取窗口状态
   * @returns {Promise<WindowState>}
   */
  getState: () => {
    return ipcRenderer.invoke('get-window-state');
  },

  /**
   * 设置窗口标题
   * @param {string} title - 窗口标题
   */
  setTitle: (title) => {
    ipcRenderer.send('set-window-title', title);
  },

  /**
   * 监听窗口状态变化
   * @param {Function} callback - 回调函数
   */
  onStateChange: (callback) => {
    ipcRenderer.on('window-state-changed', (event, state) => callback(state));
  },

  /**
   * 移除窗口状态监听
   */
  removeStateListener: () => {
    ipcRenderer.removeAllListeners('window-state-changed');
  },
};

// ============================================
// 项目管理API
// ============================================

const projectAPI = {
  /**
   * 获取最近打开的项目
   * @returns {Promise<ProjectInfo[]>}
   */
  getRecent: () => {
    return ipcRenderer.invoke('get-recent-projects');
  },

  /**
   * 添加到最近打开
   * @param {ProjectInfo} project - 项目信息
   * @returns {Promise<boolean>}
   */
  addToRecent: (project) => {
    return ipcRenderer.invoke('add-recent-project', project);
  },

  /**
   * 清除最近打开列表
   * @returns {Promise<boolean>}
   */
  clearRecent: () => {
    return ipcRenderer.invoke('clear-recent-projects');
  },

  /**
   * 打开项目文件
   * @returns {Promise<Object|null>}
   */
  openProject: () => {
    return ipcRenderer.invoke('open-project');
  },

  /**
   * 保存项目文件
   * @param {Object} projectData - 项目数据
   * @param {string} [filePath] - 保存路径（可选）
   * @returns {Promise<string>} 保存的文件路径
   */
  saveProject: (projectData, filePath) => {
    return ipcRenderer.invoke('save-project', projectData, filePath);
  },

  /**
   * 导出项目
   * @param {Object} exportOptions - 导出选项
   * @returns {Promise<string>} 导出的文件路径
   */
  exportProject: (exportOptions) => {
    return ipcRenderer.invoke('export-project', exportOptions);
  },
};

// ============================================
// 托盘API
// ============================================

const trayAPI = {
  /**
   * 更新托盘图标
   * @param {string} iconType - 图标类型
   */
  setIcon: (iconType) => {
    ipcRenderer.send('set-tray-icon', iconType);
  },

  /**
   * 显示托盘通知
   * @param {string} title - 标题
   * @param {string} message - 消息
   */
  showMessage: (title, message) => {
    ipcRenderer.send('show-tray-message', title, message);
  },
};

// ============================================
// 快捷键API
// ============================================

const shortcutAPI = {
  /**
   * 注册全局快捷键
   * @param {string} accelerator - 快捷键组合
   * @param {Function} callback - 回调函数
   * @returns {Promise<boolean>}
   */
  register: (accelerator, callback) => {
    const id = Date.now().toString();
    
    // 存储回调函数
    shortcutCallbacks.set(id, callback);
    
    return ipcRenderer.invoke('register-shortcut', accelerator, id);
  },

  /**
   * 注销全局快捷键
   * @param {string} accelerator - 快捷键组合
   * @returns {Promise<boolean>}
   */
  unregister: (accelerator) => {
    return ipcRenderer.invoke('unregister-shortcut', accelerator);
  },

  /**
   * 注销所有快捷键
   */
  unregisterAll: () => {
    ipcRenderer.send('unregister-all-shortcuts');
  },
};

// 快捷键回调存储
const shortcutCallbacks = new Map();

// 监听快捷键触发事件
ipcRenderer.on('shortcut-triggered', (event, id) => {
  const callback = shortcutCallbacks.get(id);
  if (callback) {
    callback();
  }
});

// ============================================
// 应用事件API
// ============================================

const appAPI = {
  /**
   * 监听应用就绪事件
   * @param {Function} callback - 回调函数
   */
  onReady: (callback) => {
    ipcRenderer.on('app-ready', (event, info) => callback(info));
  },

  /**
   * 监听协议URL事件
   * @param {Function} callback - 回调函数
   */
  onProtocolUrl: (callback) => {
    ipcRenderer.on('protocol-url', (event, url) => callback(url));
  },

  /**
   * 监听应用即将退出事件
   * @param {Function} callback - 回调函数
   */
  onBeforeQuit: (callback) => {
    ipcRenderer.on('app-before-quit', () => callback());
  },

  /**
   * 移除所有事件监听
   */
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('app-ready');
    ipcRenderer.removeAllListeners('protocol-url');
    ipcRenderer.removeAllListeners('app-before-quit');
  },
};

// ============================================
// 数据存储API
// ============================================

const storeAPI = {
  /**
   * 获取存储值
   * @param {string} key - 键名
   * @param {*} [defaultValue] - 默认值
   * @returns {Promise<*>}
   */
  get: (key, defaultValue) => {
    return ipcRenderer.invoke('store-get', key, defaultValue);
  },

  /**
   * 设置存储值
   * @param {string} key - 键名
   * @param {*} value - 值
   * @returns {Promise<boolean>}
   */
  set: (key, value) => {
    return ipcRenderer.invoke('store-set', key, value);
  },

  /**
   * 删除存储值
   * @param {string} key - 键名
   * @returns {Promise<boolean>}
   */
  delete: (key) => {
    return ipcRenderer.invoke('store-delete', key);
  },

  /**
   * 检查键是否存在
   * @param {string} key - 键名
   * @returns {Promise<boolean>}
   */
  has: (key) => {
    return ipcRenderer.invoke('store-has', key);
  },

  /**
   * 清空所有存储
   * @returns {Promise<boolean>}
   */
  clear: () => {
    return ipcRenderer.invoke('store-clear');
  },

  /**
   * 获取所有键
   * @returns {Promise<string[]>}
   */
  keys: () => {
    return ipcRenderer.invoke('store-keys');
  },
};

// ============================================
// 暴露API到渲染进程
// ============================================

// 使用contextBridge安全地暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件系统
  fileSystem: fileSystemAPI,
  
  // 系统信息
  system: systemAPI,
  
  // 剪贴板
  clipboard: clipboardAPI,
  
  // 通知
  notification: notificationAPI,
  
  // 自动更新
  autoUpdate: autoUpdateAPI,
  
  // 窗口控制
  window: windowAPI,
  
  // 项目管理
  project: projectAPI,
  
  // 托盘
  tray: trayAPI,
  
  // 快捷键
  shortcut: shortcutAPI,
  
  // 应用事件
  app: appAPI,
  
  // 数据存储
  store: storeAPI,
  
  // IPC通信（底层）
  ipc: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (event, data) => callback(data));
    },
    removeListener: (channel, callback) => {
      ipcRenderer.removeListener(channel, callback);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});

// ============================================
// 开发环境调试
// ============================================

if (process.env.NODE_ENV === 'development') {
  console.log('[Preload] 预加载脚本已执行');
  console.log('[Preload] 已暴露 electronAPI 到 window');
}

// ============================================
// 导出（供其他模块使用）
// ============================================

module.exports = {
  fileSystemAPI,
  systemAPI,
  clipboardAPI,
  notificationAPI,
  autoUpdateAPI,
  windowAPI,
  projectAPI,
  trayAPI,
  shortcutAPI,
  appAPI,
  storeAPI,
};

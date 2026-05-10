/**
 * 云书 - Electron IPC 通信处理器（增强版）
 *
 * 功能说明：
 * - 文件对话框（打开、保存、导出）
 * - 剪贴板操作
 * - 系统通知
 * - 窗口控制
 * - 自动更新
 * - 文件读写
 * - 数据存储
 * - 应用信息
 * - 窗口管理
 *
 * 所有 IPC 通信都通过此模块处理，确保主进程和渲染进程之间的安全通信
 */

const { ipcMain, dialog, clipboard, shell, BrowserWindow } = require('electron');
const fs = require('fs').promises;
const path = require('path');

// ============================================
// 配置
// ============================================

/** 默认文件过滤器 */
const DEFAULT_FILTERS = {
  text: [{ name: '文本文件', extensions: ['txt'] }],
  markdown: [{ name: 'Markdown', extensions: ['md'] }],
  json: [{ name: 'JSON', extensions: ['json'] }],
  epub: [{ name: 'EPUB', extensions: ['epub'] }],
  docx: [{ name: 'Word 文档', extensions: ['docx'] }],
  pdf: [{ name: 'PDF', extensions: ['pdf'] }],
  all: [{ name: '所有文件', extensions: ['*'] }],
};

/** 支持的导入格式 */
const IMPORT_FILTERS = [
  { name: '文本文件', extensions: ['txt'] },
  { name: 'Markdown', extensions: ['md'] },
  { name: 'EPUB', extensions: ['epub'] },
  { name: 'JSON', extensions: ['json'] },
  { name: '所有文件', extensions: ['*'] },
];

/** 支持的导出格式 */
const EXPORT_FILTERS = {
  txt: [{ name: '文本文件', extensions: ['txt'] }],
  md: [{ name: 'Markdown', extensions: ['md'] }],
  docx: [{ name: 'Word 文档', extensions: ['docx'] }],
  pdf: [{ name: 'PDF', extensions: ['pdf'] }],
  epub: [{ name: 'EPUB', extensions: ['epub'] }],
  json: [{ name: 'JSON', extensions: ['json'] }],
};

// ============================================
// 文件对话框
// ============================================

/**
 * 打开文件对话框
 * @param {Object} options - 对话框选项
 * @returns {Promise<string[]>} 选择的文件路径数组
 */
async function handleOpenFileDialog(event, options = {}) {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);

  const defaultOptions = {
    title: '打开文件',
    properties: ['openFile'],
    filters: IMPORT_FILTERS,
  };

  const result = await dialog.showOpenDialog(mainWindow, {
    ...defaultOptions,
    ...options,
  });

  if (result.canceled) {
    return [];
  }

  return result.filePaths;
}

/**
 * 保存文件对话框
 * @param {Object} options - 对话框选项
 * @returns {Promise<string|null>} 保存的文件路径
 */
async function handleSaveFileDialog(event, options = {}) {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);

  const defaultOptions = {
    title: '保存文件',
    filters: DEFAULT_FILTERS.all,
  };

  const result = await dialog.showSaveDialog(mainWindow, {
    ...defaultOptions,
    ...options,
  });

  if (result.canceled) {
    return null;
  }

  return result.filePath;
}

/**
 * 打开文件夹对话框
 * @param {Object} options - 对话框选项
 * @returns {Promise<string[]>} 选择的文件夹路径数组
 */
async function handleOpenDirectoryDialog(event, options = {}) {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);

  const defaultOptions = {
    title: '选择文件夹',
    properties: ['openDirectory'],
  };

  const result = await dialog.showOpenDialog(mainWindow, {
    ...defaultOptions,
    ...options,
  });

  if (result.canceled) {
    return [];
  }

  return result.filePaths;
}

// ============================================
// 文件操作
// ============================================

/**
 * 读取文件
 * @param {string} filePath - 文件路径
 * @param {Object} options - 读取选项
 * @returns {Promise<string|Buffer>} 文件内容
 */
async function handleReadFile(event, filePath, options = {}) {
  try {
    const encoding = options.encoding || 'utf-8';
    const content = await fs.readFile(filePath, { encoding });
    return content;
  } catch (error) {
    console.error('[IPC] 读取文件失败:', error);
    throw new Error(`读取文件失败: ${error.message}`);
  }
}

/**
 * 写入文件
 * @param {string} filePath - 文件路径
 * @param {string|Buffer} content - 文件内容
 * @param {Object} options - 写入选项
 * @returns {Promise<boolean>} 是否成功
 */
async function handleWriteFile(event, filePath, content, options = {}) {
  try {
    const encoding = options.encoding || 'utf-8';

    // 确保目录存在
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(filePath, content, { encoding });
    return true;
  } catch (error) {
    console.error('[IPC] 写入文件失败:', error);
    throw new Error(`写入文件失败: ${error.message}`);
  }
}

/**
 * 检查文件是否存在
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} 是否存在
 */
async function handleFileExists(event, filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 删除文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>} 是否成功
 */
async function handleDeleteFile(event, filePath) {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('[IPC] 删除文件失败:', error);
    throw new Error(`删除文件失败: ${error.message}`);
  }
}

/**
 * 重命名文件
 * @param {string} oldPath - 原路径
 * @param {string} newPath - 新路径
 * @returns {Promise<boolean>} 是否成功
 */
async function handleRenameFile(event, oldPath, newPath) {
  try {
    await fs.rename(oldPath, newPath);
    return true;
  } catch (error) {
    console.error('[IPC] 重命名文件失败:', error);
    throw new Error(`重命名文件失败: ${error.message}`);
  }
}

/**
 * 复制文件
 * @param {string} sourcePath - 源路径
 * @param {string} destPath - 目标路径
 * @returns {Promise<boolean>} 是否成功
 */
async function handleCopyFile(event, sourcePath, destPath) {
  try {
    // 确保目标目录存在
    const dir = path.dirname(destPath);
    await fs.mkdir(dir, { recursive: true });

    await fs.copyFile(sourcePath, destPath);
    return true;
  } catch (error) {
    console.error('[IPC] 复制文件失败:', error);
    throw new Error(`复制文件失败: ${error.message}`);
  }
}

/**
 * 获取文件信息
 * @param {string} filePath - 文件路径
 * @returns {Promise<Object>} 文件信息
 */
async function handleGetFileInfo(event, filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      path: filePath,
      name: path.basename(filePath),
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    };
  } catch (error) {
    console.error('[IPC] 获取文件信息失败:', error);
    throw new Error(`获取文件信息失败: ${error.message}`);
  }
}

/**
 * 读取目录
 * @param {string} dirPath - 目录路径
 * @returns {Promise<Object[]>} 目录内容
 */
async function handleReadDirectory(event, dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isFile: entry.isFile(),
      isDirectory: entry.isDirectory(),
    }));
  } catch (error) {
    console.error('[IPC] 读取目录失败:', error);
    throw new Error(`读取目录失败: ${error.message}`);
  }
}

// ============================================
// 剪贴板操作
// ============================================

/**
 * 读取剪贴板文本
 * @returns {string} 剪贴板内容
 */
function handleReadClipboard() {
  return clipboard.readText();
}

/**
 * 写入剪贴板文本
 * @param {string} text - 要写入的文本
 */
function handleWriteClipboard(event, text) {
  clipboard.writeText(text);
}

/**
 * 读取剪贴板 HTML
 * @returns {string} HTML 内容
 */
function handleReadClipboardHTML() {
  return clipboard.readHTML();
}

/**
 * 写入剪贴板 HTML
 * @param {string} html - HTML 内容
 * @param {string} text - 纯文本内容
 */
function handleWriteClipboardHTML(event, html, text) {
  clipboard.write({ text, html });
}

/**
 * 清空剪贴板
 */
function handleClearClipboard() {
  clipboard.clear();
}

// ============================================
// 系统通知
// ============================================

/**
 * 显示系统通知
 * @param {Object} options - 通知选项
 */
function handleShowNotification(event, options) {
  const { title = '云书', body = '', icon = null } = options;

  // 使用主进程的通知
  const { Notification } = require('electron');

  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      icon: icon || undefined,
    });

    notification.on('click', () => {
      const mainWindow = BrowserWindow.fromWebContents(event.sender);
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    notification.show();
  }
}

// ============================================
// 窗口控制
// ============================================

/**
 * 最小化窗口
 */
function handleMinimizeWindow(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.minimize();
  }
}

/**
 * 最大化/取消最大化窗口
 */
function handleMaximizeWindow(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
}

/**
 * 关闭窗口
 */
function handleCloseWindow(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
}

/**
 * 恢复窗口
 */
function handleRestoreWindow(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    if (window.isMinimized()) {
      window.restore();
    }
    window.show();
    window.focus();
  }
}

/**
 * 切换全屏
 */
function handleToggleFullscreen(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.setFullScreen(!window.isFullScreen());
  }
}

/**
 * 获取窗口状态
 * @returns {Object} 窗口状态
 */
function handleGetWindowState(event) {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return null;

  return {
    isMaximized: window.isMaximized(),
    isMinimized: window.isMinimized(),
    isFullScreen: window.isFullScreen(),
    isFocused: window.isFocused(),
    isVisible: window.isVisible(),
  };
}

// ============================================
// 应用信息
// ============================================

/**
 * 获取应用版本
 * @returns {string} 应用版本
 */
function handleGetAppVersion() {
  const { app } = require('electron');
  return app.getVersion();
}

/**
 * 获取应用路径
 * @param {string} name - 路径名称
 * @returns {string} 路径
 */
function handleGetAppPath(event, name) {
  const { app } = require('electron');
  return app.getPath(name);
}

/**
 * 获取系统信息
 * @returns {Object} 系统信息
 */
function handleGetSystemInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    versions: process.versions,
    env: process.env.NODE_ENV,
  };
}

// ============================================
// 外部链接
// ============================================

/**
 * 在默认浏览器中打开外部链接
 * @param {string} url - 链接地址
 */
function handleOpenExternal(event, url) {
  shell.openExternal(url);
}

/**
 * 在文件管理器中显示文件
 * @param {string} filePath - 文件路径
 */
function handleShowItemInFolder(event, filePath) {
  shell.showItemInFolder(filePath);
}

/**
 * 打开文件
 * @param {string} filePath - 文件路径
 */
function handleOpenPath(event, filePath) {
  shell.openPath(filePath);
}

// ============================================
// 数据存储（使用 electron-store）
// ============================================

let store = null;

/**
 * 初始化存储
 */
function initStore() {
  try {
    const Store = require('electron-store');
    store = new Store({
      name: 'yunshu-data',
      defaults: {
        projects: [],
        settings: {},
        recentProjects: [],
      },
    });
    console.log('[IPC] 存储已初始化');
  } catch (error) {
    console.error('[IPC] 初始化存储失败:', error);
  }
}

/**
 * 获取存储值
 * @param {string} key - 键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储值
 */
function handleStoreGet(event, key, defaultValue) {
  if (!store) return defaultValue;
  return store.get(key, defaultValue);
}

/**
 * 设置存储值
 * @param {string} key - 键名
 * @param {*} value - 值
 */
function handleStoreSet(event, key, value) {
  if (!store) return;
  store.set(key, value);
}

/**
 * 删除存储值
 * @param {string} key - 键名
 */
function handleStoreDelete(event, key) {
  if (!store) return;
  store.delete(key);
}

/**
 * 清空存储
 */
function handleStoreClear() {
  if (!store) return;
  store.clear();
}

// ============================================
// 最近项目
// ============================================

/**
 * 获取最近打开的项目列表
 * @returns {Array} 项目列表
 */
function handleGetRecentProjects() {
  if (!store) return [];
  return store.get('recentProjects', []);
}

/**
 * 添加最近打开的项目
 * @param {Object} project - 项目信息
 */
function handleAddRecentProject(event, project) {
  if (!store) return;

  const recentProjects = store.get('recentProjects', []);

  // 移除重复项
  const filtered = recentProjects.filter((p) => p.path !== project.path);

  // 添加到开头
  filtered.unshift({
    ...project,
    lastOpened: Date.now(),
  });

  // 限制数量
  const limited = filtered.slice(0, 20);

  store.set('recentProjects', limited);
}

/**
 * 清除最近打开的项目列表
 */
function handleClearRecentProjects() {
  if (!store) return;
  store.set('recentProjects', []);
}

// ============================================
// 窗口管理
// ============================================

/**
 * 获取所有窗口
 * @returns {Array} 窗口列表
 */
function handleGetAllWindows() {
  return BrowserWindow.getAllWindows().map((w) => ({
    id: w.id,
    title: w.getTitle(),
    isVisible: w.isVisible(),
    isMinimized: w.isMinimized(),
    isFocused: w.isFocused(),
  }));
}

/**
 * 聚焦窗口
 * @param {number} windowId - 窗口ID
 */
function handleFocusWindow(event, windowId) {
  const window = BrowserWindow.fromId(windowId);
  if (window) {
    if (window.isMinimized()) {
      window.restore();
    }
    window.show();
    window.focus();
  }
}

/**
 * 创建子窗口
 * @param {Object} options - 窗口选项
 * @returns {number} 窗口ID
 */
function handleCreateChildWindow(event, options = {}) {
  const { createChildWindow } = require('./main');
  const childWindow = createChildWindow(options);
  return childWindow.id;
}

// ============================================
// 导出功能
// ============================================

/**
 * 导出为 TXT
 * @param {Object} options - 导出选项
 */
async function handleExportTxt(event, options) {
  const { content, defaultPath } = options;
  const filePath = await handleSaveFileDialog(event, {
    title: '导出为 TXT',
    defaultPath,
    filters: DEFAULT_FILTERS.text,
  });

  if (!filePath) return null;

  await handleWriteFile(event, filePath, content);
  return filePath;
}

/**
 * 导出为 Markdown
 * @param {Object} options - 导出选项
 */
async function handleExportMarkdown(event, options) {
  const { content, defaultPath } = options;
  const filePath = await handleSaveFileDialog(event, {
    title: '导出为 Markdown',
    defaultPath,
    filters: DEFAULT_FILTERS.markdown,
  });

  if (!filePath) return null;

  await handleWriteFile(event, filePath, content);
  return filePath;
}

// ============================================
// 注册所有 IPC 处理器
// ============================================

/**
 * 注册所有 IPC 处理器
 * @param {Object} deps - 依赖对象
 */
function registerIpcHandlers(deps = {}) {
  // 初始化存储
  initStore();

  // 文件对话框
  ipcMain.handle('dialog:openFile', handleOpenFileDialog);
  ipcMain.handle('dialog:saveFile', handleSaveFileDialog);
  ipcMain.handle('dialog:openDirectory', handleOpenDirectoryDialog);

  // 文件操作
  ipcMain.handle('file:read', handleReadFile);
  ipcMain.handle('file:write', handleWriteFile);
  ipcMain.handle('file:exists', handleFileExists);
  ipcMain.handle('file:delete', handleDeleteFile);
  ipcMain.handle('file:rename', handleRenameFile);
  ipcMain.handle('file:copy', handleCopyFile);
  ipcMain.handle('file:getInfo', handleGetFileInfo);
  ipcMain.handle('file:readDirectory', handleReadDirectory);

  // 剪贴板
  ipcMain.handle('clipboard:readText', handleReadClipboard);
  ipcMain.on('clipboard:writeText', handleWriteClipboard);
  ipcMain.handle('clipboard:readHTML', handleReadClipboardHTML);
  ipcMain.on('clipboard:writeHTML', handleWriteClipboardHTML);
  ipcMain.on('clipboard:clear', handleClearClipboard);

  // 系统通知
  ipcMain.on('notification:show', handleShowNotification);

  // 窗口控制
  ipcMain.on('window:minimize', handleMinimizeWindow);
  ipcMain.on('window:maximize', handleMaximizeWindow);
  ipcMain.on('window:close', handleCloseWindow);
  ipcMain.on('window:restore', handleRestoreWindow);
  ipcMain.on('window:toggleFullscreen', handleToggleFullscreen);
  ipcMain.handle('window:getState', handleGetWindowState);

  // 应用信息
  ipcMain.handle('app:getVersion', handleGetAppVersion);
  ipcMain.handle('app:getPath', handleGetAppPath);
  ipcMain.handle('app:getSystemInfo', handleGetSystemInfo);

  // 外部链接
  ipcMain.on('shell:openExternal', handleOpenExternal);
  ipcMain.on('shell:showItemInFolder', handleShowItemInFolder);
  ipcMain.on('shell:openPath', handleOpenPath);

  // 存储
  ipcMain.handle('store:get', handleStoreGet);
  ipcMain.on('store:set', handleStoreSet);
  ipcMain.on('store:delete', handleStoreDelete);
  ipcMain.on('store:clear', handleStoreClear);

  // 最近项目
  ipcMain.handle('recent:getProjects', handleGetRecentProjects);
  ipcMain.handle('recent:addProject', handleAddRecentProject);
  ipcMain.on('recent:clearProjects', handleClearRecentProjects);

  // 窗口管理
  ipcMain.handle('windows:getAll', handleGetAllWindows);
  ipcMain.on('windows:focus', handleFocusWindow);
  ipcMain.handle('windows:createChild', handleCreateChildWindow);

  // 导出
  ipcMain.handle('export:txt', handleExportTxt);
  ipcMain.handle('export:markdown', handleExportMarkdown);

  console.log('[IPC] 所有 IPC 处理器已注册');
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  registerIpcHandlers,

  // 文件对话框
  handleOpenFileDialog,
  handleSaveFileDialog,
  handleOpenDirectoryDialog,

  // 文件操作
  handleReadFile,
  handleWriteFile,
  handleFileExists,
  handleDeleteFile,
  handleRenameFile,
  handleCopyFile,
  handleGetFileInfo,
  handleReadDirectory,

  // 剪贴板
  handleReadClipboard,
  handleWriteClipboard,

  // 系统通知
  handleShowNotification,

  // 窗口控制
  handleMinimizeWindow,
  handleMaximizeWindow,
  handleCloseWindow,
  handleRestoreWindow,
  handleToggleFullscreen,

  // 应用信息
  handleGetAppVersion,
  handleGetAppPath,

  // 外部链接
  handleOpenExternal,

  // 存储
  initStore,
  handleStoreGet,
  handleStoreSet,

  // 最近项目
  handleGetRecentProjects,
  handleAddRecentProject,
};

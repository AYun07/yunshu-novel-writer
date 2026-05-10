/**
 * 云书 - Electron 主进程（增强版）
 *
 * 功能说明：
 * - 创建和管理 BrowserWindow 窗口
 * - 窗口状态恢复（位置、大小、最大化）
 * - 多窗口管理
 * - 全局快捷键（Cmd/Ctrl+N 新建，Cmd/Ctrl+S 保存等）
 * - 系统托盘右键菜单完善
 * - 自动更新检查（使用 electron-updater）
 * - 崩溃报告
 * - 性能监控
 *
 * 依赖安装：
 * npm install electron electron-builder concurrently wait-on electron-store electron-updater --save-dev
 */

const { app, BrowserWindow, ipcMain, dialog, clipboard, globalShortcut, nativeImage, crashReporter, powerMonitor } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// 导入自定义模块
const { createTray, destroyTray, updateTrayIcon } = require('./tray.cjs');
const { createMenu, updateMenuState } = require('./menu.cjs');
const { initStore, getStore, saveWindowState, getWindowState, getRecentProjects, addRecentProject } = require('./store.cjs');
const { registerIpcHandlers } = require('./ipcHandlers.cjs');

// ============================================
// 全局变量
// ============================================

/** @type {BrowserWindow|null} 主窗口实例 */
let mainWindow = null;

/** @type {Map<number, BrowserWindow>} 子窗口管理器 */
const childWindows = new Map();

/** @type {boolean} 是否为开发环境 */
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

/** @type {boolean} 应用是否准备退出 */
let isQuitting = false;

/** @type {string} 开发服务器地址 */
const DEV_SERVER_URL = 'http://localhost:7520';

/** @type {string} 打包后的文件路径 */
const PRODUCTION_INDEX_PATH = path.join(__dirname, '../dist/index.html');

/** @type {Object} 应用配置 */
let appConfig = null;

// ============================================
// 崩溃报告配置
// ============================================

/**
 * 初始化崩溃报告
 */
function initCrashReporter() {
  crashReporter.start({
    productName: '云书',
    companyName: 'YunShu Team',
    submitUrl: 'https://yunshu.app/api/crash-report',
    uploadToServer: !isDev,
    compress: true,
    ignoreSystemCrashHandler: false,
    extra: {
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch
    }
  });

  console.log('[Main] 崩溃报告已初始化');
}

// ============================================
// 性能监控
// ============================================

/**
 * 初始化性能监控
 */
function initPerformanceMonitor() {
  // 监控内存使用
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const usageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);

    // 如果内存使用超过 500MB，记录警告
    if (usageMB > 500) {
      console.warn('[Main] 内存使用较高:', usageMB, 'MB');
    }
  }, 60000); // 每分钟检查一次

  // 监控电源状态
  powerMonitor.on('suspend', () => {
    console.log('[Main] 系统即将进入睡眠');
    // 保存当前状态
    if (mainWindow) {
      saveWindowState({
        width: mainWindow.getSize()[0],
        height: mainWindow.getSize()[1],
        x: mainWindow.getPosition()[0],
        y: mainWindow.getPosition()[1],
        isMaximized: mainWindow.isMaximized()
      });
    }
  });

  powerMonitor.on('resume', () => {
    console.log('[Main] 系统从睡眠中恢复');
  });

  console.log('[Main] 性能监控已初始化');
}

// ============================================
// 窗口创建与管理
// ============================================

/**
 * 创建主窗口
 * @returns {BrowserWindow} 窗口实例
 */
function createMainWindow() {
  // 获取保存的窗口状态
  const windowState = getWindowState();

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    // 窗口标题
    title: '云书 - AI智能小说创作平台',

    // 窗口尺寸（使用保存的状态或默认值）
    width: windowState.width || 1400,
    height: windowState.height || 900,

    // 窗口位置（使用保存的状态）
    x: windowState.x,
    y: windowState.y,

    // 最小尺寸
    minWidth: 1024,
    minHeight: 768,

    // 窗口外观
    backgroundColor: '#1a1a2e', // 深色背景，与应用主题一致
    icon: getIconPath(),

    // 窗口行为
    show: false, // 先隐藏，等内容加载后再显示（避免白屏）
    frame: true, // 使用原生窗口框架
    titleBarStyle: 'default', // 默认标题栏样式

    // Web相关配置
    webPreferences: {
      // 预加载脚本
      preload: path.join(__dirname, 'preload.cjs'),

      // 启用上下文隔离（安全最佳实践）
      contextIsolation: true,

      // 禁用Node.js集成（安全最佳实践）
      nodeIntegration: false,

      // 启用远程模块（已废弃，不推荐使用）
      enableRemoteModule: false,

      // 沙箱模式
      sandbox: false,

      // Web安全
      webSecurity: true,

      // 允许运行不安全内容（开发时可能需要）
      allowRunningInsecureContent: isDev,

      // 启用拼写检查
      spellcheck: true,

      // 启用 WebSQL
      enableWebSQL: false
    },
  });

  // 窗口准备就绪时显示（避免白屏）
  mainWindow.once('ready-to-show', () => {
    // 恢复最大化状态
    if (windowState.isMaximized) {
      mainWindow.maximize();
    }
    mainWindow.show();

    // 开发环境下自动打开开发者工具
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // 加载页面内容
  loadPage();

  // 设置窗口事件监听
  setupWindowEvents();

  // 创建应用菜单
  createMenu(mainWindow);

  // 创建系统托盘
  createTray(mainWindow);

  // 注册全局快捷键
  registerGlobalShortcuts();

  // 注册IPC处理器
  registerIpcHandlers({
    mainWindow,
    store: { getStore, addRecentProject, getRecentProjects },
    menu: { updateMenuState },
    tray: { updateTrayIcon }
  });

  return mainWindow;
}

/**
 * 创建子窗口
 * @param {Object} options - 窗口选项
 * @returns {BrowserWindow} 窗口实例
 */
function createChildWindow(options = {}) {
  const {
    width = 800,
    height = 600,
    title = '云书',
    url = '',
    modal = false,
    parent = mainWindow
  } = options;

  const childWindow = new BrowserWindow({
    width,
    height,
    title,
    parent: modal ? parent : null,
    modal,
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 加载内容
  if (url) {
    if (isDev) {
      childWindow.loadURL(`${DEV_SERVER_URL}${url}`);
    } else {
      childWindow.loadFile(PRODUCTION_INDEX_PATH, { hash: url });
    }
  }

  // 保存到子窗口管理器
  childWindows.set(childWindow.id, childWindow);

  // 窗口关闭时移除
  childWindow.on('closed', () => {
    childWindows.delete(childWindow.id);
  });

  return childWindow;
}

/**
 * 获取所有窗口
 * @returns {BrowserWindow[]} 窗口数组
 */
function getAllWindows() {
  return [mainWindow, ...childWindows.values()].filter(Boolean);
}

/**
 * 加载页面内容
 */
async function loadPage() {
  try {
    if (isDev) {
      // 开发环境：加载开发服务器
      console.log('[Main] 加载开发服务器:', DEV_SERVER_URL);
      await mainWindow.loadURL(DEV_SERVER_URL);
    } else {
      // 生产环境：加载打包后的文件
      console.log('[Main] 加载生产文件:', PRODUCTION_INDEX_PATH);
      await mainWindow.loadFile(PRODUCTION_INDEX_PATH);
    }
  } catch (error) {
    console.error('[Main] 加载页面失败:', error);

    // 显示错误对话框
    dialog.showErrorBox(
      '加载失败',
      `无法加载应用页面：${error.message}\n\n请检查网络连接或重新启动应用。`
    );
  }
}

/**
 * 获取图标路径
 * @returns {string|null} 图标文件路径
 */
function getIconPath() {
  // 图标路径（根据平台不同）
  const iconPaths = {
    darwin: path.join(__dirname, '../public/icon.icns'),  // macOS
    win32: path.join(__dirname, '../public/icon.ico'),    // Windows
    linux: path.join(__dirname, '../public/icon.png'),    // Linux
  };

  const iconPath = iconPaths[process.platform];

  // 检查图标文件是否存在
  if (iconPath && fs.existsSync(iconPath)) {
    return iconPath;
  }

  // 尝试使用PNG作为备选
  const pngPath = path.join(__dirname, '../public/favicon.svg');
  if (fs.existsSync(pngPath)) {
    return pngPath;
  }

  return null;
}

/**
 * 设置窗口事件监听
 */
function setupWindowEvents() {
  // 窗口关闭事件
  mainWindow.on('close', (event) => {
    // 如果不是真正退出，则最小化到托盘
    if (!isQuitting) {
      event.preventDefault();

      // macOS: 隐藏窗口
      // Windows/Linux: 最小化到托盘
      if (process.platform === 'darwin') {
        mainWindow.hide();
      } else {
        mainWindow.minimize();
        mainWindow.hide();
      }

      // 显示托盘通知（首次时）
      const store = getStore();
      if (!store.get('hasShownTrayNotification')) {
        updateTrayIcon('云书仍在后台运行，点击托盘图标可恢复窗口。');
        store.set('hasShownTrayNotification', true);
      }
    }
  });

  // 窗口关闭完成事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 窗口移动事件（保存状态）
  mainWindow.on('moved', () => {
    if (!mainWindow.isMaximized()) {
      const [x, y] = mainWindow.getPosition();
      saveWindowState({ x, y });
    }
  });

  // 窗口大小改变事件（保存状态）
  mainWindow.on('resized', () => {
    if (!mainWindow.isMaximized()) {
      const [width, height] = mainWindow.getSize();
      saveWindowState({ width, height });
    }
  });

  // 窗口最大化事件
  mainWindow.on('maximize', () => {
    saveWindowState({ isMaximized: true });
  });

  // 窗口取消最大化事件
  mainWindow.on('unmaximize', () => {
    saveWindowState({ isMaximized: false });
  });

  // 窗口获得焦点事件
  mainWindow.on('focus', () => {
    // 更新菜单状态
    updateMenuState('focused', true);
  });

  // 窗口失去焦点事件
  mainWindow.on('blur', () => {
    updateMenuState('focused', false);
  });

  // 导航事件（防止意外导航）
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // 在生产环境中，阻止所有导航（防止用户离开应用）
    if (!isDev && !url.startsWith('file://')) {
      event.preventDefault();
      console.warn('[Main] 阻止导航到:', url);
    }
  });

  // 新窗口请求（在默认浏览器中打开外部链接）
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // 允许特定域名在应用内打开
    const allowedDomains = ['localhost', '127.0.0.1'];
    const urlObj = new URL(url);

    if (allowedDomains.includes(urlObj.hostname)) {
      return { action: 'allow' };
    }

    // 其他链接在默认浏览器中打开
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  // 页面加载完成事件
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Main] 页面加载完成');

    // 发送应用就绪事件给渲染进程
    mainWindow.webContents.send('app-ready', {
      version: app.getVersion(),
      platform: process.platform,
      isDev: isDev,
      appPath: app.getAppPath(),
      userDataPath: app.getPath('userData')
    });
  });

  // 页面加载失败事件
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[Main] 页面加载失败:', errorCode, errorDescription);
  });

  // 渲染进程崩溃
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Main] 渲染进程崩溃:', details);

    dialog.showErrorBox(
      '渲染进程崩溃',
      `应用渲染进程意外终止：${details.reason}\n\n请重新启动应用。`
    );
  });

  // 控制台消息（开发环境）
  if (isDev) {
    mainWindow.webContents.on('console-message', (event, level, message) => {
      console.log('[Renderer]', message);
    });
  }
}

// ============================================
// 全局快捷键
// ============================================

/**
 * 注册全局快捷键
 */
function registerGlobalShortcuts() {
  // Command/Ctrl + Shift + I: 切换开发者工具
  const devToolsKey = process.platform === 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I';
  globalShortcut.register(devToolsKey, () => {
    if (mainWindow) {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // Command/Ctrl + Shift + R: 强制刷新
  const refreshKey = process.platform === 'darwin' ? 'Command+Shift+R' : 'Ctrl+Shift+R';
  globalShortcut.register(refreshKey, () => {
    if (mainWindow) {
      mainWindow.webContents.reloadIgnoringCache();
    }
  });

  // Command/Ctrl + N: 新建项目
  const newKey = process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N';
  globalShortcut.register(newKey, () => {
    if (mainWindow) {
      mainWindow.webContents.send('menu-action', { action: 'new-project' });
    }
  });

  // Command/Ctrl + S: 保存
  const saveKey = process.platform === 'darwin' ? 'Command+S' : 'Ctrl+S';
  globalShortcut.register(saveKey, () => {
    if (mainWindow) {
      mainWindow.webContents.send('menu-action', { action: 'save-project' });
    }
  });

  // Command/Ctrl + O: 打开项目
  const openKey = process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O';
  globalShortcut.register(openKey, () => {
    if (mainWindow) {
      mainWindow.webContents.send('menu-action', { action: 'open-project' });
    }
  });

  // Command/Ctrl + Shift + N: 新建章节
  const newChapterKey = process.platform === 'darwin' ? 'Command+Shift+N' : 'Ctrl+Shift+N';
  globalShortcut.register(newChapterKey, () => {
    if (mainWindow) {
      mainWindow.webContents.send('menu-action', { action: 'new-chapter' });
    }
  });

  // Command/Ctrl + M: 最小化窗口
  const minimizeKey = process.platform === 'darwin' ? 'Command+M' : 'Ctrl+M';
  globalShortcut.register(minimizeKey, () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  // Command/Ctrl + W: 关闭项目/窗口
  const closeKey = process.platform === 'darwin' ? 'Command+W' : 'Ctrl+W';
  globalShortcut.register(closeKey, () => {
    if (mainWindow) {
      mainWindow.webContents.send('menu-action', { action: 'close-project' });
    }
  });

  // F11: 全屏切换
  globalShortcut.register('F11', () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  // Escape: 退出全屏
  globalShortcut.register('Escape', () => {
    if (mainWindow && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  console.log('[Main] 全局快捷键已注册');
}

/**
 * 注销所有全局快捷键
 */
function unregisterAllShortcuts() {
  globalShortcut.unregisterAll();
  console.log('[Main] 全局快捷键已注销');
}

// ============================================
// 自动更新
// ============================================

/**
 * 初始化自动更新
 */
function initAutoUpdater() {
  // 配置自动更新
  autoUpdater.logger = console;
  autoUpdater.autoDownload = false; // 不自动下载，提示用户
  autoUpdater.autoInstallOnAppQuit = true;

  // 检查更新事件
  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] 正在检查更新...');
    if (mainWindow) {
      mainWindow.webContents.send('update-checking');
    }
  });

  // 有可用更新
  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] 发现新版本:', info.version);

    if (mainWindow) {
      mainWindow.webContents.send('update-available', info);
    }

    // 显示更新对话框
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '发现新版本',
      message: `云书 ${info.version} 现已可用`,
      detail: `当前版本: ${app.getVersion()}\n新版本: ${info.version}\n\n是否立即下载更新？`,
      buttons: ['立即下载', '稍后提醒'],
      defaultId: 0,
      cancelId: 1
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  // 没有可用更新
  autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] 当前已是最新版本');
    if (mainWindow) {
      mainWindow.webContents.send('update-not-available', info);
    }
  });

  // 下载进度
  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent);
    console.log('[AutoUpdater] 下载进度:', percent, '%');

    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progressObj);
    }
  });

  // 更新下载完成
  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] 更新下载完成');

    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', info);
    }

    // 显示安装对话框
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: '更新已就绪',
      message: '新版本已下载完成',
      detail: '更新将在下次启动时自动安装。是否立即重启应用？',
      buttons: ['立即重启', '稍后重启'],
      defaultId: 0,
      cancelId: 1
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // 更新错误
  autoUpdater.on('error', (error) => {
    console.error('[AutoUpdater] 更新错误:', error);

    if (mainWindow) {
      mainWindow.webContents.send('update-error', error.message);
    }
  });

  // 检查更新（生产环境）
  if (!isDev) {
    // 启动时检查更新
    setTimeout(() => {
      checkForUpdates();
    }, 5000);

    // 每24小时检查一次更新
    setInterval(() => {
      checkForUpdates();
    }, 24 * 60 * 60 * 1000);
  }

  console.log('[Main] 自动更新已初始化');
}

/**
 * 检查更新
 */
function checkForUpdates() {
  if (isDev) {
    console.log('[AutoUpdater] 开发环境跳过更新检查');
    return;
  }

  autoUpdater.checkForUpdates().catch((error) => {
    console.error('[AutoUpdater] 检查更新失败:', error);
  });
}

/**
 * 下载更新
 */
function downloadUpdate() {
  return autoUpdater.downloadUpdate();
}

/**
 * 安装更新并重启
 */
function quitAndInstall() {
  autoUpdater.quitAndInstall();
}

// ============================================
// IPC通信处理（主进程侧）
// ============================================

/**
 * 注册主进程IPC监听器
 */
function registerMainIpcListeners() {
  // 获取应用版本
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // 获取应用路径
  ipcMain.handle('get-app-path', (event, name) => {
    return app.getPath(name);
  });

  // 窗口控制
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.on('window-restore', () => {
    if (mainWindow) {
      mainWindow.restore();
      mainWindow.focus();
    }
  });

  // 创建子窗口
  ipcMain.handle('create-child-window', (event, options) => {
    const childWindow = createChildWindow(options);
    return childWindow.id;
  });

  // 关闭子窗口
  ipcMain.on('close-child-window', (event, windowId) => {
    const window = childWindows.get(windowId);
    if (window) {
      window.close();
    }
  });

  // 打开外部链接
  ipcMain.on('open-external', (event, url) => {
    require('electron').shell.openExternal(url);
  });

  // 获取剪贴板内容
  ipcMain.handle('read-clipboard', () => {
    return clipboard.readText();
  });

  // 写入剪贴板
  ipcMain.on('write-clipboard', (event, text) => {
    clipboard.writeText(text);
  });

  // 获取最近打开的项目
  ipcMain.handle('get-recent-projects', () => {
    return getRecentProjects();
  });

  // 添加最近打开的项目
  ipcMain.handle('add-recent-project', (event, project) => {
    addRecentProject(project);
    return true;
  });

  // 检查更新
  ipcMain.handle('check-for-updates', () => {
    checkForUpdates();
    return true;
  });

  // 下载更新
  ipcMain.handle('download-update', () => {
    return downloadUpdate();
  });

  // 安装更新
  ipcMain.on('quit-and-install', () => {
    quitAndInstall();
  });

  // 获取所有窗口
  ipcMain.handle('get-all-windows', () => {
    return getAllWindows().map(w => ({
      id: w.id,
      title: w.getTitle(),
      isVisible: w.isVisible(),
      isMinimized: w.isMinimized(),
      isFocused: w.isFocused()
    }));
  });

  // 聚焦窗口
  ipcMain.on('focus-window', (event, windowId) => {
    const window = BrowserWindow.fromId(windowId);
    if (window) {
      if (window.isMinimized()) {
        window.restore();
      }
      window.show();
      window.focus();
    }
  });

  console.log('[Main] 主进程IPC监听器已注册');
}

// ============================================
// 应用生命周期
// ============================================

// 应用准备就绪
app.whenReady().then(() => {
  console.log('[Main] 应用准备就绪');

  // 初始化存储
  initStore();

  // 初始化崩溃报告
  initCrashReporter();

  // 初始化性能监控
  initPerformanceMonitor();

  // 创建主窗口
  createMainWindow();

  // 注册主进程IPC监听器
  registerMainIpcListeners();

  // 初始化自动更新
  initAutoUpdater();

  // macOS: 点击Dock图标时重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

// 所有窗口关闭时退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  // macOS: 保持应用运行，直到用户明确退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用即将退出
app.on('before-quit', () => {
  isQuitting = true;

  // 注销全局快捷键
  unregisterAllShortcuts();

  // 销毁托盘
  destroyTray();
});

// 应用已退出
app.on('will-quit', () => {
  console.log('[Main] 应用即将退出');
});

// 渲染进程崩溃
app.on('render-process-gone', (event, webContents, details) => {
  console.error('[Main] 渲染进程崩溃:', details);

  // 显示错误对话框
  dialog.showErrorBox(
    '渲染进程崩溃',
    `应用渲染进程意外终止：${details.reason}\n\n请重新启动应用。`
  );
});

// GPU进程崩溃
app.on('gpu-process-crashed', (event, killed) => {
  console.error('[Main] GPU进程崩溃, killed:', killed);
});

// 第二个实例启动（单实例锁定）
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // 如果已经有实例运行，则退出
  console.log('[Main] 已有实例运行，退出当前实例');
  app.quit();
} else {
  // 当第二个实例启动时，聚焦到已有窗口
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }

    // 处理命令行参数（如打开文件）
    const filePath = commandLine.find(arg => arg.endsWith('.yunshu') || arg.endsWith('.json'));
    if (filePath && mainWindow) {
      mainWindow.webContents.send('open-file', filePath);
    }
  });
}

// 处理协议（如 yunshu://）
app.setAsDefaultProtocolClient('yunshu');

// 处理来自协议的URL
app.on('open-url', (event, url) => {
  event.preventDefault();

  // 解析URL并处理
  console.log('[Main] 收到协议URL:', url);

  // 发送给渲染进程
  if (mainWindow) {
    mainWindow.webContents.send('protocol-url', url);
  }
});

// 处理打开文件（macOS）
app.on('open-file', (event, filePath) => {
  event.preventDefault();

  console.log('[Main] 收到文件:', filePath);

  if (mainWindow) {
    mainWindow.webContents.send('open-file', filePath);
  } else {
    // 如果窗口还没准备好，先保存路径
    app.once('ready', () => {
      if (mainWindow) {
        mainWindow.webContents.send('open-file', filePath);
      }
    });
  }
});

// ============================================
// 导出模块
// ============================================

module.exports = {
  getMainWindow: () => mainWindow,
  getAllWindows,
  createChildWindow,
  isDev,
  createMainWindow,
  checkForUpdates,
  downloadUpdate,
  quitAndInstall
};

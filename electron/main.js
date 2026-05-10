/**
 * 云书 - Electron 主进程
 * 
 * 功能说明：
 * - 创建和管理BrowserWindow窗口
 * - 加载开发服务器或打包后的文件
 * - 系统托盘（Tray）支持
 * - 全局快捷键注册
 * - 原生菜单（Menu）
 * - 窗口状态保存/恢复（位置、大小、最大化状态）
 * - 开发者工具快捷键
 * - 自动更新检查准备
 * - IPC通信处理
 * - 文件对话框（打开/保存项目文件）
 * - 剪贴板操作
 * 
 * 依赖安装说明（不需要执行，仅供参考）：
 * npm install electron electron-builder concurrently wait-on electron-store --save-dev
 * 或使用 pnpm：
 * pnpm add -D electron electron-builder concurrently wait-on electron-store
 */

const { app, BrowserWindow, ipcMain, dialog, clipboard, globalShortcut, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// 导入自定义模块
const { createTray, destroyTray, updateTrayIcon } = require('./tray');
const { createMenu, updateMenuState } = require('./menu');
const { initStore, getStore, saveWindowState, getWindowState, getRecentProjects, addRecentProject } = require('./store');
const { registerIpcHandlers } = require('./ipcHandlers');

// ============================================
// 全局变量
// ============================================

/** @type {BrowserWindow|null} 主窗口实例 */
let mainWindow = null;

/** @type {boolean} 是否为开发环境 */
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

/** @type {boolean} 应用是否准备退出 */
let isQuitting = false;

/** @type {string} 开发服务器地址 */
const DEV_SERVER_URL = 'http://localhost:5173';

/** @type {string} 打包后的文件路径 */
const PRODUCTION_INDEX_PATH = path.join(__dirname, '../dist/index.html');

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
      preload: path.join(__dirname, 'preload.js'),
      
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
  registerIpcHandlers();

  return mainWindow;
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
    });
  });

  // 页面加载失败事件
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[Main] 页面加载失败:', errorCode, errorDescription);
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

  // Command/Ctrl + M: 最小化窗口
  const minimizeKey = process.platform === 'darwin' ? 'Command+M' : 'Ctrl+M';
  globalShortcut.register(minimizeKey, () => {
    if (mainWindow) {
      mainWindow.minimize();
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
 * 注意：需要配置electron-updater
 */
function initAutoUpdate() {
  // 自动更新逻辑（需要安装 electron-updater）
  // const { autoUpdater } = require('electron-updater');
  
  // autoUpdater.checkForUpdatesAndNotify();
  
  // autoUpdater.on('update-available', () => {
  //   mainWindow.webContents.send('update-available');
  // });
  
  // autoUpdater.on('update-downloaded', () => {
  //   mainWindow.webContents.send('update-downloaded');
  // });
  
  console.log('[Main] 自动更新检查已初始化');
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
  
  // 创建主窗口
  createMainWindow();
  
  // 注册主进程IPC监听器
  registerMainIpcListeners();
  
  // 初始化自动更新（生产环境）
  if (!isDev) {
    initAutoUpdate();
  }

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

// ============================================
// 导出模块
// ============================================

module.exports = {
  getMainWindow: () => mainWindow,
  isDev,
  createMainWindow,
};

/**
 * 云书 - Electron IPC 处理器模块
 * 
 * 功能说明：
 * - 文件操作（打开、保存、导出）
 * - 项目管理（创建、打开、保存）
 * - 剪贴板操作
 * - 通知
 * - 自动更新检查
 * - 系统信息
 * 
 * IPC通信模式：
 * - ipcRenderer.invoke() -> ipcMain.handle() : 异步请求-响应
 * - ipcRenderer.send() -> ipcMain.on() : 异步单向通信
 * - ipcMain.send() -> ipcRenderer.on() : 主进程向渲染进程发送
 */

const { ipcMain, dialog, app, clipboard, nativeImage, Notification, shell } = require('electron');
const fs = require('fs');
const path = require('path');

// ============================================
// 全局变量
// ============================================

/** @type {BrowserWindow|null} 主窗口引用 */
let mainWindowRef = null;

/** @type {Object} 存储模块引用 */
let storeRef = null;

/** @type {Object} 菜单模块引用 */
let menuRef = null;

/** @type {Object} 托盘模块引用 */
let trayRef = null;

// ============================================
// 初始化
// ============================================

/**
 * 注册所有IPC处理器
 * @param {Object} options - 选项对象
 * @param {BrowserWindow} options.mainWindow - 主窗口实例
 * @param {Object} options.store - 存储模块
 * @param {Object} options.menu - 菜单模块
 * @param {Object} options.tray - 托盘模块
 */
function registerIpcHandlers(options = {}) {
  // 保存引用
  mainWindowRef = options.mainWindow || null;
  storeRef = options.store || null;
  menuRef = options.menu || null;
  trayRef = options.tray || null;
  
  // 注册各类处理器
  registerFileHandlers();
  registerProjectHandlers();
  registerClipboardHandlers();
  registerNotificationHandlers();
  registerStoreHandlers();
  registerWindowHandlers();
  registerSystemHandlers();
  registerShortcutHandlers();
  registerUpdateHandlers();
  
  console.log('[IPC] 所有IPC处理器已注册');
}

// ============================================
// 文件操作处理器
// ============================================

/**
 * 注册文件操作相关处理器
 */
function registerFileHandlers() {
  // 显示打开文件对话框
  ipcMain.handle('show-open-dialog', async (event, options) => {
    const defaultOptions = {
      title: '打开文件',
      defaultPath: app.getPath('documents'),
      properties: ['openFile'],
      filters: [
        { name: '云书项目', extensions: ['yunshu', 'json'] },
        { name: '文本文档', extensions: ['txt'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    };
    
    const result = await dialog.showOpenDialog(mainWindowRef, {
      ...defaultOptions,
      ...options,
    });
    
    return result;
  });
  
  // 显示保存文件对话框
  ipcMain.handle('show-save-dialog', async (event, options) => {
    const defaultOptions = {
      title: '保存文件',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: '云书项目', extensions: ['yunshu'] },
        { name: 'JSON文件', extensions: ['json'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    };
    
    const result = await dialog.showSaveDialog(mainWindowRef, {
      ...defaultOptions,
      ...options,
    });
    
    return result;
  });
  
  // 读取文件
  ipcMain.handle('read-file', async (event, filePath, encoding = 'utf-8') => {
    try {
      const content = fs.readFileSync(filePath, encoding);
      return content;
    } catch (error) {
      console.error('[IPC] 读取文件失败:', error);
      throw error;
    }
  });
  
  // 写入文件
  ipcMain.handle('write-file', async (event, filePath, content) => {
    try {
      // 确保目录存在
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      console.error('[IPC] 写入文件失败:', error);
      throw error;
    }
  });
  
  // 检查文件是否存在
  ipcMain.handle('file-exists', async (event, filePath) => {
    return fs.existsSync(filePath);
  });
  
  // 删除文件
  ipcMain.handle('delete-file', async (event, filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (error) {
      console.error('[IPC] 删除文件失败:', error);
      throw error;
    }
  });
  
  // 获取文件信息
  ipcMain.handle('get-file-info', async (event, filePath) => {
    try {
      const stats = fs.statSync(filePath);
      return {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        createdAt: stats.birthtimeMs,
        modifiedAt: stats.mtimeMs,
        isDirectory: stats.isDirectory(),
      };
    } catch (error) {
      console.error('[IPC] 获取文件信息失败:', error);
      throw error;
    }
  });
  
  // 列出目录内容
  ipcMain.handle('list-directory', async (event, dirPath) => {
    try {
      const files = fs.readdirSync(dirPath);
      return files.map(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtimeMs,
          modifiedAt: stats.mtimeMs,
          isDirectory: stats.isDirectory(),
        };
      });
    } catch (error) {
      console.error('[IPC] 列出目录失败:', error);
      throw error;
    }
  });
  
  // 创建目录
  ipcMain.handle('create-directory', async (event, dirPath) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      return true;
    } catch (error) {
      console.error('[IPC] 创建目录失败:', error);
      throw error;
    }
  });
  
  // 复制文件
  ipcMain.handle('copy-file', async (event, source, destination) => {
    try {
      // 确保目标目录存在
      const dir = path.dirname(destination);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.copyFileSync(source, destination);
      return true;
    } catch (error) {
      console.error('[IPC] 复制文件失败:', error);
      throw error;
    }
  });
  
  // 移动文件
  ipcMain.handle('move-file', async (event, source, destination) => {
    try {
      // 确保目标目录存在
      const dir = path.dirname(destination);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.renameSync(source, destination);
      return true;
    } catch (error) {
      console.error('[IPC] 移动文件失败:', error);
      throw error;
    }
  });
  
  // 选择目录
  ipcMain.handle('select-directory', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindowRef, {
      title: '选择目录',
      properties: ['openDirectory', 'createDirectory'],
      ...options,
    });
    
    return result;
  });
  
  console.log('[IPC] 文件操作处理器已注册');
}

// ============================================
// 项目管理处理器
// ============================================

/**
 * 注册项目管理相关处理器
 */
function registerProjectHandlers() {
  // 打开项目
  ipcMain.handle('open-project', async (event) => {
    const result = await dialog.showOpenDialog(mainWindowRef, {
      title: '打开项目',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: '云书项目', extensions: ['yunshu', 'json'] },
        { name: '所有文件', extensions: ['*'] },
      ],
      properties: ['openFile'],
    });
    
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    
    const filePath = result.filePaths[0];
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const projectData = JSON.parse(content);
      
      // 添加到最近项目
      if (storeRef) {
        storeRef.addRecentProject({
          id: projectData.id || Date.now().toString(),
          name: projectData.name || path.basename(filePath, path.extname(filePath)),
          path: filePath,
        });
      }
      
      return {
        filePath,
        data: projectData,
      };
    } catch (error) {
      console.error('[IPC] 打开项目失败:', error);
      throw error;
    }
  });
  
  // 保存项目
  ipcMain.handle('save-project', async (event, projectData, filePath) => {
    // 如果没有指定路径，显示保存对话框
    if (!filePath) {
      const result = await dialog.showSaveDialog(mainWindowRef, {
        title: '保存项目',
        defaultPath: app.getPath('documents'),
        filters: [
          { name: '云书项目', extensions: ['yunshu'] },
          { name: 'JSON文件', extensions: ['json'] },
        ],
      });
      
      if (result.canceled || !result.filePath) {
        return null;
      }
      
      filePath = result.filePath;
    }
    
    try {
      const content = JSON.stringify(projectData, null, 2);
      fs.writeFileSync(filePath, content, 'utf-8');
      
      // 添加到最近项目
      if (storeRef) {
        storeRef.addRecentProject({
          id: projectData.id || Date.now().toString(),
          name: projectData.name || path.basename(filePath, path.extname(filePath)),
          path: filePath,
        });
      }
      
      return filePath;
    } catch (error) {
      console.error('[IPC] 保存项目失败:', error);
      throw error;
    }
  });
  
  // 导出项目
  ipcMain.handle('export-project', async (event, exportOptions) => {
    const { format, content, defaultName } = exportOptions;
    
    // 根据格式设置过滤器
    const filters = {
      txt: [{ name: '文本文档', extensions: ['txt'] }],
      docx: [{ name: 'Word文档', extensions: ['docx'] }],
      pdf: [{ name: 'PDF文档', extensions: ['pdf'] }],
      epub: [{ name: 'EPUB电子书', extensions: ['epub'] }],
    };
    
    const result = await dialog.showSaveDialog(mainWindowRef, {
      title: '导出项目',
      defaultPath: path.join(app.getPath('documents'), defaultName || '未命名'),
      filters: filters[format] || filters.txt,
    });
    
    if (result.canceled || !result.filePath) {
      return null;
    }
    
    try {
      // 根据格式处理内容
      if (format === 'txt') {
        fs.writeFileSync(result.filePath, content, 'utf-8');
      } else {
        // 其他格式需要渲染进程处理
        // 这里只返回路径，实际写入由渲染进程完成
        return result.filePath;
      }
      
      return result.filePath;
    } catch (error) {
      console.error('[IPC] 导出项目失败:', error);
      throw error;
    }
  });
  
  // 获取最近打开的项目
  ipcMain.handle('get-recent-projects', async (event) => {
    if (storeRef) {
      return storeRef.getRecentProjects();
    }
    return [];
  });
  
  // 添加最近打开的项目
  ipcMain.handle('add-recent-project', async (event, project) => {
    if (storeRef) {
      storeRef.addRecentProject(project);
      return true;
    }
    return false;
  });
  
  // 清除最近打开的项目列表
  ipcMain.handle('clear-recent-projects', async (event) => {
    if (storeRef) {
      storeRef.clearRecentProjects();
      return true;
    }
    return false;
  });
  
  console.log('[IPC] 项目管理处理器已注册');
}

// ============================================
// 剪贴板处理器
// ============================================

/**
 * 注册剪贴板相关处理器
 */
function registerClipboardHandlers() {
  // 读取剪贴板文本
  ipcMain.handle('read-clipboard', async (event) => {
    return clipboard.readText();
  });
  
  // 写入剪贴板文本
  ipcMain.on('write-clipboard', (event, text) => {
    clipboard.writeText(text);
  });
  
  // 读取剪贴板图片
  ipcMain.handle('read-clipboard-image', async (event) => {
    const image = clipboard.readImage();
    if (image.isEmpty()) {
      return null;
    }
    return image.toDataURL();
  });
  
  // 写入剪贴板图片
  ipcMain.on('write-clipboard-image', (event, base64Image) => {
    const image = nativeImage.createFromDataURL(base64Image);
    clipboard.writeImage(image);
  });
  
  // 清空剪贴板
  ipcMain.on('clear-clipboard', (event) => {
    clipboard.clear();
  });
  
  // 检查剪贴板是否有内容
  ipcMain.handle('clipboard-has-content', async (event) => {
    return !clipboard.readText().isEmpty() || !clipboard.readImage().isEmpty();
  });
  
  console.log('[IPC] 剪贴板处理器已注册');
}

// ============================================
// 通知处理器
// ============================================

/**
 * 注册通知相关处理器
 */
function registerNotificationHandlers() {
  // 显示通知
  ipcMain.handle('show-notification', async (event, options) => {
    if (!Notification.isSupported()) {
      console.warn('[IPC] 系统不支持通知');
      return false;
    }
    
    const notification = new Notification({
      title: options.title || '云书',
      body: options.body || '',
      icon: options.icon ? nativeImage.createFromPath(options.icon) : undefined,
      silent: options.silent || false,
    });
    
    notification.on('click', () => {
      // 点击通知时显示窗口
      if (mainWindowRef) {
        if (mainWindowRef.isMinimized()) {
          mainWindowRef.restore();
        }
        mainWindowRef.show();
        mainWindowRef.focus();
      }
    });
    
    notification.show();
    return true;
  });
  
  // 检查通知权限
  ipcMain.handle('check-notification-permission', async (event) => {
    // Electron中通知权限由系统管理
    return Notification.isSupported() ? 'granted' : 'denied';
  });
  
  // 请求通知权限
  ipcMain.handle('request-notification-permission', async (event) => {
    // Electron中无法主动请求权限
    return Notification.isSupported() ? 'granted' : 'denied';
  });
  
  console.log('[IPC] 通知处理器已注册');
}

// ============================================
// 存储处理器
// ============================================

/**
 * 注册存储相关处理器
 */
function registerStoreHandlers() {
  // 获取存储值
  ipcMain.handle('store-get', async (event, key, defaultValue) => {
    if (storeRef) {
      const store = storeRef.getStore();
      return store.get(key, defaultValue);
    }
    return defaultValue;
  });
  
  // 设置存储值
  ipcMain.handle('store-set', async (event, key, value) => {
    if (storeRef) {
      const store = storeRef.getStore();
      store.set(key, value);
      return true;
    }
    return false;
  });
  
  // 删除存储值
  ipcMain.handle('store-delete', async (event, key) => {
    if (storeRef) {
      const store = storeRef.getStore();
      store.delete(key);
      return true;
    }
    return false;
  });
  
  // 检查键是否存在
  ipcMain.handle('store-has', async (event, key) => {
    if (storeRef) {
      const store = storeRef.getStore();
      return store.has(key);
    }
    return false;
  });
  
  // 清空所有存储
  ipcMain.handle('store-clear', async (event) => {
    if (storeRef) {
      const store = storeRef.getStore();
      store.clear();
      return true;
    }
    return false;
  });
  
  // 获取所有键
  ipcMain.handle('store-keys', async (event) => {
    if (storeRef) {
      const store = storeRef.getStore();
      const config = store.getAll();
      return Object.keys(config);
    }
    return [];
  });
  
  console.log('[IPC] 存储处理器已注册');
}

// ============================================
// 窗口控制处理器
// ============================================

/**
 * 注册窗口控制相关处理器
 */
function registerWindowHandlers() {
  // 最小化窗口
  ipcMain.on('window-minimize', (event) => {
    if (mainWindowRef) {
      mainWindowRef.minimize();
    }
  });
  
  // 最大化/取消最大化窗口
  ipcMain.on('window-maximize', (event) => {
    if (mainWindowRef) {
      if (mainWindowRef.isMaximized()) {
        mainWindowRef.unmaximize();
      } else {
        mainWindowRef.maximize();
      }
    }
  });
  
  // 关闭窗口
  ipcMain.on('window-close', (event) => {
    if (mainWindowRef) {
      mainWindowRef.close();
    }
  });
  
  // 恢复窗口
  ipcMain.on('window-restore', (event) => {
    if (mainWindowRef) {
      mainWindowRef.restore();
      mainWindowRef.show();
      mainWindowRef.focus();
    }
  });
  
  // 切换全屏
  ipcMain.on('window-toggle-fullscreen', (event) => {
    if (mainWindowRef) {
      mainWindowRef.setFullScreen(!mainWindowRef.isFullScreen());
    }
  });
  
  // 获取窗口状态
  ipcMain.handle('get-window-state', async (event) => {
    if (mainWindowRef) {
      return {
        isMaximized: mainWindowRef.isMaximized(),
        isMinimized: mainWindowRef.isMinimized(),
        isFullScreen: mainWindowRef.isFullScreen(),
        isVisible: mainWindowRef.isVisible(),
        isFocused: mainWindowRef.isFocused(),
      };
    }
    return null;
  });
  
  // 设置窗口标题
  ipcMain.on('set-window-title', (event, title) => {
    if (mainWindowRef) {
      mainWindowRef.setTitle(title);
    }
  });
  
  console.log('[IPC] 窗口控制处理器已注册');
}

// ============================================
// 系统信息处理器
// ============================================

/**
 * 注册系统信息相关处理器
 */
function registerSystemHandlers() {
  // 获取应用版本
  ipcMain.handle('get-app-version', async (event) => {
    return app.getVersion();
  });
  
  // 获取应用路径
  ipcMain.handle('get-app-path', async (event, name) => {
    try {
      return app.getPath(name || 'userData');
    } catch (error) {
      console.error('[IPC] 获取应用路径失败:', error);
      return null;
    }
  });
  
  // 获取应用信息
  ipcMain.handle('get-app-info', async (event) => {
    return {
      name: app.name,
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      isPackaged: app.isPackaged,
      appPath: app.getAppPath(),
      userDataPath: app.getPath('userData'),
    };
  });
  
  // 获取系统语言
  ipcMain.handle('get-locale', async (event) => {
    return app.getLocale();
  });
  
  // 打开外部链接
  ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
  });
  
  // 在文件管理器中显示
  ipcMain.handle('show-item-in-folder', async (event, filePath) => {
    shell.showItemInFolder(filePath);
    return true;
  });
  
  // 打开路径
  ipcMain.handle('open-path', async (event, filePath) => {
    shell.openPath(filePath);
    return true;
  });
  
  console.log('[IPC] 系统信息处理器已注册');
}

// ============================================
// 快捷键处理器
// ============================================

/**
 * 注册快捷键相关处理器
 */
function registerShortcutHandlers() {
  const { globalShortcut } = require('electron');
  
  // 存储快捷键回调ID映射
  const shortcutCallbacks = new Map();
  
  // 注册全局快捷键
  ipcMain.handle('register-shortcut', async (event, accelerator, callbackId) => {
    try {
      // 检查是否已注册
      if (globalShortcut.isRegistered(accelerator)) {
        console.warn('[IPC] 快捷键已注册:', accelerator);
        return false;
      }
      
      // 注册快捷键
      const result = globalShortcut.register(accelerator, () => {
        // 发送事件到渲染进程
        if (mainWindowRef) {
          mainWindowRef.webContents.send('shortcut-triggered', callbackId);
        }
      });
      
      if (result) {
        shortcutCallbacks.set(accelerator, callbackId);
      }
      
      return result;
    } catch (error) {
      console.error('[IPC] 注册快捷键失败:', error);
      return false;
    }
  });
  
  // 注销全局快捷键
  ipcMain.handle('unregister-shortcut', async (event, accelerator) => {
    try {
      globalShortcut.unregister(accelerator);
      shortcutCallbacks.delete(accelerator);
      return true;
    } catch (error) {
      console.error('[IPC] 注销快捷键失败:', error);
      return false;
    }
  });
  
  // 注销所有快捷键
  ipcMain.on('unregister-all-shortcuts', (event) => {
    globalShortcut.unregisterAll();
    shortcutCallbacks.clear();
  });
  
  console.log('[IPC] 快捷键处理器已注册');
}

// ============================================
// 自动更新处理器
// ============================================

/**
 * 注册自动更新相关处理器
 */
function registerUpdateHandlers() {
  // 检查更新
  ipcMain.handle('check-for-updates', async (event) => {
    // 注意：需要安装 electron-updater
    // const { autoUpdater } = require('electron-updater');
    
    try {
      // 模拟检查更新
      // 实际使用时取消注释以下代码
      // const result = await autoUpdater.checkForUpdates();
      // return result;
      
      console.log('[IPC] 检查更新（模拟）');
      return {
        available: false,
        version: app.getVersion(),
        releaseDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[IPC] 检查更新失败:', error);
      throw error;
    }
  });
  
  // 下载更新
  ipcMain.handle('download-update', async (event) => {
    // 注意：需要安装 electron-updater
    // const { autoUpdater } = require('electron-updater');
    
    try {
      // 实际使用时取消注释以下代码
      // await autoUpdater.downloadUpdate();
      
      console.log('[IPC] 下载更新（模拟）');
      return true;
    } catch (error) {
      console.error('[IPC] 下载更新失败:', error);
      throw error;
    }
  });
  
  // 安装更新并重启
  ipcMain.on('quit-and-install', (event) => {
    // 注意：需要安装 electron-updater
    // const { autoUpdater } = require('electron-updater');
    // autoUpdater.quitAndInstall();
    
    console.log('[IPC] 安装更新并重启（模拟）');
  });
  
  console.log('[IPC] 自动更新处理器已注册');
}

// ============================================
// 工具函数
// ============================================

/**
 * 设置主窗口引用
 * @param {BrowserWindow} mainWindow - 主窗口实例
 */
function setMainWindow(mainWindow) {
  mainWindowRef = mainWindow;
}

/**
 * 设置存储模块引用
 * @param {Object} store - 存储模块
 */
function setStore(store) {
  storeRef = store;
}

/**
 * 设置菜单模块引用
 * @param {Object} menu - 菜单模块
 */
function setMenu(menu) {
  menuRef = menu;
}

/**
 * 设置托盘模块引用
 * @param {Object} tray - 托盘模块
 */
function setTray(tray) {
  trayRef = tray;
}

/**
 * 发送消息到渲染进程
 * @param {string} channel - 频道名称
 * @param {*} data - 数据
 */
function sendToRenderer(channel, data) {
  if (mainWindowRef && mainWindowRef.webContents) {
    mainWindowRef.webContents.send(channel, data);
  }
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  // 主函数
  registerIpcHandlers,
  
  // 设置引用
  setMainWindow,
  setStore,
  setMenu,
  setTray,
  
  // 工具函数
  sendToRenderer,
};

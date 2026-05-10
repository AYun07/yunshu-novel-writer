/**
 * 云书 - 桌面端 API 封装模块
 * 
 * 功能说明：
 * - 检测是否在 Electron 环境
 * - 封装 Electron API 供渲染进程使用
 * - 文件操作 API
 * - 系统托盘控制
 * - 全局快捷键
 * - 原生通知
 * - 窗口控制（最小化、最大化、关闭）
 * - 自动更新
 * - 提供非 Electron 环境的降级方案
 * 
 * 使用方式：
 * import { desktopAPI } from '@/utils/desktopAPI';
 * 
 * // 检测环境
 * if (desktopAPI.isElectron) {
 *   // 使用 Electron 特有功能
 *   desktopAPI.window.minimize();
 * }
 */

// ============================================
// 环境检测
// ============================================

/**
 * 检测是否在 Electron 环境中运行
 * @returns {boolean}
 */
function checkIsElectron() {
  // 在非浏览器环境直接返回false
  if (typeof globalThis === 'undefined') {
    return false;
  }
  
  // 检查 window.electronAPI 是否存在（由 preload.js 注入）
  try {
    if (typeof globalThis.window !== 'undefined' && globalThis.window.electronAPI) {
      return true;
    }
  } catch (e) {
    // 忽略错误
  }
  
  // 检查 process 对象（可能被禁用）
  try {
    if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
      return true;
    }
  } catch (e) {
    // 忽略错误
  }
  
  return false;
}

/** @type {boolean} 是否在 Electron 环境 */
export const isElectron = checkIsElectron();

// ============================================
// 文件操作 API
// ============================================

export const fileSystem = {
  /**
   * 显示打开文件对话框
   * @param {Object} options - 对话框选项
   * @returns {Promise<Object>} 对话框结果
   */
  async showOpenDialog(options = {}) {
    if (!isElectron) {
      // Web 环境降级：使用 input[type="file"]
      return this._webFilePicker(options);
    }
    
    return window.electronAPI.fileSystem.showOpenDialog(options);
  },
  
  /**
   * 显示保存文件对话框
   * @param {Object} options - 对话框选项
   * @returns {Promise<Object>} 对话框结果
   */
  async showSaveDialog(options = {}) {
    if (!isElectron) {
      // Web 环境降级：使用 download 属性
      return { canceled: false, filePath: null };
    }
    
    return window.electronAPI.fileSystem.showSaveDialog(options);
  },
  
  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @param {string} [encoding='utf-8'] - 编码方式
   * @returns {Promise<string|Buffer>}
   */
  async readFile(filePath, encoding = 'utf-8') {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.readFile(filePath, encoding);
  },
  
  /**
   * 写入文件内容
   * @param {string} filePath - 文件路径
   * @param {string|Buffer} content - 文件内容
   * @returns {Promise<boolean>}
   */
  async writeFile(filePath, content) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.writeFile(filePath, content);
  },
  
  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>}
   */
  async exists(filePath) {
    if (!isElectron) {
      return false;
    }
    
    return window.electronAPI.fileSystem.exists(filePath);
  },
  
  /**
   * 删除文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.deleteFile(filePath);
  },
  
  /**
   * 获取文件信息
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>}
   */
  async getFileInfo(filePath) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.getFileInfo(filePath);
  },
  
  /**
   * 列出目录内容
   * @param {string} dirPath - 目录路径
   * @returns {Promise<Array>}
   */
  async listDirectory(dirPath) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.listDirectory(dirPath);
  },
  
  /**
   * 创建目录
   * @param {string} dirPath - 目录路径
   * @returns {Promise<boolean>}
   */
  async createDirectory(dirPath) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.createDirectory(dirPath);
  },
  
  /**
   * 复制文件
   * @param {string} source - 源文件路径
   * @param {string} destination - 目标文件路径
   * @returns {Promise<boolean>}
   */
  async copyFile(source, destination) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.copyFile(source, destination);
  },
  
  /**
   * 移动文件
   * @param {string} source - 源文件路径
   * @param {string} destination - 目标文件路径
   * @returns {Promise<boolean>}
   */
  async moveFile(source, destination) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.moveFile(source, destination);
  },
  
  /**
   * 选择目录
   * @param {Object} options - 对话框选项
   * @returns {Promise<Object>}
   */
  async selectDirectory(options = {}) {
    if (!isElectron) {
      throw new Error('文件系统操作仅在桌面端可用');
    }
    
    return window.electronAPI.fileSystem.selectDirectory(options);
  },
  
  /**
   * Web 环境文件选择器（降级方案）
   * @private
   * @param {Object} options - 选项
   * @returns {Promise<Object>}
   */
  _webFilePicker(options) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options.multiSelections || false;
      
      if (options.filters && options.filters.length > 0) {
        input.accept = options.filters
          .flatMap(f => f.extensions.map(ext => `.${ext}`))
          .join(',');
      }
      
      input.onchange = (e) => {
        const files = Array.from(e.target.files || []);
        resolve({
          canceled: files.length === 0,
          filePaths: files.map(f => f.name), // Web 环境只能获取文件名
          files: files, // 附加 File 对象
        });
      };
      
      input.click();
    });
  },
};

// ============================================
// 系统信息 API
// ============================================

export const system = {
  /**
   * 获取应用版本
   * @returns {Promise<string>}
   */
  async getVersion() {
    if (!isElectron) {
      // Web 环境：从 package.json 或 meta 标签获取
      return import.meta.env.VITE_APP_VERSION || '2.0.0';
    }
    
    return window.electronAPI.system.getVersion();
  },
  
  /**
   * 获取应用路径
   * @param {string} name - 路径名称
   * @returns {Promise<string>}
   */
  async getPath(name) {
    if (!isElectron) {
      return '';
    }
    
    return window.electronAPI.system.getPath(name);
  },
  
  /**
   * 获取系统平台
   * @returns {string} 'darwin' | 'win32' | 'linux' | 'web'
   */
  getPlatform() {
    if (!isElectron) {
      // Web 环境检测
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('mac')) return 'darwin';
      if (ua.includes('win')) return 'win32';
      if (ua.includes('linux')) return 'linux';
      return 'web';
    }
    
    return window.electronAPI.system.getPlatform();
  },
  
  /**
   * 获取系统架构
   * @returns {string}
   */
  getArch() {
    if (!isElectron) {
      return 'unknown';
    }
    
    return window.electronAPI.system.getArch();
  },
  
  /**
   * 获取应用信息
   * @returns {Promise<Object>}
   */
  async getAppInfo() {
    if (!isElectron) {
      return {
        name: '云书',
        version: import.meta.env.VITE_APP_VERSION || '2.0.0',
        platform: this.getPlatform(),
        arch: 'unknown',
        isPackaged: false,
        isWeb: true,
      };
    }
    
    return window.electronAPI.system.getAppInfo();
  },
  
  /**
   * 检查是否为开发环境
   * @returns {boolean}
   */
  isDev() {
    if (!isElectron) {
      return import.meta.env.DEV;
    }
    
    return window.electronAPI.system.isDev();
  },
  
  /**
   * 获取系统语言
   * @returns {Promise<string>}
   */
  async getLocale() {
    if (!isElectron) {
      return navigator.language || 'zh-CN';
    }
    
    return window.electronAPI.system.getLocale();
  },
  
  /**
   * 打开外部链接
   * @param {string} url - URL 地址
   */
  openExternal(url) {
    if (!isElectron) {
      // Web 环境：直接打开新窗口
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    window.electronAPI.system.openExternal(url);
  },
  
  /**
   * 获取用户数据目录
   * @returns {Promise<string>}
   */
  async getUserDataPath() {
    if (!isElectron) {
      return '';
    }
    
    return window.electronAPI.system.getUserDataPath();
  },
};

// ============================================
// 剪贴板 API
// ============================================

export const clipboard = {
  /**
   * 读取剪贴板文本
   * @returns {Promise<string>}
   */
  async readText() {
    if (!isElectron) {
      // Web 环境：使用 Clipboard API
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        console.warn('无法读取剪贴板:', error);
        return '';
      }
    }
    
    return window.electronAPI.clipboard.readText();
  },
  
  /**
   * 写入剪贴板文本
   * @param {string} text - 文本内容
   */
  async writeText(text) {
    if (!isElectron) {
      // Web 环境：使用 Clipboard API
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.warn('无法写入剪贴板:', error);
      }
      return;
    }
    
    window.electronAPI.clipboard.writeText(text);
  },
  
  /**
   * 读取剪贴板图片
   * @returns {Promise<string|null>} Base64 编码的图片数据
   */
  async readImage() {
    if (!isElectron) {
      // Web 环境不支持直接读取剪贴板图片
      return null;
    }
    
    return window.electronAPI.clipboard.readImage();
  },
  
  /**
   * 写入剪贴板图片
   * @param {string} base64Image - Base64 编码的图片数据
   */
  writeImage(base64Image) {
    if (!isElectron) {
      console.warn('Web 环境不支持写入剪贴板图片');
      return;
    }
    
    window.electronAPI.clipboard.writeImage(base64Image);
  },
  
  /**
   * 清空剪贴板
   */
  clear() {
    if (!isElectron) {
      this.writeText('');
      return;
    }
    
    window.electronAPI.clipboard.clear();
  },
  
  /**
   * 检查剪贴板是否有内容
   * @returns {Promise<boolean>}
   */
  async hasContent() {
    if (!isElectron) {
      // Web 环境无法可靠检测
      return false;
    }
    
    return window.electronAPI.clipboard.hasContent();
  },
};

// ============================================
// 通知 API
// ============================================

export const notification = {
  /**
   * 显示原生通知
   * @param {Object} options - 通知选项
   * @param {string} options.title - 标题
   * @param {string} options.body - 内容
   * @param {string} [options.icon] - 图标路径
   * @param {boolean} [options.silent] - 是否静默
   * @returns {Promise<boolean>}
   */
  async show(options) {
    if (!isElectron) {
      // Web 环境：使用 Web Notifications API
      if (!('Notification' in window)) {
        console.warn('浏览器不支持通知');
        return false;
      }
      
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('通知权限未授予');
          return false;
        }
        
        new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          silent: options.silent,
        });
        
        return true;
      } catch (error) {
        console.error('显示通知失败:', error);
        return false;
      }
    }
    
    return window.electronAPI.notification.show(options);
  },
  
  /**
   * 检查通知权限
   * @returns {Promise<string>} 'granted' | 'denied' | 'default'
   */
  async checkPermission() {
    if (!isElectron) {
      if (!('Notification' in window)) {
        return 'denied';
      }
      return Notification.permission;
    }
    
    return window.electronAPI.notification.checkPermission();
  },
  
  /**
   * 请求通知权限
   * @returns {Promise<string>}
   */
  async requestPermission() {
    if (!isElectron) {
      if (!('Notification' in window)) {
        return 'denied';
      }
      return Notification.requestPermission();
    }
    
    return window.electronAPI.notification.requestPermission();
  },
  
  /**
   * 显示写作提醒通知
   * @param {string} message - 提醒消息
   */
  async showWritingReminder(message) {
    return this.show({
      title: '云书 - 写作提醒',
      body: message,
    });
  },
  
  /**
   * 显示目标达成通知
   * @param {string} goalType - 目标类型
   * @param {string} message - 消息内容
   */
  async showGoalAchieved(goalType, message) {
    return this.show({
      title: `云书 - ${goalType}目标达成！`,
      body: message,
    });
  },
};

// ============================================
// 窗口控制 API
// ============================================

export const window = {
  /**
   * 最小化窗口
   */
  minimize() {
    if (!isElectron) {
      console.warn('窗口控制仅在桌面端可用');
      return;
    }
    
    window.electronAPI.window.minimize();
  },
  
  /**
   * 最大化/取消最大化窗口
   */
  maximize() {
    if (!isElectron) {
      console.warn('窗口控制仅在桌面端可用');
      return;
    }
    
    window.electronAPI.window.maximize();
  },
  
  /**
   * 关闭窗口
   */
  close() {
    if (!isElectron) {
      // Web 环境：尝试关闭窗口
      window.close();
      return;
    }
    
    window.electronAPI.window.close();
  },
  
  /**
   * 恢复窗口
   */
  restore() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.window.restore();
  },
  
  /**
   * 切换全屏
   */
  toggleFullScreen() {
    if (!isElectron) {
      // Web 环境：使用 Fullscreen API
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
      return;
    }
    
    window.electronAPI.window.toggleFullScreen();
  },
  
  /**
   * 获取窗口状态
   * @returns {Promise<Object>}
   */
  async getState() {
    if (!isElectron) {
      return {
        isMaximized: false,
        isMinimized: false,
        isFullScreen: !!document.fullscreenElement,
        isVisible: true,
        isFocused: document.hasFocus(),
      };
    }
    
    return window.electronAPI.window.getState();
  },
  
  /**
   * 设置窗口标题
   * @param {string} title - 窗口标题
   */
  setTitle(title) {
    if (!isElectron) {
      document.title = title;
      return;
    }
    
    window.electronAPI.window.setTitle(title);
  },
  
  /**
   * 监听窗口状态变化
   * @param {Function} callback - 回调函数
   */
  onStateChange(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.window.onStateChange(callback);
  },
  
  /**
   * 移除窗口状态监听
   */
  removeStateListener() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.window.removeStateListener();
  },
};

// ============================================
// 项目管理 API
// ============================================

export const project = {
  /**
   * 获取最近打开的项目
   * @returns {Promise<Array>}
   */
  async getRecent() {
    if (!isElectron) {
      // Web 环境：从 localStorage 获取
      try {
        const recent = localStorage.getItem('yunshu_recent_projects');
        return recent ? JSON.parse(recent) : [];
      } catch (error) {
        return [];
      }
    }
    
    return window.electronAPI.project.getRecent();
  },
  
  /**
   * 添加到最近打开
   * @param {Object} project - 项目信息
   * @returns {Promise<boolean>}
   */
  async addToRecent(project) {
    if (!isElectron) {
      // Web 环境：保存到 localStorage
      try {
        const recent = await this.getRecent();
        const filtered = recent.filter(p => p.path !== project.path);
        filtered.unshift({
          ...project,
          lastOpened: Date.now(),
        });
        localStorage.setItem('yunshu_recent_projects', JSON.stringify(filtered.slice(0, 20)));
        return true;
      } catch (error) {
        return false;
      }
    }
    
    return window.electronAPI.project.addToRecent(project);
  },
  
  /**
   * 清除最近打开列表
   * @returns {Promise<boolean>}
   */
  async clearRecent() {
    if (!isElectron) {
      localStorage.removeItem('yunshu_recent_projects');
      return true;
    }
    
    return window.electronAPI.project.clearRecent();
  },
  
  /**
   * 打开项目文件
   * @returns {Promise<Object|null>}
   */
  async openProject() {
    if (!isElectron) {
      throw new Error('项目文件操作仅在桌面端可用');
    }
    
    return window.electronAPI.project.openProject();
  },
  
  /**
   * 保存项目文件
   * @param {Object} projectData - 项目数据
   * @param {string} [filePath] - 保存路径
   * @returns {Promise<string>} 保存的文件路径
   */
  async saveProject(projectData, filePath) {
    if (!isElectron) {
      throw new Error('项目文件操作仅在桌面端可用');
    }
    
    return window.electronAPI.project.saveProject(projectData, filePath);
  },
  
  /**
   * 导出项目
   * @param {Object} exportOptions - 导出选项
   * @returns {Promise<string>} 导出的文件路径
   */
  async exportProject(exportOptions) {
    if (!isElectron) {
      throw new Error('项目导出仅在桌面端可用');
    }
    
    return window.electronAPI.project.exportProject(exportOptions);
  },
};

// ============================================
// 托盘 API
// ============================================

export const tray = {
  /**
   * 更新托盘图标
   * @param {string} iconType - 图标类型 ('normal' | 'unread' | 'writing')
   */
  setIcon(iconType) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.tray.setIcon(iconType);
  },
  
  /**
   * 显示托盘通知
   * @param {string} title - 标题
   * @param {string} message - 消息
   */
  showMessage(title, message) {
    if (!isElectron) {
      // 降级为普通通知
      notification.show({ title, body: message });
      return;
    }
    
    window.electronAPI.tray.showMessage(title, message);
  },
};

// ============================================
// 快捷键 API
// ============================================

export const shortcut = {
  /**
   * 注册全局快捷键
   * @param {string} accelerator - 快捷键组合
   * @param {Function} callback - 回调函数
   * @returns {Promise<boolean>}
   */
  async register(accelerator, callback) {
    if (!isElectron) {
      console.warn('全局快捷键仅在桌面端可用');
      return false;
    }
    
    return window.electronAPI.shortcut.register(accelerator, callback);
  },
  
  /**
   * 注销全局快捷键
   * @param {string} accelerator - 快捷键组合
   * @returns {Promise<boolean>}
   */
  async unregister(accelerator) {
    if (!isElectron) {
      return false;
    }
    
    return window.electronAPI.shortcut.unregister(accelerator);
  },
  
  /**
   * 注销所有快捷键
   */
  unregisterAll() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.shortcut.unregisterAll();
  },
};

// ============================================
// 自动更新 API
// ============================================

export const autoUpdate = {
  /**
   * 检查更新
   * @returns {Promise<Object>}
   */
  async checkForUpdates() {
    if (!isElectron) {
      // Web 环境返回当前版本
      return {
        available: false,
        version: await system.getVersion(),
      };
    }
    
    return window.electronAPI.autoUpdate.checkForUpdates();
  },
  
  /**
   * 下载更新
   * @returns {Promise<void>}
   */
  async downloadUpdate() {
    if (!isElectron) {
      return;
    }
    
    return window.electronAPI.autoUpdate.downloadUpdate();
  },
  
  /**
   * 安装更新并重启
   */
  quitAndInstall() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.autoUpdate.quitAndInstall();
  },
  
  /**
   * 监听更新可用事件
   * @param {Function} callback - 回调函数
   */
  onUpdateAvailable(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.autoUpdate.onUpdateAvailable(callback);
  },
  
  /**
   * 监听更新下载完成事件
   * @param {Function} callback - 回调函数
   */
  onUpdateDownloaded(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.autoUpdate.onUpdateDownloaded(callback);
  },
  
  /**
   * 监听更新下载进度
   * @param {Function} callback - 回调函数
   */
  onDownloadProgress(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.autoUpdate.onDownloadProgress(callback);
  },
  
  /**
   * 监听更新错误
   * @param {Function} callback - 回调函数
   */
  onUpdateError(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.autoUpdate.onUpdateError(callback);
  },
  
  /**
   * 移除所有更新事件监听
   */
  removeAllListeners() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.autoUpdate.removeAllListeners();
  },
};

// ============================================
// 数据存储 API
// ============================================

export const store = {
  /**
   * 获取存储值
   * @param {string} key - 键名
   * @param {*} [defaultValue] - 默认值
   * @returns {Promise<*>}
   */
  async get(key, defaultValue) {
    if (!isElectron) {
      // Web 环境：使用 localStorage
      try {
        const value = localStorage.getItem(`yunshu_${key}`);
        return value !== null ? JSON.parse(value) : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    }
    
    return window.electronAPI.store.get(key, defaultValue);
  },
  
  /**
   * 设置存储值
   * @param {string} key - 键名
   * @param {*} value - 值
   * @returns {Promise<boolean>}
   */
  async set(key, value) {
    if (!isElectron) {
      // Web 环境：使用 localStorage
      try {
        localStorage.setItem(`yunshu_${key}`, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    }
    
    return window.electronAPI.store.set(key, value);
  },
  
  /**
   * 删除存储值
   * @param {string} key - 键名
   * @returns {Promise<boolean>}
   */
  async delete(key) {
    if (!isElectron) {
      localStorage.removeItem(`yunshu_${key}`);
      return true;
    }
    
    return window.electronAPI.store.delete(key);
  },
  
  /**
   * 检查键是否存在
   * @param {string} key - 键名
   * @returns {Promise<boolean>}
   */
  async has(key) {
    if (!isElectron) {
      return localStorage.getItem(`yunshu_${key}`) !== null;
    }
    
    return window.electronAPI.store.has(key);
  },
  
  /**
   * 清空所有存储
   * @returns {Promise<boolean>}
   */
  async clear() {
    if (!isElectron) {
      // 只清除 yunshu_ 前缀的项
      const keys = Object.keys(localStorage).filter(k => k.startsWith('yunshu_'));
      keys.forEach(k => localStorage.removeItem(k));
      return true;
    }
    
    return window.electronAPI.store.clear();
  },
  
  /**
   * 获取所有键
   * @returns {Promise<string[]>}
   */
  async keys() {
    if (!isElectron) {
      return Object.keys(localStorage)
        .filter(k => k.startsWith('yunshu_'))
        .map(k => k.replace('yunshu_', ''));
    }
    
    return window.electronAPI.store.keys();
  },
};

// ============================================
// 应用事件 API
// ============================================

export const app = {
  /**
   * 监听应用就绪事件
   * @param {Function} callback - 回调函数
   */
  onReady(callback) {
    if (!isElectron) {
      // Web 环境：立即调用
      callback({
        version: import.meta.env.VITE_APP_VERSION || '2.0.0',
        platform: system.getPlatform(),
        isDev: import.meta.env.DEV,
      });
      return;
    }
    
    window.electronAPI.app.onReady(callback);
  },
  
  /**
   * 监听协议 URL 事件
   * @param {Function} callback - 回调函数
   */
  onProtocolUrl(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.app.onProtocolUrl(callback);
  },
  
  /**
   * 监听应用即将退出事件
   * @param {Function} callback - 回调函数
   */
  onBeforeQuit(callback) {
    if (!isElectron) {
      // Web 环境：监听 beforeunload
      try { if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('beforeunload', callback);
      } } catch(e) {}
      return;
    }
    
    window.electronAPI.app.onBeforeQuit(callback);
  },
  
  /**
   * 移除所有事件监听
   */
  removeAllListeners() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.app.removeAllListeners();
  },
};

// ============================================
// 菜单事件 API
// ============================================

export const menu = {
  /**
   * 监听菜单动作
   * @param {Function} callback - 回调函数
   */
  onAction(callback) {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.ipc.on('menu-action', callback);
  },
  
  /**
   * 移除菜单动作监听
   */
  removeListener() {
    if (!isElectron) {
      return;
    }
    
    window.electronAPI.ipc.removeAllListeners('menu-action');
  },
};

// ============================================
// 统一导出
// ============================================

/**
 * 桌面端 API 统一入口
 * 提供所有功能的统一访问点
 */
export const desktopAPI = {
  // 环境标识
  isElectron,
  
  // 各模块 API
  fileSystem,
  system,
  clipboard,
  notification,
  window,
  project,
  tray,
  shortcut,
  autoUpdate,
  store,
  app,
  menu,
};

// 默认导出
export default desktopAPI;

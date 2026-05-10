/**
 * 云书 - 移动端原生功能 API
 * 
 * 功能说明：
 * - Capacitor 原生功能封装
 * - 设备信息获取
 * - 文件系统操作
 * - 分享功能
 * - 推送通知
 * - 相机/相册
 * - 本地存储
 * - 网络状态
 * - 键盘控制
 * - 安全区域
 * 
 * 使用方式：
 * import { mobileAPI } from '@/utils/mobileAPI';
 * 
 * // 检测环境
 * if (mobileAPI.isNative) {
 *   // 使用原生功能
 *   await mobileAPI.share({ text: '分享内容' });
 * }
 */

// ============================================
// 环境检测（兼容无 Capacitor 的 Web 构建）
// ============================================

/**
 * 安全获取 Capacitor 实例
 * 在 Web 构建中 @capacitor/core 可能不存在
 */
function getCapacitor() {
  try {
    // 使用全局变量，避免静态 import 导致构建失败
    if (typeof window !== 'undefined' && window.Capacitor) {
      return window.Capacitor;
    }
  } catch (e) {
    // Capacitor 不可用
  }
  return null;
}

const _cap = getCapacitor();

/**
 * 检测是否在原生应用环境
 */
const isNative = _cap ? _cap.isNativePlatform() : false;

/**
 * 获取当前平台
 */
const platform = _cap ? _cap.getPlatform() : (typeof navigator !== 'undefined' && navigator.platform ? navigator.platform.toLowerCase() : 'web');

/**
 * 检测是否为 iOS
 */
const isIOS = _cap ? (platform === 'ios') : (typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent));

/**
 * 检测是否为 Android
 */
const isAndroid = _cap ? (platform === 'android') : (typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent));

/**
 * 检测是否为 Termux 环境
 */
function detectTermux() {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  const isTermux = ua.includes('termux') || 
                   (ua.includes('linux') && ua.includes('android') && !ua.includes('chrome'));
  
  // 检查 Termux 特有的环境变量
  if (typeof window !== 'undefined' && window.Termux) {
    return true;
  }
  
  return isTermux;
}

const isTermux = detectTermux();

// ============================================
// 动态导入辅助函数
// ============================================

/**
 * 安全的动态导入
 * 使用字符串拼接避免 Rollup/Vite 在构建时尝试解析模块
 * @param {string} mod - 模块路径
 * @returns {Promise<any>}
 */
async function safeImport(mod) {
  try {
    return await import(/* @vite-ignore */ mod);
  } catch (e) {
    console.warn(`模块 ${mod} 不可用:`, e.message);
    return null;
  }
}

// ============================================
// 设备信息 API
// ============================================

export const device = {
  /**
   * 获取设备信息
   * @returns {Promise<Object>}
   */
  async getInfo() {
    if (!isNative) {
      return {
        platform: platform,
        model: 'Browser',
        operatingSystem: navigator.platform,
        osVersion: navigator.userAgent,
        manufacturer: 'Unknown',
        isVirtual: false,
        memUsed: 0,
        diskFree: 0,
        diskTotal: 0,
      };
    }
    
    try {
      const { Device } = await safeImport('@capacitor/device');
      return await Device.getInfo();
    } catch (error) {
      console.warn('Device API 不可用:', error);
      return null;
    }
  },
  
  /**
   * 获取设备语言
   * @returns {Promise<string>}
   */
  async getLanguageCode() {
    if (!isNative) {
      return navigator.language || 'zh-CN';
    }
    
    try {
      const { Device } = await safeImport('@capacitor/device');
      const info = await Device.getLanguageCode();
      return info.value;
    } catch (error) {
      return 'zh-CN';
    }
  },
  
  /**
   * 获取设备ID
   * @returns {Promise<string>}
   */
  async getId() {
    if (!isNative) {
      // Web 环境生成唯一ID
      let id = localStorage.getItem('yunshu_device_id');
      if (!id) {
        id = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('yunshu_device_id', id);
      }
      return id;
    }
    
    try {
      const { Device } = await safeImport('@capacitor/device');
      const info = await Device.getId();
      return info.identifier;
    } catch (error) {
      return 'unknown';
    }
  },
  
  /**
   * 获取电池信息
   * @returns {Promise<Object>}
   */
  async getBatteryInfo() {
    if (!isNative && 'getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return {
          batteryLevel: battery.level,
          isCharging: battery.charging,
        };
      } catch (error) {
        return null;
      }
    }
    
    try {
      const { Device } = await safeImport('@capacitor/device');
      return await Device.getBatteryInfo();
    } catch (error) {
      return null;
    }
  },
};

// ============================================
// 文件系统 API
// ============================================

export const files = {
  /**
   * 读取文件
   * @param {string} path - 文件路径
   * @returns {Promise<string>}
   */
  async readFile(path) {
    if (!isNative) {
      throw new Error('文件系统仅在原生应用中可用');
    }
    
    try {
      const { Filesystem, Directory, Encoding } = await safeImport('@capacitor/filesystem');
      const result = await Filesystem.readFile({
        path,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return result.data;
    } catch (error) {
      console.error('读取文件失败:', error);
      throw error;
    }
  },
  
  /**
   * 写入文件
   * @param {string} path - 文件路径
   * @param {string} data - 文件内容
   * @returns {Promise<string>}
   */
  async writeFile(path, data) {
    if (!isNative) {
      throw new Error('文件系统仅在原生应用中可用');
    }
    
    try {
      const { Filesystem, Directory, Encoding } = await safeImport('@capacitor/filesystem');
      const result = await Filesystem.writeFile({
        path,
        data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return result.uri;
    } catch (error) {
      console.error('写入文件失败:', error);
      throw error;
    }
  },
  
  /**
   * 删除文件
   * @param {string} path - 文件路径
   */
  async deleteFile(path) {
    if (!isNative) {
      throw new Error('文件系统仅在原生应用中可用');
    }
    
    try {
      const { Filesystem, Directory } = await safeImport('@capacitor/filesystem');
      await Filesystem.deleteFile({
        path,
        directory: Directory.Documents,
      });
    } catch (error) {
      console.error('删除文件失败:', error);
      throw error;
    }
  },
  
  /**
   * 检查文件是否存在
   * @param {string} path - 文件路径
   * @returns {Promise<boolean>}
   */
  async fileExists(path) {
    if (!isNative) {
      return false;
    }
    
    try {
      const { Filesystem, Directory } = await safeImport('@capacitor/filesystem');
      await Filesystem.stat({
        path,
        directory: Directory.Documents,
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * 创建目录
   * @param {string} path - 目录路径
   */
  async mkdir(path) {
    if (!isNative) {
      throw new Error('文件系统仅在原生应用中可用');
    }
    
    try {
      const { Filesystem, Directory } = await safeImport('@capacitor/filesystem');
      await Filesystem.mkdir({
        path,
        directory: Directory.Documents,
        recursive: true,
      });
    } catch (error) {
      console.error('创建目录失败:', error);
      throw error;
    }
  },
  
  /**
   * 列出目录内容
   * @param {string} path - 目录路径
   * @returns {Promise<Array>}
   */
  async readdir(path) {
    if (!isNative) {
      throw new Error('文件系统仅在原生应用中可用');
    }
    
    try {
      const { Filesystem, Directory } = await safeImport('@capacitor/filesystem');
      const result = await Filesystem.readdir({
        path,
        directory: Directory.Documents,
      });
      return result.files;
    } catch (error) {
      console.error('读取目录失败:', error);
      throw error;
    }
  },
  
  /**
   * 获取应用数据目录
   * @returns {Promise<string>}
   */
  async getDataDirectory() {
    if (!isNative) {
      return '';
    }
    
    try {
      const { Filesystem, Directory } = await safeImport('@capacitor/filesystem');
      const result = await Filesystem.getUri({
        directory: Directory.Documents,
        path: '',
      });
      return result.uri;
    } catch (error) {
      return '';
    }
  },
};

// ============================================
// 分享功能 API
// ============================================

export const share = {
  /**
   * 分享内容
   * @param {Object} options - 分享选项
   * @param {string} [options.title] - 标题
   * @param {string} [options.text] - 文本内容
   * @param {string} [options.url] - URL
   * @param {string} [options.dialogTitle] - 对话框标题
   */
  async shareContent(options) {
    // Web 环境使用 Web Share API
    if (!isNative && 'share' in navigator) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('分享失败:', error);
        }
        return false;
      }
    }
    
    // 原生环境使用 Capacitor Share
    try {
      const { Share } = await safeImport('@capacitor/share');
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || '分享到',
      });
      return true;
    } catch (error) {
      console.error('分享失败:', error);
      return false;
    }
  },
  
  /**
   * 分享小说章节
   * @param {string} title - 小说标题
   * @param {string} chapterTitle - 章节标题
   * @param {string} content - 章节内容
   */
  async shareChapter(title, chapterTitle, content) {
    const shareText = `《${title}》${chapterTitle}\n\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}\n\n—— 来自云书`;
    
    return this.shareContent({
      title: `${title} - ${chapterTitle}`,
      text: shareText,
    });
  },
  
  /**
   * 分享小说链接
   * @param {string} title - 小说标题
   * @param {string} url - 链接地址
   */
  async shareNovelLink(title, url) {
    return this.shareContent({
      title: `推荐小说：${title}`,
      text: `我正在看《${title}》，推荐给你！`,
      url: url,
    });
  },
};

// ============================================
// 推送通知 API
// ============================================

export const pushNotifications = {
  /**
   * 请求通知权限
   * @returns {Promise<boolean>}
   */
  async requestPermission() {
    if (!isNative) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }
    
    try {
      const { PushNotifications } = await safeImport('@capacitor/push-notifications');
      const result = await PushNotifications.requestPermissions();
      return result.receive === 'granted';
    } catch (error) {
      console.warn('推送通知不可用:', error);
      return false;
    }
  },
  
  /**
   * 注册推送通知
   */
  async register() {
    if (!isNative) return;
    
    try {
      const { PushNotifications } = await safeImport('@capacitor/push-notifications');
      
      await PushNotifications.register();
      
      // 监听注册成功
      PushNotifications.addListener('registration', (token) => {
        console.log('推送通知注册成功:', token.value);
        // 可以将 token 发送到服务器
      });
      
      // 监听注册失败
      PushNotifications.addListener('registrationError', (error) => {
        console.error('推送通知注册失败:', error);
      });
      
      // 监听通知接收
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('收到推送通知:', notification);
      });
      
      // 监听通知点击
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('推送通知被点击:', action);
        // 处理通知点击，如跳转到特定页面
      });
    } catch (error) {
      console.warn('推送通知注册失败:', error);
    }
  },
  
  /**
   * 获取已送达的通知
   * @returns {Promise<Array>}
   */
  async getDeliveredNotifications() {
    if (!isNative) return [];
    
    try {
      const { PushNotifications } = await safeImport('@capacitor/push-notifications');
      const result = await PushNotifications.getDeliveredNotifications();
      return result.notifications;
    } catch (error) {
      return [];
    }
  },
  
  /**
   * 移除已送达的通知
   * @param {Array} notifications - 通知列表
   */
  async removeDeliveredNotifications(notifications) {
    if (!isNative) return;
    
    try {
      const { PushNotifications } = await safeImport('@capacitor/push-notifications');
      await PushNotifications.removeDeliveredNotifications({
        notifications,
      });
    } catch (error) {
      console.warn('移除通知失败:', error);
    }
  },
};

// ============================================
// 本地通知 API
// ============================================

export const localNotifications = {
  /**
   * 请求权限
   * @returns {Promise<boolean>}
   */
  async requestPermission() {
    if (!isNative) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }
    
    try {
      const { LocalNotifications } = await safeImport('@capacitor/local-notifications');
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.warn('本地通知不可用:', error);
      return false;
    }
  },
  
  /**
   * 发送本地通知
   * @param {Object} options - 通知选项
   * @param {string} options.title - 标题
   * @param {string} options.body - 内容
   * @param {number} [options.id] - 通知ID
   * @param {string} [options.schedule] - 定时发送
   */
  async schedule(options) {
    if (!isNative) {
      // Web 环境使用 Web Notifications
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
        });
      }
      return;
    }
    
    try {
      const { LocalNotifications } = await safeImport('@capacitor/local-notifications');
      await LocalNotifications.schedule({
        notifications: [{
          id: options.id || Date.now(),
          title: options.title,
          body: options.body,
          schedule: options.schedule ? { at: new Date(options.schedule) } : undefined,
        }],
      });
    } catch (error) {
      console.error('发送通知失败:', error);
    }
  },
  
  /**
   * 发送写作提醒通知
   * @param {string} message - 提醒消息
   */
  async sendWritingReminder(message) {
    return this.schedule({
      title: '云书 - 写作提醒',
      body: message,
      id: 1001,
    });
  },
  
  /**
   * 发送目标达成通知
   * @param {string} goalType - 目标类型
   * @param {number} value - 达成值
   */
  async sendGoalAchieved(goalType, value) {
    return this.schedule({
      title: `🎉 ${goalType}目标达成！`,
      body: `恭喜你完成了${value}字的写作目标！继续保持！`,
      id: 1002,
    });
  },
  
  /**
   * 取消通知
   * @param {number} id - 通知ID
   */
  async cancel(id) {
    if (!isNative) return;
    
    try {
      const { LocalNotifications } = await safeImport('@capacitor/local-notifications');
      await LocalNotifications.cancel({
        notifications: [{ id }],
      });
    } catch (error) {
      console.warn('取消通知失败:', error);
    }
  },
};

// ============================================
// 相机/相册 API
// ============================================

export const camera = {
  /**
   * 拍照
   * @param {Object} options - 选项
   * @returns {Promise<Object>}
   */
  async takePhoto(options = {}) {
    if (!isNative) {
      // Web 环境使用 input[type="file"]
      return this._webFileInput('camera');
    }
    
    try {
      const { Camera, CameraResultType, CameraSource } = await safeImport('@capacitor/camera');
      const photo = await Camera.getPhoto({
        quality: options.quality || 90,
        allowEditing: options.allowEditing || false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      
      return {
        dataUrl: photo.dataUrl,
        format: photo.format,
      };
    } catch (error) {
      console.error('拍照失败:', error);
      throw error;
    }
  },
  
  /**
   * 从相册选择图片
   * @param {Object} options - 选项
   * @returns {Promise<Object>}
   */
  async pickImage(options = {}) {
    if (!isNative) {
      return this._webFileInput('gallery');
    }
    
    try {
      const { Camera, CameraResultType, CameraSource } = await safeImport('@capacitor/camera');
      const photo = await Camera.getPhoto({
        quality: options.quality || 90,
        allowEditing: options.allowEditing || false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      
      return {
        dataUrl: photo.dataUrl,
        format: photo.format,
      };
    } catch (error) {
      console.error('选择图片失败:', error);
      throw error;
    }
  },
  
  /**
   * Web 环境文件选择
   * @private
   */
  _webFileInput(source) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      if (source === 'camera') {
        input.capture = 'environment';
      }
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          reject(new Error('未选择文件'));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            dataUrl: reader.result,
            format: file.type.split('/')[1],
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      };
      
      input.click();
    });
  },
};

// ============================================
// 网络状态 API
// ============================================

export const network = {
  /**
   * 获取网络状态
   * @returns {Promise<Object>}
   */
  async getStatus() {
    if (!isNative && 'onLine' in navigator) {
      return {
        connected: navigator.onLine,
        connectionType: navigator.onLine ? 'wifi' : 'none',
      };
    }
    
    try {
      const { Network } = await safeImport('@capacitor/network');
      const status = await Network.getStatus();
      return status;
    } catch (error) {
      return {
        connected: true,
        connectionType: 'unknown',
      };
    }
  },
  
  /**
   * 监听网络状态变化
   * @param {Function} callback - 回调函数
   */
  async addListener(callback) {
    if (!isNative && 'addEventListener' in window) {
      window.addEventListener('online', () => callback({ connected: true }));
      window.addEventListener('offline', () => callback({ connected: false }));
      return;
    }
    
    try {
      const { Network } = await safeImport('@capacitor/network');
      Network.addListener('networkStatusChange', callback);
    } catch (error) {
      console.warn('网络状态监听不可用:', error);
    }
  },
};

// ============================================
// 键盘控制 API
// ============================================

export const keyboard = {
  /**
   * 显示键盘
   */
  async show() {
    if (!isNative) return;
    
    try {
      const { Keyboard } = await safeImport('@capacitor/keyboard');
      await Keyboard.show();
    } catch (error) {
      console.warn('键盘显示不可用:', error);
    }
  },
  
  /**
   * 隐藏键盘
   */
  async hide() {
    if (!isNative) return;
    
    try {
      const { Keyboard } = await safeImport('@capacitor/keyboard');
      await Keyboard.hide();
    } catch (error) {
      console.warn('键盘隐藏不可用:', error);
    }
  },
  
  /**
   * 监听键盘显示
   * @param {Function} callback - 回调函数
   */
  async onShow(callback) {
    if (!isNative) return;
    
    try {
      const { Keyboard } = await safeImport('@capacitor/keyboard');
      Keyboard.addListener('keyboardWillShow', (info) => {
        callback(info.keyboardHeight);
      });
    } catch (error) {
      console.warn('键盘监听不可用:', error);
    }
  },
  
  /**
   * 监听键盘隐藏
   * @param {Function} callback - 回调函数
   */
  async onHide(callback) {
    if (!isNative) return;
    
    try {
      const { Keyboard } = await safeImport('@capacitor/keyboard');
      Keyboard.addListener('keyboardWillHide', callback);
    } catch (error) {
      console.warn('键盘监听不可用:', error);
    }
  },
};

// ============================================
// 安全区域 API
// ============================================

export const safeArea = {
  /**
   * 获取安全区域信息
   * @returns {Object}
   */
  async getSafeArea() {
    if (!isNative) {
      // Web 环境使用 CSS env()
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };
    }
    
    try {
      const { SafeArea } = await safeImport('capacitor-plugin-safe-area');
      const result = await SafeArea.getSafeArea();
      return result.insets;
    } catch (error) {
      // 回退到 CSS 变量
      const computedStyle = getComputedStyle(document.documentElement);
      return {
        top: parseInt(computedStyle.getPropertyValue('--safe-area-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-right') || '0'),
      };
    }
  },
};

// ============================================
// 应用信息 API
// ============================================

export const appInfo = {
  /**
   * 获取应用信息
   * @returns {Promise<Object>}
   */
  async getInfo() {
    if (!isNative) {
      return {
        name: '云书',
        id: 'com.yunshu.app',
        version: import.meta.env.VITE_APP_VERSION || '2.5.0',
        build: '1',
      };
    }
    
    try {
      const { App } = await safeImport('@capacitor/app');
      const info = await App.getInfo();
      return info;
    } catch (error) {
      return {
        name: '云书',
        id: 'com.yunshu.app',
        version: '2.5.0',
        build: '1',
      };
    }
  },
  
  /**
   * 获取应用版本
   * @returns {Promise<string>}
   */
  async getVersion() {
    const info = await this.getInfo();
    return info.version;
  },
  
  /**
   * 监听应用状态变化
   * @param {Function} callback - 回调函数
   */
  async onStateChange(callback) {
    if (!isNative) return;
    
    try {
      const { App } = await safeImport('@capacitor/app');
      App.addListener('appStateChange', callback);
    } catch (error) {
      console.warn('应用状态监听不可用:', error);
    }
  },
  
  /**
   * 监听返回按钮 (Android)
   * @param {Function} callback - 回调函数
   */
  async onBackButton(callback) {
    if (!isNative || !isAndroid) return;
    
    try {
      const { App } = await safeImport('@capacitor/app');
      App.addListener('backButton', callback);
    } catch (error) {
      console.warn('返回按钮监听不可用:', error);
    }
  },
  
  /**
   * 退出应用
   */
  async exitApp() {
    if (!isNative) return;
    
    try {
      const { App } = await safeImport('@capacitor/app');
      await App.exitApp();
    } catch (error) {
      console.warn('退出应用不可用:', error);
    }
  },
};

// ============================================
// 生物识别 API
// ============================================

export const biometric = {
  /**
   * 检查生物识别是否可用
   * @returns {Promise<Object>}
   */
  async isAvailable() {
    if (!isNative) {
      return {
        isAvailable: false,
        biometryType: 'none',
      };
    }
    
    try {
      const { BiometricAuth } = await safeImport('@capawesome/capacitor-biometric-auth');
      const result = await BiometricAuth.isAvailable();
      return result;
    } catch (error) {
      return {
        isAvailable: false,
        biometryType: 'none',
      };
    }
  },
  
  /**
   * 验证生物识别
   * @param {Object} options - 选项
   * @returns {Promise<boolean>}
   */
  async verify(options = {}) {
    if (!isNative) return false;
    
    try {
      const { BiometricAuth } = await safeImport('@capawesome/capacitor-biometric-auth');
      const result = await BiometricAuth.verify(options);
      return result.verified;
    } catch (error) {
      console.error('生物识别验证失败:', error);
      return false;
    }
  },
};

// ============================================
// 统一导出
// ============================================

export const mobileAPI = {
  // 环境标识
  isNative,
  isIOS,
  isAndroid,
  isTermux,
  platform,
  
  // 各模块 API
  device,
  files,
  share,
  pushNotifications,
  localNotifications,
  camera,
  network,
  keyboard,
  safeArea,
  appInfo,
  biometric,
};

export default mobileAPI;

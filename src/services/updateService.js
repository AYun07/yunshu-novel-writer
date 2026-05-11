/**
 * 云书 - 应用内自动更新服务
 * 
 * 功能说明：
 * - 检测 GitHub Release 最新版本
 * - 对比当前版本
 * - 下载并安装更新（Android）
 * - 支持强制更新和可选更新
 * - 显示更新进度
 */

import { ref, computed } from 'vue';

// ============================================
// 动态导入辅助函数
// ============================================

/**
 * 安全的动态导入
 * 使用 @vite-ignore 避免 Rollup/Vite 在构建时尝试解析模块
 * @param {string} mod - 模块路径
 * @returns {Promise<any>}
 */
async function safeImport(mod) {
  try {
    return await import(/* @vite-ignore */ mod);
  } catch (e) {
    return null;
  }
}

// ============================================
// 配置
// ============================================

const CONFIG = {
  // GitHub 仓库信息
  owner: 'AYun07',
  repo: 'yunshu-novel-writer',
  // 更新检查间隔（毫秒）- 默认1小时
  checkInterval: 60 * 60 * 1000,
  // 当前版本（从环境变量或配置文件读取）
  currentVersion: import.meta.env.VITE_APP_VERSION || '2.6.0',
};

// ============================================
// 状态管理
// ============================================

const updateState = ref({
  checking: false,
  hasUpdate: false,
  downloading: false,
  downloadProgress: 0,
  latestVersion: null,
  releaseNotes: '',
  downloadUrl: null,
  error: null,
  // 是否强制更新
  forceUpdate: false,
  // 是否已忽略此版本
  ignored: false,
});

// ============================================
// 版本比较工具
// ============================================

/**
 * 比较版本号
 * @param {string} v1 - 版本1
 * @param {string} v2 - 版本2
 * @returns {number} -1: v1<v2, 0: v1=v2, 1: v1>v2
 */
function compareVersion(v1, v2) {
  const parts1 = v1.replace(/^v/, '').split('.').map(Number);
  const parts2 = v2.replace(/^v/, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const a = parts1[i] || 0;
    const b = parts2[i] || 0;
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}

/**
 * 检查是否有新版本
 * @param {string} latest - 最新版本
 * @param {string} current - 当前版本
 * @returns {boolean}
 */
function hasNewVersion(latest, current) {
  return compareVersion(latest, current) > 0;
}

// ============================================
// GitHub API
// ============================================

/**
 * 获取最新 Release 信息
 * @returns {Promise<Object|null>}
 */
async function fetchLatestRelease() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API 错误: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      version: data.tag_name,
      name: data.name,
      body: data.body,
      publishedAt: data.published_at,
      assets: data.assets.map(asset => ({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size,
      })),
    };
  } catch (error) {
    console.error('获取最新版本失败:', error);
    return null;
  }
}

/**
 * 获取 Android APK 下载链接
 * @param {Array} assets - Release assets
 * @returns {string|null}
 */
function getAndroidDownloadUrl(assets) {
  // 优先找 app-release.apk，然后是 app-debug.apk
  const apk = assets.find(a => a.name.includes('release.apk')) ||
              assets.find(a => a.name.endsWith('.apk'));
  return apk?.url || null;
}

// ============================================
// 存储管理
// ============================================

const STORAGE_KEY = 'yunshu_update';

function getStoredData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('存储更新数据失败:', e);
  }
}

/**
 * 获取已忽略的版本
 * @returns {string|null}
 */
function getIgnoredVersion() {
  return getStoredData().ignoredVersion || null;
}

/**
 * 设置忽略的版本
 * @param {string} version
 */
function setIgnoredVersion(version) {
  const data = getStoredData();
  data.ignoredVersion = version;
  setStoredData(data);
}

/**
 * 获取上次检查时间
 * @returns {number}
 */
function getLastCheckTime() {
  return getStoredData().lastCheckTime || 0;
}

/**
 * 设置上次检查时间
 */
function setLastCheckTime() {
  const data = getStoredData();
  data.lastCheckTime = Date.now();
  setStoredData(data);
}

// ============================================
// 平台检测
// ============================================

/**
 * 检测是否在 Capacitor 原生环境
 * @returns {boolean}
 */
function isNative() {
  return typeof window !== 'undefined' && 
         window.Capacitor && 
         window.Capacitor.isNativePlatform &&
         window.Capacitor.isNativePlatform();
}

/**
 * 检测是否为 Android
 * @returns {boolean}
 */
function isAndroid() {
  if (!isNative()) return false;
  return window.Capacitor.getPlatform() === 'android';
}

/**
 * 检测是否为 iOS
 * @returns {boolean}
 */
function isIOS() {
  if (!isNative()) return false;
  return window.Capacitor.getPlatform() === 'ios';
}

// ============================================
// 下载和安装（Android）
// ============================================

/**
 * 将 ArrayBuffer 转换为 Base64
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * 下载并安装 APK（Android）
 * 使用 Capacitor Filesystem + FileProvider 实现无缝更新
 * @param {string} url - APK 下载链接
 */
async function downloadAndInstallApk(url) {
  if (!isAndroid()) {
    throw new Error('仅支持 Android 平台');
  }

  updateState.value.downloading = true;
  updateState.value.downloadProgress = 0;

  try {
    // 使用 Capacitor Filesystem API
    const fs = await safeImport('@capacitor/filesystem');
    if (!fs || !fs.Filesystem || !fs.Directory || !fs.Encoding) {
      throw new Error('文件系统插件不可用');
    }
    const { Filesystem, Directory, Encoding } = fs;

    // 下载文件 - 使用 XMLHttpRequest 获取进度
    const fileName = 'yunshu_update.apk';
    const filePath = `updates/${fileName}`;
    
    // 确保目录存在
    try {
      await Filesystem.mkdir({
        path: 'updates',
        directory: Directory.Cache,
        recursive: true,
      });
    } catch (e) {
      // 目录可能已存在
    }

    // 使用 fetch 下载并跟踪进度
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`);
    }

    const totalSize = parseInt(response.headers.get('content-length') || '0');
    const reader = response.body.getReader();
    const chunks = [];
    let receivedSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      receivedSize += value.length;
      
      if (totalSize > 0) {
        updateState.value.downloadProgress = Math.round((receivedSize / totalSize) * 100);
      }
    }

    // 合并 chunks 并转换为 base64
    const blob = new Blob(chunks);
    const arrayBuffer = await blob.arrayBuffer();
    const base64Data = arrayBufferToBase64(arrayBuffer);

    // 保存到缓存目录
    await Filesystem.writeFile({
      path: filePath,
      data: base64Data,
      directory: Directory.Cache,
      encoding: Encoding.Base64,
    });

    // 获取文件 URI
    const fileUriResult = await Filesystem.getUri({
      path: filePath,
      directory: Directory.Cache,
    });

    // 通过 Bridge 调用原生代码安装 APK
    // 使用自定义插件方式调用 Android Intent
    await installApkViaIntent(fileUriResult.uri);

    updateState.value.downloading = false;
    updateState.value.hasUpdate = false;
    
    return true;
  } catch (error) {
    updateState.value.downloading = false;
    updateState.value.error = error.message;
    console.error('下载安装失败:', error);
    throw error;
  }
}

/**
 * 通过 Android Intent 安装 APK
 * 使用 Capacitor 的 App 插件打开系统安装器
 * @param {string} fileUri - APK 文件的 content:// URI
 */
async function installApkViaIntent(fileUri) {
  // 方法1: 尝试使用 Capacitor App 插件的 openUrl
  const app = await safeImport('@capacitor/app');
  if (app && app.App) {
    try {
      // 构建 intent URL
      const intentUrl = `intent:#Intent;` +
        `action=android.intent.action.VIEW;` +
        `type=application/vnd.android.package-archive;` +
        `data=${encodeURIComponent(fileUri)};` +
        `end`;
      
      // 使用 window.location 打开 intent
      window.location.href = intentUrl;
      return;
    } catch (e) {
      console.warn('Intent URL 方式失败:', e);
    }
  }

  // 方法2: 使用 Browser 插件打开下载链接
  const browser = await safeImport('@capacitor/browser');
  if (browser && browser.Browser) {
    try {
      await browser.Browser.open({ url: fileUri });
      return;
    } catch (e) {
      console.warn('Browser 插件方式失败:', e);
    }
  }

  // 方法3: 降级到打开 GitHub Release 页面
  const releaseUrl = `https://github.com/${CONFIG.owner}/${CONFIG.repo}/releases/latest`;
  window.open(releaseUrl, '_blank');
}

/**
 * Web 环境：直接跳转到下载页面
 * @param {string} url
 */
function openDownloadPage(url) {
  window.open(url, '_blank');
}

// ============================================
// 主功能
// ============================================

/**
 * 检查更新
 * @param {Object} options
 * @param {boolean} options.silent - 是否静默检查（不显示 loading）
 * @param {boolean} options.force - 是否强制检查（忽略时间间隔）
 * @returns {Promise<boolean>} 是否有更新
 */
async function checkUpdate(options = {}) {
  const { silent = false, force = false } = options;

  // 检查间隔
  if (!force) {
    const lastCheck = getLastCheckTime();
    if (Date.now() - lastCheck < CONFIG.checkInterval) {
      return false;
    }
  }

  if (!silent) {
    updateState.value.checking = true;
  }
  updateState.value.error = null;

  try {
    const release = await fetchLatestRelease();
    if (!release) {
      throw new Error('无法获取版本信息');
    }

    setLastCheckTime();

    const latestVersion = release.version;
    const currentVersion = CONFIG.currentVersion;

    // 检查是否有新版本
    if (!hasNewVersion(latestVersion, currentVersion)) {
      updateState.value.checking = false;
      updateState.value.hasUpdate = false;
      return false;
    }

    // 检查是否已忽略此版本
    const ignoredVersion = getIgnoredVersion();
    if (ignoredVersion === latestVersion) {
      updateState.value.ignored = true;
      updateState.value.checking = false;
      return false;
    }

    // 获取下载链接
    const downloadUrl = isAndroid() 
      ? getAndroidDownloadUrl(release.assets)
      : null;

    // 更新状态
    updateState.value = {
      ...updateState.value,
      checking: false,
      hasUpdate: true,
      latestVersion: latestVersion,
      releaseNotes: release.body,
      downloadUrl: downloadUrl,
      ignored: false,
      // 如果版本号差异较大（如 2.x -> 3.x），标记为强制更新
      forceUpdate: compareVersion(latestVersion, currentVersion) >= 1,
    };

    // Android 平台：全自动下载并安装
    if (isAndroid() && downloadUrl) {
      console.log('[Update] Android 平台检测到更新，开始自动下载安装');
      // 延迟3秒让用户看到更新提示，然后开始下载
      setTimeout(() => {
        startUpdate();
      }, 3000);
    }

    return true;
  } catch (error) {
    updateState.value.checking = false;
    updateState.value.error = error.message;
    console.error('检查更新失败:', error);
    return false;
  }
}

/**
 * 开始更新
 */
async function startUpdate() {
  const { downloadUrl } = updateState.value;
  
  if (!downloadUrl) {
    // 没有直接下载链接，打开 Release 页面
    const releaseUrl = `https://github.com/${CONFIG.owner}/${CONFIG.repo}/releases/latest`;
    if (isNative()) {
      // 使用 safeImport 避免构建时解析
      const browserModule = await safeImport('@capacitor/browser');
      if (browserModule && browserModule.Browser) {
        await browserModule.Browser.open({ url: releaseUrl });
      } else {
        window.open(releaseUrl, '_blank');
      }
    } else {
      window.open(releaseUrl, '_blank');
    }
    return;
  }

  // Android 直接下载安装
  if (isAndroid()) {
    await downloadAndInstallApk(downloadUrl);
  } else {
    openDownloadPage(downloadUrl);
  }
}

/**
 * 忽略此版本
 */
function ignoreUpdate() {
  setIgnoredVersion(updateState.value.latestVersion);
  updateState.value.hasUpdate = false;
  updateState.value.ignored = true;
}

/**
 * 稍后提醒
 */
function remindLater() {
  updateState.value.hasUpdate = false;
  // 1小时后再次提醒
  const data = getStoredData();
  data.lastCheckTime = Date.now() - CONFIG.checkInterval + (60 * 60 * 1000);
  setStoredData(data);
}

// ============================================
// 自动检查
// ============================================

let autoCheckInterval = null;

/**
 * 启动自动检查
 * @param {number} interval - 检查间隔（毫秒）
 */
function startAutoCheck(interval = CONFIG.checkInterval) {
  stopAutoCheck();
  
  // 立即检查一次
  checkUpdate({ silent: true });
  
  // 定时检查
  autoCheckInterval = setInterval(() => {
    checkUpdate({ silent: true });
  }, interval);
}

/**
 * 停止自动检查
 */
function stopAutoCheck() {
  if (autoCheckInterval) {
    clearInterval(autoCheckInterval);
    autoCheckInterval = null;
  }
}

// ============================================
// Composable
// ============================================

import { onMounted, onUnmounted } from 'vue';

export function useUpdate() {
  onMounted(() => {
    // 组件挂载时启动自动检查
    startAutoCheck();
  });

  onUnmounted(() => {
    stopAutoCheck();
  });

  return {
    // 状态
    state: computed(() => updateState.value),
    checking: computed(() => updateState.value.checking),
    hasUpdate: computed(() => updateState.value.hasUpdate),
    downloading: computed(() => updateState.value.downloading),
    downloadProgress: computed(() => updateState.value.downloadProgress),
    latestVersion: computed(() => updateState.value.latestVersion),
    releaseNotes: computed(() => updateState.value.releaseNotes),
    forceUpdate: computed(() => updateState.value.forceUpdate),
    error: computed(() => updateState.value.error),
    
    // 方法
    checkUpdate,
    startUpdate,
    ignoreUpdate,
    remindLater,
    startAutoCheck,
    stopAutoCheck,
  };
}

// ============================================
// 导出
// ============================================

export const updateService = {
  checkUpdate,
  startUpdate,
  ignoreUpdate,
  remindLater,
  startAutoCheck,
  stopAutoCheck,
  get state() { return updateState.value; },
  CONFIG,
};

export default updateService;

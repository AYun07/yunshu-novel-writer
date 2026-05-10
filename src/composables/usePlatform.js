/**
 * 云书 - 跨平台检测和适配组合式函数
 *
 * 功能说明：
 * - 检测当前平台：web/desktop/mobile
 * - 检测运行环境：electron/pwa/browser
 * - 检测设备特性：touch/keyboard/mouse/pointer
 * - 检测屏幕尺寸：xs/sm/md/lg/xl
 * - 检测方向：portrait/landscape
 * - 提供平台相关的UI适配建议
 *
 * 使用方式：
 * import { usePlatform } from '@/composables/usePlatform';
 *
 * const {
 *   platform,           // 当前平台类型
 *   environment,        // 运行环境
 *   isMobile,           // 是否移动端
 *   isDesktop,          // 是否桌面端
 *   isTablet,           // 是否平板
 *   isElectron,         // 是否Electron环境
 *   isPWA,              // 是否PWA模式
 *   hasTouch,           // 是否支持触摸
 *   hasPointer,         // 是否支持指针设备
 *   orientation,        // 屏幕方向
 *   devicePixelRatio,   // 设备像素比
 *   platformClass,      // 平台CSS类名
 * } = usePlatform();
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';

// ============================================
// 平台类型常量
// ============================================

/** @enum {string} 平台类型 */
export const PlatformType = {
  WEB: 'web',
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
};

/** @enum {string} 运行环境 */
export const EnvironmentType = {
  ELECTRON: 'electron',
  PWA: 'pwa',
  BROWSER: 'browser',
  WEBVIEW: 'webview',
};

/** @enum {string} 屏幕尺寸断点 */
export const Breakpoint = {
  XS: 'xs',   // < 576px
  SM: 'sm',   // >= 576px
  MD: 'md',   // >= 768px
  LG: 'lg',   // >= 992px
  XL: 'xl',   // >= 1200px
  XXL: 'xxl', // >= 1400px
};

/** @enum {string} 屏幕方向 */
export const Orientation = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

/** @enum {number} 断点像素值 */
export const BreakpointValue = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

// ============================================
// 平台检测工具函数
// ============================================

/**
 * 检测是否在 Electron 环境中
 * @returns {boolean}
 */
function detectElectron() {
  if (typeof window === 'undefined') return false;

  // 检查 window.electronAPI 是否存在（由 preload.js 注入）
  if (window.electronAPI) return true;

  // 检查 user agent
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('electron')) return true;

  // 检查 process 对象
  if (typeof process !== 'undefined' && process.versions?.electron) {
    return true;
  }

  return false;
}

/**
 * 检测是否在 PWA 模式中运行
 * @returns {boolean}
 */
function detectPWA() {
  if (typeof window === 'undefined') return false;

  // 检查 display-mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;

  // 检查 iOS 独立模式
  const isIOSStandalone = window.navigator.standalone === true;

  return isStandalone || isFullscreen || isMinimalUi || isIOSStandalone;
}

/**
 * 检测是否在 WebView 中运行
 * @returns {boolean}
 */
function detectWebView() {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();

  // 检测各种 WebView
  const isWebView =
    /(webview|wv)/i.test(ua) ||
    /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua) ||
    /android.*version\/[\d.]+.*chrome\/[^\s]+ mobile/i.test(ua) && !/chrome\/[=\s]*([=\w]+)/i.test(ua);

  return isWebView;
}

/**
 * 检测是否在 Termux 环境中运行
 * Termux 是 Android 上的终端模拟器，部分 Web API 不兼容
 * @returns {boolean}
 */
function detectTermux() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent.toLowerCase();
  return /termux/i.test(ua);
}

/**
 * 检测设备类型
 * @returns {Object} 设备信息
 */
function detectDevice() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isIOS: false,
      isAndroid: false,
      isWindows: false,
      isMac: false,
      isLinux: false,
    };
  }

  const ua = navigator.userAgent.toLowerCase();

  // 检测操作系统
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isWindows = /windows/.test(ua);
  const isMac = /macintosh|mac os x/.test(ua);
  const isLinux = /linux/.test(ua) && !isAndroid;

  // 检测设备类型
  const isIPad = /ipad/.test(ua) || (isMac && navigator.maxTouchPoints > 1);
  const isIPhone = /iphone/.test(ua);
  const isIPod = /ipod/.test(ua);

  // 检测平板（包括 iPad 和大屏 Android 设备）
  const isTablet =
    isIPad ||
    (isAndroid && /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) ||
    (window.innerWidth >= 600 && window.innerWidth < 1200 && 'ontouchstart' in window);

  // 检测手机
  const isMobile =
    !isTablet &&
    (isIPhone || isIPod || isAndroid || /mobile/.test(ua));

  // 桌面端
  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    isIOS,
    isAndroid,
    isWindows,
    isMac,
    isLinux,
    isIPad,
    isIPhone,
    isIPod,
  };
}

/**
 * 检测设备特性
 * @returns {Object} 设备特性
 */
function detectCapabilities() {
  if (typeof window === 'undefined') {
    return {
      hasTouch: false,
      hasPointer: false,
      hasMouse: true,
      hasKeyboard: true,
      hasVibration: false,
      hasBattery: false,
      hasNetworkInfo: false,
      hasDeviceOrientation: false,
      hasGeolocation: false,
    };
  }

  // 触摸支持
  const hasTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

  // 指针设备支持
  const hasPointer =
    window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  // 鼠标支持（精细指针）
  const hasMouse = window.matchMedia('(pointer: fine)').matches;

  // 键盘支持
  const hasKeyboard = !hasTouch || window.matchMedia('(hover: hover)').matches;

  // 振动 API
  const hasVibration = 'vibrate' in navigator;

  // 电池 API
  const hasBattery = 'getBattery' in navigator;

  // 网络信息 API
  const hasNetworkInfo = 'connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator;

  // 设备方向 API
  const hasDeviceOrientation = 'DeviceOrientationEvent' in window;

  // 地理位置 API
  const hasGeolocation = 'geolocation' in navigator;

  // File System Access API（Termux 环境不支持）
  const isTermuxEnv = detectTermux();
  const hasFileSystemAccess = !isTermuxEnv && 'showOpenFilePicker' in window;

  return {
    hasTouch,
    hasPointer,
    hasMouse,
    hasKeyboard,
    hasVibration,
    hasFileSystemAccess,
    hasBattery,
    hasNetworkInfo,
    hasDeviceOrientation,
    hasGeolocation,
    hasFileSystemAccess,
  };
}

/**
 * 获取当前屏幕断点
 * @returns {string} 断点名称
 */
function getCurrentBreakpoint() {
  if (typeof window === 'undefined') return Breakpoint.LG;

  const width = window.innerWidth;

  if (width >= BreakpointValue.XXL) return Breakpoint.XXL;
  if (width >= BreakpointValue.XL) return Breakpoint.XL;
  if (width >= BreakpointValue.LG) return Breakpoint.LG;
  if (width >= BreakpointValue.MD) return Breakpoint.MD;
  if (width >= BreakpointValue.SM) return Breakpoint.SM;
  return Breakpoint.XS;
}

/**
 * 获取屏幕方向
 * @returns {string} 方向名称
 */
function getOrientation() {
  if (typeof window === 'undefined') return Orientation.LANDSCAPE;

  // 优先使用 screen.orientation
  if (screen.orientation) {
    return screen.orientation.type.includes('portrait')
      ? Orientation.PORTRAIT
      : Orientation.LANDSCAPE;
  }

  // 降级方案
  return window.innerWidth > window.innerHeight
    ? Orientation.LANDSCAPE
    : Orientation.PORTRAIT;
}

/**
 * 获取设备像素比
 * @returns {number}
 */
function getDevicePixelRatio() {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

/**
 * 获取安全区域信息（刘海屏/圆角屏适配）
 * @returns {Object} 安全区域边距
 */
function getSafeArea() {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // 检查是否支持 CSS env() 变量
  const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0', 10);
  const safeAreaRight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar') || '0', 10);
  const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0', 10);
  const safeAreaLeft = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal') || '0', 10);

  return {
    top: safeAreaTop || 0,
    right: safeAreaRight || 0,
    bottom: safeAreaBottom || 0,
    left: safeAreaLeft || 0,
  };
}

// ============================================
// 主组合式函数
// ============================================

/**
 * 跨平台检测和适配组合式函数
 * @returns {Object} 平台相关信息和方法
 */
export function usePlatform() {
  // 响应式状态
  const breakpoint = ref(getCurrentBreakpoint());
  const orientation = ref(getOrientation());
  const devicePixelRatio = ref(getDevicePixelRatio());

  // 设备信息（只需计算一次）
  const deviceInfo = detectDevice();
  const capabilities = detectCapabilities();
  const isElectronEnv = detectElectron();
  const isPWAEnv = detectPWA();
  const isWebViewEnv = detectWebView();
  const isTermuxEnv = detectTermux();

  // ============================================
  // 计算属性
  // ============================================

  /** 当前平台类型 */
  const platform = computed(() => {
    if (deviceInfo.isMobile) return PlatformType.MOBILE;
    if (deviceInfo.isTablet) return PlatformType.TABLET;
    if (isElectronEnv) return PlatformType.DESKTOP;
    return PlatformType.WEB;
  });

  /** 运行环境 */
  const environment = computed(() => {
    if (isElectronEnv) return EnvironmentType.ELECTRON;
    if (isPWAEnv) return EnvironmentType.PWA;
    if (isWebViewEnv) return EnvironmentType.WEBVIEW;
    return EnvironmentType.BROWSER;
  });

  /** 是否移动端 */
  const isMobile = computed(() => deviceInfo.isMobile);

  /** 是否平板 */
  const isTablet = computed(() => deviceInfo.isTablet);

  /** 是否桌面端 */
  const isDesktop = computed(() => deviceInfo.isDesktop);

  /** 是否 Electron 环境 */
  const isElectron = computed(() => isElectronEnv);

  /** 是否 PWA 模式 */
  const isPWA = computed(() => isPWAEnv);

  /** 是否 WebView */
  const isWebView = computed(() => isWebViewEnv);

  /** 是否 Termux 环境 */
  const isTermux = computed(() => isTermuxEnv);

  /** 是否支持 File System Access API */
  const hasFileSystemAccess = computed(() => capabilities.hasFileSystemAccess);

  /** 是否触摸设备 */
  const hasTouch = computed(() => capabilities.hasTouch);

  /** 是否支持指针设备 */
  const hasPointer = computed(() => capabilities.hasPointer);

  /** 是否支持鼠标 */
  const hasMouse = computed(() => capabilities.hasMouse);

  /** 是否支持键盘 */
  const hasKeyboard = computed(() => capabilities.hasKeyboard);

  /** 是否支持振动 */
  const hasVibration = computed(() => capabilities.hasVibration);

  /** 是否 iOS 设备 */
  const isIOS = computed(() => deviceInfo.isIOS);

  /** 是否 Android 设备 */
  const isAndroid = computed(() => deviceInfo.isAndroid);

  /** 是否 Windows 系统 */
  const isWindows = computed(() => deviceInfo.isWindows);

  /** 是否 Mac 系统 */
  const isMac = computed(() => deviceInfo.isMac);

  /** 是否 Linux 系统 */
  const isLinux = computed(() => deviceInfo.isLinux);

  /** 是否超小屏幕 */
  const isXS = computed(() => breakpoint.value === Breakpoint.XS);

  /** 是否小屏幕 */
  const isSM = computed(() => breakpoint.value === Breakpoint.SM);

  /** 是否中等屏幕 */
  const isMD = computed(() => breakpoint.value === Breakpoint.MD);

  /** 是否大屏幕 */
  const isLG = computed(() => breakpoint.value === Breakpoint.LG);

  /** 是否超大屏幕 */
  const isXL = computed(() => breakpoint.value === Breakpoint.XL);

  /** 是否超超大屏幕 */
  const isXXL = computed(() => breakpoint.value === Breakpoint.XXL);

  /** 是否竖屏 */
  const isPortrait = computed(() => orientation.value === Orientation.PORTRAIT);

  /** 是否横屏 */
  const isLandscape = computed(() => orientation.value === Orientation.LANDSCAPE);

  /** 屏幕宽度是否小于指定断点 */
  const isLessThan = computed(() => (bp) => {
    const current = BreakpointValue[breakpoint.value.toUpperCase()];
    const target = BreakpointValue[bp.toUpperCase()];
    return current < target;
  });

  /** 屏幕宽度是否大于指定断点 */
  const isGreaterThan = computed(() => (bp) => {
    const current = BreakpointValue[breakpoint.value.toUpperCase()];
    const target = BreakpointValue[bp.toUpperCase()];
    return current > target;
  });

  /** 平台 CSS 类名 */
  const platformClass = computed(() => {
    const classes = [
      `platform-${platform.value}`,
      `env-${environment.value}`,
      `bp-${breakpoint.value}`,
      `orientation-${orientation.value}`,
    ];

    if (isMobile.value) classes.push('is-mobile');
    if (isTablet.value) classes.push('is-tablet');
    if (isDesktop.value) classes.push('is-desktop');
    if (hasTouch.value) classes.push('has-touch');
    if (hasMouse.value) classes.push('has-mouse');
    if (isIOS.value) classes.push('is-ios');
    if (isAndroid.value) classes.push('is-android');
    if (isTermux.value) classes.push('is-termux');

    return classes.join(' ');
  });

  /** UI 适配建议 */
  const uiRecommendations = computed(() => {
    const recs = {
      // 导航模式
      navigationMode: isMobile.value || isTablet.value ? 'bottom' : 'sidebar',

      // 触摸目标大小
      touchTargetSize: hasTouch.value ? 44 : 32,

      // 字体大小调整
      fontScale: isMobile.value ? 1 : isTablet.value ? 1.05 : 1,

      // 布局密度
      layoutDensity: isMobile.value ? 'compact' : isTablet.value ? 'comfortable' : 'cozy',

      // 是否启用手势
      enableGestures: hasTouch.value,

      // 是否启用悬停效果
      enableHover: hasMouse.value,

      // 是否启用键盘快捷键提示
      showKeyboardShortcuts: hasKeyboard.value && !isMobile.value,

      // 内容最大宽度
      contentMaxWidth: isMobile.value ? '100%' : isTablet.value ? '720px' : '1200px',

      // 侧边栏宽度
      sidebarWidth: isMobile.value ? 0 : isTablet.value ? 200 : 260,

      // 是否使用原生滚动
      useNativeScroll: true,

      // 是否启用下拉刷新
      enablePullToRefresh: isMobile.value && isPWA.value,

      // 是否启用虚拟键盘处理
      handleVirtualKeyboard: isMobile.value || isTablet.value,

      // Termux 环境适配
      // Termux 不支持 File System Access API，禁用相关功能
      enableFileSystemAccess: capabilities.hasFileSystemAccess,
      // Termux 中禁用不兼容的 Web API（如 wakeLock、bluetooth 等）
      enableAdvancedWebAPI: !isTermuxEnv,
    };

    return recs;
  });

  // ============================================
  // 方法
  // ============================================

  /**
   * 触发设备振动
   * @param {number|number[]} pattern - 振动模式
   */
  function vibrate(pattern = 50) {
    if (capabilities.hasVibration) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * 检查是否支持指定特性
   * @param {string} feature - 特性名称
   * @returns {boolean}
   */
  function supports(feature) {
    const featureMap = {
      touch: capabilities.hasTouch,
      mouse: capabilities.hasMouse,
      keyboard: capabilities.hasKeyboard,
      vibration: capabilities.hasVibration,
      battery: capabilities.hasBattery,
      network: capabilities.hasNetworkInfo,
      orientation: capabilities.hasDeviceOrientation,
      geolocation: capabilities.hasGeolocation,
      fullscreen: document.fullscreenEnabled,
      clipboard: 'clipboard' in navigator,
      share: 'share' in navigator,
      wakeLock: 'wakeLock' in navigator,
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      storage: 'storage' in navigator,
      bluetooth: 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      serial: 'serial' in navigator,
      fileSystemAccess: capabilities.hasFileSystemAccess,
    };

    return featureMap[feature] || false;
  }

  /**
   * 获取网络状态
   * @returns {Object|null}
   */
  function getNetworkStatus() {
    if (!capabilities.hasNetworkInfo) return null;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) return null;

    return {
      effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
      downlink: connection.downlink, // Mbps
      rtt: connection.rtt, // Round-trip time in ms
      saveData: connection.saveData, // Data saver mode
      type: connection.type, // 'wifi', 'cellular', etc.
    };
  }

  /**
   * 获取电池状态
   * @returns {Promise<Object|null>}
   */
  async function getBatteryStatus() {
    if (!capabilities.hasBattery) return null;

    try {
      const battery = await navigator.getBattery();
      return {
        level: battery.level * 100, // 百分比
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    } catch (error) {
      console.warn('获取电池状态失败:', error);
      return null;
    }
  }

  // ============================================
  // 事件监听
  // ============================================

  /**
   * 处理窗口大小变化
   */
  function handleResize() {
    breakpoint.value = getCurrentBreakpoint();
    devicePixelRatio.value = getDevicePixelRatio();
  }

  /**
   * 处理方向变化
   */
  function handleOrientationChange() {
    orientation.value = getOrientation();
  }

  // ============================================
  // 生命周期
  // ============================================

  onMounted(() => {
    if (typeof window !== 'undefined') {
      try { if (typeof window.addEventListener === 'function') {
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleOrientationChange);
      } } catch(e) {}

      // 监听屏幕方向变化（现代浏览器）
      if (screen.orientation) {
        try { if (typeof screen.orientation.addEventListener === 'function') {
          screen.orientation.addEventListener('change', handleOrientationChange);
        } } catch(e) {}
      }
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      try { if (typeof window.removeEventListener === 'function') {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
      } } catch(e) {}

      if (screen.orientation) {
        try { if (typeof screen.orientation.removeEventListener === 'function') {
          screen.orientation.removeEventListener('change', handleOrientationChange);
        } } catch(e) {}
      }
    }
  });

  // ============================================
  // 返回值
  // ============================================

  return {
    // 平台信息
    platform,
    environment,

    // 设备类型
    isMobile,
    isTablet,
    isDesktop,

    // 运行环境
    isElectron,
    isPWA,
    isWebView,
    isTermux,

    // 操作系统
    isIOS,
    isAndroid,
    isWindows,
    isMac,
    isLinux,

    // 设备特性
    hasTouch,
    hasPointer,
    hasMouse,
    hasKeyboard,
    hasVibration,

    // 屏幕信息
    breakpoint,
    orientation,
    isPortrait,
    isLandscape,
    devicePixelRatio,

    // 断点判断
    isXS,
    isSM,
    isMD,
    isLG,
    isXL,
    isXXL,
    isLessThan,
    isGreaterThan,

    // UI 适配
    platformClass,
    uiRecommendations,

    // 方法
    vibrate,
    supports,
    getNetworkStatus,
    getBatteryStatus,
    getSafeArea,
  };
}

// 默认导出
export default usePlatform;

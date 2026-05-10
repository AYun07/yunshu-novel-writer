/**
 * 云书 - 响应式布局组合式函数
 *
 * 功能说明：
 * - 基于窗口尺寸的响应式断点
 * - 提供 isMobile/isTablet/isDesktop 计算属性
 * - 响应式字体大小
 * - 响应式间距系统
 * - 布局模式切换（侧边栏/底部导航）
 *
 * 使用方式：
 * import { useResponsive } from '@/composables/useResponsive';
 *
 * const {
 *   // 断点检测
 *   isXS, isSM, isMD, isLG, isXL, isXXL,
 *   isMobile, isTablet, isDesktop,
 *   isGreaterThan, isLessThan, isBetween,
 *
 *   // 响应式值
 *   fontSize, spacing, layout,
 *
 *   // 布局模式
 *   navigationMode, sidebarVisible, sidebarCollapsed,
 *
 *   // 方法
 *   toggleSidebar, showSidebar, hideSidebar,
 *   setFontScale, resetFontScale,
 * } = useResponsive();
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// ============================================
// 常量定义
// ============================================

/** 断点定义（像素值） */
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

/** 断点名称 */
export const BREAKPOINT_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/** 导航模式 */
export const NAVIGATION_MODE = {
  SIDEBAR: 'sidebar',     // 侧边栏导航（桌面端默认）
  BOTTOM: 'bottom',       // 底部导航（移动端默认）
  DRAWER: 'drawer',       // 抽屉导航（平板适配）
  HYBRID: 'hybrid',       // 混合导航
};

/** 布局密度 */
export const LAYOUT_DENSITY = {
  COMPACT: 'compact',     // 紧凑（移动端）
  COMFORTABLE: 'comfortable', // 舒适（平板）
  COZY: 'cozy',           // 宽松（桌面端）
};

/** 默认字体大小配置（rem） */
export const DEFAULT_FONT_SIZES = {
  xs: {
    base: 0.875,      // 14px
    small: 0.75,      // 12px
    medium: 0.875,    // 14px
    large: 1,         // 16px
    xlarge: 1.125,    // 18px
    xxlarge: 1.25,    // 20px
  },
  sm: {
    base: 0.875,
    small: 0.75,
    medium: 0.875,
    large: 1,
    xlarge: 1.125,
    xxlarge: 1.25,
  },
  md: {
    base: 1,          // 16px
    small: 0.875,
    medium: 1,
    large: 1.125,
    xlarge: 1.25,
    xxlarge: 1.5,
  },
  lg: {
    base: 1,
    small: 0.875,
    medium: 1,
    large: 1.125,
    xlarge: 1.25,
    xxlarge: 1.5,
  },
  xl: {
    base: 1,
    small: 0.875,
    medium: 1,
    large: 1.125,
    xlarge: 1.375,
    xxlarge: 1.75,
  },
  xxl: {
    base: 1.125,      // 18px
    small: 0.875,
    medium: 1,
    large: 1.25,
    xlarge: 1.5,
    xxlarge: 2,
  },
};

/** 默认间距配置（px） */
export const DEFAULT_SPACING = {
  xs: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  sm: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  md: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  lg: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  xl: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  xxl: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

/** 布局配置 */
export const LAYOUT_CONFIG = {
  xs: {
    navigationMode: NAVIGATION_MODE.BOTTOM,
    sidebarWidth: 0,
    contentMaxWidth: '100%',
    containerPadding: 16,
    showSidebar: false,
    density: LAYOUT_DENSITY.COMPACT,
  },
  sm: {
    navigationMode: NAVIGATION_MODE.BOTTOM,
    sidebarWidth: 0,
    contentMaxWidth: '100%',
    containerPadding: 16,
    showSidebar: false,
    density: LAYOUT_DENSITY.COMPACT,
  },
  md: {
    navigationMode: NAVIGATION_MODE.DRAWER,
    sidebarWidth: 240,
    contentMaxWidth: '100%',
    containerPadding: 24,
    showSidebar: true,
    density: LAYOUT_DENSITY.COMFORTABLE,
  },
  lg: {
    navigationMode: NAVIGATION_MODE.SIDEBAR,
    sidebarWidth: 260,
    contentMaxWidth: '1200px',
    containerPadding: 32,
    showSidebar: true,
    density: LAYOUT_DENSITY.COZY,
  },
  xl: {
    navigationMode: NAVIGATION_MODE.SIDEBAR,
    sidebarWidth: 280,
    contentMaxWidth: '1400px',
    containerPadding: 32,
    showSidebar: true,
    density: LAYOUT_DENSITY.COZY,
  },
  xxl: {
    navigationMode: NAVIGATION_MODE.SIDEBAR,
    sidebarWidth: 300,
    contentMaxWidth: '1600px',
    containerPadding: 48,
    showSidebar: true,
    density: LAYOUT_DENSITY.COZY,
  },
};

// ============================================
// 工具函数
// ============================================

/**
 * 获取当前窗口宽度
 * @returns {number}
 */
function getWindowWidth() {
  return typeof window !== 'undefined' ? window.innerWidth : 1200;
}

/**
 * 根据窗口宽度获取当前断点
 * @param {number} width - 窗口宽度
 * @returns {string} 断点名称
 */
function getBreakpointByWidth(width) {
  if (width >= BREAKPOINTS.XXL) return 'xxl';
  if (width >= BREAKPOINTS.XL) return 'xl';
  if (width >= BREAKPOINTS.LG) return 'lg';
  if (width >= BREAKPOINTS.MD) return 'md';
  if (width >= BREAKPOINTS.SM) return 'sm';
  return 'xs';
}

/**
 * 比较两个断点的大小
 * @param {string} bp1 - 断点1
 * @param {string} bp2 - 断点2
 * @returns {number} -1: bp1 < bp2, 0: 相等, 1: bp1 > bp2
 */
function compareBreakpoints(bp1, bp2) {
  const index1 = BREAKPOINT_NAMES.indexOf(bp1);
  const index2 = BREAKPOINT_NAMES.indexOf(bp2);
  return index1 - index2;
}

// ============================================
// 主组合式函数
// ============================================

/**
 * 响应式布局组合式函数
 * @param {Object} options - 配置选项
 * @param {string} options.defaultBreakpoint - 默认断点（SSR用）
 * @param {boolean} options.persistSidebarState - 是否持久化侧边栏状态
 * @param {number} options.fontScale - 字体缩放比例
 * @returns {Object} 响应式布局相关属性和方法
 */
export function useResponsive(options = {}) {
  const {
    defaultBreakpoint = 'lg',
    persistSidebarState = true,
    defaultFontScale = 1,
  } = options;

  // ============================================
  // 响应式状态
  // ============================================

  /** 当前窗口宽度 */
  const windowWidth = ref(getWindowWidth());

  /** 当前断点 */
  const currentBreakpoint = ref(defaultBreakpoint);

  /** 侧边栏折叠状态 */
  const sidebarCollapsed = ref(false);

  /** 侧边栏显隐状态（移动端抽屉用） */
  const sidebarVisible = ref(false);

  /** 字体缩放比例 */
  const fontScale = ref(defaultFontScale);

  /** 用户自定义侧边栏宽度 */
  const customSidebarWidth = ref(null);

  // ============================================
  // 计算属性 - 断点检测
  // ============================================

  /** 是否超小屏幕（< 576px） */
  const isXS = computed(() => currentBreakpoint.value === 'xs');

  /** 是否小屏幕（>= 576px） */
  const isSM = computed(() => currentBreakpoint.value === 'sm');

  /** 是否中等屏幕（>= 768px） */
  const isMD = computed(() => currentBreakpoint.value === 'md');

  /** 是否大屏幕（>= 992px） */
  const isLG = computed(() => currentBreakpoint.value === 'lg');

  /** 是否超大屏幕（>= 1200px） */
  const isXL = computed(() => currentBreakpoint.value === 'xl');

  /** 是否超超大屏幕（>= 1400px） */
  const isXXL = computed(() => currentBreakpoint.value === 'xxl');

  /** 是否移动端（xs, sm） */
  const isMobile = computed(() => ['xs', 'sm'].includes(currentBreakpoint.value));

  /** 是否平板（md） */
  const isTablet = computed(() => currentBreakpoint.value === 'md');

  /** 是否桌面端（lg, xl, xxl） */
  const isDesktop = computed(() => ['lg', 'xl', 'xxl'].includes(currentBreakpoint.value));

  /** 是否小屏幕及以下 */
  const isSmallScreen = computed(() => isXS.value || isSM.value);

  /** 是否大屏幕及以上 */
  const isLargeScreen = computed(() => isLG.value || isXL.value || isXXL.value);

  // ============================================
  // 计算属性 - 响应式值
  // ============================================

  /** 当前布局配置 */
  const layoutConfig = computed(() => LAYOUT_CONFIG[currentBreakpoint.value]);

  /** 导航模式 */
  const navigationMode = computed(() => layoutConfig.value.navigationMode);

  /** 布局密度 */
  const layoutDensity = computed(() => layoutConfig.value.density);

  /** 侧边栏宽度 */
  const sidebarWidth = computed(() => {
    if (customSidebarWidth.value !== null) {
      return customSidebarWidth.value;
    }
    if (sidebarCollapsed.value) {
      return isDesktop.value ? 64 : 0;
    }
    return layoutConfig.value.sidebarWidth;
  });

  /** 内容区域最大宽度 */
  const contentMaxWidth = computed(() => layoutConfig.value.contentMaxWidth);

  /** 容器内边距 */
  const containerPadding = computed(() => layoutConfig.value.containerPadding);

  /** 是否显示侧边栏 */
  const showSidebar = computed(() => {
    if (isMobile.value) return sidebarVisible.value;
    return layoutConfig.value.showSidebar;
  });

  // ============================================
  // 计算属性 - 响应式字体
  // ============================================

  /** 当前字体配置 */
  const currentFontSizes = computed(() => {
    const sizes = DEFAULT_FONT_SIZES[currentBreakpoint.value];
    return {
      base: sizes.base * fontScale.value,
      small: sizes.small * fontScale.value,
      medium: sizes.medium * fontScale.value,
      large: sizes.large * fontScale.value,
      xlarge: sizes.xlarge * fontScale.value,
      xxlarge: sizes.xxlarge * fontScale.value,
    };
  });

  /** 字体大小对象 */
  const fontSize = computed(() => ({
    base: `${currentFontSizes.value.base}rem`,
    small: `${currentFontSizes.value.small}rem`,
    medium: `${currentFontSizes.value.medium}rem`,
    large: `${currentFontSizes.value.large}rem`,
    xlarge: `${currentFontSizes.value.xlarge}rem`,
    xxlarge: `${currentFontSizes.value.xxlarge}rem`,
  }));

  /** CSS 字体变量 */
  const fontSizeCSS = computed(() => ({
    '--font-size-base': fontSize.value.base,
    '--font-size-small': fontSize.value.small,
    '--font-size-medium': fontSize.value.medium,
    '--font-size-large': fontSize.value.large,
    '--font-size-xlarge': fontSize.value.xlarge,
    '--font-size-xxlarge': fontSize.value.xxlarge,
  }));

  // ============================================
  // 计算属性 - 响应式间距
  // ============================================

  /** 当前间距配置 */
  const currentSpacing = computed(() => DEFAULT_SPACING[currentBreakpoint.value]);

  /** 间距对象 */
  const spacing = computed(() => ({
    xs: `${currentSpacing.value.xs}px`,
    sm: `${currentSpacing.value.sm}px`,
    md: `${currentSpacing.value.md}px`,
    lg: `${currentSpacing.value.lg}px`,
    xl: `${currentSpacing.value.xl}px`,
    xxl: `${currentSpacing.value.xxl}px`,
  }));

  /** CSS 间距变量 */
  const spacingCSS = computed(() => ({
    '--spacing-xs': spacing.value.xs,
    '--spacing-sm': spacing.value.sm,
    '--spacing-md': spacing.value.md,
    '--spacing-lg': spacing.value.lg,
    '--spacing-xl': spacing.value.xl,
    '--spacing-xxl': spacing.value.xxl,
  }));

  // ============================================
  // 计算属性 - 布局样式
  // ============================================

  /** 布局样式对象 */
  const layout = computed(() => ({
    sidebarWidth: `${sidebarWidth.value}px`,
    contentMaxWidth: contentMaxWidth.value,
    containerPadding: `${containerPadding.value}px`,
    navigationMode: navigationMode.value,
    density: layoutDensity.value,
  }));

  /** CSS 布局变量 */
  const layoutCSS = computed(() => ({
    '--sidebar-width': layout.value.sidebarWidth,
    '--content-max-width': layout.value.contentMaxWidth,
    '--container-padding': layout.value.containerPadding,
    ...fontSizeCSS.value,
    ...spacingCSS.value,
  }));

  /** 响应式类名 */
  const responsiveClass = computed(() => [
    `bp-${currentBreakpoint.value}`,
    `nav-${navigationMode.value}`,
    `density-${layoutDensity.value}`,
    {
      'is-mobile': isMobile.value,
      'is-tablet': isTablet.value,
      'is-desktop': isDesktop.value,
      'sidebar-collapsed': sidebarCollapsed.value,
      'sidebar-visible': sidebarVisible.value,
    },
  ]);

  // ============================================
  // 方法 - 断点判断
  // ============================================

  /**
   * 检查当前断点是否大于指定断点
   * @param {string} bp - 断点名称
   * @returns {boolean}
   */
  function isGreaterThan(bp) {
    return compareBreakpoints(currentBreakpoint.value, bp) > 0;
  }

  /**
   * 检查当前断点是否小于指定断点
   * @param {string} bp - 断点名称
   * @returns {boolean}
   */
  function isLessThan(bp) {
    return compareBreakpoints(currentBreakpoint.value, bp) < 0;
  }

  /**
   * 检查当前断点是否在指定范围内
   * @param {string} min - 最小断点
   * @param {string} max - 最大断点
   * @returns {boolean}
   */
  function isBetween(min, max) {
    const current = compareBreakpoints(currentBreakpoint.value, min);
    const maxCompare = compareBreakpoints(currentBreakpoint.value, max);
    return current >= 0 && maxCompare <= 0;
  }

  /**
   * 检查是否匹配指定断点
   * @param {string} bp - 断点名称
   * @returns {boolean}
   */
  function matches(bp) {
    return currentBreakpoint.value === bp;
  }

  // ============================================
  // 方法 - 侧边栏控制
  // ============================================

  /**
   * 切换侧边栏折叠状态
   */
  function toggleSidebar() {
    if (isMobile.value) {
      sidebarVisible.value = !sidebarVisible.value;
    } else {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    }

    if (persistSidebarState && !isMobile.value) {
      localStorage.setItem('yunshu_sidebar_collapsed', JSON.stringify(sidebarCollapsed.value));
    }
  }

  /**
   * 显示侧边栏
   */
  function showSidebarFn() {
    if (isMobile.value) {
      sidebarVisible.value = true;
    } else {
      sidebarCollapsed.value = false;
    }
  }

  /**
   * 隐藏侧边栏
   */
  function hideSidebarFn() {
    if (isMobile.value) {
      sidebarVisible.value = false;
    } else {
      sidebarCollapsed.value = true;
    }
  }

  /**
   * 设置侧边栏宽度
   * @param {number|null} width - 宽度（像素），null 表示使用默认值
   */
  function setSidebarWidth(width) {
    customSidebarWidth.value = width;
  }

  // ============================================
  // 方法 - 字体控制
  // ============================================

  /**
   * 设置字体缩放比例
   * @param {number} scale - 缩放比例
   */
  function setFontScale(scale) {
    fontScale.value = Math.max(0.75, Math.min(1.5, scale));
    localStorage.setItem('yunshu_font_scale', fontScale.value.toString());
  }

  /**
   * 增大字体
   * @param {number} step - 步进值
   */
  function increaseFontSize(step = 0.1) {
    setFontScale(fontScale.value + step);
  }

  /**
   * 减小字体
   * @param {number} step - 步进值
   */
  function decreaseFontSize(step = 0.1) {
    setFontScale(fontScale.value - step);
  }

  /**
   * 重置字体大小
   */
  function resetFontScale() {
    fontScale.value = 1;
    localStorage.removeItem('yunshu_font_scale');
  }

  // ============================================
  // 方法 - 响应式值获取
  // ============================================

  /**
   * 根据当前断点获取响应式值
   * @param {Object} values - 断点值映射 { xs: value1, sm: value2, ... }
   * @param {*} defaultValue - 默认值
   * @returns {*} 当前断点对应的值
   */
  function getResponsiveValue(values, defaultValue = null) {
    // 从当前断点开始向下查找
    const currentIndex = BREAKPOINT_NAMES.indexOf(currentBreakpoint.value);
    for (let i = currentIndex; i >= 0; i--) {
      const bp = BREAKPOINT_NAMES[i];
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }
    return defaultValue;
  }

  /**
   * 根据条件返回不同值
   * @param {*} mobileValue - 移动端值
   * @param {*} desktopValue - 桌面端值
   * @returns {*}
   */
  function mobileOrDesktop(mobileValue, desktopValue) {
    return isMobile.value ? mobileValue : desktopValue;
  }

  /**
   * 根据条件返回不同值（支持平板）
   * @param {*} mobileValue - 移动端值
   * @param {*} tabletValue - 平板值
   * @param {*} desktopValue - 桌面端值
   * @returns {*}
   */
  function responsiveValue(mobileValue, tabletValue, desktopValue) {
    if (isMobile.value) return mobileValue;
    if (isTablet.value) return tabletValue;
    return desktopValue;
  }

  // ============================================
  // 事件处理
  // ============================================

  /**
   * 处理窗口大小变化
   */
  function handleResize() {
    windowWidth.value = getWindowWidth();
    const newBreakpoint = getBreakpointByWidth(windowWidth.value);

    if (newBreakpoint !== currentBreakpoint.value) {
      currentBreakpoint.value = newBreakpoint;

      // 断点变化时的处理
      if (isMobile.value) {
        sidebarVisible.value = false;
      }
    }
  }

  /**
   * 处理键盘事件（ESC 关闭侧边栏）
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && sidebarVisible.value) {
      sidebarVisible.value = false;
    }
  }

  // ============================================
  // 生命周期
  // ============================================

  onMounted(() => {
    // 初始化窗口宽度
    windowWidth.value = getWindowWidth();
    currentBreakpoint.value = getBreakpointByWidth(windowWidth.value);

    // 恢复持久化状态
    if (persistSidebarState) {
      const savedCollapsed = localStorage.getItem('yunshu_sidebar_collapsed');
      if (savedCollapsed !== null) {
        sidebarCollapsed.value = JSON.parse(savedCollapsed);
      }

      const savedFontScale = localStorage.getItem('yunshu_font_scale');
      if (savedFontScale !== null) {
        fontScale.value = parseFloat(savedFontScale);
      }
    }

    // 添加事件监听
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      document.addEventListener('keydown', handleKeydown);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeydown);
    }
  });

  // ============================================
  // 监听断点变化
  // ============================================

  watch(currentBreakpoint, (newBp, oldBp) => {
    // 可以在这里触发全局事件或执行断点变化时的逻辑
    console.log(`[useResponsive] 断点变化: ${oldBp} -> ${newBp}`);
  });

  // ============================================
  // 返回值
  // ============================================

  return {
    // 断点信息
    breakpoint: currentBreakpoint,
    windowWidth,

    // 断点检测
    isXS,
    isSM,
    isMD,
    isLG,
    isXL,
    isXXL,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,

    // 断点判断方法
    isGreaterThan,
    isLessThan,
    isBetween,
    matches,

    // 布局
    navigationMode,
    layoutDensity,
    sidebarWidth,
    contentMaxWidth,
    containerPadding,
    showSidebar,
    sidebarCollapsed,
    sidebarVisible,
    layout,
    layoutCSS,
    responsiveClass,

    // 字体
    fontSize,
    fontSizeCSS,
    fontScale,

    // 间距
    spacing,
    spacingCSS,

    // 侧边栏控制
    toggleSidebar,
    showSidebar: showSidebarFn,
    hideSidebar: hideSidebarFn,
    setSidebarWidth,

    // 字体控制
    setFontScale,
    increaseFontSize,
    decreaseFontSize,
    resetFontScale,

    // 响应式值获取
    getResponsiveValue,
    mobileOrDesktop,
    responsiveValue,
  };
}

// 默认导出
export default useResponsive;

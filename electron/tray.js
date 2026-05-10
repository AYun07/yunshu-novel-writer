/**
 * 云书 - Electron 系统托盘模块（增强版）
 *
 * 功能说明：
 * - 托盘图标状态（正常/写作中/有通知）
 * - 托盘菜单完善
 * - 托盘通知（写作提醒、目标达成）
 * - 点击托盘图标显示/隐藏窗口
 * - 托盘提示信息
 * - 托盘右键菜单
 * - 托盘气球通知（Windows）
 *
 * 支持平台：
 * - Windows: 系统托盘 + 气球通知
 * - macOS: 菜单栏图标
 * - Linux: 系统托盘
 */

const { Tray, Menu, app, nativeImage, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

// ============================================
// 全局变量
// ============================================

/** @type {Tray|null} 托盘实例 */
let tray = null;

/** @type {BrowserWindow|null} 主窗口引用 */
let mainWindowRef = null;

/** @type {string} 当前托盘状态 */
let currentTrayState = 'normal'; // normal, writing, notification

/** @type {Object} 托盘配置 */
const trayConfig = {
  tooltip: '云书 - AI智能小说创作平台',
  iconSize: 16,
  showBalloon: true,
  balloonTimeout: 5000,
};

/** @type {Object} 托盘图标缓存 */
const iconCache = {
  normal: null,
  writing: null,
  notification: null,
};

// ============================================
// 图标路径
// ============================================

/**
 * 获取图标路径
 * @param {string} type - 图标类型
 * @returns {string|null} 图标路径
 */
function getIconPath(type = 'normal') {
  // 根据平台选择图标
  const platform = process.platform;
  const iconDir = path.join(__dirname, '../public/icons');

  // 图标文件映射
  const iconFiles = {
    win32: {
      normal: 'tray-icon.ico',
      writing: 'tray-icon-writing.ico',
      notification: 'tray-icon-notification.ico',
    },
    darwin: {
      normal: 'tray-iconTemplate.png',
      writing: 'tray-icon-writingTemplate.png',
      notification: 'tray-icon-notificationTemplate.png',
    },
    linux: {
      normal: 'tray-icon.png',
      writing: 'tray-icon-writing.png',
      notification: 'tray-icon-notification.png',
    },
  };

  const files = iconFiles[platform] || iconFiles.linux;
  const iconPath = path.join(iconDir, files[type] || files.normal);

  // 检查文件是否存在
  if (fs.existsSync(iconPath)) {
    return iconPath;
  }

  // 尝试使用备选图标
  const fallbackPaths = [
    path.join(iconDir, 'icon-16x16.png'),
    path.join(iconDir, 'icon-32x32.png'),
    path.join(__dirname, '../public/favicon.svg'),
  ];

  for (const fallback of fallbackPaths) {
    if (fs.existsSync(fallback)) {
      return fallback;
    }
  }

  return null;
}

/**
 * 加载托盘图标
 * @param {string} state - 状态类型
 * @returns {nativeImage|null} 图标对象
 */
function loadTrayIcon(state = 'normal') {
  // 检查缓存
  if (iconCache[state]) {
    return iconCache[state];
  }

  const iconPath = getIconPath(state);
  if (!iconPath) {
    console.warn('[Tray] 未找到托盘图标');
    return null;
  }

  try {
    let icon;

    if (iconPath.endsWith('.svg')) {
      // SVG 图标需要特殊处理
      icon = nativeImage.createFromPath(iconPath);
    } else {
      icon = nativeImage.createFromPath(iconPath);
    }

    // macOS: 设置图标为模板（自动适应深色模式）
    if (process.platform === 'darwin' && state === 'normal') {
      icon.setTemplateImage(true);
    }

    // 缓存图标
    iconCache[state] = icon;

    return icon;
  } catch (error) {
    console.error('[Tray] 加载图标失败:', error);
    return null;
  }
}

// ============================================
// 托盘菜单
// ============================================

/**
 * 获取托盘菜单模板
 * @returns {Array} 菜单模板
 */
function getTrayMenuTemplate() {
  const isDarwin = process.platform === 'darwin';

  return [
    // 应用信息
    {
      label: '云书',
      enabled: false,
    },
    {
      label: `版本 ${app.getVersion()}`,
      enabled: false,
    },
    { type: 'separator' },

    // 窗口控制
    {
      label: '显示主窗口',
      click: () => showMainWindow(),
    },
    {
      label: '隐藏主窗口',
      click: () => hideMainWindow(),
    },
    { type: 'separator' },

    // 快速操作
    {
      label: '新建项目',
      accelerator: isDarwin ? 'Cmd+N' : 'Ctrl+N',
      click: () => sendTrayAction('new-project'),
    },
    {
      label: '保存',
      accelerator: isDarwin ? 'Cmd+S' : 'Ctrl+S',
      click: () => sendTrayAction('save-project'),
    },
    { type: 'separator' },

    // 专注模式
    {
      label: '专注模式',
      type: 'checkbox',
      checked: false,
      click: (menuItem) => sendTrayAction('focus-mode', { enabled: menuItem.checked }),
    },

    // 番茄钟
    {
      label: '番茄钟',
      submenu: [
        {
          label: '开始 25 分钟',
          click: () => sendTrayAction('pomodoro-start', { duration: 25 }),
        },
        {
          label: '开始 45 分钟',
          click: () => sendTrayAction('pomodoro-start', { duration: 45 }),
        },
        {
          label: '休息 5 分钟',
          click: () => sendTrayAction('pomodoro-break', { duration: 5 }),
        },
        { type: 'separator' },
        {
          label: '停止',
          click: () => sendTrayAction('pomodoro-stop'),
        },
      ],
    },
    { type: 'separator' },

    // 写作目标
    {
      label: '今日写作目标',
      submenu: [
        {
          label: '1000 字',
          type: 'radio',
          checked: false,
          click: () => sendTrayAction('set-daily-goal', { goal: 1000 }),
        },
        {
          label: '2000 字',
          type: 'radio',
          checked: false,
          click: () => sendTrayAction('set-daily-goal', { goal: 2000 }),
        },
        {
          label: '3000 字',
          type: 'radio',
          checked: false,
          click: () => sendTrayAction('set-daily-goal', { goal: 3000 }),
        },
        {
          label: '5000 字',
          type: 'radio',
          checked: false,
          click: () => sendTrayAction('set-daily-goal', { goal: 5000 }),
        },
      ],
    },
    { type: 'separator' },

    // 设置
    {
      label: '设置...',
      click: () => sendTrayAction('open-settings'),
    },

    // 检查更新
    {
      label: '检查更新...',
      click: () => sendTrayAction('check-updates'),
    },
    { type: 'separator' },

    // 退出
    {
      label: '退出',
      accelerator: isDarwin ? 'Cmd+Q' : 'Alt+F4',
      click: () => quitApp(),
    },
  ];
}

/**
 * 创建托盘菜单
 * @returns {Menu} 菜单实例
 */
function createTrayMenu() {
  const template = getTrayMenuTemplate();
  return Menu.buildFromTemplate(template);
}

/**
 * 更新托盘菜单
 */
function updateTrayMenu() {
  if (tray) {
    const menu = createTrayMenu();
    tray.setContextMenu(menu);
  }
}

// ============================================
// 托盘操作
// ============================================

/**
 * 发送托盘动作到渲染进程
 * @param {string} action - 动作名称
 * @param {Object} data - 附加数据
 */
function sendTrayAction(action, data = {}) {
  if (mainWindowRef && mainWindowRef.webContents) {
    // 确保窗口可见
    if (!mainWindowRef.isVisible()) {
      showMainWindow();
    }
    mainWindowRef.webContents.send('tray-action', { action, data });
  }
}

/**
 * 显示主窗口
 */
function showMainWindow() {
  if (mainWindowRef) {
    if (mainWindowRef.isMinimized()) {
      mainWindowRef.restore();
    }
    mainWindowRef.show();
    mainWindowRef.focus();
  }
}

/**
 * 隐藏主窗口
 */
function hideMainWindow() {
  if (mainWindowRef) {
    mainWindowRef.hide();
  }
}

/**
 * 切换主窗口显示/隐藏
 */
function toggleMainWindow() {
  if (mainWindowRef) {
    if (mainWindowRef.isVisible()) {
      hideMainWindow();
    } else {
      showMainWindow();
    }
  }
}

/**
 * 退出应用
 */
function quitApp() {
  app.quit();
}

// ============================================
// 托盘通知
// ============================================

/**
 * 显示托盘通知
 * @param {Object} options - 通知选项
 */
function showTrayNotification(options) {
  const {
    title = '云书',
    body = '',
    icon = null,
    sound = false,
    timeout = trayConfig.balloonTimeout,
  } = options;

  // Windows: 使用托盘气球通知
  if (process.platform === 'win32' && tray) {
    tray.displayBalloon({
      iconType: icon ? 'custom' : 'none',
      icon: icon ? nativeImage.createFromPath(icon) : undefined,
      title,
      content: body,
      respectQuietTime: true,
    });
  }

  // macOS/Linux: 使用系统通知
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      icon: icon || getIconPath('normal'),
      silent: !sound,
    });

    notification.on('click', () => {
      showMainWindow();
    });

    notification.show();
  }
}

/**
 * 显示写作提醒通知
 * @param {Object} options - 选项
 */
function showWritingReminder(options = {}) {
  const {
    message = '该写作了！保持创作节奏',
    duration = 15,
  } = options;

  showTrayNotification({
    title: '写作提醒',
    body: message,
    sound: true,
  });

  // 更新托盘状态
  updateTrayState('notification');

  // 3秒后恢复状态
  setTimeout(() => {
    updateTrayState('normal');
  }, 3000);
}

/**
 * 显示目标达成通知
 * @param {Object} options - 选项
 */
function showGoalAchievedNotification(options = {}) {
  const {
    goal = 2000,
    actual = 2000,
  } = options;

  showTrayNotification({
    title: '目标达成！',
    body: `恭喜！您已完成今日写作目标 ${actual} 字！`,
    sound: true,
  });

  // 更新托盘状态
  updateTrayState('notification');
}

/**
 * 显示番茄钟通知
 * @param {Object} options - 选项
 */
function showPomodoroNotification(options = {}) {
  const {
    type = 'complete', // complete, break
    duration = 25,
  } = options;

  if (type === 'complete') {
    showTrayNotification({
      title: '番茄钟完成',
      body: `您已完成 ${duration} 分钟的专注写作！休息一下吧。`,
      sound: true,
    });
  } else if (type === 'break') {
    showTrayNotification({
      title: '休息结束',
      body: '休息时间结束，准备好开始新的番茄钟了吗？',
      sound: true,
    });
  }
}

/**
 * 显示保存成功通知
 */
function showSaveSuccessNotification() {
  showTrayNotification({
    title: '保存成功',
    body: '您的作品已保存',
    sound: false,
  });
}

/**
 * 显示自动保存通知
 */
function showAutoSaveNotification() {
  showTrayNotification({
    title: '自动保存',
    body: '您的作品已自动保存',
    sound: false,
  });
}

// ============================================
// 托盘状态管理
// ============================================

/**
 * 更新托盘状态
 * @param {string} state - 状态类型 (normal, writing, notification)
 */
function updateTrayState(state) {
  if (!tray || currentTrayState === state) {
    return;
  }

  currentTrayState = state;

  // 加载对应状态的图标
  const icon = loadTrayIcon(state);
  if (icon) {
    tray.setImage(icon);
  }

  // 更新提示文本
  const tooltips = {
    normal: trayConfig.tooltip,
    writing: `${trayConfig.tooltip} - 写作中`,
    notification: `${trayConfig.tooltip} - 有新消息`,
  };
  tray.setToolTip(tooltips[state] || trayConfig.tooltip);
}

/**
 * 设置托盘图标
 * @param {string|nativeImage} icon - 图标路径或对象
 */
function setTrayIcon(icon) {
  if (tray) {
    if (typeof icon === 'string') {
      tray.setImage(nativeImage.createFromPath(icon));
    } else {
      tray.setImage(icon);
    }
  }
}

/**
 * 设置托盘提示文本
 * @param {string} tooltip - 提示文本
 */
function setTrayTooltip(tooltip) {
  if (tray) {
    tray.setToolTip(tooltip);
  }
}

/**
 * 获取当前托盘状态
 * @returns {string} 当前状态
 */
function getTrayState() {
  return currentTrayState;
}

// ============================================
// 托盘创建与销毁
// ============================================

/**
 * 创建系统托盘
 * @param {BrowserWindow} mainWindow - 主窗口实例
 * @returns {Tray} 托盘实例
 */
function createTray(mainWindow) {
  mainWindowRef = mainWindow;

  // 如果托盘已存在，先销毁
  if (tray) {
    destroyTray();
  }

  // 加载图标
  const icon = loadTrayIcon('normal');
  if (!icon) {
    console.error('[Tray] 无法创建托盘：图标加载失败');
    return null;
  }

  // 创建托盘
  tray = new Tray(icon);

  // 设置提示文本
  tray.setToolTip(trayConfig.tooltip);

  // 设置上下文菜单
  const menu = createTrayMenu();
  tray.setContextMenu(menu);

  // 点击托盘图标
  tray.on('click', (event, bounds) => {
    // macOS: Command+点击显示菜单
    if (process.platform === 'darwin' && event.metaKey) {
      tray.popUpContextMenu();
      return;
    }

    // 切换窗口显示
    toggleMainWindow();
  });

  // 双击托盘图标
  tray.on('double-click', () => {
    showMainWindow();
  });

  // 右键点击（Windows/Linux）
  tray.on('right-click', () => {
    tray.popUpContextMenu();
  });

  // 气球通知点击（Windows）
  tray.on('balloon-click', () => {
    showMainWindow();
  });

  // 气球通知关闭
  tray.on('balloon-closed', () => {
    console.log('[Tray] 气球通知已关闭');
  });

  console.log('[Tray] 系统托盘已创建');

  return tray;
}

/**
 * 销毁托盘
 */
function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
    console.log('[Tray] 系统托盘已销毁');
  }
}

/**
 * 获取托盘实例
 * @returns {Tray|null} 托盘实例
 */
function getTray() {
  return tray;
}

// ============================================
// 写作状态管理
// ============================================

/**
 * 开始写作
 * 更新托盘状态为写作中
 */
function startWriting() {
  updateTrayState('writing');
}

/**
 * 停止写作
 * 恢复托盘状态为正常
 */
function stopWriting() {
  updateTrayState('normal');
}

/**
 * 设置写作进度
 * @param {Object} progress - 进度信息
 */
function setWritingProgress(progress) {
  const { current, goal, percentage } = progress;

  // 更新托盘提示
  const tooltip = `云书\n今日进度: ${current}/${goal} 字 (${percentage}%)`;
  setTrayTooltip(tooltip);

  // 如果达到目标，显示通知
  if (current >= goal && percentage >= 100) {
    showGoalAchievedNotification({ goal, actual: current });
  }
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  // 创建与销毁
  createTray,
  destroyTray,
  getTray,

  // 窗口控制
  showMainWindow,
  hideMainWindow,
  toggleMainWindow,

  // 托盘状态
  updateTrayState,
  setTrayIcon,
  setTrayTooltip,
  getTrayState,

  // 写作状态
  startWriting,
  stopWriting,
  setWritingProgress,

  // 通知
  showTrayNotification,
  showWritingReminder,
  showGoalAchievedNotification,
  showPomodoroNotification,
  showSaveSuccessNotification,
  showAutoSaveNotification,

  // 菜单
  updateTrayMenu,
  createTrayMenu,

  // 工具函数
  sendTrayAction,
  loadTrayIcon,
  getIconPath,
};

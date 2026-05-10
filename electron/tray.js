/**
 * 云书 - Electron 系统托盘模块
 * 
 * 功能说明：
 * - 创建和管理系统托盘图标
 * - 右键菜单（新建项目、快速写作、显示/隐藏窗口、退出）
 * - 托盘点击行为（显示/隐藏窗口）
 * - 托盘通知（写作提醒、目标达成）
 * - 托盘图标状态变化（正常/有未读/写作中）
 * 
 * 支持平台：
 * - Windows: 系统托盘
 * - macOS: 菜单栏图标
 * - Linux: 系统托盘
 */

const { Tray, Menu, nativeImage, app, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

// ============================================
// 全局变量
// ============================================

/** @type {Tray|null} 托盘实例 */
let tray = null;

/** @type {BrowserWindow|null} 主窗口引用 */
let mainWindowRef = null;

/** @type {string} 当前托盘图标状态 */
let currentIconState = 'normal';

/** @type {Object} 托盘图标缓存 */
const iconCache = {};

// ============================================
// 托盘图标管理
// ============================================

/**
 * 获取托盘图标路径
 * @param {string} state - 图标状态 ('normal' | 'unread' | 'writing')
 * @returns {nativeImage} 图标对象
 */
function getTrayIcon(state = 'normal') {
  // 如果已缓存，直接返回
  if (iconCache[state]) {
    return iconCache[state];
  }

  // 图标基础路径
  const iconsDir = path.join(__dirname, '../public/icons');
  
  // 根据状态选择图标
  const iconFiles = {
    normal: 'tray-icon.png',
    unread: 'tray-icon-unread.png',
    writing: 'tray-icon-writing.png',
  };

  // 平台特定处理
  const platform = process.platform;
  
  let iconPath;
  
  if (platform === 'darwin') {
    // macOS: 使用模板图标（自动适配深色/浅色模式）
    iconPath = path.join(iconsDir, 'tray-iconTemplate.png');
    
    // 如果模板图标不存在，尝试普通图标
    if (!fs.existsSync(iconPath)) {
      iconPath = path.join(iconsDir, iconFiles[state] || iconFiles.normal);
    }
  } else {
    // Windows/Linux: 使用普通图标
    iconPath = path.join(iconsDir, iconFiles[state] || iconFiles.normal);
  }

  // 检查图标文件是否存在
  if (fs.existsSync(iconPath)) {
    let icon = nativeImage.createFromPath(iconPath);
    
    // macOS: 设置为模板图标
    if (platform === 'darwin') {
      icon = icon.resize({ width: 16, height: 16 });
      // 如果是模板图标，设置模板属性
      if (iconPath.includes('Template')) {
        icon.setTemplateImage(true);
      }
    }
    
    // Windows: 确保图标大小合适
    if (platform === 'win32') {
      icon = icon.resize({ width: 16, height: 16 });
    }
    
    // 缓存图标
    iconCache[state] = icon;
    return icon;
  }

  // 如果图标文件不存在，创建一个简单的默认图标
  return createDefaultIcon(state);
}

/**
 * 创建默认托盘图标
 * @param {string} state - 图标状态
 * @returns {nativeImage} 图标对象
 */
function createDefaultIcon(state = 'normal') {
  // 根据状态选择颜色
  const colors = {
    normal: '#4A90D9',    // 蓝色 - 正常状态
    unread: '#FF9500',    // 橙色 - 有未读消息
    writing: '#34C759',   // 绿色 - 写作中
  };

  const color = colors[state] || colors.normal;
  
  // 创建一个简单的SVG图标
  const svg = `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" fill="${color}"/>
      <text x="8" y="11" font-size="8" fill="white" text-anchor="middle" font-family="Arial">云</text>
    </svg>
  `;

  const icon = nativeImage.createFromBuffer(Buffer.from(svg));
  iconCache[state] = icon;
  return icon;
}

/**
 * 更新托盘图标
 * @param {string} state - 图标状态
 */
function updateTrayIconState(state) {
  if (!tray) return;
  
  currentIconState = state;
  tray.setImage(getTrayIcon(state));
  
  console.log('[Tray] 图标状态已更新:', state);
}

// ============================================
// 托盘菜单
// ============================================

/**
 * 创建托盘右键菜单
 * @returns {Menu} 菜单实例
 */
function createTrayMenu() {
  const isWindowVisible = mainWindowRef && mainWindowRef.isVisible() && !mainWindowRef.isMinimized();
  
  const template = [
    // 新建项目
    {
      label: '新建项目',
      click: () => {
        showMainWindow();
        if (mainWindowRef) {
          mainWindowRef.webContents.send('menu-action', 'new-project');
        }
      },
    },
    
    // 打开项目
    {
      label: '打开项目...',
      click: () => {
        showMainWindow();
        if (mainWindowRef) {
          mainWindowRef.webContents.send('menu-action', 'open-project');
        }
      },
    },
    
    // 分隔线
    { type: 'separator' },
    
    // 快速写作
    {
      label: '快速写作',
      click: () => {
        showMainWindow();
        if (mainWindowRef) {
          mainWindowRef.webContents.send('menu-action', 'quick-write');
        }
      },
    },
    
    // 专注模式
    {
      label: '专注模式',
      click: () => {
        showMainWindow();
        if (mainWindowRef) {
          mainWindowRef.webContents.send('menu-action', 'focus-mode');
        }
      },
    },
    
    // 分隔线
    { type: 'separator' },
    
    // 显示/隐藏窗口
    {
      label: isWindowVisible ? '隐藏窗口' : '显示窗口',
      click: () => {
        toggleMainWindow();
      },
    },
    
    // 分隔线
    { type: 'separator' },
    
    // 退出应用
    {
      label: '退出云书',
      click: () => {
        // 设置退出标志
        app.isQuitting = true;
        app.quit();
      },
    },
  ];

  return Menu.buildFromTemplate(template);
}

/**
 * 更新托盘菜单
 */
function updateTrayMenu() {
  if (!tray) return;
  tray.setContextMenu(createTrayMenu());
}

// ============================================
// 窗口控制
// ============================================

/**
 * 显示主窗口
 */
function showMainWindow() {
  if (!mainWindowRef) return;
  
  // 如果窗口最小化，先恢复
  if (mainWindowRef.isMinimized()) {
    mainWindowRef.restore();
  }
  
  // 显示窗口
  mainWindowRef.show();
  
  // 聚焦窗口
  mainWindowRef.focus();
  
  // 更新托盘菜单
  updateTrayMenu();
}

/**
 * 隐藏主窗口
 */
function hideMainWindow() {
  if (!mainWindowRef) return;
  
  mainWindowRef.hide();
  
  // 更新托盘菜单
  updateTrayMenu();
}

/**
 * 切换主窗口显示/隐藏
 */
function toggleMainWindow() {
  if (!mainWindowRef) return;
  
  if (mainWindowRef.isVisible() && !mainWindowRef.isMinimized()) {
    hideMainWindow();
  } else {
    showMainWindow();
  }
}

// ============================================
// 托盘通知
// ============================================

/**
 * 显示托盘通知（Windows特有）
 * @param {string} title - 标题
 * @param {string} message - 消息内容
 * @param {string} [iconPath] - 图标路径
 */
function showTrayMessage(title, message, iconPath) {
  if (!tray) return;
  
  // Windows: 使用托盘的displayBalloon方法
  if (process.platform === 'win32') {
    tray.displayBalloon({
      title: title,
      content: message,
      iconType: 'info',
      // 如果提供了图标路径
      icon: iconPath ? nativeImage.createFromPath(iconPath) : undefined,
    });
  } else {
    // macOS/Linux: 使用系统通知
    showSystemNotification(title, message);
  }
}

/**
 * 显示系统通知
 * @param {string} title - 标题
 * @param {string} body - 内容
 */
function showSystemNotification(title, body) {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title,
      body: body,
      icon: getTrayIcon('normal'),
    });
    
    notification.on('click', () => {
      showMainWindow();
    });
    
    notification.show();
  }
}

/**
 * 显示写作提醒通知
 * @param {string} message - 提醒消息
 */
function showWritingReminder(message) {
  showTrayMessage('云书 - 写作提醒', message);
  updateTrayIconState('writing');
  
  // 5秒后恢复正常状态
  setTimeout(() => {
    updateTrayIconState('normal');
  }, 5000);
}

/**
 * 显示目标达成通知
 * @param {string} goalType - 目标类型
 * @param {string} message - 消息内容
 */
function showGoalAchieved(goalType, message) {
  showTrayMessage(`云书 - ${goalType}目标达成！`, message);
  updateTrayIconState('unread');
  
  // 点击窗口后恢复正常状态
  if (mainWindowRef) {
    mainWindowRef.once('focus', () => {
      updateTrayIconState('normal');
    });
  }
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
  if (tray) {
    console.warn('[Tray] 托盘已存在');
    return tray;
  }
  
  mainWindowRef = mainWindow;
  
  // 创建托盘图标
  const icon = getTrayIcon('normal');
  tray = new Tray(icon);
  
  // 设置托盘提示文本
  tray.setToolTip('云书 - AI智能小说创作平台');
  
  // 设置右键菜单
  tray.setContextMenu(createTrayMenu());
  
  // 点击事件（不同平台行为不同）
  if (process.platform === 'darwin') {
    // macOS: 点击显示菜单（默认行为）
    tray.on('mouse-down', () => {
      toggleMainWindow();
    });
  } else {
    // Windows/Linux: 点击显示/隐藏窗口
    tray.on('click', () => {
      toggleMainWindow();
    });
    
    // 双击显示窗口
    tray.on('double-click', () => {
      showMainWindow();
    });
  }
  
  // 右键点击显示菜单（Windows/Linux默认行为）
  tray.on('right-click', () => {
    updateTrayMenu();
  });
  
  console.log('[Tray] 系统托盘已创建');
  
  return tray;
}

/**
 * 销毁系统托盘
 */
function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
    mainWindowRef = null;
    console.log('[Tray] 系统托盘已销毁');
  }
}

/**
 * 获取托盘实例
 * @returns {Tray|null}
 */
function getTray() {
  return tray;
}

/**
 * 更新托盘图标（供外部调用）
 * @param {string} message - 可选的消息（用于首次托盘提示）
 */
function updateTrayIcon(message) {
  if (!tray) return;
  
  if (message) {
    showTrayMessage('云书', message);
  }
}

// ============================================
// IPC事件处理
// ============================================

/**
 * 处理托盘相关的IPC事件
 * @param {IpcMain} ipcMain - IPC主进程对象
 */
function setupTrayIpc(ipcMain) {
  // 设置托盘图标状态
  ipcMain.on('set-tray-icon', (event, iconType) => {
    updateTrayIconState(iconType);
  });
  
  // 显示托盘消息
  ipcMain.on('show-tray-message', (event, title, message) => {
    showTrayMessage(title, message);
  });
  
  // 显示写作提醒
  ipcMain.handle('show-writing-reminder', (event, message) => {
    showWritingReminder(message);
    return true;
  });
  
  // 显示目标达成通知
  ipcMain.handle('show-goal-achieved', (event, goalType, message) => {
    showGoalAchieved(goalType, message);
    return true;
  });
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  // 创建与销毁
  createTray,
  destroyTray,
  getTray,
  
  // 图标管理
  updateTrayIcon,
  updateTrayIconState,
  getTrayIcon,
  
  // 菜单管理
  createTrayMenu,
  updateTrayMenu,
  
  // 窗口控制
  showMainWindow,
  hideMainWindow,
  toggleMainWindow,
  
  // 通知
  showTrayMessage,
  showSystemNotification,
  showWritingReminder,
  showGoalAchieved,
  
  // IPC设置
  setupTrayIpc,
};

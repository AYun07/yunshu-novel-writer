/**
 * 云书 - Electron 原生菜单模块（增强版）
 *
 * 功能说明：
 * - 应用菜单（macOS）
 * - 文件菜单（新建/打开/保存/导出）
 * - 编辑菜单（撤销/重做/剪切/复制/粘贴/全选/查找）
 * - 视图菜单（放大/缩小/重置/全屏）
 * - 窗口菜单（最小化/关闭/切换）
 * - 帮助菜单（文档/反馈/检查更新/关于）
 * - 所有菜单项绑定实际功能
 * - 快捷键绑定
 * - 菜单项状态管理
 *
 * 支持平台：
 * - macOS: 应用菜单（在屏幕顶部菜单栏）
 * - Windows/Linux: 窗口菜单（在窗口标题栏下）
 */

const { Menu, app, shell, dialog, ipcMain } = require('electron');

// ============================================
// 全局变量
// ============================================

/** @type {BrowserWindow|null} 主窗口引用 */
let mainWindowRef = null;

/** @type {Menu|null} 当前菜单实例 */
let currentMenu = null;

/** @type {Object} 菜单项状态 */
const menuState = {
  focused: true,           // 窗口是否聚焦
  hasProject: false,       // 是否有打开的项目
  hasUnsavedChanges: false, // 是否有未保存的更改
  canUndo: false,          // 是否可以撤销
  canRedo: false,          // 是否可以重做
  isFullscreen: false,     // 是否全屏
  sidebarVisible: true,    // 侧边栏是否可见
  zoomLevel: 0,            // 缩放级别
};

/** @type {string[]} 最近打开的项目列表 */
let recentProjects = [];

// ============================================
// 菜单模板
// ============================================

/**
 * 获取菜单模板
 * @param {boolean} isDarwin - 是否为macOS
 * @returns {Array} 菜单模板数组
 */
function getMenuTemplate(isDarwin) {
  const template = [];

  // ==========================================
  // macOS 应用菜单（第一个菜单）
  // ==========================================
  if (isDarwin) {
    template.push({
      label: app.name,
      submenu: [
        {
          label: `关于 ${app.name}`,
          role: 'about',
          click: () => showAboutDialog(),
        },
        { type: 'separator' },
        {
          label: '偏好设置...',
          accelerator: 'Cmd+,',
          click: () => sendMenuAction('open-settings'),
        },
        {
          label: '服务',
          role: 'services',
          submenu: [],
        },
        { type: 'separator' },
        {
          label: `隐藏 ${app.name}`,
          role: 'hide',
        },
        {
          label: '隐藏其他',
          role: 'hideOthers',
        },
        {
          label: '显示全部',
          role: 'unhide',
        },
        { type: 'separator' },
        {
          label: `退出 ${app.name}`,
          role: 'quit',
        },
      ],
    });
  }

  // ==========================================
  // 文件菜单
  // ==========================================
  template.push({
    label: '文件',
    submenu: [
      // 新建项目
      {
        label: '新建项目...',
        accelerator: isDarwin ? 'Cmd+N' : 'Ctrl+N',
        click: () => sendMenuAction('new-project'),
      },

      // 打开项目
      {
        label: '打开项目...',
        accelerator: isDarwin ? 'Cmd+O' : 'Ctrl+O',
        click: () => sendMenuAction('open-project'),
      },

      // 最近打开的项目
      {
        label: '最近打开',
        submenu: buildRecentProjectsMenu(),
      },

      { type: 'separator' },

      // 保存
      {
        label: '保存',
        accelerator: isDarwin ? 'Cmd+S' : 'Ctrl+S',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('save-project'),
      },

      // 另存为
      {
        label: '另存为...',
        accelerator: isDarwin ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('save-project-as'),
      },

      // 自动保存
      {
        label: '自动保存',
        type: 'checkbox',
        checked: false,
        click: (menuItem) => {
          sendMenuAction('toggle-auto-save', { enabled: menuItem.checked });
        },
      },

      { type: 'separator' },

      // 导入
      {
        label: '导入',
        submenu: [
          {
            label: '导入 TXT...',
            click: () => sendMenuAction('import-txt'),
          },
          {
            label: '导入 Markdown...',
            click: () => sendMenuAction('import-md'),
          },
          {
            label: '导入 EPUB...',
            click: () => sendMenuAction('import-epub'),
          },
        ],
      },

      // 导出菜单
      {
        label: '导出',
        submenu: [
          {
            label: '导出为 TXT...',
            click: () => sendMenuAction('export-txt'),
          },
          {
            label: '导出为 DOCX...',
            click: () => sendMenuAction('export-docx'),
          },
          {
            label: '导出为 PDF...',
            click: () => sendMenuAction('export-pdf'),
          },
          {
            label: '导出为 EPUB...',
            click: () => sendMenuAction('export-epub'),
          },
        ],
      },

      { type: 'separator' },

      // 关闭项目
      {
        label: '关闭项目',
        accelerator: isDarwin ? 'Cmd+W' : 'Ctrl+W',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('close-project'),
      },

      // 非macOS显示退出
      ...(!isDarwin ? [
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'Alt+F4',
          role: 'quit',
        },
      ] : []),
    ],
  });

  // ==========================================
  // 编辑菜单
  // ==========================================
  template.push({
    label: '编辑',
    submenu: [
      // 撤销
      {
        label: '撤销',
        accelerator: isDarwin ? 'Cmd+Z' : 'Ctrl+Z',
        enabled: menuState.canUndo,
        click: () => sendMenuAction('undo'),
      },

      // 重做
      {
        label: '重做',
        accelerator: isDarwin ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z',
        enabled: menuState.canRedo,
        click: () => sendMenuAction('redo'),
      },

      { type: 'separator' },

      // 剪切
      {
        label: '剪切',
        accelerator: isDarwin ? 'Cmd+X' : 'Ctrl+X',
        role: 'cut',
      },

      // 复制
      {
        label: '复制',
        accelerator: isDarwin ? 'Cmd+C' : 'Ctrl+C',
        role: 'copy',
      },

      // 粘贴
      {
        label: '粘贴',
        accelerator: isDarwin ? 'Cmd+V' : 'Ctrl+V',
        role: 'paste',
      },

      // 粘贴并匹配样式
      {
        label: '粘贴并匹配样式',
        accelerator: isDarwin ? 'Cmd+Shift+V' : 'Ctrl+Shift+V',
        role: 'pasteAndMatchStyle',
      },

      // 删除
      {
        label: '删除',
        click: () => sendMenuAction('delete'),
      },

      // 全选
      {
        label: '全选',
        accelerator: isDarwin ? 'Cmd+A' : 'Ctrl+A',
        role: 'selectAll',
      },

      { type: 'separator' },

      // 查找
      {
        label: '查找...',
        accelerator: isDarwin ? 'Cmd+F' : 'Ctrl+F',
        click: () => sendMenuAction('find'),
      },

      // 查找下一个
      {
        label: '查找下一个',
        accelerator: isDarwin ? 'Cmd+G' : 'Ctrl+G',
        enabled: false,
        click: () => sendMenuAction('find-next'),
      },

      // 查找上一个
      {
        label: '查找上一个',
        accelerator: isDarwin ? 'Cmd+Shift+G' : 'Ctrl+Shift+G',
        enabled: false,
        click: () => sendMenuAction('find-previous'),
      },

      // 替换
      {
        label: '替换...',
        accelerator: isDarwin ? 'Cmd+Option+F' : 'Ctrl+H',
        click: () => sendMenuAction('replace'),
      },

      // 转到行
      {
        label: '转到行...',
        accelerator: isDarwin ? 'Cmd+L' : 'Ctrl+G',
        click: () => sendMenuAction('go-to-line'),
      },

      { type: 'separator' },

      // 拼写和语法
      {
        label: '拼写和语法',
        submenu: [
          {
            label: '立即检查文档',
            click: () => sendMenuAction('check-spelling'),
          },
          { type: 'separator' },
          {
            label: '键入时检查拼写',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => {
              sendMenuAction('toggle-spell-check', { enabled: menuItem.checked });
            },
          },
          {
            label: '检查语法和拼写',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => {
              sendMenuAction('toggle-grammar-check', { enabled: menuItem.checked });
            },
          },
          {
            label: '自动纠正拼写',
            type: 'checkbox',
            checked: false,
            click: (menuItem) => {
              sendMenuAction('toggle-auto-correct', { enabled: menuItem.checked });
            },
          },
        ],
      },
    ],
  });

  // ==========================================
  // 视图菜单
  // ==========================================
  template.push({
    label: '视图',
    submenu: [
      // 重新加载
      {
        label: '重新加载',
        accelerator: isDarwin ? 'Cmd+R' : 'Ctrl+R',
        click: () => {
          if (mainWindowRef) {
            mainWindowRef.reload();
          }
        },
      },

      // 强制重新加载
      {
        label: '强制重新加载',
        accelerator: isDarwin ? 'Cmd+Shift+R' : 'Ctrl+Shift+R',
        click: () => {
          if (mainWindowRef) {
            mainWindowRef.webContents.reloadIgnoringCache();
          }
        },
      },

      // 开发者工具
      {
        label: '开发者工具',
        accelerator: isDarwin ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
        click: () => {
          if (mainWindowRef) {
            mainWindowRef.webContents.toggleDevTools();
          }
        },
      },

      { type: 'separator' },

      // 全屏
      {
        label: menuState.isFullscreen ? '退出全屏' : '全屏',
        accelerator: isDarwin ? 'Ctrl+Cmd+F' : 'F11',
        click: () => toggleFullscreen(),
      },

      // 侧边栏
      {
        label: menuState.sidebarVisible ? '隐藏侧边栏' : '显示侧边栏',
        accelerator: isDarwin ? 'Cmd+B' : 'Ctrl+B',
        click: () => sendMenuAction('toggle-sidebar'),
      },

      // 工具栏
      {
        label: '显示工具栏',
        type: 'checkbox',
        checked: true,
        click: (menuItem) => {
          sendMenuAction('toggle-toolbar', { visible: menuItem.checked });
        },
      },

      // 状态栏
      {
        label: '显示状态栏',
        type: 'checkbox',
        checked: true,
        click: (menuItem) => {
          sendMenuAction('toggle-status-bar', { visible: menuItem.checked });
        },
      },

      { type: 'separator' },

      // 缩放
      {
        label: '放大',
        accelerator: isDarwin ? 'Cmd+=' : 'Ctrl+=',
        click: () => zoomIn(),
      },
      {
        label: '缩小',
        accelerator: isDarwin ? 'Cmd+-' : 'Ctrl+-',
        click: () => zoomOut(),
      },
      {
        label: '重置缩放',
        accelerator: isDarwin ? 'Cmd+0' : 'Ctrl+0',
        click: () => resetZoom(),
      },

      { type: 'separator' },

      // 主题
      {
        label: '主题',
        submenu: [
          {
            label: '浅色',
            type: 'radio',
            checked: true,
            click: () => sendMenuAction('set-theme', { theme: 'light' }),
          },
          {
            label: '深色',
            type: 'radio',
            checked: false,
            click: () => sendMenuAction('set-theme', { theme: 'dark' }),
          },
          {
            label: '自动',
            type: 'radio',
            checked: false,
            click: () => sendMenuAction('set-theme', { theme: 'auto' }),
          },
        ],
      },

      // 专注模式
      {
        label: '专注模式',
        accelerator: isDarwin ? 'Cmd+Shift+F' : 'Ctrl+Shift+F',
        click: () => sendMenuAction('focus-mode'),
      },
    ],
  });

  // ==========================================
  // 项目菜单
  // ==========================================
  template.push({
    label: '项目',
    submenu: [
      // 项目信息
      {
        label: '项目信息...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('project-info'),
      },

      { type: 'separator' },

      // 新建章节
      {
        label: '新建章节',
        accelerator: isDarwin ? 'Cmd+Shift+N' : 'Ctrl+Shift+N',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('new-chapter'),
      },

      // 章节管理
      {
        label: '章节管理...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('chapter-management'),
      },

      { type: 'separator' },

      // 角色管理
      {
        label: '角色管理...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('character-management'),
      },

      // 世界观
      {
        label: '世界观设定...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('worldview-management'),
      },

      // 大纲
      {
        label: '故事大纲...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('outline-management'),
      },

      { type: 'separator' },

      // 素材库
      {
        label: '素材库...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('corpus-management'),
      },

      // 提示词库
      {
        label: '提示词库...',
        click: () => sendMenuAction('prompts-library'),
      },
    ],
  });

  // ==========================================
  // 工具菜单
  // ==========================================
  template.push({
    label: '工具',
    submenu: [
      // AI创作
      {
        label: 'AI创作助手',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('ai-assistant'),
      },

      // AI续写
      {
        label: 'AI续写',
        accelerator: isDarwin ? 'Cmd+Return' : 'Ctrl+Return',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('ai-continue'),
      },

      // AI改写
      {
        label: 'AI改写',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('ai-rewrite'),
      },

      // AI扩写
      {
        label: 'AI扩写',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('ai-expand'),
      },

      { type: 'separator' },

      // 质量分析
      {
        label: '质量分析',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('quality-analysis'),
      },

      // 敏感词检测
      {
        label: '敏感词检测',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('sensitive-words-check'),
      },

      // 字数统计
      {
        label: '字数统计',
        accelerator: isDarwin ? 'Cmd+Shift+W' : 'Ctrl+Shift+W',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('word-count'),
      },

      { type: 'separator' },

      // 写作目标
      {
        label: '写作目标...',
        click: () => sendMenuAction('writing-goals'),
      },

      // 写作统计
      {
        label: '写作统计...',
        enabled: menuState.hasProject,
        click: () => sendMenuAction('writing-stats'),
      },

      // 番茄钟
      {
        label: '番茄钟',
        click: () => sendMenuAction('pomodoro'),
      },

      { type: 'separator' },

      // 模板管理
      {
        label: '模板管理...',
        click: () => sendMenuAction('template-management'),
      },

      // 设置
      {
        label: '设置...',
        accelerator: isDarwin ? 'Cmd+,' : 'Ctrl+,',
        click: () => sendMenuAction('open-settings'),
      },
    ],
  });

  // ==========================================
  // 窗口菜单（macOS）
  // ==========================================
  if (isDarwin) {
    template.push({
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'Cmd+M',
          role: 'minimize',
        },
        {
          label: '缩放',
          role: 'zoom',
        },
        { type: 'separator' },
        {
          label: '前置全部窗口',
          role: 'front',
        },
        { type: 'separator' },
        {
          label: '新建窗口',
          accelerator: 'Cmd+Shift+N',
          click: () => sendMenuAction('new-window'),
        },
        {
          label: '关闭窗口',
          accelerator: 'Cmd+W',
          role: 'close',
        },
      ],
    });
  }

  // ==========================================
  // 帮助菜单
  // ==========================================
  template.push({
    label: '帮助',
    submenu: [
      // 关于（非macOS）
      ...(!isDarwin ? [
        {
          label: `关于 ${app.name}`,
          click: () => showAboutDialog(),
        },
        { type: 'separator' },
      ] : []),

      // 文档
      {
        label: '使用文档',
        click: () => shell.openExternal('https://yunshu.app/docs'),
      },

      // 快捷键
      {
        label: '快捷键参考',
        accelerator: isDarwin ? 'Cmd+/' : 'Ctrl+/',
        click: () => sendMenuAction('show-shortcuts'),
      },

      // 教程
      {
        label: '入门教程',
        click: () => shell.openExternal('https://yunshu.app/tutorial'),
      },

      { type: 'separator' },

      // 反馈
      {
        label: '提交反馈',
        click: () => shell.openExternal('https://yunshu.app/feedback'),
      },

      // 报告问题
      {
        label: '报告问题',
        click: () => shell.openExternal('https://yunshu.app/issues'),
      },

      // 功能建议
      {
        label: '功能建议',
        click: () => shell.openExternal('https://yunshu.app/feature-request'),
      },

      { type: 'separator' },

      // 检查更新
      {
        label: '检查更新...',
        click: () => sendMenuAction('check-updates'),
      },

      // 查看日志
      {
        label: '查看日志',
        click: () => sendMenuAction('view-logs'),
      },

      { type: 'separator' },

      // 开发者工具
      {
        label: '开发者工具',
        accelerator: isDarwin ? 'Alt+Cmd+I' : 'F12',
        click: () => {
          if (mainWindowRef) {
            mainWindowRef.webContents.toggleDevTools();
          }
        },
      },

      // 重启并清除缓存
      {
        label: '重启并清除缓存',
        click: () => {
          if (mainWindowRef) {
            mainWindowRef.webContents.session.clearCache().then(() => {
              mainWindowRef.reload();
            });
          }
        },
      },
    ],
  });

  return template;
}

// ============================================
// 菜单操作
// ============================================

/**
 * 构建最近打开项目菜单
 * @returns {Array} 菜单项数组
 */
function buildRecentProjectsMenu() {
  if (recentProjects.length === 0) {
    return [
      {
        label: '(无最近项目)',
        enabled: false,
      },
    ];
  }

  const items = recentProjects.slice(0, 10).map((project, index) => ({
    label: project.name || `项目 ${index + 1}`,
    accelerator: index < 9 ? `Cmd+${index + 1}` : undefined,
    click: () => sendMenuAction('open-recent-project', project),
  }));

  // 添加清除选项
  items.push({ type: 'separator' });
  items.push({
    label: '清除最近项目列表',
    click: () => sendMenuAction('clear-recent-projects'),
  });

  return items;
}

/**
 * 发送菜单动作到渲染进程
 * @param {string} action - 动作名称
 * @param {*} [data] - 附加数据
 */
function sendMenuAction(action, data) {
  if (mainWindowRef && mainWindowRef.webContents) {
    mainWindowRef.webContents.send('menu-action', { action, data });
  }
}

/**
 * 切换全屏状态
 */
function toggleFullscreen() {
  if (mainWindowRef) {
    const isFullscreen = mainWindowRef.isFullScreen();
    mainWindowRef.setFullScreen(!isFullscreen);
    menuState.isFullscreen = !isFullscreen;
    rebuildMenu();
  }
}

/**
 * 放大
 */
function zoomIn() {
  if (mainWindowRef) {
    menuState.zoomLevel = Math.min(menuState.zoomLevel + 1, 5);
    mainWindowRef.webContents.setZoomLevel(menuState.zoomLevel);
  }
}

/**
 * 缩小
 */
function zoomOut() {
  if (mainWindowRef) {
    menuState.zoomLevel = Math.max(menuState.zoomLevel - 1, -5);
    mainWindowRef.webContents.setZoomLevel(menuState.zoomLevel);
  }
}

/**
 * 重置缩放
 */
function resetZoom() {
  if (mainWindowRef) {
    menuState.zoomLevel = 0;
    mainWindowRef.webContents.setZoomLevel(0);
  }
}

/**
 * 显示关于对话框
 */
function showAboutDialog() {
  dialog.showMessageBox(mainWindowRef, {
    type: 'info',
    title: `关于 ${app.name}`,
    message: app.name,
    detail: `版本: ${app.getVersion()}\n\n云书 - AI智能小说创作平台\n\n一款专为小说创作者设计的智能写作工具，\n集成AI辅助创作、角色管理、世界观构建等功能。\n\n© 2024 云书团队`,
    buttons: ['确定', '复制版本信息'],
    defaultId: 0,
    cancelId: 0,
    icon: null,
  }).then((result) => {
    if (result.response === 1) {
      const { clipboard } = require('electron');
      clipboard.writeText(`云书 ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}`);
    }
  });
}

// ============================================
// 菜单管理
// ============================================

/**
 * 创建应用菜单
 * @param {BrowserWindow} mainWindow - 主窗口实例
 * @returns {Menu} 菜单实例
 */
function createMenu(mainWindow) {
  mainWindowRef = mainWindow;

  const isDarwin = process.platform === 'darwin';
  const template = getMenuTemplate(isDarwin);

  // 构建菜单
  currentMenu = Menu.buildFromTemplate(template);

  // 设置应用菜单
  Menu.setApplicationMenu(isDarwin ? currentMenu : null);

  // Windows/Linux: 设置窗口菜单
  if (!isDarwin && mainWindow) {
    mainWindow.setMenu(currentMenu);
  }

  console.log('[Menu] 应用菜单已创建');

  return currentMenu;
}

/**
 * 重建菜单（状态变化后调用）
 */
function rebuildMenu() {
  const isDarwin = process.platform === 'darwin';
  const template = getMenuTemplate(isDarwin);

  currentMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(isDarwin ? currentMenu : null);

  if (!isDarwin && mainWindowRef) {
    mainWindowRef.setMenu(currentMenu);
  }
}

/**
 * 更新菜单项状态
 * @param {string} key - 状态键名
 * @param {*} value - 状态值
 */
function updateMenuState(key, value) {
  if (key in menuState) {
    menuState[key] = value;
    rebuildMenu();
  }
}

/**
 * 批量更新菜单状态
 * @param {Object} states - 状态对象
 */
function updateMenuStates(states) {
  Object.assign(menuState, states);
  rebuildMenu();
}

/**
 * 设置最近打开的项目列表
 * @param {Array} projects - 项目列表
 */
function setRecentProjects(projects) {
  recentProjects = projects || [];
  rebuildMenu();
}

/**
 * 获取当前菜单状态
 * @returns {Object} 菜单状态
 */
function getMenuState() {
  return { ...menuState };
}

/**
 * 获取当前菜单实例
 * @returns {Menu|null}
 */
function getCurrentMenu() {
  return currentMenu;
}

// ============================================
// 上下文菜单
// ============================================

/**
 * 创建编辑器上下文菜单
 * @param {Object} params - 上下文参数
 * @returns {Menu} 菜单实例
 */
function createEditorContextMenu(params) {
  const { selectionText, isEditable, editFlags, x, y } = params;
  const isDarwin = process.platform === 'darwin';

  const template = [];

  if (selectionText) {
    // 选中文本时的菜单
    template.push({
      label: '复制',
      role: 'copy',
    });
    template.push({
      label: '剪切',
      role: 'cut',
      enabled: isEditable,
    });
    template.push({ type: 'separator' });

    // AI 功能
    template.push({
      label: 'AI续写',
      click: () => sendMenuAction('ai-continue'),
    });
    template.push({
      label: 'AI改写',
      click: () => sendMenuAction('ai-rewrite'),
    });
    template.push({
      label: 'AI扩写',
      click: () => sendMenuAction('ai-expand'),
    });
    template.push({
      label: 'AI润色',
      click: () => sendMenuAction('ai-polish'),
    });
    template.push({ type: 'separator' });

    // 搜索
    template.push({
      label: '搜索选中文本',
      click: () => {
        shell.openExternal(`https://www.google.com/search?q=${encodeURIComponent(selectionText)}`);
      },
    });
    template.push({
      label: '添加到素材库',
      click: () => sendMenuAction('add-to-corpus', { text: selectionText }),
    });
  } else if (isEditable) {
    // 可编辑区域但无选中
    template.push({
      label: '粘贴',
      role: 'paste',
      enabled: editFlags.canPaste,
    });
    template.push({
      label: '粘贴并匹配样式',
      role: 'pasteAndMatchStyle',
      enabled: editFlags.canPaste,
    });
    template.push({ type: 'separator' });
    template.push({
      label: 'AI续写',
      click: () => sendMenuAction('ai-continue'),
    });
  }

  // 通用选项
  if (template.length > 0) {
    template.push({ type: 'separator' });
  }
  template.push({
    label: '全选',
    role: 'selectAll',
  });

  // 开发者选项（开发环境）
  if (process.env.NODE_ENV === 'development') {
    template.push({ type: 'separator' });
    template.push({
      label: '检查元素',
      click: () => {
        if (mainWindowRef) {
          mainWindowRef.webContents.inspectElement(x, y);
        }
      },
    });
  }

  return Menu.buildFromTemplate(template);
}

/**
 * 显示上下文菜单
 * @param {Object} params - 上下文参数
 */
function showContextMenu(params) {
  const menu = createEditorContextMenu(params);
  menu.popup(mainWindowRef);
}

// ============================================
// 快捷键管理
// ============================================

/**
 * 获取所有快捷键列表
 * @returns {Array} 快捷键列表
 */
function getShortcutsList() {
  const isDarwin = process.platform === 'darwin';
  const mod = isDarwin ? 'Cmd' : 'Ctrl';

  return [
    {
      category: '文件', shortcuts: [
        { key: `${mod}+N`, action: '新建项目' },
        { key: `${mod}+O`, action: '打开项目' },
        { key: `${mod}+S`, action: '保存' },
        { key: `${mod}+Shift+S`, action: '另存为' },
        { key: `${mod}+W`, action: '关闭项目' },
      ]
    },
    {
      category: '编辑', shortcuts: [
        { key: `${mod}+Z`, action: '撤销' },
        { key: `${mod}+Shift+Z`, action: '重做' },
        { key: `${mod}+X`, action: '剪切' },
        { key: `${mod}+C`, action: '复制' },
        { key: `${mod}+V`, action: '粘贴' },
        { key: `${mod}+Shift+V`, action: '粘贴并匹配样式' },
        { key: `${mod}+A`, action: '全选' },
        { key: `${mod}+F`, action: '查找' },
        { key: `${mod}+G`, action: '查找下一个' },
        { key: `${mod}+Shift+G`, action: '查找上一个' },
        { key: `${mod}+H`, action: '替换' },
        { key: `${mod}+L`, action: '转到行' },
      ]
    },
    {
      category: '视图', shortcuts: [
        { key: `${mod}+R`, action: '重新加载' },
        { key: `${mod}+Shift+R`, action: '强制重新加载' },
        { key: isDarwin ? `${mod}+Ctrl+F` : 'F11', action: '全屏' },
        { key: `${mod}+B`, action: '切换侧边栏' },
        { key: `${mod}+=`, action: '放大' },
        { key: `${mod}+-`, action: '缩小' },
        { key: `${mod}+0`, action: '重置缩放' },
      ]
    },
    {
      category: '项目', shortcuts: [
        { key: `${mod}+Shift+N`, action: '新建章节' },
      ]
    },
    {
      category: '工具', shortcuts: [
        { key: `${mod}+Shift+F`, action: '专注模式' },
        { key: `${mod}+Return`, action: 'AI续写' },
        { key: `${mod}+Shift+W`, action: '字数统计' },
        { key: `${mod}+,`, action: '设置' },
      ]
    },
    {
      category: '帮助', shortcuts: [
        { key: `${mod}+/`, action: '快捷键参考' },
      ]
    },
    {
      category: '开发', shortcuts: [
        { key: isDarwin ? `Alt+${mod}+I` : 'Ctrl+Shift+I', action: '开发者工具' },
        { key: 'F12', action: '开发者工具' },
      ]
    },
  ];
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  // 创建与管理
  createMenu,
  rebuildMenu,
  getCurrentMenu,

  // 状态管理
  updateMenuState,
  updateMenuStates,
  getMenuState,

  // 最近项目
  setRecentProjects,
  buildRecentProjectsMenu,

  // 上下文菜单
  createEditorContextMenu,
  showContextMenu,

  // 快捷键
  getShortcutsList,

  // 工具函数
  sendMenuAction,
  toggleFullscreen,
  showAboutDialog,
  zoomIn,
  zoomOut,
  resetZoom,
};

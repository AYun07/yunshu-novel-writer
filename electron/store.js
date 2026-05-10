/**
 * 云书 - Electron 持久化存储模块
 * 
 * 功能说明：
 * - 使用简单的JSON文件存储（不依赖electron-store）
 * - 保存窗口状态（位置、大小、最大化）
 * - 保存用户偏好（主题、模型选择等）
 * - 保存最近打开的项目列表
 * - 数据迁移支持
 * 
 * 存储结构：
 * - config.json: 应用配置
 * - window-state.json: 窗口状态
 * - recent-projects.json: 最近打开的项目
 * 
 * 存储位置：
 * - Windows: %APPDATA%/yunshu-novel-writer/
 * - macOS: ~/Library/Application Support/yunshu-novel-writer/
 * - Linux: ~/.config/yunshu-novel-writer/
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// ============================================
// 全局变量
// ============================================

/** @type {string} 存储目录路径 */
let storePath = '';

/** @type {Object} 内存缓存 */
const cache = {};

/** @type {string} 当前存储版本 */
const CURRENT_VERSION = '2.0.0';

/** @type {Object} 默认配置 */
const DEFAULT_CONFIG = {
  // 应用版本
  version: CURRENT_VERSION,
  
  // 用户偏好
  preferences: {
    // 主题设置
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'system-ui',
    
    // AI模型设置
    defaultModel: 'gpt-4',
    apiKey: '',
    apiEndpoint: '',
    
    // 编辑器设置
    autoSave: true,
    autoSaveInterval: 30000, // 30秒
    spellCheck: true,
    
    // 写作设置
    dailyWordGoal: 2000,
    writingReminder: true,
    reminderInterval: 60, // 分钟
    
    // 通知设置
    notifications: true,
    soundEnabled: true,
  },
  
  // 侧边栏状态
  sidebar: {
    visible: true,
    width: 280,
    activeTab: 'chapters',
  },
  
  // 快捷键自定义
  shortcuts: {},
  
  // 高级设置
  advanced: {
    hardwareAcceleration: true,
    proxyEnabled: false,
    proxyServer: '',
    dataPath: '',
  },
};

/** @type {Object} 默认窗口状态 */
const DEFAULT_WINDOW_STATE = {
  width: 1400,
  height: 900,
  x: null,
  y: null,
  isMaximized: false,
  isFullScreen: false,
};

/** @type {Array} 默认最近项目列表 */
const DEFAULT_RECENT_PROJECTS = [];

// ============================================
// 初始化
// ============================================

/**
 * 初始化存储模块
 * @returns {boolean} 是否初始化成功
 */
function initStore() {
  try {
    // 获取用户数据目录
    storePath = app.getPath('userData');
    
    // 确保目录存在
    if (!fs.existsSync(storePath)) {
      fs.mkdirSync(storePath, { recursive: true });
    }
    
    // 加载所有配置到内存
    loadAllToCache();
    
    // 检查并执行数据迁移
    checkAndMigrate();
    
    console.log('[Store] 存储模块已初始化，路径:', storePath);
    return true;
  } catch (error) {
    console.error('[Store] 初始化失败:', error);
    return false;
  }
}

/**
 * 加载所有配置到内存缓存
 */
function loadAllToCache() {
  cache.config = loadJsonFile('config.json', DEFAULT_CONFIG);
  cache.windowState = loadJsonFile('window-state.json', DEFAULT_WINDOW_STATE);
  cache.recentProjects = loadJsonFile('recent-projects.json', DEFAULT_RECENT_PROJECTS);
}

// ============================================
// 文件操作
// ============================================

/**
 * 获取文件完整路径
 * @param {string} filename - 文件名
 * @returns {string} 完整路径
 */
function getFilePath(filename) {
  return path.join(storePath, filename);
}

/**
 * 加载JSON文件
 * @param {string} filename - 文件名
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析后的数据或默认值
 */
function loadJsonFile(filename, defaultValue) {
  const filePath = getFilePath(filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`[Store] 加载文件失败 ${filename}:`, error);
  }
  
  return defaultValue;
}

/**
 * 保存JSON文件
 * @param {string} filename - 文件名
 * @param {*} data - 要保存的数据
 * @returns {boolean} 是否保存成功
 */
function saveJsonFile(filename, data) {
  const filePath = getFilePath(filename);
  
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`[Store] 保存文件失败 ${filename}:`, error);
    return false;
  }
}

/**
 * 删除文件
 * @param {string} filename - 文件名
 * @returns {boolean} 是否删除成功
 */
function deleteJsonFile(filename) {
  const filePath = getFilePath(filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  } catch (error) {
    console.error(`[Store] 删除文件失败 ${filename}:`, error);
    return false;
  }
}

// ============================================
// 配置管理
// ============================================

/**
 * 获取存储对象（类似electron-store的API）
 * @returns {Object} 存储对象
 */
function getStore() {
  return {
    /**
     * 获取配置值
     * @param {string} key - 键名（支持点分隔路径）
     * @param {*} [defaultValue] - 默认值
     * @returns {*} 配置值
     */
    get: (key, defaultValue) => {
      return getValueByPath(cache.config, key, defaultValue);
    },
    
    /**
     * 设置配置值
     * @param {string} key - 键名（支持点分隔路径）
     * @param {*} value - 值
     */
    set: (key, value) => {
      setValueByPath(cache.config, key, value);
      saveJsonFile('config.json', cache.config);
    },
    
    /**
     * 删除配置值
     * @param {string} key - 键名
     */
    delete: (key) => {
      deleteValueByPath(cache.config, key);
      saveJsonFile('config.json', cache.config);
    },
    
    /**
     * 检查键是否存在
     * @param {string} key - 键名
     * @returns {boolean}
     */
    has: (key) => {
      return getValueByPath(cache.config, key) !== undefined;
    },
    
    /**
     * 清空所有配置
     */
    clear: () => {
      cache.config = { ...DEFAULT_CONFIG };
      saveJsonFile('config.json', cache.config);
    },
    
    /**
     * 获取所有配置
     * @returns {Object}
     */
    getAll: () => {
      return { ...cache.config };
    },
    
    /**
     * 设置所有配置
     * @param {Object} config - 配置对象
     */
    setAll: (config) => {
      cache.config = { ...DEFAULT_CONFIG, ...config };
      saveJsonFile('config.json', cache.config);
    },
    
    /**
     * 获取存储路径
     * @returns {string}
     */
    path: () => storePath,
  };
}

/**
 * 通过路径获取值
 * @param {Object} obj - 对象
 * @param {string} path - 路径（如 'preferences.theme'）
 * @param {*} [defaultValue] - 默认值
 * @returns {*} 值
 */
function getValueByPath(obj, path, defaultValue = undefined) {
  if (!path) return obj;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * 通过路径设置值
 * @param {Object} obj - 对象
 * @param {string} path - 路径
 * @param {*} value - 值
 */
function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

/**
 * 通过路径删除值
 * @param {Object} obj - 对象
 * @param {string} path - 路径
 */
function deleteValueByPath(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) return;
    current = current[key];
  }
  
  delete current[keys[keys.length - 1]];
}

// ============================================
// 窗口状态管理
// ============================================

/**
 * 保存窗口状态
 * @param {Object} state - 窗口状态
 */
function saveWindowState(state) {
  cache.windowState = { ...cache.windowState, ...state };
  saveJsonFile('window-state.json', cache.windowState);
}

/**
 * 获取窗口状态
 * @returns {Object} 窗口状态
 */
function getWindowState() {
  return { ...cache.windowState };
}

/**
 * 重置窗口状态
 */
function resetWindowState() {
  cache.windowState = { ...DEFAULT_WINDOW_STATE };
  saveJsonFile('window-state.json', cache.windowState);
}

// ============================================
// 最近项目管理
// ============================================

/**
 * 获取最近打开的项目列表
 * @param {number} [limit=10] - 最大返回数量
 * @returns {Array} 项目列表
 */
function getRecentProjects(limit = 10) {
  return cache.recentProjects.slice(0, limit);
}

/**
 * 添加最近打开的项目
 * @param {Object} project - 项目信息
 * @param {string} project.id - 项目ID
 * @param {string} project.name - 项目名称
 * @param {string} project.path - 项目路径
 * @param {number} project.lastOpened - 最后打开时间戳
 */
function addRecentProject(project) {
  // 移除已存在的相同项目
  cache.recentProjects = cache.recentProjects.filter(p => p.path !== project.path);
  
  // 添加到列表开头
  cache.recentProjects.unshift({
    id: project.id,
    name: project.name,
    path: project.path,
    lastOpened: Date.now(),
  });
  
  // 限制列表长度
  const MAX_RECENT = 20;
  if (cache.recentProjects.length > MAX_RECENT) {
    cache.recentProjects = cache.recentProjects.slice(0, MAX_RECENT);
  }
  
  saveJsonFile('recent-projects.json', cache.recentProjects);
}

/**
 * 移除最近打开的项目
 * @param {string} projectPath - 项目路径
 */
function removeRecentProject(projectPath) {
  cache.recentProjects = cache.recentProjects.filter(p => p.path !== projectPath);
  saveJsonFile('recent-projects.json', cache.recentProjects);
}

/**
 * 清空最近打开的项目列表
 */
function clearRecentProjects() {
  cache.recentProjects = [];
  saveJsonFile('recent-projects.json', cache.recentProjects);
}

// ============================================
// 用户偏好管理
// ============================================

/**
 * 获取用户偏好
 * @param {string} [key] - 偏好键名（可选，不传则返回全部）
 * @param {*} [defaultValue] - 默认值
 * @returns {*} 偏好值
 */
function getPreference(key, defaultValue) {
  if (!key) {
    return { ...cache.config.preferences };
  }
  return getValueByPath(cache.config.preferences, key, defaultValue);
}

/**
 * 设置用户偏好
 * @param {string} key - 偏好键名
 * @param {*} value - 偏好值
 */
function setPreference(key, value) {
  setValueByPath(cache.config.preferences, key, value);
  saveJsonFile('config.json', cache.config);
}

/**
 * 批量设置用户偏好
 * @param {Object} preferences - 偏好对象
 */
function setPreferences(preferences) {
  cache.config.preferences = { ...cache.config.preferences, ...preferences };
  saveJsonFile('config.json', cache.config);
}

/**
 * 重置用户偏好为默认值
 */
function resetPreferences() {
  cache.config.preferences = { ...DEFAULT_CONFIG.preferences };
  saveJsonFile('config.json', cache.config);
}

// ============================================
// 数据迁移
// ============================================

/**
 * 检查并执行数据迁移
 */
function checkAndMigrate() {
  const storedVersion = cache.config.version || '1.0.0';
  
  // 如果版本相同，无需迁移
  if (storedVersion === CURRENT_VERSION) {
    return;
  }
  
  console.log(`[Store] 检测到版本变化: ${storedVersion} -> ${CURRENT_VERSION}`);
  
  // 执行迁移
  migrate(storedVersion, CURRENT_VERSION);
  
  // 更新版本号
  cache.config.version = CURRENT_VERSION;
  saveJsonFile('config.json', cache.config);
  
  console.log('[Store] 数据迁移完成');
}

/**
 * 执行数据迁移
 * @param {string} fromVersion - 源版本
 * @param {string} toVersion - 目标版本
 */
function migrate(fromVersion, toVersion) {
  // 1.0.0 -> 2.0.0 迁移
  if (compareVersions(fromVersion, '2.0.0') < 0) {
    migrateTo_2_0_0();
  }
  
  // 未来版本的迁移可以在这里添加
  // if (compareVersions(fromVersion, '3.0.0') < 0) {
  //   migrateTo_3_0_0();
  // }
}

/**
 * 迁移到 2.0.0 版本
 */
function migrateTo_2_0_0() {
  console.log('[Store] 执行迁移到 2.0.0');
  
  // 确保所有默认配置字段存在
  cache.config = deepMerge(DEFAULT_CONFIG, cache.config);
  
  // 迁移旧的API配置格式
  if (cache.config.apiKey && !cache.config.preferences?.apiKey) {
    if (!cache.config.preferences) {
      cache.config.preferences = {};
    }
    cache.config.preferences.apiKey = cache.config.apiKey;
    delete cache.config.apiKey;
  }
  
  // 迁移旧的模型配置
  if (cache.config.model && !cache.config.preferences?.defaultModel) {
    cache.config.preferences.defaultModel = cache.config.model;
    delete cache.config.model;
  }
}

/**
 * 深度合并对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

/**
 * 比较版本号
 * @param {string} v1 - 版本1
 * @param {string} v2 - 版本2
 * @returns {number} -1, 0, 1
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  
  return 0;
}

// ============================================
// 数据导出与导入
// ============================================

/**
 * 导出所有数据
 * @returns {Object} 所有数据
 */
function exportAllData() {
  return {
    config: cache.config,
    windowState: cache.windowState,
    recentProjects: cache.recentProjects,
    exportedAt: Date.now(),
    version: CURRENT_VERSION,
  };
}

/**
 * 导入数据
 * @param {Object} data - 导入的数据
 * @returns {boolean} 是否成功
 */
function importAllData(data) {
  try {
    // 验证数据格式
    if (!data || typeof data !== 'object') {
      throw new Error('无效的数据格式');
    }
    
    // 导入配置
    if (data.config) {
      cache.config = deepMerge(DEFAULT_CONFIG, data.config);
      saveJsonFile('config.json', cache.config);
    }
    
    // 导入窗口状态
    if (data.windowState) {
      cache.windowState = { ...DEFAULT_WINDOW_STATE, ...data.windowState };
      saveJsonFile('window-state.json', cache.windowState);
    }
    
    // 导入最近项目
    if (data.recentProjects) {
      cache.recentProjects = data.recentProjects;
      saveJsonFile('recent-projects.json', cache.recentProjects);
    }
    
    console.log('[Store] 数据导入成功');
    return true;
  } catch (error) {
    console.error('[Store] 数据导入失败:', error);
    return false;
  }
}

/**
 * 重置所有数据为默认值
 */
function resetAllData() {
  cache.config = { ...DEFAULT_CONFIG };
  cache.windowState = { ...DEFAULT_WINDOW_STATE };
  cache.recentProjects = [];
  
  saveJsonFile('config.json', cache.config);
  saveJsonFile('window-state.json', cache.windowState);
  saveJsonFile('recent-projects.json', cache.recentProjects);
  
  console.log('[Store] 所有数据已重置');
}

// ============================================
// 存储路径管理
// ============================================

/**
 * 获取存储目录路径
 * @returns {string} 存储路径
 */
function getStorePath() {
  return storePath;
}

/**
 * 获取自定义数据路径
 * @returns {string} 数据路径
 */
function getDataPath() {
  return cache.config.advanced?.dataPath || storePath;
}

/**
 * 设置自定义数据路径
 * @param {string} newPath - 新的数据路径
 * @returns {boolean} 是否成功
 */
function setDataPath(newPath) {
  try {
    // 验证路径
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true });
    }
    
    // 保存旧数据
    const oldData = exportAllData();
    
    // 更新路径
    cache.config.advanced.dataPath = newPath;
    storePath = newPath;
    
    // 保存数据到新路径
    saveJsonFile('config.json', cache.config);
    saveJsonFile('window-state.json', cache.windowState);
    saveJsonFile('recent-projects.json', cache.recentProjects);
    
    console.log('[Store] 数据路径已更改:', newPath);
    return true;
  } catch (error) {
    console.error('[Store] 更改数据路径失败:', error);
    return false;
  }
}

// ============================================
// 导出模块
// ============================================

module.exports = {
  // 初始化
  initStore,
  
  // 存储对象
  getStore,
  
  // 窗口状态
  saveWindowState,
  getWindowState,
  resetWindowState,
  
  // 最近项目
  getRecentProjects,
  addRecentProject,
  removeRecentProject,
  clearRecentProjects,
  
  // 用户偏好
  getPreference,
  setPreference,
  setPreferences,
  resetPreferences,
  
  // 数据迁移
  checkAndMigrate,
  
  // 数据导入导出
  exportAllData,
  importAllData,
  resetAllData,
  
  // 路径管理
  getStorePath,
  getDataPath,
  setDataPath,
  
  // 工具函数
  getValueByPath,
  setValueByPath,
  deepMerge,
  compareVersions,
  
  // 常量
  CURRENT_VERSION,
  DEFAULT_CONFIG,
  DEFAULT_WINDOW_STATE,
};

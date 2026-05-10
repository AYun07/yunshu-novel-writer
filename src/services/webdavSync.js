/**
 * 云书 - WebDAV 数据同步服务
 * 
 * 功能说明：
 * - 支持坚果云、Nextcloud 等 WebDAV 服务器
 * - 端到端加密（可选）
 * - 增量同步
 * - 冲突检测与解决
 * - 自动同步和手动同步
 * 
 * 数据格式：
 * /yunshu-sync/
 *   manifest.json          - 同步元数据
 *   data/
 *     projects.json        - 项目数据
 *     chapters.json        - 章节数据
 *     characters.json      - 角色数据
 *     ...                  - 其他表数据
 *   snapshots/             - 版本快照
 *     2026-05-10_001.json.gz
 */

import { ref, computed } from 'vue';
import { useSync } from '../composables/useSync.js';
import database from './database.js';

// ============================================
// 配置
// ============================================

const SYNC_CONFIG = {
  // 同步根目录
  syncDir: '/yunshu-sync',
  // 数据目录
  dataDir: '/yunshu-sync/data',
  // 快照目录
  snapshotDir: '/yunshu-sync/snapshots',
  // 清单文件
  manifestFile: '/yunshu-sync/manifest.json',
  // 同步间隔（毫秒）
  syncInterval: 5 * 60 * 1000, // 5分钟
  // 压缩阈值（字节）
  compressThreshold: 1024 * 10, // 10KB
};

// ============================================
// 状态管理
// ============================================

const syncState = ref({
  // 是否已配置
  isConfigured: false,
  // 是否正在同步
  isSyncing: false,
  // 最后同步时间
  lastSyncTime: null,
  // 同步进度
  progress: 0,
  // 同步状态消息
  message: '',
  // 错误信息
  error: null,
  // 冲突列表
  conflicts: [],
  // 待上传的变更数
  pendingUploads: 0,
  // 待下载的变更数
  pendingDownloads: 0,
});

// WebDAV 客户端实例
let webdavClient = null;

// ============================================
// 存储管理
// ============================================

const STORAGE_KEY = 'yunshu_webdav_config';

function getConfig() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    syncState.value.isConfigured = true;
  } catch (e) {
    console.error('保存 WebDAV 配置失败:', e);
  }
}

function clearConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    syncState.value.isConfigured = false;
    webdavClient = null;
  } catch (e) {
    console.error('清除 WebDAV 配置失败:', e);
  }
}

// ============================================
// WebDAV 客户端
// ============================================

/**
 * 创建 WebDAV 客户端
 * 使用简单的 fetch 实现，不依赖外部库
 */
function createWebDAVClient(serverUrl, username, password) {
  // 确保 URL 以 / 结尾
  const baseUrl = serverUrl.endsWith('/') ? serverUrl : serverUrl + '/';
  
  // 基础认证头
  const authHeader = 'Basic ' + btoa(username + ':' + password);
  
  return {
    baseUrl,
    authHeader,
    
    /**
     * 检查连接
     */
    async checkConnection() {
      const response = await fetch(baseUrl, {
        method: 'PROPFIND',
        headers: {
          'Authorization': authHeader,
          'Depth': '0',
          'Content-Type': 'text/xml; charset=utf-8',
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
          <propfind xmlns="DAV:">
            <prop>
              <resourcetype/>
            </prop>
          </propfind>`,
      });
      
      if (!response.ok) {
        throw new Error(`连接失败: ${response.status} ${response.statusText}`);
      }
      return true;
    },
    
    /**
     * 读取文件
     * @param {string} path - 文件路径
     * @returns {Promise<Object>} { exists: boolean, content: any }
     */
    async readFile(path) {
      const url = baseUrl + path.replace(/^\//, '');
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
          },
        });
        
        if (response.status === 404) {
          return { exists: false, content: null };
        }
        
        if (!response.ok) {
          throw new Error(`读取失败: ${response.status}`);
        }
        
        const text = await response.text();
        
        // 尝试解析 JSON
        try {
          return { exists: true, content: JSON.parse(text) };
        } catch {
          return { exists: true, content: text };
        }
      } catch (error) {
        if (error.message.includes('404')) {
          return { exists: false, content: null };
        }
        throw error;
      }
    },
    
    /**
     * 写入文件
     * @param {string} path - 文件路径
     * @param {any} content - 文件内容
     */
    async writeFile(path, content) {
      const url = baseUrl + path.replace(/^\//, '');
      
      // 确保目录存在
      await this.createDirectory(path.substring(0, path.lastIndexOf('/')));
      
      const body = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body,
      });
      
      if (!response.ok) {
        throw new Error(`写入失败: ${response.status}`);
      }
      
      return true;
    },
    
    /**
     * 创建目录
     * @param {string} path - 目录路径
     */
    async createDirectory(path) {
      if (!path || path === '/') return;
      
      const url = baseUrl + path.replace(/^\//, '');
      
      try {
        const response = await fetch(url, {
          method: 'MKCOL',
          headers: {
            'Authorization': authHeader,
          },
        });
        
        // 201 创建成功，405 目录已存在
        if (response.ok || response.status === 405) {
          return true;
        }
        
        throw new Error(`创建目录失败: ${response.status}`);
      } catch (error) {
        // 忽略已存在的错误
        if (error.message.includes('405')) {
          return true;
        }
        throw error;
      }
    },
    
    /**
     * 列出目录内容
     * @param {string} path - 目录路径
     * @returns {Promise<Array>}
     */
    async listDirectory(path) {
      const url = baseUrl + path.replace(/^\//, '');
      
      const response = await fetch(url, {
        method: 'PROPFIND',
        headers: {
          'Authorization': authHeader,
          'Depth': '1',
          'Content-Type': 'text/xml; charset=utf-8',
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
          <propfind xmlns="DAV:">
            <prop>
              <displayname/>
              <getlastmodified/>
              <resourcetype/>
            </prop>
          </propfind>`,
      });
      
      if (!response.ok) {
        throw new Error(`列出目录失败: ${response.status}`);
      }
      
      const text = await response.text();
      
      // 简单解析 XML 响应
      const items = [];
      const regex = /<response>.*?<href>(.*?)<\/href>.*?<displayname>(.*?)<\/displayname>.*?<\/response>/gs;
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        const href = decodeURIComponent(match[1]);
        const name = match[2];
        
        // 跳过当前目录
        if (href === path || href === path + '/') continue;
        
        items.push({
          name,
          path: href,
          isDirectory: text.substring(match.index, match.index + match[0].length).includes('<collection/>'),
        });
      }
      
      return items;
    },
    
    /**
     * 删除文件
     * @param {string} path - 文件路径
     */
    async deleteFile(path) {
      const url = baseUrl + path.replace(/^\//, '');
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
        },
      });
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`删除失败: ${response.status}`);
      }
      
      return true;
    },
  };
}

// ============================================
// 加密服务
// ============================================

const cryptoService = {
  /**
   * 从密码派生密钥
   * @param {string} password - 用户密码
   * @param {string} salt - 盐值
   * @returns {Promise<CryptoKey>}
   */
  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const saltData = encoder.encode(salt);
    
    // 导入密码为原始密钥材料
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    // 使用 PBKDF2 派生 AES-GCM 密钥
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  },
  
  /**
   * 加密数据
   * @param {any} data - 要加密的数据
   * @param {string} password - 加密密码
   * @returns {Promise<Object>} { ciphertext: string, salt: string, iv: string }
   */
  async encrypt(data, password) {
    const encoder = new TextEncoder();
    const jsonData = JSON.stringify(data);
    const dataBuffer = encoder.encode(jsonData);
    
    // 生成随机盐值和 IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // 派生密钥
    const key = await this.deriveKey(password, Array.from(salt).map(b => String.fromCharCode(b)).join(''));
    
    // 加密
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // 转换为 Base64
    const saltBase64 = btoa(String.fromCharCode(...salt));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
    
    return {
      ciphertext: ciphertextBase64,
      salt: saltBase64,
      iv: ivBase64,
      version: 1,
    };
  },
  
  /**
   * 解密数据
   * @param {Object} encryptedData - 加密的数据对象
   * @param {string} password - 解密密码
   * @returns {Promise<any>}
   */
  async decrypt(encryptedData, password) {
    try {
      // 从 Base64 解码
      const salt = new Uint8Array(atob(encryptedData.salt).split('').map(c => c.charCodeAt(0)));
      const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
      const ciphertext = new Uint8Array(atob(encryptedData.ciphertext).split('').map(c => c.charCodeAt(0)));
      
      // 派生密钥
      const key = await this.deriveKey(password, Array.from(salt).map(b => String.fromCharCode(b)).join(''));
      
      // 解密
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      
      // 解析 JSON
      const decoder = new TextDecoder();
      const jsonStr = decoder.decode(decrypted);
      return JSON.parse(jsonStr);
    } catch (error) {
      throw new Error('解密失败，请检查密码是否正确');
    }
  },
};

// ============================================
// 同步核心逻辑
// ============================================

/**
 * 初始化 WebDAV 同步
 * @param {Object} config - 配置 { serverUrl, username, password, encryptPassword? }
 */
async function initSync(config) {
  try {
    syncState.value.message = '正在连接服务器...';
    
    // 创建客户端
    webdavClient = createWebDAVClient(config.serverUrl, config.username, config.password);
    
    // 测试连接
    await webdavClient.checkConnection();
    
    // 保存配置（密码不保存明文）
    saveConfig({
      serverUrl: config.serverUrl,
      username: config.username,
      hasEncryptPassword: !!config.encryptPassword,
    });
    
    // 创建同步目录结构
    await webdavClient.createDirectory(SYNC_CONFIG.syncDir);
    await webdavClient.createDirectory(SYNC_CONFIG.dataDir);
    await webdavClient.createDirectory(SYNC_CONFIG.snapshotDir);
    
    syncState.value.message = '连接成功';
    syncState.value.error = null;
    
    return true;
  } catch (error) {
    syncState.value.error = error.message;
    syncState.value.message = '连接失败';
    webdavClient = null;
    throw error;
  }
}

/**
 * 执行同步
 * @param {Object} options - 选项 { force?: boolean, encryptPassword?: string }
 */
async function performSync(options = {}) {
  if (!webdavClient) {
    const config = getConfig();
    if (!config) {
      throw new Error('未配置 WebDAV');
    }
    // 需要重新初始化（需要密码）
    throw new Error('会话已过期，请重新配置');
  }
  
  if (syncState.value.isSyncing) {
    throw new Error('同步正在进行中');
  }
  
  syncState.value.isSyncing = true;
  syncState.value.progress = 0;
  syncState.value.message = '正在准备同步...';
  syncState.value.error = null;
  
  try {
    // 1. 读取本地数据
    syncState.value.progress = 10;
    syncState.value.message = '正在读取本地数据...';
    
    const localData = await exportAllData();
    
    // 2. 读取远程清单
    syncState.value.progress = 20;
    syncState.value.message = '正在检查远程数据...';
    
    const { exists: manifestExists, content: remoteManifest } = await webdavClient.readFile(
      SYNC_CONFIG.manifestFile
    );
    
    let remoteData = null;
    let needsUpload = false;
    let needsDownload = false;
    
    if (manifestExists && remoteManifest) {
      // 3. 读取远程数据
      syncState.value.progress = 30;
      syncState.value.message = '正在下载远程数据...';
      
      const { content: encryptedData } = await webdavClient.readFile(
        SYNC_CONFIG.dataDir + '/sync_data.json'
      );
      
      if (encryptedData) {
        // 解密
        if (options.encryptPassword) {
          remoteData = await cryptoService.decrypt(encryptedData, options.encryptPassword);
        } else if (getConfig()?.hasEncryptPassword) {
          throw new Error('需要加密密码才能解密远程数据');
        } else {
          remoteData = encryptedData;
        }
      }
      
      // 4. 比较时间戳决定方向
      const localTime = localData.timestamp || 0;
      const remoteTime = remoteManifest.lastSyncTime || 0;
      
      if (localTime > remoteTime) {
        needsUpload = true;
      } else if (remoteTime > localTime) {
        needsDownload = true;
      } else {
        // 时间相同，检查内容哈希
        const localHash = await computeHash(localData);
        const remoteHash = remoteManifest.dataHash;
        
        if (localHash !== remoteHash) {
          // 有冲突，需要合并
          syncState.value.message = '检测到冲突，需要手动解决...';
          syncState.value.conflicts = detectConflicts(localData, remoteData);
          
          if (syncState.value.conflicts.length > 0) {
            // 暂停同步，等待用户解决冲突
            syncState.value.isSyncing = false;
            return { hasConflicts: true, conflicts: syncState.value.conflicts };
          }
        }
      }
    } else {
      // 远程没有数据，直接上传
      needsUpload = true;
    }
    
    // 5. 上传或下载
    if (needsUpload) {
      syncState.value.progress = 50;
      syncState.value.message = '正在上传数据...';
      
      let dataToUpload = localData;
      
      // 加密
      if (options.encryptPassword) {
        dataToUpload = await cryptoService.encrypt(localData, options.encryptPassword);
      }
      
      await webdavClient.writeFile(
        SYNC_CONFIG.dataDir + '/sync_data.json',
        dataToUpload
      );
      
      // 更新清单
      const manifest = {
        version: 1,
        lastSyncTime: Date.now(),
        deviceId: getDeviceId(),
        dataHash: await computeHash(localData),
        tables: Object.keys(localData.tables || {}),
      };
      
      await webdavClient.writeFile(SYNC_CONFIG.manifestFile, manifest);
      
      syncState.value.message = '上传完成';
    } else if (needsDownload) {
      syncState.value.progress = 50;
      syncState.value.message = '正在合并数据...';
      
      // 合并远程数据到本地
      await importAllData(remoteData);
      
      syncState.value.message = '下载完成';
    } else {
      syncState.value.message = '数据已是最新';
    }
    
    // 6. 创建快照
    syncState.value.progress = 80;
    syncState.value.message = '正在创建快照...';
    await createSnapshot(localData);
    
    // 7. 完成
    syncState.value.progress = 100;
    syncState.value.lastSyncTime = Date.now();
    syncState.value.message = '同步完成';
    
    return { success: true };
  } catch (error) {
    syncState.value.error = error.message;
    syncState.value.message = '同步失败: ' + error.message;
    throw error;
  } finally {
    syncState.value.isSyncing = false;
  }
}

/**
 * 导出所有数据
 */
async function exportAllData() {
  const tables = ['projects', 'chapters', 'characters', 'worldSettings', 
                  'foreshadowings', 'plotPoints', 'ideas', 'snippets'];
  
  const data = {
    version: 2,
    timestamp: Date.now(),
    deviceId: getDeviceId(),
    tables: {},
  };
  
  for (const table of tables) {
    try {
      data.tables[table] = await database[table]?.toArray() || [];
    } catch (e) {
      console.warn(`导出表 ${table} 失败:`, e);
      data.tables[table] = [];
    }
  }
  
  return data;
}

/**
 * 导入所有数据
 */
async function importAllData(data) {
  if (!data || !data.tables) {
    throw new Error('无效的数据格式');
  }
  
  const tables = Object.keys(data.tables);
  
  for (const table of tables) {
    try {
      const records = data.tables[table];
      if (Array.isArray(records) && records.length > 0) {
        // 清空并重新导入
        await database[table]?.clear();
        await database[table]?.bulkAdd(records);
      }
    } catch (e) {
      console.warn(`导入表 ${table} 失败:`, e);
    }
  }
}

/**
 * 创建快照
 */
async function createSnapshot(data) {
  const snapshotName = `snapshot_${formatDate(new Date())}.json`;
  
  try {
    await webdavClient.writeFile(
      SYNC_CONFIG.snapshotDir + '/' + snapshotName,
      data
    );
    
    // 清理旧快照（保留最近10个）
    await cleanupOldSnapshots();
  } catch (e) {
    console.warn('创建快照失败:', e);
  }
}

/**
 * 清理旧快照
 */
async function cleanupOldSnapshots() {
  try {
    const items = await webdavClient.listDirectory(SYNC_CONFIG.snapshotDir);
    const snapshots = items
      .filter(item => item.name.startsWith('snapshot_') && item.name.endsWith('.json'))
      .sort((a, b) => b.name.localeCompare(a.name));
    
    // 删除超过10个的旧快照
    if (snapshots.length > 10) {
      for (let i = 10; i < snapshots.length; i++) {
        await webdavClient.deleteFile(SYNC_CONFIG.snapshotDir + '/' + snapshots[i].name);
      }
    }
  } catch (e) {
    console.warn('清理旧快照失败:', e);
  }
}

/**
 * 检测冲突
 */
function detectConflicts(localData, remoteData) {
  const conflicts = [];
  
  // 简单的冲突检测：比较各表记录的时间戳
  const tables = Object.keys(localData.tables || {});
  
  for (const table of tables) {
    const localRecords = localData.tables[table] || [];
    const remoteRecords = remoteData.tables?.[table] || [];
    
    // 建立 ID 索引
    const remoteMap = new Map(remoteRecords.map(r => [r.id, r]));
    
    for (const localRecord of localRecords) {
      const remoteRecord = remoteMap.get(localRecord.id);
      
      if (remoteRecord) {
        const localTime = localRecord.lastModified || localRecord.updatedAt || 0;
        const remoteTime = remoteRecord.lastModified || remoteRecord.updatedAt || 0;
        
        // 如果本地和远程都有更新，且时间戳不同，则存在冲突
        if (localTime && remoteTime && localTime !== remoteTime) {
          conflicts.push({
            table,
            id: localRecord.id,
            local: localRecord,
            remote: remoteRecord,
          });
        }
      }
    }
  }
  
  return conflicts;
}

/**
 * 计算数据哈希
 */
async function computeHash(data) {
  const json = JSON.stringify(data);
  const encoder = new TextEncoder();
  const buffer = encoder.encode(json);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 获取设备 ID
 */
function getDeviceId() {
  let deviceId = localStorage.getItem('yunshu_device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('yunshu_device_id', deviceId);
  }
  return deviceId;
}

/**
 * 格式化日期
 */
function formatDate(date) {
  return date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

// ============================================
// 自动同步
// ============================================

let autoSyncInterval = null;

function startAutoSync(interval = SYNC_CONFIG.syncInterval) {
  stopAutoSync();
  
  // 立即同步一次
  if (syncState.value.isConfigured) {
    performSync().catch(console.error);
  }
  
  // 定时同步
  autoSyncInterval = setInterval(() => {
    if (syncState.value.isConfigured && !syncState.value.isSyncing) {
      performSync().catch(console.error);
    }
  }, interval);
}

function stopAutoSync() {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
  }
}

// ============================================
// Composable
// ============================================

import { onMounted, onUnmounted } from 'vue';

export function useWebDAVSync() {
  onMounted(() => {
    // 检查是否已配置
    const config = getConfig();
    if (config) {
      syncState.value.isConfigured = true;
      // 启动自动同步
      startAutoSync();
    }
  });
  
  onUnmounted(() => {
    stopAutoSync();
  });
  
  return {
    // 状态
    state: computed(() => syncState.value),
    isConfigured: computed(() => syncState.value.isConfigured),
    isSyncing: computed(() => syncState.value.isSyncing),
    progress: computed(() => syncState.value.progress),
    lastSyncTime: computed(() => syncState.value.lastSyncTime),
    error: computed(() => syncState.value.error),
    conflicts: computed(() => syncState.value.conflicts),
    
    // 方法
    initSync,
    performSync,
    clearConfig,
    startAutoSync,
    stopAutoSync,
    getConfig,
  };
}

// ============================================
// 导出
// ============================================

export const webdavSync = {
  initSync,
  performSync,
  clearConfig,
  startAutoSync,
  stopAutoSync,
  getConfig,
  cryptoService,
  get state() { return syncState.value; },
  CONFIG: SYNC_CONFIG,
};

export default webdavSync;

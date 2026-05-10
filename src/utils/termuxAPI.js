/**
 * 云书 - Termux 环境适配模块
 * 
 * 功能说明：
 * - Termux 环境检测
 * - Termux API 封装
 * - 文件系统访问
 * - 命令行集成
 * - 存储权限处理
 * - Termux 特有功能
 * 
 * 使用方式：
 * import { termuxAPI } from '@/utils/termuxAPI';
 * 
 * if (termuxAPI.isTermux) {
 *   // 使用 Termux 特有功能
 *   await termuxAPI.writeFile('novel.txt', content);
 * }
 */

// ============================================
// 环境检测
// ============================================

/**
 * 检测是否在 Termux 环境中运行
 */
function detectTermux() {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // 检查 User Agent
  if (ua.includes('termux')) return true;
  
  // 检查 Termux 特有的全局对象
  if (typeof window !== 'undefined') {
    if (window.Termux) return true;
    if (window.termux) return true;
  }
  
  // 检查 Android WebView 特征
  if (ua.includes('wv') && ua.includes('android')) {
    // 可能是 Termux WebView
    return true;
  }
  
  return false;
}

/**
 * 检测 Termux 版本
 */
function getTermuxVersion() {
  if (typeof navigator === 'undefined') return null;
  
  const ua = navigator.userAgent;
  const match = ua.match(/Termux\/(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

/**
 * 检测是否有存储权限
 */
async function checkStoragePermission() {
  // Termux 默认有存储权限（如果用户运行了 termux-setup-storage）
  if (typeof navigator === 'undefined') return false;
  
  try {
    // 尝试访问外部存储目录
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    await Filesystem.readdir({
      path: '',
      directory: Directory.External,
    });
    return true;
  } catch (error) {
    return false;
  }
}

// 环境状态
const isTermux = detectTermux();
const termuxVersion = getTermuxVersion();

// ============================================
// Termux API 封装
// ============================================

export const termuxAPI = {
  // 环境标识
  isTermux,
  termuxVersion,
  
  /**
   * 检查存储权限
   * @returns {Promise<boolean>}
   */
  async checkStoragePermission() {
    return checkStoragePermission();
  },
  
  /**
   * 请求存储权限
   * 在 Termux 中需要用户手动运行 termux-setup-storage
   * @returns {Promise<boolean>}
   */
  async requestStoragePermission() {
    if (!isTermux) return false;
    
    // 显示提示让用户手动授权
    console.log('请在 Termux 中运行: termux-setup-storage');
    
    // 尝试调用 Termux API（如果可用）
    if (typeof window !== 'undefined' && window.TermuxAPI) {
      try {
        await window.TermuxAPI.requestStoragePermission();
        return true;
      } catch (error) {
        console.warn('请求存储权限失败:', error);
      }
    }
    
    return false;
  },
  
  // ============================================
  // 文件系统操作
  // ============================================
  
  files: {
    /**
     * 获取外部存储目录
     * @returns {Promise<string>}
     */
    async getExternalStorageDir() {
      if (!isTermux) return null;
      
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const result = await Filesystem.getUri({
          directory: Directory.External,
          path: '',
        });
        return result.uri;
      } catch (error) {
        // 回退到标准路径
        return '/storage/emulated/0';
      }
    },
    
    /**
     * 获取 Termux 主目录
     * @returns {string}
     */
    getHomeDir() {
      if (!isTermux) return null;
      return '/data/data/com.termux/files/home';
    },
    
    /**
     * 获取 Termux 文件目录
     * @returns {string}
     */
    getFilesDir() {
      if (!isTermux) return null;
      return '/data/data/com.termux/files';
    },
    
    /**
     * 读取文件内容
     * @param {string} path - 文件路径
     * @returns {Promise<string>}
     */
    async readFile(path) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      try {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        const result = await Filesystem.readFile({
          path,
          directory: Directory.External,
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
     * @param {string} content - 文件内容
     * @returns {Promise<boolean>}
     */
    async writeFile(path, content) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      try {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        await Filesystem.writeFile({
          path,
          data: content,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        });
        return true;
      } catch (error) {
        console.error('写入文件失败:', error);
        throw error;
      }
    },
    
    /**
     * 追加写入文件
     * @param {string} path - 文件路径
     * @param {string} content - 追加内容
     * @returns {Promise<boolean>}
     */
    async appendFile(path, content) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      try {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        await Filesystem.appendFile({
          path,
          data: content,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        });
        return true;
      } catch (error) {
        console.error('追加文件失败:', error);
        throw error;
      }
    },
    
    /**
     * 删除文件
     * @param {string} path - 文件路径
     * @returns {Promise<boolean>}
     */
    async deleteFile(path) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        await Filesystem.deleteFile({
          path,
          directory: Directory.External,
        });
        return true;
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
      if (!isTermux) return false;
      
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        await Filesystem.stat({
          path,
          directory: Directory.External,
        });
        return true;
      } catch (error) {
        return false;
      }
    },
    
    /**
     * 创建目录
     * @param {string} path - 目录路径
     * @returns {Promise<boolean>}
     */
    async mkdir(path) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        await Filesystem.mkdir({
          path,
          directory: Directory.External,
          recursive: true,
        });
        return true;
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
    async listDir(path) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const result = await Filesystem.readdir({
          path,
          directory: Directory.External,
        });
        return result.files;
      } catch (error) {
        console.error('列出目录失败:', error);
        throw error;
      }
    },
    
    /**
     * 获取小说保存目录
     * @returns {Promise<string>}
     */
    async getNovelDir() {
      const externalDir = await this.getExternalStorageDir();
      return `${externalDir}/YunShu/Novels`;
    },
    
    /**
     * 保存小说到文件
     * @param {string} title - 小说标题
     * @param {string} content - 小说内容
     * @param {string} [format='txt'] - 格式
     * @returns {Promise<string>} 保存的文件路径
     */
    async saveNovel(title, content, format = 'txt') {
      const novelDir = await this.getNovelDir();
      
      // 确保目录存在
      await this.mkdir(novelDir);
      
      // 生成文件名
      const fileName = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.${format}`;
      const filePath = `${novelDir}/${fileName}`;
      
      // 写入文件
      await this.writeFile(filePath, content);
      
      return filePath;
    },
    
    /**
     * 导出小说为多种格式
     * @param {Object} novel - 小说对象
     * @param {string} format - 格式 (txt, md, html)
     * @returns {Promise<string>}
     */
    async exportNovel(novel, format = 'txt') {
      const novelDir = await this.getNovelDir();
      await this.mkdir(novelDir);
      
      let content = '';
      let extension = format;
      
      switch (format) {
        case 'txt':
          content = this._formatAsTxt(novel);
          break;
        case 'md':
          content = this._formatAsMarkdown(novel);
          break;
        case 'html':
          content = this._formatAsHtml(novel);
          break;
        default:
          content = this._formatAsTxt(novel);
          extension = 'txt';
      }
      
      const fileName = `${novel.title.replace(/[\/\\?%*:|"<>]/g, '_')}.${extension}`;
      const filePath = `${novelDir}/${fileName}`;
      
      await this.writeFile(filePath, content);
      
      return filePath;
    },
    
    /**
     * 格式化为 TXT
     * @private
     */
    _formatAsTxt(novel) {
      let content = `${novel.title}\n`;
      content += `${'='.repeat(novel.title.length * 2)}\n\n`;
      
      if (novel.description) {
        content += `【简介】\n${novel.description}\n\n`;
      }
      
      if (novel.author) {
        content += `作者：${novel.author}\n\n`;
      }
      
      content += `${'─'.repeat(40)}\n\n`;
      
      if (novel.chapters && novel.chapters.length > 0) {
        novel.chapters.forEach((chapter, index) => {
          content += `第${index + 1}章 ${chapter.title}\n\n`;
          content += `${chapter.content}\n\n`;
          content += `${'─'.repeat(40)}\n\n`;
        });
      }
      
      return content;
    },
    
    /**
     * 格式化为 Markdown
     * @private
     */
    _formatAsMarkdown(novel) {
      let content = `# ${novel.title}\n\n`;
      
      if (novel.description) {
        content += `> ${novel.description}\n\n`;
      }
      
      if (novel.author) {
        content += `**作者：** ${novel.author}\n\n`;
      }
      
      content += `---\n\n`;
      
      if (novel.chapters && novel.chapters.length > 0) {
        novel.chapters.forEach((chapter, index) => {
          content += `## 第${index + 1}章 ${chapter.title}\n\n`;
          content += `${chapter.content}\n\n`;
          content += `---\n\n`;
        });
      }
      
      return content;
    },
    
    /**
     * 格式化为 HTML
     * @private
     */
    _formatAsHtml(novel) {
      let content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${novel.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.8; }
    h1 { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    h2 { color: #667eea; border-left: 4px solid #667eea; padding-left: 10px; }
    .description { color: #666; font-style: italic; text-align: center; }
    .author { text-align: center; color: #999; }
    .chapter { margin: 30px 0; }
    hr { border: none; border-top: 1px dashed #ddd; margin: 40px 0; }
  </style>
</head>
<body>
  <h1>${novel.title}</h1>`;
      
      if (novel.description) {
        content += `\n  <p class="description">${novel.description}</p>`;
      }
      
      if (novel.author) {
        content += `\n  <p class="author">作者：${novel.author}</p>`;
      }
      
      content += `\n  <hr>`;
      
      if (novel.chapters && novel.chapters.length > 0) {
        novel.chapters.forEach((chapter, index) => {
          content += `\n  <div class="chapter">`;
          content += `\n    <h2>第${index + 1}章 ${chapter.title}</h2>`;
          content += `\n    <p>${chapter.content.replace(/\n/g, '</p>\n    <p>')}</p>`;
          content += `\n  </div>`;
          content += `\n  <hr>`;
        });
      }
      
      content += `\n</body>\n</html>`;
      
      return content;
    },
  },
  
  // ============================================
  // 命令行集成
  // ============================================
  
  shell: {
    /**
     * 执行命令
     * 注意：在 Termux WebView 中可能受限
     * @param {string} command - 命令
     * @returns {Promise<Object>}
     */
    async execute(command) {
      if (!isTermux) {
        throw new Error('此功能仅在 Termux 环境中可用');
      }
      
      // 尝试使用 Termux API
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          const result = await window.TermuxAPI.executeCommand(command);
          return {
            success: true,
            output: result.stdout || '',
            error: result.stderr || '',
          };
        } catch (error) {
          return {
            success: false,
            output: '',
            error: error.message,
          };
        }
      }
      
      return {
        success: false,
        output: '',
        error: 'Termux API 不可用',
      };
    },
    
    /**
     * 打开 Termux 终端
     */
    async openTerminal() {
      if (!isTermux) return;
      
      // 尝试打开 Termux
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.openTerminal();
        } catch (error) {
          console.warn('打开终端失败:', error);
        }
      }
    },
  },
  
  // ============================================
  // Termux 特有功能
  // ============================================
  
  features: {
    /**
     * 检查 Termux:API 是否安装
     * @returns {Promise<boolean>}
     */
    async hasTermuxAPI() {
      if (!isTermux) return false;
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        return true;
      }
      
      return false;
    },
    
    /**
     * 显示 Toast 消息
     * @param {string} message - 消息内容
     */
    async showToast(message) {
      if (!isTermux) {
        console.log('[Toast]', message);
        return;
      }
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.showToast(message);
        } catch (error) {
          console.warn('显示 Toast 失败:', error);
        }
      }
    },
    
    /**
     * 振动设备
     * @param {number} [duration=100] - 振动时长（毫秒）
     */
    async vibrate(duration = 100) {
      if (!isTermux) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(duration);
        }
        return;
      }
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.vibrate(duration);
        } catch (error) {
          // 回退到 Web API
          if (navigator.vibrate) {
            navigator.vibrate(duration);
          }
        }
      }
    },
    
    /**
     * 获取电池信息
     * @returns {Promise<Object>}
     */
    async getBatteryInfo() {
      if (!isTermux) return null;
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          return await window.TermuxAPI.getBatteryInfo();
        } catch (error) {
          console.warn('获取电池信息失败:', error);
        }
      }
      
      return null;
    },
    
    /**
     * 获取网络信息
     * @returns {Promise<Object>}
     */
    async getNetworkInfo() {
      if (!isTermux) return null;
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          return await window.TermuxAPI.getNetworkInfo();
        } catch (error) {
          console.warn('获取网络信息失败:', error);
        }
      }
      
      return null;
    },
    
    /**
     * 设置剪贴板内容
     * @param {string} text - 文本内容
     */
    async setClipboard(text) {
      if (!isTermux) {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        }
        return;
      }
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.setClipboard(text);
        } catch (error) {
          // 回退到 Web API
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
          }
        }
      }
    },
    
    /**
     * 分享文本
     * @param {string} text - 文本内容
     */
    async shareText(text) {
      if (!isTermux) {
        if (navigator.share) {
          await navigator.share({ text });
        }
        return;
      }
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.shareText(text);
        } catch (error) {
          // 回退到 Web API
          if (navigator.share) {
            await navigator.share({ text });
          }
        }
      }
    },
    
    /**
     * 分享文件
     * @param {string} filePath - 文件路径
     */
    async shareFile(filePath) {
      if (!isTermux) return;
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.shareFile(filePath);
        } catch (error) {
          console.warn('分享文件失败:', error);
        }
      }
    },
    
    /**
     * 打开 URL
     * @param {string} url - URL 地址
     */
    async openUrl(url) {
      if (!isTermux) {
        window.open(url, '_blank');
        return;
      }
      
      if (typeof window !== 'undefined' && window.TermuxAPI) {
        try {
          await window.TermuxAPI.openUrl(url);
        } catch (error) {
          window.open(url, '_blank');
        }
      }
    },
  },
  
  // ============================================
  // 快捷操作
  // ============================================
  
  /**
   * 快速保存当前写作内容
   * @param {string} title - 标题
   * @param {string} content - 内容
   * @returns {Promise<string>}
   */
  async quickSave(title, content) {
    if (!isTermux) {
      // Web 环境使用下载
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      return 'download';
    }
    
    return this.files.saveNovel(title, content);
  },
  
  /**
   * 自动备份小说
   * @param {Object} novel - 小说对象
   * @returns {Promise<string>}
   */
  async autoBackup(novel) {
    if (!isTermux) return null;
    
    const backupDir = await this.files.getNovelDir() + '/.backup';
    await this.files.mkdir(backupDir);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${novel.title}_${timestamp}.json`;
    const filePath = `${backupDir}/${fileName}`;
    
    const backupData = {
      ...novel,
      backupTime: new Date().toISOString(),
      version: '2.5.0',
    };
    
    await this.files.writeFile(filePath, JSON.stringify(backupData, null, 2));
    
    return filePath;
  },
  
  /**
   * 恢复备份
   * @param {string} backupPath - 备份文件路径
   * @returns {Promise<Object>}
   */
  async restoreBackup(backupPath) {
    if (!isTermux) return null;
    
    const content = await this.files.readFile(backupPath);
    return JSON.parse(content);
  },
  
  /**
   * 列出所有备份
   * @param {string} novelTitle - 小说标题（可选）
   * @returns {Promise<Array>}
   */
  async listBackups(novelTitle = null) {
    if (!isTermux) return [];
    
    const backupDir = await this.files.getNovelDir() + '/.backup';
    
    try {
      const files = await this.files.listDir(backupDir);
      
      let backups = files.filter(f => f.name.endsWith('.json'));
      
      if (novelTitle) {
        backups = backups.filter(f => f.name.startsWith(novelTitle));
      }
      
      return backups.map(f => ({
        name: f.name,
        path: `${backupDir}/${f.name}`,
        time: f.mtime,
      }));
    } catch (error) {
      return [];
    }
  },
};

export default termuxAPI;

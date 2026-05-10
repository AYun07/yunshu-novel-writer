/**
 * 同步功能组合式函数
 * 提供同步状态监控、手动触发同步、冲突解决UI、同步历史、离线状态提示等功能
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import syncService, { syncState, SyncStatus, checkNeedSync, getSyncStats } from '../services/syncService.js'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 使用同步功能的组合式函数
 * @param {object} options - 配置选项
 * @returns {object} 同步相关的状态和方法
 */
export function useSync(options = {}) {
  const {
    autoSync = true,
    showNotifications = true,
    onConflict = null
  } = options

  // ==================== 本地状态 ====================

  /**
   * 是否正在同步
   */
  const isSyncing = computed(() => syncState.status === SyncStatus.SYNCING)

  /**
   * 是否离线
   */
  const isOffline = computed(() => syncState.status === SyncStatus.OFFLINE || !syncState.isOnline)

  /**
   * 是否有错误
   */
  const hasError = computed(() => syncState.status === SyncStatus.ERROR)

  /**
   * 是否有冲突
   */
  const hasConflict = computed(() => syncState.status === SyncStatus.CONFLICT)

  /**
   * 同步历史记录
   */
  const syncHistory = ref([])

  /**
   * 同步统计信息
   */
  const syncStats = ref({
    totalItems: 0,
    syncedItems: 0,
    pendingItems: 0,
    conflictItems: 0
  })

  /**
   * 当前冲突列表
   */
  const currentConflicts = ref([])

  // ==================== 计算属性 ====================

  /**
   * 同步状态文本
   */
  const statusText = computed(() => {
    switch (syncState.status) {
      case SyncStatus.IDLE:
        return '已同步'
      case SyncStatus.SYNCING:
        return syncState.currentOperation || '同步中...'
      case SyncStatus.SUCCESS:
        return '同步成功'
      case SyncStatus.ERROR:
        return '同步失败'
      case SyncStatus.OFFLINE:
        return '离线模式'
      case SyncStatus.CONFLICT:
        return '需要解决冲突'
      default:
        return '未知状态'
    }
  })

  /**
   * 同步状态图标
   */
  const statusIcon = computed(() => {
    switch (syncState.status) {
      case SyncStatus.IDLE:
      case SyncStatus.SUCCESS:
        return 'CircleCheck'
      case SyncStatus.SYNCING:
        return 'Loading'
      case SyncStatus.ERROR:
        return 'CircleClose'
      case SyncStatus.OFFLINE:
        return 'Warning'
      case SyncStatus.CONFLICT:
        return 'WarningFilled'
      default:
        return 'QuestionFilled'
    }
  })

  /**
   * 上次同步时间的友好显示
   */
  const lastSyncTimeText = computed(() => {
    if (!syncState.lastSyncTime) {
      return '从未同步'
    }

    const now = Date.now()
    const diff = now - syncState.lastSyncTime

    // 小于1分钟
    if (diff < 60 * 1000) {
      return '刚刚'
    }

    // 小于1小时
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}分钟前`
    }

    // 小于24小时
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours}小时前`
    }

    // 显示日期
    const date = new Date(syncState.lastSyncTime)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  /**
   * 是否有待同步的变更
   */
  const hasPendingChanges = computed(() => {
    return syncState.pendingChanges > 0 || syncStats.value.pendingItems > 0
  })

  /**
   * 待同步变更数量
   */
  const pendingChangesCount = computed(() => {
    return syncState.pendingChanges + syncStats.value.pendingItems
  })

  // ==================== 方法 ====================

  /**
   * 手动触发同步
   * @param {boolean} force - 是否强制同步
   * @returns {Promise<object>} 同步结果
   */
  const triggerSync = async (force = false) => {
    if (isOffline.value) {
      if (showNotifications) {
        ElMessage.warning('当前处于离线状态，请检查网络连接')
      }
      return { success: false, error: '离线状态' }
    }

    if (isSyncing.value && !force) {
      return { success: false, error: '同步正在进行中' }
    }

    const result = await syncService.sync({ force })

    if (result.success) {
      // 添加到历史记录
      addToHistory({
        type: 'manual',
        status: 'success',
        timestamp: Date.now()
      })

      if (showNotifications) {
        ElMessage.success('同步成功')
      }

      // 刷新统计
      await refreshStats()
    } else {
      // 添加到历史记录
      addToHistory({
        type: 'manual',
        status: 'error',
        timestamp: Date.now(),
        error: result.error
      })

      if (showNotifications) {
        ElMessage.error(`同步失败: ${result.error}`)
      }
    }

    return result
  }

  /**
   * 检查是否需要同步
   * @returns {Promise<boolean>}
   */
  const checkSyncNeeded = async () => {
    return await checkNeedSync()
  }

  /**
   * 刷新同步统计
   */
  const refreshStats = async () => {
    syncStats.value = await getSyncStats()
  }

  /**
   * 添加到同步历史
   * @param {object} record - 历史记录
   */
  const addToHistory = (record) => {
    syncHistory.value.unshift(record)

    // 只保留最近50条记录
    if (syncHistory.value.length > 50) {
      syncHistory.value = syncHistory.value.slice(0, 50)
    }

    // 保存到本地存储
    saveHistory()
  }

  /**
   * 保存历史到本地存储
   */
  const saveHistory = () => {
    try {
      localStorage.setItem('yunshu_sync_history', JSON.stringify(syncHistory.value))
    } catch (error) {
      console.error('保存同步历史失败:', error)
    }
  }

  /**
   * 从本地存储加载历史
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('yunshu_sync_history')
      if (stored) {
        syncHistory.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载同步历史失败:', error)
      syncHistory.value = []
    }
  }

  /**
   * 清空同步历史
   */
  const clearHistory = () => {
    syncHistory.value = []
    localStorage.removeItem('yunshu_sync_history')
  }

  /**
   * 解决冲突
   * @param {string} conflictId - 冲突ID
   * @param {string} resolution - 解决方案 ('local' | 'server' | 'merge')
 * @param {object} mergedData - 合并后的数据（当 resolution 为 'merge' 时）
   */
  const resolveConflict = async (conflictId, resolution, mergedData = null) => {
    const conflict = currentConflicts.value.find(c => c.id === conflictId)
    if (!conflict) {
      console.error('冲突不存在:', conflictId)
      return false
    }

    try {
      switch (resolution) {
        case 'local':
          // 保留本地版本
          await syncService.uploadUpdate(conflict.table, conflict.localData)
          break

        case 'server':
          // 使用服务器版本
          await database.db[conflict.table].update(conflict.serverData.id, conflict.serverData)
          break

        case 'merge':
          // 使用合并后的数据
          if (mergedData) {
            await database.db[conflict.table].update(mergedData.id, mergedData)
            await syncService.uploadUpdate(conflict.table, mergedData)
          }
          break

        default:
          throw new Error('无效的解决方案')
      }

      // 从冲突列表移除
      const index = currentConflicts.value.findIndex(c => c.id === conflictId)
      if (index > -1) {
        currentConflicts.value.splice(index, 1)
      }

      // 如果没有更多冲突，恢复状态
      if (currentConflicts.value.length === 0) {
        syncState.status = SyncStatus.IDLE
      }

      // 添加到历史记录
      addToHistory({
        type: 'conflict_resolution',
        status: 'success',
        timestamp: Date.now(),
        conflictId,
        resolution
      })

      if (showNotifications) {
        ElMessage.success('冲突已解决')
      }

      return true
    } catch (error) {
      console.error('解决冲突失败:', error)

      if (showNotifications) {
        ElMessage.error('解决冲突失败')
      }

      return false
    }
  }

  /**
   * 显示冲突解决对话框
   * @param {object} conflict - 冲突数据
   */
  const showConflictDialog = async (conflict) => {
    const { table, localData, serverData } = conflict

    try {
      const result = await ElMessageBox.confirm(
        `检测到数据冲突：${table} (ID: ${localData.id})\n\n` +
        `本地版本修改时间: ${new Date(localData.lastModified).toLocaleString('zh-CN')}\n` +
        `服务器版本修改时间: ${new Date(serverData.lastModified).toLocaleString('zh-CN')}\n\n` +
        `请选择保留哪个版本：`,
        '数据冲突',
        {
          confirmButtonText: '保留本地',
          cancelButtonText: '使用服务器',
          distinguishCancelAndClose: true,
          type: 'warning'
        }
      )

      // 用户选择保留本地
      await resolveConflict(conflict.id, 'local')
    } catch (action) {
      if (action === 'cancel') {
        // 用户选择使用服务器
        await resolveConflict(conflict.id, 'server')
      }
    }
  }

  /**
   * 导出同步数据
   * @returns {Promise<string>} JSON格式的数据
   */
  const exportData = async () => {
    try {
      const data = await syncService.exportSyncData()

      // 创建下载链接
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `yunshu_backup_${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)

      if (showNotifications) {
        ElMessage.success('数据导出成功')
      }

      return data
    } catch (error) {
      console.error('导出数据失败:', error)

      if (showNotifications) {
        ElMessage.error('导出数据失败')
      }

      throw error
    }
  }

  /**
   * 导入同步数据
   * @param {File} file - JSON文件
   * @returns {Promise<boolean>}
   */
  const importData = async (file) => {
    try {
      const text = await file.text()
      const result = await syncService.importSyncData(text)

      if (result.success) {
        if (showNotifications) {
          ElMessage.success('数据导入成功')
        }

        // 刷新统计
        await refreshStats()

        return true
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('导入数据失败:', error)

      if (showNotifications) {
        ElMessage.error(`导入数据失败: ${error.message}`)
      }

      return false
    }
  }

  /**
   * 重置同步状态
   */
  const resetSync = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要重置同步状态吗？这将清除所有同步记录，但不会影响本地数据。',
        '确认重置',
        {
          confirmButtonText: '重置',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await syncService.resetSync()
      await refreshStats()

      if (showNotifications) {
        ElMessage.success('同步状态已重置')
      }

      return true
    } catch (action) {
      if (action === 'cancel') {
        return false
      }
      throw action
    }
  }

  // ==================== 监听器 ====================

  /**
   * 监听同步状态变化
   */
  let unwatchStatus = null

  /**
   * 初始化监听器
   */
  const initListeners = () => {
    // 注册冲突解决器
    syncService.onConflict('*', (conflict) => {
      currentConflicts.value.push({
        id: `${conflict.table}_${conflict.localData.id}_${Date.now()}`,
        ...conflict,
        detectedAt: Date.now()
      })

      // 如果提供了自定义冲突处理函数，使用它
      if (onConflict) {
        onConflict(conflict)
      } else {
        // 否则显示默认对话框
        showConflictDialog(conflict)
      }
    })
  }

  // ==================== 生命周期 ====================

  onMounted(async () => {
    // 加载历史记录
    loadHistory()

    // 初始化监听器
    initListeners()

    // 刷新统计
    await refreshStats()

    // 初始化同步服务
    await syncService.initialize()

    // 如果需要自动同步且在线，执行一次同步
    if (autoSync && syncState.isOnline) {
      const needSync = await checkSyncNeeded()
      if (needSync) {
        await triggerSync()
      }
    }
  })

  onUnmounted(() => {
    // 清理监听器
    if (unwatchStatus) {
      unwatchStatus()
    }
  })

  // ==================== 返回值 ====================

  return {
    // 状态
    syncState,
    isSyncing,
    isOffline,
    hasError,
    hasConflict,
    syncHistory,
    syncStats,
    currentConflicts,

    // 计算属性
    statusText,
    statusIcon,
    lastSyncTimeText,
    hasPendingChanges,
    pendingChangesCount,

    // 方法
    triggerSync,
    checkSyncNeeded,
    refreshStats,
    clearHistory,
    resolveConflict,
    showConflictDialog,
    exportData,
    importData,
    resetSync
  }
}

/**
 * 使用自动同步的组合式函数
 * 提供简化的自动同步功能
 * @param {object} options - 配置选项
 * @returns {object} 自动同步相关的状态和方法
 */
export function useAutoSync(options = {}) {
  const {
    interval = 5 * 60 * 1000, // 5分钟
    onError = null,
    onSuccess = null
  } = options

  const { triggerSync, isSyncing, isOffline, statusText, lastSyncTimeText } = useSync({
    autoSync: false,
    showNotifications: false
  })

  let autoSyncTimer = null

  /**
   * 启动自动同步
   */
  const startAutoSync = () => {
    if (autoSyncTimer) {
      clearInterval(autoSyncTimer)
    }

    autoSyncTimer = setInterval(async () => {
      if (!isSyncing.value && !isOffline.value) {
        const result = await triggerSync()

        if (result.success) {
          onSuccess?.()
        } else {
          onError?.(result.error)
        }
      }
    }, interval)
  }

  /**
   * 停止自动同步
   */
  const stopAutoSync = () => {
    if (autoSyncTimer) {
      clearInterval(autoSyncTimer)
      autoSyncTimer = null
    }
  }

  onMounted(() => {
    startAutoSync()
  })

  onUnmounted(() => {
    stopAutoSync()
  })

  return {
    isSyncing,
    isOffline,
    statusText,
    lastSyncTimeText,
    triggerSync,
    startAutoSync,
    stopAutoSync
  }
}

/**
 * 使用离线状态的组合式函数
 * 提供离线状态检测和提示
 * @returns {object} 离线状态相关的状态和方法
 */
export function useOfflineStatus() {
  const isOffline = ref(!navigator.onLine)
  const wasOffline = ref(false)

  /**
   * 处理网络恢复
   */
  const handleOnline = () => {
    isOffline.value = false

    if (wasOffline.value) {
      wasOffline.value = false
      ElMessage.success('网络已恢复，正在同步数据...')
    }
  }

  /**
   * 处理网络断开
   */
  const handleOffline = () => {
    isOffline.value = true
    wasOffline.value = true
    ElMessage.warning('网络已断开，已切换到离线模式')
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    isOffline,
    wasOffline
  }
}

// 默认导出
export default useSync

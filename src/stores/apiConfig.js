import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '../services/api.js'
import { STORAGE_KEYS } from '../utils/constants.js'

export const useApiConfigStore = defineStore('apiConfig', () => {
  // ==================== 状态 ====================

  // API配置 - 仅自定义配置
  const apiConfig = ref({
    apiKey: '',
    baseURL: 'https://api.openai.com/v1',
    selectedModel: 'gpt-4o',
    maxTokens: 4096,
    temperature: 0.7
  })

  const isApiConfigured = ref(false)

  // ==================== 计算属性 ====================

  const selectedModel = computed(() => apiConfig.value.selectedModel)

  // ==================== 初始化 ====================

  const initializeApiConfig = () => {
    try {
      if (typeof localStorage === 'undefined') return
      const saved = localStorage.getItem(STORAGE_KEYS.API_CONFIG)
      if (saved) {
        const config = JSON.parse(saved)
        apiConfig.value = { ...apiConfig.value, ...config }
      }
      isApiConfigured.value = !!apiConfig.value.apiKey
      apiService.updateConfig(apiConfig.value)
    } catch (error) {
      console.error('初始化API配置失败:', error)
    }
  }

  // 立即执行初始化
  initializeApiConfig()

  // ==================== API配置管理 ====================

  const updateApiConfig = (config) => {
    apiConfig.value = { ...apiConfig.value, ...config }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(apiConfig.value))
    }
    apiService.updateConfig(apiConfig.value)
    isApiConfigured.value = !!apiConfig.value.apiKey
  }

  const validateApiKey = async () => {
    try {
      const isValid = await apiService.validateAPIKey()
      isApiConfigured.value = isValid
      return isValid
    } catch (error) {
      console.error('API密钥验证失败:', error)
      isApiConfigured.value = false
      return false
    }
  }

  // ==================== 导出 ====================

  return {
    // 状态
    apiConfig,
    isApiConfigured,

    // 计算属性
    selectedModel,

    // 方法
    initializeApiConfig,
    updateApiConfig,
    validateApiKey
  }
})

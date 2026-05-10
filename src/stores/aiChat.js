import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiService from '../services/api.js'
import { generateId } from '../utils/id.js'

export const useAiChatStore = defineStore('aiChat', () => {
  // ==================== 状态 ====================

  // AI对话
  const chatMessages = ref([])
  const currentChatInput = ref('')
  const isGenerating = ref(false)

  // ==================== 方法 ====================

  const addMessage = (message, isUser = true) => {
    chatMessages.value.push({
      id: generateId(),
      content: message,
      isUser,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  const setChatInput = (input) => {
    currentChatInput.value = input
  }

  const setGenerating = (status) => {
    isGenerating.value = status
  }

  const clearMessages = () => {
    chatMessages.value = []
  }

  /**
   * 发送聊天消息并获取AI回复
   * @param {string} message - 用户消息
   * @returns {Promise<string>} AI回复内容
   */
  const sendMessageWithAPI = async (message) => {
    setGenerating(true)

    try {
      const response = await apiService.chatWithAI(message, chatMessages.value)
      addMessage(response, false)
      return response
    } catch (error) {
      console.error('AI对话失败:', error)
      addMessage('抱歉，AI暂时无法回应，请稍后再试。', false)
      throw error
    } finally {
      setGenerating(false)
    }
  }

  // ==================== 导出 ====================

  return {
    // 状态
    chatMessages,
    currentChatInput,
    isGenerating,

    // 方法
    addMessage,
    setChatInput,
    setGenerating,
    clearMessages,
    sendMessageWithAPI
  }
})

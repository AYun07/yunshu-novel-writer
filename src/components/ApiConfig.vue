<template>
  <div class="api-config">
    <el-form :model="config" label-width="120px" label-position="top">
      <el-alert
        title="配置说明"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      >
        <p>云书支持 OpenAI 兼容的 API 接口，您可以配置 OpenAI、DeepSeek、Claude 等多种 AI 服务。</p>
      </el-alert>

      <el-form-item label="API 地址">
        <el-input 
          v-model="config.baseURL" 
          placeholder="例如: https://api.openai.com/v1"
          clearable
        >
          <template #prepend>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        <div class="form-tip">
          <el-button type="primary" link size="small" @click="setPresetURL('openai')">OpenAI</el-button>
          <el-button type="primary" link size="small" @click="setPresetURL('deepseek')">DeepSeek</el-button>
          <el-button type="primary" link size="small" @click="setPresetURL('claude')">Claude</el-button>
        </div>
      </el-form-item>

      <el-form-item label="API 密钥">
        <el-input 
          v-model="config.apiKey" 
          type="password"
          placeholder="请输入您的 API Key"
          show-password
          clearable
        >
          <template #prepend>
            <el-icon><Key /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="默认模型">
        <el-select v-model="config.selectedModel" placeholder="选择默认模型" style="width: 100%">
          <el-option-group label="OpenAI 模型">
            <el-option label="GPT-4o (推荐)" value="gpt-4o" />
            <el-option label="GPT-4o Mini" value="gpt-4o-mini" />
            <el-option label="GPT-4 Turbo" value="gpt-4-turbo" />
            <el-option label="GPT-3.5 Turbo" value="gpt-3.5-turbo" />
          </el-option-group>
          <el-option-group label="DeepSeek 模型">
            <el-option label="DeepSeek V3" value="deepseek-chat" />
            <el-option label="DeepSeek R1 (推理)" value="deepseek-reasoner" />
          </el-option-group>
          <el-option-group label="Claude 模型">
            <el-option label="Claude 3.5 Sonnet" value="claude-3-5-sonnet-20241022" />
            <el-option label="Claude 3 Opus" value="claude-3-opus-20240229" />
          </el-option-group>
          <el-option-group label="其他模型">
            <el-option label="自定义模型" value="custom" />
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item label="自定义模型名称" v-if="config.selectedModel === 'custom'">
        <el-input 
          v-model="config.customModel" 
          placeholder="输入自定义模型ID"
        />
      </el-form-item>

      <el-form-item label="最大Token数">
        <el-input-number 
          v-model="config.maxTokens" 
          :min="100" 
          :max="128000"
          :step="100"
          style="width: 100%"
        />
        <div class="form-tip">建议设置 4096-8192，过大会增加响应时间</div>
      </el-form-item>

      <el-form-item label="温度 (创造性)">
        <el-slider 
          v-model="config.temperature" 
          :min="0" 
          :max="2" 
          :step="0.1"
          show-input
        />
        <div class="form-tip">0-0.3: 精确 | 0.4-0.7: 平衡 | 0.8-1.0: 创造性 | 1.0+: 随机</div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveConfig" :loading="saving">
          <el-icon><Check /></el-icon>
          保存配置
        </el-button>
        <el-button @click="testConnection" :loading="testing" :disabled="!config.apiKey">
          <el-icon><Connection /></el-icon>
          测试连接
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 测试结果 -->
    <el-alert
      v-if="testResult"
      :title="testResult.success ? '连接成功' : '连接失败'"
      :type="testResult.success ? 'success' : 'error'"
      :description="testResult.message"
      show-icon
      :closable="true"
      @close="testResult = null"
      style="margin-top: 15px"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { ElMessage } from 'element-plus'
import { Link, Key, Check, Connection } from '@element-plus/icons-vue'

const emit = defineEmits(['close'])
const novelStore = useNovelStore()

const config = reactive({
  baseURL: 'https://api.openai.com/v1',
  apiKey: '',
  selectedModel: 'gpt-4o',
  customModel: '',
  maxTokens: 4096,
  temperature: 0.7
})

const saving = ref(false)
const testing = ref(false)
const testResult = ref(null)

// 预设API地址
const presetURLs = {
  openai: 'https://api.openai.com/v1',
  deepseek: 'https://api.deepseek.com/v1',
  claude: 'https://api.anthropic.com/v1'
}

const setPresetURL = (type) => {
  config.baseURL = presetURLs[type]
  // 自动切换对应模型
  if (type === 'openai') {
    config.selectedModel = 'gpt-4o'
  } else if (type === 'deepseek') {
    config.selectedModel = 'deepseek-chat'
  } else if (type === 'claude') {
    config.selectedModel = 'claude-3-5-sonnet-20241022'
  }
}

const saveConfig = async () => {
  if (!config.apiKey) {
    ElMessage.warning('请输入 API 密钥')
    return
  }
  
  saving.value = true
  try {
    const configToSave = {
      baseURL: config.baseURL,
      apiKey: config.apiKey,
      selectedModel: config.selectedModel === 'custom' ? config.customModel : config.selectedModel,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    }
    
    novelStore.updateApiConfig(configToSave)
    ElMessage.success('配置保存成功')
    emit('close')
  } catch (error) {
    ElMessage.error('保存配置失败: ' + error.message)
  } finally {
    saving.value = false
  }
}

const testConnection = async () => {
  testing.value = true
  testResult.value = null
  
  try {
    const response = await fetch(`${config.baseURL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`
      }
    })
    
    if (response.ok) {
      testResult.value = {
        success: true,
        message: 'API 连接正常，配置有效'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      testResult.value = {
        success: false,
        message: `连接失败: ${response.status} - ${errorData.error?.message || '未知错误'}`
      }
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `连接失败: ${error.message}`
    }
  } finally {
    testing.value = false
  }
}

// 初始化加载配置
onMounted(() => {
  const savedConfig = novelStore.apiConfig
  if (savedConfig) {
    config.baseURL = savedConfig.baseURL || 'https://api.openai.com/v1'
    config.apiKey = savedConfig.apiKey || ''
    config.selectedModel = savedConfig.selectedModel || 'gpt-4o'
    config.maxTokens = savedConfig.maxTokens || 4096
    config.temperature = savedConfig.temperature || 0.7
  }
})
</script>

<style scoped>
.api-config {
  padding: 10px;
}

.form-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-group__prepend) {
  background-color: #f5f7fa;
}
</style>

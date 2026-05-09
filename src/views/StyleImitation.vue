<template>
  <div class="style-imitation">
    <!-- 版权声明横幅 -->
    <el-alert
      type="warning"
      :closable="false"
      show-icon
      style="margin-bottom: 20px"
    >
      <template #title>
        <strong>⚖️ 版权合规声明</strong>
      </template>
      <p style="margin: 4px 0 0; font-size: 13px;">
        本功能仅提取文本的<strong>写作风格特征</strong>（句式、修辞、叙事手法等），所有生成内容均为<strong>100%原创</strong>。
        请确保上传的文本为您合法拥有的正版书籍。严禁用于抄袭、侵权等违法用途。
      </p>
    </el-alert>

    <!-- 步骤导航 -->
    <el-steps :active="currentStep" finish-status="success" align-center style="margin-bottom: 30px">
      <el-step title="上传文本" icon="Upload" />
      <el-step title="风格分析" icon="DataAnalysis" />
      <el-step title="原创仿写" icon="EditPen" />
    </el-steps>

    <!-- 步骤1：上传文本 -->
    <div v-if="currentStep === 0" class="step-panel">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>📤 上传参考文本</span>
          </div>
        </template>

        <div class="upload-area">
          <el-upload
            ref="uploadRef"
            drag
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            accept=".txt,.md"
          >
            <el-icon class="el-icon--upload" style="font-size: 48px; color: #409eff;"><Upload /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 TXT、Markdown 格式，文件大小不超过 10MB
              </div>
            </template>
          </el-upload>
        </div>

        <!-- 或者直接粘贴文本 -->
        <el-divider>或直接粘贴文本</el-divider>

        <el-input
          v-model="rawText"
          type="textarea"
          :rows="8"
          placeholder="请粘贴您要分析风格的文本内容（建议1000字以上，效果更佳）..."
          show-word-limit
          :maxlength="50000"
        />

        <div class="text-stats" v-if="rawText">
          <span>已输入 {{ rawText.length }} 字</span>
          <el-tag v-if="rawText.length < 500" type="warning" size="small">建议输入500字以上</el-tag>
          <el-tag v-else-if="rawText.length >= 500" type="success" size="small">文本长度合适</el-tag>
        </div>

        <div class="step-actions">
          <el-button
            type="primary"
            size="large"
            :disabled="!canAnalyze"
            :loading="isAnalyzing"
            @click="analyzeStyle"
          >
            <el-icon><DataAnalysis /></el-icon>
            开始风格分析
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 步骤2：风格分析结果 -->
    <div v-if="currentStep === 1" class="step-panel">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>📊 风格分析报告</span>
            <el-button type="primary" link @click="currentStep = 0">重新上传</el-button>
          </div>
        </template>

        <div v-if="styleProfile" class="style-report">
          <!-- 风格概览 -->
          <div class="report-section">
            <h3>📋 风格概览</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">文本类型</span>
                <span class="info-value">{{ styleProfile.basicInfo?.genre }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">时代背景</span>
                <span class="info-value">{{ styleProfile.basicInfo?.era }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">整体基调</span>
                <span class="info-value">{{ styleProfile.basicInfo?.tone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">叙事距离</span>
                <span class="info-value">{{ styleProfile.basicInfo?.narrativeDistance }}</span>
              </div>
            </div>
          </div>

          <!-- 语言风格 -->
          <div class="report-section">
            <h3>✍️ 语言风格</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">用词特点</span>
                <span class="info-value">{{ styleProfile.languageStyle?.vocabulary }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">句式特点</span>
                <span class="info-value">{{ styleProfile.languageStyle?.sentencePattern }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">语言节奏</span>
                <span class="info-value">{{ styleProfile.languageStyle?.rhythm }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">修辞特点</span>
                <span class="info-value">{{ styleProfile.languageStyle?.metaphorStyle }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">对话风格</span>
                <span class="info-value">{{ styleProfile.languageStyle?.dialogueStyle }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">描写密度</span>
                <span class="info-value">{{ styleProfile.languageStyle?.descriptionDensity }}</span>
              </div>
            </div>
          </div>

          <!-- 叙事技法 -->
          <div class="report-section">
            <h3>📖 叙事技法</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">叙事视角</span>
                <span class="info-value">{{ styleProfile.narrativeTechnique?.pov }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">时间线处理</span>
                <span class="info-value">{{ styleProfile.narrativeTechnique?.timeline }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">节奏控制</span>
                <span class="info-value">{{ styleProfile.narrativeTechnique?.pacing }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">悬念手法</span>
                <span class="info-value">{{ styleProfile.narrativeTechnique?.suspenseTechnique }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">结构模式</span>
                <span class="info-value">{{ styleProfile.narrativeTechnique?.structurePattern }}</span>
              </div>
            </div>
          </div>

          <!-- 人物与情感 -->
          <div class="report-section">
            <h3>👤 人物与情感</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">塑造方式</span>
                <span class="info-value">{{ styleProfile.characterStyle?.characterization }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">人物深度</span>
                <span class="info-value">{{ styleProfile.characterStyle?.characterDepth }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">情感表达</span>
                <span class="info-value">{{ styleProfile.emotionalStyle?.emotionExpression }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">情感基调</span>
                <span class="info-value">{{ styleProfile.emotionalStyle?.emotionalTone }}</span>
              </div>
            </div>
          </div>

          <!-- 风格总结 -->
          <div class="report-section highlight">
            <h3>💡 风格总结</h3>
            <p class="style-summary">{{ styleProfile.styleSummary }}</p>
          </div>
        </div>

        <!-- 分析中 -->
        <div v-if="isAnalyzing" class="analyzing-state">
          <el-icon class="spinning" style="font-size: 32px; color: #409eff;"><Loading /></el-icon>
          <p>正在分析文本风格特征...</p>
          <p class="sub-text">AI正在从语言、叙事、人物、情感等多个维度提取风格特征</p>
        </div>

        <div class="step-actions" v-if="styleProfile">
          <el-button size="large" @click="currentStep = 0">
            <el-icon><ArrowLeft /></el-icon>
            重新上传
          </el-button>
          <el-button type="primary" size="large" @click="currentStep = 2">
            开始原创仿写
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 步骤3：原创仿写 -->
    <div v-if="currentStep === 2" class="step-panel">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>✍️ 原创仿写</span>
            <el-button type="primary" link @click="currentStep = 1">查看风格报告</el-button>
          </div>
        </template>

        <el-alert
          type="success"
          :closable="false"
          show-icon
          style="margin-bottom: 20px"
        >
          <template #title>
            风格特征已就绪：{{ styleProfile?.basicInfo?.genre }} · {{ styleProfile?.basicInfo?.tone }}
          </template>
          <p style="margin: 4px 0 0; font-size: 13px;">
            AI将基于提取的风格特征创作完全原创的内容，不复制原文本的任何情节、人物或具体描写。
          </p>
        </el-alert>

        <el-form :model="imitationForm" label-width="100px">
          <el-form-item label="创作主题">
            <el-input
              v-model="imitationForm.theme"
              placeholder="请描述您想要创作的主题或故事方向"
              type="textarea"
              :rows="3"
            />
          </el-form-item>

          <el-form-item label="目标字数">
            <el-select v-model="imitationForm.wordCount" style="width: 200px">
              <el-option label="500字（片段）" :value="500" />
              <el-option label="1000字（短篇）" :value="1000" />
              <el-option label="2000字（中篇片段）" :value="2000" />
              <el-option label="3000字（中篇）" :value="3000" />
              <el-option label="5000字（长篇章节）" :value="5000" />
            </el-select>
          </el-form-item>

          <el-form-item label="附加要求">
            <el-input
              v-model="imitationForm.extra"
              placeholder="可选：其他创作要求，如角色设定、场景要求等"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
        </el-form>

        <!-- 生成进度 -->
        <div v-if="isGenerating" class="generating-state">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p>{{ progressMessage }}</p>
        </div>

        <!-- 生成结果 -->
        <div v-if="generatedText" class="result-section">
          <div class="result-header">
            <h3>📝 仿写成果</h3>
            <div class="result-actions">
              <el-tag type="success">100%原创</el-tag>
              <el-button type="primary" size="small" @click="copyResult">复制</el-button>
              <el-button size="small" @click="generatedText = ''">清除</el-button>
            </div>
          </div>
          <div class="result-content">
            <div class="content-text" v-html="renderMarkdown(generatedText)"></div>
          </div>
          <div class="result-footer">
            <span>字数：{{ generatedText.replace(/<[^>]*>/g, '').length }}</span>
          </div>
        </div>

        <div class="step-actions">
          <el-button size="large" @click="currentStep = 1">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="isGenerating"
            :disabled="!imitationForm.theme"
            @click="startImitation"
          >
            <el-icon><MagicStick /></el-icon>
            {{ isGenerating ? '创作中...' : '开始原创仿写' }}
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import { Upload, DataAnalysis, ArrowLeft, ArrowRight, MagicStick, Loading } from '@element-plus/icons-vue'
import { styleAnalysisPrompt, extractStyleSample, validateUploadFile, readTextFile, buildImitationPrompt } from '../config/styleImitation.js'

const novelStore = useNovelStore()

// 状态
const currentStep = ref(0)
const rawText = ref('')
const uploadedFileName = ref('')
const isAnalyzing = ref(false)
const styleProfile = ref(null)
const isGenerating = ref(false)
const generatedText = ref('')
const progressPercent = ref(0)
const progressMessage = ref('')

const imitationForm = ref({
  theme: '',
  wordCount: 2000,
  extra: ''
})

// 计算属性
const canAnalyze = computed(() => {
  return rawText.value.length >= 300
})

// 方法
const handleFileChange = async (file) => {
  const validation = validateUploadFile(file.raw)
  if (!validation.valid) {
    ElMessage.error(validation.error)
    return
  }

  try {
    const text = await readTextFile(file.raw)
    rawText.value = text
    uploadedFileName.value = file.name
    ElMessage.success(`已读取文件：${file.name}（${text.length}字）`)
  } catch (error) {
    ElMessage.error('文件读取失败，请尝试直接粘贴文本')
  }
}

const handleExceed = () => {
  ElMessage.warning('只能上传一个文件，请先移除已上传的文件')
}

const beforeUpload = (file) => {
  const validation = validateUploadFile(file)
  if (!validation.valid) {
    ElMessage.error(validation.error)
    return false
  }
  return true
}

const analyzeStyle = async () => {
  if (!canAnalyze.value) {
    ElMessage.warning('请输入至少300字的文本')
    return
  }

  if (!novelStore.isApiConfigured) {
    ElMessage.warning('请先配置API密钥')
    return
  }

  isAnalyzing.value = true
  styleProfile.value = null
  currentStep.value = 1

  try {
    // 提取风格分析样本
    const sample = extractStyleSample(rawText.value, 15000)
    const prompt = styleAnalysisPrompt + '\n' + sample

    const response = await novelStore.generateContent(prompt)
    
    // 解析JSON结果
    let profile
    try {
      // 尝试从响应中提取JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        profile = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('无法解析风格分析结果')
      }
    } catch (parseError) {
      // 如果解析失败，创建基本档案
      profile = {
        basicInfo: { genre: '未分类', era: '现代', tone: '中性', narrativeDistance: '第三人称' },
        languageStyle: { vocabulary: '标准', sentencePattern: '混合', rhythm: '中等', metaphorStyle: '常规', dialogueStyle: '自然', descriptionDensity: '适中' },
        narrativeTechnique: { pov: '第三人称', timeline: '线性', pacing: '中等', suspenseTechnique: '常规', structurePattern: '单线' },
        characterStyle: { characterization: '行为描写', characterDepth: '适中', relationshipFocus: '综合' },
        worldBuilding: { worldDetail: '适中', environmentIntegration: '中等', culturalElements: '现代' },
        emotionalStyle: { emotionExpression: '间接', emotionalTone: '中性', readerEngagement: '共情' },
        styleSummary: '文本风格较为均衡，建议提供更多文本以获得更精准的分析。'
      }
    }

    styleProfile.value = profile
    ElMessage.success('风格分析完成！')
  } catch (error) {
    ElMessage.error('风格分析失败: ' + error.message)
    currentStep.value = 0
  } finally {
    isAnalyzing.value = false
  }
}

const startImitation = async () => {
  if (!imitationForm.value.theme) {
    ElMessage.warning('请输入创作主题')
    return
  }

  if (!novelStore.isApiConfigured) {
    ElMessage.warning('请先配置API密钥')
    return
  }

  isGenerating.value = true
  generatedText.value = ''
  progressPercent.value = 0
  progressMessage.value = '正在构建风格仿写Prompt...'

  try {
    // 构建仿写Prompt
    const userRequest = `主题：${imitationForm.value.theme}，目标字数：${imitationForm.value.wordCount}字${imitationForm.value.extra ? '，附加要求：' + imitationForm.value.extra : ''}`
    const prompt = buildImitationPrompt(styleProfile.value, userRequest)

    progressPercent.value = 20
    progressMessage.value = 'AI正在基于风格特征创作原创内容...'

    // 流式生成
    const result = await novelStore.generateContent(prompt, (chunk) => {
      generatedText.value += chunk
      progressPercent.value = Math.min(90, 20 + (generatedText.value.length / imitationForm.value.wordCount) * 70)
      progressMessage.value = `正在创作... 已生成 ${generatedText.value.length} 字`
    })

    generatedText.value = result
    progressPercent.value = 100
    progressMessage.value = '创作完成！'

    ElMessage.success('原创仿写完成！')
  } catch (error) {
    ElMessage.error('仿写失败: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

const copyResult = () => {
  const text = generatedText.value.replace(/<[^>]*>/g, '')
  navigator.clipboard.writeText(text)
  ElMessage.success('内容已复制到剪贴板')
}

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text)
}
</script>

<style scoped>
.style-imitation {
  max-width: 1000px;
  margin: 0 auto;
}

.step-panel {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

/* 上传区域 */
.upload-area {
  margin-bottom: 20px;
}

.upload-area :deep(.el-upload-dragger) {
  padding: 40px 20px;
}

.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
}

.text-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}

/* 风格报告 */
.style-report {
  max-height: 600px;
  overflow-y: auto;
}

.report-section {
  margin-bottom: 24px;
}

.report-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.report-section.highlight {
  background: #f0f9eb;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e1f3d8;
}

.report-section.highlight h3 {
  border-bottom-color: #67c23a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.info-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.style-summary {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  margin: 0;
}

/* 分析中状态 */
.analyzing-state {
  text-align: center;
  padding: 60px 20px;
}

.analyzing-state p {
  margin: 16px 0 4px;
  font-size: 16px;
  color: #303133;
}

.analyzing-state .sub-text {
  font-size: 13px;
  color: #909399;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 生成进度 */
.generating-state {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.progress-bar {
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 3px;
  transition: width 0.3s;
}

.generating-state p {
  text-align: center;
  font-size: 14px;
  color: #409eff;
  margin: 0;
}

/* 生成结果 */
.result-section {
  margin-bottom: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-content {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.content-text {
  font-size: 15px;
  line-height: 2;
  color: #303133;
}

.content-text :deep(p) {
  margin: 12px 0;
  text-indent: 2em;
}

.result-footer {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}

/* 操作按钮 */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

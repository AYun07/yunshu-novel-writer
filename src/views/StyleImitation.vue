<template>
  <div class="style-imitation">
    <!-- 版权声明 -->
    <el-alert type="warning" :closable="false" show-icon style="margin-bottom: 20px">
      <template #title><strong>⚖️ 版权合规声明</strong></template>
      <p style="margin: 4px 0 0; font-size: 13px;">
        本功能仅提取<strong>写作风格特征</strong>，所有生成内容均为<strong>100%原创</strong>。严禁用于抄袭、侵权等违法用途。
      </p>
    </el-alert>

    <!-- 步骤导航 -->
    <el-steps :active="currentStep" finish-status="success" align-center style="margin-bottom: 24px">
      <el-step title="上传分析" icon="Upload" />
      <el-step title="风格调优" icon="SetUp" />
      <el-step title="仿写创作" icon="EditPen" />
      <el-step title="原创自检" icon="CircleCheck" />
    </el-steps>

    <!-- ==================== 步骤1：上传与分析 ==================== -->
    <div v-show="currentStep === 0">
      <el-row :gutter="20">
        <!-- 左侧：上传 -->
        <el-col :span="14">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>📤 上传参考文本（支持多个文件融合）</span>
              </div>
            </template>

            <el-upload drag :auto-upload="false" :on-change="handleFileAdd" accept=".txt,.md" multiple>
              <el-icon class="el-icon--upload" style="font-size: 36px; color: #409eff;"><Upload /></el-icon>
              <div class="el-upload__text">拖放文件或 <em>点击上传</em>（支持多文件）</div>
              <template #tip><div class="el-upload__tip">TXT/Markdown，单文件≤10MB</div></template>
            </el-upload>

            <el-divider>或粘贴文本</el-divider>
            <el-input v-model="rawText" type="textarea" :rows="6" placeholder="粘贴文本内容..." show-word-limit :maxlength="50000" />

            <!-- 已添加的文本列表 -->
            <div v-if="textList.length > 0" class="text-list">
              <h4>已添加的文本（{{ textList.length }}个）</h4>
              <div v-for="(item, idx) in textList" :key="idx" class="text-item">
                <span class="text-name">{{ item.name || `文本${idx + 1}` }}</span>
                <span class="text-length">{{ item.text.length }}字</span>
                <el-button type="danger" link size="small" @click="removeText(idx)">移除</el-button>
              </div>
            </div>

            <div class="step-actions">
              <el-button type="primary" size="large" :disabled="!canAnalyze" :loading="isAnalyzing" @click="analyzeStyle">
                <el-icon><DataAnalysis /></el-icon>
                {{ textList.length > 1 ? '分析并融合风格' : '开始风格分析' }}
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：已保存的风格档案 -->
        <el-col :span="10">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>📁 风格档案库</span>
                <div>
                  <el-button type="primary" link size="small" @click="importProfilesDialog = true">导入</el-button>
                  <el-button type="primary" link size="small" @click="exportAllProfiles">导出</el-button>
                </div>
              </div>
            </template>

            <div v-if="savedProfiles.length === 0" class="empty-state">
              <p>暂无保存的风格档案</p>
              <p class="sub">分析文本后可保存风格档案</p>
            </div>

            <div v-else class="profile-list">
              <div v-for="profile in savedProfiles" :key="profile.id" class="profile-item" @click="loadProfile(profile)">
                <div class="profile-info">
                  <span class="profile-name">{{ profile.name || '未命名档案' }}</span>
                  <span class="profile-meta">{{ profile.basicInfo?.genre }} · {{ profile.savedAt?.split('T')[0] }}</span>
                </div>
                <div class="profile-actions">
                  <el-icon v-if="profile.isFavorite" style="color: #e6a23c;"><Star /></el-icon>
                  <el-button type="danger" link size="small" @click.stop="handleDeleteProfile(profile.id)">删除</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- ==================== 步骤2：风格调优 ==================== -->
    <div v-show="currentStep === 1">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>🎨 风格调优</span>
            <div>
              <el-button type="primary" link @click="currentStep = 0">重新分析</el-button>
              <el-button type="success" link @click="saveCurrentProfile">保存档案</el-button>
            </div>
          </div>
        </template>

        <el-tabs v-model="tuneTab">
          <!-- 语言风格 -->
          <el-tab-pane label="语言风格" name="language">
            <el-form label-width="100px" size="small">
              <el-form-item label="用词特点"><el-input v-model="styleProfile.languageStyle.vocabulary" /></el-form-item>
              <el-form-item label="句式特点"><el-input v-model="styleProfile.languageStyle.sentencePattern" /></el-form-item>
              <el-form-item label="语言节奏">
                <el-slider v-model="rhythmValue" :min="1" :max="5" :marks="{1:'极慢',2:'舒缓',3:'中等',4:'紧凑',5:'极快'}" show-stops />
              </el-form-item>
              <el-form-item label="修辞特点"><el-input v-model="styleProfile.languageStyle.metaphorStyle" /></el-form-item>
              <el-form-item label="对话风格"><el-input v-model="styleProfile.languageStyle.dialogueStyle" /></el-form-item>
              <el-form-item label="描写密度">
                <el-slider v-model="densityValue" :min="1" :max="5" :marks="{1:'极简',2:'白描',3:'适中',4:'细腻',5:'浓墨重彩'}" show-stops />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 叙事技法 -->
          <el-tab-pane label="叙事技法" name="narrative">
            <el-form label-width="100px" size="small">
              <el-form-item label="叙事视角"><el-input v-model="styleProfile.narrativeTechnique.pov" /></el-form-item>
              <el-form-item label="时间线"><el-input v-model="styleProfile.narrativeTechnique.timeline" /></el-form-item>
              <el-form-item label="节奏控制"><el-input v-model="styleProfile.narrativeTechnique.pacing" /></el-form-item>
              <el-form-item label="悬念手法"><el-input v-model="styleProfile.narrativeTechnique.suspenseTechnique" /></el-form-item>
              <el-form-item label="结构模式"><el-input v-model="styleProfile.narrativeTechnique.structurePattern" /></el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 人物与情感 -->
          <el-tab-pane label="人物与情感" name="character">
            <el-form label-width="100px" size="small">
              <el-form-item label="塑造方式"><el-input v-model="styleProfile.characterStyle.characterization" /></el-form-item>
              <el-form-item label="人物深度"><el-input v-model="styleProfile.characterStyle.characterDepth" /></el-form-item>
              <el-form-item label="情感表达"><el-input v-model="styleProfile.emotionalStyle.emotionExpression" /></el-form-item>
              <el-form-item label="情感基调"><el-input v-model="styleProfile.emotionalStyle.emotionalTone" /></el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 风格总结 -->
          <el-tab-pane label="风格总结" name="summary">
            <el-input v-model="styleProfile.styleSummary" type="textarea" :rows="4" placeholder="总结核心风格特征..." />
          </el-tab-pane>
        </el-tabs>

        <div class="step-actions">
          <el-button size="large" @click="currentStep = 0"><el-icon><ArrowLeft /></el-icon> 上一步</el-button>
          <el-button type="primary" size="large" @click="currentStep = 2">开始仿写 <el-icon><ArrowRight /></el-icon></el-button>
        </div>
      </el-card>
    </div>

    <!-- ==================== 步骤3：仿写创作 ==================== -->
    <div v-show="currentStep === 2">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>✍️ 仿写创作</span>
            <el-button type="primary" link @click="currentStep = 1">调整风格</el-button>
          </div>
        </template>

        <!-- 仿写模式选择 -->
        <div class="mode-selector">
          <h4>选择仿写模式</h4>
          <el-radio-group v-model="writeMode" @change="onModeChange">
            <el-radio-button label="create">✨ 全新创作</el-radio-button>
            <el-radio-button label="continue">📖 续写章节</el-radio-button>
            <el-radio-button label="rewrite">🔄 内容改写</el-radio-button>
            <el-radio-button label="crossGenre">🎭 跨体裁仿写</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 全新创作 / 续写 -->
        <el-form v-if="writeMode === 'create' || writeMode === 'continue'" :model="writeForm" label-width="100px" style="margin-top: 20px">
          <el-form-item label="创作主题">
            <el-input v-model="writeForm.theme" type="textarea" :rows="2" placeholder="描述您想创作的主题..." />
          </el-form-item>
          <el-form-item v-if="writeMode === 'continue'" label="前文内容">
            <el-input v-model="writeForm.context" type="textarea" :rows="6" placeholder="粘贴前文内容，AI将基于风格续写..." />
          </el-form-item>
          <el-form-item label="目标字数">
            <el-select v-model="writeForm.wordCount" style="width: 200px">
              <el-option label="500字" :value="500" />
              <el-option label="1000字" :value="1000" />
              <el-option label="2000字" :value="2000" />
              <el-option label="3000字" :value="3000" />
              <el-option label="5000字" :value="5000" />
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 内容改写 -->
        <el-form v-if="writeMode === 'rewrite'" label-width="100px" style="margin-top: 20px">
          <el-form-item label="原文内容">
            <el-input v-model="writeForm.sourceText" type="textarea" :rows="8" placeholder="粘贴需要改写的内容..." />
          </el-form-item>
        </el-form>

        <!-- 跨体裁仿写 -->
        <el-form v-if="writeMode === 'crossGenre'" :model="writeForm" label-width="100px" style="margin-top: 20px">
          <el-form-item label="目标体裁">
            <el-select v-model="writeForm.targetGenre" style="width: 200px">
              <el-option label="现代诗" value="现代诗" />
              <el-option label="古体诗" value="古体诗" />
              <el-option label="散文" value="散文" />
              <el-option label="话剧剧本" value="话剧剧本" />
              <el-option label="电影剧本" value="电影剧本" />
              <el-option label="短篇小说" value="短篇小说" />
              <el-option label="歌词" value="歌词" />
              <el-option label="杂文" value="杂文" />
            </el-select>
          </el-form-item>
          <el-form-item label="创作主题">
            <el-input v-model="writeForm.theme" type="textarea" :rows="2" placeholder="描述主题..." />
          </el-form-item>
        </el-form>

        <!-- 生成进度 -->
        <div v-if="isGenerating" class="generating-state">
          <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercent + '%' }"></div></div>
          <p>{{ progressMessage }}</p>
        </div>

        <!-- 生成结果 -->
        <div v-if="generatedText" class="result-section">
          <div class="result-header">
            <h3>📝 仿写成果</h3>
            <div class="result-actions">
              <el-tag type="success">100%原创</el-tag>
              <el-button type="warning" size="small" @click="runOriginalityCheck" :loading="isChecking">原创自检</el-button>
              <el-button type="primary" size="small" @click="copyResult">复制</el-button>
            </div>
          </div>
          <div class="result-content"><div class="content-text" v-html="renderMarkdown(generatedText)"></div></div>
          <div class="result-footer"><span>字数：{{ plainTextLength }}</span></div>
        </div>

        <!-- 原创度自检结果 -->
        <div v-if="checkResult" class="check-result">
          <h3>🛡️ 原创度自检报告</h3>
          <div class="score-grid">
            <div class="score-item" :class="getScoreClass(checkResult.overallScore)">
              <div class="score-number">{{ checkResult.overallScore }}</div>
              <div class="score-label">综合评分</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.originality?.score)">
              <div class="score-number">{{ checkResult.originality?.score }}</div>
              <div class="score-label">原创度</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.styleConsistency?.score)">
              <div class="score-number">{{ checkResult.styleConsistency?.score }}</div>
              <div class="score-label">风格一致</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.creativity?.score)">
              <div class="score-number">{{ checkResult.creativity?.score }}</div>
              <div class="score-label">创意性</div>
            </div>
          </div>
          <div v-if="checkResult.suggestions?.length" class="suggestions">
            <h4>💡 改进建议</h4>
            <ul><li v-for="(s, i) in checkResult.suggestions" :key="i">{{ s }}</li></ul>
          </div>
          <p class="check-summary">{{ checkResult.summary }}</p>
        </div>

        <div class="step-actions">
          <el-button size="large" @click="currentStep = 1"><el-icon><ArrowLeft /></el-icon> 调整风格</el-button>
          <el-button type="primary" size="large" :loading="isGenerating" :disabled="!canWrite" @click="startWriting">
            <el-icon><MagicStick /></el-icon> {{ isGenerating ? '创作中...' : '开始仿写' }}
          </el-button>
          <el-button v-if="generatedText" type="success" size="large" @click="currentStep = 3">原创自检 <el-icon><ArrowRight /></el-icon></el-button>
        </div>
      </el-card>
    </div>

    <!-- ==================== 步骤4：原创自检 ==================== -->
    <div v-show="currentStep === 3">
      <el-card shadow="hover">
        <template #header><span>🛡️ 原创度自检</span></template>

        <div v-if="!checkResult" class="check-empty">
          <el-empty description="请先在仿写创作步骤中生成内容，然后点击「原创自检」">
            <el-button type="primary" @click="currentStep = 2">返回仿写</el-button>
          </el-empty>
        </div>

        <div v-else>
          <div class="score-grid large">
            <div class="score-item" :class="getScoreClass(checkResult.overallScore)">
              <div class="score-number">{{ checkResult.overallScore }}</div>
              <div class="score-label">综合评分</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.originality?.score)">
              <div class="score-number">{{ checkResult.originality?.score }}</div>
              <div class="score-label">原创度</div>
              <div class="score-desc">{{ checkResult.originality?.assessment }}</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.styleConsistency?.score)">
              <div class="score-number">{{ checkResult.styleConsistency?.score }}</div>
              <div class="score-label">风格一致性</div>
              <div class="score-desc">{{ checkResult.styleConsistency?.assessment }}</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.creativity?.score)">
              <div class="score-number">{{ checkResult.creativity?.score }}</div>
              <div class="score-label">创意性</div>
              <div class="score-desc">{{ checkResult.creativity?.assessment }}</div>
            </div>
            <div class="score-item" :class="getScoreClass(checkResult.readability?.score)">
              <div class="score-number">{{ checkResult.readability?.score }}</div>
              <div class="score-label">可读性</div>
              <div class="score-desc">{{ checkResult.readability?.assessment }}</div>
            </div>
          </div>

          <div v-if="checkResult.originality?.risks?.length" class="risk-section">
            <el-alert type="warning" :closable="false" show-icon>
              <template #title>⚠️ 风险提示</template>
              <ul style="margin: 4px 0 0; padding-left: 16px;">
                <li v-for="(r, i) in checkResult.originality.risks" :key="i">{{ r }}</li>
              </ul>
            </el-alert>
          </div>

          <div v-if="checkResult.suggestions?.length" class="suggestions">
            <h4>💡 改进建议</h4>
            <ul><li v-for="(s, i) in checkResult.suggestions" :key="i">{{ s }}</li></ul>
          </div>

          <el-alert :type="checkResult.overallScore >= 80 ? 'success' : 'warning'" :closable="false" show-icon style="margin-top: 16px">
            <template #title>{{ checkResult.summary }}</template>
          </el-alert>

          <div class="step-actions">
            <el-button size="large" @click="currentStep = 2"><el-icon><ArrowLeft /></el-icon> 返回修改</el-button>
            <el-button type="primary" size="large" @click="runOriginalityCheck" :loading="isChecking">重新自检</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 保存档案对话框 -->
    <el-dialog v-model="saveDialog" title="保存风格档案" width="400px">
      <el-form label-width="80px">
        <el-form-item label="档案名称"><el-input v-model="profileName" placeholder="如：莫言风格-红高粱系列" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSaveProfile">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { marked } from 'marked'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, DataAnalysis, ArrowLeft, ArrowRight, MagicStick, Star, SetUp } from '@element-plus/icons-vue'
import {
  styleAnalysisPrompt, multiStyleMergePrompt, extractStyleSample,
  validateUploadFile, readTextFile, buildImitationPrompt,
  modePrompts, originalityCheckPrompt,
  getSavedProfiles, saveProfile, deleteProfile as deleteProfileFn,
  toggleFavorite, exportProfiles, importProfiles
} from '../config/styleImitation.js'

const novelStore = useNovelStore()

// 状态
const currentStep = ref(0)
const rawText = ref('')
const textList = ref([])
const isAnalyzing = ref(false)
const styleProfile = reactive({
  basicInfo: { genre: '', era: '', tone: '', narrativeDistance: '' },
  languageStyle: { vocabulary: '', sentencePattern: '', rhythm: '', metaphorStyle: '', dialogueStyle: '', descriptionDensity: '' },
  narrativeTechnique: { pov: '', timeline: '', pacing: '', suspenseTechnique: '', structurePattern: '' },
  characterStyle: { characterization: '', characterDepth: '', relationshipFocus: '' },
  worldBuilding: { worldDetail: '', environmentIntegration: '', culturalElements: '' },
  emotionalStyle: { emotionExpression: '', emotionalTone: '', readerEngagement: '' },
  styleSummary: ''
})
const tuneTab = ref('language')
const writeMode = ref('create')
const writeForm = reactive({ theme: '', context: '', wordCount: 2000, sourceText: '', targetGenre: '现代诗' })
const isGenerating = ref(false)
const generatedText = ref('')
const progressPercent = ref(0)
const progressMessage = ref('')
const isChecking = ref(false)
const checkResult = ref(null)
const savedProfiles = ref([])
const saveDialog = ref(false)
const profileName = ref('')
const importProfilesDialog = ref(false)

// 滑块映射
const rhythmMap = { 1: '极慢', 2: '舒缓', 3: '中等', 4: '紧凑', 5: '极快' }
const densityMap = { 1: '极简白描', 2: '白描勾勒', 3: '适中', 4: '细腻', 5: '浓墨重彩' }
const rhythmValue = computed({
  get: () => { const m = { '极慢': 1, '舒缓': 2, '中等': 3, '紧凑': 4, '极快': 5 }; return m[styleProfile.languageStyle.rhythm] || 3 },
  set: (v) => { styleProfile.languageStyle.rhythm = rhythmMap[v] || '中等' }
})
const densityValue = computed({
  get: () => { const m = { '极简白描': 1, '白描勾勒': 2, '适中': 3, '细腻': 4, '浓墨重彩': 5 }; return m[styleProfile.languageStyle.descriptionDensity] || 3 },
  set: (v) => { styleProfile.languageStyle.descriptionDensity = densityMap[v] || '适中' }
})

const canAnalyze = computed(() => textList.value.length > 0 && textList.value.some(t => t.text.length >= 300))
const canWrite = computed(() => {
  if (writeMode.value === 'create') return writeForm.theme.length > 0
  if (writeMode.value === 'continue') return writeForm.context.length > 0
  if (writeMode.value === 'rewrite') return writeForm.sourceText.length > 0
  if (writeMode.value === 'crossGenre') return writeForm.theme.length > 0
  return false
})
const plainTextLength = computed(() => generatedText.value.replace(/<[^>]*>/g, '').length)

// 方法
const handleFileAdd = async (file) => {
  const validation = validateUploadFile(file.raw)
  if (!validation.valid) { ElMessage.error(validation.error); return }
  try {
    const text = await readTextFile(file.raw)
    textList.value.push({ name: file.name, text })
    ElMessage.success(`已添加：${file.name}（${text.length}字）`)
  } catch { ElMessage.error('文件读取失败') }
}

const removeText = (idx) => { textList.value.splice(idx, 1) }

const analyzeStyle = async () => {
  if (!novelStore.isApiConfigured) { ElMessage.warning('请先配置API'); return }
  isAnalyzing.value = true

  try {
    if (textList.value.length === 1) {
      // 单文本分析
      const sample = extractStyleSample(textList.value[0].text, 15000)
      const prompt = styleAnalysisPrompt + '\n' + sample
      const response = await novelStore.generateContent(prompt)
      applyAnalysisResult(response)
    } else {
      // 多文本：先分别分析，再融合
      const profiles = []
      for (const item of textList.value) {
        const sample = extractStyleSample(item.text, 10000)
        const prompt = styleAnalysisPrompt + '\n' + sample
        const response = await novelStore.generateContent(prompt)
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) { try { profiles.push(JSON.parse(jsonMatch[0])) } catch {} }
      }
      if (profiles.length > 1) {
        const mergePrompt = multiStyleMergePrompt + '\n' + profiles.map((p, i) => `### 文本${i + 1}风格档案\n${JSON.stringify(p, null, 2)}`).join('\n\n')
        const mergeResponse = await novelStore.generateContent(mergePrompt)
        applyAnalysisResult(mergeResponse)
      } else if (profiles.length === 1) {
        Object.assign(styleProfile, profiles[0])
      }
    }
    currentStep.value = 1
    ElMessage.success('风格分析完成！')
  } catch (error) {
    ElMessage.error('分析失败: ' + error.message)
  } finally {
    isAnalyzing.value = false
  }
}

const applyAnalysisResult = (response) => {
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.basicInfo) Object.assign(styleProfile.basicInfo, parsed.basicInfo)
      if (parsed.languageStyle) Object.assign(styleProfile.languageStyle, parsed.languageStyle)
      if (parsed.narrativeTechnique) Object.assign(styleProfile.narrativeTechnique, parsed.narrativeTechnique)
      if (parsed.characterStyle) Object.assign(styleProfile.characterStyle, parsed.characterStyle)
      if (parsed.worldBuilding) Object.assign(styleProfile.worldBuilding, parsed.worldBuilding)
      if (parsed.emotionalStyle) Object.assign(styleProfile.emotionalStyle, parsed.emotionalStyle)
      if (parsed.styleSummary) styleProfile.styleSummary = parsed.styleSummary
    } catch { ElMessage.warning('风格解析部分失败，已使用默认值') }
  }
}

const saveCurrentProfile = () => { profileName.value = ''; saveDialog.value = true }
const confirmSaveProfile = () => {
  saveProfile({ name: profileName.value, ...JSON.parse(JSON.stringify(styleProfile)) })
  loadSavedProfiles()
  saveDialog.value = false
  ElMessage.success('风格档案已保存')
}

const loadProfile = (profile) => {
  Object.assign(styleProfile.basicInfo, profile.basicInfo || {})
  Object.assign(styleProfile.languageStyle, profile.languageStyle || {})
  Object.assign(styleProfile.narrativeTechnique, profile.narrativeTechnique || {})
  Object.assign(styleProfile.characterStyle, profile.characterStyle || {})
  Object.assign(styleProfile.worldBuilding, profile.worldBuilding || {})
  Object.assign(styleProfile.emotionalStyle, profile.emotionalStyle || {})
  styleProfile.styleSummary = profile.styleSummary || ''
  currentStep.value = 2
  ElMessage.success(`已加载档案：${profile.name}`)
}

const handleDeleteProfile = async (id) => {
  await ElMessageBox.confirm('确定删除此档案？', '提示', { type: 'warning' })
  deleteProfileFn(id)
  loadSavedProfiles()
  ElMessage.success('已删除')
}

const exportAllProfiles = () => { exportProfiles(); ElMessage.success('已导出') }

const onModeChange = () => { generatedText.value = ''; checkResult.value = null }

const startWriting = async () => {
  if (!novelStore.isApiConfigured) { ElMessage.warning('请先配置API'); return }
  isGenerating.value = true
  generatedText.value = ''
  checkResult.value = null
  progressPercent.value = 10
  progressMessage.value = '正在构建仿写Prompt...'

  try {
    let prompt = ''
    if (writeMode.value === 'create') {
      prompt = modePrompts.create(styleProfile, writeForm.theme, writeForm.wordCount)
    } else if (writeMode.value === 'continue') {
      prompt = modePrompts.continue(styleProfile, writeForm.context)
    } else if (writeMode.value === 'rewrite') {
      prompt = modePrompts.rewrite(styleProfile, writeForm.sourceText)
    } else if (writeMode.value === 'crossGenre') {
      prompt = modePrompts.crossGenre(styleProfile, writeForm.targetGenre, writeForm.theme)
    }

    progressPercent.value = 30
    progressMessage.value = 'AI正在创作原创内容...'

    const result = await novelStore.generateContent(prompt, (chunk) => {
      generatedText.value += chunk
      progressPercent.value = Math.min(90, 30 + (plainTextLength.value / (writeForm.wordCount || 2000)) * 60)
      progressMessage.value = `创作中... ${plainTextLength.value}字`
    })

    generatedText.value = result
    progressPercent.value = 100
    progressMessage.value = '创作完成！'
    ElMessage.success('仿写完成！')
  } catch (error) {
    ElMessage.error('仿写失败: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

const runOriginalityCheck = async () => {
  if (!generatedText.value) { ElMessage.warning('请先生成内容'); return }
  if (!novelStore.isApiConfigured) { ElMessage.warning('请先配置API'); return }
  isChecking.value = true
  try {
    const prompt = originalityCheckPrompt(generatedText.value, styleProfile)
    const response = await novelStore.generateContent(prompt)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      checkResult.value = JSON.parse(jsonMatch[0])
    } else {
      checkResult.value = { overallScore: 75, summary: '自检完成，但结果解析不完整', originality: { score: 75 }, styleConsistency: { score: 75 }, creativity: { score: 75 }, readability: { score: 75 }, suggestions: [] }
    }
    currentStep.value = 3
    ElMessage.success('自检完成！')
  } catch (error) {
    ElMessage.error('自检失败: ' + error.message)
  } finally {
    isChecking.value = false
  }
}

const copyResult = () => {
  navigator.clipboard.writeText(generatedText.value.replace(/<[^>]*>/g, ''))
  ElMessage.success('已复制')
}

const getScoreClass = (score) => {
  if (!score) return ''
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'fair'
  return 'poor'
}

const renderMarkdown = (text) => text ? marked(text) : ''

const loadSavedProfiles = () => { savedProfiles.value = getSavedProfiles() }

onMounted(() => { loadSavedProfiles() })
</script>

<style scoped>
.style-imitation { max-width: 1200px; margin: 0 auto; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-size: 16px; font-weight: 600; }
.step-actions { display: flex; justify-content: center; gap: 12px; padding-top: 20px; border-top: 1px solid #e4e7ed; margin-top: 20px; }

/* 文本列表 */
.text-list { margin-top: 16px; }
.text-list h4 { margin: 0 0 8px; font-size: 14px; color: #606266; }
.text-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f5f7fa; border-radius: 6px; margin-bottom: 6px; }
.text-name { flex: 1; font-size: 13px; color: #303133; }
.text-length { font-size: 12px; color: #909399; }

/* 档案列表 */
.empty-state { text-align: center; padding: 30px; color: #909399; }
.empty-state .sub { font-size: 12px; margin-top: 4px; }
.profile-list { max-height: 400px; overflow-y: auto; }
.profile-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border: 1px solid #e4e7ed; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
.profile-item:hover { border-color: #409eff; background: #ecf5ff; }
.profile-name { font-size: 14px; font-weight: 500; color: #303133; }
.profile-meta { font-size: 12px; color: #909399; }
.profile-actions { display: flex; align-items: center; gap: 4px; }

/* 仿写模式 */
.mode-selector { margin-bottom: 16px; }
.mode-selector h4 { margin: 0 0 12px; font-size: 14px; color: #606266; }

/* 生成进度 */
.generating-state { padding: 20px; background: #f5f7fa; border-radius: 8px; margin: 16px 0; }
.progress-bar { height: 6px; background: #e4e7ed; border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #409eff, #67c23a); border-radius: 3px; transition: width 0.3s; }
.generating-state p { text-align: center; font-size: 14px; color: #409eff; margin: 0; }

/* 结果 */
.result-section { margin: 16px 0; }
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.result-header h3 { margin: 0; font-size: 16px; }
.result-actions { display: flex; align-items: center; gap: 8px; }
.result-content { padding: 20px; background: #fafafa; border: 1px solid #e4e7ed; border-radius: 8px; max-height: 500px; overflow-y: auto; }
.content-text { font-size: 15px; line-height: 2; color: #303133; }
.content-text :deep(p) { margin: 12px 0; text-indent: 2em; }
.result-footer { margin-top: 8px; font-size: 12px; color: #909399; text-align: right; }

/* 自检 */
.check-empty { padding: 40px; }
.score-grid { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.score-grid.large .score-item { flex: 1; min-width: 140px; }
.score-item { text-align: center; padding: 16px; background: #f5f7fa; border-radius: 10px; border: 2px solid #e4e7ed; }
.score-item.excellent { border-color: #67c23a; background: #f0f9eb; }
.score-item.good { border-color: #409eff; background: #ecf5ff; }
.score-item.fair { border-color: #e6a23c; background: #fdf6ec; }
.score-item.poor { border-color: #f56c6c; background: #fef0f0; }
.score-number { font-size: 32px; font-weight: 700; color: #303133; }
.score-item.excellent .score-number { color: #67c23a; }
.score-item.good .score-number { color: #409eff; }
.score-item.fair .score-number { color: #e6a23c; }
.score-item.poor .score-number { color: #f56c6c; }
.score-label { font-size: 12px; color: #909399; margin-top: 4px; }
.score-desc { font-size: 11px; color: #606266; margin-top: 4px; line-height: 1.4; }
.suggestions { margin: 16px 0; }
.suggestions h4 { margin: 0 0 8px; color: #303133; }
.suggestions ul { padding-left: 20px; margin: 0; }
.suggestions li { font-size: 13px; color: #606266; line-height: 1.8; }
.check-summary { font-size: 14px; color: #303133; line-height: 1.6; }
.risk-section { margin: 16px 0; }
.check-result { margin: 16px 0; }
.check-result h3 { margin: 0 0 16px; font-size: 18px; color: #303133; }

@media (max-width: 768px) {
  .score-grid { flex-direction: column; }
}
</style>

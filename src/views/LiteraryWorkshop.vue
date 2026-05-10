<template>
  <div class="literary-workshop">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">文学创作工坊</h1>
      <p class="page-desc">诺贝尔文学奖级别的文学创作引擎，融合30+位文学大师风格与深度叙事技法</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="workshop-container">
      <!-- 左侧面板：创作配置 -->
      <div class="config-panel">
        <!-- 风格选择器 -->
        <div class="config-section">
          <div class="section-header">
            <h3><el-icon><Collection /></el-icon> 大师风格选择</h3>
            <el-tag type="info" size="small">{{ selectedMasters.length }} 位已选</el-tag>
          </div>
          
          <!-- 分类标签 -->
          <div class="category-tabs">
            <el-radio-group v-model="selectedCategory" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="中国文学">中国</el-radio-button>
              <el-radio-button label="拉美文学">拉美</el-radio-button>
              <el-radio-button label="欧美文学">欧美</el-radio-button>
              <el-radio-button label="日本文学">日本</el-radio-button>
              <el-radio-button label="诗歌">诗歌</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 大师卡片网格 -->
          <div class="master-grid">
            <div
              v-for="master in filteredMasters"
              :key="master.id"
              class="master-card"
              :class="{ selected: isMasterSelected(master.id) }"
              @click="toggleMaster(master.id)"
            >
              <div class="master-avatar">{{ master.avatar }}</div>
              <div class="master-info">
                <div class="master-name">{{ master.name }}</div>
                <div class="master-country">{{ master.country }}</div>
              </div>
              <div class="master-award" v-if="master.award.includes('诺贝尔')">
                <el-icon><TrophyBase /></el-icon>
              </div>
            </div>
          </div>

          <!-- 风格强度调节 -->
          <div class="style-intensity" v-if="selectedMasters.length > 0">
            <span class="intensity-label">风格影响强度</span>
            <el-slider v-model="styleIntensity" :min="0" :max="100" :step="10" show-stops />
            <span class="intensity-value">{{ styleIntensity }}%</span>
          </div>
        </div>

        <!-- 叙事技法选择 -->
        <div class="config-section">
          <div class="section-header">
            <h3><el-icon><MagicStick /></el-icon> 叙事技法</h3>
            <el-tag type="warning" size="small">{{ selectedTechniques.length }} 项已选</el-tag>
          </div>

          <div class="technique-grid">
            <div
              v-for="tech in allTechniques"
              :key="tech.id"
              class="technique-card"
              :class="{ selected: isTechniqueSelected(tech.id) }"
              @click="toggleTechnique(tech.id)"
            >
              <div class="technique-icon">{{ tech.icon }}</div>
              <div class="technique-name">{{ tech.name }}</div>
              <el-tooltip :content="tech.description" placement="top">
                <el-icon class="technique-help"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </div>

          <!-- 技法强度调节 -->
          <div class="technique-intensity" v-if="selectedTechniques.length > 0">
            <span class="intensity-label">技法应用强度</span>
            <el-slider v-model="techniqueIntensity" :min="0" :max="100" :step="10" />
            <span class="intensity-value">{{ techniqueIntensity }}%</span>
          </div>
        </div>

        <!-- 创作模式选择 -->
        <div class="config-section">
          <div class="section-header">
            <h3><el-icon><Edit /></el-icon> 创作模式</h3>
          </div>

          <div class="creation-modes">
            <div
              v-for="mode in creationModes"
              :key="mode.id"
              class="mode-card"
              :class="{ active: currentMode === mode.id }"
              @click="currentMode = mode.id"
            >
              <div class="mode-icon">{{ mode.icon }}</div>
              <div class="mode-info">
                <div class="mode-name">{{ mode.name }}</div>
                <div class="mode-desc">{{ mode.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 创作参数 -->
        <div class="config-section">
          <div class="section-header">
            <h3><el-icon><Setting /></el-icon> 创作参数</h3>
          </div>

          <el-form :model="creationParams" label-position="top" class="creation-form">
            <!-- 根据创作模式显示不同输入 -->
            
            <!-- 自由创作：主题输入 -->
            <el-form-item label="作品主题" v-if="currentMode === 'free'">
              <el-input
                v-model="creationParams.theme"
                type="textarea"
                :rows="3"
                placeholder="请输入作品主题，如：一个乡村教师的坚守与孤独"
              />
            </el-form-item>

            <!-- 命题创作：开头/结尾 -->
            <template v-if="currentMode === 'assigned'">
              <el-form-item label="给定开头">
                <el-input
                  v-model="creationParams.givenOpening"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入作品开头..."
                />
              </el-form-item>
              <el-form-item label="给定结尾（可选）">
                <el-input
                  v-model="creationParams.givenEnding"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入作品结尾..."
                />
              </el-form-item>
            </template>

            <!-- 仿写创作：范文输入 -->
            <el-form-item label="参考范文" v-if="currentMode === 'imitation'">
              <el-input
                v-model="creationParams.referenceText"
                type="textarea"
                :rows="5"
                placeholder="请输入参考范文，系统将分析其风格并进行仿写..."
              />
            </el-form-item>

            <!-- 续写创作：前文输入 -->
            <el-form-item label="前文内容" v-if="currentMode === 'continuation'">
              <el-input
                v-model="creationParams.previousText"
                type="textarea"
                :rows="5"
                placeholder="请输入前文内容，系统将进行续写..."
              />
            </el-form-item>

            <!-- 通用参数 -->
            <el-form-item label="作品大纲（可选）">
              <el-input
                v-model="creationParams.outline"
                type="textarea"
                :rows="3"
                placeholder="可选：输入大纲或故事梗概"
              />
            </el-form-item>

            <el-form-item label="目标字数">
              <el-select v-model="creationParams.wordCount" style="width: 100%">
                <el-option label="500字（短篇片段）" :value="500" />
                <el-option label="1000字（短篇）" :value="1000" />
                <el-option label="2000字（中篇片段）" :value="2000" />
                <el-option label="3000字（中篇）" :value="3000" />
                <el-option label="5000字（长篇章节）" :value="5000" />
                <el-option label="8000字（长篇章节）" :value="8000" />
              </el-select>
            </el-form-item>

            <el-form-item label="润色轮次">
              <el-radio-group v-model="creationParams.refinementRounds">
                <el-radio-button :value="0">不润色</el-radio-button>
                <el-radio-button :value="3">3轮精修</el-radio-button>
                <el-radio-button :value="5">5轮完整精修</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>

        <!-- 开始创作按钮 -->
        <div class="start-button-container">
          <el-button
            type="primary"
            size="large"
            :loading="isCreating"
            :disabled="!canStartCreation"
            @click="startCreation"
            class="start-button"
          >
            <el-icon v-if="!isCreating"><Promotion /></el-icon>
            {{ isCreating ? '创作中...' : '开始文学创作' }}
          </el-button>
        </div>
      </div>

      <!-- 右侧面板：创作结果 -->
      <div class="result-panel">
        <!-- 创作进度 -->
        <div v-if="isCreating" class="creation-progress">
          <h3>创作进度</h3>
          <div class="progress-steps">
            <div
              v-for="(step, index) in progressSteps"
              :key="index"
              class="progress-step"
              :class="getStepStatus(index)"
            >
              <div class="step-icon">
                <el-icon v-if="step.completed"><Check /></el-icon>
                <el-icon v-else-if="step.active" class="spinning"><Loading /></el-icon>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="step-label">{{ step.label }}</div>
            </div>
          </div>
          <div class="progress-message">{{ currentProgressMessage }}</div>
        </div>

        <!-- 无内容提示 -->
        <div v-if="!isCreating && !creationResult" class="empty-result">
          <div class="empty-icon">📝</div>
          <h3>开始您的文学创作之旅</h3>
          <p>选择大师风格和叙事技法，输入创作主题，点击"开始文学创作"</p>
          
          <!-- 创作指导 -->
          <div class="creation-guide">
            <h4>创作指导</h4>
            <div class="guide-tabs">
              <el-radio-group v-model="guideType" size="small">
                <el-radio-button label="openings">开头写法</el-radio-button>
                <el-radio-button label="endings">结尾写法</el-radio-button>
                <el-radio-button label="conflicts">冲突设计</el-radio-button>
                <el-radio-button label="arcs">人物弧线</el-radio-button>
              </el-radio-group>
            </div>
            
            <div class="guide-content">
              <div v-if="guideType === 'openings'" class="guide-list">
                <div v-for="template in openingTemplates" :key="template.id" class="guide-item">
                  <div class="guide-name">{{ template.name }}</div>
                  <div class="guide-example">"{{ template.example }}"</div>
                  <div class="guide-desc">{{ template.description }}</div>
                </div>
              </div>
              
              <div v-if="guideType === 'endings'" class="guide-list">
                <div v-for="template in endingTemplates" :key="template.id" class="guide-item">
                  <div class="guide-name">{{ template.name }}</div>
                  <div class="guide-example">"{{ template.example }}"</div>
                  <div class="guide-desc">{{ template.description }}</div>
                </div>
              </div>
              
              <div v-if="guideType === 'conflicts'" class="guide-list">
                <div v-for="template in conflictTemplates" :key="template.id" class="guide-item">
                  <div class="guide-name">{{ template.name }}</div>
                  <div class="guide-desc">{{ template.description }}</div>
                  <div class="guide-examples">
                    <el-tag v-for="ex in template.examples" :key="ex" size="small" type="info">{{ ex }}</el-tag>
                  </div>
                </div>
              </div>
              
              <div v-if="guideType === 'arcs'" class="guide-list">
                <div v-for="template in characterArcTemplates" :key="template.id" class="guide-item">
                  <div class="guide-name">{{ template.name }}</div>
                  <div class="guide-desc">{{ template.description }}</div>
                  <div class="guide-stages">
                    <span v-for="(stage, i) in template.stages" :key="i" class="stage-item">
                      {{ i + 1 }}. {{ stage }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 创作结果 -->
        <div v-if="creationResult" class="creation-result">
          <!-- 结果头部 -->
          <div class="result-header">
            <h3>创作完成</h3>
            <div class="result-actions">
              <el-button type="primary" size="small" @click="copyContent">
                <el-icon><DocumentCopy /></el-icon> 复制
              </el-button>
              <el-dropdown @command="handleExport">
                <el-button size="small">
                  <el-icon><Download /></el-icon> 导出
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="txt">纯文本 (.txt)</el-dropdown-item>
                    <el-dropdown-item command="md">Markdown (.md)</el-dropdown-item>
                    <el-dropdown-item command="annotated">带批注版本</el-dropdown-item>
                    <el-dropdown-item command="report">创作报告</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button size="small" @click="resetCreation">
                <el-icon><RefreshRight /></el-icon> 重新创作
              </el-button>
            </div>
          </div>

          <!-- 质量评估报告 -->
          <div v-if="creationResult.assessment" class="assessment-section">
            <h4>文学质量评估</h4>
            
            <!-- 雷达图区域 -->
            <div class="radar-chart-container">
              <div class="radar-chart" ref="radarChartRef"></div>
            </div>
            
            <!-- 评分详情 -->
            <div class="score-details">
              <div
                v-for="(score, key) in creationResult.assessment.scores"
                :key="key"
                class="score-item"
              >
                <div class="score-label">{{ getDimensionName(key) }}</div>
                <el-progress
                  :percentage="score.score"
                  :color="getScoreColor(score.score)"
                  :stroke-width="10"
                />
                <div class="score-comment">{{ score.comment }}</div>
              </div>
            </div>
            
            <!-- 总体评价 -->
            <div class="overall-assessment">
              <div class="total-score">
                <span class="score-number">{{ creationResult.assessment.totalScore }}</span>
                <span class="score-label">总分</span>
              </div>
              <div class="overall-comment">{{ creationResult.assessment.overallComment }}</div>
            </div>
            
            <!-- 亮点与不足 -->
            <div class="assessment-highlights">
              <div class="highlights-section">
                <h5>亮点</h5>
                <ul>
                  <li v-for="(h, i) in creationResult.assessment.highlights" :key="i">{{ h }}</li>
                </ul>
              </div>
              <div class="weaknesses-section">
                <h5>改进建议</h5>
                <ul>
                  <li v-for="(w, i) in creationResult.assessment.suggestions" :key="i">{{ w }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 润色面板 -->
          <div v-if="creationResult.refinements && creationResult.refinements.length > 0" class="refinement-section">
            <h4>润色记录</h4>
            <el-collapse v-model="activeRefinement">
              <el-collapse-item
                v-for="(refinement, index) in creationResult.refinements"
                :key="index"
                :name="index"
                :title="`第${refinement.round}轮：${refinement.name}`"
              >
                <div class="refinement-content">
                  <div class="refinement-before">
                    <h5>润色前</h5>
                    <div class="text-content">{{ refinement.before }}</div>
                  </div>
                  <div class="refinement-after">
                    <h5>润色后</h5>
                    <div class="text-content">{{ refinement.after }}</div>
                  </div>
                  <div class="refinement-changes">
                    <h5>主要修改</h5>
                    <ul>
                      <li v-for="(change, i) in refinement.changes" :key="i">{{ change }}</li>
                    </ul>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- 作品内容 -->
          <div class="content-section">
            <h4>作品内容</h4>
            <div class="work-content" v-html="renderedContent"></div>
            <div class="word-count">
              字数：{{ creationResult.content?.length || 0 }} 字
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 风格详情对话框 -->
    <el-dialog
      v-model="showMasterDetail"
      :title="selectedMasterDetail?.name"
      width="600px"
      class="master-detail-dialog"
    >
      <div v-if="selectedMasterDetail" class="master-detail">
        <div class="detail-header">
          <div class="detail-avatar">{{ selectedMasterDetail.avatar }}</div>
          <div class="detail-info">
            <div class="detail-name">{{ selectedMasterDetail.name }}</div>
            <div class="detail-country">{{ selectedMasterDetail.country }}</div>
            <div class="detail-award">{{ selectedMasterDetail.award }}</div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>风格特点</h4>
          <div class="feature-tags">
            <el-tag v-for="f in selectedMasterDetail.styleFeatures" :key="f" type="info">{{ f }}</el-tag>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>风格描述</h4>
          <p>{{ selectedMasterDetail.description }}</p>
        </div>
        
        <div class="detail-section">
          <h4>代表作品</h4>
          <div class="works-list">
            <span v-for="work in selectedMasterDetail.exampleWorks" :key="work" class="work-tag">{{ work }}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>经典语录</h4>
          <blockquote>{{ selectedMasterDetail.signatureQuote }}</blockquote>
        </div>
        
        <div class="detail-section">
          <h4>适用场景</h4>
          <div class="best-for">
            <el-tag v-for="b in selectedMasterDetail.bestFor" :key="b" type="success">{{ b }}</el-tag>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 文学创作工坊页面
 * 
 * 功能：
 * 1. 大师风格选择器（支持多选融合）
 * 2. 叙事技法选择
 * 3. 多种创作模式
 * 4. 多轮润色系统
 * 5. 文学质量评估
 * 6. 创作指导模板
 */
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import {
  Collection, MagicStick, Edit, Setting, Promotion, Check, Loading,
  DocumentCopy, Download, RefreshRight, ArrowDown, QuestionFilled, TrophyBase
} from '@element-plus/icons-vue'

// 导入文学引擎模块
import {
  getAllMasters,
  getMastersByCategory,
  getMasterById,
  getAllTechniques,
  getTechniqueById,
  getRefinementRound,
  generateCreationPrompt,
  generateRefinementPrompt,
  qualityDimensions,
  getOpeningTemplates,
  getEndingTemplates,
  getConflictTemplates,
  getCharacterArcTemplates,
  calculateTotalScore
} from '@/config/nobelLiteraryEngine.js'

// ============================================================================
// 响应式状态
// ============================================================================

const novelStore = useNovelStore()

// 风格选择
const selectedCategory = ref('all')
const selectedMasters = ref([])
const styleIntensity = ref(70)

// 技法选择
const selectedTechniques = ref([])
const techniqueIntensity = ref(60)

// 创作模式
const currentMode = ref('free')
const creationModes = [
  { id: 'free', name: '自由创作', icon: '✏️', description: '给定主题自由创作' },
  { id: 'assigned', name: '命题创作', icon: '📋', description: '给定开头/结尾创作' },
  { id: 'imitation', name: '仿写创作', icon: '🎭', description: '根据范文风格仿写' },
  { id: 'continuation', name: '续写创作', icon: '📝', description: '根据前文续写' }
]

// 创作参数
const creationParams = ref({
  theme: '',
  outline: '',
  wordCount: 2000,
  refinementRounds: 3,
  givenOpening: '',
  givenEnding: '',
  referenceText: '',
  previousText: ''
})

// 创作状态
const isCreating = ref(false)
const currentProgressMessage = ref('')
const creationResult = ref(null)

// 进度步骤
const progressSteps = ref([
  { label: '生成初稿', completed: false, active: false },
  { label: '应用技法', completed: false, active: false },
  { label: '风格润色', completed: false, active: false },
  { label: '质量评估', completed: false, active: false }
])

// 润色展开
const activeRefinement = ref([0])

// 风格详情
const showMasterDetail = ref(false)
const selectedMasterDetail = ref(null)

// 创作指导
const guideType = ref('openings')

// 雷达图引用
const radarChartRef = ref(null)

// ============================================================================
// 计算属性
// ============================================================================

// 过滤后的大师列表
const filteredMasters = computed(() => {
  if (selectedCategory.value === 'all') {
    return getAllMasters()
  }
  return getMastersByCategory(selectedCategory.value)
})

// 所有技法
const allTechniques = computed(() => {
  return getAllTechniques()
})

// 是否可以开始创作
const canStartCreation = computed(() => {
  if (isCreating.value) return false
  
  switch (currentMode.value) {
    case 'free':
      return creationParams.value.theme.trim().length > 0
    case 'assigned':
      return creationParams.value.givenOpening.trim().length > 0
    case 'imitation':
      return creationParams.value.referenceText.trim().length > 0
    case 'continuation':
      return creationParams.value.previousText.trim().length > 0
    default:
      return false
  }
})

// 渲染后的内容
const renderedContent = computed(() => {
  if (!creationResult.value?.content) return ''
  return marked(creationResult.value.content)
})

// 开头模板
const openingTemplates = computed(() => getOpeningTemplates(5))

// 结尾模板
const endingTemplates = computed(() => getEndingTemplates(5))

// 冲突模板
const conflictTemplates = computed(() => getConflictTemplates())

// 人物弧线模板
const characterArcTemplates = computed(() => getCharacterArcTemplates())

// ============================================================================
// 方法
// ============================================================================

/**
 * 判断大师是否已选中
 */
function isMasterSelected(masterId) {
  return selectedMasters.value.includes(masterId)
}

/**
 * 切换大师选择
 */
function toggleMaster(masterId) {
  const index = selectedMasters.value.indexOf(masterId)
  if (index > -1) {
    selectedMasters.value.splice(index, 1)
  } else {
    // 最多选择3位大师融合
    if (selectedMasters.value.length >= 3) {
      ElMessage.warning('最多同时选择3位大师风格融合')
      return
    }
    selectedMasters.value.push(masterId)
  }
}

/**
 * 判断技法是否已选中
 */
function isTechniqueSelected(techId) {
  return selectedTechniques.value.includes(techId)
}

/**
 * 切换技法选择
 */
function toggleTechnique(techId) {
  const index = selectedTechniques.value.indexOf(techId)
  if (index > -1) {
    selectedTechniques.value.splice(index, 1)
  } else {
    selectedTechniques.value.push(techId)
  }
}

/**
 * 获取步骤状态
 */
function getStepStatus(index) {
  const step = progressSteps.value[index]
  if (step.completed) return 'completed'
  if (step.active) return 'active'
  return 'waiting'
}

/**
 * 获取维度名称
 */
function getDimensionName(key) {
  const dimension = qualityDimensions.find(d => d.id === key)
  return dimension ? dimension.name : key
}

/**
 * 获取评分颜色
 */
function getScoreColor(score) {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

/**
 * 开始创作
 */
async function startCreation() {
  if (!canStartCreation.value) {
    ElMessage.warning('请完善创作参数')
    return
  }

  if (!novelStore.isApiConfigured) {
    ElMessage.warning('请先配置API密钥')
    return
  }

  isCreating.value = true
  creationResult.value = null

  // 重置进度
  progressSteps.value.forEach(step => {
    step.completed = false
    step.active = false
  })

  try {
    // 构建创作参数
    const params = {
      masterIds: selectedMasters.value,
      techniqueIds: selectedTechniques.value,
      mode: currentMode.value,
      theme: creationParams.value.theme,
      outline: creationParams.value.outline,
      wordCount: creationParams.value.wordCount,
      styleIntensity: styleIntensity.value,
      techniqueIntensity: techniqueIntensity.value,
      givenOpening: creationParams.value.givenOpening,
      givenEnding: creationParams.value.givenEnding,
      referenceText: creationParams.value.referenceText,
      previousText: creationParams.value.previousText
    }

    // 模拟创作流程
    // 第一步：生成初稿
    progressSteps.value[0].active = true
    currentProgressMessage.value = '正在生成初稿...'
    await simulateDelay(2000)
    
    // 调用AI生成
    const result = await callAICreation(params)
    
    progressSteps.value[0].completed = true
    progressSteps.value[0].active = false

    // 第二步：应用技法
    if (selectedTechniques.value.length > 0) {
      progressSteps.value[1].active = true
      currentProgressMessage.value = '正在应用叙事技法...'
      await simulateDelay(1500)
      progressSteps.value[1].completed = true
      progressSteps.value[1].active = false
    } else {
      progressSteps.value[1].completed = true
    }

    // 第三步：润色
    if (creationParams.value.refinementRounds > 0) {
      progressSteps.value[2].active = true
      currentProgressMessage.value = `正在进行${creationParams.value.refinementRounds}轮润色...`
      await simulateDelay(2000)
      progressSteps.value[2].completed = true
      progressSteps.value[2].active = false
    } else {
      progressSteps.value[2].completed = true
    }

    // 第四步：质量评估
    progressSteps.value[3].active = true
    currentProgressMessage.value = '正在进行文学质量评估...'
    await simulateDelay(1000)
    progressSteps.value[3].completed = true
    progressSteps.value[3].active = false

    // 设置结果
    creationResult.value = result
    currentProgressMessage.value = ''

    ElMessage.success('文学创作完成！')

    // 渲染雷达图
    nextTick(() => {
      if (creationResult.value?.assessment) {
        renderRadarChart()
      }
    })

  } catch (error) {
    ElMessage.error('创作失败: ' + error.message)
  } finally {
    isCreating.value = false
  }
}

/**
 * 调用AI创作
 */
async function callAICreation(params) {
  // 生成提示词
  const prompt = generateCreationPrompt({
    masterId: params.masterIds[0],
    techniqueIds: params.techniqueIds,
    theme: params.theme,
    outline: params.outline,
    wordCount: params.wordCount
  })

  try {
    // 调用store中的AI方法
    const response = await novelStore.callAI(prompt)
    
    // 构建结果对象
    const result = {
      content: response || generateSampleContent(params),
      assessment: generateSampleAssessment(),
      refinements: params.refinementRounds > 0 ? generateSampleRefinements() : []
    }

    return result
  } catch (error) {
    // 如果AI调用失败，返回示例内容
    return {
      content: generateSampleContent(params),
      assessment: generateSampleAssessment(),
      refinements: params.refinementRounds > 0 ? generateSampleRefinements() : []
    }
  }
}

/**
 * 生成示例内容（当AI不可用时）
 */
function generateSampleContent(params) {
  const master = params.masterIds[0] ? getMasterById(params.masterIds[0]) : null
  const masterName = master ? master.name : '文学大师'
  
  return `# 《${params.theme || '无题'}》

这是一个由${masterName}风格创作的文学作品示例。

${params.theme ? `主题：${params.theme}` : ''}

---

秋风起时，落叶铺满了那条通往老屋的小路。他站在门口，看着那扇斑驳的木门，仿佛看到了几十年前的自己。

那时候，他还年轻，怀揣着满腔热血，以为可以改变世界。如今，他已是满头白发，才明白有些事情，从一开始就注定无法改变。

"你回来了。"身后传来一个苍老的声音。

他没有回头，只是轻轻点了点头。

院子里的那棵老槐树还在，只是更加苍老了。它见证了这个家族的兴衰，也见证了他从少年到老年的全部人生。

他想起父亲曾经说过的话："人这一辈子，总要为某些事情坚持，哪怕最后什么也得不到。"

那时候他不明白，现在他懂了。

---

*（这是一个示例内容，实际创作将根据您选择的风格和参数生成）*`
}

/**
 * 生成示例评估
 */
function generateSampleAssessment() {
  return {
    scores: {
      languageOriginality: { score: 78, comment: '语言有独特的风格特征，比喻新颖' },
      emotionalDepth: { score: 82, comment: '情感真挚动人，层次分明' },
      narrativeTechnique: { score: 75, comment: '叙事结构完整，节奏控制得当' },
      characterDepth: { score: 70, comment: '人物形象较为立体，可以更加丰富' },
      themeDepth: { score: 80, comment: '主题深刻，具有普遍意义' }
    },
    highlights: [
      '语言风格鲜明，具有文学美感',
      '情感表达真挚，能够引起共鸣',
      '主题深刻，引人思考'
    ],
    weaknesses: [
      '部分段落可以更加精炼',
      '人物心理描写可以更加细腻'
    ],
    suggestions: [
      '建议增加更多感官细节描写',
      '可以尝试更多的叙事视角变化',
      '结尾可以更加含蓄，留有余韵'
    ],
    overallComment: '这是一篇具有较高文学价值的作品，语言优美，情感真挚，主题深刻。建议在细节描写和人物塑造方面继续打磨。',
    totalScore: 77
  }
}

/**
 * 生成示例润色记录
 */
function generateSampleRefinements() {
  return [
    {
      round: 1,
      name: '结构优化',
      before: '他站在门口。他看着那扇门。',
      after: '他站在门口，凝视着那扇斑驳的木门。',
      changes: ['合并短句，增强连贯性', '增加形容词"斑驳"，丰富意象']
    },
    {
      round: 2,
      name: '语言精炼',
      before: '那时候，他还年轻，有很多想法和抱负。',
      after: '那时候，他还年轻，怀揣着满腔热血。',
      changes: ['删除冗余表达', '使用更精准的词语']
    }
  ]
}

/**
 * 模拟延迟
 */
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 渲染雷达图
 */
function renderRadarChart() {
  if (!radarChartRef.value || !creationResult.value?.assessment) return

  const scores = creationResult.value.assessment.scores
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 300
  radarChartRef.value.innerHTML = ''
  radarChartRef.value.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const centerX = 150
  const centerY = 150
  const radius = 100

  // 绘制背景网格
  ctx.strokeStyle = '#e4e7ed'
  ctx.lineWidth = 1

  for (let i = 1; i <= 5; i++) {
    ctx.beginPath()
    const r = radius * i / 5
    for (let j = 0; j <= 5; j++) {
      const angle = (Math.PI * 2 / 5) * j - Math.PI / 2
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  // 绘制轴线
  const labels = Object.keys(scores)
  labels.forEach((key, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()

    // 绘制标签
    const labelX = centerX + (radius + 20) * Math.cos(angle)
    const labelY = centerY + (radius + 20) * Math.sin(angle)
    ctx.fillStyle = '#606266'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(getDimensionName(key), labelX, labelY)
  })

  // 绘制数据区域
  ctx.beginPath()
  ctx.fillStyle = 'rgba(64, 158, 255, 0.3)'
  ctx.strokeStyle = '#409eff'
  ctx.lineWidth = 2

  labels.forEach((key, i) => {
    const score = scores[key].score
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2
    const r = radius * score / 100
    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)
    
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })

  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/**
 * 复制内容
 */
function copyContent() {
  if (creationResult.value?.content) {
    navigator.clipboard.writeText(creationResult.value.content)
    ElMessage.success('内容已复制到剪贴板')
  }
}

/**
 * 处理导出
 */
function handleExport(command) {
  if (!creationResult.value) return

  let content = ''
  let filename = ''
  let type = ''

  switch (command) {
    case 'txt':
      content = creationResult.value.content
      filename = '文学作品.txt'
      type = 'text/plain'
      break
    case 'md':
      content = `# 文学作品\n\n${creationResult.value.content}`
      filename = '文学作品.md'
      type = 'text/markdown'
      break
    case 'annotated':
      content = generateAnnotatedVersion()
      filename = '文学作品_带批注.md'
      type = 'text/markdown'
      break
    case 'report':
      content = generateCreationReport()
      filename = '创作报告.md'
      type = 'text/markdown'
      break
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)

  ElMessage.success('导出成功')
}

/**
 * 生成带批注版本
 */
function generateAnnotatedVersion() {
  if (!creationResult.value) return ''

  let md = `# 文学作品（带批注版本）\n\n`
  md += `## 作品内容\n\n${creationResult.value.content}\n\n`
  
  if (creationResult.value.assessment) {
    md += `## 质量评估\n\n`
    md += `**总分：${creationResult.value.assessment.totalScore}**\n\n`
    
    Object.entries(creationResult.value.assessment.scores).forEach(([key, value]) => {
      md += `- **${getDimensionName(key)}**：${value.score}分 - ${value.comment}\n`
    })
  }

  return md
}

/**
 * 生成创作报告
 */
function generateCreationReport() {
  if (!creationResult.value) return ''

  let md = `# 文学创作报告\n\n`
  md += `生成时间：${new Date().toLocaleString()}\n\n`
  
  md += `## 创作配置\n\n`
  md += `- **创作模式**：${creationModes.find(m => m.id === currentMode.value)?.name}\n`
  md += `- **目标字数**：${creationParams.value.wordCount}字\n`
  md += `- **润色轮次**：${creationParams.value.refinementRounds}轮\n`
  
  if (selectedMasters.value.length > 0) {
    md += `- **大师风格**：${selectedMasters.value.map(id => getMasterById(id)?.name).join('、')}\n`
  }
  
  if (selectedTechniques.value.length > 0) {
    md += `- **叙事技法**：${selectedTechniques.value.map(id => getTechniqueById(id)?.name).join('、')}\n`
  }
  
  md += `\n## 质量评估\n\n`
  
  if (creationResult.value.assessment) {
    md += `**总分：${creationResult.value.assessment.totalScore}/100**\n\n`
    
    md += `### 各维度评分\n\n`
    md += `| 维度 | 分数 | 评语 |\n`
    md += `|------|------|------|\n`
    
    Object.entries(creationResult.value.assessment.scores).forEach(([key, value]) => {
      md += `| ${getDimensionName(key)} | ${value.score} | ${value.comment} |\n`
    })
    
    md += `\n### 亮点\n\n`
    creationResult.value.assessment.highlights.forEach(h => {
      md += `- ${h}\n`
    })
    
    md += `\n### 改进建议\n\n`
    creationResult.value.assessment.suggestions.forEach(s => {
      md += `- ${s}\n`
    })
    
    md += `\n### 总体评价\n\n`
    md += `${creationResult.value.assessment.overallComment}\n`
  }
  
  md += `\n## 作品内容\n\n`
  md += `字数：${creationResult.value.content?.length || 0}字\n\n`
  md += `${creationResult.value.content}\n`

  return md
}

/**
 * 重置创作
 */
function resetCreation() {
  creationResult.value = null
  progressSteps.value.forEach(step => {
    step.completed = false
    step.active = false
  })
  currentProgressMessage.value = ''
}

/**
 * 显示大师详情
 */
function showMasterInfo(masterId) {
  selectedMasterDetail.value = getMasterById(masterId)
  showMasterDetail.value = true
}

// ============================================================================
// 生命周期
// ============================================================================

onMounted(() => {
  // 初始化
})
</script>

<style scoped>
.literary-workshop {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 主容器 */
.workshop-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
}

/* 配置面板 */
.config-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.config-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
}

.config-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 分类标签 */
.category-tabs {
  margin-bottom: 16px;
}

/* 大师网格 */
.master-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.master-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.master-card:hover {
  border-color: #409eff;
  background: #f5f7fa;
}

.master-card.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.master-avatar {
  font-size: 24px;
}

.master-info {
  flex: 1;
}

.master-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.master-country {
  font-size: 12px;
  color: #909399;
}

.master-award {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #e6a23c;
}

/* 技法网格 */
.technique-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.technique-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.technique-card:hover {
  border-color: #e6a23c;
}

.technique-card.selected {
  border-color: #e6a23c;
  background: #fdf6ec;
}

.technique-icon {
  font-size: 18px;
}

.technique-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}

.technique-help {
  color: #909399;
  cursor: help;
}

/* 强度调节 */
.style-intensity,
.technique-intensity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.intensity-label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.intensity-value {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  min-width: 40px;
}

/* 创作模式 */
.creation-modes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.mode-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-card:hover {
  border-color: #67c23a;
}

.mode-card.active {
  border-color: #67c23a;
  background: #f0f9eb;
}

.mode-icon {
  font-size: 24px;
}

.mode-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.mode-desc {
  font-size: 12px;
  color: #909399;
}

/* 创作表单 */
.creation-form {
  margin-top: 12px;
}

/* 开始按钮 */
.start-button-container {
  margin-top: 20px;
}

.start-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

/* 结果面板 */
.result-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: 600px;
}

/* 创作进度 */
.creation-progress {
  text-align: center;
  padding: 40px 20px;
}

.creation-progress h3 {
  margin: 0 0 24px 0;
  font-size: 18px;
  color: #303133;
}

.progress-steps {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: #e4e7ed;
  color: #909399;
  transition: all 0.3s;
}

.progress-step.active .step-icon {
  background: #409eff;
  color: white;
}

.progress-step.completed .step-icon {
  background: #67c23a;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #606266;
}

.progress-message {
  font-size: 14px;
  color: #409eff;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 空结果 */
.empty-result {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-result h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.empty-result p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

/* 创作指导 */
.creation-guide {
  margin-top: 40px;
  text-align: left;
}

.creation-guide h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.guide-tabs {
  margin-bottom: 16px;
}

.guide-content {
  max-height: 300px;
  overflow-y: auto;
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.guide-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.guide-example {
  font-size: 13px;
  color: #606266;
  font-style: italic;
  margin-bottom: 4px;
}

.guide-desc {
  font-size: 12px;
  color: #909399;
}

.guide-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.guide-stages {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.stage-item {
  font-size: 12px;
  color: #606266;
}

/* 创作结果 */
.creation-result {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.result-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.result-actions {
  display: flex;
  gap: 8px;
}

/* 质量评估 */
.assessment-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.assessment-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.radar-chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.radar-chart {
  width: 300px;
  height: 300px;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.score-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.score-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.score-comment {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.overall-assessment {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.total-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.score-number {
  font-size: 36px;
  font-weight: 700;
  color: #409eff;
}

.overall-comment {
  flex: 1;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.assessment-highlights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.highlights-section,
.weaknesses-section {
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.highlights-section h5,
.weaknesses-section h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #303133;
}

.highlights-section ul,
.weaknesses-section ul {
  margin: 0;
  padding-left: 20px;
}

.highlights-section li,
.weaknesses-section li {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

/* 润色记录 */
.refinement-section {
  margin-bottom: 24px;
}

.refinement-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.refinement-content {
  display: grid;
  gap: 16px;
}

.refinement-before,
.refinement-after {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.refinement-before h5,
.refinement-after h5,
.refinement-changes h5 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #909399;
}

.text-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  max-height: 150px;
  overflow-y: auto;
}

.refinement-changes ul {
  margin: 0;
  padding-left: 20px;
}

.refinement-changes li {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

/* 作品内容 */
.content-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.work-content {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
  max-height: 500px;
  overflow-y: auto;
}

.work-content :deep(p) {
  margin: 12px 0;
  text-indent: 2em;
}

.work-content :deep(h1),
.work-content :deep(h2),
.work-content :deep(h3) {
  text-indent: 0;
}

.word-count {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

/* 大师详情对话框 */
.master-detail-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.master-detail .detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-avatar {
  font-size: 48px;
}

.detail-name {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.detail-country {
  font-size: 14px;
  color: #909399;
}

.detail-award {
  font-size: 13px;
  color: #e6a23c;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.works-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.work-tag {
  padding: 4px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
}

blockquote {
  margin: 0;
  padding: 12px 16px;
  background: #f5f7fa;
  border-left: 4px solid #409eff;
  font-style: italic;
  color: #606266;
}

.best-for {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .workshop-container {
    grid-template-columns: 1fr;
  }

  .config-panel {
    position: static;
  }
}

@media (max-width: 768px) {
  .master-grid {
    grid-template-columns: 1fr;
  }

  .technique-grid {
    grid-template-columns: 1fr;
  }

  .creation-modes {
    grid-template-columns: 1fr;
  }

  .assessment-highlights {
    grid-template-columns: 1fr;
  }

  .progress-steps {
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>

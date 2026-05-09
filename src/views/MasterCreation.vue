<template>
  <div class="master-creation">
    <!-- 步骤导航 -->
    <div class="step-nav">
      <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-label">选择类型</div>
      </div>
      <div class="step-line" :class="{ active: currentStep > 1 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-label">选择风格</div>
      </div>
      <div class="step-line" :class="{ active: currentStep > 2 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
        <div class="step-number">3</div>
        <div class="step-label">文学技法</div>
      </div>
      <div class="step-line" :class="{ active: currentStep > 3 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 4 }">
        <div class="step-number">4</div>
        <div class="step-label">开始创作</div>
      </div>
    </div>

    <!-- 步骤1：选择创作类型 -->
    <div v-if="currentStep === 1" class="step-content">
      <h2 class="section-title">📚 选择创作类型</h2>
      <p class="section-desc">选择你要创作的作品类型，系统会为你匹配最佳的创作模板</p>
      
      <div class="category-tabs">
        <el-radio-group v-model="selectedCategory" @change="onCategoryChange">
          <el-radio-button label="网络小说">网络小说</el-radio-button>
          <el-radio-button label="严肃文学">严肃文学</el-radio-button>
          <el-radio-button label="诗歌">诗歌</el-radio-button>
          <el-radio-button label="剧本">剧本</el-radio-button>
        </el-radio-group>
      </div>

      <div class="genre-grid">
        <div
          v-for="genre in filteredGenres"
          :key="genre.id"
          class="genre-card"
          :class="{ selected: selectedGenre === genre.id }"
          @click="selectedGenre = genre.id"
        >
          <div class="genre-icon">{{ genre.icon }}</div>
          <div class="genre-name">{{ genre.name }}</div>
          <div class="genre-desc">{{ genre.description }}</div>
          <div class="genre-tags">
            <span v-for="tag in genre.bestFor" :key="tag" class="genre-tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <el-button type="primary" size="large" :disabled="!selectedGenre" @click="nextStep">
          下一步：选择风格
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 步骤2：选择大师风格 -->
    <div v-if="currentStep === 2" class="step-content">
      <h2 class="section-title">🎨 选择大师风格</h2>
      <p class="section-desc">选择一位文学大师的风格作为创作参考，AI将模仿其独特的写作手法</p>

      <div class="category-tabs">
        <el-radio-group v-model="selectedStyleCategory" @change="onStyleCategoryChange">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="严肃文学">严肃文学</el-radio-button>
          <el-radio-button label="世界文学">世界文学</el-radio-button>
          <el-radio-button label="网络小说">网络小说</el-radio-button>
        </el-radio-group>
      </div>

      <div class="style-grid">
        <div
          v-for="style in filteredStyles"
          :key="style.id"
          class="style-card"
          :class="{ selected: selectedStyle === style.id }"
          @click="selectedStyle = style.id"
        >
          <div class="style-header">
            <span class="style-avatar">{{ style.avatar }}</span>
            <div class="style-info">
              <div class="style-name">{{ style.name }}</div>
              <div class="style-award">{{ style.award }}</div>
            </div>
          </div>
          <div class="style-desc">{{ style.description }}</div>
          <div class="style-techniques">
            <span v-for="tech in style.techniques" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <el-button size="large" @click="prevStep">
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button type="primary" size="large" :disabled="!selectedStyle" @click="nextStep">
          下一步：文学技法
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button size="large" @click="selectedStyle = null; nextStep()">
          跳过
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 步骤3：选择文学技法 -->
    <div v-if="currentStep === 3" class="step-content">
      <h2 class="section-title">🔧 选择文学技法</h2>
      <p class="section-desc">选择要应用的文学技法，可多选。技法将在创作后自动应用到作品中</p>

      <div class="technique-categories">
        <div v-for="(techniques, category) in techniqueCategories" :key="category" class="technique-group">
          <h3 class="group-title">{{ category }}</h3>
          <div class="technique-list">
            <div
              v-for="tech in techniques"
              :key="tech.id"
              class="technique-card"
              :class="{ selected: selectedTechniques.includes(tech.id) }"
              @click="toggleTechnique(tech.id)"
            >
              <div class="technique-header">
                <span class="technique-icon">{{ tech.icon }}</span>
                <span class="technique-name">{{ tech.name }}</span>
              </div>
              <div class="technique-desc">{{ tech.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <el-button size="large" @click="prevStep">
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button type="primary" size="large" @click="nextStep">
          下一步：开始创作
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button size="large" @click="selectedTechniques = []; nextStep()">
          跳过
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 步骤4：开始创作 -->
    <div v-if="currentStep === 4" class="step-content">
      <h2 class="section-title">🚀 开始大师创作</h2>
      
      <!-- 创作配置摘要 -->
      <div class="config-summary">
        <div class="summary-item" v-if="selectedGenre">
          <span class="summary-label">创作类型</span>
          <span class="summary-value">{{ getGenreName(selectedGenre) }}</span>
        </div>
        <div class="summary-item" v-if="selectedStyle">
          <span class="summary-label">大师风格</span>
          <span class="summary-value">{{ getStyleName(selectedStyle) }}</span>
        </div>
        <div class="summary-item" v-if="selectedTechniques.length > 0">
          <span class="summary-label">文学技法</span>
          <span class="summary-value">{{ selectedTechniques.map(t => getTechniqueName(t)).join('、') }}</span>
        </div>
      </div>

      <!-- 创作参数 -->
      <el-form :model="creationParams" label-width="100px" class="creation-form">
        <el-form-item label="作品主题">
          <el-input
            v-model="creationParams.theme"
            placeholder="请输入作品主题，如：一个乡村教师的坚守与孤独"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <el-form-item label="作品大纲">
          <el-input
            v-model="creationParams.outline"
            placeholder="可选：输入大纲或故事梗概"
            type="textarea"
            :rows="4"
          />
        </el-form-item>

        <el-form-item label="目标字数">
          <el-select v-model="creationParams.wordCount" style="width: 200px">
            <el-option label="500字（短篇片段）" :value="500" />
            <el-option label="1000字（短篇）" :value="1000" />
            <el-option label="2000字（中篇片段）" :value="2000" />
            <el-option label="3000字（中篇）" :value="3000" />
            <el-option label="5000字（长篇章节）" :value="5000" />
            <el-option label="8000字（长篇章节）" :value="8000" />
          </el-select>
        </el-form-item>

        <el-form-item label="精修模式">
          <el-radio-group v-model="creationParams.refinementMode">
            <el-radio-button label="full">完整精修（推荐）</el-radio-button>
            <el-radio-button label="draft">仅生成初稿</el-radio-button>
            <el-radio-button label="polish">初稿+润色</el-radio-button>
          </el-radio-group>
          <div class="form-tip">
            完整精修：初稿 → 技法应用 → 深度润色 → 终审评审
          </div>
        </el-form-item>
      </el-form>

      <!-- 创作进度 -->
      <div v-if="isCreating" class="creation-progress">
        <div class="progress-steps">
          <div v-for="step in progressSteps" :key="step.label" class="progress-step" :class="step.status">
            <div class="progress-icon">
              <el-icon v-if="step.status === 'completed'"><Check /></el-icon>
              <el-icon v-else-if="step.status === 'generating'" class="spinning"><Loading /></el-icon>
              <el-icon v-else><Clock /></el-icon>
            </div>
            <span class="progress-label">{{ step.label }}</span>
          </div>
        </div>
        <div class="progress-message">{{ progressMessage }}</div>
      </div>

      <!-- 创作结果 -->
      <div v-if="creationResult" class="creation-result">
        <div class="result-header">
          <h3>✅ 创作完成</h3>
          <div class="result-actions">
            <el-button type="primary" @click="copyResult">复制内容</el-button>
            <el-button @click="resetCreation">重新创作</el-button>
          </div>
        </div>
        
        <!-- 终审报告 -->
        <div v-if="creationResult.review" class="review-section">
          <h4>🏆 终审评审报告</h4>
          <div class="review-content" v-html="renderMarkdown(creationResult.review)"></div>
        </div>
        
        <!-- 作品内容 -->
        <div class="result-content">
          <div class="content-text" v-html="renderMarkdown(creationResult.content)"></div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="step-actions">
        <el-button size="large" @click="prevStep">
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>
        <el-button
          type="primary"
          size="large"
          :loading="isCreating"
          :disabled="!creationParams.theme"
          @click="startCreation"
        >
          <el-icon v-if="!isCreating"><MagicStick /></el-icon>
          {{ isCreating ? '创作中...' : '开始大师创作' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { getAllGenreTemplates, getGenreById } from '@/config/genreTemplates.js'
import { getAllStyles, getStyleById } from '@/config/masterStyles.js'
import { getTechniqueCategories, getTechniqueById } from '@/config/literaryTechniques.js'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import { ArrowRight, ArrowLeft, Check, Clock, Loading, MagicStick } from '@element-plus/icons-vue'

const novelStore = useNovelStore()

// 步骤控制
const currentStep = ref(1)

// 类型选择
const selectedCategory = ref('网络小说')
const selectedGenre = ref(null)
const genres = ref(getAllGenreTemplates())

// 风格选择
const selectedStyleCategory = ref('all')
const selectedStyle = ref(null)
const styles = ref(getAllStyles())

// 技法选择
const selectedTechniques = ref([])
const techniqueCategories = ref(getTechniqueCategories())

// 创作参数
const creationParams = ref({
  theme: '',
  outline: '',
  wordCount: 2000,
  refinementMode: 'full'
})

// 创作状态
const isCreating = ref(false)
const progressMessage = ref('')
const creationResult = ref(null)

// 进度步骤
const progressSteps = ref([
  { label: '📝 生成初稿', status: 'waiting' },
  { label: '🔧 应用技法', status: 'waiting' },
  { label: '✨ 深度润色', status: 'waiting' },
  { label: '🏆 终审评审', status: 'waiting' }
])

// 计算属性
const filteredGenres = computed(() => {
  return genres.value.filter(g => g.category === selectedCategory.value)
})

const filteredStyles = computed(() => {
  if (selectedStyleCategory.value === 'all') return styles.value
  return styles.value.filter(s => s.category === selectedStyleCategory.value)
})

// 方法
const onCategoryChange = () => {
  selectedGenre.value = null
}

const onStyleCategoryChange = () => {
  // 不清除已选风格
}

const toggleTechnique = (id) => {
  const index = selectedTechniques.value.indexOf(id)
  if (index > -1) {
    selectedTechniques.value.splice(index, 1)
  } else {
    selectedTechniques.value.push(id)
  }
}

const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const getGenreName = (id) => {
  const genre = getGenreById(id)
  return genre ? `${genre.icon} ${genre.name}` : ''
}

const getStyleName = (id) => {
  const style = getStyleById(id)
  return style ? `${style.avatar} ${style.name}` : ''
}

const getTechniqueName = (id) => {
  const tech = getTechniqueById(id)
  return tech ? `${tech.icon} ${tech.name}` : ''
}

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text)
}

const startCreation = async () => {
  if (!creationParams.value.theme) {
    ElMessage.warning('请输入作品主题')
    return
  }

  if (!novelStore.isApiConfigured) {
    ElMessage.warning('请先配置API密钥')
    return
  }

  isCreating.value = true
  creationResult.value = null

  // 重置进度
  progressSteps.value = [
    { label: '📝 生成初稿', status: 'waiting' },
    { label: '🔧 应用技法', status: 'waiting' },
    { label: '✨ 深度润色', status: 'waiting' },
    { label: '🏆 终审评审', status: 'waiting' }
  ]

  try {
    const params = {
      genreId: selectedGenre.value,
      styleId: selectedStyle.value,
      techniqueIds: selectedTechniques.value,
      theme: creationParams.value.theme,
      outline: creationParams.value.outline,
      characters: novelStore.characters,
      worldSettings: novelStore.worldSettings,
      wordCount: creationParams.value.wordCount,
      refinementMode: creationParams.value.refinementMode
    }

    const result = await novelStore.generateContent(params, (progress) => {
      progressMessage.value = progress.message
      
      if (progress.step === 1) {
        progressSteps.value[0].status = progress.status === 'completed' ? 'completed' : 'generating'
      } else if (progress.step === 2) {
        progressSteps.value[0].status = 'completed'
        progressSteps.value[1].status = progress.status === 'completed' ? 'completed' : 'generating'
      } else if (progress.step === 3) {
        progressSteps.value[1].status = 'completed'
        progressSteps.value[2].status = progress.status === 'completed' ? 'completed' : 'generating'
      } else if (progress.step === 4) {
        progressSteps.value[2].status = 'completed'
        progressSteps.value[3].status = progress.status === 'completed' ? 'completed' : 'generating'
      }
    })

    if (result) {
      creationResult.value = result
      progressSteps.value.forEach(s => s.status = 'completed')
      ElMessage.success('大师创作完成！')
    }
  } catch (error) {
    ElMessage.error('创作失败: ' + error.message)
  } finally {
    isCreating.value = false
  }
}

const copyResult = () => {
  if (creationResult.value?.content) {
    navigator.clipboard.writeText(creationResult.value.content)
    ElMessage.success('内容已复制到剪贴板')
  }
}

const resetCreation = () => {
  creationResult.value = null
  progressSteps.value.forEach(s => s.status = 'waiting')
  progressMessage.value = ''
}
</script>

<style scoped>
.master-creation {
  max-width: 1200px;
  margin: 0 auto;
}

/* 步骤导航 */
.step-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  margin-bottom: 20px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e4e7ed;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
}

.step-item.active .step-number {
  background: #409eff;
  color: white;
}

.step-item.completed .step-number {
  background: #67c23a;
  color: white;
}

.step-label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.step-item.active .step-label {
  color: #303133;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e4e7ed;
  margin: 0 12px;
  transition: background 0.3s;
}

.step-line.active {
  background: #409eff;
}

/* 内容区域 */
.step-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #909399;
  font-size: 14px;
  margin: 0 0 24px 0;
}

/* 分类标签 */
.category-tabs {
  margin-bottom: 24px;
}

/* 类型网格 */
.genre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.genre-card {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.genre-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.genre-card.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.genre-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.genre-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.genre-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.5;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f2f5;
  color: #606266;
  border-radius: 10px;
}

/* 风格网格 */
.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.style-card {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.style-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.style-card.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.style-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.style-avatar {
  font-size: 28px;
}

.style-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.style-award {
  font-size: 12px;
  color: #e6a23c;
}

.style-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.5;
}

.style-techniques {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 10px;
}

/* 技法选择 */
.technique-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.technique-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.technique-card {
  border: 2px solid #e4e7ed;
  border-radius: 10px;
  padding: 16px;
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

.technique-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.technique-icon {
  font-size: 20px;
}

.technique-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.technique-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

/* 操作按钮 */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
  margin-top: 24px;
}

/* 创作表单 */
.creation-form {
  margin-bottom: 24px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 配置摘要 */
.config-summary {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #909399;
}

.summary-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* 创作进度 */
.creation-progress {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 12px;
  margin-bottom: 24px;
}

.progress-steps {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #e4e7ed;
  color: #909399;
  transition: all 0.3s;
}

.progress-step.generating .progress-icon {
  background: #409eff;
  color: white;
}

.progress-step.completed .progress-icon {
  background: #67c23a;
  color: white;
}

.progress-label {
  font-size: 12px;
  color: #606266;
}

.progress-message {
  text-align: center;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 创作结果 */
.creation-result {
  margin-bottom: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

.review-section {
  padding: 20px;
  background: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 8px;
  margin-bottom: 16px;
}

.review-section h4 {
  margin: 0 0 12px 0;
  color: #e6a23c;
}

.review-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
}

.review-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.review-content :deep(th),
.review-content :deep(td) {
  border: 1px solid #e4e7ed;
  padding: 8px 12px;
  text-align: left;
}

.review-content :deep(th) {
  background: #f5f7fa;
  font-weight: 600;
}

.result-content {
  padding: 20px;
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  max-height: 600px;
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

/* 响应式 */
@media (max-width: 768px) {
  .genre-grid,
  .style-grid,
  .technique-list {
    grid-template-columns: 1fr;
  }
  
  .step-nav {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .step-line {
    width: 30px;
  }
  
  .config-summary {
    flex-direction: column;
    gap: 12px;
  }
}
</style>

<template>
  <div class="text-analysis-page">
    <div class="page-header">
      <h2>文本质量分析</h2>
    </div>

    <div class="analysis-layout">
      <!-- 左侧：文本输入 -->
      <div class="input-panel">
        <div class="panel-title">待分析文本</div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="16"
          placeholder="请输入或粘贴需要分析的文本内容..."
          resize="vertical"
        />
        <div class="input-actions">
          <el-button type="primary" @click="handleAnalyze" :loading="isAnalyzing">
            开始分析
          </el-button>
          <el-button @click="handleQuickFix">一键修复</el-button>
          <el-button @click="inputText = ''">清空</el-button>
        </div>
      </div>

      <!-- 右侧：分析结果 -->
      <div class="result-panel" v-if="analysisResult">
        <!-- 总评分 -->
        <div class="score-card" :class="scoreLevelClass">
          <div class="score-number">{{ analysisResult.score }}</div>
          <div class="score-label">{{ analysisResult.level }}</div>
        </div>

        <!-- 文本统计 -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ analysisResult.stats.wordCount }}</div>
            <div class="stat-label">字数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ analysisResult.stats.sentenceCount }}</div>
            <div class="stat-label">句数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ analysisResult.stats.paragraphCount }}</div>
            <div class="stat-label">段数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ analysisResult.stats.dialogueCount }}</div>
            <div class="stat-label">对话数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ analysisResult.stats.readingTimeMinutes }}</div>
            <div class="stat-label">阅读时间(分)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ analysisResult.stats.pageEstimate }}</div>
            <div class="stat-label">预估页数</div>
          </div>
        </div>

        <!-- 可读性指标 -->
        <div class="readability-section">
          <div class="section-title">可读性指标</div>
          <div class="readability-items">
            <div class="readability-item">
              <span class="ri-label">Flesch-Kincaid分数</span>
              <span class="ri-value">{{ analysisResult.readability.score }}</span>
              <span class="ri-level">{{ analysisResult.readability.level }}</span>
            </div>
            <div class="readability-item">
              <span class="ri-label">平均句长</span>
              <span class="ri-value">{{ analysisResult.readability.details.avgSentenceLength }}字</span>
            </div>
            <div class="readability-item">
              <span class="ri-label">词汇丰富度</span>
              <div class="ri-bar">
                <div class="ri-bar-fill" :style="{ width: (analysisResult.readability.details.vocabularyRichness * 100) + '%' }"></div>
              </div>
              <span class="ri-value">{{ (analysisResult.readability.details.vocabularyRichness * 100).toFixed(1) }}%</span>
            </div>
            <div class="readability-item">
              <span class="ri-label">对话比例</span>
              <div class="ri-bar">
                <div class="ri-bar-fill dialogue" :style="{ width: (analysisResult.readability.details.dialogueRatio * 100) + '%' }"></div>
              </div>
              <span class="ri-value">{{ (analysisResult.readability.details.dialogueRatio * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- 问题列表 -->
        <div class="issues-section">
          <div class="section-title">
            问题列表
            <el-tag size="small" type="danger" style="margin-left: 8px">{{ analysisResult.issues.length }}个问题</el-tag>
          </div>
          <el-collapse v-if="groupedIssues.length > 0" v-model="expandedIssueGroups">
            <el-collapse-item
              v-for="group in groupedIssues"
              :key="group.key"
              :name="group.key"
            >
              <template #title>
                <span class="group-title">
                  <span class="group-dot" :class="group.severity"></span>
                  {{ group.label }}
                  <el-badge :value="group.items.length" :type="group.severity" />
                </span>
              </template>
              <div class="issue-list">
                <div v-for="(issue, idx) in group.items" :key="idx" class="issue-item">
                  <div class="issue-message">{{ issue.message }}</div>
                  <div class="issue-suggestion" v-if="issue.suggestion">
                    <el-icon><InfoFilled /></el-icon>{{ issue.suggestion }}
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-empty v-else description="未发现问题，文本质量良好" :image-size="60" />
        </div>

        <!-- 用词频率Top20 -->
        <div class="frequency-section" v-if="topWords.length > 0">
          <div class="section-title">用词频率 Top 20</div>
          <div class="freq-chart">
            <div v-for="(item, idx) in topWords" :key="item.word" class="freq-bar-row">
              <span class="freq-rank">{{ idx + 1 }}</span>
              <span class="freq-word">{{ item.word }}</span>
              <div class="freq-bar-bg">
                <div
                  class="freq-bar-fill"
                  :style="{ width: (item.count / topWords[0].count * 100) + '%' }"
                ></div>
              </div>
              <span class="freq-count">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- AI建议 -->
        <div class="suggestions-section" v-if="analysisResult.suggestions?.overall?.length">
          <div class="section-title">改进建议</div>
          <div class="suggestion-list">
            <div v-for="(sug, idx) in analysisResult.suggestions.overall" :key="idx" class="suggestion-item">
              <el-icon><Promotion /></el-icon>{{ sug }}
            </div>
          </div>
        </div>
      </div>

      <!-- 未分析时的提示 -->
      <div class="empty-result" v-else>
        <el-empty description="输入文本并点击开始分析" :image-size="120" />
      </div>
    </div>

    <!-- 阈值配置 -->
    <el-collapse class="config-collapse">
      <el-collapse-item title="阈值配置" name="config">
        <div class="config-grid">
          <div class="config-item">
            <span class="config-label">副词阈值</span>
            <el-input-number v-model.number="config.adverb.threshold" :min="1" :max="20" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">被动语态阈值</span>
            <el-input-number v-model.number="config.passiveVoice.threshold" :min="1" :max="30" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">重复用词阈值</span>
            <el-input-number v-model.number="config.repetition.threshold" :min="1" :max="20" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">最大句长(字)</span>
            <el-input-number v-model.number="config.sentenceLength.maxLength" :min="20" :max="200" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">警告句长(字)</span>
            <el-input-number v-model.number="config.sentenceLength.warningLength" :min="10" :max="150" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">最大段长(字)</span>
            <el-input-number v-model.number="config.paragraphLength.maxLength" :min="100" :max="2000" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">对话标签阈值</span>
            <el-input-number v-model.number="config.dialogueTags.threshold" :min="1" :max="20" size="small" />
          </div>
          <div class="config-item">
            <span class="config-label">排除常见副词</span>
            <el-switch v-model="config.adverb.excludeCommon" />
          </div>
          <div class="config-item">
            <span class="config-label">排除常见虚词</span>
            <el-switch v-model="config.repetition.excludeCommon" />
          </div>
          <div class="config-item">
            <span class="config-label">检测陈词滥调</span>
            <el-switch v-model="config.cliches.enabled" />
          </div>
          <div class="config-item">
            <span class="config-label">检测标点问题</span>
            <el-switch v-model="config.punctuation.enabled" />
          </div>
          <div class="config-item">
            <span class="config-label">检测段首缩进</span>
            <el-switch v-model="config.indentation.enabled" />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Promotion } from '@element-plus/icons-vue'
import { analyzeText, quickAnalysis, analyzeWordFrequency, calculateReadability as analyzeReadability } from '../config/textAnalysis.js'

const inputText = ref('')
const isAnalyzing = ref(false)
const analysisResult = ref(null)
const expandedIssueGroups = ref([])

// 阈值配置
const config = reactive({
  adverb: { enabled: true, threshold: 3, excludeCommon: true },
  passiveVoice: { enabled: true, threshold: 5 },
  repetition: { enabled: true, threshold: 5, excludeCommon: true },
  sentenceLength: { enabled: true, maxLength: 80, warningLength: 60 },
  paragraphLength: { enabled: true, maxLength: 500, warningLength: 300 },
  dialogueTags: { enabled: true, threshold: 3 },
  cliches: { enabled: true, customList: [] },
  punctuation: { enabled: true },
  indentation: { enabled: true }
})

// 问题分类映射
const issueCategoryMap = {
  adverb_overuse: { label: '副词过度使用', severity: 'warning' },
  passive_voice: { label: '被动语态', severity: 'warning' },
  passive_voice_summary: { label: '被动语态汇总', severity: 'warning' },
  word_repetition: { label: '重复用词', severity: 'warning' },
  global_repetition: { label: '全局高频词', severity: 'info' },
  long_sentence: { label: '句子过长', severity: 'warning' },
  long_paragraph: { label: '段落过长', severity: 'warning' },
  short_paragraph: { label: '段落过短', severity: 'info' },
  dialogue_tag_repetition: { label: '对话标签重复', severity: 'warning' },
  missing_dialogue_tags: { label: '缺少对话标签', severity: 'info' },
  cliche: { label: '陈词滥调', severity: 'warning' },
  consecutive_punctuation: { label: '连续标点', severity: 'error' },
  mixed_punctuation: { label: '中英文标点混用', severity: 'error' },
  ellipsis_format: { label: '省略号格式', severity: 'error' },
  wrong_indentation: { label: '缩进格式错误', severity: 'info' },
  missing_indentation: { label: '缺少段首缩进', severity: 'info' }
}

// 评分等级样式
const scoreLevelClass = computed(() => {
  if (!analysisResult.value) return ''
  const s = analysisResult.value.score
  if (s >= 90) return 'excellent'
  if (s >= 75) return 'good'
  if (s >= 60) return 'average'
  return 'poor'
})

// 问题按分类分组
const groupedIssues = computed(() => {
  if (!analysisResult.value?.issues) return []
  const groups = {}
  analysisResult.value.issues.forEach(issue => {
    const cat = issueCategoryMap[issue.type] || { label: issue.type, severity: 'info' }
    if (!groups[issue.type]) {
      groups[issue.type] = { key: issue.type, label: cat.label, severity: cat.severity, items: [] }
    }
    groups[issue.type].items.push(issue)
  })
  return Object.values(groups)
})

// 用词频率Top20
const topWords = computed(() => {
  if (!analysisResult.value?.frequency?.topWords) return []
  return analysisResult.value.frequency.topWords.slice(0, 20)
})

// 执行分析
const handleAnalyze = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请先输入待分析的文本')
    return
  }
  isAnalyzing.value = true
  try {
    analysisResult.value = analyzeText(inputText.value, config)
    // 默认展开前3个问题组
    expandedIssueGroups.value = groupedIssues.value.slice(0, 3).map(g => g.key)
    ElMessage.success('分析完成')
  } catch (e) {
    ElMessage.error('分析失败: ' + e.message)
  } finally {
    isAnalyzing.value = false
  }
}

// 一键修复（修复简单问题：多余空格、连续标点等）
const handleQuickFix = () => {
  if (!inputText.value) return
  let text = inputText.value
  // 修复多余空格
  text = text.replace(/  +/g, ' ')
  // 修复连续标点
  text = text.replace(/([。！？，、；：])\1{2,}/g, '$1$1')
  // 修复英文省略号为中文省略号
  text = text.replace(/\.{3,}/g, '......')
  // 修复中英文标点混用（基础替换）
  text = text.replace(/([\u4e00-\u9fff]),\s*([\u4e00-\u9fff])/g, '$1，$2')
  text = text.replace(/([\u4e00-\u9fff])\.\s*([\u4e00-\u9fff])/g, '$1。$2')
  inputText.value = text
  ElMessage.success('已修复简单问题（多余空格、连续标点、省略号格式、基础标点混用）')
}
</script>

<style scoped>
.text-analysis-page {
  padding: 4px;
}
.page-header {
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}
.analysis-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.input-panel {
  width: 420px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.panel-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
}
.input-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.result-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.empty-result {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

/* 评分卡片 */
.score-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.score-card.excellent { border-left: 5px solid #67c23a; }
.score-card.good { border-left: 5px solid #409eff; }
.score-card.average { border-left: 5px solid #e6a23c; }
.score-card.poor { border-left: 5px solid #f56c6c; }
.score-number {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}
.score-card.excellent .score-number { color: #67c23a; }
.score-card.good .score-number { color: #409eff; }
.score-card.average .score-number { color: #e6a23c; }
.score-card.poor .score-number { color: #f56c6c; }
.score-label {
  font-size: 18px;
  font-weight: 500;
  color: #606266;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}
.stat-item {
  text-align: center;
  padding: 14px 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--primary-color, #409eff);
}
.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 通用section */
.readability-section, .issues-section, .frequency-section, .suggestions-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

/* 可读性 */
.readability-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.readability-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ri-label {
  font-size: 13px;
  color: #606266;
  width: 140px;
  flex-shrink: 0;
}
.ri-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  min-width: 50px;
}
.ri-level {
  font-size: 12px;
  color: #909399;
}
.ri-bar {
  flex: 1;
  height: 8px;
  background: #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}
.ri-bar-fill {
  height: 100%;
  background: var(--primary-color, #409eff);
  border-radius: 4px;
  transition: width 0.3s;
}
.ri-bar-fill.dialogue {
  background: #e6a23c;
}

/* 问题列表 */
.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.group-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.group-dot.error { background: #f56c6c; }
.group-dot.warning { background: #e6a23c; }
.group-dot.info { background: #909399; }
.issue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.issue-item {
  padding: 10px 12px;
  border-radius: 6px;
  background: #f9fafc;
  border: 1px solid #ebeef5;
}
.issue-message {
  font-size: 13px;
  color: #303133;
  line-height: 1.5;
}
.issue-suggestion {
  font-size: 12px;
  color: #67c23a;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 用词频率 */
.freq-chart {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.freq-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.freq-rank {
  font-size: 12px;
  color: #909399;
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}
.freq-word {
  font-size: 13px;
  color: #303133;
  width: 80px;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.freq-bar-bg {
  flex: 1;
  height: 16px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}
.freq-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color, #409eff), #79bbff);
  border-radius: 3px;
  transition: width 0.3s;
  min-width: 2px;
}
.freq-count {
  font-size: 12px;
  color: #606266;
  width: 30px;
  text-align: right;
  flex-shrink: 0;
}

/* 建议 */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.suggestion-item {
  font-size: 13px;
  color: #606266;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.6;
}
.suggestion-item .el-icon {
  margin-top: 3px;
  color: var(--primary-color, #409eff);
  flex-shrink: 0;
}

/* 阈值配置 */
.config-collapse {
  margin-top: 20px;
}
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.config-label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

/* 响应式 */
@media (max-width: 900px) {
  .analysis-layout {
    flex-direction: column;
  }
  .input-panel {
    width: 100%;
  }
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

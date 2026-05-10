<template>
  <div class="novel-workshop">
    <!-- 项目列表视图 -->
    <div v-if="!currentProject">
      <div class="page-header">
        <h2>📚 长篇小说创作工坊</h2>
        <el-button type="primary" @click="showNewProject = true"><el-icon><Plus /></el-icon> 新建项目</el-button>
      </div>

      <div class="projects-grid" v-if="projects.length > 0">
        <el-card v-for="p in projects" :key="p.id" class="project-card" shadow="hover" @click="openProject(p)">
          <div class="project-icon">📖</div>
          <h3>{{ p.name }}</h3>
          <div class="project-meta">
            <el-tag size="small">{{ p.genre }}</el-tag>
            <span>{{ formatWordCount(p.stats?.totalWords || 0) }}</span>
            <span>{{ p.stats?.completedChapters || 0 }}/{{ p.stats?.totalChapters || 0 }}章</span>
          </div>
          <div class="project-progress">
            <el-progress :percentage="projectProgress(p)" :stroke-width="6" />
          </div>
          <div class="project-actions">
            <el-button type="primary" link size="small" @click.stop="openProject(p)">打开</el-button>
            <el-button type="danger" link size="small" @click.stop="handleDeleteProject(p.id)">删除</el-button>
          </div>
        </el-card>
      </div>
      <el-empty v-else description="暂无项目，点击右上角新建">
        <el-button type="primary" @click="showNewProject = true">新建项目</el-button>
      </el-empty>
    </div>

    <!-- 项目工作区 -->
    <div v-else class="workspace">
      <!-- 顶部导航 -->
      <div class="workspace-header">
        <el-button link @click="currentProject = null"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
        <h3>{{ currentProject.name }}</h3>
        <div class="header-actions">
          <el-button type="primary" link @click="exportCurrentProject">导出</el-button>
          <el-button type="success" link @click="saveCurrentProject">保存</el-button>
        </div>
      </div>

      <!-- 工作区Tab -->
      <el-tabs v-model="activeTab">
        <!-- Tab1: 项目概览 -->
        <el-tab-pane label="📋 项目概览" name="overview">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="类型">{{ currentProject.genre }}</el-descriptions-item>
            <el-descriptions-item label="目标字数">{{ formatWordCount(currentProject.targetWordCount) }}</el-descriptions-item>
            <el-descriptions-item label="已完成">{{ formatWordCount(currentProject.stats?.totalWords || 0) }} ({{ projectProgress(currentProject) }}%)</el-descriptions-item>
            <el-descriptions-item label="卷数">{{ currentProject.volumes.length }}</el-descriptions-item>
            <el-descriptions-item label="已完成章节">{{ currentProject.stats?.completedChapters || 0 }}</el-descriptions-item>
            <el-descriptions-item label="角色数">{{ currentProject.characters.length }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- Tab2: 原著分析 -->
        <el-tab-pane label="🔍 原著分析" name="analysis">
          <el-upload drag :auto-upload="false" :on-change="handleAnalysisFile" accept=".txt,.md">
            <el-icon class="el-icon--upload" style="font-size: 36px; color: #409eff;"><Upload /></el-icon>
            <div class="el-upload__text">拖放原著文本文件进行结构分析</div>
            <template #tip><div class="el-upload__tip">建议上传10万字以上的文本以获得更准确的分析</div></template>
          </el-upload>

          <div v-if="structureAnalysis" class="analysis-result">
            <el-divider>结构分析报告</el-divider>
            <el-tabs v-model="analysisTab">
              <el-tab-pane label="叙事结构" name="narrative">
                <el-descriptions :column="1" border size="small">
                  <el-descriptions-item label="剧情弧线">{{ structureAnalysis.narrativeStructure?.arcPattern }}</el-descriptions-item>
                  <el-descriptions-item label="节奏模式">{{ structureAnalysis.narrativeStructure?.pacingPattern }}</el-descriptions-item>
                  <el-descriptions-item label="悬念频率">{{ structureAnalysis.narrativeStructure?.cliffhangerFrequency }}</el-descriptions-item>
                  <el-descriptions-item label="张力曲线">{{ structureAnalysis.narrativeStructure?.tensionCurve }}</el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="力量体系" name="power">
                <el-descriptions :column="1" border size="small">
                  <el-descriptions-item label="体系名称">{{ structureAnalysis.powerSystem?.systemName }}</el-descriptions-item>
                  <el-descriptions-item label="等级划分">{{ (structureAnalysis.powerSystem?.ranks || []).join(' → ') }}</el-descriptions-item>
                  <el-descriptions-item label="升级速度">{{ structureAnalysis.powerSystem?.progressionSpeed }}</el-descriptions-item>
                  <el-descriptions-item label="突破机制">{{ structureAnalysis.powerSystem?.breakthroughMechanism }}</el-descriptions-item>
                  <el-descriptions-item label="战斗风格">{{ structureAnalysis.powerSystem?.combatStyle }}</el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="角色原型" name="characters">
                <el-descriptions :column="1" border size="small">
                  <el-descriptions-item label="主角类型">{{ structureAnalysis.characterArchetypes?.protagonistType }}</el-descriptions-item>
                  <el-descriptions-item label="主角特质">{{ (structureAnalysis.characterArchetypes?.protagonistTraits || []).join('、') }}</el-descriptions-item>
                  <el-descriptions-item label="对手类型">{{ (structureAnalysis.characterArchetypes?.rivalTypes || []).join('、') }}</el-descriptions-item>
                  <el-descriptions-item label="成长模式">{{ structureAnalysis.characterArchetypes?.characterGrowthPattern }}</el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="情节模式" name="plot">
                <el-descriptions :column="1" border size="small">
                  <el-descriptions-item label="开篇钩子">{{ structureAnalysis.plotPatterns?.openingHook }}</el-descriptions-item>
                  <el-descriptions-item label="冲突升级">{{ structureAnalysis.plotPatterns?.conflictEscalation }}</el-descriptions-item>
                  <el-descriptions-item label="反复模式">{{ (structureAnalysis.plotPatterns?.recurringMotifs || []).join('、') }}</el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
            </el-tabs>
            <el-button type="primary" style="margin-top: 16px" @click="applyAnalysisToProject">应用到项目</el-button>
          </div>
        </el-tab-pane>

        <!-- Tab3: 角色工坊 -->
        <el-tab-pane label="👤 角色工坊" name="characters">
          <div class="characters-panel">
            <div class="panel-toolbar">
              <el-button type="primary" size="small" @click="showAddCharacter = true"><el-icon><Plus /></el-icon> AI创建角色</el-button>
              <el-button size="small" @click="showManualCharacter = true"><el-icon><Edit /></el-icon> 手动添加</el-button>
            </div>

            <el-table :data="currentProject.characters" border size="small" max-height="500">
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="gender" label="性别" width="60" />
              <el-table-column prop="powerLevel" label="力量等级" width="100" />
              <el-table-column prop="motivation" label="核心动机" />
              <el-table-column prop="personality" label="性格" show-overflow-tooltip />
              <el-table-column label="操作" width="140">
                <template #default="{ row, $index }">
                  <el-button type="primary" link size="small" @click="editCharacter($index)">编辑</el-button>
                  <el-button type="danger" link size="small" @click="removeCharacter($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- Tab4: 世界观 -->
        <el-tab-pane label="🌍 世界观" name="world">
          <div v-if="currentProject.worldSetting" class="world-panel">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="世界名称">{{ currentProject.worldSetting.worldName }}</el-descriptions-item>
              <el-descriptions-item label="世界类型">{{ currentProject.worldSetting.worldType }}</el-descriptions-item>
              <el-descriptions-item label="力量体系">{{ currentProject.worldSetting.powerSystem?.name }}</el-descriptions-item>
              <el-descriptions-item label="等级划分">{{ (currentProject.worldSetting.powerSystem?.ranks || []).map(r => r.name || r).join(' → ') }}</el-descriptions-item>
            </el-descriptions>
            <div class="world-sections">
              <h4>🗺️ 主要区域</h4>
              <div class="region-tags">
                <el-tag v-for="(r, i) in (currentProject.worldSetting.geography?.regions || [])" :key="i" style="margin: 4px">{{ r.name }}</el-tag>
              </div>
              <h4>⚔️ 主要势力</h4>
              <div class="faction-tags">
                <el-tag v-for="(f, i) in (currentProject.worldSetting.factions || [])" :key="i" type="warning" style="margin: 4px">{{ f.name }} ({{ f.strength }})</el-tag>
              </div>
            </div>
          </div>
          <div v-else>
            <el-empty description="尚未构建世界观">
              <el-button type="primary" @click="generateWorld">AI生成世界观</el-button>
            </el-empty>
          </div>
        </el-tab-pane>

        <!-- Tab5: 卷章管理 -->
        <el-tab-pane label="📝 卷章管理" name="volumes">
          <div class="volumes-panel">
            <div class="panel-toolbar">
              <el-button type="primary" size="small" @click="addVolume"><el-icon><Plus /></el-icon> 添加卷</el-button>
              <el-button type="success" size="small" @click="generateAllOutlines" :loading="isGeneratingOutline">AI生成所有卷大纲</el-button>
            </div>

            <el-collapse v-model="expandedVolumes">
              <el-collapse-item v-for="(vol, vi) in currentProject.volumes" :key="vi" :name="vi">
                <template #title>
                  <div class="volume-title">
                    <span>{{ vol.name }}</span>
                    <el-tag size="small" :type="vol.status === 'completed' ? 'success' : vol.status === 'writing' ? 'warning' : 'info'">{{ vol.status === 'completed' ? '已完成' : vol.status === 'writing' ? '写作中' : '计划中' }}</el-tag>
                    <span class="chapter-count">{{ (vol.chapters || []).filter(c => c.status === 'completed').length }}/{{ vol.chapterCount }}章</span>
                  </div>
                </template>

                <div v-if="vol.outline" class="volume-outline">
                  <p>{{ vol.outline }}</p>
                </div>

                <!-- 章节列表 -->
                <el-table :data="vol.chapters || []" border size="small" max-height="300" style="margin-top: 12px">
                  <el-table-column prop="chapterIndex" label="#" width="50" />
                  <el-table-column prop="title" label="章节标题" />
                  <el-table-column prop="wordCount" label="字数" width="80">
                    <template #default="{ row }">{{ row.wordCount || '-' }}</template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="80">
                    <template #default="{ row }">
                      <el-tag size="small" :type="row.status === 'completed' ? 'success' : row.status === 'writing' ? 'warning' : 'info'">
                        {{ row.status === 'completed' ? '完成' : row.status === 'writing' ? '写作中' : '待写' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template #default="{ row }">
                      <el-button type="primary" link size="small" @click="viewChapter(vol, row)">查看</el-button>
                      <el-button type="success" link size="small" @click="writeChapter(vol, row)" :loading="row._writing">生成</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="volume-actions">
                  <el-button size="small" @click="generateVolumeOutline(vol)" :loading="vol._generating">生成卷大纲</el-button>
                  <el-button type="success" size="small" @click="batchWriteChapters(vol)" :loading="vol._batchWriting">批量生成章节</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <!-- Tab6: 批量生成 -->
        <el-tab-pane label="🚀 批量生成" name="batch">
          <el-card>
            <h3>批量章节生成</h3>
            <p class="desc">AI将基于卷大纲、世界观和角色设定，逐章生成内容。每生成一章会自动生成摘要用于后续章节的上下文参考。</p>

            <el-form label-width="120px" style="margin-top: 20px">
              <el-form-item label="起始卷">
                <el-select v-model="batchConfig.startVolume" style="width: 200px">
                  <el-option v-for="(v, i) in currentProject.volumes" :key="i" :label="v.name" :value="i" />
                </el-select>
              </el-form-item>
              <el-form-item label="起始章节">
                <el-input-number v-model="batchConfig.startChapter" :min="1" />
              </el-form-item>
              <el-form-item label="生成章数">
                <el-input-number v-model="batchConfig.chapterCount" :min="1" :max="20" />
              </el-form-item>
              <el-form-item label="每章字数">
                <el-select v-model="batchConfig.wordsPerChapter" style="width: 200px">
                  <el-option label="2000字" :value="2000" />
                  <el-option label="3000字" :value="3000" />
                  <el-option label="5000字" :value="5000" />
                </el-select>
              </el-form-item>
            </el-form>

            <div v-if="batchStatus.isRunning" class="batch-progress">
              <el-progress :percentage="batchStatus.progress" :stroke-width="10" />
              <p>{{ batchStatus.message }}</p>
              <p class="sub">已完成 {{ batchStatus.completed }}/{{ batchStatus.total }} 章，共 {{ formatWordCount(batchStatus.totalWords) }}</p>
            </div>

            <el-button type="primary" size="large" :loading="batchStatus.isRunning" :disabled="!canBatchWrite" @click="startBatchWrite">
              <el-icon><VideoPlay /></el-icon> {{ batchStatus.isRunning ? '生成中...' : '开始批量生成' }}
            </el-button>
            <el-button v-if="batchStatus.isRunning" size="large" @click="stopBatchWrite">停止</el-button>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新建项目对话框 -->
    <el-dialog v-model="showNewProject" title="新建长篇小说项目" width="500px">
      <el-form :model="newProjectForm" label-width="100px">
        <el-form-item label="项目名称"><el-input v-model="newProjectForm.name" placeholder="如：苍穹破" /></el-form-item>
        <el-form-item label="小说类型">
          <el-select v-model="newProjectForm.genre" style="width: 100%">
            <el-option label="玄幻" value="玄幻" />
            <el-option label="都市" value="都市" />
            <el-option label="仙侠" value="仙侠" />
            <el-option label="科幻" value="科幻" />
            <el-option label="历史" value="历史" />
            <el-option label="悬疑" value="悬疑" />
            <el-option label="言情" value="言情" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标字数">
          <el-select v-model="newProjectForm.targetWordCount" style="width: 100%">
            <el-option label="100万字" :value="1000000" />
            <el-option label="200万字" :value="2000000" />
            <el-option label="300万字" :value="3000000" />
            <el-option label="500万字" :value="5000000" />
            <el-option label="800万字" :value="8000000" />
          </el-select>
        </el-form-item>
        <el-form-item label="卷数">
          <el-input-number v-model="newProjectForm.volumeCount" :min="1" :max="30" />
        </el-form-item>
        <el-form-item label="每卷章数">
          <el-input-number v-model="newProjectForm.chaptersPerVolume" :min="20" :max="200" :step="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNewProject = false">取消</el-button>
        <el-button type="primary" @click="createProject">创建</el-button>
      </template>
    </el-dialog>

    <!-- 手动添加角色对话框 -->
    <el-dialog v-model="showManualCharacter" title="手动添加角色" width="500px">
      <el-form :model="manualCharacter" label-width="80px">
        <el-form-item label="姓名"><el-input v-model="manualCharacter.name" /></el-form-item>
        <el-form-item label="性别"><el-select v-model="manualCharacter.gender" style="width: 100%"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item>
        <el-form-item label="力量等级"><el-input v-model="manualCharacter.powerLevel" /></el-form-item>
        <el-form-item label="核心动机"><el-input v-model="manualCharacter.motivation" /></el-form-item>
        <el-form-item label="性格"><el-input v-model="manualCharacter.personality" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="背景"><el-input v-model="manualCharacter.background" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showManualCharacter = false">取消</el-button>
        <el-button type="primary" @click="addManualCharacter">添加</el-button>
      </template>
    </el-dialog>

    <!-- 章节查看对话框 -->
    <el-dialog v-model="showChapterView" :title="viewingChapter?.title" width="700px" top="5vh">
      <div class="chapter-view-content" v-html="renderMarkdown(viewingChapter?.content || '')"></div>
      <template #footer>
        <el-button @click="showChapterView = false">关闭</el-button>
        <el-button type="primary" @click="copyChapterContent">复制内容</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useNovelStore } from '@/stores/novel'
import { marked } from 'marked'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowLeft, Upload, Edit, VideoPlay } from '@element-plus/icons-vue'
import {
  novelStructureAnalysisPrompt, createCharacterPrompt, buildWorldPrompt,
  generateVolumeOutlinePrompt, generateChapterPrompt, generateChapterSummaryPrompt,
  createNovelProject, createVolume, createChapter,
  getProjects, saveProject, deleteProject as deleteProjectFn, exportProject
} from '../config/novelEngine.js'
import { extractStyleSample, validateUploadFile, readTextFile } from '../config/styleImitation.js'

const novelStore = useNovelStore()

// 状态
const projects = ref([])
const currentProject = ref(null)
const activeTab = ref('overview')
const showNewProject = ref(false)
const showAddCharacter = ref(false)
const showManualCharacter = ref(false)
const showChapterView = ref(false)
const viewingChapter = ref(null)
const expandedVolumes = ref([0])
const analysisTab = ref('narrative')
const structureAnalysis = ref(null)
const isGeneratingOutline = ref(false)
const batchStopped = ref(false)

const newProjectForm = reactive({ name: '', genre: '玄幻', targetWordCount: 5000000, volumeCount: 10, chaptersPerVolume: 60 })
const manualCharacter = reactive({ name: '', gender: '男', powerLevel: '', motivation: '', personality: '', background: '' })
const batchConfig = reactive({ startVolume: 0, startChapter: 1, chapterCount: 5, wordsPerChapter: 3000 })
const batchStatus = reactive({ isRunning: false, progress: 0, completed: 0, total: 0, totalWords: 0, message: '' })

const canBatchWrite = computed(() => currentProject.value && currentProject.value.volumes.length > 0)

// 方法
const formatWordCount = (n) => n >= 10000 ? (n / 10000).toFixed(1) + '万字' : n + '字'
const projectProgress = (p) => p.targetWordCount > 0 ? Math.min(100, Math.round(((p.stats?.totalWords || 0) / p.targetWordCount) * 100)) : 0

const createProject = () => {
  if (!newProjectForm.name) { ElMessage.warning('请输入项目名称'); return }
  const project = createNovelProject(newProjectForm)
  for (let i = 0; i < newProjectForm.volumeCount; i++) {
    project.volumes.push(createVolume(i + 1, `第${i + 1}卷`, newProjectForm.chaptersPerVolume))
    project.stats.totalChapters += newProjectForm.chaptersPerVolume
  }
  saveProject(project)
  projects.value = getProjects()
  showNewProject.value = false
  openProject(project)
  ElMessage.success('项目创建成功！')
}

const openProject = (p) => { currentProject.value = p; activeTab.value = 'overview' }
const saveCurrentProject = () => { saveProject(currentProject.value); ElMessage.success('已保存') }
const exportCurrentProject = () => { exportProject(currentProject.value); ElMessage.success('已导出') }

const handleDeleteProject = async (id) => {
  await ElMessageBox.confirm('确定删除此项目？', '提示', { type: 'warning' })
  deleteProjectFn(id)
  projects.value = getProjects()
  ElMessage.success('已删除')
}

// 原著分析
const handleAnalysisFile = async (file) => {
  const validation = validateUploadFile(file.raw)
  if (!validation.valid) { ElMessage.error(validation.error); return }
  try {
    const text = await readTextFile(file.raw)
    const sample = extractStyleSample(text, 30000)
    const prompt = novelStructureAnalysisPrompt + '\n' + sample
    ElMessage.info('正在分析原著结构，可能需要较长时间...')
    const response = await novelStore.generateContent(prompt)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      structureAnalysis.value = JSON.parse(jsonMatch[0])
      ElMessage.success('原著结构分析完成！')
    } else { ElMessage.warning('分析结果解析失败') }
  } catch (e) { ElMessage.error('分析失败: ' + e.message) }
}

const applyAnalysisToProject = () => {
  if (!structureAnalysis.value || !currentProject.value) return
  currentProject.value.structureAnalysis = structureAnalysis.value
  ElMessage.success('已应用到项目')
}

// 角色
const addManualCharacter = () => {
  if (!manualCharacter.name) { ElMessage.warning('请输入角色姓名'); return }
  currentProject.value.characters.push({ ...manualCharacter })
  showManualCharacter.value = false
  ElMessage.success('角色已添加')
}

const removeCharacter = (idx) => { currentProject.value.characters.splice(idx, 1) }
const editCharacter = (idx) => { ElMessage.info('编辑功能开发中') }

// 世界观
const generateWorld = async () => {
  if (!novelStore.isApiConfigured) { ElMessage.warning('请先配置API'); return }
  try {
    const ref = structureAnalysis.value ? JSON.stringify(structureAnalysis.value.powerSystem) : '玄幻类力量体系'
    const prompt = buildWorldPrompt(currentProject.value.genre, '大陆级', ref)
    const response = await novelStore.generateContent(prompt)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      currentProject.value.worldSetting = JSON.parse(jsonMatch[0])
      saveProject(currentProject.value)
      ElMessage.success('世界观生成完成！')
    }
  } catch (e) { ElMessage.error('生成失败: ' + e.message) }
}

// 卷章管理
const addVolume = () => {
  const idx = currentProject.value.volumes.length + 1
  currentProject.value.volumes.push(createVolume(idx, `第${idx}卷`, 60))
  currentProject.value.stats.totalChapters += 60
}

const generateVolumeOutline = async (vol) => {
  if (!novelStore.isApiConfigured) { ElMessage.warning('请先配置API'); return }
  vol._generating = true
  try {
    const worldStr = currentProject.value.worldSetting ? JSON.stringify(currentProject.value.worldSetting) : ''
    const charStr = currentProject.value.characters.map(c => `${c.name}: ${c.personality}`).join('\n')
    const structStr = currentProject.value.structureAnalysis ? JSON.stringify(currentProject.value.structureAnalysis) : ''
    const prompt = generateVolumeOutlinePrompt(structStr, worldStr, charStr, vol.index)
    const result = await novelStore.generateContent(prompt)
    vol.outline = result
    parseOutlineToChapters(vol, result)
    saveProject(currentProject.value)
    ElMessage.success(`${vol.name} 大纲生成完成！`)
  } catch (e) { ElMessage.error('生成失败: ' + e.message) }
  finally { vol._generating = false }
}

const parseOutlineToChapters = (vol, outline) => {
  const regex = /###\s*第(\d+)章\s*(.+?)\n([\s\S]*?)(?=###|$)/g
  const chapters = []
  let match
  while ((match = regex.exec(outline)) !== null) {
    chapters.push(createChapter(vol.index, parseInt(match[1]), `第${match[1]}章 ${match[2].trim()}`, match[3].trim()))
  }
  vol.chapters = chapters
  vol.chapterCount = Math.max(vol.chapterCount, chapters.length)
}

const generateAllOutlines = async () => {
  isGeneratingOutline.value = true
  try {
    for (const vol of currentProject.value.volumes) {
      if (!vol.outline) await generateVolumeOutline(vol)
    }
    ElMessage.success('所有卷大纲生成完成！')
  } finally { isGeneratingOutline.value = false }
}

// 章节生成
const writeChapter = async (vol, chapter) => {
  if (!novelStore.isApiConfigured) { ElMessage.warning('请先配置API'); return }
  if (!chapter.outline) { ElMessage.warning('请先生成卷大纲'); return }
  chapter._writing = true
  try {
    const prevSummaries = getPrevChapterSummaries(vol.index, chapter.chapterIndex)
    const worldStr = currentProject.value.worldSetting ? JSON.stringify(currentProject.value.worldSetting) : ''
    const charStr = currentProject.value.characters.map(c => `${c.name}(${c.powerLevel}): ${c.personality}`).join('\n')
    const powerStr = JSON.stringify(currentProject.value.powerStates || {})
    const prompt = generateChapterPrompt({ title: chapter.title, outline: chapter.outline }, prevSummaries, worldStr, charStr, powerStr)
    const result = await novelStore.generateContent(prompt)
    chapter.content = result
    chapter.wordCount = result.length
    chapter.status = 'completed'
    // 生成摘要
    const summaryPrompt = generateChapterSummaryPrompt(result)
    const summary = await novelStore.generateContent(summaryPrompt)
    chapter.summary = summary
    currentProject.value.chapterSummaries[`${vol.index}-${chapter.chapterIndex}`] = summary
    currentProject.value.stats.completedChapters++
    currentProject.value.stats.totalWords += result.length
    saveProject(currentProject.value)
    ElMessage.success(`${chapter.title} 生成完成！(${result.length}字)`)
  } catch (e) { ElMessage.error('生成失败: ' + e.message) }
  finally { chapter._writing = false }
}

const viewChapter = (vol, chapter) => { viewingChapter.value = chapter; showChapterView.value = true }
const copyChapterContent = () => { navigator.clipboard.writeText(viewingChapter.value?.content || ''); ElMessage.success('已复制') }

const getPrevChapterSummaries = (volIdx, chapIdx) => {
  const summaries = []
  for (let i = Math.max(1, chapIdx - 3); i < chapIdx; i++) {
    const key = `${volIdx}-${i}`
    if (currentProject.value.chapterSummaries[key]) summaries.push(currentProject.value.chapterSummaries[key])
  }
  return summaries.join('\n\n')
}

// 批量生成
const startBatchWrite = async () => {
  if (!canBatchWrite.value) return
  batchStopped.value = false
  batchStatus.isRunning = true
  batchStatus.completed = 0
  batchStatus.total = batchConfig.chapterCount
  batchStatus.totalWords = 0
  batchStatus.progress = 0

  let volIdx = batchConfig.startVolume
  let chapIdx = batchConfig.startChapter

  for (let i = 0; i < batchConfig.chapterCount; i++) {
    if (batchStopped.value) break
    const vol = currentProject.value.volumes[volIdx]
    if (!vol) break
    const chapter = vol.chapters?.find(c => c.chapterIndex === chapIdx)
    if (!chapter || chapter.status === 'completed') { chapIdx++; continue }

    batchStatus.message = `正在生成：${vol.name} - ${chapter.title}`
    try {
      await writeChapter(vol, chapter)
      batchStatus.totalWords += (chapter.wordCount || 0)
    } catch (e) { console.error('章节生成失败:', e) }

    batchStatus.completed++
    batchStatus.progress = Math.round((batchStatus.completed / batchStatus.total) * 100)
    chapIdx++
    if (chapIdx > (vol.chapterCount || 60)) { volIdx++; chapIdx = 1 }
  }

  batchStatus.isRunning = false
  batchStatus.message = batchStopped.value ? '已停止' : '批量生成完成！'
  ElMessage.success(batchStatus.message)
}

const stopBatchWrite = () => { batchStopped.value = true }

const batchWriteChapters = async (vol) => {
  batchConfig.startVolume = currentProject.value.volumes.indexOf(vol)
  batchConfig.startChapter = 1
  batchConfig.chapterCount = Math.min(10, (vol.chapters || []).filter(c => c.status !== 'completed').length || 5)
  await startBatchWrite()
}

const renderMarkdown = (text) => text ? marked(text) : ''

onMounted(() => { projects.value = getProjects() })
</script>

<style scoped>
.novel-workshop { max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h2 { margin: 0; }

.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.project-card { cursor: pointer; transition: all 0.3s; text-align: center; }
.project-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.project-icon { font-size: 48px; margin-bottom: 8px; }
.project-card h3 { margin: 0 0 8px; font-size: 16px; }
.project-meta { display: flex; justify-content: center; gap: 12px; font-size: 12px; color: #909399; margin-bottom: 12px; }
.project-progress { padding: 0 20px; }
.project-actions { margin-top: 12px; }

.workspace-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e4e7ed; }
.workspace-header h3 { margin: 0; flex: 1; }
.header-actions { display: flex; gap: 8px; }

.panel-toolbar { margin-bottom: 16px; }
.volume-title { display: flex; align-items: center; gap: 12px; flex: 1; }
.volume-title span:first-child { font-weight: 600; }
.chapter-count { font-size: 12px; color: #909399; }
.volume-outline { padding: 12px; background: #f5f7fa; border-radius: 6px; font-size: 13px; line-height: 1.8; }
.volume-actions { margin-top: 12px; display: flex; gap: 8px; }

.analysis-result { margin-top: 20px; }
.world-sections { margin-top: 20px; }
.world-sections h4 { margin: 16px 0 8px; }
.region-tags, .faction-tags { display: flex; flex-wrap: wrap; }

.batch-progress { padding: 24px; background: #f5f7fa; border-radius: 8px; margin: 20px 0; }
.batch-progress p { text-align: center; margin: 8px 0 0; color: #409eff; }
.batch-progress .sub { font-size: 12px; color: #909399; }

.desc { font-size: 13px; color: #909399; margin: 8px 0 0; }

.chapter-view-content { max-height: 65vh; overflow-y: auto; font-size: 15px; line-height: 2; }
.chapter-view-content :deep(p) { margin: 12px 0; text-indent: 2em; }
</style>

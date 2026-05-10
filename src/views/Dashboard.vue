<template>
  <div class="dashboard-container" :class="themeClass">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ 'collapsed': isCollapse }">
      <div class="logo">
        <div class="logo-icon">☁️</div>
        <h2 v-if="!isCollapse">云书</h2>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        @select="handleMenuSelect"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <!-- AI创作 -->
        <div class="menu-group-title" v-if="!isCollapse">AI 创作</div>
        <el-menu-item index="/master">
          <el-icon><MagicStick /></el-icon>
          <template #title>大师创作</template>
        </el-menu-item>
        <el-menu-item index="/imitation">
          <el-icon><EditPen /></el-icon>
          <template #title>风格仿写</template>
        </el-menu-item>
        <el-menu-item index="/workshop">
          <el-icon><Notebook /></el-icon>
          <template #title>长篇工坊</template>
        </el-menu-item>
        <el-menu-item index="/short-story">
          <el-icon><Memo /></el-icon>
          <template #title>短文写作</template>
        </el-menu-item>

        <!-- 写作工具 -->
        <div class="menu-group-title" v-if="!isCollapse">写作工具</div>
        <el-menu-item index="/focus">
          <el-icon><Monitor /></el-icon>
          <template #title>专注模式</template>
        </el-menu-item>
        <el-menu-item index="/analysis">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>质量分析</template>
        </el-menu-item>
        <el-menu-item index="/ideas">
          <el-icon><Lightbulb /></el-icon>
          <template #title>灵感工坊</template>
        </el-menu-item>
        <el-menu-item index="/cards">
          <el-icon><Postcard /></el-icon>
          <template #title>索引卡片</template>
        </el-menu-item>
        <el-menu-item index="/multi-view">
          <el-icon><Grid /></el-icon>
          <template #title>四视图编辑</template>
        </el-menu-item>

        <!-- 项目管理 -->
        <div class="menu-group-title" v-if="!isCollapse">项目管理</div>
        <el-menu-item index="/novels">
          <el-icon><Document /></el-icon>
          <template #title>小说列表</template>
        </el-menu-item>
        <el-menu-item index="/chapters">
          <el-icon><Files /></el-icon>
          <template #title>章节管理</template>
        </el-menu-item>
        <el-menu-item index="/writer">
          <el-icon><Edit /></el-icon>
          <template #title>写作编辑器</template>
        </el-menu-item>
        <el-menu-item index="/graph">
          <el-icon><Share /></el-icon>
          <template #title>章节图谱</template>
        </el-menu-item>
        <el-menu-item index="/mega-novel">
          <el-icon><Notebook /></el-icon>
          <template #title>百万字管理</template>
        </el-menu-item>

        <!-- 叙事工程 -->
        <div class="menu-group-title" v-if="!isCollapse">叙事工程</div>
        <el-menu-item index="/foreshadowing">
          <el-icon><Connection /></el-icon>
          <template #title>伏笔管理</template>
        </el-menu-item>
        <el-menu-item index="/narrative">
          <el-icon><SetUp /></el-icon>
          <template #title>叙事结构</template>
        </el-menu-item>
        <el-menu-item index="/literary">
          <el-icon><Reading /></el-icon>
          <template #title>文学工坊</template>
        </el-menu-item>

        <!-- 资源库 -->
        <div class="menu-group-title" v-if="!isCollapse">资源库</div>
        <el-menu-item index="/prompts">
          <el-icon><ChatLineSquare /></el-icon>
          <template #title>提示词库</template>
        </el-menu-item>
        <el-menu-item index="/genres">
          <el-icon><Collection /></el-icon>
          <template #title>小说类型</template>
        </el-menu-item>
        <el-menu-item index="/tools">
          <el-icon><Tools /></el-icon>
          <template #title>工具库</template>
        </el-menu-item>
        <el-menu-item index="/book-analysis">
          <el-icon><Reading /></el-icon>
          <template #title>拆书工具</template>
        </el-menu-item>

        <!-- 导出与协作 -->
        <div class="menu-group-title" v-if="!isCollapse">导出协作</div>
        <el-menu-item index="/export">
          <el-icon><Download /></el-icon>
          <template #title>导出中心</template>
        </el-menu-item>
        <el-menu-item index="/collaboration">
          <el-icon><User /></el-icon>
          <template #title>协作中心</template>
        </el-menu-item>
        <el-menu-item index="/collaboration-hub">
          <el-icon><UserFilled /></el-icon>
          <template #title>协作中心</template>
        </el-menu-item>
        <el-menu-item index="/review">
          <el-icon><View /></el-icon>
          <template #title>审阅模式</template>
        </el-menu-item>

        <!-- 扩展 -->
        <div class="menu-group-title" v-if="!isCollapse">扩展</div>
        <el-menu-item index="/plugins">
          <el-icon><Opportunity /></el-icon>
          <template #title>插件市场</template>
        </el-menu-item>
        <el-menu-item index="/gamification">
          <el-icon><Trophy /></el-icon>
          <template #title>成就中心</template>
        </el-menu-item>

        <!-- 系统 -->
        <div class="menu-group-title" v-if="!isCollapse">系统</div>
        <el-menu-item index="/goals">
          <el-icon><Aim /></el-icon>
          <template #title>写作目标</template>
        </el-menu-item>
        <el-menu-item index="/billing">
          <el-icon><CreditCard /></el-icon>
          <template #title>Token统计</template>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>

      <!-- 侧边栏底部版本信息 -->
      <div class="sidebar-footer" v-if="!isCollapse">
        <span class="version-tag">v2.1.0</span>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="header">
        <div class="header-left">
          <el-button type="text" @click="toggleSidebar" class="collapse-btn">
            <el-icon><Expand v-if="isCollapse" /><Fold v-else /></el-icon>
          </el-button>
          <span class="page-title">{{ pageTitle }}</span>
        </div>

        <div class="header-right">
          <!-- 命令面板快捷键提示 -->
          <el-tooltip content="Ctrl+K 打开命令面板" placement="bottom">
            <el-button size="small" @click="showCommandPalette = true" class="cmd-btn">
              <el-icon><Search /></el-icon>
              <span class="cmd-hint">Ctrl+K</span>
            </el-button>
          </el-tooltip>

          <!-- 主题切换 -->
          <el-dropdown @command="handleThemeChange" trigger="click">
            <el-button type="primary" size="small">
              <el-icon><Brush /></el-icon>
              主题
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="default" :class="{ 'is-active': currentTheme === 'default' }">
                  <span class="theme-preview default"></span> 默认蓝
                </el-dropdown-item>
                <el-dropdown-item command="dark" :class="{ 'is-active': currentTheme === 'dark' }">
                  <span class="theme-preview dark"></span> 暗夜黑
                </el-dropdown-item>
                <el-dropdown-item command="green" :class="{ 'is-active': currentTheme === 'green' }">
                  <span class="theme-preview green"></span> 护眼绿
                </el-dropdown-item>
                <el-dropdown-item command="purple" :class="{ 'is-active': currentTheme === 'purple' }">
                  <span class="theme-preview purple"></span> 优雅紫
                </el-dropdown-item>
                <el-dropdown-item command="warm" :class="{ 'is-active': currentTheme === 'warm' }">
                  <span class="theme-preview warm"></span> 暖阳橙
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 模型选择 -->
          <div class="model-selector" v-if="isApiConfigured">
            <el-select v-model="currentModel" @change="handleModelChange" size="small" style="width: 180px" placeholder="选择模型">
              <el-option v-for="model in availableModels" :key="model.id" :label="model.name" :value="model.id">
                <span>{{ model.name }}</span>
                <span v-if="model.description" style="float: right; color: #8492a6; font-size: 12px">{{ model.description }}</span>
              </el-option>
            </el-select>
          </div>

          <!-- API配置 -->
          <el-button @click="showApiConfig = true" :type="isApiConfigured ? 'success' : 'warning'" size="small">
            <el-icon><Key /></el-icon>
            {{ isApiConfigured ? 'API已配置' : '配置API' }}
          </el-button>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="content">
        <router-view />
      </div>
    </div>

    <!-- API配置对话框 -->
    <el-dialog v-model="showApiConfig" title="API配置" width="600px">
      <ApiConfig @close="showApiConfig = false" />
    </el-dialog>

    <!-- 命令面板对话框 -->
    <el-dialog v-model="showCommandPalette" title="命令面板" width="500px" :close-on-click-modal="true" class="command-palette-dialog">
      <el-input v-model="commandQuery" placeholder="搜索命令、页面、功能..." size="large" clearable ref="cmdInputRef" />
      <div class="command-list">
        <div
          v-for="cmd in filteredCommands"
          :key="cmd.path"
          class="command-item"
          @click="executeCommand(cmd)"
        >
          <el-icon><component :is="cmd.icon" /></el-icon>
          <div class="command-info">
            <span class="command-name">{{ cmd.name }}</span>
            <span class="command-desc">{{ cmd.desc }}</span>
          </div>
          <span class="command-shortcut" v-if="cmd.shortcut">{{ cmd.shortcut }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNovelStore } from '@/stores/novel'
import {
  House, Document, ChatLineSquare, Collection, Notebook, Aim,
  CreditCard, Setting, Key, Tools, EditPen, DataAnalysis,
  Expand, Fold, Brush, MagicStick, Search, Download, User,
  Monitor, Lightbulb, Trophy, Opportunity, Memo, Files, Edit,
  Share, Connection, SetUp, Reading, Postcard, Grid, View, UserFilled
} from '@element-plus/icons-vue'
import ApiConfig from '@/components/ApiConfig.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const novelStore = useNovelStore()

// 响应式数据
const isCollapse = ref(false)
const showApiConfig = ref(false)
const showCommandPalette = ref(false)
const commandQuery = ref('')
const cmdInputRef = ref(null)
const activeMenu = ref('/')
const currentModel = ref('')
const currentTheme = ref('default')

// 计算属性
const isApiConfigured = computed(() => novelStore.isApiConfigured)
const apiConfig = computed(() => novelStore.apiConfig)
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 可用模型列表
const availableModels = computed(() => [
  { id: 'gpt-4o', name: 'GPT-4o', description: '最新多模态' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '轻量版' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '高性能' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '经典版' },
  { id: 'deepseek-chat', name: 'DeepSeek V3', description: '深度求索' },
  { id: 'deepseek-reasoner', name: 'DeepSeek R1', description: '推理模型' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Anthropic' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: '顶级性能' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Google' },
  { id: 'glm-4-plus', name: 'GLM-4 Plus', description: '智谱' }
])

// 页面标题映射
const pageTitle = computed(() => {
  const titleMap = {
    '/': '首页',
    '/master': '大师创作',
    '/imitation': '风格仿写',
    '/workshop': '长篇工坊',
    '/short-story': '短文写作',
    '/focus': '专注模式',
    '/analysis': '质量分析',
    '/ideas': '灵感工坊',
    '/cards': '索引卡片',
    '/multi-view': '四视图编辑器',
    '/novels': '小说列表',
    '/chapters': '章节管理',
    '/writer': '写作编辑器',
    '/graph': '章节图谱',
    '/mega-novel': '百万字管理',
    '/foreshadowing': '伏笔管理',
    '/narrative': '叙事结构',
    '/literary': '文学工坊',
    '/prompts': '提示词库',
    '/genres': '小说类型',
    '/tools': '工具库',
    '/book-analysis': '拆书工具',
    '/export': '导出中心',
    '/collaboration': '协作中心',
    '/collaboration-hub': '协作中心',
    '/review': '审阅模式',
    '/plugins': '插件市场',
    '/gamification': '成就中心',
    '/goals': '写作目标',
    '/billing': 'Token统计',
    '/settings': '系统设置'
  }
  return titleMap[route.path] || '首页'
})

// 命令面板命令列表
const commands = [
  { name: '首页', path: '/', desc: '回到首页', icon: 'House' },
  { name: '大师创作', path: '/master', desc: 'AI大师级文学创作', icon: 'MagicStick' },
  { name: '风格仿写', path: '/imitation', desc: '基于原著风格仿写', icon: 'EditPen' },
  { name: '长篇工坊', path: '/workshop', desc: '百万字长篇项目管理', icon: 'Notebook' },
  { name: '短文写作', path: '/short-story', desc: '快速短文创作', icon: 'Memo' },
  { name: '专注模式', path: '/focus', desc: '无干扰沉浸写作', icon: 'Monitor', shortcut: 'F11' },
  { name: '质量分析', path: '/analysis', desc: '文本质量检测与评分', icon: 'DataAnalysis' },
  { name: '灵感工坊', path: '/ideas', desc: '想法板、片段库、写作热身', icon: 'Lightbulb' },
  { name: '索引卡片', path: '/cards', desc: '卡片式内容组织', icon: 'Postcard' },
  { name: '四视图编辑器', path: '/multi-view', desc: '多视图同步编辑', icon: 'Grid' },
  { name: '小说列表', path: '/novels', desc: '管理所有小说项目', icon: 'Document' },
  { name: '章节管理', path: '/chapters', desc: '章节编辑与排序', icon: 'Files' },
  { name: '写作编辑器', path: '/writer', desc: '富文本写作编辑器', icon: 'Edit' },
  { name: '章节图谱', path: '/graph', desc: '章节关系图谱与时间线', icon: 'Share' },
  { name: '百万字管理', path: '/mega-novel', desc: '超长篇小说专用管理', icon: 'Notebook' },
  { name: '伏笔管理', path: '/foreshadowing', desc: '剧情伏笔追踪与回收', icon: 'Connection' },
  { name: '叙事结构', path: '/narrative', desc: '叙事元素建模与角色深度', icon: 'SetUp' },
  { name: '文学工坊', path: '/literary', desc: '严肃文学创作工具', icon: 'Reading' },
  { name: '提示词库', path: '/prompts', desc: '自定义提示词模板', icon: 'ChatLineSquare' },
  { name: '小说类型', path: '/genres', desc: '类型模板管理', icon: 'Collection' },
  { name: '工具库', path: '/tools', desc: '写作辅助工具集', icon: 'Tools' },
  { name: '拆书工具', path: '/book-analysis', desc: '分析拆解优秀作品', icon: 'Reading' },
  { name: '导出中心', path: '/export', desc: '多格式专业导出', icon: 'Download' },
  { name: '协作中心', path: '/collaboration-hub', desc: '分享、评论与版本对比', icon: 'UserFilled' },
  { name: '审阅模式', path: '/review', desc: '专业审阅与批注', icon: 'View' },
  { name: '插件市场', path: '/plugins', desc: '扩展功能插件', icon: 'Opportunity' },
  { name: '成就中心', path: '/gamification', desc: '成就、等级与写作统计', icon: 'Trophy' },
  { name: '写作目标', path: '/goals', desc: '设定与追踪写作目标', icon: 'Aim' },
  { name: 'Token统计', path: '/billing', desc: 'API调用消耗统计', icon: 'CreditCard' },
  { name: '系统设置', path: '/settings', desc: '应用配置与关于', icon: 'Setting' }
]

const filteredCommands = computed(() => {
  if (!commandQuery.value) return commands
  const q = commandQuery.value.toLowerCase()
  return commands.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
})

// 方法
const toggleSidebar = () => { isCollapse.value = !isCollapse.value }

const handleMenuSelect = (index) => { router.push(index) }

const handleThemeChange = (theme) => {
  currentTheme.value = theme
  localStorage.setItem('yunshu_theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
  ElMessage.success(`已切换到${getThemeName(theme)}`)
}

const getThemeName = (theme) => {
  const names = { 'default': '默认蓝', 'dark': '暗夜黑', 'green': '护眼绿', 'purple': '优雅紫', 'warm': '暖阳橙' }
  return names[theme] || theme
}

const handleModelChange = (modelId) => {
  novelStore.updateApiConfig({ selectedModel: modelId })
  const model = availableModels.value.find(m => m.id === modelId)
  ElMessage.success(`已切换到: ${model?.name || modelId}`)
}

const executeCommand = (cmd) => {
  showCommandPalette.value = false
  commandQuery.value = ''
  router.push(cmd.path)
}

// 全局快捷键
const handleKeydown = (e) => {
  // Ctrl+K 打开命令面板
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    showCommandPalette.value = true
    nextTick(() => { cmdInputRef.value?.focus() })
  }
  // Escape 关闭命令面板
  if (e.key === 'Escape' && showCommandPalette.value) {
    showCommandPalette.value = false
  }
}

// 初始化
const initializeApp = () => {
  const savedTheme = localStorage.getItem('yunshu_theme') || 'default'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
  if (isApiConfigured.value && apiConfig.value) {
    currentModel.value = apiConfig.value.selectedModel || 'gpt-4o'
  }
}

watch(() => route.path, (newPath) => { activeMenu.value = newPath }, { immediate: true })

onMounted(() => {
  initializeApp()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.sidebar {
  width: 220px;
  background-color: var(--sidebar-bg, #304156);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s, background-color 0.3s;
  overflow: hidden;
  position: relative;
}

.sidebar.collapsed { width: 64px; }
.sidebar.collapsed .logo h2 { display: none; }
.sidebar.collapsed .menu-group-title { display: none; }
.sidebar.collapsed .sidebar-footer { display: none; }

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sidebar-logo-bg, #2b3a4b);
  color: white;
  gap: 8px;
  flex-shrink: 0;
}

.logo-icon { font-size: 24px; }

.logo h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.menu-group-title {
  padding: 12px 20px 4px;
  font-size: 11px;
  color: #7a8ba0;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}

.sidebar-menu {
  border: none;
  background-color: var(--sidebar-bg, #304156);
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
  border-bottom: none;
  height: 44px;
  line-height: 44px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: var(--sidebar-hover-bg, #263445);
  color: var(--primary-color, #409eff);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: var(--primary-color, #409eff);
  color: white;
}

.sidebar-footer {
  padding: 10px 20px;
  text-align: center;
  flex-shrink: 0;
}

.version-tag {
  font-size: 11px;
  color: #7a8ba0;
  background: rgba(255,255,255,0.08);
  padding: 2px 8px;
  border-radius: 10px;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  flex-shrink: 0;
}

.header-left { display: flex; align-items: center; }
.collapse-btn { margin-right: 15px; font-size: 18px; }
.page-title { font-size: 18px; font-weight: 500; color: #303133; }

.header-right { display: flex; align-items: center; gap: 12px; }
.model-selector { display: flex; align-items: center; }

.cmd-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}
.cmd-hint {
  font-size: 11px;
  color: #909399;
  background: #f0f2f5;
  padding: 1px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.theme-preview {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}
.theme-preview.default { background: linear-gradient(135deg, #409eff, #66b1ff); }
.theme-preview.dark { background: linear-gradient(135deg, #1a1a2e, #16213e); }
.theme-preview.green { background: linear-gradient(135deg, #2ecc71, #27ae60); }
.theme-preview.purple { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
.theme-preview.warm { background: linear-gradient(135deg, #f39c12, #e67e22); }

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

/* 命令面板 */
.command-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 8px;
}

.command-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  gap: 10px;
  transition: background 0.2s;
}

.command-item:hover { background: #f0f2f5; }

.command-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.command-name { font-size: 14px; font-weight: 500; color: #303133; }
.command-desc { font-size: 12px; color: #909399; }

.command-shortcut {
  font-size: 11px;
  color: #909399;
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

/* 主题变量 */
:root {
  --primary-color: #409eff;
  --sidebar-bg: #304156;
  --sidebar-logo-bg: #2b3a4b;
  --sidebar-hover-bg: #263445;
}

/* 暗夜黑主题 */
.theme-dark { --primary-color: #5c6bc0; }
.theme-dark .sidebar { background-color: #1a1a2e; }
.theme-dark .logo { background-color: #16213e; }
.theme-dark .sidebar-menu { background-color: #1a1a2e; }
.theme-dark .sidebar-menu .el-menu-item:hover { background-color: #0f3460; }
.theme-dark .header { background-color: #16213e; border-bottom-color: #0f3460; }
.theme-dark .page-title { color: #e4e6eb; }
.theme-dark .content { background-color: #0f0f23; }

/* 护眼绿主题 */
.theme-green { --primary-color: #27ae60; }
.theme-green .sidebar { background-color: #1e3a2f; }
.theme-green .logo { background-color: #163a2a; }
.theme-green .sidebar-menu { background-color: #1e3a2f; }
.theme-green .sidebar-menu .el-menu-item:hover { background-color: #2d5a47; }
.theme-green .sidebar-menu .el-menu-item.is-active { background-color: #27ae60; }

/* 优雅紫主题 */
.theme-purple { --primary-color: #8e44ad; }
.theme-purple .sidebar { background-color: #2d1f3d; }
.theme-purple .logo { background-color: #3d2a54; }
.theme-purple .sidebar-menu { background-color: #2d1f3d; }
.theme-purple .sidebar-menu .el-menu-item:hover { background-color: #4a3263; }
.theme-purple .sidebar-menu .el-menu-item.is-active { background-color: #8e44ad; }

/* 暖阳橙主题 */
.theme-warm { --primary-color: #e67e22; }
.theme-warm .sidebar { background-color: #3d2e1f; }
.theme-warm .logo { background-color: #4a3626; }
.theme-warm .sidebar-menu { background-color: #3d2e1f; }
.theme-warm .sidebar-menu .el-menu-item:hover { background-color: #5a4232; }
.theme-warm .sidebar-menu .el-menu-item.is-active { background-color: #e67e22; }

/* 响应式 */
@media (max-width: 768px) {
  .sidebar { position: fixed; z-index: 1000; height: 100vh; }
  .main-container { margin-left: 0; }
  .content { padding: 15px; }
}
</style>

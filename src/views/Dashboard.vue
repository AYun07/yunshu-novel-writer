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
        
        <el-menu-item index="/novels">
          <el-icon><Document /></el-icon>
          <template #title>小说列表</template>
        </el-menu-item>
        
        <el-menu-item index="/prompts">
          <el-icon><ChatLineSquare /></el-icon>
          <template #title>提示词库</template>
        </el-menu-item>
        
        <el-menu-item index="/genres">
          <el-icon><Collection /></el-icon>
          <template #title>小说类型</template>
        </el-menu-item>
        
        <el-menu-item index="/chapters">
          <el-icon><Notebook /></el-icon>
          <template #title>章节管理</template>
        </el-menu-item>
        
        <el-menu-item index="/goals">
          <el-icon><Aim /></el-icon>
          <template #title>写作目标</template>
        </el-menu-item>
        
        <el-menu-item index="/billing">
          <el-icon><CreditCard /></el-icon>
          <template #title>Token统计</template>
        </el-menu-item>
        
        <el-menu-item index="/tools">
          <el-icon><Tools /></el-icon>
          <template #title>工具库</template>
        </el-menu-item>
        
        <el-menu-item index="/short-story">
          <el-icon><EditPen /></el-icon>
          <template #title>短文写作</template>
        </el-menu-item>
        
        <el-menu-item index="/book-analysis">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>拆书工具</template>
        </el-menu-item>
        
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="header">
        <div class="header-left">
          <el-button 
            type="text" 
            @click="toggleSidebar"
            class="collapse-btn"
          >
            <el-icon><Expand v-if="isCollapse" /><Fold v-else /></el-icon>
          </el-button>
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        
        <div class="header-right">
          <!-- 主题切换 -->
          <el-dropdown @command="handleThemeChange" trigger="click">
            <el-button type="primary" size="small">
              <el-icon><Brush /></el-icon>
              主题
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="default" :class="{ 'is-active': currentTheme === 'default' }">
                  <span class="theme-preview default"></span>
                  默认蓝
                </el-dropdown-item>
                <el-dropdown-item command="dark" :class="{ 'is-active': currentTheme === 'dark' }">
                  <span class="theme-preview dark"></span>
                  暗夜黑
                </el-dropdown-item>
                <el-dropdown-item command="green" :class="{ 'is-active': currentTheme === 'green' }">
                  <span class="theme-preview green"></span>
                  护眼绿
                </el-dropdown-item>
                <el-dropdown-item command="purple" :class="{ 'is-active': currentTheme === 'purple' }">
                  <span class="theme-preview purple"></span>
                  优雅紫
                </el-dropdown-item>
                <el-dropdown-item command="warm" :class="{ 'is-active': currentTheme === 'warm' }">
                  <span class="theme-preview warm"></span>
                  暖阳橙
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 模型选择 -->
          <div class="model-selector" v-if="isApiConfigured">
            <el-select 
              v-model="currentModel"
              @change="handleModelChange"
              size="small"
              style="width: 180px"
              placeholder="选择模型"
            >
              <el-option
                v-for="model in availableModels"
                :key="model.id"
                :label="model.name"
                :value="model.id"
              >
                <span>{{ model.name }}</span>
                <span v-if="model.description" style="float: right; color: #8492a6; font-size: 12px">
                  {{ model.description }}
                </span>
              </el-option>
            </el-select>
          </div>

          <!-- API配置状态 -->
          <el-button 
            @click="showApiConfig = true" 
            :type="isApiConfigured ? 'success' : 'warning'"
            size="small"
          >
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNovelStore } from '@/stores/novel'
import { 
  House, Document, ChatLineSquare, Collection, Notebook, Aim, 
  CreditCard, Setting, Key, Tools, EditPen, DataAnalysis,
  Expand, Fold, Brush, MagicStick
} from '@element-plus/icons-vue'
import ApiConfig from '@/components/ApiConfig.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const novelStore = useNovelStore()

// 响应式数据
const isCollapse = ref(false)
const showApiConfig = ref(false)
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
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: '顶级性能' }
])

const pageTitle = computed(() => {
  const titleMap = {
    '/': '首页',
    '/master': '大师创作',
    '/imitation': '风格仿写',
    '/workshop': '长篇工坊',
    '/novels': '小说列表',
    '/prompts': '提示词库',
    '/genres': '小说类型',
    '/chapters': '章节管理',
    '/goals': '写作目标',
    '/billing': 'Token统计',
    '/tools': '工具库',
    '/short-story': '短文写作',
    '/book-analysis': '拆书工具',
    '/settings': '系统设置'
  }
  return titleMap[route.path] || '首页'
})

// 方法
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleThemeChange = (theme) => {
  currentTheme.value = theme
  localStorage.setItem('yunshu_theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
  ElMessage.success(`已切换到${getThemeName(theme)}`)
}

const getThemeName = (theme) => {
  const names = {
    'default': '默认蓝',
    'dark': '暗夜黑',
    'green': '护眼绿',
    'purple': '优雅紫',
    'warm': '暖阳橙'
  }
  return names[theme] || theme
}

const handleModelChange = (modelId) => {
  novelStore.updateApiConfig({ selectedModel: modelId })
  const model = availableModels.value.find(m => m.id === modelId)
  ElMessage.success(`已切换到: ${model?.name || modelId}`)
}

// 初始化
const initializeApp = () => {
  // 加载主题
  const savedTheme = localStorage.getItem('yunshu_theme') || 'default'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
  
  // 加载模型选择
  if (isApiConfigured.value && apiConfig.value) {
    currentModel.value = apiConfig.value.selectedModel || 'gpt-4o'
  }
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
}, { immediate: true })

// 组件挂载
onMounted(() => {
  initializeApp()
})
</script>

<style scoped>
/* 基础样式 */
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
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar.collapsed .logo h2 {
  display: none;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sidebar-logo-bg, #2b3a4b);
  color: white;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

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

.sidebar-menu {
  border: none;
  background-color: var(--sidebar-bg, #304156);
  height: calc(100vh - 60px);
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
  border-bottom: none;
}

.sidebar-menu .el-menu-item:hover {
  background-color: var(--sidebar-hover-bg, #263445);
  color: var(--primary-color, #409eff);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: var(--primary-color, #409eff);
  color: white;
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
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  margin-right: 15px;
  font-size: 18px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.model-selector {
  display: flex;
  align-items: center;
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

/* 主题变量 */
:root {
  --primary-color: #409eff;
  --sidebar-bg: #304156;
  --sidebar-logo-bg: #2b3a4b;
  --sidebar-hover-bg: #263445;
}

/* 暗夜黑主题 */
.theme-dark {
  --primary-color: #5c6bc0;
}

.theme-dark .sidebar {
  background-color: #1a1a2e;
}

.theme-dark .logo {
  background-color: #16213e;
}

.theme-dark .sidebar-menu {
  background-color: #1a1a2e;
}

.theme-dark .sidebar-menu .el-menu-item:hover {
  background-color: #0f3460;
}

.theme-dark .header {
  background-color: #16213e;
  border-bottom-color: #0f3460;
}

.theme-dark .page-title {
  color: #e4e6eb;
}

.theme-dark .content {
  background-color: #0f0f23;
}

/* 护眼绿主题 */
.theme-green {
  --primary-color: #27ae60;
}

.theme-green .sidebar {
  background-color: #1e3a2f;
}

.theme-green .logo {
  background-color: #163a2a;
}

.theme-green .sidebar-menu {
  background-color: #1e3a2f;
}

.theme-green .sidebar-menu .el-menu-item:hover {
  background-color: #2d5a47;
}

.theme-green .sidebar-menu .el-menu-item.is-active {
  background-color: #27ae60;
}

/* 优雅紫主题 */
.theme-purple {
  --primary-color: #8e44ad;
}

.theme-purple .sidebar {
  background-color: #2d1f3d;
}

.theme-purple .logo {
  background-color: #3d2a54;
}

.theme-purple .sidebar-menu {
  background-color: #2d1f3d;
}

.theme-purple .sidebar-menu .el-menu-item:hover {
  background-color: #4a3263;
}

.theme-purple .sidebar-menu .el-menu-item.is-active {
  background-color: #8e44ad;
}

/* 暖阳橙主题 */
.theme-warm {
  --primary-color: #e67e22;
}

.theme-warm .sidebar {
  background-color: #3d2e1f;
}

.theme-warm .logo {
  background-color: #4a3626;
}

.theme-warm .sidebar-menu {
  background-color: #3d2e1f;
}

.theme-warm .sidebar-menu .el-menu-item:hover {
  background-color: #5a4232;
}

.theme-warm .sidebar-menu .el-menu-item.is-active {
  background-color: #e67e22;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    height: 100vh;
  }
  
  .main-container {
    margin-left: 0;
  }
  
  .content {
    padding: 15px;
  }
}
</style>

/**
 * 云书 - 路由配置
 * 所有路由均指向实际存在的视图文件
 */

import { createRouter, createWebHistory } from 'vue-router'

// ==================== 懒加载视图 ====================

const Dashboard = () => import('../views/Dashboard.vue')
const HomePage = () => import('../views/HomePage.vue')
const MasterCreation = () => import('../views/MasterCreation.vue')
const StyleImitation = () => import('../views/StyleImitation.vue')
const NovelWorkshop = () => import('../views/NovelWorkshop.vue')
const ShortStory = () => import('../views/ShortStory.vue')
const NovelManagement = () => import('../views/NovelManagement.vue')
const ChapterManagement = () => import('../views/ChapterManagement.vue')
const Writer = () => import('../views/Writer.vue')
const BookAnalysis = () => import('../views/BookAnalysis.vue')
const PromptsLibrary = () => import('../views/PromptsLibrary.vue')
const ToolsLibrary = () => import('../views/ToolsLibrary.vue')
const WritingGoals = () => import('../views/WritingGoals.vue')
const TokenBilling = () => import('../views/TokenBilling.vue')
const GenreManagement = () => import('../views/GenreManagement.vue')
const Settings = () => import('../views/Settings.vue')

const Foreshadowing = () => import('../views/Foreshadowing.vue')
const NarrativeStructure = () => import('../views/NarrativeStructure.vue')
const TextAnalysis = () => import('../views/TextAnalysis.vue')
const FocusMode = () => import('../views/FocusMode.vue')
const Gamification = () => import('../views/Gamification.vue')
const IdeaBoard = () => import('../views/IdeaBoard.vue')
const ChapterGraph = () => import('../views/ChapterGraph.vue')
const IndexCards = () => import('../views/IndexCards.vue')
const MultiViewEditor = () => import('../views/MultiViewEditor.vue')
const StorylineGantt = () => import('../components/StorylineGantt.vue')

const MegaNovelManager = () => import('../views/MegaNovelManager.vue')
const LiteraryWorkshop = () => import('../views/LiteraryWorkshop.vue')

const ExportCenter = () => import('../views/ExportCenter.vue')
const PluginManager = () => import('../views/PluginManager.vue')
const Collaboration = () => import('../views/Collaboration.vue')
const CollaborationHub = () => import('../views/CollaborationHub.vue')
const ReviewMode = () => import('../views/ReviewMode.vue')

// 移动端视图
const MobileHome = () => import('../views/mobile/MobileHome.vue')
const MobileProjects = () => import('../views/mobile/MobileProjects.vue')
const MobileWriter = () => import('../views/mobile/MobileWriter.vue')
const MobileProfile = () => import('../views/mobile/MobileProfile.vue')
const MobileQuickWrite = () => import('../views/mobile/MobileQuickWrite.vue')

// 404
const NotFound = () => import('../views/NotFound.vue')

// ==================== 路由配置 ====================

const routes = [
  {
    path: '/',
    component: Dashboard,
    children: [
      { path: '', name: 'Home', component: HomePage, meta: { title: '首页' } },

      // AI创作
      { path: 'master', name: 'MasterCreation', component: MasterCreation, meta: { title: '大师创作' } },
      { path: 'imitation', name: 'StyleImitation', component: StyleImitation, meta: { title: '风格仿写' } },
      { path: 'workshop', name: 'NovelWorkshop', component: NovelWorkshop, meta: { title: '长篇工坊' } },
      { path: 'short-story', name: 'ShortStory', component: ShortStory, meta: { title: '短文写作' } },
      { path: 'literary', name: 'LiteraryWorkshop', component: LiteraryWorkshop, meta: { title: '文学工坊' } },
      { path: 'mega-novel', name: 'MegaNovelManager', component: MegaNovelManager, meta: { title: '百万字管理' } },

      // 写作工具
      { path: 'focus', name: 'FocusMode', component: FocusMode, meta: { title: '专注模式' } },
      { path: 'analysis', name: 'TextAnalysis', component: TextAnalysis, meta: { title: '质量分析' } },
      { path: 'goals', name: 'WritingGoals', component: WritingGoals, meta: { title: '写作目标' } },
      { path: 'idea-board', name: 'IdeaBoard', component: IdeaBoard, meta: { title: '灵感工坊' } },
      { path: 'book-analysis', name: 'BookAnalysis', component: BookAnalysis, meta: { title: '拆书工具' } },
      { path: 'tools', name: 'ToolsLibrary', component: ToolsLibrary, meta: { title: '工具库' } },
      { path: 'prompts', name: 'PromptsLibrary', component: PromptsLibrary, meta: { title: '提示词库' } },

      // 可视化
      { path: 'index-cards', name: 'IndexCards', component: IndexCards, meta: { title: '索引卡片' } },
      { path: 'multi-view', name: 'MultiViewEditor', component: MultiViewEditor, meta: { title: '四视图编辑器' } },
      { path: 'chapter-graph', name: 'ChapterGraph', component: ChapterGraph, meta: { title: '章节图谱' } },
      { path: 'gantt', name: 'StorylineGantt', component: StorylineGantt, meta: { title: '故事线甘特图' } },

      // 叙事工程
      { path: 'foreshadowing', name: 'Foreshadowing', component: Foreshadowing, meta: { title: '伏笔管理' } },
      { path: 'narrative', name: 'NarrativeStructure', component: NarrativeStructure, meta: { title: '叙事结构' } },

      // 项目管理
      { path: 'novels', name: 'NovelManagement', component: NovelManagement, meta: { title: '小说管理' } },
      { path: 'chapters', name: 'ChapterManagement', component: ChapterManagement, meta: { title: '章节管理' } },
      { path: 'genres', name: 'GenreManagement', component: GenreManagement, meta: { title: '类型管理' } },
      { path: 'writer', name: 'Writer', component: Writer, meta: { title: '写作编辑器', hideInMenu: true } },

      // 导出协作
      { path: 'export', name: 'ExportCenter', component: ExportCenter, meta: { title: '导出中心' } },
      { path: 'collaboration', name: 'Collaboration', component: Collaboration, meta: { title: '协作中心' } },
      { path: 'collab-team', name: 'CollaborationHub', component: CollaborationHub, meta: { title: '团队协作' } },
      { path: 'review', name: 'ReviewMode', component: ReviewMode, meta: { title: '审阅模式' } },
      { path: 'plugins', name: 'PluginManager', component: PluginManager, meta: { title: '插件管理' } },

      // 系统
      { path: 'gamification', name: 'Gamification', component: Gamification, meta: { title: '成就中心' } },
      { path: 'billing', name: 'TokenBilling', component: TokenBilling, meta: { title: 'Token统计' } },
      { path: 'settings', name: 'Settings', component: Settings, meta: { title: '系统设置' } },
    ]
  },

  // 移动端路由
  { path: '/m', name: 'MobileHome', component: MobileHome, meta: { title: '首页', isMobile: true } },
  { path: '/m/projects', name: 'MobileProjects', component: MobileProjects, meta: { title: '项目', isMobile: true } },
  { path: '/m/writer', name: 'MobileWriter', component: MobileWriter, meta: { title: '写作', isMobile: true } },
  { path: '/m/profile', name: 'MobileProfile', component: MobileProfile, meta: { title: '我的', isMobile: true } },
  { path: '/m/quick-write', name: 'MobileQuickWrite', component: MobileQuickWrite, meta: { title: '快写', isMobile: true } },
  { path: '/m/sync', name: 'MobileSync', component: () => import('../components/SyncSettings.vue'), meta: { title: '数据同步', isMobile: true } },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '页面不存在' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

/**
 * 检测是否为移动端或 Capacitor 原生环境
 */
function isMobileOrNative() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  // 检测 Capacitor 原生环境
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    return true
  }
  // 检测移动端 UA
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
}

router.beforeEach((to, from) => {
  // 设置页面标题
  if (typeof document !== 'undefined') {
    document.title = to.meta.title ? `${to.meta.title} - 云书` : '云书 - AI辅助写作工具'
  }

  // 移动端/Capacitor 环境自动重定向到 /m
  if (isMobileOrNative() && !to.path.startsWith('/m') && to.name !== 'NotFound') {
    return { path: '/m', query: to.query }
  }
})

export default router

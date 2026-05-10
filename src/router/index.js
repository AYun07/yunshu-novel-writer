import { createRouter, createWebHashHistory } from 'vue-router'

// 布局组件（立即加载）
import Dashboard from '../views/Dashboard.vue'

// 所有页面组件使用懒加载
const HomePage = () => import('../views/HomePage.vue')
const PromptsLibrary = () => import('../views/PromptsLibrary.vue')
const NovelManagement = () => import('../views/NovelManagement.vue')
const WritingGoals = () => import('../views/WritingGoals.vue')
const TokenBilling = () => import('../views/TokenBilling.vue')
const Settings = () => import('../views/Settings.vue')
const ChapterManagement = () => import('../views/ChapterManagement.vue')
const Writer = () => import('../views/Writer.vue')
const GenreManagement = () => import('../views/GenreManagement.vue')
const ToolsLibrary = () => import('../views/ToolsLibrary.vue')
const ShortStory = () => import('../views/ShortStory.vue')
const BookAnalysis = () => import('../views/BookAnalysis.vue')
const MasterCreation = () => import('../views/MasterCreation.vue')
const StyleImitation = () => import('../views/StyleImitation.vue')
const NovelWorkshop = () => import('../views/NovelWorkshop.vue')

// v2.0 新增页面
const Foreshadowing = () => import('../views/Foreshadowing.vue')
const NarrativeStructure = () => import('../views/NarrativeStructure.vue')
const TextAnalysis = () => import('../views/TextAnalysis.vue')
const FocusMode = () => import('../views/FocusMode.vue')
const Gamification = () => import('../views/Gamification.vue')
const IdeaBoard = () => import('../views/IdeaBoard.vue')
const ChapterGraph = () => import('../views/ChapterGraph.vue')
const ExportCenter = () => import('../views/ExportCenter.vue')
const PluginManager = () => import('../views/PluginManager.vue')
const Collaboration = () => import('../views/Collaboration.vue')

// v2.2 高级可视化模块
const IndexCards = () => import('../views/IndexCards.vue')
const MultiViewEditor = () => import('../views/MultiViewEditor.vue')

// v2.2 长篇小说引擎模块
const MegaNovelManager = () => import('../views/MegaNovelManager.vue')

// 文学工坊、协作中心、审阅模式 - 使用实际 .vue 文件
const LiteraryWorkshop = () => import('../views/LiteraryWorkshop.vue')
const CollaborationHub = () => import('../views/CollaborationHub.vue')
const ReviewMode = () => import('../views/ReviewMode.vue')

// 404 页面
const NotFound = () => import('../views/Dashboard.vue')

const routes = [
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'HomePage',
        component: HomePage
      },
      // ===== AI创作 =====
      {
        path: 'master',
        name: 'MasterCreation',
        component: MasterCreation
      },
      {
        path: 'imitation',
        name: 'StyleImitation',
        component: StyleImitation
      },
      {
        path: 'workshop',
        name: 'NovelWorkshop',
        component: NovelWorkshop
      },
      {
        path: 'short-story',
        name: 'ShortStory',
        component: ShortStory
      },
      // ===== 写作工具 =====
      {
        path: 'focus',
        name: 'FocusMode',
        component: FocusMode
      },
      {
        path: 'analysis',
        name: 'TextAnalysis',
        component: TextAnalysis
      },
      {
        path: 'ideas',
        name: 'IdeaBoard',
        component: IdeaBoard
      },
      // v2.1 新增：索引卡片
      {
        path: 'cards',
        name: 'IndexCards',
        component: IndexCards
      },
      // v2.1 新增：四视图编辑器
      {
        path: 'multi-view',
        name: 'MultiViewEditor',
        component: MultiViewEditor
      },
      // ===== 项目管理 =====
      {
        path: 'novels',
        name: 'NovelManagement',
        component: NovelManagement
      },
      {
        path: 'chapters',
        name: 'ChapterManagement',
        component: ChapterManagement
      },
      {
        path: 'writer',
        name: 'Writer',
        component: Writer
      },
      {
        path: 'graph',
        name: 'ChapterGraph',
        component: ChapterGraph
      },
      // v2.2 新增：百万字管理
      {
        path: 'mega-novel',
        name: 'MegaNovelManager',
        component: MegaNovelManager
      },
      // ===== 叙事工程 =====
      {
        path: 'foreshadowing',
        name: 'Foreshadowing',
        component: Foreshadowing
      },
      {
        path: 'narrative',
        name: 'NarrativeStructure',
        component: NarrativeStructure
      },
      // 文学工坊 - 指向实际 .vue 文件
      {
        path: 'literary',
        name: 'LiteraryWorkshop',
        component: LiteraryWorkshop
      },
      // ===== 资源库 =====
      {
        path: 'prompts',
        name: 'PromptsLibrary',
        component: PromptsLibrary
      },
      {
        path: 'genres',
        name: 'GenreManagement',
        component: GenreManagement
      },
      {
        path: 'tools',
        name: 'ToolsLibrary',
        component: ToolsLibrary
      },
      {
        path: 'book-analysis',
        name: 'BookAnalysis',
        component: BookAnalysis
      },
      // ===== 导出与协作 =====
      {
        path: 'export',
        name: 'ExportCenter',
        component: ExportCenter
      },
      {
        path: 'collaboration',
        name: 'Collaboration',
        component: Collaboration
      },
      // 协作中心 - 指向实际 .vue 文件（原 collaboration-hub 改为 collab-team）
      {
        path: 'collab-team',
        name: 'CollaborationHub',
        component: CollaborationHub
      },
      // 审阅模式 - 指向实际 .vue 文件
      {
        path: 'review',
        name: 'ReviewMode',
        component: ReviewMode
      },
      // ===== 扩展 =====
      {
        path: 'plugins',
        name: 'PluginManager',
        component: PluginManager
      },
      {
        path: 'gamification',
        name: 'Gamification',
        component: Gamification
      },
      // ===== 系统 =====
      {
        path: 'goals',
        name: 'WritingGoals',
        component: WritingGoals
      },
      {
        path: 'billing',
        name: 'TokenBilling',
        component: TokenBilling
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      }
    ]
  },
  // 404 兜底路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

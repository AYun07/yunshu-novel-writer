import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import HomePage from '../views/HomePage.vue'
import PromptsLibrary from '../views/PromptsLibrary.vue'
import NovelManagement from '../views/NovelManagement.vue'
import WritingGoals from '../views/WritingGoals.vue'
import TokenBilling from '../views/TokenBilling.vue'
import Settings from '../views/Settings.vue'
import ChapterManagement from '../views/ChapterManagement.vue'
import Writer from '../views/Writer.vue'
import GenreManagement from '../views/GenreManagement.vue'
import ToolsLibrary from '../views/ToolsLibrary.vue'
import ShortStory from '../views/ShortStory.vue'
import BookAnalysis from '../views/BookAnalysis.vue'
import MasterCreation from '../views/MasterCreation.vue'
import StyleImitation from '../views/StyleImitation.vue'
import NovelWorkshop from '../views/NovelWorkshop.vue'

// v2.0 新增页面
import Foreshadowing from '../views/Foreshadowing.vue'
import NarrativeStructure from '../views/NarrativeStructure.vue'
import TextAnalysis from '../views/TextAnalysis.vue'
import FocusMode from '../views/FocusMode.vue'
import Gamification from '../views/Gamification.vue'
import IdeaBoard from '../views/IdeaBoard.vue'
import ChapterGraph from '../views/ChapterGraph.vue'
import ExportCenter from '../views/ExportCenter.vue'
import PluginManager from '../views/PluginManager.vue'
import Collaboration from '../views/Collaboration.vue'

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

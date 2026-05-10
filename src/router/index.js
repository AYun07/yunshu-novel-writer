/**
 * 云书 - 路由配置
 * 包含桌面端和移动端路由
 * 支持响应式路由守卫（自动跳转移动端/桌面端）
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useDeviceStore } from '../stores/device.js'

// ==================== 桌面端视图 ====================

/**
 * 桌面端布局组件
 */
import DesktopLayout from '../layouts/DesktopLayout.vue'

/**
 * 桌面端视图组件
 */
import Dashboard from '../views/Dashboard.vue'
import Novels from '../views/Novels.vue'
import Characters from '../views/Characters.vue'
import WorldSettings from '../views/WorldSettings.vue'
import Foreshadowing from '../views/Foreshadowing.vue'
import NarrativeStructure from '../views/NarrativeStructure.vue'
import Ideas from '../views/Ideas.vue'
import Snippets from '../views/Snippets.vue'
import Writer from '../views/Writer.vue'
import Settings from '../views/Settings.vue'
import Plugins from '../views/Plugins.vue'
import Achievements from '../views/Achievements.vue'
import Statistics from '../views/Statistics.vue'
import ExportHistory from '../views/ExportHistory.vue'

// ==================== 移动端视图 ====================

/**
 * 移动端视图组件
 * 使用动态导入优化加载性能
 */
const MobileHome = () => import('../views/mobile/MobileHome.vue')
const MobileProjects = () => import('../views/mobile/MobileProjects.vue')
const MobileWriter = () => import('../views/mobile/MobileWriter.vue')
const MobileProfile = () => import('../views/mobile/MobileProfile.vue')
const MobileQuickWrite = () => import('../views/mobile/MobileQuickWrite.vue')

// ==================== 路由配置 ====================

/**
 * 桌面端路由
 */
const desktopRoutes = [
  {
    path: '/',
    component: DesktopLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '仪表盘',
          icon: 'Odometer',
          description: '查看写作统计和最近活动'
        }
      },
      {
        path: 'novels',
        name: 'Novels',
        component: Novels,
        meta: {
          title: '小说管理',
          icon: 'Collection',
          description: '管理你的小说项目'
        }
      },
      {
        path: 'characters',
        name: 'Characters',
        component: Characters,
        meta: {
          title: '角色管理',
          icon: 'User',
          description: '创建和管理角色设定'
        }
      },
      {
        path: 'world-settings',
        name: 'WorldSettings',
        component: WorldSettings,
        meta: {
          title: '世界观设定',
          icon: 'MapLocation',
          description: '构建小说世界观'
        }
      },
      {
        path: 'foreshadowing',
        name: 'Foreshadowing',
        component: Foreshadowing,
        meta: {
          title: '伏笔管理',
          icon: 'MagicStick',
          description: '管理伏笔和悬念'
        }
      },
      {
        path: 'narrative-structure',
        name: 'NarrativeStructure',
        component: NarrativeStructure,
        meta: {
          title: '叙事结构',
          icon: 'Share',
          description: '规划故事结构'
        }
      },
      {
        path: 'ideas',
        name: 'Ideas',
        component: Ideas,
        meta: {
          title: '灵感收集',
          icon: 'Lightning',
          description: '记录创作灵感'
        }
      },
      {
        path: 'snippets',
        name: 'Snippets',
        component: Snippets,
        meta: {
          title: '片段库',
          icon: 'DocumentCopy',
          description: '管理写作片段'
        }
      },
      {
        path: 'writer',
        name: 'Writer',
        component: Writer,
        meta: {
          title: '写作',
          icon: 'EditPen',
          description: '开始写作',
          hideInMenu: true
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: {
          title: '设置',
          icon: 'Setting',
          description: '应用设置'
        }
      },
      {
        path: 'plugins',
        name: 'Plugins',
        component: Plugins,
        meta: {
          title: '插件管理',
          icon: 'Grid',
          description: '管理扩展插件'
        }
      },
      {
        path: 'achievements',
        name: 'Achievements',
        component: Achievements,
        meta: {
          title: '成就',
          icon: 'Trophy',
          description: '查看获得的成就'
        }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Statistics,
        meta: {
          title: '统计',
          icon: 'TrendCharts',
          description: '详细数据分析'
        }
      },
      {
        path: 'export-history',
        name: 'ExportHistory',
        component: ExportHistory,
        meta: {
          title: '导出历史',
          icon: 'Download',
          description: '查看导出记录'
        }
      }
    ]
  }
]

/**
 * 移动端路由
 * 使用 /m/ 前缀
 */
const mobileRoutes = [
  {
    path: '/m',
    name: 'MobileHome',
    component: MobileHome,
    meta: {
      title: '首页',
      isMobile: true,
      keepAlive: true
    }
  },
  {
    path: '/m/projects',
    name: 'MobileProjects',
    component: MobileProjects,
    meta: {
      title: '项目管理',
      isMobile: true,
      keepAlive: true
    }
  },
  {
    path: '/m/writer',
    name: 'MobileWriter',
    component: MobileWriter,
    meta: {
      title: '写作',
      isMobile: true,
      keepAlive: false
    }
  },
  {
    path: '/m/profile',
    name: 'MobileProfile',
    component: MobileProfile,
    meta: {
      title: '个人中心',
      isMobile: true,
      keepAlive: true
    }
  },
  {
    path: '/m/quick-write',
    name: 'MobileQuickWrite',
    component: MobileQuickWrite,
    meta: {
      title: '快速写作',
      isMobile: true,
      keepAlive: false
    }
  }
]

/**
 * 合并所有路由
 */
const routes = [
  ...desktopRoutes,
  ...mobileRoutes,
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面不存在',
      hideInMenu: true
    }
  }
]

// ==================== 创建路由实例 ====================

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置，恢复滚动位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到顶部
    return { top: 0 }
  }
})

// ==================== 设备检测工具 ====================

/**
 * 检测设备类型
 * @returns {object} 设备信息
 */
function detectDevice() {
  const userAgent = navigator.userAgent.toLowerCase()
  const width = window.innerWidth

  // 检测是否为移动设备
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)

  // 根据屏幕宽度判断
  const isMobileWidth = width < 768

  // 检测是否为平板
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (width >= 768 && width < 1024)

  return {
    isMobile: isMobileDevice || isMobileWidth,
    isTablet,
    isDesktop: !isMobileDevice && !isMobileWidth,
    width
  }
}

// ==================== 路由守卫 ====================

/**
 * 全局前置守卫
 * 处理平台检测和自动跳转
 */
router.beforeEach((to, from, next) => {
  const device = detectDevice()
  const isMobileRoute = to.path.startsWith('/m/') || to.path === '/m'
  const isDesktopRoute = !isMobileRoute && to.path !== '/'

  // 更新设备状态存储
  try {
    const deviceStore = useDeviceStore()
    deviceStore.updateDeviceInfo(device)
  } catch (error) {
    // 存储可能还未初始化，忽略错误
  }

  // 如果是移动端设备且访问桌面端路由，重定向到移动端对应路由
  if (device.isMobile && isDesktopRoute) {
    // 映射桌面端路由到移动端路由
    const mobilePath = getMobilePath(to.path)
    if (mobilePath && mobilePath !== to.path) {
      console.log(`[路由] 移动端设备访问桌面端路由，重定向到: ${mobilePath}`)
      return next({ path: mobilePath, replace: true })
    }
  }

  // 如果是桌面端设备且访问移动端路由，重定向到桌面端对应路由
  if (device.isDesktop && isMobileRoute) {
    // 映射移动端路由到桌面端路由
    const desktopPath = getDesktopPath(to.path)
    if (desktopPath && desktopPath !== to.path) {
      console.log(`[路由] 桌面端设备访问移动端路由，重定向到: ${desktopPath}`)
      return next({ path: desktopPath, replace: true })
    }
  }

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 云书`
  } else {
    document.title = '云书 - AI辅助写作工具'
  }

  next()
})

/**
 * 全局后置守卫
 * 处理页面统计等
 */
router.afterEach((to, from) => {
  // 可以在这里添加页面访问统计
  // 例如：analytics.trackPageView(to.path)
})

/**
 * 错误处理
 */
router.onError((error) => {
  console.error('[路由] 导航错误:', error)
})

// ==================== 路由映射工具 ====================

/**
 * 获取移动端路由路径
 * @param {string} desktopPath - 桌面端路径
 * @returns {string|null} 移动端路径
 */
function getMobilePath(desktopPath) {
  const pathMap = {
    '/': '/m',
    '/novels': '/m/projects',
    '/writer': '/m/writer',
    '/settings': '/m/profile',
    '/profile': '/m/profile',
    '/achievements': '/m/profile'
  }

  // 处理带参数的路径
  if (desktopPath.startsWith('/writer')) {
    const query = desktopPath.includes('?') ? desktopPath.substring(desktopPath.indexOf('?')) : ''
    return '/m/writer' + query
  }

  return pathMap[desktopPath] || '/m'
}

/**
 * 获取桌面端路由路径
 * @param {string} mobilePath - 移动端路径
 * @returns {string|null} 桌面端路径
 */
function getDesktopPath(mobilePath) {
  const pathMap = {
    '/m': '/',
    '/m/': '/',
    '/m/projects': '/novels',
    '/m/writer': '/writer',
    '/m/profile': '/settings',
    '/m/quick-write': '/writer'
  }

  // 处理带参数的路径
  if (mobilePath.startsWith('/m/writer')) {
    const query = mobilePath.includes('?') ? mobilePath.substring(mobilePath.indexOf('?')) : ''
    return '/writer' + query
  }

  return pathMap[mobilePath] || '/'
}

// ==================== 导出 ====================

export default router

/**
 * 路由配置对象
 * 用于外部访问路由信息
 */
export const routeConfig = {
  desktopRoutes,
  mobileRoutes,
  allRoutes: routes,

  /**
   * 获取桌面端菜单路由
   * 过滤掉隐藏的路由
   */
  getDesktopMenuRoutes() {
    return desktopRoutes[0].children.filter(route => !route.meta?.hideInMenu)
  },

  /**
   * 获取移动端底部导航路由
   */
  getMobileTabRoutes() {
    return mobileRoutes.filter(route => route.meta?.showInTab !== false)
  },

  /**
   * 根据名称获取路由
   */
  getRouteByName(name) {
    return routes.find(route => route.name === name)
  },

  /**
   * 检查是否为移动端路由
   */
  isMobileRoute(path) {
    return path.startsWith('/m/') || path === '/m'
  }
}

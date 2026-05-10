/**
 * 云书 - 游戏化系统配置
 * 
 * 对标 Quoll Writer 的成就系统 + WriteMonkey 的 Stamina Bar，
 * 通过游戏化机制激励用户持续写作。
 * 
 * 功能模块：
 * 1. 成就定义（30+ 成就，涵盖写作/连续/字数/功能/社交五大类）
 * 2. 经验值和等级系统（写作字数 -> 经验值 -> 等级）
 * 3. 每日签到系统
 * 4. 写作热力图数据生成（类 GitHub 贡献图）
 * 5. 奖杯/徽章数据结构
 * 6. 激励语库（100+ 条写作激励语）
 * 7. 统计面板数据（今日/本周/本月/全部时间）
 * 
 * 使用方式：
 * import { gamificationSystem } from './gamification.js'
 * 
 * // 初始化系统
 * gamificationSystem.init()
 * 
 * // 记录写作活动
 * gamificationSystem.recordWriting(500) // 写了500字
 * 
 * // 检查成就
 * gamificationSystem.checkAchievements()
 * 
 * // 获取统计数据
 * const stats = gamificationSystem.getStats()
 */

// ============================================================================
// 成就定义
// ============================================================================

/**
 * 成就类别枚举
 */
export const AchievementCategory = {
  /** 写作类 - 与创作里程碑相关 */
  WRITING: 'writing',
  /** 连续类 - 与连续写作天数相关 */
  STREAK: 'streak',
  /** 字数类 - 与写作字数相关 */
  WORD_COUNT: 'word_count',
  /** 功能类 - 与使用特定功能相关 */
  FEATURE: 'feature',
  /** 社交类 - 与社交互动相关 */
  SOCIAL: 'social'
}

/**
 * 成就稀有度枚举
 */
export const AchievementRarity = {
  /** 普通 */
  COMMON: 'common',
  /** 稀有 */
  RARE: 'rare',
  /** 史诗 */
  EPIC: 'epic',
  /** 传说 */
  LEGENDARY: 'legendary'
}

/**
 * 成就数据结构
 * @typedef {Object} Achievement
 * @property {string} id - 成就唯一标识
 * @property {string} name - 成就名称
 * @property {string} description - 成就描述
 * @property {string} category - 成就类别
 * @property {string} rarity - 稀有度
 * @property {string} icon - 图标标识（Element Plus 图标名）
 * @property {Object} condition - 解锁条件
 * @property {string} condition.type - 条件类型
 * @property {number} condition.value - 条件值
 * @property {string} condition.field - 条件字段
 * @property {number} reward - 奖励经验值
 * @property {boolean} hidden - 是否为隐藏成就（未解锁前不显示）
 */

/**
 * 完整的成就定义列表（35个成就）
 */
export const achievements = [
  // ========================================================================
  // 写作类成就（8个）
  // ========================================================================
  {
    id: 'first_creation',
    name: '初出茅庐',
    description: '创建你的第一个项目',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.COMMON,
    icon: 'Edit',
    condition: { type: 'count', field: 'totalProjects', value: 1 },
    reward: 10,
    hidden: false
  },
  {
    id: 'first_chapter',
    name: '开篇之作',
    description: '完成你的第一个章节',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.COMMON,
    icon: 'Document',
    condition: { type: 'count', field: 'totalChapters', value: 1 },
    reward: 20,
    hidden: false
  },
  {
    id: 'first_volume',
    name: '卷帙初成',
    description: '完成你的第一个卷（10章以上）',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.RARE,
    icon: 'Notebook',
    condition: { type: 'count', field: 'totalChapters', value: 10 },
    reward: 100,
    hidden: false
  },
  {
    id: 'first_novel',
    name: '处女作',
    description: '完成你的第一部作品（30章以上）',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.EPIC,
    icon: 'Reading',
    condition: { type: 'count', field: 'totalChapters', value: 30 },
    reward: 300,
    hidden: false
  },
  {
    id: 'prolific_author',
    name: '高产作家',
    description: '累计创作超过100章',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.EPIC,
    icon: 'Tickets',
    condition: { type: 'count', field: 'totalChapters', value: 100 },
    reward: 500,
    hidden: false
  },
  {
    id: 'million_words',
    name: '百万字成就',
    description: '累计写作超过100万字',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.LEGENDARY,
    icon: 'Trophy',
    condition: { type: 'total', field: 'totalWords', value: 1000000 },
    reward: 2000,
    hidden: false
  },
  {
    id: 'genre_master',
    name: '题材达人',
    description: '在3种以上不同题材中创作',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.RARE,
    icon: 'Collection',
    condition: { type: 'count', field: 'genreCount', value: 3 },
    reward: 150,
    hidden: false
  },
  {
    id: 'night_owl',
    name: '夜猫子作家',
    description: '在凌晨0点-5点之间写作超过1000字',
    category: AchievementCategory.WRITING,
    rarity: AchievementRarity.RARE,
    icon: 'Moon',
    condition: { type: 'special', field: 'nightOwl', value: 1 },
    reward: 80,
    hidden: true
  },

  // ========================================================================
  // 连续类成就（5个）
  // ========================================================================
  {
    id: 'streak_3',
    name: '三日坚持',
    description: '连续写作3天',
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.COMMON,
    icon: 'Calendar',
    condition: { type: 'streak', field: 'currentStreak', value: 3 },
    reward: 30,
    hidden: false
  },
  {
    id: 'streak_7',
    name: '一周不断',
    description: '连续写作7天',
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.RARE,
    icon: 'Calendar',
    condition: { type: 'streak', field: 'currentStreak', value: 7 },
    reward: 100,
    hidden: false
  },
  {
    id: 'streak_30',
    name: '月度铁人',
    description: '连续写作30天',
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.EPIC,
    icon: 'Calendar',
    condition: { type: 'streak', field: 'currentStreak', value: 30 },
    reward: 500,
    hidden: false
  },
  {
    id: 'streak_100',
    name: '百日传奇',
    description: '连续写作100天',
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.LEGENDARY,
    icon: 'Star',
    condition: { type: 'streak', field: 'currentStreak', value: 100 },
    reward: 3000,
    hidden: false
  },
  {
    id: 'streak_365',
    name: '全年无休',
    description: '连续写作365天',
    category: AchievementCategory.STREAK,
    rarity: AchievementRarity.LEGENDARY,
    icon: 'Crown',
    condition: { type: 'streak', field: 'currentStreak', value: 365 },
    reward: 10000,
    hidden: true
  },

  // ========================================================================
  // 字数类成就（8个）
  // ========================================================================
  {
    id: 'daily_1000',
    name: '千字日更',
    description: '单日写作超过1000字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.COMMON,
    icon: 'EditPen',
    condition: { type: 'daily', field: 'dailyWords', value: 1000 },
    reward: 20,
    hidden: false
  },
  {
    id: 'daily_3000',
    name: '三千字力作',
    description: '单日写作超过3000字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.RARE,
    icon: 'EditPen',
    condition: { type: 'daily', field: 'dailyWords', value: 3000 },
    reward: 60,
    hidden: false
  },
  {
    id: 'daily_5000',
    name: '五千字狂飙',
    description: '单日写作超过5000字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.EPIC,
    icon: 'Lightning',
    condition: { type: 'daily', field: 'dailyWords', value: 5000 },
    reward: 150,
    hidden: false
  },
  {
    id: 'daily_10000',
    name: '万字马拉松',
    description: '单日写作超过10000字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.LEGENDARY,
    icon: 'Trophy',
    condition: { type: 'daily', field: 'dailyWords', value: 10000 },
    reward: 500,
    hidden: false
  },
  {
    id: 'cumulative_10k',
    name: '万字起步',
    description: '累计写作超过1万字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.COMMON,
    icon: 'DataLine',
    condition: { type: 'total', field: 'totalWords', value: 10000 },
    reward: 50,
    hidden: false
  },
  {
    id: 'cumulative_50k',
    name: '五万字里程碑',
    description: '累计写作超过5万字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.RARE,
    icon: 'DataLine',
    condition: { type: 'total', field: 'totalWords', value: 50000 },
    reward: 200,
    hidden: false
  },
  {
    id: 'cumulative_100k',
    name: '十万字殿堂',
    description: '累计写作超过10万字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.EPIC,
    icon: 'DataLine',
    condition: { type: 'total', field: 'totalWords', value: 100000 },
    reward: 500,
    hidden: false
  },
  {
    id: 'cumulative_500k',
    name: '五十万字丰碑',
    description: '累计写作超过50万字',
    category: AchievementCategory.WORD_COUNT,
    rarity: AchievementRarity.LEGENDARY,
    icon: 'DataLine',
    condition: { type: 'total', field: 'totalWords', value: 500000 },
    reward: 1500,
    hidden: false
  },

  // ========================================================================
  // 功能类成就（8个）
  // ========================================================================
  {
    id: 'first_ai_creation',
    name: 'AI共创初体验',
    description: '首次使用大师创作功能',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.COMMON,
    icon: 'MagicStick',
    condition: { type: 'flag', field: 'usedMasterCreation', value: true },
    reward: 15,
    hidden: false
  },
  {
    id: 'first_imitation',
    name: '风格模仿师',
    description: '首次使用仿写功能',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.COMMON,
    icon: 'Brush',
    condition: { type: 'flag', field: 'usedImitation', value: true },
    reward: 15,
    hidden: false
  },
  {
    id: 'first_export',
    name: '作品导出',
    description: '首次导出作品',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.COMMON,
    icon: 'Download',
    condition: { type: 'flag', field: 'usedExport', value: true },
    reward: 10,
    hidden: false
  },
  {
    id: 'first_focus_mode',
    name: '专注之力',
    description: '首次使用专注模式',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.COMMON,
    icon: 'View',
    condition: { type: 'flag', field: 'usedFocusMode', value: true },
    reward: 15,
    hidden: false
  },
  {
    id: 'focus_marathon',
    name: '专注马拉松',
    description: '单次专注模式写作超过2小时',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.RARE,
    icon: 'Timer',
    condition: { type: 'special', field: 'focusMarathon', value: 1 },
    reward: 80,
    hidden: true
  },
  {
    id: 'pomodoro_master',
    name: '番茄钟大师',
    description: '累计完成50个番茄钟',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.RARE,
    icon: 'Clock',
    condition: { type: 'total', field: 'totalPomodoros', value: 50 },
    reward: 120,
    hidden: false
  },
  {
    id: 'template_collector',
    name: '模板收藏家',
    description: '使用5种以上不同的写作模板',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.RARE,
    icon: 'Files',
    condition: { type: 'count', field: 'templatesUsed', value: 5 },
    reward: 80,
    hidden: false
  },
  {
    id: 'revision_dedicator',
    name: '精雕细琢',
    description: '对同一章节进行10次以上修订',
    category: AchievementCategory.FEATURE,
    rarity: AchievementRarity.RARE,
    icon: 'RefreshRight',
    condition: { type: 'special', field: 'revisionDedicator', value: 1 },
    reward: 100,
    hidden: true
  },

  // ========================================================================
  // 社交类成就（6个）
  // ========================================================================
  {
    id: 'first_share',
    name: '分享达人',
    description: '首次分享你的作品',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.COMMON,
    icon: 'Share',
    condition: { type: 'flag', field: 'hasShared', value: true },
    reward: 15,
    hidden: false
  },
  {
    id: 'first_comment',
    name: '评论先锋',
    description: '首次对他人作品发表评论',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.COMMON,
    icon: 'ChatDotRound',
    condition: { type: 'flag', field: 'hasCommented', value: true },
    reward: 15,
    hidden: false
  },
  {
    id: 'feedback_receiver',
    name: '虚心纳谏',
    description: '收到10条以上的评论反馈',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.RARE,
    icon: 'ChatLineSquare',
    condition: { type: 'count', field: 'receivedComments', value: 10 },
    reward: 80,
    hidden: false
  },
  {
    id: 'collaborator',
    name: '协作之星',
    description: '参与3次以上的协作编辑',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.RARE,
    icon: 'User',
    condition: { type: 'count', field: 'collaborations', value: 3 },
    reward: 100,
    hidden: false
  },
  {
    id: 'generous_reviewer',
    name: '热心审阅者',
    description: '为他人作品提供20条以上修改建议',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.EPIC,
    icon: 'Checked',
    condition: { type: 'count', field: 'givenSuggestions', value: 20 },
    reward: 200,
    hidden: false
  },
  {
    id: 'community_leader',
    name: '社区领袖',
    description: '分享作品获得100次以上查看',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.LEGENDARY,
    icon: 'Medal',
    condition: { type: 'count', field: 'totalViews', value: 100 },
    reward: 500,
    hidden: false
  }
]

// ============================================================================
// 经验值和等级系统
// ============================================================================

/**
 * 等级定义
 * 每个等级所需的经验值呈递增趋势
 */
export const levelDefinitions = [
  { level: 1, title: '初学者', minExp: 0, icon: 'Seedling' },
  { level: 2, title: '见习写手', minExp: 50, icon: 'Sprout' },
  { level: 3, title: '文字学徒', minExp: 150, icon: 'Cherry' },
  { level: 4, title: '初级作者', minExp: 350, icon: 'Grape' },
  { level: 5, title: '笔耕不辍', minExp: 700, icon: 'Apple' },
  { level: 6, title: '中级作者', minExp: 1200, icon: 'Orange' },
  { level: 7, title: '故事编织者', minExp: 2000, icon: 'Pear' },
  { level: 8, title: '高级作者', minExp: 3200, icon: 'Lemon' },
  { level: 9, title: '资深作家', minExp: 5000, icon: 'Watermelon' },
  { level: 10, title: '文字匠人', minExp: 8000, icon: 'Coffee' },
  { level: 11, title: '创作达人', minExp: 12000, icon: 'IceCreamRound' },
  { level: 12, title: '畅销作者', minExp: 18000, icon: 'GobletFull' },
  { level: 13, title: '金牌作家', minExp: 28000, icon: 'Medal' },
  { level: 14, title: '文学大师', minExp: 42000, icon: 'Crown' },
  { level: 15, title: '传奇作者', minExp: 65000, icon: 'Trophy' },
  { level: 16, title: '文坛巨匠', minExp: 100000, icon: 'Star' },
  { level: 17, title: '不朽之名', minExp: 150000, icon: 'MagicStick' },
  { level: 18, title: '万世师表', minExp: 220000, icon: 'Sunrise' },
  { level: 19, title: '文学之神', minExp: 350000, icon: 'Promotion' },
  { level: 20, title: '创世之笔', minExp: 500000, icon: 'Compass' }
]

/**
 * 经验值获取规则
 * 定义各种行为对应的经验值奖励
 */
export const expRules = {
  /** 每写作1字获得的经验值 */
  perWord: 0.1,
  /** 完成一个章节的奖励 */
  chapterComplete: 20,
  /** 完成一个卷的奖励 */
  volumeComplete: 100,
  /** 完成一部作品的奖励 */
  novelComplete: 500,
  /** 每日签到的奖励 */
  dailyCheckin: 5,
  /** 连续签到的额外奖励（每天递增） */
  streakBonus: 2,
  /** 完成一个番茄钟的奖励 */
  pomodoroComplete: 10,
  /** 解锁成就的额外经验值（在成就自身奖励基础上） */
  achievementUnlock: 0, // 成就自带 reward 字段
  /** 使用新功能的奖励 */
  tryNewFeature: 5,
  /** 分享作品的奖励 */
  shareWork: 10,
  /** 发表评论的奖励 */
  addComment: 3
}

/**
 * 根据经验值计算等级
 * @param {number} totalExp - 总经验值
 * @returns {Object} 等级信息
 */
export function calculateLevel (totalExp) {
  let currentLevel = levelDefinitions[0]

  for (let i = levelDefinitions.length - 1; i >= 0; i--) {
    if (totalExp >= levelDefinitions[i].minExp) {
      currentLevel = levelDefinitions[i]
      break
    }
  }

  // 计算下一级信息
  const nextLevelIndex = levelDefinitions.findIndex(l => l.level === currentLevel.level) + 1
  const nextLevel = levelDefinitions[nextLevelIndex] || null

  // 计算当前等级进度百分比
  let progress = 100
  if (nextLevel) {
    const currentMin = currentLevel.minExp
    const nextMin = nextLevel.minExp
    progress = Math.round(((totalExp - currentMin) / (nextMin - currentMin)) * 100)
    progress = Math.max(0, Math.min(100, progress))
  }

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    icon: currentLevel.icon,
    totalExp: Math.floor(totalExp),
    currentLevelMinExp: currentLevel.minExp,
    nextLevel,
    nextLevelMinExp: nextLevel ? nextLevel.minExp : null,
    progress,
    expToNextLevel: nextLevel ? nextLevel.minExp - totalExp : 0
  }
}

// ============================================================================
// 每日签到系统
// ============================================================================

/**
 * 签到记录数据结构
 * @typedef {Object} CheckinRecord
 * @property {string} date - 签到日期（YYYY-MM-DD）
 * @property {string} timestamp - 签到时间（ISO字符串）
 * @property {number} expGained - 获得的经验值
 * @property {number} streakAtTime - 签到时的连续天数
 */

/**
 * 每日签到管理器
 */
class DailyCheckinManager {
  constructor () {
    /** 签到记录列表 */
    this.records = []

    /** 当前连续签到天数 */
    this.currentStreak = 0

    /** 最长连续签到天数 */
    this.maxStreak = 0

    /** 上次签到日期 */
    this.lastCheckinDate = null

    /** 签到变更回调 */
    this._callbacks = []
  }

  /**
   * 注册签到变更回调
   * @param {Function} callback
   */
  onChange (callback) {
    this._callbacks.push(callback)
  }

  _emitChange (action, data) {
    this._callbacks.forEach(cb => {
      try { cb(action, data) } catch (e) { console.error(e) }
    })
  }

  /**
   * 执行每日签到
   * @returns {Object} 签到结果
   */
  checkin () {
    const today = this._getToday()

    // 检查是否已签到
    if (this.lastCheckinDate === today) {
      return { success: false, message: '今天已经签到过了' }
    }

    // 计算连续签到天数
    const yesterday = this._getYesterday()
    if (this.lastCheckinDate === yesterday) {
      this.currentStreak++
    } else if (this.lastCheckinDate !== today) {
      // 连续签到中断
      this.currentStreak = 1
    }

    // 更新最长连续天数
    if (this.currentStreak > this.maxStreak) {
      this.maxStreak = this.currentStreak
    }

    // 计算经验值奖励
    const baseExp = expRules.dailyCheckin
    const streakBonus = Math.min(this.currentStreak - 1, 30) * expRules.streakBonus
    const totalExp = baseExp + streakBonus

    // 创建签到记录
    const record = {
      date: today,
      timestamp: new Date().toISOString(),
      expGained: totalExp,
      streakAtTime: this.currentStreak
    }

    this.records.push(record)
    this.lastCheckinDate = today

    // 最多保留 365 条记录
    if (this.records.length > 365) {
      this.records = this.records.slice(-365)
    }

    this._emitChange('checkin', record)

    return {
      success: true,
      expGained: totalExp,
      currentStreak: this.currentStreak,
      maxStreak: this.maxStreak,
      streakBonus,
      message: this.currentStreak > 1
        ? `签到成功！连续${this.currentStreak}天，获得${totalExp}经验值`
        : `签到成功！获得${totalExp}经验值`
    }
  }

  /**
   * 检查今天是否已签到
   * @returns {boolean}
   */
  isCheckedInToday () {
    return this.lastCheckinDate === this._getToday()
  }

  /**
   * 获取本周签到情况
   * @returns {Object} 本周签到数据
   */
  getWeekCheckins () {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      const dateStr = this._formatDate(day)
      weekDays.push({
        date: dateStr,
        dayOfWeek: ['日', '一', '二', '三', '四', '五', '六'][i],
        checkedIn: this.records.some(r => r.date === dateStr)
      })
    }

    return weekDays
  }

  /**
   * 获取当月签到统计
   * @returns {Object}
   */
  getMonthStats () {
    const today = this._getToday()
    const yearMonth = today.substring(0, 7)
    const monthRecords = this.records.filter(r => r.date.startsWith(yearMonth))

    return {
      yearMonth,
      totalDays: new Date(parseInt(yearMonth.substring(0, 4)), parseInt(yearMonth.substring(5)), 0).getDate(),
      checkedDays: monthRecords.length,
      totalExp: monthRecords.reduce((sum, r) => sum + r.expGained, 0)
    }
  }

  /**
   * 获取今天的日期字符串
   * @returns {string} YYYY-MM-DD
   */
  _getToday () {
    return this._formatDate(new Date())
  }

  /**
   * 获取昨天的日期字符串
   * @returns {string} YYYY-MM-DD
   */
  _getYesterday () {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return this._formatDate(yesterday)
  }

  /**
   * 格式化日期为 YYYY-MM-DD
   * @param {Date} date
   * @returns {string}
   */
  _formatDate (date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
}

// ============================================================================
// 写作热力图数据生成
// ============================================================================

/**
 * 生成写作热力图数据（类 GitHub 贡献图）
 * @param {Array<{date: string, words: number}>} writingRecords - 写作记录
 * @param {number} [weeks=26] - 显示的周数（默认26周，约半年）
 * @returns {Object} 热力图数据
 */
export function generateHeatmapData (writingRecords, weeks = 26) {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - (weeks * 7 - 1))

  // 构建每日字数映射
  const dailyWords = {}
  for (const record of writingRecords) {
    if (dailyWords[record.date]) {
      dailyWords[record.date] += record.words
    } else {
      dailyWords[record.date] = record.words
    }
  }

  // 计算统计信息
  const allValues = Object.values(dailyWords)
  const maxWords = allValues.length > 0 ? Math.max(...allValues) : 0

  // 生成热力图格子数据
  const cells = []
  const currentDate = new Date(startDate)

  while (currentDate <= today) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    const words = dailyWords[dateStr] || 0

    cells.push({
      date: dateStr,
      words,
      level: _getHeatLevel(words, maxWords),
      dayOfWeek: currentDate.getDay()
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  // 按周分组
  const weeksData = []
  for (let i = 0; i < cells.length; i += 7) {
    weeksData.push(cells.slice(i, i + 7))
  }

  return {
    weeks: weeksData,
    totalDays: cells.length,
    activeDays: cells.filter(c => c.words > 0).length,
    totalWords: allValues.reduce((sum, w) => sum + w, 0),
    maxWords,
    averageWords: allValues.length > 0
      ? Math.round(allValues.reduce((sum, w) => sum + w, 0) / allValues.length)
      : 0,
    startDate: _formatDateISO(startDate),
    endDate: _formatDateISO(today)
  }
}

/**
 * 根据字数计算热力图等级（0-4）
 * @param {number} words - 字数
 * @param {number} maxWords - 最大字数
 * @returns {number} 等级 (0-4)
 */
function _getHeatLevel (words, maxWords) {
  if (words === 0) return 0
  if (maxWords === 0) return 0

  const ratio = words / maxWords
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/**
 * 格式化日期为 ISO 日期字符串
 * @param {Date} date
 * @returns {string}
 */
function _formatDateISO (date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// ============================================================================
// 奖杯/徽章数据结构
// ============================================================================

/**
 * 徽章数据结构
 * @typedef {Object} Badge
 * @property {string} id - 徽章ID
 * @property {string} name - 徽章名称
 * @property {string} description - 徽章描述
 * @property {string} icon - 图标
 * @property {string} color - 主题色
 * @property {string} category - 类别
 * @property {boolean} unlocked - 是否已解锁
 * @property {string|null} unlockedAt - 解锁时间
 */

/**
 * 预定义徽章模板
 * 这些徽章通过特殊条件解锁，不同于普通成就
 */
export const badgeTemplates = [
  {
    id: 'early_bird',
    name: '早起鸟',
    description: '在早上6点前开始写作',
    icon: 'Sunrise',
    color: '#FF9800',
    category: 'special'
  },
  {
    id: 'midnight_writer',
    name: '午夜诗人',
    description: '在午夜12点后仍在写作',
    icon: 'MoonNight',
    color: '#9C27B0',
    category: 'special'
  },
  {
    id: 'weekend_warrior',
    name: '周末战士',
    description: '连续4个周末都有写作',
    icon: 'Calendar',
    color: '#4CAF50',
    category: 'special'
  },
  {
    id: 'speed_demon',
    name: '速度恶魔',
    description: '1小时内写作超过2000字',
    icon: 'Timer',
    color: '#F44336',
    category: 'special'
  },
  {
    id: 'perfectionist',
    name: '完美主义者',
    description: '对同一章节修订超过20次',
    icon: 'RefreshRight',
    color: '#2196F3',
    category: 'special'
  },
  {
    id: 'explorer',
    name: '题材探险家',
    description: '尝试5种以上不同题材',
    icon: 'Compass',
    color: '#00BCD4',
    category: 'special'
  }
]

// ============================================================================
// 激励语库（100+ 条）
// ============================================================================

/**
 * 写作激励语分类
 */
export const motivationalQuotes = {
  /** 开始写作 */
  starting: [
    '每一个伟大的故事，都始于一个简单的念头。',
    '不要等待灵感，让写作成为灵感的源泉。',
    '最好的时间开始写作是十年前，其次是现在。',
    '空白的页面不是威胁，而是无限可能的邀请。',
    '第一句话不需要完美，它只需要存在。',
    '写作是一场冒险，而你手中握着地图。',
    '不必等到万事俱备，开始写就是最好的准备。',
    '今天的文字，是明天的回忆。',
    '笔尖触碰纸面的那一刻，魔法就开始了。',
    '不要害怕第一稿很糟糕，所有杰作都始于粗糙的初稿。',
    '写作是思想的翅膀，让它带你飞向远方。',
    '打开文档的那一刻，你就已经比昨天更进一步了。',
    '最好的故事，正在等你去书写。',
    '写作不需要天赋，需要的是坐下来开始写的勇气。',
    '千里之行，始于第一个字。'
  ],

  /** 坚持写作 */
  persistence: [
    '坚持写作，即使今天只写了一行。',
    '日更的力量在于积累，每天500字，一年就是18万字。',
    '写作是一场马拉松，不是短跑。',
    '灵感会枯竭，但纪律不会。',
    '今天的坚持，是明天的底气。',
    '不必每天都写得好，但每天都值得写。',
    '连续写作的第N天，你在创造自己的历史。',
    '写作习惯一旦养成，灵感会主动来找你。',
    '即使是最伟大的作家，也有写不出来的日子。',
    '重要的不是写多少，而是持续写。',
    '每天进步一点点，终将成就不凡。',
    '写作的秘诀很简单：坐下来，开始写，不要停。',
    '你的坚持，终将闪闪发光。',
    '连续写作是一种超能力。',
    '今天的你比昨天的你多写了一些，这就是胜利。'
  ],

  /** 遇到困难时 */
  difficulty: [
    '卡文的时候，试试写点别的，或者出去走走。',
    '每一个瓶颈都是突破的前奏。',
    '写不出来的时候，就写"我写不出来"，然后继续。',
    '困难是暂时的，放弃才是永久的。',
    '即使是最黑暗的夜晚，也会迎来黎明。',
    '不要和空白页较劲，先写下任何东西。',
    '糟糕的一天不代表糟糕的写作生涯。',
    '所有的困难都在为你的成长铺路。',
    '写作中的困难，正是故事需要你突破的地方。',
    '当你觉得写不下去的时候，其实离突破最近。',
    '接受不完美，然后继续前进。',
    '没有写不出的文章，只有还没开始的勇气。',
    '困难是写作的调味品，没有它，故事就太平淡了。',
    '每一次卡文，都是故事在酝酿更好的转折。',
    '放下焦虑，回到角色身边，听听他们想说什么。'
  ],

  /** 完成里程碑时 */
  milestone: [
    '恭喜完成又一个里程碑！你的故事正在成形。',
    '每一章的完成，都是一座小小的丰碑。',
    '回头看看你已经走了多远，你比自己想象的更厉害。',
    '完成比完美更重要，而你两者都做到了。',
    '这个里程碑证明了你的实力和毅力。',
    '每一个完成的作品，都是对世界的一份礼物。',
    '你已经做到了很多人梦寐以求的事情。',
    '为自己鼓掌吧，你值得这份骄傲。',
    '完成的感觉真好，不是吗？享受这一刻。',
    '你的坚持结出了果实，继续前行吧。',
    '又一个里程碑！你的写作之旅令人敬佩。',
    '完成不是终点，而是下一段旅程的起点。',
    '你的故事正在改变世界，即使现在只有你知道。',
    '里程碑是路标，提醒你走了多远。',
    '每一滴汗水都算数，每一个字都有意义。'
  ],

  /** 关于创作 */
  craft: [
    '好故事不是写出来的，是改出来的。',
    '角色会告诉你他们想去哪里，你只需要倾听。',
    '展示，不要告诉。让读者自己去感受。',
    '冲突是故事的引擎，没有冲突就没有故事。',
    '每一个角色都认为自己是对的，这就是戏剧的来源。',
    '细节决定真实感，真实感决定沉浸感。',
    '最好的对话，是角色之间在争夺什么。',
    '写作是删减的艺术，删掉一切不必要的。',
    '一个场景应该要么推动情节，要么揭示角色。',
    '读者记住的不是情节，而是感受。',
    '写作的终极目标是让读者忘记自己在阅读。',
    '伏笔是给读者的礼物，揭晓是给读者的惊喜。',
    '好的结局不是结束，而是余韵。',
    '节奏是写作的心跳，快慢交替才有生命力。',
    '写作是孤独的，但故事是属于所有人的。'
  ],

  /** 幽默轻松 */
  humor: [
    '你的角色们又在脑子里吵架了，快去记录下来吧。',
    '写作是最好的借口，可以理直气壮地不社交。',
    '据说每写1000字，就能消耗一杯咖啡的热量。',
    '你的键盘在哭泣——它承受了太多灵感。',
    '写作的人不需要治疗，他们需要的是更多的咖啡。',
    '你的角色们已经等不及了，快去写吧！',
    '据说作家都是失眠患者，因为角色们半夜不睡觉。',
    '你今天的字数已经超过了99%的...昨天没写作的人。',
    '写作是一种合法的精神分裂——你同时是所有人。',
    '恭喜你，又成功地把一些角色的人生搞得一团糟。',
    '你的文档在等你，别让它太寂寞。',
    '据说写作可以减肥——如果你写的是菜谱的话。',
    '你的想象力是一个危险的武器，请继续使用它。',
    '写作的副作用：开始用小说思维观察现实。',
    '你的角色们说：求求你继续写下去吧。'
  ],

  /** 深夜写作 */
  night: [
    '深夜是最好的写作时间，世界安静了，故事苏醒了。',
    '月光下的文字，总带着一丝神秘。',
    '夜深人静时，灵感最容易造访。',
    '凌晨的键盘声，是作家最美的乐章。',
    '黑夜给了你黑色的眼睛，你却用它来寻找灵感。',
    '深夜写作的人，是在和星星对话。',
    '当世界沉睡，你的故事正在苏醒。',
    '夜色是最好的墨水，月光是最好的灯光。',
    '深夜的灵感，如同萤火虫，微小却明亮。',
    '在寂静的夜里，文字有了自己的呼吸。'
  ]
}

/**
 * 获取随机激励语
 * @param {string} [category] - 指定类别，不传则随机
 * @returns {string} 激励语
 */
export function getRandomQuote (category) {
  let pool = []

  if (category && motivationalQuotes[category]) {
    pool = motivationalQuotes[category]
  } else {
    // 从所有类别中随机选择
    for (const quotes of Object.values(motivationalQuotes)) {
      pool.push(...quotes)
    }
  }

  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * 根据上下文获取合适的激励语
 * @param {Object} context - 上下文信息
 * @param {number} [context.wordsToday] - 今日已写字数
 * @param {number} [context.streak] - 连续天数
 * @param {string} [context.timeOfDay] - 时间段 (morning/afternoon/evening/night)
 * @param {boolean} [context.isStuck] - 是否卡文
 * @returns {string} 激励语
 */
export function getContextualQuote (context = {}) {
  const hour = new Date().getHours()

  // 根据时间段选择
  if (hour >= 0 && hour < 6) {
    return getRandomQuote('night')
  }

  // 卡文时
  if (context.isStuck) {
    return getRandomQuote('difficulty')
  }

  // 根据字数选择
  if (context.wordsToday === 0) {
    return getRandomQuote('starting')
  }

  if (context.wordsToday > 5000) {
    return getRandomQuote('milestone')
  }

  // 连续天数较多时
  if (context.streak && context.streak >= 7) {
    return getRandomQuote('persistence')
  }

  // 默认随机
  return getRandomQuote()
}

// ============================================================================
// 统计面板数据
// ============================================================================

/**
 * 生成统计面板数据
 * @param {Object} data - 原始数据
 * @param {Array<{date: string, words: number}>} data.writingRecords - 写作记录
 * @param {number} data.totalWords - 总字数
 * @param {number} data.totalChapters - 总章节数
 * @param {number} data.totalProjects - 总项目数
 * @param {number} data.currentStreak - 当前连续天数
 * @param {number} data.maxStreak - 最长连续天数
 * @returns {Object} 统计面板数据
 */
export function generateStatsPanel (data) {
  const { writingRecords = [], totalWords = 0, totalChapters = 0, totalProjects = 0, currentStreak = 0, maxStreak = 0 } = data

  const today = new Date()
  const todayStr = _formatDateISO(today)

  // 今日数据
  const todayRecord = writingRecords.find(r => r.date === todayStr)
  const todayWords = todayRecord ? todayRecord.words : 0

  // 本周数据（周一到周日）
  const weekStart = new Date(today)
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
  weekStart.setDate(today.getDate() - dayOfWeek + 1)
  weekStart.setHours(0, 0, 0, 0)

  const weekRecords = writingRecords.filter(r => new Date(r.date) >= weekStart)
  const weekWords = weekRecords.reduce((sum, r) => sum + r.words, 0)
  const weekActiveDays = new Set(weekRecords.map(r => r.date)).size

  // 本月数据
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthRecords = writingRecords.filter(r => new Date(r.date) >= monthStart)
  const monthWords = monthRecords.reduce((sum, r) => sum + r.words, 0)
  const monthActiveDays = new Set(monthRecords.map(r => r.date)).size

  // 计算平均数据
  const totalDays = writingRecords.length > 0
    ? Math.max(1, Math.ceil((new Date(writingRecords[writingRecords.length - 1].date) - new Date(writingRecords[0].date)) / 86400000) + 1)
    : 0
  const averageDailyWords = totalDays > 0 ? Math.round(totalWords / totalDays) : 0

  // 最近7天每日字数（用于迷你图表）
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = _formatDateISO(d)
    const record = writingRecords.find(r => r.date === dateStr)
    last7Days.push({
      date: dateStr,
      words: record ? record.words : 0
    })
  }

  return {
    // 今日统计
    today: {
      words: todayWords,
      chapters: 0, // 需要从其他数据源获取
      time: 0, // 写作时长（分钟）
      isGoalMet: todayWords >= 2000 // 默认目标2000字
    },

    // 本周统计
    week: {
      words: weekWords,
      activeDays: weekActiveDays,
      averageDaily: weekActiveDays > 0 ? Math.round(weekWords / 7) : 0
    },

    // 本月统计
    month: {
      words: monthWords,
      activeDays: monthActiveDays,
      averageDaily: monthActiveDays > 0 ? Math.round(monthWords / 30) : 0
    },

    // 全部时间统计
    allTime: {
      totalWords,
      totalChapters,
      totalProjects,
      currentStreak,
      maxStreak,
      averageDailyWords,
      totalActiveDays: writingRecords.length,
      totalWritingDays: new Set(writingRecords.map(r => r.date)).size
    },

    // 最近7天趋势
    last7Days,

    // 热力图数据
    heatmap: generateHeatmapData(writingRecords, 26)
  }
}

// ============================================================================
// 游戏化系统主类
// ============================================================================

/**
 * 游戏化系统
 * 整合所有游戏化功能，提供统一的 API 接口
 */
class GamificationSystem {
  constructor () {
    /** 用户统计数据 */
    this.stats = {
      totalWords: 0,
      totalChapters: 0,
      totalProjects: 0,
      currentStreak: 0,
      maxStreak: 0,
      dailyWords: 0,
      totalPomodoros: 0,
      genreCount: 0,
      templatesUsed: 0,
      receivedComments: 0,
      givenSuggestions: 0,
      collaborations: 0,
      totalViews: 0,
      usedMasterCreation: false,
      usedImitation: false,
      usedExport: false,
      usedFocusMode: false,
      hasShared: false,
      hasCommented: false,
      nightOwl: false,
      focusMarathon: false,
      revisionDedicator: false
    }

    /** 总经验值 */
    this.totalExp = 0

    /** 已解锁的成就列表 */
    this.unlockedAchievements = []

    /** 已解锁的徽章列表 */
    this.unlockedBadges = []

    /** 写作记录（用于热力图和统计） */
    this.writingRecords = []

    /** 每日签到管理器 */
    this.checkin = new DailyCheckinManager()

    /** 成就解锁回调 */
    this._achievementCallbacks = []

    /** 等级变更回调 */
    this._levelUpCallbacks = []

    /** 徽章解锁回调 */
    this._badgeCallbacks = []

    /** 今日已记录的字数（用于防止重复计算） */
    this._todayRecordedWords = 0

    /** 上次记录日期 */
    this._lastRecordDate = null
  }

  // ========================================================================
  // 回调注册
  // ========================================================================

  /**
   * 注册成就解锁回调
   * @param {Function} callback - 参数 (achievement, isNew)
   */
  onAchievementUnlock (callback) {
    this._achievementCallbacks.push(callback)
  }

  /**
   * 注册等级提升回调
   * @param {Function} callback - 参数 (newLevel, oldLevel)
   */
  onLevelUp (callback) {
    this._levelUpCallbacks.push(callback)
  }

  /**
   * 注册徽章解锁回调
   * @param {Function} callback - 参数 (badge)
   */
  onBadgeUnlock (callback) {
    this._badgeCallbacks.push(callback)
  }

  // ========================================================================
  // 核心功能
  // ========================================================================

  /**
   * 初始化系统
   * 从持久化存储加载数据
   * @param {Object} [savedData] - 保存的数据
   */
  init (savedData) {
    if (savedData) {
      if (savedData.stats) Object.assign(this.stats, savedData.stats)
      if (savedData.totalExp) this.totalExp = savedData.totalExp
      if (savedData.unlockedAchievements) this.unlockedAchievements = savedData.unlockedAchievements
      if (savedData.unlockedBadges) this.unlockedBadges = savedData.unlockedBadges
      if (savedData.writingRecords) this.writingRecords = savedData.writingRecords
      if (savedData.checkinRecords) this.checkin.records = savedData.checkinRecords
      if (savedData.checkinStreak) this.checkin.currentStreak = savedData.checkinStreak
      if (savedData.checkinMaxStreak) this.checkin.maxStreak = savedData.checkinMaxStreak
      if (savedData.checkinLastDate) this.checkin.lastCheckinDate = savedData.checkinLastDate
    }

    // 检查日期重置
    this._checkDailyReset()
  }

  /**
   * 每日重置检查
   */
  _checkDailyReset () {
    const today = _formatDateISO(new Date())
    if (this._lastRecordDate !== today) {
      this.stats.dailyWords = 0
      this._todayRecordedWords = 0
      this._lastRecordDate = today
    }
  }

  /**
   * 记录写作活动
   * @param {number} wordCount - 本次写作的字数
   * @param {Object} [options] - 附加选项
   * @param {string} [options.projectId] - 项目ID
   * @param {string} [options.chapterId] - 章节ID
   * @param {string} [options.genre] - 题材
   */
  recordWriting (wordCount, options = {}) {
    if (wordCount <= 0) return

    this._checkDailyReset()

    // 更新统计
    this.stats.totalWords += wordCount
    this.stats.dailyWords += wordCount
    this._todayRecordedWords += wordCount

    // 更新连续天数
    this._updateStreak()

    // 记录写作记录
    const today = _formatDateISO(new Date())
    const existingRecord = this.writingRecords.find(r => r.date === today)
    if (existingRecord) {
      existingRecord.words += wordCount
    } else {
      this.writingRecords.push({ date: today, words: wordCount })
    }

    // 限制记录数量（保留最近2年）
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    this.writingRecords = this.writingRecords.filter(
      r => new Date(r.date) >= twoYearsAgo
    )

    // 增加经验值
    this._addExp(wordCount * expRules.perWord)

    // 检查成就
    this.checkAchievements()

    // 检查特殊条件
    this._checkSpecialConditions(options)
  }

  /**
   * 记录完成章节
   */
  recordChapterComplete () {
    this.stats.totalChapters++
    this._addExp(expRules.chapterComplete)
    this.checkAchievements()
  }

  /**
   * 记录创建项目
   */
  recordProjectCreate (genre) {
    this.stats.totalProjects++
    if (genre) {
      // 简单的题材计数（实际应用中需要更精确的跟踪）
      this.stats.genreCount = Math.max(this.stats.genreCount, 1)
    }
    this._addExp(expRules.tryNewFeature)
    this.checkAchievements()
  }

  /**
   * 记录功能使用
   * @param {string} feature - 功能名称
   */
  recordFeatureUse (feature) {
    const featureMap = {
      masterCreation: 'usedMasterCreation',
      imitation: 'usedImitation',
      export: 'usedExport',
      focusMode: 'usedFocusMode',
      share: 'hasShared',
      comment: 'hasCommented'
    }

    const field = featureMap[feature]
    if (field && !this.stats[field]) {
      this.stats[field] = true
      this._addExp(expRules.tryNewFeature)
      this.checkAchievements()
    }
  }

  /**
   * 记录番茄钟完成
   */
  recordPomodoroComplete () {
    this.stats.totalPomodoros++
    this._addExp(expRules.pomodoroComplete)
    this.checkAchievements()
  }

  // ========================================================================
  // 经验值和等级
  // ========================================================================

  /**
   * 增加经验值
   * @param {number} exp - 经验值
   */
  _addExp (exp) {
    const oldLevel = calculateLevel(this.totalExp)
    this.totalExp += exp
    const newLevel = calculateLevel(this.totalExp)

    // 检查是否升级
    if (newLevel.level > oldLevel.level) {
      this._levelUpCallbacks.forEach(cb => {
        try { cb(newLevel, oldLevel) } catch (e) { console.error(e) }
      })
    }
  }

  /**
   * 获取当前等级信息
   * @returns {Object} 等级信息
   */
  getLevelInfo () {
    return calculateLevel(this.totalExp)
  }

  // ========================================================================
  // 连续天数管理
  // ========================================================================

  /**
   * 更新连续写作天数
   */
  _updateStreak () {
    const today = _formatDateISO(new Date())
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = _formatDateISO(yesterday)

    // 检查昨天是否有写作记录
    const hasYesterdayRecord = this.writingRecords.some(r => r.date === yesterdayStr)

    if (hasYesterdayRecord || this.stats.currentStreak === 0) {
      this.stats.currentStreak++
    } else {
      // 检查今天是否已经开始了新的连续
      const hasTodayRecord = this.writingRecords.some(r => r.date === today && r.words > 0)
      if (hasTodayRecord && this._todayRecordedWords === this.stats.dailyWords) {
        // 今天第一次写入，重置连续天数
        this.stats.currentStreak = 1
      }
    }

    if (this.stats.currentStreak > this.stats.maxStreak) {
      this.stats.maxStreak = this.stats.currentStreak
    }
  }

  // ========================================================================
  // 成就检查
  // ========================================================================

  /**
   * 检查所有成就的解锁条件
   * @returns {Array} 新解锁的成就列表
   */
  checkAchievements () {
    const newlyUnlocked = []

    for (const achievement of achievements) {
      // 跳过已解锁的
      if (this.unlockedAchievements.includes(achievement.id)) continue

      // 跳过隐藏成就（除非条件满足）
      if (achievement.hidden && !this._checkCondition(achievement.condition)) continue

      // 检查条件
      if (this._checkCondition(achievement.condition)) {
        this.unlockedAchievements.push(achievement.id)

        // 增加经验值奖励
        this._addExp(achievement.reward)

        newlyUnlocked.push(achievement)

        // 触发回调
        this._achievementCallbacks.forEach(cb => {
          try { cb(achievement, true) } catch (e) { console.error(e) }
        })
      }
    }

    return newlyUnlocked
  }

  /**
   * 检查单个成就条件
   * @param {Object} condition - 条件对象
   * @returns {boolean}
   */
  _checkCondition (condition) {
    const fieldValue = this.stats[condition.field]

    switch (condition.type) {
      case 'count':
      case 'total':
      case 'daily':
        return fieldValue >= condition.value
      case 'streak':
        return fieldValue >= condition.value
      case 'flag':
        return fieldValue === condition.value
      case 'special':
        return fieldValue >= condition.value
      default:
        return false
    }
  }

  /**
   * 检查特殊条件（徽章等）
   */
  _checkSpecialConditions (options = {}) {
    const hour = new Date().getHours()

    // 夜猫子检测（凌晨0-5点写作超过1000字）
    if (hour >= 0 && hour < 5 && this.stats.dailyWords >= 1000) {
      this.stats.nightOwl = true
    }
  }

  // ========================================================================
  // 统计面板
  // ========================================================================

  /**
   * 获取完整的统计面板数据
   * @returns {Object}
   */
  getStats () {
    return generateStatsPanel({
      writingRecords: this.writingRecords,
      totalWords: this.stats.totalWords,
      totalChapters: this.stats.totalChapters,
      totalProjects: this.stats.totalProjects,
      currentStreak: this.stats.currentStreak,
      maxStreak: this.stats.maxStreak
    })
  }

  /**
   * 获取成就列表（含解锁状态）
   * @returns {Array}
   */
  getAchievements () {
    return achievements.map(a => ({
      ...a,
      unlocked: this.unlockedAchievements.includes(a.id),
      // 隐藏成就未解锁时不显示详情
      ...(a.hidden && !this.unlockedAchievements.includes(a.id)
        ? { name: '???', description: '隐藏成就', icon: 'Lock' }
        : {})
    }))
  }

  /**
   * 获取成就完成进度
   * @returns {Object}
   */
  getAchievementProgress () {
    const total = achievements.length
    const unlocked = this.unlockedAchievements.length
    const byCategory = {}

    for (const achievement of achievements) {
      if (!byCategory[achievement.category]) {
        byCategory[achievement.category] = { total: 0, unlocked: 0 }
      }
      byCategory[achievement.category].total++
      if (this.unlockedAchievements.includes(achievement.id)) {
        byCategory[achievement.category].unlocked++
      }
    }

    return {
      total,
      unlocked,
      percentage: Math.round((unlocked / total) * 100),
      byCategory
    }
  }

  // ========================================================================
  // 数据持久化
  // ========================================================================

  /**
   * 导出所有数据
   * @returns {Object}
   */
  exportData () {
    return {
      stats: this.stats,
      totalExp: this.totalExp,
      unlockedAchievements: this.unlockedAchievements,
      unlockedBadges: this.unlockedBadges,
      writingRecords: this.writingRecords,
      checkinRecords: this.checkin.records,
      checkinStreak: this.checkin.currentStreak,
      checkinMaxStreak: this.checkin.maxStreak,
      checkinLastDate: this.checkin.lastCheckinDate
    }
  }

  /**
   * 导入数据
   * @param {Object} data
   */
  importData (data) {
    this.init(data)
  }
}

// ============================================================================
// 导出
// ============================================================================

/**
 * 游戏化系统默认实例
 * 可以直接使用，也可以通过 createGamificationSystem() 创建新实例
 */
export const gamificationSystem = new GamificationSystem()

/**
 * 便捷函数：创建游戏化系统实例
 * @returns {GamificationSystem}
 */
export function createGamificationSystem () {
  return new GamificationSystem()
}

export default gamificationSystem

/**
 * 云书 - 中文语言包（简体中文）
 * 包含所有UI文本、提示信息、错误消息和帮助文档
 * @module locales/zh-CN
 */

export default {
  // ============================================
  // 一、应用基础信息
  // ============================================
  app: {
    name: '云书',
    fullName: '云书 - 世界级AI文学创作平台',
    slogan: '从百万字网文到诺贝尔文学奖级别作品',
    version: 'v2.1.0',
    copyright: '© 2024 云书团队 版权所有',
    description: '云书是一款专业的AI辅助文学创作平台，支持从网络小说到严肃文学的全类型创作。'
  },

  // ============================================
  // 二、导航菜单
  // ============================================
  nav: {
    // 主导航
    home: '首页',
    master: '大师创作',
    imitation: '风格仿写',
    workshop: '长篇工坊',
    shortStory: '短文写作',
    
    // 写作工具
    focus: '专注模式',
    analysis: '质量分析',
    ideas: '灵感工坊',
    cards: '索引卡片',
    multiView: '四视图编辑器',
    
    // 项目管理
    novels: '小说列表',
    chapters: '章节管理',
    writer: '写作编辑器',
    graph: '章节图谱',
    megaNovel: '百万字管理',
    
    // 叙事工程
    foreshadowing: '伏笔管理',
    narrative: '叙事结构',
    literary: '文学工坊',
    
    // 资源库
    prompts: '提示词库',
    genres: '小说类型',
    tools: '工具库',
    bookAnalysis: '拆书工具',
    
    // 导出协作
    export: '导出中心',
    collaboration: '协作中心',
    collaborationHub: '协作中心',
    review: '审阅模式',
    
    // 扩展
    plugins: '插件市场',
    gamification: '成就中心',
    
    // 系统
    goals: '写作目标',
    billing: 'Token统计',
    settings: '系统设置',
    
    // 菜单分组标题
    aiCreation: 'AI 创作',
    writingTools: '写作工具',
    projectManagement: '项目管理',
    narrativeEngineering: '叙事工程',
    resources: '资源库',
    exportCollaboration: '导出协作',
    extensions: '扩展',
    system: '系统'
  },

  // ============================================
  // 三、首页
  // ============================================
  home: {
    // 欢迎区域
    welcome: '欢迎回来！',
    welcomeSubtitle: '开始您的创作之旅，让AI助力您的小说创作',
    quickStart: '快速开始',
    createNovel: '创建新小说',
    
    // 统计概览
    totalNovels: '总小说数',
    totalWords: '总字数',
    totalChapters: '总章节数',
    totalTokens: '已用Token',
    
    // 今日统计
    todayStats: '今日统计',
    todayWords: '今日字数',
    streakDays: '连续天数',
    wordsUnit: '字',
    
    // 功能展示
    features: '功能展示',
    featureCategories: {
      aiCreation: {
        title: 'AI创作',
        description: '智能创作助手，激发无限灵感'
      },
      writingTools: {
        title: '写作工具',
        description: '专业工具集，提升写作效率'
      },
      projectManagement: {
        title: '项目管理',
        description: '高效管理您的创作项目'
      },
      narrativeEngineering: {
        title: '叙事工程',
        description: '构建精妙的叙事结构'
      },
      exportCollaboration: {
        title: '导出协作',
        description: '分享与合作，让作品传播更远'
      },
      extensions: {
        title: '扩展功能',
        description: '丰富的插件生态，无限可能'
      }
    },
    
    // 最近项目
    recentProjects: '最近项目',
    continueWriting: '继续写作',
    lastEdited: '最近编辑',
    noProjects: '暂无项目',
    createFirst: '创建您的第一个项目',
    
    // 快捷入口
    quickAccess: '快捷入口',
    commonFunctions: '常用功能',
    
    // 帮助提示
    helpTips: '帮助提示',
    beginnerGuide: '新手引导',
    keyboardShortcuts: '快捷键提示',
    viewAllShortcuts: '查看所有快捷键'
  },

  // ============================================
  // 四、通用操作
  // ============================================
  common: {
    // 基础操作
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    add: '添加',
    remove: '移除',
    copy: '复制',
    paste: '粘贴',
    cut: '剪切',
    undo: '撤销',
    redo: '重做',
    refresh: '刷新',
    reset: '重置',
    clear: '清空',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    export: '导出',
    import: '导入',
    download: '下载',
    upload: '上传',
    share: '分享',
    preview: '预览',
    print: '打印',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    apply: '应用',
    retry: '重试',
    expand: '展开',
    collapse: '收起',
    expandAll: '全部展开',
    collapseAll: '全部收起',
    selectAll: '全选',
    deselectAll: '取消全选',
    invertSelection: '反选',
    more: '更多',
    less: '收起',
    viewAll: '查看全部',
    viewDetails: '查看详情',
    loading: '加载中...',
    processing: '处理中...',
    generating: '生成中...',
    saving: '保存中...',
    noData: '暂无数据',
    noResults: '无搜索结果',
    
    // 状态
    status: {
      active: '活跃',
      inactive: '未激活',
      enabled: '已启用',
      disabled: '已禁用',
      completed: '已完成',
      pending: '待处理',
      inProgress: '进行中',
      failed: '失败',
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息'
    },
    
    // 时间相关
    time: {
      justNow: '刚刚',
      minutesAgo: '{n}分钟前',
      hoursAgo: '{n}小时前',
      daysAgo: '{n}天前',
      weeksAgo: '{n}周前',
      monthsAgo: '{n}个月前',
      yearsAgo: '{n}年前',
      today: '今天',
      yesterday: '昨天',
      thisWeek: '本周',
      thisMonth: '本月',
      thisYear: '今年'
    },
    
    // 确认对话框
    confirmDialog: {
      delete: '确定要删除吗？此操作不可恢复。',
      save: '是否保存更改？',
      discard: '是否放弃更改？',
      leave: '确定要离开吗？未保存的更改将丢失。',
      reset: '确定要重置吗？所有设置将恢复默认值。'
    }
  },

  // ============================================
  // 五、小说管理
  // ============================================
  novel: {
    // 标题
    title: '小说管理',
    createTitle: '创建新小说',
    editTitle: '编辑小说',
    
    // 字段
    fields: {
      title: '小说标题',
      titlePlaceholder: '请输入小说标题',
      author: '作者',
      authorPlaceholder: '请输入作者名称',
      genre: '类型',
      genrePlaceholder: '请选择小说类型',
      description: '简介',
      descriptionPlaceholder: '请输入小说简介',
      cover: '封面',
      coverPlaceholder: '上传封面图片',
      tags: '标签',
      tagsPlaceholder: '添加标签，按回车确认',
      status: '状态',
      wordCount: '字数',
      chapterCount: '章节数',
      createdAt: '创建时间',
      updatedAt: '更新时间'
    },
    
    // 状态
    status: {
      draft: '草稿',
      serializing: '连载中',
      completed: '已完结',
      suspended: '暂停更新'
    },
    
    // 操作
    actions: {
      create: '创建小说',
      edit: '编辑',
      delete: '删除',
      duplicate: '复制',
      export: '导出',
      share: '分享',
      archive: '归档',
      restore: '恢复'
    },
    
    // 提示
    tips: {
      createSuccess: '小说创建成功',
      updateSuccess: '小说更新成功',
      deleteSuccess: '小说已删除',
      deleteConfirm: '确定要删除这本小说吗？所有章节将被删除，此操作不可恢复。',
      noNovels: '还没有创建任何小说',
      createFirst: '点击上方按钮创建您的第一部小说'
    }
  },

  // ============================================
  // 六、章节管理
  // ============================================
  chapter: {
    // 标题
    title: '章节管理',
    createTitle: '创建新章节',
    editTitle: '编辑章节',
    
    // 字段
    fields: {
      title: '章节标题',
      titlePlaceholder: '请输入章节标题',
      content: '章节内容',
      contentPlaceholder: '开始写作...',
      summary: '章节摘要',
      summaryPlaceholder: '请输入章节摘要（可选）',
      wordCount: '字数',
      status: '状态',
      order: '排序'
    },
    
    // 状态
    status: {
      draft: '草稿',
      published: '已发布',
      revised: '已修订'
    },
    
    // 操作
    actions: {
      create: '新建章节',
      edit: '编辑',
      delete: '删除',
      moveUp: '上移',
      moveDown: '下移',
      duplicate: '复制章节',
      merge: '合并章节',
      split: '拆分章节'
    },
    
    // 提示
    tips: {
      createSuccess: '章节创建成功',
      updateSuccess: '章节更新成功',
      deleteSuccess: '章节已删除',
      deleteConfirm: '确定要删除这个章节吗？此操作不可恢复。',
      noChapters: '还没有创建任何章节',
      createFirst: '点击上方按钮创建第一个章节',
      autoSave: '内容已自动保存'
    }
  },

  // ============================================
  // 七、AI创作
  // ============================================
  aiCreation: {
    // 大师创作
    master: {
      title: '大师创作',
      subtitle: 'AI大师级文学创作',
      description: '借助AI的力量，创作出具有大师水准的文学作品',
      selectStyle: '选择风格',
      stylePlaceholder: '请选择创作风格',
      inputPrompt: '创作提示',
      promptPlaceholder: '描述您想要创作的内容...',
      generate: '生成作品',
      regenerating: '重新生成',
      generatedContent: '生成的内容',
      insertToEditor: '插入到编辑器',
      copyContent: '复制内容',
      tips: {
        noStyle: '请先选择创作风格',
        noPrompt: '请输入创作提示',
        generating: '正在生成内容，请稍候...',
        generateSuccess: '内容生成成功',
        generateFailed: '内容生成失败，请重试'
      }
    },
    
    // 风格仿写
    imitation: {
      title: '风格仿写',
      subtitle: '基于原著风格仿写',
      description: '学习并模仿经典作家的写作风格',
      selectAuthor: '选择作家',
      authorPlaceholder: '请选择要模仿的作家',
      inputText: '参考文本',
      textPlaceholder: '粘贴参考文本（可选）',
      inputPrompt: '仿写提示',
      promptPlaceholder: '描述您想要仿写的内容...',
      analyze: '分析风格',
      generate: '开始仿写',
      styleAnalysis: '风格分析结果',
      generatedContent: '仿写结果',
      tips: {
        noAuthor: '请先选择要模仿的作家',
        noPrompt: '请输入仿写提示',
        analyzing: '正在分析风格...',
        generating: '正在生成仿写内容...',
        analyzeSuccess: '风格分析完成',
        generateSuccess: '仿写内容生成成功'
      }
    },
    
    // 长篇工坊
    workshop: {
      title: '长篇工坊',
      subtitle: '百万字长篇项目管理',
      description: '专为长篇小说创作设计的综合工作台',
      outline: '大纲管理',
      characters: '角色管理',
      worldview: '世界观设定',
      timeline: '时间线',
      plotThreads: '情节线',
      tips: {
        noOutline: '还没有创建大纲',
        createOutline: '创建大纲可以帮助您更好地规划故事'
      }
    },
    
    // 短文写作
    shortStory: {
      title: '短文写作',
      subtitle: '快速短文创作',
      description: '快速创作短篇小说、散文、随笔等短篇作品',
      selectType: '选择类型',
      typePlaceholder: '请选择作品类型',
      types: {
        shortStory: '短篇小说',
        essay: '散文',
        prose: '随笔',
        poetry: '诗歌',
        microFiction: '微小说',
        flashFiction: '闪小说'
      },
      inputPrompt: '创作提示',
      promptPlaceholder: '描述您想要创作的内容...',
      generate: '生成作品',
      tips: {
        noType: '请先选择作品类型',
        noPrompt: '请输入创作提示'
      }
    }
  },

  // ============================================
  // 八、写作工具
  // ============================================
  writingTools: {
    // 专注模式
    focus: {
      title: '专注模式',
      subtitle: '无干扰沉浸写作',
      description: '全屏沉浸式写作环境，帮助您专注于创作',
      enterFocus: '进入专注模式',
      exitFocus: '退出专注模式',
      settings: {
        theme: '主题',
        fontSize: '字体大小',
        lineHeight: '行高',
        width: '内容宽度',
        backgroundColor: '背景颜色',
        textColor: '文字颜色'
      },
      themes: {
        light: '浅色',
        dark: '深色',
        sepia: '护眼',
        forest: '森林',
        ocean: '海洋'
      },
      stats: {
        words: '字数',
        characters: '字符',
        paragraphs: '段落',
        readingTime: '阅读时间',
        sessionTime: '写作时长'
      },
      tips: {
        pressEsc: '按 ESC 退出专注模式',
        autoSave: '内容已自动保存'
      }
    },
    
    // 质量分析
    analysis: {
      title: '质量分析',
      subtitle: '文本质量检测与评分',
      description: '全面分析文本质量，提供改进建议',
      analyze: '开始分析',
      analyzing: '正在分析...',
      results: '分析结果',
      scores: {
        overall: '综合评分',
        readability: '可读性',
        vocabulary: '词汇丰富度',
        sentenceStructure: '句式结构',
        emotionalExpression: '情感表达',
        narrativeFlow: '叙事流畅度'
      },
      suggestions: '改进建议',
      issues: '问题检测',
      issueTypes: {
        repeatedWords: '重复用词',
        longSentences: '过长句子',
        passiveVoice: '被动语态',
        cliches: '陈词滥调',
        weakWords: '弱词使用'
      },
      tips: {
        noContent: '请先输入要分析的文本',
        analyzeSuccess: '分析完成'
      }
    },
    
    // 灵感工坊
    ideas: {
      title: '灵感工坊',
      subtitle: '想法板、片段库、写作热身',
      description: '收集灵感、记录片段、进行写作热身练习',
      ideaBoard: '想法板',
      fragments: '片段库',
      warmup: '写作热身',
      prompts: '创意提示',
      randomPrompt: '随机提示',
      addIdea: '添加想法',
      addFragment: '添加片段',
      categories: {
        plot: '情节',
        character: '角色',
        dialogue: '对话',
        description: '描写',
        setting: '设定',
        theme: '主题'
      },
      tips: {
        noIdeas: '还没有记录任何想法',
        noFragments: '还没有保存任何片段'
      }
    },
    
    // 索引卡片
    cards: {
      title: '索引卡片',
      subtitle: '卡片式内容组织',
      description: '使用卡片方式组织和规划您的内容',
      createCard: '创建卡片',
      editCard: '编辑卡片',
      deleteCard: '删除卡片',
      cardTypes: {
        scene: '场景',
        character: '角色',
        plot: '情节',
        note: '笔记',
        research: '研究'
      },
      viewModes: {
        grid: '网格视图',
        list: '列表视图',
        board: '看板视图'
      },
      tips: {
        noCards: '还没有创建任何卡片',
        createFirst: '创建第一张卡片开始规划'
      }
    },
    
    // 四视图编辑器
    multiView: {
      title: '四视图编辑器',
      subtitle: '多视图同步编辑',
      description: '同时查看和编辑多个章节或内容',
      viewCount: '视图数量',
      layouts: {
        '2h': '水平二分',
        '2v': '垂直二分',
        '4': '四分视图'
      },
      sync: '同步滚动',
      tips: {
        selectContent: '选择要显示的内容'
      }
    }
  },

  // ============================================
  // 九、项目管理
  // ============================================
  projectManagement: {
    // 百万字管理
    megaNovel: {
      title: '百万字管理',
      subtitle: '超长篇小说专用管理工具',
      description: '专为百万字以上长篇小说设计的项目管理工具',
      overview: '项目概览',
      volumes: '卷管理',
      arcs: '故事线',
      milestones: '里程碑',
      progress: '进度追踪',
      stats: {
        totalWords: '总字数',
        targetWords: '目标字数',
        completionRate: '完成率',
        dailyAverage: '日均字数',
        estimatedDays: '预计完成天数'
      },
      tips: {
        noVolumes: '还没有创建卷',
        createVolume: '创建卷来组织您的内容'
      }
    },
    
    // 章节图谱
    chapterGraph: {
      title: '章节图谱',
      subtitle: '章节关系可视化',
      description: '可视化展示章节之间的关系和结构',
      viewModes: {
        tree: '树状图',
        flowchart: '流程图',
        timeline: '时间线',
        mindmap: '思维导图'
      },
      nodeTypes: {
        chapter: '章节',
        event: '事件',
        character: '角色',
        location: '地点'
      },
      actions: {
        addNode: '添加节点',
        addEdge: '添加关系',
        deleteNode: '删除节点',
        editNode: '编辑节点'
      },
      tips: {
        noNodes: '还没有创建任何节点'
      }
    }
  },

  // ============================================
  // 十、叙事工程
  // ============================================
  narrativeEngineering: {
    // 伏笔管理
    foreshadowing: {
      title: '伏笔管理',
      subtitle: '剧情伏笔追踪与回收',
      description: '追踪和管理小说中的伏笔，确保情节连贯',
      createForeshadowing: '创建伏笔',
      editForeshadowing: '编辑伏笔',
      resolveForeshadowing: '回收伏笔',
      fields: {
        name: '伏笔名称',
        description: '伏笔描述',
        plantedChapter: '埋设章节',
        resolvedChapter: '回收章节',
        status: '状态',
        importance: '重要程度'
      },
      status: {
        planted: '已埋设',
        resolved: '已回收',
        abandoned: '已废弃'
      },
      importance: {
        high: '重要',
        medium: '中等',
        low: '次要'
      },
      tips: {
        noForeshadowing: '还没有创建任何伏笔',
        unresolved: '有 {n} 个伏笔待回收'
      }
    },
    
    // 叙事结构
    narrative: {
      title: '叙事结构',
      subtitle: '叙事元素建模与角色深度',
      description: '构建和分析小说的叙事结构',
      structures: {
        threeAct: '三幕式结构',
        herosJourney: '英雄之旅',
        saveTheCat: '救猫咪',
        snowflake: '雪花法',
        custom: '自定义结构'
      },
      elements: {
        incitingIncident: '激励事件',
        risingAction: '上升动作',
        climax: '高潮',
        fallingAction: '下降动作',
        resolution: '结局'
      },
      tips: {
        selectStructure: '选择一个叙事结构模板'
      }
    },
    
    // 文学工坊
    literary: {
      title: '文学工坊',
      subtitle: '严肃文学创作工具',
      description: '为严肃文学创作提供专业工具和支持',
      techniques: '文学技巧',
      rhetoricalDevices: '修辞手法',
      literaryElements: '文学元素',
      styleAnalysis: '风格分析',
      depthTools: {
        symbolism: '象征主义',
        metaphor: '隐喻系统',
        imagery: '意象管理',
        theme: '主题深化'
      },
      tips: {
        selectTechnique: '选择一个文学技巧进行分析和应用'
      }
    }
  },

  // ============================================
  // 十一、导出与协作
  // ============================================
  exportCollaboration: {
    // 导出中心
    export: {
      title: '导出中心',
      subtitle: '多格式专业导出',
      description: '支持多种格式的专业导出功能',
      formats: {
        txt: '纯文本 (TXT)',
        docx: 'Word文档 (DOCX)',
        pdf: 'PDF文档',
        epub: '电子书 (EPUB)',
        markdown: 'Markdown',
        html: '网页 (HTML)'
      },
      options: {
        includeCover: '包含封面',
        includeToc: '包含目录',
        includeSummary: '包含摘要',
        chapterBreak: '章节分页',
        pageNumbers: '页码'
      },
      actions: {
        export: '导出',
        exportAll: '导出全部',
        exportSelected: '导出选中',
        preview: '预览'
      },
      tips: {
        selectFormat: '请选择导出格式',
        exporting: '正在导出...',
        exportSuccess: '导出成功',
        exportFailed: '导出失败，请重试'
      }
    },
    
    // 协作中心
    collaboration: {
      title: '协作中心',
      subtitle: '分享、评论与版本对比',
      description: '与他人协作创作，分享作品，收集反馈',
      share: '分享',
      invite: '邀请协作',
      comments: '评论',
      versions: '版本历史',
      compare: '版本对比',
      permissions: {
        view: '仅查看',
        comment: '可评论',
        edit: '可编辑',
        admin: '管理员'
      },
      tips: {
        noCollaborators: '还没有协作者',
        inviteFirst: '邀请他人一起创作'
      }
    },
    
    // 审阅模式
    review: {
      title: '审阅模式',
      subtitle: '专业审阅与批注',
      description: '专业的审阅工具，支持批注、修订和建议',
      addComment: '添加批注',
      addSuggestion: '添加建议',
      acceptChange: '接受修订',
      rejectChange: '拒绝修订',
      viewModes: {
        original: '原始版本',
        final: '最终版本',
        markup: '标记模式'
      },
      filters: {
        all: '全部',
        comments: '批注',
        suggestions: '建议',
        changes: '修订'
      },
      tips: {
        noComments: '没有批注',
        noChanges: '没有修订'
      }
    }
  },

  // ============================================
  // 十二、扩展功能
  // ============================================
  extensions: {
    // 插件市场
    plugins: {
      title: '插件市场',
      subtitle: '扩展功能插件',
      description: '丰富的插件生态，扩展云书的功能',
      installed: '已安装',
      available: '可用插件',
      popular: '热门插件',
      recent: '最新插件',
      actions: {
        install: '安装',
        uninstall: '卸载',
        enable: '启用',
        disable: '禁用',
        settings: '设置',
        update: '更新'
      },
      categories: {
        writing: '写作辅助',
        analysis: '分析工具',
        export: '导出格式',
        integration: '集成工具',
        themes: '主题美化',
        productivity: '效率提升'
      },
      tips: {
        noInstalled: '还没有安装任何插件',
        browse: '浏览插件市场发现更多功能'
      }
    },
    
    // 成就中心
    gamification: {
      title: '成就中心',
      subtitle: '成就、等级与写作统计',
      description: '游戏化的写作体验，激励持续创作',
      achievements: '成就',
      level: '等级',
      experience: '经验值',
      stats: '统计数据',
      badges: '徽章',
      streak: '连续写作',
      leaderboard: '排行榜',
      achievementsList: {
        firstNovel: '处女作 - 创建第一部小说',
        tenChapters: '多产作家 - 完成10个章节',
        hundredThousand: '十万字里程碑',
        millionWords: '百万字大师',
        streak7: '周周坚持 - 连续写作7天',
        streak30: '月月坚持 - 连续写作30天',
        streak100: '百日坚持 - 连续写作100天'
      },
      tips: {
        noAchievements: '还没有解锁任何成就',
        keepWriting: '继续写作解锁更多成就'
      }
    }
  },

  // ============================================
  // 十三、系统设置
  // ============================================
  settings: {
    title: '系统设置',
    subtitle: '应用配置与关于',
    
    // API配置
    api: {
      title: 'API配置',
      provider: '服务商',
      providerPlaceholder: '选择API服务商',
      apiKey: 'API密钥',
      apiKeyPlaceholder: '输入您的API密钥',
      baseUrl: 'API地址',
      baseUrlPlaceholder: '自定义API地址（可选）',
      model: '模型选择',
      modelPlaceholder: '选择使用的模型',
      test: '测试连接',
      testSuccess: 'API连接成功',
      testFailed: 'API连接失败',
      providers: {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        deepseek: 'DeepSeek',
        google: 'Google AI',
        zhipu: '智谱AI',
        moonshot: 'Moonshot',
        custom: '自定义'
      }
    },
    
    // 外观设置
    appearance: {
      title: '外观设置',
      theme: '主题',
      themes: {
        default: '默认蓝',
        dark: '暗夜黑',
        green: '护眼绿',
        purple: '优雅紫',
        warm: '暖阳橙'
      },
      fontSize: '字体大小',
      language: '语言',
      languages: {
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語'
      }
    },
    
    // 编辑器设置
    editor: {
      title: '编辑器设置',
      autoSave: '自动保存',
      autoSaveInterval: '自动保存间隔',
      spellCheck: '拼写检查',
      wordWrap: '自动换行',
      showLineNumbers: '显示行号',
      highlightCurrentLine: '高亮当前行',
      indentSize: '缩进大小',
      tabSize: 'Tab宽度'
    },
    
    // 无障碍设置
    accessibility: {
      title: '无障碍设置',
      highContrast: '高对比度模式',
      largeText: '大字体模式',
      reducedMotion: '减少动画',
      colorBlindFriendly: '色盲友好模式',
      colorBlindTypes: {
        deuteranopia: '红绿色盲',
        protanopia: '红色盲',
        tritanopia: '蓝黄色盲'
      },
      screenReader: '屏幕阅读器优化',
      keyboardNavigation: '键盘导航增强'
    },
    
    // 存储设置
    storage: {
      title: '存储设置',
      dataLocation: '数据存储位置',
      autoBackup: '自动备份',
      backupInterval: '备份间隔',
      maxBackups: '最大备份数',
      clearCache: '清除缓存',
      exportData: '导出数据',
      importData: '导入数据'
    },
    
    // 关于
    about: {
      title: '关于',
      version: '版本',
      author: '作者',
      website: '官方网站',
      documentation: '帮助文档',
      feedback: '反馈建议',
      license: '开源协议',
      acknowledgements: '致谢'
    }
  },

  // ============================================
  // 十四、错误消息
  // ============================================
  errors: {
    // 通用错误
    general: {
      unknown: '发生未知错误，请重试',
      network: '网络连接失败，请检查网络设置',
      timeout: '请求超时，请重试',
      server: '服务器错误，请稍后重试',
      notFound: '请求的资源不存在',
      forbidden: '没有权限执行此操作',
      unauthorized: '未授权，请先登录'
    },
    
    // 验证错误
    validation: {
      required: '此字段为必填项',
      minLength: '最少需要 {min} 个字符',
      maxLength: '最多允许 {max} 个字符',
      email: '请输入有效的邮箱地址',
      url: '请输入有效的网址',
      number: '请输入有效的数字',
      integer: '请输入整数',
      positive: '请输入正数',
      range: '数值必须在 {min} 到 {max} 之间'
    },
    
    // 文件错误
    file: {
      tooLarge: '文件大小超过限制（最大 {size}）',
      invalidType: '不支持的文件类型',
      uploadFailed: '文件上传失败',
      downloadFailed: '文件下载失败',
      readFailed: '文件读取失败',
      writeFailed: '文件写入失败'
    },
    
    // API错误
    api: {
      invalidKey: 'API密钥无效',
      rateLimit: 'API调用频率超限，请稍后重试',
      quotaExceeded: 'API配额已用完',
      modelNotAvailable: '所选模型不可用',
      contextTooLong: '上下文长度超限',
      contentFiltered: '内容被安全过滤拦截'
    },
    
    // 数据错误
    data: {
      saveFailed: '数据保存失败',
      loadFailed: '数据加载失败',
      deleteFailed: '数据删除失败',
      duplicate: '数据已存在',
      notFound: '数据不存在',
      corrupted: '数据损坏，请尝试恢复备份'
    }
  },

  // ============================================
  // 十五、帮助文档
  // ============================================
  help: {
    // 快捷键
    shortcuts: {
      title: '键盘快捷键',
      global: {
        title: '全局快捷键',
        commandPalette: 'Ctrl+K - 打开命令面板',
        newNovel: 'Ctrl+N - 新建小说',
        save: 'Ctrl+S - 保存',
        search: 'Ctrl+F - 搜索',
        settings: 'Ctrl+, - 打开设置'
      },
      editor: {
        title: '编辑器快捷键',
        bold: 'Ctrl+B - 加粗',
        italic: 'Ctrl+I - 斜体',
        underline: 'Ctrl+U - 下划线',
        undo: 'Ctrl+Z - 撤销',
        redo: 'Ctrl+Y - 重做',
        cut: 'Ctrl+X - 剪切',
        copy: 'Ctrl+C - 复制',
        paste: 'Ctrl+V - 粘贴',
        selectAll: 'Ctrl+A - 全选'
      },
      navigation: {
        title: '导航快捷键',
        home: 'Alt+Home - 跳转首页',
        back: 'Alt+Left - 返回上一页',
        forward: 'Alt+Right - 前进下一页',
        skipToContent: 'Tab - 跳转到主要内容'
      }
    },
    
    // 新手引导
    beginner: {
      title: '新手引导',
      welcome: '欢迎使用云书！',
      step1: '首先，配置您的API密钥以启用AI功能',
      step2: '创建您的第一部小说',
      step3: '添加章节并开始写作',
      step4: '使用AI助手辅助创作',
      step5: '导出您的作品',
      nextStep: '下一步',
      skipGuide: '跳过引导',
      completeGuide: '完成引导'
    },
    
    // 功能说明
    features: {
      title: '功能说明',
      aiCreation: 'AI创作功能帮助您利用人工智能辅助文学创作，支持多种风格和类型。',
      writingTools: '写作工具提供专注模式、质量分析等功能，提升您的写作效率。',
      projectManagement: '项目管理功能帮助您组织和管理大型创作项目。',
      narrativeEngineering: '叙事工程工具帮助您构建复杂的叙事结构和角色关系。',
      exportCollaboration: '导出协作功能让您可以分享作品并与他人协作。'
    }
  },

  // ============================================
  // 十六、无障碍相关
  // ============================================
  accessibility: {
    // 屏幕阅读器公告
    announcements: {
      pageLoaded: '页面已加载',
      contentSaved: '内容已保存',
      contentDeleted: '内容已删除',
      itemCreated: '项目已创建',
      itemUpdated: '项目已更新',
      modalOpened: '对话框已打开',
      modalClosed: '对话框已关闭',
      menuExpanded: '菜单已展开',
      menuCollapsed: '菜单已收起',
      tabSelected: '标签页已选中',
      loadingStarted: '正在加载',
      loadingComplete: '加载完成',
      errorOccurred: '发生错误'
    },
    
    // ARIA标签
    labels: {
      mainNavigation: '主导航',
      mainContent: '主要内容',
      sidebar: '侧边栏',
      header: '页面头部',
      footer: '页面底部',
      search: '搜索',
      userMenu: '用户菜单',
      notifications: '通知',
      settings: '设置',
      close: '关闭',
      expand: '展开',
      collapse: '收起',
      previous: '上一个',
      next: '下一个',
      first: '第一个',
      last: '最后一个',
      currentPage: '当前页',
      totalPages: '总页数',
      selected: '已选中',
      disabled: '已禁用',
      required: '必填',
      optional: '可选'
    },
    
    // 跳过链接
    skipLinks: {
      mainContent: '跳转到主要内容',
      navigation: '跳转到导航',
      search: '跳转到搜索'
    }
  }
}

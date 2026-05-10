/**
 * 云书 - 英文语言包（美式英语）
 * English Language Pack for YunShu
 * @module locales/en-US
 */

export default {
  // ============================================
  // I. Application Information
  // ============================================
  app: {
    name: 'YunShu',
    fullName: 'YunShu - World-Class AI Literary Creation Platform',
    slogan: 'From Million-Word Web Novels to Nobel Prize-Level Literature',
    version: 'v2.1.0',
    copyright: '© 2024 YunShu Team. All Rights Reserved.',
    description: 'YunShu is a professional AI-assisted literary creation platform supporting all genres from web novels to serious literature.'
  },

  // ============================================
  // II. Navigation Menu
  // ============================================
  nav: {
    // Main Navigation
    home: 'Home',
    master: 'Master Creation',
    imitation: 'Style Imitation',
    workshop: 'Novel Workshop',
    shortStory: 'Short Story',
    
    // Writing Tools
    focus: 'Focus Mode',
    analysis: 'Quality Analysis',
    ideas: 'Idea Workshop',
    cards: 'Index Cards',
    multiView: 'Multi-View Editor',
    
    // Project Management
    novels: 'Novels',
    chapters: 'Chapters',
    writer: 'Writer',
    graph: 'Chapter Graph',
    megaNovel: 'Mega Novel',
    
    // Narrative Engineering
    foreshadowing: 'Foreshadowing',
    narrative: 'Narrative Structure',
    literary: 'Literary Workshop',
    
    // Resources
    prompts: 'Prompts Library',
    genres: 'Genres',
    tools: 'Tools Library',
    bookAnalysis: 'Book Analysis',
    
    // Export & Collaboration
    export: 'Export Center',
    collaboration: 'Collaboration',
    collaborationHub: 'Collaboration Hub',
    review: 'Review Mode',
    
    // Extensions
    plugins: 'Plugins',
    gamification: 'Achievements',
    
    // System
    goals: 'Writing Goals',
    billing: 'Token Usage',
    settings: 'Settings',
    
    // Menu Group Titles
    aiCreation: 'AI Creation',
    writingTools: 'Writing Tools',
    projectManagement: 'Project Management',
    narrativeEngineering: 'Narrative Engineering',
    resources: 'Resources',
    exportCollaboration: 'Export & Collaboration',
    extensions: 'Extensions',
    system: 'System'
  },

  // ============================================
  // III. Home Page
  // ============================================
  home: {
    // Welcome Section
    welcome: 'Welcome Back!',
    welcomeSubtitle: 'Start your creative journey with AI-powered novel writing',
    quickStart: 'Quick Start',
    createNovel: 'Create New Novel',
    
    // Statistics Overview
    totalNovels: 'Total Novels',
    totalWords: 'Total Words',
    totalChapters: 'Total Chapters',
    totalTokens: 'Tokens Used',
    
    // Today's Statistics
    todayStats: "Today's Statistics",
    todayWords: "Today's Words",
    streakDays: 'Streak Days',
    wordsUnit: 'words',
    
    // Feature Categories
    features: 'Features',
    featureCategories: {
      aiCreation: {
        title: 'AI Creation',
        description: 'Intelligent writing assistant for unlimited inspiration'
      },
      writingTools: {
        title: 'Writing Tools',
        description: 'Professional toolkit to boost your writing efficiency'
      },
      projectManagement: {
        title: 'Project Management',
        description: 'Efficiently manage your creative projects'
      },
      narrativeEngineering: {
        title: 'Narrative Engineering',
        description: 'Build sophisticated narrative structures'
      },
      exportCollaboration: {
        title: 'Export & Collaboration',
        description: 'Share and collaborate to spread your work further'
      },
      extensions: {
        title: 'Extensions',
        description: 'Rich plugin ecosystem with infinite possibilities'
      }
    },
    
    // Recent Projects
    recentProjects: 'Recent Projects',
    continueWriting: 'Continue Writing',
    lastEdited: 'Last Edited',
    noProjects: 'No projects yet',
    createFirst: 'Create your first project',
    
    // Quick Access
    quickAccess: 'Quick Access',
    commonFunctions: 'Common Functions',
    
    // Help Tips
    helpTips: 'Help Tips',
    beginnerGuide: 'Beginner Guide',
    keyboardShortcuts: 'Keyboard Shortcuts',
    viewAllShortcuts: 'View All Shortcuts'
  },

  // ============================================
  // IV. Common Operations
  // ============================================
  common: {
    // Basic Operations
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    add: 'Add',
    remove: 'Remove',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    undo: 'Undo',
    redo: 'Redo',
    refresh: 'Refresh',
    reset: 'Reset',
    clear: 'Clear',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    share: 'Share',
    preview: 'Preview',
    print: 'Print',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    apply: 'Apply',
    retry: 'Retry',
    expand: 'Expand',
    collapse: 'Collapse',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    invertSelection: 'Invert Selection',
    more: 'More',
    less: 'Less',
    viewAll: 'View All',
    viewDetails: 'View Details',
    loading: 'Loading...',
    processing: 'Processing...',
    generating: 'Generating...',
    saving: 'Saving...',
    noData: 'No data available',
    noResults: 'No results found',
    
    // Status
    status: {
      active: 'Active',
      inactive: 'Inactive',
      enabled: 'Enabled',
      disabled: 'Disabled',
      completed: 'Completed',
      pending: 'Pending',
      inProgress: 'In Progress',
      failed: 'Failed',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    },
    
    // Time Related
    time: {
      justNow: 'Just now',
      minutesAgo: '{n} minutes ago',
      hoursAgo: '{n} hours ago',
      daysAgo: '{n} days ago',
      weeksAgo: '{n} weeks ago',
      monthsAgo: '{n} months ago',
      yearsAgo: '{n} years ago',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisYear: 'This Year'
    },
    
    // Confirm Dialogs
    confirmDialog: {
      delete: 'Are you sure you want to delete? This action cannot be undone.',
      save: 'Do you want to save changes?',
      discard: 'Do you want to discard changes?',
      leave: 'Are you sure you want to leave? Unsaved changes will be lost.',
      reset: 'Are you sure you want to reset? All settings will be restored to defaults.'
    }
  },

  // ============================================
  // V. Novel Management
  // ============================================
  novel: {
    title: 'Novel Management',
    createTitle: 'Create New Novel',
    editTitle: 'Edit Novel',
    
    fields: {
      title: 'Title',
      titlePlaceholder: 'Enter novel title',
      author: 'Author',
      authorPlaceholder: 'Enter author name',
      genre: 'Genre',
      genrePlaceholder: 'Select novel genre',
      description: 'Description',
      descriptionPlaceholder: 'Enter novel description',
      cover: 'Cover',
      coverPlaceholder: 'Upload cover image',
      tags: 'Tags',
      tagsPlaceholder: 'Add tags, press Enter to confirm',
      status: 'Status',
      wordCount: 'Word Count',
      chapterCount: 'Chapters',
      createdAt: 'Created',
      updatedAt: 'Updated'
    },
    
    status: {
      draft: 'Draft',
      serializing: 'Serializing',
      completed: 'Completed',
      suspended: 'Suspended'
    },
    
    actions: {
      create: 'Create Novel',
      edit: 'Edit',
      delete: 'Delete',
      duplicate: 'Duplicate',
      export: 'Export',
      share: 'Share',
      archive: 'Archive',
      restore: 'Restore'
    },
    
    tips: {
      createSuccess: 'Novel created successfully',
      updateSuccess: 'Novel updated successfully',
      deleteSuccess: 'Novel deleted',
      deleteConfirm: 'Are you sure you want to delete this novel? All chapters will be deleted. This action cannot be undone.',
      noNovels: 'No novels created yet',
      createFirst: 'Click the button above to create your first novel'
    }
  },

  // ============================================
  // VI. Chapter Management
  // ============================================
  chapter: {
    title: 'Chapter Management',
    createTitle: 'Create New Chapter',
    editTitle: 'Edit Chapter',
    
    fields: {
      title: 'Chapter Title',
      titlePlaceholder: 'Enter chapter title',
      content: 'Content',
      contentPlaceholder: 'Start writing...',
      summary: 'Summary',
      summaryPlaceholder: 'Enter chapter summary (optional)',
      wordCount: 'Word Count',
      status: 'Status',
      order: 'Order'
    },
    
    status: {
      draft: 'Draft',
      published: 'Published',
      revised: 'Revised'
    },
    
    actions: {
      create: 'New Chapter',
      edit: 'Edit',
      delete: 'Delete',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      duplicate: 'Duplicate Chapter',
      merge: 'Merge Chapters',
      split: 'Split Chapter'
    },
    
    tips: {
      createSuccess: 'Chapter created successfully',
      updateSuccess: 'Chapter updated successfully',
      deleteSuccess: 'Chapter deleted',
      deleteConfirm: 'Are you sure you want to delete this chapter? This action cannot be undone.',
      noChapters: 'No chapters created yet',
      createFirst: 'Click the button above to create your first chapter',
      autoSave: 'Content auto-saved'
    }
  },

  // ============================================
  // VII. AI Creation
  // ============================================
  aiCreation: {
    master: {
      title: 'Master Creation',
      subtitle: 'AI Master-Level Literary Creation',
      description: 'Create master-level literary works with the power of AI',
      selectStyle: 'Select Style',
      stylePlaceholder: 'Select writing style',
      inputPrompt: 'Creation Prompt',
      promptPlaceholder: 'Describe what you want to create...',
      generate: 'Generate Work',
      regenerating: 'Regenerate',
      generatedContent: 'Generated Content',
      insertToEditor: 'Insert to Editor',
      copyContent: 'Copy Content',
      tips: {
        noStyle: 'Please select a writing style first',
        noPrompt: 'Please enter a creation prompt',
        generating: 'Generating content, please wait...',
        generateSuccess: 'Content generated successfully',
        generateFailed: 'Content generation failed, please try again'
      }
    },
    
    imitation: {
      title: 'Style Imitation',
      subtitle: 'Imitate Classic Writing Styles',
      description: 'Learn and imitate the writing styles of classic authors',
      selectAuthor: 'Select Author',
      authorPlaceholder: 'Select an author to imitate',
      inputText: 'Reference Text',
      textPlaceholder: 'Paste reference text (optional)',
      inputPrompt: 'Imitation Prompt',
      promptPlaceholder: 'Describe what you want to imitate...',
      analyze: 'Analyze Style',
      generate: 'Start Imitation',
      styleAnalysis: 'Style Analysis Results',
      generatedContent: 'Imitation Results',
      tips: {
        noAuthor: 'Please select an author to imitate first',
        noPrompt: 'Please enter an imitation prompt',
        analyzing: 'Analyzing style...',
        generating: 'Generating imitation content...',
        analyzeSuccess: 'Style analysis complete',
        generateSuccess: 'Imitation content generated successfully'
      }
    },
    
    workshop: {
      title: 'Novel Workshop',
      subtitle: 'Million-Word Novel Project Management',
      description: 'A comprehensive workbench designed for long-form novel creation',
      outline: 'Outline Management',
      characters: 'Character Management',
      worldview: 'World Building',
      timeline: 'Timeline',
      plotThreads: 'Plot Threads',
      tips: {
        noOutline: 'No outline created yet',
        createOutline: 'Creating an outline helps you better plan your story'
      }
    },
    
    shortStory: {
      title: 'Short Story',
      subtitle: 'Quick Short-Form Creation',
      description: 'Quickly create short stories, essays, prose, and other short-form works',
      selectType: 'Select Type',
      typePlaceholder: 'Select work type',
      types: {
        shortStory: 'Short Story',
        essay: 'Essay',
        prose: 'Prose',
        poetry: 'Poetry',
        microFiction: 'Micro Fiction',
        flashFiction: 'Flash Fiction'
      },
      inputPrompt: 'Creation Prompt',
      promptPlaceholder: 'Describe what you want to create...',
      generate: 'Generate Work',
      tips: {
        noType: 'Please select a work type first',
        noPrompt: 'Please enter a creation prompt'
      }
    }
  },

  // ============================================
  // VIII. Writing Tools
  // ============================================
  writingTools: {
    focus: {
      title: 'Focus Mode',
      subtitle: 'Distraction-Free Immersive Writing',
      description: 'Full-screen immersive writing environment to help you focus on creation',
      enterFocus: 'Enter Focus Mode',
      exitFocus: 'Exit Focus Mode',
      settings: {
        theme: 'Theme',
        fontSize: 'Font Size',
        lineHeight: 'Line Height',
        width: 'Content Width',
        backgroundColor: 'Background Color',
        textColor: 'Text Color'
      },
      themes: {
        light: 'Light',
        dark: 'Dark',
        sepia: 'Sepia',
        forest: 'Forest',
        ocean: 'Ocean'
      },
      stats: {
        words: 'Words',
        characters: 'Characters',
        paragraphs: 'Paragraphs',
        readingTime: 'Reading Time',
        sessionTime: 'Session Time'
      },
      tips: {
        pressEsc: 'Press ESC to exit focus mode',
        autoSave: 'Content auto-saved'
      }
    },
    
    analysis: {
      title: 'Quality Analysis',
      subtitle: 'Text Quality Detection & Scoring',
      description: 'Comprehensive text quality analysis with improvement suggestions',
      analyze: 'Start Analysis',
      analyzing: 'Analyzing...',
      results: 'Analysis Results',
      scores: {
        overall: 'Overall Score',
        readability: 'Readability',
        vocabulary: 'Vocabulary Richness',
        sentenceStructure: 'Sentence Structure',
        emotionalExpression: 'Emotional Expression',
        narrativeFlow: 'Narrative Flow'
      },
      suggestions: 'Improvement Suggestions',
      issues: 'Issue Detection',
      issueTypes: {
        repeatedWords: 'Repeated Words',
        longSentences: 'Long Sentences',
        passiveVoice: 'Passive Voice',
        cliches: 'Cliches',
        weakWords: 'Weak Words'
      },
      tips: {
        noContent: 'Please enter text to analyze first',
        analyzeSuccess: 'Analysis complete'
      }
    },
    
    ideas: {
      title: 'Idea Workshop',
      subtitle: 'Idea Board, Fragments & Writing Warm-up',
      description: 'Collect ideas, record fragments, and practice writing warm-ups',
      ideaBoard: 'Idea Board',
      fragments: 'Fragments',
      warmup: 'Writing Warm-up',
      prompts: 'Creative Prompts',
      randomPrompt: 'Random Prompt',
      addIdea: 'Add Idea',
      addFragment: 'Add Fragment',
      categories: {
        plot: 'Plot',
        character: 'Character',
        dialogue: 'Dialogue',
        description: 'Description',
        setting: 'Setting',
        theme: 'Theme'
      },
      tips: {
        noIdeas: 'No ideas recorded yet',
        noFragments: 'No fragments saved yet'
      }
    },
    
    cards: {
      title: 'Index Cards',
      subtitle: 'Card-Based Content Organization',
      description: 'Organize and plan your content using cards',
      createCard: 'Create Card',
      editCard: 'Edit Card',
      deleteCard: 'Delete Card',
      cardTypes: {
        scene: 'Scene',
        character: 'Character',
        plot: 'Plot',
        note: 'Note',
        research: 'Research'
      },
      viewModes: {
        grid: 'Grid View',
        list: 'List View',
        board: 'Board View'
      },
      tips: {
        noCards: 'No cards created yet',
        createFirst: 'Create your first card to start planning'
      }
    },
    
    multiView: {
      title: 'Multi-View Editor',
      subtitle: 'Synchronized Multi-View Editing',
      description: 'View and edit multiple chapters or content simultaneously',
      viewCount: 'View Count',
      layouts: {
        '2h': 'Horizontal Split',
        '2v': 'Vertical Split',
        '4': 'Four-Way Split'
      },
      sync: 'Sync Scroll',
      tips: {
        selectContent: 'Select content to display'
      }
    }
  },

  // ============================================
  // IX. Project Management
  // ============================================
  projectManagement: {
    megaNovel: {
      title: 'Mega Novel',
      subtitle: 'Ultra-Long Novel Management Tool',
      description: 'Project management tool designed for novels over a million words',
      overview: 'Project Overview',
      volumes: 'Volume Management',
      arcs: 'Story Arcs',
      milestones: 'Milestones',
      progress: 'Progress Tracking',
      stats: {
        totalWords: 'Total Words',
        targetWords: 'Target Words',
        completionRate: 'Completion Rate',
        dailyAverage: 'Daily Average',
        estimatedDays: 'Estimated Days to Complete'
      },
      tips: {
        noVolumes: 'No volumes created yet',
        createVolume: 'Create volumes to organize your content'
      }
    },
    
    chapterGraph: {
      title: 'Chapter Graph',
      subtitle: 'Chapter Relationship Visualization',
      description: 'Visualize chapter relationships and structure',
      viewModes: {
        tree: 'Tree View',
        flowchart: 'Flowchart',
        timeline: 'Timeline',
        mindmap: 'Mind Map'
      },
      nodeTypes: {
        chapter: 'Chapter',
        event: 'Event',
        character: 'Character',
        location: 'Location'
      },
      actions: {
        addNode: 'Add Node',
        addEdge: 'Add Relationship',
        deleteNode: 'Delete Node',
        editNode: 'Edit Node'
      },
      tips: {
        noNodes: 'No nodes created yet'
      }
    }
  },

  // ============================================
  // X. Narrative Engineering
  // ============================================
  narrativeEngineering: {
    foreshadowing: {
      title: 'Foreshadowing',
      subtitle: 'Plot Foreshadowing Tracking & Resolution',
      description: 'Track and manage foreshadowing in your novel to ensure plot coherence',
      createForeshadowing: 'Create Foreshadowing',
      editForeshadowing: 'Edit Foreshadowing',
      resolveForeshadowing: 'Resolve Foreshadowing',
      fields: {
        name: 'Foreshadowing Name',
        description: 'Description',
        plantedChapter: 'Planted Chapter',
        resolvedChapter: 'Resolved Chapter',
        status: 'Status',
        importance: 'Importance'
      },
      status: {
        planted: 'Planted',
        resolved: 'Resolved',
        abandoned: 'Abandoned'
      },
      importance: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      tips: {
        noForeshadowing: 'No foreshadowing created yet',
        unresolved: '{n} foreshadowing items pending resolution'
      }
    },
    
    narrative: {
      title: 'Narrative Structure',
      subtitle: 'Narrative Element Modeling & Character Depth',
      description: 'Build and analyze the narrative structure of your novel',
      structures: {
        threeAct: 'Three-Act Structure',
        herosJourney: "Hero's Journey",
        saveTheCat: 'Save the Cat',
        snowflake: 'Snowflake Method',
        custom: 'Custom Structure'
      },
      elements: {
        incitingIncident: 'Inciting Incident',
        risingAction: 'Rising Action',
        climax: 'Climax',
        fallingAction: 'Falling Action',
        resolution: 'Resolution'
      },
      tips: {
        selectStructure: 'Select a narrative structure template'
      }
    },
    
    literary: {
      title: 'Literary Workshop',
      subtitle: 'Serious Literature Creation Tools',
      description: 'Professional tools and support for serious literary creation',
      techniques: 'Literary Techniques',
      rhetoricalDevices: 'Rhetorical Devices',
      literaryElements: 'Literary Elements',
      styleAnalysis: 'Style Analysis',
      depthTools: {
        symbolism: 'Symbolism',
        metaphor: 'Metaphor System',
        imagery: 'Imagery Management',
        theme: 'Theme Development'
      },
      tips: {
        selectTechnique: 'Select a literary technique to analyze and apply'
      }
    }
  },

  // ============================================
  // XI. Export & Collaboration
  // ============================================
  exportCollaboration: {
    export: {
      title: 'Export Center',
      subtitle: 'Multi-Format Professional Export',
      description: 'Professional export functionality supporting multiple formats',
      formats: {
        txt: 'Plain Text (TXT)',
        docx: 'Word Document (DOCX)',
        pdf: 'PDF Document',
        epub: 'E-Book (EPUB)',
        markdown: 'Markdown',
        html: 'Web Page (HTML)'
      },
      options: {
        includeCover: 'Include Cover',
        includeToc: 'Include Table of Contents',
        includeSummary: 'Include Summary',
        chapterBreak: 'Chapter Page Break',
        pageNumbers: 'Page Numbers'
      },
      actions: {
        export: 'Export',
        exportAll: 'Export All',
        exportSelected: 'Export Selected',
        preview: 'Preview'
      },
      tips: {
        selectFormat: 'Please select an export format',
        exporting: 'Exporting...',
        exportSuccess: 'Export successful',
        exportFailed: 'Export failed, please try again'
      }
    },
    
    collaboration: {
      title: 'Collaboration Hub',
      subtitle: 'Share, Comment & Version Compare',
      description: 'Collaborate with others, share works, and collect feedback',
      share: 'Share',
      invite: 'Invite Collaborator',
      comments: 'Comments',
      versions: 'Version History',
      compare: 'Version Compare',
      permissions: {
        view: 'View Only',
        comment: 'Can Comment',
        edit: 'Can Edit',
        admin: 'Admin'
      },
      tips: {
        noCollaborators: 'No collaborators yet',
        inviteFirst: 'Invite others to collaborate'
      }
    },
    
    review: {
      title: 'Review Mode',
      subtitle: 'Professional Review & Annotation',
      description: 'Professional review tools supporting annotations, revisions, and suggestions',
      addComment: 'Add Comment',
      addSuggestion: 'Add Suggestion',
      acceptChange: 'Accept Change',
      rejectChange: 'Reject Change',
      viewModes: {
        original: 'Original Version',
        final: 'Final Version',
        markup: 'Markup Mode'
      },
      filters: {
        all: 'All',
        comments: 'Comments',
        suggestions: 'Suggestions',
        changes: 'Changes'
      },
      tips: {
        noComments: 'No comments',
        noChanges: 'No changes'
      }
    }
  },

  // ============================================
  // XII. Extensions
  // ============================================
  extensions: {
    plugins: {
      title: 'Plugin Marketplace',
      subtitle: 'Extension Plugins',
      description: 'Rich plugin ecosystem to extend YunShu functionality',
      installed: 'Installed',
      available: 'Available Plugins',
      popular: 'Popular Plugins',
      recent: 'Recent Plugins',
      actions: {
        install: 'Install',
        uninstall: 'Uninstall',
        enable: 'Enable',
        disable: 'Disable',
        settings: 'Settings',
        update: 'Update'
      },
      categories: {
        writing: 'Writing Assistance',
        analysis: 'Analysis Tools',
        export: 'Export Formats',
        integration: 'Integration Tools',
        themes: 'Themes',
        productivity: 'Productivity'
      },
      tips: {
        noInstalled: 'No plugins installed yet',
        browse: 'Browse the marketplace to discover more features'
      }
    },
    
    gamification: {
      title: 'Achievement Center',
      subtitle: 'Achievements, Levels & Writing Statistics',
      description: 'Gamified writing experience to inspire continuous creation',
      achievements: 'Achievements',
      level: 'Level',
      experience: 'Experience',
      stats: 'Statistics',
      badges: 'Badges',
      streak: 'Writing Streak',
      leaderboard: 'Leaderboard',
      achievementsList: {
        firstNovel: 'First Novel - Create your first novel',
        tenChapters: 'Prolific Writer - Complete 10 chapters',
        hundredThousand: '100K Words Milestone',
        millionWords: 'Million Word Master',
        streak7: 'Weekly Dedication - Write for 7 consecutive days',
        streak30: 'Monthly Dedication - Write for 30 consecutive days',
        streak100: '100-Day Dedication - Write for 100 consecutive days'
      },
      tips: {
        noAchievements: 'No achievements unlocked yet',
        keepWriting: 'Keep writing to unlock more achievements'
      }
    }
  },

  // ============================================
  // XIII. Settings
  // ============================================
  settings: {
    title: 'Settings',
    subtitle: 'Application Configuration & About',
    
    api: {
      title: 'API Configuration',
      provider: 'Provider',
      providerPlaceholder: 'Select API provider',
      apiKey: 'API Key',
      apiKeyPlaceholder: 'Enter your API key',
      baseUrl: 'API URL',
      baseUrlPlaceholder: 'Custom API URL (optional)',
      model: 'Model Selection',
      modelPlaceholder: 'Select model to use',
      test: 'Test Connection',
      testSuccess: 'API connection successful',
      testFailed: 'API connection failed',
      providers: {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        deepseek: 'DeepSeek',
        google: 'Google AI',
        zhipu: 'Zhipu AI',
        moonshot: 'Moonshot',
        custom: 'Custom'
      }
    },
    
    appearance: {
      title: 'Appearance',
      theme: 'Theme',
      themes: {
        default: 'Default Blue',
        dark: 'Dark Night',
        green: 'Eye-Care Green',
        purple: 'Elegant Purple',
        warm: 'Warm Orange'
      },
      fontSize: 'Font Size',
      language: 'Language',
      languages: {
        'zh-CN': 'Simplified Chinese',
        'en-US': 'English',
        'ja-JP': 'Japanese'
      }
    },
    
    editor: {
      title: 'Editor Settings',
      autoSave: 'Auto Save',
      autoSaveInterval: 'Auto Save Interval',
      spellCheck: 'Spell Check',
      wordWrap: 'Word Wrap',
      showLineNumbers: 'Show Line Numbers',
      highlightCurrentLine: 'Highlight Current Line',
      indentSize: 'Indent Size',
      tabSize: 'Tab Size'
    },
    
    accessibility: {
      title: 'Accessibility',
      highContrast: 'High Contrast Mode',
      largeText: 'Large Text Mode',
      reducedMotion: 'Reduce Motion',
      colorBlindFriendly: 'Color Blind Friendly Mode',
      colorBlindTypes: {
        deuteranopia: 'Red-Green Color Blind',
        protanopia: 'Red Color Blind',
        tritanopia: 'Blue-Yellow Color Blind'
      },
      screenReader: 'Screen Reader Optimization',
      keyboardNavigation: 'Enhanced Keyboard Navigation'
    },
    
    storage: {
      title: 'Storage Settings',
      dataLocation: 'Data Storage Location',
      autoBackup: 'Auto Backup',
      backupInterval: 'Backup Interval',
      maxBackups: 'Max Backups',
      clearCache: 'Clear Cache',
      exportData: 'Export Data',
      importData: 'Import Data'
    },
    
    about: {
      title: 'About',
      version: 'Version',
      author: 'Author',
      website: 'Official Website',
      documentation: 'Documentation',
      feedback: 'Feedback',
      license: 'License',
      acknowledgements: 'Acknowledgements'
    }
  },

  // ============================================
  // XIV. Error Messages
  // ============================================
  errors: {
    general: {
      unknown: 'An unknown error occurred, please try again',
      network: 'Network connection failed, please check your network settings',
      timeout: 'Request timed out, please try again',
      server: 'Server error, please try again later',
      notFound: 'The requested resource was not found',
      forbidden: 'You do not have permission to perform this action',
      unauthorized: 'Unauthorized, please log in first'
    },
    
    validation: {
      required: 'This field is required',
      minLength: 'Minimum {min} characters required',
      maxLength: 'Maximum {max} characters allowed',
      email: 'Please enter a valid email address',
      url: 'Please enter a valid URL',
      number: 'Please enter a valid number',
      integer: 'Please enter an integer',
      positive: 'Please enter a positive number',
      range: 'Value must be between {min} and {max}'
    },
    
    file: {
      tooLarge: 'File size exceeds limit (max {size})',
      invalidType: 'Unsupported file type',
      uploadFailed: 'File upload failed',
      downloadFailed: 'File download failed',
      readFailed: 'File read failed',
      writeFailed: 'File write failed'
    },
    
    api: {
      invalidKey: 'Invalid API key',
      rateLimit: 'API rate limit exceeded, please try again later',
      quotaExceeded: 'API quota exhausted',
      modelNotAvailable: 'Selected model is not available',
      contextTooLong: 'Context length exceeded',
      contentFiltered: 'Content blocked by safety filter'
    },
    
    data: {
      saveFailed: 'Data save failed',
      loadFailed: 'Data load failed',
      deleteFailed: 'Data delete failed',
      duplicate: 'Data already exists',
      notFound: 'Data not found',
      corrupted: 'Data corrupted, please try restoring from backup'
    }
  },

  // ============================================
  // XV. Help Documentation
  // ============================================
  help: {
    shortcuts: {
      title: 'Keyboard Shortcuts',
      global: {
        title: 'Global Shortcuts',
        commandPalette: 'Ctrl+K - Open command palette',
        newNovel: 'Ctrl+N - New novel',
        save: 'Ctrl+S - Save',
        search: 'Ctrl+F - Search',
        settings: 'Ctrl+, - Open settings'
      },
      editor: {
        title: 'Editor Shortcuts',
        bold: 'Ctrl+B - Bold',
        italic: 'Ctrl+I - Italic',
        underline: 'Ctrl+U - Underline',
        undo: 'Ctrl+Z - Undo',
        redo: 'Ctrl+Y - Redo',
        cut: 'Ctrl+X - Cut',
        copy: 'Ctrl+C - Copy',
        paste: 'Ctrl+V - Paste',
        selectAll: 'Ctrl+A - Select all'
      },
      navigation: {
        title: 'Navigation Shortcuts',
        home: 'Alt+Home - Go to home',
        back: 'Alt+Left - Go back',
        forward: 'Alt+Right - Go forward',
        skipToContent: 'Tab - Skip to main content'
      }
    },
    
    beginner: {
      title: 'Beginner Guide',
      welcome: 'Welcome to YunShu!',
      step1: 'First, configure your API key to enable AI features',
      step2: 'Create your first novel',
      step3: 'Add chapters and start writing',
      step4: 'Use AI assistant to help with creation',
      step5: 'Export your work',
      nextStep: 'Next Step',
      skipGuide: 'Skip Guide',
      completeGuide: 'Complete Guide'
    },
    
    features: {
      title: 'Feature Description',
      aiCreation: 'AI Creation helps you leverage artificial intelligence for literary creation, supporting various styles and genres.',
      writingTools: 'Writing Tools provide focus mode, quality analysis, and other features to boost your writing efficiency.',
      projectManagement: 'Project Management helps you organize and manage large creative projects.',
      narrativeEngineering: 'Narrative Engineering tools help you build complex narrative structures and character relationships.',
      exportCollaboration: 'Export & Collaboration features let you share your work and collaborate with others.'
    }
  },

  // ============================================
  // XVI. Accessibility
  // ============================================
  accessibility: {
    announcements: {
      pageLoaded: 'Page loaded',
      contentSaved: 'Content saved',
      contentDeleted: 'Content deleted',
      itemCreated: 'Item created',
      itemUpdated: 'Item updated',
      modalOpened: 'Dialog opened',
      modalClosed: 'Dialog closed',
      menuExpanded: 'Menu expanded',
      menuCollapsed: 'Menu collapsed',
      tabSelected: 'Tab selected',
      loadingStarted: 'Loading',
      loadingComplete: 'Loading complete',
      errorOccurred: 'Error occurred'
    },
    
    labels: {
      mainNavigation: 'Main navigation',
      mainContent: 'Main content',
      sidebar: 'Sidebar',
      header: 'Page header',
      footer: 'Page footer',
      search: 'Search',
      userMenu: 'User menu',
      notifications: 'Notifications',
      settings: 'Settings',
      close: 'Close',
      expand: 'Expand',
      collapse: 'Collapse',
      previous: 'Previous',
      next: 'Next',
      first: 'First',
      last: 'Last',
      currentPage: 'Current page',
      totalPages: 'Total pages',
      selected: 'Selected',
      disabled: 'Disabled',
      required: 'Required',
      optional: 'Optional'
    },
    
    skipLinks: {
      mainContent: 'Skip to main content',
      navigation: 'Skip to navigation',
      search: 'Skip to search'
    }
  }
}

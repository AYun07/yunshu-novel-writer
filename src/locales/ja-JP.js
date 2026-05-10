/**
 * 云书 - 日文语言包
 * 日本語言語パック
 * @module locales/ja-JP
 */

export default {
  // ============================================
  // 一、アプリケーション基本情報
  // ============================================
  app: {
    name: '雲書',
    fullName: '雲書 - 世界クラスのAI文学創作プラットフォーム',
    slogan: '100万字のウェブ小説からノーベル文学賞レベルの作品まで',
    version: 'v2.1.0',
    copyright: '© 2024 雲書チーム 全著作権所有',
    description: '雲書は、ウェブ小説から純文学まで、あらゆるジャンルの創作をサポートするプロフェッショナルなAI支援文学創作プラットフォームです。'
  },

  // ============================================
  // 二、ナビゲーションメニュー
  // ============================================
  nav: {
    // メインナビゲーション
    home: 'ホーム',
    master: 'マスター創作',
    imitation: 'スタイル模写',
    workshop: '長編工房',
    shortStory: '短編執筆',
    
    // 執筆ツール
    focus: '集中モード',
    analysis: '品質分析',
    ideas: 'アイデア工房',
    cards: 'インデックスカード',
    multiView: 'マルチビューエディタ',
    
    // プロジェクト管理
    novels: '小説一覧',
    chapters: '章管理',
    writer: '執筆エディタ',
    graph: '章グラフ',
    megaNovel: '100万字管理',
    
    // 物語エンジニアリング
    foreshadowing: '伏線管理',
    narrative: '物語構造',
    literary: '文学工房',
    
    // リソース
    prompts: 'プロンプトライブラリ',
    genres: '小説ジャンル',
    tools: 'ツールライブラリ',
    bookAnalysis: '本分析',
    
    // エクスポートとコラボレーション
    export: 'エクスポートセンター',
    collaboration: 'コラボレーション',
    collaborationHub: 'コラボレーションハブ',
    review: 'レビューモード',
    
    // 拡張機能
    plugins: 'プラグインマーケット',
    gamification: '実績センター',
    
    // システム
    goals: '執筆目標',
    billing: 'トークン統計',
    settings: 'システム設定',
    
    // メニューグループタイトル
    aiCreation: 'AI創作',
    writingTools: '執筆ツール',
    projectManagement: 'プロジェクト管理',
    narrativeEngineering: '物語エンジニアリング',
    resources: 'リソース',
    exportCollaboration: 'エクスポート・コラボ',
    extensions: '拡張機能',
    system: 'システム'
  },

  // ============================================
  // 三、ホームページ
  // ============================================
  home: {
    // ウェルカムエリア
    welcome: 'おかえりなさい！',
    welcomeSubtitle: 'AIの力で小説創作の旅を始めましょう',
    quickStart: 'クイックスタート',
    createNovel: '新しい小説を作成',
    
    // 統計概要
    totalNovels: '小説総数',
    totalWords: '総文字数',
    totalChapters: '章総数',
    totalTokens: '使用トークン',
    
    // 今日の統計
    todayStats: '今日の統計',
    todayWords: '今日の文字数',
    streakDays: '連続日数',
    wordsUnit: '文字',
    
    // 機能カテゴリ
    features: '機能紹介',
    featureCategories: {
      aiCreation: {
        title: 'AI創作',
        description: 'インテリジェントな創作アシスタントで無限のインスピレーションを'
      },
      writingTools: {
        title: '執筆ツール',
        description: 'プロフェッショナルなツールセットで執筆効率を向上'
      },
      projectManagement: {
        title: 'プロジェクト管理',
        description: '創作プロジェクトを効率的に管理'
      },
      narrativeEngineering: {
        title: '物語エンジニアリング',
        description: '精巧な物語構造を構築'
      },
      exportCollaboration: {
        title: 'エクスポート・コラボ',
        description: '共有とコラボレーションで作品を広める'
      },
      extensions: {
        title: '拡張機能',
        description: '豊富なプラグインエコシステムで無限の可能性を'
      }
    },
    
    // 最近のプロジェクト
    recentProjects: '最近のプロジェクト',
    continueWriting: '執筆を続ける',
    lastEdited: '最終編集',
    noProjects: 'プロジェクトはありません',
    createFirst: '最初のプロジェクトを作成',
    
    // クイックアクセス
    quickAccess: 'クイックアクセス',
    commonFunctions: 'よく使う機能',
    
    // ヘルプヒント
    helpTips: 'ヘルプヒント',
    beginnerGuide: '初心者ガイド',
    keyboardShortcuts: 'キーボードショートカット',
    viewAllShortcuts: 'すべてのショートカットを見る'
  },

  // ============================================
  // 四、共通操作
  // ============================================
  common: {
    // 基本操作
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    delete: '削除',
    edit: '編集',
    create: '作成',
    add: '追加',
    remove: '削除',
    copy: 'コピー',
    paste: '貼り付け',
    cut: '切り取り',
    undo: '元に戻す',
    redo: 'やり直し',
    refresh: '更新',
    reset: 'リセット',
    clear: 'クリア',
    search: '検索',
    filter: 'フィルター',
    sort: '並べ替え',
    export: 'エクスポート',
    import: 'インポート',
    download: 'ダウンロード',
    upload: 'アップロード',
    share: '共有',
    preview: 'プレビュー',
    print: '印刷',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    submit: '送信',
    apply: '適用',
    retry: '再試行',
    expand: '展開',
    collapse: '折りたたむ',
    expandAll: 'すべて展開',
    collapseAll: 'すべて折りたたむ',
    selectAll: 'すべて選択',
    deselectAll: '選択解除',
    invertSelection: '選択反転',
    more: 'もっと見る',
    less: '閉じる',
    viewAll: 'すべて見る',
    viewDetails: '詳細を見る',
    loading: '読み込み中...',
    processing: '処理中...',
    generating: '生成中...',
    saving: '保存中...',
    noData: 'データがありません',
    noResults: '検索結果がありません',
    
    // ステータス
    status: {
      active: 'アクティブ',
      inactive: '非アクティブ',
      enabled: '有効',
      disabled: '無効',
      completed: '完了',
      pending: '保留中',
      inProgress: '進行中',
      failed: '失敗',
      success: '成功',
      error: 'エラー',
      warning: '警告',
      info: '情報'
    },
    
    // 時間関連
    time: {
      justNow: 'たった今',
      minutesAgo: '{n}分前',
      hoursAgo: '{n}時間前',
      daysAgo: '{n}日前',
      weeksAgo: '{n}週間前',
      monthsAgo: '{n}ヶ月前',
      yearsAgo: '{n}年前',
      today: '今日',
      yesterday: '昨日',
      thisWeek: '今週',
      thisMonth: '今月',
      thisYear: '今年'
    },
    
    // 確認ダイアログ
    confirmDialog: {
      delete: '削除してもよろしいですか？この操作は取り消せません。',
      save: '変更を保存しますか？',
      discard: '変更を破棄しますか？',
      leave: '離れてもよろしいですか？保存されていない変更は失われます。',
      reset: 'リセットしてもよろしいですか？すべての設定がデフォルトに戻ります。'
    }
  },

  // ============================================
  // 五、小説管理
  // ============================================
  novel: {
    title: '小説管理',
    createTitle: '新しい小説を作成',
    editTitle: '小説を編集',
    
    fields: {
      title: '小説タイトル',
      titlePlaceholder: '小説タイトルを入力',
      author: '作者',
      authorPlaceholder: '作者名を入力',
      genre: 'ジャンル',
      genrePlaceholder: '小説ジャンルを選択',
      description: 'あらすじ',
      descriptionPlaceholder: '小説のあらすじを入力',
      cover: '表紙',
      coverPlaceholder: '表紙画像をアップロード',
      tags: 'タグ',
      tagsPlaceholder: 'タグを追加、Enterで確定',
      status: 'ステータス',
      wordCount: '文字数',
      chapterCount: '章数',
      createdAt: '作成日',
      updatedAt: '更新日'
    },
    
    status: {
      draft: '下書き',
      serializing: '連載中',
      completed: '完結',
      suspended: '休載中'
    },
    
    actions: {
      create: '小説を作成',
      edit: '編集',
      delete: '削除',
      duplicate: '複製',
      export: 'エクスポート',
      share: '共有',
      archive: 'アーカイブ',
      restore: '復元'
    },
    
    tips: {
      createSuccess: '小説が作成されました',
      updateSuccess: '小説が更新されました',
      deleteSuccess: '小説が削除されました',
      deleteConfirm: 'この小説を削除してもよろしいですか？すべての章が削除されます。この操作は取り消せません。',
      noNovels: 'まだ小説が作成されていません',
      createFirst: '上のボタンをクリックして最初の小説を作成'
    }
  },

  // ============================================
  // 六、章管理
  // ============================================
  chapter: {
    title: '章管理',
    createTitle: '新しい章を作成',
    editTitle: '章を編集',
    
    fields: {
      title: '章タイトル',
      titlePlaceholder: '章タイトルを入力',
      content: '内容',
      contentPlaceholder: '執筆を開始...',
      summary: '章の要約',
      summaryPlaceholder: '章の要約を入力（任意）',
      wordCount: '文字数',
      status: 'ステータス',
      order: '順序'
    },
    
    status: {
      draft: '下書き',
      published: '公開済み',
      revised: '改訂済み'
    },
    
    actions: {
      create: '新しい章',
      edit: '編集',
      delete: '削除',
      moveUp: '上に移動',
      moveDown: '下に移動',
      duplicate: '章を複製',
      merge: '章を結合',
      split: '章を分割'
    },
    
    tips: {
      createSuccess: '章が作成されました',
      updateSuccess: '章が更新されました',
      deleteSuccess: '章が削除されました',
      deleteConfirm: 'この章を削除してもよろしいですか？この操作は取り消せません。',
      noChapters: 'まだ章が作成されていません',
      createFirst: '上のボタンをクリックして最初の章を作成',
      autoSave: '内容が自動保存されました'
    }
  },

  // ============================================
  // 七、AI創作
  // ============================================
  aiCreation: {
    master: {
      title: 'マスター創作',
      subtitle: 'AIマスター級文学創作',
      description: 'AIの力を借りて、マスター級の文学作品を創作',
      selectStyle: 'スタイルを選択',
      stylePlaceholder: '執筆スタイルを選択',
      inputPrompt: '創作プロンプト',
      promptPlaceholder: '創作したい内容を説明...',
      generate: '作品を生成',
      regenerating: '再生成',
      generatedContent: '生成されたコンテンツ',
      insertToEditor: 'エディタに挿入',
      copyContent: 'コンテンツをコピー',
      tips: {
        noStyle: '先に執筆スタイルを選択してください',
        noPrompt: '創作プロンプトを入力してください',
        generating: 'コンテンツを生成中、お待ちください...',
        generateSuccess: 'コンテンツが生成されました',
        generateFailed: 'コンテンツの生成に失敗しました、再試行してください'
      }
    },
    
    imitation: {
      title: 'スタイル模写',
      subtitle: '原作スタイルに基づく模写',
      description: '古典作家の執筆スタイルを学び、模写する',
      selectAuthor: '作家を選択',
      authorPlaceholder: '模写する作家を選択',
      inputText: '参照テキスト',
      textPlaceholder: '参照テキストを貼り付け（任意）',
      inputPrompt: '模写プロンプト',
      promptPlaceholder: '模写したい内容を説明...',
      analyze: 'スタイルを分析',
      generate: '模写を開始',
      styleAnalysis: 'スタイル分析結果',
      generatedContent: '模写結果',
      tips: {
        noAuthor: '先に模写する作家を選択してください',
        noPrompt: '模写プロンプトを入力してください',
        analyzing: 'スタイルを分析中...',
        generating: '模写コンテンツを生成中...',
        analyzeSuccess: 'スタイル分析が完了しました',
        generateSuccess: '模写コンテンツが生成されました'
      }
    },
    
    workshop: {
      title: '長編工房',
      subtitle: '100万字長編プロジェクト管理',
      description: '長編小説創作のために設計された総合ワークベンチ',
      outline: 'アウトライン管理',
      characters: 'キャラクター管理',
      worldview: '世界観設定',
      timeline: 'タイムライン',
      plotThreads: 'プロットライン',
      tips: {
        noOutline: 'まだアウトラインが作成されていません',
        createOutline: 'アウトラインを作成すると、ストーリーをより良く計画できます'
      }
    },
    
    shortStory: {
      title: '短編執筆',
      subtitle: 'クイック短編創作',
      description: '短編小説、エッセイ、随筆などの短編作品を素早く創作',
      selectType: 'タイプを選択',
      typePlaceholder: '作品タイプを選択',
      types: {
        shortStory: '短編小説',
        essay: 'エッセイ',
        prose: '随筆',
        poetry: '詩',
        microFiction: 'マイクロフィクション',
        flashFiction: 'フラッシュフィクション'
      },
      inputPrompt: '創作プロンプト',
      promptPlaceholder: '創作したい内容を説明...',
      generate: '作品を生成',
      tips: {
        noType: '先に作品タイプを選択してください',
        noPrompt: '創作プロンプトを入力してください'
      }
    }
  },

  // ============================================
  // 八、執筆ツール
  // ============================================
  writingTools: {
    focus: {
      title: '集中モード',
      subtitle: '没入型執筆環境',
      description: 'フルスクリーンの没入型執筆環境で創作に集中',
      enterFocus: '集中モードに入る',
      exitFocus: '集中モードを終了',
      settings: {
        theme: 'テーマ',
        fontSize: 'フォントサイズ',
        lineHeight: '行の高さ',
        width: 'コンテンツ幅',
        backgroundColor: '背景色',
        textColor: '文字色'
      },
      themes: {
        light: 'ライト',
        dark: 'ダーク',
        sepia: 'セピア',
        forest: 'フォレスト',
        ocean: 'オーシャン'
      },
      stats: {
        words: '文字数',
        characters: '文字',
        paragraphs: '段落',
        readingTime: '読書時間',
        sessionTime: '執筆時間'
      },
      tips: {
        pressEsc: 'ESCキーで集中モードを終了',
        autoSave: '内容が自動保存されました'
      }
    },
    
    analysis: {
      title: '品質分析',
      subtitle: 'テキスト品質検出とスコアリング',
      description: 'テキスト品質を包括的に分析し、改善提案を提供',
      analyze: '分析を開始',
      analyzing: '分析中...',
      results: '分析結果',
      scores: {
        overall: '総合スコア',
        readability: '読みやすさ',
        vocabulary: '語彙の豊富さ',
        sentenceStructure: '文構造',
        emotionalExpression: '感情表現',
        narrativeFlow: '物語の流れ'
      },
      suggestions: '改善提案',
      issues: '問題検出',
      issueTypes: {
        repeatedWords: '繰り返し語',
        longSentences: '長文',
        passiveVoice: '受動態',
        cliches: 'クリシェ',
        weakWords: '弱い言葉'
      },
      tips: {
        noContent: '先に分析するテキストを入力してください',
        analyzeSuccess: '分析が完了しました'
      }
    },
    
    ideas: {
      title: 'アイデア工房',
      subtitle: 'アイデアボード、断片ライブラリ、執筆ウォームアップ',
      description: 'アイデアを収集し、断片を記録し、執筆ウォームアップを実践',
      ideaBoard: 'アイデアボード',
      fragments: '断片ライブラリ',
      warmup: '執筆ウォームアップ',
      prompts: 'クリエイティブプロンプト',
      randomPrompt: 'ランダムプロンプト',
      addIdea: 'アイデアを追加',
      addFragment: '断片を追加',
      categories: {
        plot: 'プロット',
        character: 'キャラクター',
        dialogue: '対話',
        description: '描写',
        setting: '設定',
        theme: 'テーマ'
      },
      tips: {
        noIdeas: 'まだアイデアが記録されていません',
        noFragments: 'まだ断片が保存されていません'
      }
    },
    
    cards: {
      title: 'インデックスカード',
      subtitle: 'カード式コンテンツ整理',
      description: 'カード方式でコンテンツを整理・計画',
      createCard: 'カードを作成',
      editCard: 'カードを編集',
      deleteCard: 'カードを削除',
      cardTypes: {
        scene: 'シーン',
        character: 'キャラクター',
        plot: 'プロット',
        note: 'ノート',
        research: 'リサーチ'
      },
      viewModes: {
        grid: 'グリッドビュー',
        list: 'リストビュー',
        board: 'ボードビュー'
      },
      tips: {
        noCards: 'まだカードが作成されていません',
        createFirst: '最初のカードを作成して計画を始める'
      }
    },
    
    multiView: {
      title: 'マルチビューエディタ',
      subtitle: 'マルチビュー同期編集',
      description: '複数の章やコンテンツを同時に表示・編集',
      viewCount: 'ビュー数',
      layouts: {
        '2h': '水平分割',
        '2v': '垂直分割',
        '4': '4分割ビュー'
      },
      sync: '同期スクロール',
      tips: {
        selectContent: '表示するコンテンツを選択'
      }
    }
  },

  // ============================================
  // 九、プロジェクト管理
  // ============================================
  projectManagement: {
    megaNovel: {
      title: '100万字管理',
      subtitle: '超長編小説専用管理ツール',
      description: '100万字以上の長編小説のために設計されたプロジェクト管理ツール',
      overview: 'プロジェクト概要',
      volumes: '巻管理',
      arcs: 'ストーリーアーク',
      milestones: 'マイルストーン',
      progress: '進捗追跡',
      stats: {
        totalWords: '総文字数',
        targetWords: '目標文字数',
        completionRate: '完了率',
        dailyAverage: '日平均文字数',
        estimatedDays: '予想完了日数'
      },
      tips: {
        noVolumes: 'まだ巻が作成されていません',
        createVolume: '巻を作成してコンテンツを整理'
      }
    },
    
    chapterGraph: {
      title: '章グラフ',
      subtitle: '章関係の可視化',
      description: '章間の関係と構造を可視化',
      viewModes: {
        tree: 'ツリービュー',
        flowchart: 'フローチャート',
        timeline: 'タイムライン',
        mindmap: 'マインドマップ'
      },
      nodeTypes: {
        chapter: '章',
        event: 'イベント',
        character: 'キャラクター',
        location: '場所'
      },
      actions: {
        addNode: 'ノードを追加',
        addEdge: '関係を追加',
        deleteNode: 'ノードを削除',
        editNode: 'ノードを編集'
      },
      tips: {
        noNodes: 'まだノードが作成されていません'
      }
    }
  },

  // ============================================
  // 十、物語エンジニアリング
  // ============================================
  narrativeEngineering: {
    foreshadowing: {
      title: '伏線管理',
      subtitle: 'プロット伏線の追跡と回収',
      description: '小説の伏線を追跡・管理し、プロットの一貫性を確保',
      createForeshadowing: '伏線を作成',
      editForeshadowing: '伏線を編集',
      resolveForeshadowing: '伏線を回収',
      fields: {
        name: '伏線名',
        description: '説明',
        plantedChapter: '設置章',
        resolvedChapter: '回収章',
        status: 'ステータス',
        importance: '重要度'
      },
      status: {
        planted: '設置済み',
        resolved: '回収済み',
        abandoned: '放棄済み'
      },
      importance: {
        high: '重要',
        medium: '普通',
        low: '軽微'
      },
      tips: {
        noForeshadowing: 'まだ伏線が作成されていません',
        unresolved: '{n}個の伏線が未回収です'
      }
    },
    
    narrative: {
      title: '物語構造',
      subtitle: '物語要素のモデリングとキャラクターの深み',
      description: '小説の物語構造を構築・分析',
      structures: {
        threeAct: '三幕構成',
        herosJourney: '英雄の旅',
        saveTheCat: 'キャットを救え',
        snowflake: 'スノーフレーク法',
        custom: 'カスタム構造'
      },
      elements: {
        incitingIncident: '発端',
        risingAction: '上昇アクション',
        climax: 'クライマックス',
        fallingAction: '下降アクション',
        resolution: '結末'
      },
      tips: {
        selectStructure: '物語構造テンプレートを選択'
      }
    },
    
    literary: {
      title: '文学工房',
      subtitle: '純文学創作ツール',
      description: '純文学創作のためのプロフェッショナルなツールとサポート',
      techniques: '文学技法',
      rhetoricalDevices: '修辞技法',
      literaryElements: '文学要素',
      styleAnalysis: 'スタイル分析',
      depthTools: {
        symbolism: '象徴主義',
        metaphor: 'メタファーシステム',
        imagery: 'イメージ管理',
        theme: 'テーマ深化'
      },
      tips: {
        selectTechnique: '分析・適用する文学技法を選択'
      }
    }
  },

  // ============================================
  // 十一、エクスポートとコラボレーション
  // ============================================
  exportCollaboration: {
    export: {
      title: 'エクスポートセンター',
      subtitle: 'マルチフォーマット専門エクスポート',
      description: '複数フォーマットに対応した専門エクスポート機能',
      formats: {
        txt: 'プレーンテキスト (TXT)',
        docx: 'Word文書 (DOCX)',
        pdf: 'PDF文書',
        epub: '電子書籍 (EPUB)',
        markdown: 'Markdown',
        html: 'Webページ (HTML)'
      },
      options: {
        includeCover: '表紙を含む',
        includeToc: '目次を含む',
        includeSummary: 'あらすじを含む',
        chapterBreak: '章区切り',
        pageNumbers: 'ページ番号'
      },
      actions: {
        export: 'エクスポート',
        exportAll: 'すべてエクスポート',
        exportSelected: '選択をエクスポート',
        preview: 'プレビュー'
      },
      tips: {
        selectFormat: 'エクスポートフォーマットを選択してください',
        exporting: 'エクスポート中...',
        exportSuccess: 'エクスポートが完了しました',
        exportFailed: 'エクスポートに失敗しました、再試行してください'
      }
    },
    
    collaboration: {
      title: 'コラボレーションハブ',
      subtitle: '共有、コメント、バージョン比較',
      description: '他の人とコラボレーションし、作品を共有し、フィードバックを収集',
      share: '共有',
      invite: 'コラボレーターを招待',
      comments: 'コメント',
      versions: 'バージョン履歴',
      compare: 'バージョン比較',
      permissions: {
        view: '閲覧のみ',
        comment: 'コメント可',
        edit: '編集可',
        admin: '管理者'
      },
      tips: {
        noCollaborators: 'まだコラボレーターがいません',
        inviteFirst: '他の人を招待してコラボレーション'
      }
    },
    
    review: {
      title: 'レビューモード',
      subtitle: '専門レビューと注釈',
      description: '注釈、改訂、提案をサポートする専門レビューツール',
      addComment: 'コメントを追加',
      addSuggestion: '提案を追加',
      acceptChange: '変更を承認',
      rejectChange: '変更を拒否',
      viewModes: {
        original: 'オリジナルバージョン',
        final: '最終バージョン',
        markup: 'マークアップモード'
      },
      filters: {
        all: 'すべて',
        comments: 'コメント',
        suggestions: '提案',
        changes: '変更'
      },
      tips: {
        noComments: 'コメントはありません',
        noChanges: '変更はありません'
      }
    }
  },

  // ============================================
  // 十二、拡張機能
  // ============================================
  extensions: {
    plugins: {
      title: 'プラグインマーケット',
      subtitle: '拡張機能プラグイン',
      description: '豊富なプラグインエコシステムで雲書の機能を拡張',
      installed: 'インストール済み',
      available: '利用可能なプラグイン',
      popular: '人気のプラグイン',
      recent: '最新のプラグイン',
      actions: {
        install: 'インストール',
        uninstall: 'アンインストール',
        enable: '有効化',
        disable: '無効化',
        settings: '設定',
        update: '更新'
      },
      categories: {
        writing: '執筆支援',
        analysis: '分析ツール',
        export: 'エクスポートフォーマット',
        integration: '統合ツール',
        themes: 'テーマ',
        productivity: '生産性'
      },
      tips: {
        noInstalled: 'まだプラグインがインストールされていません',
        browse: 'マーケットプレイスを閲覧して更多の機能を発見'
      }
    },
    
    gamification: {
      title: '実績センター',
      subtitle: '実績、レベル、執筆統計',
      description: 'ゲーム化された執筆体験で継続的な創作を促進',
      achievements: '実績',
      level: 'レベル',
      experience: '経験値',
      stats: '統計',
      badges: 'バッジ',
      streak: '連続執筆',
      leaderboard: 'ランキング',
      achievementsList: {
        firstNovel: '処女作 - 最初の小説を作成',
        tenChapters: '多作な作家 - 10章を完了',
        hundredThousand: '10万字マイルストーン',
        millionWords: '100万字マスター',
        streak7: '週間継続 - 7日連続執筆',
        streak30: '月間継続 - 30日連続執筆',
        streak100: '100日継続 - 100日連続執筆'
      },
      tips: {
        noAchievements: 'まだ実績が解除されていません',
        keepWriting: '執筆を続けてより多くの実績を解除'
      }
    }
  },

  // ============================================
  // 十三、システム設定
  // ============================================
  settings: {
    title: 'システム設定',
    subtitle: 'アプリケーション設定と概要',
    
    api: {
      title: 'API設定',
      provider: 'プロバイダー',
      providerPlaceholder: 'APIプロバイダーを選択',
      apiKey: 'APIキー',
      apiKeyPlaceholder: 'APIキーを入力',
      baseUrl: 'API URL',
      baseUrlPlaceholder: 'カスタムAPI URL（任意）',
      model: 'モデル選択',
      modelPlaceholder: '使用するモデルを選択',
      test: '接続テスト',
      testSuccess: 'API接続成功',
      testFailed: 'API接続失敗',
      providers: {
        openai: 'OpenAI',
        anthropic: 'Anthropic',
        deepseek: 'DeepSeek',
        google: 'Google AI',
        zhipu: 'Zhipu AI',
        moonshot: 'Moonshot',
        custom: 'カスタム'
      }
    },
    
    appearance: {
      title: '外観設定',
      theme: 'テーマ',
      themes: {
        default: 'デフォルトブルー',
        dark: 'ダークナイト',
        green: 'アイケアグリーン',
        purple: 'エレガントパープル',
        warm: 'ウォームオレンジ'
      },
      fontSize: 'フォントサイズ',
      language: '言語',
      languages: {
        'zh-CN': '簡体字中国語',
        'en-US': '英語',
        'ja-JP': '日本語'
      }
    },
    
    editor: {
      title: 'エディタ設定',
      autoSave: '自動保存',
      autoSaveInterval: '自動保存間隔',
      spellCheck: 'スペルチェック',
      wordWrap: '自動改行',
      showLineNumbers: '行番号を表示',
      highlightCurrentLine: '現在行をハイライト',
      indentSize: 'インデントサイズ',
      tabSize: 'Tab幅'
    },
    
    accessibility: {
      title: 'アクセシビリティ設定',
      highContrast: 'ハイコントラストモード',
      largeText: '大文字モード',
      reducedMotion: 'アニメーションを減らす',
      colorBlindFriendly: '色覚サポートモード',
      colorBlindTypes: {
        deuteranopia: '赤緑色覚',
        protanopia: '赤色覚',
        tritanopia: '青黄色覚'
      },
      screenReader: 'スクリーンリーダー最適化',
      keyboardNavigation: 'キーボードナビゲーション強化'
    },
    
    storage: {
      title: 'ストレージ設定',
      dataLocation: 'データ保存場所',
      autoBackup: '自動バックアップ',
      backupInterval: 'バックアップ間隔',
      maxBackups: '最大バックアップ数',
      clearCache: 'キャッシュをクリア',
      exportData: 'データをエクスポート',
      importData: 'データをインポート'
    },
    
    about: {
      title: '概要',
      version: 'バージョン',
      author: '作者',
      website: '公式サイト',
      documentation: 'ドキュメント',
      feedback: 'フィードバック',
      license: 'ライセンス',
      acknowledgements: '謝辞'
    }
  },

  // ============================================
  // 十四、エラーメッセージ
  // ============================================
  errors: {
    general: {
      unknown: '不明なエラーが発生しました、再試行してください',
      network: 'ネットワーク接続に失敗しました、ネットワーク設定を確認してください',
      timeout: 'リクエストがタイムアウトしました、再試行してください',
      server: 'サーバーエラー、後でもう一度お試しください',
      notFound: 'リクエストされたリソースが見つかりません',
      forbidden: 'この操作を実行する権限がありません',
      unauthorized: '認証されていません、先にログインしてください'
    },
    
    validation: {
      required: 'この項目は必須です',
      minLength: '最低{min}文字が必要です',
      maxLength: '最大{max}文字までです',
      email: '有効なメールアドレスを入力してください',
      url: '有効なURLを入力してください',
      number: '有効な数値を入力してください',
      integer: '整数を入力してください',
      positive: '正の数を入力してください',
      range: '値は{min}から{max}の間である必要があります'
    },
    
    file: {
      tooLarge: 'ファイルサイズが制限を超えています（最大{size}）',
      invalidType: 'サポートされていないファイルタイプです',
      uploadFailed: 'ファイルのアップロードに失敗しました',
      downloadFailed: 'ファイルのダウンロードに失敗しました',
      readFailed: 'ファイルの読み込みに失敗しました',
      writeFailed: 'ファイルの書き込みに失敗しました'
    },
    
    api: {
      invalidKey: '無効なAPIキーです',
      rateLimit: 'APIレート制限を超えました、後でもう一度お試しください',
      quotaExceeded: 'APIクォータを使い切りました',
      modelNotAvailable: '選択したモデルは利用できません',
      contextTooLong: 'コンテキスト長が制限を超えました',
      contentFiltered: 'コンテンツがセーフティフィルターでブロックされました'
    },
    
    data: {
      saveFailed: 'データの保存に失敗しました',
      loadFailed: 'データの読み込みに失敗しました',
      deleteFailed: 'データの削除に失敗しました',
      duplicate: 'データは既に存在します',
      notFound: 'データが見つかりません',
      corrupted: 'データが破損しています、バックアップからの復元を試みてください'
    }
  },

  // ============================================
  // 十五、ヘルプドキュメント
  // ============================================
  help: {
    shortcuts: {
      title: 'キーボードショートカット',
      global: {
        title: 'グローバルショートカット',
        commandPalette: 'Ctrl+K - コマンドパレットを開く',
        newNovel: 'Ctrl+N - 新しい小説',
        save: 'Ctrl+S - 保存',
        search: 'Ctrl+F - 検索',
        settings: 'Ctrl+, - 設定を開く'
      },
      editor: {
        title: 'エディタショートカット',
        bold: 'Ctrl+B - 太字',
        italic: 'Ctrl+I - 斜体',
        underline: 'Ctrl+U - 下線',
        undo: 'Ctrl+Z - 元に戻す',
        redo: 'Ctrl+Y - やり直し',
        cut: 'Ctrl+X - 切り取り',
        copy: 'Ctrl+C - コピー',
        paste: 'Ctrl+V - 貼り付け',
        selectAll: 'Ctrl+A - すべて選択'
      },
      navigation: {
        title: 'ナビゲーションショートカット',
        home: 'Alt+Home - ホームへ',
        back: 'Alt+Left - 戻る',
        forward: 'Alt+Right - 進む',
        skipToContent: 'Tab - メインコンテンツへスキップ'
      }
    },
    
    beginner: {
      title: '初心者ガイド',
      welcome: '雲書へようこそ！',
      step1: 'まず、APIキーを設定してAI機能を有効にします',
      step2: '最初の小説を作成します',
      step3: '章を追加して執筆を開始します',
      step4: 'AIアシスタントを使って創作をサポートします',
      step5: '作品をエクスポートします',
      nextStep: '次へ',
      skipGuide: 'ガイドをスキップ',
      completeGuide: 'ガイド完了'
    },
    
    features: {
      title: '機能説明',
      aiCreation: 'AI創作は、人工知能を活用して文学創作を支援し、様々なスタイルとジャンルをサポートします。',
      writingTools: '執筆ツールは、集中モード、品質分析などの機能を提供し、執筆効率を向上させます。',
      projectManagement: 'プロジェクト管理は、大規模な創作プロジェクトを整理・管理するのに役立ちます。',
      narrativeEngineering: '物語エンジニアリングツールは、複雑な物語構造とキャラクター関係を構築するのに役立ちます。',
      exportCollaboration: 'エクスポート・コラボレーション機能で、作品を共有し、他の人とコラボレーションできます。'
    }
  },

  // ============================================
  // 十六、アクセシビリティ
  // ============================================
  accessibility: {
    announcements: {
      pageLoaded: 'ページが読み込まれました',
      contentSaved: 'コンテンツが保存されました',
      contentDeleted: 'コンテンツが削除されました',
      itemCreated: 'アイテムが作成されました',
      itemUpdated: 'アイテムが更新されました',
      modalOpened: 'ダイアログが開かれました',
      modalClosed: 'ダイアログが閉じられました',
      menuExpanded: 'メニューが展開されました',
      menuCollapsed: 'メニューが折りたたまれました',
      tabSelected: 'タブが選択されました',
      loadingStarted: '読み込み中',
      loadingComplete: '読み込み完了',
      errorOccurred: 'エラーが発生しました'
    },
    
    labels: {
      mainNavigation: 'メインナビゲーション',
      mainContent: 'メインコンテンツ',
      sidebar: 'サイドバー',
      header: 'ページヘッダー',
      footer: 'ページフッター',
      search: '検索',
      userMenu: 'ユーザーメニュー',
      notifications: '通知',
      settings: '設定',
      close: '閉じる',
      expand: '展開',
      collapse: '折りたたむ',
      previous: '前へ',
      next: '次へ',
      first: '最初',
      last: '最後',
      currentPage: '現在のページ',
      totalPages: '総ページ数',
      selected: '選択済み',
      disabled: '無効',
      required: '必須',
      optional: '任意'
    },
    
    skipLinks: {
      mainContent: 'メインコンテンツへスキップ',
      navigation: 'ナビゲーションへスキップ',
      search: '検索へスキップ'
    }
  }
}

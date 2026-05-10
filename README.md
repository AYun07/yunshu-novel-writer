# ☁️ 云书 - AI智能小说创作平台

<p align="center">
  <img src="public/favicon.svg" alt="云书Logo" width="120">
</p>

<p align="center">
  <strong>世界级AI文学创作平台 · 从短篇到百万字长篇 · 从入门到诺贝尔级文学</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#平台支持">平台支持</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#技术架构">技术架构</a> •
  <a href="CHANGELOG.md">更新日志</a> •
  <a href="#开源协议">开源协议</a>
</p>

<p align="center">
  <a href="https://github.com/AYun07/yunshu-novel-writer/releases">
    <img src="https://img.shields.io/github/v/release/AYun07/yunshu-novel-writer?include_prereleases" alt="Version">
  </a>
  <a href="https://github.com/AYun07/yunshu-novel-writer/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/AYun07/yunshu-novel-writer" alt="License">
  </a>
  <a href="https://github.com/AYun07/yunshu-novel-writer/stargazers">
    <img src="https://img.shields.io/github/stars/AYun07/yunshu-novel-writer" alt="Stars">
  </a>
</p>

---

## ✨ 功能特性

### 🏆 大师级文学创作
- **30+文学大师风格库** - 莫言/余华/鲁迅/马尔克斯/海明威/村上春树/卡夫卡等
- **深度叙事技法** - 意识流/多重视角/魔幻现实主义/极简主义/元小说
- **5轮精修系统** - 结构优化→语言精炼→风格强化→细节打磨→终审评审
- **文学质量评估** - 语言独创性/情感深度/叙事技巧/人物塑造/主题深度五维评分

### 📚 百万字长篇小说引擎
- **智能上下文管理** - 自动摘要链、角色状态追踪、世界观一致性检查
- **批量章节生成** - 整卷大纲生成、断点续传、不合格自动重写
- **质量控制** - 每章生成后自动检查、人工审核队列
- **进度追踪** - 热力图、每日统计、预计完成时间

### 🎨 高级可视化
- **索引卡片视图** - 拖拽排序、分组管理、导出大纲
- **四视图编辑器** - 4种布局、多标签、同步滚动
- **故事线甘特图** - 时间轴、里程碑、交叉点标记
- **章节关系图谱** - VueFlow可视化、5种关系类型

### 📱 跨平台完美适配
- **网页端** - PWA离线可用、后台同步、推送通知
- **桌面端** - Electron原生体验、系统托盘、全局快捷键、自动更新
- **移动端** - 触摸手势、底部导航、虚拟键盘适配、安全区域适配

### 🔧 专业写作工具
- **伏笔管理系统** - AI提取、追踪、回收提醒、时间线
- **叙事结构建模** - 前提/故事线/主题/冲突/象征/角色深度
- **文本质量分析** - 9种检测器、可读性评分、一键修复
- **专注写作模式** - 打字机滚动、番茄钟、环境音效、6种主题
- **游戏化激励** - 35个成就、20级等级、签到、热力图

### 📤 多格式导出
- **Markdown** - 标准格式，适合技术写作
- **DOCX** - Word文档，适合出版投稿
- **EPUB** - 电子书格式，适合分发阅读
- **PDF** - 印刷品质，适合打印存档

---

## 🖥️ 平台支持

| 平台 | 支持方式 | 特性 |
|------|----------|------|
| **网页端** | PWA | 离线可用、安装为App、后台同步、推送通知 |
| **桌面端** | Electron | Windows/macOS/Linux、系统托盘、全局快捷键、自动更新 |
| **移动端** | PWA | 触摸手势、底部导航、虚拟键盘适配、安全区域适配 |

### 安装方式

#### 网页端
直接访问部署地址，或安装为PWA：
- Chrome: 地址栏点击"安装"图标
- Safari: 分享 → 添加到主屏幕
- Firefox: 地址栏点击"安装"图标

#### 桌面端
```bash
# 开发模式
pnpm electron:dev

# 构建安装包
pnpm electron:build        # 全平台
pnpm electron:build:win    # Windows
pnpm electron:build:mac    # macOS
pnpm electron:build:linux  # Linux
```

#### 移动端
访问部署地址，添加到主屏幕即可获得原生App体验。

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/AYun07/yunshu-novel-writer.git

# 进入项目目录
cd yunshu-novel-writer

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 启动桌面端开发模式
pnpm electron:dev
```

### 配置API

1. 启动项目后，点击右上角「配置API」
2. 选择API预设（OpenAI/DeepSeek/Claude/Gemini）或输入自定义地址
3. 输入API密钥
4. 选择默认模型
5. 开始创作！

### 支持的AI模型

| 提供商 | 模型 | 说明 |
|--------|------|------|
| OpenAI | GPT-4o / GPT-4o Mini / GPT-4 Turbo / GPT-3.5 Turbo | 最新多模态 |
| DeepSeek | DeepSeek V3 / DeepSeek R1 | 深度求索，性价比高 |
| Anthropic | Claude 3.5 Sonnet / Claude 3 Opus | 顶级性能 |
| Google | Gemini 2.5 Pro | Google最新 |
| 智谱 | GLM-4 Plus | 国产大模型 |
| 其他 | 任意 OpenAI 兼容 API | 灵活扩展 |

---

## 🏗️ 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.5+ | 前端框架（Composition API） |
| Vite | 5+ | 构建工具（代码分割/按需加载） |
| Element Plus | 2.4+ | UI组件库 |
| Pinia | 2.1+ | 状态管理 |
| Vue Router | 4.2+ | 路由管理 |
| Dexie | 3.2+ | IndexedDB封装 |
| Electron | 30+ | 桌面端框架 |

### 项目结构

```
yunshu-novel-writer/
├── electron/                  # Electron桌面端
│   ├── main.js               # 主进程
│   ├── preload.js            # 预加载脚本
│   ├── tray.js               # 系统托盘
│   ├── menu.js               # 原生菜单
│   ├── store.js              # 持久化存储
│   └── ipcHandlers.js        # IPC处理器
├── public/
│   ├── sw.js                 # Service Worker
│   ├── manifest.json         # PWA配置
│   └── offline.html          # 离线页面
├── src/
│   ├── components/           # 公共组件
│   ├── composables/          # 组合式函数
│   │   ├── usePlatform.js    # 平台检测
│   │   ├── useResponsive.js  # 响应式布局
│   │   ├── useTouch.js       # 触摸手势
│   │   ├── usePWA.js         # PWA功能
│   │   └── useElectron.js    # Electron功能
│   ├── config/               # 配置文件
│   │   ├── masterStyles.js   # 大师风格库
│   │   ├── literaryTechniques.js # 文学技法
│   │   ├── foreshadowingSystem.js # 伏笔系统
│   │   ├── narrativeStructure.js # 叙事结构
│   │   ├── textAnalysis.js   # 文本分析
│   │   ├── focusMode.js      # 专注模式
│   │   ├── gamification.js   # 游戏化
│   │   └── writingTools.js   # 写作工具
│   ├── layouts/              # 布局组件
│   │   ├── MobileLayout.vue  # 移动端布局
│   │   ├── DesktopLayout.vue # 桌面端布局
│   │   └── ResponsiveLayout.vue # 响应式布局
│   ├── locales/              # 国际化
│   │   ├── zh-CN.js          # 中文
│   │   ├── en-US.js          # 英文
│   │   └── ja-JP.js          # 日文
│   ├── services/             # 服务层
│   │   ├── api.js            # API服务
│   │   ├── database.js       # 数据库服务
│   │   ├── exportService.js  # 导出服务
│   │   ├── syncService.js    # 同步服务
│   │   ├── vectorMemory.js   # 向量记忆
│   │   ├── aiAgent.js        # AI Agent
│   │   ├── aiOrchestrator.js # AI编排
│   │   ├── smartTracking.js  # 智能追踪
│   │   └── multiModelProvider.js # 多模型支持
│   ├── stores/               # Pinia状态管理
│   │   ├── novel.js          # 小说状态
│   │   ├── apiConfig.js      # API配置
│   │   ├── aiChat.js         # AI对话
│   │   └── device.js         # 设备状态
│   ├── utils/                # 工具函数
│   │   ├── constants.js      # 常量定义
│   │   ├── id.js             # ID生成
│   │   ├── tokens.js         # Token估算
│   │   ├── date.js           # 日期格式化
│   │   ├── accessibility.js  # 无障碍
│   │   ├── i18n.js           # 国际化
│   │   ├── lazyLoad.js       # 懒加载
│   │   ├── virtualScroll.js  # 虚拟滚动
│   │   └── performance.js    # 性能监控
│   ├── views/                # 页面视图
│   │   ├── mobile/           # 移动端专用视图
│   │   ├── Dashboard.vue     # 主框架
│   │   ├── HomePage.vue      # 首页
│   │   ├── MasterCreation.vue # 大师创作
│   │   ├── LiteraryWorkshop.vue # 文学工坊
│   │   ├── MegaNovelManager.vue # 百万字管理
│   │   ├── IndexCards.vue    # 索引卡片
│   │   ├── MultiViewEditor.vue # 四视图编辑器
│   │   ├── ChapterGraph.vue  # 章节图谱
│   │   ├── Foreshadowing.vue # 伏笔管理
│   │   ├── NarrativeStructure.vue # 叙事结构
│   │   ├── TextAnalysis.vue  # 质量分析
│   │   ├── FocusMode.vue     # 专注模式
│   │   ├── Gamification.vue  # 成就中心
│   │   ├── IdeaBoard.vue     # 灵感工坊
│   │   ├── ExportCenter.vue  # 导出中心
│   │   ├── PluginManager.vue # 插件管理
│   │   ├── CollaborationHub.vue # 协作中心
│   │   ├── ReviewMode.vue    # 审阅模式
│   │   └── ...               # 更多页面
│   ├── App.vue
│   ├── main.js
│   └── style.css             # 全局样式
├── CHANGELOG.md              # 更新日志
├── README.md                 # 项目说明
├── LICENSE                   # 开源协议
├── vite.config.js            # Vite配置
└── package.json
```

---

## 📋 功能清单

### AI创作
- [x] 大师创作（30+风格、10+技法、5轮润色）
- [x] 风格仿写（24项参数、4种模式、原创度自检）
- [x] 长篇工坊（百万字管理、批量生成、智能上下文）
- [x] 短文写作（快速创作、多类型模板）
- [x] 文学工坊（诺贝尔级创作、质量评估）

### 写作工具
- [x] 专注模式（打字机滚动、番茄钟、环境音效）
- [x] 质量分析（9种检测器、可读性评分、一键修复）
- [x] 灵感工坊（想法板、片段库、写作热身）
- [x] 索引卡片（拖拽排序、分组、导出）
- [x] 四视图编辑器（多窗口、同步滚动）

### 项目管理
- [x] 小说列表（创建、编辑、删除、导出）
- [x] 章节管理（大纲、内容、状态）
- [x] 百万字管理（卷/章结构、批量生成）
- [x] 章节图谱（关系图、时间线、故事线）
- [x] 写作编辑器（富文本、Markdown）

### 叙事工程
- [x] 伏笔管理（AI提取、追踪、回收提醒）
- [x] 叙事结构（前提、故事线、主题、冲突、象征）
- [x] 角色深度（33个心理问题、关系图、弧线）

### 导出协作
- [x] 导出中心（MD/DOCX/EPUB/PDF、模板、批量）
- [x] 协作中心（团队管理、项目共享、版本历史）
- [x] 审阅模式（批注、评分、沟通工具）

### 扩展功能
- [x] 插件系统（安装、配置、市场）
- [x] 成就中心（35成就、20等级、签到、热力图）
- [x] 提示词库（分类管理、导入导出）
- [x] 工具库（写作辅助工具集）

### 系统功能
- [x] 写作目标（进度跟踪、习惯培养）
- [x] Token统计（成本追踪、用量分析）
- [x] 系统设置（主题、语言、备份）
- [x] 数据导入导出（JSON备份恢复）

---

## 📚 文档

- [更新日志](CHANGELOG.md) - 所有版本的详细更新记录
- [Docker部署](docker-deploy.md) - Docker部署指南

---

## ⚖️ 版权合规

云书严格遵循著作权相关法律法规：

1. **风格仿写功能**仅提取文本的抽象写作风格特征（句式、修辞、叙事手法等），不复制任何具体内容
2. **所有生成内容**均为AI全新创作，人物、情节、场景均为原创
3. **用户责任**：用户需确保上传的文本为合法拥有的正版书籍
4. **严禁用途**：严禁将本软件用于抄袭、侵权、盗版等任何违法用途

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

---

<p align="center">
  Made with ❤️ by 云书团队
</p>

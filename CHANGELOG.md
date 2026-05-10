# 云书 更新日志

所有版本的更新记录，按时间倒序排列。

---

## [v2.3.0] - 2025-05-10

### 📱 跨平台完美适配

**新增功能**

#### 跨平台核心架构
- `usePlatform.js` - 平台检测组合式函数（web/desktop/mobile/tablet/electron/pwa）
- `useResponsive.js` - 响应式断点系统（xs/sm/md/lg/xl/xxl）
- `useTouch.js` - 触摸手势支持（滑动/捏合/长按/双击/拖拽）
- `useVirtualKeyboard.js` - 虚拟键盘适配

#### 响应式布局系统
- `MobileLayout.vue` - 移动端布局（顶部标题栏+底部导航+安全区域适配）
- `DesktopLayout.vue` - 桌面端布局（侧边栏+多标签+可调整宽度）
- `ResponsiveLayout.vue` - 自动切换布局
- `MobileNav.vue` - 底部导航栏（5入口+中间创作按钮）
- `MobileHeader.vue` - 顶部标题栏

#### PWA增强
- `sw.js` - 离线优先策略（Stale-While-Revalidate）
- 后台同步（Background Sync）
- 推送通知支持（Push API）
- 周期性后台同步
- `usePWA.js` - PWA功能组合式函数
- `PWAInstallPrompt.vue` - 安装提示组件

#### Electron桌面端完善
- `main.js` - 多窗口管理+全局快捷键+自动更新+崩溃报告
- `menu.js` - 完整原生菜单（文件/编辑/视图/窗口/帮助）
- `tray.js` - 托盘状态管理+通知+右键菜单
- `ipcHandlers.js` - 完善IPC通信
- `useElectron.js` - Electron功能组合式函数

#### 移动端专用视图
- `MobileHome.vue` - 移动端首页
- `MobileProjects.vue` - 移动端项目管理
- `MobileWriter.vue` - 移动端写作编辑器
- `MobileProfile.vue` - 移动端个人中心
- `MobileQuickWrite.vue` - 快速写作

#### 跨平台数据同步
- `syncService.js` - 本地优先+云端备份+冲突解决+增量同步
- `useSync.js` - 同步功能组合式函数
- `SyncStatus.vue` - 同步状态组件
- `database.js` - 添加syncStatus/lastModified/syncVersion字段

**文件统计**: 35个文件变更，新增 21,976 行代码

---

## [v2.2.1] - 2025-05-10

### 🔧 代码质量重构

**修复问题**

#### P0 必须修复（4个）
- 创建统一工具模块（`utils/constants.js`、`id.js`、`tokens.js`、`date.js`）
- 修复API配置竞争：`api.js`移除构造函数初始化，统一由store负责
- 修复localStorage key冲突：统一`yunshu_`前缀，修复`api-config`/`token-usage`不一致
- 修复`Settings.vue`导出导入使用正确的key

#### P1 应该修复（7个）
- 拆分God Store：`novel.js`（774行）拆为3个独立store（`apiConfig`/`aiChat`/`novel`）
- 消除重复函数：`generateId`（6处）/`estimateTokens`（5处）/`formatDate`（6处）统一到utils
- 修复路由：删除3个内联占位组件，改为懒加载实际.vue文件
- 修复重复路由：`/collaboration-hub`改为`/collab-team`
- 添加404兜底路由
- 集成`multiModelProvider.js`到`api.js`
- 标记6个待集成服务文件
- 修复`megaNovelEngine.js`：移除Vue响应式依赖

**文件统计**: 19个文件变更，新增 782 行，删除 401 行

---

## [v2.2.0] - 2025-05-10

### 🚀 世界级文学创作平台

**新增功能**

#### 高级可视化
- `IndexCards.vue` - 索引卡片视图（拖拽排序/分组/批量操作/导出大纲）
- `MultiViewEditor.vue` - 四视图编辑器（4种布局/多标签/同步滚动）
- `StorylineGantt.vue` - 故事线甘特图（时间轴/里程碑/交叉点）

#### 长篇小说引擎
- `megaNovelEngine.js` - 百万字引擎（智能上下文/批量生成/断点续传/质量控制）
- `MegaNovelManager.vue` - 管理页面（仪表盘/卷管理/章节管理/批量生成面板）

#### 文学创作引擎
- `nobelLiteraryEngine.js` - 诺贝尔级引擎（30+大师风格/深度叙事/5轮润色/质量评估）
- `LiteraryWorkshop.vue` - 文学工坊（风格选择/技法组合/创作模式/润色面板）

#### 协作与分享
- `multiUserService.js` - 多用户架构（权限管理/实时协作/版本控制）
- `CollaborationHub.vue` - 协作中心（团队管理/项目共享/版本历史）
- `ReviewMode.vue` - 审阅模式（批注/评分/沟通工具）

#### 无障碍与国际化
- `accessibility.js` - 无障碍工具（屏幕阅读器/键盘导航/视觉辅助）
- `i18n.js` - 国际化工具
- `zh-CN.js` - 中文语言包
- `en-US.js` - 英文语言包
- `ja-JP.js` - 日文语言包

**文件统计**: 19个文件变更，新增 23,893 行代码

---

## [v2.1.0] - 2025-05-10

### 🚀 AI增强+性能优化+PWA+Electron

**新增功能**

#### AI能力增强
- `vectorMemory.js` - 浏览器端向量记忆（transformers.js嵌入+IndexedDB存储+语义检索）
- `aiAgent.js` - Agent架构（ScriptAgent/ProductionAgent/AnalysisAgent/MemoryAgent+编排器）
- `smartTracking.js` - 智能追踪（角色状态/情节节点/上下文追踪+AI提示词构建）
- `aiOrchestrator.js` - AI调用编排（缓存/限流/成本追踪/历史回滚/模型路由）

#### 性能优化
- `vite.config.js` - 细粒度代码分割+Terser压缩+CSS分割+Tree-shaking
- `lazyLoad.js` - 路由懒加载+加载状态+错误边界+预加载策略
- `virtualScroll.js` - 虚拟滚动（动态高度+位置保持+无限加载）
- `performance.js` - 性能监控（FCP/LCP/FID/CLS+路由+API+内存+长任务）

#### PWA支持
- `sw.js` - Service Worker（预缓存+运行时缓存+离线回退+后台同步）
- `manifest.json` - PWA清单（多尺寸图标+主题色+快捷方式+分享目标）
- `offline.html` - 离线回退页面

#### Electron桌面端
- `electron/main.js` - 主进程（窗口管理+托盘+快捷键+菜单+IPC+自动更新）
- `electron/preload.js` - 预加载脚本（contextBridge安全API）
- `electron/tray.js` - 系统托盘（图标+菜单+通知+状态）
- `electron/menu.js` - 原生菜单（文件/编辑/视图/项目/工具/帮助）
- `electron/store.js` - 持久化存储
- `electron/ipcHandlers.js` - IPC处理器
- `desktopAPI.js` - 渲染进程API封装

**文件统计**: 21个文件变更，新增 15,771 行代码

---

## [v2.0.0] - 2025-05-10

### 🚀 全面升级 - 整合十大开源项目优势

**新增核心服务层（7个）**
- `database.js` - IndexedDB数据层+自动保存+版本快照+项目导入导出+全局搜索
- `exportService.js` - Markdown/DOCX/EPUB/PDF专业格式导出+模板系统
- `pluginSystem.js` - 插件架构（生命周期/沙箱/权限/API/内置示例）
- `taskQueue.js` - 后台任务队列（持久化/断线续传/并发控制/AI指标监控）
- `multiModelProvider.js` - 多模型统一层（OpenAI/DeepSeek/Claude/Gemini/ChatGLM+API预设）
- `mcpServer.js` - MCP Server协议（JSON-RPC/HTTP/工具注册/资源注册）
- `collaborationService.js` - 协作系统（分享链接/评论/Diff对比/修订历史）

**新增配置层（6个）**
- `foreshadowingSystem.js` - 伏笔管理（AI提取/追踪/回收提醒/时间线）
- `narrativeStructure.js` - 叙事结构建模（6大元素/33个心理问题/10种关系/8种弧线/6种模板）
- `textAnalysis.js` - 文本质量分析（9种检测器/可读性评分/频率分析/中文适配）
- `focusMode.js` - 专注模式（打字机滚动/段落聚焦/番茄钟/环境音效/6种主题）
- `gamification.js` - 游戏化（35个成就/20级等级/签到/热力图/100+激励语）
- `writingTools.js` - 写作工具集（渐进式创作/205个热身提示/片段库/想法板/命令面板/高级搜索）

**新增视图层（10个）**
- `Foreshadowing.vue` - 伏笔管理
- `NarrativeStructure.vue` - 叙事结构
- `TextAnalysis.vue` - 质量分析
- `FocusMode.vue` - 专注模式
- `Gamification.vue` - 成就中心
- `IdeaBoard.vue` - 灵感工坊
- `ChapterGraph.vue` - 章节图谱
- `ExportCenter.vue` - 导出中心
- `PluginManager.vue` - 插件管理
- `Collaboration.vue` - 协作中心

**UI升级**
- Dashboard侧边栏分组菜单（8个分组，25个功能入口）
- Ctrl+K命令面板
- 新增Gemini/GLM-4模型选项

**文件统计**: 28个文件变更，新增 25,195 行代码

---

## [v1.5.0] - 长篇小说创作工坊

- ✨ 长篇小说项目管理系统（卷/章两级结构）
- ✨ 原著结构分析引擎（叙事结构/力量体系/角色原型/情节模式）
- ✨ 角色工坊（AI创建/手动添加/状态追踪）
- ✨ 世界观构建器（AI自动生成/区域/势力/力量体系）
- ✨ 卷大纲AI生成 + 章节批量生成引擎
- ✨ 项目保存/导出/导入

---

## [v1.4.0] - 风格仿写重大升级

- ✨ 多文本风格融合
- ✨ 风格参数微调面板（24项参数）
- ✨ 风格档案管理（保存/加载/导出/导入）
- ✨ 四种仿写模式（全新创作/续写章节/内容改写/跨体裁仿写）
- ✨ 原创度自检（5维度AI评分）

---

## [v1.3.0] - 风格仿写

- ✨ 风格分析引擎（6大维度24项特征提取）
- ✨ 原创仿写生成（基于风格特征创作100%原创内容）

---

## [v1.2.0] - 大师创作UI

- 🎨 四步引导式大师创作流程
- 🎨 可视化风格/技法/类型选择

---

## [v1.1.0] - 文学引擎

- 🏆 15种文学大师风格库
- 🔧 10种文学技法引擎
- ✨ 三步精修系统
- 📚 11种创作类型模板

---

## [v1.0.0] - 初始版本

- ☁️ 云书品牌建立
- 🤖 AI创作核心功能
- 🎨 5种主题切换
- 🔧 自定义API配置

---

## 版本命名规范

- **主版本号（Major）**: 重大架构变更或不兼容更新
- **次版本号（Minor）**: 新功能添加
- **修订号（Patch）**: Bug修复和小改进

## 图标说明

- ✨ 新功能
- 🔧 优化/重构
- 🐛 Bug修复
- 🎨 UI/样式更新
- 📱 移动端相关
- 📚 文档更新
- 🔒 安全更新
- ⚠️ 破坏性变更

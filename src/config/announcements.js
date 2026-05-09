// 公告配置文件
export const announcements = [
  {
    id: 'v1.0.0',
    version: '1.0.0',
    title: '🎉 云书 v1.0.0 正式发布',
    date: '2025-05-09',
    priority: 1,
    content: `
# 🎉 欢迎使用云书 - AI智能小说创作平台

## 💡 快速开始

1. 点击右上角「配置API」按钮
2. 输入您的 API 地址和密钥
3. 选择默认模型
4. 开始创作！

## 🔧 支持的API

- **OpenAI** - GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
- **DeepSeek** - DeepSeek V3, DeepSeek R1
- **Claude** - Claude 3.5 Sonnet, Claude 3 Opus
- **其他** - 支持 OpenAI 兼容格式的任意 API

## ✨ v1.0.0 功能特性

### 🎨 多主题切换
- 默认蓝 - 经典专业风格
- 暗夜黑 - 护眼深色主题
- 护眼绿 - 长时间写作友好
- 优雅紫 - 个性创意风格
- 暖阳橙 - 温暖舒适风格

### 🤖 AI智能创作
- 智能大纲生成
- 章节内容创作
- 角色设定管理
- 世界观构建

### ✍️ 创作工具
- 提示词库管理
- 语料库管理
- 写作目标追踪
- Token计费统计

---

**感谢您使用云书！祝您创作愉快！** ✍️
    `
  }
]

// 获取最新公告
export function getLatestAnnouncement() {
  return announcements
    .sort((a, b) => b.priority - a.priority)
    .find(announcement => announcement.priority > 0) || announcements[0]
}

// 获取指定版本的公告
export function getAnnouncementByVersion(version) {
  return announcements.find(announcement => announcement.version === version)
}

// 检查是否有新版本公告
export function hasNewAnnouncement() {
  const lastReadVersion = localStorage.getItem('yunshu_lastReadAnnouncementVersion')
  const latestAnnouncement = getLatestAnnouncement()
  
  if (!lastReadVersion) {
    return true
  }
  
  return lastReadVersion !== latestAnnouncement.version
}

// 标记公告为已读
export function markAnnouncementAsRead(version) {
  localStorage.setItem('yunshu_lastReadAnnouncementVersion', version)
  localStorage.setItem('yunshu_lastReadAnnouncementDate', new Date().toISOString())
}

// 获取用户统计信息
export function getAnnouncementStats() {
  return {
    lastReadVersion: localStorage.getItem('yunshu_lastReadAnnouncementVersion'),
    lastReadDate: localStorage.getItem('yunshu_lastReadAnnouncementDate')
  }
}

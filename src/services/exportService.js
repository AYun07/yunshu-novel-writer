/**
 * 云书 - 专业格式导出服务模块
 * 支持 Markdown、DOCX、EPUB、PDF 四种导出格式
 * 包含导出模板系统（出版/网文/简约）、批量导出、导出历史记录
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx'
// jsPDF 已移除，改用浏览器打印 API 支持中文 PDF 导出
// import jsPDF from 'jspdf'

// epub-gen-memory 使用动态导入以避免 ESM 兼容性问题
let EPub = null
async function getEPub() {
  if (!EPub) {
    try {
      const module = await import('epub-gen-memory')
      EPub = module.default || module.EPub || module
    } catch (e) {
      console.error('加载 epub-gen-memory 失败:', e)
      throw new Error('EPUB 导出模块加载失败')
    }
  }
  return EPub
}

// ==================== 导出模板系统 ====================

/**
 * 预设导出模板
 * 每个模板定义了不同的排版风格和格式参数
 */
const EXPORT_TEMPLATES = {
  // 出版风格：适合传统出版，排版规范
  publishing: {
    id: 'publishing',
    name: '出版风格',
    description: '适合传统出版，排版规范，章节分明',
    // DOCX 样式参数
    docx: {
      titleSize: 36,        // 标题字号（半磅）
      headingSize: 28,      // 章节标题字号
      bodySize: 24,         // 正文字号
      lineHeight: 1.5,      // 行高
      paragraphSpacing: 200,// 段后间距
      fontFamily: '宋体',   // 字体
      firstLineIndent: true // 首行缩进
    },
    // PDF 样式参数
    pdf: {
      titleSize: 24,
      headingSize: 18,
      bodySize: 12,
      lineHeight: 1.8,
      fontFamily: 'simhei',
      firstLineIndent: true,
      pageMargin: { top: 72, bottom: 72, left: 72, right: 72 }
    },
    // Markdown 格式参数
    markdown: {
      titlePrefix: '# ',
      chapterPrefix: '## ',
      sectionPrefix: '### ',
      separator: '\n\n---\n\n'
    }
  },

  // 网文风格：适合网络连载，简洁明快
  webnovel: {
    id: 'webnovel',
    name: '网文风格',
    description: '适合网络连载，简洁明快，段落短小',
    docx: {
      titleSize: 32,
      headingSize: 26,
      bodySize: 22,
      lineHeight: 1.75,
      paragraphSpacing: 120,
      fontFamily: '微软雅黑',
      firstLineIndent: true
    },
    pdf: {
      titleSize: 22,
      headingSize: 16,
      bodySize: 11,
      lineHeight: 2.0,
      fontFamily: 'simhei',
      firstLineIndent: true,
      pageMargin: { top: 60, bottom: 60, left: 60, right: 60 }
    },
    markdown: {
      titlePrefix: '# ',
      chapterPrefix: '## ',
      sectionPrefix: '### ',
      separator: '\n\n***\n\n'
    }
  },

  // 简约风格：适合个人阅读，干净整洁
  minimal: {
    id: 'minimal',
    name: '简约风格',
    description: '适合个人阅读，干净整洁，无多余装饰',
    docx: {
      titleSize: 30,
      headingSize: 24,
      bodySize: 22,
      lineHeight: 1.6,
      paragraphSpacing: 160,
      fontFamily: '黑体',
      firstLineIndent: false
    },
    pdf: {
      titleSize: 20,
      headingSize: 15,
      bodySize: 11,
      lineHeight: 1.8,
      fontFamily: 'simhei',
      firstLineIndent: false,
      pageMargin: { top: 60, bottom: 60, left: 50, right: 50 }
    },
    markdown: {
      titlePrefix: '# ',
      chapterPrefix: '## ',
      sectionPrefix: '### ',
      separator: '\n\n'
    }
  }
}

/**
 * 获取导出模板
 * @param {string} templateId - 模板ID
 * @returns {object} 模板配置
 */
function getTemplate(templateId) {
  return EXPORT_TEMPLATES[templateId] || EXPORT_TEMPLATES.publishing
}

/**
 * 获取所有可用模板
 * @returns {object[]}
 */
function getAllTemplates() {
  return Object.values(EXPORT_TEMPLATES)
}

// ==================== Markdown 导出 ====================

/**
 * 导出为 Markdown 格式
 * @param {object} projectData - 项目数据（含 chapters 数组）
 * @param {string} [templateId='publishing'] - 模板ID
 * @returns {string} Markdown 文本
 */
function exportToMarkdown(projectData, templateId = 'publishing') {
  const template = getTemplate(templateId)
  const { project, chapters } = projectData
  const lines = []

  // 添加标题
  lines.push(`${template.markdown.titlePrefix}${project.name || '未命名作品'}`)
  lines.push('')

  // 添加作者信息（如果有）
  if (project.author) {
    lines.push(`作者：${project.author}`)
    lines.push('')
  }

  // 添加简介（如果有）
  if (project.description) {
    lines.push('> ' + project.description.split('\n').join('\n> '))
    lines.push('')
    lines.push(template.markdown.separator)
  }

  // 添加章节
  for (const chapter of chapters) {
    lines.push('')
    lines.push(`${template.markdown.chapterPrefix}${chapter.title || '未命名章节'}`)
    lines.push('')

    // 添加章节摘要（如果有）
    if (chapter.summary) {
      lines.push(`*${chapter.summary}*`)
      lines.push('')
    }

    // 添加章节内容
    if (chapter.content) {
      // 将内容按段落分割
      const paragraphs = chapter.content.split(/\n+/).filter(p => p.trim())
      for (const para of paragraphs) {
        lines.push(para.trim())
        lines.push('')
      }
    }

    // 章节分隔符
    if (chapters.indexOf(chapter) < chapters.length - 1) {
      lines.push(template.markdown.separator)
    }
  }

  return lines.join('\n')
}

/**
 * 导出 Markdown 为文件并触发下载
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 */
function downloadMarkdown(projectData, templateId = 'publishing') {
  const markdown = exportToMarkdown(projectData, templateId)
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  triggerDownload(blob, `${projectData.project.name || '云书作品'}.md`)
}

// ==================== DOCX 导出 ====================

/**
 * 导出为 DOCX 格式
 * 使用 docx 库生成 Word 文档，支持标题/正文/样式
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 * @returns {Promise<Blob>} DOCX 文件 Blob
 */
async function exportToDocx(projectData, templateId = 'publishing') {
  const template = getTemplate(templateId)
  const { project, chapters } = projectData
  const style = template.docx

  // 构建段落数组
  const paragraphs = []

  // 书名标题
  paragraphs.push(new Paragraph({
    children: [
      new TextRun({
        text: project.name || '未命名作品',
        bold: true,
        size: style.titleSize,
        font: style.fontFamily
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  }))

  // 作者
  if (project.author) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: project.author,
          size: style.bodySize,
          font: style.fontFamily,
          color: '666666'
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    }))
  }

  // 简介
  if (project.description) {
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: project.description,
          italics: true,
          size: style.bodySize,
          font: style.fontFamily
        })
      ],
      spacing: { after: 400 }
    }))
  }

  // 章节内容
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i]

    // 每个新章节前插入分页符（除了第一章）
    if (i > 0) {
      paragraphs.push(new Paragraph({
        children: [new PageBreak()]
      }))
    }

    // 章节标题
    paragraphs.push(new Paragraph({
      children: [
        new TextRun({
          text: chapter.title || `第${i + 1}章`,
          bold: true,
          size: style.headingSize,
          font: style.fontFamily
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 300 }
    }))

    // 章节摘要
    if (chapter.summary) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({
            text: chapter.summary,
            italics: true,
            size: style.bodySize - 2,
            font: style.fontFamily,
            color: '888888'
          })
        ],
        spacing: { after: 200 }
      }))
    }

    // 章节正文
    if (chapter.content) {
      const contentParagraphs = chapter.content.split(/\n+/).filter(p => p.trim())
      for (const paraText of contentParagraphs) {
        const trimmed = paraText.trim()
        if (!trimmed) continue

        const paraOptions = {
          children: [
            new TextRun({
              text: trimmed,
              size: style.bodySize,
              font: style.fontFamily
            })
          ],
          spacing: {
            line: Math.round(style.lineHeight * 240), // docx行高单位为240的倍数
            after: style.paragraphSpacing
          }
        }

        // 首行缩进（两个全角空格）
        if (style.firstLineIndent) {
          paraOptions.indent = { firstLine: 480 } // 480 twips = 2个中文字符
        }

        paragraphs.push(new Paragraph(paraOptions))
      }
    }
  }

  // 创建文档
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,    // 1英寸 = 1440 twips
            bottom: 1440,
            left: 1440,
            right: 1440
          }
        }
      },
      children: paragraphs
    }]
  })

  // 打包为 Blob
  const blob = await Packer.toBlob(doc)
  return blob
}

/**
 * 导出 DOCX 为文件并触发下载
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 */
async function downloadDocx(projectData, templateId = 'publishing') {
  const blob = await exportToDocx(projectData, templateId)
  triggerDownload(blob, `${projectData.project.name || '云书作品'}.docx`)
}

// ==================== EPUB 导出 ====================

/**
 * 导出为 EPUB 格式
 * 使用 epub-gen-memory 生成电子书，支持封面/目录/章节
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 * @param {object} [options] - 额外选项
 * @param {string} [options.coverImage] - 封面图片URL（base64或网络地址）
 * @returns {Promise<Buffer>} EPUB 文件 Buffer
 */
async function exportToEpub(projectData, templateId = 'publishing', options = {}) {
  const { project, chapters } = projectData

  // 构建章节内容
  const content = []

  for (const chapter of chapters) {
    let chapterHtml = ''
    if (chapter.summary) {
      chapterHtml += `<p><em>${escapeHtml(chapter.summary)}</em></p>`
    }
    if (chapter.content) {
      const paragraphs = chapter.content.split(/\n+/).filter(p => p.trim())
      for (const para of paragraphs) {
        chapterHtml += `<p>${escapeHtml(para.trim())}</p>`
      }
    }

    content.push({
      title: chapter.title || '未命名章节',
      data: chapterHtml
    })
  }

  // EPUB 元数据
  const metadata = {
    title: project.name || '未命名作品',
    author: project.author || '云书用户',
    publisher: '云书',
    description: project.description || '',
    language: 'zh-CN',
    css: generateEpubCss(templateId)
  }

  // 封面图片
  if (options.coverImage) {
    metadata.cover = options.coverImage
  }

  // 生成 EPUB
  const epub = new (await getEPub())(metadata, content)
  const buffer = await epub.genEpub()

  return buffer
}

/**
 * 导出 EPUB 为文件并触发下载
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 * @param {object} [options] - 额外选项
 */
async function downloadEpub(projectData, templateId = 'publishing', options = {}) {
  const buffer = await exportToEpub(projectData, templateId, options)
  const blob = new Blob([buffer], { type: 'application/epub+zip' })
  triggerDownload(blob, `${projectData.project.name || '云书作品'}.epub`)
}

/**
 * 生成 EPUB 内嵌 CSS 样式
 * @param {string} templateId - 模板ID
 * @returns {string} CSS 样式字符串
 */
function generateEpubCss(templateId) {
  const template = getTemplate(templateId)
  const style = template.docx

  return `
    body {
      font-family: "${style.fontFamily}", serif;
      font-size: ${Math.round(style.bodySize / 2)}px;
      line-height: ${style.lineHeight};
      margin: 1em;
      padding: 0;
    }
    h1 {
      font-size: ${Math.round(style.titleSize / 2)}px;
      text-align: center;
      margin: 2em 0 1em 0;
      font-weight: bold;
    }
    h2 {
      font-size: ${Math.round(style.headingSize / 2)}px;
      text-align: center;
      margin: 1.5em 0 0.8em 0;
      font-weight: bold;
    }
    p {
      text-indent: ${style.firstLineIndent ? '2em' : '0'};
      margin: 0.5em 0;
      text-align: justify;
    }
    em {
      color: #666;
      font-style: italic;
    }
  `
}

// ==================== PDF 导出 ====================

/**
 * 导出为 PDF 格式
 * 使用浏览器打印 API 生成 PDF，完美支持中文
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 * @returns {Promise<Blob>} PDF 文件 Blob
 */
async function exportToPdf(projectData, templateId = 'publishing') {
  const { project, chapters } = projectData

  // 构建 HTML 内容
  const chaptersHtml = chapters.map((chapter, i) => `
    <div class="chapter" style="page-break-before: ${i > 0 ? 'always' : 'auto'}">
      <h2 style="text-align:center;font-size:22pt;margin-bottom:20pt;color:#303133;">${escapeHtml(chapter.title || `第${i + 1}章`)}</h2>
      ${chapter.summary ? `<p style="font-size:11pt;color:#909399;margin-bottom:16px;text-indent:2em;">${escapeHtml(chapter.summary)}</p>` : ''}
      <div style="font-size:12pt;line-height:1.8;color:#303133;">
        ${chapter.content ? chapter.content.split(/\n+/).map(p => `<p style="text-indent:2em;margin-bottom:8px;">${escapeHtml(p)}</p>`).join('') : '<p style="color:#909399;text-align:center;">（暂无内容）</p>'}
      </div>
    </div>
  `).join('')

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 2.54cm; }
  body { font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'SimSun', serif; color: #303133; }
  .cover { text-align: center; padding-top: 35vh; page-break-after: always; }
  .cover h1 { font-size: 32pt; margin-bottom: 16pt; }
  .cover .author { font-size: 14pt; color: #606266; }
  .intro { page-break-after: always; }
  .intro h2 { font-size: 18pt; margin-bottom: 12pt; }
  .intro p { font-size: 12pt; line-height: 1.8; text-indent: 2em; }
  .chapter h2 { font-size: 18pt; margin-bottom: 16pt; }
</style></head><body>
  <div class="cover">
    <h1>${escapeHtml(project.name || '云书作品')}</h1>
    ${project.author ? `<div class="author">${escapeHtml(project.author)}</div>` : ''}
  </div>
  ${project.description ? `<div class="intro"><h2>简介</h2><p>${escapeHtml(project.description)}</p></div>` : ''}
  ${chaptersHtml}
</body></html>`

  // 使用隐藏 iframe 渲染 HTML 并打印为 PDF
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.left = '-9999px'
    iframe.style.width = '210mm'
    iframe.style.height = '297mm'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write(html)
    iframeDoc.close()

    iframe.onload = () => {
      try {
        iframe.contentWindow.print()
        // print API 不返回 blob，返回 HTML blob 供用户自行打印/保存
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        resolve(blob)
      } catch (err) {
        // 回退：返回 HTML 文件
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        resolve(blob)
      } finally {
        setTimeout(() => document.body.removeChild(iframe), 1000)
      }
    }
  })
}

/**
 * HTML 转义
 */
function escapeHtml(text) {
  if (!text) return ''
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * 导出 PDF 为文件并触发下载
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 */
async function downloadPdf(projectData, templateId = 'publishing') {
  const blob = await exportToPdf(projectData, templateId)
  triggerDownload(blob, `${projectData.project.name || '云书作品'}.pdf`)
}

// ==================== 批量导出 ====================

/**
 * 批量导出所有格式
 * 一键导出 Markdown、DOCX、EPUB、PDF 四种格式
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 * @param {Function} [onProgress] - 进度回调 (format: string, status: string) => void
 * @returns {Promise<object>} 导出结果 { markdown: Blob, docx: Blob, epub: Buffer, pdf: Blob }
 */
async function batchExport(projectData, templateId = 'publishing', onProgress = null) {
  const results = {}

  try {
    // 1. Markdown
    if (onProgress) onProgress('markdown', 'exporting')
    const markdown = exportToMarkdown(projectData, templateId)
    results.markdown = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    if (onProgress) onProgress('markdown', 'completed')

    // 2. DOCX
    if (onProgress) onProgress('docx', 'exporting')
    results.docx = await exportToDocx(projectData, templateId)
    if (onProgress) onProgress('docx', 'completed')

    // 3. EPUB
    if (onProgress) onProgress('epub', 'exporting')
    results.epub = await exportToEpub(projectData, templateId)
    if (onProgress) onProgress('epub', 'completed')

    // 4. PDF
    if (onProgress) onProgress('pdf', 'exporting')
    results.pdf = await exportToPdf(projectData, templateId)
    if (onProgress) onProgress('pdf', 'completed')

    return results
  } catch (error) {
    console.error('[导出服务] 批量导出失败:', error)
    throw error
  }
}

/**
 * 批量导出并逐个下载
 * @param {object} projectData - 项目数据
 * @param {string} [templateId='publishing'] - 模板ID
 * @param {Function} [onProgress] - 进度回调
 */
async function batchDownload(projectData, templateId = 'publishing', onProgress = null) {
  const results = await batchExport(projectData, templateId, onProgress)
  const name = projectData.project.name || '云书作品'

  // 逐个触发下载，间隔200ms避免浏览器拦截
  if (results.markdown) {
    triggerDownload(results.markdown, `${name}.md`)
    await delay(200)
  }
  if (results.docx) {
    triggerDownload(results.docx, `${name}.docx`)
    await delay(200)
  }
  if (results.epub) {
    const epubBlob = new Blob([results.epub], { type: 'application/epub+zip' })
    triggerDownload(epubBlob, `${name}.epub`)
    await delay(200)
  }
  if (results.pdf) {
    triggerDownload(results.pdf, `${name}.pdf`)
  }
}

// ==================== 导出历史记录 ====================

/**
 * 记录导出操作到数据库
 * @param {object} params - 导出参数
 * @param {number} params.projectId - 项目ID
 * @param {string} params.format - 导出格式
 * @param {string} params.fileName - 文件名
 * @param {number} [params.fileSize] - 文件大小（字节）
 * @param {string} [params.templateId] - 使用的模板ID
 * @param {string} [params.status='success'] - 导出状态
 * @param {string} [params.error] - 错误信息
 */
async function recordExportHistory(params) {
  try {
    // 延迟导入数据库服务，避免循环依赖
    const database = await import('./database.js')
    await database.default.db.exportHistory.add({
      projectId: params.projectId,
      format: params.format,
      fileName: params.fileName,
      fileSize: params.fileSize || 0,
      templateId: params.templateId || 'publishing',
      status: params.status || 'success',
      error: params.error || '',
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.warn('[导出服务] 记录导出历史失败:', error)
  }
}

/**
 * 获取导出历史
 * @param {number} [projectId] - 项目ID，不传则获取全部
 * @param {number} [limit=50] - 最大返回数量
 * @returns {Promise<Array>}
 */
async function getExportHistory(projectId = null, limit = 50) {
  try {
    const database = await import('./database.js')
    return database.default.getExportHistory(projectId, limit)
  } catch (error) {
    console.warn('[导出服务] 获取导出历史失败:', error)
    return []
  }
}

// ==================== 工具函数 ====================

/**
 * 触发浏览器下载
 * @param {Blob} blob - 文件 Blob
 * @param {string} fileName - 文件名
 */
function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // 延迟释放 URL，确保下载完成
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

/**
 * 延迟指定毫秒
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ==================== 统一导出 ====================

/**
 * 导出服务统一导出
 * 包含所有导出格式、模板系统、批量导出、历史记录等功能
 */
const exportService = {
  // 模板系统
  getTemplate,
  getAllTemplates,
  EXPORT_TEMPLATES,

  // Markdown 导出
  exportToMarkdown,
  downloadMarkdown,

  // DOCX 导出
  exportToDocx,
  downloadDocx,

  // EPUB 导出
  exportToEpub,
  downloadEpub,

  // PDF 导出
  exportToPdf,
  downloadPdf,

  // 批量导出
  batchExport,
  batchDownload,

  // 导出历史
  recordExportHistory,
  getExportHistory,

  // 工具函数
  triggerDownload,
  escapeHtml
}

export default exportService

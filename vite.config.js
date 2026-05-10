/**
 * 云书项目 - Vite 构建配置
 * 包含性能优化、代码分割、压缩、缓存等配置
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// ============================================
// 路径解析
// ============================================

const rootDir = __dirname

// ============================================
// 构建配置
// ============================================

export default defineConfig(({ mode }) => {
  // 是否为生产环境
  const isProduction = mode === 'production'

  return {
    // 基础路径
    base: './',

    // ============================================
    // 插件配置
    // ============================================
    plugins: [
      // Vue 3 支持
      vue(),

      // 自动导入 API
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: true,
        // 自动导入性能监控工具
        dirs: [
          resolve(rootDir, 'src/utils')
        ]
      }),

      // 自动注册组件
      Components({
        resolvers: [ElementPlusResolver()],
        // 自动导入组件目录
        dirs: ['src/components'],
        // 生成类型声明文件
        dts: true
      })
    ],

    // ============================================
    // 路径别名
    // ============================================
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
        '@components': resolve(rootDir, 'src/components'),
        '@views': resolve(rootDir, 'src/views'),
        '@stores': resolve(rootDir, 'src/stores'),
        '@services': resolve(rootDir, 'src/services'),
        '@utils': resolve(rootDir, 'src/utils'),
        '@config': resolve(rootDir, 'src/config'),
        '@assets': resolve(rootDir, 'src/assets')
      }
    },

    // ============================================
    // 开发服务器配置
    // ============================================
    server: {
      port: 7520,
      open: false,
      host: true,
      // 热更新配置
      hmr: {
        overlay: true
      },
      // CORS 配置
      cors: true,
      // 代理配置（如需要）
      proxy: {
        // 示例：代理 API 请求
        // '/api': {
        //   target: 'http://localhost:3000',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, '')
        // }
      }
    },

    // ============================================
    // 构建配置
    // ============================================
    build: {
      // 目标浏览器
      target: 'es2015',

      // 输出目录
      outDir: 'dist',

      // 静态资源目录
      assetsDir: 'assets',

      // 是否生成 source map（生产环境关闭以减小体积）
      sourcemap: !isProduction,

      // 压缩配置
      minify: isProduction ? 'terser' : 'esbuild',

      // Terser 压缩选项
      terserOptions: {
        compress: {
          // 生产环境移除 console
          drop_console: isProduction,
          // 移除 debugger
          drop_debugger: isProduction,
          // 移除注释
          pure_funcs: isProduction ? ['console.log', 'console.info'] : []
        },
        format: {
          // 移除注释
          comments: false
        }
      },

      // CSS 代码分割
      cssCodeSplit: true,

      // chunk 大小警告阈值
      chunkSizeWarningLimit: 500,

      // ============================================
      // Rollup 打包配置
      // ============================================
      rollupOptions: {
        output: {
          // 文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

          // ============================================
          // 手动代码分割（细粒度 chunk 划分）
          // ============================================
          manualChunks: (id) => {
            // Vue 核心生态
            if (id.includes('node_modules/vue/') ||
                id.includes('node_modules/@vue/') ||
                id.includes('node_modules/vue-router/') ||
                id.includes('node_modules/pinia/')) {
              return 'vue-vendor'
            }

            // Element Plus UI 框架
            if (id.includes('node_modules/element-plus/') ||
                id.includes('node_modules/@element-plus/') ||
                id.includes('node_modules/element-plus/theme-chalk/')) {
              return 'element-plus'
            }

            // 富文本编辑器
            if (id.includes('node_modules/@wangeditor/')) {
              return 'editor'
            }

            // 流程图/图谱
            if (id.includes('node_modules/@vue-flow/')) {
              return 'vue-flow'
            }

            // 文档处理
            if (id.includes('node_modules/docx/') ||
                id.includes('node_modules/epub-gen-memory/') ||
                id.includes('node_modules/jspdf/') ||
                id.includes('node_modules/file-saver/')) {
              return 'document'
            }

            // 工具库
            if (id.includes('node_modules/axios/')) {
              return 'axios'
            }
            if (id.includes('node_modules/marked/')) {
              return 'marked'
            }
            if (id.includes('node_modules/lz-string/')) {
              return 'lz-string'
            }
            if (id.includes('node_modules/dexie/')) {
              return 'dexie'
            }

            // 代码高亮
            if (id.includes('node_modules/highlight.js/')) {
              return 'highlight'
            }

            // VueUse 工具库
            if (id.includes('node_modules/@vueuse/')) {
              return 'vueuse'
            }

            // 其他第三方库
            if (id.includes('node_modules/')) {
              return 'vendor'
            }

            // 按功能模块分割业务代码
            if (id.includes('/src/views/')) {
              // 写作相关页面
              if (id.includes('Writer.vue') ||
                  id.includes('FocusMode.vue') ||
                  id.includes('MasterCreation.vue')) {
                return 'views-writer'
              }
              // 管理相关页面
              if (id.includes('NovelManagement.vue') ||
                  id.includes('ChapterManagement.vue') ||
                  id.includes('ChapterGraph.vue')) {
                return 'views-management'
              }
              // 分析相关页面
              if (id.includes('BookAnalysis.vue') ||
                  id.includes('TextAnalysis.vue') ||
                  id.includes('StyleImitation.vue')) {
                return 'views-analysis'
              }
              // 其他页面
              return 'views-other'
            }

            // 服务层
            if (id.includes('/src/services/')) {
              return 'services'
            }

            // 配置层
            if (id.includes('/src/config/')) {
              return 'config'
            }

            // 组件
            if (id.includes('/src/components/')) {
              return 'components'
            }
          }
        }
      },

      // ============================================
      // 静态资源处理
      // ============================================
      // 小于此阈值的资源将内联为 base64
      assetsInlineLimit: 4096, // 4KB

      // 大文件警告阈值
      reportCompressedSize: true
    },

    // ============================================
    // CSS 配置
    // ============================================
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        scss: {
          // 自动导入全局样式变量
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      // 开发时启用 Source Map
      devSourcemap: !isProduction
    },

    // ============================================
    // 依赖预构建优化
    // ============================================
    optimizeDeps: {
      // 预构建包含的依赖
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'element-plus/es/components/message/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/message-box/style/css',
        'axios',
        'marked',
        '@vueuse/core'
      ],
      // 排除预构建的依赖
      exclude: [],
      // 强制预构建
      force: false
    },

    // ============================================
    // 预览服务器配置
    // ============================================
    preview: {
      port: 7521,
      host: true,
      // 开启 gzip 压缩预览
      headers: {
        'Cache-Control': 'public, max-age=31536000'
      }
    },

    // ============================================
    // 日志级别
    // ============================================
    logLevel: 'info',

    // ============================================
    // 实验性功能
    // ============================================
    experimental: {
      // 启用构建时的 import.meta.glob
      importGlobRestoreExtension: true
    },

    // ============================================
    // 定义环境变量
    // ============================================
    define: {
      __APP_VERSION__: JSON.stringify('2.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }
})

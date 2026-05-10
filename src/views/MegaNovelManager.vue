<!--
  MegaNovelManager.vue - 百万字小说管理页面
  
  功能模块：
  1. 项目仪表盘：总览卡片、写作热力图、趋势图表
  2. 卷管理：卷列表、每卷统计、批量操作
  3. 章节管理：章节表格、状态修改、章节预览
  4. 批量生成面板：选择范围、参数配置、进度显示
  5. 上下文查看器：当前章节上下文、手动编辑
  6. 质量检查报告：问题列表、一键修复、重写建议
-->
<template>
  <div class="mega-novel-manager">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>百万字小说管理</h2>
        <el-tag v-if="currentProject" type="primary" size="small">
          {{ currentProject.title }}
        </el-tag>
      </div>
      <div class="header-right">
        <el-button @click="showNewProjectDialog = true">
          <el-icon><Plus /></el-icon> 新建项目
        </el-button>
        <el-button @click="handleExportProject">
          <el-icon><Download /></el-icon> 导出
        </el-button>
        <el-button @click="handleImportProject">
          <el-icon><Upload /></el-icon> 导入
        </el-button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <el-tabs v-model="activeTab" type="border-card" class="main-tabs">
      <!-- ==================== 仪表盘 Tab ==================== -->
      <el-tab-pane label="仪表盘" name="dashboard">
        <div class="dashboard-content">
          <!-- 统计卡片 -->
          <el-row :gutter="16" class="stats-row">
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #409eff, #66b1ff)">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ formatNumber(progressStats.totalWords) }}</div>
                  <div class="stat-label">总字数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #67c23a, #85ce61)">
                  <el-icon><Notebook /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ volumes.length }}</div>
                  <div class="stat-label">卷数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #e6a23c, #ebb563)">
                  <el-icon><Tickets /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ chapters.length }}</div>
                  <div class="stat-label">章节数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover" class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f56c6c, #f78989)">
                  <el-icon><Aim /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ progressStats.percentage.toFixed(1) }}%</div>
                  <div class="stat-label">完成进度</div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 进度条 -->
          <el-card shadow="hover" class="progress-card">
            <div class="progress-header">
              <span>总体进度</span>
              <span class="progress-text">
                {{ formatNumber(progressStats.totalWords) }} / {{ formatNumber(progressStats.targetWords) }} 字
              </span>
            </div>
            <el-progress
              :percentage="progressStats.percentage"
              :stroke-width="20"
              :format="() => `${progressStats.percentage.toFixed(1)}%`"
            />
            <div class="progress-footer">
              <span>平均每日: {{ progressStats.avgDailyWords }} 字</span>
              <span v-if="progressStats.estimatedEndDate">
                预计完成: {{ formatDate(progressStats.estimatedEndDate) }}
              </span>
            </div>
          </el-card>

          <!-- 写作热力图 -->
          <el-card shadow="hover" class="heatmap-card">
            <template #header>
              <div class="card-header">
                <span>写作热力图</span>
                <span class="heatmap-legend">
                  <span class="legend-item" style="background: #ebedf0"></span>
                  <span class="legend-item" style="background: #c6e48b"></span>
                  <span class="legend-item" style="background: #7bc96f"></span>
                  <span class="legend-item" style="background: #239a3b"></span>
                  <span class="legend-item" style="background: #196127"></span>
                </span>
              </div>
            </template>
            <div class="heatmap-container">
              <div
                v-for="(day, index) in heatmapData"
                :key="index"
                class="heatmap-cell"
                :style="{ backgroundColor: getHeatmapColor(day.count) }"
                :title="`${day.date}: ${day.count} 字`"
              ></div>
            </div>
          </el-card>

          <!-- 趋势图表 -->
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <span>写作趋势</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="趋势图表需要引入 ECharts 库" :image-size="100" />
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- ==================== 卷管理 Tab ==================== -->
      <el-tab-pane label="卷管理" name="volumes">
        <div class="volumes-content">
          <div class="toolbar">
            <el-button type="primary" @click="showAddVolumeDialog = true">
              <el-icon><Plus /></el-icon> 添加卷
            </el-button>
            <el-button @click="handleGenerateAllOutlines" :loading="isGeneratingOutlines">
              <el-icon><MagicStick /></el-icon> 批量生成大纲
            </el-button>
          </div>

          <el-collapse v-model="expandedVolumes" class="volume-collapse">
            <el-collapse-item
              v-for="volume in volumes"
              :key="volume.id"
              :name="volume.id"
            >
              <template #title>
                <div class="volume-title">
                  <span class="volume-name">{{ volume.title }}</span>
                  <el-tag size="small" type="info">
                    {{ getVolumeChapterCount(volume.id) }} 章
                  </el-tag>
                  <el-tag size="small" type="success">
                    {{ formatNumber(getVolumeWordCount(volume.id)) }} 字
                  </el-tag>
                </div>
              </template>

              <div class="volume-actions">
                <el-button size="small" @click="editVolume(volume)">编辑</el-button>
                <el-button size="small" type="primary" @click="addChapterToVolume(volume.id)">
                  添加章节
                </el-button>
                <el-button size="small" type="danger" @click="deleteVolume(volume.id)">删除</el-button>
              </div>

              <!-- 卷内章节列表 -->
              <el-table :data="getVolumeChapters(volume.id)" size="small" stripe>
                <el-table-column prop="title" label="章节标题" min-width="200" />
                <el-table-column prop="wordCount" label="字数" width="100">
                  <template #default="{ row }">
                    {{ row.wordCount || 0 }}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)" size="small">
                      {{ getStatusLabel(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="{ row }">
                    <el-button type="primary" link size="small" @click="editChapter(row)">
                      编辑
                    </el-button>
                    <el-button type="danger" link size="small" @click="deleteChapter(row.id)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>

          <el-empty v-if="volumes.length === 0" description="暂无卷，点击上方按钮添加" />
        </div>
      </el-tab-pane>

      <!-- ==================== 章节管理 Tab ==================== -->
      <el-tab-pane label="章节管理" name="chapters">
        <div class="chapters-content">
          <div class="toolbar">
            <el-button type="primary" @click="showAddChapterDialog = true">
              <el-icon><Plus /></el-icon> 添加章节
            </el-button>
            <el-button @click="handleBatchAddChapters">
              <el-icon><List /></el-icon> 批量添加
            </el-button>
            <el-input
              v-model="chapterSearchQuery"
              placeholder="搜索章节..."
              clearable
              style="width: 200px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="chapterStatusFilter" placeholder="状态筛选" clearable style="width: 120px">
              <el-option label="全部" value="" />
              <el-option label="待写" value="todo" />
              <el-option label="有大纲" value="outline" />
              <el-option label="生成中" value="generating" />
              <el-option label="初稿" value="draft" />
              <el-option label="审核中" value="reviewing" />
              <el-option label="已完成" value="completed" />
            </el-select>
          </div>

          <el-table
            :data="filteredChapters"
            size="small"
            stripe
            @selection-change="handleChapterSelection"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="title" label="章节标题" min-width="200">
              <template #default="{ row }">
                <span class="chapter-title-cell" @click="previewChapter(row)">
                  {{ row.title }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="volumeId" label="所属卷" width="120">
              <template #default="{ row }">
                {{ getVolumeName(row.volumeId) || '未分组' }}
              </template>
            </el-table-column>
            <el-table-column prop="wordCount" label="字数" width="100" sortable>
              <template #default="{ row }">
                {{ row.wordCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-select
                  v-model="row.status"
                  size="small"
                  @change="handleStatusChange(row)"
                >
                  <el-option label="待写" value="todo" />
                  <el-option label="有大纲" value="outline" />
                  <el-option label="生成中" value="generating" />
                  <el-option label="初稿" value="draft" />
                  <el-option label="审核中" value="reviewing" />
                  <el-option label="已完成" value="completed" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="qualityScore" label="质量分" width="80">
              <template #default="{ row }">
                <el-tag
                  v-if="row.qualityScore"
                  :type="row.qualityScore >= 80 ? 'success' : (row.qualityScore >= 60 ? 'warning' : 'danger')"
                  size="small"
                >
                  {{ row.qualityScore }}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="editChapter(row)">
                  编辑
                </el-button>
                <el-button type="success" link size="small" @click="generateSingleChapter(row)">
                  生成
                </el-button>
                <el-button type="warning" link size="small" @click="checkChapterQuality(row)">
                  检查
                </el-button>
                <el-button type="danger" link size="small" @click="deleteChapter(row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 批量操作 -->
          <div v-if="selectedChapters.length > 0" class="batch-actions">
            <span>已选择 {{ selectedChapters.length }} 章</span>
            <el-button size="small" @click="handleBatchGenerate">批量生成</el-button>
            <el-button size="small" @click="handleBatchStatusChange">修改状态</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- ==================== 批量生成 Tab ==================== -->
      <el-tab-pane label="批量生成" name="generation">
        <div class="generation-content">
          <el-row :gutter="20">
            <!-- 左侧：生成配置 -->
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>
                  <span>生成配置</span>
                </template>

                <el-form :model="generationConfig" label-width="100px">
                  <el-form-item label="生成范围">
                    <el-select v-model="generationConfig.rangeType" style="width: 100%">
                      <el-option label="全部待生成章节" value="all" />
                      <el-option label="指定范围" value="range" />
                      <el-option label="选中的章节" value="selected" />
                    </el-select>
                  </el-form-item>

                  <el-form-item v-if="generationConfig.rangeType === 'range'" label="章节范围">
                    <el-col :span="11">
                      <el-input-number v-model="generationConfig.startChapter" :min="1" style="width: 100%" />
                    </el-col>
                    <el-col :span="2" style="text-align: center">至</el-col>
                    <el-col :span="11">
                      <el-input-number v-model="generationConfig.endChapter" :min="1" style="width: 100%" />
                    </el-col>
                  </el-form-item>

                  <el-form-item label="生成模型">
                    <el-select v-model="generationConfig.model" style="width: 100%">
                      <el-option label="GPT-4o" value="gpt-4o" />
                      <el-option label="GPT-4 Turbo" value="gpt-4-turbo" />
                      <el-option label="Claude 3.5 Sonnet" value="claude-3-5-sonnet" />
                      <el-option label="DeepSeek V3" value="deepseek-chat" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="温度参数">
                    <el-slider v-model="generationConfig.temperature" :min="0" :max="1" :step="0.1" show-input />
                  </el-form-item>

                  <el-form-item label="最大字数">
                    <el-input-number v-model="generationConfig.maxWords" :min="1000" :max="5000" :step="500" />
                  </el-form-item>

                  <el-form-item label="自动重写">
                    <el-switch v-model="generationConfig.autoRewrite" />
                    <span class="form-hint">质量检查不通过时自动重写</span>
                  </el-form-item>

                  <el-form-item label="断点续传">
                    <el-switch v-model="generationConfig.resumeFromCheckpoint" />
                  </el-form-item>
                </el-form>

                <div class="generation-actions">
                  <el-button
                    type="primary"
                    size="large"
                    :loading="isGenerating"
                    @click="startBatchGeneration"
                  >
                    <el-icon><VideoPlay /></el-icon>
                    开始生成
                  </el-button>
                  <el-button
                    v-if="isGenerating"
                    type="danger"
                    size="large"
                    @click="stopGeneration"
                  >
                    <el-icon><VideoPause /></el-icon>
                    停止
                  </el-button>
                </div>
              </el-card>
            </el-col>

            <!-- 右侧：进度显示 -->
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>
                  <span>生成进度</span>
                </template>

                <div class="progress-display">
                  <el-progress
                    :percentage="generationProgress.percentage"
                    :status="generationProgress.status"
                    :stroke-width="16"
                  />

                  <div class="progress-info">
                    <p><strong>当前状态:</strong> {{ generationProgress.message }}</p>
                    <p v-if="generationProgress.currentChapter">
                      <strong>当前章节:</strong> {{ generationProgress.currentChapterTitle }}
                    </p>
                    <p>
                      <strong>已完成:</strong> {{ generationProgress.completed }} / {{ generationProgress.total }}
                    </p>
                  </div>

                  <!-- 生成队列 -->
                  <div class="generation-queue">
                    <h4>生成队列</h4>
                    <el-table :data="generationQueue" size="small" max-height="300">
                      <el-table-column prop="chapterTitle" label="章节" />
                      <el-table-column prop="status" label="状态" width="100">
                        <template #default="{ row }">
                          <el-tag :type="getQueueStatusType(row.status)" size="small">
                            {{ getQueueStatusLabel(row.status) }}
                          </el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- ==================== 上下文查看器 Tab ==================== -->
      <el-tab-pane label="上下文" name="context">
        <div class="context-content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <span>选择章节</span>
                </template>
                <el-tree
                  :data="chapterTreeData"
                  :props="{ label: 'title', children: 'children' }"
                  node-key="id"
                  @node-click="handleContextChapterSelect"
                  highlight-current
                />
              </el-card>
            </el-col>

            <el-col :span="16">
              <el-card shadow="hover" v-if="selectedContextChapter">
                <template #header>
                  <div class="context-header">
                    <span>{{ selectedContextChapter.title }} - 上下文信息</span>
                    <el-button size="small" @click="refreshContext">刷新</el-button>
                  </div>
                </template>

                <el-tabs>
                  <el-tab-pane label="前文摘要">
                    <div class="context-section">
                      <div v-if="chapterContext.previousSummaries.length > 0">
                        <div
                          v-for="(summary, index) in chapterContext.previousSummaries"
                          :key="index"
                          class="summary-item"
                        >
                          <h5>{{ summary.title }}</h5>
                          <p>{{ summary.summary }}</p>
                        </div>
                      </div>
                      <el-empty v-else description="暂无前文摘要" />
                    </div>
                  </el-tab-pane>

                  <el-tab-pane label="角色状态">
                    <div class="context-section">
                      <div v-if="chapterContext.relevantCharacters.length > 0">
                        <div
                          v-for="character in chapterContext.relevantCharacters"
                          :key="character.id"
                          class="character-item"
                        >
                          <h5>{{ character.name }}</h5>
                          <p>{{ character.description }}</p>
                          <div v-if="character.currentState" class="character-state">
                            <span v-for="(value, key) in character.currentState" :key="key">
                              {{ key }}: {{ value }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <el-empty v-else description="暂无相关角色" />
                    </div>
                  </el-tab-pane>

                  <el-tab-pane label="世界观">
                    <div class="context-section">
                      <pre v-if="chapterContext.worldContext">{{ chapterContext.worldContext }}</pre>
                      <el-empty v-else description="暂无世界观设定" />
                    </div>
                  </el-tab-pane>

                  <el-tab-pane label="Token 统计">
                    <div class="context-section token-stats">
                      <el-statistic title="上下文 Token" :value="chapterContext.contextTokens" />
                      <el-statistic title="可用 Token" :value="chapterContext.availableTokens" />
                      <el-progress
                        :percentage="(chapterContext.contextTokens / chapterContext.availableTokens) * 100"
                        :format="() => `${chapterContext.contextTokens} / ${chapterContext.availableTokens}`"
                      />
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-card>

              <el-empty v-else description="请选择一个章节查看上下文" />
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- ==================== 质量检查 Tab ==================== -->
      <el-tab-pane label="质量检查" name="quality">
        <div class="quality-content">
          <div class="toolbar">
            <el-button type="primary" @click="runFullQualityCheck" :loading="isCheckingQuality">
              <el-icon><DataAnalysis /></el-icon> 全面检查
            </el-button>
            <el-button @click="exportQualityReport">
              <el-icon><Download /></el-icon> 导出报告
            </el-button>
          </div>

          <el-row :gutter="20">
            <!-- 问题列表 -->
            <el-col :span="16">
              <el-card shadow="hover">
                <template #header>
                  <span>问题列表</span>
                </template>

                <el-table :data="qualityIssues" size="small">
                  <el-table-column prop="chapterTitle" label="章节" width="200" />
                  <el-table-column prop="type" label="类型" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getIssueTypeTag(row.type)" size="small">
                        {{ row.type }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message" label="问题描述" />
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button type="primary" link size="small" @click="fixIssue(row)">
                        一键修复
                      </el-button>
                      <el-button type="warning" link size="small" @click="rewriteChapterFromIssue(row)">
                        重写
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-empty v-if="qualityIssues.length === 0" description="暂无质量问题" />
              </el-card>
            </el-col>

            <!-- 审核队列 -->
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <span>人工审核队列</span>
                  <el-tag size="small">{{ reviewQueue.length }}</el-tag>
                </template>

                <div class="review-list">
                  <div
                    v-for="item in reviewQueue"
                    :key="item.chapterId"
                    class="review-item"
                    @click="openReviewDialog(item)"
                  >
                    <span class="review-title">{{ item.chapterTitle }}</span>
                    <el-tag size="small" type="warning">{{ item.issues.length }} 问题</el-tag>
                  </div>
                </div>

                <el-empty v-if="reviewQueue.length === 0" description="审核队列为空" />
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- ==================== 对话框 ==================== -->

    <!-- 新建项目对话框 -->
    <el-dialog v-model="showNewProjectDialog" title="新建小说项目" width="600px">
      <el-form :model="newProjectForm" label-width="80px">
        <el-form-item label="小说标题" required>
          <el-input v-model="newProjectForm.title" placeholder="请输入小说标题" />
        </el-form-item>
        <el-form-item label="小说类型">
          <el-select v-model="newProjectForm.genre" placeholder="选择类型" style="width: 100%">
            <el-option label="玄幻" value="玄幻" />
            <el-option label="都市" value="都市" />
            <el-option label="仙侠" value="仙侠" />
            <el-option label="历史" value="历史" />
            <el-option label="科幻" value="科幻" />
            <el-option label="悬疑" value="悬疑" />
            <el-option label="言情" value="言情" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="newProjectForm.theme" placeholder="小说主题" />
        </el-form-item>
        <el-form-item label="目标字数">
          <el-input-number v-model="newProjectForm.targetWords" :min="10000" :step="10000" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="newProjectForm.intro" type="textarea" :rows="3" placeholder="小说简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNewProjectDialog = false">取消</el-button>
        <el-button type="primary" @click="createProject">创建</el-button>
      </template>
    </el-dialog>

    <!-- 添加卷对话框 -->
    <el-dialog v-model="showAddVolumeDialog" title="添加卷" width="500px">
      <el-form :model="volumeForm" label-width="80px">
        <el-form-item label="卷标题" required>
          <el-input v-model="volumeForm.title" placeholder="请输入卷标题" />
        </el-form-item>
        <el-form-item label="卷简介">
          <el-input v-model="volumeForm.description" type="textarea" :rows="3" placeholder="卷简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddVolumeDialog = false">取消</el-button>
        <el-button type="primary" @click="saveVolume">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加章节对话框 -->
    <el-dialog v-model="showAddChapterDialog" title="添加章节" width="500px">
      <el-form :model="chapterForm" label-width="80px">
        <el-form-item label="所属卷">
          <el-select v-model="chapterForm.volumeId" placeholder="选择所属卷" style="width: 100%">
            <el-option v-for="vol in volumes" :key="vol.id" :label="vol.title" :value="vol.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="章节标题" required>
          <el-input v-model="chapterForm.title" placeholder="请输入章节标题" />
        </el-form-item>
        <el-form-item label="章节大纲">
          <el-input v-model="chapterForm.outline" type="textarea" :rows="4" placeholder="章节大纲" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddChapterDialog = false">取消</el-button>
        <el-button type="primary" @click="saveChapter">确定</el-button>
      </template>
    </el-dialog>

    <!-- 章节编辑对话框 -->
    <el-dialog v-model="showEditChapterDialog" title="编辑章节" width="800px">
      <el-form :model="editingChapter" label-width="80px">
        <el-form-item label="章节标题">
          <el-input v-model="editingChapter.title" />
        </el-form-item>
        <el-form-item label="章节大纲">
          <el-input v-model="editingChapter.outline" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="章节内容">
          <el-input v-model="editingChapter.content" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="字数">
          <el-input-number v-model="editingChapter.wordCount" :disabled="true" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditChapterDialog = false">取消</el-button>
        <el-button type="primary" @click="updateChapter">保存</el-button>
      </template>
    </el-dialog>

    <!-- 章节预览抽屉 -->
    <el-drawer v-model="showPreviewDrawer" title="章节预览" size="50%">
      <div v-if="previewingChapter" class="chapter-preview">
        <h3>{{ previewingChapter.title }}</h3>
        <el-divider />
        <div class="preview-meta">
          <span>字数: {{ previewingChapter.wordCount || 0 }}</span>
          <span>状态: {{ getStatusLabel(previewingChapter.status) }}</span>
        </div>
        <div class="preview-content">
          {{ previewingChapter.content || '暂无内容' }}
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
/**
 * MegaNovelManager.vue - 百万字小说管理页面
 * 
 * 功能模块：
 * 1. 项目仪表盘 - 统计卡片、进度条、热力图
 * 2. 卷管理 - 卷的增删改查、卷内章节管理
 * 3. 章节管理 - 章节表格、状态修改、批量操作
 * 4. 批量生成 - 生成配置、进度显示、队列管理
 * 5. 上下文查看 - 前文摘要、角色状态、世界观
 * 6. 质量检查 - 问题列表、审核队列、一键修复
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Download, Upload, Document, Notebook, Tickets, Aim,
  MagicStick, List, Search, VideoPlay, VideoPause, DataAnalysis
} from '@element-plus/icons-vue'
import megaNovelEngine, { CHAPTER_STATUS } from '../services/megaNovelEngine.js'

// ==================== 响应式数据 ====================

// 当前 Tab
const activeTab = ref('dashboard')

// 项目数据
const currentProject = ref(null)
const volumes = ref([])
const chapters = ref([])
const characters = ref([])
const worldSettings = ref([])

// UI 状态
const showNewProjectDialog = ref(false)
const showAddVolumeDialog = ref(false)
const showAddChapterDialog = ref(false)
const showEditChapterDialog = ref(false)
const showPreviewDrawer = ref(false)

const expandedVolumes = ref([])
const chapterSearchQuery = ref('')
const chapterStatusFilter = ref('')
const selectedChapters = ref([])
const previewingChapter = ref(null)
const editingChapter = ref(null)
const editingVolume = ref(null)

// 生成状态
const isGenerating = ref(false)
const isGeneratingOutlines = ref(false)
const isCheckingQuality = ref(false)

// 表单数据
const newProjectForm = reactive({
  title: '',
  genre: '',
  theme: '',
  intro: '',
  targetWords: 100000
})

const volumeForm = reactive({
  title: '',
  description: ''
})

const chapterForm = reactive({
  volumeId: '',
  title: '',
  outline: ''
})

// 生成配置
const generationConfig = reactive({
  rangeType: 'all',
  startChapter: 1,
  endChapter: 10,
  model: 'gpt-4o',
  temperature: 0.7,
  maxWords: 2500,
  autoRewrite: true,
  resumeFromCheckpoint: false
})

// 生成进度
const generationProgress = reactive({
  percentage: 0,
  status: '',
  message: '等待开始',
  currentChapter: null,
  currentChapterTitle: '',
  completed: 0,
  total: 0
})

// 生成队列
const generationQueue = ref([])

// 上下文
const selectedContextChapter = ref(null)
const chapterContext = reactive({
  previousSummaries: [],
  relevantCharacters: [],
  worldContext: '',
  contextTokens: 0,
  availableTokens: 0
})

// 质量检查
const qualityIssues = ref([])
const reviewQueue = ref([])

// ==================== 计算属性 ====================

/**
 * 进度统计
 */
const progressStats = computed(() => {
  return megaNovelEngine.getProgressStats()
})

/**
 * 热力图数据
 */
const heatmapData = computed(() => {
  return megaNovelEngine.getHeatmapData(90)
})

/**
 * 过滤后的章节列表
 */
const filteredChapters = computed(() => {
  let result = [...chapters.value]
  
  if (chapterSearchQuery.value) {
    const query = chapterSearchQuery.value.toLowerCase()
    result = result.filter(ch => ch.title.toLowerCase().includes(query))
  }
  
  if (chapterStatusFilter.value) {
    result = result.filter(ch => ch.status === chapterStatusFilter.value)
  }
  
  return result.sort((a, b) => a.order - b.order)
})

/**
 * 章节树形数据
 */
const chapterTreeData = computed(() => {
  return volumes.value.map(vol => ({
    id: vol.id,
    title: vol.title,
    children: chapters.value
      .filter(ch => ch.volumeId === vol.id)
      .map(ch => ({
        id: ch.id,
        title: ch.title
      }))
  }))
})

// ==================== 方法 ====================

/**
 * 格式化数字
 */
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

/**
 * 格式化日期
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN')
}

/**
 * 获取状态类型
 */
function getStatusType(status) {
  const map = {
    todo: 'info',
    outline: '',
    generating: 'warning',
    draft: '',
    reviewing: 'warning',
    revision: 'danger',
    completed: 'success'
  }
  return map[status] || 'info'
}

/**
 * 获取状态标签
 */
function getStatusLabel(status) {
  const map = {
    todo: '待写',
    outline: '有大纲',
    generating: '生成中',
    draft: '初稿',
    reviewing: '审核中',
    revision: '需修改',
    completed: '已完成'
  }
  return map[status] || status
}

/**
 * 获取热力图颜色
 */
function getHeatmapColor(count) {
  if (count === 0) return '#ebedf0'
  if (count < 500) return '#c6e48b'
  if (count < 1500) return '#7bc96f'
  if (count < 3000) return '#239a3b'
  return '#196127'
}

/**
 * 获取卷的章节数量
 */
function getVolumeChapterCount(volumeId) {
  return chapters.value.filter(ch => ch.volumeId === volumeId).length
}

/**
 * 获取卷的字数
 */
function getVolumeWordCount(volumeId) {
  return chapters.value
    .filter(ch => ch.volumeId === volumeId)
    .reduce((sum, ch) => sum + (ch.wordCount || 0), 0)
}

/**
 * 获取卷的章节列表
 */
function getVolumeChapters(volumeId) {
  return chapters.value
    .filter(ch => ch.volumeId === volumeId)
    .sort((a, b) => a.order - b.order)
}

/**
 * 获取卷名称
 */
function getVolumeName(volumeId) {
  const vol = volumes.value.find(v => v.id === volumeId)
  return vol?.title
}

/**
 * 创建项目
 */
function createProject() {
  if (!newProjectForm.title.trim()) {
    ElMessage.warning('请输入小说标题')
    return
  }
  
  const project = megaNovelEngine.createProject(newProjectForm)
  currentProject.value = project
  
  // 创建默认卷
  const defaultVolume = megaNovelEngine.addVolume({
    title: '第一卷',
    description: ''
  })
  volumes.value = megaNovelEngine.volumes
  
  showNewProjectDialog.value = false
  ElMessage.success('项目创建成功')
  
  // 重置表单
  Object.assign(newProjectForm, {
    title: '',
    genre: '',
    theme: '',
    intro: '',
    targetWords: 100000
  })
}

/**
 * 保存卷
 */
function saveVolume() {
  if (!volumeForm.title.trim()) {
    ElMessage.warning('请输入卷标题')
    return
  }
  
  if (editingVolume.value) {
    megaNovelEngine.updateVolume(editingVolume.value.id, volumeForm)
    ElMessage.success('卷已更新')
  } else {
    megaNovelEngine.addVolume(volumeForm)
    ElMessage.success('卷已添加')
  }
  
  volumes.value = megaNovelEngine.volumes
  showAddVolumeDialog.value = false
  editingVolume.value = null
  
  // 重置表单
  Object.assign(volumeForm, { title: '', description: '' })
}

/**
 * 编辑卷
 */
function editVolume(volume) {
  editingVolume.value = volume
  Object.assign(volumeForm, {
    title: volume.title,
    description: volume.description || ''
  })
  showAddVolumeDialog.value = true
}

/**
 * 删除卷
 */
function deleteVolume(volumeId) {
  ElMessageBox.confirm('删除卷将同时删除其中的所有章节，确定继续？', '确认删除', {
    type: 'warning'
  }).then(() => {
    megaNovelEngine.deleteVolume(volumeId)
    volumes.value = megaNovelEngine.volumes
    chapters.value = megaNovelEngine.chapters
    ElMessage.success('卷已删除')
  }).catch(() => {})
}

/**
 * 添加章节到卷
 */
function addChapterToVolume(volumeId) {
  chapterForm.volumeId = volumeId
  showAddChapterDialog.value = true
}

/**
 * 保存章节
 */
function saveChapter() {
  if (!chapterForm.title.trim()) {
    ElMessage.warning('请输入章节标题')
    return
  }
  
  megaNovelEngine.addChapter(chapterForm)
  chapters.value = megaNovelEngine.chapters
  
  showAddChapterDialog.value = false
  ElMessage.success('章节已添加')
  
  // 重置表单
  Object.assign(chapterForm, { volumeId: '', title: '', outline: '' })
}

/**
 * 编辑章节
 */
function editChapter(chapter) {
  editingChapter.value = { ...chapter }
  showEditChapterDialog.value = true
}

/**
 * 更新章节
 */
function updateChapter() {
  if (!editingChapter.value) return
  
  megaNovelEngine.updateChapter(editingChapter.value.id, editingChapter.value)
  chapters.value = megaNovelEngine.chapters
  
  showEditChapterDialog.value = false
  ElMessage.success('章节已更新')
}

/**
 * 删除章节
 */
function deleteChapter(chapterId) {
  ElMessageBox.confirm('确定删除该章节？', '确认删除', {
    type: 'warning'
  }).then(() => {
    megaNovelEngine.deleteChapter(chapterId)
    chapters.value = megaNovelEngine.chapters
    ElMessage.success('章节已删除')
  }).catch(() => {})
}

/**
 * 预览章节
 */
function previewChapter(chapter) {
  previewingChapter.value = chapter
  showPreviewDrawer.value = true
}

/**
 * 处理章节选择
 */
function handleChapterSelection(selection) {
  selectedChapters.value = selection
}

/**
 * 处理状态变更
 */
function handleStatusChange(chapter) {
  megaNovelEngine.updateChapter(chapter.id, { status: chapter.status })
  ElMessage.success('状态已更新')
}

/**
 * 生成单个章节
 */
async function generateSingleChapter(chapter) {
  try {
    ElMessage.info(`开始生成: ${chapter.title}`)
    const context = megaNovelEngine.buildChapterContext(chapter.id)
    await megaNovelEngine.generateChapterContent(chapter.id, context)
    chapters.value = megaNovelEngine.chapters
    ElMessage.success('章节生成完成')
  } catch (error) {
    ElMessage.error('生成失败: ' + error.message)
  }
}

/**
 * 检查章节质量
 */
async function checkChapterQuality(chapter) {
  try {
    const result = await megaNovelEngine.checkChapterQuality(chapter.id)
    chapters.value = megaNovelEngine.chapters
    
    if (result.result === 'pass') {
      ElMessage.success('质量检查通过')
    } else {
      ElMessage.warning(`发现 ${result.issues.length} 个问题`)
    }
  } catch (error) {
    ElMessage.error('检查失败: ' + error.message)
  }
}

/**
 * 开始批量生成
 */
async function startBatchGeneration() {
  let chapterIds = []
  
  if (generationConfig.rangeType === 'all') {
    chapterIds = chapters.value
      .filter(ch => ch.status === 'todo' || ch.status === 'outline')
      .map(ch => ch.id)
  } else if (generationConfig.rangeType === 'range') {
    chapterIds = chapters.value
      .slice(generationConfig.startChapter - 1, generationConfig.endChapter)
      .map(ch => ch.id)
  } else if (generationConfig.rangeType === 'selected') {
    chapterIds = selectedChapters.value.map(ch => ch.id)
  }
  
  if (chapterIds.length === 0) {
    ElMessage.warning('没有可生成的章节')
    return
  }
  
  isGenerating.value = true
  generationProgress.total = chapterIds.length
  generationProgress.completed = 0
  generationProgress.percentage = 0
  
  // 初始化队列
  generationQueue.value = chapterIds.map(id => {
    const ch = chapters.value.find(c => c.id === id)
    return {
      chapterId: id,
      chapterTitle: ch?.title || '',
      status: 'pending'
    }
  })
  
  try {
    await megaNovelEngine.batchGenerateChapters(chapterIds, {
      autoRewrite: generationConfig.autoRewrite,
      stopOnError: false
    })
    
    chapters.value = megaNovelEngine.chapters
    ElMessage.success('批量生成完成')
  } catch (error) {
    ElMessage.error('生成中断: ' + error.message)
  } finally {
    isGenerating.value = false
  }
}

/**
 * 停止生成
 */
function stopGeneration() {
  // 实现停止逻辑
  isGenerating.value = false
  ElMessage.info('生成已停止')
}

/**
 * 获取队列状态类型
 */
function getQueueStatusType(status) {
  const map = {
    pending: 'info',
    generating: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return map[status] || 'info'
}

/**
 * 获取队列状态标签
 */
function getQueueStatusLabel(status) {
  const map = {
    pending: '等待中',
    generating: '生成中',
    completed: '已完成',
    failed: '失败'
  }
  return map[status] || status
}

/**
 * 选择上下文章节
 */
function handleContextChapterSelect(data) {
  if (data.children) return // 跳过卷节点
  
  const chapter = chapters.value.find(ch => ch.id === data.id)
  if (chapter) {
    selectedContextChapter.value = chapter
    refreshContext()
  }
}

/**
 * 刷新上下文
 */
function refreshContext() {
  if (!selectedContextChapter.value) return
  
  const context = megaNovelEngine.buildChapterContext(selectedContextChapter.value.id)
  if (context) {
    Object.assign(chapterContext, context)
  }
}

/**
 * 运行全面质量检查
 */
async function runFullQualityCheck() {
  isCheckingQuality.value = true
  qualityIssues.value = []
  
  try {
    for (const chapter of chapters.value) {
      if (chapter.content) {
        const result = await megaNovelEngine.checkChapterQuality(chapter.id)
        result.issues.forEach(issue => {
          qualityIssues.value.push({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            type: issue.type,
            message: issue.message
          })
        })
      }
    }
    
    chapters.value = megaNovelEngine.chapters
    reviewQueue.value = megaNovelEngine.reviewQueue
    
    ElMessage.success(`检查完成，发现 ${qualityIssues.value.length} 个问题`)
  } catch (error) {
    ElMessage.error('检查失败: ' + error.message)
  } finally {
    isCheckingQuality.value = false
  }
}

/**
 * 修复问题
 */
async function fixIssue(issue) {
  try {
    await megaNovelEngine.rewriteChapter(issue.chapterId, [{ type: issue.type, message: issue.message }])
    chapters.value = megaNovelEngine.chapters
    qualityIssues.value = qualityIssues.value.filter(i => i !== issue)
    ElMessage.success('已修复')
  } catch (error) {
    ElMessage.error('修复失败: ' + error.message)
  }
}

/**
 * 从问题重写章节
 */
async function rewriteChapterFromIssue(issue) {
  const chapter = chapters.value.find(ch => ch.id === issue.chapterId)
  if (chapter) {
    await generateSingleChapter(chapter)
  }
}

/**
 * 获取问题类型标签
 */
function getIssueTypeTag(type) {
  const map = {
    length: 'warning',
    dialogue: 'info',
    coherence: 'danger',
    character: 'warning',
    style: ''
  }
  return map[type] || 'info'
}

/**
 * 导出项目
 */
function handleExportProject() {
  const json = megaNovelEngine.exportProject()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentProject.value?.title || '小说项目'}_${new Date().toLocaleDateString()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('项目已导出')
}

/**
 * 导入项目
 */
function handleImportProject() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const success = megaNovelEngine.importProject(event.target.result)
      if (success) {
        currentProject.value = megaNovelEngine.currentProject
        volumes.value = megaNovelEngine.volumes
        chapters.value = megaNovelEngine.chapters
        ElMessage.success('项目导入成功')
      } else {
        ElMessage.error('项目导入失败')
      }
    }
    reader.readAsText(file)
  }
  
  input.click()
}

/**
 * 导出质量报告
 */
function exportQualityReport() {
  let report = `# 质量检查报告\n\n`
  report += `生成时间: ${new Date().toLocaleString()}\n\n`
  report += `## 问题列表\n\n`
  
  qualityIssues.value.forEach(issue => {
    report += `- **${issue.chapterTitle}** [${issue.type}]: ${issue.message}\n`
  })
  
  const blob = new Blob([report], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `质量检查报告_${new Date().toLocaleDateString()}.md`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('报告已导出')
}

/**
 * 批量添加章节
 */
function handleBatchAddChapters() {
  ElMessage.info('请使用"卷管理"中的"批量生成大纲"功能')
}

/**
 * 批量生成
 */
function handleBatchGenerate() {
  if (selectedChapters.value.length === 0) {
    ElMessage.warning('请先选择章节')
    return
  }
  activeTab.value = 'generation'
  generationConfig.rangeType = 'selected'
}

/**
 * 批量修改状态
 */
function handleBatchStatusChange() {
  ElMessage.info('请在章节列表中直接修改状态')
}

/**
 * 打开审核对话框
 */
function openReviewDialog(item) {
  const chapter = chapters.value.find(ch => ch.id === item.chapterId)
  if (chapter) {
    editChapter(chapter)
  }
}

/**
 * 批量生成大纲
 */
async function handleGenerateAllOutlines() {
  if (volumes.value.length === 0) {
    ElMessage.warning('请先添加卷')
    return
  }
  
  isGeneratingOutlines.value = true
  
  try {
    for (const volume of volumes.value) {
      await megaNovelEngine.generateVolumeOutline(volume.id, { chapterCount: 10 })
    }
    chapters.value = megaNovelEngine.chapters
    ElMessage.success('大纲生成完成')
  } catch (error) {
    ElMessage.error('大纲生成失败: ' + error.message)
  } finally {
    isGeneratingOutlines.value = false
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始化数据
  volumes.value = megaNovelEngine.volumes
  chapters.value = megaNovelEngine.chapters
  currentProject.value = megaNovelEngine.currentProject
  
  // 如果没有项目，显示新建对话框
  if (!currentProject.value) {
    // 加载示例数据
    loadDemoData()
  }
})

/**
 * 加载示例数据
 */
function loadDemoData() {
  // 创建示例项目
  currentProject.value = {
    id: 'demo-project',
    title: '示例小说：命运之旅',
    genre: '玄幻',
    theme: '成长与命运',
    intro: '一个少年踏上寻找真相的旅程，最终成长为改变世界的英雄。',
    targetWords: 100000,
    createdAt: new Date().toISOString()
  }
  
  megaNovelEngine.currentProject = currentProject.value
  
  // 创建示例卷
  volumes.value = [
    { id: 'vol1', title: '第一卷：起源', description: '主角的觉醒与出发', order: 0 },
    { id: 'vol2', title: '第二卷：成长', description: '历练与蜕变', order: 1 },
    { id: 'vol3', title: '第三卷：高潮', description: '最终对决', order: 2 }
  ]
  megaNovelEngine.volumes = volumes.value
  
  // 创建示例章节
  chapters.value = [
    { id: 'ch1', volumeId: 'vol1', title: '第一章 命运的起点', outline: '主角发现神秘信件', content: '示例内容...', wordCount: 3200, status: 'completed', order: 0 },
    { id: 'ch2', volumeId: 'vol1', title: '第二章 暗流涌动', outline: '反派阴谋开始', content: '', wordCount: 0, status: 'outline', order: 1 },
    { id: 'ch3', volumeId: 'vol1', title: '第三章 意外相遇', outline: '主角遇到命中注定的人', content: '', wordCount: 0, status: 'todo', order: 2 },
    { id: 'ch4', volumeId: 'vol2', title: '第四章 真相浮现', outline: '发现父亲的真实身份', content: '', wordCount: 0, status: 'todo', order: 3 },
    { id: 'ch5', volumeId: 'vol2', title: '第五章 危机四伏', outline: '陷入困境', content: '', wordCount: 0, status: 'todo', order: 4 },
    { id: 'ch6', volumeId: 'vol3', title: '第六章 最终对决', outline: '与反派的决战', content: '', wordCount: 0, status: 'todo', order: 5 }
  ]
  megaNovelEngine.chapters = chapters.value
  
  // 设置进度
  megaNovelEngine.progress.totalWords = 3200
  megaNovelEngine.progress.targetWords = 100000
  megaNovelEngine.progress.totalChapters = 6
  megaNovelEngine.progress.completedChapters = 1
  
  // 设置每日写作数据
  const today = new Date().toLocaleDateString()
  megaNovelEngine.progress.dailyWords = {
    [today]: 1500
  }
}
</script>

<style scoped>
/* 页面容器 */
.mega-novel-manager {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.header-right {
  display: flex;
  gap: 8px;
}

/* 主标签页 */
.main-tabs {
  min-height: calc(100vh - 120px);
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 进度卡片 */
.progress-card {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 14px;
  color: #606266;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
}

/* 热力图 */
.heatmap-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.heatmap-legend {
  display: flex;
  gap: 4px;
}

.legend-item {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.heatmap-container {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
}

/* 图表卡片 */
.chart-card {
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 工具栏 */
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
}

/* 卷折叠面板 */
.volume-collapse {
  border: none;
}

.volume-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-name {
  font-weight: 600;
  font-size: 15px;
}

.volume-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

/* 章节表格 */
.chapter-title-cell {
  cursor: pointer;
  color: var(--primary-color, #409eff);
}

.chapter-title-cell:hover {
  text-decoration: underline;
}

/* 批量操作 */
.batch-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 4px;
  margin-top: 12px;
}

/* 生成配置 */
.generation-content {
  padding: 16px 0;
}

.generation-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-hint {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

/* 进度显示 */
.progress-display {
  padding: 16px 0;
}

.progress-info {
  margin-top: 16px;
  font-size: 14px;
  color: #606266;
}

.progress-info p {
  margin: 8px 0;
}

.generation-queue {
  margin-top: 20px;
}

.generation-queue h4 {
  margin-bottom: 12px;
  font-size: 14px;
  color: #303133;
}

/* 上下文 */
.context-content {
  padding: 16px 0;
}

.context-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.context-section {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
  min-height: 200px;
}

.summary-item,
.character-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.summary-item h5,
.character-item h5 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #303133;
}

.character-state {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.character-state span {
  font-size: 12px;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.token-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 质量检查 */
.quality-content {
  padding: 16px 0;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.review-item:hover {
  background: #ebedf0;
}

.review-title {
  font-size: 14px;
  color: #303133;
}

/* 章节预览 */
.chapter-preview h3 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #303133;
}

.preview-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #909399;
}

.preview-content {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 15px;
  color: #303133;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-row .el-col {
    margin-bottom: 12px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

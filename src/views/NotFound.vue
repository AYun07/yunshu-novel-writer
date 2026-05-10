<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h2>页面不存在</h2>
      <p>你访问的页面不存在或已被移除</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-color, #f5f7fa);
}
.not-found-content {
  text-align: center;
}
.error-code {
  font-size: 120px;
  font-weight: bold;
  color: var(--el-color-primary, #409eff);
  line-height: 1;
}
h2 {
  margin: 16px 0 8px;
  color: var(--text-color, #303133);
}
p {
  color: var(--text-color-secondary, #909399);
  margin-bottom: 24px;
}
</style>

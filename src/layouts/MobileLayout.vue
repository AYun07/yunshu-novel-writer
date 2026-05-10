<template>
  <div class="mobile-layout">
    <!-- 移动端路由视图 -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
/**
 * 移动端布局组件
 * 提供移动端路由视图和缓存控制
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/**
 * 需要缓存的视图
 */
const cachedViews = computed(() => {
  // 根据路由 meta.keepAlive 决定是否缓存
  return []
})
</script>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  background: #f5f7fa;
}
</style>

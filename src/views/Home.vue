<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 flex items-center justify-center">
      <h1 class="text-lg font-medium text-gray-900">原型导航</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <div class="grid grid-cols-2 gap-4">
        <!-- 产品询价模块入口 -->
        <router-link
          to="/inquiries"
          class="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center justify-center text-center active:bg-gray-100 transition-colors"
        >
          <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span class="text-gray-800 font-medium">产品询价</span>
        </router-link>

        <!-- 添加新模块占位 -->
        <div class="bg-gray-100/50 rounded-xl border border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-center">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="text-gray-400 text-sm">更多模块敬请期待</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 首页逻辑
</script>

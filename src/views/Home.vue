<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="pt-10 pb-6 px-5">
      <h1 class="text-2xl font-bold text-gray-800">应用工作台</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="grid grid-cols-2 gap-4 px-5">
        <!-- 产品询价模块入口 -->
        <router-link
          to="/inquiries"
          class="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-start active:scale-[0.98] transition-transform"
        >
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span class="text-gray-800 font-medium">产品询价</span>
        </router-link>

        <!-- 敬请期待占位模块 -->
        <div class="bg-gray-100/50 rounded-2xl p-5 flex flex-col items-start opacity-60">
          <div class="w-12 h-12 rounded-xl bg-gray-200/50 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span class="text-gray-400 font-medium">敬请期待</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// 应用工作台首页逻辑
</script>

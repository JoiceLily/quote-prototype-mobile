<script setup lang="ts">
import { useRouter } from 'vue-router'
import { statusOptions, formatMoney } from '../utils/productInquiry'
import { useProductInquiryStore } from '../stores/productInquiry'

const router = useRouter()
const store = useProductInquiryStore()

const openCreate = () => {
  router.push({ name: 'ProductInquiryCreate' })
}

const openDetail = (id: number) => {
  router.push({ name: 'ProductInquiryDetail', params: { id } })
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case '未提交':
    case '取消上线':
      return 'bg-gray-100 text-gray-600'
    case '待处理':
    case '开始处理':
      return 'bg-blue-50 text-blue-600'
    case '审批中':
      return 'bg-purple-50 text-purple-600'
    case '待确认':
      return 'bg-orange-50 text-orange-600'
    case '处理完毕':
      return 'bg-green-50 text-green-600'
    case '已驳回':
      return 'bg-red-50 text-red-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>

<template>
  <main class="min-h-svh bg-slate-50 pb-24">
    <!-- Top Stats -->
    <section class="px-4 pt-4 pb-2">
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <span class="block text-xs font-medium text-slate-500 mb-1">我的询价</span>
          <strong class="block text-2xl font-bold text-slate-900">{{ store.inquiries.value.length }}</strong>
        </div>
        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <span class="block text-xs font-medium text-slate-500 mb-1">待确认</span>
          <strong class="block text-2xl font-bold text-orange-600">{{ store.waitingCount.value }}</strong>
        </div>
        <div class="rounded-2xl bg-white p-4 shadow-sm">
          <span class="block text-xs font-medium text-slate-500 mb-1">已驳回</span>
          <strong class="block text-2xl font-bold text-red-600">{{ store.rejectCount.value }}</strong>
        </div>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="px-4 py-2 sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md">
      <div class="flex items-center gap-2 mb-3">
        <van-search
          v-model="store.filters.productName"
          placeholder="搜索产品名称"
          shape="round"
          background="transparent"
          class="!p-0 flex-1 [&_.van-search__content]:bg-white [&_.van-search__content]:shadow-sm"
        />
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide [-webkit-overflow-scrolling:touch]">
        <button
          v-for="item in statusOptions"
          :key="item.value"
          type="button"
          class="shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
          :class="
            store.filters.status === item.value
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 shadow-sm'
          "
          @click="store.filters.status = item.value"
        >
          {{ item.text }}
        </button>
      </div>
    </section>

    <!-- List -->
    <section class="px-4 py-2">
      <van-empty v-if="!store.filteredInquiries.value.length" description="没有找到相关的询价记录" />

      <article
        v-for="item in store.filteredInquiries.value"
        :key="item.id"
        class="mb-3 rounded-2xl bg-white p-4 shadow-sm active:scale-[0.98] transition-transform"
        @click="openDetail(item.id)"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <h2 class="text-base font-bold text-slate-900 leading-tight">{{ item.productName }}</h2>
          <span class="shrink-0 rounded-md px-2 py-1 text-[11px] font-bold" :class="getStatusStyle(item.status)">
            {{ item.status }}
          </span>
        </div>
        
        <div class="space-y-1.5 mb-3">
          <div class="flex items-center text-[13px]">
            <span class="text-slate-400 w-16 shrink-0">客户名称</span>
            <span class="text-slate-700 truncate font-medium">{{ item.customerName }}</span>
          </div>
          <div class="flex items-center text-[13px]">
            <span class="text-slate-400 w-16 shrink-0">商机名称</span>
            <span class="text-slate-700 truncate font-medium">{{ item.opportunityName }}</span>
          </div>
        </div>

        <div v-if="item.status === '已驳回'" class="mb-3 rounded-xl bg-red-50 p-3 text-[13px] text-red-700 font-medium">
          驳回原因：{{ item.rejectReason }}
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div class="flex items-baseline gap-3">
            <div>
              <span class="text-[11px] text-slate-400 font-normal mr-1">单价</span>
              <span class="text-[14px] font-bold text-slate-900">{{ formatMoney(item.implementationUnitPrice) }}</span>
            </div>
            <div class="w-px h-3 bg-slate-200"></div>
            <div>
              <span class="text-[11px] text-slate-400 font-normal mr-1">数量</span>
              <span class="text-[13px] font-bold text-slate-900">{{ item.inquiryQuantity }}<span class="text-[11px] font-normal text-slate-500 ml-0.5">{{ item.unitName }}</span></span>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 font-medium shrink-0 ml-2">{{ item.updatedAt }}</span>
        </div>
      </article>
    </section>

    <!-- FAB -->
    <button
      class="fixed bottom-8 right-6 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-95 transition-transform"
      @click="openCreate"
    >
      <van-icon name="plus" size="24" />
    </button>
  </main>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

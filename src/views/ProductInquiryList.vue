<script setup lang="ts">
import { useRouter } from 'vue-router'
import { statusOptions, statusType } from '../utils/productInquiry'
import { useProductInquiryStore } from '../stores/productInquiry'

const router = useRouter()
const store = useProductInquiryStore()

const openCreate = () => {
  router.push({ name: 'ProductInquiryCreate' })
}

const openDetail = (id: number) => {
  router.push({ name: 'ProductInquiryDetail', params: { id } })
}
</script>

<template>
  <main
    class="mobile-shell min-h-svh bg-app pb-24 [background:linear-gradient(180deg,rgba(22,119,255,0.08),rgba(245,247,251,0)_210px),#f5f7fb]"
  >
    <section class="grid grid-cols-3 gap-2.5 px-3.5 pb-1.5 pt-3.5 max-[360px]:gap-1.5 max-[360px]:px-2.5">
      <div class="min-w-0 rounded-lg border border-blue-500/10 bg-white/85 px-2.5 py-3 shadow-sm max-[360px]:px-2 max-[360px]:py-2.5">
        <span class="mb-1 block text-xs leading-tight text-muted">我的询价</span>
        <strong class="block text-[22px] leading-none text-slate-900">{{ store.inquiries.value.length }}</strong>
      </div>
      <div class="min-w-0 rounded-lg border border-blue-500/10 bg-white/85 px-2.5 py-3 shadow-sm max-[360px]:px-2 max-[360px]:py-2.5">
        <span class="mb-1 block text-xs leading-tight text-muted">待补充</span>
        <strong class="block text-[22px] leading-none text-slate-900">{{ store.todoCount.value }}</strong>
      </div>
      <div class="min-w-0 rounded-lg border border-blue-500/10 bg-white/85 px-2.5 py-3 shadow-sm max-[360px]:px-2 max-[360px]:py-2.5">
        <span class="mb-1 block text-xs leading-tight text-muted">待确认</span>
        <strong class="block text-[22px] leading-none text-slate-900">{{ store.waitingCount.value }}</strong>
      </div>
    </section>

    <section class="mx-3.5 mt-3 rounded-lg border border-line bg-white/95 p-3 shadow-sm">
      <van-search
        v-model="store.filters.productName"
        placeholder="搜索产品名称"
        shape="round"
        background="transparent"
      />
      <div class="mt-2 flex gap-2 overflow-x-auto px-1 pb-0.5 [-webkit-overflow-scrolling:touch]">
        <button
          v-for="item in statusOptions"
          :key="item.value"
          type="button"
          class="shrink-0 rounded-full border px-3 py-1.5 text-xs leading-none transition"
          :class="
            store.filters.status === item.value
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-slate-200 bg-slate-50 text-slate-600'
          "
          @click="store.filters.status = item.value"
        >
          {{ item.text }}
        </button>
        <button
          v-if="store.filters.productName || store.filters.status !== 'all'"
          type="button"
          class="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs leading-none text-slate-500"
          @click="store.resetFilters"
        >
          重置
        </button>
      </div>
    </section>

    <section class="px-3.5 py-3.5">
      <div class="mb-2.5 flex items-center justify-between text-[15px] font-bold text-slate-900">
        <span>产品询价管理</span>
        <small class="text-xs font-medium text-muted">{{ store.filteredInquiries.value.length }} 条</small>
      </div>

      <van-empty v-if="!store.filteredInquiries.value.length" description="没有匹配的产品询价" />

      <article
        v-for="item in store.filteredInquiries.value"
        :key="item.id"
        class="mb-2.5 rounded-lg border border-line bg-white p-3.5 shadow-sm"
        @click="openDetail(item.id)"
      >
        <div class="card-head flex items-start justify-between gap-2.5">
          <h2>{{ item.productName }}</h2>
          <van-tag :type="statusType(item.status)" round>{{ item.status }}</van-tag>
        </div>
        <div class="card-meta mt-2 grid gap-1 text-[13px] leading-snug text-muted">
          <span>{{ item.customerName }}</span>
          <span>{{ item.opportunityName }}</span>
        </div>
        <div v-if="item.status === '已驳回'" class="mt-2.5 rounded-lg bg-red-50 px-2.5 py-2 text-xs leading-snug text-red-700">
          {{ item.rejectReason }}
        </div>
        <div class="card-bottom mt-3 flex items-center justify-between gap-2.5 text-xs text-slate-600">
          <span>数量 {{ item.inquiryQuantity }} {{ item.unitName }}</span>
          <span>{{ item.updatedAt }}</span>
        </div>
      </article>
    </section>

    <div class="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-line bg-white/95 px-3 py-2.5 shadow-mobile backdrop-blur-xl [padding-bottom:calc(10px+env(safe-area-inset-bottom))]">
      <van-button block type="primary" icon="plus" @click="openCreate">新建询价</van-button>
    </div>
  </main>
</template>

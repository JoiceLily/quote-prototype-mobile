<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useProductInquiryStore } from '../stores/productInquiry'
import {
  canEdit,
  canSubmit,
  canWithdraw,
  formatMoney,
  getProductTypeLabel,
} from '../utils/productInquiry'

const route = useRoute()
const router = useRouter()
const store = useProductInquiryStore()

const inquiryId = computed(() => Number(route.params.id))
const inquiry = computed(() => store.findInquiry(inquiryId.value))
const hasActions = computed(() => {
  if (!inquiry.value) return false
  return canEdit(inquiry.value) || canSubmit(inquiry.value) || canWithdraw(inquiry.value)
})

const openEdit = () => {
  if (!inquiry.value) return
  if (!canEdit(inquiry.value)) {
    showToast('当前状态主要用于查看，不建议编辑')
    return
  }
  router.push({
    name: 'ProductInquiryEdit',
    params: { id: inquiry.value.id },
    query: { source: 'detail' },
  })
}

const changeStatus = async (action: 'submit' | 'withdraw') => {
  if (!inquiry.value) return
  const isWithdraw = action === 'withdraw'
  try {
    await showConfirmDialog({
      title: isWithdraw ? '确认撤回询价？' : '确认提交询价？',
      message: isWithdraw ? '撤回后状态将回到未提交。' : '提交后将进入待确认状态。',
      confirmButtonText: isWithdraw ? '撤回' : '提交',
      confirmButtonColor: isWithdraw ? '#f97316' : '#2563eb'
    })
  } catch {
    return
  }
  if (isWithdraw) {
    store.withdrawInquiry(inquiry.value.id)
    showToast('已撤回')
    return
  }
  store.submitInquiry(inquiry.value.id)
  showToast('已提交')
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
  <main class="min-h-svh bg-slate-50 pb-6" :class="{ '[padding-bottom:calc(100px+env(safe-area-inset-bottom))]': hasActions }">
    <van-empty v-if="!inquiry" description="未找到该产品询价" />

    <template v-else>
      <!-- Hero Section -->
      <section class="bg-white px-5 pt-8 pb-6 mb-3 rounded-b-3xl shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <span class="rounded-md px-2 py-1 text-[11px] font-bold" :class="getStatusStyle(inquiry.status)">
            {{ inquiry.status }}
          </span>
          <span class="text-xs font-medium text-slate-400">{{ inquiry.updatedAt }}</span>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 leading-tight">{{ inquiry.productName }}</h1>
      </section>

      <div class="px-4 space-y-4">
        <!-- Reject Reason -->
        <div v-if="inquiry.status === '已驳回'" class="rounded-2xl bg-red-50 p-4 shadow-sm flex gap-3 items-start">
          <van-icon name="warning" class="text-red-500 text-lg mt-0.5" />
          <div>
            <h3 class="text-sm font-bold text-red-800 mb-1">驳回原因</h3>
            <p class="text-[13px] text-red-700 leading-relaxed">{{ inquiry.rejectReason }}</p>
          </div>
        </div>

        <!-- Inquiry Info Card -->
        <section class="rounded-2xl bg-white p-5 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="w-1 h-3.5 bg-blue-600 rounded-full mr-2"></div>
            <h2 class="text-sm font-semibold text-gray-800">询价信息</h2>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">客户名称</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.customerName }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">商机名称</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.opportunityName }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">关联销售</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.salesUserName }}</span>
            </div>
            
            <div class="h-px bg-slate-100 my-2"></div>
            
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">询价数量</span>
              <span class="text-[14px] font-bold text-slate-900 text-right">{{ inquiry.inquiryQuantity }} <span class="font-normal text-slate-500 text-xs">{{ inquiry.unitName }}</span></span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">实施单价</span>
              <span class="text-[14px] font-bold text-slate-900 text-right">{{ formatMoney(inquiry.implementationUnitPrice) }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">限价</span>
              <span class="text-[14px] font-bold text-slate-900 text-right">{{ formatMoney(inquiry.limitPrice) || '-' }}</span>
            </div>
            
            <div v-if="inquiry.inquiryRemark" class="mt-4 rounded-xl bg-slate-50 p-4 text-[13px] leading-relaxed text-slate-700">
              <div class="text-xs font-bold text-slate-400 mb-1">备注</div>
              {{ inquiry.inquiryRemark }}
            </div>
          </div>
        </section>

        <!-- Product Info Card -->
        <section class="rounded-2xl bg-white p-5 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="w-1 h-3.5 bg-blue-600 rounded-full mr-2"></div>
            <h2 class="text-sm font-semibold text-gray-800">预备产品信息</h2>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">渠道</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.productChannel }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">分类</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.productCategory }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">型号</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.productModel || '-' }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">类型</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ getProductTypeLabel(inquiry.productType) || '-' }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">品牌</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.brandName || '-' }}</span>
            </div>
            <div class="flex justify-between items-start gap-4">
              <span class="text-[14px] text-slate-500 shrink-0">保修期</span>
              <span class="text-[14px] font-semibold text-slate-900 text-right">{{ inquiry.warrantyPeriod }}</span>
            </div>
            
            <div v-if="inquiry.specParams" class="mt-4 rounded-xl bg-slate-50 p-4 text-[13px] leading-relaxed text-slate-700">
              <div class="text-xs font-bold text-slate-400 mb-1">规格参数</div>
              {{ inquiry.specParams }}
            </div>
          </div>
        </section>
      </div>

      <!-- Action Bar -->
      <div
        v-if="hasActions"
        class="fixed inset-x-0 bottom-0 z-20 flex gap-3 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
      >
        <button
          v-if="canEdit(inquiry)"
          class="flex-1 rounded-full bg-blue-50 py-3.5 text-[15px] font-bold text-blue-600 transition-transform active:scale-95"
          @click="openEdit"
        >
          编辑
        </button>
        <button
          v-if="canSubmit(inquiry)"
          class="flex-1 rounded-full bg-blue-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
          @click="changeStatus('submit')"
        >
          提交
        </button>
        <button
          v-if="canWithdraw(inquiry)"
          class="flex-1 rounded-full bg-orange-100 py-3.5 text-[15px] font-bold text-orange-600 transition-transform active:scale-95"
          @click="changeStatus('withdraw')"
        >
          撤回
        </button>
      </div>
    </template>
  </main>
</template>

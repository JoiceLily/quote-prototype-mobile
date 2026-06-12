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
  statusType,
} from '../utils/productInquiry'

const route = useRoute()
const router = useRouter()
const store = useProductInquiryStore()

const inquiryId = computed(() => Number(route.params.id))
const inquiry = computed(() => store.findInquiry(inquiryId.value))
const hasActions = computed(() => canEdit(inquiry.value) || canSubmit(inquiry.value) || canWithdraw(inquiry.value))

const openEdit = () => {
  if (!inquiry.value) {
    return
  }

  if (!canEdit(inquiry.value)) {
    showToast('当前状态主要用于查看，不建议编辑')
    return
  }

  router.push({ name: 'ProductInquiryEdit', params: { id: inquiry.value.id } })
}

const changeStatus = async (action: 'submit' | 'withdraw') => {
  if (!inquiry.value) {
    return
  }

  const isWithdraw = action === 'withdraw'
  try {
    await showConfirmDialog({
      title: isWithdraw ? '确认撤回询价？' : '确认提交询价？',
      message: isWithdraw ? '撤回后状态将回到未提交。' : '提交后将进入待确认状态。',
      confirmButtonText: isWithdraw ? '撤回' : '提交',
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
</script>

<template>
  <main class="detail-page min-h-svh bg-app" :class="{ 'pb-24': hasActions }">
    <van-empty v-if="!inquiry" description="未找到该产品询价" />

    <template v-else>
      <section class="detail-hero flex items-start justify-between gap-3.5 border-b border-line bg-white px-4 py-[18px]">
        <div>
          <span>当前状态</span>
          <h1>{{ inquiry.productName }}</h1>
        </div>
        <van-tag :type="statusType(inquiry.status)" size="large" round>
          {{ inquiry.status }}
        </van-tag>
      </section>

      <van-notice-bar
        v-if="inquiry.status === '已驳回'"
        left-icon="warning-o"
        color="#b42318"
        background="#fff1f0"
        :text="inquiry.rejectReason"
      />

      <section class="detail-block m-3 rounded-lg border border-line bg-white p-3.5">
        <h2>询价信息</h2>
        <div class="info-grid grid grid-cols-2 gap-2.5 max-[360px]:grid-cols-1">
          <div class="min-w-0 rounded-lg bg-slate-50 p-2.5"><span>客户名称</span><strong>{{ inquiry.customerName }}</strong></div>
          <div class="min-w-0 rounded-lg bg-slate-50 p-2.5"><span>商机名称</span><strong>{{ inquiry.opportunityName }}</strong></div>
          <div class="min-w-0 rounded-lg bg-slate-50 p-2.5"><span>关联销售</span><strong>{{ inquiry.salesUserName }}</strong></div>
          <div class="min-w-0 rounded-lg bg-slate-50 p-2.5"><span>询价数量</span><strong>{{ inquiry.inquiryQuantity }} {{ inquiry.unitName }}</strong></div>
          <div class="min-w-0 rounded-lg bg-slate-50 p-2.5"><span>实施单价</span><strong>{{ formatMoney(inquiry.implementationUnitPrice) }}</strong></div>
          <div class="min-w-0 rounded-lg bg-slate-50 p-2.5"><span>限价</span><strong>{{ formatMoney(inquiry.limitPrice) }}</strong></div>
        </div>
        <div class="remark-box mt-3 overflow-wrap-anywhere rounded-lg bg-slate-50 p-2.5 text-sm leading-relaxed text-slate-700">
          {{ inquiry.inquiryRemark || '暂无备注' }}
        </div>
      </section>

      <section class="detail-block m-3 rounded-lg border border-line bg-white p-3.5">
        <h2>产品预备信息</h2>
        <van-cell title="产品名称" :value="inquiry.productName" />
        <van-cell title="渠道" :value="inquiry.productChannel" />
        <van-cell title="分类" :value="inquiry.productCategory" />
        <van-cell title="型号" :value="inquiry.productModel || '-'" />
        <van-cell title="类型" :value="getProductTypeLabel(inquiry.productType)" />
        <van-cell title="品牌" :value="inquiry.brandName || '-'" />
        <van-cell title="单位" :value="inquiry.unitName" />
        <van-cell title="保修期" :value="inquiry.warrantyPeriod" />
        <div class="spec-box mt-3 rounded-lg bg-slate-50 p-2.5 text-sm leading-relaxed text-slate-700">
          <span>规格参数</span>
          <p>{{ inquiry.specParams || '暂无规格参数' }}</p>
        </div>
      </section>

      <div
        v-if="hasActions"
        class="detail-actions fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[430px] grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2.5 border-t border-line bg-white/95 px-3 py-2.5 shadow-mobile backdrop-blur-xl [padding-bottom:calc(10px+env(safe-area-inset-bottom))]"
      >
        <van-button v-if="canEdit(inquiry)" plain type="primary" @click="openEdit">编辑</van-button>
        <van-button v-if="canSubmit(inquiry)" type="success" @click="changeStatus('submit')">
          提交
        </van-button>
        <van-button v-if="canWithdraw(inquiry)" type="warning" @click="changeStatus('withdraw')">
          撤回
        </van-button>
      </div>
    </template>
  </main>
</template>

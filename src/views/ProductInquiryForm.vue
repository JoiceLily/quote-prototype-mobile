<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useProductInquiryStore } from '../stores/productInquiry'
import type { ProductInquiryFormModel } from '../types/productInquiry'
import {
  canEdit,
  productChannelOptions,
  productTypeOptions,
  warrantyOptions,
} from '../utils/productInquiry'

const route = useRoute()
const router = useRouter()
const store = useProductInquiryStore()

const editingId = computed(() => {
  const value = Number(route.params.id)
  return Number.isFinite(value) && value > 0 ? value : null
})

const editingInquiry = computed(() => (editingId.value ? store.findInquiry(editingId.value) : null))
const form = reactive<ProductInquiryFormModel>(store.createEmptyForm())

// Progressive disclosure for extra info
const showMoreInfo = ref(false)

if (editingInquiry.value) {
  if (!canEdit(editingInquiry.value)) {
    showToast('当前状态主要用于查看，不建议编辑')
    router.replace({ name: 'ProductInquiryDetail', params: { id: editingInquiry.value.id } })
  } else {
    Object.assign(form, editingInquiry.value)
    if (form.productModel || form.productType || form.brandName || form.limitPrice || form.specParams) {
      showMoreInfo.value = true
    }
  }
}

const validateForm = () => {
  const requiredFields: Array<[keyof ProductInquiryFormModel, string]> = [
    ['customerName', '请输入客户名称'],
    ['opportunityName', '请输入商机名称'],
    ['productName', '请输入产品名称'],
    ['inquiryQuantity', '请输入询价数量'],
    ['implementationUnitPrice', '请输入实施单价'],
    ['productChannel', '请选择产品渠道'],
    ['productCategory', '请输入产品分类'],
    ['unitName', '请输入单位'],
    ['warrantyPeriod', '请输入保修期'],
    ['inquiryRemark', '请输入询价备注'],
  ]

  const invalid = requiredFields.find(([key]) => String(form[key] ?? '').trim() === '')
  if (invalid) {
    showToast(invalid[1])
    return false
  }

  if (Number(form.inquiryQuantity) < 1) {
    showToast('询价数量至少为 1')
    return false
  }

  if (Number(form.implementationUnitPrice) < 0) {
    showToast('实施单价不能小于 0')
    return false
  }

  return true
}

const buildPayload = (): ProductInquiryFormModel => ({
  ...form,
  inquiryQuantity: Number(form.inquiryQuantity),
  implementationUnitPrice: Number(form.implementationUnitPrice),
  limitPrice: form.limitPrice === '' ? '' : Number(form.limitPrice),
})

const saveInquiry = () => {
  if (!validateForm()) {
    return
  }

  if (editingId.value) {
    const updated = store.updateInquiry(editingId.value, buildPayload())
    if (!updated) {
      showToast('未找到该产品询价')
      return
    }

    showToast('询价信息已更新')
    router.replace({ name: 'ProductInquiryDetail', params: { id: updated.id } })
    return
  }

  const created = store.createInquiry(buildPayload())
  showToast('询价已新建')
  router.replace({ name: 'ProductInquiryDetail', params: { id: created.id } })
}
</script>

<template>
  <main class="min-h-svh bg-slate-50 [padding-bottom:calc(100px+env(safe-area-inset-bottom))]">
    <van-form class="px-4 pt-4 space-y-4" @submit="saveInquiry">
      
      <!-- 询价信息 Group -->
      <section class="rounded-2xl bg-white p-1 shadow-sm overflow-hidden">
        <div class="px-3 pt-3 pb-1 text-[13px] font-bold text-slate-400">询价信息</div>
        <van-cell-group :border="false" class="!bg-transparent">
          <van-field v-model="form.customerName" label="客户名称" placeholder="请输入" required input-align="right" :border="true" />
          <van-field v-model="form.opportunityName" label="商机名称" placeholder="请输入" required input-align="right" :border="true" />
          <van-field v-model.number="form.inquiryQuantity" label="询价数量" type="number" placeholder="0" required input-align="right" :border="true" />
          <van-field v-model.number="form.implementationUnitPrice" label="实施单价" type="number" placeholder="0.00" required input-align="right" :border="true" />
          <div class="px-4 py-3">
            <div class="text-[14px] text-slate-700 mb-2"><span class="text-red-500 mr-1">*</span>询价备注</div>
            <textarea
              v-model="form.inquiryRemark"
              rows="3"
              class="w-full rounded-xl bg-slate-50 p-3 text-[14px] text-slate-900 outline-none placeholder-slate-400 transition-colors focus:bg-blue-50/50"
              placeholder="请输入询价相关的背景、要求等..."
              maxlength="500"
            ></textarea>
            <div class="text-right text-[11px] text-slate-400 mt-1">{{ form.inquiryRemark?.length || 0 }}/500</div>
          </div>
        </van-cell-group>
      </section>

      <!-- 产品信息 Group -->
      <section class="rounded-2xl bg-white p-1 shadow-sm overflow-hidden">
        <div class="px-3 pt-3 pb-1 text-[13px] font-bold text-slate-400">产品预备信息</div>
        <van-cell-group :border="false" class="!bg-transparent">
          <van-field v-model="form.productName" label="产品名称" placeholder="请输入" required input-align="right" :border="true" />
          <van-field v-model="form.productCategory" label="产品分类" placeholder="请输入" required input-align="right" :border="true" />
          <van-field v-model="form.unitName" label="单位" placeholder="如：台 / 套" required input-align="right" :border="true" />
          
          <div class="px-4 py-3 border-b border-slate-100/60">
            <div class="text-[14px] text-slate-700 mb-2"><span class="text-red-500 mr-1">*</span>产品渠道</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in productChannelOptions" :key="item"
                type="button"
                class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
                :class="form.productChannel === item ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 active:bg-slate-100'"
                @click="form.productChannel = item"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div class="px-4 py-3">
            <div class="text-[14px] text-slate-700 mb-2"><span class="text-red-500 mr-1">*</span>保修期</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in warrantyOptions" :key="item"
                type="button"
                class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
                :class="form.warrantyPeriod === item ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 active:bg-slate-100'"
                @click="form.warrantyPeriod = item"
              >
                {{ item }}
              </button>
            </div>
          </div>
        </van-cell-group>
      </section>

      <!-- 更多信息 (Progressive Disclosure) -->
      <section class="rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300" :class="showMoreInfo ? 'p-1' : ''">
        <button
          v-if="!showMoreInfo"
          type="button"
          class="w-full py-4 flex items-center justify-center gap-1 text-[14px] font-medium text-blue-600 active:bg-slate-50"
          @click="showMoreInfo = true"
        >
          展开更多选填信息
          <van-icon name="arrow-down" />
        </button>

        <div v-else>
          <div class="px-3 pt-3 pb-1 text-[13px] font-bold text-slate-400 flex justify-between items-center">
            更多信息
            <van-icon name="arrow-up" class="text-slate-400 p-1 active:bg-slate-50 rounded" @click="showMoreInfo = false" />
          </div>
          <van-cell-group :border="false" class="!bg-transparent">
            <van-field v-model="form.productModel" label="产品型号" placeholder="选填" input-align="right" :border="true" />
            <van-field v-model="form.brandName" label="品牌" placeholder="选填" input-align="right" :border="true" />
            <van-field v-model.number="form.limitPrice" label="限价" type="number" placeholder="选填" input-align="right" :border="true" />
            
            <div class="px-4 py-3 border-b border-slate-100/60">
              <div class="text-[14px] text-slate-700 mb-2">产品类型</div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in productTypeOptions" :key="item.value"
                  type="button"
                  class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
                  :class="form.productType === item.value ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 active:bg-slate-100'"
                  @click="form.productType = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div class="px-4 py-3">
              <div class="text-[14px] text-slate-700 mb-2">规格参数</div>
              <textarea
                v-model="form.specParams"
                rows="3"
                class="w-full rounded-xl bg-slate-50 p-3 text-[14px] text-slate-900 outline-none placeholder-slate-400 transition-colors focus:bg-blue-50/50"
                placeholder="选填，请输入规格参数..."
                maxlength="1000"
              ></textarea>
              <div class="text-right text-[11px] text-slate-400 mt-1">{{ form.specParams?.length || 0 }}/1000</div>
            </div>
          </van-cell-group>
        </div>
      </section>

    </van-form>

    <!-- Action Bar -->
    <div class="fixed inset-x-0 bottom-0 z-20 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] bg-white/80 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <button
        class="w-full rounded-full bg-blue-600 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
        @click="saveInquiry"
      >
        {{ editingId ? '保存更改' : '提交询价' }}
      </button>
    </div>
  </main>
</template>

<style scoped>
/* Remove default vant borders inside card */
:deep(.van-cell:after) {
  border-bottom-color: rgba(241, 245, 249, 0.6) !important;
  left: 16px;
  right: 16px;
}
:deep(.van-cell) {
  padding: 16px;
  background: transparent;
}
:deep(.van-field__label) {
  color: #334155; /* slate-700 */
}
:deep(.van-field__control) {
  font-weight: 500;
  color: #0f172a; /* slate-900 */
}
:deep(.van-field__control::placeholder) {
  color: #94a3b8; /* slate-400 */
  font-weight: normal;
}
</style>

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
const moreOpen = ref<string[]>([])

if (editingInquiry.value) {
  if (!canEdit(editingInquiry.value)) {
    showToast('当前状态主要用于查看，不建议编辑')
    router.replace({ name: 'ProductInquiryDetail', params: { id: editingInquiry.value.id } })
  } else {
    Object.assign(form, editingInquiry.value)
    moreOpen.value =
      form.productModel || form.productType || form.brandName || form.limitPrice || form.specParams ? ['more'] : []
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
    router.push({ name: 'ProductInquiryDetail', params: { id: updated.id } })
    return
  }

  const created = store.createInquiry(buildPayload())
  showToast('询价已新建')
  router.push({ name: 'ProductInquiryDetail', params: { id: created.id } })
}
</script>

<template>
  <main class="form-page min-h-svh bg-app pb-24">
    <van-form class="mobile-form px-3 py-3" @submit="saveInquiry">
      <section class="mb-3 px-1 pt-1">
        <h1 class="m-0 text-xl font-extrabold leading-tight text-slate-900">产品询价</h1>
      </section>

      <section class="form-section mb-2.5 overflow-hidden rounded-lg border border-line bg-white">
        <h3>询价信息</h3>
        <van-field v-model="form.customerName" label="客户名称" placeholder="请输入客户名称" required />
        <van-field v-model="form.opportunityName" label="商机名称" placeholder="请输入商机名称" required />
        <van-field v-model.number="form.inquiryQuantity" label="询价数量" type="number" required />
        <van-field v-model.number="form.implementationUnitPrice" label="实施单价" type="number" required />
        <van-field
          v-model="form.inquiryRemark"
          label="询价备注"
          type="textarea"
          rows="3"
          maxlength="500"
          show-word-limit
          required
        />
      </section>

      <section class="form-section mb-2.5 overflow-hidden rounded-lg border border-line bg-white">
        <h3>预备产品信息</h3>
        <van-field v-model="form.productName" label="产品名称" placeholder="请输入产品名称" required />
        <van-field label="产品渠道" required>
          <template #input>
            <van-radio-group v-model="form.productChannel" direction="horizontal">
              <van-radio v-for="item in productChannelOptions" :key="item" :name="item">
                {{ item }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="form.productCategory" label="产品分类" placeholder="请输入产品分类" required />
        <van-field v-model="form.unitName" label="单位" placeholder="如 台 / 套 / 年" required />
        <van-field label="保修期" required>
          <template #input>
            <van-radio-group v-model="form.warrantyPeriod" direction="horizontal">
              <van-radio v-for="item in warrantyOptions" :key="item" :name="item">
                {{ item }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </section>

      <van-collapse v-model="moreOpen" class="more-collapse mb-2.5 overflow-hidden rounded-lg border border-line bg-white">
        <van-collapse-item name="more" title="更多信息">
          <van-field v-model="form.productModel" label="产品型号" placeholder="选填" />
          <van-field label="产品类型">
            <template #input>
              <van-radio-group v-model="form.productType" direction="horizontal">
                <van-radio v-for="item in productTypeOptions" :key="item.value" :name="item.value">
                  {{ item.label }}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field v-model="form.brandName" label="品牌" placeholder="选填" />
          <van-field v-model.number="form.limitPrice" label="限价" type="number" placeholder="选填" />
          <van-field
            v-model="form.specParams"
            label="规格参数"
            type="textarea"
            rows="3"
            maxlength="1000"
            show-word-limit
            placeholder="选填"
          />
        </van-collapse-item>
      </van-collapse>
    </van-form>

    <div class="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-line bg-white/95 px-3 py-2.5 shadow-mobile backdrop-blur-xl [padding-bottom:calc(10px+env(safe-area-inset-bottom))]">
      <van-button block type="primary" @click="saveInquiry">保存</van-button>
    </div>
  </main>
</template>

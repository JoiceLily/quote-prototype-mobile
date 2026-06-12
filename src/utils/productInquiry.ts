import type { ProductInquiry, ProductInquiryStatus } from '../types/productInquiry'

export const DEFAULT_STATUS: ProductInquiryStatus = '未提交'
export const WAITING_CONFIRM_STATUS: ProductInquiryStatus = '待确认'

export const SUBMITTABLE_STATUSES = new Set<ProductInquiryStatus>(['未提交', '已驳回', '取消上线'])
export const EDITABLE_STATUSES = new Set<ProductInquiryStatus>(['未提交', '已驳回', '取消上线'])

export const statusOptions: Array<{ text: string; value: ProductInquiryStatus | 'all' }> = [
  { text: '全部状态', value: 'all' },
  { text: '未提交', value: '未提交' },
  { text: '待处理', value: '待处理' },
  { text: '开始处理', value: '开始处理' },
  { text: '处理完毕', value: '处理完毕' },
  { text: '审批中', value: '审批中' },
  { text: '已驳回', value: '已驳回' },
  { text: '待确认', value: '待确认' },
  { text: '取消上线', value: '取消上线' },
]

export const productChannelOptions = ['淘宝', '京东'] as const
export const productTypeOptions = [
  { label: '实物', value: '1' },
  { label: '虚拟', value: '2' },
  { label: '软著', value: '3' },
] as const
export const warrantyOptions = ['1个月', '3个月', '6个月', '1年', '2年', '3年', '5年', '10年'] as const

export const productTypeLabelMap: Record<'1' | '2' | '3', string> = {
  '1': '实物',
  '2': '虚拟',
  '3': '软著',
}

export const getProductTypeLabel = (value: ProductInquiry['productType']) => {
  if (!value) {
    return '-'
  }

  return productTypeLabelMap[value]
}

export const nowText = () => '2026-06-12 10:30'

export const formatMoney = (value: ProductInquiry['limitPrice'] | number) => {
  if (value === '' || value === null || value === undefined) {
    return '-'
  }

  return `¥${Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const statusType = (status: ProductInquiryStatus) => {
  const typeMap: Record<ProductInquiryStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    未提交: 'default',
    待处理: 'primary',
    开始处理: 'primary',
    处理完毕: 'success',
    审批中: 'primary',
    已驳回: 'danger',
    待确认: 'warning',
    取消上线: 'default',
  }

  return typeMap[status]
}

export const canSubmit = (item?: ProductInquiry | null) =>
  Boolean(item && SUBMITTABLE_STATUSES.has(item.status))

export const canWithdraw = (item?: ProductInquiry | null) =>
  Boolean(item && item.status === WAITING_CONFIRM_STATUS)

export const canEdit = (item?: ProductInquiry | null) =>
  Boolean(item && EDITABLE_STATUSES.has(item.status))

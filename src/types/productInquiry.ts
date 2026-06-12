export type ProductInquiryStatus =
  | '未提交'
  | '待确认'
  | '待处理'
  | '开始处理'
  | '审批中'
  | '处理完毕'
  | '已驳回'
  | '取消上线'

export type ProductChannel = '淘宝' | '京东'

export type ProductType = '' | '1' | '2' | '3'

export interface ProductInquiry {
  id: number
  productName: string
  customerName: string
  opportunityName: string
  salesUserName: string
  inquiryQuantity: number
  implementationUnitPrice: number
  limitPrice: number | ''
  inquiryRemark: string
  productChannel: ProductChannel
  productCategory: string
  productModel: string
  productType: ProductType
  brandName: string
  unitName: string
  warrantyPeriod: string
  specParams: string
  status: ProductInquiryStatus
  updatedAt: string
  rejectReason?: string
}

export type ProductInquiryFormModel = Omit<ProductInquiry, 'id' | 'updatedAt' | 'rejectReason'> & {
  limitPrice: number | ''
}

export interface ProductInquiryFilters {
  productName: string
  status: ProductInquiryStatus | 'all'
}

import { computed, reactive, ref } from 'vue'
import type {
  ProductInquiry,
  ProductInquiryFilters,
  ProductInquiryFormModel,
} from '../types/productInquiry'
import { DEFAULT_STATUS, WAITING_CONFIRM_STATUS, nowText } from '../utils/productInquiry'

const inquiries = ref<ProductInquiry[]>([
  {
    id: 10021,
    productName: '会议室无线投屏器套装',
    customerName: '上海云启科技有限公司',
    opportunityName: '总部会议室智能化改造',
    salesUserName: '林远',
    inquiryQuantity: 12,
    implementationUnitPrice: 1280,
    limitPrice: 1180,
    inquiryRemark: '现场需要确认是否支持安卓、Windows、macOS 混合投屏。',
    productChannel: '京东',
    productCategory: '办公设备',
    productModel: 'WX-T900',
    productType: '1',
    brandName: 'MaxHub',
    unitName: '套',
    warrantyPeriod: '1年',
    specParams: '4K 输出，双频 Wi-Fi，HDMI 接口，支持企业级加密。',
    status: '待确认',
    updatedAt: '2026-06-12 09:42',
  },
  {
    id: 10022,
    productName: '工业级扫码采集终端',
    customerName: '杭州腾越供应链',
    opportunityName: '仓储 PDA 更新项目',
    salesUserName: '陈悦',
    inquiryQuantity: 35,
    implementationUnitPrice: 2360,
    limitPrice: 2200,
    inquiryRemark: '客户希望本周先给预算价，正式参数稍后补充。',
    productChannel: '京东',
    productCategory: '移动终端',
    productModel: 'PDA-X6 Pro',
    productType: '1',
    brandName: '东集',
    unitName: '台',
    warrantyPeriod: '2年',
    specParams: '安卓系统，二维扫码头，IP65，5000mAh 电池。',
    status: '已驳回',
    rejectReason: '缺少产品型号对应的保修策略，请补充后重新提交。',
    updatedAt: '2026-06-11 18:15',
  },
  {
    id: 10023,
    productName: '电子签章企业版授权',
    customerName: '苏州明澜人力资源',
    opportunityName: '合同线上化一期',
    salesUserName: '林远',
    inquiryQuantity: 1,
    implementationUnitPrice: 68000,
    limitPrice: 65000,
    inquiryRemark: '按年授权，含 5 万次签署额度。',
    productChannel: '淘宝',
    productCategory: '企业软件',
    productModel: 'ESign-Enterprise',
    productType: '2',
    brandName: '法大大',
    unitName: '年',
    warrantyPeriod: '1年',
    specParams: 'SaaS 部署，支持 API 对接和组织架构同步。',
    status: '审批中',
    updatedAt: '2026-06-10 14:28',
  },
  {
    id: 10024,
    productName: '门店客流统计摄像头',
    customerName: '南京银禾商业管理',
    opportunityName: '门店数字化经营看板',
    salesUserName: '周宁',
    inquiryQuantity: 48,
    implementationUnitPrice: 890,
    limitPrice: 850,
    inquiryRemark: '需要报价中标明安装调试费用是否另计。',
    productChannel: '淘宝',
    productCategory: '智能硬件',
    productModel: 'CAM-Flow S2',
    productType: '1',
    brandName: '海康威视',
    unitName: '个',
    warrantyPeriod: '3年',
    specParams: '双目客流，PoE 供电，支持本地算法和云端看板。',
    status: '未提交',
    updatedAt: '2026-06-09 11:03',
  },
  {
    id: 10025,
    productName: '门禁控制器扩展模块',
    customerName: '无锡星河产业园',
    opportunityName: '园区门禁联动改造',
    salesUserName: '周宁',
    inquiryQuantity: 16,
    implementationUnitPrice: 1450,
    limitPrice: 1380,
    inquiryRemark: '客户希望兼容原有门禁主机，需确认协议版本。',
    productChannel: '京东',
    productCategory: '安防设备',
    productModel: 'ACU-EX8',
    productType: '1',
    brandName: '大华',
    unitName: '台',
    warrantyPeriod: '3年',
    specParams: '8 路继电器输出，RS485 通讯，支持消防联动。',
    status: '待处理',
    updatedAt: '2026-06-08 16:20',
  },
  {
    id: 10026,
    productName: '数据中台接口开发服务',
    customerName: '宁波云帆制造',
    opportunityName: 'MES 与 CRM 数据打通',
    salesUserName: '陈悦',
    inquiryQuantity: 20,
    implementationUnitPrice: 1800,
    limitPrice: 1600,
    inquiryRemark: '按人天估算，需确认是否包含联调驻场。',
    productChannel: '淘宝',
    productCategory: '实施服务',
    productModel: 'API-Service',
    productType: '2',
    brandName: '',
    unitName: '人天',
    warrantyPeriod: '6个月',
    specParams: 'REST API，对接 MES、CRM、BI 三套系统，含测试环境联调。',
    status: '开始处理',
    updatedAt: '2026-06-08 10:05',
  },
  {
    id: 10027,
    productName: '会议预约屏软件授权',
    customerName: '成都蓝石咨询',
    opportunityName: '办公室空间管理',
    salesUserName: '林远',
    inquiryQuantity: 8,
    implementationUnitPrice: 3200,
    limitPrice: 3000,
    inquiryRemark: '已完成报价测算，等待销售确认是否进入正式报价。',
    productChannel: '京东',
    productCategory: '协同软件',
    productModel: 'RoomBook-Pro',
    productType: '2',
    brandName: '飞书',
    unitName: '套',
    warrantyPeriod: '1年',
    specParams: '支持会议室预约、门牌屏同步、企业通讯录同步。',
    status: '处理完毕',
    updatedAt: '2026-06-07 17:48',
  },
  {
    id: 10028,
    productName: '直播间补光灯套装',
    customerName: '广州弥鹿传媒',
    opportunityName: '直播间设备补采',
    salesUserName: '周宁',
    inquiryQuantity: 6,
    implementationUnitPrice: 780,
    limitPrice: 720,
    inquiryRemark: '客户临时取消该产品上线，保留记录方便后续恢复。',
    productChannel: '淘宝',
    productCategory: '音视频设备',
    productModel: 'Light-Kit V2',
    productType: '1',
    brandName: '神牛',
    unitName: '套',
    warrantyPeriod: '1年',
    specParams: '双色温补光，含支架、电源适配器和柔光罩。',
    status: '取消上线',
    updatedAt: '2026-06-06 09:36',
  },
])

const filters = reactive<ProductInquiryFilters>({
  productName: '',
  status: 'all',
})

const filteredInquiries = computed(() => {
  const productName = filters.productName.trim().toLowerCase()

  return inquiries.value.filter((item) => {
    const productMatch = !productName || item.productName.toLowerCase().includes(productName)
    const statusMatch = filters.status === 'all' || item.status === filters.status
    return productMatch && statusMatch
  })
})

const todoCount = computed(
  () => inquiries.value.filter((item) => item.status === '未提交' || item.status === '已驳回').length,
)

const waitingCount = computed(() => inquiries.value.filter((item) => item.status === '待确认').length)

const resetFilters = () => {
  filters.productName = ''
  filters.status = 'all'
}

const findInquiry = (id: number) => inquiries.value.find((item) => item.id === id)

const createEmptyForm = (): ProductInquiryFormModel => ({
  customerName: '',
  opportunityName: '',
  salesUserName: '林远',
  inquiryQuantity: 1,
  implementationUnitPrice: 0,
  limitPrice: '',
  inquiryRemark: '',
  productName: '',
  productChannel: '京东',
  productCategory: '',
  productModel: '',
  productType: '',
  brandName: '',
  unitName: '',
  warrantyPeriod: '1年',
  specParams: '',
  status: DEFAULT_STATUS,
})

const createInquiry = (form: ProductInquiryFormModel) => {
  const inquiry: ProductInquiry = {
    ...form,
    id: Date.now(),
    status: DEFAULT_STATUS,
    updatedAt: nowText(),
  }

  inquiries.value.unshift(inquiry)
  return inquiry
}

const updateInquiry = (id: number, form: ProductInquiryFormModel) => {
  const index = inquiries.value.findIndex((item) => item.id === id)
  if (index < 0) {
    return null
  }

  inquiries.value[index] = {
    ...inquiries.value[index],
    ...form,
    updatedAt: nowText(),
  }

  return inquiries.value[index]
}

const submitInquiry = (id: number) => {
  const inquiry = findInquiry(id)
  if (!inquiry) {
    return null
  }

  inquiry.status = WAITING_CONFIRM_STATUS
  inquiry.rejectReason = ''
  inquiry.updatedAt = nowText()
  return inquiry
}

const withdrawInquiry = (id: number) => {
  const inquiry = findInquiry(id)
  if (!inquiry) {
    return null
  }

  inquiry.status = DEFAULT_STATUS
  inquiry.updatedAt = nowText()
  return inquiry
}

export const useProductInquiryStore = () => ({
  inquiries,
  filters,
  filteredInquiries,
  todoCount,
  waitingCount,
  resetFilters,
  findInquiry,
  createEmptyForm,
  createInquiry,
  updateInquiry,
  submitInquiry,
  withdrawInquiry,
})

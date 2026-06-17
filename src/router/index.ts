import { createRouter, createWebHistory } from 'vue-router'
import ProductInquiryList from '../views/ProductInquiryList.vue'
import ProductInquiryDetail from '../views/ProductInquiryDetail.vue'
import ProductInquiryForm from '../views/ProductInquiryForm.vue'

const DEFAULT_TITLE = '报价助手原型-移动端'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/inquiries',
    },
    {
      path: '/inquiries',
      name: 'ProductInquiryList',
      component: ProductInquiryList,
      meta: {
        title: '产品询价',
      },
    },
    {
      path: '/inquiries/new',
      name: 'ProductInquiryCreate',
      component: ProductInquiryForm,
      meta: {
        title: '新建询价',
      },
    },
    {
      path: '/inquiries/:id',
      name: 'ProductInquiryDetail',
      component: ProductInquiryDetail,
      props: true,
      meta: {
        title: '询价详情',
      },
    },
    {
      path: '/inquiries/:id/edit',
      name: 'ProductInquiryEdit',
      component: ProductInquiryForm,
      props: true,
      meta: {
        title: '编辑询价',
      },
    },
  ],
})

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : DEFAULT_TITLE
})

export default router

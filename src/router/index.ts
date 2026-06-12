import { createRouter, createWebHistory } from 'vue-router'
import ProductInquiryList from '../views/ProductInquiryList.vue'
import ProductInquiryDetail from '../views/ProductInquiryDetail.vue'
import ProductInquiryForm from '../views/ProductInquiryForm.vue'

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
    },
    {
      path: '/inquiries/new',
      name: 'ProductInquiryCreate',
      component: ProductInquiryForm,
    },
    {
      path: '/inquiries/:id',
      name: 'ProductInquiryDetail',
      component: ProductInquiryDetail,
      props: true,
    },
    {
      path: '/inquiries/:id/edit',
      name: 'ProductInquiryEdit',
      component: ProductInquiryForm,
      props: true,
    },
  ],
})

export default router

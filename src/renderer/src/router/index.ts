import { createRouter, createWebHistory } from 'vue-router'
import IndexVue from '@renderer/pages/Index.vue'
import DashboardVue from '@renderer/pages/Dashboard.vue'
const routes = [
  {
    path: '/',
    name: 'Index',
    component: IndexVue,
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardVue,
    meta: {
      layout: 'DefaultLayout'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'active'
})

// router.beforeEach(loadLayoutMiddleware)

export default router

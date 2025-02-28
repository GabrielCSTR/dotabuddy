import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@renderer/pages/Index.vue')
  },
  {
    path: '/app',
    component: () => import('@renderer/pages/Dashboard.vue'),
    children: [
      {
        path: 'current-match',
        name: 'CurrentMatch',
        component: () => import('@renderer/pages/CurrentMatch.vue')
      },
      {
        path: 'match-history',
        name: 'MatchHistory',
        component: () => import('@renderer/pages/MatchHistory.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@renderer/pages/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkExactActiveClass: 'active'
})

export default router

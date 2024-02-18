import VueRouter from 'vue-router'
import Vue from 'vue'
import auth from '@/utils/auth'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { path: '/', component: () => import('@/views/Home') },
      {
        path: '/article',
        component: () => import('@/views/Article')
      },
      {
        path: '/publish',
        component: () => import('@/views/Publish')
      }
    ]
  }
]
const router = new VueRouter({
  routes // 路由规则
})
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  const token = auth.getToken()
  if (to.path !== '/login' && !token) return next('/login')
  next()
})
export default router

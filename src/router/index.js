import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'home',
      // component: () => import('./views/DailyRank/DailyRank.vue')
      component: require('../views/DailyRank/DailyRank.vue').default
    }
    
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

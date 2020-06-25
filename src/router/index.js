import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    // {
    //   path: '/',
    //   name: 'home',
    //   // component: () => import('./views/DailyRank/DailyRank.vue')
    //   component: require('./views/DailyRank/DailyRank.vue').default
    // }
    
]

const router = new VueRouter({
  routes
})

export default router

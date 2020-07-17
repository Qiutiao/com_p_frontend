import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'home',
      // component: () => import('./views/DailyRank/DailyRank.vue')
      component: require('../views/DailyRank/DailyRank.vue').default
    },
    {
      path: '/keywords/:keyword',
      name: 'keywords',
      // component: () =>import('./views/SearchResult/SearchResult.vue'),
      component: require('../views/SearchResult/SearchResult.vue').default,
      props: true
    },
    {
      path: '/illusts/:pid',
      name: 'Illusts',
      // component: () => import('./views/Detail/Detail.vue'),
      component: require('../views/Detail/Detail.vue').default,
      props: true
    },
    {
      path: '/artist/:artistId',
      name: 'Artist',
      // component: () => import('./views/Artist/Artist.vue'),
      component: require('../views/Artist/Artist.vue').default,
      props: true
    },
    ...require('../views/User').default // A 业务路由入口
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

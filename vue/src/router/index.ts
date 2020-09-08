import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import { TokenService } from '@/services/storage.service'

Vue.use(VueRouter)


// const ifNotAuthenticated = (to: Route, from: Route, next: any) => {
//   if (!store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/')
// }

// const ifAuthenticated = (to: Route, from: Route, next: any) => {
//   if (store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/admin-login')
// }

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/write-post',
    name: 'WritePost',
    component: () => import(/* webpackChunkName: "write-post" */ '../views/WritePost.vue'),
    meta: {
      public: false,
    }
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import(/* webpackChunkName: "admin-login" */ '../views/AdminLogin.vue'),
    meta: {
      public: true,
      onlyWhenLoggedOut: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: any, from: any, next: any) => {
  const isPublic = to.matched.some((record: RouteConfig) => record.meta.public)
  const onlyWhenLoggedOut = to.matched.some((record: RouteConfig) => record.meta.onlyWhenLoggedOut)
  const loggedIn = !!TokenService.getToken()

  if (!isPublic && !loggedIn) {
    return next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  }

  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }

  next()
})

export default router

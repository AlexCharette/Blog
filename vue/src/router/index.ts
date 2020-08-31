import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)


const ifNotAuthenticated = (to: any, from: any, next: any) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to: any, from: any, next: any) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

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
    beforeEnter: ifAuthenticated
  },
  {
    path: '/admin-login',
    name: 'AdminLogin',
    component: () => import(/* webpackChunkName: "admin-login" */ '../views/AdminLogin.vue'),
    beforeEnter: ifNotAuthenticated
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

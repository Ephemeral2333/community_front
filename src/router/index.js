import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决重复点击相同路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: ()=>import('@/views/Home')
  },
  {
    path: '/register',
    name: 'register',
    component: ()=>import('@/views/auth/Register'),
    meta: {
        title: '注册'
    }
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/auth/Login"),
    meta: { title: "登录" },
  },
  {
    name: "post-create",
    path: "/post/create",
    component: () => import("@/views/post/Create"),
    meta: { title: "发帖", requireAuth: true },
  },
  {
    name: "post-detail",
    path: "/post/:id",
    component: () => import("@/views/post/Detail"),
  },
  {
    path: '/404',
    name: '404',
    component: ()=>import('@/views/error/404'),
    meta: {
      title: '404 Not Found'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router

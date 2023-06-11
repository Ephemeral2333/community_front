import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import {getToken} from "@/utils/auth";
import {MessageBox} from "element-ui"; // progress bar style

NProgress.configure({showSpinner: false}) // NProgress Configuration

// 导航守卫
router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    // set page title
    document.title = getPageTitle(to.meta.title)
    // determine whether the user has logged in
    const hasToken = getToken();

    if (hasToken) {
        if (to.path === '/login') {
            // 登录，跳转首页
            next({path: '/'})
            NProgress.done()
        } else {
            // 获取用户信息
            await store.dispatch('user/getInfo')
            next()
        }
    } else if (!to.meta.requireAuth) {
        next()
    } else {
        // 提醒用户登录,若选择取消，则停留在当前页面
        MessageBox.confirm('您还未登录，是否登录？', '提示', {
            confirmButtonText: '登录',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            next({path: '/login'})
            NProgress.done()
        }).catch(() => {
            next('/')
        })
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

import request from '@/utils/request'

export function getTodayTip() {
    return request({
        url: '/front/tip/today',
        method: 'get'
    })
}

export function PostTip(data) {
    return request({
        url: '/tip/post',
        method: 'post',
        data
    })
}

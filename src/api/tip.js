import request from '@/utils/request'

export function getTodayTip() {
    return request({
        url: '/front/tip/today',
        method: 'get'
    })
}

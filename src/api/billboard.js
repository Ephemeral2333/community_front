import request from '@/utils/request'

export function getBillboard() {
    return request({
        url: '/front/billboard/show',
        method: 'get'
    })
}

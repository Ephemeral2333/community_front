import request from '@/utils/request'

export function register(userDTO) {
    return request({
        url: '/admin/system/index/register',
        method: 'post',
        data: userDTO
    })
}

export function sendCode(email) {
    return request({
        url: `/admin/system/index/sendCode?email=${email}`,
        method: 'get'
    })
}

export function login(userDTO) {
    return request({
        url: '/admin/system/index/login',
        method: 'post',
        data: userDTO
    })
}

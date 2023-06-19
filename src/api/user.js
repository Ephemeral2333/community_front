import request from '@/utils/request'

export function getInfo(username, page, size) {
    return request({
        url: '/front/user/info/' + username,
        method: 'get',
        params: {
            page: page,
            size: size
        }
    })
}

export function getUploadToken() {
    return request({
        url: '/front/file/getToken',
        method: 'get'
    })
}

export function savePhoto(url, id) {
    return request({
        url: '/admin/system/index/savePhoto/' + id,
        method: 'post',
        data: url
    })
}

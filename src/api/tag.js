import request from '@/utils/request'

export function getTopicsByTag(paramMap) {
    return request({
        url: '/front/tag/getPageList/' + paramMap.id,
        method: 'post',
        params: {
            page: paramMap.page,
            size: paramMap.size
        }
    })
}

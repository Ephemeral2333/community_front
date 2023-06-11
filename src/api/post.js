import request from '@/utils/request'

export function getPostList(currentPage, pageSize, tab) {
    return request({
        url: `/front/post/list/${tab}`,
        method: 'post',
        data: {
            currentPage: currentPage,
            pageSize: pageSize,
            background: true,
            total: 0
        }
    })
}

export function savePost(topic) {
    return request({
        url: '/front/post/save',
        method: 'post',
        data: topic
    })
}

// 获取帖子详情
export function getTopic(id) {
    return request({
        url: `/front/post/${id}`,
        method: 'get'
    })
}

export function getRecommendTopics() {
    return request({
        url: `/front/post/recommend`,
        method: 'get'
    })
}

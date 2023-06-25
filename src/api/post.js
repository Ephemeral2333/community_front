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

export function updatePost(topic) {
    return request({
        url: '/front/post/update',
        method: 'put',
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

export function handleDelete(id) {
    return request({
        url: `/front/post/delete/${id}`,
        method: 'delete'
    })
}

export function replyComments(date) {
    return request({
        url: `/admin/comments/reply`,
        method: 'post',
        data: date
    })
}

export function removeComment(id) {
    return request({
        url: `/admin/comments/delete/${id}`,
        method: 'delete'
    })
}

export function isFavorite(id) {
    return request({
        url: `/front/post/isFavor/${id}`,
        method: 'get'
    })
}

export function favorite(id) {
    return request({
        url: `/post/favor/${id}`,
        method: 'get'
    })
}

export function unFavorite(id) {
    return request({
        url: `/post/unfavor/${id}`,
        method: 'get'
    })
}

export function increateForward(id) {
    return request({
        url: `/front/post/increaseShareCount/${id}`,
        method: 'get'
    })
}

export function getMyCollect(currentPage, pageSize, tab) {
    return request({
        url: `/post/my/${tab}`,
        method: 'post',
        data: {
            currentPage: currentPage,
            pageSize: pageSize,
            background: true,
            total: 0
        }
    })
}

export function isCollect(id) {
    return request({
        url: `/front/post/isCollect/${id}`,
        method: 'get'
    })
}

export function collect(id) {
    return request({
        url: `/post/collect/${id}`,
        method: 'get'
    })
}


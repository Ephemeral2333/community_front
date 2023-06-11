import request from '@/utils/request'

// 关注
export function follow(id) {
  return request({
    url: `/front/follow/${id}`,
    method: 'post'
  })
}

// 取消关注
export function unFollow(id) {
    return request({
        url: `/front/unfollow/${id}`,
        method: 'delete'
    })
}

// 判断是否关注对方
export function hasFollow(id) {
    return request({
        url: `/front/isFollow/${id}`,
        method: 'get'
    })
}

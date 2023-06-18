import request from '@/utils/request'

export function fetchCommentsTopicId(id) {
  return request({
    url: '/front/comment/getComments/' + id,
    method: 'get'
  })
}

export function pushComment(data) {
  return request({
    url: '/admin/comments/pushComments',
    method: 'post',
    data: data
  })
}

export function favorComment(id) {
  return request({
    url: '/admin/comments/favor/' + id,
    method: 'post'
  })
}

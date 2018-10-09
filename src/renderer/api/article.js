import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/creditAccount',
    method: 'get'
  })
}

export function fetchApiParamList(apiId) {
  return request({
    url: '/apiParamEntity/apiId',
    method: 'get',
    params: { apiId }
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/apiEntity/saveApiInfo',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    method: 'post',
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

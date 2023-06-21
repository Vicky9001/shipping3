import request from '@/utils/request'

export function addVan(data) {
  return request({
    url: '/api/van/addVan',
    method: 'post',
    data
  })
}

export function getVanList(data) {
  return request({
    url: '/api/van/vanList',
    method: 'get',
    params: data
  })
}

export function updateVan(data) {
  return request({
    url: '/api/van/modifyVan',
    method: 'post',
    data
  })
}

export function deleteVan(data) {
  return request({
    url: '/api/van/deleteVans',
    method: 'delete',
    data
  })
}

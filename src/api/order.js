import request from '@/utils/request'

export function getOrder(data) {
  return request({
    url: '/api/order/orderList',
    method: 'get',
    params: data
  })
}

export function getOrderByCarrier(data) {
  return request({
    url: '/api/order/searchCarrier',
    method: 'get',
    params: data
  })
}

export function getCarrierList(data) {
  return request({
    url: '/api/user/carrierList',
    method: 'get',
    params: data
  })
}

export function allocateCVW(data) {
  return request({
    url: '/api/order/update',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/api/order/create',
    method: 'post',
    data
  })
}

export function getShipment(data) {
  return request({
    url: '/api/order/searchShipment',
    method: 'get',
    params: data
  })
}

export function getDetail(data) {
  return request({
    url: '/api/order/searchId',
    method: 'get',
    params: data
  })
}

export function transfer(data) {
  return request({
    url: '/api/order/transfer',
    method: 'post',
    data
  })
}

export function changeState(data) {
  return request({
    url: '/api/order/changeState',
    method: 'post',
    data
  })
}


import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/auth/info',
    method: 'get',
    params: { token }
  })
}

export function alterPassword(data) {
  return request({
    url: '/external/user/update',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/api/auth/signup',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/addUser',
    method: 'post',
    data
  })
}

export function addCarrier(data) {
  return request({
    url: '/api/user/addCarrier',
    method: 'post',
    data
  })
}

export function getUserList(data) {
  return request({
    url: '/api/user/userList',
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

export function updateUserInfo(data) {
  return request({
    url: '/api/user/modifyUser',
    method: 'post',
    data
  })
}

export function updateCarrier(data) {
  return request({
    url: '/api/user/modifyCarrier',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/deleteUsers',
    method: 'delete',
    data
  })
}

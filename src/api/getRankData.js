import axios from 'axios'
import { queryData } from './config'

export function getRankData () {
  const url = 'http://localhost:3000/api/rank'
  const params = Object.assign({}, queryData, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date(),
    format: 'json',
    uin: '276925295'
  })
  return axios.get(url, {
    params
  }).then(response => {
    return Promise.resolve(response.data)
  }).catch(error => {
    return Promise.reject(error)
  })
}

export function getRankDetails (id) {
  const url = 'http://localhost:3000/api/rankdetail'
  const params = Object.assign({}, queryData, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date(),
    format: 'json',
    uin: '276925295',
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  })
  return axios.get(url, {
    params
  }).then(response => {
    return Promise.resolve(response.data)
  }).catch(error => {
    return Promise.reject(error)
  })
}

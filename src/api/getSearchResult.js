import jsonp from '@/assets/js/jsonp'
import axios from 'axios'
import { queryData } from './config'

export function getHotKeys () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const params = Object.assign({}, queryData, {
    loginUin: 0,
    hostUin: 0,
    platform: 'h5',
    needNewCode: 0
  })
  return jsonp(url, params, {
    param: 'jsonpCallback'
  })
}

export function getSearchResult (keyword, page, perpage) {
  const url = 'http://localhost:3000/api/search'
  const params = Object.assign({}, queryData, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    w: keyword,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    _: +new Date()
  })

  return axios.get(url, {
    params
  }).then(response => {
    return Promise.resolve(response.data)
  }).catch(error => {
    return Promise.reject(error)
  })
}

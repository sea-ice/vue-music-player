import axios from 'axios'
import jsonp from '@/assets/js/jsonp'
import { queryData } from '@/api/config'

export function getSliderData () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let params = Object.assign({}, queryData, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, params, {
    param: 'jsonpCallback'
  })
}

export function getSongSheet () {
  let url = 'http://localhost:3000/api/getRecommendSongSheet'
  let params = Object.assign({}, queryData, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params
  }).then(response => {
    return Promise.resolve(response.data)
  })
}

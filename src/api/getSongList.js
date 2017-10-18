import { queryData } from './config'
import jsonp from '@/assets/js/jsonp'

export function getSongList (singermid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const params = Object.assign({}, queryData, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singermid,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })

  return jsonp(url, params, {
    param: 'jsonpCallback'
  })
}

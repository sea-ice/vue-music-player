import axios from 'axios'
import { queryData } from '@/api/config'
import { Base64 } from 'js-base64'
import { getLikeSongs } from '@/assets/js/storage'

export function Song ({songId, songName, singer, singerName, albumId, albumName, albumImage, duration, playUrl, playCount}) {
  this.songId = songId
  this.songName = songName
  this.singer = singer
  this.singerName = singerName
  this.albumId = albumId
  this.albumName = albumName
  this.albumImage = albumImage
  this.duration = duration
  this.playUrl = playUrl
  this.liked = Boolean(~getLikeSongs(true).findIndex(item => item.songId === this.songId))
  this.playCount = playCount
}

Song.prototype.getLyric = function () {
  if (this.lyric) return Promise.resolve(this.lyric)
  return new Promise((resolve, reject) => {
    getLyric(this.songId).then(lyric => {
      this.lyric = lyric
      resolve(lyric)
    }).catch(error => {
      reject(error)
    })
  })
}

export function createSong (musicData) {
  return new Song({
    songId: musicData.songmid,
    songName: musicData.songname,
    singer: musicData.singer,
    singerName: formatSingerName(musicData.singer),
    albumId: musicData.albummid,
    albumName: musicData.albumname,
    albumImage: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    duration: musicData.interval,
    playUrl: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function formatSingerName (singers) {
  return singers.map(singer => singer.name).join(',')
}

function getLyric (songMid) {
  const url = '/api/lyric'
  const params = Object.assign({}, queryData, {
    songmid: songMid,
    pcachetime: +new Date(),
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json',
    categoryId: 10000000
  })

  return axios.get(url, {
    params
  }).then(response => {
    let lyric = response.data.lyric
    return Promise.resolve(Base64.decode(lyric))
  }).catch(error => {
    return Promise.reject(error)
  })
}

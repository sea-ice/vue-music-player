import storage from 'good-storage'
import { Song } from '@/assets/js/Song'

const searchStorageKey = '__searchHistory__'
const likeStorageKey = '__likeSongs__'
const recentPlayStorageKey = '__recentPlay__'
const MAX_SEARCH_STORAGE = 15

export function getSearchStorage () {
  return storage.get(searchStorageKey, [])
}

export function saveQuery (query) {
  let history = getSearchStorage()
  let index = history.indexOf(query)
  if (index === 0) return
  if (index > 0) history.splice(index, 1)
  history.unshift(query)
  if (history.length > MAX_SEARCH_STORAGE) history.pop()
  return storage.set(searchStorageKey, history)
}

export function removeQuery (query) {
  let history = getSearchStorage()
  let index = history.indexOf(query)
  if (index > -1) history.splice(index, 1)
  return storage.set(searchStorageKey, history)
}

export function clearHistory () {
  storage.remove(searchStorageKey)
  return []
}

export function getLikeSongs (original) {
  if (original) return storage.get(likeStorageKey, [])
  return storage.get(likeStorageKey, []).map(item => {
    return new Song(item, true)
  })
}

export function saveSong (song) {
  let history = getLikeSongs()
  history.unshift(song)
  storage.set(likeStorageKey, history)
  return history
}

export function removeSong (song) {
  let history = getLikeSongs()
  let index = history.findIndex(item => {
    return item.songId === song.songId
  })
  history.splice(index, 1)
  storage.set(likeStorageKey, history)
  return history
}

export function getRecentPlayList () {
  return storage.get(recentPlayStorageKey, []).map(item => {
    return new Song(item)
  })
}

export function updateRecentPlayList (song) {
  let history = getRecentPlayList()
  let index = history.findIndex(item => item.songId === song.songId)
  if (index < 0) {
    song.playCount = 1
    history.unshift(song)
  } else {
    if (index > 0) history.unshift(history.splice(index, 1)[0])
    history[0].playCount++
  }
  storage.set(recentPlayStorageKey, history)
  return history
}

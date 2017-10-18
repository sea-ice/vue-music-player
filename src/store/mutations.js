import * as types from '@/store/mutation-types'
import { saveQuery, removeQuery, clearHistory, saveSong, removeSong, updateRecentPlayList } from '@/assets/js/storage'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_RANK_ID] (state, id) {
    state.rankId = id
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequencePlayList = list
  },
  [types.SET_CURRENT_PLAYLIST] (state, list) {
    state.currentPlayList = list
  },
  [types.SET_PLAYER_FULLSCREEN] (state, fullScreen) {
    state.playerFullScreen = fullScreen
  },
  [types.SET_CURRENT_PLAYINDEX] (state, index) {
    state.currentPlayIndex = index
  },
  [types.SET_PLAYMODE] (state, mode) {
    state.playMode = mode
  },
  [types.SET_PLAYING] (state, playing) {
    state.playing = playing
  },
  [types.SAVE_SEARCH_HISTORY] (state, query) {
    state.searchHistory = saveQuery(query)
  },
  [types.REMOVE_SEARCH_HISTORY] (state, query) {
    state.searchHistory = removeQuery(query)
  },
  [types.CLEAR_SEARCH_HISTORY] (state) {
    state.searchHistory = clearHistory()
  },
  [types.SAVE_SONG] (state, song) {
    state.songCollection = saveSong(song)
  },
  [types.REMOVE_SONG] (state, song) {
    state.songCollection = removeSong(song)
  },
  [types.TOGGLE_SONG_LIKE] (state, song) {
    let currentSong = state.currentPlayList[state.currentPlayIndex]
    currentSong.liked = !currentSong.liked
  },
  [types.UPDATE_RECENT_PLAYLIST] (state, song) {
    state.recentPlayList = updateRecentPlayList(song)
  }
}

export default mutations

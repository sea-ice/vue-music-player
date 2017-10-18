import * as types from '@/store/mutation-types'
import { SEQUENCE_MODE, LOOP_MODE, RANDOM_MODE } from '@/assets/js/config'

const actions = {
  chooseSong ({commit, state}, {song, index, list}) {
    commit(types.SET_SEQUENCE_LIST, list)
    let copyList = list.slice()
    switch (state.playMode) {
      case SEQUENCE_MODE:
      case LOOP_MODE:
        commit(types.SET_CURRENT_PLAYINDEX, index)
        commit(types.SET_CURRENT_PLAYLIST, list)
        break
      case RANDOM_MODE:
        let first = copyList.splice(index, 1)
        copyList.sort(() => {
          return Math.random() - 0.5
        })
        commit(types.SET_CURRENT_PLAYINDEX, 0)
        commit(types.SET_CURRENT_PLAYLIST, first.concat(copyList))
        break
    }
    commit(types.SET_PLAYER_FULLSCREEN, true)
    commit(types.SET_PLAYING, true)
  },
  updateCurrentList ({commit}, {list, index}) {
    commit(types.SET_CURRENT_PLAYLIST, list)
    commit(types.SET_CURRENT_PLAYINDEX, index)
  },
  insertSong ({commit, state}, song) {
    let sequenceList = state.sequencePlayList.slice()
    let currentList = state.currentPlayList.slice()
    let currentIndex = state.currentPlayIndex
    if (sequenceList.length === 0) {
      sequenceList.push(song)
      currentList.push(song)
      currentIndex = 0
    } else {
      let currentSong = currentList[currentIndex]
      let currentSeqIndex = findSong(sequenceList, currentSong)
      let songIndex = findSong(sequenceList, song)
      let songCurIndex = findSong(currentList, song)
      sequenceList.splice(currentSeqIndex + 1, 0, song)
      currentList.splice(currentIndex + 1, 0, song)
      if (songIndex === -1) {
        currentIndex++
      } else {
        if (songIndex <= currentSeqIndex) {
          sequenceList.splice(songIndex, 1)
        } else {
          sequenceList.splice(songIndex + 1, 1)
        }
        if (songCurIndex <= currentIndex) {
          currentList.splice(songCurIndex, 1)
        } else {
          currentIndex++
          currentList.splice(songCurIndex + 1, 1)
        }
      }
    }
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_PLAYLIST, currentList)
    commit(types.SET_CURRENT_PLAYINDEX, currentIndex)
    commit(types.SET_PLAYER_FULLSCREEN, true)
  }
}

function findSong (list, song) {
  return list.findIndex(item => {
    return item.songId === song.songId
  })
}

export default actions

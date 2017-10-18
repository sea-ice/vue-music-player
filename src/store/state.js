import { SEQUENCE_MODE } from '@/assets/js/config'
import { getSearchStorage, getLikeSongs, getRecentPlayList } from '@/assets/js/storage'

const state = {
  singer: {},
  sequencePlayList: [],
  currentPlayList: [],
  playerFullScreen: false,
  currentPlayIndex: null,
  playing: false,
  playMode: SEQUENCE_MODE,
  searchHistory: getSearchStorage(),
  rankId: null,
  songCollection: getLikeSongs(),
  recentPlayList: getRecentPlayList()
}

export default state

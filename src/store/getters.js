const getters = {
  currentSong (state) {
    if (state.currentPlayIndex === null) return
    return state.currentPlayList[state.currentPlayIndex]
  }
}

export default getters

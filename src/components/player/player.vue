<template>
  <div class="player-wrapper">
    <div v-if="currentSong">
      <transition name="normal">
        <div
          class="normal-player"
          v-show="playerFullScreen"
        >
          <div class="background">
            <img :src="currentSong.albumImage" alt="">
          </div>
          <header>
            <i @click="hideNormalPlayer"></i>
          </header>
          <div class="song-info">
            <h2><p>{{ currentSong.songName }}</p></h2>
            <p class="singer-name">{{ currentSong.singerName }}</p>
          </div>
          <main
            @touchstart="onMainTouchStart"
            @touchmove="onMainTouchMove"
            @touchend="onMainTouchEnd"
            class="main-section"
            ref="main"
          >
            <div
              class="play-disc-wrapper"
              ref="playDisc"
            >
              <div class="play-disc-positioned">
                <div
                  class="play-disc"
                  :class="{'paused-play-disc': !playing}"
                  :style="{backgroundImage: 'url(' + currentSong.albumImage + ')'}">
                </div>
              </div>
            </div>
            <scroll
              class="lyric-wrapper"
              v-if="currentLyric"
              :data="currentLyric.lines"
              ref="scroller"
              :probe-type="3"
              :listen-scroll="true"
              @scroll="onLyricScroll"
            >
              <ul
                class="lyric-list"
                ref="lyricList"
              >
                <li
                  v-for="(line, index) in currentLyric.lines"
                  :class="{'current-line': index === currentLine}"
                  ref="lyricLine"
                ><p>{{ line.txt }}</p></li>
              </ul>
            </scroll>
          </main>
          <div class="fixed-bottom">
            <div class="player-indicators">
              <span :class="{'current-indicator': showDisc}"></span>
              <span :class="{'current-indicator': !showDisc}"></span>
            </div>
            <progress-bar
              :played-time="playedTime"
              :total-time="currentSong.duration"
              @update-time="progressBarUpdate"
            ></progress-bar>
            <div class="button-wrapper">
              <a
                href="javascript:void(0)"
                @click="togglePlayMode"
              ><i :class="playModeCls"></i></a>
              <a
                href="javascript:void(0)"
                @click="prev"
              ><i class="prev-btn"></i></a>
              <a
                href="javascript:void(0)"
                @click="togglePlaying"
              ><i :class="playing ? 'play-btn' : 'pause-btn'"></i></a>
              <a
                href="javascript:void(0)"
                @click="next"
              ><i class="next-btn"></i></a>
              <a
                href="javascript:void(0)"
                @click="collect"
              >
                <i :class="currentSong.liked ? 'liked-btn' : 'like-btn'"></i>
              </a>
            </div>
          </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player"
             v-show="!playerFullScreen"
             @click="showNormalPlayer">
          <div class="singer-image"
               :class="{'paused-play-disc': !playing}"
               :style="{backgroundImage: 'url(' + currentSong.albumImage + ')'}"
          ></div>
          <div class="song-info">
            <p>{{ currentSong.songName }}</p>
            <p>{{ currentSong.singerName }}</p>
          </div>
          <progress-circle
            :radius="36"
            :percentage="percentage"
          >
            <i
              @click.stop="togglePlaying"
              class="mini-btn"
              :class="playing ? 'mini-play-btn' : 'mini-pause-btn'"
            ></i>
          </progress-circle>
          <i class="mini-list-btn"></i>
        </div>
      </transition>
      <audio
        ref="audio"
        :src="currentSong.playUrl"
        @timeupdate="updatePlayedTime"
        @ended="songEnded"
        @canplay="canPlay"
        @error="playError"
      ></audio>
    </div>
    <div class="mini-player empty-mini-player"
         v-if="!currentSong">
      <div class="singer-image"></div>
      <div class="song-info">
        <p>当前未选择曲目</p>
        <p>未知作家</p>
      </div>
      <i class="mini-list-btn"></i>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '@/components/common/progressBar'
  import ProgressCircle from '@/components/common/progressCircle'
  import Scroll from '@/components/common/scroll'
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import { RANDOM_MODE, LOOP_MODE, PLAY_MODES } from '@/assets/js/config'
  import { shuffle } from '@/assets/js/utils'
  import Lyric from 'lyric-parser'

  const LYRIC_LINE_HEIGHT = 24
  export default {
    name: 'player',
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
    },
    mounted () {
      this.touch = {}
    },
    data () {
      return {
        playModeCls: 'sequence-play-btn',
        playedTime: 0,
        playReady: false,
        currentLyric: null,
        currentLine: 0,
        pauseTime: 0,
        showDisc: true,
        scrollY: 0
      }
    },
    computed: {
      percentage () {
        return this.playedTime / this.currentSong.duration
      },
      ...mapState([
        'playerFullScreen',
        'playing',
        'currentPlayIndex',
        'playMode',
        'currentPlayList',
        'sequencePlayList'
      ]),
      ...mapGetters([
        'currentSong'
      ])
    },
    watch: {
      currentSong (newSong, oldSong) {
        if (newSong === oldSong) return
        this.updateRecentPlayList(newSong)
        this.$nextTick(() => {
          this.getLyric()
          this.$refs.audio.play()
          this.setPlaying(true)
        })
      },
      currentLine (newLine, oldLine) {
        let scrollHeight = this.$refs.lyricLine[oldLine].clientHeight
        this.$refs.scroller.scroll.scrollBy(0, -scrollHeight, 500)
      },
      scrollY (newPos) {
        if (!this.halfHeight) this.halfHeight = (this.$refs.scroller.$el.clientHeight - LYRIC_LINE_HEIGHT) / 2
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          let offsetTop = this.$refs.lyricLine[this.currentLine].offsetTop
          if (Math.abs(newPos) + this.halfHeight !== offsetTop) {
            this.$refs.scroller.scroll.scrollTo(0, -(offsetTop - this.halfHeight), 500)
          }
        }, 500)
      }
    },
    methods: {
      onMainTouchStart (e) {
        this.touch.startX = e.touches[0].pageX
        this.touch.startY = e.touches[0].pageY
      },
      onMainTouchMove (e) {
        this.touch.deltaX = e.touches[0].pageX - this.touch.startX
        this.touch.deltaY = e.touches[0].pageY - this.touch.startY
        if (Math.abs(this.touch.deltaY) > Math.abs(this.touch.deltaX)) return
        let offset = this.touch.deltaX
        if (offset < 0) {
          if (this.showDisc) {
            this.$refs.playDisc.style.opacity = `${1 + offset / window.innerWidth}`
            this.$refs.scroller.$el.style.transform = `translate3d(${window.innerWidth + offset}px,0,0)`
          }
        } else {
          if (!this.showDisc) {
            this.$refs.playDisc.style.opacity = `${offset / window.innerWidth}`
            this.$refs.scroller.$el.style.transform = `translate3d(${offset}px,0,0)`
          }
        }
      },
      onMainTouchEnd () {
        let scrollElem = this.$refs.scroller.$el
        let percent = this.touch.deltaX / window.innerWidth
        if (this.showDisc) {
          if (percent <= -0.3) {
            this.$refs.playDisc.style.opacity = '0'
            scrollElem.style.transform = `translate3d(0,0,0)`
            this.showDisc = false
          } else if (percent > -0.3 && percent < 0) {
            this.$refs.playDisc.style.opacity = '1'
            scrollElem.style.transform = `translate3d(${window.innerWidth}px,0,0)`
          }
        } else {
          if (percent >= 0.3) {
            this.$refs.playDisc.style.opacity = '1'
            scrollElem.style.transform = `translate3d(${window.innerWidth}px,0,0)`
            this.showDisc = true
          } else if (percent < 0.3 && percent > 0) {
            this.$refs.playDisc.style.opacity = '0'
            scrollElem.style.transform = `translate3d(0,0,0)`
          }
        }
      },
      onLyricScroll (e) {
        this.scrollY = e.y
      },
      getLyric () {
        if (this.currentLyric) this.currentLyric.stop()
        this.currentSong.getLyric().then(lyric => {
          if (this.currentSong.lyric !== lyric) return
          this.currentLyric = new Lyric(lyric, this.handleLyric.bind(this))
          this.currentLyric.play()
        }).catch(error => {
          console.log(error)
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLine = lineNum
      },
      hideNormalPlayer () {
        this.setPlayerFullScreen(false)
      },
      showNormalPlayer () {
        this.setPlayerFullScreen(true)
      },
      progressBarUpdate (newTime) {
        this.$refs.audio.currentTime = newTime
        if (this.currentLyric) {
          this.currentLyric.seek(newTime * 1000)
          // 在seek之后，歌词会自动播放，因此需要判断当前歌曲播放状态切换歌词播放状态
          if (!this.playing) this.currentLyric.togglePlay()
        }
      },
      togglePlayMode () {
        let modeIndex = PLAY_MODES.indexOf(this.playMode)
        let newMode = PLAY_MODES[(modeIndex + 1) % PLAY_MODES.length]
        this.playModeCls = newMode + '-play-btn'
        this.setPlayMode(newMode)
        let currentList = []
        if (newMode === RANDOM_MODE) {
          currentList = shuffle(this.sequencePlayList)
        } else {
          currentList = this.sequencePlayList
        }
        let songNewIndex = currentList.indexOf(this.currentSong)
        this.updateCurrentList({
          list: currentList,
          index: songNewIndex
        })
      },
      prev () {
        if (!this.playReady) return
        this.$refs.scroller.yScrollTo(0)
        if (this.currentLyric) this.currentLyric.seek(0)
        if (this.currentPlayList.length === 1) {
          this.loop()
          return
        }
        let newIndex = this.currentPlayIndex - 1
        if (newIndex === -1) {
          newIndex = this.currentPlayList.length - 1
        }
        this.setCurrentPlayIndex(newIndex)
        if (!this.playing) this.setPlaying(true)
        this.playReady = false
      },
      togglePlaying () {
        this.setPlaying(!this.playing)
        let audio = this.$refs.audio
        this.$nextTick(() => {
          this.currentLyric.togglePlay()
          this.playing ? audio.play() : audio.pause()
        })
      },
      next () {
        if (!this.playReady) return
        this.$refs.scroller.yScrollTo(0)
        if (this.currentLyric) this.currentLyric.seek(0)
        if (this.currentPlayList.length === 1) {
          this.loop()
          return
        }
        let newIndex = this.currentPlayIndex + 1
        if (newIndex === this.currentPlayList.length) {
          newIndex = 0
        }
        this.setCurrentPlayIndex(newIndex)
        if (!this.playing) this.setPlaying(true)
        this.playReady = false
      },
      collect () {
        this.currentSong.liked ? this.removeSong(this.currentSong) : this.saveSong(this.currentSong)
        this.toggleSongLike()
      },
      loop () {
        let audio = this.$refs.audio
        audio.currentTime = 0
        audio.play()
        this.updateRecentPlayList(this.currentSong)
      },
      canPlay () {
        this.playReady = true
      },
      playError () {
        this.playReady = true
      },
      updatePlayedTime (e) {
        this.playedTime = e.target.currentTime | 0
      },
      songEnded () {
        if (this.playMode === LOOP_MODE) {
          if (this.currentLyric) this.currentLyric.seek(0)
          this.loop()
        } else {
          this.next()
        }
      },
      ...mapMutations([
        'setPlayerFullScreen',
        'setPlaying',
        'setCurrentPlayIndex',
        'setPlayMode',
        'setCurrentPlayList',
        'saveSong',
        'removeSong',
        'toggleSongLike',
        'updateRecentPlayList'
      ]),
      ...mapActions([
        'updateCurrentList'
      ])
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .player-wrapper
    .normal-player
      position: fixed
      top: 0px
      left: 0px
      right: 0px
      bottom: 0px
      background-color: $color-background
      .background
        width: 100%
        height: 100%
        filter: blur(20px)
        opacity: 0.6
        img
          width: 100%
          height: 100%
      header, .song-info
        position: absolute
        width: 100%
        top: 0px
        left: 0px
      header
        z-index: 1
        line-height: 44px
        i
          display: block
          width: 30px
          height: 30px
          margin:
            top: 7px
            left: 10px
          background-image: url(../../assets/icons/up.svg)
          -webkit-background-size: contain
          background-size: contain
          background-repeat: no-repeat
      h2
        p
          max-width: 70%
          line-height: 44px
          text-align: center
          margin: 0 auto
          color: $color-text
          overflow: hidden
          -ms-text-overflow: ellipsis
          text-overflow: ellipsis
          white-space: nowrap
      .singer-name
        text-align: center
        color: $color-text
      .main-section
        position: absolute
        top: 70px
        left: 0px
        right: 0px
        bottom: 146px
        .play-disc-wrapper, .lyric-wrapper
          position: absolute
          top: 0px
          left: 0px
          width: 100%
          height: 100%
          overflow: hidden
        .play-disc-wrapper
          -webkit-transition: opacity .3s
          -moz-transition: opacity .3s
          -ms-transition: opacity .3s
          -o-transition: opacity .3s
          transition: opacity .3s
          .play-disc-positioned
            position: absolute
            width: 70%
            padding-top: 70%
            top: 50%
            left: 50%
            transform: translate3d(-50%, -50%, 0)
            .play-disc
              position: absolute
              width: 100%
              height: 100%
              top: 0px
              left: 0px
              -webkit-box-sizing: border-box
              -moz-box-sizing: border-box
              box-sizing: border-box
              border: 10px solid $color-background-d
              -webkit-border-radius: 50%
              -moz-border-radius: 50%
              border-radius: 50%
              -webkit-background-size: cover
              background-size: cover
              background-position: 50% 50%
              background-repeat: no-repeat
              -webkit-background-clip: padding-box
              -moz-background-clip: padding-box
              background-clip: padding-box
              -webkit-animation: rotateInfinite 20s linear infinite
              -o-animation: rotateInfinite 20s linear infinite
              animation: rotateInfinite 20s linear infinite
            .paused-play-disc
              animation-play-state: paused
        .lyric-wrapper
          -webkit-transition: transform .3s
          -moz-transition: transform .3s
          -ms-transition: transform .3s
          -o-transition: transform .3s
          transition: transform .3s
          transform: translate3d(100%, 0, 0)
          .lyric-list
            -webkit-transition: all .5s
            -moz-transition: all .5s
            -ms-transition: all .5s
            -o-transition: all .5s
            transition: all .5s
            padding: calc(50% - 12px) 0 50%
            p
              line-height: 24px
              color: $color-text-d
              font-size: $font-size-medium
              text-align: center
            .current-line
              p
                color: $color-text
      .fixed-bottom
        position: absolute
        width: 100%
        bottom: 0px
        left: 0px
        .player-indicators
          text-align: center
          span
            display: inline-block
            width: 4px
            height: 4px
            -webkit-border-radius: 2px
            -moz-border-radius: 2px
            border-radius: 2px
            background-color: $color-text
          span:not(:first-child)
            margin-left: 10px
          .current-indicator
            width: 14px

        .button-wrapper
          padding:
            top: 20px
            bottom: 40px
          text-align: center
          a
            display: inline-block
            vertical-align: top
            i
              display: block
              width: 34px
              height: 34px
              -webkit-background-size: contain
              background-size: contain
              background-repeat: no-repeat
            .sequence-play-btn
              background-image: url(../../assets/icons/sequence.svg)
            .loop-play-btn
              background-image: url(../../assets/icons/loop.svg)
            .random-play-btn
              background-image: url(../../assets/icons/random.svg)
            .prev-btn
              background-image: url(../../assets/icons/prev.svg)
            .play-btn
              background-image: url(../../assets/icons/play.svg)
            .pause-btn
              background-image: url(../../assets/icons/pause.svg)
            .next-btn
              background-image: url(../../assets/icons/next.svg)
            .like-btn
              background-image: url(../../assets/icons/like.svg)
            .liked-btn
              background-image: url(../../assets/icons/liked.svg)
          a:not(:first-child)
            margin-left: 20px

      &.normal-enter-active, &.normal-leave-active
        transition: transform .3s
        .song-info, .fixed-bottom
          transition: all .5s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        transform: translate3d(0, 100%, 0)
        .song-info
          opacity: 0
          transform: translate3d(0, -70px, 0)
        .fixed-bottom
          opacity: 0
          transform: translate3d(0, 150px, 0)
    .mini-player
      position: fixed
      display: flex
      z-index: 100
      left: 0px
      right: 0px
      bottom: 0px
      height: 44px
      align-items: center
      padding:
        left: 10px
        right: 10px
      background-color: $color-highlight-background
      .singer-image
        width: 36px
        height: 36px
        -webkit-border-radius: 50%
        -moz-border-radius: 50%
        border-radius: 50%
        -webkit-background-size: contain
        background-size: contain
        background-repeat: no-repeat
        -webkit-animation: rotateInfinite 20s linear infinite
        -o-animation: rotateInfinite 20s linear infinite
        animation: rotateInfinite 20s linear infinite
      .paused-play-disc
        animation-play-state: paused
      .song-info
        flex-grow: 1
        margin-left: 10px
        color: $color-text
        max-width: calc(100% - 128px)
        p
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        p:first-child
          line-height: 22px
          font-size: $font-size-medium
        p:nth-child(2)
          line-height: 18px
          font-size: $font-size-small
      .mini-btn
        position: absolute
        width: 32px
        height: 32px
        left: 2px
        top: 2px
        -webkit-border-radius: 50%
        -moz-border-radius: 50%
        border-radius: 50%
        -webkit-background-size: contain
        background-size: contain
        background-repeat: no-repeat
      .mini-play-btn
        background-image: url(../../assets/icons/mini-play.svg)
      .mini-pause-btn
        background-image: url(../../assets/icons/mini-pause.svg)
      .mini-list-btn
        display: block
        width: 30px
        height: 30px
        margin-left: 10px
        -webkit-background-size: contain
        background-size: contain
        background-repeat: no-repeat
        background-image: url(../../assets/icons/music-list.svg)
    .empty-mini-player
      .singer-image
        background-image: url(../../assets/images/music.jpeg)
        -webkit-background-size: cover
        background-size: cover
        -webkit-animation: none
        -o-animation: none
        animation: none
      .song-info
        max-width: calc(100% - 86px)

  @keyframes rotateInfinite
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(359deg)
</style>

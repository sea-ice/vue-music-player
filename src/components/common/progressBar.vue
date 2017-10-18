<template>
  <div class="player-progress-wrapper">
    <span class="played-time">{{ playedTime | formatTime }}</span>
    <div
      class="player-progress"
      ref="progressBar"
      @touchstart="barTouchStart"
      @touchmove="barTouchMove"
      @touchend="barTouchEnd">
      <div class="played-section" ref="playedBar"></div>
      <div
        class="player-progress-thumb"
        ref="progressThumb"
        @touchstart.stop="thumbTouchStart"
      ></div>
    </div>
    <span class="total-time">{{ totalTime | formatTime }}</span>
  </div>
</template>

<script>
  const THUMB_WIDTH = 10
  export default {
    name: 'progressBar',
    props: {
      totalTime: {
        type: Number,
        default: 0
      },
      playedTime: {
        type: Number,
        default: 0
      }
    },
    mounted () {
      this.totalWidth = this.$refs.progressBar.clientWidth
      this.playedBar = this.$refs.playedBar
      this.progressThumb = this.$refs.progressThumb
      this.touch = {}
      this.touch.thumbLimitedStartPos = (window.innerWidth - this.totalWidth) / 2
    },
    filters: {
      formatTime (val) {
        let minutes = val / 60 | 0
        let seconds = val % 60
        return minutes + (seconds.toString().length < 2 ? ':0' : ':') + seconds
      }
    },
    watch: {
      playedTime (played) {
        if (this.touch.touching) return
        let offset = (this.totalWidth - THUMB_WIDTH) * played / this.totalTime
        this.playedBar.style.width = `${offset}px`
        this.progressThumb.style.left = `${offset}px`
      }
    },
    methods: {
      thumbTouchStart (e) {
        this.touch.touchThumb = true
        this.touch.touching = true
      },
      barTouchStart (e) {
        this._offset(e.touches[0].pageX)
        this.touch.touchThumb = false
        this.touch.touching = true
      },
      barTouchMove (e) {
        if (this.touch.touchThumb) {
          let offset = this._offset(e.touches[0].pageX)
          this.touch.touchEndOffset = offset
        }
      },
      barTouchEnd () {
        this.touch.touching = false
        this.$emit('update-time', this.touch.touchEndOffset / (this.totalWidth - THUMB_WIDTH) * this.totalTime)
      },
      _offset (movePos) {
        let offset = movePos - this.touch.thumbLimitedStartPos - THUMB_WIDTH / 2
        offset = Math.min(this.totalWidth - THUMB_WIDTH, Math.max(0, offset))
        this.playedBar.style.width = `${offset}px`
        this.progressThumb.style.left = `${offset}px`
        return offset
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .player-progress-wrapper
    padding-top: 20px
    text-align: center
    .played-time, .total-time
      display: inline-block
      width: 30px
      color: $color-text
      font-size: $font-size-small-s
      font-weight: lighter
      letter-spacing: 1px

    .player-progress
      position: relative
      display: inline-block
      width: 60%
      height: 4px
      -webkit-border-radius: 2px
      -moz-border-radius: 2px
      border-radius: 2px
      background-color: $color-text-d
      vertical-align: middle
      .played-section
        position: absolute
        height: 100%
        background-color: $color-theme
        -webkit-border-radius: 2px 0 0 2px
        -moz-border-radius: 2px 0 0 2px
        border-radius: 2px 0 0 2px
      .player-progress-thumb
        position: absolute
        width: 6px
        height: 6px
        margin-top: -3px
        -webkit-border-radius: 50%
        -moz-border-radius: 50%
        border-radius: 50%
        border: 2px solid $color-text-ll
        background-color: $color-theme
</style>

<template>
  <transition name="slide">
    <div class="user-center">
      <header>
        <i @click="back"></i>
        <div class="btn-wrapper">
          <a
            href="javascript:void(0)"
            :class="{'current': showMyLike}"
            @click="showLikeList"
          >我喜欢的</a>
          <a
            href="javascript:void(0)"
            :class="{'current': !showMyLike}"
            @click="showRecentPlayList"
          >最近播放</a>
        </div>
      </header>
      <div class="main">
        <scroll
          :data="songCollection"
          class="scroll"
          v-show="showMyLike"
          ref="likeScroller"
        >
          <ul>
            <li
              v-for="(song, index) in songCollection"
              @click="selectSong(song, index, songCollection)"
            >
              <h3>{{ song.songName }}</h3>
              <p>{{ song.singerName + ' - ' + song.albumName }}</p>
            </li>
          </ul>
        </scroll>
        <scroll
          :data="recentPlayList"
          class="scroll"
          v-show="!showMyLike"
          ref="recentPlayScroller"
        >
          <ul id="list">
            <li
              v-for="(song, index) in recentPlayList"
              @click="selectSong(song, index, recentPlayList)"
            >
              <div class="play-count">
                <i></i>
                <span>{{ song.playCount }}</span>
              </div>
              <div>
                <h3>{{ song.songName }}</h3>
                <p>{{ song.singerName + ' - ' + song.albumName }}</p>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
  import Scroll from '@/components/common/scroll'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'userCenter',
    components: {
      Scroll
    },
    computed: {
      ...mapState([
        'songCollection',
        'recentPlayList'
      ])
    },
    data () {
      return {
        showMyLike: true
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      showLikeList () {
        this.showMyLike = true
      },
      showRecentPlayList () {
        this.showMyLike = false
      },
      selectSong (song, index, list) {
        this.chooseSong({
          list,
          song,
          index
        })
      },
      ...mapActions([
        'chooseSong'
      ])
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  @import '../../assets/sass/base'
  .user-center
    position: fixed
    left: 0px
    right: 0px
    top: 0px
    bottom: 0px
    background-color: $color-background
    z-index: 10
    header
      padding:
        left: 10px
        right: 10px
      line-height: 44px
      i
        @extend %back-btn
      .btn-wrapper
        text-align: center
        a
          display: inline-block
          padding:
            left: 5px
            right: 5px
          font-size: $font-size-medium
          &.current
            color: $color-text
            -webkit-border-radius: 3px
            -moz-border-radius: 3px
            border-radius: 3px
        a:nth-of-type(2)
          margin-left: 10px
    .main
      position: relative
      height: calc(100% - 44px)
      .scroll
        position: absolute
        width: 100%
        top: 0px
        bottom: 54px
        left: 0px
        overflow: hidden
        li
          padding: 5px 10px
          color: $color-text
          font-size: $font-size-medium
          .play-count
            float: right
            width: 50px
            height: 40px
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            box-sizing: border-box
            padding-top: 8px
            text-align: center
            i
              display: inline-block
              width: 24px
              height: 24px
              -webkit-background-size: contain
              background-size: contain
              background-image: url(../../assets/icons/earphone.svg)
            span
              display: inline-block
              vertical-align: top
              line-height: 24px
          h3
            line-height: 24px
          p
            line-height: 16px
            color: $color-text-d

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .slide-enter-to, .slide-leave
    transform: translate3d(0, 0, 0)
  .slide-enter-active, .slide-leave-active
    -webkit-transition: transform .5s
    -moz-transition: transform .5s
    -ms-transition: transform .5s
    -o-transition: transform .5s
    transition: transform .5s
</style>

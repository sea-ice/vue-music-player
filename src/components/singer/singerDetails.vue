<template>
  <div class="singer-details-wrapper">
    <header>
      <i @click="back"></i>
      <h2>{{ singer.name }}</h2>
    </header>
    <div
      class="singer-image"
      ref="image"
      :style="{'background-image': 'url(' + singer.avatar + ')'}"
    >
    </div>
    <div class="song-list-layer" ref="layer"></div>
    <scroll
      class="scroll"
      ref="scroller"
      @scroll="onScroll"
      :listen-scroll="listenScroll"
      :probe-type="probeType"
      :data="songList"
    >
      <ul class="song-list">
        <li
          v-for="(song, index) in songList"
          @click="playSong(song, index, songList)"
        >
          <h3>{{ song.songName }}</h3>
          <p>{{ song.singerName + ' - ' + song.albumName }}</p>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { getSongList } from '@/api/getSongList'
  import { createSong } from '@/assets/js/Song'
  import Scroll from '@/components/common/scroll'

  const HEADER_HEIGHT = 44
  export default {
    name: 'singerDetails',
    computed: {
      ...mapState([
        'singer'
      ])
    },
    components: {
      Scroll
    },
    mounted () {
      this._getSongList(this.singer.id)
      this._initSongList()
    },
    data () {
      return {
        probeType: 3,
        listenScroll: true,
        scrollY: 0,
        songList: []
      }
    },
    watch: {
      scrollY (newY) {
        let scroll = this.scroll
        let scale = 1
        let translateY = newY
        if (newY < 0) {
          translateY = Math.max(newY, -scroll.maxTranslateY)
        } else {
          scale += newY / scroll.imgHeight
        }
        if (newY < -scroll.maxTranslateY) {
          this.$refs.image.style.paddingTop = `${HEADER_HEIGHT}px`
          this.$refs.image.style.zIndex = 10
        } else {
          this.$refs.image.style.paddingTop = `${scroll.imgHeight}px`
          this.$refs.image.style.zIndex = 1
        }
        this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
        this.$refs.image.style.transform = `scale(${scale})`
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      onScroll (pos) {
        this.scrollY = pos.y
      },
      playSong (song, index, list) {
        this.chooseSong({
          song,
          index,
          list
        })
      },
      _getSongList (id) {
        if (!id) {
          this.$router.push({
            path: '/singer'
          })
          return
        }
        let self = this
        getSongList(id).then(response => {
          self.songList = self._normalizeSongList(response.data.list)
          console.log(self.songList)
        }).catch(error => {
          console.log(error)
        })
      },
      _normalizeSongList (list) {
        return list.map(item => {
          return createSong(item.musicData)
        })
      },
      _initSongList () {
        this.scroll = {}
        this.scroll.imgHeight = this.$refs.image.clientHeight
        this.$refs.scroller.$el.style.top = `${this.scroll.imgHeight}px`
        this.$refs.layer.style.top = `${this.scroll.imgHeight}px`

        this.scroll.maxTranslateY = this.scroll.imgHeight - HEADER_HEIGHT
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
  .singer-details-wrapper
    position: fixed
    z-index: 100
    top: 0px
    left: 0px
    bottom: 44px
    right: 0px
    background-color: $color-background
    header
      position: fixed
      width: 100%
      z-index: 50
      -webkit-box-sizing: border-box
      -moz-box-sizing: border-box
      box-sizing: border-box
      padding:
        left: 10px
        right: 10px
      i
        @extend %back-btn
      h2
        line-height: 44px
        text-align: center
        color: $color-text

    .singer-image
      position: relative
      background-repeat: no-repeat
      -webkit-background-size: cover
      background-size: cover
      background-position: 0 0
      -webkit-transform-origin: top
      -moz-transform-origin: top
      -ms-transform-origin: top
      -o-transform-origin: top
      transform-origin: top
      padding-top: 70%
    .scroll, .song-list-layer
      position: fixed
      left: 0px
      right: 0px
      z-index: 1
    .song-list-layer
      height: calc(100% - 88px)
      background-color: $color-background
    .scroll
      bottom: 44px
      .song-list
        li
          padding: 5px 10px
          color: $color-text
          font-size: $font-size-medium
          h3
            line-height: 24px
          p
            line-height: 16px
            color: $color-text-d

</style>

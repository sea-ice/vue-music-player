<template>
  <scroll
    ref="scroller"
    class="search-result-wrapper"
    :data="result"
    :listenScrollEnd="true"
    @scrollEnd="onScrollEnd"
  >
    <ul ref="searchResult">
      <li v-for="item in result">
        <div
          v-if="item.id"
          class="singer-item"
          @click="singerDetail(item)"
        >
          <i
            :style="{'background-image': `url(${item.avatar})`}"
          ></i>
          <p>{{ item.name }}</p>
        </div>
        <div
          class="song-item"
          @click="selectSong(item)"
          v-else>
          <i></i>
          <p>{{ item.singerName }} - {{ item.songName }}</p>
        </div>
      </li>
      <li v-if="loading">正在加载中...</li>
      <li v-if="!loading && hasMoreData">加载更多</li>
      <li v-if="!loading && !hasMoreData">已加载全部数据</li>
    </ul>
  </scroll>
</template>

<script>
  import Scroll from '@/components/common/scroll'

  const LOADING_TEXT_HEIGHT = 30
  export default {
    name: 'searchResult',
    components: {
      Scroll
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      result: {
        type: Array,
        default: []
      },
      hasMoreData: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onScrollEnd (e) {
        if (!this.scrollerHeight) this.scrollerHeight = this.$refs.scroller.$el.clientHeight
        this.listHeight = this.$refs.searchResult.clientHeight
        if (e.y < -(this.listHeight - this.scrollerHeight - LOADING_TEXT_HEIGHT)) {
          this.$emit('scrollToEnd')
        }
      },
      singerDetail (singer) {
        this.$emit('saveSearchHistory', `${singer.name}`)
        this.$emit('singerDetail', singer)
      },
      selectSong (song) {
        this.$emit('saveSearchHistory', `${song.singerName} ${song.songName}`)
        this.$emit('selectSong', song)
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .search-result-wrapper
    position: fixed
    top: 115px
    bottom: 44px
    left: 0px
    right: 0px
    overflow: hidden
    ul
      li
        padding: 5px 10px
        i
          float: left
          -webkit-background-size: contain
          background-size: contain
          border-radius: 50%
        p
          margin: 0
          white-space: nowrap
          overflow: hidden
          -ms-text-overflow: ellipsis
          text-overflow: ellipsis
          color: $color-text
          font-size: $font-size-medium
        .singer-item
          i
            width: 40px
            height: 40px
          p
            line-height: 40px
            margin-left: 50px
        .song-item
          i
            width: 30px
            height: 30px
            background-image: url(../../assets/icons/song.svg)
          p
            line-height: 30px
            margin-left: 40px
        &:last-of-type
          text-align: center
          font-size: $font-size-medium
          color: $color-text
          padding: 0
          line-height: 30px
      .query
        line-height: 30px
        color: $color-theme
        font-size: $font-size-medium
</style>

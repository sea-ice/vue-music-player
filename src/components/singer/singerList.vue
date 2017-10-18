<template>
  <scroll
    ref="scroller"
    :data="singerList"
    :probe-type="probeType"
    @scroll="onScroll"
    :listen-scroll="listenScroll"
    class="singer-list-wrapper"
  >
    <ul
      class="singer-list"
      ref="groupList"
    >
      <li
        v-for="(group, index) in singerList"
      >
        <h4>{{ group.title }}</h4>
        <ul class="singer-group">
          <li v-for="singer in group.items" @click="chooseSinger(singer)">
            <img v-lazy="singer.avatar" alt="">
            <p>{{ singer.name }}</p>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="singer-index-list">
      <li
        v-for="(title, index) in indexList"
        :class="{'current-index': index === currentIndex}"
        :data-index="index"
        @touchstart="onIndexTouchStart"
        @touchmove.stop.prevent="onIndexTouchMove"
      >
        {{ title }}
      </li>
    </ul>
    <div
      class="fixed-group-title"
      v-show="currentTitle"
      ref="fixedGroupTitle"
    >
      <h4>{{ currentTitle }}</h4>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '@/components/common/scroll'
  import { handleDataAttribute } from '@/assets/js/utils'

  const INDEX_ITEM_HEIGHT = 18
  const GROUP_TITLE_HEIGHT = 20
  export default {
    props: {
      singerList: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        probeType: 3,
        listenScroll: true,
        scrollY: 0,
        currentIndex: 0,
        diff: 0
      }
    },
    components: {
      Scroll
    },
    computed: {
      indexList () {
        return this.singerList.map(v => v.title)
      },
      currentTitle () {
        if (this.scrollY > 0) return ''
        return this.indexList[this.currentIndex] ? this.indexList[this.currentIndex] : ''
      }
    },
    mounted () {
      this.heightList = [0]
      this.touch = {}
    },
    watch: {
      singerList () {
        setTimeout(() => {
          this._initHeightList()
        }, 20)
      },
      scrollY (newY) {
        let heightList = this.heightList
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0, len = heightList.length - 1; i < len; i++) {
          let nextTop = heightList[i + 1]
          if (-newY >= heightList[i] && -newY < nextTop) {
            this.currentIndex = i
            this.diff = nextTop + newY
            return
          }
        }
        this.currentIndex = heightList.length - 2
      },
      diff (newDiff) {
        let fixedTop = (newDiff > 0 && newDiff < GROUP_TITLE_HEIGHT) ? newDiff - GROUP_TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) return
        this.fixedTop = fixedTop
        this.$refs.fixedGroupTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    methods: {
      onIndexTouchStart (e) {
        let index = parseInt(handleDataAttribute(e.target, 'index'))
        this.touch.y1 = e.touches[0].pageY
        this.touch.touchStartIndex = index
        this._yScrollTo(index)
      },
      onIndexTouchMove (e) {
        this.touch.y2 = e.touches[0].pageY
        let moveDistance = this.touch.y2 - this.touch.y1
        let moveCount = parseInt(moveDistance / INDEX_ITEM_HEIGHT)
        let index = this.touch.touchStartIndex + moveCount
        this._yScrollTo(index)
      },
      onScroll (pos) {
        this.scrollY = pos.y
      },
      refresh () {
        this.$refs.scroller.refresh()
      },
      chooseSinger (singer) {
        this.$emit('showSingerDetails', singer)
      },
      _initHeightList () {
        let groupList = this.$refs.groupList
        let heightList = this.heightList;
        [].forEach.call(groupList.children, (v, i) => {
          heightList.push(v.clientHeight + heightList[i])
        })
      },
      _yScrollTo (index) {
        if (index < 0) index = 0
        if (index >= this.heightList.length - 1) index = this.heightList.length - 2
        this.currentIndex = index
        this.$refs.scroller.yScrollTo(-this.heightList[index])
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .singer-list-wrapper
    position: relative
    width: 100%
    height: 100%
    h4
      background-color: $color-background-d
      line-height: 20px
      font-size: $font-size-small
      text-indent: 10px
    .singer-list
      color: $color-text
      & > li
        background-color: #fff
        .singer-group
          background-color: $color-background
          li
            padding: 5px 10px
            img
              float: left
              width: 40px
              height: 40px
              -webkit-border-radius: 50%
              -moz-border-radius: 50%
              border-radius: 50%
              vertical-align: top
            p
              line-height: 40px
              margin-left: 50px
              font-size: $font-size-medium
    .fixed-group-title
      position: absolute
      width: 100%
      top: 0px
      left: 0px
      background-color: #fff
      color: $color-text
    .singer-index-list
      position: absolute
      top: 50%
      right: 5px
      transform: translateY(-50%)
      padding: 10px 0px
      z-index: 10
      li
        color: $color-text
        font-size: $font-size-small
        text-align: center
        height: 18px
        line-height: 18px
      .current-index
        color: $color-theme
</style>

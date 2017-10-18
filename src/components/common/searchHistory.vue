<template>
  <div>
    <div class="search-history-wrapper" v-show="history.length">
      <h2 ref="title">
        <i @click="clearSearchHistory"></i>搜索历史
      </h2>
      <scroll class="scroll" :data="history" ref="scroller">
        <ul class="search-history">
          <li v-for="item in history">
            <i></i>
            <i @click.stop="removeSearchHistory(item)"></i>
            <p @click="chooseHistory(item)">{{ item }}</p>
          </li>
        </ul>
      </scroll>
    </div>
    <p class="no-history" v-if="history.length === 0">暂无搜索记录</p>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import Scroll from '@/components/common/scroll'

  const TITLE_HEIGHT = 30
  const BOTTOM_OFFSET = 54
  export default {
    name: 'searchHistory',
    mounted () {
      if (this.history.length) {
        this.$nextTick(() => {
          let titlePos = this.$refs.title.getBoundingClientRect()
          let height = window.innerHeight - titlePos.top - TITLE_HEIGHT - BOTTOM_OFFSET
          this.$refs.scroller.$el.style.height = `${height}px`
          this.$refs.scroller.refresh()
        })
      }
    },
    components: {
      Scroll
    },
    props: {
      history: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      chooseHistory (query) {
        this.$emit('chooseHistory', query)
      },
      ...mapMutations([
        'removeSearchHistory',
        'clearSearchHistory'
      ])
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .search-history-wrapper
    margin-top: 10px
    i
      float: right
      width: 20px
      height: 20px
      margin-top: 5px
      -webkit-background-size: contain
      background-size: contain
    h2
      color: $color-text-d
      line-height: 30px
      padding:
        left: 15px
        right: 15px
      i
        background-image: url(../../assets/icons/trash.svg)
    .scroll
      overflow: hidden
      .search-history
        padding:
          left: 15px
          right: 15px
        li
          line-height: 30px
          border-bottom: 1px solid $color-text-d
          i:first-of-type
            float: left
            background-image: url(../../assets/icons/clock.svg)
          i:nth-of-type(2)
            background-image: url(../../assets/icons/delete.svg)
          p
            color: $color-text-awesome
            font-size: $font-size-medium
            margin-left: 30px

  .no-history
    color: $color-text-d
    text-align: center
    margin-top: 20px
</style>

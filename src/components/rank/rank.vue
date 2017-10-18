<template>
  <div class="main-content-wrapper">
    <scroll
      :data="rankList"
      class="scroll"
    >
      <ul class="rank-list">
        <li v-for="item in rankList" @click="rankDetail(item.id)">
          <div class="img" :style="{'background-image': `url(${item.picUrl})`}">
            <p><i></i> {{ item.listenCount | formatNum }}</p>
          </div>
          <div class="right-arrow">
            <i></i>
          </div>
          <div class="main">
            <h3 class="title">{{ item.topTitle }}</h3>
            <ul>
              <li v-for="(song, index) in item.songList">
                <p>{{index + 1}} {{ song.songname }} <span>- {{ song.singername }}</span></p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Scroll from '@/components/common/scroll'
  import { getRankData } from '@/api/getRankData'
  import { mapMutations } from 'vuex'

  export default {
    name: 'rank',
    components: {
      Scroll
    },
    mounted () {
      this.getRankData()
    },
    data () {
      return {
        rankList: []
      }
    },
    filters: {
      formatNum (val) {
        return Number(val / 10000).toFixed(1) + ' 万'
      }
    },
    methods: {
      getRankData () {
        getRankData().then(response => {
          this.rankList = response.data.topList
        }).catch(error => {
          console.log(error)
        })
      },
      rankDetail (id) {
        this.$router.push({
          path: `/rank/${id}`
        })
        this.setRankId(id)
      },
      ...mapMutations([
        'setRankId'
      ])
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .main-content-wrapper
    background-color: $color-background
    .scroll
      width: 100%
      height: 100%
      .rank-list
        li
          padding: 5px 10px
          .img
            position: relative
            float: left
            width: 90px
            height: 90px
            -webkit-background-size: contain
            background-size: contain
            p
              position: absolute
              left: 0px
              bottom: 0px
              width: 100%
              line-height: 20px
              background-color: $color-text-d
              color: $color-text-ll
              font-size: $font-size-small
              font-weight: lighter
              text-align: center
              i
                display: inline-block
                width: 20px
                height: 20px
                -webkit-background-size: contain
                background-size: contain
                vertical-align: top
                background-image: url(../../assets/icons/earphone.svg)
          .right-arrow
            float: right
            line-height: 90px
            width: 24px
            height: 90px
            i
              display: block
              width: 24px
              height: 24px
              margin: 33px auto
              -webkit-background-size: contain
              background-size: contain
              background-image: url(../../assets/icons/right.svg)
          .main
            margin:
              left: 100px
              right: 34px
            color: $color-text
            .title
              line-height: 24px
            ul
              li
                padding: 0px
                p
                  line-height: 22px
                  font-size: $font-size-medium
                  white-space: nowrap
                  overflow: hidden
                  -ms-text-overflow: ellipsis
                  text-overflow: ellipsis
                  span
                    color: $color-text-l
    .slide-enter, .slide-leave-to
      transform: translate3d(100%, 0, 0)
      opacity: 0
    .slide-enter-to, .slide-leave
      transform: translate3d(0, 0, 0)
      opacity: 1
    .slide-enter-active, .slide-leave-active
      -webkit-transition: all .5s
      -moz-transition: all .5s
      -ms-transition: all .5s
      -o-transition: all .5s
      transition: all .5s
</style>

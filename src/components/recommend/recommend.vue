<template>
  <div class="main-content-wrapper">
    <loading :loading="!(sliderImages.length || songSheet.length)">
      <scroll ref="scroller" class="scroll-wrapper" :data="songSheet">
        <div class="main-content">
          <slider v-if="sliderImages.length">
            <div class="img-wrapper" v-for="(item, index) in sliderImages" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" @load="imgLoaded">
              </a>
            </div>
          </slider>
          <h2>推荐热门歌单</h2>
          <ul class="song-sheet-list" v-if="songSheet.length">
            <li v-for="item in songSheet">
              <img v-lazy="item.imgurl" alt="">
              <div class="desc-wrapper">
                <p>{{ item.creator.name }}</p>
                <p>{{ item.dissname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
    </loading>
  </div>
</template>

<script>
  import Loading from '@/components/common/loading'
  import Scroll from '@/components/common/scroll'
  import Slider from '@/components/common/slider'
  import { getSliderData, getSongSheet } from '@/api/getRecommend'

  export default {
    name: 'recommend',
    components: {
      Loading,
      Scroll,
      Slider
    },
    created () {
      setTimeout(() => {
        this._getSliderData()
        this._getSongSheet()
      }, 2000)
    },
    methods: {
      _getSliderData () {
        let self = this
        getSliderData().then(response => {
          if (response.code === 0) {
            self.sliderImages = response.data.slider
          }
        }).catch(error => {
          console.log(error)
        })
      },
      _getSongSheet () {
        let self = this
        getSongSheet().then(response => {
          if (response.code === 0) {
            console.log(response.data.list)
            self.songSheet = response.data.list
          }
        }).catch(error => {
          console.log(error)
        })
      },
      imgLoaded () {
        if (!this.loadOneImage) {
          this.loadOneImage = true
          this.$refs.scroller.refresh()
        }
      }
    },
    data () {
      return {
        sliderImages: [],
        songSheet: [],
        loadOneImage: false
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .main-content-wrapper
    background-color: $color-background
    .scroll-wrapper
      height: 100%
      overflow: hidden
      .main-content
        background-color: $color-background
        .img-wrapper
          display: inline-block
          vertical-align: middle
          a
            display: block
            width: 100%
            img
              width: 100%
              vertical-align: middle

        h2
          color: $color-theme
          font-size: $font-size-medium
          font-weight: normal
          text-align: center
          line-height: 40px
          border-bottom: 1px solid $color-text-d
        .song-sheet-list
          li
            height: 90px
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            box-sizing: border-box
            padding: 5px 10px
            overflow: hidden
            img
              float: left
              width: 80px
              height: 80px
            .desc-wrapper
              position: relative
              height: 80px
              margin-left: 90px
              color: $color-text
              font-size: $font-size-medium
              p
                &:nth-of-type(1)
                  line-height: 40px
                &:nth-of-type(2)
                  position: absolute
                  left: 0px
                  bottom: 0px
                  color: $color-text-d
                  line-height: 20px
</style>

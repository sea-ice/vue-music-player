<template>
  <div class="slider-wrapper" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <div class="img-wrapper" v-for="(item, index) in sliderImages" :key="index">
        <a :href="item.linkUrl">
          <img :src="item.picUrl" alt="" @load="imgLoaded">
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span class="dot" v-for="(dot, index) in dots" :class="{ 'active-dot': currentIndex === index }"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'slider',
    data () {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      },
      sliderImages: {
        type: Array,
        default () {
          return []
        }
      }
    },
    mounted () {
      this.imgCount = 0
      window.addEventListener('resize', () => {
        if (!this.sliderGroup) return
        this._setSliderWidth(true)
        this.scroll.refresh()
      })
    },
    methods: {
      _setSliderWidth (isResize) {
        let width = 0
        this.sliderGroup = this.$refs.sliderGroup
        let viewportWidth = document.documentElement.clientWidth || document.body.clientWidth;
        [].forEach.call(this.sliderGroup.querySelectorAll('.img-wrapper'), v => {
          v.style.width = viewportWidth + 'px'
          width += viewportWidth
        })
        if (this.loop && !isResize) width += 2 * viewportWidth
        this.sliderGroup.style.width = width + 'px'
      },
      _initSliderDots () {
        this.dots = new Array(this.sliderGroup.children.length)
      },
      _initSlider () {
        let self = this
        this._setSliderWidth()
        this._initSliderDots()

        let scroll = this.scroll = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 800
        })
        scroll.on('scrollEnd', () => {
          let pageIndex = scroll.getCurrentPage().pageX
          self.currentIndex = self.loop ? pageIndex - 1 : pageIndex
          if (self.autoPlay) self._play()
        })
        scroll.on('touchend', () => {
          if (self.timer) clearTimeout(self.timer)
        })
        if (this.autoPlay) this._play()
      },
      _play () {
        let nextIndex = this.currentIndex + (this.loop ? 2 : 1)
        this.timer = setTimeout(() => {
          this.scroll.goToPage(nextIndex, 0, 400)
        }, this.interval)
      },
      imgLoaded () {
        this.$emit('imgLoaded')
        // 需要等到所有轮播图片都加载完毕才初始化此组件
        if (++this.imgCount === this.sliderImages.length) {
          this._initSlider()
        }
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .slider-wrapper
    position: relative
    overflow: hidden
    .slider-group
      font-size: 0
      white-space: nowrap
      overflow: hidden
    .dots-wrapper
      position: absolute
      width: 100%
      text-align: center
      line-height: 30px
      left: 0px
      bottom: 0px
      .dot
        display: inline-block
        width: 4px
        height: 4px
        background-color: #fff
        -webkit-border-radius: 3px
        -moz-border-radius: 3px
        border-radius: 3px
        &:not(:first-child)
          margin-left: 10px
        &.active-dot
          width: 12px
  .img-wrapper
    display: inline-block
    vertical-align: middle
    a
      display: block
      width: 100%
      img
        width: 100%
        vertical-align: middle
</style>

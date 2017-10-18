<template>
  <div class="slider-wrapper" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
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
      }
    },
    mounted () {
      let self = this
      this._initSlider()
      window.addEventListener('resize', () => {
        if (!this.sliderGroup) return
        self._setSliderWidth(true)
        self.scroll.refresh()
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
        let self = this
        let nextIndex = this.currentIndex + (this.loop ? 2 : 1)
        this.timer = setTimeout(() => {
          self.scroll.goToPage(nextIndex, 0, 400)
        }, this.interval)
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
</style>

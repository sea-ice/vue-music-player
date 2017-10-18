<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'scroll',
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenScrollEnd: {
        type: Boolean,
        default: false
      },
      bounce: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: []
      }
    },
    mounted () {
      setTimeout(() => {
        this._initBScroll()
      }, 20)
    },
    methods: {
      _initBScroll () {
        this.scroll = new BScroll(this.$refs.scroll, {
          probeType: this.probeType,
          click: this.click,
          bounce: this.bounce
        })
        if (this.listenScroll) {
          this.scroll.on('scroll', e => {
            this.$emit('scroll', e)
          })
        }
        if (this.listenScrollEnd) {
          this.scroll.on('scrollEnd', e => {
            this.$emit('scrollEnd', e)
          })
        }
      },
      _enableScroll () {
        this.scroll && this.scroll.enable()
      },
      _disableScroll () {
        this.scroll && this.scroll.disable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      yScrollTo (yPos) {
        this.scroll && this.scroll.scrollTo(0, yPos, 0)
      }
    },
    watch: {
      data (newValue, oldValue) {
        if (newValue !== oldValue) {
          setTimeout(() => {
            this.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<template>
  <div class="loading-wrapper">
    <div v-if="loading" class="loading">
      <i></i>
      <p>正在载入...</p>
    </div>
    <slot v-if="!loading"></slot>
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .loading-wrapper
    position: relative
    width: 100%
    height: 100%
    .loading
      position: absolute
      width: 100%
      margin:
        top: -25px
      top: 50%
      text-align: center
      i
        display: block
        width: 24px
        height: 24px
        margin: 0 auto
        background-image: url(../../assets/icons/loading-spinner.svg)
        -webkit-background-size: contain
        background-size: contain
        background-repeat: no-repeat
        -webkit-animation: loading-spinner 1.2s linear
        -o-animation: loading-spinner 1.2s linear
        animation: loading-spinner 1.2s linear
      p
        line-height: 26px
        color: $color-text
        font-size: $font-size-small
    @keyframes loading-spinner
      0%
        -webkit-transform: rotate(1deg)
        -moz-transform: rotate(1deg)
        -ms-transform: rotate(1deg)
        -o-transform: rotate(1deg)
        transform: rotate(1deg)
      100%
        -webkit-transform: rotate(360deg)
        -moz-transform: rotate(360deg)
        -ms-transform: rotate(360deg)
        -o-transform: rotate(360deg)
        transform: rotate(360deg)
</style>

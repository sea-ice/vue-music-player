<template>
  <div class="play-button">
    <svg
      class="progress-circle"
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="transparent"></circle>
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      ></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'progress-circle',
    props: {
      radius: {
        type: Number,
        default: 100
      },
      percentage: {
        type: Number,
        default: 0
      }
    },
    computed: {
      dashOffset () {
        return (1 - this.percentage) * this.dashArray
      }
    },
    data () {
      return {
        dashArray: Math.PI * 100
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .play-button
    position: relative
    .progress-circle
      circle
        -webkit-transform-origin: 50% 50%
        -moz-transform-origin: 50% 50%
        -ms-transform-origin: 50% 50%
        -o-transform-origin: 50% 50%
        transform-origin: 50% 50%
        stroke-width: 6px
      circle:first-child
        transform: scale(0.9)
        stroke: $color-text
      circle:nth-child(2)
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>

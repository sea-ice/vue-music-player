<template>
  <header class="header">
    <h1>
      <i></i>
      <i @click="userCenter"></i>
      World of Music
    </h1>
  </header>
</template>

<script>
  export default {
    name: 'mainHeader',
    methods: {
      userCenter () {
        this.$emit('userCenter')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  @import '../../assets/sass/variables'
  header
    background-color: $color-background
    color: $color-text
    height: 44px
    border-bottom: 1px solid $color-theme-d
    padding:
      left: 10px
      right: 10px
    h1
      line-height: 44px
      font-size: $font-size-medium
      text-align: center
      margin: 0
      font-weight: normal
      i
        display: inline-block
        width: 30px
        height: 30px
        margin-top: 7px
        vertical-align: top
        -webkit-background-size: contain
        background-size: contain
        &:first-of-type
          background-image: url(../../assets/icons/music.svg)
        &:nth-of-type(2)
          float: right
          background-image: url(../../assets/icons/user.svg)
</style>

<template>
  <ul class="tab-container">
    <li>
      <router-link to="/recommend">推荐</router-link>
    </li>
    <li>
      <router-link to="/rank">排行</router-link>
    </li>
    <li>
      <router-link to="/singer">歌手</router-link>
    </li>
    <li>
      <router-link to="/search">搜索</router-link>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'tab'
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .tab-container
    display: flex
    justify-content: space-between
    background-color: $color-background
    li
      width: 25%
      text-align: center
      padding:
        top: 5px
        bottom: 8px
      a
        display: inline-block
        line-height: 21px
        color: $color-text
        font-size: $font-size-small-s
      .router-link-active
        color: $color-theme
        border-bottom: 1px solid $color-theme
</style>

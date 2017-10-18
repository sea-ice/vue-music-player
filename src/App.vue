<template>
  <div id="app">
    <main-header @userCenter="userCenter"></main-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MainHeader from '@/components/common/mainHeader'
  import Tab from '@/components/tab/tab'
  import Player from '@/components/player/player'
  export default {
    name: 'app',
    components: {
      MainHeader,
      Tab,
      Player
    },
    methods: {
      userCenter () {
        this.$router.push({
          path: '/userCenter'
        })
      }
    }
  }
</script>

<style scoped lang="sass">
  .header, .tab-container
    position: relative
  .main-content-wrapper
    position: fixed
    width: 100%
    left: 0px
    top: 80px
    bottom: 44px
    overflow: hidden
</style>

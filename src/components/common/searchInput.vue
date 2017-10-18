<template>
  <div class="input-wrapper">
    <i></i>
    <div class="input">
      <input type="text" v-model="query" :placeholder="placeholder">
      <i v-show="query" @click="clearInput"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'searchInput',
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      },
      selectQuery: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        query: ''
      }
    },
    watch: {
      query (newQuery) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$emit('query', newQuery)
        }, 200)
      },
      selectQuery (newQuery) {
        this.query = newQuery
      }
    },
    methods: {
      clearInput () {
        this.$emit('clearInput')
      }
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .input-wrapper
    display: flex
    justify-content: space-between
    align-items: center
    padding: 3px 5px
    background-color: $color-dialog-background
    i
      display: block
      width: 26px
      height: 26px
      -webkit-background-size: contain
      background-size: contain
      flex-grow: 0
      background-image: url(../../assets/icons/search.svg)
    .input
      position: relative
      display: flex
      flex-grow: 1
      margin-left: 5px
      i
        position: absolute
        width: 26px
        height: 26px
        -webkit-background-size: contain
        background-size: contain
        background-image: url(../../assets/icons/clear.svg)
        right: 5px
        margin-top: 2px
      input
        flex-grow: 1
        height: 30px
        outline: none
        border: none
        padding:
          left: 5px
          right: 36px
        background-color: #fff
        -webkit-border-radius: 3px
        -moz-border-radius: 3px
        border-radius: 3px
        font-weight: lighter
</style>

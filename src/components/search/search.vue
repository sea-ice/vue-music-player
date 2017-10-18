<template>
  <div class="main-content-wrapper">
    <search-input
      @query="handleQuery"
      :selectQuery="query"
      @clearInput="clearInput"
    ></search-input>
    <search-result
      :result="searchResult"
      v-if="query"
      :loading="loading"
      :hasMoreData="hasMoreData"
      :query="query"
      @scrollToEnd="searchMore"
      @saveSearchHistory="saveQuery"
      @singerDetail="singerDetail"
      @selectSong="selectSong"
    ></search-result>
    <div class="hot-and-history" v-if="!query">
      <div class="hot-words-wrapper">
        <h2>大家都在搜：</h2>
        <ul class="hot-words">
          <li v-for="item in hotKeys">
            <a href="javascript:void(0)" @click="chooseKeyword(item.k)">{{ item.k }}</a>
          </li>
        </ul>
      </div>
      <search-history
        :history="searchHistory"
        @chooseHistory="chooseKeyword"
      ></search-history>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchInput from '@/components/common/searchInput'
  import SearchResult from '@/components/common/searchResult'
  import SearchHistory from '@/components/common/searchHistory'
  import { getHotKeys, getSearchResult } from '@/api/getSearchResult'
  import Singer from '@/assets/js/Singer'
  import { createSong } from '@/assets/js/Song'
  import { mapState, mapMutations, mapActions } from 'vuex'

  const HOT_KEYS_COUNT = 10
  const ITEMS_PERPAGE = 20
  export default {
    name: 'search',
    components: {
      SearchInput,
      SearchResult,
      SearchHistory
    },
    computed: {
      ...mapState([
        'searchHistory'
      ])
    },
    data () {
      return {
        hotKeys: [],
        searchResult: [],
        searchPage: 1,
        query: '',
        loading: false,
        hasMoreData: true
      }
    },
    mounted () {
      this.getHotKeys()
    },
    methods: {
      getHotKeys () {
        getHotKeys().then(response => {
          this.hotKeys = response.data.hotkey.slice(0, HOT_KEYS_COUNT)
        }).catch(error => {
          console.log(error)
        })
      },
      chooseKeyword (k) {
        this.query = k
      },
      clearInput () {
        this.query = ''
      },
      saveQuery (query) {
        this.saveSearchHistory(query)
      },
      singerDetail (singer) {
        this.setSinger(singer)
        this.$router.push(`/search/${singer.id}`)
      },
      selectSong (song) {
        this.insertSong(song)
      },
      handleQuery (newQuery) {
        if (!newQuery.trim()) return
        this.searchPage = 1
        this.query = newQuery
        this.loading = true
        this.hasMoreData = true
        getSearchResult(newQuery, this.searchPage, ITEMS_PERPAGE).then(response => {
          console.log(response.data)
          this.searchResult = this._normalizeSearchResult(response.data)
          let song = response.data.song
          if (song.list.length === 0 || song.curpage * ITEMS_PERPAGE >= song.totalnum) {
            this.hasMoreData = false
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      },
      searchMore () {
        if (!this.hasMoreData) return
        this.loading = true
        getSearchResult(this.query, ++this.searchPage, ITEMS_PERPAGE).then(response => {
          console.log(response.data)
          this.searchResult = this.searchResult.concat(this._normalizeSearchResult(response.data))
          let song = response.data.song
          if (song.curpage * ITEMS_PERPAGE >= song.totalnum) {
            this.hasMoreData = false
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
      },
      _normalizeSearchResult (data) {
        let result = []
        if (data.zhida.type === 2) {
          let zhida = data.zhida
          result.push(new Singer({
            id: zhida.singermid,
            name: zhida.singername
          }))
        }
        if (data.song.list.length) {
          let list = data.song.list
          result = result.concat(list.map(song => {
            return createSong(song)
          }))
        }
        return result
      },
      ...mapMutations([
        'setSinger',
        'saveSearchHistory'
      ]),
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .main-content-wrapper
    background-color: $color-background
    .hot-words-wrapper
      margin-top: 10px
      h2
        color: $color-text-d
        line-height: 30px
        text-indent: 15px
      .hot-words
        padding:
          top: 10px
          left: 15px
          right: 15px
        li
          display: inline-block
          margin:
            right: 10px
            bottom: 10px
          a
            font-size: $font-size-medium
</style>

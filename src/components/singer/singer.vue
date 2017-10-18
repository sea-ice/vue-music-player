<template>
  <div class="main-content-wrapper" ref="main">
    <singer-list
      ref="singerList"
      :singerList="singerList"
      @showSingerDetails="showSingerDetails"
    ></singer-list>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { getSingerList } from '@/api/getSingerList'
  import Singer from '@/assets/js/Singer'
  import SingerList from '@/components/singer/singerList'
  import { mapMutations } from 'vuex'

  const HOT_SINGER_COUNT = 10
  const HOT_NAME = '热门'
  export default {
    name: 'singer',
    created () {
      this._getSingerList()
    },
    components: {
      SingerList
    },
    data () {
      return {
        singerList: []
      }
    },
    methods: {
      formatSingerList (list) {
        let singerGroup = {}
        list.forEach(v => {
          if (!singerGroup[v.Findex]) singerGroup[v.Findex] = []
          singerGroup[v.Findex].push(new Singer({
            id: v.Fsinger_mid,
            name: v.Fsinger_name
          }))
        })

        let indexedSingerList = []
        let specialItems = []
        for (let key in singerGroup) {
          let items = singerGroup[key]
          if (!key.match(/[a-zA-Z]/)) {
            specialItems = specialItems.concat(items)
          } else {
            indexedSingerList.push({
              title: key,
              items
            })
          }
        }
        if (specialItems.length) {
          indexedSingerList.push({
            title: '#',
            items: specialItems
          })
        }
        indexedSingerList.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        // 添加热门歌手
        indexedSingerList.unshift({
          title: HOT_NAME,
          otherTitle: 'hot',
          items: list.slice(0, HOT_SINGER_COUNT).map(v => {
            return new Singer({
              id: v.Fsinger_mid,
              name: v.Fsinger_name
            })
          })
        })

        return indexedSingerList
      },
      showSingerDetails (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList () {
        let self = this
        getSingerList().then(response => {
          let list = response.data.list
          if (list.length) {
            self.singerList = self.formatSingerList(list)
            console.log(self.singerList)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      ...mapMutations([
        'setSinger'
      ])
    }
  }
</script>

<style scoped lang="sass">
  @import '../../assets/sass/variables'
  .main-content-wrapper
    background-color: $color-background
    .slide-enter, .slide-leave-to
      transform: translate3d(100%, 0, 0)
      opacity: 0
    .slide-enter-to, .slide-leave
      transform: translate3d(0, 0, 0)
      opacity: 1
    .slide-enter-active, .slide-leave-active
      -webkit-transition: all .5s
      -moz-transition: all .5s
      -ms-transition: all .5s
      -o-transition: all .5s
      transition: all .5s
</style>

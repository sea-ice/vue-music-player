import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'
import Rank from '@/components/rank/rank'
import RankDetails from '@/components/rank/rankDetails'
import Singer from '@/components/singer/singer'
import Search from '@/components/search/search'
import SingerDetails from '@/components/singer/singerDetails'
import UserCenter from '@/components/user/userCenter'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetails
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetails
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetails
        }
      ]
    },
    {
      path: '/userCenter',
      component: UserCenter
    }
  ]
})

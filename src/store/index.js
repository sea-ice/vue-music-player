import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import state from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

let debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store

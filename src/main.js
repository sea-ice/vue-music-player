import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from '@/store'

import '@/assets/sass/reset.sass'
import '@/assets/sass/base.sass'
fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('./assets/images/music.jpeg')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

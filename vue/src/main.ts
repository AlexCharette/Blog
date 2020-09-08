import Vue from 'vue'
import './plugins/base'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import { ApiService } from '@/services/api.service'
import { TokenService } from '@/services/storage.service'

Vue.config.productionTip = false

ApiService.init(process.env.VUE_APP_ROOT_API)

// If token exists set header
if (TokenService.getToken()) {
  ApiService.setHeader()
}

// const token = localStorage.getItem('user-token')

// if (token) {
//   axios.defaults.headers.common['Authorization'] = token
// }

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

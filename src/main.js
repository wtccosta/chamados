import Vue from 'vue'
import App from './App.vue'
import store from './../src/store'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueMask from 'v-mask'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('v-select', vSelect)
Vue.use(VueMask)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// buefy
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/app.css';
import '@/permission'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
const dayjs = require('dayjs');

dayjs.extend(relativeTime)

Vue.use(Buefy)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

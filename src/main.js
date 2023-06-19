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
import {format} from "date-fns";
const dayjs = require('dayjs');
import animated from 'animate.css'
import 'font-awesome/css/font-awesome.min.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.use(animated)
dayjs.extend(relativeTime)

Vue.use(Buefy)
Vue.use(ElementUI)

Vue.filter('date', (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

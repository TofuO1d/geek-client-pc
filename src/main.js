import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import router from '@/router'
import http from '@/utils/http.js'
import MyChannel from '@/components/my-channel.vue'
Vue.prototype.$http = http
Vue.component(MyChannel.name, MyChannel)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

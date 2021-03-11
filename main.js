import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import Utils from './common/utils'
import store from './store'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$store = store
App.mpType = 'app'
Vue.prototype.Utils = Utils
const app = new Vue({
    ...App
})

app.$mount()

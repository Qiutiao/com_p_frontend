import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui';
import  'element-ui/lib/theme-chalk/index.css'
import VuePageStack from 'vue-page-stack';
import './assets/css/normalize.css';

Vue.config.productionTip = false;

Vue.use(Element);
Vue.use(VuePageStack, { router, keyName: 'ame' });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

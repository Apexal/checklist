import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';

Vue.config.productionTip = false;

Vue.use(VueRouter);

import router from './router.js';

// eslint-disable-next-line
const app = new Vue({
  render: h => h(App),
  router
}).$mount('#app');

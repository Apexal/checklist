import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import VueFire from 'vuefire';

// eslint-disable-next-line
import db from './firebase.js';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueFire);

import router from './router.js';

// eslint-disable-next-line
const app = new Vue({
  render: h => h(App),
  router
}).$mount('#app');

import VueRouter from 'vue-router';

// Pages
import Home from './pages/Home.vue';

import Checklist from './pages/Checklist.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/checklist/:action', component: Checklist }
];

export default new VueRouter({
  routes,
  mode: 'history'
});

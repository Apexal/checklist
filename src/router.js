import VueRouter from 'vue-router';

// Pages
import Home from './pages/Home.vue';
import Checklist from './pages/Checklist.vue';
import Browse from './pages/Browse.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/checklist/browse', component: Browse },
  { path: '/checklist/:key', component: Checklist },
  { path: '*', redirect: '/' }
];

export default new VueRouter({
  routes,
  mode: 'history'
});

import VueRouter from 'vue-router';

// Pages
import Home from './pages/Home.vue';

import Checklist from './pages/Checklist.vue';
import ChecklistCreator from './pages/ChecklistCreator.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/checklist', component: Checklist },
  { path: '/checklist/create', component: ChecklistCreator }
];

export default new VueRouter({
  routes,
  mode: 'history'
});

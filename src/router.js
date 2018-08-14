import VueRouter from 'vue-router';

// Pages
import Home from './pages/Home.vue';
import ChecklistCreator from './pages/ChecklistCreator.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/checklist/create', component: ChecklistCreator }
];

export default new VueRouter({
  routes,
  mode: 'history'
});

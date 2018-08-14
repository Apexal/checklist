import VueRouter from 'vue-router';

// Components
import Home from './pages/Home.vue';

const routes = [{ path: '/', component: Home }];

export default new VueRouter({
  routes
});

import Vue from 'vue';
import Router from 'vue-router';
import VirtualScrollTable from '@/example/virtualScrollTable.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Virtual Scroll Table',
      component: VirtualScrollTable,
    },
  ],
});

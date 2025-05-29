import MemberManagement from '@/components/MemberManagement.vue';
import UsersView from '@/views/UsersView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'users',
      // component: UsersView,
      component: MemberManagement,
    },
  ],
});

export default router;

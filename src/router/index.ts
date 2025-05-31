import CleaningSchedule from '@/components/CleaningSchedule.vue';
import MemberManagement from '@/components/MemberManagement.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'users',
      component: MemberManagement,
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: CleaningSchedule,
    },
  ],
});

export default router;

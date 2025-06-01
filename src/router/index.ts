import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import CleaningSchedule from '@/components/CleaningSchedule.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: CleaningSchedule,
    },
  ],
});

export default router;

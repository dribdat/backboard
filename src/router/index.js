import { createRouter, createWebHistory } from 'vue-router'
import Challenges from '../components/Challenges.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Challenges',
      component: Challenges,
      props: true,
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: Challenges,
      props: true,
    },
  ],
})

export default router

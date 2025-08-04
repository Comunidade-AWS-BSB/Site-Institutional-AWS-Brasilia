// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SpeakerDetailView from '@/views/SpeakerDetailView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',                   // página inicial
      name: 'home',
      component: HomeView,
    },
    {
      path: '/speaker-details',    // rota de detalhes
      name: 'speaker-details',
      component: SpeakerDetailView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router

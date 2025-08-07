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
      // meta: { protected: true }, // exemplo de rota protegida (desativado no MVP)
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// TODO(auth): quando habilitar proteção de rotas, usar o guard abaixo.
// Mantemos desativado neste MVP; o modal será aberto pelo Header e UI store.
// import { useAuthStore } from '@/stores/auth.store'
// import { useUiStore } from '@/stores/ui.store'
// router.beforeEach(async (to) => {
//   const auth = useAuthStore()
//   const ui = useUiStore()
//   if (!auth.snapshot.userId) await auth.bootstrap()
//   if (to.meta?.protected && !auth.isLoggedIn) {
//     // Ao invés de redirecionar, podemos abrir o modal:
//     ui.openAuthModal()
//     return false
//   }
// })

export default router

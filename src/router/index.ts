import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { fetchAuthSession } from 'aws-amplify/auth'

import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
const EventView = () => import('@/views/EventView.vue')
const EventHistoryView = () => import('@/views/EventHistoryView.vue')
const StoreView = () => import('@/views/StoreView.vue')
import SpeakerDetailView from '@/views/SpeakerDetailView.vue'

import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import UseTermsView from '@/views/UseTermsView.vue'
import ProfileSettingsView from '@/views/ProfileSettingsView.vue'
const UsersHubView = () => import('@/views/UsersHubView.vue')

// Helper: extrai grupos do ID token de forma segura
function getGroupsFromSession(session: Awaited<ReturnType<typeof fetchAuthSession>>): string[] {
  const raw = session.tokens?.idToken?.payload?.['cognito:groups']
  if (!raw) return []
  // O payload pode vir como string[] ou string; normaliza para string[]
  return Array.isArray(raw) ? raw.map(String) : [String(raw)]
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',                   // página inicial
    name: 'home',
    component: HomeView,
  },
  {
    path: '/hub',
    name: 'users-hub',
    component: UsersHubView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/speakers/:id',    // detalhes de palestrante
    name: 'speaker-details',
    component: SpeakerDetailView,
    // meta: { protected: true }, // exemplo de rota protegida (desativado no MVP)
  },
  {
    path: '/event/:id',     // EventTab
    name: 'event-details',
    component: EventView,
  },
  {
    path: '/event',
    name: 'event',
    redirect: { name: 'event-details', params: { id: 'current' } }
  },
  {
    path: '/events',
    name: 'event-history',
    component: EventHistoryView,
  },
  {
    path: '/store',              // Lojinha
    name: 'store',
    component: StoreView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPolicyView
  },
  {
    path: '/terms',
    name: 'terms',
    component: UseTermsView
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const ui = useUiStore()

  // Garante que o snapshot exista
  if (!auth.snapshot.userId) {
    await auth.bootstrap()
  }

  // Rota que exige autenticação (genérica)
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/', query: { login: 'required', next: to.fullPath } }
  }

  // Se a rota não exige admin, segue o baile
  if (!to.meta.requiresAdmin) return true

  // Precisa estar logado
  if (!auth.isLoggedIn) {
    // opcional: ui.toast('Você precisa entrar para acessar o Admin')
    return { path: '/', query: { login: 'required', next: to.fullPath } }
  }

  // Verifica grupo ADMINS no ID token
  try {
    const session = await fetchAuthSession()
    const groups = getGroupsFromSession(session)
    const isAdmin = groups.includes('ADMINS')

    if (!isAdmin) {
      // opcional: ui.toast('Acesso negado: apenas administradores')
      return { path: '/', query: { denied: 'admin' } }
    }

    return true
  } catch {
    // Falha ao ler sessão → trata como não autorizado
    return { path: '/', query: { denied: 'session' } }
  }
})

export default router

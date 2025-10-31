<template>
  <!-- Header com blur/sombra para legibilidade sobre o carousel -->
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500 supports-[backdrop-filter]:backdrop-blur-md',
    isScrolled
      ? 'bg-white/70 shadow-md dark:bg-black/50'
      : 'bg-white/40 shadow-sm dark:bg-black/30'
  ]">
    <div
      class="container mx-auto px-4 py-4 flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/10">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2 transition-transform hover:scale-105">
        <img src="/img/logo.png" alt="AWS User Group Brasília" class="h-8 w-auto">
      </router-link>

      <!-- Navegação Desktop -->
      <nav class="hidden lg:flex items-center gap-6">
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
          class="inline-flex h-9 items-center px-1 text-sm font-medium leading-none text-foreground/80 hover:text-primary transition-colors duration-200 relative"
          :aria-current="isActiveRoute(link.to) ? 'page' : undefined">
          {{ link.text }}
          <span
            class="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-[width] duration-200" />
        </router-link>

        <!-- CTA destacado: Próximo evento (altura alinhada) -->
        <router-link to="/event"
          class="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-colors duration-200">
          Próximo evento
        </router-link>
      </nav>

      <!-- Ações lado direito (desktop) -->
      <div class="hidden sm:flex items-center gap-3">
        <!-- Quando NÃO logado: botao para abrir modal -->
        <Button v-if="!isLoggedIn" variant="secondary" size="sm"
          class="group inline-flex items-center gap-1 overflow-hidden" aria-label="Entrar ou cadastrar-se"
          @click="openAuthModal">
          <LogIn class="w-4 h-4 shrink-0
                   transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span class="block w-0 opacity-0 -translate-x-1
                   transition-[width,opacity,transform,margin]
                   duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                   group-hover:w-[128px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-1
                   whitespace-nowrap text-sm will-change-[width,opacity,transform]">
            Entre/cadastre-se
          </span>
        </Button>

        <!-- Quando logado: avatar + dropdown -->
        <div v-else class="relative flex items-center gap-2">
          <button
            class="h-9 w-9 rounded-full border border-border overflow-hidden flex items-center justify-center bg-foreground/10"
            @click="toggleMenu"
            aria-label="Abrir menu de usuário"
          >
            <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
            <span v-else class="text-xs font-semibold text-foreground/80">{{ initials }}</span>
          </button>

          <!-- Dropdown -->
          <div v-if="menuOpen" class="absolute right-0 top-10 min-w-[220px] rounded-md border bg-background shadow-lg py-2 z-[60] animate-in fade-in-0 zoom-in-95 duration-150">
            <button class="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5" @click="goProfile('edit')">Profile</button>
            <button class="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5" @click="goProfile('notifications')">Notifications</button>
            <button class="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5" @click="goProfile('interests')">Interests</button>
            <router-link v-if="isAdmin" to="/admin" class="block px-3 py-2 text-sm hover:bg-foreground/5">Admin Panel</router-link>
            <div class="my-2 h-px bg-border"></div>
            <button class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50" @click="signOutAndClose">Sign out</button>
          </div>
        </div>
      </div>

      <!-- Botão Menu Mobile -->
      <Button variant="ghost" size="sm" class="lg:hidden" @click="toggleMobileMenu" aria-label="Abrir menu">
        <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
        <X v-else class="h-5 w-5" />
      </Button>
    </div>

    <!-- Navegação Mobile -->
    <div v-if="isMobileMenuOpen"
      class="lg:hidden bg-white/80 supports-[backdrop-filter]:backdrop-blur-md border-t border-border animate-fade-in-up dark:bg-black/60">
      <nav class="container mx-auto px-4 py-4 space-y-4">
        <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
          class="block text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
          @click="closeMobileMenu">
          {{ link.text }}
        </router-link>

        <!-- CTA mobile: Próximo evento -->
        <router-link to="/event"
          class="block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200 mt-2"
          @click="closeMobileMenu">
          Próximo evento
        </router-link>

        <!-- Link extra no mobile: visível apenas para administradores -->
        <router-link v-if="isAdmin" to="/admin" class="block text-center text-sm font-semibold px-3 py-2 rounded-lg border border-primary/30
         text-primary hover:bg-primary/5 transition-colors duration-200" @click="closeMobileMenu">
          Painel Admin
        </router-link>

        <!-- Mobile: alterna entre abrir modal e sair -->
        <Button v-if="!isLoggedIn" variant="secondary" size="sm" class="w-full mt-4 gap-2"
          aria-label="Entrar ou cadastrar-se" @click="openAuthModal">
          <LogIn class="w-4 h-4" />
          <span>Entre/cadastre-se</span>
        </Button>

        <Button v-else variant="secondary" size="sm" class="w-full mt-4 gap-2" aria-label="Sair" @click="signOut">
          <span>Sair</span>
        </Button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { LogIn, Menu, X, ShieldCheck } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { fetchAuthSession } from 'aws-amplify/auth'
import router from '@/router'
import { useProfile } from '@/composables/useProfile'

interface NavLink {
  text: string
  to: string
}

const navLinks: NavLink[] = [
  { text: 'Home', to: '/' },
  { text: 'Palestrantes', to: '#speakers' },
  { text: 'Galeria', to: '#gallery' },
  { text: 'Contato', to: '#contact' },
  { text: 'Eventos', to: '/events' }
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// Stores
const ui = useUiStore()
const auth = useAuthStore()

const isLoggedIn = computed(() => auth.isLoggedIn)
const displayName = computed(() => auth.displayName)

// Profile/Avatar
const { profile, load: loadProfile, getAvatarUrl } = useProfile()
const avatarUrlRef = ref<string>('')
const avatarUrl = computed(() => avatarUrlRef.value || (auth.snapshot.attributes?.picture ?? ''))
const initials = computed(() => {
  const name = displayName.value || auth.snapshot.attributes?.email || 'U'
  const parts = String(name).trim().split(/\s+/)
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || 'U'
})

// Simple dropdown state
const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
function goProfile(tab: 'edit'|'notifications'|'interests') {
  closeMenu()
  router.push({ path: '/profile', query: { tab } })
}

const isAdmin = ref(false)
async function checkAdmin(): Promise<void> {
  if (!auth.isLoggedIn) {
    isAdmin.value = false
    return
  }

  try {
    const session = await fetchAuthSession()
    const raw = session.tokens?.idToken?.payload?.['cognito:groups']
    const groups = Array.isArray(raw) ? raw.map(String) : raw ? [String(raw)] : []
    isAdmin.value = groups.includes('ADMINS')
  } catch {
    isAdmin.value = false
  }
}

/** rota ativa para aria-current em links do header */
const isActiveRoute = (to: string) => {
  // Considera hash âncoras como não-routables; ativa apenas para rotas puras
  if (to.startsWith('#')) return false
  return router.currentRoute.value.path === to
}

// Métodos de UI/Auth
const openAuthModal = () => ui.openAuthModal()
const signOut = async () => { await auth.doSignOut() }
async function signOutAndClose() { closeMenu(); await signOut() }

// Manipula o evento de rolagem para alterar o estado do cabeçalho
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Alterna o menu mobile aberto/fechado
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Fecha o menu mobile
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Faz scroll suave até a seção especificada
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  closeMobileMenu()
}

// Adiciona o listener de rolagem ao montar o componente
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await checkAdmin()
  if (auth.isLoggedIn) {
    try {
      await loadProfile()
      if (profile.value?.photoKey) {
        const url = await getAvatarUrl(profile.value.photoKey)
        if (url) avatarUrlRef.value = url
      }
    } catch {}
  }
  document.addEventListener('click', onDocumentClick)
})

// Remove o listener de rolagem ao desmontar o componente
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', onDocumentClick)
})

// Reavaliar admin com login/logout
watch(() => auth.snapshot.userId, async () => {
  await checkAdmin()
  if (auth.isLoggedIn) {
    try {
      await loadProfile()
      if (profile.value?.photoKey) {
        const url = await getAvatarUrl(profile.value.photoKey)
        if (url) avatarUrlRef.value = url
      } else {
        avatarUrlRef.value = ''
      }
    } catch {}
  } else {
    menuOpen.value = false
    avatarUrlRef.value = ''
  }
})

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  // fecha se clicar fora do dropdown/btn
  // Heuristic: header container is the top bar; safer to close when clicking anywhere not inside dropdown
  // If needed, we could add refs to check containment; for agora, fecha quando o click não for no botão de avatar
  if (!target.closest('header')) return
  if (!target.closest('button') && !target.closest('.min-w\\[220px\\]')) menuOpen.value = false
}
</script>

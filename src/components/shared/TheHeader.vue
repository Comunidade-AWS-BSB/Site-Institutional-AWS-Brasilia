<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
    isScrolled
      ? 'bg-background/95 backdrop-blur-sm shadow-lg'
      : 'bg-transparent'
  ]">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2 transition-transform hover:scale-105">
        <img src="/img/logo.png" alt="AWS User Group Brasília" class="h-8 w-auto">
      </router-link>

      <!-- Navegação Desktop -->
      <nav class="hidden lg:flex items-center space-x-8">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 relative group"
          :aria-current="isActiveRoute(link.to) ? 'page' : undefined"
        >
          {{ link.text }}
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"
          ></span>
        </router-link>

        <!-- CTA destacado: Próximo evento -->
        <router-link
          to="/events/current"
          class="text-sm font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200"
          aria-current="page"
          v-if="isOnEventsCurrent"
        >
          Próximo evento
        </router-link>
        <router-link
          to="/events/current"
          class="text-sm font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200"
          v-else
        >
          Próximo evento
        </router-link>
      </nav>

      <!-- Ações lado direito (desktop) -->
      <div class="hidden sm:flex items-center gap-2">
        <!-- Quando NÃO logado: botao para abrir modal -->
        <Button
          v-if="!isLoggedIn"
          variant="secondary"
          size="sm"
          class="group inline-flex items-center gap-1 overflow-hidden"
          aria-label="Entrar ou cadastrar-se"
          @click="openAuthModal"
        >
          <LogIn
            class="w-4 h-4 shrink-0
                   transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span
            class="block w-0 opacity-0 -translate-x-1
                   transition-[width,opacity,transform,margin]
                   duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                   group-hover:w-[128px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-1
                   whitespace-nowrap text-sm will-change-[width,opacity,transform]">
            Entre/cadastre-se
          </span>
        </Button>

        <!-- Quando logado: menu simples com Sair -->
        <div v-else class="flex items-center gap-2">
          <span class="text-sm text-foreground/80">Olá, {{ displayName || 'usuário' }}</span>
          <Button variant="secondary" size="sm" @click="signOut">Sair</Button>
        </div>
      </div>

      <!-- Botão Menu Mobile -->
      <Button variant="ghost" size="sm" class="lg:hidden" @click="toggleMobileMenu">
        <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
        <X v-else class="h-5 w-5" />
      </Button>
    </div>

    <!-- Navegação Mobile -->
    <div v-if="isMobileMenuOpen"
      class="lg:hidden bg-background/95 backdrop-blur-sm border-t border-border animate-fade-in-up">
      <nav class="container mx-auto px-4 py-4 space-y-4">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
          @click="closeMobileMenu"
        >
          {{ link.text }}
        </router-link>

        <!-- CTA mobile: Próximo evento -->
        <router-link
          to="/events/current"
          class="block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200 mt-2"
          @click="closeMobileMenu"
        >
          Próximo evento
        </router-link>

        <!-- Mobile: alterna entre abrir modal e sair -->
        <Button
          v-if="!isLoggedIn"
          variant="secondary"
          size="sm"
          class="w-full mt-4 gap-2"
          aria-label="Entrar ou cadastrar-se"
          @click="openAuthModal"
        >
          <LogIn class="w-4 h-4" />
          <span>Entre/cadastre-se</span>
        </Button>

        <Button
          v-else
          variant="secondary"
          size="sm"
          class="w-full mt-4 gap-2"
          aria-label="Sair"
          @click="signOut"
        >
          <span>Sair</span>
        </Button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { LogIn, Menu, X } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

interface NavLink {
  text: string
  to: string
}

const navLinks: NavLink[] = [
  { text: 'Home', to: '/' },
  { text: 'Palestrantes', to: '#speakers' },
  { text: 'Galeria', to: '#gallery' },
  { text: 'Contato', to: '#contact' }
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// Stores
const ui = useUiStore()
const auth = useAuthStore()

const isLoggedIn = computed(() => auth.isLoggedIn)
const displayName = computed(() => auth.displayName)

/** rota ativa para aria-current em links do header */
const isActiveRoute = (to: string) => {
  // Considera hash âncoras como não-routables; ativa apenas para rotas puras
  if (to.startsWith('#')) return false
  return router.currentRoute.value.path === to
}

/** se rota atual é /events/current */
const isOnEventsCurrent = computed(() => router.currentRoute.value.path === '/events/current')

// Métodos de UI/Auth
const openAuthModal = () => ui.openAuthModal()
const signOut = async () => {
  await auth.doSignOut()
}

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
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // bootstrap do auth para refletir sessão após refresh
  auth.bootstrap()
})

// Remove o listener de rolagem ao desmontar o componente
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

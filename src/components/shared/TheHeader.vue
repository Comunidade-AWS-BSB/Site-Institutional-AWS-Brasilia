<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled
        ? 'bg-background/95 backdrop-blur-sm shadow-lg'
        : 'bg-transparent'
    ]"
  >
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link
        to="/"
        class="flex items-center space-x-2 transition-transform hover:scale-105"
      >
        <img
          src="/img/logo.png"
          alt="AWS User Group Brasília"
          class="h-8 w-auto"
        >
      </router-link>

      <!-- Navegação Desktop -->
      <nav class="hidden lg:flex items-center space-x-8">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 relative group"
        >
          {{ link.text }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
        </router-link>
      </nav>

      <!-- Botão CTA -->
      <Button
        variant="default"
        size="sm"
        class="hidden sm:flex"
        @click="scrollToSection('buy-tickets')"
      >
        Comprar Ingressos
      </Button>

      <!-- Botão Menu Mobile -->
      <Button
        variant="ghost"
        size="sm"
        class="lg:hidden"
        @click="toggleMobileMenu"
      >
        <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
        <X v-else class="h-5 w-5" />
      </Button>
    </div>

    <!-- Navegação Mobile -->
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden bg-background/95 backdrop-blur-sm border-t border-border animate-fade-in-up"
    >
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
        <Button
          variant="default"
          size="sm"
          class="w-full mt-4"
          @click="scrollToSection('buy-tickets')"
        >
          Comprar Ingressos
        </Button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-vue-next'

interface NavLink {
  text: string
  to: string
}

const navLinks: NavLink[] = [
  { text: 'Home', to: '#hero' },
  { text: 'Palestrantes', to: '#speakers' },
  { text: 'Eventos', to: '#schedule' },
  { text: 'Local', to: '#venue' },
  { text: 'Galeria', to: '#gallery' },
  { text: 'Contato', to: '#contact' }
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

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
})

// Remove o listener de rolagem ao desmontar o componente
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

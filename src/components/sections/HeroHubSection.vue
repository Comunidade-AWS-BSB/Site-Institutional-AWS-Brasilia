<script setup lang="ts">
/**
 * HeroHubSection
 * - Corrige import/registro de componentes filhos (HeroSection, NextEventSection)
 * - Garante sizing do Carousel de background para evitar colapso de altura
 * - Respeita prefers-reduced-motion
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

import HeroSection from '@/components/sections/HeroSection.vue'
import NextEventSection from '@/components/sections/NextEventSection.vue'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

// Props: permite sobrescrever imagens se necessário
const props = withDefaults(defineProps<{
  images?: string[]
  delay?: number
}>(), {
  images: () => [
    '/img/event-gallery/event-gallery-10.jpg',
    '/img/event-gallery/event-gallery-11.jpg',
    '/img/event-gallery/event-gallery-6.jpg',
    '/img/event-gallery/event-gallery-13.jpg',
    '/img/event-gallery/event-gallery-8.jpg',
  ],
  delay: 4000,
})

// Respeito a preferência do usuário por menos movimento
const prefersReducedMotion = ref(false)
const mediaQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

const updatePRM = () => {
  prefersReducedMotion.value = !!mediaQuery?.matches
}

onMounted(() => {
  updatePRM()
  mediaQuery?.addEventListener?.('change', updatePRM)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener?.('change', updatePRM)
})

// Plugins do Embla (Autoplay somente se o usuário não preferir reduzir movimento)
const plugins = computed(() => {
  if (prefersReducedMotion.value) return []
  return [
    Autoplay({
      delay: props.delay,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  ]
})
</script>

<template>
  <section class="relative isolate max-h-[95vh] overflow-hidden" aria-label="Destaques da comunidade">
    <!-- Background Carousel -->
    <div class="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true" role="presentation">
      <Carousel :opts="{ align: 'start', loop: true }" :plugins="plugins" class="w-full">
        <!-- Fix sizing: força altura mínima responsiva no content e nos itens -->
        <CarouselContent class="h-[min(72vh,720px)] min-h-[420px]">
          <CarouselItem v-for="(img, idx) in props.images" :key="idx" class="h-full min-h-[420px]">
            <div class="relative h-full w-full">
              <img :src="img" :alt="''" class="pointer-events-none h-full w-full select-none object-cover"
                loading="lazy" decoding="async" />
              <!-- Gradient overlay para legibilidade -->
              <!-- <div class="pointer-events-none absolute inset-0"
                style="background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%);"
                aria-hidden="true" /> -->
            </div>
          </CarouselItem>
        </CarouselContent>
        <!-- Sem controles visuais; background decorativo -->
      </Carousel>
    </div>

    <!-- Stack central com Hero + Próximo Evento -->
    <div class="container mx-auto px-[--app-space-6]">
      <!-- Fix parent collapse: padding vertical garantido fora do background -->
      <div class="py-[clamp(2rem,6vw,6rem)]">
        <div class="mx-auto max-w-6xl">
          <!-- Cartão translúcido para legibilidade do conteúdo -->
          <div
            class="rounded-[2vw] border border-white/10 bg-white/70 p-[--app-space-6] transition-colors dark:border-black/30 dark:bg-black/50">

            <!-- Conteúdo do Hero -->
            <HeroSection />

            <!-- Conteúdo do Próximo Evento -->
            <NextEventSection />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Garante que a seção tenha pelo menos a altura do carrossel de fundo */
:where(section) {
  outline: none;
  min-block-size: 420px;
}

/* Se o usuário preferir reduzir movimento, removemos transições */
@media (prefers-reduced-motion: reduce) {
  :where(img) {
    transition: none !important;
    animation: none !important;
  }
}
</style>
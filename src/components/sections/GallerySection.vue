<template>
  <section id="gallery" class="py-16 md:py-24 bg-muted/30">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Galeria
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Veja como foram nossos eventos anteriores.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Grade da Galeria -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="(image, index) in visibleImages"
          :key="index"
          class="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="openLightbox(index)"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Eye class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Carregar Mais -->
      <div v-if="!showAll" class="text-center animate-fade-in-up" style="animation-delay: 0.6s">
        <Button
          variant="outline"
          size="lg"
          @click="loadMore"
          class="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <Plus class="h-4 w-4 mr-2" />
          Ver Mais Fotos
        </Button>
      </div>

      <!-- Modal Lightbox -->
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        @click="closeLightbox"
      >
        <div class="relative max-w-4xl max-h-full">
          <img
            :src="galleryImages[currentImageIndex].src"
            :alt="galleryImages[currentImageIndex].alt"
            class="max-w-full max-h-full object-contain rounded-lg"
          >

          <!-- Botões de Navegação -->
          <Button
            v-if="currentImageIndex > 0"
            variant="ghost"
            size="sm"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            @click.stop="previousImage"
          >
            <ChevronLeft class="h-6 w-6" />
          </Button>

          <Button
            v-if="currentImageIndex < galleryImages.length - 1"
            variant="ghost"
            size="sm"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            @click.stop="nextImage"
          >
            <ChevronRight class="h-6 w-6" />
          </Button>

          <!-- Botão Fechar -->
          <Button
            variant="ghost"
            size="sm"
            class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            @click="closeLightbox"
          >
            <X class="h-6 w-6" />
          </Button>

          <!-- Contador de Imagens -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Eye, Plus, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

interface GalleryImage {
  src: string
  alt: string
}

const showAll = ref(false)
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

// Imagens da Galeria
const galleryImages = ref<GalleryImage[]>([
  { src: '/img/event-gallery/event-gallery-1.jpg', alt: 'Evento AWS User Group - Foto 1' },
  { src: '/img/event-gallery/event-gallery-2.jpg', alt: 'Evento AWS User Group - Foto 2' },
  { src: '/img/event-gallery/event-gallery-3.jpg', alt: 'Evento AWS User Group - Foto 3' },
  { src: '/img/event-gallery/event-gallery-4.jpg', alt: 'Evento AWS User Group - Foto 4' },
  { src: '/img/event-gallery/event-gallery-5.jpg', alt: 'Evento AWS User Group - Foto 5' },
  { src: '/img/event-gallery/event-gallery-6.jpg', alt: 'Evento AWS User Group - Foto 6' },
  { src: '/img/event-gallery/event-gallery-7.jpg', alt: 'Evento AWS User Group - Foto 7' },
  { src: '/img/event-gallery/event-gallery-8.jpg', alt: 'Evento AWS User Group - Foto 8' },
  { src: '/img/event-gallery/event-gallery-9.jpg', alt: 'Evento AWS User Group - Foto 9' },
  { src: '/img/event-gallery/event-gallery-10.jpg', alt: 'Evento AWS User Group - Foto 10' },
  { src: '/img/event-gallery/event-gallery-11.jpg', alt: 'Evento AWS User Group - Foto 11' },
  { src: '/img/event-gallery/event-gallery-12.jpg', alt: 'Evento AWS User Group - Foto 12' },
  { src: '/img/event-gallery/event-gallery-13.jpg', alt: 'Evento AWS User Group - Foto 13' },
  { src: '/img/event-gallery/event-gallery-14.jpg', alt: 'Evento AWS User Group - Foto 14' }
])

// Imagens visíveis
const visibleImages = computed(() => {
  return showAll.value ? galleryImages.value : galleryImages.value.slice(0, 8)
})

// Carregar mais imagens
const loadMore = () => {
  showAll.value = true
}

// Abrir Lightbox
const openLightbox = (index: number) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

// Fechar Lightbox
const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = 'auto'
}

// Imagem anterior
const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Próxima imagem
const nextImage = () => {
  if (currentImageIndex.value < galleryImages.value.length - 1) {
    currentImageIndex.value++
  }
}
</script>

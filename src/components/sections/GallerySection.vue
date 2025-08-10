<!-- src/components/sections/GallerySection.vue -->
<template>
  <section id="gallery" class="py-16 md:py-24 bg-muted/30">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">Galeria</h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Veja como foram nossos eventos anteriores.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Grade -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="(src, index) in visible" :key="index"
             class="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in-up"
             :style="{ animationDelay: `${index * 0.05}s` }"
             @click="openLightbox(index)">
          <img :src="src" alt="" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Eye class="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ver mais -->
      <div v-if="!showAll && (imagesToUse.length > firstBatch)" class="text-center animate-fade-in-up" style="animation-delay: 0.6s">
        <Button variant="outline" size="lg" @click="loadMore">
          <Plus class="h-4 w-4 mr-2" /> Ver Mais Fotos
        </Button>
      </div>

      <!-- Lightbox -->
      <div v-if="lightboxOpen" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" @click="closeLightbox">
        <div class="relative max-w-4xl max-h-full">
          <img :src="imagesToUse[currentImageIndex]" alt="" class="max-w-full max-h-full object-contain rounded-lg" />
          <Button v-if="currentImageIndex > 0" variant="ghost" size="sm"
                  class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  @click.stop="previousImage">
            <ChevronLeft class="h-6 w-6" />
          </Button>
          <Button v-if="currentImageIndex < imagesToUse.length - 1" variant="ghost" size="sm"
                  class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  @click.stop="nextImage">
            <ChevronRight class="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm"
                  class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  @click="closeLightbox">
            <X class="h-6 w-6" />
          </Button>
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {{ currentImageIndex + 1 }} / {{ imagesToUse.length }}
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

const props = defineProps<{ images?: string[] }>()

// fallback local (apenas se S3 estiver vazio)
// const fallback = [
//   '/img/event-gallery/event-gallery-1.jpg',
//   '/img/event-gallery/event-gallery-2.jpg',
//   '/img/event-gallery/event-gallery-3.jpg',
//   '/img/event-gallery/event-gallery-4.jpg',
//   '/img/event-gallery/event-gallery-5.jpg',
//   '/img/event-gallery/event-gallery-6.jpg',
//   '/img/event-gallery/event-gallery-7.jpg',
//   '/img/event-gallery/event-gallery-8.jpg',
//   '/img/event-gallery/event-gallery-9.jpg',
//   '/img/event-gallery/event-gallery-10.jpg',
//   '/img/event-gallery/event-gallery-11.jpg',
//   '/img/event-gallery/event-gallery-12.jpg',
//   '/img/event-gallery/event-gallery-13.jpg',
//   '/img/event-gallery/event-gallery-14.jpg',
// ]

// Vou desativar isso por enquanto, mas podemos adicionar fallbacks no futuro trocando o fallback do ternário para a lista acima
const imagesToUse = computed(() => (props.images?.length ? props.images : []))

const firstBatch = 8
const showAll = ref(false)
const visible = computed(() => showAll.value ? imagesToUse.value : imagesToUse.value.slice(0, firstBatch))

// Lightbox
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

const openLightbox = (idx: number) => { currentImageIndex.value = idx; lightboxOpen.value = true; document.body.style.overflow = 'hidden' }
const closeLightbox = () => { lightboxOpen.value = false; document.body.style.overflow = 'auto' }
const previousImage = () => { if (currentImageIndex.value > 0) currentImageIndex.value-- }
const nextImage = () => { if (currentImageIndex.value < imagesToUse.value.length - 1) currentImageIndex.value++ }
const loadMore = () => { showAll.value = true; /* emit opcional p/ loadMore backend */ }
</script>

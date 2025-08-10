<!-- src/views/HomeView.vue -->
<template>
  <div>
    <!-- Carrossel/Hero com imagens dinâmicas -->
    <HeroHubSection :images="carousel.srcs" />

    <!-- Palestrantes (inalterado) -->
    <SpeakersSection />

    <!-- Galeria dinâmica -->
    <GallerySection :images="gallery.srcs" />

    <SponsorsSection />
    <FaqSection />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import HeroHubSection from '@/components/sections/HeroHubSection.vue'
import SpeakersSection from '@/components/sections/SpeakersSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import SponsorsSection from '@/components/sections/SponsorsSection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

import { onMounted, reactive } from 'vue'
import { useSiteImages } from '@/composables/useSiteImages'
import { SITE_CAROUSEL_PREFIX, SITE_GALLERY_PREFIX } from '@/constants/storage'

// carrossel e galeria do S3 (mesma origem do Admin > GalleryManager)
const carousel = reactive(useSiteImages(SITE_CAROUSEL_PREFIX))
const gallery  = reactive(useSiteImages(SITE_GALLERY_PREFIX))

onMounted(async () => {
  // carregamentos em paralelo
  await Promise.all([carousel.load(true), gallery.load(true)])
})
</script>

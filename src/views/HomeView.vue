<template>
  <div>
    <!-- 1) Hub com Hero + Próximo Evento (com Carousel de fundo) -->
    <HeroHubSection />

    <!-- 2) Palestrantes -->
    <SpeakersSection />

    <!-- 3) Galeria -->
    <GallerySection />

    <!-- 4) Patrocinadores -->
    <SponsorsSection />

    <!-- 5) FAQ -->
    <FaqSection />

    <!-- 6) Contatos (sem endereço) -->
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
</script>

<template>
  <div>
    <!-- 1) Hero novo (comunidade) -->
    <HeroSection />

    <!-- 2) NextEventSection (ex-Hero simplificado) -->
    <NextEventSection />

    <!-- 3) Palestrantes -->
    <SpeakersSection />

    <!-- 4) Galeria -->
    <GallerySection />

    <!-- 5) Patrocinadores -->
    <SponsorsSection />

    <!-- 6) FAQ -->
    <FaqSection />

    <!-- 7) Contatos (sem endereço) -->
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue'
import NextEventSection from '@/components/sections/NextEventSection.vue'
import SpeakersSection from '@/components/sections/SpeakersSection.vue'
import GallerySection from '@/components/sections/GallerySection.vue'
import SponsorsSection from '@/components/sections/SponsorsSection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

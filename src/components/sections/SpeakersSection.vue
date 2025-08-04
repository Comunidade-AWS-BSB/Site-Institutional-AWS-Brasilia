<template>
  <section id="speakers" class="py-16 md:py-24 bg-background">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Palestrantes de eventos
        </h2>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Grade de Palestrantes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <SpeakerCard
          v-for="(speaker, index) in speakers"
          :key="speaker.id"
          :speaker="speaker"
          :class="[
            'animate-fade-in-up',
            `delay-${index * 100}`
          ]"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SpeakerCard from '@/components/shared/SpeakerCard.vue'

interface Speaker {
  id: number
  name: string
  title: string
  imageUrl: string
  social: {
    linkedin?: string
  }
}

const speakers = ref<Speaker[]>([
  {
    id: 1,
    name: 'Patricia Góis',
    title: 'Consultora e Arquiteta Cloud',
    imageUrl: '/img/speakers/speaker-1-2.jpg',
    social: {
      linkedin: '#'
    }
  },
  {
    id: 2,
    name: 'Evandro Pires',
    title: 'AWS Serverless Hero Embaixador',
    imageUrl: '/img/speakers/speaker-2.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/epiresdasilva/?originalSubdomain=br'
    }
  },
  {
    id: 3,
    name: 'Dan Rezende',
    title: 'Solutions Architect',
    imageUrl: '/img/speakers/speaker-3.jpg',
    social: {
      linkedin: '#'
    }
  },
  {
    id: 4,
    name: 'Marcelo Paiva',
    title: 'CTO at Softprime',
    imageUrl: '/img/speakers/speaker-4.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/marcelopaiva/'
    }
  }
])
</script>

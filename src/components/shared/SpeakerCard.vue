<template>
  <div class="group relative overflow-hidden rounded-lg bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
    <!-- Imagem do Palestrante -->
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="speaker.imageUrl"
        :alt="speaker.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      >

      <!-- Sobreposição com informações do palestrante -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <!-- Detalhes do Palestrante -->
          <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h4 class="font-display font-bold text-lg mb-1">
              <router-link
                :to="{ name: 'speaker-details', params: { id: speaker.id } }"
                class="hover:text-primary transition-colors"
              >
                {{ speaker.name }}
              </router-link>
            </h4>
            <p class="text-white/90 text-sm italic mb-3">
              {{ speaker.title }}
            </p>

            <!-- Links Sociais -->
            <div class="flex space-x-2">
              <a
                v-if="speaker.social.linkedin"
                :href="speaker.social.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 bg-white/20 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <Linkedin class="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Informações amigáveis para mobile (sempre visíveis em telas pequenas) -->
    <div class="p-4 md:hidden">
      <h4 class="font-display font-bold text-lg text-foreground mb-1">
        <router-link
          :to="{ name: 'speaker-details', params: { id: speaker.id } }"
          class="hover:text-primary transition-colors"
        >
          {{ speaker.name }}
        </router-link>
      </h4>
      <p class="text-muted-foreground text-sm italic mb-3">
        {{ speaker.title }}
      </p>

      <!-- Links Sociais para Mobile -->
      <div class="flex space-x-2">
        <a
          v-if="speaker.social.linkedin"
          :href="speaker.social.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="w-8 h-8 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200"
        >
          <Linkedin class="h-4 w-4" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Linkedin } from 'lucide-vue-next'

interface Speaker {
  id: number
  name: string
  title: string
  imageUrl: string
  social: {
    linkedin?: string
  }
}

defineProps<{
  speaker: Speaker
}>()
</script>

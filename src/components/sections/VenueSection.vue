<template>
  <section id="venue" class="py-16 md:py-24 bg-background">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Local do Evento
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Confira o local de realização do evento
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Informações do Local e Mapa -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-xl mb-16">
        <!-- Mapa -->
        <div class="relative h-64 md:h-96 lg:h-full min-h-[400px] animate-slide-in-left">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.024317735003!2d-47.90197802411197!3d-15.80267172316045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3aea806d74eb%3A0x139eddc3c7f58173!2sUDF%20-%20Centro%20Universit%C3%A1rio%20-%20Campus%20Sede!5e0!3m2!1spt-BR!2sbr!4v1754100867872!5m2!1spt-BR!2sbr"
            class="w-full h-full border-0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Localização do evento"
          ></iframe>
        </div>

        <!-- Informações do Local -->
        <div class="relative bg-gradient-to-br from-primary to-primary/80 text-white p-8 md:p-12 flex items-center animate-slide-in-right">
          <div class="relative z-10">
            <h3 class="font-display font-bold text-2xl md:text-3xl mb-6">
              Centro Universidade UDF
            </h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <MapPin class="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p class="font-medium">Endereço</p>
                  <p class="text-white/90">704/904, Brasília - DF</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <Calendar class="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p class="font-medium">Data</p>
                  <p class="text-white/90">28 de Agosto de 2025</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <Clock class="h-5 w-5 mt-1 flex-shrink-0" />
                <div>
                  <p class="font-medium">Horário</p>
                  <p class="text-white/90">18:40 - 21:00</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Padrão de Fundo -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          </div>
        </div>
      </div>

      <!-- Galeria do Local -->
      <div class="animate-fade-in-up" style="animation-delay: 0.4s">
        <h3 class="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-8">
          Galeria do Local
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(image, index) in venueImages"
            :key="index"
            class="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Calendar, Clock } from 'lucide-vue-next'

interface VenueImage {
  src: string
  alt: string
}

const venueImages = ref<VenueImage[]>([
  {
    src: '/img/venue-gallery/venue-gallery-1.jpg',
    alt: 'Vista externa do Centro Universitário UDF'
  },
  {
    src: '/img/venue-gallery/venue-gallery-2.jpg',
    alt: 'Auditório principal'
  },
  {
    src: '/img/venue-gallery/venue-gallery-3.jpg',
    alt: 'Área de networking'
  },
  {
    src: '/img/venue-gallery/venue-gallery-4.jpg',
    alt: 'Recepção do evento'
  }
])
</script>

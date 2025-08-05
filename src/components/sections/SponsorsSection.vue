<template>
  <section id="sponsors" class="py-16 md:py-24 bg-background">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Patrocinadores
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Agradecemos aos parceiros que apoiam nossa comunidade.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Grade de Patrocinadores -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div
          v-for="(sponsor, index) in sponsors"
          :key="sponsor.id"
          class="group bg-card border border-border rounded-lg p-6 flex items-center justify-center hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <img
            :src="sponsor.logo"
            :alt="sponsor.name"
            class="max-w-full max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
          >
        </div>
      </div>

      <!-- Chamada para Ação -->
      <div class="text-center mt-16 animate-fade-in-up" style="animation-delay: 0.8s">
        <div class="bg-muted/50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 class="font-display font-bold text-xl text-foreground mb-4">
            Quer ser nosso parceiro?
          </h3>
          <p class="text-muted-foreground mb-6">
            Junte-se aos nossos patrocinadores e ajude a fortalecer a comunidade AWS em Brasília.
          </p>
          <Button
            variant="default"
            size="lg"
            @click="contactSponsorship"
            class="hover:scale-105 transition-transform duration-200"
          >
            <Mail class="h-4 w-4 mr-2" />
            Entre em Contato
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-vue-next'

interface Sponsor {
  id: number
  name: string
  logo: string
}

const sponsors = ref<Sponsor[]>([
  {
    id: 1,
    name: 'AWS',
    logo: '/img/clients/client-1.png'
  },
  {
    id: 2,
    name: 'Microsoft Azure',
    logo: '/img/clients/client-2.png'
  },
  {
    id: 3,
    name: 'Google Cloud',
    logo: '/img/clients/client-3.png'
  },
  {
    id: 4,
    name: 'Docker',
    logo: '/img/clients/client-4.png'
  },
  {
    id: 5,
    name: 'Kubernetes',
    logo: '/img/clients/client-5.png'
  },
  {
    id: 6,
    name: 'Terraform',
    logo: '/img/clients/client-6.png'
  },
  {
    id: 7,
    name: 'GitHub',
    logo: '/img/clients/client-7.png'
  },
  {
    id: 8,
    name: 'GitLab',
    logo: '/img/clients/client-8.png'
  }
])

const contactSponsorship = () => {
  // Rola até a seção de contato ou abre o email
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

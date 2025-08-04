<template>
  <div>
    <!-- Título da Página -->
    <section class="relative py-24 bg-gradient-to-r from-primary to-primary/80 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <nav class="flex justify-center mb-6 animate-fade-in-up">
            <ol class="flex items-center space-x-2 text-sm">
              <li>
                <router-link to="/" class="hover:text-primary-foreground/80 transition-colors">
                  Home
                </router-link>
              </li>
              <li class="text-primary-foreground/60">/</li>
              <li class="text-primary-foreground/80">Detalhes do Palestrante</li>
            </ol>
          </nav>

          <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 animate-fade-in-up" style="animation-delay: 0.2s">
            Detalhes do Palestrante
          </h1>
          <p class="text-xl text-primary-foreground/90 animate-fade-in-up" style="animation-delay: 0.4s">
            Conheça mais sobre nossos especialistas em tecnologia AWS
          </p>
        </div>
      </div>
    </section>

    <!-- Detalhes do Palestrante -->
    <section class="py-16 md:py-24 bg-background">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Imagem do Palestrante -->
            <div class="animate-slide-in-left">
              <div class="relative">
                <img
                  :src="speaker.imageUrl"
                  :alt="speaker.name"
                  class="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-xl"
                >
                <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              </div>
            </div>

            <!-- Informações do Palestrante -->
            <div class="animate-slide-in-right">
              <div class="space-y-6">
                <div>
                  <h2 class="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                    {{ speaker.name }}
                  </h2>
                  <p class="text-xl text-primary font-medium mb-4">
                    {{ speaker.title }}
                  </p>

                  <!-- Links Sociais -->
                  <div class="flex space-x-4 mb-6">
                    <a
                      v-if="speaker.social.linkedin"
                      :href="speaker.social.linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Linkedin class="h-5 w-5" />
                    </a>
                    <a
                      v-if="speaker.social.twitter"
                      :href="speaker.social.twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Twitter class="h-5 w-5" />
                    </a>
                    <a
                      v-if="speaker.social.github"
                      :href="speaker.social.github"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Github class="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <!-- Biografia -->
                <div class="prose prose-lg max-w-none">
                  <div class="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      {{ speaker.bio.intro }}
                    </p>
                    <p>
                      {{ speaker.bio.experience }}
                    </p>
                    <p>
                      {{ speaker.bio.expertise }}
                    </p>
                  </div>
                </div>

                <!-- Tags de Especialização -->
                <div>
                  <h3 class="font-display font-semibold text-lg text-foreground mb-3">
                    Áreas de Especialização
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in speaker.skills"
                      :key="skill"
                      class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <!-- Botão Voltar -->
                <div class="pt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    @click="$router.go(-1)"
                    class="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <ArrowLeft class="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Linkedin, Twitter, Github, ArrowLeft } from 'lucide-vue-next'

interface Speaker {
  name: string
  title: string
  imageUrl: string
  bio: {
    intro: string
    experience: string
    expertise: string
  }
  skills: string[]
  social: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

// Dados mockados do palestrante - TODO: trazer isso do back-end
const speaker = ref<Speaker>({
  name: 'Patricia Góis',
  title: 'Consultora e Arquiteta Cloud',
  imageUrl: '/img/speakers/speaker-1-2.jpg',
  bio: {
    intro: 'Patricia é uma profissional experiente em arquitetura de soluções cloud, com mais de 8 anos de experiência em transformação digital e migração para a nuvem.',
    experience: 'Ao longo de sua carreira, ela tem ajudado empresas de diversos setores a modernizar suas infraestruturas, implementando soluções escaláveis e seguras na AWS.',
    expertise: 'Especialista em Terraform, Kubernetes e práticas de DevOps, Patricia é reconhecida por sua capacidade de traduzir requisitos de negócio em soluções técnicas robustas e eficientes.'
  },
  skills: [
    'AWS',
    'Terraform',
    'Kubernetes',
    'DevOps',
    'Infrastructure as Code',
    'Cloud Architecture',
    'CI/CD',
    'Docker'
  ],
  social: {
    linkedin: 'https://linkedin.com/in/patricia-gois',
    twitter: 'https://twitter.com/patricia_gois',
    github: 'https://github.com/patricia-gois'
  }
})
</script>

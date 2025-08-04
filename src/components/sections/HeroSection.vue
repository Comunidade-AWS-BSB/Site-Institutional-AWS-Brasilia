<template>
  <section
    id="hero"
    class="relative min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden"
  >
    <!-- Imagem de Fundo -->
    <div class="absolute inset-0 z-0">
      <img
        src="/img/hero-bg.jpg"
        alt="Hero Background"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 hero-overlay"></div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="relative z-10 container mx-auto px-4 py-20">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Título do Evento -->
        <div class="animate-fade-in-up" style="animation-delay: 0.2s">
          <h1 class="hero-title font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-4">
            MeetUp #16
          </h1>
          <h2 class="hero-subtitle text-2xl md:text-3xl lg:text-4xl font-display font-semibold">
            <span class="text-primary">Infraestrutura como código</span><br>
            Utilizando Terraform na Nuvem
          </h2>
        </div>

        <!-- Data e Local do Evento -->
        <p
          class="hero-subtitle text-lg md:text-xl text-white/90 animate-fade-in-up"
          style="animation-delay: 0.4s"
        >
          28 Agosto 2025, Universidade UDF, Brasília - DF
        </p>

        <!-- Botão de Play -->
        <div
          class="animate-fade-in-up"
          style="animation-delay: 0.6s"
        >
          <button
            class="pulsating-play-btn mx-auto"
            @click="openVideo"
            aria-label="Assistir vídeo do evento"
          >
          </button>
        </div>
      </div>
    </div>

    <!-- Seção de Informações do Evento -->
    <div class="relative z-10 w-full mt-auto">
      <div class="bg-black/50 backdrop-blur-sm py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <!-- Sobre -->
            <div
              class="text-center md:text-left animate-slide-in-left"
              style="animation-delay: 0.8s"
            >
              <h3 class="font-display font-bold text-xl mb-4 text-white">
                Sobre o Evento
              </h3>
              <p class="text-white/90 text-sm leading-relaxed">
                Nesta palestra vamos explorar o conceito de Infraestrutura como Código (IaC)
                e entender por que essa abordagem tem transformado a forma como gerenciamos
                ambientes de TI.
              </p>
            </div>

            <!-- Onde -->
            <div
              class="text-center animate-fade-in-up"
              style="animation-delay: 1s"
            >
              <h3 class="font-display font-bold text-xl mb-4 text-white">
                Onde
              </h3>
              <p class="text-white/90 text-sm leading-relaxed">
                Centro Universidade UDF<br>
                704/904, Brasília - DF
              </p>
            </div>

            <!-- Quando -->
            <div
              class="text-center md:text-right animate-slide-in-right"
              style="animation-delay: 1.2s"
            >
              <h3 class="font-display font-bold text-xl mb-4 text-white">
                Quando
              </h3>
              <p class="text-white/90 text-sm leading-relaxed">
                Quinta Feira<br>
                28 de Agosto 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openVideo = () => {
  // TODO: adicionar integração com YouTube
  window.open('https://www.youtube.com/watch?v=8JI9wQ8sUdQ&t=1s', '_blank')
}
</script>

<style scoped>
/* Garantir que as animações sejam visíveis */
.animate-fade-in-up,
.animate-slide-in-left,
.animate-slide-in-right {
  opacity: 0;
  animation-fill-mode: forwards;
}
</style>

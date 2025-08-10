<template>
  <section id="hero" class="relative overflow-visible">
    <!-- Overlay escuro para contraste -->
    <div class="absolute inset-0 bg-[rgba(0,8,32,0.5)] pointer-events-none rounded-t-xl"></div>

    <div class="container relative mx-auto px-4 py-[var(--app-space-xxxl)] text-center rounded-xl">
      <h1 class="app-display-l text-white">AWS User Group Brasília</h1>
      <p class="app-h3 mt-[var(--app-space-m)] text-white/90">
        Comunidade aberta para aprender e construir na nuvem
      </p>
      <p class="app-body-m mt-[var(--app-space-md)] text-white/80 max-w-2xl mx-auto">
        Somos voluntários e entusiastas de AWS em Brasília. Reunimos iniciantes e especialistas para compartilhar
        experiências, talks e networking. Encontros gratuitos e abertos ao público.
      </p>

      <div class="mt-[var(--app-space-xl)] flex items-center justify-center gap-[var(--app-space-m)]">
        <a href="#faq"
          class="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200">
          Conheça a comunidade
        </a>
        <router-link to="/event"
          class="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg border border-border text-white hover:bg-white/10 transition-colors duration-200">
          Próximo evento
        </router-link>
      </div>

      <!-- hidden pois não tenho certeza sobre se fica muito legal, mas podemos pensar no futuro: -->
      <div class="!w-full flex items-center justify-center mt-5 hidden">
        <img src="/img/logo.png" class="p-4 bg-[rgba(0,8,32,0.8)] rounded-lg" />
      </div>

    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1120px;
}
</style>

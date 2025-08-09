<template>
  <!-- Seção totalmente transparente para deixar o carousel de fundo visível -->
  <section id="hero" class="relative overflow-visible bg-transparent mt-10">
    <div class="container mx-auto px-4 py-[var(--app-space-xxxl)] text-center">
      <h1 class="app-display-l">AWS User Group Brasília</h1>
      <p class="app-h3 mt-[var(--app-space-m)]">Comunidade aberta para aprender e construir na nuvem</p>
      <p class="app-body-m mt-[var(--app-space-md)] text-foreground/80 max-w-2xl mx-auto">
        Somos voluntários e entusiastas de AWS em Brasília. Reunimos iniciantes e especialistas para compartilhar
        experiências, talks e networking. Encontros gratuitos e abertos ao público.
      </p>

      <div class="mt-[var(--app-space-xl)] flex items-center justify-center gap-[var(--app-space-m)]">
        <a href="#faq"
          class="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200">
          Conheça a comunidade
        </a>
        <router-link to="/event"
          class="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted/50 transition-colors duration-200">
          Próximo evento
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Novo Hero focado na comunidade (copy baseada em 08-copys-hero-faq.md - Opção A)
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>

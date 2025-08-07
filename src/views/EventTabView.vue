<template>
  <main class="container mx-auto px-4 py-10">
    <section class="mb-8 mt-10">
      <h1 class="app-h1">Próximo evento</h1>
      <p class="app-body-m mt-2 text-foreground/80">
        Estrutura inicial da EventTab. Conteúdo definitivo será adicionado nos PRs seguintes.
      </p>
    </section>

    <section class="grid gap-6">
      <div class="border rounded-lg p-4">
        <h2 class="app-h2">Header do Evento</h2>
        <p class="app-body-m mt-1">Título, data, status (badge), CTAs “Inscrever-se” e “Compartilhar”.</p>
      </div>

      <div class="border rounded-lg p-4">
        <h2 class="app-h2">Local</h2>
        <p class="app-body-m mt-1">Mapa (iframe) + informações essenciais com acessibilidade.</p>
      </div>

      <div class="border rounded-lg p-4">
        <h2 class="app-h2">Galeria do local</h2>
        <p class="app-body-m mt-1">Grid de imagens com lazy-load.</p>
      </div>

      <div class="border rounded-lg p-4">
        <h2 class="app-h2">Programação</h2>
        <p class="app-body-m mt-1">Lista simples de horários e títulos.</p>
      </div>

      <div class="border rounded-lg p-4">
        <h2 class="app-h2">Regras/Conduta e Acessibilidade</h2>
        <p class="app-body-m mt-1">Links úteis e informações de apoio.</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Placeholder view para cumprir as rotas do PR2.
// O conteúdo completo será implementado no PR4 conforme 04-migracao-PRs.md.
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>
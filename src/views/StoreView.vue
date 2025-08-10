<template>
  <main class="container mx-auto px-4 py-10">
    <section class="mb-8 mt-10">
      <h1 class="app-h1">Lojinha</h1>
      <p class="app-body-m mt-2 text-foreground/80">
        Estrutura inicial da Lojinha. Migração do “Kit Camisa” virá em PRs seguintes.
      </p>
    </section>

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Placeholder de produto -->
      <article class="border rounded-lg p-4 flex flex-col">
        <div class="aspect-video bg-muted/50 rounded-md mb-3"></div>
        <h2 class="app-h3">Kit Camisa</h2>
        <p class="app-body-m mt-1 text-foreground/80">
          Camisa oficial da comunidade (detalhes e tamanhos serão adicionados).
        </p>
        <div class="mt-auto pt-3">
          <a
            href="#contact"
            class="inline-flex items-center justify-center text-sm font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200"
          >
            Falar no contato
          </a>
        </div>
      </article>

      <!-- Espaço para mais produtos -->
      <article class="border rounded-lg p-4 flex flex-col">
        <div class="aspect-video bg-muted/50 rounded-md mb-3"></div>
        <h2 class="app-h3">Em breve</h2>
        <p class="app-body-m mt-1 text-foreground/80">
          Novos itens serão adicionados conforme disponibilidade.
        </p>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
// Placeholder view para cumprir as rotas do PR2.
// O conteúdo completo será implementado no PR5 conforme 04-migracao-PRs.md.
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>
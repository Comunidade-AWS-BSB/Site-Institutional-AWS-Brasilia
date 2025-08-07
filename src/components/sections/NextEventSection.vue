<template>
    <section id="next-event" class="py-[var(--app-space-xl)] mt-2 bg-background">
        <div class="container mx-auto px-4 grid gap-[var(--app-space-xl)] lg:grid-cols-2 items-center">
            <div>
                <h2 class="app-h2">Próximo evento</h2>
                <p class="app-body-m mt-[var(--app-space-s)] text-foreground/80">
                    MeetUp #16 — 28 de agosto de 2025 • Brasília-DF
                </p>
                <p class="app-body-m mt-[var(--app-space-m)] text-foreground/80">
                    Infraestrutura como código: Terraform na nuvem.
                </p>
                <div class="mt-[var(--app-space-l)]">
                    <router-link to="/events/current"
                        class="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200">
                        Ver próximo evento
                    </router-link>
                </div>
            </div>

            <div class="rounded-lg border p-[var(--app-space-md)]">
                <dl class="grid grid-cols-2 gap-[var(--app-space-m)]">
                    <div>
                        <dt class="app-body-s text-foreground/60">Data</dt>
                        <dd class="app-body-m">28/08/2025</dd>
                    </div>
                    <div>
                        <dt class="app-body-s text-foreground/60">Cidade</dt>
                        <dd class="app-body-m">Brasília-DF</dd>
                    </div>
                    <div>
                        <dt class="app-body-s text-foreground/60">Tema</dt>
                        <dd class="app-body-m">Terraform</dd>
                    </div>
                    <div>
                        <dt class="app-body-s text-foreground/60">Status</dt>
                        <dd class="app-body-m">Em breve</dd>
                    </div>
                </dl>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// Seção compacta e sem detalhes de local/galeria/agenda.
// Conteúdos definitivos serão alimentados via EventTab (/events/current).
</script>

<style scoped>
.container {
    max-width: 1120px;
}
</style>
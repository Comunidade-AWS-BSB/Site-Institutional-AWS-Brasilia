<template>
  <main class="min-h-[60vh]">
    <!-- 1) Header do Evento -->
    <section aria-labelledby="event-header-title" class="container mx-auto px-4 py-8 md:py-10 mt-15">
      <div class="mx-auto max-w-4xl text-center">
        <h1 id="event-header-title" class="app-display-m">Próximo encontro da comunidade</h1>
        <p class="app-body-m mt-2 text-foreground/80">
          Quinta-feira, 28 de agosto • 19:00 — 21:30 • Asa Norte, Brasília
        </p>

        <div class="mt-4 flex items-center justify-center gap-3">
          <a href="#event-location"
            class="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-colors">
            Ver local
          </a>
          <a href="#event-agenda"
            class="inline-flex h-9 items-center rounded-md border px-3 text-sm font-semibold hover:bg-muted/50 transition-colors">
            Programação
          </a>
        </div>
      </div>
    </section>

    <!-- 2) Local -->
    <section id="event-location" aria-labelledby="event-location-title" class="container mx-auto px-4 py-8 md:py-10">
      <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div>
          <h2 id="event-location-title" class="app-h3">Local</h2>
          <p class="app-body-m mt-2 text-foreground/80">
            Auditório XYZ, Quadra 707 Norte — Estacionamento no local. Fácil acesso por transporte público.
          </p>
          <address class="not-italic app-body-s mt-2 text-foreground/70">
            SHCN CL QD 707 BL C, Asa Norte, Brasília — DF
          </address>
          <p class="app-body-s mt-2">
            Se precisar de ajuda de acessibilidade, fale com a organização no local ou via e‑mail:
            <a href="mailto:contato@awsubsb.com" class="underline underline-offset-2 hover:no-underline">
              contato@awsubsb.com
            </a>
          </p>
        </div>

        <div class="min-h-[220px] overflow-hidden rounded-xl border">
          <iframe title="Mapa do local do próximo encontro AWS User Group Brasília" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" class="h-full w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.0!2d-47.882!3d-15.780!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1" />
        </div>
      </div>
    </section>

    <!-- 3) Galeria -->
    <section id="event-gallery" aria-labelledby="event-gallery-title" class="container mx-auto px-4 py-8 md:py-10">
      <div class="mx-auto max-w-5xl">
        <h2 id="event-gallery-title" class="app-h3">Galeria</h2>
        <p class="app-body-s mt-2 text-foreground/80">Alguns registros de encontros anteriores.</p>

        <div class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          <img v-for="(img, i) in gallery" :key="i" :src="img" alt="" loading="lazy" decoding="async"
            class="aspect-[4/3] w-full rounded-lg object-cover" />
        </div>
      </div>
    </section>

    <!-- 4) Programação -->
    <section id="event-agenda" aria-labelledby="event-agenda-title" class="container mx-auto px-4 py-8 md:py-10">
      <div class="mx-auto max-w-4xl">
        <h2 id="event-agenda-title" class="app-h3">Programação</h2>
        <ul class="mt-4 space-y-3">
          <li v-for="(slot, i) in agenda" :key="i" class="flex items-start gap-3 rounded-lg border p-3">
            <time class="app-code-s shrink-0 text-foreground/70">{{ slot.time }}</time>
            <div>
              <p class="app-body-m font-semibold">{{ slot.title }}</p>
              <p class="app-body-s text-foreground/80">{{ slot.speaker }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- 5) Regras & Acessibilidade -->
    <section id="event-rules" aria-labelledby="event-rules-title" class="container mx-auto px-4 py-8 md:py-10">
      <div class="mx-auto max-w-4xl">
        <h2 id="event-rules-title" class="app-h3">Regras & Acessibilidade</h2>
        <ul class="mt-3 list-disc space-y-2 pl-5">
          <li>Entrada gratuita e aberta ao público — não é necessário comprar ingressos.</li>
          <li>Espaço inclusivo e respeitoso: siga o código de conduta da comunidade.</li>
          <li>Haverá espaços reservados para PCD e suporte no local.</li>
          <li>Fotos e vídeos podem ser registrados; avise a organização se preferir não aparecer.</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const gallery = [
  '/img/event-gallery/event-gallery-1.jpg',
  '/img/event-gallery/event-gallery-2.jpg',
  '/img/event-gallery/event-gallery-3.jpg',
  '/img/event-gallery/event-gallery-4.jpg',
  '/img/event-gallery/event-gallery-5.jpg',
  '/img/event-gallery/event-gallery-6.jpg',
]

interface AgendaItem {
  time: string
  title: string
  speaker: string
}

const agenda: AgendaItem[] = [
  { time: '19:00', title: 'Boas-vindas e networking', speaker: 'Organização' },
  { time: '19:30', title: 'Infra como Código com AWS CDK', speaker: 'Fulana da Silva' },
  { time: '20:15', title: 'Coffee break', speaker: '—' },
  { time: '20:35', title: 'Serverless na prática', speaker: 'Ciclano de Souza' },
  { time: '21:15', title: 'Q&A + Encerramento', speaker: 'Todos' },
]
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>
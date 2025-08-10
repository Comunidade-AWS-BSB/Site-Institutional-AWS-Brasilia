<template>
  <section id="next-event" class="py-[var(--app-space-xl)] bg-background">
    <div class="container mx-auto px-4 grid gap-[var(--app-space-xl)] lg:grid-cols-2 items-center">
      <!-- Coluna esquerda -->
      <div>
        <h2 class="app-h2">Próximo evento</h2>

        <!-- Loading / vazio -->
        <p v-if="loading" class="app-body-m mt-[var(--app-space-s)] text-foreground/60">Carregando…</p>
        <p v-else-if="!evt" class="app-body-m mt-[var(--app-space-s)] text-foreground/60">
          Nenhum evento futuro encontrado.
        </p>

        <!-- Dados do próximo evento -->
        <template v-else>
          <p class="app-body-m mt-[var(--app-space-s)] text-foreground/80">
            {{ evt.title }}
            <span v-if="dateAndPlace" class="text-foreground/60"> — {{ dateAndPlace }}</span>
          </p>

          <p class="app-body-m mt-[var(--app-space-m)] text-foreground/80">
            {{ evt.theme || 'Tema a definir' }}
          </p>

          <div class="mt-[var(--app-space-l)]">
            <router-link
              :to="routeToEvent"
              class="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors duration-200"
            >
              Ver próximo evento
            </router-link>
          </div>
        </template>
      </div>

      <!-- Coluna direita (resumo rápido) -->
      <div class="rounded-lg border p-[var(--app-space-md)]">
        <dl class="grid grid-cols-2 gap-[var(--app-space-m)]">
          <div>
            <dt class="app-body-s text-foreground/60">Data</dt>
            <dd class="app-body-m">{{ evt ? (evt.dateLabel || formatDate(evt.date)) : '—' }}</dd>
          </div>
          <div>
            <dt class="app-body-s text-foreground/60">Cidade</dt>
            <dd class="app-body-m">{{ evt?.location || '—' }}</dd>
          </div>
          <div>
            <dt class="app-body-s text-foreground/60">Tema</dt>
            <dd class="app-body-m">{{ evt?.theme || '—' }}</dd>
          </div>
          <div>
            <dt class="app-body-s text-foreground/60">Status</dt>
            <dd class="app-body-m">{{ statusText }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useEvents } from '@/composables/useEvents'

/** Troque para o name real da sua rota de detalhes do evento */
const EVENT_ROUTE_NAME = 'event-details'

type EventsHook = ReturnType<typeof useEvents>
const events: EventsHook = useEvents()
type EventRow = typeof events.items.value[number]

const evt = ref<EventRow | null>(null)
const loading = ref(false)

function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
function formatDate(iso?: string | null) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const dateAndPlace = computed(() => {
  if (!evt.value) return ''
  const dateTxt = evt.value.dateLabel || formatDate(evt.value.date)
  const place = evt.value.location || ''
  return [dateTxt, place].filter(Boolean).join(' • ')
})

// Helpers
function parseISO(iso?: string | null) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  // sempre às 00:00 local pra comparar por dia
  const dt = new Date(y, m - 1, d)
  dt.setHours(0, 0, 0, 0)
  return dt
}
function startOfToday() {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t
}
function diffDays(from: Date, to: Date) {
  const MS = 24 * 60 * 60 * 1000
  return Math.round((to.getTime() - from.getTime()) / MS)
}

// Rotulador (futuro/próximo)
function upcomingLabel(days: number) {
  if (days <= 0) return 'Hoje'
  if (days === 1) return 'Amanhã'
  if (days < 7) return `Em ${days} dias`
  if (days < 14) return 'Em 1 semana'
  if (days < 21) return 'Em 2 semanas'
  if (days < 28) return 'Em 3 semanas'
  if (days < 60) return 'Em 1 mês'
  const months = Math.round(days / 30)
  return `Em ${months} meses`
}

// Rotulador (passado)
function pastLabel(daysAgo: number) {
  if (daysAgo === 1) return 'Ontem'
  if (daysAgo < 7) return `Encerrado há ${daysAgo} dias`
  if (daysAgo < 14) return 'Encerrado há 1 semana'
  if (daysAgo < 21) return 'Encerrado há 2 semanas'
  if (daysAgo < 28) return 'Encerrado há 3 semanas'
  if (daysAgo < 60) return 'Encerrado há 1 mês'
  const months = Math.round(daysAgo / 30)
  return `Encerrado há ${months} meses`
}

const statusText = computed(() => {
  const iso = evt.value?.date
  const target = parseISO(iso)
  if (!target) return '—'

  const today = startOfToday()
  const d = diffDays(today, target)

  return d >= 0 ? upcomingLabel(d) : pastLabel(Math.abs(d))
})

const routeToEvent = computed(() => {
  return evt.value ? { name: EVENT_ROUTE_NAME, params: { id: evt.value.id } } : { path: '/events' }
})

async function loadNextEvent() {
  loading.value = true
  try {
    // 1) tenta o "atual"
    const current = await events.listEvents({ isCurrent: true, limit: 1 })
    if (current.data.length > 0) {
      evt.value = current.data[0]
      return
    }

    // 2) senão, pega os próximos por data >= hoje e escolhe o mais próximo
    const upcoming = await events.listEvents({ from: todayISO(), limit: 100 })
    if (upcoming.data.length) {
      const sorted = [...upcoming.data].sort((a, b) => {
        const da = a.date ?? '9999-12-31'
        const db = b.date ?? '9999-12-31'
        return da.localeCompare(db)
      })
      evt.value = sorted[0]
      return
    }

    // 3) fallback: nenhum
    evt.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => { void loadNextEvent() })
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>

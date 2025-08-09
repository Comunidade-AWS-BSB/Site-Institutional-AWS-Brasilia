<!-- src/views/EventTabView.vue -->
<template>
  <main class="min-h-[60vh] mt-20">
    <section v-if="loading" class="container mx-auto px-4 py-10 space-y-6">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-64 w-full" />
      <Skeleton class="h-6 w-40" />
    </section>

    <EventDetails v-else-if="currentEvent" :event="currentEvent" :hasAgenda="false" />

    <section v-else class="container mx-auto px-4 py-16 text-center text-muted-foreground">
      Nenhum evento atual encontrado.
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useEvents } from '@/composables/useEvents'
import EventDetails from '@/components/event/EventDetails.vue'
import { Skeleton } from '@/components/ui/skeleton'

const events = useEvents()
const loading = ref(true)

onMounted(async () => {
  if (events.items.value.length === 0) {
    await events.listEvents({ isCurrent: undefined, limit: 50, nextToken: null })
  }
  loading.value = false
})

const currentEvent = computed(() => {
  const list = events.items.value
  if (!list.length) return null
  // 1) Preferir isCurrent
  const current = list.find(e => e.isCurrent)
  if (current) return current

  // 2) Fallback: evento mais próximo no futuro; senão, o mais recente do passado
  const now = new Date()
  const dated = list
    .filter(e => e.date)
    .map(e => ({ e, d: new Date(e.date!) }))
    .sort((a, b) => +a.d - +b.d)

  const upcoming = dated.find(x => x.d >= now)?.e
  return upcoming ?? dated.at(-1)?.e ?? list[0]
})
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>

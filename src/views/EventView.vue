<template>
  <main class="min-h-[60vh] mt-20">
    <section v-if="loading" class="container mx-auto px-4 py-10 space-y-6">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-64 w-full" />
      <Skeleton class="h-6 w-40" />
    </section>

    <EventDetails v-else-if="event" :event="event" />

    <section v-else class="container mx-auto px-4 py-16 text-center text-muted-foreground">
      Nenhum evento atual encontrado.
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents, type EventRow } from '@/composables/useEvents'
import { Skeleton } from '@/components/ui/skeleton'
import EventDetails from '@/components/event/EventDetails.vue'

const route = useRoute()
const events = useEvents()

const event = ref<EventRow | null>(null)
const loading = ref(true)

// helper: pega evento atual (isCurrent)
async function loadCurrent() {
  const { data } = await events.listEvents({ isCurrent: true, limit: 1 })
  return data[0] ?? null
}

async function load() {
  loading.value = true
  try {
    const id = route.params.id as string | undefined
    if (id) {
      event.value = await events.getEvent(id)
    } else {
      event.value = await loadCurrent()
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
// MUITO importante: o Vue reaproveita a instância quando o :id muda.
watch(() => route.params.id, () => { void load() })
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>

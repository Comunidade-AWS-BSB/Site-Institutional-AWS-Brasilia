<!-- src/views/EventHistory.vue -->
<template>
  <main class="container mx-auto px-4 py-10 space-y-6 mt-15">
    <header class="flex items-end gap-3">
      <h1 class="text-2xl font-semibold">Eventos</h1>
      <div class="ms-auto flex gap-2">
        <Input v-model="q" placeholder="Buscar por título..." class="w-64" />
        <Select v-model="scope">
          <SelectTrigger class="w-40">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent class="bg-black">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="upcoming">Próximos</SelectItem>
            <SelectItem value="past">Passados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>

    <div v-if="loading" class="grid gap-4 md:grid-cols-2">
      <Skeleton v-for="i in 6" :key="i" class="h-28 w-full" />
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2">
      <Card v-for="ev in filtered" :key="ev.id" class="overflow-hidden">
        <div class="grid grid-cols-[128px,1fr] gap-4 p-4">
          <img v-if="previews[ev.id]" :src="previews[ev.id]" class="h-28 w-full rounded object-cover border" />
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold">{{ ev.title }}</h3>
              <Badge v-if="ev.isCurrent">Atual</Badge>
            </div>
            <div class="text-sm text-muted-foreground">
              {{ ev.dateLabel || ev.date || '—' }}
              <span v-if="ev.time || ev.timeLabel"> · {{ ev.timeLabel || ev.time }}</span>
            </div>
            <RouterLink :to="{ name: 'event-details', params: { id: ev.id } }"
              class="text-primary text-sm underline mt-2 inline-block">
              Ver detalhes
            </RouterLink>
          </div>
        </div>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import { getUrl } from 'aws-amplify/storage'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const events = useEvents()
const loading = ref(true)
const q = ref('')
const scope = ref<'all' | 'upcoming' | 'past'>('all')

onMounted(async () => {
  if (events.items.value.length === 0) {
    await events.listEvents({ limit: 100, nextToken: null })
  }
  await hydratePreviews()
  loading.value = false
})

const previews = ref<Record<string, string>>({})

async function hydratePreviews() {
  const pairs = await Promise.all(
    events.items.value.map(async e => {
      if (!e.bannerKey) return [e.id, ''] as const
      const res = await getUrl({ path: e.bannerKey.startsWith('public/') ? e.bannerKey : `public/${e.bannerKey}`, options: { expiresIn: 3600 } })
      return [e.id, res.url.toString()] as const
    })
  )
  previews.value = Object.fromEntries(pairs)
}

const filtered = computed(() => {
  const now = new Date()
  return events.items.value.filter(e => {
    const matchQ = !q.value || e.title.toLowerCase().includes(q.value.toLowerCase())
    let matchScope = true
    if (scope.value !== 'all' && e.date) {
      const d = new Date(e.date)
      matchScope = scope.value === 'upcoming' ? d >= now : d < now
    }
    return matchQ && matchScope
  })
})
</script>

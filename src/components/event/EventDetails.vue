<template>
  <section class="mx-auto w-full max-w-5xl px-4 py-8 space-y-8">
    <!-- Banner -->
    <div v-if="bannerUrl" class="overflow-hidden rounded-xl border">
      <img :src="bannerUrl" alt="Banner do evento" class="h-64 w-full object-cover" />
    </div>

    <!-- Cabeçalho -->
    <header class="space-y-2 text-center">
      <div class="flex items-center justify-center gap-2">
        <h1 class="text-2xl font-semibold leading-tight">{{ event.title }}</h1>
        <Badge v-if="event.isCurrent" variant="default">Atual</Badge>
      </div>
      <p v-if="event.theme" class="text-muted-foreground">{{ event.theme }}</p>

      <div class="mt-3 flex items-center justify-center gap-3">
        <Button v-if="hasVenue" size="sm" @click="tab = 'local'">Ver local</Button>
        <Button v-if="hasAgenda" size="sm" variant="outline" @click="tab = 'agenda'">Programação</Button>
      </div>
    </header>

    <!-- Metadados -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent class="p-4">
          <div class="text-xs text-muted-foreground flex items-center gap-2">
            <Tag class="h-4 w-4" /> Tipo
          </div>
          <div class="mt-1 font-medium">{{ event.type ?? '—' }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="text-xs text-muted-foreground flex items-center gap-2">
            <Calendar class="h-4 w-4" /> Data
          </div>
          <div class="mt-1 font-medium">{{ event.dateLabel || event.date || '—' }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-4">
          <div class="text-xs text-muted-foreground flex items-center gap-2">
            <Clock class="h-4 w-4" /> Hora
          </div>
          <div class="mt-1 font-medium">{{ event.timeLabel || event.time || '—' }}</div>
        </CardContent>
      </Card>
    </div>

    <Separator />

    <!-- Conteúdo em Abas -->
    <Tabs v-model="tab" class="w-full">
      <TabsList class="w-full justify-start">
        <TabsTrigger value="sobre">Sobre</TabsTrigger>
        <TabsTrigger value="local" :disabled="!hasVenue">Local</TabsTrigger>
        <TabsTrigger value="galeria">Galeria</TabsTrigger>
        <TabsTrigger value="agenda" :disabled="!hasAgenda">Agenda</TabsTrigger>
      </TabsList>

      <!-- Sobre -->
      <TabsContent value="sobre" class="mt-6 space-y-8">
        <!-- Descrição -->
        <section>
          <h2 class="text-lg font-semibold mb-2">Descrição</h2>
          <p class="leading-relaxed whitespace-pre-line">{{ event.description || '—' }}</p>
        </section>

        <!-- Hashtags -->
        <section v-if="(event.hashtags?.length ?? 0) > 0">
          <h2 class="text-lg font-semibold mb-2">Hashtags</h2>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tag in event.hashtags" :key="tag" variant="secondary">#{{ tag }}</Badge>
          </div>
        </section>
      </TabsContent>

      <!-- Local -->
      <TabsContent value="local" class="mt-6">
        <section v-if="hasVenue" class="grid gap-6 md:grid-cols-2">
          <div>
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <MapPin class="h-5 w-5" /> Local
            </h2>
            <p class="mt-2 text-foreground/80">{{ event.location || '—' }}</p>
            <div v-if="event.venueName" class="text-sm">{{ event.venueName }}</div>
            <div v-if="event.venueAddress" class="text-sm text-muted-foreground">{{ event.venueAddress }}</div>
          </div>

          <div v-if="event.venueMapUrl" class="min-h-[220px] overflow-hidden rounded-xl border">
            <iframe :src="event.venueMapUrl" title="Mapa do local" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade" class="h-full w-full" />
          </div>
        </section>

        <div v-else class="text-sm text-muted-foreground mt-2">Sem informações de local ainda.</div>
      </TabsContent>

      <!-- Galeria -->
      <TabsContent value="galeria" class="mt-6">
        <section>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Galeria do evento</h2>
          </div>

          <div v-if="galleryLoading" class="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Skeleton v-for="i in 6" :key="i" class="h-40 w-full" />
          </div>

          <div v-else-if="images.length === 0" class="mt-4 text-sm text-muted-foreground">
            Nenhuma imagem na galeria ainda.
          </div>

          <div v-else class="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <img v-for="img in images" :key="img.key" :src="img.url"
              class="h-48 w-full rounded-lg object-cover border" loading="lazy"
              :alt="`Imagem ${img.key}`" />
          </div>
        </section>
      </TabsContent>

      <!-- Agenda -->
      <TabsContent value="agenda" class="mt-6">
        <section v-if="hasAgenda">
          <h2 class="text-lg font-semibold">Programação</h2>
          <p class="text-sm text-muted-foreground mt-1">Agenda detalhada do evento.</p>
          <!-- Se você já tiver slots/agenda no futuro, renderize aqui -->
          <div class="mt-4 text-sm text-muted-foreground">Em breve…</div>
        </section>
        <div v-else class="text-sm text-muted-foreground">Sem programação cadastrada.</div>
      </TabsContent>
    </Tabs>

    <!-- Regras & Acessibilidade (fixo) -->
    <Separator />
    <section class="py-4">
      <h2 class="text-lg font-semibold">Regras & Acessibilidade</h2>
      <ul class="mt-3 list-disc space-y-2 pl-5">
        <li>Entrada gratuita e aberta ao público — não é necessário comprar ingressos.</li>
        <li>Espaço inclusivo e respeitoso: siga o código de conduta da comunidade.</li>
        <li>Haverá espaços reservados para PCD e suporte no local.</li>
        <li>Fotos e vídeos podem ser registrados; avise a organização se preferir não aparecer.</li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { list, getUrl } from 'aws-amplify/storage'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Calendar, Clock, Tag, MapPin } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { EVENTS_PREFIX } from '@/constants/storage'

type EventsHook = ReturnType<typeof useEvents>
const events: EventsHook = useEvents()
type EventRow = typeof events.items.value[number]

const props = defineProps<{ event: EventRow; hasAgenda?: boolean }>()

const tab = ref<'sobre' | 'local' | 'galeria' | 'agenda'>('sobre')

const hasVenue = computed(() =>
  !!(props.event.location || props.event.venueName || props.event.venueAddress || props.event.venueMapUrl)
)
const hasAgenda = computed(() => props.hasAgenda === true)

// Banner
const bannerUrl = ref<string | null>(null)
onMounted(async () => {
  bannerUrl.value = props.event.bannerKey ? await events.getAssetUrl(props.event.bannerKey) : null
})

// Galeria
const images = ref<{ key: string; url: string }[]>([])
const galleryLoading = ref(false)
const galleryPrefix = computed(() => `${EVENTS_PREFIX}${props.event.id}/gallery/`)

async function reloadGallery() {
  try {
    galleryLoading.value = true
    images.value = []
    const { items } = await list({ path: galleryPrefix.value, options: { pageSize: 1000 } })
    const urls = await Promise.all(
      items.map(async it => {
        const res = await getUrl({ path: it.path, options: { expiresIn: 5400 } })
        return { key: it.path, url: res.url.toString() }
      })
    )
    images.value = urls
  } finally {
    galleryLoading.value = false
  }
}

onMounted(() => {
  reloadGallery()
  console.log(props)
})
watch(() => props.event.id, () => { void reloadGallery() })
</script>

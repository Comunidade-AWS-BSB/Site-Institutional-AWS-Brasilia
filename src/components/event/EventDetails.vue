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
        <Button v-if="hasTalk" size="sm" variant="outline" @click="tab = 'palestra'">Sobre a palestra</Button>
      </div>
    </header>

    <!-- Cartões de metadados -->
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

    <!-- Abas -->
    <Tabs v-model="tab" class="w-full">
      <TabsList class="w-full justify-start overflow-x-auto">
        <TabsTrigger value="sobre">Sobre</TabsTrigger>
        <TabsTrigger value="palestra" :disabled="!hasTalk">Palestra</TabsTrigger>
        <TabsTrigger value="local" :disabled="!hasVenue">Local</TabsTrigger>
        <TabsTrigger value="galeria">Galeria</TabsTrigger>
        <TabsTrigger v-if="sponsors.length" value="apoiadores">Apoiadores</TabsTrigger>
        <TabsTrigger v-if="faqs.length" value="faq">FAQ</TabsTrigger>
      </TabsList>

      <!-- Sobre -->
      <TabsContent value="sobre" class="mt-6 space-y-8">
        <section>
          <h2 class="text-lg font-semibold mb-2">Descrição</h2>
          <p class="leading-relaxed whitespace-pre-line text-center md:text-left">{{ event.description || '—' }}</p>
        </section>

        <section v-if="(event.hashtags?.length ?? 0) > 0">
          <h2 class="text-lg font-semibold mb-2">Hashtags</h2>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge v-for="tag in (event.hashtags ?? []).filter(Boolean)" :key="tag!" variant="secondary">#{{ tag }}</Badge>
          </div>
        </section>
      </TabsContent>

      <!-- Palestra + Speaker -->
      <TabsContent value="palestra" class="mt-6 space-y-6">
        <section v-if="hasTalk" class="space-y-8">
          <div v-for="{ talk, speaker, avatarUrl, socials } in talks" :key="talk.id" class="space-y-6 border-b last:border-b-0 pb-8">
            <!-- Talk em Card, centralizado -->
            <Card>
              <CardContent class="p-6 text-center space-y-3">
                <h2 class="text-xl font-semibold">{{ talk?.title }}</h2>
                <p class="text-sm text-muted-foreground" v-if="talk?.durationMinutes || talk?.order">
                  <span v-if="talk?.durationMinutes">Duração: {{ talk?.durationMinutes }} min</span>
                  <span v-if="talk?.order" class="ml-2">• Ordem: {{ talk?.order }}</span>
                </p>
                <p class="leading-relaxed whitespace-pre-line">{{ talk?.abstract || '—' }}</p>
              </CardContent>
            </Card>

            <!-- Speaker Card mais largo e centrado -->
            <Card v-if="speaker" class="max-w-2xl mx-auto">
              <CardContent class="p-6 space-y-5 text-center">
                <div class="flex flex-col items-center gap-3">
                  <img
                    v-if="avatarUrl"
                    :src="avatarUrl"
                    class="h-24 w-24 rounded-full object-cover border"
                    alt="Foto do palestrante"
                  />
                  <div>
                    <div class="font-semibold text-lg">{{ speaker?.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ speaker?.title }}</div>
                  </div>
                </div>

                <div v-if="speaker?.bioIntro" class="text-sm">
                  <div class="text-xs text-muted-foreground mb-1">Introdução</div>
                  <p class="leading-relaxed whitespace-pre-line">{{ speaker?.bioIntro }}</p>
                </div>

                <div v-if="speaker?.bioExperience" class="text-sm">
                  <div class="text-xs text-muted-foreground mb-1">Experiência</div>
                  <p class="leading-relaxed whitespace-pre-line">{{ speaker?.bioExperience }}</p>
                </div>

                <div v-if="speaker?.bioExpertise" class="text-sm">
                  <div class="text-xs text-muted-foreground mb-1">Expertise</div>
                  <p class="leading-relaxed whitespace-pre-line">{{ speaker?.bioExpertise }}</p>
                </div>

                <div v-if="(speaker?.skills?.length ?? 0) > 0">
                  <div class="text-xs text-muted-foreground mb-1">Skills</div>
                  <div class="flex flex-wrap gap-2 justify-center">
                    <Badge v-for="s in (speaker?.skills ?? []).filter(Boolean)" :key="s!" variant="outline">{{ s }}</Badge>
                  </div>
                </div>

                <!-- Redes sociais com ícones -->
                <div v-if="socials.length" class="pt-1">
                  <div class="text-xs text-muted-foreground mb-2">Redes</div>
                  <div class="flex flex-wrap gap-2 justify-center">
                    <a
                      v-for="m in socials"
                      :key="m.id"
                      class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted/60"
                      :href="m.url"
                      target="_blank"
                      rel="noopener"
                      :aria-label="labelFor(m.name)"
                    >
                      <component :is="iconFor(m.name)" class="h-5 w-5" />
                      <span>{{ labelFor(m.name) }}</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div v-else class="text-sm text-muted-foreground text-center mt-2">Sem palestra cadastrada.</div>
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
        <div v-else class="text-sm text-muted-foreground text-center mt-2">Sem informações de local ainda.</div>
      </TabsContent>

      <!-- Galeria (Carousel shadcn-vue) -->
      <TabsContent value="galeria" class="mt-6">
        <section>
          <h2 class="text-lg font-semibold mb-3 text-center md:text-left">Galeria do evento</h2>

          <div v-if="galleryLoading" class="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Skeleton v-for="i in 6" :key="i" class="h-40 w-full" />
          </div>

          <div v-else-if="images.length === 0" class="text-sm text-muted-foreground">
            Nenhuma imagem na galeria ainda.
          </div>

          <Carousel v-else class="w-full">
            <CarouselContent>
              <CarouselItem v-for="img in images" :key="img.key" class="basis-full md:basis-1/2 lg:basis-1/3 p-2">
                <img
                  :src="img.url"
                  class="h-56 w-full rounded-lg object-cover border"
                  loading="lazy"
                  :alt="`Imagem ${img.key}`"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </TabsContent>

      <!-- Apoiadores (Stepper) -->
      <TabsContent value="apoiadores" class="mt-6">
        <section v-if="sponsors.length">
          <h2 class="text-lg font-semibold mb-4 text-center md:text-left">Apoiadores</h2>

          <Stepper class="flex w-full items-start gap-2">
            <StepperItem
              v-for="(sp, idx) in sponsors"
              :key="sp.id"
              v-slot="{ state }"
              class="relative flex w-full flex-col items-center justify-center"
              :step="idx + 1"
            >
              <StepperSeparator
                v-if="idx !== sponsors.length - 1"
                class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
              />

              <StepperTrigger as-child>
                <div
                  class="z-10 rounded-full shrink-0 border bg-background p-2 w-16 h-16 flex items-center justify-center"
                  :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                >
                  <img v-if="sp.logoUrl" :src="sp.logoUrl" alt="" class="max-h-12 max-w-12 object-contain" />
                  <span v-else class="text-sm font-medium">{{ sp.name[0] }}</span>
                </div>
              </StepperTrigger>

              <div class="mt-4 flex flex-col items-center text-center">
                <StepperTitle :class="[state === 'active' && 'text-primary']" class="text-sm font-semibold transition">
                  {{ sp.name }}
                </StepperTitle>
                <StepperDescription class="text-xs text-muted-foreground transition">
                  Patrocinador
                </StepperDescription>
              </div>
            </StepperItem>
          </Stepper>
        </section>

        <div v-else class="text-sm text-muted-foreground text-center">Nenhum apoiador cadastrado.</div>
      </TabsContent>

      <!-- FAQ (Accordion) -->
      <TabsContent value="faq" class="mt-6">
        <section v-if="faqs.length">
          <h2 class="text-lg font-semibold mb-3 text-center md:text-left">Perguntas frequentes</h2>
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem v-for="f in faqs" :key="f.id" :value="f.id">
              <AccordionTrigger>{{ f.question }}</AccordionTrigger>
              <AccordionContent>{{ f.answer }}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <div v-else class="text-sm text-muted-foreground text-center">Nenhuma FAQ cadastrada.</div>
      </TabsContent>
    </Tabs>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { useSpeakers } from '@/composables/useSpeakers'
import { list, getUrl } from 'aws-amplify/storage'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Calendar, Clock, Tag, MapPin, Linkedin, Instagram, Github, Globe, FileText } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Stepper, StepperItem, StepperTrigger, StepperTitle, StepperDescription, StepperSeparator } from '@/components/ui/stepper'

import { EVENTS_PREFIX } from '@/constants/storage'

type EventsHook = ReturnType<typeof useEvents>
type SpeakersHook = ReturnType<typeof useSpeakers>
const events: EventsHook = useEvents()
const speakers: SpeakersHook = useSpeakers()

type EventRow = typeof events.items.value[number]
const props = defineProps<{ event: EventRow }>()

const tab = ref<'sobre' | 'palestra' | 'local' | 'galeria' | 'apoiadores' | 'faq'>('sobre')

/* ===== Computeds básicos ===== */
const hasVenue = computed(() =>
  !!(props.event.location || props.event.venueName || props.event.venueAddress || props.event.venueMapUrl)
)

/* ===== Banner ===== */
const bannerUrl = ref<string | null>(null)

/* ===== Galeria (via S3) ===== */
const images = ref<{ key: string; url: string }[]>([])
const galleryLoading = ref(false)
const galleryPrefix = computed(() => `${EVENTS_PREFIX}${props.event.id}/gallery/`)

async function reloadGallery() {
  try {
    galleryLoading.value = true
    images.value = []
    const { items } = await list({ path: galleryPrefix.value, options: { pageSize: 1000 } })
    const urls = await Promise.all(items.map(async it => {
      const res = await getUrl({ path: it.path, options: { expiresIn: 5400 } })
      return { key: it.path, url: res.url.toString() }
    }))
    images.value = urls
  } finally {
    galleryLoading.value = false
  }
}

/* ===== Tipos locais ===== */
type TalkRow = {
  id: string
  title: string | null
  abstract?: string | null
  durationMinutes?: number | null
  order?: number | null
  speakerId?: string | null
}
type SpeakerRow = {
  id: string
  name: string
  title?: string | null
  imageKey?: string | null
  bioIntro?: string | null
  bioExperience?: string | null
  bioExpertise?: string | null
  skills?: (string | null)[] | null
}
type SocialName = 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'
type SocialRow = { id: string; name: SocialName; url: string }
type SponsorView = { id: string; name: string; logoKey?: string | null; logoUrl?: string | null }
type FaqRow = { id: string; question: string; answer: string }

type EnrichedTalk = {
  talk: TalkRow
  speaker: SpeakerRow | null
  avatarUrl: string | null
  socials: SocialRow[]
}


/* ===== Talk + Speaker + Socials + Sponsors + FAQ ===== */
const talks = ref<EnrichedTalk[]>([])
const sponsors = ref<SponsorView[]>([])
const faqs = ref<FaqRow[]>([])

const hasTalk = computed(() => talks.value.length > 0)

/* Ícones/labels por enum de rede */
function iconFor(name: SocialName) {
  switch (name) {
    case 'LINKEDIN': return Linkedin
    case 'INSTAGRAM': return Instagram
    case 'GITHUB': return Github
    case 'MEDIUM': return FileText
    default: return Globe
  }
}
function labelFor(name: SocialName) {
  switch (name) {
    case 'LINKEDIN': return 'LinkedIn'
    case 'INSTAGRAM': return 'Instagram'
    case 'GITHUB': return 'GitHub'
    case 'MEDIUM': return 'Medium'
    default: return 'Website'
  }
}

/* ===== Load/Hydrate ===== */
async function hydrateAll() {
  // Banner
  bannerUrl.value = props.event.bannerKey ? await events.getAssetUrl(props.event.bannerKey) : null

  // Galeria
  await reloadGallery()

  // Talks + Speakers
  const talkRows = await events.listTalksByEvent(props.event.id)
  const enrichedTalks: EnrichedTalk[] = await Promise.all(
    talkRows.map(async (talk) => {
      if (!talk.speakerId) {
        return { talk, speaker: null, avatarUrl: null, socials: [] }
      }
      const speaker = await speakers.getSpeaker(talk.speakerId)
      const [avatarUrl, socials] = await Promise.all([
        speaker?.imageKey ? speakers.getAvatarUrl(speaker.imageKey) : Promise.resolve(null),
        speakers.listMediasBySpeaker(talk.speakerId)
      ])
      return {
        talk,
        speaker,
        avatarUrl,
        socials: (socials ?? []).map(m => ({ id: m.id, name: m.name as SocialName, url: m.url ?? '' }))
      }
    })
  )
  talks.value = enrichedTalks

  // Sponsors
  const sps = await events.listSponsorsByEvent(props.event.id)
  sponsors.value = await Promise.all(
    sps.map(async s => ({
      id: s.id,
      name: s.name,
      logoKey: s.logoKey ?? null,
      logoUrl: s.logoKey ? await events.getAssetUrl(s.logoKey) : null,
    }))
  )

  // FAQs
  const f = await events.listFaqsByEvent(props.event.id)
  faqs.value = (f ?? []).map(x => ({ id: x.id, question: x.question, answer: x.answer }))
}

onMounted(() => { void hydrateAll() })
watch(() => props.event.id, () => { void hydrateAll() })
</script>

<template>
  <section id="speakers" class="py-16 md:py-24 bg-background">
    <div class="container mx-auto px-4">
      <!-- Título -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Palestrantes de eventos
        </h2>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Grade -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <SpeakerCard
          v-for="(card, index) in cards"
          :key="card.id"
          :speaker="card"
          :class="['animate-fade-in-up']"
          :style="{ animationDelay: `${index * 0.1}s` }"
        />
      </div>

      <!-- Vazio -->
      <p v-if="loaded && cards.length === 0" class="mt-8 text-center text-sm text-muted-foreground">
        Nenhum palestrante cadastrado ainda.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SpeakerCard from '@/components/shared/SpeakerCard.vue'
import { useSpeakers, type SpeakerRow } from '@/composables/useSpeakers'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type CardSpeaker = {
  id: string
  name: string
  title: string
  imageUrl: string
  social: { linkedin?: string }
}

const speakers = useSpeakers()
const cards = ref<CardSpeaker[]>([])
const loaded = ref(false)

async function load() {
  loaded.value = false
  cards.value = []

  const { data } = await speakers.listSpeakers({ limit: 100 })
  // Enriquecer com avatar e linkedin (N+1 ok para poucos speakers; se crescer, mover p/ um batch helper)
  const enriched = await Promise.all(
    data.map(async (s: SpeakerRow) => {
      const [avatar, medias] = await Promise.all([
        s.imageKey ? speakers.getAvatarUrl(s.imageKey) : Promise.resolve(null),
        speakers.listMediasBySpeaker(s.id, 10),
      ])
      const linkedin = medias.find(m => m.name === 'LINKEDIN')?.url
      return {
        id: s.id,
        name: s.name,
        title: s.title ?? '',
        imageUrl: avatar ?? '/img/speakers/placeholder.jpg',
        social: { linkedin },
      } as CardSpeaker
    })
  )

  cards.value = enriched
  loaded.value = true
}

onMounted(() => { void load() })
</script>

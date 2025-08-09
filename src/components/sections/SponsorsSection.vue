<template>
  <section id="sponsors" class="py-16 md:py-24 bg-background">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Apoiadores
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Agradecemos aos parceiros que apoiam nossa comunidade.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div v-for="i in 8" :key="i" class="h-24 bg-muted/40 rounded-lg animate-pulse" />
      </div>

      <!-- Grade de Patrocinadores -->
      <div v-else-if="sponsors.length" class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div v-for="(sponsor, index) in sponsors" :key="sponsor.id"
          class="group bg-card border border-border rounded-lg p-6 flex items-center flex-col justify-center hover:shadow-lg hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }">
          <img :src="sponsor.logoUrl || placeholder" :alt="sponsor.name"
            class="max-w-full max-h-16 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110">
          {{ sponsor.name }}
        </div>
      </div>

      <!-- Sem patrocinadores -->
      <div v-else class="text-center text-muted-foreground max-w-2xl mx-auto">
        <p class="mb-8">Ainda não temos patrocinadores cadastrados para este evento.</p>
      </div>

      <!-- Chamada para Ação -->
      <div class="text-center mt-16 animate-fade-in-up" style="animation-delay: 0.8s">
        <div class="bg-muted/50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 class="font-display font-bold text-xl text-foreground mb-4">
            Quer ser nosso parceiro?
          </h3>
          <p class="text-muted-foreground mb-6">
            Junte-se aos nossos patrocinadores e ajude a fortalecer a comunidade AWS em Brasília.
          </p>
          <Button variant="default" size="lg" @click="contactSponsorship"
            class="hover:scale-105 transition-transform duration-200">
            <Mail class="h-4 w-4 mr-2" />
            Entre em Contato
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-vue-next'
import { useEvents } from '@/composables/useEvents'

type EventsHook = ReturnType<typeof useEvents>
const events: EventsHook = useEvents()

/**
 * Comportamento:
 * - Se `eventId` vier via prop, usa-o.
 * - Senão, tenta pegar o evento "atual" (isCurrent = true).
 */
const props = defineProps<{
  eventId?: string
}>()

const loading = ref(true)
const sponsors = ref<Array<{ id: string; name: string; logoKey?: string | null; logoUrl?: string | null }>>([])
const placeholder = '/img/clients/client-1.png' // opcional: fallback local

async function loadSponsors() {
  loading.value = true
  sponsors.value = []

  // 1) Decide o eventId
  let id = props.eventId ?? null
  if (!id) {
    const res = await events.listEvents({ isCurrent: true, limit: 1 })
    id = res.data[0]?.id ?? null
  }
  if (!id) {
    loading.value = false
    return
  }

  // 2) Carrega patrocinadores e resolve URL das logos
  const list = await events.listSponsorsByEvent(id)
  sponsors.value = await Promise.all(
    list.map(async s => ({
      id: s.id,
      name: s.name,
      logoKey: s.logoKey ?? null,
      logoUrl: s.logoKey ? await events.getAssetUrl(s.logoKey) : null,
    }))
  )

  loading.value = false
}

onMounted(() => { void loadSponsors() })
watch(() => props.eventId, () => { void loadSponsors() })

const contactSponsorship = () => {
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
  } else {
    // fallback: mailto
    window.location.href = 'mailto:contato@awsbrasilia.dev?subject=Patroc%C3%ADnio%20Comunidade%20AWS%20Bras%C3%ADlia'
  }
}
</script>

<style scoped>
.container {
  max-width: 1120px;
}
</style>

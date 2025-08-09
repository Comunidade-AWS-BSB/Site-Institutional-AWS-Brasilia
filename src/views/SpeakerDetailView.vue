<template>
  <div>
    <!-- Hero -->
    <section class="relative py-24 bg-gradient-to-r from-primary to-primary/80 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <nav class="flex justify-center mb-6 animate-fade-in-up">
            <ol class="flex items-center space-x-2 text-sm">
              <li>
                <router-link to="/" class="hover:text-primary-foreground/80 transition-colors">Home</router-link>
              </li>
              <li class="text-primary-foreground/60">/</li>
              <li class="text-primary-foreground/80">Detalhes do Palestrante</li>
            </ol>
          </nav>

          <h1
            class="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 animate-fade-in-up"
            style="animation-delay: 0.2s"
          >
            Detalhes do Palestrante
          </h1>
          <p class="text-xl text-primary-foreground/90 animate-fade-in-up" style="animation-delay: 0.4s">
            Conheça mais sobre nossos especialistas em tecnologia AWS
          </p>
        </div>
      </div>
    </section>

    <!-- Detalhes -->
    <section class="py-16 md:py-24 bg-background">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <!-- Avatar -->
            <div class="animate-slide-in-left">
              <div class="relative">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  :alt="speaker?.name || 'Palestrante'"
                  class="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-xl object-cover"
                />
                <div v-else class="w-full max-w-md mx-auto lg:mx-0 h-80 rounded-lg shadow-xl bg-muted" />
                <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              </div>
            </div>

            <!-- Info -->
            <div class="animate-slide-in-right">
              <div class="space-y-6">
                <div>
                  <h2 class="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                    {{ speaker?.name || '—' }}
                  </h2>
                  <p v-if="speaker?.title" class="text-xl text-primary font-medium mb-4">
                    {{ speaker?.title }}
                  </p>

                  <!-- Socials -->
                  <div class="flex flex-wrap gap-3 mb-6">
                    <a
                      v-if="socials.linkedin"
                      :href="socials.linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Linkedin class="h-5 w-5" />
                    </a>
                    <a
                      v-if="socials.instagram"
                      :href="socials.instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Instagram class="h-5 w-5" />
                    </a>
                    <a
                      v-if="socials.github"
                      :href="socials.github"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Github class="h-5 w-5" />
                    </a>
                    <a
                      v-if="socials.medium"
                      :href="socials.medium"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <PenLine class="h-5 w-5" />
                    </a>
                    <a
                      v-if="socials.other"
                      :href="socials.other"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-12 h-12 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    >
                      <Globe class="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <!-- Bio -->
                <div class="prose prose-lg max-w-none">
                  <div class="space-y-4 text-muted-foreground leading-relaxed">
                    <p v-if="speaker?.bioIntro">{{ speaker?.bioIntro }}</p>
                    <p v-if="speaker?.bioExperience">{{ speaker?.bioExperience }}</p>
                    <p v-if="speaker?.bioExpertise">{{ speaker?.bioExpertise }}</p>
                  </div>
                </div>

                <!-- Skills -->
                <div v-if="(speaker?.skills?.length ?? 0) > 0">
                  <h3 class="font-display font-semibold text-lg text-foreground mb-3">Áreas de Especialização</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in speaker?.skills"
                      :key="skill"
                      class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <!-- Voltar -->
                <div class="pt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    @click="goBack"
                    class="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <ArrowLeft class="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensagem se não achar -->
          <p v-if="loaded && !speaker" class="mt-10 text-center text-sm text-muted-foreground">
            Palestrante não encontrado.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpeakers, type SpeakerRow, type SocialMediaRow } from '@/composables/useSpeakers'
import { Button } from '@/components/ui/button'
import { Linkedin, Instagram, Github, PenLine, Globe, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const speakers = useSpeakers()

const id = computed(() => String((route.params.id ?? route.params.speakerId) || ''))

const speaker = ref<SpeakerRow | null>(null)
const avatarUrl = ref<string | null>(null)
const medias = ref<SocialMediaRow[]>([])
const loaded = ref(false)

type Socials = {
  linkedin?: string
  instagram?: string
  github?: string
  medium?: string
  other?: string
}
const socials = computed<Socials>(() => {
  const out: Socials = {}
  for (const m of medias.value) {
    switch (m.name) {
      case 'LINKEDIN': out.linkedin = m.url; break
      case 'INSTAGRAM': out.instagram = m.url; break
      case 'GITHUB': out.github = m.url; break
      case 'MEDIUM': out.medium = m.url; break
      case 'OTHER': if (!out.other) out.other = m.url; break
    }
  }
  return out
})

async function hydrate() {
  loaded.value = false
  speaker.value = null
  avatarUrl.value = null
  medias.value = []

  if (!id.value) { loaded.value = true; return }

  const s = await speakers.getSpeaker(id.value)
  speaker.value = s

  const [avatar, ms] = await Promise.all([
    s?.imageKey ? speakers.getAvatarUrl(s.imageKey) : Promise.resolve(null),
    speakers.listMediasBySpeaker(id.value, 100),
  ])
  avatarUrl.value = avatar
  medias.value = ms
  loaded.value = true
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'home' })
}

onMounted(() => { void hydrate() })
watch(id, () => { void hydrate() })
</script>

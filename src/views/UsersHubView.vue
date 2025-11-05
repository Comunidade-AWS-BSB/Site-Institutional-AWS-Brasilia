<template>
  <section class="container mx-auto px-4 py-20 space-y-8">
    <header class="space-y-2 animate-fade-in">
      <h1 class="text-3xl font-bold tracking-tight">Conecte-se com a comunidade</h1>
      <p class="text-foreground/70">Descubra pessoas incríveis: profissão, interesses e como entrar em contato.</p>
    </header>

    <!-- Filtros -->
    <Card class="p-4 animate-fade-in-up">
      <div class="grid md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <Input
            v-model="localQuery"
            type="text"
            placeholder="Buscar por nome, profissão ou bio..."
            @input="onQueryInput"
            aria-label="Buscar perfis"
          />
        </div>
        <div class="flex gap-2 items-center">
          <Select :modelValue="state.profession || ALL_OPTION" @update:modelValue="onProfessionSelect">
            <SelectTrigger class="min-w-44">
              <SelectValue placeholder="Todas profissões" />
            </SelectTrigger>
            <SelectContent class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
              <SelectItem :value="ALL_OPTION">Todas profissões</SelectItem>
              <SelectItem v-for="p in professions" :key="p" :value="p">{{ p }}</SelectItem>
            </SelectContent>
          </Select>
          <Select :modelValue="state.interest || ALL_OPTION" @update:modelValue="onInterestSelect">
            <SelectTrigger class="min-w-44">
              <SelectValue placeholder="Todos interesses" />
            </SelectTrigger>
            <SelectContent class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
              <SelectItem :value="ALL_OPTION">Todos interesses</SelectItem>
              <SelectItem v-for="i in interests" :key="i" :value="i">{{ i }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>

    <!-- Grid -->
    <div v-if="loading" class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <Skeleton v-for="i in 8" :key="i" class="h-56 w-full" />
    </div>

    <div v-else-if="items.length === 0" class="text-center py-16 animate-fade-in">
      <p class="text-foreground/60">Nenhum perfil encontrado. Tente ajustar os filtros.</p>
    </div>

    <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      <article v-for="p in items" :key="p.id" class="animate-fade-in-up">
        <Card class="p-4 h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.01]">
          <div class="flex items-center gap-3">
            <div class="h-12 w-12 rounded-full overflow-hidden border bg-foreground/10 flex items-center justify-center">
              <img v-if="p.photoUrl" :src="p.photoUrl" alt="Avatar" class="h-full w-full object-cover" loading="lazy" decode="async" />
              <span v-else class="text-sm font-semibold text-foreground/70">{{ initials(p.displayName) }}</span>
            </div>
            <div>
              <h3 class="font-semibold leading-tight">{{ p.displayName || 'Usuário' }}</h3>
              <p class="text-sm text-foreground/60">{{ p.profession || 'Profissão não informada' }}</p>
            </div>
          </div>
          <p v-if="p.bio" class="mt-3 text-sm text-foreground/80 line-clamp-3">{{ p.bio }}</p>
          <div v-if="p.interests?.length" class="mt-3 flex flex-wrap gap-2">
            <Badge v-for="i in p.interests.slice(0, 5)" :key="i" variant="secondary">{{ i }}</Badge>
          </div>
          <div v-if="p.medias?.length" class="mt-3 flex items-center gap-3 text-foreground/70">
            <a v-for="m in p.medias" :key="m.url" :href="m.url" target="_blank" rel="noopener noreferrer"
               class="hover:text-primary transition-colors" :aria-label="`Abrir ${m.name}`">
              <component :is="iconFor(m.name)" class="w-5 h-5" />
            </a>
          </div>
          <div class="mt-auto pt-4">
            <Button variant="secondary" class="w-full" @click="openProfile(p)">Ver perfil</Button>
          </div>
        </Card>
      </article>
    </div>
    
    <UserPreviewModal :visible="modalOpen" :profile="selected" @close="closeModal" />
  </section>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useHub } from '@/composables/useHub'
import type { PublicProfile } from '@/composables/useHub'
import { Linkedin, Instagram, Github, Newspaper, Globe } from 'lucide-vue-next'
import UserPreviewModal from '@/components/community/UserPreviewModal.vue'

const { items, loading, state, professions, interests, fetchProfiles, setQuery, setProfession, setInterest } = useHub()

const ALL_OPTION = '__ALL__'

const localQuery = ref('')
let debounceTimer: number | undefined

function onQueryInput() {
  if (debounceTimer) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    setQuery(localQuery.value)
    fetchProfiles()
  }, 300)
}

function initials(name: string): string {
  const parts = String(name || 'U').trim().split(/\s+/)
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || 'U'
}

function iconFor(name: string) {
  switch (name) {
    case 'LINKEDIN': return Linkedin
    case 'INSTAGRAM': return Instagram
    case 'GITHUB': return Github
    case 'MEDIUM': return Newspaper
    default: return Globe
  }
}

const modalOpen = ref(false)
const selected = ref<PublicProfile | null>(null)

function openProfile(p: PublicProfile) {
  selected.value = p
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  selected.value = null
}

function onProfessionSelect(value: string) {
  setProfession(value === ALL_OPTION ? '' : value)
  fetchProfiles()
}

function onInterestSelect(value: string) {
  setInterest(value === ALL_OPTION ? '' : value)
  fetchProfiles()
}

onMounted(() => {
  fetchProfiles()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>

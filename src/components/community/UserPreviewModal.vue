<template>
  <Dialog :open="visible" @update:open="(v: boolean) => (!v) && $emit('close')">
    <DialogContent class="max-w-xl">
      <DialogHeader>
        <DialogTitle>{{ profile?.displayName || 'Perfil' }}</DialogTitle>
        <DialogDescription v-if="profile?.profession">
          {{ profile.profession }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-start gap-4">
        <div class="h-20 w-20 rounded-full overflow-hidden border bg-foreground/10 flex items-center justify-center shrink-0">
          <img v-if="profile?.photoUrl" :src="profile.photoUrl" alt="Avatar" class="h-full w-full object-cover" loading="lazy" decode="async" />
          <span v-else class="text-base font-semibold text-foreground/70">{{ initials(profile?.displayName) }}</span>
        </div>

        <div class="space-y-3 w-full">
          <p v-if="profile?.bio" class="text-sm leading-relaxed text-foreground/80">
            {{ profile.bio }}
          </p>

          <div v-if="profile?.interests?.length" class="flex flex-wrap gap-2">
            <Badge v-for="i in profile.interests" :key="i" variant="secondary">{{ i }}</Badge>
          </div>
          <div v-if="profile?.medias?.length" class="flex items-center gap-3 pt-1 text-foreground/70">
            <a v-for="m in profile.medias" :key="m.url" :href="m.url" target="_blank" rel="noopener noreferrer"
               class="hover:text-primary transition-colors" :aria-label="`Abrir ${m.name}`">
              <component :is="iconFor(m.name)" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button variant="secondary" @click="$emit('close')">Fechar</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Linkedin, Instagram, Github, Newspaper, Globe } from 'lucide-vue-next'
import type { PublicProfile } from '@/composables/useHub'

defineProps<{
  visible: boolean
  profile: PublicProfile | null
}>()

defineEmits<{ (e: 'close'): void }>()

function initials(name?: string): string {
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
</script>

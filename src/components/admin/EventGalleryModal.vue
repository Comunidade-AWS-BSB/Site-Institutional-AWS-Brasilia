<template>
  <Dialog :open="open" @update:open="(v)=>(!v)&&$emit('close')">
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Galeria do evento</DialogTitle>
        <DialogDescription>Gerencie as imagens deste evento.</DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <Input type="file" accept="image/*" @change="onPick" />
          <Button :disabled="imgs.uploading">Adicionar</Button>
          <Button variant="secondary" :disabled="imgs.loading" @click="imgs.load()">Recarregar</Button>
        </div>

        <div v-if="imgs.loading" class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="i in 8" :key="i" class="aspect-[4/3] bg-muted rounded-md animate-pulse" />
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto pr-1">
          <div v-for="it in imgs.items" :key="it.key" class="relative group">
            <img :src="it.url" class="w-full aspect-[4/3] object-cover rounded-md border" />
            <Button
              size="icon"
              variant="destructive"
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
              :disabled="imgs.removing===it.key"
              @click="confirmRemove(it.key)"
            >
              ✕
            </Button>
          </div>
        </div>

        <div class="flex justify-center">
          <Button v-if="imgs.nextToken" variant="outline" :disabled="imgs.loading" @click="imgs.loadMore()">
            Carregar mais
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="secondary" @click="$emit('close')">Fechar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useImages } from '@/composables/useImages'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps<{ open: boolean; eventId: string | null }>()
const emit = defineEmits<{ (e:'close'): void }>()

const prefix = computed(() => props.eventId ? `assets/events/${props.eventId}/gallery/` : 'assets/events/unknown/')
const imgs = useImages(prefix.value)
watch(() => props.open, (o) => { if (o && props.eventId) imgs.load(true) })

const picked = ref<File | null>(null)
function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] || null
  picked.value = f
  if (f) imgs.upload(f)
}
function confirmRemove(key: string) {
  if (confirm('Remover esta imagem?')) imgs.removeKey(key)
}
</script>

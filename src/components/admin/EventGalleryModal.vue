<template>
    <Dialog :open="open" @update:open="(v) => (!v) && $emit('close')">
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

                <div v-else-if="imgs.items.length === 0" class="flex items-center w-full justify-center">
                    <Card class="w-[300px]">
                        <CardHeader>
                            <CardTitle>Parece que não temos imagens para esse evento.</CardTitle>
                            <CardDescription>Adicione imagens conforme abaixo</CardDescription>
                        </CardHeader>
                        <CardContent class="grid gap-4">
                            <div>
                                <div v-for="(notification, index) in notifications" :key="index"
                                    class="mb-4 grid grid-cols-[25px_minmax(0,1fr)] items-start pb-4 last:mb-0 last:pb-0">
                                    <CloudUpload v-if="notification.step === 1" />
                                    <Loader v-else-if="notification.step === 2" class="animate-spin" />
                                    <Check v-else />
                                    <div class="space-y-1 ml-2">
                                        <p class="text-sm font-medium leading-none">
                                            {{ notification.title }}
                                        </p>
                                        <p class="text-sm text-muted-foreground">
                                            {{ notification.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto pr-1">
                    <div v-for="it in imgs.items" :key="it.key" class="relative group">
                        <img :src="it.url" class="w-full aspect-[4/3] object-cover rounded-md border" />
                        <Button size="icon" variant="destructive"
                            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                            :disabled="imgs.removing === it.key" @click="confirmRemove(it.key)">
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
import { ref, watch, computed, reactive } from 'vue'
import { useImages } from '@/composables/useImages'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudUpload, Loader, Check } from 'lucide-vue-next'
import { EVENTS_PREFIX } from '@/constants/storage'

const notifications = [
    {
        step: 1,
        title: "Fazer upload",
        description: "Faça upload da imagem no input acima",
    },
    {
        step: 2,
        title: "Aguardar carregamento",
        description: "Aguarde o carregamento das imagens enquanto enviamos elas para o S3",
    },
    {
        step: 3,
        title: "Veja, adicione e remova",
        description: "Veja, adicione e remova as imagens do evento",
    },
]

const props = defineProps<{ open: boolean; eventId: string | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const prefix = computed(() => props.eventId ? `${EVENTS_PREFIX}${props.eventId}/gallery/` : `${EVENTS_PREFIX}unknown/`)
const imgs = reactive(useImages(prefix.value))
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

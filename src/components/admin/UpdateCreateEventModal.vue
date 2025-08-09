<template>
    <Dialog :open="open" @update:open="(v: boolean) => (!v) && $emit('close')">
        <DialogContent class="!max-w-none !w-[50vw]">
            <DialogHeader>
                <DialogTitle>{{ editing ? 'Editar evento' : 'Novo evento' }}</DialogTitle>
                <DialogDescription>Preencha os campos abaixo e salve.</DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <!-- GRID de 2 colunas -->
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Coluna ESQUERDA: básicos -->
                    <div class="space-y-4">
                        <div>
                            <Label for="title">Título *</Label>
                            <Input id="title" v-model="form.title" required />
                        </div>

                        <div>
                            <Label for="theme">Tema</Label>
                            <Input id="theme" v-model="form.theme" />
                        </div>

                        <div>
                            <Label for="type">Tipo</Label>
                            <Select v-model="form.type">
                                <SelectTrigger id="type"
                                    class="bg-background border border-input shadow-sm focus:ring-2 focus:ring-ring focus:outline-none">
                                    <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>

                                <SelectContent
                                    class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
                                    <SelectItem value="MEETUP">MEETUP</SelectItem>
                                    <SelectItem value="WORKSHOP">WORKSHOP</SelectItem>
                                    <SelectItem value="TALK">TALK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <Label for="date">Data</Label>
                                <Input id="date" type="date" v-model="form.date" />
                            </div>
                            <div>
                                <Label for="time">Hora</Label>
                                <Input id="time" type="time" v-model="form.time" />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <Label for="dateLabel">Rótulo de data</Label>
                                <Input id="dateLabel" v-model="form.dateLabel" placeholder="Ex.: 12 de Outubro" />
                            </div>
                            <div>
                                <Label for="timeLabel">Rótulo de hora</Label>
                                <Input id="timeLabel" v-model="form.timeLabel" placeholder="Ex.: 19h às 21h" />
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pt-1">
                            <Switch id="isCurrent" :model-value="form.isCurrent"
                                @update:model-value="updateIsCurrent" />
                            <Label for="isCurrent">Evento atual</Label>
                        </div>

                        <div>
                            <Label for="banner">Banner</Label>
                            <Input id="banner" type="file" accept="image/*" @change="onBannerChange" />

                            <!-- Mostra o caminho atual (opcional) -->
                            <p v-if="editing?.bannerKey" class="text-xs text-muted-foreground mt-1">
                                Atual: {{ editing.bannerKey }}
                            </p>
                        </div>
                    </div>

                    <!-- Coluna DIREITA: venue + descrição -->
                    <div class="space-y-4">
                        <div>
                            <Label for="location">Local</Label>
                            <Input id="location" v-model="form.location" />
                        </div>

                        <div>
                            <Label for="venueName">Nome do local</Label>
                            <Input id="venueName" v-model="form.venueName" />
                        </div>

                        <div>
                            <Label for="venueAddress">Endereço</Label>
                            <Input id="venueAddress" v-model="form.venueAddress" />
                        </div>

                        <div>
                            <Label for="venueMapUrl">URL do mapa</Label>
                            <Input id="venueMapUrl" v-model="form.venueMapUrl" type="url" />
                        </div>

                        <div>
                            <Label for="description">Descrição</Label>
                            <Textarea id="description" v-model="form.description" rows="6" />
                        </div>

                        <div>
                            <Label for="hashtags">Hashtags (separadas por vírgula)</Label>
                            <Input id="hashtags" v-model="hashtagsInput" placeholder="aws, comunidade, dev" />
                        </div>

                        <!-- Pré-visualização -->
                        <div v-if="bannerPreviewUrl" class="mt-2">
                            <div class="text-xs text-muted-foreground mb-1">Pré-visualização</div>
                            <img :src="bannerPreviewUrl" alt="Pré-visualização do banner"
                                class="block w-full max-h-30 object-cover rounded-md border" />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="secondary" @click="$emit('close')">Cancelar</Button>
                    <Button type="submit" :disabled="submitting">
                        {{ submitting ? 'Salvando…' : 'Salvar' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect, watch, onBeforeUnmount } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

type EventsHook = ReturnType<typeof useEvents>
const events: EventsHook = useEvents()

type EventRow = typeof events.items.value[number]
type CreateInput = Parameters<EventsHook['createEvent']>[0]
type UpdateInput = Parameters<EventsHook['updateEvent']>[0]

const props = defineProps<{
    open: boolean
    editing: EventRow | null
}>()
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'saved', payload: EventRow): void
}>()

const submitting = ref(false)
const bannerFile = ref<File | null>(null)

const bannerPreviewUrl = ref<string | null>(null)
let bannerObjectUrl: string | null = null

const updateIsCurrent = (val: boolean) => { form.isCurrent = val }

// Computa a melhor fonte de preview:
// 1) se usuário escolheu arquivo -> ObjectURL
// 2) se editando e tem bannerKey -> getUrl(path) do S3
// 3) caso contrário -> null
async function computeBannerPreview() {
    // libera URL anterior, se houver
    if (bannerObjectUrl) {
        URL.revokeObjectURL(bannerObjectUrl)
        bannerObjectUrl = null
    }

    if (bannerFile.value) {
        bannerObjectUrl = URL.createObjectURL(bannerFile.value)
        bannerPreviewUrl.value = bannerObjectUrl
        return
    }

    if (props.editing?.bannerKey) {
        try {
            bannerPreviewUrl.value = await events.getBannerUrl(props.editing.bannerKey)
        } catch {
            bannerPreviewUrl.value = null
        }
        return
    }

    bannerPreviewUrl.value = null
}

// Recalcula quando muda o arquivo ou o item em edição
watch([bannerFile, () => props.editing?.bannerKey], () => {
    void computeBannerPreview()
}, { immediate: true })

onBeforeUnmount(() => {
    if (bannerObjectUrl) URL.revokeObjectURL(bannerObjectUrl)
})

const form = reactive<CreateInput>({
    title: '',
    theme: '',
    type: undefined,
    date: '',
    time: '',
    dateLabel: '',
    timeLabel: '',
    location: '',
    description: '',
    hashtags: [],
    bannerKey: '',
    isCurrent: false,
    venueName: '',
    venueAddress: '',
    venueMapUrl: '',
})

const hashtagsInput = computed({
    get: () => (form.hashtags ?? []).join(', '),
    set: (v: string) => {
        const arr = v
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        form.hashtags = arr
    },
})

watchEffect(() => {
    if (props.editing) {
        const e = props.editing
        const patch: UpdateInput = {
            id: e.id,
            title: e.title,
            theme: e.theme,
            type: e.type,
            date: e.date,
            time: e.time,
            dateLabel: e.dateLabel,
            timeLabel: e.timeLabel,
            location: e.location,
            description: e.description,
            hashtags: e.hashtags ?? [],
            bannerKey: e.bannerKey ?? '',
            isCurrent: e.isCurrent ?? false,
            venueName: e.venueName ?? '',
            venueAddress: e.venueAddress ?? '',
            venueMapUrl: e.venueMapUrl ?? '',
        }
        Object.assign(form, patch)
    } else {
        // reset
        Object.assign(form, {
            title: '',
            theme: '',
            type: undefined,
            date: '',
            time: '',
            dateLabel: '',
            timeLabel: '',
            location: '',
            description: '',
            hashtags: [],
            bannerKey: '',
            isCurrent: false,
            venueName: '',
            venueAddress: '',
            venueMapUrl: '',
        } as CreateInput)
        bannerFile.value = null
    }
})

function onBannerChange(ev: Event): void {
    const input = ev.target as HTMLInputElement
    bannerFile.value = input.files?.[0] ?? null
}

async function onSubmit(): Promise<void> {
    try {
        submitting.value = true

        // create vs update
        if (props.editing) {
            const saved = await events.updateEvent({ ...(form as UpdateInput), id: props.editing.id })
            // upload banner se selecionado
            if (bannerFile.value) {
                await events.uploadBanner(bannerFile.value, saved.id)
            }
            emit('saved', saved)
        } else {
            const created = await events.createEvent(form as CreateInput)
            if (bannerFile.value) {
                await events.uploadBanner(bannerFile.value, created.id)
            }
            emit('saved', created)
        }
    } finally {
        submitting.value = false
    }
}
</script>

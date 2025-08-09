<template>
    <Dialog :open="open" @update:open="(v: boolean) => (!v) && $emit('close')">
        <DialogContent class="max-w-3xl">
            <DialogHeader>
                <DialogTitle>{{ editing ? 'Editar palestrante' : 'Novo palestrante' }}</DialogTitle>
                <DialogDescription>Preencha os campos e salve.</DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <Label for="name">Nome *</Label>
                        <Input id="name" v-model="form.name" required />
                    </div>

                    <div>
                        <Label for="title">Título</Label>
                        <Input id="title" v-model="form.title" placeholder="Ex.: Senior Dev @ Empresa" />
                    </div>

                    <div>
                        <Label for="skills">Skills (vírgula-separadas)</Label>
                        <Input id="skills" v-model="skillsInput" placeholder="aws, serverless, vue" />
                    </div>

                    <div class="md:col-span-2">
                        <Label for="bioIntro">Bio — Intro</Label>
                        <Textarea id="bioIntro" v-model="form.bioIntro" rows="3" />
                    </div>

                    <div class="md:col-span-2">
                        <Label for="bioExperience">Bio — Experiência</Label>
                        <Textarea id="bioExperience" v-model="form.bioExperience" rows="3" />
                    </div>

                    <div class="md:col-span-2">
                        <Label for="bioExpertise">Bio — Expertise</Label>
                        <Textarea id="bioExpertise" v-model="form.bioExpertise" rows="3" />
                    </div>

                    <div class="md:col-span-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <!-- Coluna esquerda: upload + info -->
                            <div>
                                <Label for="avatar">Avatar</Label>
                                <Input id="avatar" type="file" accept="image/*" @change="onAvatarChange" />

                                <!-- Mostra o path atual (opcional) -->
                                <p v-if="editing?.imageKey" class="text-xs text-muted-foreground mt-1">
                                    Atual: {{ editing.imageKey }}
                                </p>
                            </div>

                            <!-- Coluna direita: pré-visualização -->
                            <div class="flex md:justify-end">
                                <div class="shrink-0 w-40 h-40 rounded-full border overflow-hidden bg-muted/30
               flex items-center justify-center">
                                    <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl"
                                        alt="Pré-visualização do avatar" class="w-full h-full object-cover" />
                                    <span v-else class="text-xs text-muted-foreground">Sem preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="secondary" @click="$emit('close')">Cancelar</Button>
                    <Button type="submit" :disabled="submitting">{{ submitting ? 'Salvando…' : 'Salvar' }}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect, watch, onBeforeUnmount } from 'vue'
import { useSpeakers } from '@/composables/useSpeakers'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type SpeakersHook = ReturnType<typeof useSpeakers>
const speakers: SpeakersHook = useSpeakers()

type SpeakerRow = typeof speakers.items.value[number]
type CreateInput = Parameters<SpeakersHook['createSpeaker']>[0]
type UpdateInput = Parameters<SpeakersHook['updateSpeaker']>[0] // ← teu update recebe 1 objeto (patch com id)

const props = defineProps<{
    open: boolean
    editing: SpeakerRow | null
}>()
const emit = defineEmits<{
    (e: 'close'): void
    (e: 'saved', payload: SpeakerRow): void
}>()

const submitting = ref(false)
const imageFile = ref<File | null>(null)

const avatarPreviewUrl = ref<string | null>(null)
let avatarObjectUrl: string | null = null

const form = reactive<CreateInput>({
    name: '',
    title: '',
    imageKey: '',
    bioIntro: '',
    bioExperience: '',
    bioExpertise: '',
    skills: [],
})

const skillsInput = computed({
    get: () => (form.skills ?? []).join(', '),
    set: (v: string) => {
        const arr = v.split(',').map(s => s.trim()).filter(Boolean)
        form.skills = arr
    },
})

watchEffect(() => {
    if (props.editing) {
        const s = props.editing
        const patch: UpdateInput = {
            id: s.id,
            name: s.name,
            title: s.title ?? '',
            imageKey: s.imageKey ?? '',
            bioIntro: s.bioIntro ?? '',
            bioExperience: s.bioExperience ?? '',
            bioExpertise: s.bioExpertise ?? '',
            skills: s.skills ?? [],
        }
        Object.assign(form, patch)
    } else {
        Object.assign(form, {
            name: '',
            title: '',
            imageKey: '',
            bioIntro: '',
            bioExperience: '',
            bioExpertise: '',
            skills: [],
        } as CreateInput)
        imageFile.value = null
    }
})

function onAvatarChange(ev: Event): void {
    const input = ev.target as HTMLInputElement
    imageFile.value = input.files?.[0] ?? null
}

async function computeAvatarPreview() {
    if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl)
        avatarObjectUrl = null
    }

    if (imageFile.value) {
        avatarObjectUrl = URL.createObjectURL(imageFile.value)
        avatarPreviewUrl.value = avatarObjectUrl
        return
    }

    if (props.editing?.imageKey) {
        try {
            avatarPreviewUrl.value = await speakers.getAvatarUrl(props.editing.imageKey)
        } catch {
            avatarPreviewUrl.value = null
        }
        return
    }

    avatarPreviewUrl.value = null
}

watch([imageFile, () => props.editing?.imageKey], () => {
    void computeAvatarPreview()
}, { immediate: true })

async function onSubmit(): Promise<void> {
    try {
        submitting.value = true

        if (props.editing) {
            // update
            const saved = await speakers.updateSpeaker({
                id: props.editing.id,
                name: form.name,
                title: form.title,
                bioIntro: form.bioIntro,
                bioExperience: form.bioExperience,
                bioExpertise: form.bioExpertise,
                skills: form.skills,
                imageKey: form.imageKey,
            })

            if (imageFile.value) {
                const path = await speakers.uploadAvatar(imageFile.value, saved.id)
                await speakers.updateSpeaker({ id: saved.id, imageKey: path })
            }

            emit('saved', saved as SpeakerRow)
        } else {
            // create
            const created = await speakers.createSpeaker(form as CreateInput)
            if (imageFile.value) {
                const path = await speakers.uploadAvatar(imageFile.value, created.id)
                await speakers.updateSpeaker({ id: created.id, imageKey: path })
            }
            emit('saved', created as SpeakerRow)
        }
    } finally {
        submitting.value = false
    }
}

onBeforeUnmount(() => {
    if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl)
})

</script>

<template>
    <Dialog :open="open" @update:open="(v: boolean) => (!v) && $emit('close')">
        <DialogContent class="!max-w-6xl overflow-y-auto !max-h-[90vh]">
            <DialogHeader>
                <DialogTitle>{{ editing ? 'Editar palestrante' : 'Novo palestrante' }}</DialogTitle>
                <DialogDescription>Preencha os campos e salve.</DialogDescription>
            </DialogHeader>

            <form class="space-y-6" @submit.prevent="onSubmit">
                <!-- ================= Dados do Speaker ================= -->
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
                                <p v-if="editing?.imageKey" class="text-xs text-muted-foreground mt-1">
                                    Atual: {{ editing.imageKey }}
                                </p>
                            </div>

                            <!-- Coluna direita: pré-visualização -->
                            <div class="flex md:justify-end">
                                <div
                                    class="shrink-0 w-40 h-40 rounded-full border overflow-hidden bg-muted/30 flex items-center justify-center">
                                    <img v-if="avatarPreviewUrl" :src="avatarPreviewUrl"
                                        alt="Pré-visualização do avatar" class="w-full h-full object-cover" />
                                    <span v-else class="text-xs text-muted-foreground">Sem preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ================= Redes Sociais ================= -->
                <div class="space-y-4">
                    <div class="grid md:grid-cols-[200px_1fr] gap-3">
                        <div>
                            <Label for="smType">Plataforma</Label>
                            <Select v-model="smForm.type">
                                <SelectTrigger id="smType">
                                    <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>
                                <SelectContent
                                    class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
                                    <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                                    <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                                    <SelectItem value="GITHUB">GitHub</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="OTHER">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label for="smUrl">URL</Label>
                            <Input id="smUrl" v-model="smForm.url" placeholder="https://..." />
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <Button type="button" @click="addPendingSocial" :disabled="!smForm.type || !smForm.url">
                            Adicionar rede
                        </Button>
                        <Button type="button" variant="secondary" @click="reloadExistingSocials" :disabled="!editingId">
                            Recarregar existentes
                        </Button>
                    </div>

                    <!-- Pendentes -->
                    <div v-if="pendingSocials.length" class="border rounded-xl p-3">
                        <div class="text-sm font-medium mb-2">Redes a serem criadas:</div>
                        <ul class="space-y-2">
                            <li v-for="s in pendingSocials" :key="s._id"
                                class="border rounded-md p-2 flex items-center justify-between">
                                <span class="text-sm">{{ prettyMedia(s.type) }} — {{ s.url }}</span>
                                <Button size="sm" variant="ghost" type="button"
                                    @click="removePendingSocial(s._id)">Remover</Button>
                            </li>
                        </ul>
                    </div>

                    <!-- Existentes -->
                    <div v-if="existingSocials.length" class="border rounded-xl p-3">
                        <div class="text-sm font-medium mb-2">Redes atuais:</div>
                        <ul class="space-y-2">
                            <li v-for="s in existingSocials" :key="s.id"
                                class="border rounded-md p-2 flex items-center justify-between">
                                <span class="text-sm">{{ prettyMedia(s.name) }} — {{ s.url }}</span>
                                <Button size="sm" variant="ghost" type="button"
                                    @click="deleteExistingSocial(s.id)">Excluir</Button>
                            </li>
                        </ul>
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type SpeakersHook = ReturnType<typeof useSpeakers>
const speakers: SpeakersHook = useSpeakers()

type SpeakerRow = typeof speakers.items.value[number]
type CreateInput = Parameters<SpeakersHook['createSpeaker']>[0]
type UpdateInput = Parameters<SpeakersHook['updateSpeaker']>[0]

/** Enum (espelha o MediaType do backend) */
type MediaName = 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'

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

/* ================= Skills (vírgula) ================= */
const skillsInput = computed({
    get: () => (form.skills ?? []).join(', '),
    set: (v: string) => {
        const arr = v.split(',').map(s => s.trim()).filter(Boolean)
        form.skills = arr
    },
})

/* ================= Socials ================= */
const editingId = computed(() => props.editing?.id ?? '')
type ExistingSocial = { id: string; name: MediaName; url: string }
type PendingSocial = { _id: string; type: MediaName | ''; url: string }

const existingSocials = ref<ExistingSocial[]>([])
const pendingSocials = ref<PendingSocial[]>([])
const smForm = reactive<PendingSocial>({ _id: '', type: '', url: '' })

function prettyMedia(name: MediaName | ''): string {
    switch (name) {
        case 'LINKEDIN': return 'LinkedIn'
        case 'INSTAGRAM': return 'Instagram'
        case 'GITHUB': return 'GitHub'
        case 'MEDIUM': return 'Medium'
        case 'OTHER': return 'Outro'
        default: return '—'
    }
}

async function reloadExistingSocials(): Promise<void> {
    if (!editingId.value) {
        existingSocials.value = []
        return
    }
    const data = await speakers.listMediasBySpeaker(editingId.value, 100)
    existingSocials.value = (data ?? []).map(m => ({ id: m.id, name: m.name as MediaName, url: m.url }))
}

function addPendingSocial(): void {
    if (!smForm.type || !smForm.url.trim()) return
    pendingSocials.value.push({ _id: crypto.randomUUID(), type: smForm.type, url: smForm.url.trim() })
    smForm._id = ''
    smForm.type = ''
    smForm.url = ''
}
function removePendingSocial(id: string): void {
    pendingSocials.value = pendingSocials.value.filter(s => s._id !== id)
}
async function deleteExistingSocial(id: string): Promise<void> {
    await speakers.deleteSpeakerMedia(id)
    existingSocials.value = existingSocials.value.filter(s => s.id !== id)
}

/* ================= Avatar preview ================= */
function onAvatarChange(ev: Event): void {
    const input = ev.target as HTMLInputElement
    imageFile.value = input.files?.[0] ?? null
}

async function computeAvatarPreview(): Promise<void> {
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

watch([imageFile, () => props.editing?.imageKey], () => { void computeAvatarPreview() }, { immediate: true })

/* ================= Hydrate ao abrir/editar ================= */
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

    // limpa pendências de sociais
    pendingSocials.value = []
})

watch(() => editingId.value, (id) => {
    if (id) void reloadExistingSocials()
    else existingSocials.value = []
}, { immediate: true })

/* ================= Submit ================= */
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

            // avatar (se selecionado)
            if (imageFile.value) {
                const path = await speakers.uploadAvatar(imageFile.value, saved.id)
                await speakers.updateSpeaker({ id: saved.id, imageKey: path })
            }

            // redes pendentes
            for (const s of pendingSocials.value) {
                await speakers.createSpeakerMedia(saved.id, s.type as MediaName, s.url)
            }
            pendingSocials.value = []
            await reloadExistingSocials()

            emit('saved', saved as SpeakerRow)
        } else {
            // create
            const created = await speakers.createSpeaker(form as CreateInput)

            // avatar (se selecionado)
            if (imageFile.value) {
                const path = await speakers.uploadAvatar(imageFile.value, created.id)
                await speakers.updateSpeaker({ id: created.id, imageKey: path })
            }

            // redes pendentes
            for (const s of pendingSocials.value) {
                await speakers.createSpeakerMedia(created.id, s.type as MediaName, s.url)
            }
            pendingSocials.value = []
            await reloadExistingSocials()

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

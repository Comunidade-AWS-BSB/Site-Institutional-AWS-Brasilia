<template>
    <Dialog :open="open" @update:open="(v: boolean) => (!v) && $emit('close')">
        <DialogContent class="!max-w-none !w-[56vw]">
            <DialogHeader>
                <DialogTitle>{{ editing ? 'Editar evento' : 'Novo evento' }}</DialogTitle>
                <DialogDescription>Preencha as abas abaixo e salve.</DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <Tabs v-model="tab" class="w-full">
                    <TabsList class="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="info">Informações do Evento</TabsTrigger>
                        <TabsTrigger value="talk">Informações da Palestra</TabsTrigger>
                        <TabsTrigger value="sponsors">Patrocinadores</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                    </TabsList>

                    <!-- ============ ABA: INFORMAÇÕES DO EVENTO ============ -->
                    <TabsContent value="info" class="mt-6 overflow-y-auto max-h-[450px]">
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Coluna ESQUERDA -->
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
                                        <Input id="dateLabel" v-model="form.dateLabel"
                                            placeholder="Ex.: 12 de Outubro" />
                                    </div>
                                    <div>
                                        <Label for="timeLabel">Rótulo de hora</Label>
                                        <Input id="timeLabel" v-model="form.timeLabel" placeholder="Ex.: 19h às 21h" />
                                    </div>
                                </div>

                                <div class="flex items-center gap-2 pt-1">
                                    <Switch id="isCurrent" :model-value="form.isCurrent"
                                        @update:model-value="val => form.isCurrent = val" />
                                    <Label for="isCurrent">Evento atual</Label>
                                </div>

                                <div>
                                    <Label for="banner">Banner</Label>
                                    <Input id="banner" type="file" accept="image/*" @change="onBannerChange" />
                                    <p v-if="editing?.bannerKey" class="text-xs text-muted-foreground mt-1">
                                        Atual: {{ editing.bannerKey }}
                                    </p>
                                </div>
                            </div>

                            <!-- Coluna DIREITA -->
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

                                <!-- Preview do banner -->
                                <div v-if="bannerPreviewUrl" class="mt-2">
                                    <div class="text-xs text-muted-foreground mb-1">Pré-visualização</div>
                                    <img :src="bannerPreviewUrl" alt="Pré-visualização do banner"
                                        class="block w-full max-h-50 object-cover rounded-md border" />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <!-- ============ ABA: INFORMAÇÕES DA PALESTRA ============ -->
                    <TabsContent value="talk" class="mt-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <Label for="talkTitle">Título da palestra</Label>
                                    <Input id="talkTitle" v-model="talk.title"
                                        placeholder="Ex.: Serverless na prática" />
                                </div>

                                <div>
                                    <Label for="speaker">Palestrante</Label>
                                    <Select v-model="talk.speakerId">
                                        <SelectTrigger id="speaker">
                                            <SelectValue placeholder="Selecionar palestrante" />
                                        </SelectTrigger>
                                        <SelectContent
                                            class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
                                            <SelectItem v-for="sp in speakerOptions" :key="sp.id" :value="sp.id">
                                                {{ sp.name }} <span v-if="sp.title" class="text-muted-foreground"> — {{
                                                    sp.title }}</span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label for="duration">Duração (min)</Label>
                                        <Input id="duration" type="number" min="0"
                                            v-model.number="talk.durationMinutes" />
                                    </div>
                                    <div>
                                        <Label for="order">Ordem</Label>
                                        <Input id="order" type="number" min="0" v-model.number="talk.order" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label for="abstract">Resumo / Abstract</Label>
                                <Textarea id="abstract" rows="8" v-model="talk.abstract"
                                    placeholder="Descrição breve do conteúdo da palestra" />
                            </div>
                        </div>

                        <p class="text-xs text-muted-foreground mt-3">
                            Dica: deixe em branco se ainda não quiser cadastrar a palestra; você pode voltar depois.
                        </p>
                    </TabsContent>

                    <!-- ============ ABA: PATROCINADORES ============ -->
                    <TabsContent value="sponsors" class="mt-6 space-y-4">
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="md:col-span-2 space-y-3">
                                <div>
                                    <Label for="sponsorName">Nome do patrocinador</Label>
                                    <Input id="sponsorName" v-model="sponsorForm.name" placeholder="Ex.: Empresa XYZ" />
                                </div>
                                <div>
                                    <Label for="sponsorLogo">Logo (imagem)</Label>
                                    <Input id="sponsorLogo" type="file" accept="image/*"
                                        @change="onSponsorLogoChange" />
                                </div>
                                <Button type="button" @click="addSponsor" :disabled="!sponsorForm.name">
                                    Adicionar patrocinador à lista
                                </Button>
                            </div>

                            <div v-if="sponsorForm.previewUrl" class="border rounded-lg overflow-hidden">
                                <img :src="sponsorForm.previewUrl" alt="Preview logo"
                                    class="h-40 w-full object-contain bg-muted" />
                            </div>
                        </div>

                        <div v-if="pendingSponsors.length" class="border rounded-xl p-3">
                            <div class="text-sm font-medium mb-2">Patrocinadores a serem criados:</div>
                            <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <li v-for="sp in pendingSponsors" :key="sp._id"
                                    class="border rounded-md p-2 flex items-center gap-3">
                                    <img v-if="sp.previewUrl" :src="sp.previewUrl" class="h-10 w-10 object-contain"
                                        alt="" />
                                    <div class="flex-1">
                                        <div class="text-sm font-medium">{{ sp.name }}</div>
                                        <div class="text-xs text-muted-foreground text-ellipsis">{{ sp.logoFile?.name ||
                                            '—'
                                            }}</div>
                                    </div>
                                    <Button size="sm" variant="ghost" type="button"
                                        @click="removeSponsor(sp._id)">Remover</Button>
                                </li>
                            </ul>
                        </div>

                        <div v-if="existingSponsors.length" class="border rounded-xl p-3">
                            <div class="text-sm font-medium mb-2">Patrocinadores atuais:</div>
                            <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <li v-for="sp in existingSponsors" :key="sp.id"
                                    class="border rounded-md p-2 flex items-center gap-3">
                                    <img v-if="sp.logoKey" :src="existingLogoUrl(sp.logoKey)"
                                        class="h-10 w-10 object-contain" alt="" />
                                    <div class="text-sm">{{ sp.name }}</div>
                                    <!-- TODO: adicionar botão de remoção -->
                                </li>
                            </ul>
                        </div>
                    </TabsContent>

                    <!-- ============ ABA: FAQ ============ -->
                    <TabsContent value="faq" class="mt-6 space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label for="faqQuestion">Pergunta</Label>
                                <Input id="faqQuestion" v-model="faqForm.question"
                                    placeholder="Ex.: Precisa de inscrição?" />
                            </div>
                            <div>
                                <Label for="faqAnswer">Resposta</Label>
                                <Input id="faqAnswer" v-model="faqForm.answer"
                                    placeholder="Ex.: Não, é entrada gratuita." />
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <Button type="button" @click="addPendingFaq"
                                :disabled="!faqForm.question || !faqForm.answer">
                                Adicionar FAQ
                            </Button>
                            <Button type="button" variant="secondary" @click="reloadExistingFaqs"
                                :disabled="!props.editing">
                                Recarregar FAQs existentes
                            </Button>
                        </div>

                        <!-- Pendentes (serão criadas no submit) -->
                        <div v-if="pendingFaqs.length" class="border rounded-xl p-3">
                            <div class="text-sm font-medium mb-2">FAQs a serem criadas:</div>
                            <ul class="space-y-2">
                                <li v-for="f in pendingFaqs" :key="f._id" class="border rounded-md p-2">
                                    <div class="font-medium">{{ f.question }}</div>
                                    <div class="text-sm text-muted-foreground">{{ f.answer }}</div>
                                    <div class="mt-1">
                                        <Button size="sm" variant="ghost" type="button"
                                            @click="removePendingFaq(f._id)">Remover</Button>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <!-- Existentes (já no banco) -->
                        <div v-if="existingFaqs.length" class="border rounded-xl p-3">
                            <div class="text-sm font-medium mb-2">FAQs atuais:</div>
                            <ul class="space-y-2">
                                <li v-for="f in existingFaqs" :key="f.id" class="border rounded-md p-2">
                                    <div class="font-medium">{{ f.question }}</div>
                                    <div class="text-sm text-muted-foreground">{{ f.answer }}</div>
                                    <!-- opcional: remover direto do backend -->
                                    <div class="mt-1">
                                        <Button size="sm" variant="ghost" type="button"
                                            @click="deleteExistingFaq(f.id)">Excluir</Button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>

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
import { computed, reactive, ref, watch, onBeforeUnmount, onMounted } from 'vue'
import { useEvents, type TalkRow, type SponsorRow } from '@/composables/useEvents'
import { useSpeakers } from '@/composables/useSpeakers'
import { getDataClient } from '@/composables/useData'
import { uploadData } from 'aws-amplify/storage'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { buildSponsorLogoPath } from '@/constants/storage'

type EventsHook = ReturnType<typeof useEvents>
type SpeakersHook = ReturnType<typeof useSpeakers>

const events: EventsHook = useEvents()
const speakersHook: SpeakersHook = useSpeakers()
const client = getDataClient()

type EventRow = typeof events.items.value[number]
type CreateInput = Parameters<EventsHook['createEvent']>[0]
type UpdateInput = Parameters<EventsHook['updateEvent']>[0]

type ExistingFaq = { id: string; question: string; answer: string }
type PendingFaq = { _id: string; question: string; answer: string }
type ExistingSponsor = { id: string; name: string; logoKey?: string | null }
type PendingSponsor = { _id: string; name: string; logoFile?: File | null; previewUrl?: string | null }

const props = defineProps<{ open: boolean; editing: EventRow | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved', payload: EventRow): void }>()

/* ---------------- UI/Tabs ---------------- */
const tab = ref<'info' | 'talk' | 'sponsors' | 'faq'>('info')

/* ---------------- Evento (form base) ---------------- */
const form = reactive<CreateInput>({
    title: '', theme: '', type: undefined,
    date: '', time: '',
    dateLabel: '', timeLabel: '',
    location: '', description: '',
    hashtags: [], bannerKey: '', isCurrent: false,
    venueName: '', venueAddress: '', venueMapUrl: '',
})

const hashtagsInput = computed({
    get: () => (form.hashtags ?? []).join(', '),
    set: (v: string) => { form.hashtags = v.split(',').map(s => s.trim()).filter(Boolean) }
})

/* ---------------- Talk ---------------- */
const talk = reactive<{
    title: string
    abstract: string
    durationMinutes: number | null
    order: number | null
    speakerId: string | null
}>({
    title: '', abstract: '', durationMinutes: null, order: null, speakerId: null
})
const talkId = ref<string | null>(null)

/* ---------------- Sponsors ---------------- */
const existingSponsors = ref<ExistingSponsor[]>([])
const sponsorForm = reactive<PendingSponsor>({ _id: '', name: '', logoFile: null, previewUrl: null })
const pendingSponsors = ref<PendingSponsor[]>([])

/* ---------------- FAQ ---------------- */
const existingFaqs = ref<ExistingFaq[]>([])
const pendingFaqs = ref<PendingFaq[]>([])
const faqForm = reactive<PendingFaq>({ _id: '', question: '', answer: '' })

/* ---------------- Helpers de preview ---------------- */
const submitting = ref(false)
const bannerFile = ref<File | null>(null)
const bannerPreviewUrl = ref<string | null>(null)
let bannerObjectUrl: string | null = null

const speakerOptions = computed(() => speakersHook.items.value)

const logoUrlMap = ref<Record<string, string>>({})
function existingLogoUrl(key?: string | null) {
    if (!key) return ''
    const cached = logoUrlMap.value[key]
    if (cached) return cached
    void events.getAssetUrl(key).then(url => {
        if (url) logoUrlMap.value = { ...logoUrlMap.value, [key]: url }
    })
    return ''
}

/* ---------------- Hidratação das relações (Talk/Sponsors/FAQ) ---------------- */
async function hydrateRelations(eventId: string): Promise<void> {
    // Talk (pega a primeira)
    const talkRes = await client.models.Talk.list({ filter: { eventId: { eq: eventId } }, limit: 1 })
    const firstTalk = Array.isArray(talkRes.data) ? talkRes.data[0] : undefined
    if (firstTalk) {
        talkId.value = firstTalk.id
        talk.title = firstTalk.title ?? ''
        talk.abstract = firstTalk.abstract ?? ''
        talk.durationMinutes = firstTalk.durationMinutes ?? null
        talk.order = firstTalk.order ?? null
        talk.speakerId = firstTalk.speakerId ?? null
    } else {
        talkId.value = null
        talk.title = ''; talk.abstract = ''
        talk.durationMinutes = null; talk.order = null; talk.speakerId = null
    }

    // Sponsors existentes
    const spRes = await client.models.EventSponsor.list({ filter: { eventId: { eq: eventId } }, limit: 100 })
    const sponsorsArr = Array.isArray(spRes.data) ? spRes.data : []
    existingSponsors.value = sponsorsArr.map(s => ({ id: s.id, name: s.name, logoKey: s.logoKey ?? null }))

    // FAQs existentes
    await reloadExistingFaqs(eventId)
}

/* ---------------- FAQ helpers ---------------- */
async function reloadExistingFaqs(eventId?: string) {
    const id = eventId ?? props.editing?.id
    if (!id) { existingFaqs.value = []; return }
    const { data, errors } = await client.models.EventFaq.list({
        filter: { eventId: { eq: id } },
        limit: 1000,
        selectionSet: ['id', 'question', 'answer'] as const,
    })
    if (errors?.length) throw new Error(errors.map(e => (e as { message?: string }).message ?? String(e)).join('; '))
    existingFaqs.value = (data ?? []).map(f => ({
        id: f.id, question: f.question ?? '', answer: f.answer ?? ''
    }))
}

function addPendingFaq() {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return
    const _id = crypto.randomUUID()
    pendingFaqs.value.push({ _id, question: faqForm.question.trim(), answer: faqForm.answer.trim() })
    faqForm._id = ''; faqForm.question = ''; faqForm.answer = ''
}

function removePendingFaq(id: string) {
    pendingFaqs.value = pendingFaqs.value.filter(f => f._id !== id)
}

async function deleteExistingFaq(id: string) {
    await client.models.EventFaq.delete({ id })
    existingFaqs.value = existingFaqs.value.filter(f => f.id !== id)
}

/* ---------------- Sponsors helpers ---------------- */
function onSponsorLogoChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    sponsorForm.logoFile = file
    if (sponsorForm.previewUrl) URL.revokeObjectURL(sponsorForm.previewUrl)
    sponsorForm.previewUrl = file ? URL.createObjectURL(file) : null
}

function addSponsor() {
    if (!sponsorForm.name.trim()) return
    const _id = crypto.randomUUID()
    pendingSponsors.value.push({
        _id,
        name: sponsorForm.name.trim(),
        logoFile: sponsorForm.logoFile ?? undefined,
        previewUrl: sponsorForm.previewUrl ?? undefined, // NÃO revoga aqui
    })
    sponsorForm._id = ''
    sponsorForm.name = ''
    sponsorForm.logoFile = null
    sponsorForm.previewUrl = null
}

function removeSponsor(id: string) {
    const sp = pendingSponsors.value.find(s => s._id === id)
    if (sp?.previewUrl) URL.revokeObjectURL(sp.previewUrl)
    pendingSponsors.value = pendingSponsors.value.filter(s => s._id !== id)
}

/* ---------------- Banner preview ---------------- */
async function computeBannerPreview() {
    if (bannerObjectUrl) { URL.revokeObjectURL(bannerObjectUrl); bannerObjectUrl = null }
    if (bannerFile.value) {
        bannerObjectUrl = URL.createObjectURL(bannerFile.value)
        bannerPreviewUrl.value = bannerObjectUrl
        return
    }
    if (props.editing?.bannerKey) {
        try { bannerPreviewUrl.value = await events.getAssetUrl(props.editing.bannerKey) }
        catch { bannerPreviewUrl.value = null }
        return
    }
    bannerPreviewUrl.value = null
}
function onBannerChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    bannerFile.value = input.files?.[0] ?? null
}
watch([bannerFile, () => props.editing?.bannerKey], () => { void computeBannerPreview() }, { immediate: true })

/* ---------------- Hidratação “ao abrir” ---------------- */
function resetAuxTabs() {
    // talk
    talkId.value = null
    talk.title = ''; talk.abstract = ''
    talk.durationMinutes = null; talk.order = null; talk.speakerId = null

    // sponsors pendentes
    for (const sp of pendingSponsors.value) if (sp.previewUrl) URL.revokeObjectURL(sp.previewUrl)
    pendingSponsors.value = []
    sponsorForm._id = ''; sponsorForm.name = ''; sponsorForm.logoFile = null
    if (sponsorForm.previewUrl) { URL.revokeObjectURL(sponsorForm.previewUrl); sponsorForm.previewUrl = null }

    // faqs pendentes
    pendingFaqs.value = []
}

function initFormFromEditing(e: EventRow) {
    const patch: UpdateInput = {
        id: e.id,
        title: e.title, theme: e.theme, type: e.type,
        date: e.date, time: e.time,
        dateLabel: e.dateLabel, timeLabel: e.timeLabel,
        location: e.location, description: e.description,
        hashtags: e.hashtags ?? [],
        bannerKey: e.bannerKey ?? '',
        isCurrent: e.isCurrent ?? false,
        venueName: e.venueName ?? '', venueAddress: e.venueAddress ?? '', venueMapUrl: e.venueMapUrl ?? '',
    }
    Object.assign(form, patch)
}

async function hydrateOnOpen() {
    tab.value = 'info'

    if (!props.open) return

    // novo evento
    if (!props.editing) {
        Object.assign(form, {
            title: '', theme: '', type: undefined, date: '', time: '',
            dateLabel: '', timeLabel: '', location: '', description: '',
            hashtags: [], bannerKey: '', isCurrent: false,
            venueName: '', venueAddress: '', venueMapUrl: '',
        } as CreateInput)
        existingSponsors.value = []
        existingFaqs.value = []
        resetAuxTabs()
        await computeBannerPreview()
        return
    }

    // edição
    initFormFromEditing(props.editing)
    resetAuxTabs()
    await Promise.all([
        hydrateRelations(props.editing.id),
        computeBannerPreview(),
    ])
}

// roda sempre que o modal abre/fecha e quando o id de edição muda (com modal aberto)
watch(() => props.open, () => { void hydrateOnOpen() }, { immediate: true })
watch(() => props.editing?.id, () => { if (props.open) void hydrateOnOpen() })

/* ---------------- Boot ---------------- */
onMounted(async () => {
    if (speakersHook.items.value.length === 0) {
        await speakersHook.listSpeakers({ limit: 100 })
    }
})

/* ---------------- Unmount cleanup ---------------- */
onBeforeUnmount(() => {
    if (bannerObjectUrl) URL.revokeObjectURL(bannerObjectUrl)
    for (const sp of pendingSponsors.value) {
        if (sp.previewUrl) URL.revokeObjectURL(sp.previewUrl)
    }
    if (sponsorForm.previewUrl) URL.revokeObjectURL(sponsorForm.previewUrl)
})

/* ---------------- Submit ---------------- */
async function onSubmit() {
    try {
        submitting.value = true

        let saved: EventRow
        if (props.editing) {
            saved = await events.updateEvent({ ...(form as UpdateInput), id: props.editing.id })
        } else {
            saved = await events.createEvent(form as CreateInput)
        }

        // banner
        if (bannerFile.value) {
            await events.uploadBanner(bannerFile.value, saved.id)
        }

        // talk
        if (talk.title && talk.speakerId) {
            if (talkId.value) {
                await client.models.Talk.update({
                    id: talkId.value,
                    title: talk.title,
                    abstract: talk.abstract || undefined,
                    durationMinutes: talk.durationMinutes ?? undefined,
                    order: talk.order ?? undefined,
                    eventId: saved.id,
                    speakerId: talk.speakerId,
                })
            } else {
                await client.models.Talk.create({
                    title: talk.title,
                    abstract: talk.abstract || undefined,
                    durationMinutes: talk.durationMinutes ?? undefined,
                    order: talk.order ?? undefined,
                    eventId: saved.id,
                    speakerId: talk.speakerId,
                })
            }
        }

        // sponsors pendentes
        for (const sp of pendingSponsors.value) {
            let logoKey: string | undefined
            if (sp.logoFile) {
                const path = buildSponsorLogoPath(saved.id, sp.logoFile.name)
                await uploadData({ path, data: sp.logoFile, options: { contentType: sp.logoFile.type || 'image/*' } }).result
                logoKey = path
            }
            await client.models.EventSponsor.create({ name: sp.name, eventId: saved.id, logoKey })
        }

        // faqs pendentes
        for (const f of pendingFaqs.value) {
            await client.models.EventFaq.create({ eventId: saved.id, question: f.question, answer: f.answer })
        }

        emit('saved', saved)
    } finally {
        submitting.value = false
    }
}
</script>

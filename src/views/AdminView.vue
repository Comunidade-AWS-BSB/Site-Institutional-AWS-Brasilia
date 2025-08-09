<template>
    <div class="px-6 py-8 space-y-6 mt-15 min-h-[100vh]">
        <header class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold">Admin</h1>
            <div class="text-sm text-muted-foreground">Gerencie eventos e palestrantes</div>
        </header>

        <Tabs v-model="activeTab" class="w-full">
            <TabsList>
                <TabsTrigger value="events">Eventos</TabsTrigger>
                <TabsTrigger value="speakers">Palestrantes</TabsTrigger>
            </TabsList>

            <!-- Eventos -->
            <TabsContent value="events" class="mt-6 space-y-4">
                <div class="flex flex-wrap gap-3 items-end">
                    <div class="flex-1 min-w-64">
                        <Label for="eventSearch">Buscar</Label>
                        <Input id="eventSearch" v-model="eventSearch" placeholder="Título contém..." />
                    </div>

                    <div class="min-w-48">
                        <Label for="eventType">Tipo</Label>
                        <Select v-model="eventTypeFilterStr">
                            <SelectTrigger id="eventType">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="MEETUP">MEETUP</SelectItem>
                                <SelectItem value="WORKSHOP">WORKSHOP</SelectItem>
                                <SelectItem value="TALK">TALK</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="min-w-40">
                        <Label for="isCurrent">Status</Label>
                        <Select v-model="isCurrentFilterStr">
                            <SelectTrigger id="isCurrent">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="true">Atual</SelectItem>
                                <SelectItem value="false">Anterior</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="min-w-40">
                        <Label for="fromDate">De (data)</Label>
                        <Input id="fromDate" type="date" v-model="fromDate" />
                    </div>

                    <div class="min-w-40">
                        <Label for="toDate">Até (data)</Label>
                        <Input id="toDate" type="date" v-model="toDate" />
                    </div>

                    <div class="ms-auto flex gap-2">
                        <Button variant="secondary" @click="reloadEvents" :disabled="events.loading">Atualizar</Button>
                        <Button @click="openCreateEvent">Novo evento</Button>
                    </div>
                </div>

                <div class="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[28rem]">Título</TableHead>
                                <TableHead class="hidden md:table-cell">Tipo</TableHead>
                                <TableHead class="hidden md:table-cell">Data</TableHead>
                                <TableHead class="hidden md:table-cell">Local</TableHead>
                                <TableHead class="w-[1%] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <template v-if="events.items.value.length">
                                <TableRow v-for="ev in events.items.value" :key="ev.id">
                                    <TableCell class="font-medium">
                                        <div class="flex items-center gap-2">
                                            <span>{{ ev.title }}</span>
                                            <Badge v-if="ev.isCurrent" variant="default">Atual</Badge>
                                        </div>
                                        <div class="text-xs text-muted-foreground truncate">{{ ev.theme }}</div>
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">{{ ev.type ?? '—' }}</TableCell>
                                    <TableCell class="hidden md:table-cell">
                                        <span>{{ ev.date ?? '—' }}</span>
                                        <span v-if="ev.time" class="text-muted-foreground"> · {{ ev.time }}</span>
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">{{ ev.location ?? '—' }}</TableCell>
                                    <TableCell class="text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button variant="secondary" size="sm"
                                                @click="openEditEvent(ev)">Editar</Button>
                                            <Button variant="destructive" size="sm"
                                                @click="confirmDeleteEvent(ev)">Excluir</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </template>
                            <TableRow v-else-if="!events.loading || events.items.value.length === 0">
                                <TableCell colspan="5" class="text-center text-muted-foreground">
                                    Nenhum evento encontrado.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div class="flex justify-center">
                    <Button v-if="events.hasMore" variant="outline" @click="loadMoreEvents" :disabled="events.loading">
                        Carregar mais
                    </Button>
                </div>
            </TabsContent>

            <!-- Palestrantes -->
            <TabsContent value="speakers" class="mt-6 space-y-4">
                <div class="flex flex-wrap gap-3 items-end">
                    <div class="flex-1 min-w-64">
                        <Label for="speakerSearch">Buscar</Label>
                        <Input id="speakerSearch" v-model="speakerSearch" placeholder="Nome contém..." />
                    </div>

                    <div class="ms-auto flex gap-2">
                        <Button variant="secondary" @click="reloadSpeakers"
                            :disabled="speakers.loading">Atualizar</Button>
                        <Button @click="openCreateSpeaker">Novo palestrante</Button>
                    </div>
                </div>

                <div class="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead class="w-[28rem]">Nome</TableHead>
                                <TableHead class="hidden md:table-cell">Título</TableHead>
                                <TableHead class="hidden md:table-cell">Skills</TableHead>
                                <TableHead class="w-[1%] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <template v-if="speakers.items.value.length">
                                <TableRow v-for="sp in speakers.items.value" :key="sp.id">
                                    <TableCell class="font-medium">
                                        <div>{{ sp.name }}</div>
                                        <div class="text-xs text-muted-foreground line-clamp-1">{{ sp.bioIntro }}</div>
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">{{ sp.title ?? '—' }}</TableCell>
                                    <TableCell class="hidden md:table-cell">
                                        <div class="max-w-[30rem] truncate">{{ (sp.skills ?? []).join(', ') }}</div>
                                    </TableCell>
                                    <TableCell class="text-right">
                                        <div class="flex justify-end gap-2">
                                            <Button variant="secondary" size="sm"
                                                @click="openEditSpeaker(sp)">Editar</Button>
                                            <Button variant="destructive" size="sm"
                                                @click="confirmDeleteSpeaker(sp)">Excluir</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </template>
                            <TableRow v-else-if="!speakers.loading || speakers.items.value.length === 0">
                                <TableCell colspan="4" class="text-center text-muted-foreground">
                                    Nenhum palestrante encontrado.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div class="flex justify-center">
                    <Button v-if="speakers.hasMore" variant="outline" @click="loadMoreSpeakers"
                        :disabled="speakers.loading">
                        Carregar mais
                    </Button>
                </div>
            </TabsContent>
        </Tabs>

        <!-- Modais -->
        <UpdateCreateEventModal :open="eventModalOpen" :editing="editingEvent" @close="eventModalOpen = false"
            @saved="onEventSaved" />

        <UpdateCreateSpeakerModal :open="speakerModalOpen" :editing="editingSpeaker" @close="speakerModalOpen = false"
            @saved="onSpeakerSaved" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useEvents } from '@/composables/useEvents'
import { useSpeakers } from '@/composables/useSpeakers'
import UpdateCreateEventModal from '@/components/admin/UpdateCreateEventModal.vue'
import UpdateCreateSpeakerModal from '@/components/admin/UpdateCreateSpeakerModal.vue'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type EventsHook = ReturnType<typeof useEvents>
type SpeakersHook = ReturnType<typeof useSpeakers>

const events: EventsHook = useEvents()
const speakers: SpeakersHook = useSpeakers()

// Deriva o tipo de linha a partir do estado dos hooks (sem export extra)
type EventRow = typeof events.items.value[number]
type SpeakerRow = typeof speakers.items.value[number]
type EventType = EventRow['type']

const activeTab = ref<'events' | 'speakers'>('events')

// Filtros e busca — Eventos
const eventSearch = ref<string>('')
const eventTypeFilterStr = ref<'ALL' | 'MEETUP' | 'WORKSHOP' | 'TALK'>('ALL')
const isCurrentFilterStr = ref<'ALL' | 'TRUE' | 'FALSE'>('ALL')

const eventTypeFilter = computed<EventType | undefined>({
    get: () => (eventTypeFilterStr.value === 'ALL' ? undefined : (eventTypeFilterStr.value as EventType)),
    set: (v) => { eventTypeFilterStr.value = (v ?? 'ALL') as typeof eventTypeFilterStr.value }
})

const isCurrentFilter = computed<boolean | undefined>({
    get: () => (isCurrentFilterStr.value === 'ALL' ? undefined : isCurrentFilterStr.value === 'TRUE'),
    set: (v) => { isCurrentFilterStr.value = v === undefined ? 'ALL' : v ? 'TRUE' : 'FALSE' }
})

const fromDate = ref<string>('')
const toDate = ref<string>('')

// Busca — Palestrantes
const speakerSearch = ref<string>('')

// Modais
const eventModalOpen = ref(false)
const speakerModalOpen = ref(false)
const editingEvent = ref<EventRow | null>(null)
const editingSpeaker = ref<SpeakerRow | null>(null)

/** Carrega eventos com filtros atuais */
async function reloadEvents(): Promise<void> {
    await events.listEvents({
        search: eventSearch.value || undefined,
        type: eventTypeFilter.value || undefined,
        isCurrent: typeof isCurrentFilter.value === 'boolean' ? isCurrentFilter.value : undefined,
        from: fromDate.value || undefined,
        to: toDate.value || undefined,
        limit: 20,
        nextToken: null,
    })
}

/** Carrega próxima página de eventos (mantendo filtros) */
async function loadMoreEvents(): Promise<void> {
    await events.listEvents({
        search: eventSearch.value || undefined,
        type: eventTypeFilter.value || undefined,
        isCurrent: typeof isCurrentFilter.value === 'boolean' ? isCurrentFilter.value : undefined,
        from: fromDate.value || undefined,
        to: toDate.value || undefined,
        limit: 20,
        nextToken: events.nextToken.value,
    })
}

/** Carrega speakers com filtro atual */
async function reloadSpeakers(): Promise<void> {
    await speakers.listSpeakers({
        search: speakerSearch.value || undefined,
        limit: 20,
        nextToken: null,
    })
}

/** Próxima página de speakers */
async function loadMoreSpeakers(): Promise<void> {
    await speakers.listSpeakers({
        search: speakerSearch.value || undefined,
        limit: 20,
        nextToken: speakers.nextToken.value,
    })
}

function openCreateEvent(): void {
    editingEvent.value = null
    eventModalOpen.value = true
}
function openEditEvent(ev: EventRow): void {
    editingEvent.value = ev
    eventModalOpen.value = true
}
async function confirmDeleteEvent(ev: EventRow): Promise<void> {
    if (!confirm(`Excluir evento "${ev.title}"?`)) return
    await events.deleteEvent(ev.id)
}

function openCreateSpeaker(): void {
    editingSpeaker.value = null
    speakerModalOpen.value = true
}
function openEditSpeaker(sp: SpeakerRow): void {
    editingSpeaker.value = sp
    speakerModalOpen.value = true
}
async function confirmDeleteSpeaker(sp: SpeakerRow): Promise<void> {
    if (!confirm(`Excluir palestrante "${sp.name}"?`)) return
    await speakers.deleteSpeaker(sp.id)
}

function onEventSaved(): void {
    eventModalOpen.value = false
    // Estado já é atualizado pelo composable (append/replace). Opcional recarregar:
    // reloadEvents()
}
function onSpeakerSaved(): void {
    speakerModalOpen.value = false
    // reloadSpeakers()
}

// Recarrega ao alterar filtros/busca (debounce simples)
let debounceTimer: number | undefined
watch([eventSearch, eventTypeFilterStr, isCurrentFilterStr, fromDate, toDate], () => {
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => void reloadEvents(), 250)
})
watch(speakerSearch, () => {
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => void reloadSpeakers(), 250)
})

// Inicial
onMounted(async () => {
    await Promise.all([reloadEvents(), reloadSpeakers()])
    console.log('Speakers carregados: ', speakers.items.value)
    console.log('Eventos carregados', events.items.value)
})
</script>

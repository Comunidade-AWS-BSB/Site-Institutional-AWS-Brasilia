// src/composables/useEvents.ts
import { ref, computed, type Ref } from 'vue'
import { uploadData, getUrl } from 'aws-amplify/storage'
import { getDataClient } from './useData'
import type { Schema } from '../../amplify/data/resource'
import type { SelectionSet } from 'aws-amplify/data'
import { buildEventBannerPath } from '@/constants/storage'

// ===== Tipos base (derivados do schema) =====
type Event = Schema['Event']['type']
type Talk = Schema['Talk']['type']
type Sponsor = Schema['EventSponsor']['type']
type Faq = Schema['EventFaq']['type']
type Speaker = Schema['Speaker']['type']
type Social = Schema['SocialMedia']['type']

export type EventId = Event['id']
export type EventType = Event['type']

// ===== Seleções tipadas (somente campos usados pela UI) =====
const baseSelection = [
    'id', 'title', 'theme', 'type', 'date', 'time', 'dateLabel', 'timeLabel',
    'location', 'description', 'hashtags', 'bannerKey', 'isCurrent',
    'venueName', 'venueAddress', 'venueMapUrl',
] as const
export type EventRow = SelectionSet<Event, typeof baseSelection>

const talkSelection = [
    'id', 'title', 'abstract', 'durationMinutes', 'order', 'eventId', 'speakerId'
] as const
export type TalkRow = SelectionSet<Talk, typeof talkSelection>

const sponsorSelection = ['id', 'name', 'logoKey', 'eventId'] as const
export type SponsorRow = SelectionSet<Sponsor, typeof sponsorSelection>

const faqSelection = ['id', 'question', 'answer', 'eventId'] as const
export type FaqRow = SelectionSet<Faq, typeof faqSelection>

const speakerSelection = [
    'id', 'name', 'title', 'imageKey', 'bioIntro', 'bioExperience', 'bioExpertise', 'skills'
] as const
export type SpeakerRow = SelectionSet<Speaker, typeof speakerSelection>

const socialSelection = ['id', 'name', 'url', 'speakerId'] as const
export type SocialRow = SelectionSet<Social, typeof socialSelection>

type DataClient = ReturnType<typeof getDataClient>
type UseEventsMode = 'auto' | 'public' | 'private'

// ===== Opções de listagem =====
export type ListEventsOptions = {
    search?: string
    type?: EventType
    isCurrent?: boolean
    from?: string
    to?: string
    limit?: number
    nextToken?: string | null
}

type UseEventsOptions = { mode?: UseEventsMode }

export function useEvents(options: UseEventsOptions = {}) {
    const mode: UseEventsMode = options.mode ?? 'auto'

    function resolveClient(): DataClient {
        return mode === 'auto' ? getDataClient() : getDataClient(mode)
    }

    // Inputs 100% fortemente tipados (derivados do client)
    type ClientModels = DataClient['models']
    type EventModel = ClientModels['Event']
    type CreateInput = Parameters<EventModel['create']>[0]
    type UpdateInput = Parameters<EventModel['update']>[0]
    type GetInput = Parameters<EventModel['get']>[0]
    type ListInput = Parameters<EventModel['list']>[0]

    // ===== Estado =====
    const items: Ref<EventRow[]> = ref([])
    const loading = ref(false)
    const error: Ref<Error | null> = ref(null)
    const nextToken: Ref<string | null> = ref(null)
    const hasMore = computed(() => nextToken.value !== null)

    // ===== List / Get / CRUD =====
    async function listEvents(opts?: ListEventsOptions) {
        try {
            loading.value = true
            error.value = null

            const filter =
                !opts?.search && !opts?.type && typeof opts?.isCurrent === 'undefined' && !opts?.from && !opts?.to
                    ? undefined
                    : {
                        ...(opts?.search ? { title: { contains: opts.search } } : {}),
                        ...(opts?.type ? { type: { eq: opts.type } } : {}),
                        ...(typeof opts?.isCurrent === 'boolean' ? { isCurrent: { eq: opts.isCurrent } } : {}),
                        ...((opts?.from || opts?.to)
                            ? { date: { ...(opts.from ? { ge: opts.from } : {}), ...(opts.to ? { le: opts.to } : {}) } }
                            : {}),
                    }

            const input: ListInput = {
                filter,
                limit: opts?.limit ?? 20,
                nextToken: opts?.nextToken ?? undefined,
            }

            const client = resolveClient()
            const { data, nextToken: token, errors } = await client.models.Event.list({ ...(input as any), selectionSet: baseSelection })
            if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))

            items.value = (data ?? []) as EventRow[]
            nextToken.value = token ?? null
            return { data: items.value, nextToken: nextToken.value }
        } catch (e) {
            error.value = e instanceof Error ? e : new Error(String(e))
            throw error.value
        } finally {
            loading.value = false
        }
    }

    async function getEvent(id: EventId) {
        const client = resolveClient()
        const input: GetInput = { id }
        const { data, errors } = await client.models.Event.get({ ...(input as any), selectionSet: baseSelection })
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return data as EventRow | null
    }

    async function createEvent(input: CreateInput) {
        const client = resolveClient()
        const { data, errors } = await client.models.Event.create(input, { authMode: 'userPool', selectionSet: baseSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as any).message ?? String(e)).join('; '))
        const row = data as EventRow
        items.value = [row, ...items.value]
        return row
    }

    async function updateEvent(patch: UpdateInput) {
        const client = resolveClient()
        const { data, errors } = await client.models.Event.update(patch, { authMode: 'userPool', selectionSet: baseSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as any).message ?? String(e)).join('; '))
        const row = data as EventRow
        items.value = items.value.map(ev => (ev.id === row.id ? row : ev))
        return row
    }

    async function deleteEvent(id: EventId) {
        const client = resolveClient()
        const { data, errors } = await client.models.Event.delete({ id }, { authMode: 'userPool', selectionSet: baseSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as any).message ?? String(e)).join('; '))
        items.value = items.value.filter(ev => ev.id !== id)
        return data as EventRow
    }

    // ===== Relações (cada uma em sua própria requisição) =====
    async function listTalksByEvent(eventId: EventId): Promise<TalkRow[]> {
        const client = resolveClient()
        const { data, errors } = await client.models.Talk.list({
            filter: { eventId: { eq: eventId } },
            limit: 100,
            selectionSet: talkSelection,
        } as any)
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return (data ?? []) as TalkRow[]
    }

    async function listSponsors(params: { eventId?: EventId; limit?: number } = {}): Promise<SponsorRow[]> {
        const client = resolveClient()
        const items: SponsorRow[] = []
        const desiredTotal = typeof params.limit === 'number' ? params.limit : Number.POSITIVE_INFINITY
        let nextToken: string | undefined

        do {
            const remaining = desiredTotal - items.length
            if (remaining <= 0) break

            const { data, errors, nextToken: token } = await client.models.EventSponsor.list({
                filter: params.eventId ? { eventId: { eq: params.eventId } } : undefined,
                limit: Math.min(200, remaining),
                nextToken,
                selectionSet: sponsorSelection,
            } as any)
            if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
            if (data?.length) items.push(...(data as SponsorRow[]))
            nextToken = token ?? undefined
        } while (nextToken && items.length < desiredTotal)

        return params.limit ? items.slice(0, params.limit) : items
    }

    async function listSponsorsByEvent(eventId: EventId, opts?: { limit?: number }): Promise<SponsorRow[]> {
        return listSponsors({ eventId, limit: opts?.limit })
    }

    async function listAllSponsors(opts?: { limit?: number }): Promise<SponsorRow[]> {
        return listSponsors({ limit: opts?.limit })
    }

    async function listFaqsByEvent(eventId: EventId): Promise<FaqRow[]> {
        const client = resolveClient()
        const { data, errors } = await client.models.EventFaq.list({
            filter: { eventId: { eq: eventId } },
            limit: 100,
            selectionSet: faqSelection,
        } as any)
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return (data ?? []) as FaqRow[]
    }

    // ===== Utilitários específicos p/ EventDetails =====

    /** Retorna a primeira Talk do evento + o Speaker dela (duas requisições). */
    async function getPrimaryTalkWithSpeaker(eventId: EventId): Promise<{ talk: TalkRow; speaker: SpeakerRow } | null> {
        const talks = await listTalksByEvent(eventId)
        const first = talks[0]
        if (!first?.speakerId) return null

        const client = resolveClient()
        const { data: sp, errors } = await client.models.Speaker.get({ id: first.speakerId, selectionSet: speakerSelection } as any)
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        if (!sp) return null

        return { talk: first, speaker: sp as SpeakerRow }
    }

    /** Lista redes sociais de um Speaker. */
    async function listSocialsForSpeaker(speakerId: SpeakerRow['id']): Promise<SocialRow[]> {
        const client = resolveClient()
        const { data, errors } = await client.models.SocialMedia.list({
            filter: { speakerId: { eq: speakerId } },
            limit: 100,
            selectionSet: socialSelection,
        } as any)
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return (data ?? []) as SocialRow[]
    }

    /** Alias com o nome esperado no EventDetails. */
    async function listSponsorsForEvent(eventId: EventId): Promise<SponsorRow[]> {
        return listSponsorsByEvent(eventId)
    }

    // ===== Storage utils =====
    async function uploadBanner(file: File, eventId: EventId) {
        const path = buildEventBannerPath(eventId, file.name)
        await uploadData({
            path,
            data: file,
            options: { contentType: file.type || 'application/octet-stream' },
        }).result

        await updateEvent({ id: eventId, bannerKey: path } as UpdateInput)
        return path
    }

    async function getAssetUrl(assetPath?: string, expiresInSeconds = 900) {
        if (!assetPath) return null
        const { url } = await getUrl({ path: assetPath, options: { expiresIn: expiresInSeconds } })
        return url.toString()
    }

    return {
        // state
        items, loading, error, nextToken, hasMore,

        // base queries
        listEvents, getEvent,

        // relations
        listTalksByEvent,
        listSponsorsByEvent,
        listAllSponsors,
        listSponsorsForEvent,   // alias usado pelo EventDetails
        listFaqsByEvent,

        // detail utilities
        getPrimaryTalkWithSpeaker,
        listSocialsForSpeaker,

        // mutations
        createEvent, updateEvent, deleteEvent,

        // storage
        uploadBanner, getAssetUrl,
    }
}

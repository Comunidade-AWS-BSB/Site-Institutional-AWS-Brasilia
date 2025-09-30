import { ref, computed, type Ref } from 'vue'
import { uploadData, getUrl } from 'aws-amplify/storage'
import { getDataClient } from './useData'
import type { Schema } from '../../amplify/data/resource'
import type { SelectionSet } from 'aws-amplify/data'
import { buildSpeakerAvatarPath } from '@/constants/storage'

// ===================== Tipos base (Schema) =====================
type Speaker = Schema['Speaker']['type']
type SpeakerId = Speaker['id']

type SocialMedia = Schema['SocialMedia']['type']
type SocialMediaId = SocialMedia['id']

// ===================== SelectionSets =====================
const speakerSelection = [
    'id',
    'name',
    'title',
    'bioIntro',
    'bioExperience',
    'bioExpertise',
    'skills',
    'imageKey',
    'createdAt',
    'updatedAt',
] as const
export type SpeakerRow = SelectionSet<Speaker, typeof speakerSelection>

const mediaSelection = [
    'id',
    'name',
    'url',
    'speakerId',
] as const
export type SocialMediaRow = SelectionSet<SocialMedia, typeof mediaSelection>
export type SpeakerRich = {
    speaker: SpeakerRow | null
    avatarUrl: string | null
    medias: SocialMediaRow[]
}

// ===================== Composable =====================
type DataClient = ReturnType<typeof getDataClient>
type UseSpeakersMode = 'auto' | 'public' | 'private'

type UseSpeakersOptions = { mode?: UseSpeakersMode }

export function useSpeakers(options: UseSpeakersOptions = {}) {
    const mode: UseSpeakersMode = options.mode ?? 'auto'

    function resolveClient(): DataClient {
        return mode === 'auto' ? getDataClient() : getDataClient(mode)
    }

    // Inputs inferidos do client (100% alinhados ao backend)
    type ClientModels = DataClient['models']
    type SpeakerModel = ClientModels['Speaker']
    type SocialModel = ClientModels['SocialMedia']

    type CreateSpeakerInput = Parameters<SpeakerModel['create']>[0]
    type UpdateSpeakerInput = Parameters<SpeakerModel['update']>[0]
    type GetSpeakerInput = Parameters<SpeakerModel['get']>[0]
    type ListSpeakerInput = Parameters<SpeakerModel['list']>[0]

    type CreateMediaInput = Parameters<SocialModel['create']>[0]
    type UpdateMediaInput = Parameters<SocialModel['update']>[0]
    type DeleteMediaInput = Parameters<SocialModel['delete']>[0]
    type ListMediaInput = Parameters<SocialModel['list']>[0]

    // Estado
    const items: Ref<SpeakerRow[]> = ref([])
    const loading = ref(false)
    const error: Ref<Error | null> = ref(null)
    const nextToken: Ref<string | null> = ref(null)
    const hasMore = computed(() => nextToken.value !== null)

    // ===================== SPEAKERS =====================
    async function listSpeakers(opts?: { search?: string; limit?: number; nextToken?: string | null }) {
        try {
            loading.value = true
            error.value = null

            const input: ListSpeakerInput = {
                filter: opts?.search ? { name: { contains: opts.search } } : undefined,
                limit: opts?.limit ?? 20,
                nextToken: opts?.nextToken ?? undefined,
            }

            const client = resolveClient()
            const { data, nextToken: token, errors } = await client.models.Speaker.list({ ...(input as any), selectionSet: speakerSelection })
            if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))

            items.value = data as SpeakerRow[]
            nextToken.value = token ?? null
            return { data: items.value, nextToken: nextToken.value }
        } finally {
            loading.value = false
        }
    }

    async function getSpeaker(id: SpeakerId) {
        const client = resolveClient()
        const input: GetSpeakerInput = { id }
        const resGet = await client.models.Speaker.get(input as any, { selectionSet: speakerSelection })
        const { data, errors } = resGet as any
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return data as SpeakerRow | null
    }

    async function createSpeaker(input: CreateSpeakerInput) {
        const client = resolveClient()
        const { data, errors } = await client.models.Speaker.create(input, { authMode: 'userPool', selectionSet: speakerSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as { message?: string }).message ?? String(e)).join('; '))
        const row = data as SpeakerRow
        items.value = [row, ...items.value]
        return row
    }

    async function updateSpeaker(patch: UpdateSpeakerInput) {
        const client = resolveClient()
        const { data, errors } = await client.models.Speaker.update(patch, { authMode: 'userPool', selectionSet: speakerSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as { message?: string }).message ?? String(e)).join('; '))
        const row = data as SpeakerRow
        items.value = items.value.map(s => (s.id === row.id ? row : s))
        return row
    }

    async function deleteSpeaker(id: SpeakerId) {
        const client = resolveClient()
        const { data, errors } = await client.models.Speaker.delete({ id }, { authMode: 'userPool', selectionSet: speakerSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as { message?: string }).message ?? String(e)).join('; '))
        items.value = items.value.filter(s => s.id !== id)
        return data as SpeakerRow
    }

    // ===================== SOCIAL MEDIAS (por Speaker) =====================
    async function listMediasBySpeaker(speakerId: SpeakerId, limit = 50) {
        const input: ListMediaInput = {
            filter: { speakerId: { eq: speakerId } },
            limit,
        }
        const client = resolveClient()
        const { data, errors } = await client.models.SocialMedia.list({ ...(input as any), selectionSet: mediaSelection })
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return (data ?? []) as SocialMediaRow[]
    }

    async function createSpeakerMedia(speakerId: SpeakerId, name: CreateMediaInput['name'], url: string) {
        const body: CreateMediaInput = { speakerId, name, url }
        const client = resolveClient()
        const { data, errors } = await client.models.SocialMedia.create(body, { authMode: 'userPool', selectionSet: mediaSelection })
        if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
        return data as SocialMediaRow
    }

    async function updateSpeakerMedia(patch: UpdateMediaInput) {
        const client = resolveClient()
        const { data, errors } = await client.models.SocialMedia.update(patch, { authMode: 'userPool', selectionSet: mediaSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as { message?: string }).message ?? String(e)).join('; '))
        return data as SocialMediaRow
    }

    async function deleteSpeakerMedia(id: SocialMediaId) {
        const client = resolveClient()
        const { data, errors } = await client.models.SocialMedia.delete({ id } as DeleteMediaInput, { authMode: 'userPool', selectionSet: mediaSelection })
        if (errors?.length) throw new Error(errors.map(e => (e as { message?: string }).message ?? String(e)).join('; '))
        return data as SocialMediaRow
    }

    // ===================== STORAGE (Avatar) =====================
    async function uploadAvatar(file: File, speakerId: SpeakerId) {
        const path = buildSpeakerAvatarPath(speakerId, file.name)
        const task = uploadData({
            path,
            data: file,
            options: { contentType: file.type || 'application/octet-stream' },
        })
        await task.result
        await updateSpeaker({ id: speakerId, imageKey: path } as UpdateSpeakerInput)
        return path
    }

    async function getAvatarUrl(avatarPath?: string, expiresInSeconds = 900) {
        if (!avatarPath) return null
        const { url } = await getUrl({ path: avatarPath, options: { expiresIn: expiresInSeconds } })
        return url.toString()
    }

    // ===================== Helper “rico” (speaker + avatar + mídias) =====================
    async function getSpeakerRich(id: SpeakerId): Promise<SpeakerRich> {
        const speaker = await getSpeaker(id)
        const [avatarUrl, medias] = await Promise.all([
            speaker?.imageKey ? getAvatarUrl(speaker.imageKey) : Promise.resolve(null),
            listMediasBySpeaker(id),
        ])
        return { speaker, avatarUrl, medias }
    }

    return {
        // state
        items, loading, error, nextToken, hasMore,

        // speaker CRUD
        listSpeakers, getSpeaker, createSpeaker, updateSpeaker, deleteSpeaker,

        // medias CRUD
        listMediasBySpeaker, createSpeakerMedia, updateSpeakerMedia, deleteSpeakerMedia,

        // storage
        uploadAvatar, getAvatarUrl,

        // rich
        getSpeakerRich
    }
}

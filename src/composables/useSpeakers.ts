// src/composables/useSpeakers.ts
import { ref, computed, type Ref } from 'vue'
import { uploadData, getUrl } from 'aws-amplify/storage'
import { getDataClient } from './useData'
import type { Schema } from '../../amplify/data/resource'
import type { SelectionSet } from 'aws-amplify/data'

// --- Tipos base vindos do Schema ---
type Speaker = Schema['Speaker']['type']
type SpeakerId = Speaker['id']

// --- SelectionSet: mantenha só os campos que a UI precisa ---
// Isso evita LazyLoader de relacionamentos e “nullability” esquisita.
const selection = ['id', 'name', 'bioIntro', 'bioExperience', 'bioExpertise', 'skills', 'imageKey', 'createdAt', 'updatedAt'] as const
type SpeakerRow = SelectionSet<Speaker, typeof selection>

// --- Helpers para os inputs fortemente tipados a partir do client ---
/**
 * OBS: Em Gen 2, o tipo dos inputs é inferido no client.
 * Usamos `Parameters<typeof client.models.Speaker.create>[0]` etc.
 * Assim não precisamos adivinhar campos opcionais/relacionais.
 */

const PUBLIC_PREFIX = 'assets/speakers'

export function useSpeakers() {
  const client = getDataClient()

  // Deriva tipos dos inputs a partir do client (100% alinhado com backend)
  type CreateInput = Parameters<typeof client.models.Speaker.create>[0]
  type UpdateInput = Parameters<typeof client.models.Speaker.update>[0]
  type GetInput    = Parameters<typeof client.models.Speaker.get>[0]
  type ListInput   = Parameters<typeof client.models.Speaker.list>[0]

  // Estado reativo 100% tipado
  const items: Ref<SpeakerRow[]> = ref([])
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)
  const nextToken: Ref<string | null> = ref(null)
  const hasMore = computed(() => nextToken.value !== null)

  // --- LIST ---
  async function listSpeakers(opts?: {
    search?: string
    limit?: number
    nextToken?: string | null
  }) {
    try {
      loading.value = true
      error.value = null

      const input: ListInput = {
        filter: opts?.search ? { name: { contains: opts.search } } : undefined,
        limit: opts?.limit ?? 20,
        nextToken: opts?.nextToken ?? undefined,
        // selectionSet vale para list
        selectionSet: selection,
      }

      // @ts-ignore
      const { data, nextToken: token, errors } = await client.models.Speaker.list(input)

      // @ts-ignore
      if (errors?.length) throw new Error(errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; '))

      items.value = data as SpeakerRow[]
      nextToken.value = token ?? null
      return { data: items.value, nextToken: nextToken.value }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // --- GET ---
  async function getSpeaker(id: SpeakerId) {
    const input: GetInput & { selectionSet: typeof selection } = { id, selectionSet: selection }
    const { data, errors } = await client.models.Speaker.get(input)
    if (errors?.length) throw new Error(errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; '))
    return data as SpeakerRow | null
  }

  // --- CREATE ---
  async function createSpeaker(input: CreateInput) {
    const { data, errors } = await client.models.Speaker.create(input, { selectionSet: selection })
    if (errors?.length) throw new Error(errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; '))
    const row = data as SpeakerRow
    // Atualização otimista com o MESMO shape do items (evita erro de tipo)
    items.value = [row, ...items.value]
    return row
  }

  // --- UPDATE ---
  async function updateSpeaker(patch: UpdateInput) {
    const { data, errors } = await client.models.Speaker.update(patch, { selectionSet: selection })
    if (errors?.length) throw new Error(errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; '))
    const row = data as SpeakerRow
    items.value = items.value.map(s => (s.id === row.id ? row : s))
    return row
  }

  // --- DELETE ---
  async function deleteSpeaker(id: SpeakerId) {
    const { data, errors } = await client.models.Speaker.delete({ id }, { selectionSet: selection })
    if (errors?.length) throw new Error(errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; '))
    items.value = items.value.filter(s => s.id !== id)
    return data as SpeakerRow
  }

  // --- STORAGE (S3) — novas assinaturas com path ---

  /**
   * Upload do avatar do palestrante (público leitura).
   * Em v6 use `path`, não `key`. Ex.: 'public/...'
   * (Pode ser função de path p/ protected/private com identityId)
   */
  async function uploadAvatar(file: File, speakerId: SpeakerId) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${PUBLIC_PREFIX}/${speakerId}/avatar-${Date.now()}.${ext}`

    const task = uploadData({
      path, // ← API nova usa path (key é deprecated)
      data: file,
      options: { contentType: file.type || 'application/octet-stream' },
    })
    await task.result

    // persiste a path no registro (ex.: imageKey)
    await updateSpeaker({ id: speakerId, imageKey: path } as UpdateInput)
    return path
  }

  /**
   * Gera URL assinada temporária via getUrl({ path }).
   * `expiresIn` em segundos (máx. costuma ser ~1h dependendo da sessão).
   */
  async function getAvatarUrl(avatarPath?: string, expiresInSeconds = 900) {
    if (!avatarPath) return null
    const { url } = await getUrl({
      path: avatarPath,                // ← path, não key
      options: { expiresIn: expiresInSeconds },
    })
    return url.toString()
  }

  return {
    // state
    items, loading, error, nextToken, hasMore,
    // queries
    listSpeakers, getSpeaker,
    // mutations
    createSpeaker, updateSpeaker, deleteSpeaker,
    // storage
    uploadAvatar, getAvatarUrl,
  }
}

// 
import { ref, computed, type Ref } from 'vue'
import { uploadData, getUrl } from 'aws-amplify/storage'
import { getDataClient } from './useData'
import type { Schema } from '../../amplify/data/resource'
import type { SelectionSet } from 'aws-amplify/data'

/**
 * Tipagem forte derivada do Schema (Amplify Gen 2)
 */
type Event = Schema['Event']['type']
type EventId = Event['id']
type EventType = Schema['type']

/**
 * Campos realmente usados na UI.
 * - Usar selectionSet garante shape estável (sem LazyLoader e nulls “surpresa”).
 */
const selection = [
  'id',
  'title',
  'theme',
  'type',
  'date',
  'time',
  'dateLabel',
  'timeLabel',
  'location',
  'description',
  'hashtags',
  'bannerKey',
  'isCurrent',
  'venueName',
  'venueAddress',
  'venueMapUrl',
] as const
type EventRow = SelectionSet<Event, typeof selection>

/** Opções de listagem/filtragem. */
export type ListEventsOptions = {
  search?: string          // title contains
  type?: EventType         // enum eq
  isCurrent?: boolean      // eq
  from?: string            // date ge (ISO date: YYYY-MM-DD)
  to?: string              // date le (ISO date)
  limit?: number
  nextToken?: string | null
}

/** Prefixo (área pública) para assets de eventos. Ajuste se necessário. */
const PUBLIC_EVENTS_PREFIX = 'public/assets/events'

export function useEvents() {
  const client = getDataClient()

  // Deriva tipos de input a partir do client (sempre alinhado com o backend)
  type CreateInput = Parameters<typeof client.models.Event.create>[0]
  type UpdateInput = Parameters<typeof client.models.Event.update>[0]
  type GetInput    = Parameters<typeof client.models.Event.get>[0]
  type ListInput   = Parameters<typeof client.models.Event.list>[0]

  // Estado reativo tipado
  const items: Ref<EventRow[]> = ref([])
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)
  const nextToken: Ref<string | null> = ref(null)
  const hasMore = computed(() => nextToken.value !== null)

  /**
   * Lista eventos com filtros opcionais.
   * - search → `title contains`
   * - type → `eq`
   * - isCurrent → `eq`
   * - from/to → `date ge/le`
   */
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
                ? {
                    date: {
                      ...(opts.from ? { ge: opts.from } : {}),
                      ...(opts.to ? { le: opts.to } : {}),
                    },
                  }
                : {}),
            }

      const input: ListInput = {
        filter,
        limit: opts?.limit ?? 20,
        nextToken: opts?.nextToken ?? undefined,
        selectionSet: selection,
      }

      const { data, nextToken: token, errors } = await client.models.Event.list(input)
      if (errors?.length) {
        throw new Error(
          errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; ')
        )
      }

      items.value = data as EventRow[]
      nextToken.value = token ?? null
      return { data: items.value, nextToken: nextToken.value }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
      throw error.value
    } finally {
      loading.value = false
    }
  }

  /** Busca evento por id (selectionSet aplicado). */
  async function getEvent(id: EventId) {
    const input: GetInput & { selectionSet: typeof selection } = { id, selectionSet: selection }
    const { data, errors } = await client.models.Event.get(input)
    if (errors?.length) {
      throw new Error(
        errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; ')
      )
    }
    return data as EventRow | null
  }

  /** Cria evento e retorna a linha com o mesmo shape do estado. */
  async function createEvent(input: CreateInput) {
    const { data, errors } = await client.models.Event.create(input, { selectionSet: selection })
    if (errors?.length) {
      throw new Error(
        errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; ')
      )
    }
    const row = data as EventRow
    items.value = [row, ...items.value]
    return row
  }

  /** Atualiza evento (patch deve conter `id`). */
  async function updateEvent(patch: UpdateInput) {
    const { data, errors } = await client.models.Event.update(patch, { selectionSet: selection })
    if (errors?.length) {
      throw new Error(
        errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; ')
      )
    }
    const row = data as EventRow
    items.value = items.value.map(ev => (ev.id === row.id ? row : ev))
    return row
  }

  /** Deleta evento por id. */
  async function deleteEvent(id: EventId) {
    const { data, errors } = await client.models.Event.delete({ id }, { selectionSet: selection })
    if (errors?.length) {
      throw new Error(
        errors.map(e => (e as unknown as Record<string, unknown>).message ?? String(e)).join('; ')
      )
    }
    items.value = items.value.filter(ev => ev.id !== id)
    return data as EventRow
  }

  // === Storage (S3) com `path` ===

  /**
   * Upload do banner (área pública).
   * - Caminho: public/assets/events/{eventId}/banner-{timestamp}.{ext}
   * - Persiste `bannerKey` no Event com a própria `path`.
   */
  async function uploadBanner(file: File, eventId: EventId) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${PUBLIC_EVENTS_PREFIX}/${eventId}/banner-${Date.now()}.${ext}`

    const task = uploadData({
      path, // API nova (v6+) usa `path`, não `key`
      data: file,
      options: { contentType: file.type || 'application/octet-stream' },
    })
    await task.result

    await updateEvent({ id: eventId, bannerKey: path } as UpdateInput)
    return path
  }

  /** URL assinada temporária para qualquer asset do evento. */
  async function getAssetUrl(assetPath?: string, expiresInSeconds = 900) {
    if (!assetPath) return null
    const { url } = await getUrl({ path: assetPath, options: { expiresIn: expiresInSeconds } })
    return url.toString()
  }

  return {
    // state
    items,
    loading,
    error,
    nextToken,
    hasMore,

    // queries
    listEvents,
    getEvent,

    // mutations
    createEvent,
    updateEvent,
    deleteEvent,

    // storage
    uploadBanner,
    getAssetUrl,
  }
}

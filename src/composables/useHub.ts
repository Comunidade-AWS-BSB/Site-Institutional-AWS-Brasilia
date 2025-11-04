import { ref, computed, reactive } from 'vue'
import { getDataClient } from '@/composables/useData'

const client = getDataClient('public')

export type PublicMedia = { name: 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'; url: string }
export type PublicProfile = {
  id: string
  displayName: string
  profession: string
  bio: string
  interests: string[]
  photoUrl: string
  medias: PublicMedia[]
}

const state = reactive({ q: '', profession: '', interest: '', page: 1, pageSize: 24 })
const items = ref<PublicProfile[]>([])
const loading = ref(false)
const error = ref<unknown | null>(null)

export function mediaIconKey(name: PublicMedia['name']): 'Linkedin' | 'Instagram' | 'Github' | 'Newspaper' | 'Globe' | 'Link' {
  switch (name) {
    case 'LINKEDIN': return 'Linkedin'
    case 'INSTAGRAM': return 'Instagram'
    case 'GITHUB': return 'Github'
    case 'MEDIUM': return 'Newspaper'
    default: return 'Globe'
  }
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.toString()
  } catch {
    return url.startsWith('http') ? url : `https://${url}`
  }
}

async function fetchProfiles() {
  loading.value = true
  error.value = null
  try {
    console.info('[useHub] request listPublicProfiles', { ...state })
    const { data, errors } = await client.queries.listPublicProfiles({
      q: state.q || undefined,
      profession: state.profession || undefined,
      interest: state.interest || undefined,
      page: state.page,
      pageSize: state.pageSize,
    })
    if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))

    const raw = Array.isArray(data) ? data : Array.isArray((data as any)?.listPublicProfiles) ? (data as any).listPublicProfiles : []
    console.info('[useHub] response listPublicProfiles', { rawCount: Array.isArray(raw) ? raw.length : 0 })
    items.value = (raw as any[]).map((p) => ({
      id: String(p.id),
      displayName: String(p.displayName || ''),
      profession: String(p.profession || ''),
      bio: String(p.bio || ''),
      interests: Array.isArray(p.interests) ? p.interests.map(String) : [],
      photoUrl: String(p.photoUrl || ''),
      medias: Array.isArray(p.medias) ? p.medias.filter((m: any) => m?.name && m?.url).map((m: any) => ({ name: m.name, url: normalizeUrl(String(m.url)) })) : [],
    }))
    console.info('[useHub] normalized items', { count: items.value.length })
  } catch (e) {
    error.value = e
    console.error('[useHub] fetchProfiles error', e)
  } finally {
    loading.value = false
  }
}

function setQuery(q: string) { state.q = q; state.page = 1 }
function setProfession(p: string) { state.profession = p; state.page = 1 }
function setInterest(i: string) { state.interest = i; state.page = 1 }
function setPage(p: number) { state.page = Math.max(1, p) }

const professions = computed(() => Array.from(new Set(items.value.map(p => p.profession).filter(Boolean))).sort((a, b) => a.localeCompare(b)))
const interests = computed(() => {
  const set = new Set<string>()
  items.value.forEach(p => p.interests.forEach(i => set.add(i)))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

export function useHub() {
  return {
    // state
    items, loading, error, state,
    // derived
    professions, interests,
    // helpers
    mediaIconKey, normalizeUrl,
    // actions
    fetchProfiles, setQuery, setProfession, setInterest, setPage,
  }
}

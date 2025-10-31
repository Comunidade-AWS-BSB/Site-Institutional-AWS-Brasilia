import { ref } from 'vue'
import { getDataClient } from '@/composables/useData'
import type { Schema } from '../../amplify/data/resource'
import type { SelectionSet } from 'aws-amplify/data'
import { getCurrentUser, fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth'
import { uploadData, getUrl } from 'aws-amplify/storage'
import { buildUserAvatarPath } from '@/constants/storage'

const client = getDataClient('private')

export type UserProfile = Schema['UserProfile']['type']

const profileSelection = [
  'id',
  'displayName',
  'profession',
  'bio',
  'interests',
  'photoKey',
  'photoUrl',
  'notifyEmail',
  'notifySms',
  'notifyWhatsApp',
] as const

export type UserProfileRow = SelectionSet<UserProfile, typeof profileSelection>
type MediaName = 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'

const loading = ref(false)
const error = ref<unknown | null>(null)
const profile = ref<UserProfileRow | null>(null)

async function ensureProfile(): Promise<UserProfileRow> {
  const { userId } = await getCurrentUser()
  // tenta carregar
  const { data: existing, errors: listErr } = await client.models.UserProfile.get({ id: userId }, { authMode: 'userPool', selectionSet: profileSelection })
  if (!listErr?.length && existing) return existing as UserProfileRow

  // cria com defaults
  const attrs = await fetchUserAttributes().catch(() => ({} as Record<string, string>))
  const display = attrs.preferred_username || attrs.name || (attrs.email ? attrs.email.split('@')[0] : '')
  const { data: created, errors } = await client.models.UserProfile.create({
    id: userId,
    displayName: display || '',
    profession: '',
    bio: '',
    interests: [],
    notifyEmail: true,
    notifySms: false,
    notifyWhatsApp: false,
  }, { authMode: 'userPool', selectionSet: profileSelection })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  return created as UserProfileRow
}

async function load() {
  loading.value = true
  error.value = null
  try {
    profile.value = await ensureProfile()
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

async function saveGeneral(input: { displayName: string; profession: string; bio: string }) {
  if (!profile.value) await load()
  const current = profile.value!
  const { data, errors } = await client.models.UserProfile.update({
    id: current.id,
    displayName: input.displayName,
    profession: input.profession,
    bio: input.bio,
  }, { authMode: 'userPool', selectionSet: profileSelection })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  profile.value = data as UserProfileRow

  // sincroniza preferred_username no Cognito quando aplicável
  try {
    if (input.displayName && input.displayName !== current.displayName) {
      await updateUserAttributes({ userAttributes: { preferred_username: input.displayName } })
    }
  } catch {
    // silencioso; falha de sync não bloqueia
  }
}

async function saveInterests(interests: string[]) {
  if (!profile.value) await load()
  const current = profile.value!
  const uniq = Array.from(new Set(interests.map(s => s.trim().toLowerCase()).filter(Boolean)))
  const { data, errors } = await client.models.UserProfile.update({
    id: current.id,
    interests: uniq,
  }, { authMode: 'userPool', selectionSet: profileSelection })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  profile.value = data as UserProfileRow
}

async function saveNotifications(prefs: { email: boolean; sms: boolean; whatsapp: boolean }) {
  if (!profile.value) await load()
  const current = profile.value!
  const { data, errors } = await client.models.UserProfile.update({
    id: current.id,
    notifyEmail: prefs.email,
    notifySms: prefs.sms,
    notifyWhatsApp: prefs.whatsapp,
  }, { authMode: 'userPool', selectionSet: profileSelection })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  profile.value = data as UserProfileRow
}

export function useProfile() {
  return {
    // state
    loading,
    error,
    profile,

    // actions
    load,
    saveGeneral,
    saveInterests,
    saveNotifications,
    uploadAvatar,
    getAvatarUrl,
  }
}

/** Social medias do usuário (CRUD por userId) */
export function useProfileSocials() {
  const list = async () => {
    const { userId } = await getCurrentUser()
    const { data, errors } = await client.models.SocialMedia.list({
      filter: { userId: { eq: userId } },
      limit: 100,
      selectionSet: ['id', 'name', 'url', 'userId'] as const,
    } as any)
    if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
    return (data ?? []) as Array<{ id: string; name: MediaName; url?: string | null }>
  }

  const create = async (name: MediaName, url: string) => {
    const { userId } = await getCurrentUser()
    const { data, errors } = await client.models.SocialMedia.create({ userId, name, url }, { authMode: 'userPool', selectionSet: ['id', 'name', 'url', 'userId'] as const })
    if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
    return data as { id: string; name: MediaName; url?: string | null }
  }

  const update = async (patch: { id: string; name?: MediaName; url?: string }) => {
    const { data, errors } = await client.models.SocialMedia.update(patch as any, { authMode: 'userPool', selectionSet: ['id', 'name', 'url', 'userId'] as const })
    if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
    return data as { id: string; name: MediaName; url?: string | null }
  }

  const remove = async (id: string) => {
    const { data, errors } = await client.models.SocialMedia.delete({ id } as any, { authMode: 'userPool', selectionSet: ['id'] as const })
    if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
    return data
  }

  return { list, create, update, remove }
}

/** Upload do avatar do usuário e helpers de URL */
async function uploadAvatar(file: File) {
  const { userId } = await getCurrentUser()
  const path = buildUserAvatarPath(userId, file.name)
  await uploadData({ path, data: file, options: { contentType: file.type || 'application/octet-stream' } }).result
  const { data, errors } = await client.models.UserProfile.update({ id: userId, photoKey: path }, { authMode: 'userPool', selectionSet: profileSelection })
  if (errors?.length) throw new Error(errors.map((e: any) => e?.message ?? String(e)).join('; '))
  profile.value = data as UserProfileRow
  return path
}

async function getAvatarUrl(assetPath?: string, expiresInSeconds = 900): Promise<string | null> {
  if (!assetPath) return null
  const { url } = await getUrl({ path: assetPath, options: { expiresIn: expiresInSeconds } })
  return url.toString()
}

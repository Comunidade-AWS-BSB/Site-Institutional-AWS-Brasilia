import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getCurrentUser,
  fetchUserAttributes,
  signOut as amplifySignOut,
  type FetchUserAttributesOutput,
} from 'aws-amplify/auth'

export type AuthSnapshot = {
  userId: string | null
  username: string | null
  attributes: Record<string, string> | null
}

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false)
  const error = ref<unknown | null>(null)
  const snapshot = ref<AuthSnapshot>({
    userId: null,
    username: null,
    attributes: null,
  })

  const isLoggedIn = computed(() => !!snapshot.value.userId)
  const displayName = computed(() => {
    const attrs = snapshot.value.attributes ?? {}
    return (
      attrs.preferred_username ||
      attrs.name ||
      snapshot.value.username ||
      attrs.email ||
      ''
    )
  })

  async function bootstrap() {
    loading.value = true
    error.value = null
    try {
      const user = await getCurrentUser().catch(() => null)
      if (!user) {
        snapshot.value = { userId: null, username: null, attributes: null }
        return
      }
      const attrs = await safeFetchAttributes()
      snapshot.value = {
        userId: user.userId,
        username: user.username,
        attributes: attrs,
      }
    } catch (e) {
      error.value = e
      // Não derruba UI; apenas limpa sessão
      snapshot.value = { userId: null, username: null, attributes: null }
      if (import.meta.env && (import.meta as unknown as { env?: Record<string, unknown> }).env?.DEV) {
         
        console.warn('[auth.bootstrap] error', e)
      }
    } finally {
      loading.value = false
    }
  }

  async function refreshUser() {
    try {
      const user = await getCurrentUser().catch(() => null)
      if (!user) {
        snapshot.value = { userId: null, username: null, attributes: null }
        return
      }
      const attrs = await safeFetchAttributes()
      snapshot.value = {
        userId: user.userId,
        username: user.username,
        attributes: attrs,
      }
    } catch (e) {
      error.value = e
      if (import.meta.env && (import.meta as unknown as { env?: Record<string, unknown> }).env?.DEV) {
         
        console.warn('[auth.refreshUser] error', e)
      }
    }
  }

  async function doSignOut(options?: { global?: boolean }) {
    loading.value = true
    try {
      const global = options?.global ?? false
      await amplifySignOut({ global })
    } finally {
      // Limpa snapshot independentemente de erro (best-effort)
      snapshot.value = { userId: null, username: null, attributes: null }
      loading.value = false
    }
  }

  async function safeFetchAttributes(): Promise<Record<string, string>> {
    try {
      const result: FetchUserAttributesOutput = await fetchUserAttributes()
      // Convert Amplify attributes (Map-like) to plain record
      return Object.fromEntries(Object.entries(result).map(([k, v]) => [k, String(v)]))
    } catch (e) {
      if (import.meta.env && (import.meta as unknown as { env?: Record<string, unknown> }).env?.DEV) {
         
        console.warn('[auth.fetchAttributes] error', e)
      }
      return {}
    }
  }

  return {
    // state
    loading,
    error,
    snapshot,

    // getters
    isLoggedIn,
    displayName,

    // actions
    bootstrap,
    refreshUser,
    doSignOut,
  }
})
<template>
  <div id="app">
    <Toaster />

    <div v-if="homeLoading" class="container mx-auto px-4 py-8 space-y-6">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-64 w-full" />
      <Skeleton class="h-6 w-40" />
      <div class="grid md:grid-cols-3 gap-6">
        <Skeleton v-for="i in 6" :key="i" class="h-40 w-full" />
      </div>
    </div>

    <div v-else class="min-h-screen bg-background">
      <TheHeader />
      <main>
        <router-view />
      </main>
      <TheFooter />
    </div>

    <!-- Modal de Autenticação global -->
    <ModalAuthenticator :visible="ui.authModalOpen" @close="ui.closeAuthModal()" @authenticated="onAuthenticated"
      @error="onAuthError" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import TheHeader from '@/components/shared/TheHeader.vue'
import TheFooter from '@/components/shared/TheFooter.vue'
import ModalAuthenticator from '@/components/auth/ModalAuthenticator.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'
import { refreshAuthMode } from '@/composables/useData'
import { storeToRefs } from 'pinia'

import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

import '@aws-amplify/ui-vue/styles.css'

const ui = useUiStore()
const auth = useAuthStore()
const { handleRedirectResult } = useAuth()
const { loading: authLoading } = storeToRefs(auth)

const firstHomeLoad = ref(true)

function onAuthenticated() {
  // Atualiza snapshot e força reload para garantir estado limpo pós-login
  Promise.allSettled([auth.refreshUser(), refreshAuthMode()]).finally(() => {
    window.location.reload()
  })
}

function onAuthError(err: unknown) {
  if (import.meta.env.DEV) {
    console.warn('[App.onAuthError]', err)
  }
}

// Garante que login social via redirect atualize o estado imediatamente sem reload
onMounted(async () => {
  try {
    await handleRedirectResult()
    await auth.bootstrap()
    await refreshAuthMode()

  } catch (e) {
    if (import.meta.env.DEV) {
      console.debug('[App] handleRedirectResult skipped/failed', e)
    }
  } finally {
    firstHomeLoad.value = false
  }
})

const homeLoading = computed(() => firstHomeLoad.value || authLoading.value)
</script>

<style></style>

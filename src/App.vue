<template>
  <div id="app">
    <Toaster />

    <div class="min-h-screen bg-background">
      <TheHeader />
      <main>
        <router-view />
      </main>
      <TheFooter />
    </div>

    <!-- Modal de Autenticação global -->
    <ModalAuthenticator
      :visible="ui.authModalOpen"
      @close="ui.closeAuthModal()"
      @authenticated="onAuthenticated"
      @error="onAuthError"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import TheHeader from '@/components/shared/TheHeader.vue'
import TheFooter from '@/components/shared/TheFooter.vue'
import ModalAuthenticator from '@/components/auth/ModalAuthenticator.vue'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'

import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

// Estilo do Amplify UI já importado em main.ts (mantido aqui se App for renderizado isolado)
import '@aws-amplify/ui-vue/styles.css'

const ui = useUiStore()
const auth = useAuthStore()
const { handleRedirectResult } = useAuth()

function onAuthenticated() {
  // Atualiza snapshot de sessão e fecha modal (fechamento já ocorre no componente)
  auth.refreshUser()
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
    await auth.refreshUser()
  } catch (e) {
    if (import.meta.env.DEV) {
      console.debug('[App] handleRedirectResult skipped/failed', e)
    }
  }
})
</script>

<style></style>

<template>
  <div id="app">
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
import TheHeader from '@/components/shared/TheHeader.vue'
import TheFooter from '@/components/shared/TheFooter.vue'
import ModalAuthenticator from '@/components/auth/ModalAuthenticator.vue'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'

// Estilo do Amplify UI já importado em main.ts (mantido aqui se App for renderizado isolado)
import '@aws-amplify/ui-vue/styles.css'

const ui = useUiStore()
const auth = useAuthStore()

function onAuthenticated() {
  // Atualiza snapshot de sessão e fecha modal (fechamento já ocorre no componente)
  auth.refreshUser()
}

function onAuthError(err: unknown) {
  if (import.meta.env.DEV) {
    console.warn('[App.onAuthError]', err)
  }
}
</script>

<style></style>

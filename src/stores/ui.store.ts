import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * UI Store - Controls global UI states like auth modal visibility
 */
export const useUiStore = defineStore('ui', () => {
  const authModalOpen = ref(false)

  function openAuthModal() {
    authModalOpen.value = true
  }

  function closeAuthModal() {
    authModalOpen.value = false
  }

  function toggleAuthModal() {
    authModalOpen.value = !authModalOpen.value
  }

  return {
    authModalOpen,
    openAuthModal,
    closeAuthModal,
    toggleAuthModal,
  }
})
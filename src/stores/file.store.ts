import { defineStore } from "pinia"
import { ref } from 'vue'

/**
 * Store de acompanhamento de upload de arquivos para prover UI feedback
 */
export const useFileStore = defineStore('file', () => {
    const loading = ref(false)
    const error = ref(false)
    const progress = ref(0)

    return {
        loading,
        error,
        progress
    }
})

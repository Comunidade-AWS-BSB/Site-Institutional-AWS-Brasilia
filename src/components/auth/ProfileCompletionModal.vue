<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[1100] flex items-center justify-center" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" aria-hidden="true" />
        <div class="relative z-[1101] w-full max-w-[520px] mx-4 rounded-xl shadow-2xl border border-border bg-background animate-in zoom-in-95">
          <button class="absolute right-3 top-3 px-2 py-1 text-sm rounded-md hover:bg-foreground/10 focus:outline-none focus:ring" @click="close" aria-label="Fechar">✕</button>

          <div class="p-6 space-y-5">
            <header class="space-y-1 text-center">
              <h2 class="text-xl font-semibold">Completar perfil</h2>
              <p class="text-xs text-muted-foreground">Adicione sua foto de perfil (opcional, mas recomendado).</p>
            </header>

            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="h-20 w-20 rounded-full border bg-muted/20 overflow-hidden flex items-center justify-center">
                  <img v-if="previewUrl" :src="previewUrl" class="h-full w-full object-cover" alt="Prévia do avatar" />
                  <span v-else class="text-xs text-muted-foreground">Sem foto</span>
                </div>

                <div class="flex-1 space-y-2">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="onPick"
                    :disabled="saving"
                    class="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:bg-muted/40 hover:file:bg-muted/60 file:text-foreground file:border-input"
                    aria-label="Selecionar arquivo de imagem"
                  />
                  <p class="text-[11px] text-muted-foreground">
                    Formatos: JPG/PNG/WebP • Tamanho máx. {{ (MAX_MB).toFixed(0) }}MB
                  </p>
                  <p v-if="error" class="text-[11px] text-destructive">{{ error }}</p>
                </div>
              </div>
            </div>

            <footer class="flex items-center justify-between pt-2">
              <button class="text-sm underline underline-offset-2" @click="skip" :disabled="saving">Pular por enquanto</button>
              <button
                class="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input hover:bg-muted/60 disabled:opacity-50"
                @click="save"
                :disabled="!file || saving"
              >
                <svg v-if="saving" class="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="4" opacity="0.25"/><path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" stroke-width="4"/></svg>
                <span>{{ saving ? 'Salvando…' : 'Salvar e continuar' }}</span>
              </button>
            </footer>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { updateUserAttributes } from 'aws-amplify/auth'
import { useImages } from '@/composables/useImages' // ajuste o caminho

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const saving = ref(false)
const error = ref<string | null>(null)

const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024

// 👉 usa o bucket público para avatares
const images = useImages('public/avatars/')

function reset() {
  error.value = null
  file.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

watch(() => props.open, (v) => { if (!v) reset() })
onBeforeUnmount(() => { if (previewUrl.value) URL.revokeObjectURL(previewUrl.value) })

function close() { emit('close') }
function skip() { reset(); emit('close') }

function onPick(e: Event) {
  error.value = null
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) { error.value = 'Arquivo inválido (apenas imagens).'; return }
  if (f.size > MAX_BYTES) { error.value = `Arquivo muito grande (máx. ${MAX_MB}MB).`; return }
  file.value = f
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(f)
}

async function save() {
  if (!file.value) return
  error.value = null
  saving.value = true
  try {
    // 1) sobe via composable
    const uploaded = await images.upload(file.value)
    if (!uploaded?.url) throw new Error('Não foi possível obter a URL do avatar.')

    // 2) grava URL em 'picture' no Cognito
    await updateUserAttributes({ userAttributes: { picture: uploaded.url } })

    emit('saved')
    emit('close')
  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Falha ao salvar sua foto. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

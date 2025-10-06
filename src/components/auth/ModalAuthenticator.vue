<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[1000] flex items-center justify-center"
        @keydown.esc="onRequestClose"
        role="dialog"
        aria-modal="true"
        aria-label="Autenticação de usuário"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="onRequestClose"
          aria-hidden="true"
        />

        <!-- Modal -->
        <div
          class="relative z-[1001] w-full max-w-[480px] mx-4 rounded-xl shadow-2xl border border-border bg-background animate-in zoom-in-95"
        >
          <button
            class="absolute right-3 top-3 px-2 py-1 text-sm rounded-md hover:bg-foreground/10 focus:outline-none focus:ring"
            aria-label="Fechar autenticação"
            @click="onRequestClose"
          >
            ✕
          </button>

          <div class="p-6 space-y-4">
            <div class="flex items-center justify-center mb-2">
              <img src="/img/logo.png" alt="Logo" class="h-10 w-auto" />
            </div>

            <!-- Authenticator -->
            <Authenticator
              :social-providers="['google']"
              variation="modal"
              :hide-sign-up="false"
              initial-state="signIn"
              :form-fields="formFields"
            >
              <!-- Slot default apenas para render; efeitos colaterais removidos do render tree -->
              <template #default="slotProps">
                <slot v-bind="slotProps" />
              </template>

              <template #header>
                <h2 class="text-center text-xl font-semibold">Acessar sua conta</h2>
              </template>

              <template #footer>
                <p class="text-center text-xs text-foreground/70">
                  Ao continuar, você concorda com nossos termos de uso e política de privacidade.
                </p>
              </template>

              <template #sign-in-header>
                <h3 class="text-lg font-medium text-center">Entrar</h3>
              </template>

              <template #sign-up-header>
                <h3 class="text-lg font-medium text-center">Criar conta</h3>
              </template>

              <template #force-new-password-header>
                <h3 class="text-lg font-medium text-center">Definir nova senha</h3>
              </template>
            </Authenticator>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { Authenticator, translations } from '@aws-amplify/ui-vue'
import { I18n } from 'aws-amplify/utils'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'authenticated'): void
  (e: 'error', error: unknown): void
}>()

function onRequestClose() {
  emit('close')
}

// Fechar com ESC somente quando visível
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) onRequestClose()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

/**
* I18n oficial do Amplify UI:
* 1) Carregamos traduções padrão (translations)
* 2) Fixamos idioma para 'pt'
* 3) Injetamos overrides em pt-BR para cobrir gaps e termos locais
*
* Observação: A lib usa tag 'pt' (Português). Usamos putVocabulariesForLanguage('pt', {...})
* para sobrescrever chaves específicas. Isto afeta globalmente o Authenticator.
*/
I18n.putVocabularies(translations)
I18n.setLanguage('pt')
I18n.putVocabulariesForLanguage('pt', {
 // Labels principais
 'Sign In': 'Entrar',
 'Sign in': 'Entrar',
 'Sign Up': 'Criar conta',
 'Sign up': 'Criar conta',
 'Forgot your password?': 'Esqueceu sua senha?',
 'Reset your password': 'Redefinir sua senha',
 'Confirm Sign Up': 'Confirmar cadastro',
 'Confirm Sign In': 'Confirmar entrada',
 'Confirm': 'Confirmar',
 'Submit': 'Enviar',
 'Sending': 'Enviando',
 'Back to Sign In': 'Voltar para Entrar',
 'Create Account': 'Criar conta',
 'Resend Code': 'Reenviar código',
 'Lost your code?': 'Perdeu seu código?',
 'Or': 'Ou',
 'Continue with Google': 'Continuar com Google',
 'Continue': 'Continuar',

 // Campos
 'Username': 'E-mail',
 'Enter your Username': 'Digite seu e-mail',
 'Email': 'E-mail',
 'Enter your Email': 'Digite seu e-mail',
 'Password': 'Senha',
 'Enter your Password': 'Digite sua senha',
 'Confirm Password': 'Confirmar senha',
 'Enter your Confirm Password': 'Digite a confirmação da senha',
 'Verification Code': 'Código de verificação',
 'Enter your Verification Code': 'Digite o código recebido',
 'Enter your Phone number': 'Insira seu número de telefone',

 // Mensagens
 'Sign in to your account': 'Acesse sua conta',
 'Create a new account': 'Crie sua conta',
 'We emailed you a code': 'Enviamos um código para seu e-mail',
 'Incorrect username or password': 'Usuário ou senha incorretos',
 'An account with the given email already exists.':
   'Já existe uma conta com este e-mail.',
 'User does not exist.': 'Usuário inexistente.',
 'Invalid verification code provided, please try again.':
   'Código de verificação inválido, tente novamente.',
 'Attempt limit exceeded, please try again later.':
   'Limite de tentativas excedido, tente novamente mais tarde.',

 // Ações
 'Sign Out': 'Sair',
})

// Mantemos um computed vazio para compatibilidade da prop i18n se necessário no futuro.
const i18n = computed(() => ({}))

// Campos adicionais do formulário: coletar preferred_username no signUp
const formFields = {
  signUp: {
    preferred_username: {
      label: 'Nome de exibição',
      placeholder: 'Seu nome público',
      isRequired: true,
      order: 4,
    },
    phone_number: {
      label: 'Número de telefone',
      placeholder: '+55 61 9 9999-9999',
      isRequired: false,
      order: 5,
      dialCode: '+55',
      inputProps: { type: 'tel' }
    }
  },
} as const

/**
 * Fechamento robusto do modal:
 * - Observa a sessão via Pinia store sem acoplar ao render do slot.
 * - Quando usuário loga (store.isLoggedIn true), emitimos 'authenticated' e fechamos.
 */
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { fetchUserAttributes } from 'aws-amplify/auth';

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const showProfileModal = ref(false)

function onProfileSaved() {
  showProfileModal.value = false
}

watch(
  isLoggedIn,
  async (logged) => {
    if (!logged) return
    emit('authenticated')
    onRequestClose()
    try {
      const attrs = await fetchUserAttributes()
      const hasPicture = !!attrs?.picture
      showProfileModal.value = !hasPicture
    } catch (err) {
      console.warn('[AUTH-MODAL] fetchUserAttributes falhou: ', err)
      showProfileModal.value = false
    }
  },
  { immediate: false },
)

watch(
  () => props.visible,
  (v) => {
    if (!v) return
    // Foco inicial pode ser ajustado aqui se necessário
  },
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
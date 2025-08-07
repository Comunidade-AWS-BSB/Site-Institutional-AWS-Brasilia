import {
  signUp,
  confirmSignUp,
  autoSignIn,
  signIn,
  confirmSignIn,
  signInWithRedirect,
  fetchUserAttributes,
  updateUserAttributes,
  confirmUserAttribute,
  sendUserAttributeVerificationCode,
  deleteUserAttributes,
  getCurrentUser,
  type SignUpInput,
  type ConfirmSignUpInput,
  type ConfirmSignInInput,
  type UpdateUserAttributesOutput,
  type VerifiableUserAttributeKey,
  type UserAttributeKey,
} from 'aws-amplify/auth'
import { useAuthStore } from '@/stores/auth.store'

type Provider = 'Google'

export function useAuth() {
  const store = useAuthStore()

  async function doSignUp(input: Omit<SignUpInput, 'username'> & { email: string }) {
    // Usa e-mail como username
    const result = await signUp({
      username: input.email,
      password: input.password!,
      options: {
        userAttributes: {
          email: input.email,
        },
      },
    })

    return result
  }

  async function doConfirmSignUp(input: ConfirmSignUpInput) {
    const res = await confirmSignUp(input)
    if (res.isSignUpComplete) {
      // Tenta autoSignIn quando aplicável
      try {
        await autoSignIn()
      } catch {
        // ignore
      }
      await store.refreshUser()
    }
    return res
  }

  async function doSignIn(email: string, password: string) {
    const out = await signIn({
      username: email,
      password,
    })

    // Trata nextStep básico: DONE ou aguardar challenges
    if (out.isSignedIn) {
      await store.refreshUser()
    }

    return out
  }

  async function doConfirmSignIn(input: ConfirmSignInInput) {
    const out = await confirmSignIn(input)
    if (out.isSignedIn) {
      await store.refreshUser()
    }
    return out
  }

  async function doSignInWithProvider(provider: Provider = 'Google') {
    await signInWithRedirect({
      provider,
    } as any)
  }

  async function handleRedirectResult() {
    // Após retorno do provedor social, apenas atualiza sessão se usuário presente
    const user = await getCurrentUser().catch(() => null)
    if (user) {
      await store.refreshUser()
    }
  }

  // Atributos de usuário
  async function getAttributes() {
    return await fetchUserAttributes()
  }

  async function updateAttributes(attrs: Record<string, string>): Promise<UpdateUserAttributesOutput> {
    const res = await updateUserAttributes({ userAttributes: attrs })
    return res
  }

  async function verifyAttribute(attributeName: VerifiableUserAttributeKey, code: string) {
    return await confirmUserAttribute({ userAttributeKey: attributeName, confirmationCode: code })
  }

  async function sendAttributeVerification(attributeName: VerifiableUserAttributeKey) {
    return await sendUserAttributeVerificationCode({ userAttributeKey: attributeName })
  }

  async function removeAttributes(keys: UserAttributeKey[]) {
    // deleteUserAttributes requer pelo menos 1 item e uma tupla. Garanta via cast seguro quando array não vazio.
    if (!keys.length) return
    const tuple = [keys[0], ...keys.slice(1)] as [UserAttributeKey, ...UserAttributeKey[]]
    return await deleteUserAttributes({ userAttributeKeys: tuple })
  }

  return {
    // sign up/sign in flows
    doSignUp,
    doConfirmSignUp,
    doSignIn,
    doConfirmSignIn,
    doSignInWithProvider,
    handleRedirectResult,

    // attributes
    getAttributes,
    updateAttributes,
    verifyAttribute,
    sendAttributeVerification,
    removeAttributes,
  }
}
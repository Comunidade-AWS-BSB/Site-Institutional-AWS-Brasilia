# Plano Técnico — Implementação de Autenticação (Amplify Gen 2 + Cognito + Vue 3)

Este plano foi refatorado para alinhar-se ao fluxo novo: abertura de **modal** com Authenticator ao clicar no botão “Entre/cadastre-se” no Header e inclusão de **IDP Google já configurado no backend**. Guards de rota NÃO serão ativados agora; apenas deixamos pontos de ancoragem comentados para o futuro.

Links de referência
- Set up Auth: https://docs.amplify.aws/vue/build-a-backend/auth/set-up-auth/
- Sign-up: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/sign-up/
- Sign-in: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/sign-in/
- Sign-out: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/sign-out/
- Manage user attributes: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/manage-user-attributes/

Objetivos
1) Usar a configuração de Auth existente no Amplify (Cognito) via Gen 2 (email + phone + IDP Google conforme resource.ts).
2) Conectar o front-end (Amplify.configure) e integrar o **Authenticator em um modal** acionado pelo Header.
3) Implementar gerenciamento centralizado de sessão com Pinia (bootstrap/refreshUser, signOut).
4) Implementar composable useAuth para orquestrar fluxos (sign-up/sign-in/sign-out/atributos + signInWithRedirect Google).
5) Personalizar UX do Authenticator (tema/branding), mantendo acessibilidade (modal).
6) Testar em sandbox local e preparar deploy.

Arquitetura (Clean Architecture — resumo)
- Infrastructure (Amplify): amplify/auth/resource.ts
- Presentation (Vue): Header/ModalAuthenticator, stores, router (sem guards ativos).
- Application/Domain (app layer): store + composables usando aws-amplify/auth.
- Dependências fluem de fora → dentro; domain não conhece Amplify diretamente. No MVP, integração na camada de aplicação.

Estado atual do backend (fatos do resource.ts)
- [resource.ts](/amplify/auth/resource.ts:1)
  - loginWith: { email: true, phone: true }
  - externalProviders.google DEFINIDO com clientId/secret via secret() e attributeMapping de email/phone
  - callbackUrls/logoutUrls definidos a partir de VITE_DEVELOPMENT_URL e VITE_PRODUCTION_URL
  - userAttributes: preferredUsername opcional e mutável
  - groups: ADMINS, USERS (SPEAKERS comentado)
- Implicações:
  - Google IDP está explicitamente configurado no backend. Não há necessidade de “comentar bloco” no plano: devemos habilitar o botão Google no Authenticator e/ou fluxo redirect imediatamente.
  - Como phone está habilitado em loginWith, fluxos passwordless via SMS OTP podem ser planejados no futuro (fora do escopo imediato).

Escopo de Entrega (MVP)
- Email + senha (password based) e phone como login compatível com config atual (sem OTP ainda).
- Sign-up com confirmação por código e autoSignIn (quando aplicável).
- Sign-in com tratamento de nextStep.
- Sign-in com **Google (IDP)** via redirect — ATIVO no front dado que o backend já está configurado.
- Sign-out local e global.
- Gestão de atributos básicos (email, preferredUsername) com confirmação quando exigida.
- Persistência de sessão entre refresh.
- Modal de autenticação acionado pelo Header.

Roadmap de Implementação

1. Backend Amplify Auth (aproveitar configuração existente)
   - Verificar se sandbox/deploy foram executados para gerar outputs:
     - npx ampx sandbox
     - Verificar amplify_outputs.json
   - Revisar variáveis de ambiente usadas no resource.ts para URLs:
     - VITE_DEVELOPMENT_URL, VITE_PRODUCTION_URL (devem corresponder às origens do front)
   - Confirmar secrets configurados: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
   - Não alterar a configuração de externalProviders.google (já definida). Apenas validar fluxo e domínios de redirect.

2. Configuração Front-end
   - [amplify.ts](/src/lib/amplify.ts:1) com Amplify.configure(outputs).
   - Importar em [main.ts](/src/main.ts:1) antes do mount.
   - Instalar UI:
     - npm i @aws-amplify/ui-vue
     - Importar estilos globais do Amplify UI em App ou no componente do modal.

3. UI — ModalAuthenticator integrado ao Header
   - Criar componente ModalAuthenticator (ex.: src/components/auth/ModalAuthenticator.vue) contendo:
     - `<authenticator social-providers="google" />` do @aws-amplify/ui-vue (Google ATIVO pois backend já está pronto)
     - Emite eventos de sucesso (para fechar o modal) e de erro
   - Alterar [TheHeader](/src/components/shared/TheHeader.vue:1) para que o botão “Entre/cadastre-se” abra o modal.
   - Estados do modal:
     - Controlados por um state global leve (Pinia UI store) ou provide/inject em App.vue (decisão local). Sugerido: UI store para consistência.

4. Pinia Store (src/stores/auth.store.ts)
   - Estado: currentUser, loading, error
   - Ações:
     - bootstrap (getCurrentUser + fetchUserAttributes)
     - signOut({ global? })
     - refreshUser() (invocada após DONE em sign-in/sign-up)
   - Getters: isLoggedIn, displayName
   - Observação: ações signUp/signIn/confirmSignIn/… podem ficar no composable e delegar ao store apenas atualização de snapshot, ou serem wrappers no store. Sugerido: store com wrappers “doX” e composable orquestrando nextSteps.

5. Composable (src/composables/useAuth.ts)
   - Orquestração:
     - signUp → confirmações → autoSignIn (quando aplicável) → store.refreshUser → fechar modal
     - signIn → nextStep/MFA (futuro) → confirmSignIn → store.refreshUser → fechar modal
     - signInWithRedirect({ provider: 'Google' }) → retorno → store.refreshUser → fechar modal
     - signOut({ global? }) → store cleanup
   - Gestão de atributos:
     - fetch/update/confirm/delete com tratamento de nextStep CONFIRM_ATTRIBUTE_WITH_CODE

6. Router (sem guards ativos)
   - Não ativar guards de rota agora.
   - Comentários de ancoragem a incluir em [router](/src/router/index.ts:1):
     ```ts
     // TODO(auth): quando habilitar proteção de rotas:
     // router.beforeEach(async (to) => {
     //   const auth = useAuthStore()
     //   if (!auth.currentUser) await auth.bootstrap()
     //   if (to.meta.protected && !auth.isLoggedIn) {
     //     // abrir modal de autenticação ao invés de redirecionar
     //     // ex.: uiStore.openAuthModal()
     //     return false
     //   }
     // })
     ```

7. UX/Branding
   - Personalizar tokens CSS do Amplify UI (cores, fonte, radius) no CSS global.
   - Modal:
     - Fechamento por ESC/overlay (com confirmação se houver formulário parcialmente preenchido).
     - Mensagens de erro amigáveis; logs somente em dev.
   - Header:
     - Quando logado, exibir avatar/menu com “Sair”.

8. Testes e Validação
   - Sandbox local: validar E2E
     - Sign-up → confirm → (autoSignIn quando aplicável)
     - Sign-in email/password → DONE
     - Sign-in com **Google** (backend já configurado): verificar redirect e retorno
     - Sign-out local/global
     - fetch/update atributos (confirm quando exigido)
   - Persistência de sessão após refresh (bootstrap)
   - Deploy preview: npx ampx deploy

Critérios de Aceitação (atualizados)
- Modal de autenticação abre a partir do Header e funciona com email/senha.
- Confirmação de registro por código (email OTP) e autoSignIn quando aplicável.
- Suporte a **IDP Google ativo** (botão social e/ou redirect) com fluxo funcionando em dev/prod conforme callback/logout URLs.
- Login e logout refletem estado no Pinia; sessão persiste após refresh.
- Tema/branding do Authenticator aplicado no modal.
- Guards de rota NÃO ativos; ancoragens documentadas para ativação futura.

Riscos e Decisões
- Verificar consistência das URLs (VITE_DEVELOPMENT_URL/VITE_PRODUCTION_URL) com origens reais de execução (localhost/host).
- Garantir secrets do Google válidos no ambiente (sandbox/deploy).
- O Authenticator simplifica a UI; fluxos avançados (MFA/TOTP/WebAuthn) podem ser adicionados depois.
- Store não deve persistir tokens manualmente; usar getCurrentUser/fetchUserAttributes.

Entregáveis
- amplify/auth/resource.ts (validado com Google, email, phone)
- src/lib/amplify.ts
- src/components/auth/ModalAuthenticator.vue
- src/stores/auth.store.ts
- src/composables/useAuth.ts
- Ajuste em src/components/shared/TheHeader.vue (abrir modal)
- (Somente comentários) Ancoragens em src/router/index.ts
- CSS de branding (tokens do Amplify UI)

Sequência de Commits (sugerida)
1) chore(auth): validate amplify auth resource (email/phone/google) and sandbox outputs
2) feat(amplify): configure Amplify outputs and boot in app
3) feat(auth-ui): add ModalAuthenticator with Amplify UI (google enabled) and branding
4) feat(header): open auth modal from header login button
5) feat(auth): add Pinia store for session management (bootstrap/refresh/signOut)
6) feat(auth): add useAuth composable with flows and Google redirect
7) test(auth): validate sandbox flows and session persistence
8) docs(auth): update TASKS/FLUX with final details
# Requisitos — Autenticação (Amplify Gen 2 + Cognito + Vue 3)

Escopo
Implementar autenticação de usuários usando Amazon Cognito via Amplify Gen 2, integrando com Vue 3 e Pinia, cobrindo registro, login, logout, gestão de atributos e proteção de rotas, conforme Issue #2.

Referências essenciais
- Set up Auth: https://docs.amplify.aws/vue/build-a-backend/auth/set-up-auth/
- Sign-up: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/sign-up/
- Sign-in: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/sign-in/
- Sign-out: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/sign-out/
- Manage user attributes: https://docs.amplify.aws/vue/build-a-backend/auth/connect-your-frontend/manage-user-attributes/

Requisitos funcionais (RF)
RF-01 — Registro por e-mail
- Usuário consegue registrar-se usando e-mail (como username).
- Dados enviados a Cognito via Amplify Auth signUp API.

RF-02 — Confirmação de registro
- Usuário recebe código (email OTP).
- Fluxo de confirmação via confirmSignUp.
- Suporte a autoSignIn pós-confirmação (quando habilitado).

RF-03 — Login
- Usuário consegue fazer sign-in com e-mail e senha.
- Tratar nextStep do signIn (incluindo casos com MFA quando habilitado).

RF-04 — Logout
- signOut local; opcionalmente global (invalidando refresh tokens em outros dispositivos).

RF-05 — Sessão e persistência
- Estado de sessão refletido no Pinia store.
- Após refresh da página, store reflete sessão ativa via getCurrentUser().

RF-06 — Proteção de rotas
- Rotas com meta.protected exigem autenticação.
- Guard redireciona para tela/rota de login (ou abre modal de autenticação).

RF-07 — Gestão de atributos de usuário
- Leitura de atributos via fetchUserAttributes.
- Atualização de atributos via updateUserAttribute(s); quando exigirem confirmação (email/phone), fluxo confirmUserAttribute e sendUserAttributeVerificationCode.
- Deleção de atributos via deleteUserAttributes.

RF-08 — UI/UX de autenticação
- Uso do Authenticator conectado do Amplify para acelerar MVP.
- Personalização de tema (cores, fontes, radius, logo).
- Acessibilidade: aria-labels, foco coerente, textos descritivos.

RF-09 — Integração no Header
- Botão login/sign-up aciona o fluxo de autenticação (rota /auth ou modal).
- Quando autenticado, exibir avatar/menu com opção Sign out.

Requisitos não funcionais (RNF)
RNF-01 — Segurança
- Política de senha mínima (≥ 8, números e maiúsculas, opcionalmente minúsculas e símbolos).
- Não persistir tokens manualmente no store/localStorage.
- Opcional: preparar base para MFA (Email/SMS/TOTP/WebAuthn) sem ativar neste MVP.

RNF-02 — Qualidade
- Código alinhado a Clean Architecture/DDD simplificado conforme rules.md.
- Funções pequenas e coesas; nomes descritivos.
- ESLint e TypeScript sem erros.

RNF-03 — Performance
- Lazy import para telas protegidas quando aplicável.
- Evitar recomputações desnecessárias (store e composable com refs/computed).

RNF-04 — Acessibilidade
- Authenticator com labels adequados e contraste suficiente.
- Estados de loading/erro claros e não intrusivos.

RNF-05 — Observabilidade/Erros
- Tratamento de erros no composable com mensagens amigáveis.
- Logs limitados no console apenas em dev.

Critérios de aceite (CA)
CA-01: Registro + confirmação por e-mail funciona fim a fim.
CA-02: Login e logout atualizam corretamente o estado no Pinia.
CA-03: Sessão persiste após refresh (bootstrap do store).
CA-04: Rotas meta.protected redirecionam corretamente quando não autenticado.
CA-05: Tema do Authenticator reflete branding (cores e logo).
CA-06: Atributos de usuário podem ser lidos e atualizados (com confirmação quando exigido).
CA-07: Documentação dos passos (tasks.md) e dos requisitos (este arquivo) concluída.

Dependências e pré-condições
- Node ≥ 20; npm ≥ 10.
- Amplify CLI Gen 2 operacional.
- Projeto já inicializado com Vue 3 + Pinia + Router + Tailwind 4 (vide docs/STACK.md).
- Amplify backend bootstrapado com ampx sandbox/deploy para geração do amplify_outputs.json.

Riscos e mitigação
- Mudanças futuras de MFA/Provedores externos: encapsular fluxos no composable/useAuth para evoluir com baixo impacto.
- Customização profunda de UI do Authenticator: gradual; começar com tokens CSS.
- Erros de configuração de domínio/redirect no Cognito (em provedores externos): fora do MVP; documentação preparada.

Saída esperada (artefatos)
- amplify/auth/resource.ts configurado
- src/lib/amplify.ts
- src/stores/auth.store.ts
- src/composables/useAuth.ts
- Ajustes no router (guards) e App/Authenticator
- CSS de tema para Authenticator
- Documentos: tasks.md, requirements.md, flux.md
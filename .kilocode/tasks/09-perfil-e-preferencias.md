# Plano — Página de Perfil, Modelo de Usuário e Migração

Este documento descreve a estratégia para implementar a Página de Perfil (UI), o modelo de dados de perfil do usuário (Amplify Data), a migração dos usuários atuais (Cognito → DynamoDB) e flags de recurso para lançamentos graduais.

## Objetivos
- Criar uma página de “Profile Settings” com formulário estático (fase 1).
- Modelar `UserProfile` no Amplify Data para dados ricos do perfil (fase 2).
- Disponibilizar um fluxo de migração para popular a tabela com usuários já existentes no User Pool (fase 4).
- Mapear preferências de notificação (email, SMS, WhatsApp) como booleans simples.
- Definir que o número do WhatsApp é o `phone_number` do Cognito em E.164 (já usado por broadcasts).

## Escopo (MVP)
- UI: página `/profile` protegida para usuários logados, com navegação lateral e formulário de detalhes: foto (preview), displayName, profissão (novo campo), bio e interesses (chips únicos). Inclusão de toggles de notificações (email, SMS, WhatsApp).
- Backend: novo modelo `UserProfile` com autorização por proprietário; S3 para fotos de perfil.
- Migração: Backfill a partir do Cognito (idempotente) para criar/atualizar `UserProfile` por `sub`.

---

## Fase 0 — Flags e UX
- `VITE_AUTH_HIDE_GOOGLE_BUTTON` (UI-only) — já implementada para ocultar o botão Google no modal do Amplify.
- Flags sugeridas para o perfil (habilitam seções da UI sem quebrar o app):
  - `VITE_PROFILE_ENABLE_NOTIFICATIONS=true|false`
  - `VITE_PROFILE_ENABLE_INTERESTS=true|false`
  - `VITE_PROFILE_ENABLE_PHOTO=true|false`

---

## Fase 1 — Página de Perfil (UI estática)
- Rota `/profile` com `meta.requiresAuth` e guard (se não logado, redireciona e abre modal).
- Layout (referência do mock anexo):
  - Coluna esquerda: card de resumo (avatar/initials, nome, email) + lista de abas.
  - Coluna direita: formulário “Edit Profile”.
- Campos/Comportamentos:
  - Foto: seletor com preview local (sem upload ainda).
  - `displayName` (mapeável a `preferred_username` no futuro).
  - `profession` (novo campo – apenas no `UserProfile`).
  - `bio` (texto livre), `interests` (lista simples de strings únicas; cada token/Enter vira chip removível).
  - Preferências de notificação: `notifyEmail`, `notifySms`, `notifyWhatsApp` (booleans). Observação: WhatsApp usa o `phone_number` (Cognito) em E.164; sem campo dedicado.
- Ação de salvar desabilitada nesta fase (mostrar “Salvar (em breve)”).

Status: entregue na UI (sem persistência) em `src/views/ProfileSettingsView.vue`, rota e link no header.

---

## Fase 2 — Modelo no Backend (Amplify Data)

### 2.1 — Esquema proposto
```ts
// amplify/data/resource.ts (trecho a ser adicionado)
const UserProfile = a.model({
  id: a.id().required(), // sub do Cognito
  displayName: a.string(),
  profession: a.string(),
  bio: a.string(),
  interests: a.string().array(),
  photoKey: a.string(), // S3 object key
  photoUrl: a.url(),    // opcional (pública/assinada)
  notifyEmail: a.boolean(),
  notifySms: a.boolean(),
  notifyWhatsApp: a.boolean(),
  updatedAt: a.string(),
}).authorization((allow) => [
  allow.owner(),                 // dono pode ler/editar
  allow.group('ADMINS').to(['read', 'update']),
])
```

### 2.2 — Storage de Fotos
- S3 para upload de avatar, com nível `protected` (ou `private`).
- Salvar `photoKey` e servir via URL assinada ou CloudFront público; opcional espelhar a URL em `picture` (Cognito).

---

## Fase 3 — Integração Frontend
- Composable `useUserProfile` (CRUD):
  - `getOrCreateProfile(sub)`, `updateProfile(partial)`, `uploadAvatar(file)`.
- Bind do formulário à store local + mutações via Amplify Data.
- Atributos Cognito:
  - `displayName` pode sincronizar com `preferred_username` (opcional).
  - E-mail e `phone_number` seguem gerenciados no Cognito; fluxos de verificação já existem em `useAuth.ts`.

---

## Fase 4 — Migração/Backfill (Cognito → UserProfile)

### 4.1 — Estratégia
- Lambda “admin” de migração, executada sob demanda (ou script Node local com credenciais):
  1) Paginar `ListUsers` no Cognito User Pool.
  2) Para cada usuário, ler `sub`, `email`, `name`, `preferred_username`, `phone_number`.
  3) Upsert no `UserProfile` (PK = `id = sub`).
  4) Defaults sugeridos:
     - `displayName = preferred_username || name || email.split('@')[0]`
     - `profession = ''`, `bio = ''`, `interests = []`
     - `notifyEmail = true`, `notifySms = false`, `notifyWhatsApp = false`
     - `updatedAt = now()`
- Idempotência: sempre sobrescrever seletivamente apenas campos “vazios” (ou aceitar parâmetro `force=true`).

### 4.2 — Pseudocódigo (Lambda)
```ts
// 1) Listar usuários do Cognito (paginação)
// 2) Para cada user → montar payload padrão do UserProfile
// 3) Tentar inserir; se existir, fazer update parcial
```
- Logs com totais, tempo e erros. Execução segmentada por página para retentativas.

---

## Fase 5 — Notificações e Backends
- Broadcasts por SMS/WhatsApp: filtrar por `notifySms`/`notifyWhatsApp` e `phone_number_verified=true`.
- E-mail: filtrar por `notifyEmail`. Integração com SES/terceiros futuramente.

---

## Critérios de Aceite
- UI: `/profile` disponível apenas logado; formulário renderiza, adiciona/remove interesses e faz preview de foto.
- Backend: schema `UserProfile` provisionado com `allow.owner()` e S3 de avatares disponível.
- Migração: execução idempotente; amostra de usuários populada em `UserProfile`.
- Flags: ativação/desativação não quebra fluxo de login nem a página de perfil.

## Riscos e Decisões
- Custom attributes no Cognito são imutáveis em tipo — preferir DynamoDB para campos dinâmicos (lista/interesses).
- WhatsApp atrelado a `phone_number` simplifica UX, mas limita múltiplos números. Revisitar se houver necessidade.
- Upload público vs privado: equilibrar conveniência de cache (CDN) vs. privacidade; optar por `protected` inicialmente.

---

## Anexos / Observações
- O número de WhatsApp é o `phone_number` do Cognito em formato E.164 (ex.: `+5561999999999`).
- O botão de login Google do Amplify UI pode ser ocultado com `VITE_AUTH_HIDE_GOOGLE_BUTTON=true` (OAuth continua habilitado via redirect).

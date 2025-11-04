# Plano — Hub de Usuários Ativos (Marketplace)

Este documento descreve o planejamento para a página Hub de Usuários Ativos — um catálogo/marketplace de perfis com foto, profissão e descrição — baseado no `UserProfile` (Amplify Data) e sinais do Cognito.

## Objetivos
- Entregar uma página dedicada (rota `/hub`) listando usuários ativos com cartão de perfil (foto, nome, profissão, bio curta).
- Seguir tokens de design do projeto (Tailwind + shadcn-vue), com animações suaves e interatividade leve.
- Basear “ativos” em um sinal confiável e barato de manter no MVP.
- Preparar o backend para visibilidade pública controlada (opt‑in) e possíveis filtros/buscas.

## Escopo (MVP)
- UI: grid responsivo de cards com avatar, displayName, profession, bio (truncada) e chips de interesses.
- Interatividade: hover com leve elevação/brilho; skeletons; animações de entrada; click abre modal com mais detalhes (ou rota `/hub/:id`).
- Dados: listar `UserProfile` com `isPublic=true` e `active=true` (definições abaixo); foto via `photoUrl`/`photoKey`.
- Busca/filtragem: por profissão e interesse (client‑side), com query params persistentes (`?q=&profession=&interest=`).

---

## Definições de “Ativo” e Privacidade
- `isPublic` (boolean, default `false`): o usuário opta por exibir seu perfil no hub.
- `active` (boolean) e/ou `lastActiveAt` (ISO): indica atividade recente.
  - MVP: atualizar `lastActiveAt` no login/app open (cliente), e derivar `active = lastActiveAt >= now()-30d`.
  - Futuro: Post‑Auth Trigger (Lambda) para atualizar `lastActiveAt` com fonte confiável do Cognito (LastAuthAt).
- Campos públicos: `displayName`, `profession`, `bio`, `interests`, `photoUrl` (ou URL assinada), `medias` selecionadas.

---

## Backend (Amplify Data)

### 1) Modelo `UserProfile` — extensões
Adicionar campos para visibilidade/atividade, mantendo compatibilidade:
```ts
// amplify/data/resource.ts (UserProfile)
const UserProfile = a.model({
  id: a.id().required(),
  displayName: a.string(),
  profession: a.string(),
  bio: a.string(),
  interests: a.string().array(),
  photoKey: a.string(),
  photoUrl: a.url(),
  notifyEmail: a.boolean(),
  notifySms: a.boolean(),
  notifyWhatsApp: a.boolean(),

  // novo
  isPublic: a.boolean(),
  lastActiveAt: a.string(), // ISO
  active: a.boolean(),

  medias: a.hasMany('SocialMedia', 'userId'),
})
```

### 2) Autorização para leitura pública controlada
Opções (avaliar trade‑offs):
- A) Tornar leitura pública apenas de perfis com `isPublic=true` via `allow.publicApiKey().to(['read'])` no modelo. Simples, porém expõe todos os campos públicos do modelo (mitigar com disciplina de campos).
- B) Criar uma query custom `listPublicProfiles` que retorna um tipo projeção (somente campos públicos) e usa `allow.publicApiKey().to(['query'])`.

MVP sugerido: B (query custom) para controle fino de payload e filtro por `isPublic`/`active` sem alterar `authorization` do modelo.

### 3) Sinal de atividade (MVP)
- Atualizar `lastActiveAt` no cliente após login/refresh (composable de auth).
- Manter `active` coerente pelo cliente (job leve) ou calcular no frontend (`lastActiveAt >= now()-30d`).
- Futuro: mover essa responsabilidade para trigger de Cognito.

---

## Integração Frontend

### 1) Rota e View
- Rota: `/hub` (meta opcional `requiresAuth: false`).
- View: `src/views/UsersHubView.vue`.
- Detalhe: modal `UserPreviewModal.vue` ou rota `/hub/:id` com SSR‑like preload.

### 2) Composables
- `useUsersHub.ts`:
  - `searchParams` (ref): `{ q, profession, interest, page, pageSize }`.
  - `listPublicProfiles(params)` → chama query custom via Amplify Data.
  - `resolvePhoto(profile)` → resolve `photoUrl` ou URL assinada de `photoKey` (Storage `protected`).
  - `debouncedSearch` para inputs.

### 3) UI/Design
- Componentes (shadcn-vue): `Card`, `Avatar`, `Badge`, `Input`, `Select`, `Tooltip`, `Skeleton`, `Button`.
- Layout: grid `sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`, gap usando tokens; max‑width centralizada.
- Animações: classes utilitárias existentes (`animate-fade-in-up`, `animate-fade-in`), `transition-all` com `ease-out`.
- Acessibilidade: `aria-label` nos cards e botões; foco visível; ordens de tab coerentes.

### 4) Filtragem/Busca (client‑side no MVP)
- Texto (`q`) busca em `displayName`, `profession`, `bio` (case‑insensitive) em memória.
- Filtros de `profession` e `interest` via menus.
- Persistir `searchParams` em query string e restaurar no mount.
- Paginação/infinite scroll: paginação simples (page/pageSize) para reduzir custo inicial; no futuro, paginação paginada pelo backend.

---

## Query Custom (Backend)

Criar uma query `listPublicProfiles` com retorno de projeção mínima e filtros:
```ts
// Esboço (amplify/data/resource.ts)
const PublicProfile = a.customType({
  id: a.id(),
  displayName: a.string(),
  profession: a.string(),
  bio: a.string(),
  interests: a.string().array(),
  photoUrl: a.url(),
})

listPublicProfiles: a.query()
  .arguments({
    q: a.string(),
    profession: a.string(),
    interest: a.string(),
    page: a.integer(),
    pageSize: a.integer(),
  })
  .returns(a.ref('PublicProfile').array())
  .authorization(allow => [allow.publicApiKey(), allow.authenticated()])
  .handler(a.handler.function(listPublicProfilesFn))
```
- Implementação no handler: filtrar por `isPublic=true` e `active=true`; aplicar filtros e paginação.
- Se necessário, usar `query` nos índices da tabela do `UserProfile` ou varrer por páginas (MVP com poucos registros).

---

## Página (UX detalhado)
- Header fixo com título “Conecte-se com a comunidade” + descrição curta.
- Barra de busca e filtros no topo em um `Card` com `Input`, `Select` e chips de filtro ativos.
- Grid de cards:
  - Avatar circular (foto ou iniciais), nome (sem quebra), profissão (muted), bio truncada (`line-clamp-3`).
  - Chips de interesses roláveis horizontalmente.
  - Hover: `shadow-lg`, sutil `scale-[1.01]`, outline com `--color-ring`.
  - CTA “Ver perfil” que abre modal/rota detalhada com redes sociais (`SocialMedia`).
- Estado vazio com ilustração leve e CTA para explorar eventos.

---

## Telemetria/Performance
- Lazy load de imagens (`loading="lazy"`, `decode="async"`).
- Debounce nas buscas (300ms).
- Limitar pageSize (ex.: 24); exibir contagem de resultados.
- Cache leve no composable por chave de filtros (Map) para navegação entre páginas.

---

## Critérios de Aceite
- Rota `/hub` acessível e renderizando uma grade de perfis com dados reais quando `isPublic=true`.
- Busca por texto e filtros de profissão/interesse funcionando client‑side.
- Design consistente com tokens (cores, radius, tipografia) e animações suaves.
- Imagens com lazy load, skeletons no carregamento e estado vazio amigável.
- Nenhum dado privado (notificações, phone, email) exposto na lista pública.

## Riscos e Decisões
- Autorização pública no modelo vs query custom: preferimos projeção por segurança e controle de payload.
- Sinal de “ativo”: MVP no cliente pode ser burlado; mover para trigger do Cognito na fase 2.
- Escala: varredura completa para filtros no handler pode ser custosa; considerar índices/scan + cache/CloudFront no futuro.

---

## Fases e Roadmap
1. Backend: query custom + handler simples com filtro `isPublic && active` (ou apenas `isPublic` no MVP).
2. Frontend: rota `/hub`, composable `useUsersHub`, cards responsivos e UX de busca/filters.
3. Atividade: atualizar `lastActiveAt` no login e derivar `active` no cliente; campo `isPublic` via página de Perfil.
4. Evolução: Post‑Auth Trigger (Cognito) para `lastActiveAt`; paginação real no backend; bookmarks/compartilhamento.

## Anexos / Observações
- Tokens disponíveis em `src/assets/main.css` e componentes shadcn‑vue (ver `components.json`).
- `UserProfile` atual não possui `isPublic/active/lastActiveAt`; incluir no schema antes do release do hub.
- As redes sociais (`SocialMedia`) já relacionam com `UserProfile` — úteis na visão detalhada.

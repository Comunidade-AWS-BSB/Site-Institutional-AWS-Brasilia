# 04 — Plano de Migração por PRs (Refatoração de UI)

Objetivo
Sequenciar a implementação em PRs pequenos, atômicos e reversíveis, reduzindo riscos. Este documento consolida escopo, impactos, arquivos tocados e riscos/mitigações por PR.

Contexto confirmado
- Rotas novas: /events/current (EventTab) e /store (Lojinha)
- CTA “Ver próximo evento” aponta para /events/current
- Header com item “Próximo evento” destacado
- Fontes via CDN (Space Grotesk e Iki Mono)
- Ordem final da Home: Hero (comunidade) → NextEvent → Palestrantes → Galeria → Patrocinadores → FAQ → Contatos (sem endereço)
- Remover Agenda e Ingressos da Home; VenueSection migra para EventTab

Visão geral dos PRs
- PR1 — Fundamentos (tokens + fontes)
- PR2 — Rotas e Header
- PR3 — Reestruturação da Home
- PR4 — EventTab (/events/current)
- PR5 — Lojinha (/store)
- PR6 — Acessibilidade e Performance
- PR7 — Polimento visual cloud-native

PR1 — Fundamentos de tema e fontes
Escopo
- Criar camada de tokens app.* (CSS vars e TS constants).
- Carregar Space Grotesk (300/400/600/700) e Iki Mono via CDN.
- Configurar tipografia base: body/headings passam a usar Space Grotesk.

Arquivos tocados (indicativos)
- index.html (inclusão de fontes via CDN)
- src/main.ts (import de tokens.css)
- src/assets/main.css (ajuste da família base; compat com variáveis existentes)
- Novo: src/theme/tokens.css; src/theme/tokens.ts

Riscos e mitigação
- Regressão de tipografia/medidas: smoke-test visual; feature flag mínima (scoped, se necessário).
- Dark mode: validar contraste em ambos os temas.

PR2 — Rotas e Header
Escopo
- Adicionar rotas /events/current e /store.
- Atualizar header:
  - Remover “Comprar Ingressos” e âncoras para buy-tickets.
  - Incluir item “Próximo evento” (estilo primário), estado ativo em /events/current.

Arquivos tocados
- ['src/router/index.ts'](src/router/index.ts)
- ['src/components/shared/TheHeader.vue'](src/components/shared/TheHeader.vue)

Riscos e mitigação
- Links quebrados: QA de navegação; checar aria-current.

PR3 — Reestruturação da Home
Escopo
- Renomear o Hero atual para NextEventSection.vue e simplificar (título, data, breve descrição, CTA “Ver próximo evento”; remover local/galeria/programação).
- Criar novo HeroSection.vue focado na comunidade (copy derivada da FAQ).
- Remover Agenda (ScheduleSection) e Ingressos (BuyTicketsSection) da Home.
- Remover VenueSection da Home (conteúdo migra para EventTab).
- Ajustar ContactSection (sem endereço/mapa).

Arquivos tocados
- ['src/views/HomeView.vue'](src/views/HomeView.vue)
- ['src/components/sections/HeroSection.vue'](src/components/sections/HeroSection.vue) → NextEventSection.vue (novo arquivo)
- ['src/components/sections/ScheduleSection.vue'](src/components/sections/ScheduleSection.vue) (excluir da Home)
- ['src/components/sections/BuyTicketsSection.vue'](src/components/sections/BuyTicketsSection.vue) (excluir da Home)
- ['src/components/sections/VenueSection.vue'](src/components/sections/VenueSection.vue) (excluir da Home)
- ['src/components/sections/ContactSection.vue'](src/components/sections/ContactSection.vue) (remover endereço/mapa)
- Novo: novo HeroSection.vue

Riscos e mitigação
- Quebra de âncoras existentes (#schedule/#buy-tickets/#venue):
  - Mitigar com redirecionamentos in-page temporários (se houver), ou remoção controlada com comunicação no PR.
- Regressão visual: screenshot tests manuais.

PR4 — EventTab (/events/current)
Escopo
- Criar view com seções:
  - Header (título, data, status, CTA “Inscrever-se” gratuito, “Compartilhar”)
  - Local (mapa + info)
  - Galeria do local
  - Programação básica (lista simples)
  - Regras/conduta e Acessibilidade
- Dados estáticos com estrutura preparada para fonte dinâmica futura (mock/props).

Arquivos tocados
- Novo: src/views/EventTabView.vue
- Possível: componentes novos de seção (se preferir modularizar)

Riscos e mitigação
- Performance do mapa/galeria: lazy-load; defer de iframes; validação de foco/aria.

PR5 — Lojinha (/store)
Escopo
- Criar StoreView.vue com grid de cards de produto.
- Migrar “Kit Camisa” do BuyTicketsSection (apenas card/CTA, sem associação a ingressos).

Arquivos tocados
- Novo: src/views/StoreView.vue
- Remover usos antigos em Home

Riscos e mitigação
- CTAs de compra/contato: revisar linguagem e acessibilidade; WhatsApp/contato como canal.

PR6 — Acessibilidade e Performance
Escopo
- prefers-reduced-motion (redução 0–50ms).
- Foco visível consistente; aria-* apropriados nos novos CTAs/links.
- Contraste AA: textos secundários com tokens.
- Lazy-load/otimização de imagens em Home/EventTab.

Arquivos tocados
- CSS global (tokens/overrides)
- Componentes de galeria/cards/CTA

Riscos e mitigação
- Regressão de UX para usuários sem motion: validar manualmente.

PR7 — Polimento visual Cloud-native
Escopo
- Gradientes suaves (Hero novo e banners).
- Sombras sutis e radius consistentes.
- Estados hover/focus/active padronizados com tokens.

Arquivos tocados
- CSS global e componentes de alto tráfego (Hero/NextEvent/cards/botões)

Riscos e mitigação
- Divergência visual: alinhar com mockups finais.

Plano de comunicação e validação por PR
- Cada PR inclui:
  - Checklist de critérios de aceite local.
  - Antes/depois (screenshots).
  - Notas de migração (âncoras/rotas).
  - Itens de a11y validados (foco, tab, aria).

Critérios de aceite globais (resumo)
- Home reordenada e sem “Comprar Ingressos”.
- Header com “Próximo evento” destacado.
- EventTab funcional com inscrição gratuita e informações essenciais.
- Tokens aplicados com Space Grotesk e Iki Mono.
- Acessibilidade básica e responsividade cobrindo principais breakpoints.
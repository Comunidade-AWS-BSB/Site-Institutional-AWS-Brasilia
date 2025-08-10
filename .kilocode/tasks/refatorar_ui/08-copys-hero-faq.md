# 08 — Copys do Novo Hero (derivadas da FAQ)

Objetivo
Fornecer opções de copy concisa para o novo Hero focado na comunidade, derivadas do conteúdo existente em ['src/components/sections/FaqSection.vue'](src/components/sections/FaqSection.vue). As copys abaixo já consideram o tom “cloud-native”, clareza, e CTAs definidos. Não criar código agora.

Princípios de redação
- Claro e inclusivo: aberto a iniciantes e especialistas.
- Sem linguagem de compra para eventos (apenas “Inscrever-se” quando aplicável).
- Enfatizar comunidade, aprendizado e networking.
- Frases curtas; benefícios concretos.
- Adequado a dark/light e responsivo (tipografia app.*).

Estrutura do Hero (referência)
- Headline (.app-display-l)
- Subheadline (.app-h3)
- 1–2 parágrafos curtos (.app-body-m)
- CTAs:
  - Primário: “Conheça a comunidade” → #faq
  - Secundário: “Próximo evento” → /events/current

Opção A (inclusiva e institucional)
- Headline: AWS User Group Brasília
- Subheadline: Comunidade aberta para aprender e construir na nuvem
- Parágrafos:
  - Somos voluntários e entusiastas de AWS em Brasília. Reunimos iniciantes e especialistas para compartilhar experiências, talks e networking.
  - Nossos encontros são gratuitos e abertos ao público. Participe do próximo evento ou conheça como funcionamos.
- CTAs:
  - [Conheça a comunidade] → #faq
  - [Próximo evento] → /events/current

Opção B (mão na massa / hands-on)
- Headline: Aprenda, compartilhe e pratique AWS
- Subheadline: Talks, demos e networking gratuitos em Brasília
- Parágrafos:
  - Promovemos encontros presenciais e online para explorar serviços AWS, arquitetura cloud e boas práticas.
  - Todos são bem-vindos — do primeiro contato à certificação. Traga suas dúvidas e ideias.
- CTAs:
  - [Conheça a comunidade] → #faq
  - [Próximo evento] → /events/current

Opção C (com foco em diversidade de público)
- Headline: Comunidade AWS para todos os níveis
- Subheadline: De primeiros passos a arquiteturas avançadas
- Parágrafos:
  - Reunimos estudantes, profissionais e curiosos para aprender em conjunto, de forma acessível e colaborativa.
  - Participe de encontros gratuitos, palestras e momentos de networking com a comunidade local.
- CTAs:
  - [Conheça a comunidade] → #faq
  - [Próximo evento] → /events/current

Opção D (orientada a impacto e pertencimento)
- Headline: Construa com a comunidade AWS Brasília
- Subheadline: Conteúdo prático, troca de experiências e networking
- Parágrafos:
  - Participar é simples: acompanhe as datas, inscreva-se gratuitamente e venha aprender com pessoas apaixonadas por nuvem.
  - Junte-se a nós para impulsionar sua carreira e fortalecer o ecossistema local.
- CTAs:
  - [Conheça a comunidade] → #faq
  - [Próximo evento] → /events/current

Notas de microcopy (auxiliares)
- Badge/nota: Eventos gratuitos e abertos
- Acesso/conduta (links secundários): Código de Conduta | Acessibilidade
- Callouts curtos:
  - “Talks e demos”
  - “Networking”
  - “Aberto a iniciantes”
  - “Comunidade oficial AWS User Group”

Guia de tipografia para o Hero
- Headline: .app-display-l (bold 700) — 42/48
- Subheadline: .app-h3 — 18/22 (700)
- Corpo: .app-body-m — 14/20 (400)
- CTAs:
  - Primário (botão): label com .app-body-m/600
  - Secundário (outline): mesma tipografia; manter hit-area ≥ 44px

Considerações de a11y
- Contraste AA para headline e CTAs em ambas as paletas.
- Ordem de tabulação: Headline → CTA primário → CTA secundário.
- Focus visível (outline 2px + offset 2).
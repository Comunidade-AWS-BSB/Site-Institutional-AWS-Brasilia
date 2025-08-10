# 03 — Wireframes Anotados (Home, EventTab, Lojinha)

Objetivo
Descrever wireframes de alto nível com anotações funcionais e de design system (tokens app.*), sem criar código. Servem de referência visual e funcional para implementação.

Legenda de tokens
- Tipografia: .app-h1..h5, .app-body-m/s, .app-display-l, .app-code-inline
- Espaço: --app-space-[xxs..xxxl]
- Grid: 12 col, gutter = --app-grid-gutter
- Raios: --app-radius-m (4), --app-radius-l (8)
- Motion: --app-motion-duration-quick (120ms), --app-motion-duration-complex (250ms)
- Cores: --app-color-bg/fg/primary/primary-fg/border
- A11y: foco 2px (var(--color-ring)), altura mínima 44px

1) Home (ordem final)
1.1 HeroSection (novo — foco na comunidade)
- Layout:
  - Container max (grid 12-col); padding X: --app-container-padding; Y: --app-space-xxxl
  - Background: gradiente sutil “cloud-native” (tokens), versão dark com contraste
- Conteúdo:
  - Headline (.app-display-l): “AWS User Group Brasília”
  - Subheadline (.app-h3): “Quem somos, como interagimos, como funcionamos”
  - Copy (.app-body-m): Trechos condensados da FAQ (o que é o grupo; quem pode participar; gratuito)
  - CTAs:
    - Primário (button): “Conheça a comunidade” → #faq
      - bg: --app-color-primary; text: --app-color-primary-fg; radius: --app-radius-l
      - hover/active/focus com tokens; motion 120ms
    - Secundário (button outline): “Próximo evento” → /events/current
      - manter destaque visual (outline forte + foco visível)
- Acessibilidade:
  - Ordem de tabulação lógica; foco visível
  - Texto com contraste AA

1.2 NextEventSection (ex-Hero simplificado)
- Layout compacto; grid 12 col (≤ md: 1 col; ≥ lg: 6/6)
- Conteúdo:
  - Título (.app-h2): “Próximo evento”
  - Data e breve descrição (.app-body-m); ID opcional em .app-code-inline
  - CTA primário: “Ver próximo evento” → /events/current (estilo primário)
- Remover:
  - Local detalhado, galeria, programação, “comprar” ou linguagem de pagamento

1.3 Palestrantes
- Grid responsiva: 1–4 col, gutter = --app-grid-gutter
- Card:
  - radius: --app-radius-l; border: --app-color-border; sombra leve
  - Foto (top), nome (.app-h4), mini-bio (.app-body-s), tópicos (tags .app-body-s)
- Motion:
  - hover: elevar sombra (120–180ms)

1.4 Galeria
- Grid imagens: 2–4 col; lazy-load
- Itens:
  - radius: --app-radius-l; overlay hover (150–200ms)
- Lightbox:
  - foco com tab; fechar por ESC; contador de imagens

1.5 Patrocinadores
- Grid de logos (grayscale); hover: cor
- Espaçamento: padding Y L/XL
- A11y: alt adequado; ordem lógica

1.6 FAQ (acordeões)
- Itens:
  - Cabeçalho: .app-h4; botão expandível (aria-expanded)
  - Conteúdo: .app-body-m
- Motion: expansão/colapso 250ms
- A11y: foco visível; setas com rotação animada

1.7 Contatos (sem endereço)
- Cards: Email, Redes (WhatsApp/LinkedIn/Twitter, conforme política)
- Formulário simples:
  - Campos: Nome, Email, Mensagem (sem endereço/telefone obrigatório)
  - Inputs acessíveis (labels, aria-*), foco ring, altura ≥ 44px
- Remover mapa e bloco de endereço fixo

2) EventTab (/events/current)
2.1 Header (sticky local)
- Conteúdo:
  - Título (.app-h2), Data (.app-body-m), Status (badge pequeno: aberto/encerrado)
  - CTA primário: “Inscrever-se” (gratuito) — evitar “comprar”
  - CTA secundário: “Compartilhar”
- Layout:
  - Content layout com gutters; cards por seção

2.2 Seção: Local
- Card com mapa (iframe) e info essencial (sem granularidade excessiva)
- Itens:
  - Nome do local (.app-h4), endereço em .app-body-m
  - Acessibilidade do iframe (title), fallback

2.3 Seção: Galeria do local
- Grid similar à Home; lazy-load; legendas curtas

2.4 Seção: Programação básica
- Lista vertical (horário — título — palestrante opcional)
- Tipografia:
  - Horário em destaque (.app-code-inline)
  - Título (.app-body-m/600)
- Sem abas complexas nesta primeira versão

2.5 Seção: Regras/Conduta e Acessibilidade
- Texto em .app-body-m; links para código de conduta
- Itens de acessibilidade (acesso, elevadores, contato de apoio)

3) Lojinha (/store)
3.1 Lista de produtos (ex.: “Kit Camisa”)
- Card de produto:
  - Imagem, nome (.app-h4), descrição (.app-body-m), preço (se aplicável), CTA (WhatsApp/contato)
  - Radius --app-radius-l; sombra leve; foco visível
- Grid 2–3 col; gutters padrão

4) Anotações de navegação
- Header global:
  - Item “Próximo evento” (router-link) — estilo primário; aria-current quando ativo
- CTAs “Ver próximo evento” na Home → /events/current
- Breadcrumbs opcionais em EventTab

5) Acessibilidade e performance transversais
- prefers-reduced-motion: reduzir/zerar animações
- Contraste AA; fontes legíveis; line-height conforme escala
- Lazy-load e compressão de imagens (Home/EventTab/Lojinha)
- Botões/links com hit-area adequada e foco visível

6) Entregáveis visuais (fora deste repo)
- Mockups de alta fidelidade (Figma ou similar) com:
  - Home (nova ordem)
  - EventTab (todas seções)
  - Lojinha
- Anotações de tokens por camada e medidas (px/cols/gutters)
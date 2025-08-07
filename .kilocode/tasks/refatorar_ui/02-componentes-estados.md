# 02 — Componentes e Estados (mapeados para tokens app.*)

Objetivo
Definir padrões de interação, variantes e estrutura de componentes UI (botão, card, tag/chip, acordeão, toolbar/navbar, breadcrumbs, inputs básicos), mapeando cada aspecto aos tokens app.* e à referência Cloudscape. Este documento guia a implementação futura; não criar código agora.

1) Princípios de design e acessibilidade
- Usa apenas tokens: cores, bordas, raios, tipografia, motion.
- Interações suaves: 120–250ms; respeitar prefers-reduced-motion.
- Acessibilidade: foco visível (2px, offset 2), navegação teclado, altura mínima 44px, contraste AA.
- Estados padronizados: default, hover, active, focus, disabled, selected, loading (quando aplicável).

2) Botão (Button)
- Tamanho e tipografia:
  - Altura mínima: 44px; Padding X: --app-space-m; Padding Y: --app-space-s
  - Fonte: .app-body-m (14/20/400) + weight semibold (600) para rótulo
  - Raio: --app-radius-l (8px)
  - Motion: --app-motion-duration-quick (120ms)
- Variantes (Cloudscape-alinhado):
  - Primary
    - bg: --app-color-primary; text: --app-color-primary-fg
    - hover: colorBackgroundButtonPrimaryHover (equivalente); active: ...PrimaryActive
    - focus: ring var(--color-ring) 2px, offset 2
    - disabled: reduzir motion e contraste adequado
  - Secondary
    - bg: colorBackgroundButtonSecondaryDefault; text: colorTextButtonSecondary
    - borda: colorBorderButtonNormal
  - Outline
    - bg: transparente; borda: --app-color-border; text: --app-color-fg
    - hover: leve bg colorBackgroundButtonSecondaryHover
  - Ghost
    - bg: transparente; sem borda; text: --app-color-fg
    - hover: bg sutil (muted)
  - Destrutivo (quando necessário)
    - bg: colorBackgroundButtonPrimaryDefault (danger palette equivalente); text: colorTextButtonPrimary
- Estados adicionais:
  - Loading: spinner 16px; cursor progress; aria-busy=true
  - Icon-only: largura/altura iguais; aria-label obrigatório

3) Card
- Container:
  - bg: --app-color-bg; border: 1px solid --app-color-border; radius: --app-radius-l
  - padding: --app-space-md (cards densos: --app-space-l)
  - sombra leve conforme tema
- Conteúdo:
  - Título: .app-h3 (18/22/700)
  - Texto: .app-body-m (14/20/400)
  - Ações (footer): spacing com --app-space-s; distribuição responsiva
- Estados:
  - Hover: shadow/motion sutis (120–180ms)
  - Focus: outline 2px + offset 2; tabindex para cards clicáveis

4) Tag/Chip
- Dimensões:
  - Raio: --app-radius-m (4px)
  - Altura: 28–32px; Padding X: --app-space-s
- Tipografia: .app-body-s (12/16/400)
- Paletas de estado (tokens Cloudscape equivalentes):
  - Neutral, Success, Info, Warning, Danger — bg/text/border mapeados aos tokens.
- Interação:
  - Dismissible opcional (ícone X com área acionável 32px²); aria-label.

5) Acordeão (FAQ base)
- Título:
  - .app-h4 (16/20/700; letter-spacing leve)
- Corpo:
  - .app-body-m
- Motion:
  - Expansão/colapso: --app-motion-duration-complex (≈250ms), ease padrão
- Acessibilidade:
  - aria-expanded, aria-controls; foco visível na tecla Tab; hit-area ≥ 44px
- Estados:
  - Hover/focus do cabeçalho com bg sutil (muted/50)

6) Toolbar/Navbar (header global)
- Estrutura:
  - Container com bg translucente ao rolar; shadow em scroll; backdrop blur
  - Itens de navegação com indicador de ativo (underline animado 120–180ms)
  - Ação destacada: “Próximo evento” com estilo Primário compactado
- Tipografia:
  - Links: .app-body-s; Botões: .app-body-m/600
- Tokens:
  - Padding X container: --app-space-md
  - Gutter entre itens: --app-space-l
- Acessibilidade:
  - Ativo com aria-current="page" quando em /events/current

7) Breadcrumbs (para EventTab quando necessário)
- Tipografia: .app-body-s
- Separador: “/” ou ícone com colorTextBreadcrumbsIcon
- Estados: hover com sublinhado sutil; foco visível
- Espaçamentos: entre itens --app-space-xs

8) Inputs básicos (forma de contato)
- Campos:
  - Altura mínima 44px; radius --app-radius-m; borda --app-color-border
  - Focus: ring var(--color-ring) 2px + border transparente
  - Tipografia: .app-body-m
- Labels:
  - .app-body-s; espaçamento label→campo --app-space-xs
- Mensagens de status:
  - success/warn/error mapeados para tokens; ícones opcionais

9) Estados de links
- Padrão:
  - colorLinkDefault; hover: colorLinkHover; underline animado (120ms)
  - Focus: outline 2px + offset 2; visited conforme política
- Botões como links (CTA principal na Home):
  - Usar estilo de botão primário mesmo em router-link

10) Padrões responsivos
- Grid 12-col; gutters via --app-grid-gutter
- Element queries em cards/FAQ para densidade; breakpoints Cloudscape
- Touch: hit-area ≥ 44px e espaçamentos S/M

Checklist de implementação (referência para PRs)
- Definir classes utilitárias futuras (.app-*) para h1–h5, body, display, code
- Converter componentes críticos (Button, Card, Tag, Accordion) para tokens
- Revisar estados e focos com tokens de cor e motion
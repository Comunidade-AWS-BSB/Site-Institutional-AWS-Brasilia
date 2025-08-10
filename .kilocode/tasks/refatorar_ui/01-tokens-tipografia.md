# 01 — Tokens app.* e Tipografia

Objetivo
Definir a camada de tokens app.* alinhada ao Cloudscape (referência), substituindo famílias de fonte e consolidando a escala tipográfica, espaçamentos, raios e motion para uso global. Não implementar código agora; este documento orienta PRs.

1) Fundamentos e estratégia
- Prefixo: --app-* (CSS) e app.* (TS) para consumo em estilos/JS.
- Referência: nomenclatura Cloudscape (@cloudscape-design/design-tokens), sem dependência obrigatória.
- Fontes confirmadas: Space Grotesk (base; pesos 300/400/600/700) e Iki Mono (monospace) via CDN (Google Fonts).
- Consumo:
  - CSS: variáveis em :root e tema dark; utilitários Tailwind e estilos globais.
  - TS: constants (app.*) p/ casos específicos (ex.: estilos inline, animações).

2) Tipografia (escala, pesos, famílias)
- Famílias
  - app.fontFamilyBase → 'Space Grotesk', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif
  - app.fontFamilyMono → 'Iki Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace
- Pesos
  - app.fontWeight.light = 300
  - app.fontWeight.regular = 400
  - app.fontWeight.semibold = 600
  - app.fontWeight.bold = 700
- Escalas (px)
  - Headings
    - XL: 24/30/700
    - L: 20/24/700
    - M: 18/22/700
    - S: 16/20/700 (+ letter-spacing 0.15px)
    - XS: 14/18/700 (+ letter-spacing 0.2px)
  - Corpo
    - Body M: 14/20/400
    - Body S: 12/16/400
  - Display
    - Display L Bold: 42/48/700
    - Display L Light: 42/48/300
  - Código
    - Inline: 12/16/400 (Iki Mono)
    - Pre: 14/20/400 (Iki Mono)
- Mapeamento para Cloudscape (referencial)
  - app.fontSize.heading.* → awsui.fontSizeHeading(XL|L|M|S|XS)
  - app.fontSize.body.* → awsui.fontSizeBody(M|S)
  - app.fontSize.display.l → awsui.fontSizeDisplayL
  - app.fontFamilyBase/Mono → awsui.fontFamilyBase/Monospace

3) Espaçamento e grid
- Escala (4 px)
  - XXS=2, XS=4, S=8, M=12, MD=16, L=20, XL=24, XXL=32, XXXL=40
- Grid
  - 12 colunas; gutter = 20 (L); paddings padrão de containers/cards: MD=16 e L=20 conforme densidade.
- Variáveis recomendadas
  - --app-space-xxs: 2px; --app-space-xs: 4px; --app-space-s: 8px
  - --app-space-m: 12px; --app-space-md: 16px; --app-space-l: 20px
  - --app-space-xl: 24px; --app-space-xxl: 32px; --app-space-xxxl: 40px
  - --app-grid-gutter: var(--app-space-l)
  - --app-container-padding: var(--app-space-md)

4) Bordas e raios
- --app-radius-m: 4px (inputs, chips, tags)
- --app-radius-l: 8px (cards, modais, banners)
- --app-border-color: alinhado a colorBorderDividerDefault (mapear via camada de cores app.*)

5) Motion
- --app-motion-duration-quick: 120ms
- --app-motion-duration-complex: 250ms
- --app-motion-duration-disabled: 0ms (quando prefers-reduced-motion)
- --app-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1)
- Política de acessibilidade: respeitar prefers-reduced-motion em animações.

6) Cores (princípios)
- Usar apenas tokens orbitando Cloudscape (sem hex diretos).
- Mapear tema atual para app.*:
  - --app-color-bg ↔ colorBackgroundContainerDefault (usa --color-background enquanto migra)
  - --app-color-fg ↔ colorTextBodyDefault (usa --color-foreground)
  - --app-color-primary ↔ colorBackgroundButtonPrimaryDefault (usa --color-primary)
  - --app-color-primary-fg ↔ colorTextButtonPrimary (usa --color-primary-foreground)
  - --app-color-border ↔ colorBorderDividerDefault (usa --color-border)
- Futuro: estados (success/info/warn/danger) mapeados a tokens Cloudscape equivalentes.

7) Classes utilitárias recomendadas (para implementação futura)
- .app-h1/h2/h3/h4/h5 com escala acima e letter-spacing em S/XS.
- .app-body-m / .app-body-s
- .app-display-l / .app-display-l--light
- .app-code-inline / .app-pre

8) Breakpoints e layouts
- Seguir Cloudscape; usar element queries em componentes densos (acordeões, cards) quando possível.

9) Ações para PR1 (fundações)
- Incluir fontes via CDN (Space Grotesk, Iki Mono) no index.html.
- Criar tokens.css com todas as --app-* (tema claro/escuro).
- Criar tokens.ts com app.* constants.
- Substituir fonte base global: body → Space Grotesk.
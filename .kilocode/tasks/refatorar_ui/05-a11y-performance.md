# 05 — Acessibilidade e Performance

Objetivo
Definir padrões mínimos AA de acessibilidade e práticas de performance para a refatoração da UI (Home, EventTab, Lojinha), alinhados aos tokens app.* e princípios Cloudscape. Documento guia para execução posterior; não criar código agora.

1) Acessibilidade (WCAG 2.1 AA)
- Contraste
  - Texto normal ≥ 4.5:1; títulos grandes (≥ 24px bold) ≥ 3:1.
  - Revisar usos de text-muted-foreground para garantir contraste suficiente em ambos os temas (claro/escuro).
- Teclado
  - Navegação por Tab em toda a interface; ordem lógica; elementos interativos com tabindex e roles apropriados.
  - Evitar traps de foco (ex.: modais/lightbox); ESC fecha; foco retorna ao gatilho.
- Foco visível
  - Outline de 2px (var(--color-ring)) com offset 2px. Aplicável em: links, botões, inputs, cards acionáveis.
- Áreas de clique
  - Altura mínima 44px; espaçamento horizontal adequado (gutter/gap).
- Semântica e ARIA
  - Heading hierarchy consistente (h1–h5).
  - Acordeões: aria-expanded, aria-controls; botões com aria-label quando ícone-only.
  - Banners e status: roles apropriados (status/alert quando necessário).
- Mídia
  - Imagens com alt significativo; decorativas com alt="".
  - iframes de mapa: title informativo e fallback adequado.
- Formulários
  - Labels explícitas; mensagens de erro/sucesso anunciáveis; inputs com autocomplete (quando aplicável).
- Redução de movimento
  - Suportar prefers-reduced-motion: transições reduzidas (0–50ms) ou desativadas.
- Internacionalização
  - Evitar concatenação de strings; preparar para futuras traduções (semântica neutra).

2) Performance
- Imagens
  - Lazy-load (loading="lazy"); formatos otimizados (jpg/webp) no futuro; dimensionamento responsivo.
  - Galerias: paginar/lazy; lightbox com carregamento sob demanda.
- Scripts e CSS
  - Carregar fontes via CDN com display=swap; minimizar reflows por trocas de fonte.
  - CSS crítico enxuto; tokens app.* em CSS vars (contidos no primeiro paint).
- Iframes e embeds
  - Defer/lazy para mapas; placeholder até interação/viewport.
- Tailwind e utilitários
  - Reuso de utilitários e classes; evitar estilos duplicados.
- Layout
  - Grid 12 col com gutters fixos; evitar “layout shifts” (CLS) reservando espaço para mídias/iframes.
- Caching
  - Cabeçalhos de cache para assets estáticos (fora do escopo deste repositório, mas recomendado no deploy).
- Auditorias
  - Lighthouse: checar Performance, Acessibility, Best Practices; ajustar regressões em cada PR.

3) Checklist transversal por página
- Home
  - Hero e NextEvent: CTAs com foco visível e labels claras.
  - Palestrantes: imagens com alt; cards com tabindex (se clicáveis).
  - Galeria: lazy-load; lightbox fechável com ESC; foco retorna ao gatilho.
  - FAQ: acordeões com aria-* e transições respeitando prefers-reduced-motion.
  - Contatos: remover endereço; inputs com labels e feedback de status; altura ≥ 44px.
- EventTab
  - Header: badge de status com descrição acessível; CTAs com aria-label.
  - Local: iframe com title; informação textual redundante ao mapa.
  - Programação: horários em .app-code-inline; leitura clara por leitores de tela.
- Lojinha
  - Cards de produto: nomes/títulos claros; CTAs informativos (WhatsApp/contato).
  - Imagens com alt e dimensões reservadas.

4) Tokens e variáveis a usar
- Motion: --app-motion-duration-quick/compex/disabled; aplicar mídia prefers-reduced-motion.
- Raios: --app-radius-m/l; consistente entre componentes.
- Bordas/cores: usar app.*; evitar hex “soltos”.
- Tipografia: classes .app-* para escala e legibilidade.

5) Riscos e mitigação
- Contraste insuficiente em dark mode: revisão manual + paleta ajustada via tokens.
- Foco invisível em componentes customizados: padronizar outline global.
- CLS por imagens: reservar dimensões; lazy-load com placeholders.
- Mapas pesados: lazy iframe; fallback textual.

6) Critérios de aceite (a11y/perf)
- Acessibilidade
  - Foco visível em todos interativos; navegação teclado funcional; aria-* correto nos padrões.
  - Contraste AA em conteúdos principais e CTAs.
- Performance
  - Imagens lazy; fontes com swap; seções pesadas só após interação/viewport.
  - Lighthouse Acessibility ≥ 90; Performance ≥ 80 (meta inicial).
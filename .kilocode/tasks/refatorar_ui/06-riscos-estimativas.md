# 06 — Estimativas e Riscos

Objetivo
Consolidar estimativas por PR, principais riscos e respectivas mitigações, para execução segura e previsível da refatoração.

Resumo de esforço por PR
- PR1 — Fundamentos (tokens + fontes): 4–6h
- PR2 — Rotas e Header: 3–4h
- PR3 — Reestruturação da Home: 8–12h
- PR4 — EventTab (/events/current): 12–16h
- PR5 — Lojinha (/store): 6–8h
- PR6 — Acessibilidade e Performance: 6–10h
- PR7 — Polimento visual cloud-native: 4–8h

Total estimado: 43–64h

Premissas
- Sem integrações backend novas na fase inicial; EventTab com dados estáticos/mocks.
- Fontes via CDN (Space Grotesk e Iki Mono).
- Sem mudanças profundas no build (Vite/Tailwind) além de tokens.

Riscos principais e mitigação
1) Regressão tipográfica após PR1
- Risco: mudanças de família e métricas provocam “layout shifts”.
- Mitigação: display=swap nas fontes; smoke-test visual; ajuste de line-height conforme tokens; validação em dark/light.

2) Links quebrados e navegação inconsistente (PR2–PR3)
- Risco: remoção de âncoras (#schedule/#buy-tickets/#venue) e rotas novas.
- Mitigação: revisão de todos os CTAs/links; aria-current no header; changelog no PR.

3) Aumento de densidade visual sem contraste suficiente (Dark Mode)
- Risco: textos secundários (muted) com contraste insuficiente.
- Mitigação: auditoria de contraste por página; ajuste de tokens; teste com Lighthouse.

4) Performance degradada por iframes/galerias (PR4)
- Risco: mapa e imagens impactam LCP/CLS.
- Mitigação: lazy-load; placeholders; dimensionamento reservado; deferral de iframe até interação/viewport.

5) Acessibilidade insuficiente nos novos CTAs e acordeões
- Risco: foco invisível, aria-* ausentes, navegação por teclado comprometida.
- Mitigação: checklist a11y por PR; testes manuais com teclado; roles/aria-explicitados.

6) Divergências visuais por falta de mockups consolidados
- Risco: inconsistências de cor, sombra e raios entre seções.
- Mitigação: documento de tokens unificado; wireframes anotados; validação de UI antes do merge.

7) Dependência de conteúdo (copy) para o novo Hero
- Risco: bloqueio por falta de copy final.
- Mitigação: usar versão condensada a partir do FAQ; flag para ajustes após revisão.

Critérios de aceite por PR (resumo)
- PR1: tokens carregados, fontes ativas, sem perda de legibilidade; smoke-test OK.
- PR2: navegação íntegra; “Próximo evento” destacado e ativo em /events/current.
- PR3: Home na nova ordem; sem Agenda/Ingressos/Venue; NextEventSection simples; Contato sem endereço.
- PR4: EventTab com seções requeridas e CTAs corretos (“Inscrever-se”, “Compartilhar”), sem linguagem de compra.
- PR5: Lojinha com “Kit Camisa” como produto; CTAs de contato; sem vinculação a ingressos.
- PR6: A11y mínimo AA; prefers-reduced-motion respeitado; imagens lazy.
- PR7: Polimento de gradientes, sombras, raios e estados; consistência visual.

Marcos e checkpoints
- M1 (após PR2): arquitetura pronta para telas novas e navegação
- M2 (após PR4): EventTab funcional
- M3 (após PR5): Home final e Lojinha no ar
- M4 (após PR6/PR7): estabilização de a11y/perf/visual

Observações finais
- Manter PRs pequenos e descritivos, com screenshots antes/depois.
- Registrar decisões de design no diretório de tarefas e vincular aos PRs.
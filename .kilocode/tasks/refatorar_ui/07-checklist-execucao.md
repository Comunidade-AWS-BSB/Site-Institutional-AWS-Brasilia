# 07 — Checklist de Execução por PR (Definition of Done)

Objetivo
Acompanhar execução dos PRs com itens verificáveis, screenshots esperados e validações mínimas (a11y/perf). Este documento será atualizado durante a execução. Não criar código agora.

Guia de uso
- Marque cada item antes de solicitar revisão.
- Anexe screenshots “antes/depois” e, quando aplicável, saída do Lighthouse.

PR1 — Fundamentos (tokens + fontes)
DoD
- [ ] Space Grotesk (300/400/600/700) e Iki Mono carregadas via CDN (display=swap).
- [ ] tokens.css criado com variáveis --app-* (tipografia, espaçamentos, raios, motion, cores-base).
- [ ] tokens.ts criado com constants app.*.
- [ ] Body e headings usando Space Grotesk (sem regressões graves).
- [ ] Tema dark continua legível (contraste mínimo AA em headings/body).
- [ ] Smoke test (Home): sem quebra de layout notória.

Evidências
- [ ] Screenshot Home (topo) — claro/escuro.
- [ ] Trechos de CSS (variáveis criadas) e logs de carregamento de fontes.

PR2 — Rotas e Header
DoD
- [ ] /events/current e /store adicionadas ao router.
- [ ] Header: item “Próximo evento” com destaque primário e aria-current em rota ativa.
- [ ] Removido botão “Comprar Ingressos” e referências a #buy-tickets.
- [ ] Navegação testada em desktop/mobile.

Evidências
- [ ] Screenshot Header (rota Home e /events/current).
- [ ] GIF curto de navegação mobile (menu abre/fecha).

PR3 — Reestruturação da Home
DoD
- [ ] Antigo Hero renomeado para NextEventSection e simplificado (título, data, breve descrição, CTA “Ver próximo evento”).
- [ ] Novo HeroSection (comunidade) com copy derivada da FAQ; com CTA primário “Conheça a comunidade” (#faq) e secundário “Próximo evento” (/events/current).
- [ ] Removidos da Home: ScheduleSection (Agenda), BuyTicketsSection (Ingressos), VenueSection (Local).
- [ ] ContactSection sem endereço/mapa; manter e-mail/redes/formulário simples.
- [ ] Ordem final aplicada conforme plano.

Evidências
- [ ] Screenshots Home completo (acima da dobra; lista de seções).
- [ ] Trechos da copy usada no novo Hero.

PR4 — EventTab (/events/current)
DoD
- [ ] Header da página com título, data, status (badge), CTA “Inscrever-se” (gratuito), “Compartilhar”.
- [ ] Seção Local (mapa + info essencial) com iframe acessível (title).
- [ ] Galeria do local (lazy-load).
- [ ] Programação básica (lista simples com horários).
- [ ] Regras/conduta e Acessibilidade.
- [ ] Estrutura preparada para dados dinâmicos (mock service/props).

Evidências
- [ ] Screenshots de cada seção.
- [ ] Vídeo/GIF navegando pelas seções.
- [ ] JSON/mock exibido no PR.

PR5 — Lojinha (/store)
DoD
- [ ] Grid de produtos (ex.: “Kit Camisa”) com card (imagem, nome, descrição, CTA WhatsApp/contato).
- [ ] Sem associação a ingressos/pagamentos da Home.
- [ ] Responsividade em 2–3 colunas.

Evidências
- [ ] Screenshot da Lojinha (desktop e mobile).
- [ ] Demonstração do CTA de contato.

PR6 — Acessibilidade e Performance
DoD
- [ ] prefers-reduced-motion aplicado (0–50ms).
- [ ] Foco visível consistente em links/botões/inputs.
- [ ] Contraste AA em textos principais/CTAs.
- [ ] Imagens com loading="lazy", tamanhos reservados, iframes com lazy/placeholder.
- [ ] Lighthouse: Acessibility ≥ 90; Performance ≥ 80 (meta inicial).

Evidências
- [ ] Relatório Lighthouse (screenshots do resumo).
- [ ] Vídeo com navegação por teclado (Tab/Shift+Tab).

PR7 — Polimento Visual
DoD
- [ ] Gradientes suaves aplicados (Hero novo/banners).
- [ ] Sombras e radius consistentes (—app-radius-l em cards; —app-radius-m em inputs/tags).
- [ ] Estados hover/focus/active padronizados com tokens (cores e motion).
- [ ] Revisão final de espaçamentos (—app-space-*).

Evidências
- [ ] Antes/depois comparativo de 3 componentes (Botão, Card, Acordeão).
- [ ] Checklist de inconsistências resolvidas.

Checklist transversal (todas as entregas)
- [ ] Sem hex “soltos” em estilos novos; apenas tokens/variáveis.
- [ ] Altura de interação ≥ 44px; foco visível; aria-* correto.
- [ ] Copy sem linguagem de “compra” para eventos (apenas “Inscrever-se”).
- [ ] CTAs “Ver próximo evento” sempre apontando para /events/current.
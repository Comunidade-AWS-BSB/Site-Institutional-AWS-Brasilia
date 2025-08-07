# Refatoração de UI — Plano Diretor

Status geral: planejamento centralizado. Não crie código a partir destes documentos; servem como base de execução em PRs.

Rotas confirmadas
- /events/current — EventTab (destaque no header, CTA principais apontam para aqui)
- /store — Lojinha (migrar “Kit Camisa”)
- CTA “Ver próximo evento” aponta para /events/current
- Fontes via CDN (Google Fonts): Space Grotesk (300/400/600/700) e Iki Mono

Ordem final da Home
1) HeroSection (novo, foco na comunidade)
2) NextEventSection (antigo Hero simplificado)
3) Palestrantes
4) Galeria
5) Patrocinadores
6) FAQ
7) Contatos (sem endereço)

Seções a remover/alterar
- Remover Agenda de Eventos da Home (ScheduleSection)
- Remover BuyTicketsSection da Home (usar EventTab e Lojinha)
- VenueSection: conteúdo migra para EventTab
- Header: incluir “Próximo evento” destacado; remover “Comprar Ingressos”
- Contato: não solicitar/exibir endereço na Home

Documentos deste diretório
- 01-tokens-tipografia.md — Tokens app.* e tipografia
- 02-componentes-estados.md — Estados de interação e padrões de componentes
- 03-wireframes.md — Wireframes anotados (Home, EventTab, Lojinha)
- 04-migracao-PRs.md — Plano de migração por etapas (PRs)
- 05-a11y-performance.md — Acessibilidade e performance
- 06-riscos-estimativas.md — Estimativas e riscos

Critérios de aceite
- Home reordenada; CTAs corretos (sem “Comprar Ingressos”)
- Header com destaque “Próximo evento”
- EventTab funcional (inscrição gratuita; local/galeria/programação)
- Tokens aplicados globalmente (Space Grotesk e Iki Mono em uso)
- Acessibilidade básica validada e responsividade
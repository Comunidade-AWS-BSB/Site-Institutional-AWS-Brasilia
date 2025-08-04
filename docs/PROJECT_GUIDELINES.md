# Diretrizes de Código e IA (`rules.md`)

Estas regras servem como referência para **qualquer código gerado manualmente ou auxiliado por IA** dentro deste projeto.

## Índice

1. Boas Práticas Gerais
2. Padrões de Design e Arquitetura
3. Object Calisthenics
4. Clean Architecture & DDD
5. Convenções de Código
6. Diretrizes de Testes (Vitest – Futuro)

---

## 1. Boas Práticas Gerais

* **Leia‑me primeiro**: entenda o requisito antes de escrever código.
* **Pequenos commits atômicos**: 1 mudança conceitual por commit.
* **Refatoração contínua**: aplique *boy‑scout rule* – sempre deixe o código melhor.
* **Documente a *intenção*** em inglês e mantenha comentários enxutos.

## 2. Padrões de Design e Arquitetura

### SOLID

| Princípio                 | Aplicação prática                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **S**ingle Responsibility | Cada componente Vue, service ou store tem um motivo único de mudança.                          |
| **O**pen/Closed           | Adicione novos *features* via composição ou extensão, nunca modificando excessivamente o core. |
| **L**iskov Substitution   | Componentes UI (por ex. botões shadcn) devem manter contratos de acessibilidade.               |
| **I**nterface Segregation | Separe interfaces de APIs (Axios) por domínio.                                                 |
| **D**ependency Inversion  | Injete dependências (ex.: repositórios) via *provide/inject* ou fábricas.                      |

### Clean Code Essentials

* Nomes claros e descritivos.
* Funções ≤ 20 linhas; classes ≤ 200 linhas.
* Sem comentários redundantes; código deve ser auto‑explicativo.

## 3. Object Calisthenics

1. **Um nível de indentação por método** – use *early returns* para evitar *deep nesting*.
2. **Não use else** – obrigue fluxos lineares.
3. **Envie mensagens, não receba** – evite getters de data objects.
4. **Primeiro objeto**: evite tipos primitivos crus; preferir *Value Objects*.
5. **Coleções ficam no objeto** – encapsule arrays.
6. **Um Dot por linha** – limite acoplamento.
7. **Sem classes com mais de duas variáveis de instância**.
8. **Sem getters/setters** expostos; use métodos expressivos.

> **Observação**: regras podem ser relaxadas quando a simplicidade supera o formalismo.

## 4. Clean Architecture & Domain‑Driven Design (`rules.md`)

Estas diretrizes definem **como organizar código, pastas e fronteiras** do projeto, garantindo baixo acoplamento, alta coesão e evolutividade.

1. Estrutura de Pastas

```
├── src/
│   ├── views/        # Páginas e layouts ligados às rotas
│   ├── components/   # Componentes reutilizáveis e atômicos (shadcn-vue)
│   ├── domain/       # Entidades, Value Objects, Use‑cases, Interfaces
│   └── stores/       # Pinia stores (parte da camada de Presentation)
└── amplify/          # Infraestrutura (Auth, Data etc.) gerada pelo Amplify Gen 2
```

* **Views** rendem fluxos completos de UI e orquestram *use‑cases*.
* **Components** são puros, isolados e focados em UI.
* **Domain** não conhece Vue, Axios ou Amplify — contém apenas lógica de negócio.
* **Amplify** representa a camada mais externa (Infrastructure) e nunca deve ser importada diretamente no *domain* (mas o contrário pode acontecer).

2. Camadas & Dependências

| Camada             | Pasta(s)                                | Pode depender de        | Não pode depender de  |
| ------------------ | --------------------------------------- | ----------------------- | --------------------- |
| **Presentation**   | `views/`, `components/`, `stores/`      | Domain                  | Amplify infra direta  |
| **Application**    | `domain/usecases`                       | Domain                  | Presentation          |
| **Domain**         | `domain/`                               | —                       | Presentation, Amplify |
| **Infrastructure** | `amplify/`, adaptadores em `src/infra/` | Domain (por interfaces) | —                     |

> **Regra de Dependência**: o fluxo de dependências é sempre de fora → dentro; código interno não conhece detalhes externos.

3. Princípios Essenciais

* **SOLID**: aplique SRP, OCP, LSP, ISP, DIP em todas as camadas.
* **Object Calisthenics** (versão enxuta):

  1. Um nível de indentação por método – use *early returns*.
  2. Evite `else`, prefira fluxo linear.
  3. Use *Value Objects* em vez de primitivos.
  4. Encapsule coleções.
* **Clean Code**: nomes claros, funções ≤ 20 linhas, classes ≤ 200 linhas, sem comentários redundantes.
* **Switch‑case** preferível a cascatas de `if/else` para enums.

## 4. Qualidade Automatizada

* **Type‑check**: `npm run type-check` (executa `vue-tsc --noEmit`).
* **Lint**: `npm run lint` (ESLint + Prettier).
* Commits devem passar ambos os comandos antes do push (Husky pre‑commit recomendado).
* Cobertura de testes com Vitest (**meta futura**) ≥ 80 % global.

---

> Mantenha estas regras à vista durante revisões de código e geração automática por IA.

## 5. Diretrizes de Testes (Vitest – Futuro)

| Área                     | Meta de Cobertura |
| ------------------------ | ----------------- |
| Domain Entities          | ≥ 90%             |
| Application Use‑Cases    | ≥ 80%             |
| Vue Components (shallow) | ≥ 70%             |

* **AAA pattern** (Arrange‑Act‑Assert).
* Use **test doubles** (mocks/stubs) somente para fronteiras externas.
* Cada PR deve incluir novos testes ou explicar em comentário por que não.
* Pipeline CI falha se cobertura global < 80%.

---

> **Última revisão:** 03/08/2025

# Site-Institutional-AWS-Brasilia

Este é o site institucional da Comunidade AWS de Brasília, construído em colaboração com a comunidade local para centralizar informações sobre nossa área de atuação em cloud computing.

---

## Objetivo

* Criar um hub digital para **eventos**, **artigos técnicos** e **histórias de sucesso**.
* Fortalecer o **engajamento** e a **visibilidade** da comunidade local.
* Servir como ponto único de **referência** para nossos membros e visitantes.

---

## Tecnologias & Infraestrutura

| Camada             | Ferramentas & Serviços                                         |
| ------------------ | -------------------------------------------------------------- |
| **Front-end**      | Vue 3 + TypeScript, Pinia, Vue Router                          |
| **Estilos**        | TailwindCSS 4 + `@tailwindcss/vite`                            |
| **UI Components**  | shadcn-vue CLI, aws-amplify/ui-vue                             |
| **HTTP Client**    | Axios                                                          |
| **Backend**        | AWS Amplify Gen 2 (Auth, Data, Storage)                        |
| **Banco de Dados** | DynamoDB (via Amplify Data)                                    |
| **Armazenamento**  | S3 (para assets de eventos, palestrantes e galeria de imagens) |
| **Infraestrutura** | AWS CDK via Amplify (provisionamento automatizado)             |
| **Automação**      | n8n + Evolution API (WhatsApp notifications)                   |
| **Chatbot IA**     | Gemini API (futuro Bedrock/SageMaker)                          |

---

## Estrutura do Repositório

```
.
├── amplify/                  # Backend (code-first): auth/ e data/
│   ├── auth/
│   └── data/
├── docs/                     # Documentação (stack, regras, modelagem)
├── public/                   # Arquivos estáticos servidos “as-is”
│   └── img/
│       ├── clients/
│       ├── event-gallery/
│       ├── speakers/
│       └── venue-gallery/
└── src/
    ├── __tests__/            # (futuro) testes unitários
    ├── assets/               # CSS de entrada e outros assets
    ├── components/           # Componentes Vue
    │   ├── sections/
    │   ├── shared/
    │   └── ui/button/
    ├── lib/                  # Inicializações (amplify.ts, http.ts)
    ├── router/               # Definição de rotas (apenas Vue Router básico)
    ├── stores/               # Pinia stores
    └── views/                # Views/Pages
```

---

## Como Iniciar

1. **Instalar dependências**

   ```bash
   npm install
   ```
2. **Configurar AWS CLI**

   ```bash
   aws configure
   ```
3. **Sincronizar backend local**

   ```bash
   npx ampx pull --sandbox
   ```
4. **Executar em modo de desenvolvimento**

   ```bash
   npm run dev
   ```
5. **Acessar**
   Abra [http://localhost:5173](http://localhost:5173) no navegador.

---

## Próximos Passos

* Provisionar **Autenticação** (Amplify Gen 2 + Cognito)
* Modelar e implementar **Eventos** & **Palestrantes**
* Criar **Blog** e sistema de **Comentários**
* Integrar **Chatbot IA** e **Notificações via WhatsApp**
* Refinar **Infraestrutura** via AWS CDK

> **Obs.**: Todas as atividades estão detalhadas em `docs/` e nas issues em `/issues`.

---

## Contribuição

1. Abra uma **issue** em `/issues`.
2. Faça um **fork** e crie uma **branch** `feature/xxx`.
3. Implemente o código e, se possível, escreva testes.
4. Envie um **pull request** referenciando a issue correspondente.

---

## Licença

MIT © Grupo de Usuários AWS Brasília

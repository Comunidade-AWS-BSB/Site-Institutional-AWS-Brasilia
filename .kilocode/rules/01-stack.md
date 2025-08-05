# Tech Stack Overview

Este projeto utiliza um **monorepo leve** onde o front‑end em Vue 3 conversa com um back‑end *code‑first* gerado pelo **AWS Amplify Gen 2**. O objetivo é entregar uma UX moderna, componentes reutilizáveis e um back‑end gerenciado que escale sem dor de cabeça.

> **Principais dependências**
>
> * **Vue 3** + Composition API.
> * **Pinia** para estado global.
> * **TailwindCSS 4** com o **@tailwindcss/vite** plugin.
> * **AWS Amplify Gen 2** (CLI + Backend SDK).
> * **Axios** para chamadas HTTP.
> * **shadcn‑vue CLI** para componentes estilizados.
> * **aws‑amplify/ui‑vue** para componentes Auth/UI prontos.

---

## 1. Scaffold do Projeto Vue 3

```bash
# Cria o projeto com template TypeScript
npm create vue@latest
# ✓ Add TypeScript      → Yes
# ✓ Add Pinia           → Yes
# ✓ Add Vue Router      → Yes
# ✓ Add Vitest          → Yes (não utilizado por enquanto)
# ✓ Add Cypress         → No
# ✓ Add ESLint + Prettier → Yes
cd <project-name>
```

### Registro do Pinia

No `main.ts`:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

---

## 2. TailwindCSS 4

Tailwind 4 simplificou a instalação: basta o core + plugin para Vite — **não é necessário PostCSS nem Autoprefixer manualmente**.

### Instalação

```bash
npm install -D tailwindcss@latest @tailwindcss/vite@latest
npx tailwindcss init
```

### Plugin no Vite

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

### Import no CSS

Crie `src/assets/main.css` (ou similar):

```css
@import "tailwindcss";
```

E importe no `main.ts`:

```ts
import './assets/main.css'
```

---

## 3. AWS Amplify Gen 2 (Backend *code‑first*)

### Bootstrap rápido

```bash
# Cria o backend (pasta atual)
npm create amplify@latest
# Escolha "Vue" quando solicitado
```

Isto gera a pasta **amplify/** com:

```
amplify/
  ├── auth/resource.ts      # Configurações de Cognito
  ├── data/resource.ts      # Esquema GraphQL/DataStore
  ├── backend.ts            # Orquestrador
  └── tsconfig.json
```

Para sandbox local:

```bash
npx ampx sandbox
```

Para implantar:

```bash
npx ampx deploy
```

### Cliente no Front‑end

```bash
npm install aws-amplify @aws-amplify/ui-vue
```

```ts
// src/lib/amplify.ts
import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
Amplify.configure(outputs)
```

---

## 4. Axios Singleton

```bash
npm install axios
```

`src/lib/http.ts`:

```ts
import axios from 'axios'
export const http = axios.create({ baseURL: '/api' })
```

---

## 5. shadcn‑vue CLI

```bash
npx shadcn-vue@latest init
# Depois adicione componentes:
npx shadcn-vue add button
```

---

## 6. Requisitos de Versão

```text
Node             >= 20.x
npm / pnpm       >= 10 / 9
Vue              ^3.4.0
Pinia            ^2.1.0
TailwindCSS      ^4.1.0
@tailwindcss/vite^0.2.x
Amplify Backend  ^2.x (Gen 2)
aws-amplify      ^6.x
axios            ^1.6.x
```

---

## 7. Cheatsheet de Scaffold

```bash
# Vue + Pinia + Router + ESLint
npm create vue@latest

# Tailwind 4
npm i -D tailwindcss @tailwindcss/vite
npx tailwindcss init

# Amplify Gen 2 Backend
npm create amplify@latest
npx ampx sandbox   # backend local
npx ampx deploy    # deploy AWS

# UI & Axios
npm i aws-amplify @aws-amplify/ui-vue axios
npx shadcn-vue@latest init
```

> Consulte [as diretrizes do projeto](PROJECT_GUIDELINES.md) para convenções de código e [a lista inicial de requisitos](TASK_SET_001.MD) para as primeiras tarefas de autenticação.

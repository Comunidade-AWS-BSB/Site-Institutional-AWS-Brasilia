# Task Set 001 – Configurar Autenticação (Amplify Gen 2 + Cognito + Vue 3)

Este conjunto de tarefas assume que o projeto Vue 3 já foi criado conforme o `docs/STACK.md` e que todas as dependências básicas estão instaladas. O objetivo é **habilitar login e registro** usando Amazon Cognito através do Amplify Gen 2 e integrar o fluxo de UI no front‑end.

## Visão Geral

1. Criar/editar o recurso **Auth** no backend (*code‑first*).
2. Provisionar (ou atualizar) a infraestrutura.
3. Conectar o front‑end ao backend.
4. Adicionar componentes de autenticação da UI.
5. Proteger rotas.

---

## 1 – Recurso de Autenticação (backend)

### 1.1 Adicionar via CLI

```bash
# Na raiz do repositório
npx ampx add auth
# Escolha "Username + Email" (recomendado)
```

Isso cria `amplify/auth/resource.ts`. Caso o arquivo já exista, revise conforme abaixo.

### 1.2 Definição *code‑first*

```ts
// amplify/auth/resource.ts
import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: { username: true, email: true },
  passwordProtection: {
    minLength: 8,
    requireNumbers: true,
    requireLowercase: true,
    requireUppercase: true,
    requireSymbols: false,
  },
  // Provedores externos opcionais
  externalProviders: {
    // Descomente quando configurar no Console Google Cloud
    // google: {
    //   clientId: '<GOOGLE_CLIENT_ID>',
    //   clientSecret: secret('GOOGLE_CLIENT_SECRET'),
    // },
  },
});
```

---

## 2 – Provisionar Backend

```bash
# Teste local (sandbox)
npx ampx sandbox
# ou implante direto na AWS
echo "Deploying…" && npx ampx deploy
```

A execução gera/atualiza `amplify_outputs.json` na raiz com as configurações do User Pool & App Client.

---

## 3 – Configurar Amplify no Front‑end

```bash
npm i aws-amplify @aws-amplify/ui-vue
```

`src/lib/amplify.ts`:

```ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

Importe este arquivo em `main.ts` **antes** de montar a aplicação:

```ts
import './lib/amplify';
app.mount('#app');
```

---

## 4 – UI de Autenticação

No componente raiz (ex.: `App.vue`):

```vue
<script setup lang="ts">
import '@aws-amplify/ui-vue/styles.css';
import { Authenticator } from '@aws-amplify/ui-vue';
</script>

<template>
  <!-- Exibe login/register quando não autenticado -->
  <Authenticator initial-state="signIn">
    <router-view />
  </Authenticator>
</template>
```

Personalizações de tema podem ser feitas através dos tokens CSS custom properties do Amplify UI.

---

## 5 – Proteção de Rotas (Vue Router 4)

```ts
// router/index.ts
import { getCurrentUser } from 'aws-amplify/auth';

router.beforeEach(async (to) => {
  const user = await getCurrentUser().catch(() => null);
  if (to.meta.protected && !user) {
    return { name: 'login' };
  }
});
```

Defina nas rotas:

```ts
{
  path: '/dashboard',
  name: 'dashboard',
  component: () => import('@/views/DashboardView.vue'),
  meta: { protected: true },
}
```

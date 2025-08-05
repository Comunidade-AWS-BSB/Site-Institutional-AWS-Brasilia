# Guia de Migração: HTML Estático para Vue.js + TailwindCSS

## 1. Visão Geral

Este documento detalha o processo de migração do site estático para uma aplicação moderna baseada em Vue.js 3, com TailwindCSS para estilização e uma arquitetura de componentes baseada em princípios de *Clean Architecture*.

O objetivo é transformar cada seção do site estático em um componente Vue reutilizável e desacoplado, utilizando os **Design Tokens** definidos em `docs/design-system.md`.

## 2. Estrutura de Componentes

A estrutura de componentes planejada é a seguinte:

```
src/
├── views/
│   ├── HomeView.vue
│   └── SpeakerDetailView.vue
├── layouts/
│   └── DefaultLayout.vue
├── components/
│   ├── sections/
│   │   ├── HeroSection.vue, SpeakersSection.vue, ScheduleSection.vue, etc.
│   ├── shared/
│   │   ├── TheHeader.vue, TheFooter.vue, SpeakerCard.vue, etc.
│   └── ui/
│       └── (Gerenciado por shadcn-vue: Button, Card, Tabs, etc.)
```

---

## 3. Utilizando shadcn-vue para Componentes de UI

A pasta `src/components/ui` será gerenciada pela CLI do `shadcn-vue`. Esta ferramenta nos permite adicionar componentes de UI desacoplados e totalmente personalizáveis diretamente ao nosso projeto.

**Guia Rápido da CLI:**

1.  **Inicialização (já realizada no setup do projeto):**
    ```bash
    npx shadcn-vue@latest init
    ```

2.  **Adicionando novos componentes:**
    ```bash
    # Exemplo: Adicionar um componente de Botão
    npx shadcn-vue@latest add button

    # Exemplo: Adicionar um Card
    npx shadcn-vue@latest add card
    ```
Isso irá popular a pasta `src/components/ui` com os arquivos `.vue` necessários, que podem então ser importados e usados em toda a aplicação.

---

## 4. Guia Detalhado por Componente

### 4.1. `DefaultLayout.vue`

*   **Arquivo de Destino**: `src/layouts/DefaultLayout.vue`
*   **Responsabilidades**:
    *   Renderizar `TheHeader` e `TheFooter`.
    *   Prover um slot central (`<router-view>`) para renderizar as `Views` da aplicação.
    *   Atuar como o contêiner principal que define a estrutura de todas as páginas.

### 3.2. `TheHeader.vue`

*   **Arquivo de Destino**: `src/components/shared/TheHeader.vue`
*   **Props**:
    *   `navLinks: { text: string; to: string; }[]`
*   **Responsabilidades**:
    *   Exibir o logo da aplicação.
    *   Renderizar a barra de navegação principal a partir da prop `navLinks`. Usar `<router-link>` para navegação interna.
    *   Incluir o botão CTA ("Comprar Ingressos").
    *   Implementar a lógica para o menu móvel ("hambúrguer").
*   **Diretrizes de Estilo**:
    *   Utilizar `color.text.contrast` e `color.background.dark` para o tema inicial (transparente).
    *   Aplicar uma cor de fundo sólida (`color.background.dark` com opacidade) quando a página for rolada (efeito *scrolled*).
    *   O botão CTA deve usar `color.accent.primary`.

### 3.3. `HeroSection.vue`

*   **Arquivo de Destino**: `src/components/sections/HeroSection.vue`
*   **Props**:
    *   `title: string`
    *   `subtitle: string`
    *   `eventDate: string`
    *   `backgroundImageUrl: string`
*   **Responsabilidades**:
    *   Exibir o título, subtítulo e data do evento.
    *   Mostrar a imagem de fundo.
    *   Incluir o botão "play" que (futuramente) abrirá um modal de vídeo.
    *   Exibir as informações "Sobre", "Onde" e "Quando".
*   **Diretrizes de Estilo**:
    *   Fundo (`color.background.dark`) com uma sobreposição para garantir a legibilidade do texto.
    *   Tipografia: `font.family.display` para o título (`h2`), com tamanhos responsivos (`font.size.5xl` para desktop, `font.size.3xl` para mobile).
    *   A cor do título destacado (`<span>`) deve ser `color.accent.primary`.

### 3.4. `SpeakersSection.vue` e `SpeakerCard.vue`

*   **Arquivo de Destino (`Seção`)**: `src/components/sections/SpeakersSection.vue`
*   **Arquivo de Destino (`Card`)**: `src/components/shared/SpeakerCard.vue`
*   **Props (`SpeakersSection`)**:
    *   `speakers: { name: string; title: string; imageUrl: string; social: { linkedin: string }; }[]`
*   **Props (`SpeakerCard`)**:
    *   Receberá um único objeto `speaker` da lista acima.
*   **Responsabilidades**:
    *   `SpeakersSection`: Recebe a lista de palestrantes e itera sobre ela, renderizando um `SpeakerCard` para cada um em um layout de grade (grid).
    *   `SpeakerCard`: Exibe a foto, nome, título e link social de um palestrante.
*   **Diretrizes de Estilo**:
    *   `SpeakerCard` deve ter um efeito de *hover* que revela as informações e o link social, como no site estático.
    *   Usar `radius.md` para o arredondamento das imagens e cards.

### 3.5. `ScheduleSection.vue`

*   **Arquivo de Destino**: `src/components/sections/ScheduleSection.vue`
*   **Props**:
    *   `scheduleDays: { day: string; date: string; items: { time: string; title: string; speaker?: string; description: string; speakerImage?: string; }[] }[]`
*   **Responsabilidades**:
    *   Renderizar as abas (tabs) para cada dia do evento.
    *   Exibir a agenda correspondente à aba selecionada.
    *   Cada item da agenda deve mostrar a hora, título, descrição e, se aplicável, o palestrante.
*   **Diretrizes de Estilo**:
    *   As abas devem ser construídas utilizando o componente `Tabs` do `shadcn-vue`. A aba ativa deve ser estilizada com a cor `color.accent.primary`.
    *   Os itens da agenda (`schedule-item`) devem ter uma borda inferior `border.default`.

### 4.6. `ContactSection.vue`

*   **Arquivo de Destino**: `src/components/sections/ContactSection.vue`
*   **Props**:
    *   `address: string`
    *   `phone: string`
    *   `email: string`
*   **Responsabilidades**:
    *   Exibir as informações de contato em cards.
    *   Renderizar o mapa do Google Maps.
    *   Renderizar um formulário de contato.
*   **Notas de Implementação**:
    *   O formulário de contato (`php-email-form`) será reimplementado como um componente Vue.
    *   A submissão do formulário deve usar o `http` (Axios) para enviar os dados a uma API (a ser definida pelo backend Amplify).

---

Este guia fornece uma base sólida para a migração. O próximo passo é criar prompts para prototipagem.
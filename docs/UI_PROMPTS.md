# Prompts de UI com Foco em shadcn-vue

Este documento contém prompts otimizados para o v0.dev (ou ferramentas de IA similares) para gerar rapidamente o HTML e as classes TailwindCSS, **utilizando componentes da biblioteca `shadcn-vue` como base**.

**Instrução Geral para a IA:**
"Gere um componente Vue 3 utilizando componentes da biblioteca `shadcn-vue` (como `Card`, `Button`, `Tabs`) e estilize-os com TailwindCSS 4. Use as cores e fontes a seguir como referência: Cor primária de destaque é roxo (`#5E1FB6`), texto principal em cinza escuro (`#2f3138`), fundo escuro em azul-marinho (`#000820`), e fundo claro em cinza suave (`#f2f2f3`). A fonte para títulos é 'Raleway' e para texto é 'Roboto'."

---

### 1. Prompt para `HeroSection`

**Prompt Detalhado:**

"Crie uma seção 'hero' de tela cheia para um site de evento de tecnologia, usando um `div` como contêiner principal. O fundo deve ser uma imagem escura com uma sobreposição (overlay) preta-azulada semitransparente. No centro, adicione um título `h2` (fonte 'Raleway', peso 700) que diz 'MeetUp #16' em branco, com a frase 'Infraestrutura como código' em um `span` roxo (#5E1FB6) logo abaixo. O título principal deve ser 'Utilizando Terraform na Nuvem'. Abaixo do título, adicione um parágrafo menor com a data e local. Inclua um **`Button` do `shadcn-vue`** com a variante 'ghost' para o botão de 'play' pulsante. Na parte inferior, crie uma faixa com fundo semitransparente contendo três colunas (usando CSS Grid), cada uma com um título (`h3`) e um parágrafo (`p`)."

---

### 2. Prompt para `SpeakerCard`

**Prompt Detalhado:**

"Usando o componente **`Card` do `shadcn-vue` como base**, desenvolva um card de perfil para um palestrante. O `CardHeader` deve conter a imagem do palestrante, ocupando toda a largura. O `CardContent` deve aparecer apenas no *hover*, com uma sobreposição escura. Dentro dele, o `CardTitle` será o nome do palestrante (ex: 'Patricia Góis') e o `CardDescription` será o seu cargo (ex: 'Consultora e Arquiteta Cloud'). Use um **`Button` do `shadcn-vue`** com a variante 'link' para o ícone do LinkedIn. O card deve ser responsivo para grades."

---

### 3. Prompt para `ScheduleSection`

**Prompt Detalhado:**

"Construa uma seção de agenda de eventos usando o componente **`Tabs` do `shadcn-vue`**. Crie duas `TabsTrigger` para 'Dia 1' e 'Dia 2', estilizando-as como botões arredondados (pills). A aba ativa (`data-state=active`) deve ter um fundo roxo (#5E1FB6) e texto branco. Para cada `TabsContent`, liste os itens da agenda. Cada item deve ser uma linha (um `div` com `flex`), com a hora em uma coluna à esquerda. Na coluna principal, use um `div` com `flex` e `items-center` para mostrar uma pequena imagem (`Avatar` do `shadcn-vue` se disponível, ou `img` com `rounded-full`) do palestrante, o título da palestra, nome do palestrante e descrição. Use uma `Separator` do `shadcn-vue` entre cada item."


---

### 4. Prompt para `BuyTicketsSection`

**Prompt Detalhado:**

"Crie uma seção de preços usando o **`Card` do `shadcn-vue`**. Modele duas opções. O primeiro `Card` terá o título 'Evento', preço 'R$0' no conteúdo, e um **`Button` do `shadcn-vue`** no `CardFooter` com o texto 'Inscrição'. O segundo `Card` deve ter a variante de destaque, com fundo roxo e texto branco (aplique as classes diretamente no `Card`). O título será 'Kit Camisa' e o preço 'R$100'. No `CardContent`, liste os itens inclusos usando ícones de checkmark. No `CardFooter`, adicione um **`Button` do `shadcn-vue`** com a variante 'outline' e texto 'Comprar agora'."
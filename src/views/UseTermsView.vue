<template>
    <main class="min-h-screen bg-background">
        <!-- Hero -->
        <section class="relative py-16 md:py-24 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
            <div class="container mx-auto px-4 max-w-4xl text-center">
                <h1 class="font-display text-4xl md:text-5xl font-bold">Termos de Uso</h1>
                <p class="mt-3 text-primary-foreground/90">Condições para usar o site e os serviços da comunidade.</p>
                <p class="mt-2 text-primary-foreground/80">Última atualização: {{ lastUpdated }}</p>
            </div>
        </section>

        <!-- Content -->
        <section class="py-12 md:py-16">
            <div class="container mx-auto px-4 max-w-4xl space-y-8">
                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">1. Aceite dos Termos</h2>
                    <p>
                        Ao acessar ou usar o site da <strong>AWS User Group Brasília</strong> (“UG Brasília”), você
                        concorda com estes Termos
                        e com a nossa <router-link to="/privacy"
                            class="underline underline-offset-2 hover:no-underline">Política de
                            Privacidade</router-link>.
                    </p>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">2. Conta e Autenticação</h2>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Você é responsável por manter a confidencialidade das credenciais da sua conta.</li>
                        <li>Podemos suspender contas que violem estes Termos ou normas da comunidade.</li>
                        <li>Login social (Google) é fornecido para conveniência; sujeito às políticas do provedor.</li>
                    </ul>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">3. Uso Aceitável</h2>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Não publique ou compartilhe conteúdo ilegal, ofensivo, discriminatório ou que viole direitos
                            de terceiros.</li>
                        <li>Não tente burlar segurança, explorar vulnerabilidades ou realizar engenharia reversa.</li>
                        <li>Respeite o código de conduta da comunidade em eventos e interações online.</li>
                    </ul>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">4. Conteúdo e Propriedade Intelectual</h2>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Marcas e logos exibidos pertencem aos seus respectivos proprietários.</li>
                        <li>Ao submeter conteúdo (ex.: comentários no futuro), você nos concede licença para exibição no
                            site.</li>
                    </ul>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">5. Serviços de Terceiros</h2>
                    <p>
                        Utilizamos serviços de terceiros (AWS, Google) para autenticação, hospedagem e outras funções.
                        O uso está sujeito também aos termos desses provedores.
                    </p>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">6. Isenções e Limitação de Responsabilidade</h2>
                    <p>
                        Este site é fornecido “como está”. A UG Brasília não garante disponibilidade contínua ou
                        ausência de erros.
                        Na extensão permitida por lei, não nos responsabilizamos por danos indiretos ou consequenciais.
                    </p>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">7. Encerramento</h2>
                    <p>
                        Podemos modificar, suspender ou encerrar o site/serviços a qualquer momento, com ou sem aviso,
                        quando necessário.
                    </p>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">8. Alterações nos Termos</h2>
                    <p>
                        Podemos atualizar estes Termos periodicamente. A versão vigente estará disponível nesta página
                        com a data de “Última atualização”.
                    </p>
                </section>

                <section class="space-y-3">
                    <h2 class="text-2xl font-semibold">9. Contato</h2>
                    <p>
                        Dúvidas sobre estes Termos? Fale conosco:
                        <a class="underline underline-offset-2"
                            href="mailto:contatoawsbrasilia@gmail.com">contatoawsbrasilia@gmail.com</a>.
                    </p>
                </section>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
const lastUpdated = '10/08/2025' // ajuste quando publicar
</script>

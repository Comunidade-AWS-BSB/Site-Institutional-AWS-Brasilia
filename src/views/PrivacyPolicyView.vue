<template>
    <main class="min-h-screen bg-background">
        <!-- Hero -->
        <section class="relative py-16 md:py-24 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
            <div class="container mx-auto px-4 max-w-4xl text-center">
                <h1 class="font-display text-4xl md:text-5xl font-bold">Política de Privacidade</h1>
                <p class="mt-3 text-primary-foreground/90">Como coletamos, usamos e protegemos seus dados.</p>
                <p class="mt-2 text-primary-foreground/80">Última revisão: {{ lastUpdated }}</p>
            </div>
        </section>

        <!-- Content -->
        <section class="py-12 md:py-16">
            <div class="container mx-auto px-4 max-w-4xl space-y-10">
                <!-- TOC -->
                <nav class="rounded-xl border bg-card/50 p-6">
                    <h2 class="font-semibold mb-3">Conteúdo</h2>
                    <ul class="grid sm:grid-cols-2 gap-2 text-sm">
                        <li><a href="#who" class="underline underline-offset-2 hover:no-underline">Quem somos</a></li>
                        <li><a href="#data-we-collect" class="underline underline-offset-2 hover:no-underline">Dados que
                                coletamos</a></li>
                        <li><a href="#how-we-use" class="underline underline-offset-2 hover:no-underline">Como usamos os
                                dados</a></li>
                        <li><a href="#sharing"
                                class="underline underline-offset-2 hover:no-underline">Compartilhamento</a></li>
                        <li><a href="#cookies" class="underline underline-offset-2 hover:no-underline">Cookies e
                                analytics</a></li>
                        <li><a href="#legal-bases" class="underline underline-offset-2 hover:no-underline">Bases
                                legais</a></li>
                        <li><a href="#retention" class="underline underline-offset-2 hover:no-underline">Retenção</a>
                        </li>
                        <li><a href="#security" class="underline underline-offset-2 hover:no-underline">Segurança</a>
                        </li>
                        <li><a href="#your-rights" class="underline underline-offset-2 hover:no-underline">Seus
                                direitos</a></li>
                        <li><a href="#children" class="underline underline-offset-2 hover:no-underline">Crianças e
                                adolescentes</a></li>
                        <li><a href="#intl" class="underline underline-offset-2 hover:no-underline">Transferências
                                internacionais</a></li>
                        <li><a href="#contact" class="underline underline-offset-2 hover:no-underline">Contato</a></li>
                    </ul>
                </nav>

                <!-- Sections -->
                <section id="who" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Quem somos</h2>
                    <p>
                        Somos a <strong>AWS User Group Brasília</strong> (“UG Brasília”, “nós”), uma comunidade sem fins
                        lucrativos
                        dedicada a aprendizado e networking sobre tecnologias AWS. Este site é mantido para divulgar
                        eventos,
                        conteúdos e atividades da comunidade.
                    </p>
                </section>

                <section id="data-we-collect" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Dados que coletamos</h2>
                    <ul class="list-disc pl-6 space-y-2">
                        <li><strong>Conta e autenticação:</strong> nome, e‑mail e (opcionalmente) nickname ao criar
                            conta via Cognito ou login social (Google).</li>
                        <li><strong>Uso do site:</strong> páginas acessadas, interações e metadados técnicos (ex.: IP,
                            dispositivo, navegador) para melhorar a experiência.</li>
                        <li><strong>Conteúdo público:</strong> informações de eventos e palestrantes exibidas no site.
                        </li>
                    </ul>
                </section>

                <section id="how-we-use" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Como usamos os dados</h2>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Operar e manter o site, autenticação e áreas administrativas.</li>
                        <li>Divulgar eventos, talks e conteúdos da comunidade.</li>
                        <li>Melhorar UX, segurança e performance.</li>
                        <li>Comunicar atualizações relevantes (quando você consentir).</li>
                    </ul>
                </section>

                <section id="sharing" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Compartilhamento</h2>
                    <p>
                        Não vendemos seus dados. Podemos compartilhar com provedores que nos ajudam a operar este site,
                        sempre sob contrato e princípios de minimização:
                    </p>
                    <ul class="list-disc pl-6 space-y-2">
                        <li><strong>AWS Amplify/Cognito/S3/DynamoDB</strong> – infraestrutura, autenticação e
                            armazenamento.</li>
                        <li><strong>Google (OAuth)</strong> – login social e verificação de e‑mail.</li>
                        <li>Serviços de analytics/monitoramento (quando habilitados no futuro).</li>
                    </ul>
                </section>

                <section id="cookies" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Cookies e analytics</h2>
                    <p>
                        Usamos cookies essenciais para login e segurança. Poderemos usar analytics (ex.: Google
                        Analytics) para
                        métricas de uso — quando habilitados, exibiremos aviso/consentimento conforme exigido.
                    </p>
                </section>

                <section id="legal-bases" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Bases legais</h2>
                    <p>
                        Tratamos dados com base em <em>legítimo interesse</em>, <em>execução de contrato</em> (fornecer
                        o serviço de
                        autenticação/experiência do site) e <em>consentimento</em> quando aplicável (ex.: comunicações).
                    </p>
                </section>

                <section id="retention" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Retenção</h2>
                    <p>
                        Mantemos dados pelo tempo necessário para as finalidades declaradas e obrigações legais.
                        Você pode solicitar exclusão da conta e dados associados.
                    </p>
                </section>

                <section id="security" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Segurança</h2>
                    <p>
                        Utilizamos recursos gerenciados da AWS (ex.: Cognito, S3) e boas práticas de segurança.
                        Nenhuma medida é 100% infalível, mas adotamos controles técnicos e organizacionais
                        proporcionais.
                    </p>
                </section>

                <section id="your-rights" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Seus direitos</h2>
                    <p>
                        Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados, bem como revisão
                        do consentimento.
                        Para exercer seus direitos, entre em contato conosco.
                    </p>
                </section>

                <section id="children" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Crianças e adolescentes</h2>
                    <p>
                        Nosso site não é destinado a menores de 16 anos. Se você acredita que coletamos dados de menor
                        sem autorização,
                        avise-nos para removermos.
                    </p>
                </section>

                <section id="intl" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Transferências internacionais</h2>
                    <p>
                        Podemos processar dados em provedores fora do seu país (ex.: EUA) seguindo mecanismos adequados
                        de transferência.
                    </p>
                </section>

                <section id="contact" class="space-y-3">
                    <h2 class="text-2xl font-semibold">Contato</h2>
                    <p>
                        Dúvidas sobre privacidade? Fale com a gente:
                        <a class="underline underline-offset-2"
                            href="mailto:contatoawsbrasilia@gmail.com">contatoawsbrasilia@gmail.com</a>
                    </p>
                </section>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
const lastUpdated = '10/08/2025'
</script>

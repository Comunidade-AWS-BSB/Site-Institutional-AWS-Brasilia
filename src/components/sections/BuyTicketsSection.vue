<template>
  <section id="buy-tickets" class="py-16 md:py-24 bg-background">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Ingressos
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Inscreva-se agora e participe com a gente!
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Opções de Preço -->
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Opção Evento Gratuito -->
        <div class="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <!-- Nome do Evento -->
            <div class="text-center md:text-left">
              <h3 class="font-display font-bold text-2xl text-foreground">
                Evento
              </h3>
            </div>

            <!-- Preço -->
            <div class="text-center">
              <div class="text-4xl font-bold text-primary">
                <span class="text-lg">R$</span>0
                <span class="text-lg text-muted-foreground">/Reais</span>
              </div>
            </div>

            <!-- Benefícios -->
            <div class="text-center md:text-left">
              <ul class="space-y-2">
                <li class="flex items-center justify-center md:justify-start text-muted-foreground">
                  <Check class="h-4 w-4 text-green-500 mr-2" />
                  <span>Acesso completo ao evento</span>
                </li>
                <li class="flex items-center justify-center md:justify-start text-muted-foreground">
                  <Check class="h-4 w-4 text-green-500 mr-2" />
                  <span>Networking com a comunidade</span>
                </li>
                <li class="flex items-center justify-center md:justify-start text-muted-foreground/50">
                  <X class="h-4 w-4 text-muted-foreground/50 mr-2" />
                  <span>Kit de materiais</span>
                </li>
              </ul>
            </div>

            <!-- Botão CTA -->
            <div class="text-center">
              <Button
                variant="outline"
                size="lg"
                @click="registerEvent"
                class="w-full md:w-auto hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <UserPlus class="h-4 w-4 mr-2" />
                Inscrição
              </Button>
            </div>
          </div>
        </div>

        <!-- Opção Kit Premium -->
        <div class="bg-primary text-primary-foreground rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-in-up relative overflow-hidden" style="animation-delay: 0.2s">
          <!-- Selo de Destaque -->
          <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            Destaque
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <!-- Nome do Kit -->
            <div class="text-center md:text-left">
              <h3 class="font-display font-bold text-2xl">
                Kit Camisa
              </h3>
            </div>

            <!-- Preço -->
            <div class="text-center">
              <div class="text-4xl font-bold">
                <span class="text-lg">R$</span>100
                <span class="text-lg opacity-80">/Reais</span>
              </div>
            </div>

            <!-- Benefícios -->
            <div class="text-center md:text-left">
              <ul class="space-y-2">
                <li class="flex items-center justify-center md:justify-start">
                  <Check class="h-4 w-4 text-green-300 mr-2" />
                  <span>Camisa Polo Azul Escuro</span>
                </li>
                <li class="flex items-center justify-center md:justify-start">
                  <Check class="h-4 w-4 text-green-300 mr-2" />
                  <span className="font-medium">Bloco de Notas, Caneta</span>
                </li>
                <li class="flex items-center justify-center md:justify-start">
                  <Check class="h-4 w-4 text-green-300 mr-2" />
                  <span>Chaveiro</span>
                </li>
              </ul>
            </div>

            <!-- Botão CTA -->
            <div class="text-center">
              <Button
                variant="secondary"
                size="lg"
                @click="buyKit"
                class="w-full md:w-auto bg-white text-primary hover:bg-white/90 transition-all duration-200 hover:scale-105"
              >
                <ShoppingCart class="h-4 w-4 mr-2" />
                Comprar agora
              </Button>
            </div>
          </div>

          <!-- Padrão de Fundo -->
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          </div>
        </div>
      </div>

      <!-- Informações Adicionais -->
      <div class="text-center mt-12 animate-fade-in-up" style="animation-delay: 0.4s">
        <p class="text-muted-foreground text-sm max-w-2xl mx-auto">
          * O evento é gratuito e aberto ao público. O kit de materiais é opcional e pode ser adquirido separadamente.
          Todas as compras são processadas via WhatsApp para maior comodidade.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Check, X, UserPlus, ShoppingCart } from 'lucide-vue-next'

const registerEvent = () => {
  // Redireciona para inscrição no Meetup
  window.open('https://www.meetup.com/aws-user-group-brasilia/', '_blank')
}

const buyKit = () => {
  // Redireciona para WhatsApp para compra do kit
  window.open('https://api.whatsapp.com/send/?phone=556191769304&text&type=phone_number&app_absent=0', '_blank')
}
</script>

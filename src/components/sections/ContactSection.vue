<template>
  <section id="contact" class="py-16 md:py-24 bg-muted/30">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Contato
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Quer saber mais? Fale com a nossa equipe.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Cartões de Informações de Contato (sem endereço) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <!-- Telefone -->
        <div class="bg-card border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone class="h-8 w-8 text-primary" />
          </div>
          <h3 class="font-display font-bold text-lg text-foreground mb-2">
            Entre em contato!
          </h3>
          <p class="text-muted-foreground">
            (61) 9 9176-9304
          </p>
        </div>

        <!-- E-mail -->
        <div class="bg-card border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail class="h-8 w-8 text-primary" />
          </div>
          <h3 class="font-display font-bold text-lg text-foreground mb-2">
            E-mail
          </h3>
          <p class="text-muted-foreground">
            contatoawsbrasilia@gmail.com
          </p>
        </div>
      </div>

      <!-- Formulário de Contato (removido mapa) -->
      <div class="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <!-- Formulário de Contato -->
        <div class="animate-fade-in-up">
          <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-foreground mb-2">
                    Nome *
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Seu nome"
                  >
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                  >
                </div>
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-foreground mb-2">
                  Assunto *
                </label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Assunto da mensagem"
                >
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-foreground mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="6"
                  required
                  class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  placeholder="Sua mensagem..."
                ></textarea>
              </div>

              <!-- Mensagens de Status do Formulário -->
              <div v-if="formStatus.loading" class="text-center py-4">
                <div class="inline-flex items-center space-x-2 text-muted-foreground">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span>Enviando...</span>
                </div>
              </div>

              <div v-if="formStatus.success" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
                Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.
              </div>

              <div v-if="formStatus.error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                Ocorreu um erro ao enviar sua mensagem. Tente novamente ou entre em contato via WhatsApp.
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                :disabled="formStatus.loading"
                class="w-full hover:scale-105 transition-transform duration-200"
              >
                <Send class="h-4 w-4 mr-2" />
                {{ formStatus.loading ? 'Enviando...' : 'Enviar Mensagem' }}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Button } from '@/components/ui/button'
import { Phone, Mail, Send } from 'lucide-vue-next'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

interface FormStatus {
  loading: boolean
  success: boolean
  error: boolean
}

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const formStatus = reactive<FormStatus>({
  loading: false,
  success: false,
  error: false
})

const submitForm = async () => {
  // Resetar status
  formStatus.loading = true
  formStatus.success = false
  formStatus.error = false

  try {
    // Simular envio do formulário TODO: substituir por chamada real de API
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Por enquanto, apenas mostra mensagem de sucesso
    formStatus.success = true

    // Resetar formulário
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  } catch {
    formStatus.error = true
  } finally {
    formStatus.loading = false
  }
}
</script>

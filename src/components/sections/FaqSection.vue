<template>
  <section id="faq" class="py-16 md:py-24 bg-muted/30">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Perguntas Frequentes
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Tire suas dúvidas sobre o grupo, eventos e como participar.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Itens do FAQ -->
      <div class="max-w-4xl mx-auto space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="faq.id"
          class="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <button
            class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
            @click="toggleFaq(index)"
          >
            <h3 class="font-display font-semibold text-lg text-foreground pr-4">
              {{ faq.question }}
            </h3>
            <div
              :class="[
                'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 transition-transform duration-200',
                openFaqs.includes(index) ? 'rotate-180' : ''
              ]"
            >
              <ChevronDown class="h-4 w-4 text-primary" />
            </div>
          </button>

          <div
            :class="[
              'overflow-hidden transition-all duration-300 ease-in-out',
              openFaqs.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            ]"
          >
            <div class="px-6 pb-4">
              <p class="text-muted-foreground leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA de Contato -->
      <div class="text-center mt-16 animate-fade-in-up" style="animation-delay: 0.8s">
        <div class="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
          <h3 class="font-display font-bold text-xl text-foreground mb-4">
            Ainda tem dúvidas?
          </h3>
          <p class="text-muted-foreground mb-6">
            Nossa equipe está pronta para ajudar você. Entre em contato conosco!
          </p>
          <Button
            variant="default"
            size="lg"
            @click="scrollToContact"
            class="hover:scale-105 transition-transform duration-200"
          >
            <MessageCircle class="h-4 w-4 mr-2" />
            Fale Conosco
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronDown, MessageCircle } from 'lucide-vue-next'

interface Faq {
  id: number
  question: string
  answer: string
}

// Primeiro FAQ aberto por padrão
const openFaqs = ref<number[]>([0])

const faqs = ref<Faq[]>([
  {
    id: 1,
    question: 'O que é o User Group AWS Brasília?',
    answer: 'É uma comunidade local de entusiastas, profissionais e estudantes interessados em tecnologias da AWS (Amazon Web Services). O grupo promove encontros, palestras e networking para compartilhar conhecimento e experiências.'
  },
  {
    id: 2,
    question: 'Quem pode participar do grupo?',
    answer: 'Qualquer pessoa interessada em AWS é bem-vinda — desde iniciantes até especialistas. Não é necessário ter certificações ou experiência prévia.'
  },
  {
    id: 3,
    question: 'Como posso me inscrever ou participar?',
    answer: 'Você pode participar se inscrevendo gratuitamente nos eventos via plataformas como Meetup, LinkedIn ou acompanhando o grupo em redes sociais. Os links costumam ser divulgados com antecedência.'
  },
  {
    id: 4,
    question: 'Os eventos são pagos?',
    answer: 'Não. A maioria dos eventos promovidos pelo User Group AWS Brasília é gratuita e aberta ao público.'
  },
  {
    id: 5,
    question: 'Onde os encontros acontecem?',
    answer: 'Os eventos podem ser presenciais em Brasília (DF), em locais como coworkings, universidades e empresas parceiras, ou online via plataformas como Zoom ou YouTube.'
  },
  {
    id: 6,
    question: 'O grupo é oficial da AWS?',
    answer: 'Sim, é reconhecido como um AWS User Group oficial e faz parte do programa global de comunidades da AWS, embora seja mantido por voluntários.'
  }
])

// Alterna o estado aberto/fechado do FAQ
const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

// Rola até a seção de contato
const scrollToContact = () => {
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

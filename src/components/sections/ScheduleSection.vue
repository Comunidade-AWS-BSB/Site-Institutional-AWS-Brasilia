<template>
  <section id="schedule" class="py-16 md:py-24 bg-muted/30">
    <div class="container mx-auto px-4">
      <!-- Título da Seção -->
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          Agenda de Eventos
        </h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
          Programação completa com horários e dias das palestras.
        </p>
        <div class="w-12 h-1 bg-primary mx-auto"></div>
      </div>

      <!-- Abas da Programação -->
      <div class="max-w-4xl mx-auto">
        <!-- Navegação das Abas -->
        <div class="flex justify-center mb-8">
          <div class="flex bg-muted rounded-full p-1">
            <button
              v-for="(day, index) in scheduleDays"
              :key="day.id"
              :class="[
                'px-6 py-3 rounded-full font-medium transition-all duration-200',
                activeTab === index
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              ]"
              @click="activeTab = index"
            >
              {{ day.name }}
            </button>
          </div>
        </div>

        <!-- Data do Evento -->
        <div class="text-center mb-12">
          <h3 class="font-display text-xl text-muted-foreground italic">
            {{ scheduleDays[activeTab].date }} - {{ scheduleDays[activeTab].location }}
          </h3>
        </div>

        <!-- Conteúdo da Programação -->
        <div class="space-y-6">
          <div
            v-for="(item, index) in scheduleDays[activeTab].items"
            :key="index"
            class="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="flex flex-col md:flex-row md:items-center gap-4">
              <!-- Horário -->
              <div class="flex-shrink-0">
                <div class="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-lg">
                  {{ item.time }}
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-start gap-4">
                  <!-- Imagem do Palestrante (se disponível) -->
                  <div v-if="item.speakerImage" class="flex-shrink-0">
                    <img
                      :src="item.speakerImage"
                      :alt="item.speaker"
                      class="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    >
                  </div>

                  <!-- Detalhes do Evento -->
                  <div class="flex-1">
                    <h4 class="font-display font-bold text-xl text-foreground mb-2">
                      {{ item.title }}
                      <span v-if="item.speaker" class="text-primary font-normal italic">
                        - {{ item.speaker }}
                      </span>
                    </h4>
                    <p class="text-muted-foreground leading-relaxed">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Interface para um item da programação
interface ScheduleItem {
  time: string
  title: string
  speaker?: string
  description: string
  speakerImage?: string
}

// Interface para um dia da programação
interface ScheduleDay {
  id: number
  name: string
  date: string
  location: string
  items: ScheduleItem[]
}

const activeTab = ref(0)

// Dados dos dias da programação
const scheduleDays = ref<ScheduleDay[]>([
  {
    id: 1,
    name: 'Dia 1',
    date: '28 de agosto 2025',
    location: 'Centro Universitário UDF, Brasília-DF',
    items: [
      {
        time: '18:40',
        title: 'Credenciamento',
        description: 'Recepção dos participantes e entrega de materiais do evento.'
      },
      {
        time: '19:00',
        title: 'Keynote',
        speaker: 'Patricia Góis',
        description: 'Infraestrutura como código: Utilizando ferramenta Terraform na Nuvem.',
        speakerImage: '/img/speakers/speaker-1-2.jpg'
      }
    ]
  },
  {
    id: 2,
    name: 'Dia 2',
    date: '29 de agosto 2025',
    location: 'Centro Universitário UDF, Brasília-DF',
    items: [
      {
        time: '19:00',
        title: 'Workshop Avançado',
        speaker: 'Evandro Pires',
        description: 'Implementação prática de soluções serverless na AWS.',
        speakerImage: '/img/speakers/speaker-2.jpg'
      },
      {
        time: '20:30',
        title: 'Networking',
        description: 'Momento de integração entre os participantes e palestrantes.'
      }
    ]
  }
])
</script>

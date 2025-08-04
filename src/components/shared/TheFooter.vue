<template>
  <footer class="bg-background border-t border-border">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo e Descrição -->
        <div class="md:col-span-2">
          <router-link to="/" class="flex items-center space-x-2 mb-4">
            <img
              src="/img/logo.png"
              alt="AWS User Group Brasília"
              class="h-8 w-auto"
            >
          </router-link>
          <p class="text-muted-foreground text-sm leading-relaxed max-w-md">
            Comunidade oficial do AWS User Group Brasília. Promovemos encontros,
            palestras e networking para compartilhar conhecimento sobre tecnologias AWS.
          </p>
        </div>

        <!-- Links Rápidos -->
        <div>
          <h4 class="font-display font-semibold text-foreground mb-4">Links Rápidos</h4>
          <ul class="space-y-2">
            <li>
              <a
                href="#hero"
                class="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#speakers"
                class="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Palestrantes
              </a>
            </li>
            <li>
              <a
                href="#schedule"
                class="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Eventos
              </a>
            </li>
            <li>
              <a
                href="#contact"
                class="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contato
              </a>
            </li>
          </ul>
        </div>

        <!-- Informações de Contato -->
        <div>
          <h4 class="font-display font-semibold text-foreground mb-4">Contato</h4>
          <div class="space-y-2">
            <p class="text-muted-foreground text-sm flex items-center">
              <MapPin class="h-4 w-4 mr-2" />
              Brasília - DF
            </p>
            <p class="text-muted-foreground text-sm flex items-center">
              <Phone class="h-4 w-4 mr-2" />
              (61) 9 9176-9304
            </p>
            <p class="text-muted-foreground text-sm flex items-center">
              <Mail class="h-4 w-4 mr-2" />
              contatoawsbrasilia@outlook.com.br
            </p>
          </div>
        </div>
      </div>

      <!-- Links Sociais e Direitos Autorais -->
      <div class="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div class="text-center md:text-left mb-4 md:mb-0">
          <p class="text-muted-foreground text-sm">
            © 2025 AWS User Group Brasília. Todos os direitos reservados.
          </p>
          <p class="text-muted-foreground text-xs mt-1">
            Termos de uso | Política de privacidade
          </p>
        </div>

        <!-- Links de Mídias Sociais -->
        <div class="flex space-x-4">
          <a
            href="https://api.whatsapp.com/send/?phone=556191769304"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <MessageCircle class="h-4 w-4" />
          </a>
          <a
            href="https://www.youtube.com/@AWSUsergroupBrasilia/streams"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Youtube class="h-4 w-4" />
          </a>
          <a
            href="https://www.facebook.com/people/AWS-User-Group-Bras%C3%ADlia/61556738932977/"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Facebook class="h-4 w-4" />
          </a>
          <a
            href="https://www.instagram.com/awsbrasilia/"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Instagram class="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/company/aws-user-group-bsb/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Linkedin class="h-4 w-4" />
          </a>
          <a
            href="https://github.com/AwsUgBRasilia"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Github class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Youtube,
  Facebook,
  Instagram,
  Linkedin,
  Github
} from 'lucide-vue-next'
</script>

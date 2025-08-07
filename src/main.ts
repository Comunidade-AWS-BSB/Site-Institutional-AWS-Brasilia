import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import AmplifyVue from '@aws-amplify/ui-vue'

// Bootstrap Amplify config BEFORE mount
import './lib/amplify'

// Estilos globais
import '@aws-amplify/ui-vue/styles.css'
import '@/assets/main.css'
import '@/assets/amplify-theme.css'

// Locale: a biblioteca @aws-amplify/ui-vue não exporta Amplify; para textos usaremos o dicionário i18n no componente.

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(AmplifyVue)

app.mount('#app')

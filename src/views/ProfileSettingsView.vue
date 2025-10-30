<template>
  <div class="container mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold mb-6">Profile Settings</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left column -->
      <div class="space-y-4">
        <!-- Profile summary card -->
        <Card>
          <CardContent class="p-6 flex flex-col items-center text-center gap-3">
            <div class="relative">
              <div v-if="!photoPreview" class="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {{ initials }}
              </div>
              <img v-else :src="photoPreview" alt="Foto de perfil" class="h-20 w-20 rounded-full object-cover" />
            </div>

            <div>
              <div class="font-medium">{{ displayName || 'Usuário' }}</div>
              <div class="text-xs text-muted-foreground">{{ email || 'seu-email@exemplo.com' }}</div>
            </div>
          </CardContent>
        </Card>

        <!-- Side nav -->
        <Card>
          <CardContent class="p-0">
            <nav class="flex flex-col">
              <button
                v-for="item in sideItems"
                :key="item.key"
                class="text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-primary/5"
                :class="current === item.key ? 'bg-primary/10 text-primary' : ''"
                @click="current = item.key"
              >
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </CardContent>
        </Card>
      </div>

      <!-- Right column (details) -->
      <div class="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>profile.edit.title</CardTitle>
            <CardDescription>Interface estática; integração virá em fase 2.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Photo selector -->
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                <img v-if="photoPreview" :src="photoPreview" class="h-full w-full object-cover" />
                <span v-else class="text-primary font-semibold">{{ initials }}</span>
              </div>
              <div class="space-x-2">
                <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="onPickPhoto" />
                <Button variant="secondary" size="sm" @click="photoInput?.click()">
                  <span>profile.edit.changePhotoButton</span>
                </Button>
                <span class="text-xs text-muted-foreground align-middle">profile.edit.photoFormatsInfo</span>
              </div>
            </div>

            <Separator />

            <!-- Display name -->
            <div class="space-y-2">
              <Label for="displayName">profile.edit.nameLabel</Label>
              <Input id="displayName" v-model="form.displayName" placeholder="Seu nome de exibição" />
            </div>

            <!-- Profissão (novo campo) -->
            <div class="space-y-2">
              <Label for="profession">Profissão</Label>
              <Input id="profession" v-model="form.profession" placeholder="Ex.: Engenheiro de Software" />
            </div>

            <!-- Bio -->
            <div class="space-y-2">
              <Label for="bio">profile.edit.bioLabel</Label>
              <Textarea id="bio" v-model="form.bio" rows="4" placeholder="profile.edit.bioPlaceholder" />
            </div>

            <!-- Interests -->
            <div class="space-y-2">
              <Label>Interesses</Label>
              <div class="flex gap-2">
                <Input
                  v-model="interestInput"
                  placeholder="Digite e pressione Enter"
                  @keydown.enter.prevent="addInterest()"
                />
                <Button variant="secondary" @click="addInterest">Adicionar</Button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="i in form.interests"
                  :key="i"
                  class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-foreground/10"
                >
                  {{ i }}
                  <button class="opacity-70 hover:opacity-100" @click="removeInterest(i)">✕</button>
                </span>
              </div>
            </div>

            <Separator />

            <!-- Notifications -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">Notificações por E-mail</div>
                  <div class="text-xs text-muted-foreground">Receber atualizações e comunicados</div>
                </div>
                <Switch v-model:checked="notifications.email" />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">Notificações por SMS</div>
                  <div class="text-xs text-muted-foreground">Usa seu número verificado do Cognito</div>
                </div>
                <Switch v-model:checked="notifications.sms" />
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">Notificações por WhatsApp</div>
                  <div class="text-xs text-muted-foreground">Número (E.164) é o mesmo do Cognito</div>
                </div>
                <Switch v-model:checked="notifications.whatsapp" />
              </div>
              <div class="text-xs text-muted-foreground">As preferências serão integradas ao backend em uma próxima fase.</div>
            </div>
          </CardContent>

          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetForm">Descartar</Button>
            <Button disabled>Salvar (em breve)</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Separator from '@/components/ui/separator/Separator.vue'

const auth = useAuthStore()

// Left nav state
const sideItems = [
  { key: 'edit', label: 'Edit Profile' },
  { key: 'interests', label: 'My Interests' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'subscription', label: 'My Subscription' },
] as const
const current = ref<typeof sideItems[number]['key']>('edit')

// Derived user info for summary
const email = computed(() => auth.snapshot.attributes?.email || '')
const displayName = computed(() => auth.displayName)
const initials = computed(() => {
  const name = displayName.value || email.value || 'U'
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '')
  return letters.join('') || 'U'
})

// Local-only form state (phase 1 – static)
const form = ref({
  displayName: auth.displayName || '',
  profession: '',
  bio: '',
  interests: [] as string[],
})

const notifications = ref({ email: true, sms: false, whatsapp: false })

// Photo selector (preview only)
const photoInput = ref<HTMLInputElement | null>(null)
const photoPreview = ref<string | null>(null)
function onPickPhoto(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  photoPreview.value = url
}

// Interests
const interestInput = ref('')
function addInterest() {
  const raw = interestInput.value.trim()
  if (!raw) return
  const tokenized = raw.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean)
  const set = new Set([...form.value.interests, ...tokenized.map(s => s.toLowerCase())])
  form.value.interests = Array.from(set)
  interestInput.value = ''
}
function removeInterest(i: string) {
  form.value.interests = form.value.interests.filter(x => x !== i)
}

function resetForm() {
  form.value = { displayName: auth.displayName || '', profession: '', bio: '', interests: [] }
  notifications.value = { email: true, sms: false, whatsapp: false }
  photoPreview.value = null
}
</script>

<style scoped>
</style>


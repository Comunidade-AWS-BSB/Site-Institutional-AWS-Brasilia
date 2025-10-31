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
              <div class="font-medium">{{ summaryName }}</div>
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
                @click="onSelectTab(item.key)"
              >
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </CardContent>
        </Card>
      </div>

      <!-- Right column (details) -->
      <div class="md:col-span-2">
        <!-- Edit Profile -->
        <Card v-if="current === 'edit'">
          <CardHeader>
            <CardTitle>profile.edit.title</CardTitle>
            <CardDescription>Atualize informações gerais do seu perfil.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Photo selector (preview only por enquanto) -->
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

            <div class="space-y-2">
              <Label for="displayName">profile.edit.nameLabel</Label>
              <Input id="displayName" v-model="form.displayName" placeholder="Seu nome de exibição" />
            </div>

            <div class="space-y-2">
              <Label for="profession">Profissão</Label>
              <Input id="profession" v-model="form.profession" placeholder="Ex.: Engenheiro de Software" />
            </div>

  <div class="space-y-2">
              <Label for="bio">profile.edit.bioLabel</Label>
              <Textarea id="bio" v-model="form.bio" rows="4" placeholder="profile.edit.bioPlaceholder" />
            </div>
            
            <Separator />

            <!-- Social Medias (por usuário) -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium">Redes Sociais</h3>
              <div class="grid md:grid-cols-[200px_1fr] gap-3 items-end">
                <div>
                  <Label for="smType">Plataforma</Label>
                  <Select v-model="smForm.type">
                    <SelectTrigger id="smType">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
                      <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                      <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                      <SelectItem value="GITHUB">GitHub</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <Label for="smUrl">URL</Label>
                    <Input id="smUrl" v-model="smForm.url" placeholder="https://..." />
                  </div>
                  <Button type="button" @click="addPendingSocial" :disabled="!smForm.type || !smForm.url">Adicionar</Button>
                </div>
              </div>

              <div v-if="existingSocials.length" class="space-y-2">
                <div class="text-xs text-muted-foreground">Cadastradas</div>
                <ul class="space-y-2">
                  <li v-for="s in existingSocials" :key="s.id" class="flex items-center justify-between gap-3 border rounded-md px-3 py-2">
                    <div class="text-sm">
                      <span class="font-medium mr-2">{{ prettyMedia(s.name) }}</span>
                      <a :href="s.url" target="_blank" rel="noopener" class="underline text-foreground/80 hover:text-primary break-all">{{ s.url }}</a>
                    </div>
                    <Button variant="secondary" size="sm" @click="deleteExistingSocial(s.id)">Remover</Button>
                  </li>
                </ul>
              </div>

              <div v-if="pendingSocials.length" class="space-y-2">
                <div class="text-xs text-muted-foreground">A adicionar</div>
                <ul class="space-y-2">
                  <li v-for="s in pendingSocials" :key="s._id" class="flex items-center justify-between gap-3 border rounded-md px-3 py-2">
                    <div class="text-sm">
                      <span class="font-medium mr-2">{{ prettyMedia(s.type) }}</span>
                      <span class="break-all">{{ s.url }}</span>
                    </div>
                    <Button variant="secondary" size="sm" @click="removePendingSocial(s._id)">Descartar</Button>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetForm">Descartar</Button>
            <Button :disabled="saving" @click="onSaveGeneral">Salvar</Button>
            <Button :disabled="saving || pendingSocials.length === 0" @click="onSavePendingSocials">Salvar Redes</Button>
          </CardFooter>
        </Card>

        <!-- Interests -->
        <Card v-else-if="current === 'interests'">
          <CardHeader>
            <CardTitle>Meus Interesses</CardTitle>
            <CardDescription>Adicione palavras-chave do seu interesse.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Input v-model="interestInput" placeholder="Digite e pressione Enter" @keydown.enter.prevent="addInterest()" />
              <Button variant="secondary" @click="addInterest">Adicionar</Button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="i in form.interests" :key="i" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-foreground/10">
                {{ i }}
                <button class="opacity-70 hover:opacity-100" @click="removeInterest(i)">✕</button>
              </span>
            </div>
          </CardContent>
          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetInterests">Descartar</Button>
            <Button :disabled="saving" @click="onSaveInterests">Salvar</Button>
          </CardFooter>
        </Card>

        <!-- Notifications -->
        <Card v-else>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Preferências de contato</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
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
          </CardContent>
          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetNotifications">Descartar</Button>
            <Button :disabled="saving" @click="onSaveNotifications">Salvar</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Separator from '@/components/ui/separator/Separator.vue'
import { useProfile, useProfileSocials } from '@/composables/useProfile'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const auth = useAuthStore()
const { profile: profileRef, load, saveGeneral, saveInterests, saveNotifications } = useProfile()
const userSocials = useProfileSocials()
type MediaName = 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'
const saving = ref(false)

// Left nav state
const sideItems = [
  { key: 'edit', label: 'Edit Profile' },
  { key: 'interests', label: 'My Interests' },
  { key: 'notifications', label: 'Notifications' },
] as const
type TabKey = typeof sideItems[number]['key']
const route = useRoute()
const router = useRouter()
const current = ref<TabKey>((route.query.tab as TabKey) || 'edit')

// Derived user info for summary
const email = computed(() => auth.snapshot.attributes?.email || '')
const displayName = computed(() => auth.displayName)
const initials = computed(() => {
  const name = displayName.value || email.value || 'U'
  const parts = name.trim().split(/\s+/)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '')
  return letters.join('') || 'U'
})
const summaryName = computed(() => form.value.displayName || displayName.value || 'Usuário')

// Form state
const form = ref({
  displayName: '',
  profession: '',
  bio: '',
  interests: [] as string[],
})

const notifications = ref({ email: true, sms: false, whatsapp: false })

// Socials (user)
type ExistingSocial = { id: string; name: MediaName; url: string }
type PendingSocial = { _id: string; type: MediaName | ''; url: string }
const existingSocials = ref<ExistingSocial[]>([])
const pendingSocials = ref<PendingSocial[]>([])
const smForm = ref<PendingSocial>({ _id: '', type: '', url: '' })

function prettyMedia(name: MediaName | ''): string {
  switch (name) {
    case 'LINKEDIN': return 'LinkedIn'
    case 'INSTAGRAM': return 'Instagram'
    case 'GITHUB': return 'GitHub'
    case 'MEDIUM': return 'Medium'
    case 'OTHER': return 'Outro'
    default: return '—'
  }
}

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
  const p = profileRef.value
  form.value = {
    displayName: p?.displayName || (displayName.value || ''),
    profession: p?.profession || '',
    bio: p?.bio || '',
    interests: [...(p?.interests || [])],
  }
}

function resetInterests() {
  form.value.interests = [...(profileRef.value?.interests || [])]
}

function resetNotifications() {
  const p = profileRef.value
  notifications.value = {
    email: !!p?.notifyEmail,
    sms: !!p?.notifySms,
    whatsapp: !!p?.notifyWhatsApp,
  }
}

async function onSaveGeneral() {
  saving.value = true
  try {
    await saveGeneral({
      displayName: form.value.displayName,
      profession: form.value.profession,
      bio: form.value.bio,
    })
  } finally {
    saving.value = false
  }
}

async function onSaveInterests() {
  saving.value = true
  try {
    await saveInterests(form.value.interests)
  } finally {
    saving.value = false
  }
}

async function onSaveNotifications() {
  saving.value = true
  try {
    await saveNotifications({
      email: notifications.value.email,
      sms: notifications.value.sms,
      whatsapp: notifications.value.whatsapp,
    })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await load()
  resetForm()
  resetNotifications()
  // carregar redes sociais já cadastradas
  try {
    const data = await userSocials.list()
    existingSocials.value = data.map(d => ({ id: d.id, name: d.name as MediaName, url: d.url ?? '' }))
  } catch {}
  const initial = (route.query.tab as TabKey) || 'edit'
  current.value = initial
})

watch(() => route.query.tab, (t) => {
  const key = (t as TabKey) || 'edit'
  if (key !== current.value) current.value = key
})

function onSelectTab(tab: TabKey) {
  if (tab === current.value) return
  current.value = tab
  router.replace({ query: { ...route.query, tab } })
}

function addPendingSocial() {
  if (!smForm.value.type || !smForm.value.url.trim()) return
  pendingSocials.value.push({ _id: crypto.randomUUID(), type: smForm.value.type, url: smForm.value.url.trim() })
  smForm.value = { _id: '', type: '', url: '' }
}
function removePendingSocial(id: string) {
  pendingSocials.value = pendingSocials.value.filter(s => s._id !== id)
}
async function deleteExistingSocial(id: string) {
  await userSocials.remove(id)
  existingSocials.value = existingSocials.value.filter(s => s.id !== id)
}
async function onSavePendingSocials() {
  if (!pendingSocials.value.length) return
  saving.value = true
  try {
    for (const s of pendingSocials.value) {
      await userSocials.create(s.type as MediaName, s.url)
    }
    pendingSocials.value = []
    const data = await userSocials.list()
    existingSocials.value = data.map(d => ({ id: d.id, name: d.name as MediaName, url: d.url ?? '' }))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
</style>

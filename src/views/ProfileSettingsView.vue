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
              <div class="text-xs text-muted-foreground">{{ email || 'your-email@example.com' }}</div>
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
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
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
                  <span>Change photo</span>
                </Button>
                <span class="text-xs text-muted-foreground align-middle">PNG or JPG up to 2MB</span>
              </div>
            </div>

            <Separator />

            <div class="space-y-2">
              <Label for="displayName">Display name</Label>
              <Input id="displayName" v-model="form.displayName" placeholder="Your display name" />
            </div>

            <div class="space-y-2">
              <Label for="profession">Profession</Label>
              <Input id="profession" v-model="form.profession" placeholder="e.g., Software Engineer" />
            </div>

  <div class="space-y-2">
              <Label for="bio">Bio</Label>
              <Textarea id="bio" v-model="form.bio" rows="4" placeholder="Tell us about yourself" />
            </div>
            
            <Separator />

            <!-- Social Medias (por usuário) -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium">Social Profiles</h3>
              <div class="grid md:grid-cols-[200px_1fr] gap-3 items-end">
                <div>
                  <Label for="smType">Platform</Label>
                  <Select v-model="smForm.type">
                    <SelectTrigger id="smType">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent class="bg-black text-popover-foreground border border-input shadow-lg rounded-md">
                      <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                      <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                      <SelectItem value="GITHUB">GitHub</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <Label for="smUrl">URL</Label>
                    <Input id="smUrl" v-model="smForm.url" placeholder="https://..." />
                  </div>
                  <Button type="button" @click="addPendingSocial" :disabled="!smForm.type || !smForm.url">Add</Button>
                </div>
              </div>

              <div v-if="existingSocials.length" class="space-y-2">
                <div class="text-xs text-muted-foreground">Saved</div>
                <ul class="space-y-2">
                  <li v-for="s in existingSocials" :key="s.id" class="flex items-center justify-between gap-3 border rounded-md px-3 py-2">
                    <div class="text-sm">
                      <span class="font-medium mr-2">{{ prettyMedia(s.name) }}</span>
                      <a :href="s.url" target="_blank" rel="noopener" class="underline text-foreground/80 hover:text-primary break-all">{{ s.url }}</a>
                    </div>
                    <Button variant="secondary" size="sm" @click="deleteExistingSocial(s.id)">Remove</Button>
                  </li>
                </ul>
              </div>

              <div v-if="pendingSocials.length" class="space-y-2">
                <div class="text-xs text-muted-foreground">Pending</div>
                <ul class="space-y-2">
                  <li v-for="s in pendingSocials" :key="s._id" class="flex items-center justify-between gap-3 border rounded-md px-3 py-2">
                    <div class="text-sm">
                      <span class="font-medium mr-2">{{ prettyMedia(s.type) }}</span>
                      <span class="break-all">{{ s.url }}</span>
                    </div>
                    <Button variant="secondary" size="sm" @click="removePendingSocial(s._id)">Discard</Button>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetForm">Discard</Button>
            <Button :disabled="saving" @click="onSaveGeneral">Save</Button>
            <Button :disabled="saving || pendingSocials.length === 0" @click="onSavePendingSocials">Save Socials</Button>
          </CardFooter>
        </Card>

        <!-- Interests -->
        <Card v-else-if="current === 'interests'">
          <CardHeader>
            <CardTitle>My Interests</CardTitle>
            <CardDescription>Add keywords that describe your interests.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Input v-model="interestInput" placeholder="Type and press Enter" @keydown.enter.prevent="addInterest()" />
              <Button variant="secondary" @click="addInterest">Add</Button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="i in form.interests" :key="i" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-foreground/10">
                {{ i }}
                <button class="opacity-70 hover:opacity-100" @click="removeInterest(i)">✕</button>
              </span>
            </div>
          </CardContent>
          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetInterests">Discard</Button>
            <Button :disabled="saving" @click="onSaveInterests">Save</Button>
          </CardFooter>
        </Card>

        <!-- Notifications -->
        <Card v-else>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Contact preferences</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">Email notifications</div>
                <div class="text-xs text-muted-foreground">Receive updates and announcements</div>
              </div>
              <Switch v-model:checked="notifications.email" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">SMS notifications</div>
                <div class="text-xs text-muted-foreground">Uses your verified Cognito number</div>
              </div>
              <Switch v-model:checked="notifications.sms" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">WhatsApp notifications</div>
                <div class="text-xs text-muted-foreground">Number (E.164) is the same as Cognito</div>
              </div>
              <Switch v-model:checked="notifications.whatsapp" />
            </div>
          </CardContent>
          <CardFooter class="justify-end gap-2">
            <Button variant="secondary" @click="resetNotifications">Discard</Button>
            <Button :disabled="saving" @click="onSaveNotifications">Save</Button>
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
const { profile: profileRef, load, saveGeneral, saveInterests, saveNotifications, uploadAvatar, getAvatarUrl } = useProfile()
const userSocials = useProfileSocials()
type MediaName = 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'
const saving = ref(false)
const photoFile = ref<File | null>(null)

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
async function onPickPhoto(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  photoPreview.value = url
  photoFile.value = file
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
    if (photoFile.value) {
      try {
        const path = await uploadAvatar(photoFile.value)
        const url = await getAvatarUrl(path)
        if (url) photoPreview.value = url
        photoFile.value = null
      } catch {}
    }
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

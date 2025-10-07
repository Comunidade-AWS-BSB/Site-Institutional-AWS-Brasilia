import { computed, reactive, ref } from 'vue'
import { getDataClient } from '@/composables/useData'
import type { Schema } from '../../amplify/data/resource'
import type { SelectionSet } from 'aws-amplify/data'

const client = getDataClient('private')

export type Broadcast = Schema['EventBroadcast']['type']

export type BroadcastStatus = Broadcast['status']
export type ScheduleKind = Broadcast['scheduleKind']

const broadcastSelection = [
  'id',
  'eventId',
  'templateBody',
  'scheduleKind',
  'scheduledAtIso',
  'cron',
  'status',
] as const

export type BroadcastRow = SelectionSet<Broadcast, typeof broadcastSelection>

export type BroadcastForm = {
  _id: string
  templateBody: Broadcast['templateBody']
  kind: ScheduleKind
  scheduledAtIso: Broadcast['scheduledAtIso']
  cron: Broadcast['cron']
  cronTimes: string[]
}

const recipients = ref<{ username: string; phoneE164: string }[]>([])
const items = ref<BroadcastRow[]>([])

const broadcastForm = reactive<Omit<BroadcastForm, '_id'>>({
  templateBody: '',
  kind: 'NOW',
  scheduledAtIso: '',
  cron: '',
  cronTimes: []
})

const pendingBroadcasts = ref<BroadcastForm[]>([])
const timeInput = ref('')

const cronExpression = computed(() => {
  if (broadcastForm.cronTimes.length === 0) return ''
  const hours = broadcastForm.cronTimes.map(t => t.split(':')[0]).join(',')
  // dispara no minuto 0, nas horas indicadas, todos os dias
  return `cron(0 ${hours} * * ? *)`
})

/* ======= Data (CRUD via Amplify Data) ======= */
async function listByEvent(eventId: string) {
  const { data, errors } = await client.models.EventBroadcast.list({
    filter: { eventId: { eq: eventId } },
    limit: 500,
    selectionSet: [
      'id',
      'eventId',
      'templateBody',
      'scheduleKind',
      'scheduledAtIso',
      'cron',
      'status',
    ] as const,
    authMode: 'userPool'
  })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  items.value = (data ?? []) as BroadcastRow[]
}

async function createDraft(eventId: string, input: {
  templateBody: Broadcast['templateBody']
  kind: ScheduleKind
  scheduledAtIso?: Broadcast['scheduledAtIso']
  cron?: Broadcast['cron']
}) {
  const { data, errors } = await client.models.EventBroadcast.create({
    eventId,
    templateBody: input.templateBody,
    scheduleKind: input.kind,
    scheduledAtIso: input.kind === 'AT' ? input.scheduledAtIso : undefined,
    cron: input.kind === 'CRON' ? input.cron : undefined,
    status: 'draft'
  }, { authMode: 'userPool' })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  return data as BroadcastRow
}

async function update(broadcastId: string, patch: Partial<Omit<BroadcastRow, 'id' | 'eventId'>>) {
  const { data, errors } = await client.models.EventBroadcast.update({
    id: broadcastId,
    templateBody: patch.templateBody,
    scheduleKind: patch.scheduleKind,
    scheduledAtIso: patch.scheduledAtIso,
    cron: patch.cron,
    status: patch.status,
  }, { authMode: 'userPool' })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  return data as BroadcastRow
}

async function remove(broadcastId: string) {
  const { data, errors } = await client.models.EventBroadcast.delete({ id: broadcastId }, { authMode: 'userPool' })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  return data
}

/* ======= Lambdas (ações) ======= */
async function loadRecipients(group?: string) {
  const { data, errors } = await client.queries.previewRecipients({ group })
  if (errors?.length) throw new Error(errors.map((e) => (e as any).message).join('; '))
  const raw = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.previewRecipients)
      ? (data as any).previewRecipients
      : []
  recipients.value = raw.filter(Boolean) as { username: string; phoneE164: string }[]
}

async function startNow(broadcastId: string) {
  const { data, errors } = await client.mutations.startBroadcast({ broadcastId })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  // opcional: refletir estado no item
  const idx = items.value.findIndex(b => b.id === broadcastId)
  if (idx >= 0) items.value[idx] = { ...items.value[idx], status: 'running' }
  return data // { ok, created }
}

async function schedule(broadcastId: string) {
  const { data, errors } = await client.mutations.scheduleBroadcast({ broadcastId })
  if (errors?.length) throw new Error(errors.map((e: any) => e.message).join('; '))
  const idx = items.value.findIndex(b => b.id === broadcastId)
  if (idx >= 0) items.value[idx] = { ...items.value[idx], status: 'scheduled' }
  return data // boolean
}

/* ======= Helpers de formulário ======= */
function addTime() {
  if (timeInput.value && !broadcastForm.cronTimes.includes(timeInput.value)) {
    broadcastForm.cronTimes.push(timeInput.value)
    timeInput.value = ''
  }
}

function removeTime(t: string) {
  broadcastForm.cronTimes = broadcastForm.cronTimes.filter(ct => ct !== t)
}

function addBroadcastToPending() {
  if (!broadcastForm.templateBody.trim()) return
  const cron = broadcastForm.kind === 'CRON' ? cronExpression.value : ''
  pendingBroadcasts.value.push({
    _id: crypto.randomUUID(),
    templateBody: broadcastForm.templateBody.trim(),
    kind: broadcastForm.kind,
    scheduledAtIso: broadcastForm.scheduledAtIso,
    cron,
    cronTimes: [...broadcastForm.cronTimes]
  })
  // reset
  broadcastForm.templateBody = ''
  broadcastForm.kind = 'NOW'
  broadcastForm.scheduledAtIso = ''
  broadcastForm.cronTimes = []
  timeInput.value = ''
}

function removePendingBroadcast(id: string) {
  pendingBroadcasts.value = pendingBroadcasts.value.filter(b => b._id !== id)
}

async function submitBroadcasts(eventId: string, broadcasts: BroadcastForm[]) {
  for (const b of broadcasts) {
    await createDraft(eventId, {
      templateBody: b.templateBody,
      kind: b.kind,
      scheduledAtIso: b.kind === 'AT' ? b.scheduledAtIso : undefined,
      cron: b.kind === 'CRON' ? b.cron : undefined
    })
  }
}

function clearAll() {
  items.value = []
  recipients.value = []
  pendingBroadcasts.value = []
  broadcastForm.templateBody = ''
  broadcastForm.kind = 'NOW'
  broadcastForm.scheduledAtIso = ''
  broadcastForm.cronTimes = []
  timeInput.value = ''
}

export function useBroadcasts() {
  return {
    // state
    items,
    recipients,
    broadcastForm,
    pendingBroadcasts,
    timeInput,
    cronExpression,

    // CRUD
    listByEvent,
    createDraft,
    update,
    remove,

    // actions
    loadRecipients,
    startNow,
    schedule,

    // form helpers
    addTime,
    removeTime,
    addBroadcastToPending,
    removePendingBroadcast,
    submitBroadcasts,
    clearAll,
  }
}

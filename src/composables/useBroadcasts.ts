import { ref } from "vue"
import { getDataClient } from "./useData"

const client = getDataClient('private')

const recipients = ref<{ username: string; phoneE164: string }[]>([])

async function loadRecipients(group?: string) {
  const { data, errors } = await client.queries.previewRecipients({ group })
  if (errors?.length) throw new Error(errors.map((e: Record<string, unknown>) => e.message).join('; '))
  recipients.value = data ?? []
}

async function startNow(broadcastId: string) {
  const { data, errors } = await client.mutations.startBroadcast({ broadcastId })
  if (errors?.length) throw new Error(errors.map((e: Record<string, unknown>) => e.message).join('; '))
  return data
}

async function schedule(broadcastId: string) {
  const { data, errors } = await client.mutations.scheduleBroadcast({ broadcastId })
  if (errors?.length) throw new Error(errors.map((e: Record<string, unknown>) => e.message).join('; '))
  return data
}

export function useBroadcasts() {
  return {
    recipients,
    loadRecipients,
    startNow,
    schedule
  }
}

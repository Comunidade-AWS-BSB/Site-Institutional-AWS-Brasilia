// src/composables/useBroadcasts.ts
import { http } from '@/lib/http'

// Tipos iguais aos seus
export type BroadcastForm = {
  _id: string
  templateBody: string
  kind: 'NOW'|'AT'|'CRON'
  scheduledAtIso: string
  cron: string
  cronTimes: string[]
}

export function useBroadcasts() {
  async function previewRecipients(group = 'MEMBERS') {
    const { data } = await http.get('/admin/users', { params: { group } })
    // retorna [{ username, phoneE164 }]
    return data as { username: string; phoneE164: string }[]
  }

  async function createBroadcast(input: {
    eventId: string
    templateBody: string
    scheduleKind: 'NOW'|'AT'|'CRON'
    scheduledAtIso?: string
    cron?: string
    // opcional: targetGroups
  }) {
    const { data } = await http.post('/broadcasts', input)
    return data as { broadcastId: string }
  }

  async function startNow(broadcastId: string) {
    await http.post(`/broadcasts/${broadcastId}/start`)
  }

  async function schedule(broadcastId: string) {
    await http.post(`/broadcasts/${broadcastId}/schedule`)
  }

  async function listOutbound(broadcastId: string) {
    const { data } = await http.get(`/broadcasts/${broadcastId}/outbound`)
    return data // array de OutboundMessage
  }

  return { previewRecipients, createBroadcast, startNow, schedule, listOutbound }
}

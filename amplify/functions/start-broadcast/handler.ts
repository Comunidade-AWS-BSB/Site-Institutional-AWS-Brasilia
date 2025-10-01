import type { Schema } from "../../data/resource";
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/start-broadcast'

import {
    CognitoIdentityProviderClient,
    ListUsersCommand
} from '@aws-sdk/client-cognito-identity-provider'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)
Amplify.configure(resourceConfig, libraryOptions)
const client = generateClient<Schema>()

const idp = new CognitoIdentityProviderClient({})

type Handler = Schema['startBroadcast']['functionHandler']
export const handler: Handler = async (event) => {
    const { broadcastId } = event.arguments

    const { data: broadcast } = await client.models.EventBroadcast.get({ id: broadcastId })
    if (!broadcast) return { ok: false, created: 0 }

    const { data: eventModel } = await client.models.Event.get({ id: broadcast.eventId })
    if (!eventModel) return { ok: false, created: 0 }

    const users = await idp.send(new ListUsersCommand({ UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID }))
    const recipients = (users.Users ?? [])
        .map(u => u.Attributes?.find(a => a.Name === 'phone_number')?.Value)
        .filter(Boolean) as string[]
    
    await client.models.EventBroadcast.update({ id: broadcastId, status: 'running' })

    const baseUrl = env.EVOLUTION_BASE_URL
    const instance = env.EVOLUTION_INSTANCE
    const apiKey = env.EVOLUTION_API_KEY

    const  text = broadcast.templateBody

    let created = 0
    for (const phone of recipients) {
        try {
            const res = await fetch(`${baseUrl}/message/sendText/${instance}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apiKey': apiKey },
                body: JSON.stringify({ number: phone, text })
            })
            const json = await res.json().catch(() => ({}))

            const providerMessageId = json?.id ?? json?.messageId ?? undefined
            const providerStatus: 'PENDING' | 'SENT' | 'RECEIVED' = res.ok ? 'SENT' : 'PENDING'

            await client.models.OutboundMessage.create({
                broadcastId,
                phone,
                providerMessageId,
                providerStatus,
                attempts: 1,
                lastUpdateIso: new Date().toISOString()
            })
            created++
        } catch (err) {
            await client.models.OutboundMessage.create({
                broadcastId,
                phone,
                providerStatus: 'PENDING',
                attempts: 1,
                error: String((err as Record<string, unknown>)?.message ?? err),
                lastUpdateIso: new Date().toISOString()
            })
        }
    }

    await client.models.EventBroadcast.update({
        id: broadcastId,
        status: created > 0 ? 'done' : 'failed'
    })

    return { ok: created > 0, created }
}

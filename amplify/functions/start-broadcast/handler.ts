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
    console.log('startBroadcast invocado', { event })

    const { broadcastId } = event.arguments
    console.log('broadcastId:', broadcastId)

    const { data: broadcast, errors: bErr } = await client.models.EventBroadcast.get({ id: broadcastId })
    console.log('broadcast obtido:', { broadcast, bErr })
    if (!broadcast) {
        console.error('Broadcast não foi encontrado')
        return { ok: false, created: 0 }
    }

    const { data: eventModel, errors: eErr } = await client.models.Event.get({ id: broadcast.eventId })
    console.log('Evento obtido:', { eventModel, eErr })
    if (!eventModel) {
        console.error('Sem evento encontrado')
        return { ok: false, created: 0 }
    }

    let users
    try {
        users = await idp.send(new ListUsersCommand({ UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID }))
        console.log('Cognito users:', users?.Users?.length)
    } catch (err) {
        console.error('Erro listando os usuários:', err)
        throw err
    }

    const recipients = (users.Users ?? [])
        .map(u => u.Attributes?.find(a => a.Name === 'phone_number')?.Value)
        .filter(Boolean) as string[]
    console.log('Telefones dos destinatários:', recipients)

    await client.models.EventBroadcast.update({ id: broadcastId, status: 'running' })
    console.log('Status definido para "running"')

    const baseUrl = env.EVOLUTION_BASE_URL
    const instance = env.EVOLUTION_INSTANCE
    const apiKey = env.EVOLUTION_API_KEY
    console.log('Config do evolution:', { baseUrl, instance })

    const text = broadcast.templateBody
    let created = 0

    for (const phone of recipients) {
        try {
            console.log('Mandando para:', phone)
            const res = await fetch(`${baseUrl}/message/sendText/${instance}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apiKey': apiKey },
                body: JSON.stringify({ number: phone, text })
            })
            console.log('Status obtido da resposta:', res.status)
            const json = await res.json().catch(() => ({}))
            console.log('JSON obtido:', json)

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
            console.error('Erro ao enviar para:', phone, err)
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
    console.log('Status final definido, contador:', created)

    return { ok: created > 0, created }
}

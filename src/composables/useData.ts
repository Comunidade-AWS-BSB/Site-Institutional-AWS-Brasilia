// src/composables/useData.ts
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'
import { getCurrentUser } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

type Client = ReturnType<typeof generateClient<Schema>>

let publicClient: Client | null = null
let privateClient: Client | null = null

// estado interno do modo atual
let authMode: 'public' | 'private' = 'public'

// cria (lazy) os dois clientes; chamamos quando necessário
function ensureClients() {
    if (!publicClient) publicClient = generateClient<Schema>({ authMode: 'apiKey' })
    if (!privateClient) privateClient = generateClient<Schema>({ authMode: 'userPool' })
}

// tenta descobrir o modo logo no boot e quando auth muda
async function probeAuthMode() {
    try {
        await getCurrentUser()
        authMode = 'private'
    } catch {
        authMode = 'public'
    }
}

// ouvir eventos de autenticação para alternar automaticamente
Hub.listen('auth', ({ payload }) => {
    const ev = payload?.event
    if (ev === 'signedIn') authMode = 'private'
    if (ev === 'signedOut' || ev === 'tokenRefresh_failure') authMode = 'public'
})

// faça um probe inicial (não bloqueia)
void probeAuthMode()

/**
 * Retorna um client já pronto para uso, de forma SÍNCRONA.
 * Ele alterna entre apiKey (público) e userPool (privado) com base
 * no último estado detectado de autenticação.
 */
export function getDataClient() {
    ensureClients()
    return authMode === 'private' ? (privateClient as Client) : (publicClient as Client)
}

/**
 * Se precisarmos forçar rechecagem manual em algum ponto:
 */
export async function refreshAuthMode() {
    await probeAuthMode()
}

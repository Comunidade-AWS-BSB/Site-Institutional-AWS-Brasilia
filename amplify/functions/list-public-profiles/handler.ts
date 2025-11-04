import type { Schema } from "../../data/resource";
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/list-public-profiles'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)
Amplify.configure(resourceConfig, libraryOptions)
const client = generateClient<Schema>()

type Handler = Schema['listPublicProfiles']['functionHandler']

export const handler: Handler = async (event) => {
  const args = event.arguments || {}
  const q = (args.q ?? '').toString().trim().toLowerCase()
  const profession = (args.profession ?? '').toString().trim().toLowerCase()
  const interest = (args.interest ?? '').toString().trim().toLowerCase()
  const page = Math.max(1, Number(args.page) || 1)
  const pageSize = Math.min(48, Math.max(1, Number(args.pageSize) || 24))

  // Primeiro filtro server-side mínimo por isPublic (+ opcional active)
  const selection = [
    'id',
    'displayName',
    'profession',
    'bio',
    'interests',
    'photoUrl',
    'isPublic',
    'active',
  ] as const

  let nextToken: string | null | undefined = undefined
  const collected: Array<Pick<Schema['UserProfile']['type'], typeof selection[number]>> = []

  // Coleta até um limite razoável no MVP
  const softCap = page * pageSize * 3 // heurística simples

  while (collected.length < softCap) {
    const resp = await client.models.UserProfile.list({
      limit: 100,
      nextToken,
      selectionSet: selection,
      filter: {
        isPublic: { eq: true },
        // No MVP, considerar "active" opcional; se o campo não existir nos registros antigos, o filtro ignora
        // active: { eq: true },
      },
    })

    const data = resp.data
    const errors = resp.errors
    const nt = resp.nextToken as string | null | undefined

    if (errors?.length) {
      // Em caso de erro, retorna vazio de forma segura
      break
    }

    collected.push(...((data ?? []) as any[]))
    nextToken = nt
    if (!nextToken) break
  }

  // Filtros adicionais in-memory (MVP e baixo volume)
  const filtered = collected.filter((p) => {
    if (!p?.isPublic) return false
    // Se quisermos exigir atividade já: if (p.active === false) return false

    const dn = (p.displayName ?? '').toLowerCase()
    const pf = (p.profession ?? '').toLowerCase()
    const bio = (p.bio ?? '').toLowerCase()
    const ints = Array.isArray(p.interests) ? p.interests.map((i) => String(i).toLowerCase()) : []

    if (profession && !pf.includes(profession)) return false
    if (interest && !ints.some((i) => i.includes(interest))) return false
    if (q && !(dn.includes(q) || pf.includes(q) || bio.includes(q))) return false
    return true
  })

  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  // Projeta apenas o tipo público
  const publicItems = await Promise.all(pageItems.map(async (p) => {
    // Busca redes sociais vinculadas ao usuário
    const { data: mediasRaw } = await client.models.SocialMedia.list({
      filter: { userId: { eq: p.id } },
      selectionSet: ['name', 'url'] as const,
      limit: 20,
    })

    const medias = (mediasRaw ?? [])
      .map((m: any) => ({ name: m?.name, url: m?.url }))
      .filter((m) => typeof m.name === 'string' && typeof m.url === 'string')

    return {
      id: p.id,
      displayName: p.displayName ?? '',
      profession: p.profession ?? '',
      bio: p.bio ?? '',
      interests: Array.isArray(p.interests) ? p.interests : [],
      photoUrl: p.photoUrl ?? '',
      medias,
    }
  }))

  return publicItems
}

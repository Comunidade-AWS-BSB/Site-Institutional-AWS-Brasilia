// Singleton do GraphQL Data Client
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'

type Client = ReturnType<typeof generateClient<Schema>>

let _client: Client | null = null

export function getDataClient(): Client {
  if (!_client) _client = generateClient<Schema>()
  return _client
}

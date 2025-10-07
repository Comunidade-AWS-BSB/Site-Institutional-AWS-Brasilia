import { CognitoIdentityProviderClient, ListUsersCommand, ListUsersInGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
import type { Schema } from '../../data/resource'
import { env } from '$amplify/env/preview-recipients'

export const handler: Schema["previewRecipients"]["functionHandler"] = async (event) => {
  const group = event.arguments.group // filtro opcional
  const region = process.env.AWS_REGION!
  const userPoolId = env.AMPLIFY_AUTH_USERPOOL_ID

  const idp = new CognitoIdentityProviderClient({ region })
  const users = group
    ? await idp.send(new ListUsersInGroupCommand({ UserPoolId: userPoolId, GroupName: group }))
    : await idp.send(new ListUsersCommand({ UserPoolId: userPoolId }))

  const items = (users.Users ?? [])
    // Filtro comentado pois atualmente ainda não temos fluxo de verificação de telefone
    // .filter(u => u.Attributes?.find(a => a.Name === 'phone_number_verified')?.Value === 'true')
    .map(user => {
      const attributes = user.Attributes ?? []
      const phone = attributes.find(a => a.Name === 'phone_number')?.Value?.trim()
      if (!phone) return null

      const preferred = attributes.find(a => a.Name === 'preferred_username')?.Value?.trim()
      const email = attributes.find(a => a.Name === 'email')?.Value?.trim()

      const username = preferred || email
      if (!username) return null

      return {
        username,
        phoneE164: phone
      }
    })
    .filter((item): item is { username: string; phoneE164: string } => Boolean(item))

  return items
}

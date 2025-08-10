import { referenceAuth } from '@aws-amplify/backend'

export const auth = referenceAuth({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID!,
  identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID!,
  authRoleArn: process.env.COGNITO_AUTH_ROLE_ARN!,
  unauthRoleArn: process.env.COGNITO_UNAUTH_ROLE_ARN!,
  groups: {
    ADMINS: process.env.COGNITO_GROUP_ADMINS_ROLE_ARN!,
    USERS:  process.env.COGNITO_GROUP_USERS_ROLE_ARN!,
  },
})

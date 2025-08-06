import { defineAuth, secret } from '@aws-amplify/backend'

export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        attributeMapping: {
          email: 'email',
          phoneNumber: 'phone'
        }
      },
      callbackUrls: [
        import.meta.env.VITE_DEVELOPMENT_URL,
        import.meta.env.VITE_PRODUCTION_URL
      ],
      logoutUrls: [
        import.meta.env.VITE_DEVELOPMENT_URL,
        import.meta.env.VITE_PRODUCTION_URL
      ]
    }
  },
  // Pra possibilitar interação em blogs/posts no futuro e identificação dos usuários de maneira flexível
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
  // Podemos possivelmente querer mudar isso no futuro pra adicionar um grupo de palestrantes
  groups: [
    'ADMINS',
    // "SPEAKERS",
    'USERS',
  ],
})

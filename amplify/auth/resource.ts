import { defineAuth, secret } from '@aws-amplify/backend'

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "📜 Bem-vindo(a) à AWS User Group Brasília!",
      verificationEmailBody: (createCode) => `Use o código a seguir para confirmar sua conta: ${createCode()}`,
      userInvitation: {
        emailSubject: "📜 Bem-vindo(a) à AWS User Group Brasília!",
        emailBody: () => `🎉 Olá {username}! Estamos felizes em te receber na comunidade. Seu código de convite é {####}. Explore o site para entrar em contato e descobrir mais informações.`,
      },
    },
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        // Escopos recomendados: sempre incluir 'email' além de 'openid profile'
        scopes: ['openid', 'profile', 'email'],
        // Mapeamento explícito de atributos obrigatórios + nickname
        // Google OIDC claims de referência: https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
        attributeMapping: {
          email: 'email',
          // Usar 'name' do Google como base para preferred_username/nickname no Cognito
          preferredUsername: 'name',
          // phoneNumber pode depender de consentimento; manter opcional
          phoneNumber: 'phone'
        }
      },
      // URLs de callback/sign-out devem bater com as URIs autorizadas no Google e no domínio Cognito
      callbackUrls: [
        'http://localhost:5173',
        'https://awsbrasilia.com.br'
      ],
      logoutUrls: [
        'http://localhost:5173',
        'https://awsbrasilia.com.br'
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

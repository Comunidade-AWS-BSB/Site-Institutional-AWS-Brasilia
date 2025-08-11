// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'

import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'

const backend = defineBackend({ auth, data, storage })

// User Pool criado pelo defineAuth
const userPool = backend.auth.resources.userPool

const domainName = 'auth.awsbrasilia.com.br'
const certArn = process.env.COGNITO_CUSTOM_CERT_ARN!
const hostedZoneId = process.env.ROUTE53_ZONE_ID!

if (certArn && hostedZoneId) {
  const cert = acm.Certificate.fromCertificateArn(
    backend.stack,
    'AuthCustomCert',
    certArn
  )

  // Domínio customizado do Cognito (Hosted UI)
  const userPoolDomain = new cognito.UserPoolDomain(
    backend.stack,
    'AuthCustomDomain',
    {
      userPool,
      customDomain: {
        domainName,
        certificate: cert,
      },
    }
  )

  // Hosted Zone só com ID
  const zone = route53.HostedZone.fromHostedZoneId(
    backend.stack,
    'PrimaryZone',
    hostedZoneId
  )

  // Alias para o domínio do Cognito (CloudFront) — subdomínio "auth"
  new route53.ARecord(backend.stack, 'AuthAliasA', {
    zone,
    recordName: 'auth', // subdomínio de awsbrasilia.com.br
    target: route53.RecordTarget.fromAlias(
      new targets.UserPoolDomainTarget(userPoolDomain)
    ),
  })
}

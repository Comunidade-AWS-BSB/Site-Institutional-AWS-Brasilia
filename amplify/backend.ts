import { defineBackend } from '@aws-amplify/backend'
import { aws_certificatemanager as acm, aws_route53 as route53, aws_route53_targets as targets, Stack } from 'aws-cdk-lib'
import { auth } from './auth/resource'
import { data } from './data/resource'

const backend = defineBackend({ auth, data })

const userPool = backend.auth.resources.userPool

// 1) Cert em us-east-1
const certArn = process.env.COGNITO_CUSTOM_CERT_ARN!
const cert = acm.Certificate.fromCertificateArn(Stack.of(userPool), 'AuthCert', certArn)

// 2) Domínio custom no Cognito
const domain = userPool.addDomain('CustomAuthDomain', {
  customDomain: {
    domainName: 'auth.awsbrasilia.com.br',
    certificate: cert,
  },
})

// 3) Alias no Route53 para o domínio do Cognito
const zone = route53.HostedZone.fromHostedZoneAttributes(
  Stack.of(userPool),
  'Zone',
  {
    hostedZoneId: process.env.ROUTE53_ZONE_ID!,
    zoneName: 'awsbrasilia.com.br',
  }
)

new route53.ARecord(Stack.of(userPool), 'AuthAliasRecord', {
  zone,
  recordName: 'auth',
  target: route53.RecordTarget.fromAlias(new targets.UserPoolDomainTarget(domain)),
})

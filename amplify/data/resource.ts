import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

// Handlers e tipos das lambdas
import { previewRecipientsFn } from '../functions/preview-recipients/resource'
import { startBroadcastFn } from '../functions/start-broadcast/resource'
import { scheduleBroadcastFn } from '../functions/schedule-broadcast/resource'


/** Tipos */
const EventType = a.enum(['MEETUP', 'WORKSHOP', 'TALK'])

const MediaType = a.enum(['LINKEDIN', 'INSTAGRAM', 'GITHUB', 'MEDIUM', 'OTHER'])

const SocialMedia = a.model({
  name: MediaType,
  url: a.url(),
  // Mantém compatibilidade: speakerId pode existir, mas passa a ser opcional para suportar perfis de usuário
  speakerId: a.id(),
  speaker: a.belongsTo('Speaker', 'speakerId'),
  // Vínculo para perfis de usuário
  userId: a.id(),
  user: a.belongsTo('UserProfile', 'userId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** Perfil do Usuário (final) */
const UserProfile = a.model({
  id: a.id().required(), // sub do Cognito
  displayName: a.string(),
  profession: a.string(),
  bio: a.string(),
  interests: a.string().array(),
  photoKey: a.string(),
  photoUrl: a.url(),
  notifyEmail: a.boolean(),
  notifySms: a.boolean(),
  notifyWhatsApp: a.boolean(),

  // Relações 1‑N: redes sociais do usuário (nova FK opcional)
  medias: a.hasMany('SocialMedia', 'userId'),
}).authorization((allow) => [
  allow.owner().to(['create', 'read', 'update']),
  allow.group('ADMINS').to(['read', 'update']),
])

/** Modelo de Palestrante */
const Speaker = a.model({
  name: a.string().required(),
  title: a.string(),
  imageKey: a.string(), // Referencia objectKey no S3
  bioIntro: a.string(),
  bioExperience: a.string(),
  bioExpertise: a.string(),
  skills: a.string().array(),

  // Relações 1‑N (um speaker pode ter várias talks e social medias)
  talks: a.hasMany('Talk', 'speakerId'),
  medias: a.hasMany('SocialMedia', 'speakerId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** Modelo de Evento
 *  Observação: campos “planos” para venue e rótulos (dateLabel/timeLabel)
 *  e coleções normalizadas como modelos relacionados (FAQ, Sponsor, Image).
 */
const Event = a.model({
  title: a.string().required(),
  theme: a.string(),
  type: EventType,
  date: a.date(),
  time: a.time(),
  dateLabel: a.string(),
  timeLabel: a.string(),
  location: a.string(),
  description: a.string(),
  hashtags: a.string().array(),
  bannerKey: a.string(), // Referencia objectKey no S3
  isCurrent: a.boolean(),

  // Venue “flat” (mantém simples e direto)
  venueName: a.string(),
  venueAddress: a.string(),
  venueMapUrl: a.url(),

  // Relações 1‑N
  talks: a.hasMany('Talk', 'eventId'),
  faqs: a.hasMany('EventFaq', 'eventId'),
  sponsors: a.hasMany('EventSponsor', 'eventId'),
  gallery: a.hasMany('EventImage', 'eventId'),

  broadcasts: a.hasMany('EventBroadcast', 'eventId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** Palestra (Talk) – ligação Event x Speaker */
const Talk = a.model({
  title: a.string().required(),
  abstract: a.string(),
  order: a.integer(),
  durationMinutes: a.integer(),

  // FK + relacionamento
  eventId: a.id().required(),
  event: a.belongsTo('Event', 'eventId'),

  speakerId: a.id().required(),
  speaker: a.belongsTo('Speaker', 'speakerId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** FAQ do Evento */
const EventFaq = a.model({
  question: a.string().required(),
  answer: a.string().required(),

  eventId: a.id().required(),
  event: a.belongsTo('Event', 'eventId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** Patrocinador do Evento */
const EventSponsor = a.model({
  name: a.string().required(),
  logoKey: a.string(), // Referencia objectKey no S3

  eventId: a.id().required(),
  event: a.belongsTo('Event', 'eventId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** Imagem do Evento (galeria) */
const EventImage = a.model({
  src: a.string().required(), // Deve referenciar objectKey no S3
  alt: a.string(),

  eventId: a.id().required(),
  event: a.belongsTo('Event', 'eventId'),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
])

/** Modelos de mensageria */

const BroadcastStatus = a.enum(['draft', 'scheduled', 'running', 'done', 'failed', 'cancelled'])

const EventBroadcast = a.model({
  eventId: a.id().required(),
  event: a.belongsTo('Event', 'eventId'),

  templateBody: a.string().required(),

  scheduleKind: a.enum(['NOW', 'AT', 'CRON']),
  scheduledAtIso: a.string(), // quando kind = AT
  cron: a.string(), // quando kind = CRON

  status: BroadcastStatus,

  messages: a.hasMany('OutboundMessage', 'broadcastId')
}).authorization(allow => [
  allow.group('ADMINS').to(['create', 'read', 'update', 'delete'])
])

const OutboundMessage = a.model({
  broadcastId: a.id().required(),
  broadcast: a.belongsTo('EventBroadcast', 'broadcastId'),

  phone: a.string(), // Espera-se o formato E164 (já presente no Cognito)
  providerMessageId: a.string(),
  providerStatus: a.enum(['PENDING', 'SENT', 'RECEIVED']),

  attempts: a.integer(),
  error: a.string(),
  lastUpdateIso: a.string()
}).authorization(allow => [
  allow.group('ADMINS').to(['create', 'read', 'update', 'delete'])
])

/** Esquema raiz */
const schema = a.schema({
  Recipient: a.customType({ 
    username: a.string(), 
    phoneE164: a.string() 
  }),
  StartResult: a.customType({ 
    ok: a.boolean(), 
    created: a.integer() 
  }),

  // Modelos
  Speaker,
  Event,
  Talk,
  EventFaq,
  EventSponsor,
  EventImage,
  SocialMedia,
  UserProfile,
  EventBroadcast,
  OutboundMessage,

  // Funções
  previewRecipients: a.query()
    .arguments({ group: a.string() }) // filtro opcional por grupo
    .returns(a.ref('Recipient').array())
    .authorization(allow => [allow.group('ADMINS')])
    .handler(a.handler.function(previewRecipientsFn)),

  startBroadcast: a.mutation()
    .arguments({ broadcastId: a.id().required() })
    .returns(a.ref('StartResult'))
    .authorization(allow => [allow.group('ADMINS')])
    .handler(a.handler.function(startBroadcastFn)),

  scheduleBroadcast: a.mutation()
    .arguments({ broadcastId: a.id().required() })
    .returns(a.boolean())
    .authorization(allow => [allow.group('ADMINS')])
    .handler(a.handler.function(scheduleBroadcastFn))
}).authorization(allow => [
  allow.resource(previewRecipientsFn).to(['query']),
  allow.resource(startBroadcastFn).to(['query', 'mutate']),
  allow.resource(scheduleBroadcastFn).to(['query'])
])

export type Schema = ClientSchema<typeof schema>

/**
 * Authorization Modes:
 * - default: userPool (usa o Cognito configurado via defineAuth)
 * - apiKey: leitura pública (read‑only) para visitantes
 */
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
})

import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

/** Tipos */
const EventType = a.enum(['MEETUP', 'WORKSHOP', 'TALK'])

const MediaType = a.enum(['LINKEDIN', 'INSTAGRAM', 'GITHUB', 'MEDIUM', 'OTHER'])

const SocialMedia = a.model({
  name: MediaType,
  url: a.url(),
  speakerId: a.id().required(),
  speaker: a.belongsTo("Speaker", "speakerId"),
}).authorization((allow) => [
  allow.group('ADMINS').to(['create', 'update', 'delete', 'read']),
  allow.authenticated().to(['read']),
  allow.publicApiKey().to(['read']),
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
})

const OutboundMessage = a.model({
  broadcastId: a.id().required(),
  broadcast: a.belongsTo('EventBroadcast', 'broadcastId'),

  phone: a.string(), // Espera-se o formato E164 (já presente no Cognito)
  providerMessageId: a.string(),
  providerStatus: a.enum(['PENDING', 'SENT', 'RECEIVED']),

  attempts: a.integer(),
  error: a.string(),
  lastUpdateIso: a.string()
})

/** Esquema raiz */
const schema = a.schema({
  Speaker,
  Event,
  Talk,
  EventFaq,
  EventSponsor,
  EventImage,
  SocialMedia,
  EventBroadcast,
  OutboundMessage
})

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

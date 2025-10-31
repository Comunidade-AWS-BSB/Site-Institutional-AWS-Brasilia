export const ACCESS_PREFIX = 'public/' as const;

// Raiz de assets
export const ASSETS_ROOT = `${ACCESS_PREFIX}assets/` as const;

// Raiz de fotos de perfil
export const PROFILE_PICTURES_ROOT = `${ACCESS_PREFIX}profile-pictures/{entity_id}/*`;

// Coleções
export const EVENTS_PREFIX = `${ASSETS_ROOT}events/` as const;
export const SPEAKERS_PREFIX = `${ASSETS_ROOT}speakers/` as const;
export const USERS_PREFIX = `${ASSETS_ROOT}users/` as const;

// Galerias do site no S3
export const SITE_GALLERY_PREFIX = `${EVENTS_PREFIX}site/gallery`;
export const SITE_CAROUSEL_PREFIX = `${EVENTS_PREFIX}site/carousel/`;

// Helpers pra nomes estáveis
export function buildEventBannerPath(eventId: string, filename: string) {
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
    return `${EVENTS_PREFIX}${eventId}/banner-${Date.now()}.${ext}`;
}

export function buildSpeakerAvatarPath(speakerId: string, filename: string) {
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
    return `${SPEAKERS_PREFIX}${speakerId}/avatar-${Date.now()}.${ext}`;
}

export function buildUserAvatarPath(userId: string, filename: string) {
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
    return `${USERS_PREFIX}${userId}/avatar-${Date.now()}.${ext}`;
}

export function buildSponsorLogoPath(eventId: string, fileName: string) {
  const ext = fileName.split('.').pop() || 'png'
  const ts = Date.now()
  return `${EVENTS_PREFIX}${eventId}/sponsors/${crypto.randomUUID()}-${ts}.${ext}`
}

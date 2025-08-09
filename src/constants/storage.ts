export const ACCESS_PREFIX = 'public/' as const;

// Raiz de assets
export const ASSETS_ROOT = `${ACCESS_PREFIX}assets/` as const;

// Coleções
export const EVENTS_PREFIX = `${ASSETS_ROOT}events/` as const;
export const SPEAKERS_PREFIX = `${ASSETS_ROOT}speakers/` as const;

// Helpers pra nomes estáveis
export function buildEventBannerPath(eventId: string, filename: string) {
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
    return `${EVENTS_PREFIX}${eventId}/banner-${Date.now()}.${ext}`;
}

export function buildSpeakerAvatarPath(speakerId: string, filename: string) {
    const ext = (filename.split('.').pop() || 'jpg').toLowerCase();
    return `${SPEAKERS_PREFIX}${speakerId}/avatar-${Date.now()}.${ext}`;
}

/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEVELOPMENT_URL: string;
  readonly VITE_PRODUCTION_URL: string;
  readonly VITE_AUTH_HIDE_GOOGLE_BUTTON?: string; // 'true' para ocultar botão Google no Authenticator
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

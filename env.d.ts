/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEVELOPMENT_URL: string;
  readonly VITE_PRODUCTION_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "1" no build estático (`npm run build:static`). */
  readonly VITE_STATIC_SITE?: string;
}

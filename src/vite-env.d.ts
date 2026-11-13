/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALLOW_SANDBOX?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_HPVN_FUNCTIONS_URL?: string;
}

declare module 'input-switch-polyfill';

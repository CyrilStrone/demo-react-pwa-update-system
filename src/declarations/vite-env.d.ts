/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_DEFAULT_DESCRIPTION: string;
  readonly VITE_DEFAULT_NAME: string;
  readonly VITE_DEFAULT_NAME_SHORT: string;
  readonly VITE_DEFAULT_THEME_COLOR: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_NODE_ENV: 'dev' | 'prod' | 'stage';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void | Promise<void>;
    onOfflineReady?: () => void | Promise<void>;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void | Promise<void>;
    onRegisterError?: (error: unknown) => void | Promise<void>;
  };

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

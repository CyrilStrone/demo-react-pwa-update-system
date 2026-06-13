import App from '@local/app';

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@jenesei-software/jenesei-kit-react/styles.css';
import '@fontsource/inter/100.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';

import { ClassSw } from '@local/classes/class-sw';
import { env } from '@local/core/envs';

import { logger } from './core/logger';

export const swService = new ClassSw();
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

try {
  swService.init({
    enabled: env.mode === 'prod',
  });
  swService.setCurrentVersion(env.version ?? null);
} catch (e) {
  logger.warn('SW init failed', e);
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

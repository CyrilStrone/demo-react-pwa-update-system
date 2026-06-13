import { usePWA } from '@local/contexts/context-pwa';
import { env } from '@local/core/envs';
import { tableString } from '@local/core/functions';
import { logger } from '@local/core/logger';
import { LayoutRoutePrivate, LayoutRoutePublic } from '@local/core/router';

import { Outlet, useMatches, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { type CSSProperties, type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type TPWAUpdateMode = 'manual' | 'automatic';

const PWA_UPDATE_MODE_STORAGE_KEY = 'pwa-update-mode';

const readUpdateMode = (): TPWAUpdateMode => {
  if (typeof window === 'undefined') return 'manual';

  const storedMode = window.localStorage.getItem(PWA_UPDATE_MODE_STORAGE_KEY);

  return storedMode === 'automatic' || storedMode === 'manual' ? storedMode : 'manual';
};

const pwaControlsStyle: CSSProperties = {
  position: 'fixed',
  right: 16,
  bottom: 16,
  zIndex: 10,
  display: 'grid',
  gap: 8,
  width: 'min(340px, calc(100vw - 32px))',
  padding: 12,
  background: '#ffffff',
  border: '1px solid #d7dce2',
  borderRadius: 8,
  boxShadow: '0 12px 28px rgba(17, 24, 39, 0.14)',
};

const pwaControlsHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
};

const pwaControlsActionsStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const pwaControlsTextStyle: CSSProperties = {
  margin: 0,
  color: '#475569',
  fontSize: 12,
};

const pwaControlsButtonStyle: CSSProperties = {
  minHeight: 36,
  padding: '0 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#f8fafc',
  cursor: 'pointer',
};

const pwaControlsSelectStyle: CSSProperties = {
  minHeight: 34,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#ffffff',
};

export function LayoutRoot() {
  const pwa = usePWA([
    'status',
    'isEnabled',
    'isSupported',
    'isInitialized',
    'isRegistered',
    'isOfflineReady',
    'isUpdateAvailable',
    'isNeedRefresh',
    'newVersion',
    'currentVersion',
    'registrationScope',
    'error',
  ]);

  useEffect(() => {
    logger.info(tableString(env));
  }, []);
  useEffect(() => {
    logger.info(tableString(pwa));
  }, [pwa]);

  return (
    <>
      <LayoutRootComponent />
      {env.mode === 'stage' && <TanStackRouterDevtools position='bottom-right' />}
    </>
  );
}

const LayoutRootComponent = () => {
  const isAuthenticated = useMemo(() => false, []);

  const navigate = useNavigate();

  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePrivate.fullPath);
    },
  });
  const isMatchPublic = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePublic.fullPath);
    },
  });

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (isMatchPrivate) {
        if (!isAuthenticated) navigate({ to: '/pu' });
      } else if (isMatchPublic) {
        if (isAuthenticated) navigate({ to: '/pr' });
      }
    }
  }, [isAuthenticated, isMatchPrivate, isMatchPublic, navigate]);

  return (
    <div>
      <Outlet />
      <PWAUpdateControls />
    </div>
  );
};

const PWAUpdateControls = () => {
  const pwa = usePWA([
    'status',
    'updateApp',
    'resetAppCache',
    'isUpdateAvailable',
    'isNeedRefresh',
    'newVersion',
    'currentVersion',
  ]);
  const [updateMode, setUpdateMode] = useState<TPWAUpdateMode>(readUpdateMode);
  const hasAutoUpdatedRef = useRef(false);

  const handleUpdateModeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const nextMode = event.target.value === 'automatic' ? 'automatic' : 'manual';

    setUpdateMode(nextMode);
    window.localStorage.setItem(PWA_UPDATE_MODE_STORAGE_KEY, nextMode);
  }, []);

  useEffect(() => {
    if (!pwa.isNeedRefresh) {
      hasAutoUpdatedRef.current = false;
      return;
    }

    if (updateMode === 'automatic' && !hasAutoUpdatedRef.current) {
      hasAutoUpdatedRef.current = true;
      pwa.updateApp();
    }
  }, [pwa, updateMode]);

  return (
    <section aria-label='PWA update controls' style={pwaControlsStyle}>
      <div style={pwaControlsHeaderStyle}>
        <strong>App version</strong>
        <select
          aria-label='Update mode'
          onChange={handleUpdateModeChange}
          style={pwaControlsSelectStyle}
          value={updateMode}
        >
          <option value='manual'>Manual</option>
          <option value='automatic'>Automatic</option>
        </select>
      </div>

      <p style={pwaControlsTextStyle}>Current: {pwa.currentVersion ?? 'unknown'}</p>
      <p style={pwaControlsTextStyle}>
        {pwa.isUpdateAvailable ? `Available: ${pwa.newVersion ?? 'new version'}` : `Status: ${pwa.status}`}
      </p>

      <div style={pwaControlsActionsStyle}>
        <button disabled={!pwa.isUpdateAvailable} onClick={pwa.updateApp} style={pwaControlsButtonStyle} type='button'>
          Update version
        </button>
        <button onClick={pwa.resetAppCache} style={pwaControlsButtonStyle} type='button'>
          Reset cache
        </button>
      </div>
    </section>
  );
};

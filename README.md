# React PWA Update System Demo

Demo project for the article: [React PWA Update System](https://blog.cyrilstrone.com/react-pwa-update-system/).

This repository is not a reusable library or a generic app template. It demonstrates a small production-oriented React PWA update flow with `vite-plugin-pwa`, a custom `ClassSw`, React context, `build-info.txt`, a manual update action, an automatic update mode, and an emergency service worker cache reset.

## What Is Included

- `vite-plugin-pwa` generates the service worker with the stable filename `vite-sw.js`.
- Service worker registration goes through `ClassSw` instead of automatic HTML injection.
- `ProviderPWA` mirrors service worker state into React.
- The root layout shows the current version, update status, update button, cache reset button, and update mode selector.
- The update mode is stored in `localStorage`: `Manual` or `Automatic`.
- `pluginWriteBuildInfo` generates `build-info.txt` inside `build/` during Vite builds.
- `/build-info.txt` uses the Workbox `NetworkFirst` runtime caching strategy.
- API-specific env variables and API runtime caching are intentionally omitted because this demo has no backend API.

## Stack

- React 19
- TypeScript 6
- Vite 8
- TanStack Router
- vite-plugin-pwa
- Jenesei Kit React
- Biome
- Yarn

## Install

```bash
yarn install
```

Use the Node.js version from `.nvmrc`:

```bash
nvm use
```

## Scripts

| Command | Description |
| --- | --- |
| `yarn start` | Starts Vite in `dev` mode. |
| `yarn start:dev` | Starts Vite in `dev` mode. |
| `yarn start:stage` | Starts Vite in `stage` mode. |
| `yarn start:prod` | Starts Vite in `prod` mode. |
| `yarn build:dev` | Type-checks and builds in `dev` mode. |
| `yarn build:stage` | Type-checks and builds in `stage` mode. |
| `yarn build:prod` | Type-checks and creates a production build. |
| `yarn biome:lint:check` | Runs Biome lint without writing fixes. |
| `yarn biome:format:check` | Checks Biome formatting without writing changes. |

## Environment

Base values live in `.env`. Mode-specific overrides live in:

- `.env.dev`
- `.env.stage`
- `.env.prod`

The project uses only the variables needed for the article demo:

| Variable | Purpose |
| --- | --- |
| `VITE_DEFAULT_DESCRIPTION` | App description for HTML metadata and the PWA manifest. |
| `VITE_DEFAULT_NAME` | Full application name. |
| `VITE_DEFAULT_NAME_SHORT` | Short application name and document title. |
| `VITE_DEFAULT_THEME_COLOR` | Theme and background color in the PWA manifest. |
| `VITE_NODE_ENV` | Runtime mode: `dev`, `stage`, or `prod`. |
| `VITE_CACHE_VERSION_MAX_AGE_SECONDS` | Runtime cache TTL for `/build-info.txt`. |
| `VITE_BASE_PATH` | Public base path for Vite assets, TanStack Router, PWA scope, and update checks. Use `/demo-react-pwa-update-system/` for this GitHub Pages project. |
| `VITE_PORT` | Local Vite dev server port. |
| `VITE_OUTPUT_DIR` | Build output directory, defaults to `build`. |
| `VITE_APP_VERSION` | Current build version shown in the UI and written to `build-info.txt`. |

`VITE_BASE_URL`, `VITE_SOCKET_URL`, and `VITE_CORE_URL` were removed on purpose. This demo has no backend API or WebSocket connection, so the service worker should not carry template-only API caching rules.

## Relation To The Article

The project follows the main pipeline from the article:

1. Vite creates a production build and generated service worker.
2. `vite-sw.js` stays as the stable service worker filename.
3. `registerType: 'prompt'` prevents silent page reloads.
4. `ClassSw` receives `onNeedRefresh` from `virtual:pwa-register`.
5. `ClassSw` reads `build-info.txt` under the configured public base path with a cache-busting request and stores the detected new version.
6. `ProviderPWA` exposes the service worker state to React.
7. The root layout either shows a manual action or calls `updateApp()` automatically.
8. `updateSW(true)` activates the new service worker and reloads the page.

`Automatic` mode does not poll for a new deployment while an already-open tab is idle. It only decides what to do after the browser detects a new service worker and `onNeedRefresh` fires. In this demo, detection usually happens after a reload, navigation, reopening the tab, or a browser-initiated service worker update check. If the product needs active tabs to discover updates on a schedule, add explicit polling, for example `registration.update()` or a `build-info.txt` version check.

The only intentional difference is the API cache example. The article shows a `NetworkOnly` API rule for apps with a backend. This repository has no API layer, so `runtimeCaching` contains only `/build-info.txt`.

## Code Map

```text
src/main.tsx                         ClassSw singleton and initialization
src/classes/class-sw/index.ts        service worker lifecycle helper
src/contexts/context-pwa/            React provider and usePWA hook
src/layouts/layout-root/layout.tsx   update UI and localStorage update mode
vite.config.ts                       VitePWA config and pluginWriteBuildInfo setup
```

The version file is generated by `@jenesei-software/jenesei-plugin-vite`:

```ts
pluginWriteBuildInfo({
  pathBuildInfo: buildInfoPath,
  version: VITE_APP_VERSION,
  mode,
});
```

## Testing Updates And Cache

PWA updates must be tested against a production build. The service worker is disabled in development mode.

Before the first test, clean old local service worker state in Chrome DevTools:

```text
Application -> Service workers -> Unregister
Application -> Storage -> Clear site data
Application -> Cache storage
```

Local test flow:

1. Set the initial version in `.env`:

```env
VITE_APP_VERSION=1.0.0
```

2. Build the app and start Vite preview:

```bash
yarn build:prod
npx vite preview --outDir build
```

3. Open the URL printed by `vite preview` with the configured base path, usually `http://localhost:4173/demo-react-pwa-update-system/` for a production build.
4. Confirm that the UI shows version `1.0.0`.
5. Confirm that the service worker is registered:

```text
Application -> Service workers
```

6. Keep the app tab open and stop the preview server.
7. Change the version in `.env`:

```env
VITE_APP_VERSION=1.0.1
```

8. Build and start preview again on the same port:

```bash
yarn build:prod
npx vite preview --outDir build
```

9. Go back to the old app tab and reload it, or navigate inside the app, so the browser checks the service worker.
10. In `Manual` mode, the `Update version` button should become enabled.
11. Click `Update version`. The new service worker activates, the page reloads, and the UI should show `1.0.1`.
12. In `Automatic` mode, the app calls `updateApp()` as soon as `onNeedRefresh` reports a new version.

Leaving the old tab completely idle is not the expected trigger in this demo. `Automatic` mode auto-activates an update after `onNeedRefresh`; it does not create a background polling loop by itself.

After `yarn build:prod`, the version file is generated here:

```text
build/build-info.txt
```

It should be available at:

```text
http://localhost:4173/demo-react-pwa-update-system/build-info.txt
```

In Cache Storage, you can inspect the Workbox precache and the `version-cache` runtime cache after `/build-info.txt` has been requested.

## If Updates Do Not Appear

- Make sure the app is opened from `vite preview`, not `yarn start`.
- Make sure `.env.prod` contains `VITE_NODE_ENV=prod`.
- Make sure `VITE_BASE_PATH` matches the deployment path. For this GitHub Pages URL, it must be `/demo-react-pwa-update-system/`.
- Make sure the tab is not using hard refresh with cache disabled.
- Open `Application -> Service workers` and check that the page has a controller.
- Open `/build-info.txt` and confirm that it contains the new version.
- Click `Reset cache` if the browser gets stuck between builds.

## Important Rules

- Do not rename `vite-sw.js` after the first production release without a migration plan.
- Do not edit `build/` manually; it is generated output.
- After PWA config changes, verify a production build, the service worker, and Cache Storage.
- For this demo, changing `VITE_APP_VERSION` is enough because the version is embedded into the JS bundle and written to `build-info.txt`.

## Validation

```bash
yarn biome:lint:check
yarn build:dev
```

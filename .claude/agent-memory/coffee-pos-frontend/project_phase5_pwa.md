---
name: Phase 5 — PWA, Toast, Offline, A11y
description: What was implemented in Fase 5 (polish and production): PWA with Workbox, global toast system, offline banner, env vars, and accessibility improvements.
type: project
---

Fase 5 completed. All items implemented and build verified passing.

**Why:** Production readiness — PWA support for tablet kiosk mode, offline resilience for the catalog, global error UX, and ARIA labels for accessibility compliance.

**How to apply:** These features are now baked in. When adding new pages/features, use `useToast()` for any mutation feedback (not local state banners). Never block the UI for offline conditions.

## Changes introduced

### PWA (vite-plugin-pwa + Workbox)
- `vite-plugin-pwa` installed as devDependency.
- `vite.config.ts` updated: `VitePWA` with `generateSW` mode, `autoUpdate` register type.
- Runtime caching: `NetworkFirst` for `/api/recipes` and `/api/baristas` (5s timeout), `StaleWhileRevalidate` for static assets.
- Pre-caches all app shell assets on install. `skipWaiting: true` + `clientsClaim: true`.
- Manifest: `display: "fullscreen"`, `orientation: "landscape"`, amber/brown theme.
- Icons at `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png`.

### Offline banner
- `src/hooks/useOfflineStatus.ts` — reads `navigator.onLine`, subscribes to `online`/`offline` events.
- `src/components/ui/OfflineBanner.tsx` — slim amber bar at the top, `pointer-events-none`, `aria-live="polite"`. Mounted in `main.tsx` above `<ToastProvider>`.

### Global toast system
- `src/context/ToastContext.tsx` — `ToastProvider` + `useToast()` hook.
- Variants: `success`, `error`, `warning`, `info`. Auto-dismiss with per-variant default durations.
- Max 3 simultaneous toasts; oldest is dropped when limit is reached.
- Dismiss button per toast (44px touch target). Stack is `pointer-events-none` container with `pointer-events-auto` on each pill.
- Mounted in `main.tsx`. All pages use `useToast()` instead of local state banners.

### Env variables
- `.env.development` and `.env.production` with `VITE_API_BASE_URL=http://localhost:8181/api`.
- `src/api/axios.ts` uses `import.meta.env.VITE_API_BASE_URL` with fallback.

### index.html
- Updated `<title>` to `BrewStack POS`.
- Added `viewport` with `user-scalable=no, maximum-scale=1.0` to prevent accidental pinch-zoom.
- Added PWA meta tags: `theme-color`, `apple-touch-icon`, `mobile-web-app-capable`.

### Accessibility improvements
- `CartSummary` now has `role="region"` + `aria-label="Order total breakdown"`.
- `StockPage` `<main>` has `aria-label="Stock management"`.
- `BaristasPage` `<main>` has `aria-label="Barista management"`.
- Pagination buttons have specific `aria-label` ("Go to previous page", "Go to next page").

### Hook fixes
- `useBaristas()` and `useStock()` now expose `refetch` from TanStack Query.

### Bundle optimization
- `vite.config.ts` `manualChunks`: vendor-react, vendor-router, vendor-query, vendor-zustand, vendor-axios.
- Final gzip sizes: app code 11 KB, CSS 5.8 KB, TanStack Query 14.8 KB, Axios 14.8 KB, Router+React 56 KB.
- `chunkSizeWarningLimit` set to 300 KB.

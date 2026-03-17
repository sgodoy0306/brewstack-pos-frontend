import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Service Worker will be injected into the build output
      injectRegister: 'auto',
      workbox: {
        // Cache the product catalog API endpoint so it works offline
        runtimeCaching: [
          {
            // Cache all GET requests to the recipes endpoint
            urlPattern: /\/api\/recipes/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'brewstack-recipes-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                // Keep the last 1 entry (full recipe list), for up to 24 hours
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache barista list for the BaristaSelector
            urlPattern: /\/api\/baristas/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'brewstack-baristas-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache static assets (JS, CSS, fonts) with a stale-while-revalidate strategy
            urlPattern: /\.(?:js|css|woff2?)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'brewstack-static-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
        // Pre-cache all app shell assets (index.html, main JS bundle, CSS)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Skip waiting so new SW activates immediately after install
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: 'BrewStack POS',
        short_name: 'BrewStack',
        description: 'Coffee Shop Point of Sale — tablet-optimized',
        theme_color: '#78350f',
        background_color: '#1c1917',
        display: 'fullscreen',
        orientation: 'landscape',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  build: {
    // Increase the chunk size warning threshold slightly to avoid noise from
    // React + TanStack Query being bundled together in the main chunk
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        // Manual chunk splitting: isolate large vendor libs so the app shell
        // stays small and the browser can cache each piece independently
        manualChunks: {
          // React runtime — changes least often, longest cache TTL
          'vendor-react': ['react', 'react-dom'],
          // React Router — stable API, rarely changes
          'vendor-router': ['react-router-dom'],
          // TanStack Query — server-state library
          'vendor-query': ['@tanstack/react-query'],
          // Zustand — tiny, but isolate for completeness
          'vendor-zustand': ['zustand'],
          // Axios — HTTP client
          'vendor-axios': ['axios'],
        },
      },
    },
  },
})

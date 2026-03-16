---
name: Estado arquitectonico brewstack-pos-frontend
description: Fases del proyecto POS, que esta implementado y que falta. Evaluado el 2026-03-16.
type: project
---

El proyecto es un POS para cafeteria en React + Vite + Tailwind v4 + TanStack Query + Zustand + React Router v7. Target: tablets landscape 10-12 pulgadas, layout 70/30 (catalogo/carrito).

**Stack confirmado:**
- React 18, Vite 5, TypeScript strict
- Tailwind CSS v4 via @tailwindcss/vite (sin tailwind.config.js — v4 lo elimina)
- TanStack Query v5 (QueryClient en main.tsx con staleTime 30s)
- React Router v7 (BrowserRouter en main.tsx)
- Zustand v5 instalado, no usado aun
- Axios instalado, no usado aun
- Backend: Java/Spring Boot en http://localhost:8181/api

**Fases inferidas del branch naming y agent definitions:**
- Fase 1 `feat/api-layer`: HTTP client + TypeScript types + services + hooks (TanStack Query)
- Fase 2: UI components (menu grid, cart panel, modifiers modal)
- Fase 3: Cart state (Zustand store)
- Fase 4: Offline/PWA (IndexedDB, useOfflineSync)

**Estado al 2026-03-16:**
- Scaffolding e infraestructura: COMPLETO
- Fase 1 (api-layer): 0% — no existe src/services/, src/hooks/, src/types/
- App.tsx es el boilerplate default de Vite, sin limpiar

**Why:** El commit "feat: initialize project" solo instalo dependencias y configuro providers en main.tsx. El branch feat/api-layer existe pero no tiene ningun archivo de la capa API todavia.

**How to apply:** Al disenar la Fase 1, el orden correcto es: types/ -> services/api.ts -> services/*Service.ts -> hooks/use*.ts -> limpiar App.tsx con layout base 70/30.

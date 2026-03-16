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

**Estado al 2026-03-16 (segunda revision):**
- Scaffolding e infraestructura: COMPLETO
- Fase 1 (api-layer): COMPLETA — todos los archivos existen y son coherentes
  - src/api/axios.ts: instancia Axios con interceptor de error tipado
  - src/types/: 6 archivos (barista, error, finance, order, recipe, stock)
  - src/services/: 5 archivos (barista, brew, finance, recipe, stock)
  - src/hooks/: 5 archivos (useBaristas, useBrewOrder, useFinance, useRecipes, useStock)
- App.tsx: AUN ES EL BOILERPLATE DEFAULT DE VITE — sin limpiar, pendiente
- main.tsx: BIEN — QueryClient con staleTime 30s, retry 1, ReactQueryDevtools en DEV, BrowserRouter
- .env: VITE_API_BASE_URL=http://localhost:8181/api configurado

**Problema critico identificado:**
- plan.md menciona src/api/queryClient.ts como archivo separado, pero QueryClient esta en main.tsx (decision correcta, plan desactualizado)
- App.tsx es basura Vite — el primer paso de Fase 2 es limpiarla y crear el layout 70/30
- price en RecipeDTO es number (float), pero plan.md dice manejar en centavos. Inconsistencia: el backend devuelve float, el plan pide enteros internamente. Decision pendiente.

**Why:** La Fase 1 fue ejecutada correctamente. La inconsistencia de precios viene del contrato del backend (Java double -> JSON float) vs la convencion del plan (centavos enteros).

**How to apply:** Al iniciar Fase 2: limpiar App.tsx primero, luego crear router.tsx con rutas base, luego PosLayout con split 70/30. El issue de centavos vs float debe resolverse en una capa de transformacion en los hooks o services antes de que llegue a la UI.

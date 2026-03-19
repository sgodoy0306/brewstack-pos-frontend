# BrewStack POS Frontend

A tablet-optimized Point of Sale (POS) interface for coffee shops, built with React 18 and Vite. Designed exclusively for landscape orientation on 10–12 inch tablets, with every interaction tuned for high-pressure service environments where speed and reliability come before visual complexity.

The backend counterpart is a Spring Boot API located at `/home/godoy/Desktop/coffee-management-api`, served by default at `http://localhost:8181/api`.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| HTTP Client | Axios 1.x |
| PWA | vite-plugin-pwa + Workbox |

No heavy UI component libraries are used. All components are built directly with Tailwind utility classes and custom hooks.

---

## Project Structure

```
src/
  api/
    axios.ts              # Axios instance: baseURL, 10s timeout, error interceptor
    queryClient.ts        # TanStack QueryClient with shared defaults (staleTime, retry)

  types/
    recipe.ts             # RecipeDTO, RecipeIngredient, CreateRecipeRequest
    pastry.ts             # PastryDTO, CreatePastryRequest
    barista.ts            # BaristaDTO, LevelUpDTO
    order.ts              # BrewOrderRequest, OrderSummaryDTO
    stock.ts              # IngredientDTO, CreateIngredientRequest
    finance.ts            # DailyBalanceDTO
    error.ts              # ApiErrorResponse

  services/
    recipeService.ts      # CRUD for /api/recipes
    pastryService.ts      # CRUD for /api/pastries
    baristaService.ts     # CRUD + practice session for /api/baristas
    brewService.ts        # POST /api/brew/order
    stockService.ts       # GET list, GET low-stock, PATCH restock for /api/stock
    financeService.ts     # Daily report + paginated history for /api/finance

  hooks/
    useRecipes.ts         # useRecipes(), useCreateRecipe(), useDeleteRecipe(), useRecipe(id)
    usePastries.ts        # usePastries(), useCreatePastry(), useDeletePastry()
    useBaristas.ts        # useBaristas(), usePractice(), useCreateBarista()
    useBrewOrder.ts       # useBrewOrder() — mutation that fires a brew order
    useStock.ts           # useStock(), useLowStock(), useRestock(), useCreateIngredient()
    useFinance.ts         # useDailyReport() (auto-refresh 30s), useFinanceHistory()
    useOfflineStatus.ts   # Wraps navigator.onLine + online/offline events

  store/
    cartStore.ts          # Zustand cart: items, derived totals, add/remove/clear actions

  utils/
    recipeImages.ts       # Maps default recipe names to bundled fallback images (used when imageUrl is empty)

  context/
    ToastContext.tsx       # Global toast system — showSuccess/showError, auto-dismisses

  components/
    layout/
      NavBar.tsx           # Top tab bar: POS, Inventory, Analytics, Baristas — light bg-stone-100, active tab renders as white pill with shadow, SVG outline icons
      PosLayout.tsx        # 70/30 flex container (catalog left, cart right)
      CatalogPanel.tsx     # Left panel wrapper
      CartPanel.tsx        # Right panel wrapper (sticky)

    ui/
      PosButton.tsx        # Touch-safe button (min 60px), variants: primary/secondary/danger
      Badge.tsx            # Status chip (e.g., "3 low", item counts)
      LoadingSpinner.tsx
      ErrorMessage.tsx     # Error state with optional retry callback
      OfflineBanner.tsx    # Slim connectivity banner — never blocks the UI

    pos/
      ProductGrid.tsx          # 3–4 col grid of coffee recipe cards
      ProductCard.tsx          # Recipe card: name, price, XP; info button for detail modal
      PastriesGrid.tsx         # Grid of pastry cards
      PastryCard.tsx           # Pastry card: name, price; info button for detail modal
      CartPanel.tsx            # Cart content: item list, summary, barista selector, checkout
      CartItem.tsx             # Single cart row with +/- quantity controls
      CartSummary.tsx          # Total display — no tax, total equals subtotal
      CheckoutButton.tsx       # "Complete Order" CTA — full-width, min 60px, highest visual weight
      BaristaSelector.tsx      # Dropdown to assign a barista to the current order
      AddRecipeModal.tsx       # Two-step form: create coffee recipe with dynamic ingredient rows
      AddPastryModal.tsx       # Two-step form: create pastry (name, price, description)
      ProductDetailModal.tsx   # Read-only recipe view: description, ingredients, XP; trash icon triggers typed-confirm delete
      PastryDetailModal.tsx    # Read-only pastry view: description, availability; trash icon triggers typed-confirm delete

    stock/
      IngredientRow.tsx        # One ingredient: name, current stock, threshold, restock button
      RestockModal.tsx         # Numeric input + confirm to add stock units
      AddIngredientModal.tsx   # Form to create a new ingredient (name, unit, stock, threshold)

    finance/
      DailyReportCard.tsx      # Today's revenue, order count, top recipe — auto-refreshes
      HistoryTable.tsx         # Paginated table of past daily balance records

    baristas/
      BaristaCard.tsx          # Barista name, level, XP, "Practice" button
      PracticeModal.tsx        # Rating input 1–10, shows XP/level-up result from the API
      AddBaristaModal.tsx      # Single-field creation form

  pages/
    PosPage.tsx         # Route "/":      catalog tabs + cart, wires all POS modals
    StockPage.tsx       # Route "/stock": ingredient list, pagination, restock/add modals
    FinancePage.tsx     # Route "/finance": daily report + history table
    BaristasPage.tsx    # Route "/baristas": barista grid + practice + add modals

  router.tsx            # AppRouter: top-level routes, catch-all redirects to "/"
  App.tsx
  main.tsx              # Entry: QueryClientProvider, BrowserRouter, ToastProvider, OfflineBanner
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot API, including the `/api` prefix |

Two env files are already present in the repo:

```
# .env.development  (used by `npm run dev`)
VITE_API_BASE_URL=http://localhost:8181/api

# .env.production  (used by `npm run build`)
VITE_API_BASE_URL=https://your-production-api.example.com/api
```

The value is consumed by `src/api/axios.ts` at build time via `import.meta.env.VITE_API_BASE_URL`. If the variable is absent, Axios falls back to `http://localhost:8181/api` so the dev server works without a `.env` file.

---

## Getting Started

**Prerequisites:** Node 18+, npm 9+.

On Linux with Node 18, the Tailwind v4 oxide native binding is not selected automatically by the package manager and must be installed explicitly:

```bash
npm install @tailwindcss/oxide-linux-x64-gnu
```

**Install dependencies:**

```bash
npm install
```

**Start the development server:**

```bash
npm run dev
# Serves at http://localhost:5173
```

The backend Spring Boot API must be running at the URL specified in `VITE_API_BASE_URL`.

**Type-check + production build:**

```bash
npm run build
# Output: dist/
```

The build includes a Workbox service worker for offline support.

**Preview the production build locally:**

```bash
npm run preview
```

**Lint:**

```bash
npm run lint
```

---

## Pages and Modules

### POS — `/`

The main selling screen. The layout is a strict 70/30 horizontal split that never collapses:

- **Left panel (70%):** Category tabs ("Coffees & Infusions" / "Pastries") sit above a scrollable product grid. Tapping a card adds it to the cart immediately. A small info button on each card opens a read-only detail modal without adding to the cart. A context-aware "+ Add Coffee" or "+ Add Pastry" button appears to the right of the tabs.
- **Right panel (30%):** Always-visible cart with line items, +/− quantity controls, a grand total (no tax — total equals the sum of all line items), a barista selector dropdown, and a "Complete Order" button fixed at the bottom. The cart is intentionally not persisted across page reloads — orders are short-lived transactions tied to a physical sale.

### Inventory — `/stock`

Ingredient stock management:

- Paginated list of all ingredients (15 per page), sorted by name.
- Items below their minimum threshold are visually flagged; a non-blocking banner in the page header shows the count.
- "Restock" on any row opens a modal with a numeric input to add units.
- "+ Add Ingredient" opens a creation form: name, unit of measure, initial stock quantity, and minimum threshold.

### Analytics — `/finance`

Financial overview split into two independent sections:

- **Daily report card:** today's total revenue, number of orders, and the top-selling recipe. Queries auto-refresh every 30 seconds via TanStack Query's `refetchInterval`.
- **History table:** paginated list of past daily balance records. Each section has its own loading and error state so a failure in one does not block the other.

### Baristas — `/baristas`

Staff management with a gamification layer:

- Responsive grid of barista cards showing name, level, and accumulated XP.
- "Practice" opens a modal to submit a quality rating (1–10). The API returns an XP delta and an optional level-up message, both shown inside the modal and echoed as a toast.
- "+ Add Barista" creates a new barista with a single required field (name).

---

## UI Design Notes

### NavBar

`NavBar` uses a light `bg-stone-100` background with a `border-b border-stone-200` separator. Each route tab is rendered as a `NavLink` with a pill style:

- **Active:** `bg-white text-stone-800 shadow-sm border border-stone-200` — white pill with a subtle shadow and border.
- **Inactive:** `text-stone-500 hover:text-stone-800 hover:bg-stone-200/60` — plain text, no background.
- All tabs include an SVG outline icon (18×18, `stroke="currentColor"`, `fill="none"`) alongside the label. No filled icons are used anywhere in the nav.

### Category Tabs (POS Page)

The "Coffees & Infusions" / "Pastries" tabs inside `PosPage` follow the same pill convention: active tab renders as a white pill with an outer shadow (`shadow`), inactive tabs show as plain text on the `bg-stone-100` container background.

### Default Recipe Images

When the backend returns an empty or missing `imageUrl` for a recipe, `src/utils/recipeImages.ts` provides bundled fallback images keyed by recipe name. Covered names: Espresso, Latte, Flat White, Cappuccino, Matcha Latte, Mocha, Iced Americano. Recipes not in the map fall back to a generic placeholder in `ProductCard`.

### Destructive Delete Flow

Both `ProductDetailModal` (recipes) and `PastryDetailModal` (pastries) share an identical delete UX:

1. A trash icon button (top-right of the modal header) is shown when the delete confirmation panel is not yet open.
2. Clicking the trash icon reveals an inline red panel — no separate modal is opened.
3. The panel prompts the user to type the exact word **`confirm`** into a text input before the "Delete" button becomes active.
4. The "Delete" button is disabled until the input matches; once active it fires the mutation, shows a spinner, and closes the modal on success.
5. A "Cancel" button returns to the normal detail view without any side effects.

---

## Key Components

### `PosButton`

Base touch target for primary actions. Enforces a minimum height of 60px. Accepts `variant` (`primary`, `secondary`, `danger`) and renders appropriate Tailwind classes.

### `useCartStore` (Zustand)

In-memory cart store. Shape:

```ts
items: CartItem[]    // Each recipe appears at most once; keyed by recipe.id
subtotal: number     // Sum of all lineTotal values
total: number        // Equals subtotal — no tax applied
itemCount: number    // Total units across all line items
```

Pastries do not have their own cart type. They are adapted to the `RecipeDTO` shape (setting `baseXpReward: 0` and `ingredients: []`) before calling `addItem`, so the store requires no changes to handle them.

### `ToastContext`

Global notification system. Exposes `showSuccess(message)` and `showError(message)` via `useToast()`. Toasts auto-dismiss after 3 seconds and are rendered at the application root, above all modals.

### `OfflineBanner`

Rendered above all routes in `main.tsx`. Subscribes to `window` `online`/`offline` events via `useOfflineStatus`. Displays a slim amber banner when connectivity is lost — no modal, no blocking.

---

## PWA and Offline Support

Configured with `vite-plugin-pwa`. Workbox caching strategy:

| Resource | Strategy | Cache name | Max age |
|---|---|---|---|
| `GET /api/recipes` | NetworkFirst | `brewstack-recipes-cache` | 24 h |
| `GET /api/baristas` | NetworkFirst | `brewstack-baristas-cache` | 24 h |
| JS / CSS / fonts | StaleWhileRevalidate | `brewstack-static-cache` | 30 days |
| App shell (HTML, assets) | Precache | — | Indefinite |

The PWA manifest sets `orientation: "landscape"` and `display: "fullscreen"` to match the tablet-only target environment.

---

## Bundle Architecture

Vendor code is split into isolated Rollup chunks so the browser can cache each library independently and only invalidate the chunk that actually changed:

| Chunk | Contents |
|---|---|
| `vendor-react` | react, react-dom |
| `vendor-router` | react-router-dom |
| `vendor-query` | @tanstack/react-query |
| `vendor-zustand` | zustand |
| `vendor-axios` | axios |

TanStack Query Devtools are included only in development builds (`import.meta.env.DEV`).

---

## Project Conventions

| Rule | Detail |
|---|---|
| Touch targets | Minimum 60px height and width on all interactive elements |
| Prices | Stored as `number` (double) matching the backend DTO directly. `.toFixed(2)` formatting happens exclusively in view components, never in store or hook logic |
| Cart tax | No tax applied. Grand total equals subtotal directly |
| Components | Functional components and hooks only. No class components |
| Business logic | Kept in hooks and the Zustand store. JSX contains no calculation or data-fetching logic |
| Code language | All identifiers, comments, and string literals must be in English |
| Loading/error/empty states | Every data-fetching component explicitly handles all three states |
| Modal rendering | All modals are rendered at the page root (outside layout containers) to guarantee correct z-index stacking |
| Commits | Never committed without explicit confirmation from the user |

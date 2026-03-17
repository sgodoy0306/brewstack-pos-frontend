---
name: Cart store and price handling decisions
description: Zustand cart store shape, price handling convention, and cart component structure decided in step 3.2
type: project
---

Zustand store at `src/store/cartStore.ts` holds `CartItem[]` (recipe + quantity + lineTotal), plus derived `subtotal`, `tax`, `total`, `itemCount` recomputed on every mutation via `computeTotals()`.

Tax rate is 8% (TAX_RATE constant in cartStore.ts).

**Price handling:** Prices are stored as `number` (double) directly from the backend DTO. No cents conversion. Formatting with `.toFixed(2)` happens only in view components. This matches the plan.md convention table explicitly.

Cart is intentionally NOT persisted to localStorage — POS transactions are short-lived and a persisted cart causes confusion.

Cart components in `src/components/pos/`:
- `CartItem.tsx` — single line item row with +/− stepper (44px targets), danger style on last unit
- `CartSummary.tsx` — reads subtotal/tax/total from store directly, no prop drilling
- `CheckoutButton.tsx` — green, 64px tall, full-width; flattens cart items into `recipeIds[]` (repeats ID per unit); clears cart on success
- `CartPanel.tsx` — composes all three into a sticky-footer layout; item list scrolls, footer stays anchored

**Why:** Sticky footer ensures CheckoutButton is always visible without scrolling — critical for barista speed.
**How to apply:** Any future additions to the cart panel (e.g., discount input, notes field) must go above the sticky footer block, not inside it.

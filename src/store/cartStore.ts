import { create } from 'zustand'
import type { RecipeDTO } from '../types/recipe'

/** A single line item in the cart. */
export interface CartItem {
  recipe: RecipeDTO
  /** Number of units of this recipe in the cart. Always ≥ 1. */
  quantity: number
  /** Line total: recipe.price × quantity (double precision, formatted on view layer). */
  lineTotal: number
}

interface CartState {
  /** Ordered list of cart items. Each recipe appears at most once. */
  items: CartItem[]

  // ─── Derived values ────────────────────────────────────────────────────────
  /** Sum of all line totals before tax. */
  subtotal: number
  /** Tax amount (subtotal × TAX_RATE). */
  tax: number
  /** Grand total (subtotal + tax). */
  total: number
  /** Total number of individual units across all items. */
  itemCount: number

  // ─── Actions ───────────────────────────────────────────────────────────────
  /**
   * Add one unit of a recipe. If the recipe is already in the cart its
   * quantity is incremented; otherwise a new line item is created.
   */
  addItem: (recipe: RecipeDTO) => void
  /**
   * Remove one unit of a recipe. When quantity reaches 0 the line item is
   * removed from the cart entirely.
   */
  removeItem: (recipeId: number) => void
  /**
   * Set the exact quantity for a recipe. Passing 0 removes the line item.
   * Negative values are clamped to 0.
   */
  setItemQuantity: (recipeId: number, quantity: number) => void
  /** Remove all items and reset totals to zero. */
  clearCart: () => void
}

/** Tax rate applied to the cart subtotal (8%). */
const TAX_RATE = 0.08

/**
 * Recalculate all derived totals from the current items array.
 * Keeping this as a pure helper makes the store reducers readable.
 */
function computeTotals(items: CartItem[]): Pick<CartState, 'subtotal' | 'tax' | 'total' | 'itemCount'> {
  const subtotal = items.reduce((acc, item) => acc + item.lineTotal, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  return { subtotal, tax, total, itemCount }
}

/**
 * Zustand store for the POS shopping cart.
 *
 * Prices are stored as `number` (double), matching the backend DTO directly.
 * Formatting (`.toFixed(2)`) happens exclusively in view components.
 *
 * The store is intentionally not persisted to localStorage — a cart that
 * survives a page reload in a POS environment causes more confusion than
 * convenience. Orders are short-lived and tied to a physical transaction.
 */
export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  itemCount: 0,

  addItem: (recipe) =>
    set((state) => {
      const existing = state.items.find((item) => item.recipe.id === recipe.id)

      let updatedItems: CartItem[]

      if (existing) {
        // Increment quantity of an existing line item.
        updatedItems = state.items.map((item) =>
          item.recipe.id === recipe.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                lineTotal: item.recipe.price * (item.quantity + 1),
              }
            : item,
        )
      } else {
        // Append a new line item.
        const newItem: CartItem = {
          recipe,
          quantity: 1,
          lineTotal: recipe.price,
        }
        updatedItems = [...state.items, newItem]
      }

      return { items: updatedItems, ...computeTotals(updatedItems) }
    }),

  removeItem: (recipeId) =>
    set((state) => {
      const existing = state.items.find((item) => item.recipe.id === recipeId)
      if (!existing) return state

      let updatedItems: CartItem[]

      if (existing.quantity === 1) {
        // Last unit — remove the line item entirely.
        updatedItems = state.items.filter((item) => item.recipe.id !== recipeId)
      } else {
        updatedItems = state.items.map((item) =>
          item.recipe.id === recipeId
            ? {
                ...item,
                quantity: item.quantity - 1,
                lineTotal: item.recipe.price * (item.quantity - 1),
              }
            : item,
        )
      }

      return { items: updatedItems, ...computeTotals(updatedItems) }
    }),

  setItemQuantity: (recipeId, quantity) =>
    set((state) => {
      const clampedQty = Math.max(0, quantity)

      let updatedItems: CartItem[]

      if (clampedQty === 0) {
        updatedItems = state.items.filter((item) => item.recipe.id !== recipeId)
      } else {
        const exists = state.items.some((item) => item.recipe.id === recipeId)
        if (!exists) return state

        updatedItems = state.items.map((item) =>
          item.recipe.id === recipeId
            ? { ...item, quantity: clampedQty, lineTotal: item.recipe.price * clampedQty }
            : item,
        )
      }

      return { items: updatedItems, ...computeTotals(updatedItems) }
    }),

  clearCart: () =>
    set({ items: [], subtotal: 0, tax: 0, total: 0, itemCount: 0 }),
}))

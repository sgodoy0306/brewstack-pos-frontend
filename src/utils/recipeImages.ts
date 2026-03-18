import espresso from '../images/espresso.png'
import latte from '../images/Latte.png'
import flatWhite from '../images/Flat White.png'
import cappuccino from '../images/Capuccino.png'
import matchaLatte from '../images/Matcha Latte.png'
import mocha from '../images/mocha.png'
import icedAmericano from '../images/iced americano.png'

/**
 * Maps default recipe names to their bundled fallback images.
 * Used when the backend returns an empty or missing imageUrl.
 */
export const DEFAULT_RECIPE_IMAGES: Record<string, string> = {
  'Espresso': espresso,
  'Latte': latte,
  'Flat White': flatWhite,
  'Cappuccino': cappuccino,
  'Matcha Latte': matchaLatte,
  'Mocha': mocha,
  'Iced Americano': icedAmericano,
}

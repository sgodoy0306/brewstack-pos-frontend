import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'POS', icon: '☕' },
  { to: '/stock', label: 'Stock', icon: '📦' },
  { to: '/finance', label: 'Finance', icon: '💰' },
  { to: '/baristas', label: 'Baristas', icon: '👤' },
]

/**
 * Top navigation bar with route tabs.
 * Each tab is a minimum 60px tall touch target for tablet use.
 */
export function NavBar() {
  return (
    <nav
      className="flex items-stretch h-[60px] bg-stone-900 text-white shrink-0"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex items-center px-5 border-r border-stone-700 shrink-0">
        <span className="text-amber-400 font-bold text-lg tracking-tight">
          BrewStack
        </span>
      </div>

      {/* Nav tabs */}
      <div className="flex items-stretch flex-1">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 px-6 min-h-[60px] text-sm font-semibold',
                'border-b-2 transition-colors duration-100 select-none',
                isActive
                  ? 'border-amber-400 text-amber-400 bg-stone-800'
                  : 'border-transparent text-stone-300 hover:text-white hover:bg-stone-800',
              ].join(' ')
            }
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

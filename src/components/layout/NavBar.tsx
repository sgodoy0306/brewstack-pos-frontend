import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

function IconPos() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}

function IconStock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function IconFinance() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function IconBaristas() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',          label: 'POS',      icon: <IconPos /> },
  { to: '/stock',     label: 'Inventory', icon: <IconStock /> },
  { to: '/finance',   label: 'Analytics', icon: <IconFinance /> },
  { to: '/baristas',  label: 'Baristas',  icon: <IconBaristas /> },
]

/**
 * Top navigation bar with route tabs.
 * Active tab renders as a white pill with shadow; inactive tabs are plain text.
 */
export function NavBar() {
  return (
    <nav
      className="flex items-center h-[56px] bg-stone-100 border-b border-stone-200 px-3 gap-1 shrink-0"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex items-center px-3 mr-2 shrink-0">
        <span className="text-stone-800 font-bold text-base tracking-tight">
          BrewStack
        </span>
      </div>

      {/* Nav tabs */}
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [
              'flex items-center gap-2 px-4 h-[38px] rounded-lg text-sm font-medium',
              'transition-all duration-100 select-none whitespace-nowrap',
              isActive
                ? 'bg-white text-stone-800 shadow-sm border border-stone-200'
                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/60',
            ].join(' ')
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

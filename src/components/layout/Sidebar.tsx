import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Globe, Shield, AlertTriangle,
  FileCheck, GitMerge, Cpu, FileText, Settings,
  Bell, BookOpen, ChevronDown, LogOut, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/utils/constants'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  end?: boolean
}

/** Admin MSSP navigation — all routes prefixed with /admin/ */
const ADMIN_NAV: { group: string; items: NavItem[] }[] = [
  {
    group: 'General',
    items: [
      { label: 'Dashboard',   to: '/admin/dashboard',   icon: LayoutDashboard, end: true },
      { label: 'Clients',     to: '/admin/clients',     icon: Users },
      { label: 'CTI Sources', to: '/admin/sources',     icon: Globe },
    ],
  },
  {
    group: 'Threat Intel',
    items: [
      { label: 'Threats',     to: '/admin/threats',     icon: AlertTriangle },
      { label: 'IoCs',        to: '/admin/iocs',        icon: Shield },
      { label: 'Validation',  to: '/admin/validation',  icon: FileCheck },
      { label: 'Correlation', to: '/admin/correlation', icon: GitMerge },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Jobs',        to: '/admin/jobs',        icon: Cpu },
      { label: 'Reports',     to: '/admin/reports',     icon: FileText },
    ],
  },
]

/** Client navigation */
const CLIENT_NAV: { group: string; items: NavItem[] }[] = [
  {
    group: 'General',
    items: [
      { label: 'Dashboard',        to: '/dashboard',       icon: LayoutDashboard, end: true },
      { label: 'Alerts',           to: '/alerts',          icon: Bell },
      { label: 'IoCs',             to: '/iocs',            icon: Shield },
    ],
  },
  {
    group: 'Analysis',
    items: [
      { label: 'Reports',          to: '/reports',         icon: FileText },
      { label: 'Recommendations',  to: '/recommendations', icon: BookOpen },
    ],
  },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const nav = isAdmin ? ADMIN_NAV : CLIENT_NAV

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border)]',
        'transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-[var(--border)] px-4 shrink-0">
        <ShieldCheck className="h-6 w-6 text-[var(--accent-cyan)] shrink-0" />
        {!collapsed && (
          <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight truncate">
            ThreatHunting
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {nav.map((section) => (
          <div key={section.group}>
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
                {section.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded px-2 py-2 text-sm transition-colors',
                        'hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                        isActive
                          ? 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] font-medium'
                          : 'text-[var(--text-muted)]'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="shrink-0 border-t border-[var(--border)] p-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 rounded px-2 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-cyan)]/20 text-xs font-bold text-[var(--accent-cyan)]">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-[var(--text-primary)]">{user?.name}</p>
              <p className="truncate text-[10px] text-[var(--text-subtle)]">
                {user?.role === ROLES.ADMIN ? 'Admin MSSP' : 'Client'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex w-full items-center justify-center p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  )
}

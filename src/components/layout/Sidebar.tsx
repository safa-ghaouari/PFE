import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Globe, Shield, AlertTriangle,
  FileCheck, GitMerge, Cpu, FileText, Settings,
  Bell, BookOpen, LogOut, ShieldCheck, Lock,
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
    group: 'SOC Analyst',
    items: [
      { label: 'Dashboard',   to: '/admin/dashboard',   icon: LayoutDashboard, end: true },
      { label: 'Threats',     to: '/admin/threats',     icon: AlertTriangle },
      { label: 'IoCs',        to: '/admin/iocs',        icon: Shield },
      { label: 'Validation',  to: '/admin/validation',  icon: FileCheck },
      { label: 'Correlation', to: '/admin/correlation', icon: GitMerge },
    ],
  },
  {
    group: 'Administrator',
    items: [
      { label: 'Clients',     to: '/admin/clients',     icon: Users },
      { label: 'CTI Sources', to: '/admin/sources',     icon: Globe },
      { label: 'Jobs',        to: '/admin/jobs',        icon: Cpu },
      { label: 'Reports',     to: '/admin/reports',     icon: FileText },
      { label: 'Settings',    to: '/admin/settings',    icon: Settings },
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
        'flex h-full flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)]',
        'transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border)] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-cyan)]/25 bg-[var(--accent-cyan)]/10">
          <ShieldCheck className="h-4 w-4 text-[var(--accent-cyan)]" />
        </div>
        {!collapsed && (
          <span className="truncate text-[11px] font-black uppercase tracking-[0.15em] text-[var(--text-primary)]">
            Threat<span className="text-[var(--accent-cyan)]">Hunter</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
        {nav.map((section) => (
          <div key={section.group}>
            {!collapsed && (
              <div className="mb-2 flex items-center gap-2 px-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-subtle)]">
                  {section.group}
                </p>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl border px-2.5 py-2 text-sm transition-all',
                        'hover:border-[var(--border)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                        isActive
                          ? 'border-[var(--accent-cyan)]/35 bg-[var(--accent-cyan)]/12 text-[var(--accent-cyan)] shadow-[inset_0_0_0_1px_rgba(0,217,255,0.08)]'
                          : 'border-transparent text-[var(--text-muted)]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
                            isActive
                              ? 'border-[var(--accent-cyan)]/35 bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)]'
                              : 'border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-subtle)] group-hover:text-[var(--text-primary)]'
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                        </span>
                        {!collapsed && <span className="truncate text-[15px]">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Emergency Lock */}
      <div className="shrink-0 border-t border-[var(--border)] px-2 py-2">
        <button
          className={cn(
            'flex w-full items-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2.5 transition-all',
            'hover:border-red-500/60 hover:bg-red-500/20',
            collapsed && 'justify-center px-0'
          )}
        >
          <Lock className="h-4 w-4 shrink-0 text-red-400" />
          {!collapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
              Emergency Lock
            </span>
          )}
        </button>
      </div>

      {/* User info + logout */}
      <div className="shrink-0 border-t border-[var(--border)] p-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-2 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-cyan)]/20 text-xs font-bold text-[var(--accent-cyan)]">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-[var(--text-primary)]">{user?.name}</p>
              <p className="truncate text-[10px] text-[var(--text-subtle)]">
                {user?.role === ROLES.ADMIN ? 'Admin MSSP' : 'Client'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="shrink-0 rounded-md p-1 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
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

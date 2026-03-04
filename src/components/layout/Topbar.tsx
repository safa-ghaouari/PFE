import { Bell, Menu, Search } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'

interface TopbarProps {
  title: string
  onToggleSidebar?: () => void
}

/**
 * Barre du haut : titre de page, recherche rapide, notifications, profil.
 */
export function Topbar({ title, onToggleSidebar }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4">
      {/* Toggle sidebar (mobile) */}
      <button
        onClick={onToggleSidebar}
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Titre de la page */}
      <h1 className="flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </h1>

      {/* Actions droite */}
      <div className="flex items-center gap-2">
        {/* Recherche rapide */}
        <button className="hidden sm:flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:border-[var(--accent-cyan)]/50 transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-1 rounded bg-[var(--bg-primary)] px-1 py-0.5 text-[10px] text-[var(--text-subtle)]">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell className="h-4 w-4" />
          {/* Point rouge si notifications */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--critical)]" />
        </button>
      </div>
    </header>
  )
}

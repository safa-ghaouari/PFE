import { Menu, Search, Sun, Moon, Plus } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface TopbarProps {
  title: string
  onToggleSidebar?: () => void
}

export function Topbar({ title, onToggleSidebar }: TopbarProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4">
      {/* Mobile toggle */}
      <button
        onClick={onToggleSidebar}
        className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h1 className="shrink-0 text-base font-semibold text-[var(--text-primary)]">
          Dashboard
        </h1>

        {/* Search */}
        <button className="flex w-full max-w-xl items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--accent-cyan)]/40">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>Search telemetry...</span>
          <kbd className="ml-auto hidden rounded bg-[var(--bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--text-subtle)] sm:inline-block">Ctrl+K</kbd>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-cyan)]/40 hover:text-[var(--accent-cyan)]"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-[#0d1117] transition-all hover:brightness-110 active:scale-95"
          style={{ background: '#00D9FF', boxShadow: '0 4px 20px rgba(0,217,255,0.35)' }}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Launch Operation</span>
        </button>
      </div>
    </header>
  )
}

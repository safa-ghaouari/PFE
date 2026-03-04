import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Composant affiché quand une liste est vide.
 * Utilisé dans les tableaux, listes d'alertes, IoC, etc.
 */
export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <Icon className="h-6 w-6 text-[var(--text-muted)]" />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

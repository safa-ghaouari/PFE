import { cn } from '@/utils/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

/**
 * En-tête standardisé de chaque page.
 * Titre + sous-titre optionnel + actions droite (boutons, filtres...).
 */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

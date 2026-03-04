import { cn } from '@/utils/cn'

type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'neutral' | 'success'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  high:     'bg-orange-500/15 text-orange-400 border-orange-500/30',
  medium:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  low:      'bg-green-500/15 text-green-400 border-green-500/30',
  info:     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  neutral:  'bg-gray-500/15 text-gray-400 border-gray-500/30',
  success:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

/**
 * Badge de sévérité / statut.
 * Utilisé pour afficher critical, high, medium, low sur les IoC et menaces.
 */
export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium',
        'rounded border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

/** Mappe un score 0-100 vers la variante Badge correspondante */
export function ScoreBadge({ score }: { score: number }) {
  const variant: BadgeVariant =
    score >= 80 ? 'critical' :
    score >= 60 ? 'high' :
    score >= 40 ? 'medium' : 'low'

  const label =
    score >= 80 ? 'Critical' :
    score >= 60 ? 'High' :
    score >= 40 ? 'Medium' : 'Low'

  return (
    <Badge variant={variant}>
      {score} — {label}
    </Badge>
  )
}

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Composant affiché en cas d'erreur API.
 * Propose un bouton de retry si `onRetry` est fourni.
 */
export function ErrorState({
  message = 'An error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <p className="text-sm text-[var(--text-muted)] max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-xs text-[var(--accent-cyan)] hover:underline mt-1"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  )
}

import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'

interface LoadingStateProps {
  label?: string
  className?: string
}

export function LoadingState({ label = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)}>
      <Spinner size="lg" />
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  )
}

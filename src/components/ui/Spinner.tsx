import { cn } from '@/utils/cn'

type SpinnerSize = 'sm' | 'md' | 'lg' | 'fullpage'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm:       'h-4 w-4 border-2',
  md:       'h-8 w-8 border-2',
  lg:       'h-12 w-12 border-2',
  fullpage: 'h-10 w-10 border-2',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-transparent border-t-[var(--accent-cyan)]',
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label="Chargement..."
    />
  )

  if (size === 'fullpage') {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-xl',
        variant === 'outline'
          ? 'border border-accent-cyan/40 bg-transparent text-accent-cyan'
          : 'border border-white/10 bg-white/10 text-cyan-200',
        className,
      )}
      {...props}
    />
  )
}

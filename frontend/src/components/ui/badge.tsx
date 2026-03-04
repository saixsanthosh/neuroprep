import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan',
        className,
      )}
      {...props}
    />
  )
}

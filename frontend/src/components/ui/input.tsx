import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-[var(--text-main)] placeholder:text-muted focus:border-accent-cyan/70 focus:outline-none focus:ring-2 focus:ring-accent-cyan/40',
        className,
      )}
      {...props}
    />
  )
}

import * as React from 'react'

import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-soft-glow hover:from-primary-400 hover:to-primary-500',
  secondary:
    'glass text-[var(--text-main)] hover:border-accent-cyan/60 hover:text-white',
  ghost: 'bg-transparent text-[var(--text-main)] hover:bg-white/10',
  danger: 'bg-red-500 text-white hover:bg-red-400',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-xl px-4 text-sm',
  md: 'h-11 rounded-2xl px-5 text-sm sm:text-base',
  lg: 'h-12 rounded-2xl px-6 text-base',
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent-cyan/60 focus:ring-offset-2 focus:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

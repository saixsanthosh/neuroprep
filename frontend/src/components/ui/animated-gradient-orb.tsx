import { motion } from 'framer-motion'

interface AnimatedGradientOrbProps {
  className?: string
  colors?: string[]
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'amber' | 'violet'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  delay?: number
  top?: string
  bottom?: string
  left?: string
  right?: string
}

const sizeClasses = {
  sm: 'h-48 w-48',
  md: 'h-72 w-72',
  lg: 'h-96 w-96',
  xl: 'h-[32rem] w-[32rem]',
}

const colorPresets = {
  cyan: ['rgba(34, 211, 238, 0.15)', 'rgba(6, 182, 212, 0.15)'],
  purple: ['rgba(168, 85, 247, 0.15)', 'rgba(124, 58, 237, 0.15)'],
  pink: ['rgba(236, 72, 153, 0.15)', 'rgba(219, 39, 119, 0.15)'],
  yellow: ['rgba(250, 204, 21, 0.15)', 'rgba(234, 179, 8, 0.15)'],
  amber: ['rgba(251, 191, 36, 0.15)', 'rgba(245, 158, 11, 0.15)'],
  violet: ['rgba(139, 92, 246, 0.15)', 'rgba(124, 58, 237, 0.15)'],
}

export function AnimatedGradientOrb({
  className = '',
  colors,
  color = 'cyan',
  size = 'lg',
  delay = 0,
  top,
  bottom,
  left,
  right,
}: AnimatedGradientOrbProps) {
  const resolvedColors = colors || colorPresets[color]

  const positionStyles: React.CSSProperties = {}
  if (top) positionStyles.top = top
  if (bottom) positionStyles.bottom = bottom
  if (left) positionStyles.left = left
  if (right) positionStyles.right = right

  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${sizeClasses[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, ${resolvedColors.join(', ')})`,
        ...positionStyles,
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

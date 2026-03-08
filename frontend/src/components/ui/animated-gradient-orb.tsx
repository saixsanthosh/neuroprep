import { motion } from 'framer-motion'

interface AnimatedGradientOrbProps {
  className?: string
  colors?: string[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
  delay?: number
}

const sizeClasses = {
  sm: 'h-48 w-48',
  md: 'h-72 w-72',
  lg: 'h-96 w-96',
  xl: 'h-[32rem] w-[32rem]',
}

export function AnimatedGradientOrb({
  className = '',
  colors = ['rgba(34, 211, 238, 0.15)', 'rgba(124, 58, 237, 0.15)'],
  size = 'lg',
  delay = 0,
}: AnimatedGradientOrbProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${sizeClasses[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, ${colors.join(', ')})`,
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

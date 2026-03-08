import { motion } from 'framer-motion'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export function GradientText({ children, className = '', animate = true }: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: animate ? '200% auto' : '100% auto',
      }}
      animate={
        animate
          ? {
              backgroundPosition: ['0% center', '200% center', '0% center'],
            }
          : {}
      }
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  )
}

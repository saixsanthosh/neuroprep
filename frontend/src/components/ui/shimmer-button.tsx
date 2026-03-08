import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function ShimmerButton({ children, className = '', onClick }: ShimmerButtonProps) {
  return (
    <motion.button
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear',
        }}
      />
    </motion.button>
  )
}

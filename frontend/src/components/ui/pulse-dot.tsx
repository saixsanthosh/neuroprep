import { motion } from 'framer-motion'

interface PulseDotProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
}

export function PulseDot({ color = 'bg-cyan-400', size = 'md', className = '' }: PulseDotProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <motion.span
        className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.75, 0, 0.75],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className={`relative inline-flex rounded-full ${color} ${sizeClasses[size]}`} />
    </div>
  )
}

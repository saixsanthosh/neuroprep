import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ReactNode } from 'react'

interface GlowingCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function GlowingCard({
  children,
  className = '',
  glowColor = 'rgba(34, 211, 238, 0.4)',
}: GlowingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { ReactNode } from 'react'

interface GlowingCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'cyan' | 'purple' | 'pink' | 'amber' | 'violet' | 'yellow' | string
}

const glowColorMap = {
  cyan: 'rgba(34, 211, 238, 0.4)',
  purple: 'rgba(168, 85, 247, 0.4)',
  pink: 'rgba(236, 72, 153, 0.4)',
  amber: 'rgba(251, 191, 36, 0.4)',
  violet: 'rgba(139, 92, 246, 0.4)',
  yellow: 'rgba(250, 204, 21, 0.4)',
}

export function GlowingCard({
  children,
  className = '',
  glowColor = 'cyan',
}: GlowingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const resolvedGlowColor = glowColorMap[glowColor as keyof typeof glowColorMap] || glowColor

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
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${resolvedGlowColor}, transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 p-6">{children}</div>
    </motion.div>
  )
}

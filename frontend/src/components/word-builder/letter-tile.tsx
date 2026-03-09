import { motion } from 'framer-motion'

interface LetterTileProps {
  letter: string
  onClick?: () => void
  glowColor?: 'violet' | 'cyan' | 'emerald' | 'amber'
  size?: 'sm' | 'md' | 'lg'
}

const glowColors = {
  violet: 'shadow-[0_0_30px_rgba(139,92,246,0.5)] border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-purple-600/20',
  cyan: 'shadow-[0_0_30px_rgba(34,211,238,0.5)] border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
  emerald: 'shadow-[0_0_30px_rgba(16,185,129,0.5)] border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-teal-600/20',
  amber: 'shadow-[0_0_30px_rgba(251,191,36,0.5)] border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-orange-600/20',
}

const sizes = {
  sm: 'h-12 w-12 text-2xl',
  md: 'h-16 w-16 text-3xl sm:h-20 sm:w-20 sm:text-4xl',
  lg: 'h-20 w-20 text-4xl sm:h-24 sm:w-24 sm:text-5xl',
}

export function LetterTile({ letter, onClick, glowColor = 'violet', size = 'md' }: LetterTileProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, rotate: 180 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={`
        relative flex items-center justify-center rounded-2xl border-2
        font-black uppercase text-white backdrop-blur-xl
        transition-all duration-300
        hover:shadow-[0_0_50px_rgba(139,92,246,0.8)]
        ${glowColors[glowColor]}
        ${sizes[size]}
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      
      {/* Letter */}
      <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        {letter}
      </span>

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            '0 0 20px rgba(139,92,246,0.3)',
            '0 0 40px rgba(139,92,246,0.6)',
            '0 0 20px rgba(139,92,246,0.3)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  )
}

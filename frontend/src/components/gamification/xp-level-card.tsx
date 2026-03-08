import { motion } from 'framer-motion'
import { Zap, Star } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'
import { AnimatedCounter } from '../ui/animated-counter'

interface XPLevelCardProps {
  level: number
  levelTitle: string
  currentXP: number
  xpForNextLevel: number
  totalXP: number
}

export function XPLevelCard({ level, levelTitle, currentXP, xpForNextLevel, totalXP }: XPLevelCardProps) {
  const progress = (currentXP / xpForNextLevel) * 100

  return (
    <GlowingCard className="p-5 sm:p-6" glowColor="rgba(34, 211, 238, 0.4)">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="shrink-0"
            >
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
            </motion.div>
            <h3 className="text-base sm:text-lg font-bold text-white truncate">Level & XP</h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 truncate">Your learning progress</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-cyan-300">Total XP</p>
          <p className="text-xl sm:text-2xl font-black text-white">
            <AnimatedCounter value={totalXP} />
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-2">
        <motion.div
          className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 sm:p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-300 shrink-0" />
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-cyan-300 truncate">Level</p>
          </div>
          <p className="mt-2 text-3xl sm:text-4xl font-black text-white">
            <AnimatedCounter value={level} />
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-cyan-200 truncate">{levelTitle}</p>
        </motion.div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 truncate">Next Level</p>
          <p className="mt-2 text-lg sm:text-2xl font-bold text-white">
            <AnimatedCounter value={currentXP} />
            <span className="text-sm sm:text-base text-slate-400"> / {xpForNextLevel}</span>
          </p>
          <p className="mt-1 text-[10px] sm:text-xs text-slate-400 truncate">XP needed</p>
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <div className="mb-2 flex items-center justify-between text-xs sm:text-sm gap-2">
          <span className="text-slate-400 truncate">Progress to Level {level + 1}</span>
          <span className="font-semibold text-cyan-300 shrink-0">{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2.5 sm:h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
    </GlowingCard>
  )
}

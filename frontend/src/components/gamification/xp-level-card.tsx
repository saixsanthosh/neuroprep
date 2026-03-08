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
    <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.4)">
      <div className="flex items-start justify-between">
        <div>
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
            >
              <Zap className="h-6 w-6 text-cyan-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-white">Level & XP</h3>
          </div>
          <p className="mt-1 text-sm text-slate-400">Your learning progress</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-cyan-300">Total XP</p>
          <p className="text-2xl font-black text-white">
            <AnimatedCounter value={totalXP} />
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <motion.div
          className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-cyan-300" />
            <p className="text-xs uppercase tracking-wider text-cyan-300">Level</p>
          </div>
          <p className="mt-2 text-4xl font-black text-white">
            <AnimatedCounter value={level} />
          </p>
          <p className="mt-1 text-sm font-medium text-cyan-200">{levelTitle}</p>
        </motion.div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Next Level</p>
          <p className="mt-2 text-2xl font-bold text-white">
            <AnimatedCounter value={currentXP} /> / {xpForNextLevel}
          </p>
          <p className="mt-1 text-xs text-slate-400">XP needed</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">Progress to Level {level + 1}</span>
          <span className="font-semibold text-cyan-300">{Math.round(progress)}%</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
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

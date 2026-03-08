import { motion } from 'framer-motion'
import { Flame, Trophy, Snowflake } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'
import { AnimatedCounter } from '../ui/animated-counter'

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  freezeCount: number
  isAtRisk?: boolean
}

export function StreakCard({ currentStreak, longestStreak, freezeCount, isAtRisk }: StreakCardProps) {
  return (
    <GlowingCard className="p-6" glowColor="rgba(251, 146, 60, 0.4)">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Flame className="h-6 w-6 text-orange-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-white">Study Streak</h3>
          </div>
          <p className="mt-1 text-sm text-slate-400">Keep the momentum going!</p>
        </div>
        {freezeCount > 0 && (
          <div className="flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1">
            <Snowflake className="h-3.5 w-3.5 text-cyan-300" />
            <span className="text-xs font-medium text-cyan-200">{freezeCount} freezes</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <motion.div
          className="rounded-xl border border-orange-400/20 bg-orange-400/10 p-4"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs uppercase tracking-wider text-orange-300">Current</p>
          <p className="mt-2 text-3xl font-black text-white">
            <AnimatedCounter value={currentStreak} />
            <span className="text-lg">d</span>
          </p>
        </motion.div>

        <motion.div
          className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center gap-1">
            <Trophy className="h-3.5 w-3.5 text-amber-300" />
            <p className="text-xs uppercase tracking-wider text-amber-300">Best</p>
          </div>
          <p className="mt-2 text-3xl font-black text-white">
            <AnimatedCounter value={longestStreak} />
            <span className="text-lg">d</span>
          </p>
        </motion.div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Milestones</p>
          <div className="mt-2 flex gap-1">
            {[3, 7, 14, 30].map((milestone) => (
              <div
                key={milestone}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                  currentStreak >= milestone
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                    : 'border border-white/10 bg-white/5 text-slate-500'
                }`}
              >
                {milestone}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isAtRisk && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3"
        >
          <p className="text-sm text-red-200">
            ⚠️ Your streak is at risk! Complete a study session today to keep it alive.
          </p>
        </motion.div>
      )}
    </GlowingCard>
  )
}

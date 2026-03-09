import { motion } from 'framer-motion'
import { Clock3, Flame, LoaderCircle, Star, Target, Zap } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

interface PlayerStatsPanelProps {
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  combo: number
  accuracy: number
  coins: number
  modeLabel: string
  isSavingScore?: boolean
  botScore?: number
}

export function PlayerStatsPanel({
  level,
  xp,
  xpToNextLevel,
  streak,
  combo,
  accuracy,
  coins,
  modeLabel,
  isSavingScore = false,
  botScore,
}: PlayerStatsPanelProps) {
  const xpProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0

  return (
    <div className="space-y-4">
      <GlowingCard className="p-5" glowColor="rgba(139, 92, 246, 0.4)">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Level</p>
              <p className="text-2xl font-black text-white">{level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">XP</p>
            <p className="font-mono text-sm font-bold text-violet-300">
              {xp}/{xpToNextLevel}
            </p>
          </div>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">{Math.round(xpProgress)}% to next level</p>
      </GlowingCard>

      <div className="grid grid-cols-2 gap-3">
        <GlowingCard className="p-4" glowColor="rgba(251, 146, 60, 0.4)">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-300" />
            <p className="text-xs text-slate-400">Streak</p>
          </div>
          <motion.p
            key={streak}
            initial={{ scale: 1.5, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="mt-2 text-3xl font-black"
          >
            {streak}
          </motion.p>
        </GlowingCard>

        <GlowingCard className="p-4" glowColor="rgba(34, 211, 238, 0.4)">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-300" />
            <p className="text-xs text-slate-400">Combo</p>
          </div>
          <motion.p
            key={combo}
            initial={{ scale: 1.5, color: '#22d3ee' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="mt-2 text-3xl font-black"
          >
            x{combo.toFixed(1)}
          </motion.p>
        </GlowingCard>
      </div>

      <GlowingCard className="p-5" glowColor="rgba(16, 185, 129, 0.4)">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-300" />
          <p className="text-xs text-slate-400">Accuracy</p>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="mt-2 text-center text-2xl font-black text-white">{accuracy}%</p>
      </GlowingCard>

      <div className="grid grid-cols-2 gap-3">
        <GlowingCard className="p-4" glowColor="rgba(251, 191, 36, 0.35)">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-amber-300" />
            <p className="text-xs text-slate-400">Coins</p>
          </div>
          <p className="mt-2 text-3xl font-black text-white">{coins}</p>
        </GlowingCard>

        <GlowingCard className="p-4" glowColor="rgba(34, 211, 238, 0.35)">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-300" />
            <p className="text-xs text-slate-400">Mode</p>
          </div>
          <p className="mt-2 text-lg font-black capitalize text-white">{modeLabel}</p>
        </GlowingCard>
      </div>

      {typeof botScore === 'number' ? (
        <GlowingCard className="p-4" glowColor="rgba(244, 114, 182, 0.35)">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-300">Bot Pressure</p>
              <p className="mt-2 text-3xl font-black text-white">{botScore}</p>
            </div>
            <div className="rounded-xl border border-pink-300/20 bg-pink-400/10 px-3 py-1 text-xs text-pink-100">
              Battle live
            </div>
          </div>
        </GlowingCard>
      ) : null}

      <GlowingCard className="p-4" glowColor="rgba(167, 139, 250, 0.3)">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-300">Pro Tips</p>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-violet-400">-</span>
            <span>Build streaks for stronger score multipliers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400">-</span>
            <span>Save hints for longer science and history words.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400">-</span>
            <span>Shuffle before guessing if the letter order feels misleading.</span>
          </li>
        </ul>
      </GlowingCard>

      {isSavingScore ? (
        <GlowingCard className="p-4" glowColor="rgba(56, 189, 248, 0.25)">
          <div className="flex items-center gap-3 text-sm text-cyan-100">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Saving score to the live leaderboard...</span>
          </div>
        </GlowingCard>
      ) : null}
    </div>
  )
}

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

type LevelProgressProps = {
  level: number
  currentXP: number
  xpForNextLevel: number
  totalXP: number
}

export function LevelProgress({ level, currentXP, xpForNextLevel, totalXP }: LevelProgressProps) {
  const progress = (currentXP / xpForNextLevel) * 100
  const levelTitles = ['Beginner', 'Novice', 'Learner', 'Scholar', 'Expert', 'Master', 'Guru']
  const levelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)] || 'Beginner'

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-2.5">
            <Zap className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Level & XP</h3>
            <p className="text-xs text-slate-400">Your learning progress</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total XP</p>
          <p className="text-2xl font-bold text-cyan-300">{totalXP}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
          <p className="text-xs uppercase tracking-wider text-cyan-300 mb-2">Level</p>
          <p className="text-4xl font-black text-white mb-1">{level}</p>
          <p className="text-sm font-medium text-cyan-200">{levelTitle}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">Next Level</p>
          <p className="text-4xl font-black text-white mb-1">
            {currentXP}
            <span className="text-lg text-slate-400">/{xpForNextLevel}</span>
          </p>
          <p className="text-sm font-medium text-slate-300">XP needed</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Progress to Level {level + 1}</span>
          <span className="font-semibold text-cyan-300">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/10 p-[2px] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 opacity-40" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

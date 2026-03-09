import { motion } from 'framer-motion'
import { Award, BookOpen, Code2, Cpu, FlaskConical, Flame, ScrollText, Sigma, Sparkles, Trophy } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

type Category =
  | 'science'
  | 'technology'
  | 'programming'
  | 'english'
  | 'history'
  | 'mathematics'
  | 'general-knowledge'

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

interface LeaderboardEntry {
  name: string
  score: number
}

interface GameInfoPanelProps {
  category: Category
  difficulty: Difficulty
  streak: number
  solvedCount: number
  leaderboard: LeaderboardEntry[]
}

const categoryIcons = {
  science: FlaskConical,
  technology: Cpu,
  programming: Code2,
  english: BookOpen,
  history: ScrollText,
  mathematics: Sigma,
  'general-knowledge': Sparkles,
} satisfies Record<Category, typeof BookOpen>

const categoryLabels: Record<Category, string> = {
  science: 'Science',
  technology: 'Technology',
  programming: 'Programming',
  english: 'English',
  history: 'History',
  mathematics: 'Mathematics',
  'general-knowledge': 'General Knowledge',
}

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'from-emerald-400 to-teal-500',
  intermediate: 'from-cyan-400 to-blue-500',
  advanced: 'from-violet-400 to-purple-500',
  expert: 'from-red-400 to-rose-500',
}

const dailyGoal = 10

export function GameInfoPanel({ category, difficulty, streak, solvedCount, leaderboard }: GameInfoPanelProps) {
  const CategoryIcon = categoryIcons[category]
  const challengeProgress = Math.min(100, (solvedCount / dailyGoal) * 100)

  return (
    <div className="space-y-4">
      <GlowingCard className="p-5" glowColor="rgba(34, 211, 238, 0.4)">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-cyan-300" />
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Current Puzzle</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-1 text-xs text-slate-400">Category</p>
            <div className="flex items-center gap-2">
              <CategoryIcon className="h-5 w-5 text-cyan-200" />
              <p className="font-semibold text-white">{categoryLabels[category]}</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs text-slate-400">Difficulty</p>
            <div className={`inline-flex rounded-lg bg-gradient-to-r ${difficultyColors[difficulty]} px-3 py-1 text-sm font-bold capitalize text-white`}>
              {difficulty}
            </div>
          </div>
        </div>
      </GlowingCard>

      <GlowingCard className="p-5" glowColor="rgba(251, 146, 60, 0.4)">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-300" />
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">Streak Tracker</p>
        </div>

        <div className="text-center">
          <motion.p key={streak} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-black text-white">
            {streak}
          </motion.p>
          <p className="mt-2 text-sm text-slate-400">Correct in a row</p>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: index < streak ? 1 : 0.5 }}
              className={`aspect-square rounded-lg ${
                index < streak
                  ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-[0_0_20px_rgba(251,146,60,0.5)]'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </GlowingCard>

      <GlowingCard className="p-5" glowColor="rgba(139, 92, 246, 0.4)">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-violet-300" />
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Leaderboard</p>
        </div>

        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div key={`${entry.name}-${index}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 font-bold text-slate-300">{index + 1}</span>
                <span className="font-medium text-white">{entry.name}</span>
              </div>
              <span className="font-bold text-violet-300">{entry.score}</span>
            </div>
          ))}
        </div>
      </GlowingCard>

      <GlowingCard className="p-5" glowColor="rgba(16, 185, 129, 0.4)">
        <div className="mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-300" />
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Daily Challenge</p>
        </div>
        <p className="text-sm text-slate-300">Solve {dailyGoal} puzzles today to claim the session bonus.</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" initial={{ width: 0 }} animate={{ width: `${challengeProgress}%` }} />
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">{Math.min(solvedCount, dailyGoal)}/{dailyGoal} completed</p>
      </GlowingCard>
    </div>
  )
}

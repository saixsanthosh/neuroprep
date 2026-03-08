import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'
import { GlowingCard } from '../ui/glowing-card'
import { FilterTabs } from '../ui/filter-tabs'
import { useState } from 'react'

interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  level: number
  streak: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState('weekly')

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/30 bg-yellow-400/10'
    if (rank === 2) return 'border-slate-300/30 bg-slate-300/10'
    if (rank === 3) return 'border-amber-600/30 bg-amber-600/10'
    return 'border-white/10 bg-white/5'
  }

  return (
    <GlowingCard className="p-6" glowColor="rgba(251, 191, 36, 0.4)">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Leaderboard</h3>
        </div>
        <FilterTabs
          tabs={[
            { id: 'weekly', label: 'Weekly' },
            { id: 'global', label: 'Global' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.username}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${getRankStyle(entry.rank)}`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 font-bold text-white">
              {getRankIcon(entry.rank) || `#${entry.rank}`}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{entry.username}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Level {entry.level}</span>
                <span>•</span>
                <span>{entry.streak}d streak</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-amber-300">{entry.xp.toLocaleString()}</p>
              <p className="text-xs text-slate-400">XP</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlowingCard>
  )
}

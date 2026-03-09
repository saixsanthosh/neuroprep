import { motion } from 'framer-motion'
import { ListTodo, RadioTower, TimerReset } from 'lucide-react'

import { GlowingCard } from '../ui/glowing-card'

interface MissionItem {
  id: string
  title: string
  detail: string
  reward: string
}

interface WarzoneMissionFeedProps {
  missions: MissionItem[]
}

export function WarzoneMissionFeed({ missions }: WarzoneMissionFeedProps) {
  return (
    <GlowingCard className="p-6" glowColor="rgba(16, 185, 129, 0.24)">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/15 p-3">
            <ListTodo className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Mission Feed</h3>
            <p className="text-sm text-slate-400">Core phase objectives and queue prep.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
          <TimerReset className="h-4 w-4" />
          Refreshing
        </div>
      </div>

      <div className="space-y-3">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{mission.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{mission.detail}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                <RadioTower className="h-3.5 w-3.5" />
                {mission.reward}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlowingCard>
  )
}

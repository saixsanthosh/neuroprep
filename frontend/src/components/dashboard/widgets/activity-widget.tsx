import { motion } from 'framer-motion'
import { Activity, BookOpen, Trophy, Target } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'

interface ActivityItem {
  id: string
  type: 'study' | 'achievement' | 'goal'
  message: string
  time: string
}

interface ActivityWidgetProps {
  activities: ActivityItem[]
}

const activityIcons = {
  study: BookOpen,
  achievement: Trophy,
  goal: Target,
}

const activityColors = {
  study: 'text-cyan-400',
  achievement: 'text-amber-400',
  goal: 'text-purple-400',
}

export function ActivityWidget({ activities }: ActivityWidgetProps) {
  return (
    <GlowingCard glowColor="purple" className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-purple-400" />
        <h3 className="font-bold text-white">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, index) => {
          const Icon = activityIcons[activity.type]
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className={`rounded-lg bg-white/10 p-2 ${activityColors[activity.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlowingCard>
  )
}

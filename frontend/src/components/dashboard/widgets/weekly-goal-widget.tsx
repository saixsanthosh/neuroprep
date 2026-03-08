import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'

interface Goal {
  title: string
  current: number
  target: number
  unit: string
}

interface WeeklyGoalWidgetProps {
  goals: Goal[]
}

export function WeeklyGoalWidget({ goals }: WeeklyGoalWidgetProps) {
  return (
    <GlowingCard glowColor="violet" className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-violet-400" />
        <h3 className="font-bold text-white">Weekly Goals</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100
          const isComplete = progress >= 100

          return (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white">{goal.title}</span>
                <div className="flex items-center gap-1">
                  {isComplete && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                  <span className={`text-sm font-bold ${isComplete ? 'text-emerald-400' : 'text-violet-400'}`}>
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  className={`h-full rounded-full ${
                    isComplete
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600'
                  }`}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </GlowingCard>
  )
}

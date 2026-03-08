import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Clock, Target } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'

interface DailySummaryWidgetProps {
  date: string
  studyTime: number
  tasksCompleted: number
  totalTasks: number
  focusScore: number
}

export function DailySummaryWidget({
  date,
  studyTime,
  tasksCompleted,
  totalTasks,
  focusScore,
}: DailySummaryWidgetProps) {
  return (
    <GlowingCard glowColor="amber" className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-amber-400" />
        <div>
          <h3 className="font-bold text-white">Daily Summary</h3>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-white/10 bg-white/5 p-3"
        >
          <Clock className="mb-2 h-4 w-4 text-cyan-400" />
          <p className="text-2xl font-black text-white">{studyTime}h</p>
          <p className="text-xs text-slate-400">Study Time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-white/10 bg-white/5 p-3"
        >
          <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-400" />
          <p className="text-2xl font-black text-white">
            {tasksCompleted}/{totalTasks}
          </p>
          <p className="text-xs text-slate-400">Tasks Done</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-slate-400">Focus Score</span>
            </div>
            <span className="text-lg font-bold text-purple-400">{focusScore}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${focusScore}%` }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-600"
            />
          </div>
        </motion.div>
      </div>
    </GlowingCard>
  )
}

import { motion } from 'framer-motion'
import { Brain, BookOpen, Target, Timer, FileText, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GlowingCard } from '../../ui/glowing-card'

const actions = [
  { icon: Brain, label: 'AI Tutor', route: '/dashboard/ai-tutor', color: 'from-cyan-400 to-blue-500' },
  { icon: BookOpen, label: 'Notes', route: '/dashboard/notes', color: 'from-purple-400 to-pink-500' },
  { icon: Target, label: 'Mock Test', route: '/dashboard/mock-tests', color: 'from-amber-400 to-orange-500' },
  { icon: Timer, label: 'Timer', route: '/dashboard/timer', color: 'from-emerald-400 to-teal-500' },
  { icon: FileText, label: 'Planner', route: '/dashboard/planner', color: 'from-violet-400 to-purple-500' },
  { icon: Trophy, label: 'Games', route: '/dashboard/games', color: 'from-rose-400 to-red-500' },
]

export function QuickActionsWidget() {
  const navigate = useNavigate()

  return (
    <GlowingCard glowColor="violet" className="h-full">
      <div className="mb-4">
        <h3 className="font-bold text-white">Quick Actions</h3>
        <p className="text-xs text-slate-400">Jump to any feature</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.route)}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-br ${action.color} p-2`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-white">{action.label}</p>
            </motion.button>
          )
        })}
      </div>
    </GlowingCard>
  )
}

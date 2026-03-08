import { motion } from 'framer-motion'
import { CheckCircle2, Circle, ListTodo } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface TasksWidgetProps {
  tasks: Task[]
}

export function TasksWidget({ tasks }: TasksWidgetProps) {
  const completedCount = tasks.filter(t => t.completed).length

  return (
    <GlowingCard glowColor="cyan" className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-white">Upcoming Tasks</h3>
        </div>
        <span className="text-xs text-slate-400">
          {completedCount}/{tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.slice(0, 4).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
          >
            {task.completed ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <Circle className="h-4 w-4 flex-shrink-0 text-slate-500" />
            )}
            <span className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
              {task.title}
            </span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                task.priority === 'high'
                  ? 'bg-red-500/20 text-red-300'
                  : task.priority === 'medium'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-slate-500/20 text-slate-400'
              }`}
            >
              {task.priority}
            </span>
          </motion.div>
        ))}
      </div>
    </GlowingCard>
  )
}

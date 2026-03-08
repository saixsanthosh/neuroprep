import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, ChevronLeft, ChevronRight, Sparkles, Target } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Card, CardDescription, CardTitle } from '../components/ui/card'

type PlannerTask = {
  id: string
  title: string
  subject: string
  completed: boolean
}

const initialTasks: PlannerTask[] = [
  { id: 't1', title: 'Revise Motion chapter', subject: 'Physics', completed: false },
  { id: 't2', title: 'Practice Organic naming', subject: 'Chemistry', completed: false },
  { id: 't3', title: 'Mock test - Algebra', subject: 'Math', completed: false },
]

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<number | null> = Array(startOffset).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day)
  }

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return cells
}

export function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState(initialTasks)
  const [schedule, setSchedule] = useState<Record<number, PlannerTask[]>>({
    4: [initialTasks[0]],
    8: [initialTasks[1]],
    15: [initialTasks[2]],
  })

  const monthData = useMemo(
    () => getMonthGrid(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  )

  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const completion = Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)

  const onDropTask = (day: number, taskId: string) => {
    const task = tasks.find((entry) => entry.id === taskId)
    if (!task) {
      return
    }

    setSchedule((prev) => {
      const next = { ...prev }
      const existing = next[day] ?? []
      if (!existing.some((entry) => entry.id === task.id)) {
        next[day] = [...existing, task]
      }
      return next
    })
  }

  return (
    <div className="space-y-6 pb-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Planner control deck
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Calendar planning with a <span className="text-gradient">premium scheduling surface</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Drag tasks into study slots, monitor plan completion, and move through the month with
              smoother transitions and clearer task visibility.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Completion', `${completion}%`],
              ['Scheduled Days', `${Object.keys(schedule).length}`],
              ['Open Tasks', `${tasks.filter((task) => !task.completed).length}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="glass-panel p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">{monthLabel}</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Drag tasks onto dates to generate your daily study schedule.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="rounded-xl border border-white/15 bg-white/5 p-2 text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="rounded-xl border border-white/15 bg-white/5 p-2 text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="px-2 py-1 text-center uppercase tracking-[0.14em]">
                {day}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={monthLabel}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28 }}
              className="mt-2 grid grid-cols-7 gap-2"
            >
              {monthData.map((day, index) => (
                <div
                  key={`${monthLabel}-${index}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    const taskId = event.dataTransfer.getData('task-id')
                    if (day && taskId) {
                      onDropTask(day, taskId)
                    }
                  }}
                  className="min-h-[94px] rounded-[1.1rem] border border-white/10 bg-white/5 p-2 transition hover:border-cyan-300/15 hover:bg-white/8"
                >
                  {day && (
                    <>
                      <p className="text-xs text-slate-400">{day}</p>
                      <div className="mt-2 space-y-1.5">
                        {(schedule[day] ?? []).slice(0, 2).map((task) => (
                          <span
                            key={`${day}-${task.id}`}
                            className="block rounded-lg bg-[linear-gradient(135deg,rgba(91,33,182,0.35),rgba(14,165,233,0.28))] px-2 py-1 text-[10px] text-cyan-100"
                          >
                            {task.subject}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Card>

        <div className="space-y-4">
          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Daily Study Tasks</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              Drag any task into the calendar and mark it done as you complete it.
            </CardDescription>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('task-id', task.id)}
                    className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <p className="text-xs text-slate-400">{task.subject}</p>
                    </div>
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs ${
                        task.completed ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/10 text-slate-300'
                      }`}
                      onClick={() =>
                        setTasks((prev) =>
                          prev.map((entry) =>
                            entry.id === task.id ? { ...entry, completed: !entry.completed } : entry,
                          ),
                        )
                      }
                    >
                      {task.completed ? 'Done' : 'Mark done'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Planner Signal</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              Animated progress and quick status cues keep the plan readable.
            </CardDescription>

            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>Task Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan"
              />
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-300">
                <CalendarClock className="h-3.5 w-3.5" />
                Plan recommendation
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Keep Physics early in the week, move one Math drill into Friday, and reserve Sunday
                for a timed review session.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-violet-200">
                <Target className="h-3.5 w-3.5" />
                Revision-ready layout
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

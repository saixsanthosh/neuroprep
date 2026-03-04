import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Study Planner</h1>
        <p className="mt-1 text-muted">Calendar-based planning with drag-and-drop scheduling and progress indicators.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <CardTitle>{monthLabel}</CardTitle>
              <CardDescription>Drag tasks onto dates to build daily schedules.</CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="rounded-xl border border-white/15 bg-white/5 p-2 transition hover:bg-white/15"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="rounded-xl border border-white/15 bg-white/5 p-2 transition hover:bg-white/15"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs text-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="px-2 py-1 text-center">
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
                  className="min-h-[84px] rounded-xl border border-white/10 bg-white/5 p-2"
                >
                  {day && (
                    <>
                      <p className="text-xs text-muted">{day}</p>
                      <div className="mt-1 space-y-1">
                        {(schedule[day] ?? []).slice(0, 2).map((task) => (
                          <span
                            key={`${day}-${task.id}`}
                            className="block rounded-lg bg-primary-500/25 px-2 py-1 text-[10px] text-primary-200"
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
          <Card>
            <CardTitle>Daily Study Tasks</CardTitle>
            <CardDescription className="mb-4">Drag and drop these into calendar dates.</CardDescription>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl"
                >
                  <div
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('task-id', task.id)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted">{task.subject}</p>
                    </div>
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs ${task.completed ? 'bg-emerald-500/25 text-emerald-300' : 'bg-white/10 text-muted'}`}
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

          <Card>
            <CardTitle>Progress Indicator</CardTitle>
            <CardDescription className="mb-4">Animated completion status for current plan.</CardDescription>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Task Completion</span>
              <span className="text-muted">{completion}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

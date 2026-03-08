import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, ChevronLeft, ChevronRight, Sparkles, Target, Plus, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CardDescription, CardTitle } from '../components/ui/card'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'
import { AnimatedCounter } from '../components/ui/animated-counter'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

type PlannerTask = {
  id: string
  title: string
  subject: string
  duration: string
  completed: boolean
}

const initialTasks: PlannerTask[] = [
  { id: 't1', title: 'Revise Motion chapter', subject: 'Physics', duration: '45 min', completed: false },
  { id: 't2', title: 'Practice Organic naming', subject: 'Chemistry', duration: '30 min', completed: false },
  { id: 't3', title: 'Mock test - Algebra', subject: 'Math', duration: '90 min', completed: false },
  { id: 't4', title: 'Thermodynamics problems', subject: 'Physics', duration: '40 min', completed: false },
  { id: 't5', title: 'Calculus integration', subject: 'Math', duration: '50 min', completed: false },
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

function getWeekDays(date: Date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start)
    next.setDate(start.getDate() + index)
    return next
  })
}

export function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedDay, setSelectedDay] = useState(8)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskSubject, setNewTaskSubject] = useState('Physics')
  const [newTaskDuration, setNewTaskDuration] = useState('45 min')
  const [schedule, setSchedule] = useState<Record<number, PlannerTask[]>>({
    4: [initialTasks[0]],
    8: [initialTasks[1]],
    15: [initialTasks[2]],
  })

  const monthData = useMemo(
    () => getMonthGrid(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  )
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const completion = Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)
  const examDate = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 21), [currentDate])
  const daysUntilExam = Math.max(
    1,
    Math.ceil((examDate.getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000),
  )
  const selectedDayTasks = schedule[selectedDay] ?? []

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
    setSelectedDay(day)
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    const newTask: PlannerTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      duration: newTaskDuration,
      completed: false,
    }
    setTasks((prev) => [newTask, ...prev])
    setNewTaskTitle('')
  }

  return (
    <div className="relative min-h-screen space-y-6 pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="-right-20 top-10"
        colors={['rgba(34, 211, 238, 0.15)', 'rgba(56, 189, 248, 0.1)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-20 left-10"
        colors={['rgba(124, 58, 237, 0.15)', 'rgba(167, 139, 250, 0.1)']}
        size="md"
        delay={1}
      />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] backdrop-blur-2xl sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
                <PulseDot size="sm" color="bg-cyan-400" />
                <Sparkles className="h-3.5 w-3.5" />
                Planner control deck
              </div>
            </motion.div>
            
            <motion.h1
              className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Calendar planning with a <GradientText>premium scheduling surface</GradientText>.
            </motion.h1>
            
            <motion.p
              className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Drag tasks into study slots, monitor plan completion, and move through the month with
              smoother transitions and clearer task visibility.
            </motion.p>
          </div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { label: 'Completion', value: completion, suffix: '%', icon: TrendingUp },
              { label: 'Scheduled Days', value: Object.keys(schedule).length, icon: CalendarClock },
              { label: 'Open Tasks', value: tasks.filter((task) => !task.completed).length, icon: Target },
              { label: 'Exam Countdown', value: daysUntilExam, suffix: 'd', icon: Sparkles },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-cyan-300" />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.3)">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white">{monthLabel}</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Drag tasks onto dates, switch views, and build a real daily agenda.
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
                  {(['month', 'week'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`rounded-xl px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                        viewMode === mode ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
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

            {viewMode === 'month' ? (
              <>
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
                      <button
                        key={`${monthLabel}-${index}`}
                        type="button"
                        onClick={() => day && setSelectedDay(day)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          const taskId = event.dataTransfer.getData('task-id')
                          if (day && taskId) {
                            onDropTask(day, taskId)
                          }
                        }}
                        className={`min-h-[94px] rounded-[1.1rem] border p-2 text-left transition hover:border-cyan-300/15 hover:bg-white/8 ${
                          day === selectedDay ? 'border-cyan-300/30 bg-cyan-300/10' : 'border-white/10 bg-white/5'
                        }`}
                      >
                        {day ? (
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
                        ) : null}
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
                {weekDays.map((day) => {
                  const dayNumber = day.getDate()
                  const entries = schedule[dayNumber] ?? []
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDay(dayNumber)}
                      className={`rounded-[1.2rem] border p-4 text-left transition ${
                        selectedDay === dayNumber ? 'border-cyan-300/30 bg-cyan-300/10' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">{dayNumber}</p>
                      <div className="mt-3 space-y-2">
                        {entries.length ? (
                          entries.map((task) => (
                            <div key={task.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                              <p className="text-xs font-medium text-white">{task.title}</p>
                              <p className="mt-1 text-[11px] text-slate-400">
                                {task.subject} · {task.duration}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500">No study blocks assigned.</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </GlowingCard>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-white">Daily Study Tasks</CardTitle>
                <button className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-cyan-300 transition hover:bg-white/10">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <CardDescription className="mb-4 text-slate-400">
                Drag any task into the calendar and mark it done as you complete it.
              </CardDescription>
              <div className="mb-4 space-y-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <Input
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  placeholder="Add a new study task"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={newTaskSubject} onChange={(event) => setNewTaskSubject(event.target.value)} />
                  <Input value={newTaskDuration} onChange={(event) => setNewTaskDuration(event.target.value)} />
                </div>
                <Button className="w-full" onClick={handleAddTask}>
                  <Plus className="h-4 w-4" />
                  Add task to backlog
                </Button>
              </div>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <div
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('task-id', task.id)}
                      className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10 cursor-move"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{task.title}</p>
                        <p className="text-xs text-slate-400">
                          {task.subject} · {task.duration}
                        </p>
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
            </GlowingCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(236, 72, 153, 0.3)">
              <CardTitle className="text-white">Selected Day Agenda</CardTitle>
              <CardDescription className="mb-4 mt-1 text-slate-400">
                Review the assignments mapped to day {selectedDay} and use this lane as the daily execution sheet.
              </CardDescription>
              <div className="space-y-3">
                {selectedDayTasks.length ? (
                  selectedDayTasks.map((task) => (
                    <div key={`${selectedDay}-${task.id}`} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {task.subject} · {task.duration}
                          </p>
                        </div>
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-200">
                          scheduled
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    Nothing is scheduled on this day yet. Drag a task into the calendar or switch to week mode.
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-300">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Planner signal
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Keep Physics early in the week, move one Math drill into Friday, and reserve Sunday
                  for a timed review session.
                </p>
              </div>
            </GlowingCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.3)">
              <CardTitle className="text-white">Study Stats</CardTitle>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total tasks</span>
                  <span className="font-semibold text-white">{tasks.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Completed</span>
                  <span className="font-semibold text-emerald-300">{tasks.filter(t => t.completed).length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Pending</span>
                  <span className="font-semibold text-orange-300">{tasks.filter(t => !t.completed).length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Exam date</span>
                  <span className="font-semibold text-cyan-200">
                    {examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

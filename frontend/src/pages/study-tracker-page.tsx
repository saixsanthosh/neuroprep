import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock3, ListChecks, PlusCircle, Trash2 } from 'lucide-react'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { Input } from '../components/ui/input'
import {
  createStudySession,
  createTask,
  deleteTask,
  getStudyHistory,
  getStudyStats,
  getTasks,
  updateTask,
  type StudySession,
  type StudyStatsResponse,
  type StudyTask,
} from '../lib/api'

function toDatetimeLocalValue(value: Date) {
  const offset = value.getTimezoneOffset() * 60_000
  return new Date(value.getTime() - offset).toISOString().slice(0, 16)
}

export function StudyTrackerPage() {
  const [history, setHistory] = useState<StudySession[]>([])
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [stats, setStats] = useState<StudyStatsResponse | null>(null)
  const [sessionSubject, setSessionSubject] = useState('Deep Work')
  const [sessionDuration, setSessionDuration] = useState('45')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskSubject, setTaskSubject] = useState('General')
  const [taskDeadline, setTaskDeadline] = useState(toDatetimeLocalValue(new Date(Date.now() + 86_400_000)))
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [historyData, taskData, statsData] = await Promise.all([
        getStudyHistory(40),
        getTasks(),
        getStudyStats(),
      ])
      setHistory(historyData)
      setTasks(taskData)
      setStats(statsData)
      setStatusMessage('Study tracker synced with the latest sessions and tasks.')
    } catch {
      setStatusMessage('Study tracker data could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const pendingTasks = useMemo(() => tasks.filter((task) => task.status === 'pending'), [tasks])

  const handleLogSession = async () => {
    const duration = Number(sessionDuration)
    if (!sessionSubject.trim() || !Number.isFinite(duration) || duration <= 0) {
      setStatusMessage('Enter a valid subject and duration before logging a session.')
      return
    }

    try {
      const created = await createStudySession({
        subject: sessionSubject.trim(),
        duration,
        session_type: 'study',
        date: new Date().toISOString().slice(0, 10),
      })
      setHistory((current) => [created, ...current].slice(0, 40))
      setStatusMessage('Study session logged successfully.')
      const refreshedStats = await getStudyStats()
      setStats(refreshedStats)
    } catch {
      setStatusMessage('Logging the study session failed.')
    }
  }

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !taskSubject.trim() || !taskDeadline) {
      setStatusMessage('Fill in the task title, subject, and deadline before saving.')
      return
    }

    try {
      const created = await createTask({
        title: taskTitle.trim(),
        subject: taskSubject.trim(),
        deadline: new Date(taskDeadline).toISOString(),
      })
      setTasks((current) => [created, ...current])
      setTaskTitle('')
      setStatusMessage('Task created.')
    } catch {
      setStatusMessage('Creating the task failed.')
    }
  }

  const handleToggleTask = async (task: StudyTask) => {
    try {
      const updated = await updateTask({
        id: task.id,
        status: task.status === 'completed' ? 'pending' : 'completed',
      })
      setTasks((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)))
    } catch {
      setStatusMessage('Updating the task failed.')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((current) => current.filter((task) => task.id !== taskId))
    } catch {
      setStatusMessage('Deleting the task failed.')
    }
  }

  return (
    <ModulePageShell
      badge="Study tracker"
      title="Track real work, not"
      highlight="just intentions"
      description="Log study sessions, keep the task queue current, and keep the planner grounded in actual work instead of static cards."
      actions={
        <Button variant="secondary" onClick={() => void loadData()} disabled={isLoading}>
          <Clock3 className="h-4 w-4" />
          {isLoading ? 'Refreshing...' : 'Refresh tracker'}
        </Button>
      }
    >
      {statusMessage ? (
        <div className="rounded-[1.4rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Session logger</CardTitle>
              <CardDescription className="mt-1 text-slate-400">Write the session into your study history and update your stats.</CardDescription>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={sessionSubject} onChange={(event) => setSessionSubject(event.target.value)} placeholder="Subject" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
                <Input value={sessionDuration} onChange={(event) => setSessionDuration(event.target.value)} placeholder="Minutes" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
              </div>
              <Button onClick={handleLogSession}>
                <PlusCircle className="h-4 w-4" />
                Log study session
              </Button>
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Task queue</CardTitle>
              <CardDescription className="mt-1 text-slate-400">Add the next task directly from the tracker.</CardDescription>
              <div className="space-y-3">
                <Input value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Task title" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={taskSubject} onChange={(event) => setTaskSubject(event.target.value)} placeholder="Subject" className="border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
                  <Input type="datetime-local" value={taskDeadline} onChange={(event) => setTaskDeadline(event.target.value)} className="border-white/10 bg-white/5 text-white" />
                </div>
              </div>
              <Button onClick={handleCreateTask}>
                <ListChecks className="h-4 w-4" />
                Save task
              </Button>
            </div>
          </GlowingCard>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <GlowingCard className="p-0" glowColor="rgba(16, 185, 129, 0.28)">
              <div className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Today</p>
                <p className="text-3xl font-black text-white">{stats?.today_hours ?? 0}h</p>
              </div>
            </GlowingCard>
            <GlowingCard className="p-0" glowColor="rgba(236, 72, 153, 0.28)">
              <div className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Weekly hours</p>
                <p className="text-3xl font-black text-white">{stats?.weekly_hours ?? 0}h</p>
              </div>
            </GlowingCard>
            <GlowingCard className="p-0" glowColor="rgba(245, 158, 11, 0.28)">
              <div className="space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pending tasks</p>
                <p className="text-3xl font-black text-white">{pendingTasks.length}</p>
              </div>
            </GlowingCard>
          </div>

          <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Upcoming tasks</CardTitle>
              <CardDescription className="mt-1 text-slate-400">Toggle progress or remove stale entries.</CardDescription>
              <div className="space-y-3">
                {tasks.length ? (
                  tasks.map((task) => (
                    <div key={task.id} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className={`text-sm font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">{task.subject} | {new Date(task.deadline).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => void handleToggleTask(task)} className="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => void handleDeleteTask(task.id)} className="rounded-2xl border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.3rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    No tasks yet. Add the next study task from the tracker form.
                  </div>
                )}
              </div>
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
            <div className="space-y-5 p-6">
              <CardTitle className="text-white">Recent sessions</CardTitle>
              <CardDescription className="mt-1 text-slate-400">Latest study blocks recorded in your history.</CardDescription>
              <div className="space-y-3">
                {history.length ? (
                  history.map((session) => (
                    <div key={session.id} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{session.subject}</p>
                      <p className="mt-2 text-sm text-slate-400">{session.duration} min | {session.session_type} | {session.date}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.3rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    No sessions logged yet. Start by adding today’s first block.
                  </div>
                )}
              </div>
            </div>
          </GlowingCard>
        </div>
      </div>
    </ModulePageShell>
  )
}

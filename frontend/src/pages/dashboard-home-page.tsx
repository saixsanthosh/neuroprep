import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { BookOpenCheck, Flame, ListTodo, TimerReset } from 'lucide-react'

import { StatCard } from '../components/dashboard/stat-card'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'

const WeeklyStudyHoursChart = lazy(() =>
  import('../components/charts/weekly-study-hours-chart').then((module) => ({
    default: module.WeeklyStudyHoursChart,
  })),
)
const SubjectPerformanceBarChart = lazy(() =>
  import('../components/charts/subject-performance-chart').then((module) => ({
    default: module.SubjectPerformanceBarChart,
  })),
)
const MonthlyHeatmapChart = lazy(() =>
  import('../components/charts/monthly-heatmap-chart').then((module) => ({
    default: module.MonthlyHeatmapChart,
  })),
)
const AccuracyTrendChart = lazy(() =>
  import('../components/charts/accuracy-trend-chart').then((module) => ({
    default: module.AccuracyTrendChart,
  })),
)

const tasks = [
  { title: 'Physics: Electromagnetism revision', due: '09:00 PM', done: false },
  { title: 'Chemistry mock test analysis', due: '07:30 PM', done: true },
  { title: 'Math practice: Integration set', due: '10:30 PM', done: false },
]

const recentActivity = [
  'Completed 25-min focus session for Calculus',
  'Scored 84% in weekly Biology quiz',
  'Generated AI notes for Organic Chemistry',
  'Unlocked 6-day study streak badge',
]

const subjects = [
  { name: 'Physics', progress: 82 },
  { name: 'Chemistry', progress: 75 },
  { name: 'Mathematics', progress: 90 },
  { name: 'Biology', progress: 68 },
]

export function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, Santosh</h1>
        <p className="mt-1 text-muted">Track daily momentum, review weak areas, and keep your prep consistent.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Study Hours" value={6} suffix="h" icon={BookOpenCheck} delay={0.05} />
        <StatCard label="Study Streak" value={12} suffix=" days" icon={Flame} delay={0.1} />
        <StatCard label="Productivity Score" value={87} suffix="%" icon={TimerReset} delay={0.15} />
        <StatCard label="Tasks Today" value={5} icon={ListTodo} delay={0.2} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardTitle>Weekly Study Hours</CardTitle>
            <CardDescription className="mb-4">Monitor consistency over the week.</CardDescription>
            <Suspense fallback={<Skeleton className="h-72" />}>
              <WeeklyStudyHoursChart />
            </Suspense>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <Card className="h-full">
            <CardTitle>Today&apos;s Study Tasks</CardTitle>
            <CardDescription className="mb-4">Prioritized tasks with deadlines.</CardDescription>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted">Due {task.due}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${task.done ? 'bg-emerald-500/25 text-emerald-300' : 'bg-amber-500/25 text-amber-300'}`}
                  >
                    {task.done ? 'Completed' : 'Pending'}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription className="mb-4">Percent score by subject.</CardDescription>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <SubjectPerformanceBarChart />
          </Suspense>
        </Card>

        <Card>
          <CardTitle>Monthly Study Heatmap</CardTitle>
          <CardDescription className="mb-4">Daily focus intensity map.</CardDescription>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <MonthlyHeatmapChart />
          </Suspense>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="mb-4">Latest events in your prep flow.</CardDescription>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-muted"
              >
                {activity}
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Accuracy Trend</CardTitle>
          <CardDescription className="mb-4">Quiz accuracy progression over time.</CardDescription>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <AccuracyTrendChart />
          </Suspense>
        </Card>
      </div>

      <Card>
        <CardTitle>Subject Progress</CardTitle>
        <CardDescription className="mb-4">Animated completion bars by subject.</CardDescription>
        <div className="grid gap-3 sm:grid-cols-2">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-2 flex justify-between text-sm">
                <span>{subject.name}</span>
                <span className="text-muted">{subject.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${subject.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: index * 0.08 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

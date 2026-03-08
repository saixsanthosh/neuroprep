import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  Flame,
  ListTodo,
  Sparkles,
  TimerReset,
  TrendingUp,
} from 'lucide-react'

import { useAuth } from '../contexts/auth-context'
import { getWeeklyReport } from '../lib/api'
import { StatCard } from '../components/dashboard/stat-card'
import { Badge } from '../components/ui/badge'
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
  { title: 'Physics: Electromagnetism revision', due: '09:00 PM', done: false, lane: 'Deep Work' },
  { title: 'Chemistry mock test analysis', due: '07:30 PM', done: true, lane: 'Review' },
  { title: 'Math practice: Integration set', due: '10:30 PM', done: false, lane: 'Practice' },
]

const recentActivity = [
  'Completed 25-minute focus sprint for Calculus and updated the study log.',
  'Generated AI notes for Organic Chemistry with formula extraction enabled.',
  'Closed two planner tasks and increased streak protection to 12 days.',
  'Beat your previous Quiz Battle score and moved into the top 5 leaderboard.',
]

const subjects = [
  { name: 'Physics', progress: 82, tone: 'from-cyan-400 to-sky-500' },
  { name: 'Chemistry', progress: 75, tone: 'from-violet-500 to-fuchsia-500' },
  { name: 'Mathematics', progress: 90, tone: 'from-emerald-400 to-teal-500' },
  { name: 'Biology', progress: 68, tone: 'from-amber-400 to-orange-500' },
]

const quickActions = [
  { label: 'Generate revision notes', icon: Sparkles },
  { label: 'Start a timed mock', icon: TrendingUp },
  { label: 'Ask the AI tutor', icon: Brain },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

export function DashboardHomePage() {
  const { user } = useAuth()
  const displayName = user?.name ?? user?.username ?? 'Scholar'
  const [weeklyReport, setWeeklyReport] = useState('Loading your weekly AI report...')
  const [focusSubjects, setFocusSubjects] = useState<string[]>([])

  useEffect(() => {
    let active = true

    const loadWeeklyReport = async () => {
      try {
        const report = await getWeeklyReport()
        if (!active) return
        setWeeklyReport(report.summary)
        setFocusSubjects(report.focus_subjects)
      } catch {
        if (!active) return
        setWeeklyReport('Weekly AI report is not available yet. Complete a quiz or mock to generate better guidance.')
        setFocusSubjects([])
      }
    }

    void loadWeeklyReport()
    return () => {
      active = false
    }
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(124,58,237,0.22),transparent_30%),linear-gradient(145deg,rgba(7,11,26,0.94),rgba(13,20,48,0.88))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-16 top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="premium-grid absolute inset-0 opacity-20" />
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="gap-2 border-white/15 bg-white/10 text-white">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Premium command center
              </Badge>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Live streak protection active
              </span>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl xl:text-5xl">
                Welcome back, <span className="text-gradient">{displayName}</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Your dashboard is set up like a study cockpit: quick actions, performance telemetry,
                revision lanes, and AI-assisted momentum tracking in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {quickActions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/10"
                >
                  <span className="rounded-xl bg-white/10 p-2 text-cyan-300 transition-transform duration-300 group-hover:rotate-6">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Focus lane</p>
              <p className="mt-3 text-3xl font-bold text-white">3h 45m</p>
              <p className="mt-2 text-sm text-slate-400">Targeted revision block ready for Physics and Math.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AI signal</p>
              <p className="mt-3 text-3xl font-bold text-white">92%</p>
              <p className="mt-2 text-sm text-slate-400">Readiness prediction indicates strong mock performance today.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 backdrop-blur-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Revision heat</p>
              <p className="mt-3 text-3xl font-bold text-white">7 topics</p>
              <p className="mt-2 text-sm text-slate-400">Weak-topic queue auto-ranked by urgency and exam impact.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div variants={itemVariants}>
        <Card className="glass-panel p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-white">AI Weekly Study Report</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Auto-generated guidance based on your weak-topic and study-history signal.
              </CardDescription>
            </div>
            <Badge className="gap-2 border-white/15 bg-white/10 text-white">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              New feature
            </Badge>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
              {weeklyReport}
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Focus subjects</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {focusSubjects.length ? (
                  focusSubjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    No weak subjects detected yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Study Hours" value={6} suffix="h" icon={BookOpenCheck} delay={0.05} />
        <StatCard label="Study Streak" value={12} suffix=" days" icon={Flame} delay={0.1} />
        <StatCard label="Productivity Score" value={87} suffix="%" icon={TimerReset} delay={0.15} />
        <StatCard label="Tasks Today" value={5} icon={ListTodo} delay={0.2} />
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <motion.div variants={itemVariants}>
          <Card className="glass-panel overflow-hidden p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-white">Weekly Study Hours</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Monitor consistency, fatigue balance, and recovery windows.
                </CardDescription>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                Animated analytics
              </span>
            </div>
            <Suspense fallback={<Skeleton className="h-72 w-full rounded-3xl bg-white/5" />}>
              <WeeklyStudyHoursChart />
            </Suspense>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full p-6">
            <CardTitle className="text-xl text-white">Today&apos;s Study Tasks</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Priority tasks grouped by revision lane and deadline.
            </CardDescription>
            <div className="mt-5 space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${task.done ? 'bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]' : 'bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.7)]'}`}
                        />
                        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                          {task.lane}
                        </span>
                      </div>
                      <p className={`mt-2 text-sm font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Due {task.due}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        task.done
                          ? 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                          : 'border border-amber-300/20 bg-amber-300/10 text-amber-200'
                      }`}
                    >
                      {task.done ? 'Done' : 'Next'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full p-6">
            <CardTitle className="text-xl text-white">Subject Performance</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Performance spread across your active subjects.
            </CardDescription>
            <div className="mt-5">
              <Suspense fallback={<Skeleton className="h-72 w-full rounded-3xl bg-white/5" />}>
                <SubjectPerformanceBarChart />
              </Suspense>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full p-6">
            <CardTitle className="text-xl text-white">Monthly Study Heatmap</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Daily focus density across the current month.
            </CardDescription>
            <div className="mt-5">
              <Suspense fallback={<Skeleton className="h-72 w-full rounded-3xl bg-white/5" />}>
                <MonthlyHeatmapChart />
              </Suspense>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full p-6">
            <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Latest platform events and study-system updates.
            </CardDescription>
            <div className="mt-5 space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"
                >
                  {activity}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full p-6">
            <CardTitle className="text-xl text-white">Accuracy Trend</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Continuous accuracy recovery based on recent quizzes.
            </CardDescription>
            <div className="mt-5">
              <Suspense fallback={<Skeleton className="h-72 w-full rounded-3xl bg-white/5" />}>
                <AccuracyTrendChart />
              </Suspense>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="glass-panel p-6 sm:p-8">
          <CardTitle className="text-2xl text-white">Subject Progress</CardTitle>
          <CardDescription className="mt-1 text-base text-slate-400">
            Revision completion bars with richer visual feedback.
          </CardDescription>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-white">{subject.name}</span>
                  <span className="text-sm font-medium text-cyan-300">{subject.progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10 p-[3px]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${subject.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.15 + index * 0.1 }}
                    className={`relative h-full rounded-full bg-gradient-to-r ${subject.tone}`}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-40" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

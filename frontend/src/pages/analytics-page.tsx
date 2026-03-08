import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Activity, BrainCircuit, Flame, Radar, Sparkles, Target } from 'lucide-react'

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
const AccuracyTrendChart = lazy(() =>
  import('../components/charts/accuracy-trend-chart').then((module) => ({
    default: module.AccuracyTrendChart,
  })),
)
const MonthlyHeatmapChart = lazy(() =>
  import('../components/charts/monthly-heatmap-chart').then((module) => ({
    default: module.MonthlyHeatmapChart,
  })),
)

const metricCards = [
  { label: 'Productivity Signal', value: '87%', caption: 'Focus quality over the last 7 days', icon: Activity },
  { label: 'Streak Strength', value: '12d', caption: 'Current uninterrupted revision momentum', icon: Flame },
  { label: 'Weak Topic Queue', value: '07', caption: 'Topics flagged for fast remediation', icon: Radar },
  { label: 'AI Accuracy Read', value: '91%', caption: 'Predicted mock stability for this week', icon: BrainCircuit },
]

const weakTopics = [
  {
    topic: 'Electrostatics',
    score: 38,
    recommendation: 'Revise potential, field lines, and solve 20 mixed numericals under time pressure.',
  },
  {
    topic: 'Organic Mechanisms',
    score: 44,
    recommendation: 'Practice reaction flowcharts, reagent exceptions, and common mechanism traps.',
  },
  {
    topic: 'Probability',
    score: 49,
    recommendation: 'Rebuild fundamentals around conditional probability and Bayes with short timed sets.',
  },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Performance intelligence
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Analytics that feel like a <span className="text-gradient">command bridge</span>, not a report page.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Track study intensity, subject readiness, weak-topic drift, and accuracy trends with
              animated charts and a stronger visual hierarchy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {metricCards.map(({ label, value, caption, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-2xl"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
                  <span className="rounded-xl bg-white/10 p-2 text-cyan-300">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold text-white">{value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Daily and Weekly Study Hours</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              Animated load-in for consistency and workload balancing.
            </CardDescription>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <WeeklyStudyHoursChart />
            </Suspense>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Subject Performance</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              See the strongest and weakest subject lanes at a glance.
            </CardDescription>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <SubjectPerformanceBarChart />
            </Suspense>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Accuracy Trend</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              Continuous improvement from practice, mock tests, and revision loops.
            </CardDescription>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <AccuracyTrendChart />
            </Suspense>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-panel p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white">Study Heatmap</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Monthly intensity map for daily habit visibility.
                </CardDescription>
              </div>
              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                30-day view
              </span>
            </div>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <MonthlyHeatmapChart />
            </Suspense>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="glass-panel p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-white">Weakness Detection</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                AI-ranked topics with revision actions so the dashboard tells you what to do next.
              </CardDescription>
            </div>
            <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-200">
              Highest urgency first
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {weakTopics.map((item, index) => (
              <motion.div
                key={item.topic}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + index * 0.06 }}
                whileHover={{ y: -4 }}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-rose-300/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-white">{item.topic}</p>
                  <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs text-rose-200">
                    Score {item.score}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.recommendation}</p>
                <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-300">
                  <Target className="h-3.5 w-3.5" />
                  Revision action
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

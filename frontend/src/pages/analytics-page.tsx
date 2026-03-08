import { lazy, Suspense, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, BrainCircuit, Flame, Radar, Sparkles, Target, TrendingUp, Award, Clock, Zap } from 'lucide-react'

import { CardDescription, CardTitle } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { StatCardAnimated } from '../components/ui/stat-card-animated'
import { DateRangePicker } from '../components/ui/date-range-picker'
import { FilterTabs } from '../components/ui/filter-tabs'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'

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
  { label: 'Productivity Signal', value: 87, caption: 'Focus quality over the last 7 days', icon: Activity, color: 'from-cyan-400 to-blue-500' },
  { label: 'Streak Strength', value: '12d', caption: 'Current uninterrupted revision momentum', icon: Flame, color: 'from-orange-400 to-red-500' },
  { label: 'Weak Topic Queue', value: 7, caption: 'Topics flagged for fast remediation', icon: Radar, color: 'from-rose-400 to-pink-500' },
  { label: 'AI Accuracy Read', value: 91, caption: 'Predicted mock stability for this week', icon: BrainCircuit, color: 'from-violet-400 to-purple-500' },
]

const weakTopics = [
  {
    topic: 'Electrostatics',
    score: 38,
    recommendation: 'Revise potential, field lines, and solve 20 mixed numericals under time pressure.',
    urgency: 'high',
  },
  {
    topic: 'Organic Mechanisms',
    score: 44,
    recommendation: 'Practice reaction flowcharts, reagent exceptions, and common mechanism traps.',
    urgency: 'high',
  },
  {
    topic: 'Probability',
    score: 49,
    recommendation: 'Rebuild fundamentals around conditional probability and Bayes with short timed sets.',
    urgency: 'medium',
  },
]

const recentActivity = [
  { action: 'Completed Physics Mock Test', time: '2 hours ago', icon: Award },
  { action: 'Study session: Organic Chemistry', time: '5 hours ago', icon: Clock },
  { action: 'Achieved 7-day streak', time: '1 day ago', icon: Flame },
]

type FilterId = 'all' | 'physics' | 'chemistry' | 'math'

const filterHeadline: Record<FilterId, string> = {
  all: 'Mixed-subject signal across the full study system.',
  physics: 'Physics is improving, but electricity is still the main pressure point.',
  chemistry: 'Chemistry is stabilizing total score, especially on shorter drills.',
  math: 'Math has the biggest upside if timing discipline improves this week.',
}

const readinessByFilter: Record<
  FilterId,
  Array<{ subject: string; score: number; delta: string; action: string }>
> = {
  all: [
    { subject: 'Physics', score: 82, delta: '+6%', action: 'Push timed numericals and error-log repair.' },
    { subject: 'Chemistry', score: 76, delta: '+4%', action: 'Keep recall loops short and daily.' },
    { subject: 'Math', score: 71, delta: '+9%', action: 'Protect probability and calculus speed work.' },
  ],
  physics: [
    { subject: 'Mechanics', score: 88, delta: '+3%', action: 'Maintain with one mixed drill every other day.' },
    { subject: 'Electricity', score: 69, delta: '+8%', action: 'Rebuild circuits and capacitance under timers.' },
    { subject: 'Modern Physics', score: 81, delta: '+5%', action: 'Convert notes into rapid-fire prompts.' },
  ],
  chemistry: [
    { subject: 'Organic', score: 78, delta: '+7%', action: 'Tighten reagent exceptions and mechanism flow.' },
    { subject: 'Inorganic', score: 68, delta: '+5%', action: 'Use high-frequency flash recall blocks.' },
    { subject: 'Physical', score: 83, delta: '+2%', action: 'Keep one derivation recap per week.' },
  ],
  math: [
    { subject: 'Calculus', score: 74, delta: '+9%', action: 'Keep integration practice in the morning slot.' },
    { subject: 'Algebra', score: 70, delta: '+5%', action: 'Use mixed sheets to cut switching time.' },
    { subject: 'Probability', score: 58, delta: '+11%', action: 'Run a dedicated repair lane before the weekend.' },
  ],
}

const focusWindowsByFilter: Record<FilterId, Array<{ label: string; hours: string; note: string }>> = {
  all: [
    { label: 'Deep Work', hours: '6:30 AM - 8:30 AM', note: 'Use for numericals and hard problem sets.' },
    { label: 'Revision', hours: '4:00 PM - 5:30 PM', note: 'Summaries, flashcards, and concept repair only.' },
    { label: 'Light Recall', hours: '8:45 PM - 9:15 PM', note: 'No heavy study here. Keep it short.' },
  ],
  physics: [
    { label: 'Problem Solving', hours: '6:15 AM - 7:45 AM', note: 'Best slot for heavy Physics numericals.' },
    { label: 'Concept Repair', hours: '12:30 PM - 1:00 PM', note: 'Re-teach only the errors from the morning.' },
    { label: 'Night Recall', hours: '8:15 PM - 8:45 PM', note: 'Formula chains and derivation checkpoints.' },
  ],
  chemistry: [
    { label: 'Flash Revision', hours: '7:00 AM - 7:40 AM', note: 'Use for inorganic fact recall and formula sweeps.' },
    { label: 'Mechanism Work', hours: '3:00 PM - 4:00 PM', note: 'Best slot for organic chains and reagent maps.' },
    { label: 'Rapid Recap', hours: '9:00 PM - 9:20 PM', note: 'Convert each topic into a five-point memory lock.' },
  ],
  math: [
    { label: 'Hard Problem Slot', hours: '5:45 AM - 7:15 AM', note: 'Use for probability and integration before distraction builds.' },
    { label: 'Correction Slot', hours: '2:00 PM - 2:40 PM', note: 'Rework only the errors, not the full worksheet.' },
    { label: 'Formula Recall', hours: '8:30 PM - 9:00 PM', note: 'Shortcuts and formula cards only.' },
  ],
}

export function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')
  const [rangeLabel, setRangeLabel] = useState('Last 7 days')
  const readinessLanes = useMemo(() => readinessByFilter[activeFilter], [activeFilter])
  const focusWindows = useMemo(() => focusWindowsByFilter[activeFilter], [activeFilter])
  const readinessAverage = Math.round(
    readinessLanes.reduce((sum, lane) => sum + lane.score, 0) / readinessLanes.length,
  )

  return (
    <div className="relative space-y-6 pb-6">
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

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
              <PulseDot size="sm" color="bg-cyan-400" />
              <Sparkles className="h-3.5 w-3.5" />
              Performance intelligence
            </div>
          </motion.div>
          
          <motion.h1
            className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Analytics that feel like a <GradientText>command bridge</GradientText>, not a report page.
          </motion.h1>
          
          <motion.p
            className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Track study intensity, subject readiness, weak-topic drift, and accuracy trends with
            animated charts and a stronger visual hierarchy. {filterHeadline[activeFilter]}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DateRangePicker
              onRangeChange={({ start, end }) => {
                const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000))
                setRangeLabel(`Last ${diff} days`)
              }}
            />
            <FilterTabs
              tabs={[
                { id: 'all', label: 'All Subjects' },
                { id: 'physics', label: 'Physics' },
                { id: 'chemistry', label: 'Chemistry' },
                { id: 'math', label: 'Math' },
              ]}
              activeTab={activeFilter}
              onChange={(tabId) => setActiveFilter(tabId as FilterId)}
            />
          </motion.div>

          <motion.div
            className="mt-6 grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46 }}
          >
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Window</p>
              <p className="mt-3 text-xl font-bold text-white">{rangeLabel}</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Readiness Avg</p>
              <p className="mt-3 text-xl font-bold text-white">{readinessAverage}%</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Focus</p>
              <p className="mt-3 text-sm font-semibold text-white">{filterHeadline[activeFilter]}</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card, index) => (
          <StatCardAnimated
            key={card.label}
            {...card}
            delay={0.1 + index * 0.05}
            isNumeric={typeof card.value === 'number'}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.3)">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-white">Daily and Weekly Study Hours</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Animated load-in for consistency and workload balancing.
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-cyan-300" />
            </div>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <WeeklyStudyHoursChart />
            </Suspense>
          </GlowingCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-white">Subject Performance</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  See the strongest and weakest subject lanes at a glance.
                </CardDescription>
              </div>
              <Zap className="h-5 w-5 text-violet-300" />
            </div>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <SubjectPerformanceBarChart />
            </Suspense>
          </GlowingCard>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlowingCard className="p-6" glowColor="rgba(236, 72, 153, 0.3)">
            <CardTitle className="text-white">Accuracy Trend</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              Continuous improvement from practice, mock tests, and revision loops.
            </CardDescription>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <AccuracyTrendChart />
            </Suspense>
          </GlowingCard>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.3)">
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
              <Suspense fallback={<Skeleton className="h-48 rounded-3xl bg-white/5" />}>
                <MonthlyHeatmapChart />
              </Suspense>
            </GlowingCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
              <CardTitle className="text-white">Focus Windows</CardTitle>
              <CardDescription className="mb-4 mt-1 text-slate-400">
                The best study slots for the currently selected subject lane.
              </CardDescription>
              <div className="space-y-3">
                {focusWindows.map((window, index) => (
                  <motion.div
                    key={window.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <span className="rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-2">
                      <Clock className="h-4 w-4 text-cyan-300" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white">{window.label}</p>
                        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                          {window.hours}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{window.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <GlowingCard className="mb-4 p-6" glowColor="rgba(34, 211, 238, 0.28)">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-white">Readiness Matrix</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Score, recent delta, and the next immediate action for the selected filter.
              </CardDescription>
            </div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              Avg {readinessAverage}%
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {readinessLanes.map((lane, index) => (
              <motion.div
                key={lane.subject}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.58 + index * 0.05 }}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-semibold text-white">{lane.subject}</p>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                    {lane.delta}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-bold text-white">{lane.score}%</p>
                <div className="mt-3 h-2.5 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lane.score}%` }}
                    transition={{ delay: 0.64 + index * 0.05, duration: 0.45 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{lane.action}</p>
              </motion.div>
            ))}
          </div>
        </GlowingCard>

        <GlowingCard className="p-6" glowColor="rgba(236, 72, 153, 0.3)">
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
                transition={{ delay: 0.6 + index * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-rose-300/20 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-white">{item.topic}</p>
                  <span className={`rounded-full px-3 py-1 text-xs ${
                    item.urgency === 'high' 
                      ? 'bg-rose-500/15 text-rose-200' 
                      : 'bg-orange-500/15 text-orange-200'
                  }`}>
                    Score {item.score}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.recommendation}</p>
                <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-300">
                  <Target className="h-3.5 w-3.5" />
                  Revision action
                </div>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  initial={false}
                />
              </motion.div>
            ))}
          </div>
        </GlowingCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62 }}
      >
        <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Latest study actions and momentum signals from the dashboard.
              </CardDescription>
            </div>
            <Award className="h-5 w-5 text-violet-300" />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.action}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.66 + index * 0.05 }}
                className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-2">
                    <activity.icon className="h-4 w-4 text-cyan-300" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowingCard>
      </motion.div>
    </div>
  )
}

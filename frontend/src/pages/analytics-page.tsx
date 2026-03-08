import { lazy, Suspense, useState } from 'react'
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

export function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState('all')

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
            animated charts and a stronger visual hierarchy.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DateRangePicker />
            <FilterTabs
              tabs={[
                { id: 'all', label: 'All Subjects' },
                { id: 'physics', label: 'Physics' },
                { id: 'chemistry', label: 'Chemistry' },
                { id: 'math', label: 'Math' },
              ]}
              activeTab={activeFilter}
              onChange={setActiveFilter}
            />
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
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="mb-4 mt-1 text-slate-400">
                Latest study actions and achievements
              </CardDescription>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.action}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <span className="rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-2">
                      <activity.icon className="h-4 w-4 text-cyan-300" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
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
    </div>
  )
}

import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, BrainCircuit, Flame, Radar, Sparkles, TrendingUp, Zap } from 'lucide-react'

import {
  getAnalyticsPerformance,
  getAnalyticsStudyHours,
  getAnalyticsWeakTopics,
  getGamificationSummary,
  getStudyStats,
  getWeeklyReport,
  type GamificationSummary,
  type PerformanceResponse,
  type StudyHoursPoint,
  type StudyHoursResponse,
  type StudyStatsResponse,
  type WeakTopic,
} from '../lib/api'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { DateRangePicker } from '../components/ui/date-range-picker'
import { FilterTabs } from '../components/ui/filter-tabs'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'
import { Skeleton } from '../components/ui/skeleton'
import { StatCardAnimated } from '../components/ui/stat-card-animated'
import { CardDescription, CardTitle } from '../components/ui/card'

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

type SubjectFilter = 'all' | string

function average(values: number[]) {
  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function actionForSubject(subject: string, weakTopics: WeakTopic[]) {
  const matchingTopic = weakTopics.find((item) => item.subject.toLowerCase() === subject.toLowerCase())
  if (matchingTopic) {
    return `Prioritize ${matchingTopic.topic.toLowerCase()} repair and convert mistakes into a revision loop.`
  }
  return 'No urgent weakness recorded. Keep solving timed sets and update the graph with real attempts.'
}

function focusHeadline(subject: SubjectFilter, weakTopics: WeakTopic[], stats: StudyStatsResponse | null) {
  if (subject !== 'all') {
    const matching = weakTopics.find((item) => item.subject.toLowerCase() === subject.toLowerCase())
    return matching
      ? `${subject} has a live weak-topic signal around ${matching.topic.toLowerCase()}.`
      : `${subject} has no critical weak-topic alert yet.`
  }
  if ((stats?.weekly_hours ?? 0) === 0) {
    return 'No study sessions recorded yet. Analytics will unlock as soon as you log real work.'
  }
  return 'This page is now driven by your live study sessions, quiz accuracy, and weak-topic history.'
}

function filterPoints(points: StudyHoursPoint[], days: number) {
  if (!points.length) return []
  const limit = Math.min(days, points.length)
  return points.slice(-limit)
}

export function AnalyticsPage() {
  const [studyHours, setStudyHours] = useState<StudyHoursResponse | null>(null)
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null)
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([])
  const [gamification, setGamification] = useState<GamificationSummary | null>(null)
  const [studyStats, setStudyStats] = useState<StudyStatsResponse | null>(null)
  const [weeklyReport, setWeeklyReport] = useState('No weekly report yet. Complete a quiz or mock to generate one.')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all')
  const [daysWindow, setDaysWindow] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const [hoursData, performanceData, weakTopicData, gamificationData, statsData, reportData] = await Promise.all([
          getAnalyticsStudyHours(),
          getAnalyticsPerformance(),
          getAnalyticsWeakTopics(),
          getGamificationSummary(),
          getStudyStats(),
          getWeeklyReport(),
        ])
        if (!active) return
        setStudyHours(hoursData)
        setPerformance(performanceData)
        setWeakTopics(weakTopicData)
        setGamification(gamificationData)
        setStudyStats(statsData)
        setWeeklyReport(reportData.summary)
      } catch {
        if (!active) return
        setStudyHours(null)
        setPerformance(null)
        setWeakTopics([])
        setGamification(null)
        setStudyStats(null)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  const availableSubjects = useMemo(() => {
    const set = new Set<string>()
    ;(performance?.subject_performance ?? []).forEach((item) => set.add(item.label))
    weakTopics.forEach((item) => set.add(item.subject))
    return ['all', ...Array.from(set)]
  }, [performance?.subject_performance, weakTopics])

  const filteredWeakTopics = useMemo(
    () =>
      subjectFilter === 'all'
        ? weakTopics
        : weakTopics.filter((item) => item.subject.toLowerCase() === subjectFilter.toLowerCase()),
    [subjectFilter, weakTopics],
  )

  const filteredSubjectPerformance = useMemo(
    () =>
      subjectFilter === 'all'
        ? performance?.subject_performance ?? []
        : (performance?.subject_performance ?? []).filter(
            (item) => item.label.toLowerCase() === subjectFilter.toLowerCase(),
          ),
    [performance?.subject_performance, subjectFilter],
  )

  const visibleStudyHours = useMemo(
    () => filterPoints(studyHours?.monthly_daily ?? studyHours?.daily ?? [], daysWindow),
    [daysWindow, studyHours?.daily, studyHours?.monthly_daily],
  )

  const latestAccuracy = average((performance?.accuracy_trend ?? []).map((item) => item.value))
  const readinessAverage = average(filteredSubjectPerformance.map((item) => item.value))
  const summaryCards = [
    {
      label: 'Productivity Signal',
      value: studyStats?.productivity_score ?? 0,
      caption: 'Calculated from your real study-vs-break time balance.',
      icon: Activity,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      label: 'Streak Strength',
      value: `${gamification?.profile.current_streak ?? 0}d`,
      caption: 'Live streak pulled from your study history and habit loop profile.',
      icon: Flame,
      color: 'from-orange-400 to-red-500',
    },
    {
      label: 'Weak Topic Queue',
      value: filteredWeakTopics.length,
      caption: 'Only topics detected from your actual quiz and mock patterns appear here.',
      icon: Radar,
      color: 'from-rose-400 to-pink-500',
      isNumeric: true,
    },
    {
      label: 'Accuracy Read',
      value: latestAccuracy,
      caption: 'Average of your saved quiz accuracy samples.',
      icon: BrainCircuit,
      color: 'from-violet-400 to-purple-500',
      isNumeric: true,
    },
  ]

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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
            <PulseDot size="sm" color="bg-cyan-400" />
            <Sparkles className="h-3.5 w-3.5" />
            Performance intelligence
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Analytics from your <GradientText>real study signal</GradientText>, not seeded showcase data.
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            {focusHeadline(subjectFilter, filteredWeakTopics, studyStats)} {weeklyReport}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <DateRangePicker
              onRangeChange={({ start, end }) => {
                const diff = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000))
                setDaysWindow(diff)
              }}
            />
            <FilterTabs
              tabs={availableSubjects.map((subject) => ({
                id: subject,
                label: subject === 'all' ? 'All Subjects' : subject,
              }))}
              activeTab={subjectFilter}
              onChange={setSubjectFilter}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Window</p>
              <p className="mt-3 text-xl font-bold text-white">Last {Math.min(daysWindow, 30)} days</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Weekly total</p>
              <p className="mt-3 text-xl font-bold text-white">{studyHours?.weekly_total ?? 0}h</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Readiness avg</p>
              <p className="mt-3 text-xl font-bold text-white">{readinessAverage}%</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => (
          <StatCardAnimated key={card.label} {...card} delay={0.1 + index * 0.05} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.3)">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Study Hours Trend</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Every point comes from a saved study session. No synthetic weekly pattern is shown.
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-cyan-300" />
            </div>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <WeeklyStudyHoursChart points={visibleStudyHours} />
            </Suspense>
          </GlowingCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Subject Performance</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Real subject averages from completed quiz records.
                </CardDescription>
              </div>
              <Zap className="h-5 w-5 text-violet-300" />
            </div>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <SubjectPerformanceBarChart series={filteredSubjectPerformance} />
            </Suspense>
          </GlowingCard>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlowingCard className="p-6" glowColor="rgba(236, 72, 153, 0.3)">
            <CardTitle className="text-white">Accuracy Trend</CardTitle>
            <CardDescription className="mb-4 mt-1 text-slate-400">
              Quiz accuracy over time based only on stored results.
            </CardDescription>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <AccuracyTrendChart series={performance?.accuracy_trend ?? []} />
            </Suspense>
          </GlowingCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.3)">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white">Monthly Study Heatmap</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Daily study density over the last 30 days.
                </CardDescription>
              </div>
              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                30-day view
              </span>
            </div>
            <Suspense fallback={<Skeleton className="h-72 rounded-3xl bg-white/5" />}>
              <MonthlyHeatmapChart points={studyHours?.monthly_daily ?? []} />
            </Suspense>
          </GlowingCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <GlowingCard className="p-6" glowColor="rgba(34, 211, 238, 0.28)">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-white">Readiness Matrix</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Directly derived from your current subject averages and detected weak topics.
              </CardDescription>
            </div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
              Avg {readinessAverage}%
            </span>
          </div>

          {loading ? (
            <Skeleton className="h-40 rounded-3xl bg-white/5" />
          ) : filteredSubjectPerformance.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {filteredSubjectPerformance.map((lane, index) => (
                <motion.div
                  key={lane.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + index * 0.05 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-white">{lane.label}</p>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                      {lane.value >= 80 ? 'Strong' : lane.value >= 60 ? 'Recovering' : 'Needs work'}
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white">{Math.round(lane.value)}%</p>
                  <div className="mt-3 h-2.5 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, lane.value))}%` }}
                      transition={{ delay: 0.6 + index * 0.05, duration: 0.45 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{actionForSubject(lane.label, filteredWeakTopics)}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
              No subject readiness data yet. Finish quizzes or mock exams to populate the matrix.
            </div>
          )}
        </GlowingCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.28)">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-white">Weakness Detection</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Only detected weak topics are shown. If you have not taken enough quizzes yet, this stays empty.
              </CardDescription>
            </div>
            <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-200">
              Highest urgency first
            </span>
          </div>

          {filteredWeakTopics.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {filteredWeakTopics.slice(0, 6).map((item, index) => (
                <motion.div
                  key={`${item.subject}-${item.topic}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58 + index * 0.05 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{item.topic}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.subject}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                      Score {Math.round(item.weakness_score)}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    Turn this topic into the next revision lane, then retake a short quiz to verify recovery.
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                    Revision action
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
              No weak topics are recorded yet. Finish quizzes or submit a mock exam to trigger weakness analysis.
            </div>
          )}
        </GlowingCard>
      </motion.div>
    </div>
  )
}

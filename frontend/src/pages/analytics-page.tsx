import { lazy, Suspense } from 'react'

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

const weakTopics = [
  { topic: 'Electrostatics', score: 38, recommendation: 'Revise potential and field lines + solve 20 numericals.' },
  { topic: 'Organic Mechanisms', score: 44, recommendation: 'Practice reaction flowcharts and exceptions.' },
  { topic: 'Probability', score: 49, recommendation: 'Focus on conditional probability and Bayes theorem.' },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-muted">Study hours, performance trends, and weak topic recommendations.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle>Daily & Weekly Study Hours</CardTitle>
          <CardDescription className="mb-4">Activity trend with animation.</CardDescription>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <WeeklyStudyHoursChart />
          </Suspense>
        </Card>

        <Card>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription className="mb-4">Comparison across subjects.</CardDescription>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <SubjectPerformanceBarChart />
          </Suspense>
        </Card>
      </div>

      <Card>
        <CardTitle>Accuracy Trend</CardTitle>
        <CardDescription className="mb-4">Continuous improvement from practice sessions.</CardDescription>
        <Suspense fallback={<Skeleton className="h-72" />}>
          <AccuracyTrendChart />
        </Suspense>
      </Card>

      <Card>
        <CardTitle>Weakness Detection</CardTitle>
        <CardDescription className="mb-4">Auto-generated recommendations from quiz and mock data.</CardDescription>
        <div className="space-y-3">
          {weakTopics.map((item) => (
            <div key={item.topic} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">{item.topic}</p>
                <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-300">
                  Weakness score: {item.score}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{item.recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

import { Suspense, lazy } from 'react'
import { BarChart3 } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'
import { Skeleton } from '../../ui/skeleton'
import type { StudyHoursPoint } from '../../../lib/api'

const WeeklyStudyHoursChart = lazy(() =>
  import('../../charts/weekly-study-hours-chart').then((module) => ({
    default: module.WeeklyStudyHoursChart,
  })),
)

export function WeeklyChartWidget({ points = [] }: { points?: StudyHoursPoint[] }) {
  return (
    <GlowingCard glowColor="cyan" className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white">Weekly Study Hours</h3>
      </div>

      <Suspense fallback={<Skeleton className="h-48 w-full rounded-xl bg-white/5" />}>
        <WeeklyStudyHoursChart points={points} />
      </Suspense>
    </GlowingCard>
  )
}

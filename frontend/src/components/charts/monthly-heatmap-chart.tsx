import { Bar } from 'react-chartjs-2'
import type { ScriptableContext, TooltipItem } from 'chart.js'

import type { StudyHoursPoint } from '../../lib/api'
import { ChartEmptyState } from './chart-empty-state'
import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: (items: TooltipItem<'bar'>[]) => `Day ${items[0].label.replace('D', '')}`,
        label: (item: TooltipItem<'bar'>) => `Focus intensity: ${Number(item.raw)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: 'rgba(162, 174, 219, 0.85)',
        maxTicksLimit: 10,
      },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.06)' },
      ticks: { color: 'rgba(162, 174, 219, 0.85)' },
      min: 0,
      max: 5,
    },
  },
}

function dayLabel(dateValue: string) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return dateValue
  return `D${date.getDate()}`
}

export function MonthlyHeatmapChart({ points = [] }: { points?: StudyHoursPoint[] }) {
  const hasRealData = points.some((point) => point.hours > 0)
  if (!points.length || !hasRealData) {
    return (
      <ChartEmptyState
        title="No monthly study footprint yet"
        message="Your daily study intensity will appear here after you log real study sessions."
      />
    )
  }

  const data = {
    labels: points.map((point) => dayLabel(point.date)),
    datasets: [
      {
        label: 'Study Intensity',
        data: points.map((point) => point.hours),
        borderRadius: 6,
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const value = Number(context.raw ?? 0)
          if (value <= 0.5) return 'rgba(34, 211, 238, 0.15)'
          if (value <= 1.5) return 'rgba(56, 189, 248, 0.35)'
          if (value <= 3) return 'rgba(99, 102, 241, 0.45)'
          if (value <= 5) return 'rgba(124, 58, 237, 0.62)'
          return 'rgba(167, 139, 250, 0.85)'
        },
      },
    ],
  }

  return (
    <div className="h-72">
      <Bar options={options} data={data} />
    </div>
  )
}

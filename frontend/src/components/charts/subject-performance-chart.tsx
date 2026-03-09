import { Bar } from 'react-chartjs-2'

import type { PerformanceSeries } from '../../lib/api'
import { ChartEmptyState } from './chart-empty-state'
import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(162, 174, 219, 0.85)' },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.06)' },
      ticks: { color: 'rgba(162, 174, 219, 0.85)' },
      beginAtZero: true,
      max: 100,
    },
  },
}

const barColors = [
  'rgba(124, 58, 237, 0.85)',
  'rgba(34, 211, 238, 0.85)',
  'rgba(99, 102, 241, 0.85)',
  'rgba(167, 139, 250, 0.85)',
  'rgba(56, 189, 248, 0.85)',
]

export function SubjectPerformanceBarChart({ series = [] }: { series?: PerformanceSeries[] }) {
  if (!series.length) {
    return (
      <ChartEmptyState
        title="No subject performance yet"
        message="Complete quizzes or mocks to see subject-by-subject performance bars here."
      />
    )
  }

  const data = {
    labels: series.map((item) => item.label),
    datasets: [
      {
        label: 'Performance %',
        data: series.map((item) => item.value),
        borderRadius: 12,
        backgroundColor: series.map((_, index) => barColors[index % barColors.length]),
      },
    ],
  }

  return (
    <div className="h-72">
      <Bar options={options} data={data} />
    </div>
  )
}

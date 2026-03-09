import { Line } from 'react-chartjs-2'

import type { PerformanceSeries } from '../../lib/api'
import { ChartEmptyState } from './chart-empty-state'
import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1300,
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
      min: 50,
      max: 100,
    },
  },
}

export function AccuracyTrendChart({ series = [] }: { series?: PerformanceSeries[] }) {
  if (!series.length) {
    return (
      <ChartEmptyState
        title="No accuracy trend yet"
        message="Submit a quiz or mock exam to generate your accuracy trend over time."
      />
    )
  }

  const data = {
    labels: series.map((item) => item.label),
    datasets: [
      {
        label: 'Accuracy',
        data: series.map((item) => item.value),
        borderColor: 'rgba(167, 139, 250, 1)',
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#22d3ee',
        pointRadius: 4,
        tension: 0.32,
        fill: true,
      },
    ],
  }

  return (
    <div className="h-72">
      <Line options={options} data={data} />
    </div>
  )
}

import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'

import type { StudyHoursPoint } from '../../lib/api'
import { ChartEmptyState } from './chart-empty-state'
import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1400,
    easing: 'easeOutQuart' as const,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255, 255, 255, 0.06)' },
      ticks: { color: 'rgba(162, 174, 219, 0.85)' },
    },
    y: {
      grid: { color: 'rgba(255, 255, 255, 0.06)' },
      ticks: { color: 'rgba(162, 174, 219, 0.85)' },
      beginAtZero: true,
    },
  },
}

function formatLabel(dateValue: string) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return dateValue
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

export function WeeklyStudyHoursChart({ points = [] }: { points?: StudyHoursPoint[] }) {
  const hasRealData = points.some((point) => point.hours > 0)
  if (!points.length || !hasRealData) {
    return (
      <ChartEmptyState
        title="No study hours yet"
        message="Start a study session to populate your hours trend and weekly workload graph."
      />
    )
  }

  const data = {
    labels: points.map((point) => formatLabel(point.date)),
    datasets: [
      {
        label: 'Study Hours',
        data: points.map((point) => point.hours),
        borderColor: 'rgba(34, 211, 238, 1)',
        backgroundColor: 'rgba(34, 211, 238, 0.14)',
        borderWidth: 3,
        pointRadius: 4,
        fill: true,
        tension: 0.35,
      },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-72"
    >
      <Line options={options} data={data} />
    </motion.div>
  )
}

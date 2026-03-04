import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'

import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const data = {
  labels,
  datasets: [
    {
      label: 'Study Hours',
      data: [2.5, 3.2, 4.1, 2.8, 5.5, 3.9, 4.7],
      borderColor: 'rgba(34, 211, 238, 1)',
      backgroundColor: 'rgba(34, 211, 238, 0.14)',
      borderWidth: 3,
      pointRadius: 4,
      fill: true,
      tension: 0.35,
    },
  ],
}

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

export function WeeklyStudyHoursChart() {
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

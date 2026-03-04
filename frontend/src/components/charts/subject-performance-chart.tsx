import { Bar } from 'react-chartjs-2'

import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const data = {
  labels: ['Physics', 'Chemistry', 'Math', 'Biology', 'History'],
  datasets: [
    {
      label: 'Performance %',
      data: [84, 76, 91, 80, 69],
      borderRadius: 12,
      backgroundColor: [
        'rgba(124, 58, 237, 0.85)',
        'rgba(34, 211, 238, 0.85)',
        'rgba(99, 102, 241, 0.85)',
        'rgba(167, 139, 250, 0.85)',
        'rgba(56, 189, 248, 0.85)',
      ],
    },
  ],
}

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

export function SubjectPerformanceBarChart() {
  return (
    <div className="h-72">
      <Bar options={options} data={data} />
    </div>
  )
}

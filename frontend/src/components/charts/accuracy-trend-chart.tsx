import { Line } from 'react-chartjs-2'

import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const data = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  datasets: [
    {
      label: 'Accuracy',
      data: [62, 66, 70, 74, 80, 86],
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

export function AccuracyTrendChart() {
  return (
    <div className="h-72">
      <Line options={options} data={data} />
    </div>
  )
}

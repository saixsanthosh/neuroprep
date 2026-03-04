import { Bar } from 'react-chartjs-2'
import type { ScriptableContext, TooltipItem } from 'chart.js'

import { ensureChartRegistration } from './chart-setup'

ensureChartRegistration()

const labels = Array.from({ length: 30 }, (_, index) => `D${index + 1}`)
const values = [
  2, 1, 3, 4, 0, 2, 5, 3, 1, 4,
  2, 0, 1, 3, 4, 2, 5, 3, 2, 1,
  4, 5, 2, 3, 1, 0, 4, 2, 3, 5,
]

const data = {
  labels,
  datasets: [
    {
      label: 'Study Intensity',
      data: values,
      borderRadius: 6,
      backgroundColor: (context: ScriptableContext<'bar'>) => {
        const value = Number(context.raw ?? 0)
        if (value <= 1) return 'rgba(34, 211, 238, 0.15)'
        if (value <= 2) return 'rgba(56, 189, 248, 0.35)'
        if (value <= 3) return 'rgba(99, 102, 241, 0.45)'
        if (value <= 4) return 'rgba(124, 58, 237, 0.62)'
        return 'rgba(167, 139, 250, 0.85)'
      },
    },
  ],
}

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

export function MonthlyHeatmapChart() {
  return (
    <div className="h-72">
      <Bar options={options} data={data} />
    </div>
  )
}

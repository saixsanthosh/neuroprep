import { Calendar } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface DateRangePickerProps {
  onRangeChange?: (range: { start: Date; end: Date }) => void
}

export function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState('7d')

  const ranges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'custom', label: 'Custom' },
  ]

  const emitRangeChange = (rangeId: string) => {
    setSelectedRange(rangeId)

    if (!onRangeChange) {
      return
    }

    const end = new Date()
    const start = new Date(end)

    if (rangeId === '30d') {
      start.setDate(end.getDate() - 30)
    } else if (rangeId === '90d') {
      start.setDate(end.getDate() - 90)
    } else {
      start.setDate(end.getDate() - 7)
    }

    onRangeChange({ start, end })
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      <Calendar className="ml-2 h-4 w-4 text-slate-400" />
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => emitRangeChange(range.id)}
          className="relative px-3 py-1.5 text-xs font-medium transition-colors"
        >
          {selectedRange === range.id && (
            <motion.div
              layoutId="selectedRange"
              className="absolute inset-0 rounded-xl bg-cyan-500/20"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className={`relative z-10 ${
              selectedRange === range.id ? 'text-white' : 'text-slate-400'
            }`}
          >
            {range.label}
          </span>
        </button>
      ))}
    </div>
  )
}

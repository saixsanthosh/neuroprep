import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { GlowingCard } from '../../ui/glowing-card'

interface Subject {
  name: string
  progress: number
  color: string
}

interface SubjectProgressWidgetProps {
  subjects: Subject[]
}

export function SubjectProgressWidget({ subjects }: SubjectProgressWidgetProps) {
  return (
    <GlowingCard glowColor="cyan" className="h-full">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white">Subject Progress</h3>
      </div>

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white">{subject.name}</span>
              <span className="text-sm font-bold text-cyan-400">{subject.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subject.progress}%` }}
                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </GlowingCard>
  )
}

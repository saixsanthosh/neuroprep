import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Sparkles } from 'lucide-react'

interface SuccessAnimationProps {
  show: boolean
  score: number
}

export function SuccessAnimation({ show, score }: SuccessAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative"
          >
            {/* Burst particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 12) * 150,
                  y: Math.sin((i * Math.PI * 2) / 12) * 150,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            ))}

            {/* Main success card */}
            <div className="relative rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-12 backdrop-blur-xl">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="mb-6 flex justify-center"
              >
                <div className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-6 shadow-[0_0_50px_rgba(16,185,129,0.6)]">
                  <CheckCircle className="h-16 w-16 text-white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-center text-4xl font-black text-white"
              >
                Correct!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="flex items-center justify-center gap-2 text-2xl font-bold text-emerald-300"
              >
                <Sparkles className="h-6 w-6" />
                <span>+{score} XP</span>
                <Sparkles className="h-6 w-6" />
              </motion.div>

              {/* Floating sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 70}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

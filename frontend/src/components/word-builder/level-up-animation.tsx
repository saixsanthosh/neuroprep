import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, Star, Zap } from 'lucide-react'

interface LevelUpAnimationProps {
  show: boolean
  level: number
}

export function LevelUpAnimation({ show, level }: LevelUpAnimationProps) {
  const particleTrajectories = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => {
        const angle = (index * Math.PI * 2) / 20
        const distance = 180 + (index % 5) * 45
        return {
          id: index,
          background: `hsl(${(index * 360) / 20}, 100%, 60%)`,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        }
      }),
    [],
  )

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          {particleTrajectories.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-2 w-2 rounded-full"
              style={{ background: particle.background, left: '50%', top: '50%' }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ scale: [0, 1, 0], x: particle.x, y: particle.y }}
              transition={{ duration: 1.5, delay: particle.id * 0.05, ease: 'easeOut' }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="relative"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2 top-1/2"
                animate={{ rotate: 360, scale: [1, 1.5, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                style={{
                  x: Math.cos((index * Math.PI * 2) / 8) * 120,
                  y: Math.sin((index * Math.PI * 2) / 8) * 120,
                }}
              >
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              </motion.div>
            ))}

            <div className="relative rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 p-16 shadow-[0_0_100px_rgba(251,191,36,0.5)] backdrop-blur-xl">
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="mb-6 flex justify-center"
              >
                <div className="rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-8 shadow-[0_0_60px_rgba(251,191,36,0.8)]">
                  <Trophy className="h-20 w-20 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="mb-2 text-5xl font-black text-white">LEVEL UP!</h2>
                <div className="flex items-center justify-center gap-3">
                  <Zap className="h-8 w-8 text-amber-400" />
                  <p className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-6xl font-black text-transparent">
                    {level}
                  </p>
                  <Zap className="h-8 w-8 text-amber-400" />
                </div>
                <p className="mt-4 text-xl text-amber-200">You're getting stronger!</p>
              </motion.div>

              {Array.from({ length: 12 }, (_, index) => (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/2 h-1 w-32 origin-left bg-gradient-to-r from-amber-400 to-transparent"
                  style={{ rotate: (index * 360) / 12 }}
                  animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

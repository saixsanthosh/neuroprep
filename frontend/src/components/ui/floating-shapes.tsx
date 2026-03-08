import { motion } from 'framer-motion'

export function FloatingShapes() {
  const shapes = [
    { size: 60, top: '10%', left: '5%', delay: 0, duration: 20 },
    { size: 40, top: '20%', right: '10%', delay: 2, duration: 15 },
    { size: 80, bottom: '15%', left: '8%', delay: 1, duration: 25 },
    { size: 50, bottom: '25%', right: '15%', delay: 3, duration: 18 },
    { size: 35, top: '50%', left: '15%', delay: 1.5, duration: 22 },
    { size: 45, top: '60%', right: '20%', delay: 2.5, duration: 16 },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-cyan-300/10 bg-gradient-to-br from-cyan-400/5 to-violet-500/5"
          style={{
            width: shape.size,
            height: shape.size,
            top: shape.top,
            bottom: shape.bottom,
            left: shape.left,
            right: shape.right,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

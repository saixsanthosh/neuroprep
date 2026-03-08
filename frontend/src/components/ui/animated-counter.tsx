import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({
  value,
  duration = 2,
  className = '',
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (latest) => Math.floor(latest))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest)
    })
    return unsubscribe
  }, [display])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  )
}

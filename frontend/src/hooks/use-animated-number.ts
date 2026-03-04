import { useEffect, useState } from 'react'

export function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let animationFrame = 0
    const start = performance.now()

    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [target, duration])

  return value
}

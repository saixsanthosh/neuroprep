import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

import { useTheme } from '../../hooks/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center rounded-full border border-white/20 bg-white/10 px-1 transition-colors hover:bg-white/20"
      aria-label="Toggle theme"
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        className="absolute h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-cyan shadow-lg"
        animate={{
          left: isDark ? 'calc(100% - 2.25rem)' : '0.25rem',
        }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-xs">
        <Sun className={`h-4 w-4 transition-colors ${!isDark ? 'text-white' : 'text-slate-400'}`} />
        <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-white' : 'text-slate-400'}`} />
      </span>
    </motion.button>
  )
}

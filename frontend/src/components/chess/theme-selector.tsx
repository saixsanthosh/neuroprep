import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'

type BoardTheme = 'classic' | 'wood' | 'neon' | 'glass' | 'marble'

interface ThemeSelectorProps {
  currentTheme: BoardTheme
  onThemeChange: (theme: BoardTheme) => void
}

const themes: { value: BoardTheme; label: string; colors: [string, string] }[] = [
  { value: 'classic', label: 'Classic', colors: ['#e2e8f0', '#475569'] },
  { value: 'wood', label: 'Wood', colors: ['#fde68a', '#92400e'] },
  { value: 'neon', label: 'Neon', colors: ['#22d3ee', '#7c3aed'] },
  { value: 'glass', label: 'Glass', colors: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'] },
  { value: 'marble', label: 'Marble', colors: ['#f1f5f9', '#94a3b8'] },
]

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
      >
        <Palette className="h-4 w-4 text-white" />
        <span className="hidden text-sm text-white sm:inline">Theme</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl"
            >
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    onThemeChange(theme.value)
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="h-6 w-6 rounded border border-white/20"
                        style={{ background: theme.colors[0] }}
                      />
                      <div
                        className="h-6 w-6 rounded border border-white/20"
                        style={{ background: theme.colors[1] }}
                      />
                    </div>
                    <span className="text-sm text-white">{theme.label}</span>
                  </div>
                  {currentTheme === theme.value && (
                    <Check className="h-4 w-4 text-cyan-300" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'framer-motion'

interface FilterTab {
  id: string
  label: string
}

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function FilterTabs({ tabs, activeTab, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative px-4 py-2 text-sm font-medium transition-colors"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-600/20 backdrop-blur-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className={`relative z-10 ${
              activeTab === tab.id ? 'text-white' : 'text-slate-400'
            }`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}

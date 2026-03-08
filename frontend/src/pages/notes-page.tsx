import { motion } from 'framer-motion'
import { Download, Save, Search, Sparkles, WandSparkles } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const starterNote = `<h2>Thermodynamics - Quick Notes</h2><p>Entropy measures disorder and the unavailability of a system's energy to do work.</p><ul><li>First law: dQ = dU + dW</li><li>Second law: entropy of isolated system increases</li></ul>`

export function NotesPage() {
  const [query, setQuery] = useState('')
  const [summary, setSummary] = useState('')
  const editorRef = useRef<HTMLDivElement | null>(null)

  const applyFormat = (command: string) => {
    document.execCommand(command)
    editorRef.current?.focus()
  }

  const handleSummarize = () => {
    const content = editorRef.current?.innerText ?? ''
    const sentence = content.split('.').filter(Boolean).slice(0, 2).join('. ')
    setSummary(sentence ? `${sentence}.` : 'Add more content to summarize.')
  }

  const handleSave = () => {
    const content = editorRef.current?.innerHTML ?? ''
    localStorage.setItem('neuroprep-notes', content)
  }

  const handleExport = () => {
    const text = editorRef.current?.innerText ?? ''
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'neuroprep-notes.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 pb-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI notes workspace
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A cleaner editor with <span className="text-gradient">premium focus surfaces</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Search topics, draft rich notes, trigger summaries, and export study material without
              leaving the workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Saved Notes', '42'],
              ['AI Summaries', '18'],
              ['Topic Searches', query ? '01' : '00'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass-panel p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-white">Rich Notes Workspace</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Minimal-distraction editor with quick formatting and note search.
              </CardDescription>
            </div>
            <div className="w-full lg:max-w-xs">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search topics"
                  aria-label="Search topics"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {[
              { label: 'Bold', command: 'bold' },
              { label: 'Italic', command: 'italic' },
              { label: 'Underline', command: 'underline' },
            ].map((tool) => (
              <button
                key={tool.label}
                type="button"
                onClick={() => applyFormat(tool.command)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                {tool.label}
              </button>
            ))}
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[420px] rounded-[1.75rem] border border-white/10 bg-black/20 p-5 text-sm leading-relaxed outline-none"
            dangerouslySetInnerHTML={{ __html: starterNote }}
          />
        </Card>

        <div className="space-y-4">
          <Card className="glass-panel p-6">
            <CardTitle className="text-white">AI Summary</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Turn long notes into compact revision output.
            </CardDescription>
            <div className="mt-5 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/8 p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-300">
                <WandSparkles className="h-3.5 w-3.5" />
                Generated summary
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {summary || 'Use the summarize action to create a quick revision digest from your current note.'}
              </p>
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Floating controls are mirrored here for desktop and mobile access.
            </CardDescription>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <Button variant="secondary" className="justify-start" onClick={handleSummarize}>
                <Sparkles className="h-4 w-4" />
                Summarize note
              </Button>
              <Button variant="secondary" className="justify-start" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save note
              </Button>
              <Button variant="secondary" className="justify-start" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export note
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        <Button variant="secondary" className="h-12 w-12 rounded-full p-0" onClick={handleSummarize}>
          <Sparkles className="h-5 w-5" />
        </Button>
        <Button variant="secondary" className="h-12 w-12 rounded-full p-0" onClick={handleSave}>
          <Save className="h-5 w-5" />
        </Button>
        <Button variant="secondary" className="h-12 w-12 rounded-full p-0" onClick={handleExport}>
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

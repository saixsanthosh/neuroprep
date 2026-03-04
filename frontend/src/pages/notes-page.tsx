import { motion } from 'framer-motion'
import { Download, Save, Sparkles } from 'lucide-react'
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Notes</h1>
        <p className="mt-1 text-muted">Minimal-distraction editor with AI summary and export actions.</p>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Rich Notes Workspace</CardTitle>
            <CardDescription>Search, summarize, and save your study notes quickly.</CardDescription>
          </div>
          <div className="w-full sm:max-w-xs">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topics"
              aria-label="Search topics"
            />
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {[
            { label: 'Bold', command: 'bold' },
            { label: 'Italic', command: 'italic' },
            { label: 'Underline', command: 'underline' },
          ].map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={() => applyFormat(tool.command)}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs transition hover:bg-white/15"
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[360px] rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed outline-none"
          dangerouslySetInnerHTML={{ __html: starterNote }}
        />

        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-accent-cyan/35 bg-accent-cyan/10 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-accent-cyan">AI Summary</p>
            <p className="mt-2 text-sm text-muted">{summary}</p>
          </motion.div>
        )}
      </Card>

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

      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-muted">Saved Notes</p>
            <p className="mt-1 text-2xl font-semibold">42</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-muted">AI Summaries</p>
            <p className="mt-1 text-2xl font-semibold">18</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-muted">Topics Searched</p>
            <p className="mt-1 text-2xl font-semibold">{query ? 1 : 0}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

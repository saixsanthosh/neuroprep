import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenText,
  Copy,
  Download,
  FileUp,
  FileText,
  FolderKanban,
  Pin,
  Save,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react'

import { api } from '../lib/api'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'

type NoteRecord = {
  id: string
  title: string
  subject: string
  folder: 'AI Drafts' | 'Revision Packs' | 'Formula Sheets'
  pinned: boolean
  updatedAt: string
  content: string
  summary: string
}

const starterNotes: NoteRecord[] = [
  {
    id: 'electrostatics-core',
    title: 'Electrostatics Revision Grid',
    subject: 'Physics',
    folder: 'Revision Packs',
    pinned: true,
    updatedAt: '10 min ago',
    content:
      'Potential, electric field, Coulomb force, and equipotential surfaces. Focus on sign conventions and quick derivations.',
    summary: 'Field, potential, Coulomb force, equipotential surfaces, and sign traps.',
  },
  {
    id: 'organic-mechanisms',
    title: 'Organic Mechanism Traps',
    subject: 'Chemistry',
    folder: 'AI Drafts',
    pinned: false,
    updatedAt: '1 hour ago',
    content:
      'SN1 vs SN2, carbocation stability, directing effects, and common reagent exceptions with fast examples.',
    summary: 'Mechanism branches, carbocation logic, directing effects, and reagent exceptions.',
  },
  {
    id: 'probability-fast',
    title: 'Probability Sprint Notes',
    subject: 'Math',
    folder: 'Formula Sheets',
    pinned: false,
    updatedAt: 'Yesterday',
    content:
      'Conditional probability, Bayes theorem, and permutation edge cases with 6 short worked examples.',
    summary: 'Conditional probability, Bayes, and permutation edge cases in one sprint sheet.',
  },
]

const quickTopics = [
  'Electrostatics for JEE revision',
  'Organic mechanism revision pack',
  'Probability crash sheet',
  'Thermodynamics formula list',
]

type FolderFilter = 'All' | NoteRecord['folder']

type Flashcard = {
  question: string
  answer: string
}

type UploadQueueItem = {
  id: string
  name: string
  status: 'queued' | 'ready'
}

function buildSummary(content: string) {
  const parts = content
    .split(/[\n.]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4)

  return parts.length ? parts.map((part) => `- ${part}`).join('\n') : '- No summary available yet.'
}

function buildFlashcards(content: string): Flashcard[] {
  return content
    .split(/[\n.]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 12)
    .slice(0, 4)
    .map((part, index) => ({
      question: `Flashcard ${index + 1}`,
      answer: part,
    }))
}

function inferSubjectFromTopic(topic: string) {
  const lowered = topic.toLowerCase()
  if (lowered.includes('physics') || lowered.includes('electro') || lowered.includes('thermo')) return 'Physics'
  if (lowered.includes('chem') || lowered.includes('organic')) return 'Chemistry'
  if (lowered.includes('math') || lowered.includes('probability') || lowered.includes('algebra')) return 'Math'
  return 'General'
}

export function NotesPage() {
  const [topic, setTopic] = useState('Electrostatics for JEE revision')
  const [search, setSearch] = useState('')
  const [folderFilter, setFolderFilter] = useState<FolderFilter>('All')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [editorContent, setEditorContent] = useState<string>(starterNotes[0].content)
  const [savedNotes, setSavedNotes] = useState<NoteRecord[]>(starterNotes)
  const [activeNoteId, setActiveNoteId] = useState<string>(starterNotes[0].id)
  const [flashcards, setFlashcards] = useState<Flashcard[]>(buildFlashcards(starterNotes[0].content))
  const [summary, setSummary] = useState(starterNotes[0].summary)
  const [statusMessage, setStatusMessage] = useState('')
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])

  const activeNote = savedNotes.find((note) => note.id === activeNoteId) ?? savedNotes[0]

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return savedNotes
      .filter((note) => folderFilter === 'All' || note.folder === folderFilter)
      .filter((note) =>
        !query
          ? true
          : note.title.toLowerCase().includes(query) ||
            note.subject.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query),
      )
      .sort((left, right) => Number(right.pinned) - Number(left.pinned))
  }, [folderFilter, savedNotes, search])

  const handleGenerate = async () => {
    const cleanedTopic = topic.trim()
    if (!cleanedTopic || isGenerating) {
      return
    }

    setIsGenerating(true)
    try {
      const { data } = await api.post<{ content: string }>('/ai/generate-notes', {
        topic: cleanedTopic,
        level: 'intermediate',
      })
      setEditorContent(data.content)
      setSummary(buildSummary(data.content))
      setFlashcards(buildFlashcards(data.content))
      setStatusMessage('Fresh AI notes generated for the current topic.')
    } catch {
      const fallback =
        `Structured notes for ${cleanedTopic}\n\n1. Core idea\n2. Key formulas\n3. Common mistakes\n4. Short revision checklist\n5. Practice prompts`
      setEditorContent(fallback)
      setSummary(buildSummary(fallback))
      setFlashcards(buildFlashcards(fallback))
      setStatusMessage('Fallback notes generated locally because the AI request did not complete.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    const title = topic.trim() || 'Untitled AI Notes'
    const nextSummary = buildSummary(editorContent)
    const existingNote = savedNotes.find((note) => note.id === activeNoteId && note.title === title)

    if (existingNote) {
      setSavedNotes((current) =>
        current.map((note) =>
          note.id === existingNote.id
            ? {
                ...note,
                subject: inferSubjectFromTopic(title),
                updatedAt: 'Just now',
                content: editorContent,
                summary: nextSummary,
              }
            : note,
        ),
      )
    } else {
      const newNote: NoteRecord = {
        id: `${Date.now()}`,
        title,
        subject: inferSubjectFromTopic(title),
        folder: 'AI Drafts',
        pinned: false,
        updatedAt: 'Just now',
        content: editorContent,
        summary: nextSummary,
      }
      setSavedNotes((current) => [newNote, ...current])
      setActiveNoteId(newNote.id)
    }

    setSummary(nextSummary)
    setStatusMessage('Note saved to your library.')
  }

  const handleSummarize = async () => {
    if (!editorContent.trim() || isSummarizing) return
    setIsSummarizing(true)
    try {
      const nextSummary = buildSummary(editorContent)
      setSummary(nextSummary)
      setStatusMessage('Summary updated for the current note.')
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleGenerateFlashcards = () => {
    const cards = buildFlashcards(editorContent)
    setFlashcards(cards)
    setStatusMessage(cards.length ? 'Flashcards generated from the current note.' : 'Not enough content for flashcards yet.')
  }

  const handleExport = () => {
    const title = (topic.trim() || 'neuroprep-notes').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()
    const blob = new Blob([`# ${topic.trim() || 'NeuroPrep Notes'}\n\n${editorContent}`], { type: 'text/markdown;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${title}.md`
    link.click()
    URL.revokeObjectURL(href)
    setStatusMessage('Notes exported as a markdown file.')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorContent)
      setStatusMessage('Current note copied to clipboard.')
    } catch {
      setStatusMessage('Clipboard copy was blocked by the browser.')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const nextItems = files.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      status: 'ready' as const,
    }))
    setUploadQueue((current) => [...nextItems, ...current].slice(0, 5))
    setStatusMessage(`${files.length} file${files.length > 1 ? 's' : ''} added to the import queue.`)
    event.target.value = ''
  }

  const handleTogglePin = () => {
    setSavedNotes((current) =>
      current.map((note) => (note.id === activeNoteId ? { ...note, pinned: !note.pinned, updatedAt: 'Just now' } : note)),
    )
    setStatusMessage(activeNote?.pinned ? 'Note unpinned.' : 'Note pinned to the top of the library.')
  }

  return (
    <div className="relative space-y-6 pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="-right-16 top-10"
        colors={['rgba(34, 211, 238, 0.14)', 'rgba(56, 189, 248, 0.1)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-16 left-6"
        colors={['rgba(124, 58, 237, 0.14)', 'rgba(167, 139, 250, 0.1)']}
        size="md"
        delay={1}
      />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_78%_16%,rgba(124,58,237,0.2),transparent_28%),linear-gradient(150deg,rgba(7,11,26,0.95),rgba(11,20,46,0.9))] p-6 shadow-[0_30px_80px_rgba(4,8,24,0.45)] backdrop-blur-2xl sm:p-8"
      >
        <div className="premium-grid absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
            <PulseDot size="sm" color="bg-cyan-400" />
            <Sparkles className="h-3.5 w-3.5" />
            AI notes workspace
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Build revision packs with a <GradientText>real notes workflow</GradientText>.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Generate topic notes, save them into a focused library, search quickly, and keep the
            page usable as a real study workspace instead of a placeholder.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <Input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Enter a topic for AI notes"
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
            <Button className="h-12 px-5" onClick={handleGenerate} disabled={isGenerating}>
              <Wand2 className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Notes'}
            </Button>
            <Button variant="secondary" className="h-12 px-5" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save to Library
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickTopics.map((quickTopic) => (
              <button
                key={quickTopic}
                type="button"
                onClick={() => setTopic(quickTopic)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-300/20 hover:bg-white/10 hover:text-white"
              >
                {quickTopic}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlowingCard className="p-5" glowColor="rgba(34, 211, 238, 0.25)">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Notes Library</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Search and reopen saved study packs
                </CardDescription>
              </div>
              <FolderKanban className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="mt-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {(['All', 'AI Drafts', 'Revision Packs', 'Formula Sheets'] as const).map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setFolderFilter(folder)}
                    className={`rounded-full px-3 py-1.5 text-xs transition ${
                      folderFilter === folder
                        ? 'border border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
                        : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search notes"
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {visibleNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    setActiveNoteId(note.id)
                    setEditorContent(note.content)
                    setTopic(note.title)
                    setSummary(note.summary)
                    setFlashcards(buildFlashcards(note.content))
                  }}
                  className={`w-full rounded-[1.25rem] border p-4 text-left transition ${
                    activeNoteId === note.id
                      ? 'border-cyan-300/30 bg-cyan-300/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{note.title}</p>
                        {note.pinned ? <Pin className="h-3.5 w-3.5 text-cyan-300" /> : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {note.subject} · {note.folder}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                      {note.updatedAt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </GlowingCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
        >
          <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white">{activeNote?.title ?? 'Generated AI Notes'}</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Rich study content area with editable notes and working quick actions.
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="gap-2" onClick={() => void handleSummarize()} disabled={isSummarizing}>
                  <FileText className="h-4 w-4" />
                  {isSummarizing ? 'Summarizing...' : 'Summarize'}
                </Button>
                <Button variant="secondary" className="gap-2" onClick={handleGenerateFlashcards}>
                  <BookOpenText className="h-4 w-4" />
                  Flashcards
                </Button>
                <Button variant="secondary" className="gap-2" onClick={() => void handleCopy()}>
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button className="gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI output
              </div>
              <textarea
                value={editorContent}
                onChange={(event) => setEditorContent(event.target.value)}
                className="min-h-[32rem] w-full resize-none rounded-[1.25rem] border border-white/10 bg-black/10 p-4 text-sm leading-7 text-slate-200 outline-none focus:border-cyan-300/30"
              />
            </div>

            {statusMessage ? (
              <p className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {statusMessage}
              </p>
            ) : null}
          </GlowingCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22 }}
          className="space-y-4"
        >
          <GlowingCard className="p-5" glowColor="rgba(34, 211, 238, 0.28)">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white">AI Summary</CardTitle>
                <CardDescription className="mt-1 text-slate-400">Condensed output for fast revision.</CardDescription>
              </div>
              <button
                type="button"
                onClick={handleTogglePin}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              >
                <Pin className={`h-4 w-4 ${activeNote?.pinned ? 'text-cyan-300' : ''}`} />
              </button>
            </div>
            <div className="mt-4 whitespace-pre-wrap rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              {summary}
            </div>
          </GlowingCard>

          <GlowingCard className="p-5" glowColor="rgba(124, 58, 237, 0.28)">
            <CardTitle className="text-white">Flashcards</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Generated from the current note for faster active recall.
            </CardDescription>
            <div className="mt-4 space-y-3">
              {flashcards.length ? (
                flashcards.map((card) => (
                  <div key={card.question} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{card.question}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{card.answer}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  Generate flashcards once the note has enough content.
                </div>
              )}
            </div>
          </GlowingCard>

          <GlowingCard className="p-5" glowColor="rgba(236, 72, 153, 0.28)">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white">Import Queue</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Add PDFs, DOCX files, or images to the workspace queue.
                </CardDescription>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                <FileUp className="h-4 w-4" />
                Add files
                <input type="file" multiple className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
            <div className="mt-4 space-y-3">
              {uploadQueue.length ? (
                uploadQueue.map((item) => (
                  <div key={item.id} className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm text-white">{item.name}</p>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-200">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  No imported documents yet.
                </div>
              )}
            </div>
          </GlowingCard>
        </motion.div>
      </div>
    </div>
  )
}

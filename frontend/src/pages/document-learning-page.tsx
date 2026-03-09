import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { FileText, FileUp, NotebookPen, ScanSearch, Sparkles, UploadCloud } from 'lucide-react'

import { ModulePageShell } from '../components/dashboard/module-page-shell'
import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { GlowingCard } from '../components/ui/glowing-card'
import { Input } from '../components/ui/input'
import { analyzeDocument, createLibraryNote, getLibraryNotes, type DocumentInsightResponse, type LibraryNote } from '../lib/api'

const supportedTextExtensions = ['txt', 'md', 'csv', 'json']

function buildFallbackExtraction(file: File) {
  const label = file.type || 'document'
  return `Document name: ${file.name}\nDocument type: ${label}\n\nManual extraction is recommended for binary uploads. Paste the important passages here if the preview looks incomplete.`
}

export function DocumentLearningPage() {
  const [documentTitle, setDocumentTitle] = useState('')
  const [subject, setSubject] = useState('General')
  const [documentText, setDocumentText] = useState('')
  const [analysis, setAnalysis] = useState<DocumentInsightResponse | null>(null)
  const [recentNotes, setRecentNotes] = useState<LibraryNote[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const canAnalyze = documentTitle.trim().length > 1 && documentText.trim().length > 20

  useEffect(() => {
    let active = true
    const loadNotes = async () => {
      try {
        const notes = await getLibraryNotes(undefined, 6)
        if (active) setRecentNotes(notes)
      } catch {
        if (active) setRecentNotes([])
      }
    }
    void loadNotes()
    return () => {
      active = false
    }
  }, [])

  const keyPointPreview = useMemo(() => analysis?.key_points ?? [], [analysis])

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setDocumentTitle(file.name.replace(/\.[^.]+$/, ''))
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''

    try {
      if (file.type.startsWith('text/') || supportedTextExtensions.includes(extension)) {
        setDocumentText(await file.text())
      } else {
        setDocumentText(buildFallbackExtraction(file))
      }
      setStatusMessage(`${file.name} loaded into the document workspace.`)
    } catch {
      setDocumentText(buildFallbackExtraction(file))
      setStatusMessage('The file preview could not be extracted cleanly, so a fallback summary workspace was prepared.')
    } finally {
      event.target.value = ''
    }
  }

  const handleAnalyze = async () => {
    if (!canAnalyze || isAnalyzing) return
    setIsAnalyzing(true)
    try {
      const result = await analyzeDocument({
        title: documentTitle.trim(),
        subject: subject.trim() || 'General',
        text: documentText.trim(),
        save_note: false,
      })
      setAnalysis(result)
      setStatusMessage('Document insight generated with summary, key points, and quiz prompts.')
    } catch {
      setStatusMessage('Document analysis failed. Check the extracted text and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async () => {
    if (!analysis || isSaving) return
    setIsSaving(true)
    try {
      const saved = await createLibraryNote({
        title: `${documentTitle.trim() || 'Document'} - learning note`,
        content: `${analysis.summary}\n\nKey points:\n${analysis.key_points.map((item) => `- ${item}`).join('\n')}`,
      })
      setRecentNotes((current) => [saved, ...current.filter((note) => note.id !== saved.id)].slice(0, 6))
      setStatusMessage('Document insight saved to your notes library.')
    } catch {
      setStatusMessage('The insight was generated, but saving it to the notes library failed.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ModulePageShell
      badge="Document learning"
      title="Turn uploads into"
      highlight="usable study material"
      description="Extract the key signal from notes, PDFs, images, or rough pasted text, then convert it into revision bullets and quiz prompts."
      actions={
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10">
          <UploadCloud className="h-4 w-4" />
          Load document
          <input type="file" className="hidden" onChange={handleFileSelect} />
        </label>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <GlowingCard className="p-0" glowColor="rgba(34, 211, 238, 0.28)">
          <div className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-white">Upload workspace</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Paste extracted text or load a document file to create a clean study brief.
                </CardDescription>
              </div>
              <FileUp className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={documentTitle}
                onChange={(event) => setDocumentTitle(event.target.value)}
                placeholder="Document title"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>

            <textarea
              value={documentText}
              onChange={(event) => setDocumentText(event.target.value)}
              placeholder="Paste document text, OCR output, lecture transcript, or extracted notes here."
              className="min-h-[22rem] w-full rounded-[1.5rem] border border-white/10 bg-black/15 p-4 text-sm leading-7 text-slate-200 outline-none transition focus:border-cyan-300/30"
            />

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAnalyze} disabled={!canAnalyze || isAnalyzing}>
                <ScanSearch className="h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze document'}
              </Button>
              <Button variant="secondary" onClick={handleSave} disabled={!analysis || isSaving}>
                <NotebookPen className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save as note'}
              </Button>
            </div>

            {statusMessage ? (
              <div className="rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {statusMessage}
              </div>
            ) : null}
          </div>
        </GlowingCard>

        <div className="space-y-6">
          <GlowingCard className="p-0" glowColor="rgba(124, 58, 237, 0.28)">
            <div className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Document insight</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Summary, key points, and quiz prompts generated from the current source.
                  </CardDescription>
                </div>
                <Sparkles className="h-5 w-5 text-violet-300" />
              </div>

              {analysis ? (
                <>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                    {analysis.summary}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Key points</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-300">
                        {keyPointPreview.map((item) => (
                          <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Quiz prompts</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-300">
                        {analysis.quiz_prompts.map((item) => (
                          <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Study actions</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      {analysis.study_actions.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
                  Load a document and analyze it to generate the learning pack.
                </div>
              )}
            </div>
          </GlowingCard>

          <GlowingCard className="p-0" glowColor="rgba(16, 185, 129, 0.28)">
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Recent saved notes</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    The latest notes generated from documents and manual note workflows.
                  </CardDescription>
                </div>
                <FileText className="h-5 w-5 text-emerald-300" />
              </div>
              {recentNotes.length ? (
                recentNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{note.title}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{note.content}</p>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-[1.3rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  No saved notes yet. Save the first document insight to build the library.
                </div>
              )}
            </div>
          </GlowingCard>
        </div>
      </div>
    </ModulePageShell>
  )
}

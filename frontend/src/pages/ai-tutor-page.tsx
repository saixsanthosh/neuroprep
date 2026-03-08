import { AnimatePresence, motion } from 'framer-motion'
import { Bot, BrainCircuit, SendHorizontal, Sparkles, User, WandSparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const seedReplies = [
  'Start by splitting this topic into definitions, derivation, and three solved examples you can reproduce under time pressure.',
  'For exams, prioritize the high-frequency concept, one worked example, and a mini timed drill before moving on.',
  'I can turn this into a compact revision sheet, formula stack, and five practice questions if you want.',
]

const prompts = ['Explain Gauss law simply', 'Create a revision plan for NEET biology', 'Give me 5 calculus practice questions']

export function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'I am your NeuroPrep tutor. Ask for concepts, formulas, mock review, or a step-by-step breakdown.',
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  const feedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const sendMessage = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || thinking) {
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setThinking(true)

    const reply = seedReplies[messages.length % seedReplies.length]
    const assistantId = crypto.randomUUID()
    let index = 0

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      const interval = setInterval(() => {
        index += 1
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: reply.slice(0, index) }
              : message,
          ),
        )

        if (index >= reply.length) {
          clearInterval(interval)
          setThinking(false)
        }
      }, 20)
    }, 500)
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
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI tutor console
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Study with a <span className="text-gradient">ChatGPT-style tutor</span> tuned for exam prep.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Streaming answers, typing indicators, and a clearer response surface for concepts,
              step-by-step solutions, and revision drills.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[32rem]">
            {[
              ['Mode', 'Exam-ready guidance'],
              ['Latency', 'Streaming response'],
              ['Context', 'Follow-up aware'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="glass-panel flex h-[72vh] flex-col p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <CardTitle className="text-white">NeuroPrep Tutor</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Ask doubts, request explanations, or generate a study drill in one thread.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-300">
              <BrainCircuit className="h-3.5 w-3.5 text-cyan-300" />
              Streaming mode active
            </div>
          </div>

          <div ref={feedRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[88%] items-start gap-3 rounded-[1.5rem] px-4 py-3 text-sm leading-7 sm:max-w-[76%] ${
                      message.role === 'user'
                        ? 'bg-[linear-gradient(135deg,rgba(91,33,182,0.92),rgba(37,99,235,0.92))] text-white shadow-[0_18px_45px_rgba(59,130,246,0.18)]'
                        : 'border border-white/12 bg-white/6 text-[var(--text-main)]'
                    }`}
                  >
                    <div className="mt-1">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-cyan-300" />
                      )}
                    </div>
                    <p>{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {thinking && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300"
              >
                <span>AI thinking</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-1.5 w-1.5 rounded-full bg-cyan-300"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ repeat: Infinity, delay: dot * 0.12, duration: 0.8 }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Ask a concept, formula, or study question..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage(input)
                  }
                }}
              />
              <Button onClick={() => sendMessage(input)} className="sm:w-auto" disabled={thinking}>
                Send
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Tutor Modes</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Use the same workspace for concept clarity, revision planning, and problem solving.
            </CardDescription>
            <div className="mt-5 space-y-3">
              {[
                'Step-by-step solutions for difficult numericals',
                'Topic simplification for fast revision',
                'Mock test review and weak-area breakdown',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="mt-1 rounded-xl bg-cyan-300/10 p-2 text-cyan-300">
                    <WandSparkles className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-panel p-6">
            <CardTitle className="text-white">Session Snapshot</CardTitle>
            <CardDescription className="mt-1 text-slate-400">
              Premium side panels keep the tutor page feeling like a full workspace.
            </CardDescription>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                ['Questions asked', '18'],
                ['Saved answers', '06'],
                ['Practice generated', '12'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-3 text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

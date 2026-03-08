import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  BrainCircuit,
  SendHorizontal,
  Sparkles,
  User,
  WandSparkles,
  Copy,
  Save,
  RefreshCw,
  Lightbulb,
  BookOpen,
  Calculator,
  MessageSquare,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '../components/ui/button'
import { CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { AnimatedGradientOrb } from '../components/ui/animated-gradient-orb'
import { FloatingShapes } from '../components/ui/floating-shapes'
import { GlowingCard } from '../components/ui/glowing-card'
import { GradientText } from '../components/ui/gradient-text'
import { PulseDot } from '../components/ui/pulse-dot'
import { streamGeminiResponse, type ChatMessage } from '../lib/gemini'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  { text: 'Explain Gauss law simply', icon: Lightbulb },
  { text: 'Create a revision plan for NEET biology', icon: BookOpen },
  { text: 'Give me 5 calculus practice questions', icon: Calculator },
  { text: 'Help me understand organic chemistry reactions', icon: BrainCircuit },
]

const tutorModes = [
  {
    title: 'Concept Explanation',
    description: 'Break down complex topics into simple, digestible explanations',
    icon: Lightbulb,
  },
  {
    title: 'Step-by-Step Solutions',
    description: 'Detailed problem-solving with each step explained clearly',
    icon: Calculator,
  },
  {
    title: 'Homework Help',
    description: 'Get guidance on assignments and practice problems',
    icon: BookOpen,
  },
  {
    title: 'Topic Simplification',
    description: 'Simplify difficult concepts for quick revision',
    icon: WandSparkles,
  },
]

export function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hello! I\'m your NeuroPrep AI Tutor powered by Gemini. I can help you with:\n\nâ€¢ Concept explanations\nâ€¢ Step-by-step problem solving\nâ€¢ Homework help\nâ€¢ Topic simplification\nâ€¢ Practice questions\nâ€¢ Revision planning\n\nWhat would you like to learn today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null)
  const [chatHistoryCount, setChatHistoryCount] = useState(0)

  const feedRef = useRef<HTMLDivElement | null>(null)
  const chatHistory = useRef<ChatMessage[]>([])

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isStreaming])

  const sendMessage = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) {
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    // Add to chat history
    chatHistory.current.push({
      role: 'user',
      parts: trimmed,
    })
    setChatHistoryCount(chatHistory.current.length)

    const assistantId = crypto.randomUUID()
    setCurrentStreamId(assistantId)

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      },
    ])

    try {
      let fullResponse = ''

      await streamGeminiResponse(
        trimmed,
        chatHistory.current,
        {
          onChunk: (chunk) => {
            fullResponse += chunk
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: fullResponse }
                  : msg
              )
            )
          },
          onComplete: () => {
            chatHistory.current.push({
              role: 'model',
              parts: fullResponse,
            })
            setChatHistoryCount(chatHistory.current.length)
            setIsStreaming(false)
            setCurrentStreamId(null)
          },
          onError: (error) => {
            console.error('Streaming error:', error)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly in the .env file (VITE_GEMINI_API_KEY).',
                    }
                  : msg
              )
            )
            setIsStreaming(false)
            setCurrentStreamId(null)
          },
        }
      )
    } catch (error) {
      console.error('Error:', error)
      setIsStreaming(false)
      setCurrentStreamId(null)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateResponse = () => {
    if (messages.length < 2) return
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMessage) {
      // Remove last assistant message
      setMessages(prev => prev.slice(0, -1))
      sendMessage(lastUserMessage.content)
    }
  }

  return (
    <div className="relative min-h-screen space-y-6 pb-6">
      <FloatingShapes />
      <AnimatedGradientOrb
        className="-right-20 top-10"
        colors={['rgba(34, 211, 238, 0.15)', 'rgba(56, 189, 248, 0.1)']}
        size="lg"
        delay={0}
      />
      <AnimatedGradientOrb
        className="bottom-20 left-10"
        colors={['rgba(124, 58, 237, 0.15)', 'rgba(167, 139, 250, 0.1)']}
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
        <div className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-500/12 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-cyan-200">
                <PulseDot size="sm" color="bg-cyan-400" />
                <Sparkles className="h-3.5 w-3.5" />
                AI tutor console
              </div>
            </motion.div>

            <motion.h1
              className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Study with a <GradientText>Gemini-powered tutor</GradientText> tuned for exam prep.
            </motion.h1>

            <motion.p
              className="mt-4 text-sm leading-7 text-slate-300 sm:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Streaming answers, typing indicators, and a clearer response surface for concepts,
              step-by-step solutions, and revision drills.
            </motion.p>
          </div>

          <motion.div
            className="grid gap-3 sm:grid-cols-3 xl:w-[32rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { label: 'Mode', value: 'Exam-ready guidance', icon: BrainCircuit },
              { label: 'Latency', value: 'Streaming response', icon: Sparkles },
              { label: 'Context', value: 'Follow-up aware', icon: MessageSquare },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-cyan-300" />
                </div>
                <p className="mt-2 text-sm font-semibold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlowingCard className="flex h-[72vh] flex-col p-5 sm:p-6" glowColor="rgba(34, 211, 238, 0.3)">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <CardTitle className="text-white">NeuroPrep AI Tutor</CardTitle>
                <CardDescription className="mt-1 text-slate-400">
                  Powered by Google Gemini â€¢ Ask doubts, request explanations, or generate study drills
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-300">
                <BrainCircuit className="h-3.5 w-3.5 text-cyan-300" />
                {isStreaming ? 'Streaming...' : 'Ready'}
              </div>
            </div>

            <div ref={feedRef} className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`group relative flex max-w-[88%] items-start gap-3 rounded-[1.5rem] px-4 py-3 text-sm leading-7 sm:max-w-[76%] ${
                        message.role === 'user'
                          ? 'bg-[linear-gradient(135deg,rgba(91,33,182,0.92),rgba(37,99,235,0.92))] text-white shadow-[0_18px_45px_rgba(59,130,246,0.18)]'
                          : 'border border-white/12 bg-white/6 text-[var(--text-main)]'
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-cyan-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        {message.role === 'assistant' && message.content && (
                          <div className="mt-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                              title="Copy"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                              title="Save"
                            >
                              <Save className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isStreaming && currentStreamId && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-300"
                >
                  <Bot className="h-3.5 w-3.5 text-cyan-300" />
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
                {suggestedPrompts.map((prompt) => (
                  <motion.button
                    key={prompt.text}
                    type="button"
                    onClick={() => sendMessage(prompt.text)}
                    disabled={isStreaming}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/25 hover:bg-white/10 disabled:opacity-50"
                  >
                    <prompt.icon className="h-3 w-3" />
                    {prompt.text}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Ask a concept, formula, or study question..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  disabled={isStreaming}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  {messages.length > 1 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={regenerateResponse}
                      disabled={isStreaming}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => sendMessage(input)}
                    disabled={isStreaming || !input.trim()}
                    className="sm:w-auto"
                  >
                    Send
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </GlowingCard>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(124, 58, 237, 0.3)">
              <CardTitle className="text-white">Tutor Modes</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                AI adapts to your learning needs
              </CardDescription>
              <div className="mt-5 space-y-3">
                {tutorModes.map((mode, index) => (
                  <motion.div
                    key={mode.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <span className="mt-0.5 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 p-2">
                      <mode.icon className="h-4 w-4 text-cyan-300" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{mode.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{mode.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlowingCard className="p-6" glowColor="rgba(236, 72, 153, 0.3)">
              <CardTitle className="text-white">Session Stats</CardTitle>
              <CardDescription className="mt-1 text-slate-400">
                Track your learning progress
              </CardDescription>
              <div className="mt-5 space-y-3">
                {[
                  { label: 'Questions asked', value: messages.filter(m => m.role === 'user').length },
                  { label: 'Responses received', value: messages.filter(m => m.role === 'assistant').length - 1 },
                  { label: 'Chat history', value: chatHistoryCount },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="text-sm text-slate-400">{stat.label}</span>
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

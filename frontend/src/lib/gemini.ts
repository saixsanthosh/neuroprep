import { api } from './api'

export interface ChatMessage {
  role: 'user' | 'model'
  parts: string
}

export interface StreamCallback {
  onChunk: (text: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}

function buildContext(history: ChatMessage[]) {
  return history
    .slice(-6)
    .map((message) => `${message.role}: ${message.parts}`)
    .join('\n')
}

export async function streamGeminiResponse(
  prompt: string,
  history: ChatMessage[],
  callback: StreamCallback,
) {
  try {
    const response = await api.post<{ content: string }>('/ai/chat', {
      message: prompt,
      context: buildContext(history),
    })

    const content = response.data.content || 'No response generated.'
    const chunks = content.match(/.{1,32}(\s|$)/g) ?? [content]

    for (const chunk of chunks) {
      callback.onChunk(chunk)
      await new Promise((resolve) => window.setTimeout(resolve, 35))
    }

    callback.onComplete()
  } catch (error) {
    callback.onError(error as Error)
  }
}

export async function generateGeminiResponse(
  prompt: string,
  history: ChatMessage[] = [],
): Promise<string> {
  const response = await api.post<{ content: string }>('/ai/chat', {
    message: prompt,
    context: buildContext(history),
  })
  return response.data.content
}

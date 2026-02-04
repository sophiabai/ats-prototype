import { useState, useCallback } from 'react'
import { Sparkles, Bot, User } from 'lucide-react'
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from '@/components/ui/chat-container'
import {
  Message,
  MessageContent,
} from '@/components/ui/message'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader } from '@/components/ui/loader'
import { SearchInput } from '@/components/ui/search-input'
import { chat, type ChatMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ChatbotProps {
  className?: string
  systemPrompt?: string
  placeholder?: string
  title?: string
  subtitle?: string
  showHeader?: boolean
}

export function Chatbot({
  className,
  systemPrompt = 'You are a helpful AI assistant for an applicant tracking system. Help users with recruiting, hiring, and candidate management tasks.',
  placeholder = 'Ask me anything about candidates, jobs, or recruiting...',
  title = 'AI Assistant',
  subtitle = 'Powered by AI',
  showHeader = true,
}: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await chat({
        messages: [
          { role: 'system', content: systemPrompt },
          ...newMessages,
        ],
      })

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message.content },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, systemPrompt])

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-gradient-to-b from-background to-muted/20 rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-3 px-5 py-4 border-b bg-background/80 backdrop-blur-sm">
          <div className="relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <ChatContainerRoot className="flex-1 px-4 py-6">
        <ChatContainerContent className="gap-6 max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-berry" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                How can I help you today?
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ask me about candidates, job postings, interview scheduling, or
                any other recruiting tasks.
              </p>
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {[
                  'Find top candidates',
                  'Schedule an interview',
                  'Review applications',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 text-sm rounded-full border bg-background hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-2 duration-300',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      'flex items-center justify-center text-white',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                        : 'bg-primary'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <MessageContent
                  markdown={message.role === 'assistant'}
                  className={cn(
                    'max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md'
                      : 'bg-muted/50 rounded-2xl rounded-tl-md'
                  )}
                >
                  {message.content}
                </MessageContent>
              </Message>
            ))
          )}

          {isLoading && (
            <Message className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="flex items-center justify-center bg-primary text-primary-foreground">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <MessageContent className="bg-muted/50 rounded-2xl rounded-tl-md">
                <Loader variant="typing" size="sm" />
              </MessageContent>
            </Message>
          )}

          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {/* Input */}
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="w-full">
          <SearchInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
            placeholder={placeholder}
            minHeight="120px"
            className="bg-muted/50 border-muted-foreground/20"
          />
          <p className="text-xs text-center text-muted-foreground mt-3">
            AI may make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}


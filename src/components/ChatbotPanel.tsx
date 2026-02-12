import { createContext, useContext, useState, type ReactNode } from 'react'
import { X, Sparkles } from 'lucide-react'
import { SuperAdminPanel } from './SuperAdminPanel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type WorkQueueItemType = 'payroll_missing_inputs' | 'time_non_compliant' | 'it_non_compliant' | 'spend_expense_pending'
export interface WorkQueueItem {
  id: string
  type: WorkQueueItemType
  title: string
  count: number
  product: string
  resolved?: boolean
}

interface ChatbotPanelContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const ChatbotPanelContext = createContext<ChatbotPanelContextType | null>(null)

export function useChatbotPanel() {
  const context = useContext(ChatbotPanelContext)
  if (!context) {
    throw new Error('useChatbotPanel must be used within a ChatbotPanelProvider')
  }
  return context
}

export function ChatbotPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen((prev) => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <ChatbotPanelContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </ChatbotPanelContext.Provider>
  )
}

export function ChatbotPanel() {
  const { isOpen, close } = useChatbotPanel()

  return (
    <div
      className={cn(
        'h-full border-l bg-background flex flex-col transition-all duration-300 ease-in-out overflow-hidden',
        isOpen ? 'w-sm opacity-100' : 'w-0 min-w-0 opacity-0'
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0 bg-background">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground truncate">Answers, actions & advice · HRIS, Benefits, Payroll, Time, ATS & more</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted"
          onClick={close}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {isOpen && <SuperAdminPanel />}
      </div>
    </div>
  )
}


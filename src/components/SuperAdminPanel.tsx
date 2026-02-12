import { useState, useCallback, useEffect } from 'react'
import {
  Sparkles,
  FileCheck,
  ListTodo,
  TrendingDown,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  MessageSquarePlus,
  ThumbsUp,
  ThumbsDown,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/ui/search-input'
import { Message, MessageContent } from '@/components/ui/message'
import { Markdown } from '@/components/ui/markdown'
import { Loader } from '@/components/ui/loader'
import { Textarea } from '@/components/ui/textarea'
import { usePersonaMode } from '@/lib/personaModeContext'
import { useWorkflowModal } from '@/lib/workflowModalContext'
import { useChatbotPanel } from '@/components/ChatbotPanel'
import { useNavigate } from 'react-router'
import { chat } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type PanelView = 'home' | 'payroll' | 'todo'

const QUICK_ACTIONS = [
  "What's new",
  'Blockers',
  'Overdue tasks',
  'Find issues',
  'Business summary',
]

const SYSTEM_PROMPT = `You are the Rippling AI Assistant for a company admin. Answer concisely and professionally. You have context across HRIS, Benefits, Payroll, Time, ATS, and Reports. Give realistic, specific answers as if you are querying the customer's Rippling data. Use bullet points or short paragraphs. If you don't have real data, invent plausible example data (e.g. names, counts, dates) that sounds like a real admin dashboard. Keep responses focused and under 150 words unless the question clearly needs more.`

const PILL_PROMPTS: Record<string, string> = {
  "What's new": "What's new since my last login? Give a brief summary of recent changes I should know about as an admin (e.g. policy updates, pending approvals, new hires, system notifications).",
  'Blockers': "List everything that is currently blocked and who is blocking it. Include items from payroll, time off, compliance, and other areas. Be specific with names and counts.",
  'Overdue tasks': "What are all my overdue tasks? List them by category (payroll, time cards, approvals, compliance, etc.) with due dates and what action is needed.",
  'Find issues': "Summarize the 3 biggest operational issues right now that need my attention. Be specific and actionable.",
  'Business summary': "Give me a brief business summary: key metrics and what I should focus on today. Include headcount, pending approvals, and any alerts.",
}

const PILL_DISPLAY_QUESTIONS: Record<string, string> = {
  "What's new": "What's new since my last login?",
  'Blockers': "Show me a list of everything that is blocked and who's blocking it.",
  'Overdue tasks': "What are all my overdue tasks?",
  'Find issues': "Summarize the 3 biggest operational issues right now.",
  'Business summary': "Give me a brief business summary of key metrics and what I should focus on today.",
}

export const DEFAULT_FEEDBACK_REMINDER_MESSAGE = `Hi,

This is a friendly reminder to submit your overdue interview feedback. Please complete it at your earliest convenience so we can keep our hiring process on track.

Thank you!`

export function SuperAdminPanel() {
  const { persona, mode } = usePersonaMode()
  const { open: openModal, workQueueItems } = useWorkflowModal()
  const { feedbackReminderDraft, clearFeedbackReminderDraft } = useChatbotPanel()
  const navigate = useNavigate()
  const [view, setView] = useState<PanelView>('home')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reminderMessage, setReminderMessage] = useState('')
  const isSuperAdmin = persona === 'super_admin'
  const isPayrollWeek = mode === 'payroll_week'

  useEffect(() => {
    if (feedbackReminderDraft) {
      setReminderMessage(feedbackReminderDraft.draftMessage)
    }
  }, [feedbackReminderDraft])

  const handlePillClick = useCallback(async (label: string) => {
    const userPrompt = PILL_PROMPTS[label] ?? label
    const displayQuestion = PILL_DISPLAY_QUESTIONS[label] ?? label
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: displayQuestion }])
    setIsLoading(true)
    try {
      const res = await chat({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: res.message.content }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.')
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startNewChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 rounded-xl overflow-hidden">
        <div className="flex-1 px-4 py-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-berry" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">AI Assistant</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Answers, actions, and advice based on your role. Switch to <strong>Super Admin</strong> in the top bar for full admin capabilities (e.g. Payroll Copilot, resolve queue items).
          </p>
          <p className="text-xs text-muted-foreground">Ask questions about HRIS, Benefits, Payroll, Time, and more. Responses respect your permissions.</p>
        </div>
        <div className="p-4 border-t border-border/80 bg-muted/30">
          <SearchInput value="" onChange={() => {}} onSubmit={() => {}} placeholder="Ask or do anything" disabled={false} minHeight="72px" className="min-h-0" />
          <p className="text-xs text-muted-foreground mt-3">Answers cite sources. Actions show a draft before applying. Your permissions are respected.</p>
        </div>
      </div>
    )
  }

  const unresolvedQueue = workQueueItems.filter((i) => !i.resolved)

  // Feedback reminder draft: opened from Home "Send Reminders" on Feedback Completion widget
  if (feedbackReminderDraft && isSuperAdmin) {
    const handleSubmitFeedbackReminders = () => {
      toast.success(`Reminders sent to ${feedbackReminderDraft.recipients.length} recipient${feedbackReminderDraft.recipients.length === 1 ? '' : 's'}.`)
      clearFeedbackReminderDraft()
    }
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 -ml-1 mb-2 self-start text-muted-foreground hover:text-foreground"
            onClick={clearFeedbackReminderDraft}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h3 className="text-sm font-semibold text-foreground mb-1">Send feedback reminders</h3>
          <p className="text-xs text-muted-foreground mb-4">Review the message below and send when ready.</p>
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground">Recipients</p>
            <ul className="rounded-lg border border-border divide-y divide-border bg-muted/20">
              {feedbackReminderDraft.recipients.map((r, i) => (
                <li key={i} className="px-3 py-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="text-xs text-muted-foreground">{r.overdue} overdue</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground">Message</p>
            <Textarea
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              placeholder="Write your reminder..."
              className="min-h-[120px] resize-none text-sm"
              disabled={!feedbackReminderDraft}
            />
          </div>
          <Button className="w-full gap-2" onClick={handleSubmitFeedbackReminders}>
            <Send className="h-4 w-4" />
            Send reminders
          </Button>
        </div>
      </div>
    )
  }

  const footer = (
    <>
      <div className="p-4 border-t border-border/80 bg-muted/30 shrink-0">
        <SearchInput
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          placeholder="Ask or do anything"
          minHeight="72px"
          className="min-h-0"
        />
        <p className="text-xs text-muted-foreground mt-3">Answers cite sources. Actions show a draft before applying. Your permissions are respected.</p>
      </div>
    </>
  )

  // Thread view: user asked something (messages in the thread). Keep panel chrome: messages + thinking UI + footer.
  if (messages.length > 0 || isLoading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground text-xs" onClick={startNewChat}>
              <MessageSquarePlus className="h-3.5 w-3.5" />
              New chat
            </Button>
          </div>
          {messages.map((msg, i) => (
            <Message key={i} className={msg.role === 'user' ? 'flex-row-reverse' : ''}>
              <MessageContent
                className={cn(
                  'max-w-[90%] text-sm rounded-2xl',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-md'
                    : 'bg-muted/50 rounded-tl-md'
                )}
              >
                {msg.role === 'assistant' && msg.content === 'Something went wrong. Try again.' ? (
                  <span className="text-destructive">{msg.content}</span>
                ) : msg.role === 'assistant' ? (
                  <Markdown className="[&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 last:[&_p]:mb-0">{msg.content}</Markdown>
                ) : (
                  msg.content
                )}
              </MessageContent>
            </Message>
          ))}
          {isLoading && (
            <Message>
              <MessageContent className="bg-muted/50 rounded-2xl rounded-tl-md max-w-[90%] text-sm py-3">
                <div className="flex items-center gap-2">
                  <Loader variant="typing" size="sm" />
                  <span className="text-muted-foreground text-xs">Thinking...</span>
                </div>
              </MessageContent>
            </Message>
          )}
          {messages.length > 0 && !isLoading && (
            <div className="flex items-center gap-2 pt-2 pb-1">
              <span className="text-xs text-muted-foreground">Was this helpful?</span>
              <button type="button" className="p-1.5 rounded-md hover:bg-muted transition-colors" aria-label="Thumbs up">
                <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button type="button" className="p-1.5 rounded-md hover:bg-muted transition-colors" aria-label="Thumbs down">
                <ThumbsDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
        {footer}
      </div>
    )
  }

  // Empty-state: prompt + quick actions + Suggestions for you (PRD-aligned)
  if (view === 'home') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col">
          <div className="flex items-center justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground text-xs border-border/80"
              onClick={() => {}}
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              New chat
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Let's get shit done!
          </h2>

          <h3 className="text-sm font-medium text-foreground mb-1">Suggestions for you</h3>
          <p className="text-xs text-muted-foreground mb-3">Based on your role and what’s waiting for you</p>
          <ul className="space-y-2 mb-8">
            <li>
              <button
                type="button"
                onClick={() => setView('payroll')}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-border border-l-[3px] border-l-amber-500/80 bg-background hover:bg-muted/50 hover:border-muted-foreground/20 transition-colors text-left min-h-[3.5rem]"
              >
                <span className="flex items-center gap-2.5 min-w-0 flex-1">
                  <FileCheck className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-sm font-medium text-foreground">Your payroll run has 3 blockers</span>
                </span>
                <span className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                  <span>Due Feb 14</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setView('todo')}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-border border-l-[3px] border-l-primary/60 bg-background hover:bg-muted/50 hover:border-muted-foreground/20 transition-colors text-left min-h-[3.5rem]"
              >
                <span className="flex items-center gap-2.5 min-w-0 flex-1">
                  <ListTodo className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">4 items on your to-do list need attention</span>
                </span>
                <span className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                  <span>Overdue</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>
            </li>
          </ul>

          <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick prompts</h3>
          <div className="flex flex-wrap gap-2 pb-4">
            {QUICK_ACTIONS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handlePillClick(label)}
                disabled={isLoading}
                className="px-3 py-2 text-sm rounded-full border border-border bg-background hover:bg-muted/60 hover:border-muted-foreground/30 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {footer}
      </div>
    )
  }

  // Detail view: only the cards for this use case
  const backButton = (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 -ml-1 mb-2 text-muted-foreground hover:text-foreground"
      onClick={() => setView('home')}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  )

  const payrollCard = (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          Payroll
        </CardTitle>
        <CardDescription>
          {isPayrollWeek ? 'Payroll Week — priority' : 'Current run'} · Due Feb 14, 5pm PST
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          Status: <span className="font-medium text-amber-700 dark:text-amber-400">Missing inputs</span> — 3 blockers
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openModal('payroll_runboard')}>
            View details
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/jobs')}>
            Go to Payroll
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => openModal('payroll_submit')}>
            Submit payroll
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const workQueueCard = (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          Work queue
        </CardTitle>
        <CardDescription>
          {unresolvedQueue.length} items need attention across Payroll, Time, IT, Spend
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {workQueueItems.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-muted/30 transition-colors',
                item.resolved && 'opacity-60'
              )}
            >
              <span className="truncate flex-1">{item.title}</span>
              {!item.resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1 h-7 text-xs"
                  onClick={() => openModal('resolve', { resolveItem: item })}
                >
                  Resolve
                  <ChevronRight className="h-3 w-3" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )

  const varianceCard = (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingDown className="h-4 w-4" />
          Pay variance
        </CardTitle>
        <CardDescription>
          5 employees with net pay change &gt;20% vs last period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openModal('variance')}>
          View variance table
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {backButton}
        {view === 'payroll' && (
          <>
            {payrollCard}
            {varianceCard}
          </>
        )}
        {view === 'todo' && workQueueCard}
      </div>
      <div className="p-4 border-t border-border/80 bg-muted/30 shrink-0">
        <SearchInput
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          placeholder="Ask or do anything"
          minHeight="72px"
          className="min-h-0"
        />
        <p className="text-xs text-muted-foreground mt-3">Answers cite sources. Actions show a draft before applying. Your permissions are respected.</p>
      </div>
    </div>
  )
}

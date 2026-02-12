import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { WorkQueueItem } from '@/components/ChatbotPanel'

export type WorkflowModalType =
  | 'payroll_runboard'
  | 'payroll_submit'
  | 'variance'
  | 'variance_detail'
  | 'resolve'
  | null

export interface WorkflowModalPayload {
  resolveItem?: WorkQueueItem
  varianceEmployeeName?: string
}

interface WorkflowModalContextType {
  type: WorkflowModalType
  payload: WorkflowModalPayload | null
  open: (type: WorkflowModalType, payload?: WorkflowModalPayload) => void
  close: () => void
  workQueueItems: (WorkQueueItem & { resolved?: boolean })[]
  markResolved: (id: string) => void
}

const INITIAL_QUEUE: (WorkQueueItem & { resolved?: boolean })[] = [
  { id: 'wq-1', type: 'payroll_missing_inputs', title: 'Missing payroll inputs from 3 managers', count: 3, product: 'Payroll' },
  { id: 'wq-2', type: 'time_non_compliant', title: '12 employees have non-compliant timecards', count: 12, product: 'Time & Attendance' },
  { id: 'wq-3', type: 'it_non_compliant', title: '7 devices are non-compliant (encryption off)', count: 7, product: 'IT' },
  { id: 'wq-4', type: 'spend_expense_pending', title: '5 expense reports pending approval >7 days', count: 5, product: 'Spend' },
]

const WorkflowModalContext = createContext<WorkflowModalContextType | null>(null)

export function useWorkflowModal() {
  const ctx = useContext(WorkflowModalContext)
  if (!ctx) throw new Error('useWorkflowModal must be used within WorkflowModalProvider')
  return ctx
}

export function WorkflowModalProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<WorkflowModalType>(null)
  const [payload, setPayload] = useState<WorkflowModalPayload | null>(null)
  const [workQueueItems, setWorkQueueItems] = useState<(WorkQueueItem & { resolved?: boolean })[]>(() =>
    INITIAL_QUEUE.map((i) => ({ ...i }))
  )

  const open = useCallback((t: WorkflowModalType, p?: WorkflowModalPayload) => {
    setType(t)
    setPayload(p ?? null)
  }, [])
  const close = useCallback(() => {
    setType(null)
    setPayload(null)
  }, [])
  const markResolved = useCallback((id: string) => {
    setWorkQueueItems((prev) => prev.map((i) => (i.id === id ? { ...i, resolved: true } : i)))
  }, [])

  return (
    <WorkflowModalContext.Provider
      value={{ type, payload, open, close, workQueueItems, markResolved }}
    >
      {children}
    </WorkflowModalContext.Provider>
  )
}

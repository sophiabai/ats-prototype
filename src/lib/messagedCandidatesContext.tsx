import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Candidate } from '@/data/candidates'

export interface MessagedCandidate {
  candidate: Candidate
  sentAt: string
  sentBy: string
  sequenceName: string
  jobRequisition?: string
}

interface MessagedCandidatesContextType {
  messagedCandidates: MessagedCandidate[]
  addMessagedCandidates: (entries: MessagedCandidate[]) => void
  updateJobRequisition: (candidateId: string, jobRequisition: string) => void
}

const MessagedCandidatesContext = createContext<MessagedCandidatesContextType | undefined>(undefined)

export function MessagedCandidatesProvider({ children }: { children: ReactNode }) {
  const [messagedCandidates, setMessagedCandidates] = useState<MessagedCandidate[]>([])

  const addMessagedCandidates = (entries: MessagedCandidate[]) => {
    setMessagedCandidates(prev => {
      const existingIds = new Set(prev.map(e => e.candidate.id))
      const newEntries = entries.filter(e => !existingIds.has(e.candidate.id))
      return [...prev, ...newEntries]
    })
  }

  const updateJobRequisition = (candidateId: string, jobRequisition: string) => {
    setMessagedCandidates(prev =>
      prev.map(e =>
        e.candidate.id === candidateId ? { ...e, jobRequisition } : e
      )
    )
  }

  return (
    <MessagedCandidatesContext.Provider value={{ messagedCandidates, addMessagedCandidates, updateJobRequisition }}>
      {children}
    </MessagedCandidatesContext.Provider>
  )
}

export function useMessagedCandidates() {
  const context = useContext(MessagedCandidatesContext)
  if (!context) {
    throw new Error('useMessagedCandidates must be used within a MessagedCandidatesProvider')
  }
  return context
}


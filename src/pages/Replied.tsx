import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { candidates } from '@/data/candidates'
import { CandidateMessageTable, type MessageTableEntry } from '@/components/CandidateMessageTable'

const mockRepliedData: MessageTableEntry[] = [
  {
    candidate: candidates[0],
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'ML Engineer Outreach',
    jobRequisition: 'Senior ML Engineer',
    status: 'Replied',
    statusColor: 'bg-green-400',
  },
  {
    candidate: candidates[2],
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'Introduction Outreach',
    status: 'Replied',
    statusColor: 'bg-green-400',
  },
  {
    candidate: candidates[5],
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Jane Smith',
    sequenceName: 'Senior Leadership Outreach',
    status: 'Replied',
    statusColor: 'bg-green-400',
  },
]

export function Replied() {
  const [entries, setEntries] = useState<MessageTableEntry[]>(mockRepliedData)

  const handleUpdateJob = (candidateId: string, jobTitle: string) => {
    setEntries(prev =>
      prev.map(e =>
        e.candidate.id === candidateId ? { ...e, jobRequisition: jobTitle } : e
      )
    )
  }

  return (
    <CandidateMessageTable
      title="Replied"
      entries={entries}
      emptyIcon={<MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />}
      emptyTitle="No replies yet"
      emptyDescription="Candidates who reply to your outreach will appear here."
      onUpdateJobRequisition={handleUpdateJob}
    />
  )
}


import { useState } from 'react'
import { UserX } from 'lucide-react'
import { candidates } from '@/data/candidates'
import { CandidateMessageTable, type MessageTableEntry } from '@/components/CandidateMessageTable'

const mockNotInterestedData: MessageTableEntry[] = [
  {
    candidate: candidates[6],
    sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'ML Engineer Outreach',
    status: 'Not interested',
    statusColor: 'bg-gray-400',
  },
  {
    candidate: candidates[8],
    sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Jane Smith',
    sequenceName: 'Introduction Outreach',
    status: 'No response',
    statusColor: 'bg-gray-400',
  },
  {
    candidate: candidates[9],
    sentAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'Senior Leadership Outreach',
    status: 'No response',
    statusColor: 'bg-gray-400',
  },
  {
    candidate: candidates[10],
    sentAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'Introduction Outreach',
    status: 'Not interested',
    statusColor: 'bg-gray-400',
  },
]

export function NotInterested() {
  const [entries, setEntries] = useState<MessageTableEntry[]>(mockNotInterestedData)

  const handleUpdateJob = (candidateId: string, jobTitle: string) => {
    setEntries(prev =>
      prev.map(e =>
        e.candidate.id === candidateId ? { ...e, jobRequisition: jobTitle } : e
      )
    )
  }

  return (
    <CandidateMessageTable
      title="Not interested / no response"
      entries={entries}
      emptyIcon={<UserX className="h-12 w-12 text-muted-foreground mx-auto" />}
      emptyTitle="No unresponsive candidates"
      emptyDescription="Candidates who don't respond or aren't interested will appear here."
      onUpdateJobRequisition={handleUpdateJob}
    />
  )
}


import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { candidates } from '@/data/candidates'
import { CandidateMessageTable, type MessageTableEntry } from '@/components/CandidateMessageTable'

const mockInterviewingData: MessageTableEntry[] = [
  {
    candidate: candidates[0],
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'ML Engineer Outreach',
    jobRequisition: 'Senior ML Engineer',
    status: 'Interviewing',
    statusColor: 'bg-purple-400',
  },
  {
    candidate: candidates[3],
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Jane Smith',
    sequenceName: 'Introduction Outreach',
    jobRequisition: 'Staff Software Engineer',
    status: 'Interviewing',
    statusColor: 'bg-purple-400',
  },
]

export function Interviewing() {
  const [entries, setEntries] = useState<MessageTableEntry[]>(mockInterviewingData)

  const handleUpdateJob = (candidateId: string, jobTitle: string) => {
    setEntries(prev =>
      prev.map(e =>
        e.candidate.id === candidateId ? { ...e, jobRequisition: jobTitle } : e
      )
    )
  }

  return (
    <CandidateMessageTable
      title="Interviewing"
      entries={entries}
      emptyIcon={<Calendar className="h-12 w-12 text-muted-foreground mx-auto" />}
      emptyTitle="No candidates interviewing"
      emptyDescription="Candidates who move to the interview stage will appear here."
      onUpdateJobRequisition={handleUpdateJob}
    />
  )
}



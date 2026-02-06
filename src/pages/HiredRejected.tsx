import { useState } from 'react'
import { UserCheck } from 'lucide-react'
import { candidates } from '@/data/candidates'
import { CandidateMessageTable, type MessageTableEntry } from '@/components/CandidateMessageTable'

const mockHiredRejectedData: MessageTableEntry[] = [
  {
    candidate: candidates[1],
    sentAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'ML Engineer Outreach',
    jobRequisition: 'Senior ML Engineer',
    status: 'Hired',
    statusColor: 'bg-green-500',
  },
  {
    candidate: candidates[4],
    sentAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Jane Smith',
    sequenceName: 'Introduction Outreach',
    jobRequisition: 'Engineering Manager',
    status: 'Rejected',
    statusColor: 'bg-red-400',
  },
  {
    candidate: candidates[7],
    sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'Senior Leadership Outreach',
    jobRequisition: 'Staff Software Engineer',
    status: 'Rejected',
    statusColor: 'bg-red-400',
  },
]

export function HiredRejected() {
  const [entries, setEntries] = useState<MessageTableEntry[]>(mockHiredRejectedData)

  const handleUpdateJob = (candidateId: string, jobTitle: string) => {
    setEntries(prev =>
      prev.map(e =>
        e.candidate.id === candidateId ? { ...e, jobRequisition: jobTitle } : e
      )
    )
  }

  return (
    <CandidateMessageTable
      title="Hired / rejected"
      entries={entries}
      emptyIcon={<UserCheck className="h-12 w-12 text-muted-foreground mx-auto" />}
      emptyTitle="No candidates hired or rejected"
      emptyDescription="Candidates who are hired or rejected will appear here."
      onUpdateJobRequisition={handleUpdateJob}
    />
  )
}


import { useState } from 'react'
import { Mail } from 'lucide-react'
import { candidates } from '@/data/candidates'
import { useMessagedCandidates } from '@/lib/messagedCandidatesContext'
import { CandidateMessageTable, type MessageTableEntry } from '@/components/CandidateMessageTable'

const mockMessagedData: MessageTableEntry[] = [
  {
    candidate: candidates[1],
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'ML Engineer Outreach',
    status: 'Messaged',
    statusColor: 'bg-blue-400',
  },
  {
    candidate: candidates[3],
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'Introduction Outreach',
    jobRequisition: 'Senior ML Engineer',
    status: 'Messaged',
    statusColor: 'bg-blue-400',
  },
  {
    candidate: candidates[5],
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Jane Smith',
    sequenceName: 'Senior Leadership Outreach',
    status: 'Messaged',
    statusColor: 'bg-blue-400',
  },
  {
    candidate: candidates[8],
    sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'You',
    sequenceName: 'ML Engineer Outreach',
    jobRequisition: 'Staff Software Engineer',
    status: 'Messaged',
    statusColor: 'bg-blue-400',
  },
  {
    candidate: candidates[11],
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Jane Smith',
    sequenceName: 'Introduction Outreach',
    status: 'Messaged',
    statusColor: 'bg-blue-400',
  },
]

export function Messaged() {
  const { messagedCandidates, updateJobRequisition } = useMessagedCandidates()
  const [mockEntries, setMockEntries] = useState<MessageTableEntry[]>(mockMessagedData)

  // Merge mock data with dynamically added candidates from the sequence flow
  const dynamicEntries: MessageTableEntry[] = messagedCandidates
    .filter(mc => !mockEntries.some(e => e.candidate.id === mc.candidate.id))
    .map(mc => ({
      candidate: mc.candidate,
      sentAt: mc.sentAt,
      sentBy: mc.sentBy,
      sequenceName: mc.sequenceName,
      jobRequisition: mc.jobRequisition,
      status: 'Messaged',
      statusColor: 'bg-blue-400',
    }))

  const allEntries = [...dynamicEntries, ...mockEntries]

  const handleUpdateJob = (candidateId: string, jobTitle: string) => {
    // Try updating in mock data first
    const inMock = mockEntries.some(e => e.candidate.id === candidateId)
    if (inMock) {
      setMockEntries(prev =>
        prev.map(e =>
          e.candidate.id === candidateId ? { ...e, jobRequisition: jobTitle } : e
        )
      )
    } else {
      updateJobRequisition(candidateId, jobTitle)
    }
  }

  return (
    <CandidateMessageTable
      title="Messaged"
      entries={allEntries}
      emptyIcon={<Mail className="h-12 w-12 text-muted-foreground mx-auto" />}
      emptyTitle="No messages sent yet"
      emptyDescription="Select candidates from a search and send them a message to see them here."
      onUpdateJobRequisition={handleUpdateJob}
    />
  )
}

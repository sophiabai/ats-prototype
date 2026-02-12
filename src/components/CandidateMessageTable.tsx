import { useState } from 'react'
import { Search, ChevronDown, MoreVertical, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Candidate } from '@/data/candidates'

export interface MessageTableEntry {
  candidate: Candidate
  sentAt: string
  sentBy: string
  sequenceName: string
  jobRequisition?: string
  status: string
  statusColor: string
}

const jobRequisitions = [
  { id: 'req-1', title: 'Senior ML Engineer' },
  { id: 'req-2', title: 'Staff Software Engineer' },
  { id: 'req-3', title: 'Engineering Manager' },
  { id: 'req-4', title: 'Product Designer' },
  { id: 'req-5', title: 'Data Scientist' },
]

interface CandidateMessageTableProps {
  title: string
  entries: MessageTableEntry[]
  emptyIcon?: React.ReactNode
  emptyTitle: string
  emptyDescription: string
  onUpdateJobRequisition?: (candidateId: string, jobTitle: string) => void
}

export function CandidateMessageTable({
  title,
  entries,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  onUpdateJobRequisition,
}: CandidateMessageTableProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  const [jobDialogOpen, setJobDialogOpen] = useState(false)
  const [jobDialogCandidateId, setJobDialogCandidateId] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState('')

  const filteredEntries = entries.filter(entry =>
    entry.candidate.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    entry.candidate.currentCompany.toLowerCase().includes(searchFilter.toLowerCase()) ||
    entry.candidate.currentRole.toLowerCase().includes(searchFilter.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleAllCandidates = () => {
    if (selectedCandidates.size === filteredEntries.length) {
      setSelectedCandidates(new Set())
    } else {
      setSelectedCandidates(new Set(filteredEntries.map(e => e.candidate.id)))
    }
  }

  const handleAddJob = (candidateId: string) => {
    setJobDialogCandidateId(candidateId)
    setSelectedJob('')
    setJobDialogOpen(true)
  }

  const handleConfirmJob = () => {
    if (jobDialogCandidateId && selectedJob) {
      const job = jobRequisitions.find(j => j.id === selectedJob)
      if (job && onUpdateJobRequisition) {
        onUpdateJobRequisition(jobDialogCandidateId, job.title)
      }
    }
    setJobDialogOpen(false)
    setJobDialogCandidateId(null)
    setSelectedJob('')
  }

  return (
    <div className="h-full flex flex-col -m-4 sm:-m-6">
      <div className="flex-1 flex flex-col overflow-hidden p-6">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Badge variant="secondary">{entries.length}</Badge>
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 w-48"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              {emptyIcon || <Mail className="h-12 w-12 text-muted-foreground mx-auto" />}
              <div>
                <p className="text-lg font-medium">{emptyTitle}</p>
                <p className="text-sm text-muted-foreground">{emptyDescription}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-auto outline-1 outline-gray-200 rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCandidates.size === filteredEntries.length && filteredEntries.length > 0}
                      onCheckedChange={toggleAllCandidates}
                    />
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Name
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Current company
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Status
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Job requisition
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Sent
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Sequence
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const { candidate } = entry
                  return (
                    <TableRow key={candidate.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedCandidates.has(candidate.id)}
                          onCheckedChange={() => toggleCandidate(candidate.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(candidate.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{candidate.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.currentRole}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{candidate.currentCompany}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <span className={`w-2 h-2 rounded-full ${entry.statusColor} mr-1.5`}></span>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.jobRequisition ? (
                          <span className="text-sm font-medium">{entry.jobRequisition}</span>
                        ) : (
                          <button
                            onClick={() => handleAddJob(candidate.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            Add job
                          </button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{formatDate(entry.sentAt)}</div>
                          <div className="text-xs text-muted-foreground">by {entry.sentBy}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{entry.sequenceName}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View profile</DropdownMenuItem>
                            <DropdownMenuItem>View sequence</DropdownMenuItem>
                            <DropdownMenuItem>Pause sequence</DropdownMenuItem>
                            <DropdownMenuItem>Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add Job Dialog */}
      <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add job requisition</DialogTitle>
            <DialogDescription>
              Link this candidate to a job requisition.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium mb-2 block">Job requisition</label>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a job..." />
              </SelectTrigger>
              <SelectContent>
                {jobRequisitions.map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJobDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!selectedJob} onClick={handleConfirmJob}>
              Add job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



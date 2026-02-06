import { useState } from 'react'
import { MoreVertical, Mail, Filter, Maximize2, Search, ChevronDown } from 'lucide-react'
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
  TooltipProvider,
} from '@/components/ui/tooltip'
import { candidates } from '@/data/candidates'
import type { Candidate } from '@/data/candidates'
import { CandidateProfilePanel } from '@/components/CandidateProfilePanel'

export function AllCandidates() {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false)

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsProfilePanelOpen(true)
  }

  const handleProfilePanelClose = () => {
    setIsProfilePanelOpen(false)
    setSelectedCandidate(null)
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
    if (selectedCandidates.size === filteredCandidates.length) {
      setSelectedCandidates(new Set())
    } else {
      setSelectedCandidates(new Set(filteredCandidates.map(c => c.id)))
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  // Filter candidates based on search
  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.currentCompany.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.currentRole.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col -m-4 sm:-m-6">
        <div className="flex-1 flex flex-col overflow-hidden p-6 relative">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-6 bg-background">
            <h1 className="text-lg font-semibold">All candidates</h1>
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
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

          {/* Results Table */}
          <div className="overflow-auto outline-1 outline-gray-200 rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0}
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
                      Experience
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => {
                  return (
                    <TableRow
                      key={candidate.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleCandidateClick(candidate)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
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
                          <span className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span>
                          Inactive
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{candidate.yearsOfExperience} years</div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCandidateClick(candidate)}>
                                View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send message</DropdownMenuItem>
                              <DropdownMenuItem>Add to job</DropdownMenuItem>
                              <DropdownMenuItem>Export resume</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Candidate Profile Panel - Overlay */}
          {isProfilePanelOpen && selectedCandidate && (
            <div className="absolute top-0 right-0 bottom-0 w-[450px] overflow-hidden bg-background border-l shadow-2xl transition-all duration-300 ease-in-out z-20">
              <CandidateProfilePanel
                candidate={selectedCandidate}
                onClose={handleProfilePanelClose}
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}


import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { ArrowLeft, MoreVertical, Mail, ArrowRight, Filter, Maximize2, Search, ChevronDown, Plus, AtSign, Users, ArrowLeftToLine, ArrowRightFromLine, Table as TableIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { searchCandidates } from '@/lib/candidateSearch'
import type { CandidateEvaluation, SearchCriterion } from '@/lib/candidateSearch'
import { useCandidatePools } from '@/lib/candidatePoolsContext'
import type { Candidate } from '@/data/candidates'
import { CandidateProfilePanel } from '@/components/CandidateProfilePanel'
import { useChatbotPanel } from '@/components/ChatbotPanel'

type FilterStatus = 'all' | 'new' | 'messaged' | 'replied' | 'interviewing' | 'hired' | 'rejected' | 'not_interested' | 'no_reply'

const filterTabs: { id: FilterStatus; label: string; count?: number }[] = [
  { id: 'new', label: 'New prospects' },
  { id: 'messaged', label: 'Messaged' },
  { id: 'replied', label: 'Replied' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'not_interested', label: 'Not interested' },
  { id: 'no_reply', label: 'No reply' },
]

export function CandidateSearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addPool, pools } = useCandidatePools()
  const { isOpen: isAIAssistantOpen } = useChatbotPanel()
  const query = searchParams.get('q') || ''
  const poolId = searchParams.get('poolId')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<CandidateEvaluation[]>([])
  const [criteria, setCriteria] = useState<SearchCriterion[]>([])
  const [title, setTitle] = useState<string>('')
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('new')
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set(['pool']))
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(['email', 'phone', 'lastInteraction', 'feedback', 'lastApplication']))
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false)
  const [visibleTabsCount, setVisibleTabsCount] = useState(filterTabs.length)
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  
  // Ref to track queries that have had pools added (prevents duplicate additions in StrictMode)
  const addedPoolsRef = useRef<Set<string>>(new Set())

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsProfilePanelOpen(true)
    setIsPanelCollapsed(true) // Auto-collapse search criteria panel
  }

  const handleProfilePanelClose = () => {
    setIsProfilePanelOpen(false)
    setSelectedCandidate(null)
  }

  const toggleSource = (source: string) => {
    setSelectedSources(prev => {
      const newSet = new Set(prev)
      if (newSet.has(source)) {
        newSet.delete(source)
      } else {
        newSet.add(source)
      }
      return newSet
    })
  }

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(column)) {
        newSet.delete(column)
      } else {
        newSet.add(column)
      }
      return newSet
    })
  }

  // Criteria colors for the left border
  const criteriaColors = [
    'border-red-400',
    'border-orange-400', 
    'border-amber-400',
    'border-yellow-400',
    'border-lime-400',
    'border-green-400',
    'border-emerald-400',
    'border-teal-400',
  ]

  useEffect(() => {
    if (!query) {
      navigate('/candidates')
      return
    }

    const performSearch = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const searchResult = await searchCandidates(query)
        setResults(searchResult.evaluations)
        setCriteria(searchResult.criteria)
        setTitle(searchResult.title)

        // Add to candidate pools if this is a new search (no poolId)
        // Use ref to prevent duplicate additions in StrictMode
        if (!poolId && !addedPoolsRef.current.has(query)) {
          // Check if this query already exists in pools
          const existingPool = pools.find(p => p.query === query)
          if (!existingPool) {
            // Mark as added BEFORE calling addPool to prevent race conditions
            addedPoolsRef.current.add(query)
            
            const truncatedTitle = searchResult.title.length > 30 
              ? searchResult.title.substring(0, 27) + '...'
              : searchResult.title
            const newPoolId = addPool({
              title: truncatedTitle,
              query: query,
              resultCount: searchResult.evaluations.length,
            })
            // Update URL with pool ID without triggering a re-search
            setSearchParams({ q: query, poolId: newPoolId }, { replace: true })
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, navigate, poolId, addPool, pools, setSearchParams])

  // Calculate visible tabs based on available width
  const calculateVisibleTabs = useCallback(() => {
    if (!tabsContainerRef.current || !actionsRef.current) return

    const containerWidth = tabsContainerRef.current.offsetWidth
    const actionsWidth = actionsRef.current.offsetWidth
    const moreButtonWidth = 80 // Approximate width for "X more..." button
    const availableWidth = containerWidth - actionsWidth - 16 // 16px gap

    // Get approximate widths for each tab (we'll measure them)
    const tabWidths = filterTabs.map(tab => {
      // Estimate: base padding (24px) + text width (~8px per char) + count badge if applicable
      const textWidth = tab.label.length * 8
      const badgeWidth = (tab.id === 'new' || tab.id === 'replied') ? 30 : 0
      return 24 + textWidth + badgeWidth + 8 // 8px gap between tabs
    })

    let totalWidth = 0
    let count = 0
    
    for (let i = 0; i < tabWidths.length; i++) {
      const newTotal = totalWidth + tabWidths[i]
      // If adding this tab would exceed available width (accounting for "more" button if needed)
      if (newTotal > availableWidth - (i < tabWidths.length - 1 ? moreButtonWidth : 0)) {
        break
      }
      totalWidth = newTotal
      count++
    }

    // Ensure at least 1 tab is visible
    setVisibleTabsCount(Math.max(1, count))
  }, [])

  useEffect(() => {
    calculateVisibleTabs()
    
    const handleResize = () => {
      calculateVisibleTabs()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateVisibleTabs, isPanelCollapsed])

  // Auto-collapse search criteria when AI assistant opens
  useEffect(() => {
    if (isAIAssistantOpen) {
      setIsPanelCollapsed(true)
    }
  }, [isAIAssistantOpen])

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
    if (selectedCandidates.size === results.length) {
      setSelectedCandidates(new Set())
    } else {
      setSelectedCandidates(new Set(results.map(r => r.candidate.id)))
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const getLastActivity = (id: string) => {
    return {
      text: '2x contacted',
      detail: id.includes('002') ? 'ML Eng Outreach' : '2 yr ago',
    }
  }

  // Filter results based on search
  const filteredResults = results.filter(r => 
    r.candidate.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.candidate.currentCompany.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.candidate.currentRole.toLowerCase().includes(searchFilter.toLowerCase())
  )

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <p className="text-lg font-medium">Analyzing candidates...</p>
            <p className="text-sm text-muted-foreground">Breaking down your search into criteria and evaluating candidates</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-destructive">Search failed</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/candidates')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col -m-4 sm:-m-6">
        {/* Content Area with Sidebar */}
        <div className="flex flex-row flex-1 overflow-hidden p-0 gap-0">
          {/* Left Sidebar */}
          <div 
            className={`border-r bg-background overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0 ${
              isPanelCollapsed ? 'w-0 border-r-0' : 'w-sm'
            }`}
          >
            <div className={`h-full overflow-y-auto transition-opacity duration-300 ${
              isPanelCollapsed ? 'opacity-0 w-0 pointer-events-none' : 'opacity-100 p-6'
            }`}>
              {/* Search Criteria Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold whitespace-nowrap">Search criteria</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => setIsPanelCollapsed(true)}
                >
                  <ArrowLeftToLine className="h-4 w-4" />
                </Button>
              </div>

            {/* Query Text Area */}
            <div className="mb-4">
              <div className="relative border rounded-lg">
                <Textarea
                  value={query}
                  readOnly
                  className="min-h-[160px] resize-none border-0 focus-visible:ring-0 text-sm pr-10"
                />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <AtSign className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button size="icon" className="h-7 w-7 rounded-md">
                    <ArrowRight className="w-3 h-3 rotate-[-90deg]" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Individual Criteria with colored borders */}
            <div className="mb-4">
              {criteria.map((c, idx) => (
                <div 
                  key={c.id} 
                  className={`pl-3 py-2 border-l-4 bg-muted/30 rounded-r-md ${criteriaColors[idx % criteriaColors.length]}`}
                >
                  <p className="text-sm">{c.description}</p>
                </div>
              ))}
            </div>

            {/* Add Criteria Button */}
            <div className="mb-6">
              <Button variant="ghost" size="sm" className="text-sm h-8 px-2">
                <Plus className="w-4 h-4 mr-1" />
                Add criteria
              </Button>
            </div>

            {/* Sources Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Sources</h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedSources.has('pool') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleSource('pool')}
                >
                  <Users className="w-3 h-3 mr-1" />
                  Candidate pool
                </Badge>
                <Badge
                  variant={selectedSources.has('gem') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleSource('gem')}
                >
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Gem
                </Badge>
                <Badge
                  variant={selectedSources.has('linkedin') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleSource('linkedin')}
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Badge>
              </div>
            </div>

            {/* Show Columns Section */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Show columns</h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedColumns.has('email') ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleColumn('email')}
                >
                  Email
                </Badge>
                <Badge
                  variant={selectedColumns.has('phone') ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleColumn('phone')}
                >
                  Phone number
                </Badge>
                <Badge
                  variant={selectedColumns.has('lastInteraction') ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleColumn('lastInteraction')}
                >
                  Last interaction
                </Badge>
                <Badge
                  variant={selectedColumns.has('feedback') ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleColumn('feedback')}
                >
                  Past interview feedback
                </Badge>
                <Badge
                  variant={selectedColumns.has('lastApplication') ? 'secondary' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleColumn('lastApplication')}
                >
                  Last application
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </Badge>
              </div>
            </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden p-8 relative">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8 bg-background">
              {isPanelCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setIsPanelCollapsed(false)}
                    >
                      <ArrowRightFromLine className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Show search criteria</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <h1 className="text-lg font-semibold">{title || query}</h1>
            </div>

            {/* Filter Tabs */}
            <div ref={tabsContainerRef} className="flex items-center mb-8 w-full gap-4">
              <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as FilterStatus)} className="flex-shrink min-w-0">
                <TabsList ref={tabsRef} className="h-auto p-1 bg-transparent flex-wrap">
                  {filterTabs.slice(0, visibleTabsCount).map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-3 py-1 text-sm whitespace-nowrap"
                    >
                      {tab.label}
                      {tab.id === 'new' && (
                        <span className="ml-1.5 bg-primary-foreground/20 text-current rounded-full px-1.5 text-xs">
                          {results.length}
                        </span>
                      )}
                      {tab.id === 'replied' && (
                        <span className="ml-1.5 bg-primary-foreground/20 text-current rounded-full px-1.5 text-xs">
                          2
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                  {visibleTabsCount < filterTabs.length && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant={filterTabs.slice(visibleTabsCount).some(t => t.id === activeFilter) ? "default" : "ghost"} 
                          size="sm" 
                          className="rounded-full px-3 py-1 text-sm h-auto"
                        >
                          <TableIcon className="h-3.5 w-3.5 mr-1" />
                          {filterTabs.length - visibleTabsCount} more...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {filterTabs.slice(visibleTabsCount).map((tab) => (
                          <DropdownMenuItem
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={activeFilter === tab.id ? 'bg-accent' : ''}
                          >
                            {tab.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TabsList>
              </Tabs>
              <div ref={actionsRef} className="flex items-center gap-2 ml-auto flex-shrink-0">
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
                        checked={selectedCandidates.size === filteredResults.length && filteredResults.length > 0}
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
                        Criteria
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Last activity
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((evaluation) => {
                    const { candidate, metCount, criteriaResults } = evaluation
                    const activity = getLastActivity(candidate.id)
                    
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
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="cursor-help">
                                {metCount} met
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-sm">
                              <div className="space-y-2">
                                <p className="font-medium text-sm">Criteria Evaluation</p>
                                {criteriaResults.map((result) => (
                                  <div key={result.criterion.id} className="flex items-start gap-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                      result.met ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {result.met ? '✓' : '✗'}
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium">{result.criterion.description}</p>
                                      <p className="text-xs text-muted-foreground">{result.reason}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{activity.text}</div>
                            <div className="text-xs text-muted-foreground">
                              {activity.detail}
                            </div>
                          </div>
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
              
              {/* Search More Button - inside scrollable area */}
              <div className="px-2 py-3 outline-1 outline-gray-200">
                <Button variant="ghost" className="gap-2">
                  Search more candidates
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Candidate Profile Panel - Overlay covering entire main content */}
            {isProfilePanelOpen && selectedCandidate && (
              <div className="absolute top-0 right-0 bottom-0 w-[450px] overflow-hidden bg-background border-l shadow-2xl transition-all duration-300 ease-in-out z-20">
                <CandidateProfilePanel
                  candidate={selectedCandidate}
                  onClose={handleProfilePanelClose}
                  searchCriteria={criteria.map(c => c.description)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}


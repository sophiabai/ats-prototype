import { Users, Gem, FileSpreadsheet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SearchInput } from '@/components/ui/search-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCandidatePools } from '@/lib/candidatePoolsContext'

type SourceType = 'pool' | 'gem' | 'linkedin'

export function Candidates() {
  const navigate = useNavigate()
  const { pools } = useCandidatePools()
  const [selectedSources, setSelectedSources] = useState<SourceType[]>(['pool'])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/candidates/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleSource = (source: SourceType) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    )
  }

  const handlePoolClick = (poolId: string, query: string) => {
    navigate(`/candidates/search?q=${encodeURIComponent(query)}&poolId=${poolId}`)
  }

  return (
    <div className="h-full flex flex-col px-6 py-8 overflow-auto">
      {/* Centered Group with Left-Aligned Content */}
      <div className="flex justify-center">
        <div className="w-min max-w-4xl flex flex-col gap-4">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Find your next talent</h1>
          </div>
          
          {/* Source Selection Badges */}
          <div className="flex gap-1.5">
            <Badge
              variant={selectedSources.includes('pool') ? 'default' : 'outline'}
              onClick={() => toggleSource('pool')}
              className="cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Candidate pool
            </Badge>
            <Badge
              variant={selectedSources.includes('gem') ? 'default' : 'outline'}
              onClick={() => toggleSource('gem')}
              className="cursor-pointer"
            >
              <Gem className="w-4 h-4" />
              Gem
            </Badge>
            <Badge
              variant={selectedSources.includes('linkedin') ? 'default' : 'outline'}
              onClick={() => toggleSource('linkedin')}
              className="cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Badge>
          </div>

          {/* Search Input Area */}
            <SearchInput 
              placeholder="What type of candidates are you looking for?"
              minHeight="200px"
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              className="w-lg"
              />

          {/* Start from CSV */}
          <button className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            <FileSpreadsheet className="w-4 h-4" />
            Start from CSV
          </button>
        </div>
      </div>

      {/* Candidate Pools Cards */}
      <div className="flex justify-center mt-12">
        <div className="w-full max-w-4xl">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Candidate pool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <Card 
                key={pool.id}
                className="cursor-pointer hover:shadow-md transition-shadow py-3 gap-3"
                onClick={() => handlePoolClick(pool.id, pool.query)}
              >
                <CardHeader className="px-4 gap-1.5">
                  <CardTitle className="text-base leading-tight">{pool.title}</CardTitle>
                  <CardDescription>{pool.resultCount.toLocaleString()} records</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

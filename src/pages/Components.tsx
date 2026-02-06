import { useState } from 'react'
import { CandidatePipelineTabs } from '@/components/CandidatePipelineTabs'
import type { FilterStatus } from '@/components/CandidatePipelineTabs'

export function Components() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('new')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Components</h1>
        <p className="text-sm text-muted-foreground">
          Reusable UI components used across the application.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Candidate Pipeline Tabs</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Responsive tab bar that collapses overflow items into a dropdown. Resize the window to see the responsive behavior.
          </p>
        </div>

        <CandidatePipelineTabs
          value={activeFilter}
          onValueChange={setActiveFilter}
          counts={{ new: 24, replied: 2 }}
        />

        <p className="text-sm text-muted-foreground">
          Active tab: <span className="font-medium text-foreground">{activeFilter}</span>
        </p>
      </div>
    </div>
  )
}


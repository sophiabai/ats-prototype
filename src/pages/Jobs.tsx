import { Briefcase, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Jobs() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Briefcase className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">No jobs yet</h2>
        <p className="text-muted-foreground max-w-md">
          Create your first job posting to start attracting candidates
        </p>
      </div>
      <Button>
        <Plus className="w-4 h-4" />
        Create Job
      </Button>
    </div>
  )
}


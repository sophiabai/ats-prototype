import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Interviews() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">No Interviews Scheduled</h2>
        <p className="text-muted-foreground max-w-md">
          Schedule your first interview to start evaluating candidates
        </p>
      </div>
      <Button>
        <Plus className="w-4 h-4" />
        Schedule Interview
      </Button>
    </div>
  )
}


import { BarChart3, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Analytics() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <BarChart3 className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">No Analytics Data</h2>
        <p className="text-muted-foreground max-w-md">
          Analytics and insights will appear here once you have recruitment activity
        </p>
      </div>
      <Button variant="outline">
        <TrendingUp className="w-4 h-4" />
        View Sample Report
      </Button>
    </div>
  )
}


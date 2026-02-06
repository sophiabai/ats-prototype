import { LayoutDashboard } from 'lucide-react'

export function Overview() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
        <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Dashboard overview</h2>
        <p className="text-muted-foreground max-w-md">
          Your recruitment dashboard will display key metrics and insights here
        </p>
      </div>
    </div>
  )
}


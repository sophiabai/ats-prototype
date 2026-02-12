import { useState } from "react"
import {
  Search,
  UserSearch,
  Users,
  MessageSquare,
  GraduationCap,
  Clock,
  CalendarDays,
  Shield,
  DollarSign,
  Monitor,
  TrendingUp,
  ArrowRight,
  Heart,
  Palmtree,
  AlertTriangle,
  FileText,
  BarChart3,
  type LucideIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface AppCategory {
  id: string
  label: string
  icon: LucideIcon
}

const appCategories: AppCategory[] = [
  { id: "recruiting", label: "Recruiting", icon: UserSearch },
  { id: "one-on-one", label: "1:1", icon: Users },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "learning", label: "Learning Management", icon: GraduationCap },
  { id: "time", label: "Time & Attendance", icon: Clock },
  { id: "scheduling", label: "Scheduling", icon: CalendarDays },
  { id: "benefits", label: "Benefits", icon: Shield },
  { id: "payroll", label: "Payroll", icon: DollarSign },
  { id: "it-devices", label: "IT & Devices", icon: Monitor },
  { id: "performance", label: "Performance", icon: TrendingUp },
]

interface WidgetDef {
  id: string
  title: string
  description: string
  size: "small" | "medium" | "large"
  appId: string
  preview: () => React.ReactNode
}

const widgetDefinitions: WidgetDef[] = [
  {
    id: "new-applications",
    title: "New Applications",
    description: "Recent candidate applications for open roles",
    size: "large",
    appId: "recruiting",
    preview: () => (
      <div className="flex flex-col gap-2">
        {["John D.", "Lisa W.", "Mark R."].map((name, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs font-medium">{name}</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "stuck-candidates",
    title: "Stuck Candidates",
    description: "Candidates stuck in pipeline stages too long",
    size: "medium",
    appId: "recruiting",
    preview: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs">John D.</span>
          <Badge variant="secondary" className="text-[10px] h-5">7 days</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Lisa W.</span>
          <Badge variant="secondary" className="text-[10px] h-5">6 days</Badge>
        </div>
      </div>
    ),
  },
  {
    id: "interview-schedule",
    title: "Interview Schedule",
    description: "Today's upcoming interview schedule",
    size: "medium",
    appId: "scheduling",
    preview: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">10:00 AM</span>
          <span className="text-xs font-medium">John D. - Panel</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">11:30 AM</span>
          <span className="text-xs font-medium">Lisa W. - Hiring Mgr</span>
        </div>
      </div>
    ),
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Frequently used shortcuts and actions",
    size: "small",
    appId: "recruiting",
    preview: () => (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-primary flex items-center gap-1">View paystub <ArrowRight className="size-2.5" /></span>
        <span className="text-xs text-primary flex items-center gap-1">Request time off <ArrowRight className="size-2.5" /></span>
      </div>
    ),
  },
  {
    id: "approvals",
    title: "Approvals",
    description: "Pending approval requests requiring your action",
    size: "small",
    appId: "recruiting",
    preview: () => (
      <div className="flex flex-col items-start gap-1">
        <span className="text-2xl font-bold">5</span>
        <span className="text-xs text-muted-foreground">pending requests</span>
      </div>
    ),
  },
  {
    id: "work-queue",
    title: "Work Queue",
    description: "Action items and tasks requiring your attention",
    size: "large",
    appId: "time",
    preview: () => (
      <div className="flex flex-col gap-2">
        {[
          { icon: Clock, text: "Submit weekly timecard" },
          { icon: AlertTriangle, text: "Complete benefits enrollment" },
          { icon: FileText, text: "Sign employee handbook" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <item.icon className="size-3 text-muted-foreground shrink-0" />
            <span className="text-xs truncate">{item.text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "kudos",
    title: "Kudos",
    description: "Recent peer recognition and shout-outs",
    size: "medium",
    appId: "feedback",
    preview: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Heart className="size-3 text-pink-500 shrink-0" />
          <span className="text-xs truncate"><strong>Alice</strong> → Jordan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="size-3 text-pink-500 shrink-0" />
          <span className="text-xs truncate"><strong>Priya</strong> → Marcus</span>
        </div>
      </div>
    ),
  },
  {
    id: "pto",
    title: "Out of Office",
    description: "Team members who are out today",
    size: "medium",
    appId: "time",
    preview: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Palmtree className="size-3 text-emerald-500 shrink-0" />
          <span className="text-xs">Jamie Rivera - Vacation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Palmtree className="size-3 text-emerald-500 shrink-0" />
          <span className="text-xs">Morgan Bailey - Personal</span>
        </div>
      </div>
    ),
  },
  {
    id: "feedback-completion",
    title: "Feedback Completion",
    description: "Track overdue interviewer feedback submissions",
    size: "medium",
    appId: "feedback",
    preview: () => (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-amber-600">5 overdue</span>
        <div className="flex items-center justify-between">
          <span className="text-xs">David K.</span>
          <Badge variant="secondary" className="text-[10px] h-5">2 overdue</Badge>
        </div>
      </div>
    ),
  },
  {
    id: "offer-queue",
    title: "Offer Approval Queue",
    description: "Pending offers waiting for approval",
    size: "small",
    appId: "recruiting",
    preview: () => (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-amber-600">2 pending</span>
        <div className="flex items-center justify-between">
          <span className="text-xs">Maria L.</span>
          <span className="text-[10px] text-muted-foreground">$185k</span>
        </div>
      </div>
    ),
  },
  {
    id: "stage-aging",
    title: "Stage Aging Heatmap",
    description: "Average time candidates spend in each stage",
    size: "medium",
    appId: "recruiting",
    preview: () => (
      <div className="flex flex-col gap-1.5">
        {[
          { stage: "Screening", avg: "3.2d", color: "text-green-600" },
          { stage: "Phone", avg: "4.8d", color: "text-amber-600" },
          { stage: "Onsite", avg: "6.1d", color: "text-red-600" },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs">{s.stage}</span>
            <span className={`text-[10px] font-medium ${s.color}`}>{s.avg}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "one-on-one-notes",
    title: "1:1 Notes",
    description: "Upcoming and recent 1:1 meeting notes",
    size: "small",
    appId: "one-on-one",
    preview: () => (
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium">Next: Feb 14</span>
        <span className="text-xs text-muted-foreground">w/ Sarah Chen</span>
        <span className="text-[10px] text-muted-foreground">3 action items</span>
      </div>
    ),
  },
  {
    id: "learning-progress",
    title: "Learning Progress",
    description: "Track your assigned courses and completions",
    size: "small",
    appId: "learning",
    preview: () => (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs">Courses</span>
          <span className="text-xs font-medium">3/5</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted">
          <div className="h-full w-3/5 rounded-full bg-primary" />
        </div>
        <span className="text-[10px] text-muted-foreground">60% complete</span>
      </div>
    ),
  },
  {
    id: "benefits-summary",
    title: "Benefits Summary",
    description: "Overview of your current benefits enrollment",
    size: "small",
    appId: "benefits",
    preview: () => (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Shield className="size-3 text-blue-500" />
          <span className="text-xs">Medical: PPO Gold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="size-3 text-blue-500" />
          <span className="text-xs">Dental: Basic</span>
        </div>
      </div>
    ),
  },
  {
    id: "pipeline-analytics",
    title: "Pipeline Analytics",
    description: "Key recruiting metrics and conversion rates",
    size: "medium",
    appId: "performance",
    preview: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-3 text-primary" />
          <span className="text-xs font-medium">This Week</span>
        </div>
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-sm font-bold">42</div>
            <div className="text-[10px] text-muted-foreground">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold">18</div>
            <div className="text-[10px] text-muted-foreground">Screened</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold">6</div>
            <div className="text-[10px] text-muted-foreground">Offered</div>
          </div>
        </div>
      </div>
    ),
  },
]

interface WidgetLibraryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WidgetLibraryModal({ open, onOpenChange }: WidgetLibraryModalProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWidgets = widgetDefinitions.filter((widget) => {
    const matchesApp = selectedApp ? widget.appId === selectedApp : true
    const matchesSearch = searchQuery
      ? widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesApp && matchesSearch
  })

  const handleAppClick = (appId: string) => {
    setSelectedApp(selectedApp === appId ? null : appId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle>Widget Library</DialogTitle>
            <DialogDescription>
              Browse and add widgets to your dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator />

        {/* Body: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden min-h-[420px]">
          {/* Left Sidebar */}
          <nav className="w-56 border-r overflow-y-auto shrink-0 py-2">
            <button
              onClick={() => setSelectedApp(null)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                selectedApp === null
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <TrendingUp className="size-4 shrink-0" />
              Recommendations
            </button>
            {appCategories.map((app) => {
              const Icon = app.icon
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                    selectedApp === app.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {app.label}
                </button>
              )
            })}
          </nav>

          {/* Right Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium">
                {selectedApp
                  ? appCategories.find((a) => a.id === selectedApp)?.label
                  : "Recommendations"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedApp
                  ? `Widgets from ${appCategories.find((a) => a.id === selectedApp)?.label}`
                  : "Suggested widgets based on your role"}
              </p>
            </div>

            {filteredWidgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="size-8 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No widgets found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term or category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filteredWidgets.map((widget) => (
                  <Card
                    key={widget.id}
                    className="cursor-pointer transition-shadow hover:shadow-md py-0 gap-0 overflow-hidden"
                  >
                    {/* Widget preview area */}
                    <div className="bg-muted/50 p-4 min-h-[100px] flex flex-col justify-center">
                      {widget.preview()}
                    </div>
                    <Separator />
                    <CardHeader className="px-4 py-3 gap-0.5">
                      <CardTitle className="text-xs font-semibold leading-tight">
                        {widget.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 pt-0">
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {widget.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


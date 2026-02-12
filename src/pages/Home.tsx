import { useState, useEffect, useCallback } from "react"
import {
  ArrowRight,
  Heart,
  Palmtree,
  Clock,
  AlertTriangle,
  Monitor,
  FileText,
  GraduationCap,
  Plus,
  Briefcase,
  ChevronRight,
  ClipboardCheck,
  Calendar,
  Database,
  BarChart3,
  Zap,
  Info,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { candidates } from "@/data/candidates"
import { WidgetLibraryModal } from "@/components/WidgetLibraryModal"
import { useChatbotPanel } from "@/components/ChatbotPanel"
import { DEFAULT_FEEDBACK_REMINDER_MESSAGE } from "@/components/SuperAdminPanel"


const pipelineStages = [
  { stage: "Applied", count: 142, color: "bg-blue-500", percentage: 100 },
  { stage: "Screening", count: 86, color: "bg-sky-500", percentage: 60 },
  { stage: "Phone Screen", count: 48, color: "bg-violet-500", percentage: 34 },
  { stage: "Onsite", count: 22, color: "bg-amber-500", percentage: 15 },
  { stage: "Offer", count: 8, color: "bg-emerald-500", percentage: 6 },
  { stage: "Hired", count: 4, color: "bg-green-600", percentage: 3 },
]

const interviewSchedule = [
  { time: "10:00 AM", candidate: "John D.", stage: "Panel", avatar: "JD" },
  { time: "11:30 AM", candidate: "Lisa W.", stage: "Hiring Manager", avatar: "LW" },
  { time: "1:00 PM", candidate: "Amy K.", stage: "Technical", avatar: "AK" },
  { time: "2:30 PM", candidate: "Mark R.", stage: "Culture Fit", avatar: "MR" },
  { time: "3:30 PM", candidate: "Sara T.", stage: "Technical", avatar: "ST" },
  { time: "4:30 PM", candidate: "Dev P.", stage: "Final", avatar: "DP" },
]

const recentApplications = candidates.slice(0, 5)

const workQueueItems = [
  { icon: Clock, title: "Submit weekly timecard", due: "Due Friday", tag: "Payroll", priority: "medium" as const },
  { icon: AlertTriangle, title: "Complete benefits enrollment", due: "5 days left", tag: "Benefits", priority: "high" as const },
  { icon: Monitor, title: "Install required security update", due: "Due today", tag: "IT", priority: "high" as const },
  { icon: FileText, title: "Sign updated employee handbook", due: "Due Feb 1", tag: "Compliance", priority: "low" as const },
  { icon: GraduationCap, title: "Complete anti-harassment training", due: "Due Feb 15", tag: "Learning", priority: "low" as const },
]

const quickActions = [
  { label: "Post a new job", icon: Briefcase },
  { label: "Schedule interview", icon: Calendar },
  { label: "Review applications", icon: ClipboardCheck },
]

const appLinks = [
  { name: "Gong", icon: Zap, color: "bg-violet-100 text-violet-700" },
  { name: "Salesforce", icon: Database, color: "bg-sky-100 text-sky-700" },
  { name: "Tableau", icon: BarChart3, color: "bg-amber-100 text-amber-700" },
  { name: "Confluence", icon: FileText, color: "bg-blue-100 text-blue-700" },
]

const stuckCandidates = [
  { name: "John D.", stage: "Screening", days: 7 },
  { name: "Lisa W.", stage: "Screening", days: 6 },
  { name: "Mark R.", stage: "Phone", days: 5 },
  { name: "Amy K.", stage: "Phone", days: 5 },
]

const feedbackItems = [
  { name: "David K.", overdue: 2 },
  { name: "Sarah M.", overdue: 2 },
  { name: "Chris L.", overdue: 1 },
]

const offerQueue = [
  { name: "Maria L.", role: "Sr. Engineer", salary: "$185k" },
  { name: "James T.", role: "Product Mgr", salary: "$165k" },
]

const stageAging = [
  { stage: "Screening", avgDays: 3.2, status: "good" as const },
  { stage: "Phone Screen", avgDays: 4.8, status: "warning" as const },
  { stage: "Onsite", avgDays: 6.1, status: "critical" as const },
  { stage: "Offer", avgDays: 2.3, status: "good" as const },
]

const kudosList = [
  { from: "Alice Martinez", to: "Jordan Lee", message: "Amazing work on the onboarding revamp!" },
  { from: "Priya Sharma", to: "Marcus Chen", message: "Thanks for staying late to fix the deploy issue 🙏" },
  { from: "Devon Brooks", to: "Sarah Chen", message: "Your mentorship this quarter made a huge difference." },
  { from: "Liam Nguyen", to: "Ava Patel", message: "Loved your presentation at the all-hands!" },
]

const ptoList = [
  { name: "Jamie Rivera", reason: "Vacation", avatar: "JR" },
  { name: "Morgan Bailey", reason: "Personal day", avatar: "MB" },
  { name: "Casey Kim", reason: "Sick leave", avatar: "CK" },
  { name: "Taylor Nguyen", reason: "Vacation", avatar: "TN" },
  { name: "Riley Foster", reason: "Appointment", avatar: "RF" },
]


export function Home() {
  const { openWithFeedbackReminder } = useChatbotPanel()
  const [widgetLibraryOpen, setWidgetLibraryOpen] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  const onSelect = useCallback(() => {
    if (!carouselApi) return
    setCurrentSlide(carouselApi.selectedScrollSnap())
  }, [carouselApi])

  useEffect(() => {
    if (!carouselApi) return
    onSelect()
    carouselApi.on("select", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi, onSelect])

  return (
    <div className="flex flex-col gap-6 overflow-auto bg-muted/30 -m-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning ☀️</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Thursday, February 12 · Senior Recruiter
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setWidgetLibraryOpen(true)}>
          <Plus className="size-4" />
          Add Widget
        </Button>
      </div>

      <WidgetLibraryModal open={widgetLibraryOpen} onOpenChange={setWidgetLibraryOpen} />

      {/* Carousel + Quick Actions / Approvals / Apps Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Applications / Hiring Pipeline / Today's Interviews Carousel */}
        <Card className="overflow-hidden col-span-2">
          <Carousel setApi={setCarouselApi} opts={{ loop: false }}>
            <CarouselContent className="ml-0">
              {/* Slide 1: Recent Applications */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>New Applications</CardTitle>
                  <CardAction>
                    <Button variant="ghost" size="sm">
                      View all
                      <ChevronRight className="size-4" />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {recentApplications.map((candidate, index) => (
                      <div key={candidate.id}>
                        {index > 0 && <Separator className="my-1" />}
                        <div className="flex items-center gap-3 py-2">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">
                              {candidate.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {candidate.currentRole} · {candidate.currentCompany}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant="secondary"
                              className={
                                candidate.fitLevel === "strong"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : candidate.fitLevel === "good"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {candidate.fitLevel}
                            </Badge>
                            <Button variant="ghost" size="icon" className="size-8">
                              <ArrowRight className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CarouselItem>

              {/* Slide 2: Hiring Pipeline */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>Hiring Pipeline</CardTitle>
                  <CardDescription>Current candidate distribution across stages</CardDescription>
                  <CardAction>
                    <Button variant="ghost" size="sm">
                      View all
                      <ChevronRight className="size-4" />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pipelineStages.map((stage) => (
                    <div key={stage.stage} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-28 shrink-0 text-right">
                        {stage.stage}
                      </span>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 relative">
                          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${stage.color} transition-all`}
                              style={{ width: `${stage.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold tabular-nums w-8 text-right">
                          {stage.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CarouselItem>

              {/* Slide 3: Interview Schedule */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>Interview Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-blue-600 mb-4">{interviewSchedule.length} today</p>
                  <div className="space-y-1">
                    {interviewSchedule.slice(0, 4).map((item, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-1" />}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground tabular-nums">{item.time}</span>
                          <Badge variant="secondary">
                            {item.candidate} → {item.stage}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full mt-4">
                    View Calendar
                  </Button>
                </CardContent>
              </CarouselItem>

              {/* Slide 4: Stuck Candidates */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>Stuck Candidates</CardTitle>
                  <CardAction>
                    <Info className="size-4 text-muted-foreground" />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-red-600 mb-4">{stuckCandidates.length} stuck</p>
                  <div className="space-y-1">
                    {stuckCandidates.map((item, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-1" />}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">{item.name} ({item.stage})</span>
                          <Badge
                            variant="secondary"
                            className={
                              item.days >= 7
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }
                          >
                            {item.days} days
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full mt-4">
                    View All
                  </Button>
                </CardContent>
              </CarouselItem>

              {/* Slide 5: Feedback Completion */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>Feedback Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-amber-600 mb-4">{feedbackItems.reduce((a, b) => a + b.overdue, 0)} overdue</p>
                  <div className="space-y-1">
                    {feedbackItems.map((item, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-1" />}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">{item.name}</span>
                          <Badge
                            variant="secondary"
                            className={
                              item.overdue >= 2
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }
                          >
                            {item.overdue} overdue
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full mt-4"
                    onClick={() =>
                      openWithFeedbackReminder({
                        recipients: feedbackItems,
                        draftMessage: DEFAULT_FEEDBACK_REMINDER_MESSAGE,
                      })
                    }
                  >
                    Send Reminders
                  </Button>
                </CardContent>
              </CarouselItem>

              {/* Slide 6: Offer Approval Queue */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>Offer Approval Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-amber-600 mb-4">{offerQueue.length} pending</p>
                  <div className="space-y-1">
                    {offerQueue.map((item, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-1" />}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">{item.name}</span>
                          <Badge variant="secondary">
                            {item.role} — {item.salary}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full mt-4">
                    View Offers
                  </Button>
                </CardContent>
              </CarouselItem>

              {/* Slide 7: Stage Aging Heatmap */}
              <CarouselItem className="pl-0 space-y-4">
                <CardHeader>
                  <CardTitle>Stage Aging Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {stageAging.map((item, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-1" />}
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm">{item.stage}</span>
                          <Badge
                            variant="secondary"
                            className={
                              item.status === "critical"
                                ? "bg-red-50 text-red-700"
                                : item.status === "warning"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }
                          >
                            Avg {item.avgDays} days
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </CarouselItem>
            </CarouselContent>

            {/* Line indicators */}
            <div className="flex justify-center gap-1.5 pb-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <button
                  key={i}
                  onClick={() => carouselApi?.scrollTo(i)}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    currentSlide === i
                      ? "w-6 bg-primary"
                      : "w-4 bg-muted-foreground/25"
                  )}
                />
              ))}
            </div>
          </Carousel>
        </Card>

        {/* Right Column: Apps + Quick Actions & Approvals */}
        <div className="flex flex-col gap-6">
          {/* App Icons */}
          <Card>
            <CardHeader>
              <CardTitle>Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {appLinks.map((app) => (
                  <Button
                    key={app.name}
                    variant="ghost"
                    className="flex flex-col items-center gap-1.5 h-auto py-3"
                  >
                    <div className={cn("size-10 rounded-lg flex items-center justify-center", app.color)}>
                      <app.icon className="size-5" />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{app.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions + Approvals side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {quickActions.map((action, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-1" />}
                      <Button variant="ghost" className="w-full justify-between px-0 h-auto py-2">
                        <span className="text-sm">{action.label}</span>
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Approvals</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div className="text-4xl font-bold">5</div>
                <Button variant="outline" size="sm">
                  View requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Kudos + OOO + Work Queue Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Kudos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-4 text-pink-500" />
              Kudos
            </CardTitle>
            <CardDescription>Recent peer recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {kudosList.map((kudo, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-1" />}
                  <div className="py-2">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="font-medium">{kudo.from}</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span className="font-medium">{kudo.to}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {kudo.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Out of Office */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palmtree className="size-4 text-emerald-500" />
              Out of Office Today
            </CardTitle>
            <CardDescription>{ptoList.length} team members away</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {ptoList.map((person, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-1" />}
                  <div className="flex items-center gap-3 py-2">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px]">{person.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Work Queue</CardTitle>
            <CardDescription>{workQueueItems.length} items need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {workQueueItems.map((item, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-1" />}
                  <div className="flex items-center gap-3 py-2">
                    <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <item.icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.due}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        item.priority === "high"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : item.priority === "medium"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-border"
                      }
                    >
                      {item.tag}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

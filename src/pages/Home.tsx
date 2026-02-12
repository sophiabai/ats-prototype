import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Columns,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const statCards = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "+12.5%",
    trendUp: true,
    description: "Trending up this month",
    subtext: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1,234",
    trend: "-20%",
    trendUp: false,
    description: "Down 20% this period",
    subtext: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    trend: "+12.5%",
    trendUp: true,
    description: "Strong user retention",
    subtext: "Engagement exceed targets",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    trend: "+4.5%",
    trendUp: true,
    description: "Steady performance increase",
    subtext: "Meets growth projections",
  },
]

export function Home() {
  return (
    <div className="h-full flex flex-col gap-3 overflow-auto">
      {/* Stat Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>{stat.title}</CardDescription>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trendUp ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {stat.description}
                {stat.trendUp ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
              </p>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Visitors Chart Section */}
      <Card className="shrink-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Total Visitors</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Total for the last 3 months</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                Last 3 months
              </Button>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Last 30 days
              </Button>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Last 7 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart Placeholder */}
          <div className="h-[200px] sm:h-[280px] w-full flex items-end justify-center gap-0.5 px-2 sm:px-4 pb-8 pt-4 overflow-x-auto">
            {Array.from({ length: 60 }).map((_, i) => {
              const baseHeight = 40
              const wave1 = Math.sin(i * 0.15) * 30
              const wave2 = Math.sin(i * 0.08 + 2) * 20
              const wave3 = Math.cos(i * 0.12) * 15
              const randomness = Math.sin(i * 0.5) * 10
              const height = Math.max(20, baseHeight + wave1 + wave2 + wave3 + randomness + (i > 30 ? 30 : 0))

              return (
                <div
                  key={i}
                  className="flex-1 bg-muted rounded-t-sm min-w-1 max-w-3"
                  style={{ height: `${height}%` }}
                />
              )
            })}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between px-2 sm:px-4 text-xs text-muted-foreground border-t pt-4 overflow-x-auto">
            <span>Apr 3</span>
            <span>Apr 9</span>
            <span>Apr 15</span>
            <span>Apr 21</span>
            <span>Apr 27</span>
            <span>May 3</span>
            <span>May 9</span>
            <span>May 15</span>
            <span>May 21</span>
            <span>May 28</span>
            <span>Jun 3</span>
            <span>Jun 9</span>
            <span>Jun 15</span>
            <span>Jun 21</span>
            <span>Jun 29</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs defaultValue="outline" className="w-full flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="outline" className="text-xs sm:text-sm">Outline</TabsTrigger>
              <TabsTrigger value="past-performance" className="text-xs sm:text-sm">
                Past Performance
                <span className="ml-1.5 flex items-center justify-center size-5 rounded-full bg-muted text-xs">
                  3
                </span>
              </TabsTrigger>
              <TabsTrigger value="key-personnel" className="text-xs sm:text-sm">
                Key Personnel
                <span className="ml-1.5 flex items-center justify-center size-5 rounded-full bg-muted text-xs">
                  2
                </span>
              </TabsTrigger>
              <TabsTrigger value="focus-documents" className="text-xs sm:text-sm">Focus Documents</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm flex-1 sm:flex-initial">
                    <Columns className="size-3 sm:size-4" />
                    <span className="hidden sm:inline">Customize Columns</span>
                    <span className="sm:hidden">Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Header</DropdownMenuItem>
                  <DropdownMenuItem>Section Type</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                  <DropdownMenuItem>Target</DropdownMenuItem>
                  <DropdownMenuItem>Limit</DropdownMenuItem>
                  <DropdownMenuItem>Reviewer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="text-xs sm:text-sm flex-1 sm:flex-initial">
                <Plus className="size-3 sm:size-4" />
                <span className="hidden sm:inline">Add Section</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <TabsContent value="outline" className="mt-4 flex-1 overflow-auto">
            {/* Table Placeholder */}
            <Card className="h-full">
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-[auto_1fr_150px_100px_80px_60px_140px_40px] gap-2 sm:gap-4 px-2 sm:px-4 py-3 border-b bg-muted/30 text-xs sm:text-sm font-medium text-muted-foreground min-w-[800px]">
                  <div className="w-6 sm:w-8" />
                  <div>Header</div>
                  <div className="hidden md:block">Section Type</div>
                  <div>Status</div>
                  <div className="text-center hidden lg:block">Target</div>
                  <div className="text-center hidden lg:block">Limit</div>
                  <div className="hidden md:block">Reviewer</div>
                  <div />
                </div>

                {/* Table Rows */}
                {[
                  { header: "Cover page", type: "Cover page", status: "In Process", target: 18, limit: 5, reviewer: "Eddie Lake" },
                  { header: "Table of contents", type: "Table of contents", status: "Done", target: 29, limit: 24, reviewer: "Eddie Lake" },
                  { header: "Executive summary", type: "Narrative", status: "Done", target: 10, limit: 13, reviewer: "Eddie Lake" },
                  { header: "Technical approach", type: "Narrative", status: "Done", target: 27, limit: 23, reviewer: "Jamik Tashpulatov" },
                ].map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto_1fr_150px_100px_80px_60px_140px_40px] gap-2 sm:gap-4 px-2 sm:px-4 py-3 border-b items-center text-xs sm:text-sm hover:bg-muted/20 transition-colors min-w-[800px]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground cursor-grab hidden sm:block">⠿</div>
                      <input type="checkbox" className="size-4 rounded border-muted-foreground/30" />
                    </div>
                    <div className="font-medium truncate">{row.header}</div>
                    <div className="text-muted-foreground hidden md:block truncate">{row.type}</div>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.status === "Done"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            row.status === "Done" ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                        {row.status}
                      </span>
                    </div>
                    <div className="text-center hidden lg:block">{row.target}</div>
                    <div className="text-center hidden lg:block">{row.limit}</div>
                    <div className="text-muted-foreground hidden md:block truncate">{row.reviewer}</div>
                    <div>
                      <Button variant="ghost" size="icon" className="size-7 sm:size-9">
                        <MoreVertical className="size-3 sm:size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="past-performance" className="mt-4 flex-1 overflow-auto">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Past Performance content placeholder
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="key-personnel" className="mt-4 flex-1 overflow-auto">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Key Personnel content placeholder
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="focus-documents" className="mt-4 flex-1 overflow-auto">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Focus Documents content placeholder
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

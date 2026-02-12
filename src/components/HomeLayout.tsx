import { Outlet, useLocation } from 'react-router'
import {
  UserPlus,
  UserMinus,
  Network,
  Star,
  Clock,
  Heart,
  Coins,
  Award,
  MonitorCog,
  Users,
  Box,
} from 'lucide-react'
import { SiteNav } from './SiteNav'
import { ChatbotPanelProvider, ChatbotPanel } from './ChatbotPanel'
import { CandidatePoolsProvider } from '@/lib/candidatePoolsContext'
import { MessagedCandidatesProvider } from '@/lib/messagedCandidatesContext'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const topNavItems = [
  { icon: UserPlus, label: 'Add Candidate', url: '/candidates' },
  { icon: UserMinus, label: 'Remove Candidate', url: '/candidates/not-interested' },
  { icon: Network, label: 'Organization', url: '/jobs' },
]

const bottomNavItems = [
  { icon: Star, label: 'Favorites', url: '/home' },
  { icon: Clock, label: 'Recent', url: '/home' },
  { icon: Heart, label: 'Saved', url: '/home' },
  { icon: Coins, label: 'Compensation', url: '/home' },
  { icon: Award, label: 'Awards', url: '/home' },
  { icon: MonitorCog, label: 'IT & Devices', url: '/home' },
  { icon: Users, label: 'People', url: '/candidates/all' },
  { icon: Box, label: 'Inventory', url: '/home' },
]

function IconSidebar() {
  const location = useLocation()

  return (
    <aside className="w-14 border-r border-border flex flex-col items-center py-3 gap-1 bg-background shrink-0">
      {/* Top group */}
      <div className="flex flex-col items-center gap-1">
        {topNavItems.map((item) => {
          const isActive = location.pathname === item.url
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <a
                  href={item.url}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Separator */}
      <Separator className="my-2 w-8" />

      {/* Bottom group */}
      <div className="flex flex-col items-center gap-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.url && item.url !== '/home'
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <a
                  href={item.url}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </aside>
  )
}

export function HomeLayout() {
  return (
    <CandidatePoolsProvider>
      <MessagedCandidatesProvider>
        <ChatbotPanelProvider>
          <div className="h-screen flex flex-col w-full overflow-hidden">
            <SiteNav />
            <div className="flex flex-1 overflow-hidden">
              <IconSidebar />

              <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-auto">
                  <div className="h-full p-4 sm:p-6">
                    <Outlet />
                  </div>
                </main>

                <ChatbotPanel />
              </div>
            </div>
          </div>
        </ChatbotPanelProvider>
      </MessagedCandidatesProvider>
    </CandidatePoolsProvider>
  )
}


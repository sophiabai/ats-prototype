import { Outlet, useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Briefcase,
  Calendar,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Trash2,
  X,
  Mail,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SiteNav } from './SiteNav'
import { ChatbotPanelProvider, ChatbotPanel } from './ChatbotPanel'
import { CandidatePoolsProvider, useCandidatePools } from '@/lib/candidatePoolsContext'
import { MessagedCandidatesProvider } from '@/lib/messagedCandidatesContext'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mainNavItems = [
  { title: 'Overview', icon: LayoutDashboard, url: '/' },
  { title: 'Jobs', icon: Briefcase, url: '/jobs' },
  { title: 'Interviews', icon: Calendar, url: '/interviews' },
  { title: 'Analytics', icon: BarChart3, url: '/analytics' },
]

function SidebarNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { pools, removePool } = useCandidatePools()
  
  return (
    <SidebarContent className="pt-4">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Regular nav items */}
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.url || 
                (item.url !== '/' && location.pathname.startsWith(item.url))
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                    <a href={item.url} className="text-gray-800 [&>svg]:text-gray-800">
                      <item.icon className="text-gray-800" />
                      <span className="text-gray-800">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}

            {/* Prospect with nested items */}
            <Collapsible asChild defaultOpen={true} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Prospect" isActive={false}>
                    <Users className="text-gray-800" />
                    <span className="text-gray-800">Prospect</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-gray-800" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {/* Talent pool - collapsible with nested pools */}
                  <SidebarMenuSub>
                    <Collapsible asChild defaultOpen={true} className="group/talent-pool">
                      <SidebarMenuSubItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuSubButton>
                            <span className="text-gray-800">Talent pool</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/talent-pool:rotate-90 text-gray-800" />
                          </SidebarMenuSubButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {/* New Search */}
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <a href="/candidates" className="text-gray-800">
                                  <Plus className="w-4 h-4 text-gray-800" />
                                  <span className="text-gray-800">New search</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                            {/* All Candidates */}
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={location.pathname === '/candidates/all'}
                              >
                                <a href="/candidates/all" className="text-gray-800">
                                  <Users className="w-4 h-4 text-gray-800" />
                                  <span className="text-gray-800">All candidates</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>

                            {/* Pool items */}
                            {(() => {
                              const searchParams = new URLSearchParams(location.search)
                              const currentPoolId = searchParams.get('poolId')
                              const currentQuery = searchParams.get('q')
                              
                              const poolsWithBadge = new Set(['pool-1', 'pool-2', 'pool-3'])
                              
                              return pools.map((pool) => {
                                const isActive = pool.id === currentPoolId || pool.query === currentQuery
                                
                                return (
                                  <SidebarMenuSubItem key={pool.id} className="group/pool-item relative">
                                    <SidebarMenuSubButton 
                                      isActive={isActive}
                                      onClick={() => navigate(`/candidates/search?q=${encodeURIComponent(pool.query)}&poolId=${pool.id}`)}
                                      className="group-hover/pool-item:pr-8"
                                    >
                                      <span className="truncate">{pool.title}</span>
                                      {poolsWithBadge.has(pool.id) && (
                                        <Badge variant="default" className="text-[10px] px-1 py-0.5 h-4 shrink-0 group-hover/pool-item:hidden">10 new</Badge>
                                      )}
                                    </SidebarMenuSubButton>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover/pool-item:opacity-100 hover:bg-sidebar-accent data-[state=open]:opacity-100">
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent side="right" align="start" className="w-48">
                                        <DropdownMenuItem>
                                          <X className="w-4 h-4 mr-2" />
                                          Remove from list
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          className="text-destructive"
                                          onClick={() => removePool(pool.id)}
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </SidebarMenuSubItem>
                                )
                              })
                            })()}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuSubItem>
                    </Collapsible>
                  </SidebarMenuSub>

                  {/* Status items */}
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={location.pathname === '/candidates/messaged'}>
                        <a href="/candidates/messaged" className="text-gray-800">
                          <span className="text-gray-800">Messaged</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={location.pathname === '/candidates/replied'}>
                        <a href="/candidates/replied" className="text-gray-800">
                          <span className="text-gray-800">Replied</span>
                          <Badge variant="default" className="text-[10px] px-1 py-0.5 h-4 shrink-0">3 <Mail className="h-3 w-3" /></Badge>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={location.pathname === '/candidates/interviewing'}>
                        <a href="/candidates/interviewing" className="text-gray-800">
                          <span className="text-gray-800">Interviewing</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={location.pathname === '/candidates/hired-rejected'}>
                        <a href="/candidates/hired-rejected" className="text-gray-800">
                          <span className="text-gray-800">Hired / rejected</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={location.pathname === '/candidates/not-interested'}>
                        <a href="/candidates/not-interested" className="text-gray-800">
                          <span className="text-gray-800">Not interested / no response</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export function Layout() {
  return (
    <CandidatePoolsProvider>
      <MessagedCandidatesProvider>
      <ChatbotPanelProvider>
        <div className="h-screen flex flex-col w-full overflow-hidden">
          <SiteNav />
          <SidebarProvider>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar>
                <SidebarNav />
              </Sidebar>

              <div className="flex flex-1 overflow-hidden">
                <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-transparent">
                  <main className="flex-1 overflow-auto">
                    <div className="h-full p-4 sm:p-6">
                      <Outlet />
                    </div>
                  </main>
                </SidebarInset>

                <ChatbotPanel />
              </div>
            </div>
          </SidebarProvider>
        </div>
      </ChatbotPanelProvider>
      </MessagedCandidatesProvider>
    </CandidatePoolsProvider>
  )
}

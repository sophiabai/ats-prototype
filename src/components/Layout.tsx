import { Outlet, useLocation, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Briefcase,
  Calendar,
  ChevronRight,
  Plus,
  Send,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Trash2,
  FolderPlus,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SiteNav } from './SiteNav'
import { ChatbotPanelProvider, ChatbotPanel } from './ChatbotPanel'
import { CandidatePoolsProvider, useCandidatePools } from '@/lib/candidatePoolsContext'
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
  const { pools, projects, removePool, addPoolToProject } = useCandidatePools()
  
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

            {/* Candidates with nested items - under Analytics */}
            <Collapsible asChild defaultOpen={true} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Candidates" isActive={false}>
                    <Users className="text-gray-800" />
                    <span className="text-gray-800">Candidates</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-gray-800" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* Outreach */}
                    <SidebarMenuSubItem className="mt-2">
                      <SidebarMenuSubButton asChild>
                        <a href="/candidates/outreach" className="text-gray-800">
                          <Send className="w-4 h-4 text-gray-800" />
                          <span className="text-gray-800">Outreach</span>
                          <Badge variant="default" className="text-[10px] px-1 py-0.5 h-4 -ml-1">3 new</Badge>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {/* New Search */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild 
                        isActive={location.pathname === '/candidates'}
                      >
                        <a href="/candidates" className="text-gray-800">
                          <Plus className="w-4 h-4 text-gray-800" />
                          <span className="text-gray-800">New search</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>

                  {/* Projects Section - nested under Candidates */}
                  <SidebarMenuSub className="mt-4">
                    {/* Section Label */}
                    <SidebarMenuSubItem>
                      <div className="px-2 py-1.5 text-xs font-medium text-gray-800/70">
                        Projects
                      </div>
                    </SidebarMenuSubItem>

                    {/* New Project */}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <Folder className="w-4 h-4 text-gray-800" />
                        <span>New project</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>

                    {projects.map((project) => (
                      <Collapsible key={project.id} asChild className="group/collapsible">
                        <SidebarMenuSubItem>
                          {project.children && project.children.length > 0 ? (
                            <>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuSubButton>
                                  {project.icon === 'folder-open' ? (
                                    <FolderOpen className="w-4 h-4" />
                                  ) : (
                                    <Folder className="w-4 h-4" />
                                  )}
                                  <span className="truncate">{project.name}</span>
                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuSubButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {project.children.map((child) => (
                                    <SidebarMenuSubItem key={child.id} className="group/child-item relative">
                                      <SidebarMenuSubButton className="pr-8">
                                        <span className="truncate">{child.name}</span>
                                      </SidebarMenuSubButton>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover/child-item:opacity-100 hover:bg-sidebar-accent data-[state=open]:opacity-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                          </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="right" align="start" className="w-48">
                                          <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                              <FolderPlus className="w-4 h-4 mr-2" />
                                              Move to project
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                              {projects.map((proj) => (
                                                <DropdownMenuItem key={proj.id}>
                                                  <Folder className="w-4 h-4 mr-2" />
                                                  {proj.name}
                                                </DropdownMenuItem>
                                              ))}
                                            </DropdownMenuSubContent>
                                          </DropdownMenuSub>
                                          <DropdownMenuItem>
                                            <X className="w-4 h-4 mr-2" />
                                            Remove from project
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </>
                          ) : (
                            <SidebarMenuSubButton>
                              <Folder className="w-4 h-4" />
                              <span className="truncate">{project.name}</span>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      </Collapsible>
                    ))}
                  </SidebarMenuSub>

                  {/* Candidate Pool Section - nested under Candidates */}
                  <SidebarMenuSub className="mt-4">
                    {/* Section Label */}
                    <SidebarMenuSubItem>
                      <div className="px-2 py-1.5 text-xs font-medium text-gray-800/70">
                        Candidate Pool
                      </div>
                    </SidebarMenuSubItem>

                    {(() => {
                      const searchParams = new URLSearchParams(location.search)
                      const currentPoolId = searchParams.get('poolId')
                      const currentQuery = searchParams.get('q')
                      
                      return pools.map((pool) => {
                        const isActive = pool.id === currentPoolId || pool.query === currentQuery
                        
                        return (
                        <SidebarMenuSubItem key={pool.id} className="group/pool-item relative">
                          <SidebarMenuSubButton 
                            isActive={isActive}
                            onClick={() => navigate(`/candidates/search?q=${encodeURIComponent(pool.query)}&poolId=${pool.id}`)}
                            className="pr-8"
                          >
                            <span className="truncate">{pool.title}</span>
                          </SidebarMenuSubButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover/pool-item:opacity-100 hover:bg-sidebar-accent data-[state=open]:opacity-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" className="w-48">
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <FolderPlus className="w-4 h-4 mr-2" />
                                  Add to project
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {projects.map((project) => (
                                    <DropdownMenuItem 
                                      key={project.id}
                                      onClick={() => addPoolToProject(pool.id, project.id)}
                                    >
                                      <Folder className="w-4 h-4 mr-2" />
                                      {project.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
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
    </CandidatePoolsProvider>
  )
}

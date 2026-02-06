import { Link, useLocation } from 'react-router'
import { Users, Briefcase, Calendar, FileText, BarChart3, Settings, Inbox, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Inbox, label: 'Inbox', href: '/inbox' },
  { icon: Users, label: 'Prospect', href: '/' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: Calendar, label: 'Interviews', href: '/interviews' },
  { icon: Star, label: 'Talent Pool', href: '/talent-pool' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-56 bg-sidebar border-r border-border flex flex-col">
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-berry text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-berry text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}


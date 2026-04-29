import { Search, Bell, Sparkles } from 'lucide-react'
import icon from '@/assets/rippling-icon.svg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatbotPanel } from './ChatbotPanel'
import { Button } from '@/components/ui/button'

export function SiteNav() {
  const { toggle, isOpen } = useChatbotPanel()

  return (
    <header className="relative flex h-(--top-nav-height) shrink-0 items-center justify-between bg-top-nav px-5">
      <a href="/home" className="flex items-center text-white">
        <img src={icon} alt="Rippling" className="h-5 w-auto brightness-0 invert" />
      </a>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-top-nav-foreground/60" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-9 pl-10 pr-4 rounded-md bg-top-nav-muted text-top-nav-foreground placeholder:text-top-nav-foreground/50 focus:outline-none focus:ring-2 focus:ring-top-nav-foreground/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-top-nav-foreground/80 hover:text-top-nav-foreground hover:bg-top-nav-muted">
          <Bell className="size-5" />
        </Button>

        <button
          onClick={toggle}
          className={`p-2 rounded-md transition-all ${
            isOpen
              ? 'text-white bg-gradient-to-br from-berry-light to-berry shadow-lg shadow-berry/25'
              : 'text-top-nav-foreground/80 hover:text-top-nav-foreground hover:bg-top-nav-muted'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <Avatar className="size-9">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-top-nav-muted text-top-nav-foreground text-sm font-light">A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}


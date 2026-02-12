import { Search, Copy, Bell, Sparkles, ChevronDown, User, Zap } from 'lucide-react'
import acmeLogo from '@/assets/ACME logo.svg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatbotPanel } from './ChatbotPanel'
import { usePersonaMode, PERSONA_LABELS, MODE_LABELS, type Persona, type HomeMode } from '@/lib/personaModeContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function SiteNav() {
  const { toggle, isOpen } = useChatbotPanel()
  const { persona, setPersona, mode, setMode } = usePersonaMode()

  return (
    <nav className="bg-indigo-600 flex items-center px-4 py-3 gap-4 font-light">
      {/* ACME Logo */}
      <a href="/home" className="flex items-center text-white">
        <img src={acmeLogo} alt="ACME" height="28" className="h-7" />
      </a>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-9 pl-10 pr-4 rounded-md bg-indigo-500 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Persona Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 gap-1.5 font-normal">
            <User className="w-4 h-4" />
            <span className="text-sm">{PERSONA_LABELS[persona]}</span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          {(['super_admin', 'recruiting_admin', 'employee', 'manager'] as Persona[]).map((p) => (
            <DropdownMenuItem key={p} onClick={() => setPersona(p)}>
              {PERSONA_LABELS[p]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mode Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 gap-1.5 font-normal">
            <Zap className="w-4 h-4" />
            <span className="text-sm">{MODE_LABELS[mode]}</span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px]">
          {(['default', 'payroll_week', 'security_incident', 'open_enrollment'] as HomeMode[]).map((m) => (
            <DropdownMenuItem key={m} onClick={() => setMode(m)}>
              {MODE_LABELS[m]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right Side Icons */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className={`p-2 rounded-md transition-all ${
            isOpen
              ? 'text-white bg-indigo-500 shadow-lg shadow-indigo-500/25'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Copy className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* User/Company Badge */}
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-indigo-300 text-white text-sm font-light">A</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}


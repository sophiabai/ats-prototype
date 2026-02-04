import { ChevronDown, Search, HelpCircle, Globe, Copy, Bell, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useChatbotPanel } from './ChatbotPanel'

export function SiteNav() {
  const { toggle, isOpen } = useChatbotPanel()

  return (
    <nav className="bg-berry-dark flex items-center px-4 py-3 gap-4 font-light">
      {/* Logo */}
      <div className="flex items-center gap-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.8866 7.99091C2.8866 6.01091 1.88041 4.37455 0 3H4.37113C5.90515 4.17818 6.84536 5.97818 6.84536 7.99091C6.84536 10.0036 5.90515 11.8036 4.37113 12.9818C5.78969 13.5709 6.59794 15.0109 6.59794 17.0727V21H2.63918V17.0727C2.63918 15.1091 1.69897 13.7345 0 12.9818C1.88041 11.6073 2.8866 9.97091 2.8866 7.99091ZM11.4639 7.99091C11.4639 6.01091 10.4577 4.37455 8.57732 3H12.9485C14.4825 4.17818 15.4227 5.97818 15.4227 7.99091C15.4227 10.0036 14.4825 11.8036 12.9485 12.9818C14.367 13.5709 15.1753 15.0109 15.1753 17.0727V21H11.2165V17.0727C11.2165 15.1091 10.2763 13.7345 8.57732 12.9818C10.4577 11.6073 11.4639 9.97091 11.4639 7.99091ZM20.0412 7.99091C20.0412 6.01091 19.0351 4.37455 17.1546 3H21.5258C23.0598 4.17818 24 5.97818 24 7.99091C24 10.0036 23.0598 11.8036 21.5258 12.9818C22.9443 13.5709 23.7526 15.0109 23.7526 17.0727V21H19.7938V17.0727C19.7938 15.1091 18.8536 13.7345 17.1546 12.9818C19.0351 11.6073 20.0412 9.97091 20.0412 7.99091Z" fill="white"/>
        </svg>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/20" />

      {/* Talent Dropdown */}
      <button className="flex items-center gap-1 text-white text-sm font-light hover:text-white/80 transition-colors">
        Talent
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-9 pl-10 pr-4 rounded-md bg-berry text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className={`p-2 rounded-md transition-all ${
            isOpen
              ? 'text-white bg-gradient-to-br from-berry-light to-berry shadow-lg shadow-berry/25'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Globe className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Copy className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* User/Company Badge */}
      <div className="flex items-center gap-2 pl-2 border-l border-white/20">
        <span className="text-white text-sm font-light">ACME</span>
        <Avatar>
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-emerald-500 text-white text-sm font-light">A</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}


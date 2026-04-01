import { type ComponentType } from "react"
import { Grid, Film, Tv, Bookmark } from "lucide-react"
import avatar from "../assets/images/image-avatar.png"

export type Section = "Home" | "Movies" | "TV Series" | "Bookmarks"

const navItems: { label: Section; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { label: "Home",      icon: Grid     },
  { label: "Movies",    icon: Film     },
  { label: "TV Series", icon: Tv       },
  { label: "Bookmarks", icon: Bookmark },
]

interface NavbarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-[#0d1117]
      flex flex-col items-center py-5 gap-2 z-50 border-r border-white/5">

      {/* Logo */}
      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center
        justify-center mb-6">
        <Film size={18} className="text-white" />
      </div>

      {/* Nav items */}
      {navItems.map(({ label, icon: Icon }) => (
        <button
          key={label}
          aria-label={label}
          aria-current={activeSection === label ? "page" : undefined}
          onClick={() => onSectionChange(label)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center
            transition-colors
            ${activeSection === label
              ? "bg-white/10 text-white"
              : "text-white/30 hover:text-white/60"
            }`}
        >
          <Icon size={18} />
        </button>
      ))}

      {/* Avatar */}
      <div className="mt-auto w-9 h-9 rounded-full bg-gray-600
        overflow-hidden border-2 border-white/10">
        <img src={avatar} alt="Profile"
          className="w-full h-full object-cover" />
      </div>

    </aside>
  )
}




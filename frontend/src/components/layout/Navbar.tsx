import { type ComponentType } from "react"
import { Grid, Film, Tv } from "lucide-react"
import type { Section } from "../../types/media"
import NavButton from "./NavButton"
import NavAvatar from "./NavAvatar"

export type { Section }

const navItems: { label: Section; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { label: "Home",      icon: Grid },
  { label: "Movies",    icon: Film },
  { label: "TV Series", icon: Tv   },
]

interface NavbarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  return (
    <>
      {/* ── Mobile & Tablet (< 1024px) : topbar horizontale ── */}
      <header className="lg:hidden flex fixed top-0 left-0 right-0 h-16
        bg-[#161d2f] items-center px-4 sm:px-6 z-50">

        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
          <Film size={16} className="text-white" />
        </div>

        <nav className="flex items-center gap-4 sm:gap-6 mx-auto">
          {navItems.map(({ label, icon }) => (
            <NavButton
              key={label}
              label={label}
              icon={icon}
              isActive={activeSection === label}
              variant="header"
              onSelect={onSectionChange}
            />
          ))}
        </nav>

        <div className="shrink-0 w-8 h-8">
          <NavAvatar border="w-8 h-8 border-2 border-red-500" />
        </div>

      </header>

      {/* ── Desktop (≥ 1024px) : sidebar verticale ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[72px]
        bg-[#161d2f] flex-col items-center py-5 gap-2 z-50
        border-r border-white/5">

        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-6">
          <Film size={18} className="text-white" />
        </div>

        {navItems.map(({ label, icon }) => (
          <NavButton
            key={label}
            label={label}
            icon={icon}
            isActive={activeSection === label}
            variant="sidebar"
            onSelect={onSectionChange}
          />
        ))}

        <div className="mt-auto w-9 h-9">
          <NavAvatar border="w-9 h-9 border-2 border-white/10" />
        </div>

      </aside>
    </>
  )
}




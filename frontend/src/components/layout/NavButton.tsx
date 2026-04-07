import { type ComponentType } from "react"
import type { Section } from "../../types/media"

export interface NavButtonProps {
  label: Section
  icon: ComponentType<{ size?: number; className?: string }>
  isActive: boolean
  variant: 'header' | 'sidebar'
  onSelect: (section: Section) => void
}

export default function NavButton({ label, icon: Icon, isActive, variant, onSelect }: NavButtonProps) {
  return (
    <button
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      onClick={() => onSelect(label)}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
        ${isActive
          ? variant === 'sidebar' ? 'bg-white/10 text-white' : 'text-white'
          : 'text-white/30 hover:text-white/60'
        }`}
    >
      <Icon size={18} />
    </button>
  )
}

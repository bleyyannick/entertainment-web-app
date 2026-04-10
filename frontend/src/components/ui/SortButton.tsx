import type { SortOrder } from "../../hooks/useDateFilter"

interface SortButtonProps {
  sortOrder: SortOrder
  onToggle: () => void
}

export default function SortButton({ sortOrder, onToggle }: SortButtonProps) {

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 bg-[#161d2f] text-white text-sm rounded-lg px-3 py-2 border border-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#fc4747] cursor-pointer transition-colors"
      aria-label={sortOrder === "desc" ? "Trier du plus ancien au plus récent" : "Trier du plus récent au plus ancien"}
    >
      <span>{sortOrder === "desc" ? "↓" : "↑"}</span>
      <span className="hidden sm:inline">
        {sortOrder === "desc" ? "Plus récent" : "Plus ancien"}
      </span>
    </button>
  )
}

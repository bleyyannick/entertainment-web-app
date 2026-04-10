import EmptyState from "./ui/EmptyState"
import ContentLoader from "./ui/ContentLoader"
import ContentError from "./ui/ContentError"
import MediaGrid from "./media/MediaGrid"
import { useMedia } from "../hooks/useMedia"
import type { Section } from "../types/media"
import type { SortOrder } from "../hooks/useFilter"

interface ContentProps {
  query: string
  activeSection: Section
  year?: number
  onYearChange: (year: number | undefined) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
}

const sectionLabel: Record<Section, string> = {
  Home:        "Recommandés",
  Movies:      "Films",
  "TV Series": "Séries",
}

export default function Content({ query, activeSection, year, onYearChange, sortOrder, onSortOrderChange }: ContentProps) {
  const { data: media, isLoading, isError } = useMedia(activeSection, query, year)
  const sortedMedia = media
    ? [...media].sort((a, b) => sortOrder === "desc" ? b.year - a.year : a.year - b.year)
    : []

  if (isLoading) {
    return (
      <main data-testid="content" className="min-h-screen bg-[#0d1117] px-8 pt-4 pb-10">
        <ContentLoader />
      </main>
    )
  }

  if (isError) {
    return (
      <main data-testid="content" className="min-h-screen bg-[#0d1117] px-8 pt-4 pb-10">
        <ContentError />
      </main>
    )
  }

  return (
    <main data-testid="content" className="min-h-screen bg-[#0d1117] px-8 pt-4 pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 data-testid="content-title" className="text-white text-2xl font-semibold">
          {query ? `Résultats pour « ${query} »` : sectionLabel[activeSection]}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 bg-[#161d2f] text-white text-sm rounded-lg px-3 py-2 border border-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-[#fc4747] cursor-pointer transition-colors"
            aria-label={sortOrder === "desc" ? "Trier du plus ancien au plus récent" : "Trier du plus récent au plus ancien"}
          >
            <span>{sortOrder === "desc" ? "↓" : "↑"}</span>
            <span className="hidden sm:inline">
              {sortOrder === "desc" ? "Plus récent" : "Plus ancien"}
            </span>
          </button>
          <select
            value={year ?? ""}
            onChange={e => onYearChange(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-[#161d2f] text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#fc4747] cursor-pointer"
            aria-label="Filtrer par année"
          >
            <option value="">Toutes les années</option>
            {Array.from({ length: 56 }, (_, i) => 2025 - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedMedia.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <MediaGrid media={sortedMedia} />
      )}
    </main>
  )
}


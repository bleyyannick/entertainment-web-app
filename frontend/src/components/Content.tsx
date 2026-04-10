import EmptyState from "./ui/EmptyState"
import ContentLoader from "./ui/ContentLoader"
import ContentError from "./ui/ContentError"
import MediaGrid from "./media/MediaGrid"
import SortButton from "./ui/SortButton"
import YearSelect from "./ui/YearSelect"
import { useMedia } from "../hooks/useMedia"
import { useDateFilter } from "../hooks/useDateFilter"
import type { Section } from "../types/media"

interface ContentProps {
  query: string
  activeSection: Section
}

const sectionLabel: Record<Section, string> = {
  Home:        "Recommandés",
  Movies:      "Films",
  "TV Series": "Séries",
}

export default function Content({ query, activeSection }: ContentProps) {
  const { year, sortOrder, toggleOrder, toggleYear } = useDateFilter()
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
          <SortButton sortOrder={sortOrder} onToggle={toggleOrder} />
          <YearSelect value={year} onChange={toggleYear} />
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


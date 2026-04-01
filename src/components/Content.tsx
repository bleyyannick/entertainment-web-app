import MovieCard from "./MovieCard"
import EmptyState from "./EmptyState"
import TrendingCarousel from "./TrendingCarousel"
import { useMedia } from "../hooks/useMedia"
import type { Section } from "./Navbar"

interface ContentProps {
  query: string
  activeSection: Section
}

const sectionLabel: Record<Section, string> = {
  Home:       "Recommandés",
  Movies:     "Films",
  "TV Series": "Séries",
  Bookmarks:  "Ma liste",
}

export default function Content({ query, activeSection }: ContentProps) {
  const { data: media, isLoading, isError } = useMedia(activeSection, query)

  if (isLoading) {
    return (
      <main data-testid="content" className="min-h-screen bg-[#0d1117] px-8 pt-4 pb-10">
        <div data-testid="content-loading" className="flex items-center justify-center py-24">
          <span className="text-white/30 text-sm animate-pulse">Chargement…</span>
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main data-testid="content" className="min-h-screen bg-[#0d1117] px-8 pt-4 pb-10">
        <div data-testid="content-error" className="flex items-center justify-center py-24">
          <span className="text-red-400 text-sm">Une erreur est survenue lors du chargement.</span>
        </div>
      </main>
    )
  }

  return (
    <main data-testid="content" className="min-h-screen bg-[#0d1117] px-8 pt-4 pb-10">
      {activeSection === "Home" && !query.trim() && media && media.length > 0 && (
        <TrendingCarousel media={media} />
      )}

      <h1 data-testid="content-title" className="text-white text-2xl font-semibold mb-6">
        {query ? `Résultats pour « ${query} »` : sectionLabel[activeSection]}
      </h1>

      {!media || media.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div data-testid="media-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {media.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title}
              year={item.year}
              type={item.category}
              rating={item.rating}
              poster={item.thumbnail}
              isBookmarked={item.isBookmarked}
            />
          ))}
        </div>
      )}
    </main>
  )
}

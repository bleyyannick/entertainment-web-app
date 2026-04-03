import EmptyState from "./ui/EmptyState"
import ContentLoader from "./ui/ContentLoader"
import ContentError from "./ui/ContentError"
import MediaGrid from "./media/MediaGrid"
import { useMedia } from "../hooks/useMedia"
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
  const { data: media, isLoading, isError } = useMedia(activeSection, query)

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
      <h1 data-testid="content-title" className="text-white text-2xl font-semibold mb-6">
        {query ? `Résultats pour « ${query} »` : sectionLabel[activeSection]}
      </h1>

      {!media || media.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <MediaGrid media={media} />
      )}
    </main>
  )
}


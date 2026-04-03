import { SearchX, Search } from "lucide-react"

interface EmptyStateProps {
  query?: string
}

export default function EmptyState({ query }: EmptyStateProps) {
  if (!query) {
    return (
      <div data-testid="empty-state" className="flex flex-col items-center justify-center py-24 text-white/30">
        <Search size={48} className="mb-4" />
        <p className="text-lg font-medium">Recherchez un film ou une série.</p>
        <p className="text-sm mt-1">Utilisez la barre de recherche ci-dessus.</p>
      </div>
    )
  }

  return (
    <div data-testid="empty-state" className="flex flex-col items-center justify-center py-24 text-white/30">
      <SearchX size={48} className="mb-4" />
      <p className="text-lg font-medium">Aucun résultat pour « {query} »</p>
      <p className="text-sm mt-1">Essayez un autre titre ou une autre catégorie.</p>
    </div>
  )
}

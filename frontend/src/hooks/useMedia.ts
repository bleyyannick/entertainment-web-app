import { useQuery } from "@tanstack/react-query"
import { fetchMedia } from "../services/mediaService"
import type { Section } from "../types/media"

const FIVE_MINUTES = 5 * 60 * 1000
const TEN_MINUTES  = 10 * 60 * 1000

export function useMedia(section: Section, query: string) {
  return useQuery({
    queryKey: ["media", section, query],
    queryFn:  () => fetchMedia(section, query),
    enabled:  section !== "Home" || !!query.trim(),
    // Les résultats OMDB sont stables : pas de refetch pendant 5 min pour la même clé
    staleTime: FIVE_MINUTES,
    // Garder le cache 10 min après que le composant se démonte
    // (navigation retour vers une section déjà visitée = 0 appel réseau)
    gcTime: TEN_MINUTES,
  })
}

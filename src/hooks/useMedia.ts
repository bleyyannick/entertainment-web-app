import { useQuery } from "@tanstack/react-query"
import { fetchMedia } from "../services/mediaService"
import type { Section } from "../components/Navbar"

export function useMedia(section: Section, query: string) {
  return useQuery({
    queryKey: ["media", section, query],
    queryFn: () => fetchMedia(section, query),
  })
}

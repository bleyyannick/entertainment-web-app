import type { OmdbSearchResult, Media } from "./types.js"
import { OmdbSearchResponseSchema } from "./types.js"

const OMDB_API_KEY = process.env.OMDB_API_KEY
const OMDB_BASE_URL = "https://www.omdbapi.com"
const DEFAULT_BROWSE_TERM = "the"

function normalizeOmdb(item: OmdbSearchResult, index: number): Media {
  const poster = item.Poster !== "N/A" ? item.Poster : ""
  const year = parseInt(item.Year, 10) || 0
  const category: "Movie" | "TV Series" = item.Type === "series" ? "TV Series" : "Movie"

  return {
    id: index,
    title: item.Title,
    thumbnail: poster,
    year,
    category,
  }
}

export async function searchOmdb(query: string, type?: "movie" | "series", year?: number): Promise<Media[]> {
  if (!OMDB_API_KEY) throw new Error("OMDB_API_KEY is not set")

  const term = query.trim() || DEFAULT_BROWSE_TERM
  const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: term })
  if (type) params.set("type", type)
  if (year) params.set("y", String(year))

  const response = await fetch(`${OMDB_BASE_URL}/?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`OMDb API error: ${response.statusText}`)
  }

  const raw = await response.json()
  const parsed = OmdbSearchResponseSchema.safeParse(raw)

  if (!parsed.success) {
    throw new Error(`Réponse OMDB invalide : ${parsed.error.message}`)
  }

  const data = parsed.data

  if (data.Response === "False") return []

  return (data.Search ?? []).map(normalizeOmdb)
}

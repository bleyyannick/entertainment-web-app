import type { OmdbSearchResult, Media } from "./types.js"
import { OmdbSearchResponseSchema } from "./types.js"

const OMDB_API_KEY = process.env.OMDB_API_KEY
const OMDB_BASE_URL = "https://www.omdbapi.com"
const DEFAULT_BROWSE_TERM = "the"

export class OmdbError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message)
    this.name = "OmdbError"
  }
}

export function normalizeOmdb(item: OmdbSearchResult): Media {
  const poster = item.Poster !== "N/A" ? item.Poster : ""
  const year = parseInt(item.Year, 10) || 0
  const category: "Movie" | "TV Series" = item.Type === "series" ? "TV Series" : "Movie"

  return {
    id: item.imdbID,
    title: item.Title,
    thumbnail: poster,
    year,
    category,
  }
}

async function fetchOmdbResults(term: string, type?: "movie" | "series", year?: number): Promise<OmdbSearchResult[]> {
  if (!OMDB_API_KEY) throw new OmdbError("OMDb API key is not configured.", 500)

  const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: term })
  if (type) params.set("type", type)
  if (year) params.set("y", String(year))

  const response = await fetch(`${OMDB_BASE_URL}/?${params.toString()}`, {
    signal: AbortSignal.timeout(8000),
  })

  if (!response.ok) {
    if (response.status === 401) throw new OmdbError("OMDb API key is invalid.", 500)
    if (response.status === 429) throw new OmdbError("OMDb rate limit exceeded.", 429)
    if (response.status === 503) throw new OmdbError("OMDb service is temporarily unavailable.", 503)
    throw new OmdbError(`OMDb API error: ${response.statusText}`, 502)
  }

  const raw = await response.json()
  const parsed = OmdbSearchResponseSchema.safeParse(raw)

  if (!parsed.success) {
    throw new OmdbError("Unexpected OMDb response format.", 502)
  }

  const data = parsed.data

  if (data.Response === "False") return []

  return data.Search ?? []
}

export async function searchOmdb(query: string, type?: "movie" | "series", year?: number): Promise<Media[]> {
  const term = query.trim() || DEFAULT_BROWSE_TERM
  const results = await fetchOmdbResults(term, type, year)
  return results.map(normalizeOmdb)
}

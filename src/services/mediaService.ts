import type { Section } from "../components/Navbar"

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY as string
const OMDB_BASE_URL = "https://www.omdbapi.com"

export interface Thumbnail {
  small: string
  medium: string
  large: string
}

export interface Media {
  id: number
  title: string
  thumbnail: Thumbnail
  year: number
  category: "Movie" | "TV Series"
  rating: string
  isBookmarked: boolean
  isTrending: boolean
}

interface OmdbSearchResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

interface OmdbSearchResponse {
  Search?: OmdbSearchResult[]
  totalResults?: string
  Response: "True" | "False"
  Error?: string
}

// Terme par défaut utilisé pour la navigation sans recherche explicite
const DEFAULT_BROWSE_TERM = "the"

function normalizeOmdb(item: OmdbSearchResult, index: number): Media {
  const poster = item.Poster !== "N/A" ? item.Poster : ""
  const year = parseInt(item.Year, 10) || 0
  const category: "Movie" | "TV Series" = item.Type === "series" ? "TV Series" : "Movie"

  return {
    id:           index,
    title:        item.Title,
    thumbnail:    { small: poster, medium: poster, large: poster },
    year,
    category,
    rating:       "N/A",
    isBookmarked: false,
    isTrending:   false,
  }
}

async function omdbFetch(searchTerm: string, type?: string): Promise<Media[]> {
  const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: searchTerm })
  if (type) params.set("type", type)

  const response = await fetch(`${OMDB_BASE_URL}/?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`)
  }

  const data = await response.json() as OmdbSearchResponse

  if (data.Response === "False") return []

  return (data.Search ?? []).map(normalizeOmdb)
}

/** Films — s'appelle avec ou sans query. Sans query, affiche du contenu par défaut. */
export async function fetchMovies(query: string): Promise<Media[]> {
  return omdbFetch(query.trim() || DEFAULT_BROWSE_TERM, "movie")
}

/** Séries — s'appelle avec ou sans query. Sans query, affiche du contenu par défaut. */
export async function fetchSeries(query: string): Promise<Media[]> {
  return omdbFetch(query.trim() || DEFAULT_BROWSE_TERM, "series")
}

/** Recherche globale (Home) — nécessite une query, retourne films + séries. */
export async function fetchAll(query: string): Promise<Media[]> {
  if (!query.trim()) return []
  return omdbFetch(query.trim())
}

export async function fetchMedia(section: Section, query: string): Promise<Media[]> {
  if (section === "Bookmarks") return []
  if (section === "Movies")    return fetchMovies(query)
  if (section === "TV Series") return fetchSeries(query)
  return fetchAll(query)
}

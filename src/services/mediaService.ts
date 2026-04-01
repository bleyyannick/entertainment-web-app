import type { Section } from "../components/Navbar"

interface RawThumbnail {
  trending?: { small: string; large: string }
  regular: { small: string; medium: string; large: string }
}

interface RawMedia {
  title: string
  thumbnail: RawThumbnail
  year: number
  category: "Movie" | "TV Series"
  rating: string
  isBookmarked: boolean
  isTrending: boolean
}

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

const BASE_URL = import.meta.env.VITE_API_URL as string
const IS_LOCAL = BASE_URL.endsWith(".json")

function normalize(raw: RawMedia, index: number): Media {
  return {
    id:           index,
    title:        raw.title,
    thumbnail: {
      small:  raw.thumbnail.regular.small,
      medium: raw.thumbnail.regular.medium,
      large:  raw.thumbnail.regular.large,
    },
    year:         raw.year,
    category:     raw.category,
    rating:       raw.rating,
    isBookmarked: raw.isBookmarked,
    isTrending:   raw.isTrending,
  }
}

function buildUrl(section: Section, query: string): string {
  if (IS_LOCAL) return BASE_URL

  const params = new URLSearchParams()
  if (section !== "Home") params.set("section", section)
  if (query.trim())       params.set("q", query)

  const qs = params.toString()
  return qs ? `${BASE_URL}?${qs}` : BASE_URL
}

export async function fetchMedia(section: Section, query: string): Promise<Media[]> {
  const response = await fetch(buildUrl(section, query))

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`)
  }

  const raw: RawMedia[] = await response.json() as RawMedia[]
  let results = raw.map(normalize)

  // Filtrage client uniquement en dev (fallback JSON)
  if (IS_LOCAL) {
    if (section === "Bookmarks") {
      results = results.filter((m) => m.isBookmarked)
    } else if (section !== "Home") {
      results = results.filter((m) =>
        section === "Movies" ? m.category === "Movie" : m.category === "TV Series"
      )
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter((m) => m.title.toLowerCase().includes(q))
    }
  }

  return results
}

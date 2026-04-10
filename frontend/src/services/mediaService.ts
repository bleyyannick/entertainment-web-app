import { MediaSchema } from "../types/media"
import type { Section, Media } from "../types/media"
import { z } from "zod"

export type { Media }

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

async function apiFetch(query: string, type?: "movie" | "series", year?: number): Promise<Media[]> {
  const params = new URLSearchParams({ q: query })
  if (type) params.set("type", type)
  if (year) params.set("year", String(year))

  const response = await fetch(`${API_BASE_URL}/api/search?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`)
  }

  const data = await response.json()
  return z.array(MediaSchema).parse(data)
}

/** Films — s'appelle avec ou sans query. */
export async function fetchMovies(query: string, year?: number): Promise<Media[]> {
  return apiFetch(query, "movie", year)
}

/** Séries — s'appelle avec ou sans query. */
export async function fetchSeries(query: string, year?: number): Promise<Media[]> {
  return apiFetch(query, "series", year)
}

/** Recherche globale (Home) — nécessite une query, retourne films + séries. */
export async function fetchAll(query: string, year?: number): Promise<Media[]> {
  if (!query.trim()) return []
  return apiFetch(query, undefined, year)
}

export async function fetchMedia(section: Section, query: string, year?: number): Promise<Media[]> {
  if (section === "Movies")    return fetchMovies(query, year)
  if (section === "TV Series") return fetchSeries(query, year)
  return fetchAll(query, year)
}

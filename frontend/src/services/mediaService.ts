import { MediaSchema } from "../types/media"
import type { Section, Media } from "../types/media"
import { z } from "zod"

export type { Media }

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

async function apiFetch(query: string, type?: "movie" | "series"): Promise<Media[]> {
  const params = new URLSearchParams({ q: query })
  if (type) params.set("type", type)

  const response = await fetch(`${API_BASE_URL}/api/search?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`)
  }

  const data = await response.json()
  return z.array(MediaSchema).parse(data)
}

/** Films — s'appelle avec ou sans query. */
export async function fetchMovies(query: string): Promise<Media[]> {
  return apiFetch(query, "movie")
}

/** Séries — s'appelle avec ou sans query. */
export async function fetchSeries(query: string): Promise<Media[]> {
  return apiFetch(query, "series")
}

/** Recherche globale (Home) — nécessite une query, retourne films + séries. */
export async function fetchAll(query: string): Promise<Media[]> {
  if (!query.trim()) return []
  return apiFetch(query)
}

export async function fetchMedia(section: Section, query: string): Promise<Media[]> {
  if (section === "Movies")    return fetchMovies(query)
  if (section === "TV Series") return fetchSeries(query)
  return fetchAll(query)
}

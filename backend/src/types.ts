import { z } from "zod"

export const OmdbSearchResultSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Type: z.string(),
  Poster: z.string(),
})

export const OmdbSearchResponseSchema = z.object({
  Response: z.enum(["True", "False"]),
  Search: z.array(OmdbSearchResultSchema).optional(),
  totalResults: z.string().optional(),
  Error: z.string().optional(),
})

export type OmdbSearchResult = z.infer<typeof OmdbSearchResultSchema>
export type OmdbSearchResponse = z.infer<typeof OmdbSearchResponseSchema>

export interface Media {
  id: number
  title: string
  thumbnail: string
  year: number
  category: "Movie" | "TV Series"
}

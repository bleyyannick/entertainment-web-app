export interface OmdbSearchResult {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchResult[]
  totalResults?: string
  Response: "True" | "False"
  Error?: string
}

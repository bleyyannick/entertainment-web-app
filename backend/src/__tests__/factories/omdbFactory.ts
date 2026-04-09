import type { OmdbSearchResult, OmdbSearchResponse } from "../../types.js"

export function createOmdbSearchResult(overrides: Partial<OmdbSearchResult> = {}): OmdbSearchResult {
  return {
    Title: "Inception",
    Year: "2010",
    imdbID: "tt1375666",
    Type: "movie",
    Poster: "https://poster.jpg",
    ...overrides,
  }
}

export function createOmdbSearchResponse(overrides: Partial<OmdbSearchResponse> = {}): OmdbSearchResponse {
  return {
    Response: "True",
    Search: [
      createOmdbSearchResult(),
      createOmdbSearchResult({
        Title: "Breaking Bad",
        Year: "2008",
        imdbID: "tt0903747",
        Type: "series",
        Poster: "N/A",
      }),
    ],
    ...overrides,
  }
}

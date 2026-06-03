import { describe, it, expect } from "vitest"
import { normalizeOmdb } from "../../omdbService.js"
import { createOmdbSearchResult } from "../factories/omdbFactory.js"

describe("normalizeOmdb", () => {
  it("convertit un film OMDB en catégorie 'Movie'", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ Type: "movie" }))
    expect(result.category).toBe("Movie")
  })

  it("convertit une série OMDB en catégorie 'TV Series'", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ Type: "series" }))
    expect(result.category).toBe("TV Series")
  })

  it("remplace un poster 'N/A' par une chaîne vide", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ Poster: "N/A" }))
    expect(result.thumbnail).toBe("")
  })

  it("conserve l'URL du poster quand elle est valide", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ Poster: "https://poster.jpg" }))
    expect(result.thumbnail).toBe("https://poster.jpg")
  })

  it("parse l'année en nombre", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ Year: "2010" }))
    expect(result.year).toBe(2010)
  })

  it("retourne 0 si l'année n'est pas un nombre valide", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ Year: "N/A" }))
    expect(result.year).toBe(0)
  })

  it("utilise l'imdbID comme identifiant stable", () => {
    const result = normalizeOmdb(createOmdbSearchResult({ imdbID: "tt1375666" }))
    expect(result.id).toBe("tt1375666")
  })
})

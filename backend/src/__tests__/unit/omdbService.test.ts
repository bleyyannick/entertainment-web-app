import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createOmdbSearchResponse } from "../factories/omdbFactory.js"

const mockOmdbResponse = createOmdbSearchResponse()

beforeEach(() => {
  process.env.OMDB_API_KEY = "test-api-key"
  vi.resetModules()
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOmdbResponse),
    }),
  )
})

afterEach(() => {
  delete process.env.OMDB_API_KEY
  vi.restoreAllMocks()
})

describe("searchOmdb", () => {
  it("lève une erreur si OMDB_API_KEY n'est pas définie", async () => {
    delete process.env.OMDB_API_KEY
    vi.resetModules()
    const { searchOmdb } = await import("../../omdbService.js")
    await expect(searchOmdb("test")).rejects.toThrow("OMDB_API_KEY is not set")
  })

  it("retourne des résultats même si la query est vide", async () => {
    const { searchOmdb } = await import("../../omdbService.js")
    const result = await searchOmdb("")
    expect(result.length).toBeGreaterThan(0)
  })

  it("retourne des résultats quand une query est fournie", async () => {
    const { searchOmdb } = await import("../../omdbService.js")
    const result = await searchOmdb("inception")
    expect(result.length).toBeGreaterThan(0)
  })

  it("retourne [] si aucun résultat n'est trouvé", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ Response: "False" }),
      }),
    )
    const { searchOmdb } = await import("../../omdbService.js")
    const result = await searchOmdb("aucun-résultat")
    expect(result).toEqual([])
  })

  it("lève une erreur si la requête réseau échoue", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, statusText: "Unauthorized" }),
    )
    const { searchOmdb } = await import("../../omdbService.js")
    await expect(searchOmdb("test")).rejects.toThrow()
  })

  it("convertit les films OMDB en catégorie 'Movie'", async () => {
    const { searchOmdb } = await import("../../omdbService.js")
    const result = await searchOmdb("inception")
    expect(result[0]).toMatchObject({
      title: "Inception",
      year: 2010,
      category: "Movie",
      thumbnail: "https://poster.jpg",
    })
  })

  it("convertit les séries OMDB en catégorie 'TV Series'", async () => {
    const { searchOmdb } = await import("../../omdbService.js")
    const result = await searchOmdb("breaking bad")
    expect(result[1]).toMatchObject({
      title: "Breaking Bad",
      year: 2008,
      category: "TV Series",
      thumbnail: "",
    })
  })

  it("remplace le poster 'N/A' par une chaîne vide", async () => {
    const { searchOmdb } = await import("../../omdbService.js")
    const result = await searchOmdb("test")
    const breaking = result.find((m) => m.title === "Breaking Bad")
    expect(breaking?.thumbnail).toBe("")
  })
})

import { describe, it, expect, vi, beforeEach } from "vitest"
import { fetchMovies, fetchSeries, fetchAll, fetchMedia } from "../../services/mediaService"
import { createMedia } from "../factories/mediaFactory"

const mockMedia = [
  createMedia(),
  createMedia({ id: 1, title: "Breaking Bad", thumbnail: "https://img2.jpg", year: 2008, category: "TV Series" }),
]

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockMedia),
    }),
  )
})

describe("fetchMovies", () => {
  it("retourne les médias renvoyés par l'API", async () => {
    const result = await fetchMovies("inception")
    expect(result).toEqual(mockMedia)
  })

  it("lève une erreur si la réponse réseau échoue", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, statusText: "Not Found" }),
    )
    await expect(fetchMovies("inception")).rejects.toThrow()
  })
})

describe("fetchSeries", () => {
  it("retourne les médias renvoyés par l'API", async () => {
    const result = await fetchSeries("breaking")
    expect(result).toEqual(mockMedia)
  })
})

describe("fetchAll", () => {
  it("retourne [] si la query est vide", async () => {
    const result = await fetchAll("")
    expect(result).toEqual([])
  })

  it("retourne [] si la query ne contient que des espaces", async () => {
    const result = await fetchAll("   ")
    expect(result).toEqual([])
  })

  it("retourne les médias renvoyés par l'API si une query est fournie", async () => {
    const result = await fetchAll("batman")
    expect(result).toEqual(mockMedia)
  })
})

describe("fetchMedia", () => {
  it("retourne des médias pour la section Movies", async () => {
    const result = await fetchMedia("Movies", "test")
    expect(result).toEqual(mockMedia)
  })

  it("retourne des médias pour la section TV Series", async () => {
    const result = await fetchMedia("TV Series", "test")
    expect(result).toEqual(mockMedia)
  })

  it("retourne des médias pour la section Home si une query est fournie", async () => {
    const result = await fetchMedia("Home", "batman")
    expect(result).toEqual(mockMedia)
  })

  it("retourne [] pour la section Home sans query", async () => {
    const result = await fetchMedia("Home", "")
    expect(result).toEqual([])
  })
})

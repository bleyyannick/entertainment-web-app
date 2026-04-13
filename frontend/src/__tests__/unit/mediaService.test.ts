import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { fetchMedia } from "../../services/mediaService"
import { createMedia } from "../factories/mediaFactory"

const mockMedia = [
  createMedia(),
  createMedia({ id: 1, title: "Breaking Bad", thumbnail: "https://img2.jpg", year: 2008, category: "TV Series" }),
]

const mockFetch = vi.fn()

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockMedia),
  })
  vi.stubGlobal("fetch", mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("fetchMedia — contrat du service", () => {
  it("cible le paramètre type=movie et retourne les médias désérialisés", async () => {
    const result = await fetchMedia("Movies", "inception")
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("type=movie")
    expect(url).toContain("q=inception")
    expect(result).toEqual(mockMedia)
  })

  it("cible le paramètre type=series pour la section Séries", async () => {
    await fetchMedia("TV Series", "breaking")
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("type=series")
  })

  it("transmet l'année dans l'URL quand elle est précisée", async () => {
    await fetchMedia("Movies", "batman", 2008)
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("year=2008")
  })

  it("n'émet aucune requête depuis l'accueil sans terme de recherche", async () => {
    const result = await fetchMedia("Home", "")
    expect(mockFetch).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it("émet une requête sans type sur l'accueil quand un terme est saisi", async () => {
    await fetchMedia("Home", "batman")
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).not.toContain("type=")
    expect(url).toContain("q=batman")
  })

  it("lève une erreur si la réponse HTTP n'est pas ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, statusText: "Internal Server Error" })
    await expect(fetchMedia("Movies", "inception")).rejects.toThrow()
  })

  it("lève une erreur si la réponse ne correspond pas au schéma attendu", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ wrong: "shape" }]),
    })
    await expect(fetchMedia("Movies", "inception")).rejects.toThrow()
  })

})

import { beforeEach, describe, expect, it, vi } from "vitest"
import request from "supertest"
import { createApp } from "../../index.js"
import { searchOmdb } from "../../omdbService.js"
import type { Media } from "../../types.js"

vi.mock("../../omdbService.js", () => ({
  searchOmdb: vi.fn(),
}))

const mockedSearchOmdb = vi.mocked(searchOmdb)

beforeEach(() => {
  mockedSearchOmdb.mockReset()
})

describe("API de recherche", () => {
  it("renvoie une liste vide quand aucun filtre n'est fourni", async () => {
    const response = await request(createApp()).get("/api/search")

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
    expect(mockedSearchOmdb).not.toHaveBeenCalled()
  })

  it("refuse un type de media invalide", async () => {
    const response = await request(createApp()).get("/api/search?q=batman&type=documentary")
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: "Invalid type. Must be 'movie' or 'series'.",
    })
    expect(mockedSearchOmdb).not.toHaveBeenCalled()
  })

  it("refuse une annee invalide", async () => {
    const response = await request(createApp()).get("/api/search?q=batman&year=1200")
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: "Invalid year. Must be a valid 4-digit year.",
    })
    expect(mockedSearchOmdb).not.toHaveBeenCalled()
  })

  it("retourne les resultats fournis par le service OMDb", async () => {
    const mockedResults: Media[] = [
      {
        id: 1,
        title: "Inception",
        thumbnail: "https://poster.jpg",
        year: 2010,
        category: "Movie",
      },
    ]
    mockedSearchOmdb.mockResolvedValueOnce(mockedResults)

    const response = await request(createApp())
      .get("/api/search")
      .query({ q: "inception", type: "movie", year: 2010 })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(mockedResults)
    expect(mockedSearchOmdb).toHaveBeenCalledWith("inception", "movie", 2010)
  })

  it("renvoie une erreur 502 quand le service OMDb echoue", async () => {
    mockedSearchOmdb.mockRejectedValueOnce(new Error("OMDb down"))
    const response = await request(createApp()).get("/api/search?q=inception")
    expect(response.status).toBe(502)
    expect(response.body).toEqual({
      error: "Failed to fetch data from OMDb.",
    })
  })
})

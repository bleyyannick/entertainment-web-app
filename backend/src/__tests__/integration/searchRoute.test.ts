import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { once } from "node:events"
import type { Server } from "node:http"
import { createApp } from "../../index.js"
import { searchOmdb } from "../../omdbService.js"
import type { Media } from "../../types.js"

vi.mock("../../omdbService.js", () => ({
  searchOmdb: vi.fn(),
}))

const mockedSearchOmdb = vi.mocked(searchOmdb)

let server: Server
let baseUrl = ""

beforeEach(async () => {
  const app = createApp()
  server = app.listen(0)
  await once(server, "listening")

  const address = server.address()
  if (!address || typeof address === "string") {
    throw new Error("Impossible de recuperer le port du serveur de test")
  }

  baseUrl = `http://127.0.0.1:${address.port}`
  mockedSearchOmdb.mockReset()
})

afterEach(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
})

describe("API de recherche", () => {
  it("renvoie une liste vide quand aucun filtre n'est fourni", async () => {
    const response = await fetch(`${baseUrl}/api/search`)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual([])
    expect(mockedSearchOmdb).not.toHaveBeenCalled()
  })

  it("refuse un type de media invalide", async () => {
    const response = await fetch(`${baseUrl}/api/search?q=batman&type=documentary`)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: "Invalid type. Must be 'movie' or 'series'.",
    })
    expect(mockedSearchOmdb).not.toHaveBeenCalled()
  })

  it("refuse une annee invalide", async () => {
    const response = await fetch(`${baseUrl}/api/search?q=batman&year=1200`)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
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

    const response = await fetch(`${baseUrl}/api/search?q=inception&type=movie&year=2010`)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(mockedResults)
    expect(mockedSearchOmdb).toHaveBeenCalledWith("inception", "movie", 2010)
  })

  it("renvoie une erreur 502 quand le service OMDb echoue", async () => {
    mockedSearchOmdb.mockRejectedValueOnce(new Error("OMDb down"))

    const response = await fetch(`${baseUrl}/api/search?q=inception`)

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch data from OMDb.",
    })
  })
})

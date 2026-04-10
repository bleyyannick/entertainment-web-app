import "dotenv/config"
import express from "express"
import cors from "cors"
import { searchOmdb } from "./omdbService.js"

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }))
app.use(express.json())

const VALID_TYPES = ["movie", "series"] as const
type ValidType = (typeof VALID_TYPES)[number]

app.get("/api/search", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q : ""
  const rawType = req.query.type
  const rawYear = req.query.year

  if (rawType !== undefined && !VALID_TYPES.includes(rawType as ValidType)) {
    res.status(400).json({ error: "Invalid type. Must be 'movie' or 'series'." })
    return
  }

  if (rawYear !== undefined) {
    const yearNum = Number(rawYear)
    if (!Number.isInteger(yearNum) || yearNum < 1888 || yearNum > 2100) {
      res.status(400).json({ error: "Invalid year. Must be a valid 4-digit year." })
      return
    }
  }

  const type = rawType as ValidType | undefined
  const year = rawYear !== undefined ? Number(rawYear) : undefined

  if (!query.trim() && !type) {
    res.json([])
    return
  }

  try {
    const results = await searchOmdb(query, type, year)
    res.json(results)
  } catch (err) {
    console.error(err)
    res.status(502).json({ error: "Failed to fetch data from OMDb." })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

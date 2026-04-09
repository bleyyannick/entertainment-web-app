import { z } from "zod"

export type Section = "Home" | "Movies" | "TV Series"

export const MediaSchema = z.object({
  id: z.number(),
  title: z.string(),
  thumbnail: z.string(),
  year: z.number(),
  category: z.enum(["Movie", "TV Series"]),
})

export type Media = z.infer<typeof MediaSchema>

export type Section = "Home" | "Movies" | "TV Series"

export interface Media {
  id: number
  title: string
  thumbnail: string
  year: number
  category: "Movie" | "TV Series"
}

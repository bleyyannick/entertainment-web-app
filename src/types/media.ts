export type Section = "Home" | "Movies" | "TV Series" | "Bookmarks"

export interface Thumbnail {
  small: string
  medium: string
  large: string
}

export interface Media {
  id: number
  title: string
  thumbnail: Thumbnail
  year: number
  category: "Movie" | "TV Series"
  rating: string
  isBookmarked: boolean
  isTrending: boolean
}

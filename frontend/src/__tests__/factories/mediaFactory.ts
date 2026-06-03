import type { Media } from "../../types/media"

export function createMedia(overrides: Partial<Media> = {}): Media {
  return {
    id: "tt0000000",
    title: "Inception",
    thumbnail: "https://img.jpg",
    year: 2010,
    category: "Movie",
    ...overrides,
  }
}



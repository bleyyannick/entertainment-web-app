import type { Media } from "../../types/media"
import MovieCard from "./MovieCard"

export default function MediaGrid({ media }: { media: Media[] }) {
  return (
    <div data-testid="media-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {media.map((item) => (
        <MovieCard
          key={item.id}
          title={item.title}
          year={item.year}
          type={item.category}
          poster={item.thumbnail}
        />
      ))}
    </div>
  )
}

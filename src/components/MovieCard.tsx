import type { Thumbnail } from '../types/media'
import BookmarkButton from './BookmarkButton'

interface MovieCardProps {
  title: string
  year: number
  type: string
  rating: string
  poster: Thumbnail
  isBookmarked?: boolean
}

function MovieCardPoster({ title, poster, isBookmarked }: Pick<MovieCardProps, 'title' | 'poster' | 'isBookmarked'>) {
  return (
    <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-2">
      <img
        src={poster.large}
        srcSet={`${poster.small} 480w, ${poster.medium} 768w, ${poster.large} 1280w`}
        sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px"
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <BookmarkButton isBookmarked={isBookmarked} />
    </div>
  )
}

function MovieCardMeta({ year, type, rating }: Pick<MovieCardProps, 'year' | 'type' | 'rating'>) {
  return (
    <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
      <span>{year}</span>
      <span>·</span>
      <span>▪</span>
      <span>{type}</span>
      <span>·</span>
      <span>{rating}</span>
    </p>
  )
}

export default function MovieCard({ title, year, type, rating, poster, isBookmarked }: MovieCardProps) {
  return (
    <div data-testid="movie-card" className="group cursor-pointer">
      <MovieCardPoster title={title} poster={poster} isBookmarked={isBookmarked} />
      <MovieCardMeta year={year} type={type} rating={rating} />
      <p className="text-white text-sm font-medium leading-tight">{title}</p>
    </div>
  )
}


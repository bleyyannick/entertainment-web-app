import { Bookmark } from 'lucide-react'
import type { Thumbnail } from '../services/mediaService'

interface MovieCardProps {
  title: string
  year: number
  type: string
  rating: string
  poster: Thumbnail
  isBookmarked?: boolean
}

export default function MovieCard({ title, year, type, rating, poster, isBookmarked }: MovieCardProps) {
  return (
    <div data-testid="movie-card" className="group cursor-pointer">

      {/* Poster */}
      <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-2">
        <img
          src={poster.large}
          srcSet={`${poster.small} 480w, ${poster.medium} 768w, ${poster.large} 1280w`}
          sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px"
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-300"
        />

        {/* Bookmark button — plus grand sur mobile */}
        <button
          data-testid="bookmark-button"
          className={`absolute top-2 right-2
            w-10 h-10 sm:w-8 sm:h-8
            rounded-full bg-white/20 backdrop-blur-sm
            flex items-center justify-center
            hover:bg-white/30 transition-colors
            ${isBookmarked ? 'text-white' : 'text-white/80'}`}
        >
          <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Metadata */}
      <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
        <span>{year}</span>
        <span>·</span>
        <span>▪</span>
        <span>{type}</span>
        <span>·</span>
        <span>{rating}</span>
      </p>

      {/* Title */}
      <p className="text-white text-sm font-medium leading-tight">{title}</p>

    </div>
  )
}


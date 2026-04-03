
interface MovieCardProps {
  title: string
  year: number
  type: string
  poster: string
}

function MovieCardPoster({ title, poster }: Pick<MovieCardProps, 'title' | 'poster'>) {
  return (
    <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-2">
      <img
        src={poster}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  )
}

function MovieCardMeta({ year, type }: Pick<MovieCardProps, 'year' | 'type'>) {
  return (
    <p className="text-white/40 text-xs mb-1 flex items-center gap-1">
      <span>{year}</span>
      <span>·</span>
      <span>▪</span>
      <span>{type}</span>
    </p>
  )
}

export default function MovieCard({ title, year, type, poster }: MovieCardProps) {
  return (
    <div data-testid="movie-card" className="group cursor-pointer">
      <MovieCardPoster title={title} poster={poster} />
      <MovieCardMeta year={year} type={type} />
      <p className="text-white text-sm font-medium leading-tight">{title}</p>
    </div>
  )
}


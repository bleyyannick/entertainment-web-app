import type { Media } from '../types/media'

interface TrendingCardProps {
  item: Media
}

export default function TrendingCard({ item }: TrendingCardProps) {
  return (
    <article
      className="relative shrink-0 w-[280px] sm:w-[360px] aspect-[16/9] rounded-lg overflow-hidden snap-start group"
    >
      <img
        src={item.thumbnail.large}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute left-4 right-4 bottom-4 text-white">
        <p className="text-xs text-white/80 mb-1">
          {item.year} · {item.category} · {item.rating}
        </p>
        <p className="text-lg font-medium leading-tight">{item.title}</p>
      </div>
    </article>
  )
}

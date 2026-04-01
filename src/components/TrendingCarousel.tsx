import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Media } from "../services/mediaService"

interface TrendingCarouselProps {
  media: Media[]
}

export default function TrendingCarousel({ media }: TrendingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trendingItems = media.filter((item) => item.isTrending)

  if (trendingItems.length === 0) return null

  function scrollByOffset(offset: number) {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" })
  }

  return (
    <section data-testid="trending-carousel" className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-2xl font-semibold">Trending</h2>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous trending items"
            onClick={() => scrollByOffset(-380)}
            className="w-9 h-9 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next trending items"
            onClick={() => scrollByOffset(380)}
            className="w-9 h-9 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {trendingItems.map((item) => (
          <article
            key={item.id}
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
        ))}
      </div>
    </section>
  )
}

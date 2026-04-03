import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Media } from "../types/media"
import TrendingCard from "./TrendingCard"

interface TrendingCarouselProps {
  media: Media[]
}

interface CarouselControlsProps {
  onPrev: () => void
  onNext: () => void
}

function CarouselControls({ onPrev, onNext }: CarouselControlsProps) {
  return (
    <div className="hidden sm:flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous trending items"
        onClick={onPrev}
        className="w-9 h-9 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label="Next trending items"
        onClick={onNext}
        className="w-9 h-9 rounded-full bg-white/10 text-white/90 hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
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
        <CarouselControls
          onPrev={() => scrollByOffset(-380)}
          onNext={() => scrollByOffset(380)}
        />
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {trendingItems.map((item) => (
          <TrendingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

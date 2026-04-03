import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
  isBookmarked?: boolean
}

export default function BookmarkButton({ isBookmarked = false }: BookmarkButtonProps) {
  return (
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
  )
}

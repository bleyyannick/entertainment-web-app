interface ContentErrorProps {
  onRetry?: () => void
}

export default function ContentError({ onRetry }: ContentErrorProps) {
  return (
    <div data-testid="content-error" className="flex flex-col items-center justify-center gap-3 py-24">
      <span className="text-red-400 text-sm">Une erreur est survenue lors du chargement.</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-white/60 hover:text-white underline underline-offset-2 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}

import iconSearch from "../../assets/images/icon-search.svg"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <search className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4">

      <label htmlFor="search-input" className="sr-only">
        Search
      </label>

      <img
        src={iconSearch}
        alt=""
        aria-hidden="true"
        className="w-5 h-5 shrink-0 opacity-40"
      />

      <input
        id="search-input"
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for movies or TV series"
        autoComplete="off"
        data-testid="search-input"
        className="bg-transparent text-white/80 placeholder:text-white/30
          text-base outline-none w-full
          [&::-webkit-search-cancel-button]:hidden"
      />

    </search>
  )
}
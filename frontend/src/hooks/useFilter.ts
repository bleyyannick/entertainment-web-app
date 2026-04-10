import { useState } from "react"
import type { Section } from "../types/media"
import { useDebounce } from "./useDebounce"

export type SortOrder = "desc" | "asc"

export function useFilter() {
  const [query, setQuery] = useState("")
  const [activeSection, setActiveSection] = useState<Section>("Home")
  const [year, setYear] = useState<number | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const debouncedQuery = useDebounce(query, 400)

  return { query, setQuery, debouncedQuery, activeSection, setActiveSection, year, setYear, sortOrder, setSortOrder }
}

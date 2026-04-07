import { useState } from "react"
import type { Section } from "../types/media"
import { useDebounce } from "./useDebounce"

export function useFilter() {
  const [query, setQuery] = useState("")
  const [activeSection, setActiveSection] = useState<Section>("Home")

  const debouncedQuery = useDebounce(query, 400)

  return { query, setQuery, debouncedQuery, activeSection, setActiveSection }
}

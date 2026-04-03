import { useState } from "react"
import type { Section } from "../types/media"

export function useFilter() {
  const [query, setQuery] = useState("")
  const [activeSection, setActiveSection] = useState<Section>("Home")


  return { query, setQuery, activeSection, setActiveSection }
}

import { useState } from "react"
import type { Section } from "../components/Navbar"

export function useFilter() {
  const [query, setQuery] = useState("")
  const [activeSection, setActiveSection] = useState<Section>("Home")


  return { query, setQuery, activeSection, setActiveSection }
}

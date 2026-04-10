import { useState } from "react"

export type SortOrder = "desc" | "asc"

export function useDateFilter() {
  const [year, setYear] = useState<number | undefined>(undefined)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const toggleOrder = () => setSortOrder(o => o === "desc" ? "asc" : "desc")
  const toggleYear = (year: number | undefined) => setYear(year)

  return { year, sortOrder, toggleOrder, toggleYear }
}

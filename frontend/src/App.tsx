
import './App.css'
import Navbar from './components/layout/Navbar'
import SearchBar from './components/ui/SearchBar'
import Content from './components/Content'
import { useFilter } from './hooks/useFilter'

export default function App() {
  const { query, setQuery, debouncedQuery, activeSection, setActiveSection, year, setYear, sortOrder, setSortOrder } = useFilter()

  return (
    <div className="bg-[#0d1117] min-h-screen">
    <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
    <div className="pt-16 lg:pt-0 lg:pl-[72px]">
      <SearchBar value={query} onChange={setQuery} />
      <Content query={debouncedQuery} activeSection={activeSection} year={year} onYearChange={setYear} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />
    </div>
  </div>
  )
}
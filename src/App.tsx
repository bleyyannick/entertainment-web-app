
import './App.css'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Content from './components/Content'
import { useFilter } from './hooks/useFilter'

export default function App() {
  const { query, setQuery, activeSection, setActiveSection } = useFilter()

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="pl-[72px]">
        <SearchBar value={query} onChange={setQuery} />
        <Content query={query} activeSection={activeSection} />
      </div>
    </div>
  )
}
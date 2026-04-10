interface YearSelectProps {
  value: number | undefined
  onChange: (year: number | undefined) => void
}

export default function YearSelect({ value, onChange}: YearSelectProps) {

 const currentYear = new Date().getFullYear()
 const years = Array.from({ length: 56 }, (_, i) => currentYear - i)
 
  return (
    <select
      value={value ?? ""}
      onChange={e => onChange(e.target.value ? Number(e.target.value) : undefined)}
      className="bg-[#161d2f] text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#fc4747] cursor-pointer"
      aria-label="Filtrer par année"
    >
      <option value="">Toutes les années</option>
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  )
}

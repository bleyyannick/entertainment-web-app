import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SortButton from '../../components/ui/SortButton'

describe('SortButton', () => {
  it("indique 'Plus récent' quand le tri est décroissant", () => {
    render(<SortButton sortOrder="desc" onToggle={vi.fn()} />)
    expect(screen.getByText(/plus récent/i)).toBeInTheDocument()
  })

  it("indique 'Plus ancien' quand le tri est croissant", () => {
    render(<SortButton sortOrder="asc" onToggle={vi.fn()} />)
    expect(screen.getByText(/plus ancien/i)).toBeInTheDocument()
  })
})

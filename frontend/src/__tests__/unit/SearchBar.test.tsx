import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SearchBar from '../../components/ui/SearchBar'

describe('SearchBar', () => {
  it("affiche la valeur saisie dans le champ", () => {
    render(<SearchBar value="inception" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveValue('inception')
  })

})

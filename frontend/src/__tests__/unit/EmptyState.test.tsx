import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import EmptyState from '../../components/ui/EmptyState'

describe('EmptyState', () => {
  it("invite à rechercher quand aucun terme n'est saisi", () => {
    render(<EmptyState />)
    expect(screen.getByText(/Recherchez un film ou une série/i)).toBeInTheDocument()
  })

  it("affiche le terme recherché quand aucun résultat n'est trouvé", () => {
    render(<EmptyState query="xyzqwerty" />)
    expect(screen.getByText(/aucun résultat pour « xyzqwerty »/i)).toBeInTheDocument()
  })
})

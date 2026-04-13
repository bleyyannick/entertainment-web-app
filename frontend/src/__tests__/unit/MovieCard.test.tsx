import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MovieCard from '../../components/media/MovieCard'

describe('MovieCard', () => {
  it("affiche le titre, l'année et la catégorie du média", () => {
    render(<MovieCard title="Inception" year={2010} type="Movie" poster="https://poster.jpg" />)

    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('2010')).toBeInTheDocument()
    expect(screen.getByText('Movie')).toBeInTheDocument()
  })

  it("affiche l'image avec l'alt correspondant au titre", () => {
    render(<MovieCard title="Breaking Bad" year={2008} type="TV Series" poster="https://bb.jpg" />)

    expect(screen.getByAltText('Breaking Bad')).toHaveAttribute('src', 'https://bb.jpg')
  })

})

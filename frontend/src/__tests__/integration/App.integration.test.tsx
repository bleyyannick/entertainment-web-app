import { screen, waitFor, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from '../../App'
import { renderWithProviders, makeQueryClient } from '../renderWithProviders'
import { createMedia } from '../factories/mediaFactory'
import * as mediaService from '../../services/mediaService'

vi.mock('../../services/mediaService')
const mockedFetchMedia = vi.mocked(mediaService.fetchMedia)

beforeEach(() => {
  mockedFetchMedia.mockReset()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// ─── Scénario 1 : accueil sans recherche ─────────────────────────────────────

describe("Page d'accueil", () => {
  it("affiche le titre 'Recommandés' et invite à saisir un terme de recherche", async () => {
    // Sur Home sans query, useMedia est disabled → pas d'appel réseau
    renderWithProviders(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('content-title')).toHaveTextContent('Recommandés')
    })
    expect(screen.getByText(/Recherchez un film ou une série/i)).toBeInTheDocument()
  })
})

// ─── Scénario 2 : recherche globale depuis l'accueil ─────────────────────────

describe("Recherche depuis l'accueil", () => {
  it("affiche les résultats après qu'un terme ait été saisi", async () => {
    const results = [
      createMedia({ id: 1, title: 'Inception', year: 2010, category: 'Movie' }),
      createMedia({ id: 2, title: 'Interstellar', year: 2014, category: 'Movie' }),
    ]
    mockedFetchMedia.mockResolvedValue(results)

    renderWithProviders(<App />)

    await userEvent.type(screen.getByRole('searchbox'), 'inter')
    act(() => { vi.advanceTimersByTime(500) })

    await waitFor(() => {
      expect(screen.getByTestId('content-title')).toHaveTextContent('Résultats pour « inter »')
    })
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2)
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  it("affiche l'état vide quand la recherche ne donne rien", async () => {
    mockedFetchMedia.mockResolvedValue([])

    renderWithProviders(<App />)

    await userEvent.type(screen.getByRole('searchbox'), 'xyzqwerty')
    act(() => { vi.advanceTimersByTime(500) })

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toHaveTextContent('xyzqwerty')
    })
  })

  it("affiche un message d'erreur si le chargement échoue", async () => {
    mockedFetchMedia.mockRejectedValue(new Error('Network error'))

    renderWithProviders(<App />, { queryClient: makeQueryClient() })

    await userEvent.type(screen.getByRole('searchbox'), 'batman')
    act(() => { vi.advanceTimersByTime(500) })

    await waitFor(() => {
      expect(screen.getByTestId('content-error')).toBeInTheDocument()
    })
  })
})

// ─── Scénario 3 : navigation entre sections ──────────────────────────────────

describe("Navigation entre sections", () => {
  it("bascule sur la section Films au clic sur le bouton correspondant", async () => {
    const films = [
      createMedia({ id: 10, title: 'The Dark Knight', year: 2008, category: 'Movie' }),
    ]
    mockedFetchMedia.mockResolvedValue(films)

    renderWithProviders(<App />)

    // Il y a deux NavButton "Movies" (mobile + desktop) — on cible le premier
    const moviesButtons = screen.getAllByRole('button', { name: 'Movies' })
    await userEvent.click(moviesButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('content-title')).toHaveTextContent('Films')
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument()
    })
  })

  it("bascule sur la section Séries au clic sur le bouton correspondant", async () => {
    const series = [
      createMedia({ id: 20, title: 'Breaking Bad', year: 2008, category: 'TV Series' }),
    ]
    mockedFetchMedia.mockResolvedValue(series)

    renderWithProviders(<App />)

    // Il y a deux NavButton "TV Series" (mobile + desktop) — on cible le premier
    const tvSeriesButtons = screen.getAllByRole('button', { name: 'TV Series' })
    await userEvent.click(tvSeriesButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('content-title')).toHaveTextContent('Séries')
      expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
    })
  })

})

// ─── Scénario 4 : tri et filtre par année ────────────────────────────────────

describe("Tri et filtres de la liste de résultats", () => {
  it("trie les résultats du plus récent au plus ancien par défaut", async () => {
    mockedFetchMedia.mockResolvedValue([
      createMedia({ id: 1, title: 'Film 2000', year: 2000 }),
      createMedia({ id: 2, title: 'Film 2020', year: 2020 }),
      createMedia({ id: 3, title: 'Film 2010', year: 2010 }),
    ])

    renderWithProviders(<App />)
    const seriesButtons = screen.getAllByRole('button', { name: 'Movies' })
    await userEvent.click(seriesButtons[0])

    await waitFor(() => {
      expect(screen.getAllByTestId('movie-card')).toHaveLength(3)
    })

    const cards = screen.getAllByTestId('movie-card')
    expect(within(cards[0]).getByText('2020')).toBeInTheDocument()
    expect(within(cards[1]).getByText('2010')).toBeInTheDocument()
    expect(within(cards[2]).getByText('2000')).toBeInTheDocument()
  })

  it("inverse l'ordre au clic sur le bouton de tri", async () => {
    mockedFetchMedia.mockResolvedValue([
      createMedia({ id: 1, title: 'Film 2000', year: 2000 }),
      createMedia({ id: 2, title: 'Film 2020', year: 2020 }),
    ])

    renderWithProviders(<App />)
    const moviesButtons = screen.getAllByRole('button', { name: 'Movies' })
    await userEvent.click(moviesButtons[0])

    await waitFor(() => expect(screen.getAllByTestId('movie-card')).toHaveLength(2))

    const sortButton = screen.getByRole('button', { name: /trier du plus ancien/i })
    await userEvent.click(sortButton)

    const cards = screen.getAllByTestId('movie-card')
    expect(within(cards[0]).getByText('2000')).toBeInTheDocument()
    expect(within(cards[1]).getByText('2020')).toBeInTheDocument()
  })

  it("affiche les résultats correspondant à l'année sélectionnée", async () => {
    mockedFetchMedia.mockResolvedValue([
      createMedia({ id: 1, title: 'Inception', year: 2010 }),
    ])

    renderWithProviders(<App />)
    const moviesButtons = screen.getAllByRole('button', { name: 'Movies' })
    await userEvent.click(moviesButtons[0])

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /filtrer par année/i }), '2010')

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument()
    })
  })
})

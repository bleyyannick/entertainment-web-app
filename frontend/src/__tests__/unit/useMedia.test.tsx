import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMedia } from '../../hooks/useMedia'
import { makeQueryClient } from '../renderWithProviders'
import { createMedia } from '../factories/mediaFactory'
import * as mediaService from '../../services/mediaService'

vi.mock('../../services/mediaService')
const mockedFetchMedia = vi.mocked(mediaService.fetchMedia)

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

beforeEach(() => {
  mockedFetchMedia.mockReset()
})

describe('useMedia — activation de la requête', () => {
  it("ne déclenche aucune requête sur Home sans terme de recherche", async () => {
    renderHook(() => useMedia('Home', ''), { wrapper })

    // On laisse une microtask s'écouler pour s'assurer qu'aucun appel n'a eu lieu
    await new Promise((r) => setTimeout(r, 0))

    expect(mockedFetchMedia).not.toHaveBeenCalled()
  })

  it("déclenche une requête sur Home quand un terme est saisi", async () => {
    mockedFetchMedia.mockResolvedValue([])
    renderHook(() => useMedia('Home', 'batman'), { wrapper })

    await waitFor(() => expect(mockedFetchMedia).toHaveBeenCalledOnce())
    expect(mockedFetchMedia).toHaveBeenCalledWith('Home', 'batman', undefined)
  })

  it("déclenche une requête sur Movies même sans terme de recherche", async () => {
    mockedFetchMedia.mockResolvedValue([])
    renderHook(() => useMedia('Movies', ''), { wrapper })

    await waitFor(() => expect(mockedFetchMedia).toHaveBeenCalledOnce())
    expect(mockedFetchMedia).toHaveBeenCalledWith('Movies', '', undefined)
  })

  it("transmet l'année au service quand elle est précisée", async () => {
    mockedFetchMedia.mockResolvedValue([])
    renderHook(() => useMedia('Movies', 'batman', 2008), { wrapper })

    await waitFor(() => expect(mockedFetchMedia).toHaveBeenCalledOnce())
    expect(mockedFetchMedia).toHaveBeenCalledWith('Movies', 'batman', 2008)
  })
})

describe('useMedia — états de la requête', () => {
  it("expose les données retournées par le service", async () => {
    const media = [createMedia({ id: 1, title: 'Inception' })]
    mockedFetchMedia.mockResolvedValue(media)

    const { result } = renderHook(() => useMedia('Movies', 'inception'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(media)
  })

  it("passe en état d'erreur quand le service échoue", async () => {
    mockedFetchMedia.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useMedia('TV Series', 'breaking'), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })

})

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFilter } from '../../hooks/useFilter'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useFilter', () => {
  it("démarre avec une query vide et la section Home active", () => {
    const { result } = renderHook(() => useFilter())
    expect(result.current.query).toBe('')
    expect(result.current.debouncedQuery).toBe('')
    expect(result.current.activeSection).toBe('Home')
  })

  it("met à jour query immédiatement mais retarde debouncedQuery", () => {
    const { result } = renderHook(() => useFilter())

    act(() => { result.current.setQuery('batman') })

    expect(result.current.query).toBe('batman')
    expect(result.current.debouncedQuery).toBe('')
  })

  it("propage debouncedQuery après le délai de 400 ms", () => {
    const { result } = renderHook(() => useFilter())

    act(() => { result.current.setQuery('batman') })
    act(() => { vi.advanceTimersByTime(400) })

    expect(result.current.debouncedQuery).toBe('batman')
  })

})

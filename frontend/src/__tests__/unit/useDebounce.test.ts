import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from '../../hooks/useDebounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it("retourne la valeur initiale immédiatement", () => {
    const { result } = renderHook(() => useDebounce('initial', 400))
    expect(result.current).toBe('initial')
  })

  it("ne met pas à jour la valeur avant l'expiration du délai", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'updated' })
    act(() => { vi.advanceTimersByTime(300) })

    expect(result.current).toBe('initial')
  })

  it("met à jour la valeur après l'expiration du délai", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'updated' })
    act(() => { vi.advanceTimersByTime(400) })

    expect(result.current).toBe('updated')
  })

  it("réinitialise le délai si la valeur change avant expiration", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => { vi.advanceTimersByTime(300) })
    rerender({ value: 'c' })
    act(() => { vi.advanceTimersByTime(300) })

    // 300ms après le dernier changement → toujours pas mis à jour
    expect(result.current).toBe('a')

    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe('c')
  })
})

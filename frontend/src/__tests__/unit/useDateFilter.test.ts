import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDateFilter } from '../../hooks/useDateFilter'

describe('useDateFilter', () => {
  it("démarre avec un tri décroissant et aucune année sélectionnée", () => {
    const { result } = renderHook(() => useDateFilter())
    expect(result.current.sortOrder).toBe('desc')
    expect(result.current.year).toBeUndefined()
  })

  it("bascule l'ordre à chaque appel", () => {
    const { result } = renderHook(() => useDateFilter())

    act(() => { result.current.toggleOrder() })
    expect(result.current.sortOrder).toBe('asc')

    act(() => { result.current.toggleOrder() })
    expect(result.current.sortOrder).toBe('desc')
  })

  it("définit l'année sélectionnée", () => {
    const { result } = renderHook(() => useDateFilter())

    act(() => { result.current.toggleYear(2010) })

    expect(result.current.year).toBe(2010)
  })

  it("efface l'année quand undefined est passé", () => {
    const { result } = renderHook(() => useDateFilter())

    act(() => { result.current.toggleYear(2010) })
    act(() => { result.current.toggleYear(undefined) })

    expect(result.current.year).toBeUndefined()
  })
})

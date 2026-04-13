import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import YearSelect from '../../components/ui/YearSelect'

describe('YearSelect', () => {
  it("affiche 'Toutes les années' quand aucune année n'est sélectionnée", () => {
    render(<YearSelect value={undefined} onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toHaveValue('')
  })

  it("affiche l'année sélectionnée", () => {
    render(<YearSelect value={2010} onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toHaveValue('2010')
  })

  it("appelle onChange avec l'année choisie", async () => {
    const onChange = vi.fn()
    render(<YearSelect value={undefined} onChange={onChange} />)

    await userEvent.selectOptions(screen.getByRole('combobox'), '2010')

    expect(onChange).toHaveBeenCalledWith(2010)
  })

  it("appelle onChange avec undefined quand 'Toutes les années' est sélectionné", async () => {
    const onChange = vi.fn()
    render(<YearSelect value={2010} onChange={onChange} />)

    await userEvent.selectOptions(screen.getByRole('combobox'), '')

    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Grid } from 'lucide-react'
import NavButton from '../../components/layout/NavButton'

describe('NavButton', () => {
  it("appelle onSelect avec la bonne section au clic", async () => {
    const onSelect = vi.fn()
    render(<NavButton label="TV Series" icon={Grid} isActive={false} variant="header" onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: 'TV Series' }))

    expect(onSelect).toHaveBeenCalledWith('TV Series')
  })
})

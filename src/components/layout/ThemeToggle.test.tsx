import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
  document.documentElement.classList.remove('dark')
})

describe('ThemeToggle', () => {
  it('cambia al tema oscuro y aplica la clase', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /tema oscuro/i }))

    expect(useTaskStore.getState().user.settings.theme).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('marca la opción activa', () => {
    useTaskStore.getState().updateSettings({ theme: 'light' })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /tema claro/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { SettingsPanel } from './SettingsPanel'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('SettingsPanel', () => {
  it('activa y desactiva el sonido', async () => {
    const user = userEvent.setup()
    render(<SettingsPanel />)

    await user.click(screen.getByLabelText(/sonido/i))
    expect(useTaskStore.getState().user.settings.soundEnabled).toBe(true)

    await user.click(screen.getByLabelText(/sonido/i))
    expect(useTaskStore.getState().user.settings.soundEnabled).toBe(false)
  })

  it('deshabilita notificaciones si la API no está disponible', () => {
    render(<SettingsPanel />)
    expect(screen.getByLabelText(/notificaciones/i)).toBeDisabled()
  })
})

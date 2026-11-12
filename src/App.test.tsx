import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('App', () => {
  it('muestra TaskFlow y la lista por defecto', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /taskflow/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /mis tareas/i })).toBeInTheDocument()
  })

  it('crea una tarea desde el formulario', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /nueva tarea/i }))
    await user.type(screen.getByLabelText(/título/i), 'Comprar pan')
    await user.click(screen.getByRole('button', { name: /añadir tarea/i }))
    expect(screen.getByText('Comprar pan')).toBeInTheDocument()
  })
})

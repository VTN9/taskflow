import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza el título de la aplicación', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /taskflow/i })).toBeInTheDocument()
  })

  it('muestra el estado base del proyecto', () => {
    render(<App />)
    expect(screen.getByText(/base del proyecto lista/i)).toBeInTheDocument()
  })
})

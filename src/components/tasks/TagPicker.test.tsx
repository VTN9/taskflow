import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { TagPicker } from './TagPicker'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('TagPicker', () => {
  it('crea una etiqueta y la selecciona', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TagPicker value={[]} onChange={onChange} />)

    await user.type(screen.getByLabelText(/nueva etiqueta/i), 'react')
    await user.click(screen.getByRole('button', { name: /añadir/i }))

    const [tag] = useTaskStore.getState().tags
    expect(tag.name).toBe('react')
    expect(onChange).toHaveBeenCalledWith([tag.id])
  })

  it('alterna una etiqueta existente', async () => {
    const user = userEvent.setup()
    const tagId = useTaskStore.getState().addTag('react', '#61DAFB')
    const onChange = vi.fn()
    render(<TagPicker value={[]} onChange={onChange} />)

    await user.click(screen.getByRole('checkbox', { name: /react/i }))
    expect(onChange).toHaveBeenCalledWith([tagId])
  })
})

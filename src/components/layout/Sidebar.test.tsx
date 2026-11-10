import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { Sidebar } from './Sidebar'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('Sidebar', () => {
  it('muestra las listas y la papelera', () => {
    render(
      <Sidebar
        lists={useTaskStore.getState().lists}
        tasks={[]}
        activeListId="list-default"
        view="tasks"
        onSelectList={vi.fn()}
        onShowTrash={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /mis tareas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /papelera/i })).toBeInTheDocument()
  })

  it('crea una lista nueva', async () => {
    const user = userEvent.setup()
    const onSelectList = vi.fn()
    render(
      <Sidebar
        lists={useTaskStore.getState().lists}
        tasks={[]}
        activeListId="list-default"
        view="tasks"
        onSelectList={onSelectList}
        onShowTrash={vi.fn()}
      />,
    )
    await user.type(screen.getByLabelText(/nombre de la nueva lista/i), 'Trabajo')
    await user.click(screen.getByRole('button', { name: /añadir lista/i }))
    expect(useTaskStore.getState().lists.some((list) => list.name === 'Trabajo')).toBe(true)
    expect(onSelectList).toHaveBeenCalled()
  })
})

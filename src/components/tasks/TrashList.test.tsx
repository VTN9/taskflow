import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { TrashList } from './TrashList'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('TrashList', () => {
  it('muestra la papelera vacía', () => {
    render(<TrashList />)
    expect(screen.getByText(/la papelera está vacía/i)).toBeInTheDocument()
  })

  it('restaura y elimina tareas', async () => {
    const user = userEvent.setup()
    const listId = useTaskStore.getState().lists[0].id
    const first = useTaskStore.getState().addTask(listId, { title: 'Restaurar' })!
    const second = useTaskStore.getState().addTask(listId, { title: 'Eliminar' })!
    useTaskStore.getState().setTaskStatus(first, 'trashed')
    useTaskStore.getState().setTaskStatus(second, 'trashed')

    render(<TrashList />)
    await user.click(screen.getAllByRole('button', { name: /restaurar/i })[0])
    expect(useTaskStore.getState().tasks.find((task) => task.id === first)?.status).toBe('todo')

    await user.click(screen.getByRole('button', { name: /^eliminar$/i }))
    expect(useTaskStore.getState().tasks.find((task) => task.id === second)).toBeUndefined()
  })
})

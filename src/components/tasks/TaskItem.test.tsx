import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'
import { TaskItem } from './TaskItem'

const task: Task = {
  id: 'task-1',
  listId: 'list-default',
  title: 'Comprar pan',
  description: 'Integral',
  status: 'todo',
  priority: 'high',
  category: 'Casa',
  tags: [],
  order: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState({ ...createInitialState(), tasks: [task] })
})

describe('TaskItem', () => {
  it('marca la tarea como completada', async () => {
    const user = userEvent.setup()
    render(
      <ul>
        <TaskItem task={task} />
      </ul>,
    )
    await user.click(screen.getByRole('checkbox', { name: /completar comprar pan/i }))
    expect(useTaskStore.getState().tasks[0].status).toBe('completed')
  })

  it('envía la tarea a la papelera', async () => {
    const user = userEvent.setup()
    render(
      <ul>
        <TaskItem task={task} />
      </ul>,
    )
    await user.click(screen.getByRole('button', { name: /eliminar comprar pan/i }))
    expect(useTaskStore.getState().tasks[0].status).toBe('trashed')
  })

  it('abre el formulario de edición', async () => {
    const user = userEvent.setup()
    render(
      <ul>
        <TaskItem task={task} />
      </ul>,
    )
    await user.click(screen.getByRole('button', { name: /editar comprar pan/i }))
    expect(screen.getByRole('form', { name: /editar tarea/i })).toBeInTheDocument()
  })
})

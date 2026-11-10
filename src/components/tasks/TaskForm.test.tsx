import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { TaskForm } from './TaskForm'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('TaskForm', () => {
  it('muestra un error si el título está vacío', async () => {
    const user = userEvent.setup()
    render(<TaskForm listId="list-default" onDone={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /añadir tarea/i }))
    expect(screen.getByText(/el título es obligatorio/i)).toBeInTheDocument()
    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('crea una tarea con prioridad y categoría', async () => {
    const user = userEvent.setup()
    const onDone = vi.fn()
    render(<TaskForm listId="list-default" onDone={onDone} />)

    await user.type(screen.getByLabelText(/título/i), 'Revisar PR')
    await user.selectOptions(screen.getByLabelText(/prioridad/i), 'high')
    await user.type(screen.getByLabelText(/categoría/i), 'Desarrollo')
    await user.click(screen.getByRole('button', { name: /añadir tarea/i }))

    const [task] = useTaskStore.getState().tasks
    expect(task).toMatchObject({ title: 'Revisar PR', priority: 'high', category: 'Desarrollo' })
    expect(onDone).toHaveBeenCalled()
  })

  it('edita una tarea existente', async () => {
    const user = userEvent.setup()
    const listId = useTaskStore.getState().lists[0].id
    const id = useTaskStore.getState().addTask(listId, { title: 'Original' })!
    const task = useTaskStore.getState().tasks.find((item) => item.id === id)!

    render(<TaskForm listId={listId} task={task} onDone={vi.fn()} />)
    const input = screen.getByLabelText(/título/i)
    await user.clear(input)
    await user.type(input, 'Editada')
    await user.click(screen.getByRole('button', { name: /guardar/i }))

    expect(useTaskStore.getState().tasks.find((item) => item.id === id)?.title).toBe('Editada')
  })
})

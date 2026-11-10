import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Task } from '@/types'
import { SortableTaskItem } from './SortableTaskItem'

const task: Task = {
  id: 'task-1',
  listId: 'list-default',
  title: 'Comprar pan',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: '',
  tags: [],
  order: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('SortableTaskItem', () => {
  it('expone un asa de reordenación accesible', () => {
    render(
      <ul>
        <SortableTaskItem task={task} />
      </ul>,
    )
    expect(screen.getByRole('button', { name: /reordenar comprar pan/i })).toBeInTheDocument()
  })
})

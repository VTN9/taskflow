import { describe, expect, it } from 'vitest'
import type { Task } from '@/types'
import {
  selectByStatus,
  selectCompletedCount,
  selectPendingCount,
  selectTasksByList,
  selectTrashed,
} from './selectors'

const task = (overrides: Partial<Task>): Task => ({
  id: 't',
  listId: 'l1',
  title: 'Tarea',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: '',
  tags: [],
  order: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

const tasks: Task[] = [
  task({ id: 'a', order: 2, status: 'todo' }),
  task({ id: 'b', order: 1, status: 'completed' }),
  task({ id: 'c', order: 3, status: 'trashed' }),
  task({ id: 'd', listId: 'l2', order: 1, status: 'in-progress' }),
]

describe('selectores', () => {
  it('filtra por lista y excluye la papelera por defecto', () => {
    expect(selectTasksByList(tasks, 'l1').map((item) => item.id)).toEqual(['b', 'a'])
  })

  it('incluye la papelera cuando se pide', () => {
    expect(selectTasksByList(tasks, 'l1', true)).toHaveLength(3)
  })

  it('ordena por order', () => {
    expect(selectTasksByList(tasks, 'l1').map((item) => item.order)).toEqual([1, 2])
  })

  it('filtra por estado', () => {
    expect(selectByStatus(tasks, 'completed').map((item) => item.id)).toEqual(['b'])
    expect(selectTrashed(tasks).map((item) => item.id)).toEqual(['c'])
  })

  it('cuenta completadas y pendientes', () => {
    expect(selectCompletedCount(tasks, 'l1')).toBe(1)
    expect(selectPendingCount(tasks, 'l1')).toBe(1)
  })
})

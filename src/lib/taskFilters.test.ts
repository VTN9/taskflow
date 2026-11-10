import { describe, expect, it } from 'vitest'
import { defaultTaskFilters, filterTasks } from './taskFilters'
import type { Task } from '@/types'

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
  task({ id: 'a', title: 'Diseñar UI', priority: 'high', tags: ['tag-1'], order: 2 }),
  task({ id: 'b', title: 'Comprar pan', status: 'completed', order: 1, dueDate: '2026-01-10' }),
  task({ id: 'c', title: 'Revisar PR', status: 'in-progress', order: 3, dueDate: '2026-01-05' }),
  task({ id: 'd', title: 'Oculta', status: 'trashed', order: 4 }),
]

describe('filterTasks', () => {
  it('excluye la papelera por defecto', () => {
    expect(filterTasks(tasks, defaultTaskFilters).map((item) => item.id)).toEqual(['b', 'a', 'c'])
  })

  it('filtra por estado', () => {
    expect(
      filterTasks(tasks, { ...defaultTaskFilters, status: 'completed' }).map((item) => item.id),
    ).toEqual(['b'])
  })

  it('filtra por prioridad y etiqueta', () => {
    expect(
      filterTasks(tasks, { ...defaultTaskFilters, priority: 'high' }).map((item) => item.id),
    ).toEqual(['a'])
    expect(
      filterTasks(tasks, { ...defaultTaskFilters, tagId: 'tag-1' }).map((item) => item.id),
    ).toEqual(['a'])
  })

  it('busca por texto en título, descripción y categoría', () => {
    expect(
      filterTasks(tasks, { ...defaultTaskFilters, query: 'revisar' }).map((item) => item.id),
    ).toEqual(['c'])
  })

  it('ordena por fecha límite dejando sin fecha al final', () => {
    expect(
      filterTasks(tasks, { ...defaultTaskFilters, sort: 'dueDate' }).map((item) => item.id),
    ).toEqual(['c', 'b', 'a'])
  })
})

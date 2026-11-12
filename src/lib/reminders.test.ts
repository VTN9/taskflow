import { describe, expect, it } from 'vitest'
import { collectUpcomingReminders } from './reminders'
import type { Task } from '@/types'

const base = Date.parse('2026-01-01T10:00:00.000Z')

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

describe('collectUpcomingReminders', () => {
  it('recoge recordatorios dentro del horizonte', () => {
    const tasks = [
      task({ id: 'a', reminder: '2026-01-01T10:30:00.000Z' }),
      task({ id: 'b', reminder: '2026-01-01T12:00:00.000Z' }),
    ]
    const result = collectUpcomingReminders(tasks, base, 60 * 60 * 1000)
    expect(result.map((entry) => entry.task.id)).toEqual(['a'])
  })

  it('ignora tareas completadas, en papelera o sin recordatorio', () => {
    const tasks = [
      task({ id: 'a', reminder: '2026-01-01T10:30:00.000Z', status: 'completed' }),
      task({ id: 'b', reminder: '2026-01-01T10:30:00.000Z', status: 'trashed' }),
      task({ id: 'c' }),
    ]
    expect(collectUpcomingReminders(tasks, base, 60 * 60 * 1000)).toHaveLength(0)
  })

  it('ordena por hora', () => {
    const tasks = [
      task({ id: 'b', reminder: '2026-01-01T11:00:00.000Z' }),
      task({ id: 'a', reminder: '2026-01-01T10:15:00.000Z' }),
    ]
    const result = collectUpcomingReminders(tasks, base, 2 * 60 * 60 * 1000)
    expect(result.map((entry) => entry.task.id)).toEqual(['a', 'b'])
  })
})

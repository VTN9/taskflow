import type { Task, TaskStatus } from '@/types'

export const byOrder = (a: Task, b: Task) => a.order - b.order

export function selectTasksByList(tasks: Task[], listId: string, includeTrashed = false): Task[] {
  return tasks
    .filter((task) => task.listId === listId && (includeTrashed || task.status !== 'trashed'))
    .sort(byOrder)
}

export function selectByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status).sort(byOrder)
}

export function selectTrashed(tasks: Task[]): Task[] {
  return selectByStatus(tasks, 'trashed')
}

export function selectCompletedCount(tasks: Task[], listId: string): number {
  return tasks.filter((task) => task.listId === listId && task.status === 'completed').length
}

export function selectPendingCount(tasks: Task[], listId: string): number {
  return tasks.filter(
    (task) => task.listId === listId && task.status !== 'completed' && task.status !== 'trashed',
  ).length
}

export function selectTaskById(tasks: Task[], id: string): Task | undefined {
  return tasks.find((task) => task.id === id)
}

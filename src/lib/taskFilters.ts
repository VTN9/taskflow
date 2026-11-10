import type { Task, TaskPriority, TaskStatus } from '@/types'

export type StatusFilter = TaskStatus | 'all'
export type PriorityFilter = TaskPriority | 'all'
export type SortOption = 'order' | 'dueDate'

export interface TaskFilters {
  query: string
  status: StatusFilter
  priority: PriorityFilter
  tagId: string | 'all'
  sort: SortOption
}

export const defaultTaskFilters: TaskFilters = {
  query: '',
  status: 'all',
  priority: 'all',
  tagId: 'all',
  sort: 'order',
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.query.trim().toLowerCase()

  return tasks
    .filter((task) => {
      if (task.status === 'trashed') return false
      if (filters.status !== 'all' && task.status !== filters.status) return false
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      if (filters.tagId !== 'all' && !task.tags.includes(filters.tagId)) return false
      if (query) {
        const haystack = `${task.title} ${task.description} ${task.category}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (filters.sort === 'dueDate') {
        const dateA = a.dueDate ?? '9999-12-31'
        const dateB = b.dueDate ?? '9999-12-31'
        if (dateA !== dateB) return dateA < dateB ? -1 : 1
      }
      return a.order - b.order
    })
}

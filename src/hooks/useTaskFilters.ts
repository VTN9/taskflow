import { useMemo, useState } from 'react'
import { defaultTaskFilters, filterTasks, type TaskFilters } from '@/lib/taskFilters'
import { selectTasksByList } from '@/store/selectors'
import type { Task } from '@/types'

export function useTaskFilters(tasks: Task[], listId: string) {
  const [filters, setFilters] = useState<TaskFilters>(defaultTaskFilters)

  const filtered = useMemo(
    () => filterTasks(selectTasksByList(tasks, listId), filters),
    [tasks, listId, filters],
  )

  return { filters, setFilters, filtered }
}

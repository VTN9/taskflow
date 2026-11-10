import { priorityLabels } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { TaskPriority } from '@/types'

const styles: Record<TaskPriority, string> = {
  low: 'border-sky-300 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  medium: 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  high: 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  urgent: 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        styles[priority],
      )}
    >
      {priorityLabels[priority]}
    </span>
  )
}

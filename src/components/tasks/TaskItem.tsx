import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'
import { PriorityBadge } from './PriorityBadge'
import { TaskForm } from './TaskForm'

export function TaskItem({ task }: { task: Task }) {
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus)
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <li>
        <TaskForm listId={task.listId} task={task} onDone={() => setEditing(false)} />
      </li>
    )
  }

  const completed = task.status === 'completed'

  return (
    <li className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <input
        type="checkbox"
        className="mt-1 size-4 accent-primary"
        checked={completed}
        aria-label={completed ? `Reabrir ${task.title}` : `Completar ${task.title}`}
        onChange={() => setTaskStatus(task.id, completed ? 'todo' : 'completed')}
      />

      <div className="min-w-0 flex-1">
        <p className={cn('font-medium', completed && 'text-muted-foreground line-through')}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <PriorityBadge priority={task.priority} />
          {task.category && <span>{task.category}</span>}
          {task.dueDate && <span>Vence: {task.dueDate}</span>}
        </div>
      </div>

      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Editar ${task.title}`}
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Eliminar ${task.title}`}
          onClick={() => setTaskStatus(task.id, 'trashed')}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  )
}

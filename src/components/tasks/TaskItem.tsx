import { Pencil, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { formatDate, isOverdue } from '@/lib/date'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/taskStore'
import type { Task } from '@/types'
import { PriorityBadge } from './PriorityBadge'
import { TaskForm } from './TaskForm'

interface TaskItemProps {
  task: Task
  dragHandle?: ReactNode
}

export function TaskItem({ task, dragHandle }: TaskItemProps) {
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus)
  const tags = useTaskStore((state) => state.tags)
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div>
        <TaskForm listId={task.listId} task={task} onDone={() => setEditing(false)} />
      </div>
    )
  }

  const completed = task.status === 'completed'
  const overdue = !completed && isOverdue(task.dueDate)
  const taskTags = tags.filter((tag) => task.tags.includes(tag.id))

  const toggleCompleted = () => {
    setTaskStatus(task.id, completed ? 'todo' : 'completed')
    toast.success(completed ? 'Tarea reabierta' : 'Tarea completada')
  }

  const sendToTrash = () => {
    setTaskStatus(task.id, 'trashed')
    toast('Tarea enviada a la papelera')
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border bg-card p-3 transition-shadow hover:shadow-sm">
      {dragHandle}

      <input
        type="checkbox"
        className="mt-1 size-4 accent-primary"
        checked={completed}
        aria-label={completed ? `Reabrir ${task.title}` : `Completar ${task.title}`}
        onChange={toggleCompleted}
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
          {task.dueDate && (
            <span className={cn(overdue && 'font-medium text-destructive')}>
              Vence: {formatDate(task.dueDate)}
            </span>
          )}
          {taskTags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full border px-2 py-0.5"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
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
          onClick={sendToTrash}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

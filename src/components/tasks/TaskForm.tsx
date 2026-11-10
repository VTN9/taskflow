import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { priorityLabels } from '@/lib/labels'
import { useTaskStore } from '@/store/taskStore'
import { TASK_PRIORITIES, type Task, type TaskPriority } from '@/types'
import { newTaskInputSchema } from '@/types/schemas'

interface TaskFormProps {
  listId: string
  task?: Task
  onDone: () => void
}

export function TaskForm({ listId, task, onDone }: TaskFormProps) {
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [category, setCategory] = useState(task?.category ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = newTaskInputSchema.safeParse({
      title,
      description,
      priority,
      category,
      dueDate: dueDate || undefined,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Datos inválidos')
      return
    }
    if (task) {
      updateTask(task.id, {
        title: parsed.data.title,
        description: parsed.data.description ?? '',
        priority,
        category: parsed.data.category ?? '',
        dueDate: parsed.data.dueDate,
      })
    } else {
      addTask(listId, parsed.data)
    }
    onDone()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border bg-card p-4"
      aria-label={task ? 'Editar tarea' : 'Nueva tarea'}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="task-title" className="text-sm font-medium">
          Título
        </label>
        <Input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="¿Qué hay que hacer?"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-description" className="text-sm font-medium">
          Descripción
        </label>
        <Textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Detalles opcionales"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="task-priority" className="text-sm font-medium">
            Prioridad
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="h-9 rounded-md border bg-transparent px-3 text-sm"
          >
            {TASK_PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {priorityLabels[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="task-category" className="text-sm font-medium">
            Categoría
          </label>
          <Input
            id="task-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Desarrollo"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="task-due-date" className="text-sm font-medium">
            Fecha límite
          </label>
          <Input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit">{task ? 'Guardar' : 'Añadir tarea'}</Button>
      </div>
    </form>
  )
}

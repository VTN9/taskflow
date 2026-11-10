import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/store/taskStore'
import { selectTasksByList } from '@/store/selectors'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'

export function TaskBoard({ listId }: { listId: string }) {
  const list = useTaskStore((state) => state.lists.find((item) => item.id === listId))
  const tasks = useTaskStore((state) => state.tasks)
  const [showForm, setShowForm] = useState(false)

  if (!list) {
    return <p className="text-sm text-muted-foreground">Selecciona una lista para empezar.</p>
  }

  const items = selectTasksByList(tasks, listId)

  return (
    <section aria-labelledby="list-title" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="list-title" className="text-2xl font-semibold">
            {list.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? 'tarea' : 'tareas'}
          </p>
        </div>
        <Button type="button" onClick={() => setShowForm((value) => !value)}>
          <Plus className="size-4" aria-hidden="true" />
          Nueva tarea
        </Button>
      </div>

      {showForm && <TaskForm listId={listId} onDone={() => setShowForm(false)} />}

      <TaskList tasks={items} />
    </section>
  )
}

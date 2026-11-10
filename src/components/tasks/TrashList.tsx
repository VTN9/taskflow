import { RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/store/taskStore'
import { selectTrashed } from '@/store/selectors'

export function TrashList() {
  const tasks = useTaskStore((state) => state.tasks)
  const restoreTask = useTaskStore((state) => state.restoreTask)
  const purgeTask = useTaskStore((state) => state.purgeTask)
  const trashed = selectTrashed(tasks)

  return (
    <section aria-labelledby="trash-title" className="flex flex-col gap-4">
      <div>
        <h2 id="trash-title" className="text-2xl font-semibold">
          Papelera
        </h2>
        <p className="text-sm text-muted-foreground">
          Restaura o elimina definitivamente las tareas.
        </p>
      </div>

      {trashed.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          La papelera está vacía.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {trashed.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3"
            >
              <span className="truncate text-sm">{task.title}</span>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    restoreTask(task.id)
                    toast.success('Tarea restaurada')
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Restaurar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    purgeTask(task.id)
                    toast.success('Tarea eliminada')
                  }}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

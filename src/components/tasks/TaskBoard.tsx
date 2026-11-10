import { Plus, Share2 } from 'lucide-react'
import { useState } from 'react'
import { ShareDialog } from '@/components/share/ShareDialog'
import { Button } from '@/components/ui/button'
import { useTaskFilters } from '@/hooks/useTaskFilters'
import { useTaskStore } from '@/store/taskStore'
import { selectTasksByList } from '@/store/selectors'
import { SortableTaskList } from './SortableTaskList'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'

export function TaskBoard({ listId }: { listId: string }) {
  const list = useTaskStore((state) => state.lists.find((item) => item.id === listId))
  const tasks = useTaskStore((state) => state.tasks)
  const tags = useTaskStore((state) => state.tags)
  const [showForm, setShowForm] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const { filters, setFilters, filtered } = useTaskFilters(tasks, listId)

  if (!list) {
    return <p className="text-sm text-muted-foreground">Selecciona una lista para empezar.</p>
  }

  const total = selectTasksByList(tasks, listId).length

  return (
    <section aria-labelledby="list-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="list-title" className="text-2xl font-semibold">
            {list.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} de {total} {total === 1 ? 'tarea' : 'tareas'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => setShowShare(true)}>
            <Share2 className="size-4" aria-hidden="true" />
            Compartir
          </Button>
          <Button type="button" onClick={() => setShowForm((value) => !value)}>
            <Plus className="size-4" aria-hidden="true" />
            Nueva tarea
          </Button>
        </div>
      </div>

      {showForm && <TaskForm listId={listId} onDone={() => setShowForm(false)} />}

      <TaskFilters filters={filters} onChange={setFilters} tags={tags} />

      <SortableTaskList tasks={filtered} listId={listId} />

      {showShare && <ShareDialog list={list} onClose={() => setShowShare(false)} />}
    </section>
  )
}
